import { useEffect, useState } from "react";
import api from "../lib/api";
import { format } from "date-fns";

type Job = {
  id: string;
  datetime: string;
  status: "pending" | "accepted" | "in_progress" | "done" | "canceled";
  priceEstimated?: number | null;
  priceFinal?: number | null;
  offer?: { title?: string | null };
  category?: { name?: string | null };
};

function money(v?: number | null) {
  if (v == null) return "-";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProviderJobs() {
  const [items, setItems] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await api.get("/jobs", {
      params: { role: "provider", order: "desc", page: 1, pageSize: 20 },
    });
    setItems(res.data.items ?? []);
  }

  useEffect(() => {
    (async () => {
      try {
        await load();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function act(id: string, action: "accept" | "start" | "finish" | "cancel") {
    if (action === "accept") await api.post(`/jobs/${id}/accept`);
    if (action === "start") await api.post(`/jobs/${id}/start`);
    if (action === "finish") await api.post(`/jobs/${id}/finish`);
    if (action === "cancel") await api.post(`/jobs/${id}/cancel`, { reason: "Indisponível" });
    await load();
  }

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Jobs (Prestador)</h1>

      <div className="grid gap-4">
        {loading && <div className="opacity-80">Carregando…</div>}

        {!loading &&
          items.map((j) => (
            <div
              key={j.id}
              className="rounded-xl border dark:border-zinc-800 p-4 flex items-center justify-between gap-4"
            >
              <div>
                <div className="font-medium">
                  {j.offer?.title ?? j.category?.name ?? "Serviço"}
                </div>
                <div className="text-sm opacity-70">
                  {format(new Date(j.datetime), "dd/MM/yyyy HH:mm")}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {j.status === "pending" && (
                  <button
                    onClick={() => act(j.id, "accept")}
                    className="px-3 py-2 rounded-lg border dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Aceitar
                  </button>
                )}
                {j.status === "accepted" && (
                  <button
                    onClick={() => act(j.id, "start")}
                    className="px-3 py-2 rounded-lg border dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Iniciar
                  </button>
                )}
                {j.status === "in_progress" && (
                  <button
                    onClick={() => act(j.id, "finish")}
                    className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    Finalizar
                  </button>
                )}
                {["pending", "accepted", "in_progress"].includes(j.status) && (
                  <button
                    onClick={() => act(j.id, "cancel")}
                    className="px-3 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Cancelar
                  </button>
                )}
              </div>

              <div className="text-right">
                <div className="text-sm">
                  {money(j.priceFinal ?? j.priceEstimated)}
                </div>
                <span className="inline-block mt-1 text-xs rounded-full px-2 py-1 bg-zinc-100 dark:bg-zinc-800">
                  {j.status}
                </span>
              </div>
            </div>
          ))}

        {!loading && items.length === 0 && <div>Nenhum job.</div>}
      </div>
    </>
  );
}
