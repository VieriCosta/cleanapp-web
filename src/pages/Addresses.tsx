import { useEffect, useMemo, useState } from "react";
import {
  getMyAddresses,
  createAddress,
  setDefaultAddress,
  deleteAddress,
  type Address,
} from "@/lib/api";

type FormState = {
  label?: string;
  street: string;
  number?: string;
  district?: string;
  city: string;
  state: string;
  zip: string;
};

const emptyForm: FormState = {
  label: "",
  street: "",
  number: "",
  district: "",
  city: "",
  state: "",
  zip: "",
};

export default function AddressesPage() {
  const [items, setItems] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const data = await getMyAddresses();
      // alguns backends retornam { total, items }, outros retornam direto array
      const list = Array.isArray(data) ? data : data?.items ?? [];
      setItems(list);
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.error?.message ?? "Falha ao carregar endereços");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const defaultId = useMemo(
    () => items.find((a) => (a as any).isDefault)?.id,
    [items]
  );

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createAddress({
        ...form,
        isDefault: items.length === 0, // primeiro vira default
      });
      setForm(emptyForm);
      await refresh();
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.error?.message ?? "Falha ao criar endereço");
    } finally {
      setSaving(false);
    }
  }

  async function onMakeDefault(id: string) {
    try {
      await setDefaultAddress(id);
      await refresh();
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.error?.message ?? "Falha ao definir padrão");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Excluir este endereço?")) return;
    try {
      await deleteAddress(id);
      await refresh();
    } catch (e: any) {
      console.error(e);
      alert(e?.response?.data?.error?.message ?? "Falha ao excluir endereço");
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Meus Endereços</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* lista */}
        <div className="card">
          <div className="card-header">
            <div className="section-title">Cadastrados</div>
          </div>
          <div className="card-body space-y-3">
            {loading && <div>Carregando…</div>}

            {!loading && items.length === 0 && (
              <div className="opacity-70">Nenhum endereço cadastrado.</div>
            )}

            {!loading &&
              items.map((a) => (
                <div
                  key={a.id}
                  className="rounded-xl border p-4 flex items-start justify-between"
                >
                  <div className="text-sm">
                    <div className="font-medium">
                      {a.label || "Sem rótulo"}{" "}
                      {a.id === defaultId && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                          Padrão
                        </span>
                      )}
                    </div>
                    <div className="opacity-70">
                      {a.street} {a.number && `, ${a.number}`}
                      {a.district && ` — ${a.district}`}
                      <br />
                      {a.city} / {a.state} • {a.id?.slice(0, 8)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {a.id !== defaultId && (
                      <button
                        className="btn btn-outline"
                        onClick={() => onMakeDefault(a.id)}
                      >
                        Definir padrão
                      </button>
                    )}
                    <button
                      className="btn btn-ghost"
                      onClick={() => onDelete(a.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* formulário */}
        <div className="card">
          <div className="card-header">
            <div className="section-title">Novo Endereço</div>
          </div>
          <div className="card-body">
            <form className="space-y-4" onSubmit={onCreate}>
              <div>
                <label className="label">Rótulo</label>
                <input
                  className="input"
                  value={form.label || ""}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="Casa, trabalho…"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Rua</label>
                  <input
                    className="input"
                    required
                    value={form.street}
                    onChange={(e) =>
                      setForm({ ...form, street: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Número</label>
                  <input
                    className="input"
                    value={form.number || ""}
                    onChange={(e) =>
                      setForm({ ...form, number: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="label">Bairro</label>
                <input
                  className="input"
                  value={form.district || ""}
                  onChange={(e) =>
                    setForm({ ...form, district: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Cidade</label>
                  <input
                    className="input"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">UF</label>
                  <input
                    className="input"
                    required
                    value={form.state}
                    onChange={(e) =>
                      setForm({ ...form, state: e.target.value })
                    }
                    placeholder="SP"
                  />
                </div>
                <div>
                  <label className="label">CEP</label>
                  <input
                    className="input"
                    required
                    value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button className="btn btn-solid" disabled={saving}>
                  {saving ? "Salvando…" : "Salvar endereço"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
