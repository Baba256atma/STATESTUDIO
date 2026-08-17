/** CC:12 immutable read projection of canonical Execution truth. */
import type { NexoraCanonicalExecution, NexoraExecutionRuntimeAdapter } from "./executiveExecutionRuntimeAdapter.ts";

export type NexoraExecutionFollowUpSnapshot = {
  readonly snapshotId: string; readonly executionId: string; readonly decisionId: string;
  readonly status: NexoraCanonicalExecution["status"]; readonly progress: number | null;
  readonly ownerIds: readonly string[]; readonly blockerIds: readonly string[];
  readonly riskIds: readonly string[]; readonly milestoneIds: readonly string[];
  readonly deadline: string | null; readonly workspaceId: string | null; readonly modelId: string | null;
  readonly observedAt: string | null; readonly source: "canonical-execution-runtime";
};

function sorted(values: readonly string[]): readonly string[] { return Object.freeze([...values].sort()); }

export function executionFollowUpSnapshotFingerprint(snapshot: Omit<NexoraExecutionFollowUpSnapshot, "snapshotId" | "observedAt">): string {
  return JSON.stringify([snapshot.executionId, snapshot.decisionId, snapshot.status, snapshot.progress,
    sorted(snapshot.ownerIds), sorted(snapshot.blockerIds), sorted(snapshot.riskIds), sorted(snapshot.milestoneIds),
    snapshot.deadline, snapshot.workspaceId, snapshot.modelId]);
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) { hash ^= value.charCodeAt(i); hash = Math.imul(hash, 16777619); }
  return (hash >>> 0).toString(36);
}

export function projectExecutionFollowUpSnapshot(input: {
  readonly runtime: NexoraExecutionRuntimeAdapter; readonly executionId: string; readonly observedAt?: string | null;
}): NexoraExecutionFollowUpSnapshot | null {
  const execution = input.runtime.getExecution(input.executionId);
  if (!execution) return null;
  const deadlines = execution.milestones.filter((m) => m.completed !== true && m.deadline).map((m) => m.deadline! ).sort();
  const base = Object.freeze({ executionId: execution.executionId, decisionId: execution.decisionId,
    status: execution.status, progress: execution.progress ?? null, ownerIds: sorted(execution.ownerIds),
    blockerIds: sorted(execution.blockers.map((b) => b.blockerId)), riskIds: sorted(execution.risks.map((r) => r.riskId)),
    milestoneIds: sorted(execution.milestones.map((m) => m.milestoneId)), deadline: deadlines[0] ?? null,
    workspaceId: execution.workspaceId, modelId: execution.modelId, source: "canonical-execution-runtime" as const });
  const fingerprint = executionFollowUpSnapshotFingerprint(base);
  return Object.freeze({ ...base, snapshotId: `cc12:${execution.executionId}:${stableHash(fingerprint)}`, observedAt: input.observedAt ?? null });
}
