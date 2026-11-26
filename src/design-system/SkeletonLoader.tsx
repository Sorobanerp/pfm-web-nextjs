"use client";

import React from "react";

export interface SkeletonLoaderProps {
  variant?: "card" | "list" | "metric";
  count?: number;
}

export function SkeletonLoader({
  variant = "card",
  count = 3,
}: SkeletonLoaderProps) {
  if (variant === "metric") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Carregando métricas">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse rounded-3xl border border-[#E6ECE2] bg-white p-6"
          >
            <div className="h-3 w-24 rounded-full bg-[#E6ECE2]" />
            <div className="mt-4 h-8 w-36 rounded-xl bg-[#EEF3EA]" />
            <div className="mt-3 h-3 w-40 rounded-full bg-[#F7F9F5]" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3" aria-label="Carregando lista">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="flex animate-pulse items-center justify-between rounded-2xl border border-[#E6ECE2] bg-white p-4"
          >
            <div className="space-y-2">
              <div className="h-3.5 w-48 rounded-full bg-[#E6ECE2]" />
              <div className="h-3 w-28 rounded-full bg-[#F7F9F5]" />
            </div>
            <div className="h-5 w-20 rounded-lg bg-[#EEF3EA]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="animate-pulse rounded-3xl border border-[#E6ECE2] bg-white p-6"
      aria-label="Carregando conteúdo"
    >
      <div className="h-4 w-40 rounded-full bg-[#E6ECE2]" />
      <div className="mt-4 h-24 rounded-2xl bg-[#F7F9F5]" />
    </div>
  );
}
