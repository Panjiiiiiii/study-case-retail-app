"use client";

import { cn } from "@/lib/cn";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
export const TextInput = ({ label, name, value, onChange, placeholder, className}) => {
    return (
        <div className={`flex flex-col ${className}`}>
        {label && 
            <label htmlFor={name} className={cn("mb-2 text-sm font-bold", className)}>{label}</label>
        }
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={cn("px-4 py-2 border border-blue-950 rounded-lg", className)}
        />
        </div>
    );
}

export const PasswordInput = ({ label, name, value, onChange, placeholder, className }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className={`flex flex-col ${className}`}>
            {label && 
                <label htmlFor={name} className={cn("mb-2 text-sm font-bold", className)}>{label}</label>
            }
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={cn("px-4 py-2 border border-blue-950 rounded-lg", className)}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                    {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                </button>
            </div>
        </div>
    );
}