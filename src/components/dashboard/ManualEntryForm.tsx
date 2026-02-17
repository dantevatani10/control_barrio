import React, { useState, useMemo } from 'react';
import { MOCK_UNITS, MOCK_PROFILES, MOCK_LOGS } from '@/lib/mockData';
import { Unit, Profile, AccessLog } from '@/types';
import { User, Car, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface ManualEntryFormProps {
    onClose: () => void;
    onSuccess: (log: AccessLog) => void;
}

export default function ManualEntryForm({ onClose, onSuccess }: ManualEntryFormProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [searchUnit, setSearchUnit] = useState('');
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [selectedHost, setSelectedHost] = useState<Profile | null>(null);

    const [visitorData, setVisitorData] = useState({
        dni: '',
        name: '',
        plate: ''
    });

    // Derived state for filtered units
    const filteredUnits = useMemo(() => {
        if (!searchUnit) return [];
        return MOCK_UNITS.filter(u => u.unit_number.toLowerCase().includes(searchUnit.toLowerCase()));
    }, [searchUnit]);

    // Derived state for residents of selected unit
    const unitResidents = useMemo(() => {
        if (!selectedUnit) return [];
        return MOCK_PROFILES.filter(p =>
            p.id === selectedUnit.owner_id || p.id === selectedUnit.tenant_id
        );
    }, [selectedUnit]);

    const handleUnitSelect = (unit: Unit) => {
        // Debt check removed for privacy/business logic change
        setSelectedUnit(unit);
        setSearchUnit(unit.unit_number);
    };

    const handleHostSelect = (profile: Profile) => {
        setSelectedHost(profile);
        setStep(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUnit || !selectedHost) return;

        const newLog: AccessLog = {
            id: `manual-${Date.now()}`,
            community_id: 'c1',
            actor_name: 'Guardia (Manual)',
            timestamp: new Date().toISOString(),
            method: 'manual', // Updated to match type definition
            is_forced_entry: false,
            details: {
                guest_name: visitorData.name,
                guest_dni: visitorData.dni,
                unit: selectedUnit.unit_number,
                vehicle_plate: visitorData.plate || undefined,
                direction: 'in'
            },
            exit_time: null
        };

        // In a real app we would save to DB here
        console.log('Registering Manual Entry:', newLog);

        // Mock pushing to logs (for demo session persistence we'd need a context, but we can fake it locally)
        MOCK_LOGS.unshift(newLog);

        onSuccess(newLog);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
                    <h2 className="font-bold text-lg">Registro Manual</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {step === 1 ? (
                        <div className="space-y-6">
                            {/* STEP 1: SELECT UNIT & HOST */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">1. Buscar Unidad / Lote</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full text-lg p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 outline-none font-bold text-gray-800 placeholder:font-normal"
                                    placeholder="Ej: 101"
                                    value={searchUnit}
                                    onChange={(e) => {
                                        setSearchUnit(e.target.value);
                                        setSelectedUnit(null); // Reset selection on change
                                        setSelectedHost(null);
                                    }}
                                />
                                {/* Suggestions */}
                                {searchUnit && !selectedUnit && filteredUnits.length > 0 && (
                                    <div className="mt-2 border rounded-xl bg-white shadow-lg divide-y max-h-40 overflow-y-auto">
                                        {filteredUnits.map(u => (
                                            <button
                                                key={u.id}
                                                onClick={() => handleUnitSelect(u)}
                                                className="w-full text-left p-3 hover:bg-blue-50 flex justify-between items-center"
                                            >
                                                <span className="font-bold text-gray-800">{u.unit_number}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {selectedUnit && (
                                <div className="space-y-3 animate-in slide-in-from-top-2">
                                    <p className="text-sm font-medium text-gray-500">2. Seleccionar Anfitrión Responsable:</p>
                                    <div className="grid gap-2">
                                        {unitResidents.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => handleHostSelect(p)}
                                                className="flex items-center gap-3 p-3 border-2 border-slate-100 hover:border-blue-500 rounded-xl transition-all text-left group"
                                            >
                                                <div className="bg-slate-100 p-2 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">{p.first_name} {p.last_name}</div>
                                                    <div className="text-xs text-gray-500 capitalize">{p.role === 'owner' ? 'Propietario' : 'Inquilino'}</div>
                                                </div>
                                            </button>
                                        ))}
                                        {unitResidents.length === 0 && (
                                            <p className="text-red-500 text-sm">No hay residentes registrados en esta unidad.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4">
                            {/* STEP 2: VISITOR DATA */}
                            <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center mb-4">
                                <div>
                                    <span className="text-xs text-blue-600 font-bold uppercase block">Destino</span>
                                    <span className="font-bold text-slate-800">{selectedUnit?.unit_number}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-blue-600 font-bold uppercase block">Anfitrión</span>
                                    <span className="font-bold text-slate-800">{selectedHost?.first_name} {selectedHost?.last_name}</span>
                                </div>
                                <button type="button" onClick={() => setStep(1)} className="text-blue-600 text-xs font-bold underline">Cambiar</button>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">DNI / Cédula</label>
                                <input
                                    required
                                    autoFocus
                                    type="text"
                                    className="w-full text-lg p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none font-mono"
                                    placeholder="Ingrese números..."
                                    value={visitorData.dni}
                                    onChange={e => setVisitorData({ ...visitorData, dni: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full text-lg p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                                    placeholder="Nombre del visitante"
                                    value={visitorData.name}
                                    onChange={e => setVisitorData({ ...visitorData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Patente (Opcional)</label>
                                <div className="relative">
                                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        className="w-full text-lg p-3 pl-10 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none font-mono uppercase"
                                        placeholder="AA 123 BB"
                                        value={visitorData.plate}
                                        onChange={e => setVisitorData({ ...visitorData, plate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            >
                                <CheckCircle size={24} />
                                REGISTRAR INGRESO
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
