"use client";

import { useEffect, useState } from "react";
import {
  DashboardSummary,
  ScopeFilter,
  fetchWithETagAndFallback,
  getDemoDashboardSummary,
} from "@/adapters/api/pfmHttpClient";

const formatBRL = (val: number) =>
  val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ConsolidatedDashboardPage() {
  const [scope, setScope] = useState<ScopeFilter>("FAMILY");
  const [summary, setSummary] = useState<DashboardSummary>(() =>
    getDemoDashboardSummary("FAMILY")
  );
  const [dataSource, setDataSource] = useState<string>("DEMO_FALLBACK");

  useEffect(() => {
    let active = true;
    fetchWithETagAndFallback(`/api/v1/dashboard?scope=${scope}`, () =>
      getDemoDashboardSummary(scope)
    ).then((res) => {
      if (active) {
        setSummary(res.data);
        setDataSource(res.source);
      }
    });
    return () => {
      active = false;
    };
  }, [scope]);

  const badgeStyle =
    summary.trafficLight === "GREEN"
      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
      : summary.trafficLight === "YELLOW"
      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
      : "bg-rose-500/20 text-rose-300 border-rose-500/40";

  return (
    <div className="space-y-6">
      {/* RN02 Banner: Limite disponível de cartão != Orçamento */}
      <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-amber-300">
            Regra de Ouro (RN02): Limite disponível de cartão ≠ Orçamento
          </p>
          <p className="text-xs text-amber-200/80 mt-0.5">
            Seus cartões somam{" "}
            <strong className="text-white">
              {formatBRL(summary.totalAvailableCardLimits)}
            </strong>{" "}
            em limite disponível, mas sua capacidade real de gasto depende
            exclusivamente da Renda Líquida Regular (
            {formatBRL(summary.realizedIncome)}).
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700 self-start sm:self-center">
          Fonte: {dataSource}
        </span>
      </div>

      {/* Header + Seletor de Escopo (Família Consolidada vs. Por Titular) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Visão Consolidada & Termômetro Orçamentário
          </h1>
          <p className="text-sm text-slate-400">
            Competência {summary.referenceMonth} • Separação estrita Competência
            vs. Caixa (RN01)
          </p>
        </div>

        <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
          {(
            [
              { id: "FAMILY", label: "Família Consolidada" },
              { id: "HOLDER_DANTAS", label: "Por Titular: Dantas" },
              { id: "HOLDER_SPOUSE", label: "Por Titular: Cônjuge" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setScope(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                scope === tab.id
                  ? "bg-emerald-500 text-slate-950 font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <span className="text-xs uppercase tracking-wider text-slate-400">
            Receita Prevista vs. Realizada
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400">
              {formatBRL(summary.realizedIncome)}
            </span>
            <span className="text-xs text-slate-400">
              Previsto: {formatBRL(summary.expectedIncome)}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    (summary.realizedIncome / summary.expectedIncome) * 100
                  )
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400">
              Projeção de Fechamento (Run-rate)
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded border font-semibold ${badgeStyle}`}
            >
              Semáforo: {summary.trafficLight}
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">
              {formatBRL(summary.totalProjectedOutflow)}
            </span>
            <span className="text-xs text-slate-400">
              {summary.incomeCommitmentPct.toFixed(1)}% da renda
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Ritmo variável: {formatBRL(summary.dailyMovingAverage)}/dia ×{" "}
            {summary.remainingDays} dias restantes ={" "}
            {formatBRL(summary.projectedRemainingVariable)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <span className="text-xs uppercase tracking-wider text-slate-400">
            Superávit / Déficit Projetado no Mês
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span
              className={`text-2xl font-bold ${
                summary.projectedSurplusOrDeficit >= 0
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {formatBRL(summary.projectedSurplusOrDeficit)}
            </span>
            <span className="text-xs text-slate-400">Margem Líquida</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Fixos: {formatBRL(summary.settledFixedExpenses)} • Faturas:{" "}
            {formatBRL(summary.currentCardInvoices)} • Parcelas:{" "}
            {formatBRL(summary.scheduledInstallments)}
          </p>
        </div>
      </div>
    </div>
  );
}
