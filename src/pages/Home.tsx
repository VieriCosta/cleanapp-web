import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { formatBRL } from "../lib/format";

type Category = { id: string; name: string; slug?: string };
type Offer = {
  id: string;
  title: string;
  priceBase: any; // string/Decimal/number
  provider?: { user?: { name?: string; photoUrl?: string } };
};

function humanizeSlug(slug?: string, fallback?: string) {
  if (slug && typeof slug === "string") return slug.replace(/-/g, " ");
  return fallback ?? "categoria";
}

export default function Home() {
  const [cats, setCats] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const catsRes = await api.get("/categories");
        const rawCats = Array.isArray(catsRes.data?.items)
          ? catsRes.data.items
          : Array.isArray(catsRes.data)
          ? catsRes.data
          : [];
        const catItems: Category[] = rawCats.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug ?? "",
        }));
        const catsTop = catItems.slice(0, 6);

        const offRes = await api.get("/offers", {
          params: { active: true, pageSize: 6, order: "desc" },
        });
        const offItems: Offer[] = Array.isArray(offRes.data?.items)
          ? offRes.data.items
          : [];

        if (!mounted) return;
        setCats(catsTop);
        setOffers(offItems);
      } catch (e: any) {
        console.error(e);
        if (!mounted) return;
        setErr(e?.response?.data?.error?.message || "Falha ao carregar dados.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const serviceBoxes = useMemo(() => {
    if (cats.length === 0) return null;
    return (
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {cats.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border p-4 bg-white/60 dark:bg-zinc-900/50"
          >
            <div className="text-sm font-medium">{c.name}</div>
            <div className="text-xs opacity-70">
              {humanizeSlug(c.slug, c.name)}
            </div>
          </div>
        ))}
      </div>
    );
  }, [cats]);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-5xl font-bold">
        Limpeza <span className="text-blue-600">profissional</span> na sua mão
      </h1>

      {loading && <div className="mt-8">Carregando…</div>}
      {err && (
        <div className="mt-8 rounded-xl border border-red-400 bg-red-50 p-4">
          {err}
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Tipos de Serviço</h2>
        {serviceBoxes}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Ofertas em destaque</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((o) => (
            <div
              key={o.id}
              className="rounded-2xl border p-5 bg-white/70 dark:bg-zinc-900/60"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-full bg-zinc-200" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">
                    {o.provider?.user?.name ?? "Prestador"}
                  </div>
                  <div className="text-xs opacity-70 truncate">
                    {o.title ?? "Serviço de limpeza"}
                  </div>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm opacity-70">a partir de</span>
                <div className="text-right">
                  <span className="font-semibold">{formatBRL(o.priceBase)}</span>
                  <span className="text-xs opacity-70 ml-1">/hora</span>
                </div>
              </div>
              <button className="mt-4 w-full rounded-xl bg-blue-600 text-white py-2.5">
                Ver perfil
              </button>
            </div>
          ))}
          {offers.length === 0 && !loading && (
            <div className="text-sm opacity-70">
              Nenhuma oferta encontrada no momento.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
