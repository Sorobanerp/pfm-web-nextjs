"use client";

import React from "react";

export type PulseBadgeVariant = "lime" | "primary" | "peach" | "coral" | "neutral";

const VARIANT_CLASSES: Record<PulseBadgeVariant, string> = {
  lime: "bg-[#DEFF8B] text-[#141D14] border-[#C7EE6D]",
  primary: "bg-[#8CBA51] text-white border-[#7AA842]",
  peach: "bg-[#FBCEB5] text-[#3D1E10] border-[#F3B998]",
  coral: "bg-[#FF5D6C] text-white border-[#EB4656]",
  neutral: "bg-[#F7F9F5] text-[#141D14] border-[#E6ECE2]",
};

export interface PulseBadgeProps {
  children: React.ReactNode;
  variant?: PulseBadgeVariant;
  className?: string;
}

export function PulseBadge({
  children,
  variant = "neutral",
  className = "",
}: PulseBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
