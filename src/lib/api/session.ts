export type PfmUserRole = "OWNER" | "MEMBER" | "VIEWER" | "PLATFORM_ADMIN";

export interface PfmSession {
  accessToken: string;
  tenantId: string;
  tenantName: string;
  role: PfmUserRole;
  email: string;
}

export interface LocalQuickProfile {
  id: string;
  label: string;
  subtitle: string;
  tenantId: string;
  tenantName: string;
  role: PfmUserRole;
  fallbackToken: string;
  email: string;
  redirectTo: string;
}

export const SESSION_STORAGE_KEY = "pfm_pulse_session";
export const ONBOARDING_STORAGE_KEY = "pfm_pulse_onboarding";
export const REGISTER_DRAFT_KEY = "pfm_pulse_register_draft";

function makeDevProfile(
  id: string,
  label: string,
  subtitle: string,
  tenantId: string,
  tenantName: string,
  role: PfmUserRole,
  fallbackToken: string,
  email: string,
  redirectTo = "/dashboard"
): LocalQuickProfile {
  return { id, label, subtitle, tenantId, tenantName, role, fallbackToken, email, redirectTo };
}

export const LOCAL_DEV_PROFILES: LocalQuickProfile[] = [
  makeDevProfile("dantas-owner", "Família Dantas OWNER", "Tenant A • Acesso total", "11111111-1111-1111-1111-111111111111", "Família Dantas", "OWNER", "dev-token-tenant-a", "dantas@pfmpulse.com.br"),
  makeDevProfile("dantas-viewer", "Lucas VIEWER", "Tenant A • Somente leitura", "11111111-1111-1111-1111-111111111111", "Família Dantas", "VIEWER", "dev-viewer-tenant-a", "lucas@pfmpulse.com.br"),
  makeDevProfile("visitante-rls", "Carlos Mendes RLS", "Tenant B • Isolamento RLS", "22222222-2222-2222-2222-222222222222", "Família Carlos Mendes", "OWNER", "dev-token-tenant-b", "carlos.mendes@pfmpulse.com.br"),
  makeDevProfile("saas-admin", "SaaS Admin", "Governança • Zero-Trust LGPD", "11111111-1111-1111-1111-111111111111", "Soroban SaaS Backoffice", "PLATFORM_ADMIN", "dev-admin-token", "sre-admin@soroban.com.br", "/admin"),
];

export function isLocalAppEnv(): boolean {
  return process.env.NEXT_PUBLIC_APP_ENV === "local";
}

function writeCookie(name: string, value: string, maxAgeSeconds = 86400): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function saveSession(session: PfmSession): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore storage quota errors
    }
  }
  writeCookie("pfm_access_token", session.accessToken);
  writeCookie("pfm_tenant_id", session.tenantId);
  writeCookie("pfm_user_role", session.role);
  writeCookie("pfm_user_email", session.email);
}

export function getSession(): PfmSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PfmSession>;
    if (!parsed.accessToken || !parsed.tenantId || !parsed.role) return null;
    return {
      accessToken: parsed.accessToken,
      tenantId: parsed.tenantId,
      tenantName: parsed.tenantName ?? "Família PFM",
      role: parsed.role,
      email: parsed.email ?? "",
    };
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  writeCookie("pfm_access_token", "", 0);
  writeCookie("pfm_tenant_id", "", 0);
  writeCookie("pfm_user_role", "", 0);
  writeCookie("pfm_user_email", "", 0);
}
