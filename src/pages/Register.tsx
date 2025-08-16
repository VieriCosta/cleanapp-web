import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "@/lib/api";
import { useAuth } from "@/store/auth";

type Role = "customer" | "provider";

export default function RegisterPage() {
  const nav = useNavigate();
  const { setUser } = useAuth();
  const [role, setRole] = useState<Role>("customer");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload: any = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      password: String(fd.get("password") || ""),
      role,
    };
    if (role === "provider") {
      payload.bio = String(fd.get("bio") || "");
      const r = fd.get("radiusKm");
      if (r) payload.radiusKm = Number(r);
    }

    try {
      const data = await register(payload);
      setUser(data.user);
      nav("/"); // vai pra Home após cadastro
    } catch (e: any) {
      const msg = e?.response?.data?.error?.message || "Falha ao cadastrar";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold text-center">Criar conta</h1>
        <p className="text-center opacity-70 mt-1">
          Cadastre-se como <strong>Cliente</strong> ou <strong>Prestador</strong>
        </p>

        {/* Abas */}
        <div className="mt-6 grid grid-cols-2 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => setRole("customer")}
            className={`py-2 text-sm font-medium ${role === "customer" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-transparent"}`}
          >
            Sou Cliente
          </button>
          <button
            onClick={() => setRole("provider")}
            className={`py-2 text-sm font-medium ${role === "provider" ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-transparent"}`}
          >
            Sou Prestador
          </button>
        </div>

        <form onSubmit={onSubmit} className="card mt-4">
          <div className="card-body space-y-4">
            {err && (
              <div className="rounded-lg border border-red-300/50 bg-red-50/70 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                {err}
              </div>
            )}

            <div>
              <label className="label">Nome</label>
              <input name="name" className="input" required minLength={2} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">E-mail</label>
                <input type="email" name="email" className="input" required />
              </div>
              <div>
                <label className="label">Telefone</label>
                <input name="phone" className="input" placeholder="(DD) 9 9999-9999" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Senha</label>
                <input type="password" name="password" className="input" required minLength={6} />
              </div>
              <div>
                <label className="label">Confirmar senha</label>
                <input
                  type="password"
                  name="password2"
                  className="input"
                  required
                  minLength={6}
                  onChange={(e) => {
                    const form = e.currentTarget.form!;
                    const p1 = (form.elements.namedItem("password") as HTMLInputElement)?.value;
                    if (e.currentTarget.value && p1 && e.currentTarget.value !== p1) {
                      e.currentTarget.setCustomValidity("As senhas não conferem");
                    } else {
                      e.currentTarget.setCustomValidity("");
                    }
                  }}
                />
              </div>
            </div>

            {role === "provider" && (
              <>
                <div>
                  <label className="label">Sobre você (bio)</label>
                  <textarea name="bio" className="input min-h-[90px]" placeholder="Conte um pouco sobre seus serviços" />
                </div>
                <div>
                  <label className="label">Raio de atendimento (km)</label>
                  <input name="radiusKm" type="number" min={1} max={100} defaultValue={10} className="input" />
                </div>
              </>
            )}

            <button disabled={loading} className="btn btn-solid w-full mt-2">
              {loading ? "Criando conta..." : "Criar conta"}
            </button>

            <p className="text-center text-sm opacity-80">
              Já tem conta? <Link to="/login" className="text-blue-600 hover:underline">Entrar</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
