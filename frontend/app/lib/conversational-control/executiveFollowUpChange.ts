/** CC:12 pure temporal comparison. Observation never implies causality. */
import type { NexoraExecutionFollowUpSnapshot } from "./executiveFollowUpSnapshot.ts";
export type NexoraExecutionFollowUpChangeKind = "status-changed" | "progress-changed" | "progress-became-available" | "blocker-added" | "blocker-removed" | "risk-added" | "risk-removed" | "owner-changed" | "milestone-changed" | "deadline-changed" | "completed" | "became-blocked" | "became-at-risk" | "resumed";
export type NexoraExecutionFollowUpChange = { readonly kind: NexoraExecutionFollowUpChangeKind; readonly addedIds?: readonly string[]; readonly removedIds?: readonly string[]; readonly previous?: string | number | null; readonly current?: string | number | null };
export type NexoraExecutionFollowUpComparison = { readonly previousSnapshotId: string; readonly currentSnapshotId: string; readonly changes: readonly NexoraExecutionFollowUpChange[]; readonly progressDelta: number | null; readonly attention: "normal" | "watch" | "critical"; readonly causeEstablished: false };
const diff = (a: readonly string[], b: readonly string[]) => ({ added: b.filter((x) => !a.includes(x)), removed: a.filter((x) => !b.includes(x)) });
export function compareExecutionFollowUpSnapshots(previous: NexoraExecutionFollowUpSnapshot, current: NexoraExecutionFollowUpSnapshot): NexoraExecutionFollowUpComparison {
  if (previous.executionId !== current.executionId || previous.workspaceId !== current.workspaceId || previous.modelId !== current.modelId) throw new Error("execution-followup-scope-mismatch");
  const changes: NexoraExecutionFollowUpChange[] = [];
  if (previous.status !== current.status) changes.push({ kind: "status-changed", previous: previous.status, current: current.status });
  if (current.status === "completed" && previous.status !== "completed") changes.push({ kind: "completed" });
  if (current.status === "blocked" && previous.status !== "blocked") changes.push({ kind: "became-blocked" });
  if (current.status === "at-risk" && previous.status !== "at-risk") changes.push({ kind: "became-at-risk" });
  if (current.status === "in-progress" && (previous.status === "blocked" || previous.status === "at-risk")) changes.push({ kind: "resumed" });
  let progressDelta: number | null = null;
  if (previous.progress != null && current.progress != null && previous.progress !== current.progress) { progressDelta = current.progress - previous.progress; changes.push({ kind: "progress-changed", previous: previous.progress, current: current.progress }); }
  else if (previous.progress == null && current.progress != null) changes.push({ kind: "progress-became-available", previous: null, current: current.progress });
  for (const [before, now, addedKind, removedKind] of [[previous.blockerIds, current.blockerIds, "blocker-added", "blocker-removed"], [previous.riskIds, current.riskIds, "risk-added", "risk-removed"]] as const) { const d = diff(before, now); if (d.added.length) changes.push({ kind: addedKind, addedIds: Object.freeze(d.added) }); if (d.removed.length) changes.push({ kind: removedKind, removedIds: Object.freeze(d.removed) }); }
  const owners = diff(previous.ownerIds, current.ownerIds); if (owners.added.length || owners.removed.length) changes.push({ kind: "owner-changed", addedIds: Object.freeze(owners.added), removedIds: Object.freeze(owners.removed) });
  const milestones = diff(previous.milestoneIds, current.milestoneIds); if (milestones.added.length || milestones.removed.length) changes.push({ kind: "milestone-changed", addedIds: Object.freeze(milestones.added), removedIds: Object.freeze(milestones.removed) });
  if (previous.deadline !== current.deadline) changes.push({ kind: "deadline-changed", previous: previous.deadline, current: current.deadline });
  const attention = changes.some((c) => c.kind === "became-blocked") ? "critical" : changes.some((c) => c.kind === "became-at-risk" || c.kind === "blocker-added" || c.kind === "risk-added") ? "watch" : "normal";
  return Object.freeze({ previousSnapshotId: previous.snapshotId, currentSnapshotId: current.snapshotId, changes: Object.freeze(changes.map((change) => Object.freeze({ ...change }))), progressDelta, attention, causeEstablished: false });
}
