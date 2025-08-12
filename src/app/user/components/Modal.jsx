"use client";
import { useState, useEffect } from "react";

export const Modal = ({ title, children, isOpen, onClose, hideClose }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Untuk memicu animasi fade-in saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
        }
    }, [isOpen]);

    if (!isOpen && !isClosing) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
            setIsMounted(false);
        }, 200);
    };

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center transition-opacity duration-200 ${
                isClosing ? "opacity-0" : "opacity-100"
            }`}
        >
            {/* Overlay hitam 50% */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-200 ${
                    isClosing ? "opacity-0" : isMounted ? "opacity-50" : "opacity-0"
                }`}
                onClick={handleClose}
            ></div>

            {/* Kotak modal */}
            <div
                className={`relative bg-white rounded-lg shadow-lg p-6 w-96 transform transition-all duration-200 ${
                    isClosing
                        ? "scale-95 opacity-0"
                        : isMounted
                        ? "scale-100 opacity-100"
                        : "scale-95 opacity-0"
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
