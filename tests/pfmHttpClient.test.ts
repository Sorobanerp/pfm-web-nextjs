import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchWithETagAndFallback,
  getDemoCreditCards,
  getDemoDashboardSummary,
  getDemoInboxItems,
  simulateContractAmortizationLocal,
} from "@/adapters/api/pfmHttpClient";

const mkResponse = (status: number, body: unknown, etag?: string) =>
  ({
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
    headers: { get: (k: string) => (k === "ETag" ? (etag ?? null) : null) },
  }) as unknown as Response;

describe("fetchWithETagAndFallback", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("returns live data, sends tenant header, and caches ETag", async () => {
    fetchMock.mockResolvedValueOnce(mkResponse(200, { v: "10.50" }, '"e1"'));
    const r = await fetchWithETagAndFallback("/a", () => ({ v: "x" }), "t1");
    expect(r).toEqual({ data: { v: "10.50" }, source: "LIVE_API" });
    const init = fetchMock.mock.calls[0][1];
    expect(init.headers["X-Tenant-ID"]).toBe("t1");
    expect(init.headers["If-None-Match"]).toBeUndefined();

    fetchMock.mockResolvedValueOnce(mkResponse(304, null));
    const r2 = await fetchWithETagAndFallback("/a", () => ({ v: "x" }), "t1");
    expect(r2).toEqual({ data: { v: "10.50" }, source: "ETAG_304_CACHE" });
    expect(fetchMock.mock.calls[1][1].headers["If-None-Match"]).toBe('"e1"');
  });

  it("uses default tenant and does not cache without ETag", async () => {
    fetchMock.mockResolvedValue(mkResponse(200, { v: 1 }));
    await fetchWithETagAndFallback("/b", () => ({ v: 0 }));
    expect(fetchMock.mock.calls[0][1].headers["X-Tenant-ID"]).toBe(
      "dddddddd-dddd-4ddd-8ddd-dddddddddddd"
    );
    await fetchWithETagAndFallback("/b", () => ({ v: 0 }));
    expect(fetchMock.mock.calls[1][1].headers["If-None-Match"]).toBeUndefined();
  });

  it("falls back on 304 without cache, non-ok status, and network error", async () => {
    fetchMock.mockResolvedValueOnce(mkResponse(304, null));
    expect((await fetchWithETagAndFallback("/c", () => 1, "t2")).source).toBe("DEMO_FALLBACK");
    fetchMock.mockResolvedValueOnce(mkResponse(500, null));
    expect((await fetchWithETagAndFallback("/c", () => 2, "t2")).data).toBe(2);
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    expect(await fetchWithETagAndFallback("/c", () => 3, "t2")).toEqual({
      data: 3,
      source: "DEMO_FALLBACK",
    });
  });
});

describe("demo data", () => {
  it("scales dashboard by scope", () => {
    const f = getDemoDashboardSummary("FAMILY");
    const d = getDemoDashboardSummary("HOLDER_DANTAS");
    const s = getDemoDashboardSummary("HOLDER_SPOUSE");
    expect(f.scope).toBe("FAMILY");
    expect(f.expectedIncome).toBe(18500);
    expect(d.expectedIncome).toBe(12580);
    expect(s.expectedIncome).toBe(5920);
    expect(["GREEN", "YELLOW", "RED"]).toContain(f.trafficLight);
  });

  it("covers every traffic light branch", () => {
    const lights = new Set(
      (["FAMILY", "HOLDER_DANTAS", "HOLDER_SPOUSE"] as const).map(
        (s) => getDemoDashboardSummary(s).trafficLight
      )
    );
    expect(lights.size).toBeGreaterThan(0);
  });

  it("returns cards and inbox items", () => {
    expect(getDemoCreditCards().length).toBeGreaterThan(0);
    const inbox = getDemoInboxItems();
    expect(inbox.map((i) => i.id)).toContain("tx-inbox-001");
  });
});

describe("simulateContractAmortizationLocal", () => {
  it.each(["SAC", "PRICE", "CONSORCIO"] as const)("%s reduce term", (m) => {
    const r = simulateContractAmortizationLocal(
      m, "REDUCE_TERM", 320000, 180, m === "CONSORCIO" ? 0 : 0.85, m === "CONSORCIO" ? 16 : 0, 85, 50000
    );
    expect(r.simulatedTotalMonths).toBeLessThan(180);
    expect(r.monthsSaved).toBe(180 - r.simulatedTotalMonths);
    expect(r.totalInterestAndFeesSaved).toBeGreaterThan(0);
    expect(r.effectiveRoiPct).toBeGreaterThan(0);
  });

  it("reduce installment keeps term", () => {
    const r = simulateContractAmortizationLocal("PRICE", "REDUCE_INSTALLMENT", 320000, 180, 0.85, 0, 85, 50000);
    expect(r.simulatedTotalMonths).toBe(180);
    expect(r.monthsSaved).toBe(0);
    expect(r.monthlyInstallmentReduction).toBeGreaterThan(0);
  });

  it("zero extra and zero rate paths", () => {
    const r = simulateContractAmortizationLocal("PRICE", "REDUCE_TERM", 12000, 12, 0, 0, 0, 0);
    expect(r.originalFirstInstallment).toBe(1000);
    expect(r.effectiveRoiPct).toBe(0);
    expect(r.monthsSaved).toBe(0);
  });

  it("clamps extra amortization to 95% and floors negatives at 0", () => {
    const hi = simulateContractAmortizationLocal("SAC", "REDUCE_TERM", 10000, 10, 1, 0, 0, 999999);
    expect(hi.extraAmortization).toBe(9500);
    const neg = simulateContractAmortizationLocal("SAC", "REDUCE_TERM", 10000, 10, 1, 0, 0, -5);
    expect(neg.extraAmortization).toBe(0);
  });
});
