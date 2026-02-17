'use client';

import React, { useState } from 'react';
import RoleSwitcher, { DemoRole } from '@/components/RoleSwitcher';
import GuardScanner from '@/components/dashboard/GuardScanner';
import { MOCK_COMMUNITY, MOCK_LOGS } from '@/lib/mockData';
import AdminDashboard from '@/components/admin/AdminDashboard';
import OwnerDashboard from '@/components/owner/OwnerDashboard';
import ActiveMonitor from '@/components/dashboard/ActiveMonitor';
import { Shield } from 'lucide-react';

export default function DemoDashboard() {
    const [role, setRole] = useState<DemoRole>('guard');

    // -- GUARD VIEW --
    const GuardView = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Escáner de Acceso</h3>
                        <div className="h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden bg-gray-50">
                            <GuardScanner />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <ActiveMonitor />

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Últimos Accesos</h3>
                        <div className="space-y-4">
                            {MOCK_LOGS.map(log => (
                                <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${log.is_forced_entry ? 'bg-red-500' : 'bg-green-500'}`} />
                                    <div>
                                        <p className="font-medium text-gray-900">{log.details.guest_name}</p>
                                        <p className="text-sm text-gray-500">{log.details.unit} • <span suppressHydrationWarning>{new Date(log.timestamp).toLocaleTimeString()}</span></p>
                                        {log.is_forced_entry && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                                                Forzado: {log.forced_reason}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="text-blue-400" />
                        <span className="font-bold text-xl tracking-tight">AccesoBarrio</span>
                        <span className="text-gray-500 mx-2">|</span>
                        <span className="text-gray-300 font-medium">{MOCK_COMMUNITY.name}</span>
                    </div>
                    <div className="text-xs font-mono bg-slate-800 px-3 py-1 rounded text-gray-400 border border-slate-700 hidden sm:block">
                        DEMO MODE: {role.toUpperCase()}
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
                {role === 'guard' && <GuardView />}
                {(role === 'owner' || role === 'tenant') && <OwnerDashboard role={role} />}
                {role === 'admin' && <AdminDashboard />}
            </main>

            <RoleSwitcher currentRole={role} onRoleChange={setRole} />
        </div>
    );
}
