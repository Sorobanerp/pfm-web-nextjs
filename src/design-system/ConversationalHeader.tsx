"use client";

import React from "react";
import { PulseBadge, type PulseBadgeVariant } from "./PulseBadge";

export interface ConversationalHeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeVariant?: PulseBadgeVariant;
  actions?: React.ReactNode;
}

export function ConversationalHeader({
  title,
  subtitle,
  badgeText,
  badgeVariant = "lime",
  actions,
}: ConversationalHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {badgeText ? <PulseBadge variant={badgeVariant}>{badgeText}</PulseBadge> : null}
        <h1 className="text-2xl font-bold tracking-tight text-[#141D14] sm:text-3xl">
          {title}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[#5A6B5A]">
          {subtitle}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  );
}
