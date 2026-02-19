import React, { useState } from 'react';
import { X, CheckCircle, User, Mail, Calendar } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface AddTenantModalProps {
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (tenant: any) => void;
}

export default function AddTenantModal({ onClose, onSuccess }: AddTenantModalProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dni: '',
        email: '',
        endDate: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        const newTenant = {
            id: `tenant-${Date.now()}`,
            role: 'tenant',
            first_name: formData.firstName,
            last_name: formData.lastName,
            dni: formData.dni,
            email: formData.email,
            contract_end: formData.endDate
        };
        onSuccess(newTenant);
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={<>Nuevo Inquilino</>}
            maxWidth="md"
            headerColorClass="bg-slate-900 text-white"
        >

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                    <label className="block text-xs font-bold text-gray-600 mb-1">DNI</label>
                    <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input required type="text" className="w-full pl-9 p-2 border rounded-lg font-mono" value={formData.dni} onChange={e => setFormData({ ...formData, dni: e.target.value })} />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Email (para invitación)</label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input required type="email" className="w-full pl-9 p-2 border rounded-lg" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Fin de Contrato</label>
                    <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input required type="date" className="w-full pl-9 p-2 border rounded-lg" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all mt-6"
                >
                    <CheckCircle size={20} />
                    REGISTRAR INQUILINO
                </button>
            </form>
        </Modal>
    );
}
