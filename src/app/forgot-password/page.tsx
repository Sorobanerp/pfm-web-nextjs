"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { PulseBadge } from "@/design-system";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-[#E6ECE2] bg-white p-7 shadow-sm">
        <PulseBadge variant="peach">Recuperação de Acesso</PulseBadge>
        <h1 className="mt-3 text-2xl font-bold text-[#141D14]">
          Esqueceu sua senha?
        </h1>
        <p className="mt-1.5 text-sm text-[#5A6B5A]">
          Sem problemas. Informe seu e-mail para receber um link seguro de redefinição.
        </p>

        {sent ? (
          <div className="mt-6 space-y-4 rounded-2xl bg-[#F7FBF0] p-5 text-center">
            <MailCheck className="mx-auto h-8 w-8 text-[#8CBA51]" />
            <p className="text-sm font-semibold text-[#141D14]">
              Instruções enviadas para {email}
            </p>
            <p className="text-xs text-[#5A6B5A]">
              Você também pode testar a etapa seguinte diretamente no link abaixo.
            </p>
            <Link
              href="/reset-password"
              className="inline-block rounded-full bg-[#8CBA51] px-5 py-2.5 text-xs font-semibold text-white"
            >
              Ir para redefinição de senha
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="forgot-email" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
                E-mail cadastrado
              </label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@familia.com.br"
                required
                className="w-full rounded-2xl border border-[#E6ECE2] px-4 py-3 text-sm outline-none focus:border-[#8CBA51]"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-[#8CBA51] py-3 text-sm font-semibold text-white transition hover:bg-[#7AA842]"
            >
              Enviar link de recuperação
            </button>
          </form>
        )}

        <div className="mt-5 text-center">
          <Link href="/login" className="text-xs font-semibold text-[#5A6B5A] hover:text-[#141D14]">
            ← Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}
