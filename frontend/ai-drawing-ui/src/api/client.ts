type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(method: HttpMethod, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status} ${res.statusText}`);
  }

  // אם אין body (204 וכו')
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return (undefined as unknown) as T;

  return (await res.json()) as T;
}

export const http = {
  get: <T>(url: string) => request<T>("GET", url),
  post: <T>(url: string, body: unknown) => request<T>("POST", url, body),
  put: <T>(url: string, body: unknown) => request<T>("PUT", url, body),
};
