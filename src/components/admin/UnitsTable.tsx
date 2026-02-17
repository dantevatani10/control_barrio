import { MOCK_UNITS, MOCK_PROFILES } from '@/lib/mockData';
import { Home, User, DollarSign } from 'lucide-react';

export default function UnitsTable() {
    const getOwnerName = (id?: string) => {
        const p = MOCK_PROFILES.find(p => p.id === id);
        return p ? `${p.first_name} ${p.last_name}` : '-';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Home size={18} className="text-slate-500" /> Padrón de Lotes
                </h3>
                <button className="text-sm text-blue-600 font-semibold hover:underline">
                    New Lote
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propietario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquilino</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado Deuda</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {MOCK_UNITS.map((unit) => (
                            <tr key={unit.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-bold text-slate-800">{unit.unit_number}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {getOwnerName(unit.owner_id)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {getOwnerName(unit.tenant_id)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${unit.status === 'up_to_date' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {unit.status === 'up_to_date' ? (
                                            <>Al Día <DollarSign size={12} /></>
                                        ) : (
                                            <>Deuda <DollarSign size={12} /></>
                                        )}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-blue-600 hover:text-blue-900">Editar</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
