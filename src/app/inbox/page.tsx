"use client";

import { useState } from "react";
import {
  InboxTransactionItem,
  getDemoInboxItems,
} from "@/adapters/api/pfmHttpClient";

const OFFICIAL_CATEGORIES = [
  { code: "RESTAURANTES_GASTRONOMIA", label: "Alimentação • Restaurantes & Gastronomia" },
  { code: "SUPERMERCADO_MERCEARIA", label: "Alimentação • Supermercado & Mercearia" },
  { code: "COMBUSTIVEL_ETANOL_GASOLINA", label: "Transporte • Combustível" },
  { code: "FARMACIA_MEDICAMENTOS", label: "Saúde • Farmácia & Medicamentos" },
  { code: "CUIDADOS_PESSOAIS_BELEZA", label: "Lazer & Estilo • Cuidados Pessoais & Beleza" },
  { code: "VESTUARIO_CALCADOS", label: "Lazer & Estilo • Vestuário & Calçados" },
];

const formatBRL = (val: number) =>
  val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ReviewInboxPage() {
  const [items, setItems] = useState<InboxTransactionItem[]>(() =>
    getDemoInboxItems()
  );
  const [selectedCategories, setSelectedCategories] = useState<
    Record<string, string>
  >({
    "tx-inbox-001": "SUPERMERCADO_MERCEARIA",
    "tx-inbox-002": "RESTAURANTES_GASTRONOMIA",
    "tx-inbox-003": "SUPERMERCADO_MERCEARIA",
    "tx-inbox-004": "CUIDADOS_PESSOAIS_BELEZA",
  });
  const [learnedBanner, setLearnedBanner] = useState<string | null>(null);

  const handleApplyToHistory = (item: InboxTransactionItem) => {
    const chosenCategory =
      selectedCategories[item.id] ?? "SUPERMERCADO_MERCEARIA";
    setItems((prev) => prev.filter((row) => row.id !== item.id));
    setLearnedBanner(
      `Regra aprendida salva na Camada 1 (pfm_ai_rules): "${item.merchantNormalized}" (${item.extractedCity}) → ${chosenCategory}. Reclassificados ${item.historicalCount} lançamentos históricos do estabelecimento!`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Inbox de Revisão & Aprendizado Contínuo (Camada 1)
        </h1>
        <p className="text-sm text-slate-400">
          Fila rápida para reclassificar transações pendentes ou marcadas como
          &quot;Outros&quot;, com remoção automática de prefixos de maquininhas
          (JIM.COM*, MP *, BMB*, PG *) e extração de município.
        </p>
      </div>

      {learnedBanner && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-xs sm:text-sm text-emerald-200">
          {learnedBanner}
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {item.merchantNormalized}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Cidade: {item.extractedCity}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {item.cardLabel} • {item.transactionDate}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Descrição bruta original:{" "}
                <code className="text-slate-300">{item.rawDescription}</code> •
                Categoria atual: {item.currentCategoryCode} (Confiança:{" "}
                {Math.round(item.confidence * 100)}%)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-base font-bold text-white whitespace-nowrap">
                {formatBRL(item.amount)}
              </span>

              <select
                value={selectedCategories[item.id] ?? "SUPERMERCADO_MERCEARIA"}
                onChange={(e) =>
                  setSelectedCategories((prev) => ({
                    ...prev,
                    [item.id]: e.target.value,
                  }))
                }
                className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
              >
                {OFFICIAL_CATEGORIES.map((cat) => (
                  <option key={cat.code} value={cat.code}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleApplyToHistory(item)}
                className="px-3.5 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400 transition whitespace-nowrap"
              >
                Aplicar para todo o histórico deste estabelecimento (
                {item.historicalCount})
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
            Parabéns! Todas as transações pendentes do Inbox foram revisadas e
            incorporadas na Camada 1 do tenant.
          </div>
        )}
      </div>
    </div>
  );
}
