"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_ITEMS = [
  { href: "/", label: "1. Hoje & Termômetro", short: "Hoje" },
  { href: "/cards", label: "2. Matriz Multi-Cartões", short: "Cartões" },
  { href: "/inbox", label: "3. Ingestão PDF & Inbox IA", short: "Inbox IA" },
  { href: "/contracts", label: "4. Simulador 30 Anos", short: "Contratos" },
  { href: "/profile", label: "5. Perfil, Família & LGPD", short: "Perfil" },
  { href: "/admin", label: "6. Painel SaaS Admin", short: "Admin" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Widescreen Left Journey Rail */}
      <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col justify-between border-r border-[#E2E9DC] bg-[#FFFFFF] p-5 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#8CBA51] flex items-center justify-center text-white font-bold shadow-sm">
              PFM
            </div>
            <div>
              <div className="font-bold text-[#141D14] tracking-tight leading-tight">
                PFM Core Banking V3
              </div>
              <div className="text-[11px] font-medium text-[#4A5A4A]">
                Organic Financial Pulse
              </div>
            </div>
          </div>

          <nav aria-label="Navegação Principal" className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#DEFF8B] text-[#141D14] font-semibold shadow-sm border border-[#8CBA51]/40"
                      : "text-[#4A5A4A] hover:bg-[#F7F9F5] hover:text-[#141D14]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="rounded-xl bg-[#F7F9F5] border border-[#E2E9DC] p-3 text-xs text-[#4A5A4A]">
          <div className="font-semibold text-[#141D14]">Zero-Trust RLS + KMS</div>
          <div className="mt-0.5">HTTP/3 • ETag • OTel Tail-Sampled</div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 border-b border-[#E2E9DC] bg-[#FFFFFF]/95 backdrop-blur px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#8CBA51] flex items-center justify-center text-white font-bold text-xs">
            PFM
          </div>
          <span className="font-bold text-sm text-[#141D14]">
            PFM Core Banking V3
          </span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#DEFF8B] text-[#141D14] font-semibold">
          Organic Pulse
        </span>
      </header>

      {/* Mobile Bottom Journey Bar */}
      <nav
        aria-label="Navegação Mobile"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[#E2E9DC] bg-[#FFFFFF]/95 backdrop-blur flex items-center justify-around px-1 py-1.5"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-[#DEFF8B] text-[#141D14] font-semibold"
                  : "text-[#4A5A4A]"
              }`}
            >
              {item.short}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
