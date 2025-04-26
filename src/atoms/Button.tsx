// src/atoms/Button.tsx
import { MouseEvent } from "react";
import { colors } from "../styles/colors";

interface ButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "info";
  className?: string;
}

export function Button({ onClick, children, variant = "primary", className = "" }: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg font-semibold transition-colors";
  const variantStyles = {
    primary: `bg-[${colors.primary}] text-white hover:bg-blue-700`,
    secondary: `bg-[${colors.secondary}] text-white hover:bg-gray-600`,
    danger: `bg-[${colors.danger}] text-white hover:bg-red-700`,
    info: `bg-[${colors.info}] text-white hover:bg-blue-500`,
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{
        backgroundColor: variantStyles[variant].includes("bg-[")
          ? variantStyles[variant].match(/bg-\[(.+?)\]/)?.[1]
          : undefined,
      }}
    >
      {children}
    </button>
  );
}