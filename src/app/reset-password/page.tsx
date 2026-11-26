"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PulseBadge } from "@/design-system";
import { evaluatePasswordStrength } from "@/lib/api/passwordStrength";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const strength = evaluatePasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password.length < 8) {
      setErrorMsg("A nova senha precisa ter no mínimo 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("As senhas digitadas não coincidem.");
      return;
    }
    router.push("/login");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-[#E6ECE2] bg-white p-7 shadow-sm">
        <PulseBadge variant="lime">Nova Senha</PulseBadge>
        <h1 className="mt-3 text-2xl font-bold text-[#141D14]">
          Defina sua nova senha
        </h1>
        <p className="mt-1.5 text-sm text-[#5A6B5A]">
          Escolha uma senha forte para proteger seu cofre familiar.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="reset-pw" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
              Nova senha
            </label>
            <input
              id="reset-pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-2xl border border-[#E6ECE2] px-4 py-3 text-sm outline-none focus:border-[#8CBA51]"
            />
            <div className="mt-2 flex items-center gap-2">
              <div className="grid flex-1 grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={`h-1.5 rounded-full ${
                      strength.score >= bar ? strength.colorClass : "bg-[#E6ECE2]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#5A6B5A]">{strength.label}</span>
            </div>
          </div>

          <div>
            <label htmlFor="reset-confirm" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
              Confirmar nova senha
            </label>
            <input
              id="reset-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repita a nova senha"
              className="w-full rounded-2xl border border-[#E6ECE2] px-4 py-3 text-sm outline-none focus:border-[#8CBA51]"
            />
          </div>

          {errorMsg ? (
            <p className="rounded-2xl bg-[#FFF5F6] px-4 py-2 text-xs font-medium text-[#FF5D6C]">
              {errorMsg}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-full bg-[#8CBA51] py-3 text-sm font-semibold text-white transition hover:bg-[#7AA842]"
          >
            Salvar nova senha e entrar
          </button>
        </form>
      </div>
    </div>
  );
}
