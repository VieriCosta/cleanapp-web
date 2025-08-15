// Converte string | number | Prisma.Decimal-like em number
export function toNumberSafe(v: any): number | null {
  if (v == null) return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;

  if (typeof v === "string") {
    const n = Number(v.replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  if (typeof v?.toNumber === "function") {
    const n = v.toNumber();
    return Number.isFinite(n) ? n : null;
  }

  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function formatBRL(v: any): string {
  const n = toNumberSafe(v);
  if (n == null) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
