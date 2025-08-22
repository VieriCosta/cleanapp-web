import { useEffect, useState } from "react";
import { createJob, getMyAddresses, Address } from "@/lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  offerId: string | null;           // oferta escolhida
};

export default function CreateJobModal({ open, onClose, offerId }: Props) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState<string>("");
  const [datetime, setDatetime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    (async () => {
      setErr(null);
      try {
        const res = await getMyAddresses();
        const list = Array.isArray(res) ? res : res.items ?? [];
        setAddresses(list);
        if (list.length > 0) setAddressId(list[0].id);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Falha ao carregar endereços");
      }
    })();
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!offerId) return;
    if (!addressId || !datetime) {
      setErr("Preencha endereço e data/hora.");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      await createJob({
        offerId,
        addressId,
        datetime,
        notes: notes.trim() || undefined,
      });
      onClose();
      // dica: você pode redirecionar pra /app/jobs ou /app/conversations
      // aqui não navego pra manter o modal simples
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Não foi possível criar o agendamento");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Agendar serviço</h3>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>

        {err && (
          <div className="mb-3 rounded-xl border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-3 text-red-700 dark:text-red-300">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Endereço</label>
            <select
              className="input"
              value={addressId}
              onChange={(e) => setAddressId(e.target.value)}
            >
              {addresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label ?? "Endereço"} — {a.city ?? ""}/{a.state ?? ""}
                </option>
              ))}
            </select>
            {addresses.length === 0 && (
              <div className="text-sm opacity-70 mt-1">
                Você ainda não tem endereços. Adicione em <b>Perfil &gt; Endereços</b>.
              </div>
            )}
          </div>

          <div>
            <label className="label">Data & hora</label>
            <input
              type="datetime-local"
              className="input"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Observações (opcional)</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Algum detalhe importante para o prestador?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !offerId}
              className="btn btn-solid disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Confirmar agendamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
