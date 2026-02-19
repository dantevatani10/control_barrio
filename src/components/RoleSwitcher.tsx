'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Shield, User, Lock } from 'lucide-react';
import { Role } from '@/types';

interface RoleSwitcherProps {
    currentRole: Role;
    onRoleChange: (role: Role) => void;
}

export default function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
    return (
        <div className="fixed bottom-6 right-6 bg-white shadow-2xl rounded-full p-2 flex gap-2 border border-gray-200 z-50 animate-fade-in-up">
            <button
                onClick={() => onRoleChange('guard')}
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
                onClick={() => onRoleChange('owner')}
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
                onClick={() => onRoleChange('tenant')}
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
                onClick={() => onRoleChange('admin')}
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
    );
}
