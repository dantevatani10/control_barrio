import { Users, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { MOCK_COMMUNITY } from '@/lib/mockData';

export default function KPIGrid() {
    const stats = MOCK_COMMUNITY.stats;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Personas Adentro</p>
                    <h3 className="text-3xl font-extrabold text-blue-600 mt-2">{stats.people_inside}</h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                    <Users size={24} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Docs Pendientes</p>
                    <h3 className="text-3xl font-extrabold text-yellow-600 mt-2">{stats.pending_docs}</h3>
                </div>
                <div className={`p-3 rounded-full ${stats.pending_docs > 0 ? 'bg-yellow-50 text-yellow-600 animate-pulse' : 'bg-gray-50 text-gray-400'}`}>
                    <FileText size={24} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Visitas Hoy</p>
                    <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{stats.visits_today}</h3>
                </div>
                <div className="bg-slate-50 p-3 rounded-full text-slate-600">
                    <TrendingUp size={24} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Alertas</p>
                    <h3 className="text-3xl font-extrabold text-red-600 mt-2">0</h3>
                </div>
                <div className="bg-red-50 p-3 rounded-full text-red-600">
                    <AlertTriangle size={24} />
                </div>
            </div>
        </div>
    );
}
