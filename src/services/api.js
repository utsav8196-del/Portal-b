import axios from 'axios';
import { normalizeApiBaseUrl } from '../utils/apiBaseUrl';

/** Empty in dev → Vite proxies `/api` to the backend. In production, set `VITE_API_URL` on the host (e.g. Vercel) to your API origin. */
const baseURL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL || '');

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;