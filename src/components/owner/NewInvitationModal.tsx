'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { mockService as mockDB } from '@/lib/mock-service';
import { Car, QrCode, Share2, Calendar, IdCard } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    unitNumber: string;
    residentName: string;
}

export default function NewInvitationModal({ isOpen, onClose, unitNumber, residentName }: Props) {
    const [step, setStep] = useState<'form' | 'qr'>('form');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [invData, setInvData] = useState<any>(null);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', dni: '', visitDate: new Date().toISOString().split('T')[0],
        hasVehicle: false, brand: '', model: '', year: '', plate: ''
    });

    const handleClose = () => {
        setStep('form');
        setFormData({ firstName: '', lastName: '', dni: '', visitDate: new Date().toISOString().split('T')[0], hasVehicle: false, brand: '', model: '', year: '', plate: '' });
        onClose();
    };

    const handleGenerate = () => {
        if (!formData.firstName || !formData.lastName || !formData.dni) {
            return toast.error('Nombre, apellido y DNI son obligatorios');
        }
        if (!formData.visitDate) {
            return toast.error('La fecha de la visita es obligatoria');
        }
        if (formData.hasVehicle && (!formData.plate || !formData.brand)) {
            return toast.error('Marca y patente son obligatorias para el vehículo');
        }

        const inv = mockDB.createVisit({
            guest_name: `${formData.firstName} ${formData.lastName}`,
            guest_dni: formData.dni,
            unit_id: unitNumber,
            plate: formData.hasVehicle ? formData.plate.toUpperCase() : undefined,
        });

        setInvData(inv);
        setStep('qr');
        toast.success('¡Invitación generada con éxito!');
    };

    const qrUrl = invData ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${invData.id}` : '';

    // Formatear la fecha ingresada para el mensaje (usamos UTC para no desfasar el timezone)
    const dateObj = new Date(formData.visitDate + 'T12:00:00Z');
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = dateObj.toLocaleDateString('es-AR', dateOptions);

    // Mensaje de WhatsApp mejorado
    const shareMessage = `¡Hola ${formData.firstName}!\n\nFuiste invitado/a por ${residentName} el día ${formattedDate} al Barrio Santa Clara, ubicado en Río Hondo 200, Manzanares.\n\n📍 Vas al Lote: ${unitNumber}\n👤 Registrado con DNI: ${formData.dni}${formData.hasVehicle ? `\n🚗 Vehículo autorizado: ${formData.brand} (${formData.plate.toUpperCase()})` : ''}\n\n¡Con el siguiente Código QR vas a poder hacer tu entrada mucho más ágil!\n${qrUrl}`;

    const handleShare = () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank');
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={step === 'form' ? "📝 Nueva Invitación" : "✅ Invitación Lista"}>
            {step === 'form' ? (
                <div className="space-y-4 animate-in fade-in zoom-in duration-300">

                    {/* Sección: Datos Personales */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                        <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Datos del Visitante</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <input type="text" placeholder="Nombre (Ej: Juan)" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                            </div>
                            <div>
                                <input type="text" placeholder="Apellido (Ej: Pérez)" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <IdCard size={16} />
                            </div>
                            <input type="number" placeholder="DNI (sin puntos)" className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.dni} onChange={e => setFormData({ ...formData, dni: e.target.value })} />
                        </div>
                    </div>

                    {/* Sección: Fecha de Visita */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                            <Calendar size={18} className="text-blue-600" /> Fecha de Ingreso
                        </label>
                        <input type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.visitDate} onChange={e => setFormData({ ...formData, visitDate: e.target.value })} />
                    </div>

                    {/* Sección: Vehículo */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                                checked={formData.hasVehicle} onChange={e => setFormData({ ...formData, hasVehicle: e.target.checked })} />
                            <span className="font-bold text-slate-700 flex items-center gap-2"><Car size={18} /> ¿Ingresa con vehículo?</span>
                        </label>

                        {formData.hasVehicle && (
                            <div className="grid grid-cols-2 gap-3 mt-3 animate-in slide-in-from-top-2">
                                <input type="text" placeholder="Marca (Ej: Toyota)" className="w-full p-2.5 border border-slate-200 rounded-lg outline-none text-sm text-slate-900 placeholder:text-slate-400"
                                    value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                                <input type="text" placeholder="Modelo (Ej: Corolla)" className="w-full p-2.5 border border-slate-200 rounded-lg outline-none text-sm text-slate-900 placeholder:text-slate-400"
                                    value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} />
                                <input type="number" placeholder="Año (Ej: 2022)" className="w-full p-2.5 border border-slate-200 rounded-lg outline-none text-sm text-slate-900 placeholder:text-slate-400"
                                    value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                                <input type="text" placeholder="Patente (AB123CD)" className="w-full p-2.5 border border-slate-200 rounded-lg outline-none uppercase text-sm text-slate-900 placeholder:text-slate-400"
                                    value={formData.plate} onChange={e => setFormData({ ...formData, plate: e.target.value })} />
                            </div>
                        )}
                    </div>

                    <button onClick={handleGenerate} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2">
                        <QrCode size={20} /> Generar Código QR
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center text-center space-y-6 animate-in slide-in-from-right-8 duration-300">
                    <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={qrUrl} alt="QR Invitación" className="w-48 h-48" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{formData.firstName} {formData.lastName}</h3>
                        <p className="text-slate-500 font-medium text-sm mt-1">DNI: {formData.dni}</p>
                        <p className="text-slate-500 text-sm">Fecha: <span className="capitalize">{formattedDate}</span></p>
                        <div className="mt-3 inline-block bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
                            {formData.hasVehicle ? `🚗 ${formData.plate.toUpperCase()}` : '🚶‍♂️ Peatonal'}
                        </div>
                    </div>
                    <button onClick={handleShare} className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-xl hover:bg-[#1ebd5a] transition-colors shadow-lg flex justify-center items-center gap-2">
                        <Share2 size={20} /> Compartir por WhatsApp
                    </button>
                    <button onClick={handleClose} className="w-full text-slate-500 font-bold py-2 hover:text-slate-800 transition-colors">
                        Cerrar
                    </button>
                </div>
            )}
        </Modal>
    );
}
