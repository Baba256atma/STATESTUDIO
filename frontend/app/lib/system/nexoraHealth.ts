/**
 * B.26 — Lightweight backend health probe for UI + startup checks.
 */

const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) ||
  "http://127.0.0.1:8000";

const HEALTH_TIMEOUT_MS = 1500;

export type NexoraHealthServices = {
  ingestion?: boolean;
  scanner?: boolean;
  connectors?: boolean;
};

export type NexoraHealthStatus = {
  ok: boolean;
  version: string;
  time: string | null;
  services: NexoraHealthServices;
  /** False when fetch failed, timed out, or body was not JSON. */
  fetchSucceeded: boolean;
};

const EMPTY: NexoraHealthStatus = {
  ok: false,
  version: "dev",
  time: null,
  services: {},
  fetchSucceeded: false,
};

function parseHealthBody(data: unknown): NexoraHealthStatus {
  if (!data || typeof data !== "object") return { ...EMPTY, fetchSucceeded: true };
  const o = data as Record<string, unknown>;
  const servicesRaw = o.services;
  const services: NexoraHealthServices = {};
  if (servicesRaw && typeof servicesRaw === "object" && !Array.isArray(servicesRaw)) {
    const s = servicesRaw as Record<string, unknown>;
    if (typeof s.ingestion === "boolean") services.ingestion = s.ingestion;
    if (typeof s.scanner === "boolean") services.scanner = s.scanner;
    if (typeof s.connectors === "boolean") services.connectors = s.connectors;
  }
  return {
    ok: o.ok === true,
    version: typeof o.version === "string" ? o.version : "dev",
    time: typeof o.time === "string" ? o.time : null,
    services,
    fetchSucceeded: true,
  };
}

export async function fetchNexoraHealth(): Promise<NexoraHealthStatus> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET", signal: controller.signal });
    if (!res.ok) {
      return { ...EMPTY, fetchSucceeded: false };
    }
    const data = await res.json().catch(() => null);
    return parseHealthBody(data);
  } catch {
    return { ...EMPTY, fetchSucceeded: false };
  } finally {
    clearTimeout(timer);
  }
}

export type NexoraHealthIndicator = "green" | "yellow" | "red";

export function nexoraHealthIndicator(status: NexoraHealthStatus | null): NexoraHealthIndicator {
  if (!status || !status.fetchSucceeded) return "red";
  const vals = Object.values(status.services).filter((v) => typeof v === "boolean") as boolean[];
  if (vals.length === 0) return "red";
  if (vals.every(Boolean) && status.ok) return "green";
  return "yellow";
}
