import { useState } from "react";
import { useAuth } from "@/store/auth";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      // navegação acontece no AuthProvider
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.code ||
        "Falha no login";
      setErr(msg);
    }
  }

  return (
    <div className="container py-10 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Entrar</h1>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="label">E-mail</label>
          <input
            type="email"
            className="input"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="label">Senha</label>
          <input
            type="password"
            className="input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-solid w-full"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-4 text-sm opacity-70">
        Não tem conta?{" "}
        <Link className="underline" to="/register">
          Cadastre-se
        </Link>
      </p>

      <div className="mt-6 text-xs opacity-60">
        <p><b>Testes rápidos:</b></p>
        <p>Cliente: <code>cliente1@cleanapp.local</code> / <code>cliente123</code></p>
        <p>Prestador: <code>prestador1@cleanapp.local</code> / <code>prestador123</code></p>
        <p>Admin: <code>admin@cleanapp.local</code> / <code>admin123</code></p>
      </div>
    </div>
  );
}
