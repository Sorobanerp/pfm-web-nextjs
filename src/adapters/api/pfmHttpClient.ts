export type ScopeFilter = "FAMILY" | "HOLDER_DANTAS" | "HOLDER_SPOUSE";
export type TrafficLight = "GREEN" | "YELLOW" | "RED";

export interface DashboardSummary {
  scope: ScopeFilter;
  referenceMonth: string;
  expectedIncome: number;
  realizedIncome: number;
  settledFixedExpenses: number;
  currentCardInvoices: number;
  scheduledInstallments: number;
  variableSpendToDate: number;
  dailyMovingAverage: number;
  remainingDays: number;
  projectedRemainingVariable: number;
  totalProjectedOutflow: number;
  projectedSurplusOrDeficit: number;
  incomeCommitmentPct: number;
  totalAvailableCardLimits: number;
  trafficLight: TrafficLight;
}

export interface CreditCardRow {
  cardId: string;
  cardName: string;
  issuer: string;
  lastFour: string;
  holder: string;
  currentInvoice: number;
  nextMonthInvoice: number;
  futureInstallmentsRest: number;
  totalLimit: number;
  usedPercentage: number;
  closingDay: number;
  dueDay: number;
}

export interface InboxTransactionItem {
  id: string;
  transactionDate: string;
  cardLabel: string;
  rawDescription: string;
  acquirerPrefix: string | null;
  merchantNormalized: string;
  extractedCity: string;
  amount: number;
  currentCategoryGroup: string;
  currentCategoryCode: string;
  confidence: number;
  historicalCount: number;
}

export type AmortizationModality = "SAC" | "PRICE" | "CONSORCIO";
export type PrepaymentStrategy = "REDUCE_TERM" | "REDUCE_INSTALLMENT";

export interface AmortizationSimulationComparison {
  modality: AmortizationModality;
  strategy: PrepaymentStrategy;
  outstandingBalance: number;
  remainingMonths: number;
  extraAmortization: number;
  originalFirstInstallment: number;
  simulatedFirstInstallment: number;
  originalTotalMonths: number;
  simulatedTotalMonths: number;
  monthsSaved: number;
  monthlyInstallmentReduction: number;
  originalTotalInterestAndFees: number;
  simulatedTotalInterestAndFees: number;
  totalInterestAndFeesSaved: number;
  effectiveRoiPct: number;
}

interface ETagCacheEntry<T> {
  etag: string;
  data: T;
}

const etagMemoryCache = new Map<string, ETagCacheEntry<unknown>>();

const DEFAULT_TENANT_ID = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_PFM_BFF_URL ?? "http://localhost:8080";

/**
 * Hexagonal Outbound HTTP Adapter with ETag / If-None-Match caching,
 * X-Tenant-ID Zero-Trust header injection, and resilient demo/mock fallback.
 */
