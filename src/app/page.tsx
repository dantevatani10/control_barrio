import Link from "next/link";
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Building2,
  Smartphone,
  BarChart3,
  Users,
  Lock,
  Wallet,
  Clock,
  HeartHandshake
} from "lucide-react";

export const metadata = {
  title: 'AccessControl | Software de Gestión para Barrios Cerrados',
  description: 'Automatiza la seguridad, reduce la morosidad hasta un 23% y elimina los grupos de WhatsApp. Sistema de control de accesos 100% en la nube sin costos de hardware.',
  keywords: 'software barrios privados, control de accesos, liquidacion de expensas, app consorcios, seguridad countries',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/20">
              <Shield size={24} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">AccessControl</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#demo-playground"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors hidden sm:block"
            >
              Probar Sistema
            </Link>
            <Link
              href="#demo-playground"
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Ver Demo Interactiva
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="pt-40 pb-20 px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Lanzamiento 2026 • Sin costos de instalación
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-8 max-w-4xl mx-auto">
            El Sistema Operativo definitivo para tu <span className="text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Barrio Cerrado.</span>
          </h1>

          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Centraliza la seguridad en portería, automatiza el cobro de expensas y elimina el caos de WhatsApp. Una plataforma integral 100% en la nube.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="#demo-playground"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-1 w-full sm:w-auto"
            >
              Explorar Demo <ArrowRight size={20} />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm w-full sm:w-auto">
              Agendar Asesoría
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Cero inversión en Hardware</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Apps iOS & Android</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Operativo en 72hs</span>
            </div>
          </div>
        </section>

        {/* ROI / MÉTRICAS SECTION */}
        <section className="bg-slate-900 py-16 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply"></div>
          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="p-6">
              <div className="text-5xl font-extrabold text-white mb-2 flex items-center justify-center gap-2">
                <Wallet className="text-emerald-400" size={40} /> -23%
              </div>
              <p className="text-slate-400 font-medium">Reducción promedio en morosidad</p>
            </div>
            <div className="p-6">
              <div className="text-5xl font-extrabold text-white mb-2 flex items-center justify-center gap-2">
                <Clock className="text-blue-400" size={40} /> +60%
              </div>
              <p className="text-slate-400 font-medium">Ahorro de tiempo administrativo</p>
            </div>
            <div className="p-6">
              <div className="text-5xl font-extrabold text-white mb-2 flex items-center justify-center gap-2">
                <Building2 className="text-purple-400" size={40} /> $0
              </div>
              <p className="text-slate-400 font-medium">Costo de instalación y servidores</p>
            </div>
          </div>
        </section>

        {/* CARACTERÍSTICAS / LOS 3 PILARES */}
        <section className="py-24 px-6 max-w-7xl mx-auto bg-slate-50">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Un barrio tranquilo se gestiona solo</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Reemplaza 4 sistemas distintos por una única herramienta intuitiva diseñada para todas las edades.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Portería Infranqueable</h3>
              <p className="text-slate-600 leading-relaxed">
                El guardia escanea el QR en 1 segundo. Si la ART o la expensa está vencida, el sistema avisa con colores claros. Cero fricción, 100% trazabilidad.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Finanzas Automáticas</h3>
              <p className="text-slate-600 leading-relaxed">
                Boletos digitales y recordatorios automáticos. Los vecinos tienen visibilidad clara de sus deudas, y el barrio recauda más y más rápido.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Vecinos Felices</h3>
              <p className="text-slate-600 leading-relaxed">
                Invitaciones rápidas por WhatsApp, gestión de visitas y botón S.O.S directo en sus bolsillos. Adiós definitivo a los grupos vecinales tóxicos.
              </p>
            </div>
          </div>
        </section>

        {/* EL DIFERENCIAL HUMANO / FOUNDER SECTION */}
        <section className="py-12 px-6 max-w-7xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-[2rem] p-8 md:p-12 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-500/30 border border-blue-400/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
                  <HeartHandshake size={14} /> El Diferencial Humano
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Software de primer nivel, con atención de barrio.</h2>
                <p className="text-blue-100 text-lg leading-relaxed mb-8">
                  A diferencia de las corporaciones que te venden un sistema complejo y desaparecen detrás de un &quot;ticket de soporte&quot;, nuestra filosofía es 100% Hands-On. Implementamos la herramienta a tu lado.
                </p>

                <ul className="space-y-5 text-blue-50">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                    <span><strong>Para los empleados:</strong> Capacitamos presencialmente a tu guardia para que dominen la garita desde el primer turno, sin frustraciones.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                    <span><strong>Para los vecinos:</strong> Ayudamos con la adopción tecnológica para que hasta los propietarios mayores usen la app con total confianza.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                    <span><strong>Asesoramiento directo:</strong> Contacto de WhatsApp directo. Sin bots automáticos, resoluciones en minutos.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center shadow-lg relative">
                <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-inner">
                  <Users size={36} className="text-blue-900" />
                </div>
                <h3 className="text-xl font-bold mb-3">Compromiso Real</h3>
                <p className="text-blue-100 italic text-base leading-relaxed mb-6">
                  &quot;Mi objetivo no es solo venderte un software, sino asegurarme de que realmente solucione los problemas diarios de tu comunidad. Si tu equipo tiene una duda, me tienen a mí en la línea directa.&quot;
                </p>
                <div className="text-sm font-bold text-white uppercase tracking-wider">
                  — Dante Vatani
                  <span className="block text-blue-300 text-xs mt-1 capitalize">Fundador & CEO</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLAYGROUND / DEMO SECTION */}
        <section id="demo-playground" className="pb-20 pt-10 px-6">
          <div className="max-w-7xl mx-auto bg-slate-900 rounded-[2.5rem] p-8 md:p-16 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ponte en sus zapatos</h2>
              <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                No confíes en nuestras palabras. Selecciona un perfil y experimenta cómo fluye la información en tiempo real a través de nuestro sistema.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              <Link href="/dashboard/admin" className="group bg-slate-800/50 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 rounded-2xl p-6 transition-all hover:-translate-y-2 backdrop-blur-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-700 group-hover:bg-white/20 rounded-full flex items-center justify-center mb-4 transition-colors">
                  <Lock className="text-white" size={28} />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Administrador</h3>
                <p className="text-slate-400 group-hover:text-blue-100 text-sm">Panel de control y auditoría global</p>
              </Link>

              <Link href="/dashboard/guard" className="group bg-slate-800/50 hover:bg-emerald-600 border border-slate-700 hover:border-emerald-500 rounded-2xl p-6 transition-all hover:-translate-y-2 backdrop-blur-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-700 group-hover:bg-white/20 rounded-full flex items-center justify-center mb-4 transition-colors">
                  <Shield className="text-white" size={28} />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Guardia</h3>
                <p className="text-slate-400 group-hover:text-emerald-100 text-sm">Escáner QR y control de barrera</p>
              </Link>

              <Link href="/dashboard/owner" className="group bg-slate-800/50 hover:bg-purple-600 border border-slate-700 hover:border-purple-500 rounded-2xl p-6 transition-all hover:-translate-y-2 backdrop-blur-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-700 group-hover:bg-white/20 rounded-full flex items-center justify-center mb-4 transition-colors">
                  <Building2 className="text-white" size={28} />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Propietario</h3>
                <p className="text-slate-400 group-hover:text-purple-100 text-sm">Gestión del lote e invitaciones</p>
              </Link>

              <Link href="/dashboard/tenant" className="group bg-slate-800/50 hover:bg-orange-500 border border-slate-700 hover:border-orange-400 rounded-2xl p-6 transition-all hover:-translate-y-2 backdrop-blur-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-700 group-hover:bg-white/20 rounded-full flex items-center justify-center mb-4 transition-colors">
                  <Users className="text-white" size={28} />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Inquilino</h3>
                <p className="text-slate-400 group-hover:text-orange-100 text-sm">Accesos y grupo familiar</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1.5 rounded-lg text-slate-600">
              <Shield size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">AccessControl SaaS</span>
          </div>

          <div className="flex gap-8 text-sm font-medium">
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Características</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Privacidad</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Soporte</a>
          </div>

          <div className="text-sm text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} Dante Vatani. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
