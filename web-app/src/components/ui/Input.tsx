"use client";

import { Controller } from "react-hook-form";

type Props = {
  name: string;
  control: any;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string; // ✅ added
  labelClassName?: string;
};

export default function Input({
  name,
  control,
  label,
  type = "text",
  placeholder,
  className = "",
  labelClassName = "",
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1 w-full">
          {label && (
            <label className={`text-sm font-medium ${labelClassName}`}>
              {label}
            </label>
          )}
          <input
            {...field}
            value={field.value ?? ""}
            type={type}
            placeholder={placeholder}
            className={`px-4 py-2 rounded-xl border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-red-500 
              placeholder-gray-400 text-gray-900 transition
              ${className}`}
          />

          {fieldState.error && (
            <p className="text-red-500 text-sm">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
