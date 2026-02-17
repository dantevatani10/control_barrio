import { useState } from 'react';
import { MOCK_WORKERS, MOCK_INSURANCE_DOCS } from '@/lib/mockData';
import { FileText, Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import WorkerForm from './WorkerForm';

export default function WorkerList() {
    const [showForm, setShowForm] = useState(false);

    const getInsuranceStatus = (workerId: string) => {
        return MOCK_INSURANCE_DOCS.find(doc => doc.worker_id === workerId);
    };

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-800">Mis Trabajadores</h3>

            {showForm && (
                <WorkerForm
                    onClose={() => setShowForm(false)}
                    onSuccess={() => {
                        setShowForm(false);
                        alert('Trabajador creado (Simulación)');
                    }}
                />
            )}

            {MOCK_WORKERS.map(worker => {
                const insurance = getInsuranceStatus(worker.id);
                const status = insurance?.status || 'pending';

                return (
                    <div key={worker.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-slate-900">{worker.first_name} {worker.last_name}</h4>
                                <span className="text-xs text-slate-500 uppercase font-semibold bg-slate-100 px-2 py-0.5 rounded">
                                    {worker.role}
                                </span>
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold
                            ${status === 'approved' ? 'bg-green-100 text-green-700' :
                                    status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-800'}`}>
                                {status === 'approved' && <CheckCircle size={12} />}
                                {status === 'rejected' && <AlertCircle size={12} />}
                                {status === 'pending' && <Clock size={12} />}
                                <span className="uppercase">{status === 'pending' ? 'Revisión' : status}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText size={18} className="text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {insurance ? 'Póliza_2025.pdf' : 'Sin documento'}
                                </span>
                            </div>
                            {status !== 'approved' && (
                                <button className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline">
                                    <Upload size={14} /> Subir
                                </button>
                            )}
                        </div>
                        {status === 'rejected' && insurance?.rejection_reason && (
                            <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                                Motivo rechazo: {insurance.rejection_reason}
                            </div>
                        )}
                    </div>
                );
            })}

            <button
                onClick={() => setShowForm(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-colors"
            >
                + Nuevo Trabajador
            </button>
        </div>
    );
}
