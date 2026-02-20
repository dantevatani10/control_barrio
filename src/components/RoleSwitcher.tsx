'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Shield, User, Lock, RotateCw } from 'lucide-react';
import { Role } from '@/types';
import { usePathname, useRouter } from 'next/navigation';

export default function RoleSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const [showReset, setShowReset] = useState(false);

    const getRoleFromPath = (): Role => {
        if (pathname?.includes('/admin')) return 'admin';
        if (pathname?.includes('/guard')) return 'guard';
        if (pathname?.includes('/owner')) return 'owner';
        if (pathname?.includes('/tenant')) return 'tenant';
        return 'admin';
    };

    const currentRole = getRoleFromPath();

    const handleRoleChange = (role: Role) => {
        router.push(`/dashboard/${role}`);
    };
    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Reset Demo Button */}
            <button
                onClick={() => setShowReset(true)}
                className="absolute -top-10 right-0 bg-slate-800 text-white hover:bg-slate-700 text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg transition-all hover:scale-105 active:scale-95"
                title="Reiniciar Demo"
            >
                <RotateCw size={12} />
                Reset
            </button>

            {/* Role Switcher Pill */}
            <div className="bg-white shadow-2xl rounded-full p-2 flex gap-2 border border-gray-200 animate-fade-in-up">
                <button
                    onClick={() => handleRoleChange('guard')}
                    className={clsx(
                        "p-3 rounded-full transition-all duration-300 flex items-center gap-2",
                        currentRole === 'guard' ? "bg-blue-600 text-white shadow-lg scale-105" : "text-gray-500 hover:bg-gray-100"
                    )}
                    title="Vista Guardia"
                >
                    <Shield size={20} />
                    {currentRole === 'guard' && <span className="text-sm font-bold pr-2">Guardia</span>}
                </button>

                <button
                    onClick={() => handleRoleChange('owner')}
                    className={clsx(
                        "p-3 rounded-full transition-all duration-300 flex items-center gap-2",
                        currentRole === 'owner' ? "bg-green-600 text-white shadow-lg scale-105" : "text-gray-500 hover:bg-gray-100"
                    )}
                    title="Vista Propietario"
                >
                    <User size={20} />
                    {currentRole === 'owner' && <span className="text-sm font-bold pr-2">Propietario</span>}
                </button>

                <button
                    onClick={() => handleRoleChange('tenant')}
                    className={clsx(
                        "p-3 rounded-full transition-all duration-300 flex items-center gap-2",
                        currentRole === 'tenant' ? "bg-teal-600 text-white shadow-lg scale-105" : "text-gray-500 hover:bg-gray-100"
                    )}
                    title="Vista Inquilino"
                >
                    <User size={20} />
                    {currentRole === 'tenant' && <span className="text-sm font-bold pr-2">Inquilino</span>}
                </button>

                <button
                    onClick={() => handleRoleChange('admin')}
                    className={clsx(
                        "p-3 rounded-full transition-all duration-300 flex items-center gap-2",
                        currentRole === 'admin' ? "bg-purple-600 text-white shadow-lg scale-105" : "text-gray-500 hover:bg-gray-100"
                    )}
                    title="Vista Admin"
                >
                    <Lock size={20} />
                    {currentRole === 'admin' && <span className="text-sm font-bold pr-2">Admin</span>}
                </button>
            </div>

            {/* Reset Confirmation Dialog */}
            {showReset && (
                <div className="fixed inset-0 z-[99999] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in-95">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">¿Reiniciar la Demo?</h3>
                        <p className="text-slate-600 mb-6">Se borrarán todos los datos simulados y volverás a la pantalla de inicio.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowReset(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">Cancelar</button>
                            <button onClick={() => { window.localStorage.clear(); window.location.href = '/'; }} className="flex-1 px-4 py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700">Reiniciar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
