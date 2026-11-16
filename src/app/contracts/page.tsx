"use client";

import { useState } from "react";
import {
  AmortizationModality,
  PrepaymentStrategy,
  simulateContractAmortizationLocal,
} from "@/adapters/api/pfmHttpClient";

const formatBRL = (val: number) =>
  val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ContractSimulatorPage() {
  const [modality, setModality] = useState<AmortizationModality>("SAC");
  const [strategy, setStrategy] = useState<PrepaymentStrategy>("REDUCE_TERM");
  const [outstandingBalance, setOutstandingBalance] = useState<number>(320000);
  const [remainingMonths, setRemainingMonths] = useState<number>(180);
  const [extraAmortization, setExtraAmortization] = useState<number>(50000);

  const comparison = simulateContractAmortizationLocal(
    modality,
    strategy,
    outstandingBalance,
    remainingMonths,
    modality === "CONSORCIO" ? 0 : 0.85,
    modality === "CONSORCIO" ? 16.0 : 0,
    85,
    extraAmortization
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Simulador de Contratos (SAC, Tabela Price e Consórcio Veicular)
        </h1>
        <p className="text-sm text-slate-400">
          Simulação matemática imutável (Half-Even) comparando Redução de Prazo
          vs. Redução de Parcela em amortizações extraordinárias e lances.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-5">
          <div>
            <label className="block text-xs uppercase text-slate-400 mb-2">
              Modalidade do Contrato
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "SAC", label: "Financiamento SAC" },
                  { id: "PRICE", label: "Financiamento Price" },
                  { id: "CONSORCIO", label: "Consórcio Veicular" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModality(m.id)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                    modality === m.id
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                      : "bg-slate-950 text-slate-300 border-slate-800"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-slate-400 mb-2">
              Estratégia da Amortização Extraordinária / Lance
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStrategy("REDUCE_TERM")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                  strategy === "REDUCE_TERM"
                    ? "bg-emerald-500 text-slate-950 border-emerald-400"
                    : "bg-slate-950 text-slate-300 border-slate-800"
                }`}
              >
                Reduzir Prazo (Maior Economia)
              </button>
              <button
                type="button"
                onClick={() => setStrategy("REDUCE_INSTALLMENT")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                  strategy === "REDUCE_INSTALLMENT"
                    ? "bg-emerald-500 text-slate-950 border-emerald-400"
                    : "bg-slate-950 text-slate-300 border-slate-800"
                }`}
              >
                Reduzir Valor da Parcela (Alívio Mensal)
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Saldo Devedor Atual</span>
              <span className="font-bold text-white">
                {formatBRL(outstandingBalance)}
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={800000}
              step={10000}
              value={outstandingBalance}
              onChange={(e) => setOutstandingBalance(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">
                Prazo Remanescente (Meses)
              </span>
              <span className="font-bold text-white">
                {remainingMonths} meses
              </span>
            </div>
            <input
              type="range"
              min={12}
              max={360}
              step={6}
              value={remainingMonths}
              onChange={(e) => setRemainingMonths(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">
                Valor da Amortização Extraordinária / Lance
              </span>
              <span className="font-bold text-emerald-400">
                {formatBRL(extraAmortization)}
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={Math.max(10000, Math.floor(outstandingBalance * 0.8))}
              step={5000}
              value={extraAmortization}
              onChange={(e) => setExtraAmortization(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        {/* Simulation Outcome Panel */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              Resultado da Simulação Imutável ({comparison.modality})
            </span>
            <h2 className="text-3xl font-bold text-white mt-1">
              Economia de {formatBRL(comparison.totalInterestAndFeesSaved)}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Retorno Efetivo sobre o Aporte (ROI):{" "}
              <strong className="text-emerald-300">
                +{comparison.effectiveRoiPct.toFixed(2)}%
              </strong>{" "}
              isento de IR
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800">
              <span className="text-xs text-slate-400 block">
                Prazo Original vs. Simulado
              </span>
              <span className="text-lg font-bold text-white">
                {comparison.originalTotalMonths}m →{" "}
                {comparison.simulatedTotalMonths}m
              </span>
              <span className="block text-xs text-emerald-400 mt-0.5">
                -{comparison.monthsSaved} parcelas eliminadas
              </span>
            </div>

            <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800">
              <span className="text-xs text-slate-400 block">
                1ª Parcela Original vs. Simulada
              </span>
              <span className="text-lg font-bold text-white">
                {formatBRL(comparison.originalFirstInstallment)} →{" "}
                {formatBRL(comparison.simulatedFirstInstallment)}
              </span>
              <span className="block text-xs text-emerald-400 mt-0.5">
                Redução mensal:{" "}
                {formatBRL(comparison.monthlyInstallmentReduction)}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-slate-950/70 p-3.5 border border-slate-800 text-xs text-slate-300">
            Total de Juros/Taxas Sem Aporte:{" "}
            <strong>
              {formatBRL(comparison.originalTotalInterestAndFees)}
            </strong>{" "}
            • Com Aporte:{" "}
            <strong>
              {formatBRL(comparison.simulatedTotalInterestAndFees)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
