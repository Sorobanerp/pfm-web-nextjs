"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Sparkles } from "lucide-react";
import { MoneyInputBRL, PulseBadge } from "@/design-system";
import { ONBOARDING_STORAGE_KEY } from "@/lib/api/session";

const GOALS = [
  "Organizar faturas de cartão e evitar o rotativo",
  "Controlar o orçamento mensal da família",
  "Acelerar a quitação de financiamento imobiliário",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [goal, setGoal] = useState(GOALS[0]);
  const [monthlyTarget, setMonthlyTarget] = useState("4500.00");

  const persistAndNavigate = (targetRoute: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({ goal, monthlyTargetBRL: monthlyTarget })
      );
    }
    router.push(targetRoute);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-[#E6ECE2] bg-white p-7 shadow-sm sm:p-9">
        <div className="flex items-center justify-between">
          <PulseBadge variant="lime">Boas-vindas • {step} de 3</PulseBadge>
          <span className="flex items-center gap-1 text-xs font-semibold text-[#8CBA51]">
            <Sparkles className="h-3.5 w-3.5" /> Configuração rápida
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-bold text-[#141D14]">
          {step === 1 && "Qual é o seu objetivo principal hoje?"}
          {step === 2 && "Quanto você quer manter livre por mês?"}
          {step === 3 && "Pronto! Que tal importar sua 1ª fatura PDF?"}
        </h1>
        <p className="mt-1.5 text-sm text-[#5A6B5A]">
          {step === 1 && "Personalizamos o seu cockpit de previsibilidade com base na sua prioridade."}
          {step === 2 && "Usamos essa meta em BRL para calibrar seus alertas de ritmo diário."}
          {step === 3 && "O PDF é lido 100% em RAM com descarte imediato (Zero-Persistence ADR-006)."}
        </p>

        <div className="mt-6">
          {step === 1 ? (
            <div className="space-y-3">
              {GOALS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setGoal(item)}
                  className={`w-full rounded-2xl border p-4 text-left text-sm font-medium transition ${
                    goal === item
                      ? "border-[#8CBA51] bg-[#F7FBF0] font-semibold text-[#141D14]"
                      : "border-[#E6ECE2] bg-white text-[#5A6B5A] hover:bg-[#F7F9F5]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <MoneyInputBRL
              id="onboarding-target-brl"
              label="Meta mensal em Reais (BRL)"
              value={monthlyTarget}
              onChange={(val) => setMonthlyTarget(val)}
            />
          ) : null}

          {step === 3 ? (
            <div className="space-y-4 rounded-2xl border border-[#E6ECE2] bg-[#F7F9F5] p-6 text-center">
              <FileUp className="mx-auto h-10 w-10 text-[#8CBA51]" />
              <p className="text-sm font-semibold text-[#141D14]">
                Importe sua fatura Itaú, BB ou Nubank em segundos
              </p>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => persistAndNavigate("/cards")}
                  className="rounded-full bg-[#8CBA51] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7AA842]"
                >
                  Importar 1ª fatura PDF agora
                </button>
                <button
                  type="button"
                  onClick={() => persistAndNavigate("/dashboard")}
                  className="rounded-full border border-[#E6ECE2] bg-white px-6 py-2.5 text-sm font-semibold text-[#141D14] hover:bg-[#F7F9F5]"
                >
                  Ir para o Painel Executivo
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-7 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
              className="rounded-full border border-[#E6ECE2] px-5 py-2.5 text-sm font-semibold text-[#141D14]"
            >
              Voltar
            </button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s === 1 ? 2 : 3))}
              className="rounded-full bg-[#8CBA51] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7AA842]"
            >
              Avançar
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
