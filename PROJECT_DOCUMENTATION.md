# Documentación Detallada del Proyecto: Access Control PWA

## 1. Visión General del Sistema
El proyecto **Access Control PWA** es una aplicación orientada a la gestión y control de accesos para barrios privados. Se trata de una PWA (Progressive Web App) construida sobre **Next.js** (basada en App Router y SSR/CSR), estilada nativamente con **Tailwind CSS**, y utilizando **TypeScript** para un fuerte tipado e integridad de datos. El objetivo principal de la aplicación es proveer interfaces dedicadas a diferentes roles dentro del ecosistema de un barrio privado:
- **Administrador (Admin)**
- **Propietario / Inquilino (Owner / Tenant)**
- **Guardia de Seguridad (Guard)**

## 2. Pila Tecnológica
- **Framework Core**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript (Strict Mode)
- **Estilos**: Tailwind CSS, PostCSS, configurado con esquemas híbridos.
- **Iconografía**: `lucide-react`
- **Componentes Externos**: `@yudiel/react-qr-scanner` para integración de cámara en el lado cliente (acceso de guardias).
- **Herramientas de Quality Assurance (QA)**: ESLint puro, tipado rígido (interfaces explícitas), `clsx` y `tailwind-merge` para gestión de clases.
- **Gestión de Datos Actual**: Capa de simulación (Mock Service) robusta que imita el comportamiento asíncrono y en memoria (a fines demostrativos/prototipo).

---

## 3. Arquitectura y Estructura de Carpetas

La aplicación está modularizada para facilitar el mantenimiento y escalabilidad.

### `src/app/` (Enrutamiento Principal)
- `/`: Landing page de bienvenida con accesos directos al panel de **Selección de Roles**.
- `/dashboard/demo`: La ruta estelar del prototipo. Contiene el componente `DemoContent` que envuelve un `RoleSwitcher` y alterna dinámicamente (`dynamic(...)` importations form Next.js paramitigando el CSR) entre los dashboards de Admin, Guard, Owner y Tenant.
- `/dashboard/admin`: Enrutamiento específico a la versión standalone del administrador (v2).
- `/login`: Pantalla conceptual de autenticación.

### `src/components/` (Componentes y Vistas)
- **`/admin`**: Tableros exclusivos para la gestión gerencial del barrio.
  - `AdminDashboard.tsx`: Monolito contenedor que administra la navegación interna entre submódulos (Historial, Lotes, Guardias, Trabajadores, Menú Principal).
  - `AdminGuardManagement.tsx`: Control, baneo e incorporación de perfiles de Guardia.
  - `AuditLog.tsx`: Tabla filtrable que muestra todas las entradas y salidas ("in" / "out") capturadas en tiempo real.
  - `UnitsTable.tsx`: Visualización de lotes, estados contables (Deuda, Al día).
- **`/dashboard`** (Centro de Guardia):
  - `GuardDashboard.tsx`: Tablero de la garita. Permite cambiar entre Escaneo, Activos en Predio, y Directorio.
  - `GuardScanner.tsx`: Integración con la cámara del dispositivo móvil u ordenador. Detecta credenciales, códigos QR, DNIs. Muestra interfaz de semáforo (Verde / Rojo) basándose en las autorizaciones de `mock-service.ts`.
  - `ManualEntryForm.tsx`: Formulario de respaldo en caso de que un visitante no tenga QR (Deliverys, Servicios repentinos).
  - `ActiveMonitor.tsx`: Monitorea en vivo a todas las personas que ingresaron al predio y aún no han registrado su salida. Calcula el tiempo de estadía e introduce alertas visuales de estancia prolongada.
- **`/owner`**: Interfaz del habitante (Propietario o Inquilino).
  - `OwnerDashboard.tsx`: Panel principal donde el habitante visualiza las notificaciones, estado financiero de sus lotes (Badge), e historial de la unidad.
  - `AddFamilyMemberModal.tsx` & `AddTenantModal.tsx`: Interfaces modales modulares compartidas para la delegación de accesos permanentes.
  - `VehicleList.tsx` & `WorkerList.tsx`: Listas detalladas con modales integrados para dar de alta patentes vehiculares o solicitar accesos programados temporales de trabajadores (contratistas, mucamas, etc).
  - `QuickActions.tsx`: Botones flotantes / rápidos tipo PWA orientados al uso en dispositivos móviles para las tareas habituales.
- **`/ui`** (Componentes "Dumb" Compartidos):
  - `Modal.tsx`: Envoltorio reutillizable que unifica el sombreado (`backdrop-blur`), z-index, estructuras de títulos (`header`) y métodos de cierre (`onClose`).
  - `Badge.tsx`: Tarjeta/Etiqueta visual pequeña personalizable por status y color (`success`, `danger`, `warning`, `info`, `default`), con o sin indicadores (puntos redondos).

