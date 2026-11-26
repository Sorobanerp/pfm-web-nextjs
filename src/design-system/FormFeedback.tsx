"use client";

import React from "react";

export function PulseErrorAlert({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }
  return (
    <p className="rounded-2xl bg-[#FFF5F6] px-4 py-3 text-xs font-medium text-[#FF5D6C]">
      {message}
    </p>
  );
}

export function PulseSubmitButton({
  loading,
  idleLabel,
  loadingLabel,
}: {
  loading: boolean;
  idleLabel: string;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="rounded-full bg-[#8CBA51] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7AA842] disabled:opacity-60"
    >
      {loading ? loadingLabel : idleLabel}
    </button>
  );
}
