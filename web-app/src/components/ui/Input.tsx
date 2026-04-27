"use client";

import { Controller } from "react-hook-form";

type Props = {
  name: string;
  control: any;
  label?: string;
  type?: string;
  placeholder?: string;
};

export default function Input({
  name,
  control,
  label,
  type = "text",
  placeholder,
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue="" 
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1 w-full">
          {label && (
            <label className="text-black">
              {label}
            </label>
          )}

          <input
            {...field}
            value={field.value ?? ""} 
            type={type}
            placeholder={placeholder}
            className="px-4 py-2 rounded-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {fieldState.error && (
            <p className="text-red-500 text-sm">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
