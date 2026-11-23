import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextRequest } from "next/server";
import {
  BigNumberCard,
  ConversationalHeader,
  EmptyStateCard,
  formatBRL,
  MoneyInputBRL,
  PulseBadge,
  SkeletonLoader,
} from "@/design-system";
import { AppShell } from "@/design-system/AppShell";
import { QueryProvider } from "@/lib/api/QueryProvider";
import {
  clearSession,
  getSession,
  isLocalAppEnv,
  saveSession,
} from "@/lib/api/session";
import {
  apiRequest,
  createTransaction,
  generateDevToken,
  getApiBaseUrl,
  mapHttpErrorMessage,
  PfmApiError,
} from "@/lib/api/client";
import { evaluatePasswordStrength } from "@/lib/api/passwordStrength";
import { middleware } from "@/middleware";
import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";
import VerifyOtpPage from "@/app/verify/page";
import ForgotPasswordPage from "@/app/forgot-password/page";
import ResetPasswordPage from "@/app/reset-password/page";
import OnboardingPage from "@/app/onboarding/page";
import AdminLoginPage from "@/app/admin/login/page";
import DashboardAliasPage from "@/app/dashboard/page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ push: pushMock }),
}));

describe("Design System PFM Pulse", () => {
  it("renders BigNumberCard, PulseBadge, ConversationalHeader, EmptyStateCard, SkeletonLoader and MoneyInputBRL", () => {
    const onMoneyChange = vi.fn();
    const onEmptyAction = vi.fn();

    render(
      <div>
        <ConversationalHeader
          title="Bom dia, Família Dantas"
          subtitle="Seu resumo em BRL"
          badgeText="Verde"
          actions={<span>Ação</span>}
        />
        <BigNumberCard
          title="Livre para Gastar"
          value={formatBRL(2450.9)}
          subtitle="Ritmo saudável"
          badgeText="Saudável"
          accent="lime"
          footer={<span>Atualizado agora</span>}
        />
        <PulseBadge variant="peach">Alerta</PulseBadge>
        <MoneyInputBRL
          label="Valor"
          value="123.45"
          onChange={onMoneyChange}
          error=""
        />
        <EmptyStateCard
          title="Nada por aqui"
          description="Comece importando sua fatura."
          icon={<span>I</span>}
          actionLabel="Importar"
          onAction={onEmptyAction}
        />
        <SkeletonLoader variant="metric" count={2} />
        <SkeletonLoader variant="list" count={2} />
        <SkeletonLoader variant="card" />
      </div>
    );

    expect(screen.getByText("Bom dia, Família Dantas")).toBeInTheDocument();
    expect(screen.getByText(/2\.450,90/)).toBeInTheDocument();
    const input = screen.getByLabelText("Valor") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "50000" } });
    expect(onMoneyChange).toHaveBeenCalledWith("500.00", 50000);

    fireEvent.click(screen.getByText("Importar"));
    expect(onEmptyAction).toHaveBeenCalled();
  });

  it("opens Ctrl+K Quick Launch in AppShell and submits transaction", async () => {
    saveSession({
      accessToken: "dev-token-tenant-a",
      tenantId: "11111111-1111-1111-1111-111111111111",
      tenantName: "Família Dantas",
      role: "OWNER",
      email: "dantas@pfmpulse.com.br",
    });

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ id: "tx-1", status: "COMMITTED" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    );

    render(
      <QueryProvider>
        <AppShell>
          <div>Conteúdo</div>
        </AppShell>
      </QueryProvider>
    );

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.getByRole("dialog", { name: "Lançamento Rápido" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Onde foi essa compra?"), {
      target: { value: "Padaria" },
    });
    fireEvent.change(screen.getByLabelText("Valor em Reais (BRL)"), {
      target: { value: "3590" },
    });
    fireEvent.click(screen.getByText("Confirmar lançamento"));

    await waitFor(() => {
      expect(screen.getByText("Lançamento registrado com sucesso!")).toBeInTheDocument();
    });

    // Cover validation error, Escape key, PfmApiError on submit, and logout
    fireEvent.click(screen.getByText("Confirmar lançamento"));
    expect(screen.getByText(/Informe uma descrição/)).toBeInTheDocument();

    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "viewer forbidden" }), { status: 403 })
    );
    fireEvent.change(screen.getByLabelText("Onde foi essa compra?"), {
      target: { value: "Café" },
    });
    fireEvent.change(screen.getByLabelText("Valor em Reais (BRL)"), {
      target: { value: "1200" },
    });
    fireEvent.click(screen.getByText("Confirmar lançamento"));
    await waitFor(() => {
      expect(screen.getByText(/não tem permissão/)).toBeInTheDocument();
    });

    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.click(screen.getByLabelText("Lançamento Rápido"));
    fireEvent.click(screen.getByLabelText("Fechar lançamento rápido"));

    const assignSpy = vi.fn();
    Object.defineProperty(window, "location", {
      value: { assign: assignSpy },
      writable: true,
    });
    fireEvent.click(screen.getByText("Sair da sessão"));
    expect(assignSpy).toHaveBeenCalledWith("/login");
    fetchSpy.mockRestore();
  });
});

