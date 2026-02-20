'use client';

import { useMemo } from 'react';
import { Wallet, TrendingDown, FileText } from 'lucide-react';
import { mockService } from '@/lib/mock-service';

const formatCurrency = (n: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

export default function KPIGrid() {
    const metrics = useMemo(() => mockService.getFinancialMetrics(), []);

    if (!metrics) return null;

    const kpis = [
        {
            label: 'Recaudado',
            value: formatCurrency(metrics.totalCollected),
            icon: Wallet,
            color: 'emerald',
            bgIcon: 'bg-emerald-50',
            textIcon: 'text-emerald-600',
            textValue: 'text-emerald-600',
        },
        {
            label: 'Deuda Total',
            value: formatCurrency(metrics.totalDebt),
            icon: TrendingDown,
            color: 'rose',
            bgIcon: 'bg-rose-50',
            textIcon: 'text-rose-600',
            textValue: 'text-rose-600',
        },
        {
            label: 'Egresos Mensuales',
            value: formatCurrency(metrics.totalExpenses),
            icon: FileText,
            color: 'amber',
            bgIcon: 'bg-amber-50',
            textIcon: 'text-amber-600',
            textValue: 'text-amber-600',
        },
        {
            label: 'Expensa Base',
            value: formatCurrency(metrics.baseExpense),
            icon: Wallet,
            color: 'blue',
            bgIcon: 'bg-blue-50',
            textIcon: 'text-blue-600',
            textValue: 'text-blue-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((kpi) => (
                <div
                    key={kpi.label}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                    <div className="min-w-0">
                        <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                            {kpi.label}
                        </p>
                        <h3 className={`text-2xl font-extrabold mt-1 ${kpi.textValue} truncate`}>
                            {kpi.value}
                        </h3>
                    </div>
                    <div className={`${kpi.bgIcon} p-3 rounded-full ${kpi.textIcon} flex-shrink-0`}>
                        <kpi.icon size={22} />
                    </div>
                </div>
            ))}
        </div>
    );
}
