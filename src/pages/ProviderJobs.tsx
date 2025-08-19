import { useEffect, useMemo, useState } from "react";
import {
  listProviderJobs,
  acceptJob,
  startJob,
  finishJob,
  cancelJob,
  type Job,
  type JobStatus,
} from "@/lib/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type TabKey = "pending" | "accepted" | "started" | "done" | "canceled" | "all";

const TABS: { key: TabKey; label: string }[] = [
  { key: "pending", label: "Pendentes" },
  { key: "accepted", label: "Aceitos" },
  { key: "started", label: "Em andamento" },
  { key: "done", label: "Concluídos" },
  { key: "canceled", label: "Cancelados" },
  { key: "all", label: "Todos" },
];

function money(v: any) {
  if (v == null) return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProviderJobs() {
  const [tab, setTab] = useState<TabKey>("pending");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ total: number; page: number; pageSize: number; items: Job[] }>({
    total: 0,
    page: 1,
    pageSize: 10,
    items: [],
  });
  const [error, setError] = useState<string | null>(null);

  async function fetchJobs() {
    try {
      setLoading(true);
      setError(null);
      const resp = await listProviderJobs({
        page,
        pageSize: 10,
        status: tab === "all" ? "all" : (tab as JobStatus),
      });
      setData(resp);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Falha ao carregar jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPage(1); // ao trocar tab, resetar para 1
  }, [tab]);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, page]);

  async function handleAction(job: Job, action: "accept" | "start" | "finish" | "cancel") {
    try {
      setLoading(true);
      if (action === "accept") await acceptJob(job.id);
      if (action === "start") await startJob(job.id);
      if (action === "finish") await finishJob(job.id);
      if (action === "cancel") await cancelJob(job.id);
      await fetchJobs();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Não foi possível executar a ação");
    } finally {
      setLoading(false);
    }
  }

  const totalPages = useMemo(() => {
    if (!data?.pageSize) return 1;
    return Math.max(1, Math.ceil((data?.total || 0) / data.pageSize));
  }, [data]);

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Meus Serviços (Prestador)</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={
              "btn " +
              (tab === t.key
                ? "btn-solid"
                : "btn-outline")
            }
            onClick={() => setTab(t.key)}
            disabled={loading}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {loading && (
          <div className="card p-5">Carregando...</div>
        )}

        {!loading && error && (
          <div className="card p-5 text-red-600">{error}</div>
        )}

        {!loading && !error && data.items.length === 0 && (
          <div className="card p-5 opacity-70">Nenhum serviço encontrado.</div>
        )}

        {!loading &&
          !error &&
          data.items.map((job) => (
            <div key={job.id} className="card">
              <div className="card-body">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-medium">
                      {job.offer?.title || job.category?.name || "Serviço"}
                    </div>
                    <div className="text-sm opacity-70">
                      Cliente: {job.customer?.name ?? "—"}
                    </div>
                    <div className="text-sm opacity-70">
                      Endereço: {job.address?.label ?? job.address?.city ?? "—"}
                      {job.address?.state ? ` - ${job.address.state}` : ""}
                    </div>
                    <div className="text-sm opacity-70">
                      Data:{" "}
                      {job.datetime
                        ? format(new Date(job.datetime), "dd/MM/yyyy HH:mm", { locale: ptBR })
                        : "—"}
                    </div>
                    <div className="text-sm opacity-70">
                      Previsto: {money(job.priceEstimated)}{" "}
                      {job.priceFinal ? ` • Final: ${money(job.priceFinal)}` : ""}
                    </div>
                    <div className="mt-1 inline-flex items-center gap-2 text-xs">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-700">
                        Status: {job.status}
                      </span>
                      {job.paymentStatus && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-700">
                          Pagamento: {job.paymentStatus}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {/* Regras de ação conforme status */}
                    {job.status === "pending" && (
                      <>
                        <button
                          className="btn btn-solid"
                          onClick={() => handleAction(job, "accept")}
                          disabled={loading}
                        >
                          Aceitar
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={() => handleAction(job, "cancel")}
                          disabled={loading}
                        >
                          Recusar
                        </button>
                      </>
                    )}

                    {job.status === "accepted" && (
                      <>
                        <button
                          className="btn btn-solid"
                          onClick={() => handleAction(job, "start")}
                          disabled={loading}
                        >
                          Iniciar
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={() => handleAction(job, "cancel")}
                          disabled={loading}
                        >
                          Cancelar
                        </button>
                      </>
                    )}

                    {job.status === "started" && (
                      <>
                        <button
                          className="btn btn-solid"
                          onClick={() => handleAction(job, "finish")}
                          disabled={loading}
                        >
                          Finalizar
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={() => handleAction(job, "cancel")}
                          disabled={loading}
                        >
                          Cancelar
                        </button>
                      </>
                    )}

                    {(job.status === "done" || job.status === "canceled") && (
                      <button
                        className="btn btn-outline"
                        onClick={() => navigator.clipboard.writeText(job.id)}
                        title="Copiar ID do job"
                      >
                        Copiar ID
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Paginação */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            className="btn btn-outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
          >
            Anterior
          </button>
          <div className="text-sm opacity-70">
            Página {page} de {totalPages}
          </div>
          <button
            className="btn btn-outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
