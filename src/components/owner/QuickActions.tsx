import { Role, Profile } from '@/types';
import { UserPlus, HardHat, Car, Share2, CreditCard, AlertCircle, Users } from 'lucide-react';
import { shareData } from '@/utils/share';

interface QuickActionsProps {
    onViewChange: (view: string) => void;
    role: Role;
    currentProfile?: Profile;
}

export default function QuickActions({ onViewChange, role, currentProfile }: QuickActionsProps) {

    // Check permission - Default to true if not defined (legacy/admin)
    const canInvite = currentProfile?.can_invite_guests !== false;

    const handleInvite = async () => {
        if (!canInvite) {
            alert('Acceso Restringido: Al ser menor de 15 años, no puedes generar invitaciones.');
            return;
        }

        // Simulate WhatsApp Invite Flow
        const inviteLink = `https://accesobarrio.com/invite/${Math.random().toString(36).substring(7)}`;
        const text = `Hola! Te invito a casa. Ingresá con este QR: ${inviteLink}`;

        await shareData({
            title: 'Invitación a Barrio Santa Clara',
            text: text,
            url: inviteLink
        });

        alert('Simulación: Se abrió WhatsApp con el link:\n\n' + text);
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
                <span className="font-bold">{canInvite ? 'Invitar Visita' : 'No Habilitado'}</span>
            </button>

            <button
                onClick={() => onViewChange('workers')}
                className="flex flex-col items-center justify-center gap-3 bg-white text-slate-700 p-6 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
                <div className="bg-orange-50 text-orange-600 p-3 rounded-full">
                    <Users size={28} />
                </div>
                <span className="font-bold">Trabajadores</span>
            </button>

            <button
                onClick={() => onViewChange('vehicles')}
                className="flex flex-col items-center justify-center gap-3 bg-white text-slate-700 p-6 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
                <div className="bg-indigo-50 text-indigo-600 p-3 rounded-full">
                    <Car size={28} />
                </div>
                <span className="font-bold">Mis Vehículos</span>
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
                            <span className="font-bold">Inquilinos</span>
                        </button>
                    )}

                    <button
                        onClick={() => onViewChange('family')}
                        className="flex flex-col items-center justify-center gap-3 bg-white text-slate-700 p-6 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
                    >
                        <div className="bg-purple-50 text-purple-600 p-3 rounded-full">
                            <UserPlus size={28} />
                        </div>
                        <span className="font-bold">Familia</span>
                    </button>
                </>
            )}

            <button
                onClick={() => alert('Simulación: Abriendo portal de pagos...')} // Mock action
                className="flex flex-col items-center justify-center gap-3 bg-white text-slate-700 p-6 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
                <div className="bg-purple-50 text-purple-600 p-3 rounded-full">
                    <CreditCard size={28} />
                </div>
                <span className="font-bold">Expensas</span>
            </button>
        </div>
    );
}
