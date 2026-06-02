"use client";

import { Controller } from "react-hook-form";

type Props = {
  name: string;
  control: any;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
};

export default function Input({
  name,
  control,
  label,
  type = "text",
  placeholder,
  className = "",
  labelClassName = "",
  disabled = false,
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1 w-full">
          {/* LABEL */}
          {label && (
            <label className={`text-[15px] font-semibold text-gray-800  ${labelClassName}`}>
              {label}
            </label>
          )}

          {/* INPUT */}
          <input
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={`bg-white
              px-4 py-2 rounded-xl border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-red-500 
              placeholder-gray-400 text-gray-900 transition
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
          />

          {/* ERROR */}
          {fieldState?.error && (
            <p className="text-red-500 text-sm">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
