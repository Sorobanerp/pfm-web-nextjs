# pfm-web-nextjs

Portal Executivo de Gestão Financeira Pessoal e Familiar (**Next.js App Router + TypeScript Estrito + Tailwind CSS**) seguindo **ADR-003 (REST HTTP/2-HTTP/3 com ETag/Brotli)** e **Artefato 01 V2**.

## 4 Módulos Executivos
1. **Visão Consolidada & Termômetro Orçamentário (`/`):** Seletor de escopo (`Família Consolidada` vs. `Por Titular`), cards de Receita Prevista vs. Realizada, Projeção de Fechamento (*Run-rate* com semáforo `GREEN`/`YELLOW`/`RED`) e banner **"Limite disponível de cartão ≠ Orçamento" (RN02)**.
2. **Matriz Multi-Cartões (`/cards`):** Tabela comparativa dos cartões (`Itaú 5285`, `Itaú 1360`, `BB`, `Marisa`) exibindo *Fatura Atual*, *Próxima Fatura (M+1)*, *Demais Faturas (M+2..N)*, *Limite Total*, *Utilizado (%)* e upload em lote de faturas PDF/ZIP.
3. **Inbox de Revisão (`/inbox`):** Fila rápida para reclassificar transações pendentes ou marcadas como *"Outros"*, exibindo o nome normalizado (sem `JIM.COM*`/`MP *`), cidade extraída e botão *"Aplicar para todo o histórico deste estabelecimento"* (retroalimentando a Camada 1).
4. **Simulador de Contratos (`/contracts`):** Painel interativo para Financiamento Imobiliário (`SAC` / `Price`) e `Consórcio Veicular` com sliders de amortização extraordinária/lance comparando redução de prazo vs. redução de parcela.

---

## Topologia de Portas Locais & 12-Factor App

| Interface | Porta Host Local | Porta Container / K8s | Variável de Ambiente | Endpoint / Probe |
|---|:---:|:---:|---|---|
| **Portal Web (Next.js SSR)** | `18300` | `3000` | `PORT=18300` (`npm run dev -- -p 18300`) | `http://localhost:18300` |
| **Envoy Gateway Edge** | `18080` | `8080` | `NEXT_PUBLIC_API_URL` | `http://localhost:18080/healthz` |
