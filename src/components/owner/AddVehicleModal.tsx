import React, { useState } from 'react';
import { X, CheckCircle, Car } from 'lucide-react';
import { Vehicle } from '@/types';

interface AddVehicleModalProps {
    onClose: () => void;
    onSuccess: (vehicle: Vehicle) => void;
}

export default function AddVehicleModal({ onClose, onSuccess }: AddVehicleModalProps) {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        color: '#000000',
        plate: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newVehicle: Vehicle = {
            id: `v-${Date.now()}`,
            profile_id: 'current-user', // Mock association
            community_id: 'c1',
            brand: formData.brand,
            model: formData.model,
            color: formData.color,
            license_plate: formData.plate.toUpperCase(),
            type: 'car'
        };
        onSuccess(newVehicle);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
                    <h2 className="font-bold text-lg">Nuevo Inquilino</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Marca</label>
                            <input required type="text" placeholder="Toyota" className="w-full p-2 border rounded-lg" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Modelo</label>
                            <input required type="text" placeholder="Corolla" className="w-full p-2 border rounded-lg" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Patente / Dominio</label>
                        <div className="relative">
                            <Car size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="text" placeholder="AA 123 BB" className="w-full pl-9 p-2 border rounded-lg font-mono uppercase" value={formData.plate} onChange={e => setFormData({ ...formData, plate: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Color</label>
                        <div className="flex items-center gap-2">
                            <input type="color" className="h-10 w-20 rounded cursor-pointer" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} />
                            <span className="text-sm text-gray-500">{formData.color}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all mt-6"
                    >
                        <CheckCircle size={20} />
                        REGISTRAR VEHÍCULO
                    </button>
                </form>
            </div>
        </div>
    );
}
