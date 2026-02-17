import KPIGrid from './KPIGrid';
import UnitsTable from './UnitsTable';
import DocReview from './DocReview';
import AuditLog from './AuditLog';

import AdminGuardManagement from './AdminGuardManagement';

export default function AdminDashboard() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Panel de Administración</h2>
                <div className="text-sm text-gray-500">
                    Barrio Santa Clara • <span className="text-green-600 font-medium">Online</span>
                </div>
            </div>

            <KPIGrid />
            <AdminGuardManagement />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <DocReview />
                    <UnitsTable />
                </div>
                <div className="lg:col-span-1">
                    <AuditLog />
                </div>
            </div>
        </div>
    );
}
