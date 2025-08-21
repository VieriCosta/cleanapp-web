import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import {
  listCategories,
  listMyOffers,
  createMyOffer,
  updateMyOffer,
  deleteMyOffer,
} from "@/lib/api";

type Cat = { id: string; name: string; slug: string };
type MyOffer = {
  id: string;
  title: string;
  description?: string | null;
  priceBase: string | number;
  unit: "hora" | "diaria" | "servico";
  categoryId: string;
  active: boolean;
  createdAt: string;
};

export default function ProviderServices() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [cats, setCats] = useState<Cat[]>([]);
  const [offers, setOffers] = useState<MyOffer[]>([]);

  // form
  const [form, setForm] = useState<Partial<MyOffer>>({
    title: "",
    description: "",
    priceBase: "",
    unit: "hora",
    categoryId: "",
    active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "provider" && user.role !== "admin") {
      setErr("Apenas prestadores (ou admin) podem acessar esta página.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const [{ items: c }, { items: mine }] = await Promise.all([
          listCategories(),
          listMyOffers(),
        ]);
        setCats(c);
        setOffers(mine as MyOffer[]);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Falha ao carregar dados");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        title: String(form.title || "").trim(),
        description: String(form.description || ""),
        priceBase: Number(form.priceBase || 0),
        unit: form.unit || "hora",
        categoryId: String(form.categoryId || ""),
        active: !!form.active,
      };
      const { offer } = await createMyOffer(payload);
      setOffers((old) => [offer, ...old]);
      // reset
      setForm({
        title: "",
        description: "",
        priceBase: "",
        unit: "hora",
        categoryId: "",
        active: true,
      });
    } catch (e: any) {
      alert(e?.response?.data?.message || "Erro ao criar oferta");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Excluir esta oferta?")) return;
    try {
      await deleteMyOffer(id);
      setOffers((old) => old.filter((o) => o.id !== id));
    } catch (e: any) {
      alert(e?.response?.data?.code || "Falha ao excluir");
    }
  }

  if (loading) return <div>Carregando…</div>;
  if (err) return <div className="text-red-600">{err}</div>;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
      {/* Lista */}
      <div>
        <h1 className="text-2xl font-semibold mb-4">Meus serviços</h1>

        {offers.length === 0 && (
          <div className="card p-6">
            <p className="opacity-70">Você ainda não cadastrou serviços.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {offers.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="text-sm opacity-70 mb-1">
                {cats.find((c) => c.id === o.categoryId)?.name ?? "Categoria"}
              </div>
              <div className="font-medium">{o.title}</div>
              <div className="text-sm opacity-70 line-clamp-2 mt-1">
                {o.description || "—"}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-semibold">
                    R$ {Number(o.priceBase).toFixed(2)}
                  </span>{" "}
                  <span className="opacity-70">/ {o.unit}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setForm({
                        id: o.id,
                        title: o.title,
                        description: o.description || "",
                        priceBase: o.priceBase,
                        unit: o.unit,
                        categoryId: o.categoryId,
                        active: o.active,
                      })
                    }
                    className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(o.id)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <aside className="card p-5 h-fit sticky top-4">
        <h2 className="font-semibold mb-3">
          {form.id ? "Editar serviço" : "Novo serviço"}
        </h2>
        <form onSubmit={onCreate} className="grid gap-3">
          <div>
            <label className="label">Categoria</label>
            <select
              className="input"
              value={form.categoryId || ""}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              required
            >
              <option value="">Selecione…</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Título</label>
            <input
              className="input"
              value={form.title || ""}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="label">Descrição</label>
            <textarea
              className="input"
              rows={3}
              value={form.description || ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Preço base</label>
              <input
                className="input"
                type="number"
                step="0.01"
                value={String(form.priceBase ?? "")}
                onChange={(e) => setForm((f) => ({ ...f, priceBase: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Unidade</label>
              <select
                className="input"
                value={form.unit || "hora"}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value as any }))}
              >
                <option value="hora">hora</option>
                <option value="diaria">diaria</option>
                <option value="servico">servico</option>
              </select>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
            Ativo
          </label>

          <button
            type="submit"
            disabled={saving || !form.categoryId || !form.title || !form.priceBase}
            className="btn btn-solid disabled:opacity-60"
          >
            {form.id ? "Salvar alterações" : "Criar serviço"}
          </button>
        </form>
      </aside>
    </div>
  );
}
