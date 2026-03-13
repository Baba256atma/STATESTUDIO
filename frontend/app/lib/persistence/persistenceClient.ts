const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

type ApiResult<T> = { ok: boolean; data?: T };

async function safeFetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(input, init);
    if (!res.ok) return { ok: false };
    const json = (await res.json()) as { ok?: boolean; data?: T } | null;
    if (!json || !json.ok) return { ok: false };
    return { ok: true, data: json.data };
  } catch {
    return { ok: false };
  }
}

export async function fetchDecisions(companyId: string, limit = 50): Promise<ApiResult<any[]>> {
  const url = `${BASE}/api/decisions?company_id=${encodeURIComponent(companyId)}&limit=${limit}`;
  return safeFetchJson<any[]>(url);
}

export async function saveDecision(companyId: string, snapshot: unknown): Promise<ApiResult<unknown>> {
  const url = `${BASE}/api/decisions`;
  return safeFetchJson<unknown>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company_id: companyId, snapshot }),
  });
}

export async function fetchEvents(companyId: string, limit = 200): Promise<ApiResult<any[]>> {
  const url = `${BASE}/api/events?company_id=${encodeURIComponent(companyId)}&limit=${limit}`;
  return safeFetchJson<any[]>(url);
}

export async function logEvent(companyId: string, event: unknown): Promise<ApiResult<unknown>> {
  const url = `${BASE}/api/events`;
  return safeFetchJson<unknown>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company_id: companyId, event }),
  });
}
