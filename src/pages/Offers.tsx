import { useEffect, useState } from "react";
import api from "../lib/api";
import { formatBRL } from "../lib/format";

type Offer = {
  id: string;
  title: string;
  priceBase: any;
  provider?: { user?: { name?: string } };
};

export default function OffersPage() {
  const [items, setItems] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/offers", {
          params: { active: true, pageSize: 20, order: "desc" },
        });
        setItems(Array.isArray(res.data?.items) ? res.data.items : []);
      } catch (e: any) {
        setErr(e?.response?.data?.error?.message ?? "Falha ao carregar.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Carregando…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((o) => (
        <div key={o.id} className="rounded-xl border p-4">
          <div className="font-medium">{o.title}</div>
          <div className="text-sm opacity-70">
            {o.provider?.user?.name ?? "Prestador"}
          </div>
          <div className="mt-2 text-right">
            <span className="font-semibold">{formatBRL(o.priceBase)}</span>
            <span className="text-xs opacity-70 ml-1">/hora</span>
          </div>
        </div>
      ))}
      {items.length === 0 && <div>Nenhuma oferta.</div>}
    </div>
  );
}
