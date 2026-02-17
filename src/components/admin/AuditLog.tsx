import { MOCK_LOGS } from '@/lib/mockData';
import { AlertTriangle, Search, Filter } from 'lucide-react';
import { useState } from 'react';

export default function AuditLog() {
    const [showForcedOnly, setShowForcedOnly] = useState(false);

    const logs = showForcedOnly ? MOCK_LOGS.filter(l => l.is_forced_entry) : MOCK_LOGS;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Search size={18} className="text-slate-500" /> Auditoría de Accesos
                </h3>
                <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showForcedOnly}
                            onChange={(e) => setShowForcedOnly(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={showForcedOnly ? "font-bold text-red-600" : ""}>Mostrar Solo Forzados</span>
                    </label>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor (Guardia)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(log.timestamp).toLocaleTimeString()} <br />
                                    <span className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleDateString()}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{log.details.guest_name}</div>
                                    <div className="text-xs text-gray-500">
                                        {log.details.direction === 'in' ? '→ Entrada' : '← Salida'} • {log.method.toUpperCase()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {log.details.unit}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {log.actor_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {log.is_forced_entry ? (
                                        <div className="flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1 rounded text-xs font-bold border border-red-100">
                                            <AlertTriangle size={12} />
                                            FORZADO: {log.forced_reason}
                                        </div>
                                    ) : (
                                        <span className="text-green-700 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-100">
                                            Normal
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
