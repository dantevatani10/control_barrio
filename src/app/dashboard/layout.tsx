'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
    FileText,
    Home,
    Briefcase,
    Bell,
    User as UserIcon
} from 'lucide-react';
import { clsx } from 'clsx';
import { Role } from '@/types';

// Role-based navigation configuration
const NAV_LINKS = {
    admin: [
        { href: '/dashboard/admin', label: 'Inicio', icon: LayoutDashboard },
        { href: '/dashboard/admin/lots', label: 'Lotes y Vecinos', icon: Home },
        { href: '/dashboard/admin/workers', label: 'Trabajadores', icon: Briefcase },
        { href: '/dashboard/admin/guards', label: 'Guardias', icon: Shield },
        { href: '/dashboard/admin/history', label: 'Historial', icon: FileText },
    ],
    guard: [
        { href: '/dashboard/guard', label: 'Inicio', icon: LayoutDashboard },
        { href: '/dashboard/guard/access', label: 'Control Acceso', icon: Shield },
        { href: '/dashboard/guard/incidents', label: 'Incidentes', icon: FileText },
    ],
    owner: [
        { href: '/dashboard/owner', label: 'Inicio', icon: LayoutDashboard },
        { href: '/dashboard/owner/family', label: 'Mi Familia', icon: Users },
        { href: '/dashboard/owner/invitations', label: 'Invitaciones', icon: FileText },
        { href: '/dashboard/owner/profile', label: 'Mi Perfil', icon: UserIcon },
    ],
    tenant: [
        { href: '/dashboard/tenant', label: 'Inicio', icon: LayoutDashboard },
        { href: '/dashboard/tenant/family', label: 'Mi Familia', icon: Users },
        { href: '/dashboard/tenant/invitations', label: 'Invitaciones', icon: FileText },
        { href: '/dashboard/tenant/profile', label: 'Mi Perfil', icon: UserIcon },
    ]
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Determine current role based on URL path
    const getRoleFromPath = (): Role => {
        if (pathname?.includes('/admin')) return 'admin';
        if (pathname?.includes('/guard')) return 'guard';
        if (pathname?.includes('/owner')) return 'owner';
        if (pathname?.includes('/tenant')) return 'tenant';
        return 'admin'; // Default fallback, could be improved with actual auth state
    };

    const currentRole = getRoleFromPath();
    const links = NAV_LINKS[currentRole as keyof typeof NAV_LINKS] || NAV_LINKS.admin;

    const handleLogout = () => {
        // In a real app, clear tokens/state here
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

            {/* DESKTOP SIDEBAR (md:flex) */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 fixed h-full z-40 transition-transform">
                <div className="h-20 flex items-center justify-center border-b border-slate-800 px-6">
                    <h1 className="text-xl font-bold text-white tracking-wide truncate">
                        Barrio Seguro
                    </h1>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="mb-6 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Menú Principal
                    </div>
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                    isActive
                                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-inner"
                                        : "hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon size={20} className={clsx(isActive ? "text-blue-400" : "text-slate-400")} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* MOBILE TOP HEADER (md:hidden) */}
            <header className="md:hidden h-16 bg-white border-b border-slate-200 fixed top-0 w-full z-50 flex items-center justify-between px-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        BS
                    </div>
                    <span className="font-bold text-slate-800 text-lg">
                        {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-slate-500 hover:text-slate-800 relative">
                        <Bell size={24} />
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>
                    {/* Mobile Menu Toggle (Optional, if we want an off-canvas menu for mobile besides bottom nav) */}
                    {/* <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
             {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button> */}
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 md:ml-64 pt-16 pb-20 md:pt-0 md:pb-0 min-h-screen relative">
                {/* Desktop Top Bar */}
                <div className="hidden md:flex h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 items-center justify-between px-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 capitalize">
                            Panel {currentRole}
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="text-slate-400 hover:text-blue-600 relative transition-colors">
                            <Bell size={24} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>
                        <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
                            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                                U
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-slate-800">Usuario Test</p>
                                <p className="text-slate-500 capitalize">{currentRole}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4 md:p-8 animate-in fade-in duration-300">
                    {children}
                </div>
            </main>

            {/* MOBILE BOTTOM NAVIGATION (md:hidden) */}
            <nav className="md:hidden h-20 bg-white border-t border-slate-200 fixed bottom-0 w-full z-50 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <ul className="h-full flex justify-around items-center max-w-md mx-auto">
                    {links.slice(0, 4).map((link) => { // Maximum 4 items for bottom nav to avoid crowding
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                        return (
                            <li key={link.href} className="w-full">
                                <Link
                                    href={link.href}
                                    className={clsx(
                                        "flex flex-col items-center justify-center w-full h-full gap-1 transition-all",
                                        isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
                                    )}
                                >
                                    <div className={clsx(
                                        "p-1.5 rounded-xl transition-colors",
                                        isActive ? "bg-blue-50" : "bg-transparent"
                                    )}>
                                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className={clsx(
                                        "text-[10px] font-semibold tracking-wide",
                                        isActive ? "text-blue-600" : "text-slate-500"
                                    )}>
                                        {link.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}

                    {/* Mobile Logout Button (Optional: can be in a profile page instead) */}
                    <li className="w-full">
                        <button
                            onClick={handleLogout}
                            className="flex flex-col items-center justify-center w-full h-full gap-1 text-slate-400 hover:text-red-500 transition-all"
                        >
                            <div className="p-1.5 rounded-xl bg-transparent">
                                <LogOut size={24} strokeWidth={2} />
                            </div>
                            <span className="text-[10px] font-semibold tracking-wide">
                                Salir
                            </span>
                        </button>
                    </li>
                </ul>
            </nav>

        </div>
    );
}
