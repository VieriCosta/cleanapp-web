// src/components/AddressFormModal.tsx
import { useState } from "react";
import { NewAddress } from "@/lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewAddress) => Promise<void> | void;
};

export default function AddressFormModal({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<NewAddress>({
    label: "",
    street: "",
    number: "",
    district: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message || "Erro ao salvar endereço");
    } finally {
      setLoading(false);
    }
  }

  const set = (k: keyof NewAddress) => (e: any) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl card">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-lg font-semibold">Novo endereço</h3>
          <button className="btn btn-ghost" onClick={onClose}>Fechar</button>
        </div>
        <div className="card-body">
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div className="sm:col-span-2">
              <label className="label">Identificação (opcional)</label>
              <input className="input mt-1" value={form.label || ""} onChange={set("label")} placeholder="Casa, Trabalho..." />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Rua</label>
              <input className="input mt-1" value={form.street} onChange={set("street")} required />
            </div>

            <div>
              <label className="label">Número</label>
              <input className="input mt-1" value={form.number || ""} onChange={set("number")} />
            </div>

            <div>
              <label className="label">Bairro</label>
              <input className="input mt-1" value={form.district || ""} onChange={set("district")} />
            </div>

            <div>
              <label className="label">Cidade</label>
              <input className="input mt-1" value={form.city} onChange={set("city")} required />
            </div>

            <div>
              <label className="label">UF</label>
              <input className="input mt-1" value={form.state} onChange={set("state")} required />
            </div>

            <div>
              <label className="label">CEP</label>
              <input className="input mt-1" value={form.zip} onChange={set("zip")} required />
            </div>

            <div>
              <label className="label">Latitude (opcional)</label>
              <input className="input mt-1" value={form.lat ?? ""} onChange={set("lat")} placeholder="-23.5" />
            </div>

            <div>
              <label className="label">Longitude (opcional)</label>
              <input className="input mt-1" value={form.lng ?? ""} onChange={set("lng")} placeholder="-46.6" />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 mt-2">
              <input id="isDefault" type="checkbox" checked={!!form.isDefault} onChange={set("isDefault")} />
              <label htmlFor="isDefault" className="label">Marcar como padrão</label>
            </div>

            {err && <div className="sm:col-span-2 text-red-600 text-sm">{err}</div>}

            <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-solid" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
