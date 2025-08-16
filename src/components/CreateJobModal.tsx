import { useEffect, useState } from "react";
import api from "../lib/api";

type Address = {
  id: string;
  label?: string | null;
  street: string;
  number?: string | null;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
};

type Offer = {
  id: string;
  title: string;
  unit: string;
  priceBase: number;
};

export default function CreateJobModal({
  open,
  onClose,
  offer,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  offer: Offer | null;
  onCreated?: () => void;
}) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState<string>("");
  const [datetime, setDatetime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    (async () => {
      const res = await api.get("/addresses/mine");
      const items = res.data ?? [];
      setAddresses(items);
      const def = items.find((a: Address) => a.isDefault) ?? items[0];
      setAddressId(def?.id ?? "");
    })();
  }, [open]);

  async function submit() {
    if (!offer || !addressId || !datetime) return;
    await api.post("/jobs", {
      offerId: offer.id,
      addressId,
      datetime,
      notes: notes || undefined,
    });
    onCreated?.();
  }

  if (!open || !offer) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-zinc-950 border dark:border-zinc-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Contratar: {offer.title}</div>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg border dark:border-zinc-800"
          >
            Fechar
          </button>
        </div>

        <div className="grid gap-3">
          <label className="text-sm">
            Endereço
            <select
              className="mt-1 w-full border rounded-lg p-2 dark:bg-zinc-900 dark:border-zinc-800"
              value={addressId}
              onChange={(e) => setAddressId(e.target.value)}
            >
              {addresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label
                    ? `${a.label} — `
                    : ""}
                  {a.street} {a.number ?? ""} — {a.city}/{a.state}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            Data e hora
            <input
              type="datetime-local"
              className="mt-1 w-full border rounded-lg p-2 dark:bg-zinc-900 dark:border-zinc-800"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
          </label>

          <label className="text-sm">
            Observações (opcional)
            <textarea
              className="mt-1 w-full border rounded-lg p-2 dark:bg-zinc-900 dark:border-zinc-800"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg border dark:border-zinc-800"
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
