import { fetchNexoraHealth } from "../system/nexoraHealth";

const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://127.0.0.1:8000";

export type HealthResponse = {
  ok: boolean;
  version?: string;
  time?: string;
};

/** @deprecated Prefer `fetchNexoraHealth` from `lib/system/nexoraHealth` (B.26). */
export async function pingHealth(): Promise<HealthResponse> {
  const h = await fetchNexoraHealth();
  return {
    ok: h.fetchSucceeded && h.ok,
    version: h.version,
    time: h.time ?? undefined,
  };
}

export { API_BASE };
