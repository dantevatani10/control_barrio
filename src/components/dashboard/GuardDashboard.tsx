'use client';

import { useState, useEffect } from 'react';
import { mockService } from '@/lib/mock-service';
import {
    Scan, Search, LogOut, Phone, Shield,
    List, User, RefreshCw, XCircle, CheckCircle,
    LayoutDashboard, LogIn, Menu, X, PlusCircle,
    MessageCircle, Contact
} from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { clsx } from 'clsx';
import { Unit, AccessLog, Invitation, Profile } from '@/types';
import { DemoWorker } from '@/lib/mock-service';
import { Modal } from '@/components/ui/Modal';

export default function GuardDashboard() {
    // State for Tabs
    const [activeTab, setActiveTab] = useState<'dashboard' | 'inside' | 'directory'>('dashboard');

    // Global Stats
    const [stats, setStats] = useState({ people_inside: 0, visits_today: 0 });

    // Dashboard State
    const [isScanning, setIsScanning] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [scanResult, setScanResult] = useState<{ valid: boolean; reason?: string; entity?: Invitation | DemoWorker | any; timestamp?: string } | null>(null);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);

    // Manual Entry Form State
    const [manualEntryData, setManualEntryData] = useState({
        unitId: '',
        firstName: '',
        lastName: '',
        dni: '',
        plate: '',
        brand: '',
        model: '',
        color: '',
        hasVehicle: false,
        searchResults: [] as { id: string; name: string; dni?: string; unit?: string; plate?: string; type: string; status: string }[]
    });
    const [units, setUnits] = useState<Unit[]>([]);

    // Inside Tab State
    const [peopleInside, setPeopleInside] = useState<AccessLog[]>([]);

    // Directory Tab State
    const [directory, setDirectory] = useState<{ name: string; unit?: string; phone: string; role: string }[]>([]);

    async function refreshData() {
        setStats(mockService.getStats());
        setPeopleInside(mockService.getAllActiveVisits());
        setDirectory(await mockService.getDirectory());
        setUnits(mockService.getUnits());
    }

    // --- INITIAL DATA & EFFECTS ---
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        refreshData();
    }, []);

    // Refresh data whenever tab changes or action is taken
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        refreshData();
    }, [activeTab]);



    // --- ACTIONS ---

    const handleScan = (data: string) => {
        if (!data) return;
        setIsScanning(false);
        const result = mockService.validateAccess(data);
        setScanResult({
            ...result,
            timestamp: new Date().toISOString()
        });
    };

    const confirmScanEntry = () => {
        if (scanResult && scanResult.valid) {
            mockService.recordEntry({
                actor_name: 'Guardia',
                method: 'qr',
                details: {
                    guest_name: scanResult.entity.guest_name || scanResult.entity.first_name,
                    guest_dni: scanResult.entity.guest_dni || scanResult.entity.dni,
                    unit: scanResult.entity.unit_id || 'Trabajador',
                    direction: 'in'
                }
            });
            setScanResult(null);
            alert('Ingreso registrado correctamente');
            refreshData();
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Create Visit Record (Invitation)
        mockService.createVisit({
            guest_name: `${manualEntryData.firstName} ${manualEntryData.lastName}`,
            guest_dni: manualEntryData.dni,
            unit_id: manualEntryData.unitId,
            plate: manualEntryData.plate
        });

        // 2. Record Entry
        mockService.recordEntry({
            actor_name: 'Guardia',
            method: 'manual',
            details: {
                guest_name: `${manualEntryData.firstName} ${manualEntryData.lastName}`,
                guest_dni: manualEntryData.dni,
                unit: manualEntryData.unitId,
                vehicle_plate: manualEntryData.plate,
                direction: 'in'
            }
        });

        alert('Ingreso Manual Registrado');
        setIsManualModalOpen(false);
        setManualEntryData({ unitId: '', firstName: '', lastName: '', dni: '', plate: '', brand: '', model: '', color: '', hasVehicle: false, searchResults: [] }); // Reset
        refreshData();
    };

    const handleExit = (id: string) => {
        if (confirm('¿Confirmar salida?')) {
            mockService.recordExit(id);
            refreshData();
        }
    };

    // --- RENDER ---
    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden font-sans text-slate-900">

            {/* A. DESKTOP SIDEBAR (Hidden on Mobile) */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-full shadow-xl shrink-0 transition-all z-20">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <Shield className="text-blue-500" size={28} />
                    <div>
                        <h1 className="font-bold text-sm tracking-wide">SEGURIDAD</h1>
                        <p className="text-xs text-slate-400">Santa Clara</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={clsx("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                            activeTab === 'dashboard' ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-slate-400 hover:bg-slate-800 hover:text-white")}
                    >
                        <LayoutDashboard size={20} /> Panel Principal
                    </button>
                    <button
                        onClick={() => setActiveTab('inside')}
                        className={clsx("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                            activeTab === 'inside' ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-slate-400 hover:bg-slate-800 hover:text-white")}
                    >
                        <User size={20} /> En Predio / Salidas
                    </button>
                    <button
                        onClick={() => setActiveTab('directory')}
                        className={clsx("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                            activeTab === 'directory' ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-slate-400 hover:bg-slate-800 hover:text-white")}
                    >
                        <Contact size={20} /> Directorio
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="bg-slate-800 rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">Estado del Sistema</p>
                        <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            ONLINE
                        </div>
                    </div>
                </div>
            </aside>


            {/* B. MAIN CONTENT (Responsive Padding) */}
            <main className="flex-1 overflow-y-auto pb-24 md:pb-0 p-4 md:p-8 relative">

                {/* --- VISTA A: DASHBOARD --- */}
                {activeTab === 'dashboard' && (
                    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                        <header className="mb-6 md:mb-8 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-slate-800">Panel de Control</h2>
                                <p className="text-xs md:text-sm text-slate-500">Resumen y acciones rápidas.</p>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-3xl font-mono font-bold text-slate-900">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </header>

                        {/* KPIs Grid */}
                        <div className="grid grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-8">
                            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div>
                                    <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider">Adentro</p>
                                    <p className="text-2xl md:text-4xl font-bold text-slate-900">{stats.people_inside}</p>
                                </div>
                                <div className="self-end md:self-center bg-blue-50 p-2 md:p-4 rounded-xl text-blue-600">
                                    <User size={20} className="md:w-8 md:h-8" />
                                </div>
                            </div>
                            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div>
                                    <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider">Visitas Hoy</p>
                                    <p className="text-2xl md:text-4xl font-bold text-slate-900">{stats.visits_today}</p>
                                </div>
                                <div className="self-end md:self-center bg-green-50 p-2 md:p-4 rounded-xl text-green-600">
                                    <CheckCircle size={20} className="md:w-8 md:h-8" />
                                </div>
                            </div>
                        </div>

                        {/* Block 1: Invitation Entry (Scan or Search) */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Ingreso con Invitación</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsScanning(true)}
                                    className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    <Scan size={24} />
                                    <span className="text-lg font-bold">ESCANEAR QR</span>
                                </button>

                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
                                        <Search size={18} className="text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar por DNI o Patente..."
                                            className="flex-1 outline-none text-sm font-medium"
                                            onChange={(e) => {
                                                const q = e.target.value;
                                                if (q.length > 2) {
                                                    const res = mockService.getVisitsForToday(q);
                                                    // Only show first match for demo simplicity or map all
                                                    // Here we'll just store results in a local constraint if needed,
                                                    // but for now let's use a quick popover or state.
                                                    // Actually, let's just use the state to render results below.
                                                    setManualEntryData(prev => ({ ...prev, searchResults: res }));
                                                } else {
                                                    setManualEntryData(prev => ({ ...prev, searchResults: [] }));
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 overflow-y-auto max-h-32 space-y-2">
                                        {manualEntryData.searchResults?.map((res) => (
                                            <div key={res.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-700">{res.name}</p>
                                                    <p className="text-[10px] text-slate-500">{res.unit} • {res.plate || 'Sin Auto'}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        mockService.recordEntry({
                                                            actor_name: 'Guardia',
                                                            method: 'manual',
                                                            details: {
                                                                guest_name: res.name,
                                                                guest_dni: res.dni,
                                                                unit: res.unit || 'Invitado',
                                                                direction: 'in',
                                                                vehicle_plate: res.plate
                                                            }
                                                        });
                                                        alert(`Ingreso registrado: ${res.name}`);
                                                        setManualEntryData(prev => ({ ...prev, searchResults: [] }));
                                                        refreshData();
                                                    }}
                                                    className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded hover:bg-green-200"
                                                >
                                                    DAR INGRESO
                                                </button>
                                            </div>
                                        ))}
                                        {!manualEntryData.searchResults?.length && (
                                            <p className="text-xs text-slate-400 text-center mt-2">Ingrese 3 caracteres para buscar.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Block 2: Spontaneous Entry */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Ingreso Espontáneo</h3>
                            <button
                                onClick={() => setIsManualModalOpen(true)}
                                className="w-full bg-white text-slate-700 p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                <PlusCircle size={24} className="text-blue-600" />
                                <span className="text-lg font-bold">REGISTRAR VISITANTE MANUAL</span>
                            </button>
                        </div>
                    </div>
                )}


                {/* --- VISTA B: EN PREDIO --- */}
                {activeTab === 'inside' && (
                    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                        <header className="mb-4 md:mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800">Control de Egresos</h2>
                            <p className="text-xs md:text-sm text-slate-500">Personas dentro del barrio.</p>
                        </header>

                        <div className="grid grid-cols-1 gap-3">
                            {peopleInside.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-slate-400">No hay visitas activas.</p>
                                </div>
                            ) : (
                                peopleInside.map((person) => (
                                    <div key={person.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-slate-900">{person.details.guest_name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600">{person.details.unit}</span>
                                                <span className="text-xs text-slate-400 font-mono">
                                                    {new Date(person.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {person.details.vehicle_plate && (
                                                <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                    <div className="bg-slate-100 px-1 rounded text-[10px] font-mono border border-slate-200">{person.details.vehicle_plate}</div>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleExit(person.id)}
                                            className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 border border-red-100"
                                        >
                                            <LogOut size={16} /> <span className="hidden md:inline">SALIDA</span>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}


                {/* --- VISTA C: DIRECTORIO --- */}
                {activeTab === 'directory' && (
                    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                        <header className="mb-4 md:mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800">Directorio y Contacto</h2>
                            <p className="text-xs md:text-sm text-slate-500">Contactar a propietarios e inquilinos.</p>
                        </header>

                        <div className="space-y-3">
                            {directory.map((item, idx) => {
                                const cleanPhone = item.phone ? item.phone.replace(/\D/g, '') : '';
                                return (
                                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-center justify-center w-10 h-10 bg-blue-50 rounded-lg text-blue-700 font-bold text-xs">
                                                <span>{item.unit?.split(' ')[1] || 'S/L'}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-sm md:text-base">{item.name}</h3>
                                                <p className="text-[10px] md:text-xs text-slate-500 uppercase flex items-center gap-1">
                                                    {item.role}
                                                    {item.phone && <span className="text-slate-400 hidden sm:inline">• {item.phone}</span>}
                                                </p>
                                                {/* Mobile visible phone */}
                                                {item.phone && <p className="text-xs text-slate-400 sm:hidden mt-0.5">{item.phone}</p>}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {/* WhatsApp Button */}
                                            {item.phone && (
                                                <a
                                                    href={`https://wa.me/${cleanPhone}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-green-500 text-white p-3 rounded-full shadow-sm shadow-green-200 active:scale-95 transition-transform"
                                                    title="Enviar WhatsApp"
                                                >
                                                    <MessageCircle size={20} />
                                                </a>
                                            )}

                                            {/* Call Button */}
                                            {item.phone && (
                                                <a
                                                    href={`tel:${item.phone}`}
                                                    className="bg-blue-50 text-blue-600 p-3 rounded-full border border-blue-100 active:scale-95 transition-transform"
                                                    title="Llamar"
                                                >
                                                    <Phone size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>


            {/* C. MOBILE BOTTOM NAVBAR (Hidden on Desktop) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 text-white flex justify-around items-center shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] z-40 pb-safe">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={clsx("flex flex-col items-center gap-1 w-16 transition-colors", activeTab === 'dashboard' ? "text-blue-400" : "text-slate-400")}
                >
                    <LayoutDashboard size={24} />
                    <span className="text-[9px] font-bold">Panel</span>
                </button>
                <div className="w-px h-8 bg-slate-800"></div>
                <button
                    onClick={() => setActiveTab('inside')}
                    className={clsx("flex flex-col items-center gap-1 w-16 transition-colors", activeTab === 'inside' ? "text-blue-400" : "text-slate-400")}
                >
                    <User size={24} />
                    <span className="text-[9px] font-bold">Adentro</span>
                </button>
                <div className="w-px h-8 bg-slate-800"></div>
                <button
                    onClick={() => setActiveTab('directory')}
                    className={clsx("flex flex-col items-center gap-1 w-16 transition-colors", activeTab === 'directory' ? "text-blue-400" : "text-slate-400")}
                >
                    <Contact size={24} />
                    <span className="text-[9px] font-bold">Dir</span>
                </button>
            </nav>


            {/* --- MODALS --- */}

            {/* MANUAL ENTRY MODAL (Mobile Optimized) */}
            <Modal
                isOpen={isManualModalOpen}
                onClose={() => setIsManualModalOpen(false)}
                title={<>Registrar Ingreso</>}
                maxWidth="md"
                headerColorClass="bg-slate-50 text-slate-800 border-b border-gray-100"
            >

                <form onSubmit={handleManualSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Destino (Lote)</label>
                        <select
                            required
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                            value={manualEntryData.unitId}
                            onChange={e => setManualEntryData({ ...manualEntryData, unitId: e.target.value })}
                        >
                            <option value="">Seleccionar Lote...</option>
                            {units.map(u => (
                                <option key={u.id} value={u.unit_number}>{u.unit_number}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">DNI (Solo Números)</label>
                        <input
                            required
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xl tracking-widest"
                            placeholder="00000000"
                            value={manualEntryData.dni}
                            onChange={e => setManualEntryData({ ...manualEntryData, dni: e.target.value.replace(/\D/g, '') })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nombre</label>
                            <input
                                required type="text"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                value={manualEntryData.firstName}
                                onChange={e => setManualEntryData({ ...manualEntryData, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Apellido</label>
                            <input
                                required type="text"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                value={manualEntryData.lastName}
                                onChange={e => setManualEntryData({ ...manualEntryData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-blue-600 rounded"
                                checked={manualEntryData.hasVehicle}
                                onChange={e => setManualEntryData({ ...manualEntryData, hasVehicle: e.target.checked })}
                            />
                            <span className="text-sm font-bold text-slate-700">¿Ingresa con Vehículo?</span>
                        </label>

                        {(manualEntryData.hasVehicle) && (
                            <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <input
                                        type="text" placeholder="Marca (Ej: Ford)"
                                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                                        value={manualEntryData.brand}
                                        onChange={e => setManualEntryData({ ...manualEntryData, brand: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text" placeholder="Modelo (Ej: Focus)"
                                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                                        value={manualEntryData.model}
                                        onChange={e => setManualEntryData({ ...manualEntryData, model: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text" placeholder="Color (Ej: Gris)"
                                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                                        value={manualEntryData.color}
                                        onChange={e => setManualEntryData({ ...manualEntryData, color: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text" placeholder="PATENTE"
                                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-mono uppercase"
                                        value={manualEntryData.plate}
                                        onChange={e => setManualEntryData({ ...manualEntryData, plate: e.target.value.toUpperCase() })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>


                    <div className="pt-2">
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all">
                            GUARDAR E INGRESAR
                        </button>
                    </div>
                    <div className="pb-4 md:pb-0"></div> {/* Spacer for mobile bottom */}
                </form>
            </Modal>

            {/* QR SCANNER OVERLAY */}
            {
                isScanning && (
                    <div className="fixed inset-0 z-50 bg-black flex flex-col">
                        <div className="p-4 flex justify-end absolute top-0 right-0 z-10">
                            <button onClick={() => setIsScanning(false)} className="bg-black/50 text-white p-3 rounded-full backdrop-blur-md">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 relative">
                            <Scanner onScan={(result) => handleScan(result[0].rawValue)} />
                            {/* Overlay Frame */}
                            <div className="absolute inset-0 border-[50px] border-black/50 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 border-4 border-white/80 rounded-3xl"></div>
                            </div>
                        </div>
                        <div className="bg-black text-white p-8 text-center">
                            <p className="font-bold">Escaneando...</p>
                            <p className="text-sm text-gray-400">Apunte al código QR del visitante</p>
                        </div>
                    </div>
                )
            }

            {/* SCAN RESULT RESULT */}
            {
                scanResult && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
                        <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-center`}>
                            <div className={`p-8 ${scanResult.valid ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                                <div className="mb-4 flex justify-center">
                                    {scanResult.valid ? <CheckCircle size={80} /> : <XCircle size={80} />}
                                </div>
                                <h2 className="text-3xl font-bold">{scanResult.valid ? 'ACCESO PERMITIDO' : 'DENEGADO'}</h2>
                                <p className="opacity-90 mt-2 font-medium">{scanResult.reason || 'Documentación Validada'}</p>
                            </div>

                            <div className="p-8">
                                {scanResult.entity && (
                                    <div className="text-left mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Visitante</p>
                                        <p className="text-xl font-bold text-slate-900">{scanResult.entity.guest_name || scanResult.entity.first_name + ' ' + scanResult.entity.last_name}</p>
                                        <p className="text-sm text-slate-500 mt-1">{scanResult.entity.unit_id || 'Personal Autorizado'}</p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {scanResult.valid && (
                                        <button
                                            onClick={confirmScanEntry}
                                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 shadow-lg transform transition active:scale-[0.98]"
                                        >
                                            Registrar Ingreso
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setScanResult(null)}
                                        className="w-full py-4 bg-white text-slate-500 border border-slate-200 rounded-xl font-bold hover:bg-slate-50"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }


        </div >
    );
}
