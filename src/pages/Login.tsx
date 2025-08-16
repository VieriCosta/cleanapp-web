import { FormEvent, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const [email, setEmail] = useState("cliente1@cleanapp.local");
  const [password, setPassword] = useState("cliente123");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await login(email, password); // ← isso define o user no contexto
      const to = location.state?.from?.pathname || "/";
      navigate(to, { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Usuário ou senha inválidos.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="card w-full max-w-md p-6 space-y-4"
        noValidate
      >
        <h1 className="text-xl font-semibold text-center">Entrar</h1>

        {!!error && (
          <div className="rounded-lg border border-red-300/40 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="label">E-mail</label>
          <input
            className="input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="label">Senha</label>
          <input
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-solid w-full" disabled={submitting}>
          {submitting ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
