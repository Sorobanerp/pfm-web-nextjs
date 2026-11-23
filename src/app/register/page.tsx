"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PulseBadge } from "@/design-system";
import { evaluatePasswordStrength } from "@/lib/api/passwordStrength";
import { REGISTER_DRAFT_KEY } from "@/lib/api/session";

type PlanOption = "FREE" | "INDIVIDUAL_PRO" | "FAMILY_PLUS";

const PLANS: Array<{
  id: PlanOption;
  name: string;
  priceBRL: string;
  desc: string;
}> = [
  { id: "FREE", name: "Grátis", priceBRL: "R$ 0,00/mês", desc: "1 cartão e visão mensal essencial." },
  { id: "INDIVIDUAL_PRO", name: "Individual Pro", priceBRL: "R$ 29,90/mês", desc: "Importação PDF RAM + Radar NFC-e + Simulador 30 anos." },
  { id: "FAMILY_PLUS", name: "Família Plus", priceBRL: "R$ 49,90/mês", desc: "Até 5 membros, tetos por categoria e governança familiar." },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<PlanOption>("FAMILY_PLUS");
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const strength = evaluatePasswordStrength(password);

  const handleNextStep = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!fullName.trim() || !email.trim() || password.length < 8) {
        setErrorMsg("Preencha seu nome, e-mail válido e uma senha com pelo menos 8 caracteres.");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
    }
  };

  const handleFinishRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!lgpdConsent) {
      setErrorMsg("Você precisa aceitar os termos de privacidade LGPD para criar sua conta.");
      return;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        REGISTER_DRAFT_KEY,
        JSON.stringify({ fullName: fullName.trim(), email: email.trim(), plan })
      );
    }
    router.push("/verify");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-[#E6ECE2] bg-white p-7 shadow-sm sm:p-9">
        <div className="flex items-center justify-between">
          <PulseBadge variant="lime">Passo {step} de 3</PulseBadge>
          <Link href="/login" className="text-xs font-semibold text-[#5A6B5A] hover:text-[#141D14]">
            Já tenho conta
          </Link>
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#141D14]">
          {step === 1 && "Crie seu espaço financeiro no PFM Pulse"}
          {step === 2 && "Escolha o plano ideal para sua rotina"}
          {step === 3 && "Privacidade LGPD e confirmação"}
        </h1>
        <p className="mt-1 text-sm text-[#5A6B5A]">
          {step === 1 && "Seus dados ficam isolados por família com criptografia Zero-Trust."}
          {step === 2 && "Todos os valores são transparentes em BRL (R$). Você pode trocar depois."}
          {step === 3 && "Você tem controle total sobre exportação e exclusão definitiva dos dados."}
        </p>

        <form onSubmit={handleFinishRegister} className="mt-6 space-y-5">
          {step === 1 ? (
            <>
              <div>
                <label htmlFor="reg-name" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
                  Nome completo
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex.: Mariana Dantas"
                  className="w-full rounded-2xl border border-[#E6ECE2] px-4 py-3 text-sm outline-none focus:border-[#8CBA51]"
                />
              </div>

              <div>
                <label htmlFor="reg-email" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
                  E-mail principal
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mariana@familia.com.br"
                  className="w-full rounded-2xl border border-[#E6ECE2] px-4 py-3 text-sm outline-none focus:border-[#8CBA51]"
                />
              </div>

              <div>
                <label htmlFor="reg-password" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
                  Senha de acesso
                </label>
                <input
                  id="reg-password"
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
            </>
          ) : null}

          {step === 2 ? (
            <div className="space-y-3">
              {PLANS.map((item) => {
                const selected = plan === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPlan(item.id)}
                    className={`flex w-full items-start justify-between rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-[#8CBA51] bg-[#F7FBF0]"
                        : "border-[#E6ECE2] bg-white hover:bg-[#F7F9F5]"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-[#141D14]">{item.name}</p>
                      <p className="mt-1 text-xs text-[#5A6B5A]">{item.desc}</p>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#141D14] tabular-nums">
                      {item.priceBRL}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#F7F9F5] p-4 text-xs leading-relaxed text-[#5A6B5A]">
                <p className="font-semibold text-[#141D14]">Compromisso Zero-Trust LGPD:</p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  <li>Faturas PDF processadas 100% em RAM com descarte imediato.</li>
                  <li>Chave criptográfica dedicada por família (Crypto-Shredding Art. 18).</li>
                  <li>Nenhum administrador da plataforma lê seus extratos privados.</li>
                </ul>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#E6ECE2] p-4">
                <input
                  type="checkbox"
                  checked={lgpdConsent}
                  onChange={(e) => setLgpdConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#8CBA51]"
                />
                <span className="text-xs leading-relaxed text-[#141D14]">
                  Li e concordo com os Termos de Uso e Política de Privacidade LGPD do PFM Pulse.
                </span>
              </label>
            </div>
          ) : null}

          {errorMsg ? (
            <p className="rounded-2xl bg-[#FFF5F6] px-4 py-2.5 text-xs font-medium text-[#FF5D6C]">
              {errorMsg}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-3 pt-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
                className="rounded-full border border-[#E6ECE2] px-5 py-2.5 text-sm font-semibold text-[#141D14] hover:bg-[#F7F9F5]"
              >
                Voltar
              </button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="rounded-full bg-[#8CBA51] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7AA842]"
              >
                Continuar
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-[#8CBA51] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7AA842]"
              >
                <CheckCircle2 className="h-4 w-4" />
                Concluir e verificar código
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
