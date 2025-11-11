"use client";

import { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon: LucideIcon;
};

export default function InputWithIcon({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  icon: Icon,
}: Props) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium">{label}</label>
      <Icon className="absolute left-3 top-9 text-gray-400 w-5 h-5" />
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-1 block w-full rounded-md border border-gray-300 p-2 pl-10"
      />
    </div>
  );
}
