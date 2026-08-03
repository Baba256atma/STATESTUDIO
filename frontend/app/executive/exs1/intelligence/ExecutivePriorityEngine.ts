/**
 * Phase B — Prioritize signals by severity, recency, context, workspace.
 */

import type { ExecutiveModeId } from "../shell/executiveCockpitTypes";
import type { ExecutiveSignal, ExecutiveSignalSeverity } from "./ExecutiveSignalTypes";

const SEVERITY_WEIGHT: Record<ExecutiveSignalSeverity, number> = {
  Critical: 400,
  High: 300,
  Medium: 200,
  Low: 100,
};

export function scoreExecutiveSignal(
  signal: ExecutiveSignal,
  workspace: ExecutiveModeId,
): number {
  const severity = SEVERITY_WEIGHT[signal.severity];
  const ageMinutes = (Date.now() - signal.timestamp) / 60000;
  const recency = Math.max(0, 80 - ageMinutes);
  const workspaceBoost =
    signal.suggestedWorkspace === workspace || signal.type === "Decision Required"
      ? 40
      : 0;
  const unreadBoost = signal.unread ? 20 : 0;
  const lifecyclePenalty =
    signal.lifecycle === "Resolved" || signal.lifecycle === "Archived" ? -500 : 0;
  return severity + recency + workspaceBoost + unreadBoost + lifecyclePenalty;
}

export function prioritizeExecutiveSignals(
  signals: readonly ExecutiveSignal[],
  workspace: ExecutiveModeId,
): ExecutiveSignal[] {
  return [...signals].sort(
    (a, b) =>
      scoreExecutiveSignal(b, workspace) - scoreExecutiveSignal(a, workspace),
  );
}
