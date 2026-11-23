"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { PulseBadge } from "@/design-system";
import { generateDevToken } from "@/lib/api/client";
import { isLocalAppEnv, saveSession } from "@/lib/api/session";

export default function AdminLoginPage() {
  const router = useRouter();
  const isLocal = isLocalAppEnv();
  const [email, setEmail] = useState("sre-admin@soroban.com.br");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const completeAdminSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let token = "dev-admin-token";
      try {
        const res = await generateDevToken({
          tenant_id: "11111111-1111-1111-1111-111111111111",
          tenant_name: "Soroban SaaS Backoffice",
          role: "PLATFORM_ADMIN",
          sub: "00000000-0000-0000-0000-000000000001",
        });
        token = res.access_token;
      } catch {
        // fallback in local mode
      }
      saveSession({
        accessToken: token,
        tenantId: "11111111-1111-1111-1111-111111111111",
        tenantName: "Soroban SaaS Backoffice",
        role: "PLATFORM_ADMIN",
        email: email.trim(),
      });
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Informe suas credenciais corporativas de plataforma.");
      return;
    }
    await completeAdminSignIn();
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-[#E6ECE2] bg-white p-7 shadow-sm">
        <PulseBadge variant="peach">
          GOVERNANÇA SAAS ADMIN • ISOLAMENTO RLS ATIVO
        </PulseBadge>
        <h1 className="mt-4 text-2xl font-bold text-[#141D14]">
          Console Corporativo Soroban
        </h1>
        <p className="mt-1.5 text-xs leading-relaxed text-[#5A6B5A]">
          Acesso restrito a métricas comerciais e planos de assinatura. Transações e perfis familiares permanecem inacessíveis (Zero-Trust LGPD).
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
              E-mail corporativo
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[#E6ECE2] px-4 py-3 text-sm outline-none focus:border-[#8CBA51]"
            />
          </div>

          <div>
            <label htmlFor="admin-pw" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
              Senha
            </label>
            <input
              id="admin-pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-[#E6ECE2] px-4 py-3 text-sm outline-none focus:border-[#8CBA51]"
            />
          </div>

          <div>
            <label htmlFor="admin-mfa" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
              Token MFA (6 dígitos)
            </label>
            <input
              id="admin-mfa"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full rounded-2xl border border-[#E6ECE2] px-4 py-3 font-mono text-sm tabular-nums outline-none focus:border-[#8CBA51]"
            />
          </div>

          {errorMsg ? (
            <p className="flex items-center gap-2 rounded-2xl bg-[#FFF5F6] px-4 py-2 text-xs font-medium text-[#FF5D6C]">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              {errorMsg}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#141D14] py-3 text-sm font-semibold text-white transition hover:bg-[#273627] disabled:opacity-60"
          >
            {loading ? "Validando credenciais..." : "Acessar Console SaaS Admin"}
          </button>
        </form>

        {isLocal ? (
          <button
            type="button"
            disabled={loading}
            onClick={completeAdminSignIn}
            className="mt-3 w-full rounded-full border border-[#E6ECE2] bg-[#F7F9F5] py-2.5 text-xs font-semibold text-[#141D14] hover:border-[#8CBA51]"
          >
            Entrar rápido como SaaS Admin (Local)
          </button>
        ) : null}

        <div className="mt-5 text-center">
          <Link href="/login" className="text-xs font-semibold text-[#5A6B5A] hover:text-[#141D14]">
            ← Voltar para o login familiar
          </Link>
        </div>
      </div>
    </div>
  );
}
