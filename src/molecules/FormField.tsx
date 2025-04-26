// src/molecules/FormField.tsx
import { ChangeEvent } from "react";
import { Label } from "../atoms/Label";
import { Input } from "../atoms/Input";
import { Select } from "../atoms/Select";
import { colors } from "../styles/colors";

interface FormFieldProps {
  label: string;
  name: string;
  type: "text" | "number" | "date" | "textarea" | "select";
  value: string | number | boolean;
  onChange:
    | ((event: ChangeEvent<HTMLInputElement>) => void)
    | ((event: ChangeEvent<HTMLSelectElement>) => void)
    | ((event: ChangeEvent<HTMLTextAreaElement>) => void);
  options?: string[];
  disabled?: boolean;
  error?: string;
  placeholder?: string;
}

export function FormField({
  label,
  name,
  type,
  value,
  onChange,
  options,
  disabled,
  error,
  placeholder,
}: FormFieldProps) {
  return (
    <div className="mb-6">
      <Label htmlFor={name}>{label}</Label>
      {type === "select" && options ? (
        <Select
          name={name}
          value={value as string}
          onChange={onChange as (event: ChangeEvent<HTMLSelectElement>) => void}
          options={options}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ borderColor: colors.border, color: colors.textPrimary }}
        />
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value as string}
          onChange={onChange as (event: ChangeEvent<HTMLTextAreaElement>) => void}
          placeholder={placeholder}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ borderColor: colors.border, color: colors.textPrimary }}
        />
      ) : (
        <Input
          type={type}
          name={name}
          value={typeof value === "boolean" ? value.toString() : value}
          onChange={onChange as (event: ChangeEvent<HTMLInputElement>) => void}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ borderColor: colors.border, color: colors.textPrimary }}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}