// src/pages/Offers.tsx
import { useEffect, useState } from "react";
import { listOffers, Offer } from "@/lib/api";

function formatBRL(v: any) {
  const n = typeof v === "string" ? Number(v) : v;
  return (n ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function OffersPage() {
  const [items, setItems] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await listOffers({ page: 1, pageSize: 9 });
        setItems(res.items);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="container py-10">
        <div className="card">
          <div className="card-body">Carregando ofertas…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="section-title mb-6">Ofertas</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((o) => (
          <div key={o.id} className="card">
            <div className="card-body">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700" />
                <div>
                  <div className="font-medium">{o.provider?.user?.name ?? "Prestador"}</div>
                  <div className="text-xs opacity-70">{o.category?.name ?? "Serviço"}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="font-semibold">{o.title}</div>
                {o.description && (
                  <div className="text-sm opacity-80 mt-1 line-clamp-2">{o.description}</div>
                )}
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div className="text-right">
                  <div className="text-lg font-bold">{formatBRL(o.priceBase)}</div>
                  {o.unit && <div className="text-xs opacity-70">/ {o.unit}</div>}
                </div>
                {/* Botão “contratar” pode abrir modal de criar job se você já tiver */}
                <button className="btn btn-solid">Contratar</button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3">
            <div className="card">
              <div className="card-body">Nenhuma oferta disponível.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
