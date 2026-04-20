/**
 * B.11 — Client-side scheduled multi-source assessments (localStorage, no DB).
 */

import type { ConnectorRunInputOut, MultiSourceIngestionRequest } from "../api/ingestionApi";

const STORAGE_KEY = "nexora.scheduledAssessments.v1";
const MAX_DEFINITIONS = 10;
const MIN_INTERVAL_MINUTES = 5;

export type ScheduleType = "interval" | "daily";

export type ScheduledAssessmentLastStatus = "idle" | "ok" | "error" | "skipped";

export type ScheduledAssessmentDefinition = {
  id: string;
  name: string;
  sources: ConnectorRunInputOut[];
  domain: string | null;
  scheduleType: ScheduleType;
  /** When scheduleType === "interval" */
  intervalMinutes: number;
  /** When scheduleType === "daily", local "HH:MM" (24h) */
  dailyTime: string | null;
  enabled: boolean;
  lastRunAt: number | null;
  lastStatus: ScheduledAssessmentLastStatus;
  createdAt: number;
};

function safeParse(raw: string | null): ScheduledAssessmentDefinition[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter(isValidDefinition);
  } catch {
    return [];
  }
}

function isValidDefinition(x: unknown): x is ScheduledAssessmentDefinition {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    Array.isArray(o.sources) &&
    (o.scheduleType === "interval" || o.scheduleType === "daily") &&
    typeof o.enabled === "boolean" &&
    typeof o.createdAt === "number"
  );
}

export function loadScheduledAssessments(): ScheduledAssessmentDefinition[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

export function saveScheduledAssessments(defs: ScheduledAssessmentDefinition[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defs.slice(0, MAX_DEFINITIONS)));
}

export function updateScheduledAssessment(
  id: string,
  patch: Partial<Pick<ScheduledAssessmentDefinition, "lastRunAt" | "lastStatus" | "enabled" | "name">>
): void {
  const all = loadScheduledAssessments();
  const next = all.map((d) => (d.id === id ? { ...d, ...patch } : d));
  saveScheduledAssessments(next);
}

export function upsertScheduledAssessment(def: ScheduledAssessmentDefinition): void {
  const all = loadScheduledAssessments().filter((d) => d.id !== def.id);
  all.unshift(def);
  saveScheduledAssessments(all);
}

export function deleteScheduledAssessment(id: string): void {
  saveScheduledAssessments(loadScheduledAssessments().filter((d) => d.id !== id));
}

export function toMultiSourceRequest(def: ScheduledAssessmentDefinition): MultiSourceIngestionRequest {
  const domain = def.domain?.trim() || null;
  return domain ? { sources: def.sources, domain } : { sources: def.sources };
}

export function isScheduledAssessmentDue(def: ScheduledAssessmentDefinition, nowMs: number): boolean {
  if (!def.enabled || def.sources.length === 0) return false;
  if (def.scheduleType === "interval") {
    const mins = Math.max(MIN_INTERVAL_MINUTES, Math.min(7 * 24 * 60, def.intervalMinutes || 60));
    const ms = mins * 60 * 1000;
    if (def.lastRunAt == null) {
      return nowMs - def.createdAt >= ms;
    }
    return nowMs - def.lastRunAt >= ms;
  }
  const tm = (def.dailyTime || "09:00").trim();
  const parts = tm.split(":").map((p) => parseInt(p, 10));
  const hh = Number.isFinite(parts[0]) ? parts[0] : 9;
  const mm = Number.isFinite(parts[1]) ? parts[1] : 0;
  const now = new Date(nowMs);
  const slot = new Date(nowMs);
  slot.setHours(hh, mm, 0, 0);
  if (now < slot) return false;
  if (def.lastRunAt == null) return true;
  return def.lastRunAt < slot.getTime();
}

export function newScheduledAssessmentId(): string {
  return `sch_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
