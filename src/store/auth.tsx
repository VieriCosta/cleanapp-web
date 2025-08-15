import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';
import { getTokens, setTokens, clearTokens } from './auth.storage';

type User = { id: string; email: string; name?: string; role: 'customer'|'provider'|'admin' };

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>({} as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const t = getTokens();
    if (t?.user) setUser(t.user);
  }, []);

  async function login(email: string, password: string) {
    const r = await api.post('/auth/login', { email, password });
    setTokens(r.data);           // { accessToken, refreshToken, user }
    setUser(r.data.user);
  }

  function logout() {
    clearTokens();
    setUser(null);
    window.location.href = '/login';
  }

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
