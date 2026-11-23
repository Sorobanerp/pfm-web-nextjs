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

export const LOCAL_DEV_PROFILES: LocalQuickProfile[] = [
  {
    id: "dantas-owner",
    label: "Família Dantas OWNER",
    subtitle: "Tenant A • Acesso total",
    tenantId: "11111111-1111-1111-1111-111111111111",
    tenantName: "Família Dantas",
    role: "OWNER",
    fallbackToken: "dev-token-tenant-a",
    email: "dantas@pfmpulse.com.br",
    redirectTo: "/dashboard",
  },
  {
    id: "dantas-viewer",
    label: "Lucas VIEWER",
    subtitle: "Tenant A • Somente leitura",
    tenantId: "11111111-1111-1111-1111-111111111111",
    tenantName: "Família Dantas",
    role: "VIEWER",
    fallbackToken: "dev-viewer-tenant-a",
    email: "lucas@pfmpulse.com.br",
    redirectTo: "/dashboard",
  },
  {
    id: "visitante-rls",
    label: "Carlos Mendes RLS",
    subtitle: "Tenant B • Isolamento RLS",
    tenantId: "22222222-2222-2222-2222-222222222222",
    tenantName: "Família Carlos Mendes",
    role: "OWNER",
    fallbackToken: "dev-token-tenant-b",
    email: "carlos.mendes@pfmpulse.com.br",
    redirectTo: "/dashboard",
  },
  {
    id: "saas-admin",
    label: "SaaS Admin",
    subtitle: "Governança • Zero-Trust LGPD",
    tenantId: "11111111-1111-1111-1111-111111111111",
    tenantName: "Soroban SaaS Backoffice",
    role: "PLATFORM_ADMIN",
    fallbackToken: "dev-admin-token",
    email: "sre-admin@soroban.com.br",
    redirectTo: "/admin",
  },
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
