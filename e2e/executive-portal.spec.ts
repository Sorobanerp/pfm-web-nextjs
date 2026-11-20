import { test, expect } from "@playwright/test";

test.describe("PFM Core Banking V2 — 4 Módulos Executivos (Full-Stack E2E)", () => {
  test("1. Dashboard Consolidado (/): Filtro Família vs. Titular, Run-rate, Semáforo e Alerta Limite != Orçamento conectados ao Backend", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: /Visão Consolidada & Termômetro Orçamentário/i,
      })
    ).toBeVisible();

    // Verify RN02 Banner "Limite disponível de cartão != Orçamento"
    await expect(
      page.getByText(/Regra de Ouro \(RN02\): Limite disponível de cartão ≠ Orçamento/i)
    ).toBeVisible();

    // Verify Run-rate Traffic Light
    await expect(page.getByText(/Semáforo: RED/i)).toBeVisible();

    // Wait for LIVE_API or ETAG_304_CACHE response from Envoy :8080 -> BFF :8081
    await expect(
      page.getByText(/Fonte: (LIVE_API|ETAG_304_CACHE)/i)
    ).toBeVisible({ timeout: 10000 });

    // Switch scope filter from Família Consolidada to Por Titular: Dantas and Por Titular: Cônjuge
    await page.getByRole("button", { name: "Por Titular: Dantas" }).click();
    await expect(
      page.getByRole("button", { name: "Por Titular: Dantas" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Por Titular: Cônjuge" }).click();
    await page.getByRole("button", { name: "Família Consolidada" }).click();
  });

  test("2. Matriz Multi-Cartões (/cards): Tabela comparativa (Itaú 5285, 1360, BB, Marisa) e Upload de fatura PDF", async ({
    page,
  }) => {
    await page.goto("/cards");

    await expect(
      page.getByRole("heading", {
        name: /Matriz Multi-Cartões & Upload em Lote/i,
      })
    ).toBeVisible();

    await expect(page.getByText(/Itaú Uniclass Signature/i)).toBeVisible();
    await expect(page.getByText(/•••• 5285/i)).toBeVisible();
    await expect(page.getByText(/•••• 1360/i)).toBeVisible();
    await expect(page.getByText(/Ourocard Visa Platinum/i)).toBeVisible();
    await expect(page.getByText(/Cartão Marisa Mastercard/i)).toBeVisible();

    // Upload a simulated PDF statement
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "fatura-itau-5285-2026-11.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from(
        "REF: 2026-11\nVENCIMENTO: 2026-11-25\nTOTAL_FATURA: 313.01\n2026-11-14 | ATACADAO SA | 313.01\n"
      ),
    });

    await page
      .getByRole("button", { name: /Processar Faturas e Validar Checksum/i })
      .click();

    await expect(
      page.getByText(/Upload em lote enviado com sucesso/i)
    ).toBeVisible();
  });

  test("3. Inbox de Revisão (/inbox): Reclassificação de lançamento Outros e criação de Regra Aprendida Camada 1", async ({
    page,
  }) => {
    await page.goto("/inbox");

    await expect(
      page.getByRole("heading", {
        name: /Inbox de Revisão & Aprendizado Contínuo/i,
      })
    ).toBeVisible();

    await expect(
      page.getByText("COMERCIO SERTAO LTDA", { exact: true })
    ).toBeVisible();
    await expect(page.getByText("Cidade: Acu / RN").first()).toBeVisible();

    await page
      .getByRole("button", {
        name: /Aplicar para todo o histórico deste estabelecimento/i,
      })
      .first()
      .click();

    await expect(
      page.getByText(/Regra aprendida salva na Camada 1 \(pfm_ai_rules\)/i)
    ).toBeVisible();
  });

  test("4. Simulador de Contratos (/contracts): Simulação interativa SAC, Price e Consórcio (Prazo vs. Parcela)", async ({
    page,
  }) => {
    await page.goto("/contracts");

    await expect(
      page.getByRole("heading", {
        name: /Simulador de Contratos \(SAC, Tabela Price e Consórcio Veicular\)/i,
      })
    ).toBeVisible();

    await expect(
      page.getByText(/Resultado da Simulação Imutável \(SAC\)/i)
    ).toBeVisible();

    // Switch to Price
    await page.getByRole("button", { name: "Financiamento Price" }).click();
    await expect(
      page.getByText(/Resultado da Simulação Imutável \(PRICE\)/i)
    ).toBeVisible();

    // Switch to Consórcio Veicular and toggle Reduzir Valor da Parcela
    await page.getByRole("button", { name: "Consórcio Veicular" }).click();
    await expect(
      page.getByText(/Resultado da Simulação Imutável \(CONSORCIO\)/i)
    ).toBeVisible();

    await page
      .getByRole("button", { name: /Reduzir Valor da Parcela/i })
      .click();
    await expect(page.getByText(/Economia de R\$/i)).toBeVisible();
  });
});

test("journeys 5 and 6 (/profile and /admin) render responsively on desktop and mobile without horizontal overflow", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 360, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    for (const route of ["/profile", "/admin"]) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflow).toBe(false);
    }
  }
});
