"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  FileSpreadsheet,
  FileUp,
  Inbox,
  LayoutDashboard,
  LogOut,
  Plus,
  Receipt,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { MoneyInputBRL } from "./MoneyInputBRL";
import { PulseBadge } from "./PulseBadge";
import { createTransaction, PfmApiError } from "@/lib/api/client";
import { clearSession, getSession, type PfmSession } from "@/lib/api/session";

const AUTH_SHELL_HIDDEN_ROUTES = new Set([
  "/login",
  "/register",
  "/verify",
  "/forgot-password",
  "/reset-password",
  "/onboarding",
  "/admin/login",
]);

const NAV_ITEMS = [
  { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/cards", label: "Cartões & Limites", icon: CreditCard },
  { href: "/import", label: "Importar PDF (RAM)", icon: FileUp },
  { href: "/inbox", label: "Inbox IA", icon: Inbox },
  { href: "/nfce", label: "Radar NFC-e", icon: Receipt },
  { href: "/contracts", label: "Contratos 30 Anos", icon: FileSpreadsheet },
  { href: "/family", label: "Família & LGPD", icon: Users },
  { href: "/admin", label: "SaaS Admin", icon: ShieldCheck },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isAuthScreen = AUTH_SHELL_HIDDEN_ROUTES.has(pathname);

  const [session, setSession] = useState<PfmSession | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("0.00");
  const [category, setCategory] = useState("ALIMENTACAO :: SUPERMERCADO");
  const [submitting, setSubmitting] = useState(false);
  const [quickMsg, setQuickMsg] = useState<string | null>(null);
  const [quickErr, setQuickErr] = useState<string | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQuickOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setQuickOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickErr(null);
    setQuickMsg(null);
    if (!desc.trim() || Number.parseFloat(amount) <= 0) {
      setQuickErr("Informe uma descrição e um valor positivo em R$.");
      return;
    }
    setSubmitting(true);
    try {
      await createTransaction({
        description: desc.trim(),
        amount,
        category_code: category,
      });
      setQuickMsg("Lançamento registrado com sucesso!");
      setDesc("");
      setAmount("0.00");
      setTimeout(() => {
        setQuickOpen(false);
        setQuickMsg(null);
      }, 900);
    } catch (err) {
      if (err instanceof PfmApiError) {
        setQuickErr(err.userMessage);
      } else {
        setQuickErr("Não foi possível registrar agora. Verifique se o BFF local está ativo.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    window.location.assign("/login");
  };

  if (isAuthScreen) {
    return (
      <div className="min-h-screen w-full bg-[#F7F9F5] text-[#141D14]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F7F9F5] text-[#141D14]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:justify-between border-r border-[#E6ECE2] bg-white px-5 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8CBA51]">
                PFM Pulse
              </p>
              <p className="text-base font-bold tracking-tight text-[#141D14]">
                PFM Core Banking V3
              </p>
            </div>
            <PulseBadge variant="lime">BRL</PulseBadge>
          </div>

          <button
            type="button"
            onClick={() => setQuickOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl bg-[#DEFF8B] px-4 py-3 text-sm font-semibold text-[#141D14] transition hover:bg-[#D2FA72]"
          >
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Lançamento Rápido
            </span>
            <kbd className="rounded-lg bg-white/80 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#141D14]">
              Ctrl+K
            </kbd>
          </button>

          <nav aria-label="Navegação principal" className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href === "/dashboard" && pathname === "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-[#F7F9F5] font-semibold text-[#141D14] border border-[#E6ECE2]"
                      : "text-[#5A6B5A] hover:bg-[#F7F9F5] hover:text-[#141D14]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-[#8CBA51]" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 border-t border-[#E6ECE2] pt-4">
          {session ? (
            <div className="rounded-2xl bg-[#F7F9F5] p-3">
              <p className="truncate text-xs font-semibold text-[#141D14]">
                {session.tenantName}
              </p>
              <p className="truncate text-[11px] text-[#5A6B5A]">
                {session.email || session.role}
              </p>
            </div>
          ) : (
            <Link
              href="/login"
              className="block rounded-2xl border border-[#E6ECE2] px-3.5 py-2 text-center text-xs font-semibold text-[#141D14] hover:bg-[#F7F9F5]"
            >
              Entrar na conta
            </Link>
          )}
          {session ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E6ECE2] px-3.5 py-2 text-xs font-semibold text-[#5A6B5A] transition hover:border-[#FF5D6C] hover:text-[#FF5D6C]"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair da sessão
            </button>
          ) : null}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 w-full px-4 sm:px-6 lg:px-10 py-6 pb-24 md:pb-10">
        {children}
      </main>

      {/* Mobile Bottom Bar */}
      <nav
        aria-label="Navegação mobile"
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[#E6ECE2] bg-white/95 px-2 py-2 backdrop-blur md:hidden"
      >
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-[#5A6B5A]"
        >
          <LayoutDashboard className="h-4 w-4" />
          Início
        </Link>
        <Link
          href="/cards"
          className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-[#5A6B5A]"
        >
          <CreditCard className="h-4 w-4" />
          Cartões
        </Link>
        <button
          type="button"
          onClick={() => setQuickOpen(true)}
          aria-label="Lançamento Rápido"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8CBA51] text-white shadow-sm"
        >
          <Plus className="h-5 w-5" />
        </button>
        <Link
          href="/inbox"
          className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-[#5A6B5A]"
        >
          <Inbox className="h-4 w-4" />
          Inbox
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-[#5A6B5A]"
        >
          <Users className="h-4 w-4" />
          Família
        </Link>
      </nav>

      {/* Ctrl+K Quick Launch Modal */}
      {quickOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Lançamento Rápido"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#141D14]/35 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-3xl border border-[#E6ECE2] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <PulseBadge variant="lime">Atalho Ctrl+K</PulseBadge>
                <h2 className="mt-2 text-lg font-bold text-[#141D14]">
                  Registrar gasto em segundos
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setQuickOpen(false)}
                aria-label="Fechar lançamento rápido"
                className="rounded-full p-2 text-[#5A6B5A] hover:bg-[#F7F9F5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleQuickSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="quick-desc"
                  className="mb-1.5 block text-xs font-semibold text-[#141D14]"
                >
                  Onde foi essa compra?
                </label>
                <input
                  id="quick-desc"
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Ex.: Supermercado Pão de Açúcar"
                  className="w-full rounded-2xl border border-[#E6ECE2] px-4 py-3 text-sm text-[#141D14] outline-none focus:border-[#8CBA51]"
                />
              </div>

              <MoneyInputBRL
                id="quick-amount"
                label="Valor em Reais (BRL)"
                value={amount}
                onChange={(val) => setAmount(val)}
              />

              <div>
                <label
                  htmlFor="quick-cat"
                  className="mb-1.5 block text-xs font-semibold text-[#141D14]"
                >
                  Categoria
                </label>
                <select
                  id="quick-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-[#E6ECE2] bg-white px-4 py-3 text-sm text-[#141D14] outline-none focus:border-[#8CBA51]"
                >
                  <option value="ALIMENTACAO :: SUPERMERCADO">
                    Alimentação • Supermercado
                  </option>
                  <option value="ALIMENTACAO :: RESTAURANTES_GASTRONOMIA">
                    Alimentação • Restaurantes
                  </option>
                  <option value="TRANSPORTE :: APLICATIVOS_MOBILIDADE">
                    Transporte • Mobilidade
                  </option>
                  <option value="SAUDE :: FARMACIA_MEDICAMENTOS">
                    Saúde • Farmácia
                  </option>
                  <option value="MORADIA :: MANUTENCAO_REPAROS">
                    Moradia • Casa
                  </option>
                </select>
              </div>

              {quickErr ? (
                <p className="rounded-2xl bg-[#FFF5F6] px-4 py-2.5 text-xs font-medium text-[#FF5D6C]">
                  {quickErr}
                </p>
              ) : null}
              {quickMsg ? (
                <p className="rounded-2xl bg-[#DEFF8B]/60 px-4 py-2.5 text-xs font-semibold text-[#141D14]">
                  {quickMsg}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-[#8CBA51] py-3 text-sm font-semibold text-white transition hover:bg-[#7AA842] disabled:opacity-60"
              >
                {submitting ? "Salvando lançamento..." : "Confirmar lançamento"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
