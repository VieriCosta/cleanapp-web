import { useEffect, useState } from "react";
import { listOffers } from "@/lib/api";
import { Link } from "react-router-dom";


type Offer = { id: string; title: string; priceBase: number | string; provider?: { user?: { name?: string | null } | null } | null };

function money(v: number | string) {
  const n = Number(v ?? 0);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Home() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await listOffers({ page: 1, pageSize: 6 });
        setOffers(res.items ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 p-8">
        <h1 className="text-4xl font-bold leading-tight">
          Limpeza <span className="text-blue-600">profissional</span> na palma da sua mão
        </h1>
        <p className="mt-3 opacity-80 max-w-2xl">
          Encontre os melhores prestadores da sua região. Qualidade garantida, preços justos e avaliações reais.
        </p>
        <div className="mt-6 flex gap-3">
  <Link to="/app/offers" className="btn btn-solid">
    Encontrar Prestadores
  </Link>

  <Link to="/como-funciona" className="btn btn-outline">
    Como Funciona
  </Link>
</div>
      </section>

      {/* Tipos de serviço – placeholder estático por enquanto */}
      <section>
        <h2 className="section-title mb-4">Tipos de Serviço</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {["Residencial","Comercial","Veículos","Lavanderia","Pesada","Urgente"].map((t) => (
            <div key={t} className="card p-5 text-center">
              <div className="text-sm opacity-70">{t}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ofertas (API) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Prestadores disponíveis</h2>
          <a href="/app/offers" className="text-sm text-blue-600 hover:underline">Ver todas</a>
        </div>

        {loading && <div className="opacity-70">Carregando...</div>}

        {!loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((o) => (
              <div key={o.id} className="card p-5">
                <div className="font-medium">{o.title}</div>
                <div className="text-sm opacity-70">{o.provider?.user?.name ?? "Prestador"}</div>
                <div className="mt-3 text-right">
                  <span className="font-semibold">{money(o.priceBase)}</span>
                  <span className="text-xs opacity-70 ml-1">/hora</span>
                </div>
              </div>
            ))}
            {offers.length === 0 && <div className="opacity-70">Nenhuma oferta encontrada.</div>}
          </div>
        )}
      </section>
    </div>
  );
}
