import { useState } from 'react';
import { MOCK_INSURANCE_DOCS, MOCK_WORKERS } from '@/lib/mockData';
import { FileText, CheckCircle, XCircle, Eye, Calendar, AlertCircle } from 'lucide-react';
import { InsuranceDoc, InsuranceStatus } from '@/types';

export default function DocReview() {
    const [selectedDoc, setSelectedDoc] = useState<InsuranceDoc | null>(null);
    const [expiryDate, setExpiryDate] = useState('');
    const [rejectReason, setRejectReason] = useState('');

    // In a real app, this would fetch from DB. Here we use local state to simulate updates.
    const [docs, setDocs] = useState(MOCK_INSURANCE_DOCS);

    const pendingDocs = docs.filter(d => d.status === 'pending');

    const getWorker = (id: string) => MOCK_WORKERS.find(w => w.id === id);

    const handleProcess = (status: InsuranceStatus) => {
        if (!selectedDoc) return;

        // Validate inputs
        if (status === 'approved' && !expiryDate) return alert('Ingrese fecha de vencimiento');
        if (status === 'rejected' && !rejectReason) return alert('Ingrese motivo de rechazo');

        // Update mock state
        const updatedDocs = docs.map(d => {
            if (d.id === selectedDoc.id) {
                return {
                    ...d,
                    status,
                    expiry_date: expiryDate,
                    rejection_reason: rejectReason,
                    last_updated: new Date().toISOString()
                };
            }
            return d;
        });

        setDocs(updatedDocs);
        setSelectedDoc(null);
        setExpiryDate('');
        setRejectReason('');
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <FileText size={18} className="text-slate-500" /> Centro de Documentación (ART)
                </h3>
                {pendingDocs.length > 0 && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        {pendingDocs.length} Pendientes
                    </span>
                )}
            </div>

            {pendingDocs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    <CheckCircle size={48} className="mx-auto text-green-200 mb-4" />
                    <p>¡Todo al día! No hay documentos pendientes de revisión.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {pendingDocs.map(doc => {
                        const worker = getWorker(doc.worker_id);
                        return (
                            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{worker?.first_name} {worker?.last_name}</h4>
                                        <p className="text-sm text-gray-500">Solicitado para: {worker?.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedDoc(doc)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    <Eye size={16} /> Revisar
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* REVIEW MODAL */}
            {selectedDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl flex overflow-hidden">

                        {/* LEFT: PREVIEW */}
                        <div className="w-1/2 bg-slate-100 p-8 flex flex-col items-center justify-center border-r border-gray-200 relative">
                            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                Vista Previa
                            </div>
                            <FileText size={80} className="text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium">Previsualización del PDF/Imagen</p>
                            <p className="text-slate-400 text-sm mt-2">(Simulación de archivo)</p>
                        </div>

                        {/* RIGHT: ACTION */}
                        <div className="w-1/2 p-8 flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Validar Seguro ART</h3>
                                    <p className="text-sm text-gray-500">
                                        Trabajador: {getWorker(selectedDoc.worker_id)?.first_name} {getWorker(selectedDoc.worker_id)?.last_name}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedDoc(null)} className="text-gray-400 hover:text-gray-600">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Fecha de Vencimiento (Visible en documento)
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                        <input
                                            type="date"
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {expiryDate && (
                                    <div className="space-y-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4">
                                        <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800 flex gap-2">
                                            <AlertCircle size={18} />
                                            Confirmo que los datos coinciden con el documento.
                                        </div>
                                        <button
                                            onClick={() => handleProcess('approved')}
                                            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-500 transition-all shadow-lg shadow-green-600/20"
                                        >
                                            APROBAR DOCUMENTO
                                        </button>

                                        <div className="relative my-4">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-200"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-white text-gray-500">O rechazar si no es válido</span>
                                            </div>
                                        </div>

                                        <textarea
                                            placeholder="Motivo del rechazo (Obligatorio)..."
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                                            rows={2}
                                        />
                                        <button
                                            disabled={!rejectReason}
                                            onClick={() => handleProcess('rejected')}
                                            className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            RECHAZAR DOCUMENTO
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
