import React, { useState } from 'react';
import { Shield, UserPlus, Lock, Ban, RefreshCw, MoreVertical } from 'lucide-react';
import { MOCK_PROFILES } from '@/lib/mockData';
import { Profile } from '@/types';

export default function AdminGuardManagement() {
    // Local state to simulate CRUD operations
    const [guards, setGuards] = useState<Profile[]>(MOCK_PROFILES.filter(p => p.role === 'guard'));
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const [newGuard, setNewGuard] = useState({ name: '', email: '', tempPassword: '' });

    const handleAddGuard = (e: React.FormEvent) => {
        e.preventDefault();
        const guard: Profile = {
            id: `new-${Date.now()}`,
            user_id: `u-new-${Date.now()}`,
            community_id: 'c1',
            role: 'guard',
            first_name: newGuard.name.split(' ')[0],
            last_name: newGuard.name.split(' ').slice(1).join(' ') || '',
            email: newGuard.email,
            created_at: new Date().toISOString(),
        };
        setGuards([...guards, guard]);
        setIsAddModalOpen(false);
        setNewGuard({ name: '', email: '', tempPassword: '' });
        alert(`Guardia creado. Usuario: ${guard.email}, Clave: ${newGuard.tempPassword}`);
    };

    const handleBlock = (id: string) => {
        // Mock toggle block/unblock (in real app, would update DB status)
        alert(`Simulación: Guardia ${id} bloqueado/desbloqueado. Sesión cerrada forzosamente si estaba activa.`);
    };

    const handleResetPassword = (id: string) => {
        alert(`Simulación: Se envió un email de restablecimiento de contraseña al guardia ${id}.`);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Shield size={18} className="text-blue-600" /> Gestión de Personal (Guardias)
                </h3>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <UserPlus size={16} /> Nuevo Guardia
                </button>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guardia</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario / Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Acceso</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {guards.map((guard) => (
                        <tr key={guard.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                        {guard.first_name[0]}{guard.last_name[0]}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{guard.first_name} {guard.last_name}</div>
                                        <div className="text-xs text-gray-500">ID: {guard.id}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-600">{guard.email}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                Hace {Math.floor(Math.random() * 24)}h
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => handleResetPassword(guard.id)}
                                        className="text-gray-400 hover:text-blue-600 text-xs flex items-center gap-1 border border-gray-200 px-2 py-1 rounded"
                                        title="Reset Password"
                                    >
                                        <RefreshCw size={12} /> Reset Pass
                                    </button>
                                    <button
                                        onClick={() => handleBlock(guard.id)}
                                        className="text-red-500 hover:text-red-700 bg-red-50 p-1 rounded-full"
                                        title="Bloquear Acceso"
                                    >
                                        <Ban size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {guards.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                No hay guardias registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* ADD GUARD MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">Contratar Guardia</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleAddGuard} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Ej: Juan Perez"
                                    value={newGuard.name}
                                    onChange={e => setNewGuard({ ...newGuard, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email / Usuario</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="guardia@empresa.com"
                                    value={newGuard.email}
                                    onChange={e => setNewGuard({ ...newGuard, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Provisoria</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        required
                                        type="text"
                                        className="w-full border rounded-lg pl-9 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                        placeholder="123456"
                                        value={newGuard.tempPassword}
                                        onChange={e => setNewGuard({ ...newGuard, tempPassword: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">El guardia deberá cambiarla al primer inicio.</p>
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-bold text-sm"
                                >
                                    Crear Usuario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
