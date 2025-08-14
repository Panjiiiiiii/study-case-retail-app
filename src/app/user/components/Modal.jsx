"use client";
import { useState, useEffect } from "react";

export const Modal = ({ title, children, isOpen, onClose, hideClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setIsClosing(false); // pastikan reset saat dibuka lagi
    }, [isOpen]);

    // Kalau modal nggak open dan nggak dalam proses closing → null
    if (!isOpen && !isClosing) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose(); // tutup beneran
        }, 200); // durasi animasi
    };

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center transition-opacity duration-200 z-50 ${
                isClosing ? "opacity-0" : "opacity-100"
            }`}
        >
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-200 ${
                    isClosing ? "opacity-0" : "opacity-50"
                }`}
                onClick={handleClose}
            ></div>

            {/* Box modal */}
            <div
                className={`relative bg-white rounded-lg shadow-lg p-6 w-96 transform transition-all duration-200 ${
                    isClosing
                        ? "scale-95 opacity-0"
                        : "scale-100 opacity-100"
                }`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    {!hideClose && (
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
};
