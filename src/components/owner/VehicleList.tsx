import { useState, useEffect } from 'react';
import { mockService } from '@/lib/mock-service';
import { Car, Trash2, Plus } from 'lucide-react';
import { Vehicle } from '@/types';
import AddVehicleModal from './AddVehicleModal';

export default function VehicleList() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        // eslint-disable-next-line
        setVehicles(mockService.getVehicles());
    }, []);
    const [showModal, setShowModal] = useState(false);

    const handleAddVehicle = (newVehicle: Vehicle) => {
        setVehicles([...vehicles, newVehicle]);
        setShowModal(false);
        // alert('Vehículo agregado exitosamente'); // Optional feedback
    };

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-800">Mis Vehículos</h3>

            {showModal && (
                <AddVehicleModal
                    onClose={() => setShowModal(false)}
                    onSuccess={handleAddVehicle}
                />
            )}

            {vehicles.map(vehicle => (
                <div key={vehicle.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-3 rounded-full text-slate-600">
                            <Car size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">{vehicle.brand} {vehicle.model}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="bg-slate-800 text-white text-xs font-mono px-1.5 py-0.5 rounded">
                                    {vehicle.license_plate}
                                </span>
                                <span className="w-3 h-3 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: vehicle.color }}></span>
                            </div>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                    </button>
                </div>
            ))}

            <button
                onClick={() => setShowModal(true)}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
                <Plus size={20} /> Registrar Vehículo
            </button>
        </div>
    );
}
