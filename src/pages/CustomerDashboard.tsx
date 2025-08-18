import { useEffect, useMemo, useState } from "react";
import { listCustomerJobs } from "@/lib/api";

type Job = {
  id: string;
  status:
    | "pending"
    | "accepted"
    | "in_progress"
    | "done"
    | "canceled"
    | string;
  datetime: string | Date;
};

export default function CustomerDashboard() {
  const [items, setItems] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await listCustomerJobs({ pageSize: 50 });
      const list: Job[] = data?.items ?? [];
      setItems(list);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const c = {
      pending: 0,
      accepted: 0,
      in_progress: 0,
      done: 0,
      canceled: 0,
    };
    for (const j of items) {
      const k = j.status as keyof typeof c;
      if (k in c) c[k] += 1;
    }
    return c;
  }, [items]);

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Visão Geral</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <CardStat label="Pendentes" value={counts.pending} />
        <CardStat label="Aceitos" value={counts.accepted} />
        <CardStat label="Em andamento" value={counts.in_progress} />
        <CardStat label="Concluídos" value={counts.done} />
        <CardStat label="Cancelados" value={counts.canceled} />
      </div>

      <div className="card">
        <div className="card-header">
          <div className="section-title">Últimos jobs</div>
        </div>
        <div className="card-body">
          {loading && <div>Carregando…</div>}
          {!loading && items.length === 0 && (
            <div className="opacity-70">Você ainda não possui jobs.</div>
          )}
          {!loading &&
            items.slice(0, 8).map((j) => (
              <div
                key={j.id}
                className="flex items-center justify-between border-b last:border-none py-3"
              >
                <div className="text-sm">
                  <div className="font-medium">{j.id.slice(0, 8)}</div>
                  <div className="opacity-70">
                    {new Date(j.datetime).toLocaleString()}
                  </div>
                </div>
                <span className="text-xs rounded-lg px-2 py-1 border">
                  {j.status}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function CardStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border p-4 bg-white dark:bg-gray-800">
      <div className="text-sm opacity-70">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
