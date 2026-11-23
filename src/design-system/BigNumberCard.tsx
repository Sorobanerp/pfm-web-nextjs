"use client";

import React from "react";
import { PulseBadge, type PulseBadgeVariant } from "./PulseBadge";

export interface BigNumberCardProps {
  title: string;
  value: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: PulseBadgeVariant;
  accent?: "default" | "lime" | "peach" | "coral";
  footer?: React.ReactNode;
}

const ACCENT_SURFACE: Record<NonNullable<BigNumberCardProps["accent"]>, string> = {
  default: "bg-white border-[#E6ECE2]",
  lime: "bg-[#F7FBF0] border-[#8CBA51]",
  peach: "bg-[#FFF8F4] border-[#FBCEB5]",
  coral: "bg-[#FFF5F6] border-[#FF5D6C]",
};

export function BigNumberCard({
  title,
  value,
  subtitle,
  badgeText,
  badgeVariant = "lime",
  accent = "default",
  footer,
}: BigNumberCardProps) {
  return (
    <section
      className={`rounded-3xl border p-6 shadow-sm transition-colors ${ACCENT_SURFACE[accent]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#5A6B5A]">
          {title}
        </p>
        {badgeText ? (
          <PulseBadge variant={badgeVariant}>{badgeText}</PulseBadge>
        ) : null}
      </div>

      <p className="mt-3 font-mono text-2xl font-bold tracking-tight text-[#141D14] tabular-nums sm:text-3xl">
        {value}
      </p>

      {subtitle ? (
        <p className="mt-2 text-xs leading-relaxed text-[#5A6B5A]">{subtitle}</p>
      ) : null}

      {footer ? <div className="mt-4 border-t border-[#E6ECE2] pt-3">{footer}</div> : null}
    </section>
  );
}
