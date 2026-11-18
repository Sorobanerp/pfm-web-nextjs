import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "@/app/cards/page";

describe("Cards page", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("renders matrix and rejects submit with no files", async () => {
    const f = vi.fn();
    vi.stubGlobal("fetch", f);
    render(<Page />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Processar Faturas/ }));
    expect(screen.getByText(/Selecione ao menos um arquivo/)).toBeInTheDocument();
    expect(f).not.toHaveBeenCalled();
  });

  it("uploads files with password header and clears password", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", f);
    const { container } = render(<Page />);
    const file = new File(["x"], "fatura.pdf", { type: "application/pdf" });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, [file]);
    const pwd = screen.getByPlaceholderText(/primeiros dígitos/);
    await userEvent.type(pwd, "123");
    await userEvent.click(screen.getByRole("button", { name: /Processar Faturas/ }));
    await waitFor(() => expect(f).toHaveBeenCalled());
    const [url, init] = f.mock.calls[0];
    expect(url).toMatch(/\/api\/v1\/statements\/upload$/);
    expect(init.headers["X-Statement-Password"]).toBe("123");
    expect(init.headers["X-File-Name"]).toBe("fatura.pdf");
    expect(screen.getByText(/1 arquivo\(s\)/)).toBeInTheDocument();
    await waitFor(() => expect(pwd).toHaveValue(""));
  });

  it("omits password header when empty and tolerates network failure", async () => {
    const f = vi.fn().mockRejectedValue(new Error("offline"));
    vi.stubGlobal("fetch", f);
    const { container } = render(<Page />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, new File(["x"], "a.zip"));
    await userEvent.click(screen.getByRole("button", { name: /Processar Faturas/ }));
    await waitFor(() => expect(f).toHaveBeenCalled());
    expect(f.mock.calls[0][1].headers["X-Statement-Password"]).toBeUndefined();
    expect(screen.getByText(/Upload em lote enviado/)).toBeInTheDocument();
  });

  it("handles file input change with no files", () => {
    const { container } = render(<Page />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input);
    expect(input).toBeInTheDocument();
  });
});
