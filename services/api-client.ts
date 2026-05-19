import axios, { type InternalAxiosRequestConfig } from "axios";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retryCount?: number;
};

const transientStatuses = new Set([408, 425, 429, 500, 502, 503, 504]);

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export function getApiErrorMessage(error: any, fallback: string) {
  return error?.response?.data?.message || error?.message || fallback;
}

// Request interceptor to add the auth token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("z-auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const shouldRetry = config && (!status || transientStatuses.has(status));
    const retryCount = config?._retryCount ?? 0;

    if (shouldRetry && retryCount < 2) {
      config._retryCount = retryCount + 1;
      await wait(700 * config._retryCount);
      return apiClient(config);
    }

    if (!error.response) {
      error.message = "Could not reach the Z Electronics API. Please try again in a few seconds.";
    } else if ([502, 503, 504].includes(status)) {
      error.message = "The backend is waking up or restarting. Please try again in a few seconds.";
    } else if (status === 429) {
      error.message = "Too many requests reached the backend. Please wait a moment and try again.";
    }

    return Promise.reject(error);
  }
);
