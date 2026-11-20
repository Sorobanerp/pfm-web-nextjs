import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

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
        <div className="min-h-screen w-full flex flex-col md:flex-row">
          <Navbar />
          <main className="flex-1 min-w-0 w-full px-4 sm:px-6 lg:px-10 py-6 pb-24 md:pb-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
