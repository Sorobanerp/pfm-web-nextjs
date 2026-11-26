"use client";

import React from "react";

export interface EmptyStateCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyStateCard({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateCardProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-[#E6ECE2] bg-white px-6 py-12 text-center shadow-sm">
      {icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DEFF8B]/60 text-[#141D14]">
          {icon}
        </div>
      ) : null}
      <h2 className="text-base font-bold text-[#141D14]">{title}</h2>
      <p className="mt-1.5 max-w-md text-sm text-[#5A6B5A]">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full bg-[#8CBA51] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7AA842]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
