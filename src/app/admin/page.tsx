"use client";

import { useState } from "react";

type Plan = "FREE" | "INDIVIDUAL_PRO" | "FAMILY_PLUS";
type SubStatus = "TRIAL" | "ACTIVE" | "PAST_DUE" | "SUSPENDED";

interface TenantRow {
  tenantId: string;
  familyLabel: string;
  plan: Plan;
  status: SubStatus;
  pdfQuotaUsed: number;
  pdfQuotaMax: number;
}

const INITIAL_TENANTS: TenantRow[] = [
  { tenantId: "11111111-••••-1111", familyLabel: "Tenant #001 (Piloto)", plan: "FAMILY_PLUS", status: "ACTIVE", pdfQuotaUsed: 4, pdfQuotaMax: 999 },
  { tenantId: "22222222-••••-2222", familyLabel: "Tenant #002", plan: "INDIVIDUAL_PRO", status: "TRIAL", pdfQuotaUsed: 2, pdfQuotaMax: 999 },
  { tenantId: "33333333-••••-3333", familyLabel: "Tenant #003", plan: "FREE", status: "PAST_DUE", pdfQuotaUsed: 3, pdfQuotaMax: 3 },
];

export default function SaasAdminPage() {
  const [tenants, setTenants] = useState<TenantRow[]>(INITIAL_TENANTS);

  function updatePlan(tenantId: string, plan: Plan) {
    setTenants((prev) =>
      prev.map((t) =>
        t.tenantId === tenantId
          ? { ...t, plan, pdfQuotaMax: plan === "FREE" ? 3 : 999 }
          : t
      )
    );
  }

  function updateStatus(tenantId: string, status: SubStatus) {
    setTenants((prev) =>
      prev.map((t) => (t.tenantId === tenantId ? { ...t, status } : t))
    );
  }

  return (
    <div className="space-y-6 w-full">
      <header>
        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#DEFF8B] text-[#141D14]">
          Jornada 6 • US-12 (Zero-PII RLS)
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141D14] mt-1">
          Painel SaaS Admin &amp; Saúde Global do Produto
        </h1>
        <p className="text-sm text-[#4A5A4A]">
          Gestão agregada de Tenants, Planos, Assinaturas e Quotas — estritamente sem exposição de lançamentos privados.
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E9DC] p-4 shadow-sm">
          <div className="text-xs text-[#4A5A4A]">Tenants Ativos</div>
          <div className="text-2xl font-bold tabular-nums text-[#141D14] mt-1">
            {tenants.filter((t) => t.status === "ACTIVE").length} / {tenants.length}
          </div>
        </div>
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E9DC] p-4 shadow-sm">
          <div className="text-xs text-[#4A5A4A]">Run-Rate Cloud Piloto</div>
          <div className="text-2xl font-bold tabular-nums text-[#8CBA51] mt-1">US$ 18,40</div>
        </div>
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E9DC] p-4 shadow-sm">
          <div className="text-xs text-[#4A5A4A]">Latência P99 Ledger</div>
          <div className="text-2xl font-bold tabular-nums text-[#141D14] mt-1">112 ms</div>
        </div>
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E9DC] p-4 shadow-sm">
          <div className="text-xs text-[#4A5A4A]">Violações RLS</div>
          <div className="text-2xl font-bold tabular-nums text-[#8CBA51] mt-1">0</div>
        </div>
      </div>

      {/* Tenants Table */}
      <section className="rounded-2xl bg-[#FFFFFF] border border-[#E2E9DC] p-5 shadow-sm overflow-x-auto">
        <h2 className="text-lg font-semibold text-[#141D14] mb-4">Gestão de Tenants &amp; Quotas</h2>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#E2E9DC] text-xs text-[#4A5A4A]">
              <th className="py-2.5 pr-4">Tenant ID (Mascarado)</th>
              <th className="py-2.5 pr-4">Identificador</th>
              <th className="py-2.5 pr-4">Plano</th>
              <th className="py-2.5 pr-4">Status Assinatura</th>
              <th className="py-2.5 text-right">Quota PDFs/Mês</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E9DC]">
            {tenants.map((t) => (
              <tr key={t.tenantId}>
                <td className="py-3 pr-4 font-mono text-xs text-[#4A5A4A]">{t.tenantId}</td>
                <td className="py-3 pr-4 font-medium text-[#141D14]">{t.familyLabel}</td>
                <td className="py-3 pr-4">
                  <select
                    aria-label={`Plano de ${t.familyLabel}`}
                    value={t.plan}
                    onChange={(e) => updatePlan(t.tenantId, e.target.value as Plan)}
                    className="rounded-lg border border-[#E2E9DC] bg-[#F7F9F5] px-2.5 py-1 text-xs font-medium text-[#141D14]"
                  >
                    <option value="FREE">FREE</option>
                    <option value="INDIVIDUAL_PRO">INDIVIDUAL_PRO</option>
                    <option value="FAMILY_PLUS">FAMILY_PLUS</option>
                  </select>
                </td>
                <td className="py-3 pr-4">
                  <select
                    aria-label={`Status de ${t.familyLabel}`}
                    value={t.status}
                    onChange={(e) => updateStatus(t.tenantId, e.target.value as SubStatus)}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                      t.status === "ACTIVE"
                        ? "bg-[#DEFF8B] text-[#141D14] border-[#8CBA51]/40"
                        : t.status === "PAST_DUE"
                        ? "bg-[#FBCEB5] text-[#3D1E10] border-[#FBCEB5]"
                        : t.status === "SUSPENDED"
                        ? "bg-[#FF5D6C] text-white border-[#FF5D6C]"
                        : "bg-[#F7F9F5] text-[#141D14] border-[#E2E9DC]"
                    }`}
                  >
                    <option value="TRIAL">TRIAL</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PAST_DUE">PAST_DUE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </td>
                <td className="py-3 text-right tabular-nums font-medium text-[#141D14]">
                  {t.pdfQuotaUsed} / {t.pdfQuotaMax}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
