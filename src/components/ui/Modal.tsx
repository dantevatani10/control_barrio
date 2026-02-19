import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: ReactNode;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '4xl';
    headerColorClass?: string;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'md',
    headerColorClass = 'bg-blue-600'
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const maxWidthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '4xl': 'max-w-4xl',
    }[maxWidth];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div
                className={`relative bg-white w-full ${maxWidthClass} rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-5 duration-200`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`${headerColorClass} p-6 flex justify-between items-center text-white shrink-0`}>
                    <h3 className="font-bold text-2xl flex items-center gap-2">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Body Container (handles its own padding/scrolling) */}
                {children}
            </div>
        </div>
    );
}