export async function fetchWithETagAndFallback<T>(
  endpointPath: string,
  fallbackGenerator: () => T,
  tenantId: string = DEFAULT_TENANT_ID
): Promise<{ data: T; source: "LIVE_API" | "ETAG_304_CACHE" | "DEMO_FALLBACK" }> {
  const cacheKey = `${tenantId}:${endpointPath}`;
  const cached = etagMemoryCache.get(cacheKey) as ETagCacheEntry<T> | undefined;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Tenant-ID": tenantId,
  };
  if (cached?.etag) {
    headers["If-None-Match"] = cached.etag;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const response = await fetch(`${API_BASE_URL}${endpointPath}`, {
      method: "GET",
      headers,
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (response.status === 304 && cached) {
      return { data: cached.data, source: "ETAG_304_CACHE" };
    }

    if (response.ok) {
      const data = (await response.json()) as T;
      const newEtag = response.headers.get("ETag");
      if (newEtag) {
        etagMemoryCache.set(cacheKey, { etag: newEtag, data });
      }
      return { data, source: "LIVE_API" };
    }
  } catch {
    // Graceful fallback to rich executive demo dataset when backend is offline
  }

  return { data: fallbackGenerator(), source: "DEMO_FALLBACK" };
}

export function getDemoDashboardSummary(scope: ScopeFilter): DashboardSummary {
  const factor =
    scope === "FAMILY" ? 1.0 : scope === "HOLDER_DANTAS" ? 0.68 : 0.32;

  const expectedIncome = Math.round(18500 * factor * 100) / 100;
  const realizedIncome = Math.round(18200 * factor * 100) / 100;
  const settledFixedExpenses = Math.round(5400 * factor * 100) / 100;
  const currentCardInvoices = Math.round(6890.45 * factor * 100) / 100;
  const scheduledInstallments = Math.round(2450.0 * factor * 100) / 100;
  const variableSpendToDate = Math.round(2180.0 * factor * 100) / 100;
  const dailyMovingAverage = Math.round((variableSpendToDate / 16) * 100) / 100;
  const remainingDays = 14;
  const projectedRemainingVariable =
    Math.round(dailyMovingAverage * remainingDays * 100) / 100;

  const totalProjectedOutflow =
    Math.round(
      (settledFixedExpenses +
        currentCardInvoices +
        scheduledInstallments +
        variableSpendToDate +
        projectedRemainingVariable) *
        100
    ) / 100;

  const projectedSurplusOrDeficit =
    Math.round((realizedIncome - totalProjectedOutflow) * 100) / 100;
  const incomeCommitmentPct =
    Math.round((totalProjectedOutflow / realizedIncome) * 10000) / 100;

  const trafficLight: TrafficLight =
    incomeCommitmentPct > 100
      ? "RED"
      : incomeCommitmentPct > 85
      ? "YELLOW"
      : "GREEN";

  return {
    scope,
    referenceMonth: "2026-11",
    expectedIncome,
    realizedIncome,
    settledFixedExpenses,
    currentCardInvoices,
    scheduledInstallments,
    variableSpendToDate,
    dailyMovingAverage,
    remainingDays,
    projectedRemainingVariable,
    totalProjectedOutflow,
    projectedSurplusOrDeficit,
    incomeCommitmentPct,
    totalAvailableCardLimits: Math.round(64500 * factor * 100) / 100,
    trafficLight,
  };
}

export function getDemoCreditCards(): CreditCardRow[] {
  return [
    {
      cardId: "card-itau-5285",
      cardName: "Itaú Uniclass Signature",
      issuer: "Itaú Unibanco",
      lastFour: "5285",
      holder: "Titular (Dantas)",
      currentInvoice: 3842.65,
      nextMonthInvoice: 2410.3,
      futureInstallmentsRest: 8920.0,
      totalLimit: 32000.0,
      usedPercentage: 47.41,
      closingDay: 25,
      dueDay: 5,
    },
    {
      cardId: "card-itau-1360",
      cardName: "Itaú Azul Internacional",
      issuer: "Itaú Unibanco",
      lastFour: "1360",
      holder: "Adicional / Cônjuge",
      currentInvoice: 1620.8,
      nextMonthInvoice: 1180.0,
      futureInstallmentsRest: 3450.0,
      totalLimit: 15000.0,
      usedPercentage: 41.67,
      closingDay: 20,
      dueDay: 1,
    },
    {
      cardId: "card-bb-7741",
      cardName: "Ourocard Visa Platinum",
      issuer: "Banco do Brasil",
      lastFour: "7741",
      holder: "Titular (Dantas)",
      currentInvoice: 985.0,
      nextMonthInvoice: 640.0,
      futureInstallmentsRest: 1920.0,
      totalLimit: 14000.0,
      usedPercentage: 25.32,
      closingDay: 18,
      dueDay: 28,
    },
    {
      cardId: "card-marisa-0912",
      cardName: "Cartão Marisa Mastercard",
      issuer: "Credsystem / Marisa",
      lastFour: "0912",
      holder: "Cônjuge",
      currentInvoice: 442.0,
      nextMonthInvoice: 310.0,
      futureInstallmentsRest: 620.0,
      totalLimit: 3500.0,
      usedPercentage: 39.2,
      closingDay: 10,
      dueDay: 20,
    },
  ];
}

export function getDemoInboxItems(): InboxTransactionItem[] {
  return [
    {
      id: "tx-inbox-001",
      transactionDate: "2026-11-12",
      cardLabel: "Itaú 5285",
      rawDescription: "JIM.COM* COMERCIO SERTAO LTDAACUBRA",
      acquirerPrefix: "JIM.COM*",
      merchantNormalized: "COMERCIO SERTAO LTDA",
      extractedCity: "Acu / RN",
      amount: 148.9,
      currentCategoryGroup: "OUTROS",
      currentCategoryCode: "NAO_CATEGORIZADO",
      confidence: 0.42,
      historicalCount: 6,
    },
    {
      id: "tx-inbox-002",
      transactionDate: "2026-11-14",
      cardLabel: "Itaú 1360",
      rawDescription: "MP *CHURRASCARIA GAUCHAACUBRA",
      acquirerPrefix: "MP *",
      merchantNormalized: "CHURRASCARIA GAUCHA",
      extractedCity: "Acu / RN",
      amount: 189.5,
      currentCategoryGroup: "ALIMENTACAO",
      currentCategoryCode: "SUPERMERCADO_MERCEARIA",
      confidence: 0.65,
      historicalCount: 4,
    },
    {
      id: "tx-inbox-003",
      transactionDate: "2026-11-15",
      cardLabel: "BB 7741",
      rawDescription: "BMB*DISTRIBUIDORA VALE DO ASSU",
      acquirerPrefix: "BMB*",
      merchantNormalized: "DISTRIBUIDORA VALE DO ASSU",
      extractedCity: "Acu / RN",
      amount: 92.0,
      currentCategoryGroup: "OUTROS",
      currentCategoryCode: "NAO_CATEGORIZADO",
      confidence: 0.51,
      historicalCount: 3,
    },
    {
      id: "tx-inbox-004",
      transactionDate: "2026-11-16",
      cardLabel: "Marisa 0912",
      rawDescription: "PG *STUDIO BELA VIDA NATALBRA",
      acquirerPrefix: "PG *",
      merchantNormalized: "STUDIO BELA VIDA",
      extractedCity: "Natal / RN",
      amount: 215.0,
      currentCategoryGroup: "OUTROS",
      currentCategoryCode: "NAO_CATEGORIZADO",
      confidence: 0.58,
      historicalCount: 5,
    },
  ];
}

export function simulateContractAmortizationLocal(
  modality: AmortizationModality,
  strategy: PrepaymentStrategy,
  outstandingBalance: number,
  remainingMonths: number,
  monthlyRatePct: number,
  consorcioAdminPct: number,
  monthlyFees: number,
  extraAmortization: number
): AmortizationSimulationComparison {
  const r = monthlyRatePct / 100;
  const adminRate = consorcioAdminPct / 100;
  const clampedExtra = Math.min(
    Math.max(0, extraAmortization),
    outstandingBalance * 0.95
  );
  const newBalance = outstandingBalance - clampedExtra;

  const calcSchedule = (balance: number, months: number) => {
    let totalInterest = 0;
    let totalFees = 0;
    let firstInst = 0;
    let rem = balance;

    if (modality === "SAC") {
      const quota = balance / months;
      for (let i = 1; i <= months; i++) {
        const interest = rem * r;
        const inst = quota + interest + monthlyFees;
        if (i === 1) firstInst = inst;
        totalInterest += interest;
        totalFees += monthlyFees;
        rem -= quota;
      }
    } else if (modality === "PRICE") {
      const pmt =
        r > 0
          ? (balance * r * Math.pow(1 + r, months)) /
            (Math.pow(1 + r, months) - 1)
          : balance / months;
      for (let i = 1; i <= months; i++) {
        const interest = rem * r;
        const principal = pmt - interest;
        const inst = pmt + monthlyFees;
        if (i === 1) firstInst = inst;
        totalInterest += interest;
        totalFees += monthlyFees;
        rem -= principal;
      }
    } else {
      // CONSORCIO
      const quota = balance / months;
      for (let i = 1; i <= months; i++) {
        const adminFee = quota * adminRate;
        const inst = quota + adminFee + monthlyFees;
        if (i === 1) firstInst = inst;
        totalInterest += adminFee;
        totalFees += monthlyFees;
        rem -= quota;
      }
    }

    return {
      firstInst: Math.round(firstInst * 100) / 100,
      totalInterestAndFees: Math.round((totalInterest + totalFees) * 100) / 100,
    };
  };

  const orig = calcSchedule(outstandingBalance, remainingMonths);

  let simMonths = remainingMonths;
  if (clampedExtra > 0 && strategy === "REDUCE_TERM") {
    const origQuota = outstandingBalance / remainingMonths;
    simMonths = Math.max(1, Math.ceil(newBalance / origQuota));
  }

  const sim = calcSchedule(newBalance, simMonths);
  const monthsSaved = remainingMonths - simMonths;
  const monthlyInstallmentReduction =
    Math.max(0, Math.round((orig.firstInst - sim.firstInst) * 100) / 100);
  const totalInterestAndFeesSaved =
    Math.max(
      0,
      Math.round(
        (orig.totalInterestAndFees - sim.totalInterestAndFees) * 100
      ) / 100
    );
  const effectiveRoiPct =
    clampedExtra > 0
      ? Math.round((totalInterestAndFeesSaved / clampedExtra) * 10000) / 100
      : 0;

  return {
    modality,
    strategy,
    outstandingBalance,
    remainingMonths,
    extraAmortization: clampedExtra,
    originalFirstInstallment: orig.firstInst,
    simulatedFirstInstallment: sim.firstInst,
    originalTotalMonths: remainingMonths,
    simulatedTotalMonths: simMonths,
    monthsSaved,
    monthlyInstallmentReduction,
    originalTotalInterestAndFees: orig.totalInterestAndFees,
    simulatedTotalInterestAndFees: sim.totalInterestAndFees,
    totalInterestAndFeesSaved,
    effectiveRoiPct,
  };
}
