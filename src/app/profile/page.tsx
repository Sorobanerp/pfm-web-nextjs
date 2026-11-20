"use client";

import { useState } from "react";

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "MEMBER" | "VIEWER";
  allowance: string;
  status: string;
}

interface CategoryBudget {
  id: string;
  name: string;
  cap: number;
  spent: number;
}

const INITIAL_MEMBERS: FamilyMember[] = [
  { id: "m-1", name: "Titular Principal", email: "titular@familia.local", role: "OWNER", allowance: "Ilimitado", status: "ACTIVE" },
  { id: "m-2", name: "Cônjuge", email: "conjuge@familia.local", role: "MEMBER", allowance: "R$ 3.500,00", status: "ACTIVE" },
  { id: "m-3", name: "Consultor Contábil", email: "contador@familia.local", role: "VIEWER", allowance: "R$ 0,00", status: "ACTIVE" },
];

const INITIAL_BUDGETS: CategoryBudget[] = [
  { id: "ALIMENTACAO", name: "Alimentação & Mercado", cap: 2400, spent: 1620 },
  { id: "TRANSPORTE", name: "Transporte & Combustível", cap: 900, spent: 765 },
  { id: "LAZER", name: "Lazer & Viagens", cap: 800, spent: 840 },
];

export default function ProfileFamilyLgpdPage() {
  const [members, setMembers] = useState<FamilyMember[]>(INITIAL_MEMBERS);
  const [budgets, setBudgets] = useState<CategoryBudget[]>(INITIAL_BUDGETS);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"MEMBER" | "VIEWER">("MEMBER");
  const [kmsCard, setKmsCard] = useState("Nubank Ultravioleta •••• 4242");
  const [kmsStatus, setKmsStatus] = useState<string | null>(null);
  const [lgpdStatus, setLgpdStatus] = useState<string | null>(null);
  const [shredPhrase, setShredPhrase] = useState("");

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setMembers((prev) => [
      ...prev,
      {
        id: `m-${prev.length + 1}`,
        name: inviteEmail.split("@")[0],
        email: inviteEmail.trim(),
        role: inviteRole,
        allowance: inviteRole === "VIEWER" ? "R$ 0,00" : "R$ 1.500,00",
        status: "INVITED",
      },
    ]);
    setInviteEmail("");
  }

  function handleRemoveMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function handleCapChange(id: string, delta: number) {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, cap: Math.max(200, b.cap + delta) } : b))
    );
  }

  return (
    <div className="space-y-6 w-full">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#DEFF8B] text-[#141D14]">
            Jornada 5 • US-13
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141D14] mt-1">
            Central de Perfil, Família &amp; Governança LGPD
          </h1>
          <p className="text-sm text-[#4A5A4A]">
            Papéis RBAC familiares, tetos por categoria, cofre KMS de cartões e exclusão criptográfica.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Membros Familiares */}
        <section className="rounded-2xl bg-[#FFFFFF] border border-[#E2E9DC] p-5 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-[#141D14]">Membros Familiares (RBAC)</h2>
          <div className="space-y-2.5">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E2E9DC] bg-[#F7F9F5] p-3"
              >
                <div>
                  <div className="font-semibold text-sm text-[#141D14]">{m.name}</div>
                  <div className="text-xs text-[#4A5A4A]">{m.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#DEFF8B] text-[#141D14]">
                    {m.role}
                  </span>
                  <span className="text-xs tabular-nums font-medium text-[#141D14]">
                    {m.allowance}
                  </span>
                  {m.role !== "OWNER" && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(m.id)}
                      className="text-xs px-2 py-1 rounded-lg border border-[#FF5D6C]/40 text-[#FF5D6C] hover:bg-[#FF5D6C]/10"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-2 pt-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="convidado@familia.com"
              className="flex-1 rounded-xl border border-[#E2E9DC] bg-[#FFFFFF] px-3 py-2 text-sm text-[#141D14]"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as "MEMBER" | "VIEWER")}
              className="rounded-xl border border-[#E2E9DC] bg-[#FFFFFF] px-3 py-2 text-sm text-[#141D14]"
            >
              <option value="MEMBER">MEMBER</option>
              <option value="VIEWER">VIEWER</option>
            </select>
            <button
              type="submit"
              className="rounded-xl bg-[#8CBA51] hover:bg-[#7aa842] text-white font-semibold text-sm px-4 py-2 transition-colors"
            >
              Convidar
            </button>
          </form>
        </section>

        {/* Tetos por Categoria */}
        <section className="rounded-2xl bg-[#FFFFFF] border border-[#E2E9DC] p-5 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-[#141D14]">Tetos Orçamentários por Categoria</h2>
          <div className="space-y-4">
            {budgets.map((b) => {
              const pct = Math.round((b.spent / b.cap) * 100);
              const barColor =
                pct >= 100 ? "bg-[#FF5D6C]" : pct >= 80 ? "bg-[#FBCEB5]" : "bg-[#8CBA51]";
              const badgeClass =
                pct >= 100
                  ? "bg-[#FF5D6C] text-white"
                  : pct >= 80
                  ? "bg-[#FBCEB5] text-[#3D1E10]"
                  : "bg-[#DEFF8B] text-[#141D14]";
              return (
                <div key={b.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#141D14]">{b.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full tabular-nums ${badgeClass}`}>
                        {pct}%
                      </span>
                      <span className="tabular-nums text-xs text-[#4A5A4A]">
                        R$ {b.spent.toFixed(2)} / R$ {b.cap.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCapChange(b.id, 100)}
                        className="text-xs px-2 py-0.5 rounded border border-[#E2E9DC] hover:bg-[#F7F9F5]"
                      >
                        +R$ 100
                      </button>
                    </div>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#F7F9F5] overflow-hidden border border-[#E2E9DC]">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Cofre KMS de Cartões */}
        <section className="rounded-2xl bg-[#FFFFFF] border border-[#E2E9DC] p-5 space-y-3 shadow-sm">
          <h2 className="text-lg font-semibold text-[#141D14]">Cofre Criptografado KMS (Senhas PDF)</h2>
          <p className="text-xs text-[#4A5A4A]">
            Senhas de faturas PDF cifradas com Envelope Encryption AES-256-GCM e DEK exclusiva do tenant.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={kmsCard}
              onChange={(e) => setKmsCard(e.target.value)}
              className="flex-1 rounded-xl border border-[#E2E9DC] bg-[#F7F9F5] px-3 py-2 text-sm text-[#141D14]"
            >
              <option>Nubank Ultravioleta •••• 4242</option>
              <option>Itaú Personnalité •••• 8810</option>
            </select>
            <button
              type="button"
              onClick={() => setKmsStatus(`Senha do cartão "${kmsCard}" cifrada via AWS KMS.`)}
              className="rounded-xl bg-[#DEFF8B] text-[#141D14] font-semibold text-sm px-4 py-2 border border-[#8CBA51]/40"
            >
              Atualizar Senha KMS
            </button>
          </div>
          {kmsStatus && <div className="text-xs font-medium text-[#141D14] bg-[#DEFF8B]/50 p-2.5 rounded-lg">{kmsStatus}</div>}
        </section>

        {/* Governança LGPD & Crypto-Shredding */}
        <section className="rounded-2xl bg-[#FFFFFF] border border-[#E2E9DC] p-5 space-y-3 shadow-sm">
          <h2 className="text-lg font-semibold text-[#141D14]">Governança LGPD &amp; Crypto-Shredding</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLgpdStatus("Pacote JSON + CSV assinado gerado com checksum SHA-256.")}
              className="rounded-xl bg-[#8CBA51] text-white font-semibold text-sm px-4 py-2"
            >
              Exportar Dados (JSON/CSV)
            </button>
          </div>
          <div className="pt-2 border-t border-[#E2E9DC] space-y-2">
            <label className="block text-xs font-medium text-[#4A5A4A]">
              Para exclusão irrecuperável (Crypto-Shredding), digite{" "}
              <code className="font-mono text-[#FF5D6C]">EXCLUIR_DEFINITIVAMENTE_MINHA_CONTA</code>:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={shredPhrase}
                onChange={(e) => setShredPhrase(e.target.value)}
                placeholder="EXCLUIR_DEFINITIVAMENTE_MINHA_CONTA"
                className="flex-1 rounded-xl border border-[#E2E9DC] px-3 py-2 text-xs text-[#141D14]"
              />
              <button
                type="button"
                disabled={shredPhrase !== "EXCLUIR_DEFINITIVAMENTE_MINHA_CONTA"}
                onClick={() =>
                  setLgpdStatus("DEK destruída no KMS — registros marcados como CRYPTO_SHREDDED.")
                }
                className="rounded-xl bg-[#FF5D6C] disabled:opacity-40 text-white font-semibold text-xs px-4 py-2"
              >
                Executar Crypto-Shredding
              </button>
            </div>
          </div>
          {lgpdStatus && <div className="text-xs font-medium text-[#141D14] bg-[#F7F9F5] border border-[#E2E9DC] p-2.5 rounded-lg">{lgpdStatus}</div>}
        </section>
      </div>
    </div>
  );
}
