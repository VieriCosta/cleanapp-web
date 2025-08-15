import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as any;
  const [email, setEmail] = useState("cliente1@cleanapp.local");
  const [password, setPassword] = useState("cliente123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      await login(email, password);
      const to = loc.state?.from?.pathname ?? "/";
      nav(to);
    } catch (e: any) {
      setErr(e?.response?.data?.error?.message ?? "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Bem-vindo(a)</h1>
          <p className="text-sm text-gray-500">Acesse sua conta para continuar</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-3">
            <div className="grid gap-1">
              <Label>Email</Label>
              <Input placeholder="email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label>Senha</Label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {err && <p className="text-sm text-red-600">{err}</p>}
            <Button disabled={loading} className="gap-2">
              {loading && <Spinner />} Entrar
            </Button>
            <p className="text-xs text-gray-500">
              Dica: prestador1@cleanapp.local / prestador123
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
