"use client";

import { cn } from "@/lib/cn";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";

export const TextInput = ({ label, name, value, onChange, placeholder, className}) => {
    return (
      <div className={`flex flex-col ${className}`}>
      {label && 
        <label htmlFor={name} className={cn("mb-2 text-sm font-bold text-sky-950", className)}>{label}</label>
      }
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "px-4 py-2 border-2 border-sky-950 rounded-3xl placeholder-gray-400 w-full",
          className
        )}
      />
      </div>
    );
}

export const NumberInput = ({ label, name, value, onChange, placeholder, className}) => {
    return (
      <div className={`flex flex-col ${className}`}>
      {label && 
        <label htmlFor={name} className={cn("mb-2 text-sm font-bold text-sky-950", className)}>{label}</label>
      }
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type="number"
        className={cn(
          "px-4 py-2 border-2 border-sky-950 rounded-3xl placeholder-gray-400 w-full",
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
            "w-full px-4 py-2 pr-12 border-2 border-sky-950 rounded-full bg-[#f9f9f9] text-sky-950 placeholder-gray-400",
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

export const OptionInput = ({
  label, name, value, className
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={name} className={cn("mb-2 text-sm font-bold text-sky-950")}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          className={cn(
            "px-3 py-2 border-2 border-sky-950 rounded-full bg-[#f9f9f9] text-sky-950 placeholder-gray-400 w-full appearance-none",
            className
          )}
          style={{ paddingRight: "2.5rem" }}
        >
          <option value="" disabled className="border border-sky-900">Select an option</option>
          {/* Add options here */}
        </select>
        {/* Dropdown icon, shifted a bit to the left */}
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sky-950">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
      <style jsx>{`
        select option {
          border-width: 1px;
          border-color: #0c4a6e; /* sky-900 */
        }
      `}</style>
    </div>
  );
}

export const QtyInput = ({ label, className }) => {
  const [qty, setQty] = useState(0);
  const increment = () => setQty((prev) => prev + 1);
  const decrement = () => setQty((prev) => (prev > 0 ? prev - 1 : 0));
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="mb-2 text-sm font-bold text-sky-950">{label}</label>
      )}
      <div className="flex flex-row justify-between items-center rounded-full border-2 border-sky-950 overflow-hidden px-2 py-4 select-none h-[44px]">
        <button
          type="button"
          onClick={decrement}
          className="bg-sky-950 text-white w-6 h-6 flex justify-center items-center text-sm font-bold rounded-full"
          aria-label="Decrease quantity"
        >
          <span><FaMinus /></span>
        </button>
        <input
          type="text"
          readOnly
          value={qty}
          className="w-12 text-center bg-transparent outline-none text-sky-950 font-medium"
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={increment}
          className="bg-sky-950 text-white w-6 h-6 flex justify-center items-center text-sm font-bold rounded-full"
          aria-label="Increase quantity"
        >
          <span><FaPlus /></span>
        </button>
      </div>
    </div>
  );
}

export const FileInput = ({ label, name, onChange, className }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={name} className={cn("mb-2 text-sm font-bold text-sky-950")}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type="file"
        onChange={onChange}
        className={cn(
          "px-4 py-2 border-2 border-sky-950 rounded-full bg-[#f9f9f9] text-sky-950 placeholder-gray-400 w-full",
          className
        )}
      />
    </div>
  );
}