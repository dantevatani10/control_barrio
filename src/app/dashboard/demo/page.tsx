'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import RoleSwitcher from '@/components/RoleSwitcher';
import { Role } from '@/types';
import { useSearchParams } from 'next/navigation';

// Dynamic imports to avoid SSR issues with browser-only APIs or hydration mismatches
const GuardDashboard = dynamic(() => import('@/components/dashboard/GuardDashboard'), { ssr: false });
const OwnerDashboard = dynamic(() => import('@/components/owner/OwnerDashboard'), { ssr: false });
const AdminDashboard = dynamic(() => import('@/components/admin/AdminDashboard'), { ssr: false });

function DemoContent() {
    const searchParams = useSearchParams();
    const roleParam = searchParams.get('role') as Role | null;
    const [activeRole, setActiveRole] = useState<Role>(roleParam || 'guard');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (roleParam) setActiveRole(roleParam);
    }, [roleParam]);

    return (
        <>
            <main className="pb-20">
                {activeRole === 'guard' && (
                    <div className="p-4">
                        <GuardDashboard />
                    </div>
                )}

                {(activeRole === 'owner' || activeRole === 'tenant') && (
                    <OwnerDashboard role={activeRole} />
                )}

                {activeRole === 'admin' && (
                    <AdminDashboard />
                )}
            </main>

            <RoleSwitcher currentRole={activeRole} onRoleChange={setActiveRole} />
        </>
    );
}

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Bar for Context (Demo Mode) */}
            <div className="bg-slate-900 text-white p-2 text-center text-xs font-medium sticky top-0 z-50">
                MODO DEMO • Datos en Memoria
            </div>

            <Suspense fallback={<div className="p-10 text-center">Cargando Demo...</div>}>
                <DemoContent />
            </Suspense>
        </div>
    );
}
