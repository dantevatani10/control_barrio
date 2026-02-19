'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Scan, AlertTriangle, CheckCircle, XCircle, Search, LogOut } from 'lucide-react';
import { mockService } from '@/lib/mock-service';
import { clsx } from 'clsx'; // Ensure clsx is installed or remove usage if not. Wait, assuming it is or I should use template literal.

interface ScanResult {
    valid: boolean;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
}


import ManualEntryForm from './ManualEntryForm';
import { MOCK_INVITATIONS, MOCK_UNITS, MOCK_WORKERS, MOCK_WORK_AUTHORIZATIONS, MOCK_PROFILES } from '@/lib/mockData';
import { Invitation, AccessLog } from '@/types';

// ... (existing imports)

export default function GuardScanner() {
    const [showScanner, setShowScanner] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [showOverride, setShowOverride] = useState(false);
    const [overrideReason, setOverrideReason] = useState('');

    // Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Invitation[]>([]);

    // Search Logic
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term.length < 2) {
            setSearchResults([]);
            return;
        }

        const termLower = term.toLowerCase();
        // Search Visitors
        const results = MOCK_INVITATIONS.filter(inv => {
            const isToday = new Date() >= new Date(inv.valid_from) && new Date() <= new Date(inv.valid_to);
            const matchesTerm =
                inv.guest_dni?.includes(term) ||
                inv.unit_id?.toLowerCase().includes(termLower) ||
                (inv.plate && inv.plate.toLowerCase().includes(termLower));

            return inv.status === 'active' && isToday && matchesTerm;
        });
        setSearchResults(results);

        // Also Mock searching logic doesn't support mixed types easily in this simple state, 
        // but for now we focus on Invitations. 
        // Logic for Workers is mainly via QR (handleScan) or we could add them here if requested.
        // For MVP Phase 7, prompt only asked for "Scan DNI/QR validation", so we keep search for Guests.
    };

    const handleGrantAccess = (inv: Invitation) => {
        // Simulate Scan Success
        const unit = MOCK_UNITS.find(u => u.id === inv.unit_id)?.unit_number || 'Lote Desconocido';
        const isSuccess = true; // Manual finding is always successful if invitation exists

        // NOTIFICATION LOGIC (Phase 9)
        if (inv.created_by_profile_id) {
            const creator = MOCK_PROFILES.find(p => p.id === inv.created_by_profile_id);
            if (creator) {
                console.log(`🔔 NOTIFICACIÓN ENVIADA A: ${creator.first_name} ${creator.last_name} (${creator.email})`);
                alert(`🔔 Notificación enviada EXCLUSIVAMENTE a: ${creator.first_name} ${creator.last_name}`);
            }
        } else {
            console.log(`🔔 NOTIFICACIÓN ENVIADA A TITULAR DEL LOTE`);
            alert(`🔔 Notificación enviada a Titular del Lote (Fallback)`);
        }

        setResult({
            valid: true,
            message: 'ACCESO AUTORIZADO',
            data: { guest: inv.guest_name, dni: inv.guest_dni || 'N/A', unit: unit }
        });
        setSearchTerm(''); // Clear search
        setSearchResults([]);
    };

    const handleScan = async (text: string) => {
        if (!text) return;
        setShowScanner(false);

        // Simulate processing delay
        await new Promise(r => setTimeout(r, 500));

        // 1. Check if it's a WORKER (by DNI match)
        const worker = MOCK_WORKERS.find(w => w.dni === text || w.id === text);
        if (worker) {
            const auth = MOCK_WORK_AUTHORIZATIONS.find(a => a.worker_id === worker.id && a.status === 'active');

            if (!auth) {
                setResult({
                    valid: false,
                    message: 'SIN AUTORIZACIÓN',
                    data: { guest: `${worker.first_name} ${worker.last_name}`, dni: worker.dni, unit: 'N/A' }
                });
                return;
            }

            // Date & Time Validation
            const now = new Date();
            const startDate = new Date(auth.start_date);
            const endDate = new Date(auth.end_date);

            // Normalize dates to ignore time for range check
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            if (now < startDate || now > endDate) {
                setResult({
                    valid: false,
                    message: 'FECHA NO VÁLIDA',
                    data: {
                        guest: `${worker.first_name} ${worker.last_name}`,
                        dni: worker.dni,
                        unit: MOCK_UNITS.find(u => u.id === auth.unit_id)?.unit_number,
                        error: `Vencido: ${endDate.toLocaleDateString()}`
                    }
                });
                return;
            }

            // Time Slot Validation
            if (auth.start_time && auth.end_time) {
                const currentMinutes = now.getHours() * 60 + now.getMinutes();
                const [startH, startM] = auth.start_time.split(':').map(Number);
                const [endH, endM] = auth.end_time.split(':').map(Number);
                const startMinutes = startH * 60 + startM;
                const endMinutes = endH * 60 + endM;

                if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
                    setResult({
                        valid: false,
                        message: 'HORARIO NO PERMITIDO',
                        data: {
                            guest: `${worker.first_name} ${worker.last_name}`,
                            dni: worker.dni,
                            unit: MOCK_UNITS.find(u => u.id === auth.unit_id)?.unit_number,
                            error: `Horario: ${auth.start_time} - ${auth.end_time}`
                        }
                    });
                    return;
                }
            }

            // SUCCESS
            setResult({
                valid: true,
                message: 'ACCESO PERMITIDO',
                data: {
                    guest: `${worker.first_name} ${worker.last_name}`,
                    dni: worker.dni,
                    unit: MOCK_UNITS.find(u => u.id === auth.unit_id)?.unit_number,
                    role: worker.role
                }
            });
            return;
        }

        // 2. Fallback to existing logic (Visitors)
        const isSuccess = Math.random() > 0.3; // 70% success rate for demo

        if (isSuccess) {
            setResult({
                valid: true,
                message: 'ACCESO AUTORIZADO',
                data: { guest: 'Juan Pérez', dni: '20.123.456', unit: 'Lote 101' }
            });
        } else {
            setResult({
                valid: false,
                message: 'SEGURO VENCIDO',
                data: { guest: 'Carlos López', dni: '20.987.654', unit: 'Lote 103' }
            });
        }
    };

    const resetScanner = () => {
        setResult(null);
        setShowOverride(false);
        setOverrideReason('');
        setShowScanner(false);
    };

    const confirmOverride = () => {
        if (!overrideReason) return;
        setResult({
            valid: true,
            message: 'ACCESO FORZADO',
            data: { ...result?.data, forced: true, reason: overrideReason }
        });
        setShowOverride(false);
    };

    // OVERRIDE MODAL
    if (showOverride) {
        return (
            <div className="absolute inset-0 z-50 bg-white p-6 flex flex-col items-center justify-center animate-in zoom-in-95">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <AlertTriangle size={48} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">FORZAR INGRESO</h2>
                <p className="text-center text-gray-500 mb-6">Esta acción quedará registrada en la auditoría.</p>

                <textarea
                    className="w-full p-4 border-2 border-red-100 rounded-xl mb-4 focus:border-red-500 focus:ring-red-500"
                    placeholder="Motivo obligatorio (ej: Dueño autorizó por teléfono)..."
                    rows={3}
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                />

                <div className="flex gap-3 w-full">
                    <button
                        onClick={() => setShowOverride(false)}
                        className="flex-1 py-3 font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={confirmOverride}
                        disabled={!overrideReason}
                        className="flex-1 py-3 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50"
                    >
                        CONFIRMAR
                    </button>
                </div>
            </div>
        );
    }

    // RESULT SCREEN (TRAFFIC LIGHT)
    if (result) {
        const isGreen = result.valid;
        return (
            <div className={clsx(
                "absolute inset-0 z-40 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95",
                isGreen ? "bg-green-500" : "bg-red-500"
            )}>
                <div className="bg-white/20 p-6 rounded-full backdrop-blur-sm mb-6 shadow-xl">
                    {isGreen ? <CheckCircle size={64} className="text-white" /> : <XCircle size={64} className="text-white" />}
                </div>

                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                    {result.message}
                </h2>

                {result.data && (
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-sm text-left text-white mb-8 border border-white/20 shadow-lg">
                        <div className="text-sm opacity-80 uppercase font-bold tracking-wider mb-1">Visitante</div>
                        <div className="text-2xl font-bold mb-4">{result.data.guest}</div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs opacity-75">DNI</div>
                                <div className="font-mono">{result.data.dni}</div>
                            </div>
                            <div>
                                <div className="text-xs opacity-75">Destino</div>
                                <div className="font-bold">{result.data.unit}</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full max-w-sm space-y-3">
                    {isGreen ? (
                        <button onClick={resetScanner} className="w-full bg-white text-green-600 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-green-50 transition-colors">
                            REGISTRAR ACCESO
                        </button>
                    ) : (
                        <>
                            <button onClick={resetScanner} className="w-full bg-white/20 text-white py-4 rounded-xl font-bold text-lg border-2 border-white/40 hover:bg-white/30 transition-colors">
                                Volver
                            </button>
                            <button onClick={() => setShowOverride(true)} className="w-full bg-white text-red-600 py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
                                <AlertTriangle size={20} /> FORZAR INGRESO
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    const handleManualSuccess = (log: AccessLog) => {
        setShowManualEntry(false);
        setResult({
            valid: true,
            message: 'REGISTRO MANUAL OK',
            data: {
                guest: log.details.guest_name,
                dni: log.details.guest_dni,
                unit: log.details.unit
            }
        });
    };

    // ... (existing helper functions)

    // IDLE SCREEN MODIFICATION
    return (
        <div className="relative w-full h-full bg-slate-900 flex flex-col items-center justify-center p-6">
            {/* MANUAL ENTRY MODAL */}
            {showManualEntry && (
                <ManualEntryForm
                    onClose={() => setShowManualEntry(false)}
                    onSuccess={handleManualSuccess}
                />
            )}

            {showScanner ? (
                // ... (Scanner UI - No Changes)
                <>
                    <Scanner
                        onScan={(res) => res && res[0] && handleScan(res[0].rawValue)}
                        classNames={{ container: 'w-full h-full absolute inset-0 object-cover' }}
                    />
                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
                            <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-500 -ml-1 -mt-1"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-500 -mr-1 -mt-1"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-500 -ml-1 -mb-1"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-500 -mr-1 -mb-1"></div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowScanner(false)}
                        className="absolute bottom-8 bg-white/20 backdrop-blur text-white px-6 py-2 rounded-full font-bold z-20 hover:bg-white/30"
                    >
                        Cancelar Cámara
                    </button>
                </>
            ) : (
                <div className="w-full max-w-sm space-y-6">
                    <button
                        onClick={() => setShowScanner(true)}
                        className="w-full group relative bg-blue-600 hover:bg-blue-500 text-white p-8 rounded-2xl shadow-2xl transition-all hover:scale-[1.02] flex flex-col items-center gap-3 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Scan size={48} className="relative z-10" />
                        <span className="relative z-10 text-xl font-bold tracking-wide">ESCANEAR QR</span>
                    </button>

                    {/* SEARCH SECTION */}
                    <div className="space-y-2 w-full">
                        <div className="flex gap-2 relative">
                            <input
                                type="text"
                                placeholder="Buscar DNI, Lote o Patente..."
                                className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all pl-10"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>

                        {/* Search Results */}
                        {searchTerm.length >= 2 && (
                            <div className="bg-slate-800/90 backdrop-blur rounded-xl border border-slate-700 overflow-hidden max-h-60 overflow-y-auto absolute w-full max-w-sm z-50 shadow-2xl">
                                {searchResults.length > 0 ? (
                                    <div className="divide-y divide-slate-700">
                                        {searchResults.map(inv => (
                                            <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors">
                                                <div>
                                                    <div className="font-bold text-white">{inv.guest_name}</div>
                                                    <div className="text-xs text-slate-400">
                                                        DNI: {inv.guest_dni} • {MOCK_UNITS.find(u => u.id === inv.unit_id)?.unit_number}
                                                    </div>
                                                    {inv.plate && <div className="text-xs text-yellow-500 font-mono mt-1">Patente: {inv.plate}</div>}
                                                </div>
                                                <button
                                                    onClick={() => handleGrantAccess(inv)}
                                                    className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-lg"
                                                >
                                                    <CheckCircle size={14} />
                                                    INGRESAR
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-slate-500 text-sm">
                                        <p className="mb-2">No se encontraron invitaciones vigentes.</p>
                                        <p className="text-xs opacity-70">Verifique que sea para hoy.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-slate-500 w-full px-4">
                        <div className="h-px bg-slate-700 flex-1"></div>
                        <span className="text-xs font-medium uppercase tracking-wider">O registro manual</span>
                        <div className="h-px bg-slate-700 flex-1"></div>
                    </div>

                    <button
                        onClick={() => setShowManualEntry(true)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl border border-slate-700 shadow-lg flex items-center justify-center gap-3 transition-colors"
                    >
                        <Search size={22} className="text-slate-400" />
                        <span className="font-bold">REGISTRAR VISITA MANUAL</span>
                    </button>

                    <p className="text-slate-500 text-sm text-center">
                        Utilice el registro manual para visitas sin QR, delivery o proveedores técnicos.
                    </p>
                </div>
            )}
        </div>
    );
}
