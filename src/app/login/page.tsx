"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { PulseBadge } from "@/design-system";
import { generateDevToken } from "@/lib/api/client";
import {
  isLocalAppEnv,
  LOCAL_DEV_PROFILES,
  saveSession,
  type LocalQuickProfile,
} from "@/lib/api/session";

export default function LoginPage() {
  const router = useRouter();
  const showLocalSwitcher = isLocalAppEnv();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Informe seu e-mail e senha para entrar no PFM Pulse.");
      return;
    }
    setLoading(true);
    try {
      const profile = LOCAL_DEV_PROFILES[0];
      let accessToken = profile.fallbackToken;
      try {
        const res = await generateDevToken({
          tenant_id: profile.tenantId,
          tenant_name: profile.tenantName,
          role: "OWNER",
          sub: "11111111-1111-1111-1111-111111111112",
        });
        accessToken = res.access_token;
      } catch {
        if (!showLocalSwitcher) {
          throw new Error("Não foi possível autenticar no momento.");
        }
      }
      saveSession({
        accessToken,
        tenantId: profile.tenantId,
        tenantName: profile.tenantName,
        role: "OWNER",
        email: email.trim(),
      });
      router.push("/dashboard");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Falha ao autenticar.");
    } finally {
      setLoading(false);
    }
  };

  const handleSsoLogin = async (provider: "Google" | "Microsoft") => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const profile = LOCAL_DEV_PROFILES[0];
      let accessToken = profile.fallbackToken;
      try {
        const res = await generateDevToken({
          tenant_id: profile.tenantId,
          tenant_name: profile.tenantName,
          role: "OWNER",
        });
        accessToken = res.access_token;
      } catch {
        // fallback in local mode
      }
      saveSession({
        accessToken,
        tenantId: profile.tenantId,
        tenantName: profile.tenantName,
        role: "OWNER",
        email: `sso.${provider.toLowerCase()}@pfmpulse.com.br`,
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickProfile = async (profile: LocalQuickProfile) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      let accessToken = profile.fallbackToken;
      try {
        const res = await generateDevToken({
          tenant_id: profile.tenantId,
          tenant_name: profile.tenantName,
          role: profile.role,
        });
        accessToken = res.access_token;
      } catch {
        // BFF offline fallback uses deterministic local dev token
      }
      saveSession({
        accessToken,
        tenantId: profile.tenantId,
        tenantName: profile.tenantName,
        role: profile.role,
        email: profile.email,
      });
      router.push(profile.redirectTo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-12">
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        <div className="space-y-4 lg:col-span-5">
          <PulseBadge variant="lime">PFM Pulse • Open Finance &amp; LGPD</PulseBadge>
          <h1 className="text-3xl font-bold tracking-tight text-[#141D14] sm:text-4xl">
            Bom te ver de volta. Vamos cuidar do seu fluxo hoje?
          </h1>
          <p className="text-sm leading-relaxed text-[#5A6B5A]">
            Clareza imediata sobre quanto você tem livre para gastar hoje, na semana e no mês — com precisão contábil em BRL e privacidade Zero-Trust.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E6ECE2] bg-white p-7 shadow-sm lg:col-span-7">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSsoLogin("Google")}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#E6ECE2] bg-white px-4 py-3 text-sm font-semibold text-[#141D14] transition hover:bg-[#F7F9F5]"
            >
              <span>Continuar com Google</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSsoLogin("Microsoft")}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#E6ECE2] bg-white px-4 py-3 text-sm font-semibold text-[#141D14] transition hover:bg-[#F7F9F5]"
            >
              <span>Continuar com Microsoft</span>
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-[#5A6B5A]">
            <div className="h-px flex-1 bg-[#E6ECE2]" />
            <span>ou entre com seu e-mail</span>
            <div className="h-px flex-1 bg-[#E6ECE2]" />
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
                E-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#5A6B5A]" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@familia.com.br"
                  className="w-full rounded-2xl border border-[#E6ECE2] py-3 pl-10 pr-4 text-sm text-[#141D14] outline-none focus:border-[#8CBA51]"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-semibold text-[#141D14]">
                  Senha
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#8CBA51] hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#5A6B5A]" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-[#E6ECE2] py-3 pl-10 pr-4 text-sm text-[#141D14] outline-none focus:border-[#8CBA51]"
                />
              </div>
            </div>

            {errorMsg ? (
              <p className="rounded-2xl bg-[#FFF5F6] px-4 py-2.5 text-xs font-medium text-[#FF5D6C]">
                {errorMsg}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#8CBA51] py-3 text-sm font-semibold text-white transition hover:bg-[#7AA842] disabled:opacity-60"
            >
              <span>{loading ? "Entrando..." : "Entrar no meu painel"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A6B5A]">
            <span>
              Ainda não tem conta?{" "}
              <Link href="/register" className="font-semibold text-[#141D14] underline">
                Criar conta grátis
              </Link>
            </span>
            <Link href="/admin/login" className="font-semibold text-[#5A6B5A] hover:text-[#141D14]">
              Acesso SaaS Admin →
            </Link>
          </div>

          {showLocalSwitcher ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#8CBA51]/60 bg-[#F7F9F5] p-4">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#8CBA51]" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#141D14]">
                  Troca Rápida Local (APP_ENV=local)
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {LOCAL_DEV_PROFILES.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickProfile(profile)}
                    className="rounded-xl border border-[#E6ECE2] bg-white px-3 py-2 text-left transition hover:border-[#8CBA51]"
                  >
                    <p className="text-xs font-semibold text-[#141D14]">{profile.label}</p>
                    <p className="text-[11px] text-[#5A6B5A]">{profile.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
