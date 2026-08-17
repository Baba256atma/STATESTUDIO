/** CC:12 bounded executive-session observation memory. Never current truth. */
import { executionFollowUpSnapshotFingerprint, type NexoraExecutionFollowUpSnapshot } from "./executiveFollowUpSnapshot.ts";

export const EXECUTIVE_FOLLOW_UP_MAX_SNAPSHOTS_PER_EXECUTION = 8;
export const EXECUTIVE_FOLLOW_UP_MAX_EXECUTIONS = 12;
export const executiveFollowUpMemoryScope = "executive-session" as const;

export type NexoraExecutiveFollowUpMemory = {
  readonly executions: Readonly<Record<string, readonly NexoraExecutionFollowUpSnapshot[]>>;
  readonly executionOrder: readonly string[];
};
export function createEmptyExecutiveFollowUpMemory(): NexoraExecutiveFollowUpMemory {
  return Object.freeze({ executions: Object.freeze({}), executionOrder: Object.freeze([]) });
}
function key(s: NexoraExecutionFollowUpSnapshot): string { return `${s.workspaceId ?? "_"}|${s.modelId ?? "_"}|${s.executionId}`; }
export function readExecutionFollowUpHistory(memory: NexoraExecutiveFollowUpMemory, scope: { executionId: string; workspaceId: string | null; modelId: string | null }): readonly NexoraExecutionFollowUpSnapshot[] {
  return memory.executions[`${scope.workspaceId ?? "_"}|${scope.modelId ?? "_"}|${scope.executionId}`] ?? Object.freeze([]);
}
export function captureExecutionFollowUpSnapshot(memory: NexoraExecutiveFollowUpMemory, snapshot: NexoraExecutionFollowUpSnapshot): { readonly memory: NexoraExecutiveFollowUpMemory; readonly captured: boolean } {
  const k = key(snapshot); const history = memory.executions[k] ?? [];
  const currentFingerprint = executionFollowUpSnapshotFingerprint(snapshot);
  const last = history.at(-1);
  if (last && executionFollowUpSnapshotFingerprint(last) === currentFingerprint) return Object.freeze({ memory, captured: false });
  const nextHistory = Object.freeze([...history, snapshot].slice(-EXECUTIVE_FOLLOW_UP_MAX_SNAPSHOTS_PER_EXECUTION));
  const order = [k, ...memory.executionOrder.filter((x) => x !== k)].slice(0, EXECUTIVE_FOLLOW_UP_MAX_EXECUTIONS);
  const keep = new Set(order); const executions = Object.fromEntries(Object.entries(memory.executions).filter(([id]) => keep.has(id)));
  executions[k] = nextHistory;
  return Object.freeze({ memory: Object.freeze({ executions: Object.freeze(executions), executionOrder: Object.freeze(order) }), captured: true });
}
