"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { PulseBadge } from "@/design-system";
import { LOCAL_DEV_PROFILES, saveSession } from "@/lib/api/session";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChangeDigit = (index: number, raw: string) => {
    const clean = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const code = digits.join("");
    if (code.length < 6) {
      setErrorMsg("Digite os 6 dígitos enviados para o seu e-mail/SMS.");
      return;
    }
    const profile = LOCAL_DEV_PROFILES[0];
    saveSession({
      accessToken: profile.fallbackToken,
      tenantId: profile.tenantId,
      tenantName: profile.tenantName,
      role: "OWNER",
      email: profile.email,
    });
    router.push("/onboarding");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-[#E6ECE2] bg-white p-7 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DEFF8B] text-[#141D14]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <PulseBadge variant="lime">Verificação em 2 etapas</PulseBadge>
        <h1 className="mt-3 text-2xl font-bold text-[#141D14]">
          Confirme seu código de 6 dígitos
        </h1>
        <p className="mt-1.5 text-sm text-[#5A6B5A]">
          Enviamos um código temporário para validar seu acesso com segurança.
        </p>

        <form onSubmit={handleVerify} className="mt-6 space-y-5">
          <div className="flex justify-center gap-2">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                aria-label={`Dígito ${idx + 1}`}
                value={digit}
                onChange={(e) => handleChangeDigit(idx, e.target.value)}
                className="h-12 w-11 rounded-2xl border border-[#E6ECE2] text-center font-mono text-lg font-bold text-[#141D14] tabular-nums outline-none focus:border-[#8CBA51]"
              />
            ))}
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
            Confirmar código e continuar
          </button>
        </form>

        <div className="mt-5 text-xs text-[#5A6B5A]">
          {secondsLeft > 0 ? (
            <span>
              Reenviar código em{" "}
              <strong className="font-mono tabular-nums text-[#141D14]">
                {secondsLeft}s
              </strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setSecondsLeft(60)}
              className="font-semibold text-[#8CBA51] hover:underline"
            >
              Reenviar código agora
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
