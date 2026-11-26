import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const pathname = vi.fn();
vi.mock("next/navigation", () => ({ usePathname: () => pathname() }));

import { Navbar } from "@/components/Navbar";

describe("Navbar", () => {
  it("renders links and highlights the active route", () => {
    pathname.mockReturnValue("/cards");
    render(<Navbar />);
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/",
      "/cards",
      "/inbox",
      "/contracts",
      "/profile",
      "/admin",
      "/",
      "/cards",
      "/inbox",
      "/contracts",
      "/profile",
      "/admin",
    ]);
    expect(screen.getByText("2. Matriz Multi-Cartões").className).toContain("bg-[#DEFF8B]");
    expect(screen.getByText("3. Ingestão PDF & Inbox IA").className).not.toContain("bg-[#DEFF8B]");
  });
});
