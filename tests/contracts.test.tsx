import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "@/app/contracts/page";

describe("Contracts page", () => {
  it("switches modality and strategy and reacts to sliders", async () => {
    const user = userEvent.setup();
    const { container } = render(<Page />);
    expect(screen.getByText("180 meses")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Financiamento Price" }));
    await user.click(screen.getByRole("button", { name: "Consórcio Veicular" }));
    await user.click(screen.getByRole("button", { name: /Reduzir Valor da Parcela/ }));
    await user.click(screen.getByRole("button", { name: /Reduzir Prazo/ }));
    await user.click(screen.getByRole("button", { name: "Financiamento SAC" }));
    const [bal, months, extra] = Array.from(
      container.querySelectorAll('input[type="range"]')
    ) as HTMLInputElement[];
    fireEvent.change(bal, { target: { value: "400000" } });
    fireEvent.change(months, { target: { value: "120" } });
    fireEvent.change(extra, { target: { value: "10000" } });
    expect(screen.getByText("120 meses")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
