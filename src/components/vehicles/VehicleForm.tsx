'use client';

import React, { useState } from 'react';
import { Car, Save, Loader2 } from 'lucide-react';

export default function VehicleForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({ brand: '', model: '', color: '#000000', license_plate: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1000);
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold flex items-center gap-2">
                <Car size={18} /> Nuevo Vehículo
            </div>
            <h2 className="block mt-1 text-lg leading-tight font-medium text-black">Registrar Auto</h2>

            {success ? (
                <div className="mt-6 bg-green-50 text-green-700 px-4 py-3 rounded">
                    <strong className="font-bold">¡Registrado!</strong>
                    <button onClick={() => setSuccess(false)} className="block mt-2 text-sm underline">Agregar otro</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <input type="text" name="brand" placeholder="Marca" required className="w-full border p-2 rounded" onChange={handleChange} />
                    <input type="text" name="model" placeholder="Modelo" required className="w-full border p-2 rounded" onChange={handleChange} />
                    <input type="text" name="license_plate" placeholder="Patente" required className="w-full border p-2 rounded uppercase" onChange={handleChange} />
                    <input type="color" name="color" required className="h-10 w-full p-0 border rounded" onChange={handleChange} />
                    <button type="submit" disabled={loading} className="w-full py-2 bg-indigo-600 text-white rounded flex justify-center items-center">
                        {loading ? <Loader2 className="animate-spin" /> : <><Save className="mr-2" /> Guardar</>}
                    </button>
                </form>
            )}
        </div>
    );
}
