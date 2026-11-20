import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import ProfileFamilyLgpdPage from "@/app/profile/page";
import SaasAdminPage from "@/app/admin/page";

describe("ProfileFamilyLgpdPage (Journey 5 - US-13)", () => {
  it("supports inviting/removing members, adjusting budget caps, KMS vault, LGPD export and Crypto-Shredding", () => {
    render(<ProfileFamilyLgpdPage />);
    expect(screen.getByText(/Central de Perfil, Família & Governança LGPD/i)).toBeInTheDocument();

    // Empty invite submit does nothing
    const inviteBtn = screen.getByRole("button", { name: "Convidar" });
    fireEvent.click(inviteBtn);

    // Invite VIEWER
    const emailInput = screen.getByPlaceholderText("convidado@familia.local" === "convidado@familia.local" ? "convidado@familia.com" : "");
    const roleSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(emailInput, { target: { value: "filho@familia.com" } });
    fireEvent.change(roleSelect, { target: { value: "VIEWER" } });
    fireEvent.click(inviteBtn);
    expect(screen.getByText("filho@familia.com")).toBeInTheDocument();

    // Invite MEMBER
    fireEvent.change(emailInput, { target: { value: "irma@familia.com" } });
    fireEvent.change(roleSelect, { target: { value: "MEMBER" } });
    fireEvent.click(inviteBtn);
    expect(screen.getByText("irma@familia.com")).toBeInTheDocument();

    // Remove a member
    const removeButtons = screen.getAllByRole("button", { name: "Remover" });
    fireEvent.click(removeButtons[0]);
    expect(screen.queryByText("conjuge@familia.local")).not.toBeInTheDocument();

    // Increment budget cap
    const addBudgetButtons = screen.getAllByRole("button", { name: "+R$ 100" });
    fireEvent.click(addBudgetButtons[0]);
    expect(screen.getByText("R$ 1620.00 / R$ 2500.00")).toBeInTheDocument();

    // KMS card selection & update
    const kmsSelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(kmsSelect, { target: { value: "Itaú Personnalité •••• 8810" } });
    fireEvent.click(screen.getByRole("button", { name: "Atualizar Senha KMS" }));
    expect(screen.getByText(/cifrada via AWS KMS/)).toBeInTheDocument();

    // LGPD Export
    fireEvent.click(screen.getByRole("button", { name: "Exportar Dados (JSON/CSV)" }));
    expect(screen.getByText(/Pacote JSON \+ CSV assinado/)).toBeInTheDocument();

    // Crypto-Shredding
    const shredBtn = screen.getByRole("button", { name: "Executar Crypto-Shredding" });
    expect(shredBtn).toBeDisabled();
    const shredInput = screen.getByPlaceholderText("EXCLUIR_DEFINITIVAMENTE_MINHA_CONTA");
    fireEvent.change(shredInput, { target: { value: "EXCLUIR_DEFINITIVAMENTE_MINHA_CONTA" } });
    expect(shredBtn).not.toBeDisabled();
    fireEvent.click(shredBtn);
    expect(screen.getByText(/CRYPTO_SHREDDED/)).toBeInTheDocument();
  });
});

describe("SaasAdminPage (Journey 6 - US-12)", () => {
  it("renders zero-PII KPIs and updates tenant plans, statuses and quotas", () => {
    render(<SaasAdminPage />);
    expect(screen.getByText(/Painel SaaS Admin & Saúde Global do Produto/i)).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();

    const planSelect = screen.getByLabelText("Plano de Tenant #003");
    fireEvent.change(planSelect, { target: { value: "FAMILY_PLUS" } });
    expect(screen.getByText("3 / 999")).toBeInTheDocument();

    const planSelect1 = screen.getByLabelText("Plano de Tenant #001 (Piloto)");
    fireEvent.change(planSelect1, { target: { value: "FREE" } });
    expect(screen.getByText("4 / 3")).toBeInTheDocument();

    const statusSelect3 = screen.getByLabelText("Status de Tenant #003");
    fireEvent.change(statusSelect3, { target: { value: "SUSPENDED" } });
    expect(statusSelect3.className).toContain("bg-[#FF5D6C]");

    const statusSelect2 = screen.getByLabelText("Status de Tenant #002");
    fireEvent.change(statusSelect2, { target: { value: "ACTIVE" } });
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });
});
