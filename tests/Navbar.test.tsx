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
    expect(links.map((l) => l.getAttribute("href"))).toEqual(["/", "/cards", "/inbox", "/contracts"]);
    expect(screen.getByText("2. Matriz Multi-Cartões").className).toContain("bg-emerald-500/20");
    expect(screen.getByText("3. Inbox de Revisão (IA Camada 1)").className).not.toContain("bg-emerald-500/20");
  });
});
