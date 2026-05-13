import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { normalizeApiBaseUrl } from "../apiBaseUrl";

/** Same rules as `src/services/api.js`: dev may leave unset (Vite proxy); production needs `VITE_API_URL`. */
export const BASE_API_URL = normalizeApiBaseUrl(
  import.meta.env.VITE_API_URL || ""
);

// Create axios instance
export const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config: any) => {
    const token = Cookies.get("accessToken");
    // const token = localStorage.getItem("accessToken");
    if (token) {
      // config.headers.Authorization = `Bearer ${token}`;
      config.headers.Authorization = token;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint (assumes your server reads refresh token from HTTP-only cookie)
        const refreshUrl = BASE_API_URL
          ? `${BASE_API_URL}/api/auth/refresh_token`
          : "/api/auth/refresh_token";
        const res = await axios.post(refreshUrl, {}, { withCredentials: true });

        const newAccessToken = res.data.accessToken;
        Cookies.set("accessToken", newAccessToken);
        console.log("Access token refreshed successfully", newAccessToken);

        // Update the header and retry original request
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: newAccessToken,
        };

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        Cookies.remove("accessToken");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Options interface
interface Options {
  url: string;
  method: "POST" | "PUT" | "GET" | "PATCH" | "DELETE";
  body?: object;
  params?: any;
  headers?: Record<string, string>;
}

// Generate Axios config
const requestConfig = (options: Options): AxiosRequestConfig => {
  const config: AxiosRequestConfig = {
    url: options.url,
    method: options.method,
    headers: options.headers || { "Content-Type": "application/json" },
    data: options.body,
    params: options.params,
  };

  return config;
};

// Request function
export const request = async (options: Options): Promise<any> => {
  if (!navigator.onLine) {
    return Promise.reject({
      status: false,
      message: "Internet Disconnected",
    });
  }

  const config = requestConfig(options);
  return api.request(config);
};
