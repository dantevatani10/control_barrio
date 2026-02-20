'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Shield, User, Lock, RotateCw } from 'lucide-react';
import { Role } from '@/types';
import { usePathname, useRouter } from 'next/navigation';

export default function RoleSwitcher() {
    const router = useRouter();
    const pathname = usePathname();

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
                onClick={() => {
                    if (confirm('¿Reiniciar demo? Se borrarán todos los datos.')) {
                        window.localStorage.clear();
                        window.location.href = '/';
                    }
                }}
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
        </div>
    );
}
