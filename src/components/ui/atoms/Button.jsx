"use client";

import { cn } from "@/lib/cn";

export const Button = ({variant ="default", className, children, icon, ...props }) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-xl text-sm font-medium text-white",
        variant === "default" && "bg-sky-950",
        variant === "success" && "bg-green-600",
        variant === "danger" && "bg-red-600",
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}