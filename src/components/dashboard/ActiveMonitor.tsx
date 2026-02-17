import React, { useState } from 'react';
import { MOCK_LOGS } from '@/lib/mockData';
import { Clock, LogOut, User, Building, Car } from 'lucide-react';
import { AccessLog } from '@/types';

export default function ActiveMonitor() {
    // Determine people "inside" (entry but no exit)
    // In a real app we'd fetch from DB where exit_time is NULL
    const [activeVisits, setActiveVisits] = useState<AccessLog[]>(
        MOCK_LOGS.filter(l => l.details.direction === 'in' && l.exit_time === null)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) // Oldest first
    );

    const handleCheckout = (id: string) => {
        // Optimistic UI update
        setActiveVisits(prev => prev.filter(v => v.id !== id));
        // Mock API call would happen here
        console.log(`Checkout for log ${id}`);
    };

    const getDuration = (timestamp: string) => {
        const start = new Date(timestamp).getTime();
        const now = Date.now();
        const diffHours = Math.floor((now - start) / (1000 * 60 * 60));
        const diffMinutes = Math.floor(((now - start) % (1000 * 60 * 60)) / (1000 * 60));

        if (diffHours > 0) return `${diffHours}h ${diffMinutes}m`;
        return `${diffMinutes}m`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full max-h-[600px]">
            <div className="px-6 py-4 border-b border-gray-200 bg-red-50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-red-800 flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        En Predio: <span className="text-xl">{activeVisits.length}</span>
                    </h3>
                    <p className="text-xs text-red-600 mt-0.5">Visitas sin marcar salida</p>
                </div>
                <div className="text-xs font-mono bg-white px-2 py-1 rounded text-red-500 border border-red-100">
                    LIVE
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeVisits.map((visit) => {
                    const duration = getDuration(visit.timestamp);
                    const isLongStay = duration.includes('h') && parseInt(duration) > 4;

                    return (
                        <div key={visit.id} className="bg-white border hover:border-blue-300 transition-colors rounded-lg p-4 shadow-sm relative group">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{visit.details.guest_name}</div>
                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                            <span className="flex items-center gap-1 text-gray-600">
                                                <Building size={12} /> {visit.details.unit}
                                            </span>
                                            {visit.details.vehicle_plate && (
                                                <span className="flex items-center gap-1 bg-gray-100 px-1.5 rounded text-xs font-mono">
                                                    <Car size={10} /> {visit.details.vehicle_plate}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div suppressHydrationWarning className={`text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 mb-1
                                        ${isLongStay ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        <Clock size={10} /> {duration}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Entró: <span suppressHydrationWarning>{new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleCheckout(visit.id)}
                                className="mt-3 w-full py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                            >
                                <LogOut size={16} /> MARCAR SALIDA
                            </button>
                        </div>
                    );
                })}

                {activeVisits.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        <User size={48} className="mx-auto mb-3 opacity-20" />
                        <p>No hay actividad reciente.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
