import { useEffect, useState } from "react";
import api from "../lib/api";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { toast } from "sonner";
import { CheckCircle, Play, Square, XCircle } from "lucide-react";

type Job = {
  id: string;
  status: "pending" | "accepted" | "in_progress" | "done" | "canceled";
  paymentStatus: "hold" | "captured" | "refunded" | "failed" | "none";
  datetime: string;
  offer?: { title: string };
  customer?: { id: string; name: string };
};

export default function ProviderDashboard() {
  const [pending, setPending] = useState<Job[]>([]);
  const [mine, setMine] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const p = await api.get("/jobs", { params: { role: "provider", status: "pending" }});
      const m = await api.get("/jobs", { params: { role: "provider", status: "accepted,in_progress" }});
      setPending(p.data.items ?? []);
      setMine(m.data.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function accept(id: string) { await api.post(`/jobs/${id}/accept`); toast.success("Job aceito!"); await load(); }
  async function start(id: string)  { await api.post(`/jobs/${id}/start`);  toast.info("Job iniciado");   await load(); }
  async function finish(id: string) { await api.post(`/jobs/${id}/finish`); toast.success("Job finalizado"); await load(); }
  async function cancel(id: string) { await api.post(`/jobs/${id}/cancel`, { reason: "Cancelado via web" }); toast.warning("Job cancelado"); await load(); }

  const Item = ({ j }: { j: Job }) => (
    <div className="card p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="font-medium">{j.offer?.title ?? "Serviço"}</div>
          <div className="text-sm text-gray-500">
            {new Date(j.datetime).toLocaleString()} — {j.status} — pgto: {j.paymentStatus}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {j.status === "pending" && (
            <>
              <Button onClick={() => accept(j.id)} className="gap-1"><CheckCircle className="w-4 h-4" /> Aceitar</Button>
              <Button onClick={() => cancel(j.id)} variant="outline" className="gap-1"><XCircle className="w-4 h-4" /> Cancelar</Button>
            </>
          )}
          {j.status === "accepted" && (
            <>
              <Button onClick={() => start(j.id)} className="gap-1"><Play className="w-4 h-4" /> Iniciar</Button>
              <Button onClick={() => cancel(j.id)} variant="outline" className="gap-1"><XCircle className="w-4 h-4" /> Cancelar</Button>
            </>
          )}
          {j.status === "in_progress" && (
            <>
              <Button onClick={() => finish(j.id)} className="gap-1"><Square className="w-4 h-4" /> Finalizar</Button>
              <Button onClick={() => cancel(j.id)} variant="outline" className="gap-1"><XCircle className="w-4 h-4" /> Cancelar</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid gap-6">
      <h2 className="section-title">Prestador — Meus Jobs</h2>

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Spinner /> Carregando...
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><div className="font-medium">Pendentes</div></CardHeader>
          <CardContent className="grid gap-3">
            {!loading && pending.length === 0 && <div className="text-sm text-gray-500">Sem pendentes.</div>}
            {pending.map((j) => <Item key={j.id} j={j} />)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><div className="font-medium">Em andamento</div></CardHeader>
          <CardContent className="grid gap-3">
            {!loading && mine.length === 0 && <div className="text-sm text-gray-500">Nada em andamento.</div>}
            {mine.map((j) => <Item key={j.id} j={j} />)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
