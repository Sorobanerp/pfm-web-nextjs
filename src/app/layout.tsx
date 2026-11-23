import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/design-system/AppShell";
import { QueryProvider } from "@/lib/api/QueryProvider";

export const metadata: Metadata = {
  title: "PFM Core Banking V3 — Organic Financial Pulse",
  description:
    "Plataforma Executiva Familiar: Termômetro Preditivo, Matriz Multi-Cartões, Ingestão PDF RAM, Simulador 30 Anos, Perfil/Família LGPD e Painel SaaS Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#F7F9F5] text-[#141D14] antialiased">
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}
