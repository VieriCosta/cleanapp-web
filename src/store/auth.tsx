import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as api from "@/lib/api";
import { getTokens } from "./auth.storage";

type Role = "customer" | "provider" | "admin";
export type User = { id: string; name?: string | null; role: Role };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  // stubs para não quebrar em SSR/tests
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega o usuário se já houver tokens no storage
  useEffect(() => {
    const t = getTokens();
    if (!t?.accessToken) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((res) => setUser(res.user))
      .catch(() => {
        api.logout();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    // api.login já salva os tokens no storage
    const res = await api.login(email, password);
    // se a API retornar o user junto, usamos; se não, chamamos /me
    const u = res.user ?? (await api.me()).user;
    setUser(u);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
