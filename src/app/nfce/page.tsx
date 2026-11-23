"use client";

import React, { useState } from "react";
import { AlertTriangle, Receipt } from "lucide-react";
import { ConversationalHeader, MoneyInputBRL, PulseBadge } from "@/design-system";
import { apiRequest, extractApiErrorMessage } from "@/lib/api/client";

interface InflationAlert {
  ean: string;
  description: string;
  previous_unit_price: string;
  current_unit_price: string;
  inflation_pct: string;
}

interface NfceResponse {
  access_key?: string;
  merchant_name?: string;
  total_amount?: string;
  items_ingested?: number;
  inflation_alerts?: InflationAlert[];
  status?: string;
}

export default function NfceRadarPage() {
  const [accessKey, setAccessKey] = useState("35261112345678000199650010000123451000999010");
  const [merchantName, setMerchantName] = useState("SUPERMERCADO QUEIROZ");
  const [ean, setEan] = useState("7891234567890");
  const [itemDesc, setItemDesc] = useState("AZEITE EXTRA VIRGEM 500ML");
  const [unitPrice, setUnitPrice] = useState("47.90");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NfceResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResult(null);

    if (accessKey.replace(/\D/g, "").length !== 44) {
      setErrorMsg("A chave de acesso SEFAZ precisa ter exatamente 44 dígitos.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest<NfceResponse>("/api/v1/receipts/nfce", {
        method: "POST",
        body: {
          access_key: accessKey.replace(/\D/g, ""),
          merchant_name: merchantName.trim(),
          total_amount: unitPrice,
          items: [
            {
              ean: ean.trim(),
              description: itemDesc.trim(),
              quantity: "1.000",
              unit_price: unitPrice,
            },
          ],
        },
      });
      setResult(res);
    } catch (err) {
      setErrorMsg(
        extractApiErrorMessage(err, "Não foi possível registrar o cupom fiscal NFC-e.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <ConversationalHeader
        badgeText="Radar NFC-e • Inflação por EAN"
        badgeVariant="peach"
        title="Cupom Fiscal SEFAZ & Radar de Inflação Pessoal"
        subtitle="Compare automaticamente quanto você pagou pelo mesmo produto (código de barras EAN) entre diferentes supermercados."
      />

      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        className="space-y-4 rounded-3xl border border-[#E6ECE2] bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="nfce-key" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
              Chave de acesso SEFAZ (44 dígitos)
            </label>
            <input
              id="nfce-key"
              type="text"
              maxLength={44}
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-2xl border border-[#E6ECE2] px-4 py-3 font-mono text-sm tabular-nums outline-none focus:border-[#8CBA51]"
            />
          </div>

          <div>
            <label htmlFor="nfce-merchant" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
              Estabelecimento
            </label>
            <input
              id="nfce-merchant"
              type="text"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              className="w-full rounded-2xl border border-[#E6ECE2] px-4 py-3 text-sm outline-none focus:border-[#8CBA51]"
            />
          </div>

          <div>
            <label htmlFor="nfce-ean" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
              Código EAN do item
            </label>
            <input
              id="nfce-ean"
              type="text"
              value={ean}
              onChange={(e) => setEan(e.target.value)}
              className="w-full rounded-2xl border border-[#E6ECE2] px-4 py-3 font-mono text-sm tabular-nums outline-none focus:border-[#8CBA51]"
            />
          </div>

          <div>
            <label htmlFor="nfce-item" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
              Descrição do produto
            </label>
            <input
              id="nfce-item"
              type="text"
              value={itemDesc}
              onChange={(e) => setItemDesc(e.target.value)}
              className="w-full rounded-2xl border border-[#E6ECE2] px-4 py-3 text-sm outline-none focus:border-[#8CBA51]"
            />
          </div>

          <MoneyInputBRL
            id="nfce-price"
            label="Preço unitário pago (BRL)"
            value={unitPrice}
            onChange={(val) => setUnitPrice(val)}
          />
        </div>

        {errorMsg ? (
          <p className="rounded-2xl bg-[#FFF5F6] px-4 py-3 text-xs font-medium text-[#FF5D6C]">
            {errorMsg}
          </p>
        ) : null}

        {result ? (
          <div className="space-y-3 rounded-2xl border border-[#E6ECE2] bg-[#F7F9F5] p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-bold text-[#141D14]">
                <Receipt className="h-4 w-4 text-[#8CBA51]" />
                NFC-e registrada ({result.items_ingested ?? 1} item)
              </span>
              <PulseBadge variant="lime">{result.status ?? "INGESTED"}</PulseBadge>
            </div>
            {(result.inflation_alerts ?? []).map((alert) => (
              <div
                key={alert.ean}
                className="flex items-start gap-3 rounded-2xl border border-[#F3B998] bg-[#FBCEB5] p-4 text-[#3D1E10]"
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">
                    Alerta de Inflação Pessoal ({alert.inflation_pct}): {alert.description}
                  </p>
                  <p className="mt-1 font-mono tabular-nums">
                    EAN {alert.ean} subiu de R$ {alert.previous_unit_price} para R$ {alert.current_unit_price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#8CBA51] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7AA842] disabled:opacity-60"
        >
          {loading ? "Validando na SEFAZ local..." : "Registrar NFC-e e verificar preços"}
        </button>
      </form>
    </div>
  );
}
