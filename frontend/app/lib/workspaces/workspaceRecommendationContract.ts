/**
 * MRP:9:2 — Context-aware workspace recommendation contract.
 *
 * Recommendations are advisory only. Dashboard executes. Executive decides.
 */

import type { ExecutiveWorkspaceId } from "../dashboard/executiveWorkspaceRegistryContract.ts";

export type WorkspaceQuickActionPriority = "critical" | "high" | "normal" | "low";

export type WorkspaceRecommendationObjectSignal =
  | "risk"
  | "kpi"
  | "scenario"
  | "timeline"
  | "general";

export type WorkspaceRecommendationImpact = "low" | "moderate" | "high" | "critical";

/** Extensible context inputs for recommendation evaluation. */
export type WorkspaceRecommendationContext = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectStatus?: string | null;
  objectConfidence?: number | null;
  objectImpact?: WorkspaceRecommendationImpact | null;
  objectSignal?: WorkspaceRecommendationObjectSignal | null;
  dashboardContext?: string | null;
  activeWorkspaceId?: ExecutiveWorkspaceId | null;
  timelineActive?: boolean;
  scenarioConflict?: boolean;
  kpiDecline?: boolean;
  timelineAnomaly?: boolean;
  systemSignals?: readonly string[];
}>;

/** Generic quick action card — no workspace-specific UI fields. */
export type WorkspaceQuickActionCardView = Readonly<{
  id: string;
  title: string;
  description: string;
  suggestedWorkspaceId: ExecutiveWorkspaceId;
  suggestedWorkspaceName: string;
  reason: string;
  priority: WorkspaceQuickActionPriority;
  launchable: boolean;
  signal: string;
}>;

export type WorkspaceRecommendationStateView = Readonly<{
  recommendations: readonly WorkspaceQuickActionCardView[];
  contextSignature: string;
  evaluatedAt: number;
  source: "workspace_recommendation_engine";
}>;

export const WORKSPACE_RECOMMENDATION_MAX_COUNT = 6;

export const WORKSPACE_QUICK_ACTION_PRIORITY_ORDER: readonly WorkspaceQuickActionPriority[] =
  Object.freeze(["critical", "high", "normal", "low"]);

const loggedBrakes = new Set<string>();

function logBrake(prefix: string, message: string, detail: Readonly<Record<string, unknown>> = {}): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${prefix}:${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.(prefix, { message, ...detail });
}

export function warnWorkspaceQuickActionBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[WorkspaceQuickAction][Brake]", message, detail);
}

export function warnWorkspaceRecommendationBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[WorkspaceRecommendation][Brake]", message, detail);
}

export function warnWorkspaceRecommendationStateBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[WorkspaceRecommendationState][Brake]", message, detail);
}

export function resetWorkspaceRecommendationForTests(): void {
  loggedBrakes.clear();
}

export function compareQuickActionPriority(
  a: WorkspaceQuickActionPriority,
  b: WorkspaceQuickActionPriority
): number {
  return WORKSPACE_QUICK_ACTION_PRIORITY_ORDER.indexOf(a) - WORKSPACE_QUICK_ACTION_PRIORITY_ORDER.indexOf(b);
}
