// src/lib/api.ts
import axios, { AxiosRequestConfig } from "axios";
import { getTokens, setTokens, clearTokens } from "@/store/auth.storage";

// --- Base URL (sem barra no final) ---
const BASE =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

if (import.meta.env.DEV) console.info("[API BASE]", BASE);

// --- Marca interna no config para evitar loop de refresh ---
declare module "axios" {
  // só para uso interno nosso
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const api = axios.create({ baseURL: BASE });

// Controle de refresh
let isRefreshing = false;
let queue: Array<(token?: string) => void> = [];

// Helper: endpoints que NÃO devem receber Authorization
function isAuthRoute(url?: string) {
  const u = String(url || "");
  return u.startsWith("/auth/login") || u.startsWith("/auth/refresh");
}

// ---------- Request interceptor ----------
api.interceptors.request.use((config) => {
  if (!isAuthRoute(config.url)) {
    const t = getTokens();
    if (t?.accessToken) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${t.accessToken}`;
    }
  }
  return config;
});

// ---------- Response interceptor ----------
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const status = err?.response?.status;
    const original: AxiosRequestConfig = err?.config || {};
    const t = getTokens();

    // Tenta refresh quando:
    // - 401
    // - temos refreshToken
    // - não é /auth/login
    // - ainda não tentamos (_retry)
    if (
      status === 401 &&
      t?.refreshToken &&
      !original._retry &&
      !isAuthRoute(original.url)
    ) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await axios.post(`${BASE}/auth/refresh`, {
            refreshToken: t.refreshToken,
          });
          setTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });

          // Libera a fila
          queue.forEach((cb) => cb(data.accessToken));
          queue = [];
          isRefreshing = false;
        } catch (e) {
          isRefreshing = false;
          queue.forEach((cb) => cb(undefined));
          queue = [];
          clearTokens();
          throw err;
        }
      }

      // Espera o refresh terminar e refaz a requisição original
      return new Promise((resolve, reject) => {
        queue.push((newAccess) => {
          if (!newAccess) return reject(err);
          original.headers = original.headers ?? {};
          (original.headers as any).Authorization = `Bearer ${newAccess}`;
          resolve(api(original));
        });
      });
    }

    if (status === 401) {
      // 401 “real” (login errado, sessão expirada sem refresh, etc.)
      clearTokens();
    }
    throw err;
  }
);

/* ============ AUTH ============ */
export async function login(email: string, password: string) {
  // IMPORTANTE: essa chamada vai sem Authorization por causa do interceptor acima
  const { data } = await api.post("/auth/login", { email, password });
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data; // { accessToken, refreshToken, user }
}

export function logout() {
  clearTokens();
}

export async function me() {
  const { data } = await api.get("/auth/me");
  return data; // { user }
}

/* ============ ADDRESSES (cliente) ============ */
export type NewAddress = {
  label?: string;
  street: string;
  number?: string;
  district?: string;
  city: string;
  state: string;
  zip: string;
  lat?: number | null;
  lng?: number | null;
  isDefault?: boolean;
};

export async function createAddress(payload: NewAddress) {
  const { data } = await api.post("/addresses", payload);
  return data;
}

export async function setDefaultAddress(addressId: string) {
  const { data } = await api.post(`/addresses/${addressId}/set-default`);
  return data;
}

export async function deleteAddress(addressId: string) {
  const { data } = await api.delete(`/addresses/${addressId}`);
  return data;
}

export async function register(payload: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: 'customer' | 'provider';
  bio?: string;
  radiusKm?: number;
}) {
  const { data } = await api.post('/auth/register', payload);
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data as { accessToken: string; refreshToken: string; user: any };
}

/* ============ OFFERS ============ */
export type Offer = {
  id: string;
  title: string;
  priceBase: number | string;
  provider?: { user?: { name?: string | null } | null } | null;
};

export async function listOffers(params: { page?: number; pageSize?: number } = {}) {
  const { data } = await api.get("/offers", { params });
  return data as { total: number; page: number; pageSize: number; items: Offer[] };
}

/* ============ ADDRESSES (meus) ============ */
export type Address = {
  id: string;
  label?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  lat?: number | null;
  lng?: number | null;
};

export async function getMyAddresses() {
  const { data } = await api.get("/addresses"); // ajuste se sua rota for /addresses/mine
  return data as { total: number; items: Address[] } | Address[];
}

/* ============ JOBS (cliente) ============ */
export async function createJob(params: {
  offerId: string;
  addressId: string;
  datetime: string;
  notes?: string;
}) {
  const { data } = await api.post("/jobs", params);
  return data; // { job, distanceKm }
}

export async function listCustomerJobs(params: any = {}) {
  const { data } = await api.get("/jobs", { params: { role: "customer", ...params } });
  return data;
}

/* ============ CONVERSAS ============ */
export async function listConversations(params: any = {}) {
  const { data } = await api.get("/conversations", { params });
  return data;
}

export async function getConversation(id: string) {
  const { data } = await api.get(`/conversations/${id}`);
  return data;
}

export async function listMessages(
  conversationId: string,
  params: { page?: number; pageSize?: number } = {}
) {
  const { data } = await api.get(`/conversations/${conversationId}/messages`, { params });
  return data;
}

export async function sendMessage(conversationId: string, text: string) {
  const { data } = await api.post(`/conversations/${conversationId}/messages`, { text });
  return data;
}

export async function markAllRead(conversationId: string) {
  const { data } = await api.post(
    `/conversations/${conversationId}/messages/mark-all-read`
  );
  return data;
}

// --- CATEGORIES ---
export type Category = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  // se sua API retornar contagem, mantenha; caso não, é opcional
  _count?: { offers?: number };
};

export async function listCategories(params: { page?: number; pageSize?: number } = {}) {
  // ajuste a rota se no seu back for diferente, ex: /categories/public
  const { data } = await api.get("/categories", { params });
  // esperado: { total, page, pageSize, items: Category[] } ou Category[]
  return Array.isArray(data)
    ? { total: data.length, page: 1, pageSize: data.length, items: data as Category[] }
    : (data as { total: number; page: number; pageSize: number; items: Category[] });
}


export default api;