### `src/types/index.ts` (Modelos de Datos y Entidades Centrales)
Posee las interfaces troncales:
- `Role`: admin, guard, owner, tenant.
- `Profile`: id, rol, nombre, apellido, etc.
- `Unit`: Representa un lote. Guarda referencias de usuarios (owners/tenants), vehículos asociados e historial (logs).
- `Invitation`: Representa un acceso temporal de invitado, conteniendo el rango de validez temporal y a qué lote corresponde.
- `DemoWorker`: Para trabajadores con autorizaciones (fechas específicas, horarios permitidos).
- `AccessLog`: Registro único temporal de tránsito (`in`, `out`) ejecutado por un operario/guardia.
- `Vehicle`: Patente, marca, dueño asociado.

### `src/lib/` (Lógica de Simulaciones - Mocks)
- `mockData.ts`: Un registro JSON en bruto masivo con datos demostrativos estructurados relacionalmente. Posee Lotes preestablecidos, visitas activas, trabajadores con QR expirados y activos para verificar la lógica del escáner en QA.
- `mock-service.ts`: Una "caja negra" que simula un backend asíncrono o un Gateway ORM de Prisma/Supabase. Posee mutadores y selectores de lectura y persistencia de memoria durante la duración del Demo:
  - `validateAccess`: Devuelve la viabilidad de acceso basándose en estado de Lote y tipo de credencial.
  - `recordEntry` / `recordExit`: Empuja mutaciones al arreglo volátil de accesos.
  - Gestión general para lectura (`getUnits`, `getWorkers`, etc.).

---

## 4. Funciones Críticas por Áreas

### Vista Guardia (Operativa Diaria)
El enfoque del guardia es **Velocidad de reacción**.
1. **Escaneo QR de Identificaciones**: Cuando el guardia escanea, el flujo revisa el string (mock de token/DNI):
   - Verifica si es Trabajador: Cruza su ID con la fecha de expiración, los horarios autorizados `start_time`, `end_time` (ej. no dejar pasar a albañiles los domingos).
   - Verifica Integración General (Invitados temporales o propietarios permanentes).
2. **Forzado de Acceso**: El guardia puede usar un botón de emergencia por orden de un admin que sobrepasa validaciones e inyecta un registro en la auditoría con la nota (overrideReason).
3. **Monitoreo en Predio (`ActiveMonitor`)**: Usando cálculos de Timestamp respecto al `Date.now()`, el dashboard alerta al guardia qué autos o personas llevan horas adentro, proporcionando el botón instantáneo de Checkout / Despacho.

### Vista Propietario / Inquilino (Gestión Autónoma)
1. **Permisos Familiares y Habitacionales (CRUD Mocks)**: Mediante Modales estandarizados, el usuario carga DNIs, Nombres, Parentesco o Contratos de alquiler (Tenant).
2. **Vehículos**: Cada perfil vincula los datos técnicos de sus autos, facilitando al guardia el reconocimiento de "Patente-Lote".
3. **Autorización de Trabajadores**: Permite generar reglas lógicas con ventanas condicionales de tiempo. (Ej. Jardinero autorizado Lunes, Miercoles de 8 a 12).
4. **Estado y Deuda Financiera**: Sistema de colores de advertencia utilizando un `Badge` en torno al estado contable derivado de expensas (Status del Unidad).

### Vista Administrador (Gestión Macro - Backoffice)
1. **Padrones Masivos**: Listados infinitos asíncronos del personal, unidades/lotes y perfiles.
2. **Gestión Operativa**: Permiso para alta, baja temporal, bloqueo o reseteo de sesiones/contraseñas del personal de garita.
3. **Historial Maestro (Audit Log)**: Visualización absoluta y cronológica sin limitación de lote de todos los cambios de estado y perfiles en el barrio provistos por la PWA.

---

## 5. Diseño y Manejo de Escalabilidad Técnica
- **ESLint & TypeScript Puro**: Refactorizado expresamente para poseer **cero fallos de Lint y compilación**, prohibiendo tipos dinámicos sin escape explícito. Todo evento está protegido con aserciones.
- **Rendimiento React (Anti Cascading Renders)**: Componentes pesados utilizan dependencias en arrays asíncronos en los `useEffect` de las cargas iniciales para evitar ciclos infinitos y re-renders catastróficos. Todas las funciones de mutación de estados están debidamente alojadas fuera de los hooks de vida para respetar la "pureza" y sincronización.
- **UI Compartida vs Independiente**: Los Páneles de "Dashboards" operan mayormente independientes como SPA gigantescos (`GuardDashboard`, `AdminDashboard`), reduciendo la cantidad de veces que el "Browser" del usuario enruta, ofreciendo una experiencia idéntica a una app Android/iOS sin latencias de recargas intermedias, en conjunto a modales nativos.
