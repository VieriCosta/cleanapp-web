// src/pages/Providers.tsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listPublicProviders, ProviderPublic } from "@/lib/api";
import { formatBRL } from "@/lib/money"; // se não tiver, substitua por Intl.NumberFormat

export default function ProvidersPage() {
  const [sp, setSp] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<{
    total: number;
    page: number;
    pageSize: number;
    items: ProviderPublic[];
  }>({ total: 0, page: 1, pageSize: 12, items: [] });

  const q = sp.get("q") ?? "";
  const page = Number(sp.get("page") ?? "1");

  async function fetchList() {
    try {
      setLoading(true);
      setErr(null);
      const resp = await listPublicProviders({ q, page, pageSize: 12 });
      setData(resp);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Falha ao listar prestadores");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, page]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const text = (form.get("q") as string) || "";
    const next = new URLSearchParams(sp);
    next.set("q", text);
    next.set("page", "1");
    setSp(next, { replace: true });
  }

  function nextPage(delta: number) {
    const next = new URLSearchParams(sp);
    next.set("page", String(Math.max(1, page + delta)));
    setSp(next, { replace: true });
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Prestadores</h1>

      <form onSubmit={onSubmit} className="mb-6 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome…"
          className="input"
          style={{ maxWidth: 420 }}
        />
        <button className="btn btn-solid" type="submit">Buscar</button>
      </form>

      {err && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700 mb-6">
          {err}
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl border bg-white dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                    {p.user.photoUrl ? (
                      <img src={p.user.photoUrl} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {p.user.name}
                      {p.verified ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          verificado
                        </span>
                      ) : null}
                    </div>
                    <div className="text-xs opacity-70">
                      {p.scoreAvg ? `${p.scoreAvg.toFixed(1)}★` : "Sem nota"}{" "}
                      {p.totalReviews ? `(${p.totalReviews})` : ""}
                    </div>
                  </div>
                </div>

                {p.bio && (
                  <p className="text-sm opacity-80 mt-2 line-clamp-2">{p.bio}</p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {p.offers.map((o) => (
                    <span
                      key={o.id}
                      className="text-xs rounded-full border px-2 py-1"
                      title={o.title}
                    >
                      {o.title} • {formatBRL(Number(o.priceBase))}/{o.unit}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex justify-between">
                  <Link
                    to={`/providers/${p.id}`}
                    className="btn btn-solid"
                  >
                    Ver perfil
                  </Link>
                  <Link
                    to={`/providers/${p.id}`}
                    className="btn btn-outline"
                  >
                    Detalhes
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {data.items.length === 0 && (
            <div className="opacity-70">Nenhum prestador encontrado.</div>
          )}

          {data.total > data.pageSize && (
            <div className="mt-6 flex items-center gap-3">
              <button
                className="btn btn-outline"
                disabled={page <= 1}
                onClick={() => nextPage(-1)}
              >
                ← Anterior
              </button>
              <div className="text-sm opacity-70">
                Página {data.page} • {data.total} resultados
              </div>
              <button
                className="btn btn-outline"
                disabled={page * data.pageSize >= data.total}
                onClick={() => nextPage(1)}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
