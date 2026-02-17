import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle, User, Briefcase } from 'lucide-react';
import { WorkerRole, WorkAuthorization } from '@/types';

interface WorkerFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function WorkerForm({ onClose, onSuccess }: WorkerFormProps) {
    const [step, setStep] = useState(1);
    const [workerData, setWorkerData] = useState({
        firstName: '',
        lastName: '',
        dni: '',
        role: 'painter' as WorkerRole
    });

    const [authData, setAuthData] = useState<{
        accessType: 'single' | 'range';
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
    }>({
        accessType: 'single',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '17:00'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Creating Worker & Auth:', { workerData, authData });
        // In a real app, save to DB here.
        // For Mock, we just simulate success.
        onSuccess();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-900 text-white">
                    <h2 className="font-bold text-lg">Nuevo Trabajador</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Worker Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <User size={16} /> Datos Personales
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Nombre</label>
                                    <input required type="text" className="w-full p-2 border rounded-lg" value={workerData.firstName} onChange={e => setWorkerData({ ...workerData, firstName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Apellido</label>
                                    <input required type="text" className="w-full p-2 border rounded-lg" value={workerData.lastName} onChange={e => setWorkerData({ ...workerData, lastName: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">DNI</label>
                                <input required type="text" className="w-full p-2 border rounded-lg font-mono" placeholder="20.123.456" value={workerData.dni} onChange={e => setWorkerData({ ...workerData, dni: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Rubro</label>
                                <select className="w-full p-2 border rounded-lg bg-white" value={workerData.role} onChange={e => setWorkerData({ ...workerData, role: e.target.value as WorkerRole })}>
                                    <option value="painter">Pintor</option>
                                    <option value="gardener">Jardinero</option>
                                    <option value="mason">Albañil</option>
                                    <option value="plumber">Plomero</option>
                                    <option value="electrician">Electricista</option>
                                    <option value="other">Otro</option>
                                </select>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Auth Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Briefcase size={16} /> Permisos de Acceso
                            </h3>

                            {/* Toggle Access Type */}
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setAuthData({ ...authData, accessType: 'single' })}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authData.accessType === 'single' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Visita Única
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAuthData({ ...authData, accessType: 'range' })}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authData.accessType === 'range' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Rango / Obra
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">
                                        {authData.accessType === 'single' ? 'Fecha' : 'Desde'}
                                    </label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="date"
                                            className="w-full pl-9 p-2 border rounded-lg text-sm font-medium"
                                            value={authData.startDate}
                                            onChange={e => setAuthData({ ...authData, startDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                {authData.accessType === 'range' && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Hasta</label>
                                        <input
                                            type="date"
                                            className="w-full p-2 border rounded-lg text-sm font-medium"
                                            value={authData.endDate}
                                            onChange={e => setAuthData({ ...authData, endDate: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Hora Inicio</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="time"
                                            className="w-full pl-9 p-2 border rounded-lg text-sm font-medium"
                                            value={authData.startTime}
                                            onChange={e => setAuthData({ ...authData, startTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Hora Fin</label>
                                    <input
                                        type="time"
                                        className="w-full p-2 border rounded-lg text-sm font-medium"
                                        value={authData.endTime}
                                        onChange={e => setAuthData({ ...authData, endTime: e.target.value })}
                                    />
                                </div>
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            <CheckCircle size={20} />
                            CONFIRMAR ALTA
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
