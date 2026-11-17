import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "@/app/inbox/page";
import { getDemoInboxItems } from "@/adapters/api/pfmHttpClient";

describe("Inbox page", () => {
  it("lists items and applies rule clearing item with banner", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const items = getDemoInboxItems();
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(items.length);
    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], "RESTAURANTES_GASTRONOMIA");
    expect(selects[0]).toHaveValue("RESTAURANTES_GASTRONOMIA");
    await user.click(buttons[0]);
    expect(screen.getByText(/Regra aprendida salva/)).toHaveTextContent("RESTAURANTES_GASTRONOMIA");
    expect(screen.getAllByRole("button")).toHaveLength(items.length - 1);
  });

  it("shows empty state after all reviewed, using default category when unselected", async () => {
    const user = userEvent.setup();
    render(<Page />);
    for (let n = screen.getAllByRole("button").length; n > 0; n--) {
      await user.click(screen.getAllByRole("button")[0]);
    }
    expect(screen.getByText(/Todas as transações pendentes/)).toBeInTheDocument();
    expect(screen.getAllByText(/Regra aprendida/).length).toBe(1);
  });
});
