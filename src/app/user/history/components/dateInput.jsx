"use client";

import { cn } from "@/lib/cn";

export const DateInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  className, 
  inputClassName,
  placeholder = "Select date"
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={name} className="mb-2 text-sm font-bold text-sky-950">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "px-4 py-2 border-2 border-sky-950 rounded-3xl bg-[#f9f9f9] text-sky-950 w-full focus:outline-none focus:border-sky-700",
          inputClassName
        )}
      />
    </div>
  );
};
