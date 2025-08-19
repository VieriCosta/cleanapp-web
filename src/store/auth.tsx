import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, me as apiMe, logout as apiLogout } from "@/lib/api";
import { getTokens, clearTokens } from "./auth.storage";

type User = { id: string; name: string; email: string; role: string };
type Ctx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<Ctx>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // carrega user se já houver token salvo
  useEffect(() => {
    (async () => {
      const t = getTokens();
      if (t?.accessToken) {
        try {
          const { user } = await apiMe();
          setUser(user);
        } catch {
          clearTokens();
          setUser(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const data = await apiLogin(email, password); // { tokens + user }
      if (data?.user) {
        setUser(data.user);
      } else {
        const me = await apiMe();
        setUser(me.user);
      }
      // redireciona para home (atende seu pedido)
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    apiLogout();
    setUser(null);
    navigate("/login", { replace: true });
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
