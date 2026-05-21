import type {
  ExperienceSeverity,
  InstitutionalMemoryRecord,
  MemoryCategory,
} from "./institutionalMemoryTypes";

export const INSTITUTIONAL_MEMORY_MAX_RECORDS = 48;
export const INSTITUTIONAL_MEMORY_MAX_EXPERIENCES = 24;
export const INSTITUTIONAL_MEMORY_MAX_EVENTS = 64;
export const INSTITUTIONAL_MEMORY_MIN_EVAL_INTERVAL_MS = 400;
export const INSTITUTIONAL_MEMORY_MAX_RECURSION_DEPTH = 2;

const lastEvalAtByOrg = new Map<string, number>();
let accumulationDepth = 0;

const VALID_CATEGORIES = new Set<MemoryCategory>([
  "fragility",
  "escalation",
  "governance",
  "resilience",
  "coordination",
  "operational",
  "strategic",
  "recovery",
  "unknown",
]);

const VALID_SEVERITIES = new Set<ExperienceSeverity>(["low", "medium", "high", "critical"]);

export function beginInstitutionalMemoryAccumulation(): boolean {
  if (accumulationDepth >= INSTITUTIONAL_MEMORY_MAX_RECURSION_DEPTH) return false;
  accumulationDepth += 1;
  return true;
}

export function endInstitutionalMemoryAccumulation(): void {
  accumulationDepth = Math.max(0, accumulationDepth - 1);
}

export function shouldEvaluateInstitutionalMemory(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < INSTITUTIONAL_MEMORY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateInstitutionalMemoryRecord(
  record: InstitutionalMemoryRecord | null | undefined
): record is InstitutionalMemoryRecord {
  if (!record) return false;
  if (!record.memoryId.trim() || !record.title.trim() || !record.summary.trim()) return false;
  if (!VALID_CATEGORIES.has(record.category)) return false;
  if (!VALID_SEVERITIES.has(record.severity)) return false;
  if (!Number.isFinite(record.recordedAt) || !Number.isFinite(record.lastObservedAt)) return false;
  return record.recurrenceCount >= 1;
}

export function resetInstitutionalMemoryGuards(): void {
  lastEvalAtByOrg.clear();
  accumulationDepth = 0;
}
