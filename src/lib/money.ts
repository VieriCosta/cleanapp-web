export function formatBRL(v: number | string | null | undefined) {
  if (v == null) return "R$ 0,00";
  const n = typeof v === "string" ? Number(v) : v;
  if (Number.isNaN(n)) return "R$ 0,00";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
