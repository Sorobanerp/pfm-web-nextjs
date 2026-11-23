export const PULSE_COLORS = {
  canvas: "#F7F9F5",
  surface: "#FFFFFF",
  border: "#E6ECE2",
  primary: "#8CBA51",
  lime: "#DEFF8B",
  ink: "#141D14",
  muted: "#5A6B5A",
  peach: "#FBCEB5",
  peachText: "#3D1E10",
  coral: "#FF5D6C",
} as const;

export function formatBRL(value: number | string): string {
  const numeric = typeof value === "string" ? Number.parseFloat(value) : value;
  const safe = Number.isFinite(numeric) ? numeric : 0;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
}
