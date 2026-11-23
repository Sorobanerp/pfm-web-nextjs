"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileUp, Lock, ShieldCheck } from "lucide-react";
import { ConversationalHeader, PulseBadge } from "@/design-system";
import { apiRequest, extractApiErrorMessage } from "@/lib/api/client";

interface StatementUploadResponse {
  StatementID?: string;
  Issuer?: string;
  ReferenceMonth?: string;
  TransactionsCount?: number;
  DeclaredTotal?: string;
  ComputedTotal?: string;
  ChecksumValid?: boolean;
  checksum_diff?: string;
}

export default function ImportPdfPage() {
  const [issuer, setIssuer] = useState("ITAU");
  const [cardLast4, setCardLast4] = useState("5285");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatementUploadResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResult(null);
    if (!selectedFile) {
      setErrorMsg("Selecione uma fatura PDF antes de iniciar o processamento em RAM.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await apiRequest<StatementUploadResponse>("/api/v1/statements/upload", {
        method: "POST",
        headers: {
          "X-Statement-Issuer": issuer,
          "X-Card-Last4": cardLast4,
          "X-File-Name": selectedFile.name,
          ...(password ? { "X-Statement-Password": password } : {}),
        },
        body: formData,
      });
      setResult(res);
    } catch (err) {
      setErrorMsg(
        extractApiErrorMessage(err, "Não foi possível conectar ao BFF para processar a fatura.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <ConversationalHeader
        badgeText="100% em RAM • Criptografia KMS • Zero disco"
        badgeVariant="lime"
        title="Importar Fatura PDF sem gravar em disco"
        subtitle="O arquivo é desbloqueado exclusivamente na memória RAM, validado item a item (Checksum R$ 0,00) e descartado imediatamente após a extração."
      />

      <form
        onSubmit={(e) => {
          void handleUpload(e);
        }}
        className="space-y-5 rounded-3xl border border-[#E6ECE2] bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="imp-issuer" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
              Emissor
            </label>
            <select
              id="imp-issuer"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="w-full rounded-2xl border border-[#E6ECE2] bg-white px-4 py-3 text-sm outline-none focus:border-[#8CBA51]"
            >
              <option value="ITAU">Itaú Personnalité</option>
              <option value="BB">Banco do Brasil</option>
              <option value="NUBANK">Nubank</option>
              <option value="MARISA">Marisa</option>
            </select>
          </div>
          <div>
            <label htmlFor="imp-last4" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
              Final do cartão
            </label>
            <input
              id="imp-last4"
              type="text"
              maxLength={4}
              value={cardLast4}
              onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-2xl border border-[#E6ECE2] px-4 py-3 font-mono text-sm tabular-nums outline-none focus:border-[#8CBA51]"
            />
          </div>
          <div>
            <label htmlFor="imp-pw" className="mb-1.5 block text-xs font-semibold text-[#141D14]">
              Senha do PDF (opcional)
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#5A6B5A]" />
              <input
                id="imp-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="CPF se protegido"
                className="w-full rounded-2xl border border-[#E6ECE2] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#8CBA51]"
              />
            </div>
          </div>
        </div>

        <label
          htmlFor="imp-file"
          className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#8CBA51]/50 bg-[#F7F9F5] px-6 py-10 text-center transition hover:border-[#8CBA51]"
        >
          <FileUp className="h-9 w-9 text-[#8CBA51]" />
          <p className="mt-3 text-sm font-semibold text-[#141D14]">
            {selectedFile ? selectedFile.name : "Clique ou arraste sua fatura PDF aqui"}
          </p>
          <p className="mt-1 text-xs text-[#5A6B5A]">
            Limite máximo 15 MB em RAM • Validação matemática RN04
          </p>
          <input
            id="imp-file"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          />
        </label>

        {errorMsg ? (
          <p className="rounded-2xl bg-[#FFF5F6] px-4 py-3 text-xs font-medium text-[#FF5D6C]">
            {errorMsg}
          </p>
        ) : null}

        {result ? (
          <div className="rounded-2xl border border-[#8CBA51] bg-[#F7FBF0] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#8CBA51]" />
                <p className="text-sm font-bold text-[#141D14]">
                  Fatura processada e conciliada em RAM!
                </p>
              </div>
              <PulseBadge variant="lime">
                Divergência: R$ {result.checksum_diff ?? "0.00"}
              </PulseBadge>
            </div>
            <p className="mt-2 font-mono text-xs text-[#5A6B5A] tabular-nums">
              Itens: {result.TransactionsCount ?? 0} • Declarado: R$ {result.DeclaredTotal ?? "0.00"} • Calculado: R$ {result.ComputedTotal ?? "0.00"}
            </p>
            <Link
              href="/inbox"
              className="mt-3 inline-block text-xs font-semibold text-[#416901] underline"
            >
              Revisar transações categorizadas pela IA na Inbox →
            </Link>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#8CBA51] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7AA842] disabled:opacity-60"
        >
          {loading ? "Processando em memória RAM..." : "Enviar e conciliar fatura"}
        </button>
      </form>
    </div>
  );
}
