// src/atoms/Select.tsx
import { ChangeEvent } from "react";
import { colors } from "../styles/colors";

interface SelectProps {
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  className?: string;
}

export function Select({ name, value, onChange, options, className = "" }: SelectProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      style={{ borderColor: colors.border, color: colors.textPrimary }}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}