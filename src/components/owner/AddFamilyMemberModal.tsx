import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Mail, User, AlertTriangle } from 'lucide-react';
import { Profile } from '@/types';

interface AddFamilyMemberModalProps {
    onClose: () => void;
    onSuccess: (member: Profile) => void;
}

export default function AddFamilyMemberModal({ onClose, onSuccess }: AddFamilyMemberModalProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: ''
    });

    const [isMinor, setIsMinor] = useState(false);

    function calculateAge(dobString: string) {
        const dob = new Date(dobString);
        const diffMs = Date.now() - dob.getTime();
        const ageDate = new Date(diffMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    useEffect(() => {
        if (formData.dob) {
            const age = calculateAge(formData.dob);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsMinor(age < 15);
        }
    }, [formData.dob]);



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const age = calculateAge(formData.dob);
        const canInvite = age >= 15;

        // Mock creation
        const newMember: Profile = {
            id: `p-${Date.now()}`,
            user_id: `u-${Date.now()}`,
            community_id: 'c1',
            role: 'owner', // Should ideally be 'resident' but using owner for MVP per rules
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: canInvite ? formData.email : undefined, // Minors might not need email log in yet? Or maybe yes.
            phone_number: formData.phone,
            date_of_birth: formData.dob,
            can_invite_guests: canInvite,
            created_at: new Date().toISOString()
        };
        onSuccess(newMember);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-purple-600 text-white">
                    <h2 className="font-bold text-lg">Nuevo Familiar</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {isMinor && (
                        <div className="bg-orange-50 text-orange-800 text-xs p-3 rounded-lg flex items-start gap-2 border border-orange-100">
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold">Atención:</span> Al ser menor de 15 años, este usuario NO tendrá permisos para generar invitaciones (QR).
                            </div>
                        </div>
                    )}

                    {!isMinor && formData.dob && (
                        <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg border border-blue-100">
                            Se enviará un email al usuario para que configure su acceso app.
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Nombre</label>
                            <input required type="text" className="w-full p-2 border rounded-lg" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Apellido</label>
                            <input required type="text" className="w-full p-2 border rounded-lg" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Fecha de Nacimiento</label>
                        <input
                            required
                            type="date"
                            className="w-full p-2 border rounded-lg"
                            value={formData.dob}
                            onChange={e => setFormData({ ...formData, dob: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Email {isMinor && '(Opcional)'}</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                required={!isMinor}
                                type="email"
                                className="w-full pl-9 p-2 border rounded-lg"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">DNI</label>
                        <input required type="text" className="w-full p-2 border rounded-lg" />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all mt-6"
                    >
                        <CheckCircle size={20} />
                        AGREGAR FAMILIAR
                    </button>
                </form>
            </div>
        </div>
    );
}
