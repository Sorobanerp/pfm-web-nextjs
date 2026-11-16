"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "1. Visão Consolidada & Termômetro" },
  { href: "/cards", label: "2. Matriz Multi-Cartões" },
  { href: "/inbox", label: "3. Inbox de Revisão (IA Camada 1)" },
  { href: "/contracts", label: "4. Simulador SAC / Price / Consórcio" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
            PFM
          </div>
          <div>
            <span className="font-semibold text-white tracking-tight">
              PFM Core Banking V2
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              HTTP/3 + ETag + RLS
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
