import { useState, useEffect } from 'react';
import QuickActions from './QuickActions';
import WorkerList from './WorkerList';
import VehicleList from './VehicleList';
import AddTenantModal from './AddTenantModal';
import AddFamilyMemberModal from './AddFamilyMemberModal';
import { ChevronLeft, Download, UserPlus, Trash2, Users, AlertTriangle, ShieldAlert, Ambulance } from 'lucide-react';
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
    }, [role]);

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
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-slate-500 font-medium">Lote 101 • {role === 'tenant' ? 'Inquilino' : 'Al Día'}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
                {view === 'home' && (
                    <>
                        {/* Expenses Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full -mr-4 -mt-4" />
                            <h3 className="text-gray-500 text-sm font-medium mb-1 relative z-10">Estado de Expensas</h3>
                            <div className="flex items-end justify-between relative z-10">
                                <div>
                                    <div className={`text-3xl font-bold ${role === 'owner' ? 'text-slate-900' : 'text-slate-700'}`}>
                                        $ 50.000
                                    </div>
                                    <Badge variant="danger" className="mt-2 inline-block">
                                        ● Con Deuda (No Bloqueante)
                                    </Badge>
                                </div>
                                <button className="text-blue-600 font-bold text-sm bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors">
                                    <Download size={20} />
                                </button>
                            </div>
                        </div>

                        <QuickActions onViewChange={setView} role={role} currentProfile={currentProfile} />
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
