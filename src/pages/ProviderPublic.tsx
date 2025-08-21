import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProviderPublic } from "@/lib/api";

function moneyBRL(v: any) {
  const n = Number(v ?? 0);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProviderPublic() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [prov, setProv] = useState<Awaited<ReturnType<typeof getProviderPublic>> | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getProviderPublic(id);
        setProv(data);
      } catch (e: any) {
        setErr(e?.response?.data?.code || "Falha ao carregar prestador");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Carregando…</div>;
  if (err) return <div className="text-red-600">{err}</div>;
  if (!prov) return <div>Prestador não encontrado.</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
      {/* Lateral */}
      <aside className="card p-5 h-fit">
        <div className="flex flex-col items-center text-center">
          <img
            src={prov.user.photoUrl ?? "/avatar-fallback.png"}
            className="h-24 w-24 rounded-full object-cover mb-3"
          />
          <h1 className="text-xl font-semibold">{prov.user.name ?? "Prestador"}</h1>
          {prov.verified && (
            <div className="mt-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
              Verificado
            </div>
          )}
          <div className="mt-2 text-sm opacity-70">
            {prov.location?.city && prov.location?.state
              ? `${prov.location.city} - ${prov.location.state}`
              : "Localidade não informada"}
          </div>
          <div className="mt-2 text-sm">
            ⭐ {Number(prov.scoreAvg ?? 0).toFixed(1)} · {prov.totalReviews ?? 0} avaliações
          </div>

          <div className="mt-4 w-full flex gap-2">
            <Link
              to="/login"
              className="btn btn-solid flex-1"
              title="Entre para contratar"
            >
              Contratar
            </Link>
            <button
              onClick={() => nav(-1)}
              className="btn btn-outline flex-1"
              title="Voltar"
            >
              Voltar
            </button>
          </div>
        </div>

        {prov.bio && (
          <div className="mt-6">
            <div className="section-title mb-2">Sobre</div>
            <p className="text-sm opacity-80 whitespace-pre-line">{prov.bio}</p>
          </div>
        )}
      </aside>

      {/* Conteúdo */}
      <section className="space-y-6">
        <div className="card p-5">
          <div className="section-title mb-3">Serviços oferecidos ({prov.offersCount})</div>
          {prov.offers.length === 0 && (
            <div className="opacity-70 text-sm">Este prestador ainda não cadastrou serviços.</div>
          )}

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {prov.offers.map((o) => (
              <div key={o.id} className="border rounded-xl p-4">
                <div className="text-xs opacity-70">
                  {o.category?.name ?? "Categoria"}
                </div>
                <div className="font-medium">{o.title}</div>
                <div className="text-sm opacity-80 line-clamp-2 mt-1">{o.description || "—"}</div>
                <div className="mt-2 text-right">
                  <span className="font-semibold">{moneyBRL(o.priceBase)}</span>
                  <span className="text-xs opacity-70 ml-1">/ {o.unit}</span>
                </div>
                <div className="mt-3">
                  <Link to="/login" className="btn btn-outline w-full">
                    Pedir orçamento
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
