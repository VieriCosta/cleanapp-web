import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import api from "@/lib/api";
import { Link } from "react-router-dom";
import { format } from "date-fns";

type JobStatus = "pending" | "accepted" | "in_progress" | "done" | "canceled";

type JobItem = {
  id: string;
  status: JobStatus;
  datetime: string;
  offer?: { title?: string | null } | null;
  category?: { name?: string | null } | null;
  priceEstimated?: number | string | null;
  priceFinal?: number | string | null;
};

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

export default function ProfilePage() {
  const { user } = useAuth();

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const isProvider = user?.role === "provider";

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingJobs(true);
      try {
        const params = {
          role: isProvider ? "provider" : "customer",
          order: "desc",
          page: 1,
          pageSize: 5,
        };
        const { data } = await api.get("/jobs", { params });
        if (mounted) setJobs(data.items || []);
      } catch {
        if (mounted) setJobs([]);
      } finally {
        if (mounted) setLoadingJobs(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isProvider]);

  return (
    <div className="container py-8">
      {/* Cabeçalho Perfil */}
      <div className="flex items-center gap-4">
        <img
          src={user?.photoUrl || "/avatar-fallback.png"}
          className="h-16 w-16 rounded-full object-cover ring-1 ring-gray-300 dark:ring-gray-700"
        />
        <div>
          <h1 className="text-2xl font-semibold">{user?.name || "Meu Perfil"}</h1>
          <div className="opacity-70 text-sm">
            {user?.email} • {isProvider ? "Prestador" : user?.role === "admin" ? "Admin" : "Cliente"}
          </div>
        </div>
      </div>

      {/* Grid de cartões do perfil */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* Dados básicos */}
        <div className="md:col-span-2 card">
          <div className="card-header">
            <div className="section-title">Dados da Conta</div>
          </div>
          <div className="card-body">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="label">Nome</div>
                <div>{user?.name ?? "-"}</div>
              </div>
              <div>
                <div className="label">E-mail</div>
                <div>{user?.email ?? "-"}</div>
              </div>
              <div>
                <div className="label">Telefone</div>
                <div>{user?.phone ?? "-"}</div>
              </div>
              <div>
                <div className="label">Papel</div>
                <div>{isProvider ? "Prestador" : user?.role === "admin" ? "Admin" : "Cliente"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Meus Jobs (AGORA DENTRO DO PERFIL) */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <div className="section-title">Meus Jobs</div>
            <Link
              to={isProvider ? "/app/provider" : "/app/jobs"}
              className="text-sm hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="card-body">
            {loadingJobs ? (
              <div>Carregando…</div>
            ) : jobs.length === 0 ? (
              <div className="opacity-70 text-sm">Você ainda não possui jobs.</div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {jobs.map((j) => {
                  const when = j.datetime ? new Date(j.datetime) : null;
                  const price =
                    j.status === "done" && j.priceFinal != null
                      ? j.priceFinal
                      : j.priceEstimated;
                  return (
                    <li key={j.id} className="py-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">
                          {j.offer?.title ?? j.category?.name ?? "Serviço"}
                        </div>
                        <div className="text-xs opacity-70">
                          {when ? format(when, "dd/MM/yyyy HH:mm") : "-"}
                        </div>
                        <div className="text-sm mt-0.5">{money(price)}</div>
                      </div>
                      <span
                        className={`h-fit px-2 py-0.5 rounded text-xs ${STATUS_CLASS[j.status]}`}
                        title={STATUS_LABEL[j.status]}
                      >
                        {STATUS_LABEL[j.status]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
