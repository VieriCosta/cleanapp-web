import { useEffect, useState } from "react";
import api from "../lib/api";
import { formatBRL } from "../lib/format";

type Job = {
  id: string;
  status: string;
  datetime: string;
  priceEstimated: any;
  priceFinal?: any;
  offer?: { title?: string };
  provider?: { name?: string };
};

export default function CustomerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/jobs", {
          params: { role: "customer", pageSize: 20, order: "desc" },
        });
        setJobs(Array.isArray(res.data?.items) ? res.data.items : []);
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
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      {jobs.map((j) => (
        <div key={j.id} className="rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{j.offer?.title ?? "Serviço"}</div>
              <div className="text-xs opacity-70">{j.provider?.name ?? "Prestador"}</div>
            </div>
            <div className="text-sm">
              Estimado: <strong>{formatBRL(j.priceEstimated)}</strong>
              {j.priceFinal && (
                <> • Final: <strong>{formatBRL(j.priceFinal)}</strong></>
              )}
            </div>
          </div>
          <div className="text-xs mt-2 opacity-70">Status: {j.status}</div>
        </div>
      ))}
      {jobs.length === 0 && <div>Nenhum agendamento ainda.</div>}
    </div>
  );
}
