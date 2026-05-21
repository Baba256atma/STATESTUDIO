import type {
  EnterpriseMemoryCognitionSnapshot,
  InstitutionalHealthLevel,
  MemoryRuntimeStatus,
} from "./unifiedInstitutionalMemoryTypes";

export const UNIFIED_INSTITUTIONAL_MEMORY_MAX_SNAPSHOTS = 12;
export const UNIFIED_INSTITUTIONAL_MEMORY_MAX_HISTORY = 8;
export const UNIFIED_INSTITUTIONAL_MEMORY_MIN_EVAL_INTERVAL_MS = 550;
export const UNIFIED_INSTITUTIONAL_MEMORY_MAX_RECURSION_DEPTH = 2;
export const UNIFIED_INSTITUTIONAL_MEMORY_MAX_LAYER_DEPTH = 52;

const lastEvalAtByOrg = new Map<string, number>();
let unifiedDepth = 0;

export function beginUnifiedInstitutionalMemoryEvaluation(): boolean {
  if (unifiedDepth >= UNIFIED_INSTITUTIONAL_MEMORY_MAX_RECURSION_DEPTH) return false;
  unifiedDepth += 1;
  return true;
}

export function endUnifiedInstitutionalMemoryEvaluation(): void {
  unifiedDepth = Math.max(0, unifiedDepth - 1);
}

export function shouldEvaluateUnifiedInstitutionalMemory(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < UNIFIED_INSTITUTIONAL_MEMORY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateEnterpriseMemorySnapshot(
  snapshot: EnterpriseMemoryCognitionSnapshot | null | undefined
): snapshot is EnterpriseMemoryCognitionSnapshot {
  if (!snapshot) return false;
  if (!snapshot.snapshotId.trim() || !snapshot.organizationId.trim()) return false;
  if (!snapshot.summary.primaryStrategicLesson.trim()) return false;
  return Number.isFinite(snapshot.generatedAt);
}

export function healthRank(level: InstitutionalHealthLevel): number {
  const ranks: Record<InstitutionalHealthLevel, number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    verified: 4,
  };
  return ranks[level];
}

export function runtimeSeverity(status: MemoryRuntimeStatus): number {
  const ranks: Record<MemoryRuntimeStatus, number> = {
    unstable: 1,
    degraded: 2,
    recovering: 3,
    initializing: 4,
    stable: 5,
  };
  return ranks[status];
}

export function shouldRetainUnifiedSnapshot(
  snapshot: EnterpriseMemoryCognitionSnapshot,
  _layerDepth: number
): boolean {
  if (!validateEnterpriseMemorySnapshot(snapshot)) return false;
  if (snapshot.institutionalHealth === "verified" && snapshot.activeSubsystems.length < 5) {
    return false;
  }
  return true;
}

export function resetUnifiedInstitutionalMemoryGuards(): void {
  lastEvalAtByOrg.clear();
  unifiedDepth = 0;
}
