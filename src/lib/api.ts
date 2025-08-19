import axios from "axios";
import { getTokens, setTokens, clearTokens } from "@/store/auth.storage";

const BASE =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

const api = axios.create({ baseURL: BASE });

// ---------- Auth Interceptors ----------
let isRefreshing = false;
let queue: Array<(token?: string) => void> = [];

api.interceptors.request.use((config) => {
  const t = getTokens();
  if (t?.accessToken) config.headers.Authorization = `Bearer ${t.accessToken}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const status = err?.response?.status;
    const original = err?.config || {};
    const t = getTokens();

    if (
      status === 401 &&
      t?.refreshToken &&
      !original._retry &&
      !String(original?.url || "").includes("/auth/login")
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

      return new Promise((resolve, reject) => {
        queue.push((newAccess) => {
          if (!newAccess) return reject(err);
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newAccess}`;
          resolve(api(original));
        });
      });
    }

    if (status === 401) {
      clearTokens();
    }
    throw err;
  }
);

/* ===== AUTH ===== */
export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data; // { accessToken, refreshToken, user }
}

export function logout() {
  // <<< ESTE EXPORT PRECISA EXISTIR
  clearTokens();
}

export async function me() {
  const { data } = await api.get("/auth/me");
  return data; // { user }
}

// ============ USER (Perfil) ============
export async function getMyProfile() {
  const { data } = await api.get("/users/me");
  return data as { user: any };
}
export async function updateMyProfile(payload: { name?: string; phone?: string }) {
  const { data } = await api.patch("/users/me", payload);
  return data as { user: any };
}
export async function changeMyPassword(currentPassword: string, newPassword: string) {
  const { data } = await api.post("/users/me/change-password", {
    currentPassword,
    newPassword,
  });
  return data as { ok: true };
}
export async function uploadMyAvatar(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post("/users/me/photo", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data as { ok: true; photoUrl: string };
}

// ============ ADDRESSES ============
export type Address = {
  id: string;
  label?: string | null;
  street?: string | null;
  number?: string | null;
  district?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  lat?: number | null;
  lng?: number | null;
  isDefault?: boolean | null;
};
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

export async function getMyAddresses() {
  const { data } = await api.get("/addresses");
  return data as { total?: number; items?: Address[] } | Address[];
}

export async function createAddress(payload: NewAddress) {
  const { data } = await api.post("/addresses", payload);
  return data;
}
export async function deleteAddress(addressId: string) {
  const { data } = await api.delete(`/addresses/${addressId}`);
  return data;
}
export async function setDefaultAddress(addressId: string) {
  const { data } = await api.post(`/addresses/${addressId}/set-default`);
  return data;
}

// ============ OFFERS ============
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

// --- TYPES (se ainda não tiver) ---
export type JobStatus = "pending" | "accepted" | "started" | "done" | "canceled";
export type PaymentStatus = "none" | "hold" | "captured" | "refunded" | "failed";

export type Job = {
  id: string;
  status: JobStatus;
  paymentStatus?: PaymentStatus;
  datetime?: string | null;
  notes?: string | null;
  priceEstimated?: number | string | null;
  priceFinal?: number | string | null;
  customer?: { id: string; name?: string | null } | null;
  provider?: { id: string; name?: string | null } | null;
  category?: { id: string; name?: string | null; slug?: string | null } | null;
  offer?: { id: string; title?: string | null } | null;
  address?: { label?: string | null; city?: string | null; state?: string | null } | null;
};

// ========= JOBS (PRESTADOR) =========
export async function listProviderJobs(params: {
  page?: number;
  pageSize?: number;
  status?: JobStatus | "all";
}) {
  const { data } = await api.get("/jobs", {
    params: { role: "provider", ...params },
  });
  return data as { total: number; page: number; pageSize: number; items: Job[] };
}

export async function acceptJob(jobId: string) {
  const { data } = await api.post(`/jobs/${jobId}/accept`);
  return data;
}
export async function startJob(jobId: string) {
  const { data } = await api.post(`/jobs/${jobId}/start`);
  return data;
}
export async function finishJob(jobId: string) {
  const { data } = await api.post(`/jobs/${jobId}/finish`);
  return data;
}
export async function cancelJob(jobId: string) {
  const { data } = await api.post(`/jobs/${jobId}/cancel`);
  return data;
}


// ============ JOBS (cliente) ============
export async function listCustomerJobs(params: any = {}) {
  const { data } = await api.get("/jobs", { params: { role: "customer", ...params } });
  return data;
}
export async function createJob(params: {
  offerId: string;
  addressId: string;
  datetime: string;
  notes?: string;
}) {
  const { data } = await api.post("/jobs", params);
  return data; // { job, distanceKm }
}

// ============ CONVERSAS ============
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

/* ========= REGISTER ========= */
export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: "customer" | "provider";
  phone?: string;
};

export async function register(payload: RegisterPayload) {
  // ajuste a rota se sua API usar outro endpoint (ex.: "/users/register")
  const { data } = await api.post("/auth/register", payload);

  // se a API já devolver tokens, salvamos para logar automaticamente
  if (data?.accessToken && data?.refreshToken) {
    setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  }

  return data; // pode ser { user, accessToken?, refreshToken? }
}

/* ======== SUPORTE / CONTATO ======== */
export async function sendSupportMessage(payload: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  // Crie essa rota no back se quiser processar de verdade
  const { data } = await api.post("/support/contact", payload);
  return data; // { ok: true }
}



export default api;
