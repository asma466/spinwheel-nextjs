'use client';

import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import React from "react";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showPassword: boolean;
  toggleShow: () => void;
  required?: boolean;
}

export const PasswordField = ({
  label,
  value,
  onChange,
  placeholder,
  showPassword,
  toggleShow,
  required = false,
}: PasswordFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="pr-10 h-11 rounded-xl"
        />

        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black transition"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};