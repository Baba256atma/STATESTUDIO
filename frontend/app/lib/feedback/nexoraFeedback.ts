/**
 * B.32 — Pilot operator feedback (local only, no backend).
 */

export type NexoraFeedbackType = "helpful" | "not_helpful" | "confusing" | "incorrect";

export type NexoraFeedbackRecord = {
  runId: string;
  timestamp: number;
  type: NexoraFeedbackType;
  note?: string;
};

/** localStorage key for B.32 feedback records */
export const STORAGE_KEY = "nexora.feedback.v1";

export const NEXORA_FEEDBACK_CHANGED_EVENT = "nexora:feedback-storage-changed";

const MAX_RECORDS = 50;

const FEEDBACK_TYPES: ReadonlySet<string> = new Set(["helpful", "not_helpful", "confusing", "incorrect"]);

function isFeedbackRecord(x: unknown): x is NexoraFeedbackRecord {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.runId !== "string" || !o.runId.trim()) return false;
  if (typeof o.timestamp !== "number" || !Number.isFinite(o.timestamp)) return false;
  if (typeof o.type !== "string" || !FEEDBACK_TYPES.has(o.type)) return false;
  if (o.note !== undefined && typeof o.note !== "string") return false;
  return true;
}

function trimFifo(records: NexoraFeedbackRecord[]): NexoraFeedbackRecord[] {
  if (records.length <= MAX_RECORDS) return records;
  return records.slice(-MAX_RECORDS);
}

let lastB32LogKey = "";
let lastB32LogAt = 0;

function logFeedbackRecordedDev(record: NexoraFeedbackRecord): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${record.runId}|${record.type}`;
  const now = Date.now();
  if (key === lastB32LogKey && now - lastB32LogAt < 450) return;
  lastB32LogKey = key;
  lastB32LogAt = now;
  globalThis.console?.debug?.("[Nexora][B32] feedback_recorded", {
    runId: record.runId,
    type: record.type,
    hasNote: Boolean(record.note?.trim()),
  });
}

function dispatchFeedbackChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(NEXORA_FEEDBACK_CHANGED_EVENT));
}

export function loadNexoraFeedback(): NexoraFeedbackRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isFeedbackRecord);
  } catch {
    return [];
  }
}

export function saveNexoraFeedback(record: NexoraFeedbackRecord): void {
  if (typeof window === "undefined") return;
  const runId = record.runId.trim();
  if (!runId) return;
  const normalized: NexoraFeedbackRecord = {
    runId,
    timestamp: record.timestamp,
    type: record.type,
    note: record.note?.trim() ? record.note.trim().slice(0, 500) : undefined,
  };

  const cur = loadNexoraFeedback();
  const withoutDup = cur.filter((r) => !(r.runId === normalized.runId && r.type === normalized.type));
  const next = trimFifo([...withoutDup, normalized].sort((a, b) => a.timestamp - b.timestamp));
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    return;
  }
  logFeedbackRecordedDev(normalized);
  dispatchFeedbackChanged();
}

export type NexoraFeedbackSummary = {
  total: number;
  helpful: number;
  notHelpful: number;
  confusing: number;
  incorrect: number;
  helpfulRate: number;
  negativeRate: number;
  confusionRate: number;
  lastNotes: string[];
};

export function buildNexoraFeedbackSummary(records: NexoraFeedbackRecord[]): NexoraFeedbackSummary {
  const total = records.length;
  let helpful = 0;
  let notHelpful = 0;
  let confusing = 0;
  let incorrect = 0;
  for (const r of records) {
    if (r.type === "helpful") helpful += 1;
    else if (r.type === "not_helpful") notHelpful += 1;
    else if (r.type === "confusing") confusing += 1;
    else if (r.type === "incorrect") incorrect += 1;
  }
  const denom = total > 0 ? total : 1;
  const negative = notHelpful + incorrect;
  const notes = records
    .filter((r) => r.note?.trim())
    .slice(-5)
    .map((r) => r.note!.trim());
  return {
    total,
    helpful,
    notHelpful,
    confusing,
    incorrect,
    helpfulRate: helpful / denom,
    negativeRate: negative / denom,
    confusionRate: confusing / denom,
    lastNotes: notes,
  };
}
