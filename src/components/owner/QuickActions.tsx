import { Role, Profile } from '@/types';
import { UserPlus, Car, Share2, CreditCard, AlertCircle, Users } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

interface QuickActionsProps {
    onViewChange: (view: string) => void;
    role: Role;
    currentProfile?: Profile;
    onInviteClick?: () => void;
}

export default function QuickActions({ onViewChange, role, currentProfile, onInviteClick }: QuickActionsProps) {

    // Check permission - Default to true if not defined
    const canInvite = currentProfile?.can_invite_guests !== false;

    const handleInvite = () => {
        if (!canInvite) {
            toast?.error ? toast.error('Acceso Restringido: Al ser menor, no puedes generar invitaciones.') : alert('Acceso Restringido');
            return;
        }

        // Abrir el modal nuevo
        if (onInviteClick) {
            onInviteClick();
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4 mb-8">
            <button
                onClick={handleInvite}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl shadow-sm border transition-transform
                    ${canInvite
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 active:scale-95'
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-70'}`}
            >
                <div className={`p-3 rounded-full ${canInvite ? 'bg-white/20' : 'bg-gray-200 text-gray-500'}`}>
                    {canInvite ? <Share2 size={28} /> : <AlertCircle size={28} />}
                </div>
                <span className="font-bold text-sm">{canInvite ? 'Invitar Visita' : 'No Habilitado'}</span>
            </button>

            <button
                onClick={() => onViewChange('workers')}
                className="flex flex-col items-center justify-center gap-3 bg-white text-slate-700 p-6 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
                <div className="bg-orange-50 text-orange-600 p-3 rounded-full">
                    <Users size={28} />
                </div>
                <span className="font-bold text-sm">Trabajadores</span>
            </button>

            <button
                onClick={() => onViewChange('vehicles')}
                className="flex flex-col items-center justify-center gap-3 bg-white text-slate-700 p-6 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
                <div className="bg-indigo-50 text-indigo-600 p-3 rounded-full">
                    <Car size={28} />
                </div>
                <span className="font-bold text-sm">Mis Vehículos</span>
            </button>

            {(role === 'owner' || role === 'tenant') && (
                <>
                    {role === 'owner' && (
                        <button
                            onClick={() => onViewChange('tenants')}
                            className="flex flex-col items-center justify-center gap-3 bg-white text-slate-700 p-6 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
                        >
                            <div className="bg-green-50 text-green-600 p-3 rounded-full">
                                <UserPlus size={28} />
                            </div>
                            <span className="font-bold text-sm">Inquilinos</span>
                        </button>
                    )}

                    <button
                        onClick={() => onViewChange('family')}
                        className="flex flex-col items-center justify-center gap-3 bg-white text-slate-700 p-6 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
                    >
                        <div className="bg-purple-50 text-purple-600 p-3 rounded-full">
                            <UserPlus size={28} />
                        </div>
                        <span className="font-bold text-sm">Familia</span>
                    </button>
                </>
            )}

            <button
                onClick={() => alert('Simulación: Abriendo portal de pagos...')}
                className="flex flex-col items-center justify-center gap-3 bg-white text-slate-700 p-6 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
                <div className="bg-purple-50 text-purple-600 p-3 rounded-full">
                    <CreditCard size={28} />
                </div>
                <span className="font-bold text-sm">Expensas</span>
            </button>
        </div>
    );
}
