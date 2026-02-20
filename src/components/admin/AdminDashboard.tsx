'use client';

import { useState, useEffect } from 'react';
import { mockService, DemoWorker } from '@/lib/mock-service';
import { Unit, Worker, Profile, AccessLog, Vehicle, Role } from '@/types';
import {
    LayoutDashboard, Users, FileText, Settings,
    Plus, Search, Trash2, Home, Phone, UserPlus,
    X, Save, CheckCircle, Shield, Briefcase, Clock,
    Download, ArrowLeft, AlertCircle, FileCheck, Ban, Check,
    Wallet, TrendingDown
} from 'lucide-react';
import { clsx } from 'clsx';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import KPIGrid from './KPIGrid';

export default function AdminDashboard() {
    const [mounted, setMounted] = useState(false);
    const [activeModule, setActiveModule] = useState<'menu' | 'lots' | 'workers' | 'guards' | 'history'>('menu');

    // Data State
    const [units, setUnits] = useState<Unit[]>([]);
    const [workers, setWorkers] = useState<DemoWorker[]>([]); // Using DemoWorker type internally
    const [guards, setGuards] = useState<Profile[]>([]);
    const [logs, setLogs] = useState<AccessLog[]>([]);

    const refreshAllData = () => {
        setUnits(mockService.getUnits());
        setWorkers(mockService.getWorkers());
        setGuards(mockService.getGuards());
        setLogs(mockService.getAllLogs());
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        refreshAllData();
    }, []);

    // --- MODULE: LOTS ---
    const [isNewUnitModalOpen, setIsNewUnitModalOpen] = useState(false);
    const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'residents' | 'users' | 'vehicles'>('residents');
    const [newUnitData, setNewUnitData] = useState({
        unitNumber: '',
        residents: [] as { name: string; role: Role }[],
        contacts: [] as { name: string; phone: string; priority: 'primary' | 'secondary' | 'emergency' }[],
        activeVehicles: [] as Partial<Vehicle>[]
    });

    const handleEditUnit = (unit: Unit) => {
        setEditingUnitId(unit.id);
        const unitVehicles = mockService.getVehiclesByUnit(unit.unit_number);
        setNewUnitData({
            unitNumber: unit.unit_number,
            residents: unit.residents?.map(r => ({ name: r.name, role: r.role })) || [],
            contacts: unit.contacts?.map(c => ({ name: c.name, phone: c.phone || '', priority: 'primary' })) || [],
            activeVehicles: unitVehicles.map(v => ({ ...v }))
        });
        setIsNewUnitModalOpen(true);
    };

    const handleSaveUnit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUnitId) {
            // Update existing unit (Mock implementation)
            const updatedUnits = units.map(u =>
                u.id === editingUnitId
                    ? { ...u, unit_number: newUnitData.unitNumber, residents: newUnitData.residents.map(r => ({ ...r, id: Math.random().toString(), unit_id: u.id, type: 'resident' as const })) }
                    : u
            );
            mockService.updateUnit(editingUnitId, { ...newUnitData, vehicles: newUnitData.activeVehicles });
            alert('✅ Lote Actualizado Exitosamente');
        } else {
            mockService.createUnit({ ...newUnitData, vehicles: newUnitData.activeVehicles });
            alert('✅ Lote Creado Exitosamente');
        }

        setIsNewUnitModalOpen(false);
        setEditingUnitId(null);
        setNewUnitData({ unitNumber: '', residents: [], contacts: [], activeVehicles: [] });
        refreshAllData();
    };

    const handleSendRecoveryEmail = (name: string) => {
        alert(`✅ Correo de recuperación enviado con éxito a ${name}`);
    };

    // --- MODULE: WORKERS ---
    const handleWorkerDecision = (id: string, status: 'approved' | 'rejected') => {
        if (confirm(`¿Estás seguro de ${status === 'approved' ? 'APROBAR' : 'RECHAZAR'} a este trabajador?`)) {
            mockService.updateWorkerStatus(id, status);
            refreshAllData();
        }
    };

    // --- MODULE: GUARDS ---
    const [isNewGuardModalOpen, setIsNewGuardModalOpen] = useState(false);
    const [newGuardData, setNewGuardData] = useState<{ first_name: string; last_name: string; email: string; shift: 'Mañana' | 'Tarde' | 'Noche' }>({
        first_name: '', last_name: '', email: '', shift: 'Mañana'
    });

    const handleCreateGuard = (e: React.FormEvent) => {
        e.preventDefault();
        mockService.createGuard(newGuardData);
        alert('✅ Guardia Creado Exitosamente');
        setIsNewGuardModalOpen(false);
        setNewGuardData({ first_name: '', last_name: '', email: '', shift: 'Mañana' });
        refreshAllData();
    };

    const handleShiftChange = (id: string, shift: 'Mañana' | 'Tarde' | 'Noche') => {
        mockService.updateGuardShift(id, shift);
        refreshAllData();
    };

    // --- MODULE: HISTORY ---
    const exportToCSV = () => {
        const headers = ['Fecha', 'Hora', 'Nombre', 'Metodo', 'Direccion', 'Detalles'];
        const rows = logs.map(l => [
            new Date(l.timestamp).toLocaleDateString(),
            new Date(l.timestamp).toLocaleTimeString(),
            l.actor_name,
            l.method,
            l.details?.direction === 'in' ? 'Entrada' : 'Salida',
            JSON.stringify(l.details || {})
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `historial_accesos_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!mounted) return <div className="p-10 text-center text-2xl font-bold text-slate-400">Cargando Panel de Administración...</div>;

    // --- RENDER HELPERS ---

    const renderBackButton = () => (
        <button
            onClick={() => setActiveModule('menu')}
            className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-lg active:scale-95 transition-transform"
        >
            <ArrowLeft size={32} /> VOLVER AL MENÚ
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            {/* HEADER */}
            <header className="bg-blue-900 text-white p-6 shadow-lg">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                        <LayoutDashboard size={32} />
                        Panel de Control
                    </h1>
                    <div className="text-right">
                        <p className="text-sm opacity-80">Bienvenido, Administración</p>
                        <p className="font-bold text-lg">Barrio Privado Demo</p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-4 md:p-8">

                {/* --- MAIN MENU --- */}
                {activeModule === 'menu' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">

                        {/* Financial KPIs */}
                        <KPIGrid />

                        {/* Delinquency Alert Widget */}
                        {(() => {
                            const debtors = units
                                .filter((u: any) => (u as any).debt > 0)
                                .sort((a: any, b: any) => (b as any).debt - (a as any).debt)
                                .slice(0, 5);
                            if (debtors.length === 0) return null;
                            return (
                                <div className="bg-white border border-rose-200 rounded-2xl p-6 mb-8 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="bg-rose-100 p-2 rounded-full text-rose-600">
                                            <TrendingDown size={18} />
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Alerta de Morosidad — Top Deudores</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {debtors.map((u: any) => (
                                            <div key={u.id} className="flex items-center justify-between bg-rose-50/60 px-4 py-3 rounded-xl">
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{(u as any).residentName}</p>
                                                    <p className="text-xs text-slate-500">{u.unit_number}</p>
                                                </div>
                                                <span className="text-rose-600 font-extrabold text-sm">
                                                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format((u as any).debt)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Menu Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button
                                onClick={() => setActiveModule('lots')}
                                className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-left flex flex-col gap-4 border-l-8 border-blue-500 group"
                            >
                                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Home size={40} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Gestión de Lotes y Vecinos</h2>
                                    <p className="text-slate-500 text-lg">Ver padrón, crear lotes, gestionar familias.</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveModule('workers')}
                                className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-left flex flex-col gap-4 border-l-8 border-orange-500 group"
                            >
                                <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                    <Briefcase size={40} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Aprobar Trabajadores (ART)</h2>
                                    <p className="text-slate-500 text-lg">Revisar seguros y autorizar ingresos.</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveModule('guards')}
                                className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-left flex flex-col gap-4 border-l-8 border-indigo-500 group"
                            >
                                <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Shield size={40} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Personal de Guardia</h2>
                                    <p className="text-slate-500 text-lg">Gestionar guardias y asignar turnos.</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveModule('history')}
                                className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-left flex flex-col gap-4 border-l-8 border-emerald-500 group"
                            >
                                <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <FileText size={40} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Historial de Accesos</h2>
                                    <p className="text-slate-500 text-lg">Ver registros y exportar a Excel.</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* --- MODULE: LOTS --- */}
                {activeModule === 'lots' && (
                    <div className="animate-in fade-in">
                        {renderBackButton()}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-slate-800">🏢 Padron de Lotes</h2>
                            <button
                                onClick={() => setIsNewUnitModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center gap-3"
                            >
                                <Plus size={28} /> NUEVO LOTE
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200">
                            <table className="w-full">
                                <thead className="bg-slate-100 text-slate-500 uppercase text-sm font-bold">
                                    <tr>
                                        <th className="p-6 text-left">Unidad</th>
                                        <th className="p-6 text-left">Estado</th>
                                        <th className="p-6 text-left">Contactos</th>
                                        <th className="p-6 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-lg">
                                    {units.map(unit => (
                                        <tr key={unit.id} className="hover:bg-slate-50">
                                            <td className="p-6 font-bold">{unit.unit_number}</td>
                                            <td className="p-6">
                                                <Badge variant={unit.status === 'up_to_date' ? 'success' : 'danger'} className="px-4 py-2">
                                                    {unit.status === 'up_to_date' ? 'AL DÍA' : 'DEUDA'}
                                                </Badge>
                                            </td>
                                            <td className="p-6 text-slate-600">
                                                {unit.contacts?.[0]?.name || 'Sin contacto'}
                                                {unit.contacts?.[0] && <div className="text-sm text-slate-400">{unit.contacts[0].phone}</div>}
                                            </td>
                                            <td className="p-6 text-right">
                                                <button onClick={() => handleEditUnit(unit)} className="text-blue-600 font-bold hover:underline">GESTIONAR</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- MODULE: WORKERS --- */}
                {activeModule === 'workers' && (
                    <div className="animate-in fade-in">
                        {renderBackButton()}
                        <h2 className="text-3xl font-bold text-slate-800 mb-6">👷 Aprobar Trabajadores</h2>

                        <div className="space-y-4">
                            {workers.filter(w => w.status === 'pending').length === 0 && (
                                <div className="p-10 bg-white rounded-3xl text-center shadow-sm">
                                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-700">¡Todo al día!</h3>
                                    <p className="text-slate-500">No hay trabajadores pendientes de aprobación.</p>
                                </div>
                            )}

                            {workers.map(worker => (
                                <div key={worker.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className={clsx("w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl",
                                            worker.status === 'pending' ? "bg-orange-100 text-orange-600" :
                                                worker.status === 'approved' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                        )}>
                                            {worker.first_name[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800">{worker.first_name} {worker.last_name}</h3>
                                            <p className="text-slate-500 font-mono">DNI: {worker.dni} • {worker.role}</p>
                                            <div className="flex gap-2 mt-2">
                                                <span className="bg-slate-100 px-3 py-1 rounded-lg text-sm font-bold text-slate-600">
                                                    ART: Vence {worker.insurance_expiry || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {worker.status === 'pending' ? (
                                        <div className="flex gap-4 w-full md:w-auto">
                                            <button
                                                onClick={() => handleWorkerDecision(worker.id, 'rejected')}
                                                className="flex-1 md:flex-none py-4 px-6 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <X size={24} /> RECHAZAR
                                            </button>
                                            <button
                                                onClick={() => handleWorkerDecision(worker.id, 'approved')}
                                                className="flex-1 md:flex-none py-4 px-8 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-600/30 transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={24} /> APROBAR
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="px-6 py-3 bg-slate-50 rounded-xl font-bold text-slate-500 border border-slate-200">
                                            {worker.status === 'approved' ? 'YA APROBADO' : 'RECHAZADO'}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- MODULE: GUARDS --- */}
                {activeModule === 'guards' && (
                    <div className="animate-in fade-in">
                        {renderBackButton()}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-slate-800">👮 Personal de Guardia</h2>
                            <button
                                onClick={() => setIsNewGuardModalOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center gap-3"
                            >
                                <Plus size={28} /> NUEVO GUARDIA
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {guards.map(guard => (
                                <div key={guard.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Shield size={100} />
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold text-slate-800">{guard.first_name} {guard.last_name}</h3>
                                        <p className="text-slate-500 mb-4">{guard.email || 'Sin email'}</p>

                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Turno Asignado</label>
                                        <select
                                            value={guard.shift || 'Mañana'}
                                            onChange={(e) => handleShiftChange(guard.id, e.target.value as 'Mañana' | 'Tarde' | 'Noche')}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="Mañana">☀️ Mañana (06-14)</option>
                                            <option value="Tarde">wed Tarde (14-22)</option>
                                            <option value="Noche">🌙 Noche (22-06)</option>
                                        </select>

                                        <button className="w-full mt-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors">
                                            RESTABLECER CONTRASEÑA
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- MODULE: HISTORY --- */}
                {activeModule === 'history' && (
                    <div className="animate-in fade-in">
                        {renderBackButton()}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800">📊 Historial de Accesos</h2>
                                <p className="text-slate-500">Registro completo de movimientos.</p>
                            </div>
                            <button
                                onClick={exportToCSV}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center gap-3"
                            >
                                <Download size={28} /> EXPORTAR EXCEL
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200">
                            <div className="max-h-[600px] overflow-y-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-100 text-slate-500 uppercase text-xs font-bold sticky top-0">
                                        <tr>
                                            <th className="p-4 text-left">Hora</th>
                                            <th className="p-4 text-left">Quién</th>
                                            <th className="p-4 text-left">Método</th>
                                            <th className="p-4 text-center">Movimiento</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-mono text-sm">
                                        {logs.map(log => (
                                            <tr key={log.id} className="hover:bg-slate-50">
                                                <td className="p-4">
                                                    {new Date(log.timestamp).toLocaleDateString()} <br />
                                                    <span className="font-bold text-slate-800">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-bold block text-slate-800">{log.actor_name}</span>
                                                    <span className="text-xs text-slate-400">{log.details?.guest_dni || 'ID: ' + log.id.slice(-4)}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold uppercase">{log.method}</span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    {log.details?.direction === 'in' ? (
                                                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-xs">
                                                            ENTRADA <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold text-xs">
                                                            SALIDA
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* --- MODALS (Reused logic but accessible style) --- */}

            {/* NEW UNIT MODAL */}
            <Modal
                isOpen={isNewUnitModalOpen}
                onClose={() => setIsNewUnitModalOpen(false)}
                title={<>🏡 {editingUnitId ? 'Editar Lote' : 'Crear Nuevo Lote'}</>}
                maxWidth="4xl"
            >

                <div className="p-6 border-b border-slate-200 bg-slate-50">
                    <label className="block font-bold text-slate-500 text-sm uppercase mb-1">NÚMERO DE LOTE</label>
                    <input required type="text" placeholder="Ej: Lote 105" className="w-full text-2xl font-bold bg-transparent border-none focus:ring-0 p-0 text-slate-800 placeholder-slate-300"
                        value={newUnitData.unitNumber} onChange={e => setNewUnitData({ ...newUnitData, unitNumber: e.target.value })} />
                </div>

                {/* TABS */}
                <div className="flex bg-slate-100 p-2 gap-2">
                    <button
                        onClick={() => setActiveTab('residents')}
                        className={clsx("flex-1 py-3 rounded-xl font-bold text-lg transition-all", activeTab === 'residents' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:bg-slate-200")}
                    >
                        👥 Habitantes
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={clsx("flex-1 py-3 rounded-xl font-bold text-lg transition-all", activeTab === 'users' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:bg-slate-200")}
                    >
                        📱 Usuarios App
                    </button>
                    <button
                        onClick={() => setActiveTab('vehicles')}
                        className={clsx("flex-1 py-3 rounded-xl font-bold text-lg transition-all", activeTab === 'vehicles' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:bg-slate-200")}
                    >
                        🚗 Vehículos
                    </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8 flex-1 bg-slate-50">

                    {/* TAB: RESIDENTS */}
                    {activeTab === 'residents' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-xl text-slate-700">Listado de Habitantes</h4>
                                <button type="button" onClick={() => setNewUnitData(prev => ({ ...prev, residents: [...prev.residents, { name: '', role: 'owner' }] }))}
                                    className="text-blue-600 font-bold flex items-center gap-2 text-lg hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">
                                    <Plus size={24} /> AGREGAR
                                </button>
                            </div>
                            {newUnitData.residents.map((r, i) => (
                                <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg">
                                        {i + 1}
                                    </div>
                                    <input type="text" placeholder="Nombre completo" className="flex-1 p-3 border border-slate-300 rounded-xl font-bold text-slate-700"
                                        value={r.name} onChange={e => {
                                            const newRes = [...newUnitData.residents]; newRes[i].name = e.target.value; setNewUnitData({ ...newUnitData, residents: newRes });
                                        }} />
                                    <select className="p-3 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-600"
                                        value={r.role} onChange={e => {
                                            const newRes = [...newUnitData.residents]; newRes[i].role = e.target.value as Role; setNewUnitData({ ...newUnitData, residents: newRes });
                                        }}>
                                        <option value="owner">Propietario</option>
                                        <option value="tenant">Inquilino</option>
                                        <option value="resident">Familiar</option>
                                    </select>
                                </div>
                            ))}
                            {newUnitData.residents.length === 0 && (
                                <div className="text-center py-10 text-slate-400">
                                    <Users size={48} className="mx-auto mb-2 opacity-20" />
                                    <p className="italic">No hay habitantes registrados aún.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: APP USERS */}
                    {activeTab === 'users' && (
                        <div className="space-y-4 animate-in fade-in">
                            <h4 className="font-bold text-xl text-slate-700 mb-4">Gestión de Acceso a la App</h4>
                            {newUnitData.residents.length > 0 ? (
                                newUnitData.residents.map((r, i) => (
                                    <div key={i} className="flex flex-col md:flex-row gap-4 items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                {r.name ? r.name[0] : '?'}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-lg text-slate-800">{r.name || 'Sin Nombre'}</h5>
                                                <p className="text-sm text-slate-400">Estado: <span className="text-green-600 font-bold">Activo</span></p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full md:w-auto">
                                            <button onClick={() => alert('Usuario ya creado')} className="flex-1 md:flex-none px-4 py-2 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed">
                                                Crear Usuario
                                            </button>
                                            <button
                                                onClick={() => handleSendRecoveryEmail(r.name)}
                                                className="flex-1 md:flex-none px-4 py-3 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <span className="text-xl">🔑</span> Enviar Recup.
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
                                    <p className="text-slate-500">Primero agregue habitantes en la pestaña &quot;Habitantes&quot;.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: VEHICLES */}
                    {activeTab === 'vehicles' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-xl text-slate-700">Vehículos Autorizados</h4>
                                <button
                                    type="button"
                                    onClick={() => setNewUnitData(prev => ({
                                        ...prev,
                                        activeVehicles: [...prev.activeVehicles, { brand: '', model: '', year: '', color: '', license_plate: '', id: `temp-${Date.now()}` }]
                                    }))}
                                    className="text-blue-600 font-bold flex items-center gap-2 text-lg hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">
                                    <Plus size={24} /> AGREGAR
                                </button>
                            </div>

                            {newUnitData.activeVehicles?.map((v, i) => (
                                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
                                    <button
                                        onClick={() => {
                                            const newVehicles = [...newUnitData.activeVehicles];
                                            newVehicles.splice(i, 1);
                                            setNewUnitData({ ...newUnitData, activeVehicles: newVehicles });
                                        }}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-2"
                                    >
                                        <Trash2 size={20} />
                                    </button>

                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Marca</label>
                                        <input type="text" placeholder="Ej: Toyota" className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-700"
                                            value={v.brand} onChange={e => {
                                                const newVehicles = [...newUnitData.activeVehicles]; newVehicles[i].brand = e.target.value; setNewUnitData({ ...newUnitData, activeVehicles: newVehicles });
                                            }} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Modelo</label>
                                        <input type="text" placeholder="Ej: Corolla" className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-700"
                                            value={v.model} onChange={e => {
                                                const newVehicles = [...newUnitData.activeVehicles]; newVehicles[i].model = e.target.value; setNewUnitData({ ...newUnitData, activeVehicles: newVehicles });
                                            }} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Año</label>
                                        <input type="text" placeholder="Ej: 2022" className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-700"
                                            value={v.year || ''} onChange={e => {
                                                const newVehicles = [...newUnitData.activeVehicles]; newVehicles[i].year = e.target.value; setNewUnitData({ ...newUnitData, activeVehicles: newVehicles });
                                            }} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Color</label>
                                        <input type="text" placeholder="Ej: Blanco" className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-700"
                                            value={v.color} onChange={e => {
                                                const newVehicles = [...newUnitData.activeVehicles]; newVehicles[i].color = e.target.value; setNewUnitData({ ...newUnitData, activeVehicles: newVehicles });
                                            }} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Patente</label>
                                        <input type="text" placeholder="Ej: AA123BB" className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-700 uppercase"
                                            value={v.license_plate} onChange={e => {
                                                const newVehicles = [...newUnitData.activeVehicles]; newVehicles[i].license_plate = e.target.value.toUpperCase(); setNewUnitData({ ...newUnitData, activeVehicles: newVehicles });
                                            }} />
                                    </div>
                                </div>
                            ))}

                            {(!newUnitData.activeVehicles || newUnitData.activeVehicles.length === 0) && (
                                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
                                    <p className="text-slate-400 italic">No hay vehículos registrados.</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                <div className="p-6 border-t bg-white flex justify-end gap-4 shadow-up-lg z-10">
                    <button onClick={() => setIsNewUnitModalOpen(false)} className="px-8 py-4 text-xl font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-colors">CANCELAR</button>
                    <button onClick={handleSaveUnit} className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        <Save size={24} /> GUARDAR CAMBIOS
                    </button>
                </div>
            </Modal>


            {/* NEW GUARD MODAL */}
            <Modal
                isOpen={isNewGuardModalOpen}
                onClose={() => setIsNewGuardModalOpen(false)}
                title={<>🛡️ Nuevo Guardia</>}
                maxWidth="md"
                headerColorClass="bg-indigo-600"
            >
                <form onSubmit={handleCreateGuard} className="p-8 space-y-6">
                    <div><label className="block font-bold mb-2">Nombre</label><input required className="w-full p-4 border-2 rounded-xl" value={newGuardData.first_name} onChange={e => setNewGuardData({ ...newGuardData, first_name: e.target.value })} /></div>
                    <div><label className="block font-bold mb-2">Apellido</label><input required className="w-full p-4 border-2 rounded-xl" value={newGuardData.last_name} onChange={e => setNewGuardData({ ...newGuardData, last_name: e.target.value })} /></div>
                    <div><label className="block font-bold mb-2">Email (Usuario)</label><input required type="email" className="w-full p-4 border-2 rounded-xl" value={newGuardData.email} onChange={e => setNewGuardData({ ...newGuardData, email: e.target.value })} /></div>
                    <button className="w-full py-4 bg-indigo-600 text-white font-bold text-xl rounded-2xl shadow-lg mt-4">CREAR GUARDIA</button>
                </form>
            </Modal>

        </div>
    );
}
