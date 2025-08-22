import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateJobModal from "@/components/CreateJobModal";
import { useAuth } from "@/store/auth";
import api from "@/lib/api";

type ProviderPublic = {
  id: string;
  bio?: string | null;
  verified?: boolean | null;
  scoreAvg?: number | null;
  totalReviews?: number | null;
  radiusKm?: number | null;
  user: { id: string; name: string; photoUrl?: string | null };
  offers: { id: string; title: string; priceBase: number | string; unit: string }[];
};

export default function ProviderPublicProfile() {
  const { id } = useParams(); // providerProfileId
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState<ProviderPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [offerId, setOfferId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const res = await api.get(`/public/providers/${id}`);
        setData(res.data);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Falha ao carregar prestador");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function handleAgendar(ofId: string) {
    if (!user) {
      // se não logado, manda pro login com redirect de volta
      navigate(`/login?next=/providers/${id}`);
      return;
    }
    setOfferId(ofId);
    setOpen(true);
  }

  if (loading) return <div className="container py-10">Carregando…</div>;
  if (err) return <div className="container py-10 text-red-600">{err}</div>;
  if (!data) return null;

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          {data.user.photoUrl ? (
            <img src={data.user.photoUrl} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div>
          <div className="text-xl font-semibold">{data.user.name}</div>
          <div className="text-sm opacity-70">
            {data.verified ? "Verificado • " : ""} {data.scoreAvg ?? "—"} ★ ({data.totalReviews ?? 0})
          </div>
        </div>
      </div>

      {data.bio && (
        <p className="opacity-80 mb-6">{data.bio}</p>
      )}

      <h3 className="section-title mb-4">Ofertas deste prestador</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.offers.map((o) => (
          <div
            key={o.id}
            className="card"
          >
            <div className="card-body">
              <div className="font-medium mb-1">{o.title}</div>
              <div className="text-sm opacity-70 mb-3">
                R$ {Number(o.priceBase).toFixed(2)} / {o.unit}
              </div>
              <div className="flex justify-end">
                <button
                  className="btn btn-solid"
                  onClick={() => handleAgendar(o.id)}
                >
                  Agendar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de agendamento */}
      <CreateJobModal
        open={open}
        onClose={() => setOpen(false)}
        offerId={offerId}
      />
    </div>
  );
}
