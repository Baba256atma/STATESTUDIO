/**
 * R.2 — Dev tasks ↔ roadmap phase linkage (pure selectors).
 */

import type { NexoraDevTask } from "./nexoraDevTaskContract.ts";
import type { NexoraRoadmapPhase } from "./nexoraRoadmapContract.ts";

export type NexoraPhaseTaskSummary = {
  total: number;
  open: number;
  inProgress: number;
  done: number;
  deferred: number;
  blockedBy: string[];
};

function trim(s: string | null | undefined): string {
  return String(s ?? "").trim();
}

function isOpenTask(t: NexoraDevTask): boolean {
  return t.status === "open" || t.status === "in_progress" || t.status === "deferred";
}

/** Whether dependency string `dep` refers to unresolved work in `tasks`. */
export function isDependencyUnresolved(tasks: readonly NexoraDevTask[], dep: string): boolean {
  const d = trim(dep);
  if (!d) return false;
  const byTag = tasks.find((x) => trim(x.tag) === d);
  if (byTag) return isOpenTask(byTag);
  const byId = tasks.find((x) => x.id === d);
  if (byId) return isOpenTask(byId);
  const byPhase = tasks.some((x) => trim(x.phase) === d && isOpenTask(x));
  if (byPhase) return true;
  return false;
}

/**
 * Tasks linked to a phase:
 * same `phase` field, `dependsOn` mentions phase id, or depends on a tag carried by a task in this phase.
 */
export function getTasksForPhase(tasks: readonly NexoraDevTask[], phaseId: string): NexoraDevTask[] {
  const pid = trim(phaseId);
  if (!pid) return [];
  const inPhase = tasks.filter((t) => trim(t.phase) === pid);
  const tagsInPhase = new Set(inPhase.map((t) => trim(t.tag)).filter(Boolean));
  return tasks.filter((t) => {
    if (trim(t.phase) === pid) return true;
    if (t.dependsOn?.some((d) => trim(d) === pid)) return true;
    if (t.dependsOn?.some((d) => tagsInPhase.has(trim(d)))) return true;
    return false;
  });
}

/** Open + in-progress + deferred count for linked tasks. */
export function countOpenTasksForPhase(tasks: readonly NexoraDevTask[], phaseId: string): number {
  return getTasksForPhase(tasks, phaseId).filter((t) => isOpenTask(t)).length;
}

/**
 * Count blocking signals: roadmap phase `dependsOn` not done, plus open linked tasks
 * with unresolved tag/id dependencies.
 */
export function countBlockedDependenciesForPhase(
  tasks: readonly NexoraDevTask[],
  phase: NexoraRoadmapPhase,
  allPhases: readonly NexoraRoadmapPhase[]
): number {
  const pmap = new Map(allPhases.map((p) => [p.id, p]));
  let n = 0;
  for (const d of phase.dependsOn ?? []) {
    const id = trim(d);
    const p = pmap.get(id);
    if (p && p.status !== "done") n += 1;
    if (!p && isDependencyUnresolved(tasks, id)) n += 1;
  }
  for (const t of getTasksForPhase(tasks, phase.id)) {
    if (!isOpenTask(t) || !t.dependsOn?.length) continue;
    for (const d of t.dependsOn) {
      if (isDependencyUnresolved(tasks, d)) n += 1;
    }
  }
  return n;
}

export function buildPhaseTaskSummary(
  tasks: readonly NexoraDevTask[],
  phase: NexoraRoadmapPhase,
  allPhases: readonly NexoraRoadmapPhase[]
): NexoraPhaseTaskSummary {
  const linked = getTasksForPhase(tasks, phase.id);
  const open = linked.filter((t) => t.status === "open").length;
  const inProgress = linked.filter((t) => t.status === "in_progress").length;
  const done = linked.filter((t) => t.status === "done").length;
  const deferred = linked.filter((t) => t.status === "deferred").length;
  const blockedBy: string[] = [];
  const pmap = new Map(allPhases.map((p) => [p.id, p]));
  for (const d of phase.dependsOn ?? []) {
    const id = trim(d);
    const p = pmap.get(id);
    if (p && p.status !== "done") blockedBy.push(id);
    else if (!p && isDependencyUnresolved(tasks, id)) blockedBy.push(id);
  }
  for (const t of linked) {
    if (!isOpenTask(t) || !t.dependsOn?.length) continue;
    for (const d of t.dependsOn) {
      if (isDependencyUnresolved(tasks, d)) blockedBy.push(trim(d));
    }
  }
  const uniq = [...new Set(blockedBy)].sort();
  return {
    total: linked.length,
    open,
    inProgress,
    done,
    deferred,
    blockedBy: uniq,
  };
}

/** Phase health label from summary + phase status (deterministic). */
export function phaseHealthLabel(
  phase: NexoraRoadmapPhase,
  summary: NexoraPhaseTaskSummary
): "blocked" | "attention" | "ok" {
  if (phase.status === "blocked" || summary.blockedBy.length > 0) return "blocked";
  if (summary.open + summary.inProgress > 0 && phase.status === "active") return "attention";
  if (summary.open + summary.inProgress > 0) return "attention";
  return "ok";
}
