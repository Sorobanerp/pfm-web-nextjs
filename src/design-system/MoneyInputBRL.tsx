"use client";

import React, { useMemo } from "react";

export interface MoneyInputBRLProps {
  id?: string;
  label?: string;
  value: string; // decimal string e.g. "189.40"
  onChange: (decimalValue: string, cents: number) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

function toCents(decimalValue: string): number {
  const cleaned = decimalValue.replace(/[^\d.]/g, "");
  if (!cleaned) return 0;
  const parsed = Number.parseFloat(cleaned);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.round(parsed * 100);
}

function formatCentsToBRLDisplay(cents: number): string {
  const whole = Math.floor(cents / 100);
  const frac = String(cents % 100).padStart(2, "0");
  const wholeFormatted = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${wholeFormatted},${frac}`;
}

export function MoneyInputBRL({
  id = "money-input-brl",
  label,
  value,
  onChange,
  placeholder = "R$ 0,00",
  disabled = false,
  error,
  className = "",
}: MoneyInputBRLProps) {
  const cents = useMemo(() => toCents(value), [value]);
  const displayValue = cents > 0 ? formatCentsToBRLDisplay(cents) : "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    const nextCents = digitsOnly ? Number.parseInt(digitsOnly, 10) : 0;
    const safeCents = Number.isFinite(nextCents) ? Math.min(nextCents, 999_999_999) : 0;
    const decimalString = (safeCents / 100).toFixed(2);
    onChange(decimalString, safeCents);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label ? (
        <label htmlFor={id} className="text-xs font-semibold text-[#141D14]">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-2xl border bg-white px-4 py-3 font-mono text-base font-semibold text-[#141D14] tabular-nums outline-none transition focus:ring-2 ${
          error
            ? "border-[#FF5D6C] focus:ring-[#FF5D6C]/30"
            : "border-[#E6ECE2] focus:border-[#8CBA51] focus:ring-[#8CBA51]/25"
        } disabled:cursor-not-allowed disabled:bg-[#F7F9F5] disabled:text-[#5A6B5A]`}
      />
      {error ? <p className="text-xs font-medium text-[#FF5D6C]">{error}</p> : null}
    </div>
  );
}
