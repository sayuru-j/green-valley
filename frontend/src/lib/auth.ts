export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

const TOKEN_KEY = "green_valley_admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem("adminAuth");
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("adminAuth");
}

/**
 * Authenticated fetch for admin API routes. Sends Bearer token.
 * On 401, clears auth and redirects to /admin-login.
 */
export async function authFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (res.status === 401) {
    clearAuth();
    window.location.href = "/admin-login";
  }

  return res;
}
