import { MOCK_LOGS } from '@/lib/mockData';
import { LogOut, User, Clock } from 'lucide-react';

export default function InsideList() {
    // Filter logs that are "in" and recent (mock logic)
    // In a real app we would query 'inside_people' table or filter logs
    const peopleInside = MOCK_LOGS.filter(l => l.details.direction === 'in').slice(0, 5);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                <User size={18} /> Adentro Ahora (Mock)
            </h3>
            <div className="space-y-3">
                {peopleInside.map(log => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <div>
                                <p className="font-medium text-slate-900 text-sm">{log.details.guest_name}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <Clock size={10} /> {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.details.unit}
                                </p>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-red-500 p-1 bg-white rounded shadow-sm border border-gray-100 hover:border-red-200 transition-all" title="Marcar Salida">
                            <LogOut size={16} />
                        </button>
                    </div>
                ))}

                {peopleInside.length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-4">Nadie registrado actualmente.</p>
                )}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 font-bold hover:underline">
                Ver lista completa (142)
            </button>
        </div>
    );
}
