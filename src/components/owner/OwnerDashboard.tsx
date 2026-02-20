import { useState, useEffect } from 'react';
import QuickActions from './QuickActions';
import WorkerList from './WorkerList';
import VehicleList from './VehicleList';
import AddTenantModal from './AddTenantModal';
import AddFamilyMemberModal from './AddFamilyMemberModal';
import { ChevronLeft, Download, UserPlus, Trash2, Users, AlertTriangle, ShieldAlert, Ambulance, Bell, CheckCheck, CheckCircle2, X, CalendarClock, Info, Megaphone } from 'lucide-react';
import { Role, Profile } from '@/types';
import { mockService } from '@/lib/mock-service';
import { Badge } from '@/components/ui/Badge';

export default function OwnerDashboard({ role = 'owner' }: { role?: Role }) {
    const [view, setView] = useState('home'); // home, workers, vehicles, tenants, family
    const [showTenantModal, setShowTenantModal] = useState(false);
    const [tenants, setTenants] = useState<(Profile & { dni?: string; contract_end?: string })[]>([]);

    // Core Data State
    const [currentProfile, setCurrentProfile] = useState<Profile | undefined>(undefined);

    // Family Modal State
    const [showFamilyModal, setShowFamilyModal] = useState(false);
    const [familyMembers, setFamilyMembers] = useState<Profile[]>([]);

    // Emergency S.O.S State
    const [showSOSModal, setShowSOSModal] = useState(false);

    // Unit / Expense State
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [currentUnit, setCurrentUnit] = useState<any>(null);

    // Notifications State
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [activeNotifications, setActiveNotifications] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [toastNotif, setToastNotif] = useState<any | null>(null);

    useEffect(() => {
        // Load Profile from Service based on Role for Demo
        const profile = mockService.login(role);
        // eslint-disable-next-line
        setCurrentProfile(profile);

        // Load initial family (Mock: just filtering other users for now or empty)
        // In a real demo we might want to see 'kid1' if logged in as 'owner1'
        const users = mockService.getUsers();
        if (role === 'owner') {
            // Find kids/others in same unit?
            // seed "kid1" has unit_id "u101", owner1 has "u101"
            const myUnitId = profile?.unit_id;
            if (myUnitId) {
                const family = users.filter(u => u.unit_id === myUnitId && u.id !== profile?.id && u.role === 'resident');
                setFamilyMembers(family);
            }
        }

        // Load current unit (Lote 61 for demo)
        const allUnits = mockService.getUnits();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const myUnit = allUnits.find((u: any) => u.id === '61');
        if (myUnit) setCurrentUnit(myUnit);
    }, [role]);

    // Polling for Notifications (every 2 seconds)
    useEffect(() => {
        const checkNotifications = () => {
            setNotifications(mockService.getNotifications().slice(0, 10));
            setUnreadCount(mockService.getUnreadNotificationCount());
        };

        checkNotifications(); // Initial
        const interval = setInterval(checkNotifications, 2000);
        return () => clearInterval(interval);
    }, []);

    // Polling for unit-specific Toast notifications
    useEffect(() => {
        const unitId = currentProfile?.unit_id || 'Lote 101';
        let lastSeenCount = 0;

        const checkToast = async () => {
            const unread = await mockService.getUnreadNotifications(unitId);
            setActiveNotifications(unread);

            // Show toast only when a NEW notification arrives
            if (unread.length > lastSeenCount && unread.length > 0) {
                setToastNotif(unread[0]);
                // Auto-dismiss after 5 seconds
                setTimeout(() => setToastNotif(null), 5000);
            }
            lastSeenCount = unread.length;
        };

        checkToast();
        const interval = setInterval(checkToast, 2000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProfile]);

    const handleAddTenant = (newTenant: Profile & { dni?: string; contract_end?: string }) => {
        setTenants([...tenants, newTenant]);
        setShowTenantModal(false);
    };

    const handleAddFamilyMember = (newMember: Profile) => {
        setFamilyMembers([...familyMembers, newMember]);
        setShowFamilyModal(false);
        alert(`Familiar agregado a memoria: ${newMember.first_name}`);
    };

    const handleTriggerSOS = async (type: 'MEDICAL' | 'SECURITY') => {
        const residentName = currentProfile ? `${currentProfile.first_name} ${currentProfile.last_name}` : 'Residente';
        const unitId = currentProfile?.unit_id || 'Lote 101'; // Fallback for DEMO

        await mockService.triggerEmergency(unitId, residentName, type);
        setShowSOSModal(false);
        alert('🚨 ALERTA S.O.S ENVIADA A LA GUARDIA INMEDIATAMENTE');
    };

    if (!currentProfile) return <div className="p-10 text-center">Cargando perfil...</div>;

    return (
        <div className="max-w-md mx-auto min-h-[80vh] flex flex-col relative pb-32">

            {/* FLOATING TOAST NOTIFICATION */}
            {toastNotif && (
                <div className="fixed top-24 right-6 z-50 max-w-sm animate-in slide-in-from-right-5 duration-300">
                    <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-2xl border border-emerald-500 flex gap-3 items-start">
                        <CheckCircle2 size={24} className="flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm">{toastNotif.title || 'Nuevo Movimiento'}</p>
                            <p className="text-emerald-100 text-xs mt-0.5">{toastNotif.message}</p>
                            <p className="text-emerald-200/60 text-[10px] mt-1 font-mono">
                                {new Date(toastNotif.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                        <button
                            onClick={() => setToastNotif(null)}
                            className="text-emerald-200 hover:text-white flex-shrink-0"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
                {view !== 'home' && (
                    <button onClick={() => setView('home')} className="bg-white p-2 rounded-full shadow-sm text-slate-600 hover:text-slate-900">
                        <ChevronLeft size={24} />
                    </button>
                )}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {view === 'home' ? `Hola, ${currentProfile.first_name} 👋` :
                            view === 'workers' ? 'Gestión Trabajadores' :
                                view === 'tenants' ? 'Inquilinos' :
                                    view === 'family' ? 'Grupo Familiar' : 'Mis Vehículos'}
                    </h2>
                    {view === 'home' && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className={`w-2 h-2 rounded-full ${currentUnit?.debt > 0 ? 'bg-rose-500' : 'bg-green-500'}`}></span>
                            <span className="text-slate-500 font-medium">
                                {currentUnit?.unit_number || 'UF 61'} • {currentUnit?.debt > 0 ? 'Con Saldo Pendiente' : role === 'tenant' ? 'Inquilino' : 'Al Día'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
                {view === 'home' && (
                    <>
                        {/* Expense Status Banner */}
                        {currentUnit && currentUnit.debt > 0 ? (
                            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 mb-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100 rounded-bl-full -mr-6 -mt-6" />
                                <div className="relative z-10">
                                    <p className="text-rose-800 text-xs font-bold uppercase tracking-wider mb-1">⚠️ Saldo Impago</p>
                                    <p className="text-3xl font-extrabold text-rose-700">
                                        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(currentUnit.debt)}
                                    </p>
                                    <p className="text-rose-500 text-xs mt-1 font-medium">Correspondiente a {currentUnit.residentName || 'tu lote'}</p>
                                    <button
                                        onClick={() => alert('📧 Se notificará al administrador sobre tu pago. ¡Gracias!')}
                                        className="mt-4 bg-rose-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-all active:scale-95"
                                    >
                                        💳 Informar Pago
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100 rounded-bl-full -mr-4 -mt-4" />
                                <div className="relative z-10">
                                    <p className="text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">✅ Expensas al día</p>
                                    <p className="text-xl font-bold text-emerald-700">Gracias por su pago.</p>
                                    <p className="text-emerald-500 text-xs mt-1 font-medium">Su lote no registra deuda pendiente.</p>
                                </div>
                            </div>
                        )}

                        <QuickActions onViewChange={setView} role={role} currentProfile={currentProfile} />

                        {/* Complaint Quick Action */}
                        <button
                            onClick={() => alert('📋 Formulario de reclamo en desarrollo para la demo. ¡Próximamente podrás enviar sugerencias directamente al administrador!')}
                            className="w-full mt-4 bg-white border-2 border-dashed border-slate-300 rounded-2xl p-4 flex items-center gap-3 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all active:scale-[0.98]"
                        >
                            <div className="bg-slate-100 p-2.5 rounded-xl">
                                <Megaphone size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">Generar Reclamo / Sugerencia</p>
                                <p className="text-xs text-slate-400">Comunicarse directamente con la administración</p>
                            </div>
                        </button>

                        {/* Tablón de Anuncios */}
                        <div className="mt-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Megaphone size={16} /> Tablón de Anuncios
                            </h3>
                            <div className="space-y-3">
                                {/* Comunicado 1 - Importante */}
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                                    <div className="bg-amber-100 p-2 rounded-lg text-amber-600 flex-shrink-0 h-fit">
                                        <CalendarClock size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">Importante</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-800">Vencimiento de Expensas Enero: Recuerde que el 10/02/2026 vence el plazo para abonar sin recargos.</p>
                                        <p className="text-xs text-slate-500 mt-1">Expensa ordinaria: <span className="font-bold">$283.339</span></p>
                                    </div>
                                </div>

                                {/* Comunicado 2 - Informativo */}
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 flex-shrink-0 h-fit">
                                        <Info size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-200 px-2 py-0.5 rounded-full">Informativo</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-800">Mantenimiento: Corte de césped en áreas comunes programado para este viernes.</p>
                                        <p className="text-xs text-slate-400 mt-1">Publicado por Administración</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notifications Panel */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Bell size={18} className="text-slate-500" />
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Últimos Movimientos</h3>
                                    {unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => {
                                            mockService.markAllNotificationsAsRead();
                                            setUnreadCount(0);
                                            setNotifications(mockService.getNotifications().slice(0, 10));
                                        }}
                                        className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:text-blue-800"
                                    >
                                        <CheckCheck size={14} /> Marcar leídas
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {notifications.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
                                        No hay movimientos recientes.
                                    </div>
                                ) : (
                                    notifications.map((notif: { id: string; message: string; timestamp: string; read: boolean }) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => {
                                                mockService.markNotificationAsRead(notif.id);
                                                setNotifications(mockService.getNotifications().slice(0, 10));
                                                setUnreadCount(mockService.getUnreadNotificationCount());
                                            }}
                                            className={`bg-white p-4 rounded-xl border shadow-sm cursor-pointer transition-all hover:shadow-md ${!notif.read
                                                ? 'border-blue-300 bg-blue-50/50'
                                                : 'border-slate-100'
                                                }`}
                                        >
                                            <p className={`text-sm font-medium ${!notif.read ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-1 font-mono">
                                                {new Date(notif.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
                {view === 'workers' && <WorkerList />}
                {view === 'vehicles' && <VehicleList />}

                {view === 'family' && (
                    <div className="space-y-4">
                        {showFamilyModal && (
                            <AddFamilyMemberModal onClose={() => setShowFamilyModal(false)} onSuccess={handleAddFamilyMember} />
                        )}

                        {familyMembers.map((member, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">{member.first_name} {member.last_name}</div>
                                        <div className="text-xs text-slate-500">
                                            {member.can_invite_guests ? 'Habilitado' : 'Sin permisos (Menor)'}
                                        </div>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-red-500"><Trash2 size={20} /></button>
                            </div>
                        ))}

                        <button
                            onClick={() => setShowFamilyModal(true)}
                            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-2"
                        >
                            <UserPlus size={20} /> Agregar Familiar
                        </button>
                    </div>
                )}

                {view === 'tenants' && (
                    <div className="space-y-4">
                        {showTenantModal && (
                            <AddTenantModal onClose={() => setShowTenantModal(false)} onSuccess={handleAddTenant} />
                        )}

                        {tenants.map(t => (
                            <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-slate-800">{t.first_name} {t.last_name}</div>
                                    <div className="text-xs text-slate-500">DNI: {t.dni} • Vence: {t.contract_end}</div>
                                </div>
                                <button className="text-gray-400 hover:text-red-500"><Trash2 size={20} /></button>
                            </div>
                        ))}

                        {tenants.length === 0 && (
                            <div className="text-center p-8 text-gray-500">
                                No hay inquilinos registrados.
                            </div>
                        )}

                        <button
                            onClick={() => setShowTenantModal(true)}
                            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-2"
                        >
                            <UserPlus size={20} /> Nuevo Inquilino
                        </button>
                    </div>
                )}
            </div>

            {/* FLOATING ACTION BUTTON (S.O.S) */}
            <button
                onClick={() => setShowSOSModal(true)}
                className="fixed bottom-24 right-6 md:right-10 z-40 bg-rose-600 text-white p-4 rounded-full shadow-[0_0_30px_rgba(225,29,72,0.6)] hover:bg-rose-700 transition-all hover:scale-110 active:scale-95 flex items-center justify-center animate-bounce border-4 border-rose-300"
                title="Botón de S.O.S."
            >
                <AlertTriangle size={36} />
            </button>

            {/* S.O.S MODAL CONFIRMATION */}
            {showSOSModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl flex flex-col items-center p-8 text-center border-4 border-rose-500 animate-in zoom-in-90">
                        <div className="bg-rose-100 text-rose-600 p-4 rounded-full mb-4">
                            <AlertTriangle size={48} />
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
                            ¿NECESITAS AYUDA?
                        </h2>
                        <p className="text-sm text-slate-500 font-medium mb-8">
                            Dispara una alerta inmediata a la guardia.
                        </p>

                        <div className="w-full space-y-4">
                            <button
                                onClick={() => handleTriggerSOS('MEDICAL')}
                                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border-2 border-blue-200 p-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all group"
                            >
                                <Ambulance size={32} className="group-hover:scale-110 transition-transform" />
                                <span className="text-lg font-black tracking-wide">MÉDICA</span>
                            </button>

                            <button
                                onClick={() => handleTriggerSOS('SECURITY')}
                                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border-2 border-rose-200 p-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all group"
                            >
                                <ShieldAlert size={32} className="group-hover:scale-110 transition-transform" />
                                <span className="text-lg font-black tracking-wide">SEGURIDAD</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowSOSModal(false)}
                            className="mt-8 text-slate-400 font-bold hover:text-slate-600 uppercase text-sm px-6 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            Cancelar / Error
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
