import { useEffect, useMemo, useState } from "react";
import {
  getMyProfile,
  updateMyProfile,
  uploadMyAvatar,
  getMyAddresses,
  createAddress,
  deleteAddress,
  setDefaultAddress,
  changeMyPassword,
  Address,
  NewAddress,
} from "@/lib/api";

type Tab = "dados" | "enderecos" | "seguranca";

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("dados");

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold mb-6">Meu Perfil</h1>

      <div className="flex gap-2 mb-6">
        <button
          className={`btn ${tab === "dados" ? "btn-solid" : "btn-outline"}`}
          onClick={() => setTab("dados")}
        >
          Dados pessoais
        </button>
        <button
          className={`btn ${tab === "enderecos" ? "btn-solid" : "btn-outline"}`}
          onClick={() => setTab("enderecos")}
        >
          Endereços
        </button>
        <button
          className={`btn ${tab === "seguranca" ? "btn-solid" : "btn-outline"}`}
          onClick={() => setTab("seguranca")}
        >
          Segurança
        </button>
      </div>

      {tab === "dados" && <TabDados />}
      {tab === "enderecos" && <TabEnderecos />}
      {tab === "seguranca" && <TabSeguranca />}
    </div>
  );
}

/* ----------------- DADOS PESSOAIS ----------------- */
function TabDados() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { user } = await getMyProfile();
        setUser(user);
        setName(user?.name ?? "");
        setPhone(user?.phone ?? "");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const photoUrl = useMemo(() => {
    if (!user?.photoUrl) return undefined;
    // Se o back serve o caminho relativo, o Vite precisa do host da API (proxy/mesma origem ajuda).
    // Se necessário, transforme para URL absoluta aqui.
    return user.photoUrl;
  }, [user]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { user: updated } = await updateMyProfile({ name, phone });
      setUser(updated);
      alert("Dados atualizados!");
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function onSelectFile(ev: React.ChangeEvent<HTMLInputElement>) {
    const f = ev.target.files?.[0];
    if (!f) return;
    setFileUploading(true);
    try {
      const { photoUrl } = await uploadMyAvatar(f);
      setUser((u: any) => ({ ...u, photoUrl }));
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Falha no upload.");
    } finally {
      setFileUploading(false);
      ev.target.value = "";
    }
  }

  if (loading) return <div className="card"><div className="card-body">Carregando…</div></div>;

  return (
    <div className="grid md:grid-cols-[280px,1fr] gap-6">
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {photoUrl ? (
                <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-content-center text-sm opacity-70">
                  Sem foto
                </div>
              )}
            </div>
            <label className="btn btn-outline mt-3 cursor-pointer">
              {fileUploading ? "Enviando..." : "Trocar foto"}
              <input type="file" accept="image/*" className="hidden" onChange={onSelectFile} />
            </label>
          </div>
        </div>
      </div>

      <form onSubmit={onSave} className="card">
        <div className="card-header">
          <div className="section-title">Informações</div>
        </div>
        <div className="card-body space-y-4">
          <div>
            <label className="label">Nome</label>
            <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">E-mail</label>
            <input className="input mt-1" value={user?.email ?? ""} disabled />
          </div>
          <div>
            <label className="label">Telefone</label>
            <input className="input mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="pt-2">
            <button className="btn btn-solid" disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ----------------- ENDEREÇOS ----------------- */
function TabEnderecos() {
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [openNew, setOpenNew] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getMyAddresses();
        const items = Array.isArray(data) ? data : data.items ?? [];
        setAddresses(items);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function refresh() {
    const data = await getMyAddresses();
    const items = Array.isArray(data) ? data : data.items ?? [];
    setAddresses(items);
  }

  async function onDelete(id: string) {
    if (!confirm("Excluir este endereço?")) return;
    await deleteAddress(id);
    await refresh();
  }

  async function onSetDefault(id: string) {
    await setDefaultAddress(id);
    await refresh();
  }

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="section-title">Meus endereços</div>
        <button className="btn btn-solid" onClick={() => setOpenNew(true)}>Novo endereço</button>
      </div>

      <div className="card-body">
        {loading ? (
          <div>Carregando…</div>
        ) : addresses.length === 0 ? (
          <div className="opacity-70">Nenhum endereço cadastrado.</div>
        ) : (
          <ul className="space-y-3">
            {addresses.map((a) => (
              <li key={a.id} className="border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {a.label || "Endereço"} {a.isDefault ? <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900">Padrão</span> : null}
                  </div>
                  <div className="text-sm opacity-70">
                    {[a.street, a.number, a.district, a.city, a.state, a.zip].filter(Boolean).join(", ")}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!a.isDefault && (
                    <button className="btn btn-outline" onClick={() => onSetDefault(a.id!)}>
                      Definir padrão
                    </button>
                  )}
                  <button className="btn btn-ghost" onClick={() => onDelete(a.id!)}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {openNew && <NewAddressModal onClose={() => setOpenNew(false)} onSaved={refresh} />}
    </div>
  );
}

function NewAddressModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [payload, setPayload] = useState<NewAddress>({
    label: "",
    street: "",
    number: "",
    district: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createAddress(payload);
      onClose();
      onSaved();
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center p-4 z-50">
      <form onSubmit={onSubmit} className="w-full max-w-lg card">
        <div className="card-header flex items-center justify-between">
          <div className="section-title">Novo endereço</div>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Fechar</button>
        </div>
        <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="label">Rótulo</label>
            <input className="input mt-1" value={payload.label || ""} onChange={(e) => setPayload({ ...payload, label: e.target.value })}/>
          </div>
          <div className="md:col-span-2">
            <label className="label">Rua</label>
            <input className="input mt-1" value={payload.street} onChange={(e) => setPayload({ ...payload, street: e.target.value })} required/>
          </div>
          <div>
            <label className="label">Número</label>
            <input className="input mt-1" value={payload.number || ""} onChange={(e) => setPayload({ ...payload, number: e.target.value })}/>
          </div>
          <div>
            <label className="label">Bairro</label>
            <input className="input mt-1" value={payload.district || ""} onChange={(e) => setPayload({ ...payload, district: e.target.value })}/>
          </div>
          <div>
            <label className="label">Cidade</label>
            <input className="input mt-1" value={payload.city} onChange={(e) => setPayload({ ...payload, city: e.target.value })} required/>
          </div>
          <div>
            <label className="label">Estado</label>
            <input className="input mt-1" value={payload.state} onChange={(e) => setPayload({ ...payload, state: e.target.value })} required/>
          </div>
          <div className="md:col-span-2">
            <label className="label">CEP</label>
            <input className="input mt-1" value={payload.zip || ""} onChange={(e) => setPayload({ ...payload, zip: e.target.value })}/>
          </div>
          <div className="md:col-span-2 flex items-center gap-2">
            <input id="isDefault" type="checkbox" checked={!!payload.isDefault} onChange={(e) => setPayload({ ...payload, isDefault: e.target.checked })}/>
            <label htmlFor="isDefault" className="label">Definir como padrão</label>
          </div>
        </div>
        <div className="card-body pt-0">
          <button className="btn btn-solid" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
        </div>
      </form>
    </div>
  );
}

/* ----------------- SEGURANÇA ----------------- */
function TabSeguranca() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await changeMyPassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      alert("Senha alterada com sucesso!");
    } catch (e: any) {
      alert(e?.response?.data?.error?.message || "Erro ao alterar senha.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-xl">
      <div className="card-header">
        <div className="section-title">Alterar senha</div>
      </div>
      <div className="card-body space-y-4">
        <div>
          <label className="label">Senha atual</label>
          <input type="password" className="input mt-1" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required/>
        </div>
        <div>
          <label className="label">Nova senha</label>
          <input type="password" className="input mt-1" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
        </div>
        <div>
          <button className="btn btn-solid" disabled={saving}>{saving ? "Alterando..." : "Alterar senha"}</button>
        </div>
      </div>
    </form>
  );
}
