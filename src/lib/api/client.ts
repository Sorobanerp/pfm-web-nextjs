import { getSession, type PfmUserRole } from "./session";

export class PfmApiError extends Error {
  public readonly status: number;
  public readonly userMessage: string;
  public readonly rawError?: string;

  constructor(status: number, userMessage: string, rawError?: string) {
    super(userMessage);
    this.name = "PfmApiError";
    this.status = status;
    this.userMessage = userMessage;
    this.rawError = rawError;
  }
}

export function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_PFM_BFF_URL ??
    "http://localhost:8080"
  );
}

export function mapHttpErrorMessage(status: number, rawMessage?: string): string {
  const detail = rawMessage ? ` (${rawMessage})` : "";
  switch (status) {
    case 400:
      return `Verifique os dados informados antes de continuar.${detail}`;
    case 401:
      return "Sua sessão expirou ou o identificador da família está ausente. Entre novamente.";
    case 403:
      return "Seu perfil atual não tem permissão para realizar esta ação.";
    case 404:
      return "Registro não encontrado neste espaço familiar (isolamento RLS).";
    case 409:
      return `Este registro já foi enviado ou possui divergência de conferência.${detail}`;
    case 422:
      return `Não foi possível processar esta operação com os valores enviados.${detail}`;
    default:
      if (status >= 500) {
        return "Nosso servidor encontrou uma instabilidade temporária. Tente novamente em instantes.";
      }
      return rawMessage || "Não foi possível concluir a requisição.";
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  tenantIdOverride?: string;
  tokenOverride?: string;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const session = getSession();
  const token = options.tokenOverride ?? session?.accessToken;
  const tenantId = options.tenantIdOverride ?? session?.tenantId;

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (tenantId) {
    headers.set("X-Tenant-ID", tenantId);
  }

  let requestBody: BodyInit | undefined;
  if (options.body !== undefined) {
    if (options.body instanceof FormData || typeof options.body === "string") {
      requestBody = options.body;
    } else {
      headers.set("Content-Type", "application/json");
      requestBody = JSON.stringify(options.body);
    }
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
    body: requestBody,
  });

  if (!response.ok) {
    let rawMsg: string | undefined;
    try {
      const errJson = (await response.json()) as { error?: string; message?: string };
      rawMsg = errJson.error ?? errJson.message;
    } catch {
      rawMsg = response.statusText;
    }
    throw new PfmApiError(
      response.status,
      mapHttpErrorMessage(response.status, rawMsg),
      rawMsg
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export interface DevTokenResponse {
  access_token: string;
  token_type: string;
  tenant_id: string;
  tenant_name: string;
  role: PfmUserRole;
}

export async function generateDevToken(payload: {
  tenant_id: string;
  tenant_name: string;
  role: PfmUserRole;
  sub?: string;
}): Promise<DevTokenResponse> {
  return apiRequest<DevTokenResponse>("/api/v1/auth/dev-token", {
    method: "POST",
    body: payload,
  });
}

export interface CreateTransactionInput {
  description: string;
  amount: string;
  currency?: string;
  category_code: string;
  payment_method?: string;
  installments?: number;
  transaction_date?: string;
}

export interface TransactionRecord {
  id: string;
  tenant_id: string;
  description: string;
  amount: string;
  currency: string;
  category_code: string;
  status: string;
}

export async function createTransaction(
  payload: CreateTransactionInput
): Promise<TransactionRecord> {
  return apiRequest<TransactionRecord>("/api/v1/transactions", {
    method: "POST",
    body: {
      currency: "BRL",
      payment_method: "CREDIT_CARD",
      installments: 1,
      ...payload,
    },
  });
}
