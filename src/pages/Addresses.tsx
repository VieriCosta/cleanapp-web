import { useEffect, useState } from "react";
import api from "../lib/api";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { toast } from "sonner";

type Address = {
  id: string;
  label?: string;
  street: string;
  number?: string;
  district?: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
};

export default function AddressesPage() {
  const [list, setList] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<Address>>({
    label: "",
    street: "",
    number: "",
    district: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });

  async function load() {
    setLoading(true);
    try {
      const r = await api.get("/addresses/mine");
      setList(r.data);
    } catch {
      toast.error("Falha ao carregar endereços");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        label: form.label?.trim(),
        street: (form.street ?? "").trim(),
        number: form.number?.trim(),
        district: form.district?.trim(),
        city: (form.city ?? "").trim(),
        state: (form.state ?? "").trim(),
        zip: (form.zip ?? "").trim(),
        isDefault: !!form.isDefault,
      };
      await api.post("/addresses/mine", payload);
      toast.success("Endereço criado");
      setForm({ label: "", street: "", number: "", district: "", city: "", state: "", zip: "", isDefault: false });
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message ?? "Erro ao criar endereço");
    }
  }

  async function setDefault(id: string) {
    try {
      await api.post(`/addresses/${id}/default`, {});
      toast.success("Endereço definido como padrão");
      load();
    } catch {
      toast.error("Erro ao definir padrão");
    }
  }

  async function remove(id: string) {
    if (!confirm("Remover este endereço?")) return;
    try {
      await api.delete(`/addresses/${id}`);
      toast.success("Endereço removido");
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.error?.message ?? "Erro ao remover");
    }
  }

  return (
    <div className="grid gap-6">
      <h2 className="section-title">Meus endereços</h2>

      <Card>
        <CardHeader><div className="font-medium">Novo endereço</div></CardHeader>
        <CardContent>
          <form onSubmit={onCreate} className="grid sm:grid-cols-2 gap-3">
            <Input name="label" value={form.label ?? ""} onChange={onChange} placeholder="Rótulo (Casa, Trabalho)" />
            <Input name="street" value={form.street ?? ""} onChange={onChange} placeholder="Rua/Av." required />
            <Input name="number" value={form.number ?? ""} onChange={onChange} placeholder="Número" />
            <Input name="district" value={form.district ?? ""} onChange={onChange} placeholder="Bairro" />
            <Input name="city" value={form.city ?? ""} onChange={onChange} placeholder="Cidade" required />
            <Input name="state" value={form.state ?? ""} onChange={onChange} placeholder="UF" required />
            <Input name="zip" value={form.zip ?? ""} onChange={onChange} placeholder="CEP" required />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isDefault" checked={!!form.isDefault} onChange={onChange} />
              Definir como padrão
            </label>
            <div className="sm:col-span-2">
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><div className="font-medium">Endereços cadastrados</div></CardHeader>
        <CardContent className="grid gap-2">
          {loading && <div className="text-sm text-gray-500">Carregando…</div>}
          {!loading && list.length === 0 && <div className="text-sm text-gray-500">Nenhum endereço.</div>}
          {!loading && list.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
              <div className="text-sm">
                <div className="font-medium">{a.label || "(sem rótulo)"} {a.isDefault && <span className="ml-2 text-xs rounded-full px-2 py-0.5 bg-gray-900 text-white dark:bg-white dark:text-gray-900">padrão</span>}</div>
                <div className="opacity-70">{a.street}, {a.number} {a.district && `- ${a.district}`}</div>
                <div className="opacity-70">{a.city} - {a.state} · {a.zip}</div>
              </div>
              <div className="flex gap-2">
                {!a.isDefault && <Button onClick={() => setDefault(a.id)} variant="secondary">Tornar padrão</Button>}
                <Button onClick={() => remove(a.id)} variant="ghost">Excluir</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
