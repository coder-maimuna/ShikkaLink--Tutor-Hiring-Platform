import axios, { type AxiosError } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem('token') || window.localStorage.getItem('shikkalink_token');
}

export function clearStoredAuth(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem('token');
  window.localStorage.removeItem('shikkalink_token');
  window.localStorage.removeItem('user');
}

export function getStoredTokenValue(): string | null {
  return getStoredToken();
}

export function getUserRoleFromToken(token: string | null): string | null {
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);

  try {
    const decoded = globalThis.atob(padded);
    const parsed = JSON.parse(decoded) as {
      role?: string;
      userRole?: string;
      roles?: string[];
    };

    return parsed.role || parsed.userRole || parsed.roles?.[0] || null;
  } catch {
    return null;
  }
}

export function getDashboardRouteForRole(role: string | null | undefined): string {
  switch (role) {
    case 'student':
      return '/dashboard/student';
    case 'tutor':
      return '/dashboard/tutor';
    case 'admin':
      return '/dashboard/admin';
    default:
      return '/auth/login';
  }
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Unexpected error';

    if (typeof window !== 'undefined') {
      if (status === 401) {
        clearStoredAuth();
        window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { message } }));
      } else if (status === 403) {
        window.dispatchEvent(new CustomEvent('auth:forbidden', { detail: { message } }));
      } else if (status && status >= 500) {
        window.dispatchEvent(new CustomEvent('api:error', { detail: { message, status } }));
      }
    }

    return Promise.reject(error);
  },
);

export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    return data?.message || data?.error || error.message || 'Unable to load dashboard data.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to load dashboard data.';
}

export default api;