describe("API Client, Session & Middleware", () => {
  beforeEach(() => {
    clearSession();
    pushMock.mockReset();
  });

  it("maps HTTP error statuses to conversational Portuguese messages", () => {
    expect(mapHttpErrorMessage(400, "bad")).toContain("Verifique os dados");
    expect(mapHttpErrorMessage(401)).toContain("sessão expirou");
    expect(mapHttpErrorMessage(403)).toContain("não tem permissão");
    expect(mapHttpErrorMessage(404)).toContain("isolamento RLS");
    expect(mapHttpErrorMessage(409)).toContain("já foi enviado");
    expect(mapHttpErrorMessage(422)).toContain("Não foi possível processar");
    expect(mapHttpErrorMessage(500)).toContain("instabilidade temporária");
    expect(mapHttpErrorMessage(418, "teapot")).toContain("teapot");
    expect(getApiBaseUrl()).toBeTruthy();
  });

  it("propagates headers and throws PfmApiError on failure", async () => {
    saveSession({
      accessToken: "tok-1",
      tenantId: "11111111-1111-1111-1111-111111111111",
      tenantName: "Família Dantas",
      role: "OWNER",
      email: "a@b.com",
    });
    expect(getSession()?.tenantId).toBe("11111111-1111-1111-1111-111111111111");

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: "jwt-ok" }), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "invalid amount" }), { status: 400 })
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }));

    const tok = await generateDevToken({
      tenant_id: "11111111-1111-1111-1111-111111111111",
      tenant_name: "Família",
      role: "OWNER",
    });
    expect(tok.access_token).toBe("jwt-ok");

    await expect(
      createTransaction({
        description: "Teste",
        amount: "-10.00",
        category_code: "OUTROS",
      })
    ).rejects.toBeInstanceOf(PfmApiError);

    const noContent = await apiRequest<void>("/api/v1/profile/members/1", {
      method: "DELETE",
    });
    expect(noContent).toBeUndefined();
    fetchSpy.mockRestore();
  });

  it("protects client and admin routes in middleware", () => {
    const reqPublic = new NextRequest("http://localhost:3000/login");
    expect(middleware(reqPublic).status).toBe(200);

    const reqClientAnon = new NextRequest("http://localhost:3000/dashboard");
    expect(middleware(reqClientAnon).headers.get("location")).toContain("/login");

    const reqAdminAnon = new NextRequest("http://localhost:3000/admin");
    expect(middleware(reqAdminAnon).headers.get("location")).toContain("/admin/login");

    const reqAdminOk = new NextRequest("http://localhost:3000/admin", {
      headers: {
        cookie:
          "pfm_access_token=dev-admin-token; pfm_tenant_id=11111111-1111-1111-1111-111111111111; pfm_user_role=PLATFORM_ADMIN",
      },
    });
    expect(middleware(reqAdminOk).status).toBe(200);

    const reqAdminOnClient = new NextRequest("http://localhost:3000/cards", {
      headers: {
        cookie:
          "pfm_access_token=dev-admin-token; pfm_tenant_id=11111111-1111-1111-1111-111111111111; pfm_user_role=PLATFORM_ADMIN",
      },
    });
    expect(middleware(reqAdminOnClient).headers.get("location")).toContain("/admin");

    const reqClientOk = new NextRequest("http://localhost:3000/dashboard", {
      headers: {
        cookie:
          "pfm_access_token=dev-token-tenant-a; pfm_tenant_id=11111111-1111-1111-1111-111111111111; pfm_user_role=OWNER",
      },
    });
    expect(middleware(reqClientOk).status).toBe(200);
  });

  it("evaluates password strength levels", () => {
    expect(evaluatePasswordStrength("").score).toBe(0);
    expect(evaluatePasswordStrength("abc").score).toBe(1);
    expect(evaluatePasswordStrength("Abcdefgh").score).toBe(2);
    expect(evaluatePasswordStrength("Abcdefg1").score).toBe(3);
    expect(evaluatePasswordStrength("Abcdefg1!").score).toBe(4);
  });
});

