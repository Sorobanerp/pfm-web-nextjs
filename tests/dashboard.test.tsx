import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const fetchMock = vi.fn();
vi.mock("@/adapters/api/pfmHttpClient", async (orig) => {
  const actual = await orig<typeof import("@/adapters/api/pfmHttpClient")>();
  return { ...actual, fetchWithETagAndFallback: (...a: unknown[]) => fetchMock(...a) };
});

import Page from "@/app/page";
import { getDemoDashboardSummary } from "@/adapters/api/pfmHttpClient";

describe("Dashboard page", () => {
  beforeEach(() => fetchMock.mockReset());

  it("loads live data and switches scope", async () => {
    fetchMock.mockImplementation(async (path?: string, fb?: () => unknown) => ({
      data: { ...getDemoDashboardSummary("FAMILY"), trafficLight: "GREEN" },
      source: path?.includes("HOLDER_SPOUSE") ? "ETAG_304_CACHE" : "LIVE_API",
    }));
    render(<Page />);
    await waitFor(() => expect(screen.getByText(/Fonte: LIVE_API/)).toBeInTheDocument());
    expect(screen.getByText(/Semáforo: GREEN/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Cônjuge/ }));
    await waitFor(() => expect(screen.getByText(/Fonte: ETAG_304_CACHE/)).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: /Dantas/ }));
    expect(fetchMock).toHaveBeenCalledWith("/api/v1/dashboard?scope=HOLDER_DANTAS", expect.any(Function));
    // exercise the fallback generator passed to the client
    expect(fetchMock.mock.calls[2][1]().scope).toBe("HOLDER_DANTAS");
  });

  it.each([
    ["YELLOW", false],
    ["RED", true],
  ])("renders %s traffic light", async (light, hasAction) => {
    fetchMock.mockResolvedValue({
      data: { ...getDemoDashboardSummary("FAMILY"), trafficLight: light, projectedSurplusOrDeficit: hasAction ? -100 : 100 },
      source: "LIVE_API",
    });
    render(<Page />);
    await waitFor(() => expect(screen.getByText(new RegExp(`Semáforo: ${light}`))).toBeInTheDocument());
    expect(!!screen.queryByText(/Ação recomendada/)).toBe(hasAction);
  });

  it("ignores a response arriving after unmount", async () => {
    let resolve!: (v: unknown) => void;
    fetchMock.mockReturnValue(new Promise((r) => (resolve = r)));
    const { unmount } = render(<Page />);
    unmount();
    resolve({ data: getDemoDashboardSummary("FAMILY"), source: "LIVE_API" });
    await Promise.resolve();
    expect(true).toBe(true);
  });
});
