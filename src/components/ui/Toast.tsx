'use client';
import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

export const toast = {
    success: (msg: string) => window.dispatchEvent(new CustomEvent('toast', { detail: { msg, type: 'success' } })),
    error: (msg: string) => window.dispatchEvent(new CustomEvent('toast', { detail: { msg, type: 'error' } })),
    info: (msg: string) => window.dispatchEvent(new CustomEvent('toast', { detail: { msg, type: 'info' } }))
};

export function ToastContainer() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [toasts, setToasts] = useState<any[]>([]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleToast = (e: any) => {
            const id = Date.now();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setToasts(prev => [...prev, { id, ...e.detail }]);
            setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
        };
        window.addEventListener('toast', handleToast);
        return () => window.removeEventListener('toast', handleToast);
    }, []);

    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map(t => (
                <div key={t.id} className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white transform transition-all duration-300 animate-in slide-in-from-right-8 ${t.type === 'success' ? 'bg-emerald-600' : t.type === 'error' ? 'bg-rose-600' : 'bg-blue-600'
                    }`}>
                    {t.type === 'success' && <CheckCircle2 size={24} />}
                    {t.type === 'error' && <XCircle size={24} />}
                    {t.type === 'info' && <Info size={24} />}
                    <span className="font-bold text-sm tracking-wide">{t.msg}</span>
                </div>
            ))}
        </div>
    );
}
