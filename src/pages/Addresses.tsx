// src/pages/Addresses.tsx
import { useEffect, useState } from "react";
import { getMyAddresses, createAddress, setDefaultAddress, deleteAddress, Address, NewAddress } from "@/lib/api";
import AddressFormModal from "@/components/AddressFormModal";

export default function AddressesPage() {
  const [items, setItems] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const data = await getMyAddresses();
      const list = Array.isArray(data) ? data : (data.items ?? []);
      setItems(list);
    } catch (e: any) {
      setErr("Falha ao carregar endereços");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onCreate(data: NewAddress) {
    await createAddress({
      ...data,
      lat: data.lat != null && data.lat !== "" ? Number(data.lat) : undefined,
      lng: data.lng != null && data.lng !== "" ? Number(data.lng) : undefined,
    });
    await load();
  }

  async function onSetDefault(id: string) {
    await setDefaultAddress(id);
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm("Tem certeza que deseja remover este endereço?")) return;
    await deleteAddress(id);
    await load();
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Meus Endereços</h1>
        <button className="btn btn-solid" onClick={() => setOpen(true)}>Novo endereço</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <div className="card p-5">Carregando...</div>}
        {err && <div className="text-red-600">{err}</div>}
        {!loading && !items.length && <div className="text-sm opacity-70">Nenhum endereço cadastrado.</div>}

        {items.map((a) => (
          <div key={a.id} className="card">
            <div className="card-body space-y-1">
              <div className="font-medium">{a.label || "Endereço"}</div>
              <div className="text-sm opacity-80">
                {a.street} {a.number ? `, ${a.number}` : ""}{a.district ? ` - ${a.district}` : ""}
              </div>
              <div className="text-sm opacity-80">{a.city} - {a.state} • {a.zip}</div>

              <div className="flex justify-end gap-2 pt-3">
                <button className="btn btn-outline" onClick={() => onSetDefault(a.id)}>Tornar padrão</button>
                <button className="btn btn-ghost" onClick={() => onDelete(a.id)}>Excluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddressFormModal open={open} onClose={() => setOpen(false)} onSubmit={onCreate} />
    </div>
  );
}
