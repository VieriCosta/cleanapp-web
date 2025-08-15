import axios from 'axios';
import { getTokens, setTokens, clearTokens } from '../store/auth.storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let isRefreshing = false;
let queue: Array<() => void> = [];

api.interceptors.request.use((config) => {
  const t = getTokens();
  if (t?.accessToken) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${t.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error?.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        await new Promise<void>((resolve) => queue.push(resolve));
        return api(original);
      }

      isRefreshing = true;
      try {
        const tokens = getTokens();
        if (!tokens?.refreshToken) throw new Error('No refresh token');

        const r = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          refreshToken: tokens.refreshToken,
        });

        setTokens(r.data);
        queue.forEach((fn) => fn());
        queue = [];

        return api(original);
      } catch (e) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
