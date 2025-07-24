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
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "px-4 py-2 border-1 border-sky-950 rounded-3xl placeholder-gray-400",
          className
        )}
      />
      </div>
    );
}

export const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={cn("mb-2 text-sm font-bold text-sky-950")}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "w-full px-4 py-2 pr-12 border border-sky-950 rounded-full bg-[#f9f9f9] text-sky-950 placeholder-gray-400",
            className
          )}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/3 -translate-y-1/8 text-sky-950"
        >
          {showPassword ? <IoMdEyeOff size={18} /> : <IoMdEye size={18} />}
        </button>
      </div>
    </div>
  );
};