import { useEffect, useMemo, useState } from "react";
import api, { listCustomerJobs } from "@/lib/api";
import { format } from "date-fns";

type JobStatus = "pending" | "accepted" | "in_progress" | "done" | "canceled";

type JobItem = {
  id: string;
  status: JobStatus;
  datetime: string;
  notes?: string | null;
  priceEstimated?: number | string | null;
  priceFinal?: number | string | null;
  paymentStatus?: string | null;
  address?: {
    label?: string | null;
    street?: string | null;
    city?: string | null;
    state?: string | null;
  } | null;
  category?: { name: string } | null;
  offer?: { title: string } | null;
  provider?: { id: string; name?: string | null } | null;
};

type Paged<T> = {
  total: number;
  page: number;
  pageSize: number;
  items: T[];
};

const ALL_STATUSES: JobStatus[] = [
  "pending",
  "accepted",
  "in_progress",
  "done",
  "canceled",
];

const STATUS_LABEL: Record<JobStatus, string> = {
  pending: "Pendente",
  accepted: "Aceito",
  in_progress: "Em execução",
  done: "Concluído",
  canceled: "Cancelado",
};

const STATUS_CLASS: Record<JobStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 border border-yellow-200/60 dark:border-yellow-800",
  accepted:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-200/60 dark:border-blue-800",
  in_progress:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 border border-indigo-200/60 dark:border-indigo-800",
  done:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-800",
  canceled:
    "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200 border border-rose-200/60 dark:border-rose-800",
};

function money(v: any) {
  if (v == null) return "-";
  const n = typeof v === "string" ? Number(v) : v;
  return (n ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CustomerJobs() {
  // filtros
  const [selected, setSelected] = useState<JobStatus[]>(["pending", "accepted", "in_progress"]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // paginação
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // dados
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Paged<JobItem>>({ total: 0, page: 1, pageSize, items: [] });
  const [error, setError] = useState<string | null>(null);

  const statusParam = useMemo(
    () => (selected.length ? selected.join(",") : undefined),
    [selected]
  );

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await listCustomerJobs({
        status: statusParam,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        order: "desc",
        page,
        pageSize,
      });
      // API retorna { total, page, pageSize, items }
      setData(res);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || "Falha ao carregar jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // sempre que filtros/página mudarem, recarrega
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusParam, dateFrom, dateTo, page]);

  function toggleStatus(s: JobStatus) {
    setPage(1);
    setSelected((curr) =>
      curr.includes(s) ? curr.filter((x) => x !== s) : [...curr, s]
    );
  }

  async function cancelJob(id: string) {
    const reason = prompt("Motivo do cancelamento (opcional):") || undefined;
    if (!confirm("Confirma cancelar este job?")) return;
    try {
      await api.post(`/jobs/${id}/cancel`, { reason });
      await load();
      alert("Job cancelado.");
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Falha ao cancelar.");
    }
  }

  function canCancel(s: JobStatus) {
    return s === "pending" || s === "accepted" || s === "in_progress";
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-2">Meus Jobs</h1>
      <p className="opacity-70 mb-6">
        Acompanhe seus pedidos, filtre por status e período.
      </p>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map((s) => {
              const active = selected.includes(s);
              return (
                <button
                  key={s}
                  className={`px-3 py-1 rounded-full border text-sm transition ${
                    active
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => toggleStatus(s)}
                >
                  {STATUS_LABEL[s]}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            <div>
              <label className="label">De</label>
              <input
                type="date"
                className="input"
                value={dateFrom}
                onChange={(e) => {
                  setPage(1);
                  setDateFrom(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="label">Até</label>
              <input
                type="date"
                className="input"
                value={dateTo}
                onChange={(e) => {
                  setPage(1);
                  setDateTo(e.target.value);
                }}
              />
            </div>
            <div className="flex items-end">
              <button
                className="btn btn-outline"
                onClick={() => {
                  setSelected(["pending", "accepted", "in_progress"]);
                  setDateFrom("");
                  setDateTo("");
                  setPage(1);
                }}
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      {loading ? (
        <div className="card">
          <div className="card-body">Carregando…</div>
        </div>
      ) : error ? (
        <div className="card">
          <div className="card-body text-rose-600 dark:text-rose-400">
            {error}
          </div>
        </div>
      ) : data.items.length === 0 ? (
        <div className="card">
          <div className="card-body">Nenhum job encontrado para os filtros.</div>
        </div>
      ) : (
        <div className="grid gap-4">
          {data.items.map((j) => {
            const when = j.datetime ? new Date(j.datetime) : null;
            const price =
              j.status === "done" && j.priceFinal != null
                ? j.priceFinal
                : j.priceEstimated;

            return (
              <div key={j.id} className="card">
                <div className="card-body">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${STATUS_CLASS[j.status]}`}>
                          {STATUS_LABEL[j.status]}
                        </span>
                        {j.category?.name && (
                          <span className="text-xs opacity-70">• {j.category.name}</span>
                        )}
                      </div>

                      <div className="mt-1 font-semibold">
                        {j.offer?.title ?? "Serviço"}
                      </div>

                      <div className="text-sm opacity-80">
                        {when ? format(when, "dd/MM/yyyy HH:mm") : "-"}
                        {j.address?.city && (
                          <> • {j.address.city}{j.address.state ? `/${j.address.state}` : ""}</>
                        )}
                      </div>

                      {j.notes && (
                        <div className="text-sm opacity-80 mt-1 line-clamp-2">
                          {j.notes}
                        </div>
                      )}
                    </div>

                    <div className="text-right min-w-[160px]">
                      <div className="text-lg font-bold">{money(price)}</div>
                      {j.paymentStatus && (
                        <div className="text-xs opacity-70 mt-0.5">
                          pagamento: {j.paymentStatus}
                        </div>
                      )}
                      <div className="text-xs opacity-70">
                        prestador: {j.provider?.name ?? "-"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 justify-end">
                    {canCancel(j.status) && (
                      <button className="btn btn-outline" onClick={() => cancelJob(j.id)}>
                        Cancelar
                      </button>
                    )}
                    {/* Se quiser, adicione botões de ver conversa, avaliar etc. */}
                  </div>
                </div>
              </div>
            );
          })}

          {/* paginação */}
          <div className="flex items-center justify-between mt-2">
            <div className="text-sm opacity-70">
              Página {data.page} de {totalPages} • {data.total} registros
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Anterior
              </button>
              <button
                className="btn btn-solid"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