describe("Auth, SSO, Register, Verify, Recovery, Onboarding & Admin Login Pages", () => {
  beforeEach(() => {
    clearSession();
    pushMock.mockReset();
    vi.stubEnv("NEXT_PUBLIC_APP_ENV", "local");
  });

  it("renders LoginPage with SSO buttons and local quick switcher", async () => {
    expect(isLocalAppEnv()).toBe(true);
    const dashRender = render(<DashboardAliasPage />);
    dashRender.unmount();
    render(<LoginPage />);
    expect(screen.getByText("Continuar com Google")).toBeInTheDocument();
    expect(screen.getByText("Continuar com Microsoft")).toBeInTheDocument();
    expect(screen.getByText("Família Dantas OWNER")).toBeInTheDocument();

    // Validation error on empty submit
    fireEvent.click(screen.getByText("Entrar no meu painel"));
    expect(screen.getByText(/Informe seu e-mail e senha/)).toBeInTheDocument();

    // Form submit with credentials and mocked BFF token
    const loginFetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ access_token: "jwt-live-local" }), { status: 200 })
    );
    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "dantas@pfm.br" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "Secret123!" },
    });
    fireEvent.click(screen.getByText("Entrar no meu painel"));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });

    // SSO Google & Microsoft
    fireEvent.click(screen.getByText("Continuar com Google"));
    fireEvent.click(screen.getByText("Continuar com Microsoft"));

    // Quick local profile
    fireEvent.click(screen.getByText("Família Dantas OWNER"));
    fireEvent.click(screen.getByText("Família Dantas VIEWER"));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
    loginFetchSpy.mockRestore();
  });

  it("walks through 3-step RegisterPage, VerifyOtpPage, Recovery and Onboarding", () => {
    const { unmount } = render(<RegisterPage />);
    fireEvent.click(screen.getByText("Continuar"));
    expect(screen.getByText(/Preencha seu nome/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Nome completo"), { target: { value: "Ana" } });
    fireEvent.change(screen.getByLabelText("E-mail principal"), { target: { value: "ana@pfm.br" } });
    fireEvent.change(screen.getByLabelText("Senha de acesso"), { target: { value: "StrongPass1!" } });
    fireEvent.click(screen.getByText("Continuar"));
    fireEvent.click(screen.getByText("Individual Pro"));
    fireEvent.click(screen.getByText("Voltar"));
    fireEvent.click(screen.getByText("Continuar"));
    fireEvent.click(screen.getByText("Continuar"));
    fireEvent.click(screen.getByText("Concluir e verificar código"));
    expect(screen.getByText(/aceitar os termos/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByText("Concluir e verificar código"));
    expect(pushMock).toHaveBeenCalledWith("/verify");
    unmount();

    const v = render(<VerifyOtpPage />);
    fireEvent.click(screen.getByText("Confirmar código e continuar"));
    expect(screen.getByText(/Digite os 6 dígitos/)).toBeInTheDocument();
    for (let i = 1; i <= 6; i++) {
      fireEvent.change(screen.getByLabelText(`Dígito ${i}`), { target: { value: String(i) } });
    }
    fireEvent.click(screen.getByText("Confirmar código e continuar"));
    expect(pushMock).toHaveBeenCalledWith("/onboarding");
    v.unmount();

    const f = render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByLabelText("E-mail cadastrado"), { target: { value: "ana@pfm.br" } });
    fireEvent.click(screen.getByText("Enviar link de recuperação"));
    expect(screen.getByText(/Instruções enviadas/)).toBeInTheDocument();
    f.unmount();

    const r = render(<ResetPasswordPage />);
    fireEvent.click(screen.getByText("Salvar nova senha e entrar"));
    expect(screen.getByText(/mínimo 8 caracteres/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Nova senha"), { target: { value: "StrongPass1!" } });
    fireEvent.change(screen.getByLabelText("Confirmar nova senha"), { target: { value: "Different1!" } });
    fireEvent.click(screen.getByText("Salvar nova senha e entrar"));
    expect(screen.getByText(/não coincidem/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Confirmar nova senha"), { target: { value: "StrongPass1!" } });
    fireEvent.click(screen.getByText("Salvar nova senha e entrar"));
    expect(pushMock).toHaveBeenCalledWith("/login");
    r.unmount();

    const o = render(<OnboardingPage />);
    fireEvent.click(screen.getByText("Controlar o orçamento mensal da família"));
    fireEvent.click(screen.getByText("Avançar"));
    fireEvent.change(screen.getByLabelText("Meta mensal em Reais (BRL)"), { target: { value: "600000" } });
    fireEvent.click(screen.getByText("Voltar"));
    fireEvent.click(screen.getByText("Avançar"));
    fireEvent.click(screen.getByText("Avançar"));
    fireEvent.click(screen.getByText("Importar 1ª fatura PDF agora"));
    expect(pushMock).toHaveBeenCalledWith("/cards");
    fireEvent.click(screen.getByText("Ir para o Painel Executivo"));
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
    o.unmount();
  });

  it("renders AdminLoginPage with Zero-Trust badge", async () => {
    render(<AdminLoginPage />);
    expect(
      screen.getByText("GOVERNANÇA SAAS ADMIN • ISOLAMENTO RLS ATIVO")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Acessar Console SaaS Admin"));
    expect(screen.getByText(/credenciais corporativas/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "AdminPass1!" } });
    fireEvent.change(screen.getByLabelText("Token MFA (6 dígitos)"), { target: { value: "123456" } });
    fireEvent.click(screen.getByText("Acessar Console SaaS Admin"));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/admin");
    });
  });
});
