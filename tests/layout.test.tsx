import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

import RootLayout, { metadata } from "@/app/layout";

describe("RootLayout", () => {
  it("wraps children with navbar and exposes metadata", () => {
    // html/body nesting warns in jsdom; render inside a container anyway
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<RootLayout><p>child</p></RootLayout>, { container: document.documentElement });
    err.mockRestore();
    expect(screen.getByText("child")).toBeInTheDocument();
    expect(screen.getByText("PFM Core Banking V2")).toBeInTheDocument();
    expect(String(metadata.title)).toContain("PFM Core Banking V2");
  });
});
