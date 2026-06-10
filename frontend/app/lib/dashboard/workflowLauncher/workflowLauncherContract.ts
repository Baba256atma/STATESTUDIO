/**
 * MRP:10:3 — Executive Workflow Launcher contract.
 *
 * Pure configuration layer — labels, icons, targets. No business logic or state ownership.
 */

import type { DashboardMode } from "../dashboardModeRuntimeContract.ts";
import type { ExecutiveWorkspaceId } from "../executiveWorkspaceRegistryContract.ts";

export type WorkflowLauncherActionKind =
  | "analyze_system"
  | "compare_scenarios"
  | "run_scenario"
  | "open_war_room"
  | "review_recommendations"
  | "return_to_workspace";

export type WorkflowLauncherHandler =
  | "workspace_launch"
  | "focus_recommendations"
  | "return_workspace";

/** Static action definition — configuration only. */
export type WorkflowLauncherActionDefinition = Readonly<{
  id: WorkflowLauncherActionKind;
  title: string;
  description: string;
  icon: string;
  handler: WorkflowLauncherHandler;
  targetWorkspaceId: ExecutiveWorkspaceId | null;
  targetDashboardMode: DashboardMode | null;
  requiresObject: boolean;
}>;

export type WorkflowLauncherActionView = Readonly<
  WorkflowLauncherActionDefinition & {
    enabled: boolean;
    disabledReason: string | null;
  }
>;

export type RecentWorkflowSessionView = Readonly<{
  workspaceId: ExecutiveWorkspaceId;
  workspaceName: string;
  sessionLabel: string;
  lastVisitedAt: number;
  returnKind: "back_via_history" | "forward_via_launch";
}>;

export type WorkflowLauncherView = Readonly<{
  actions: readonly WorkflowLauncherActionView[];
  recentSessions: readonly RecentWorkflowSessionView[];
  evaluatedAt: number;
  source: "workflow_launcher";
}>;

export const WORKFLOW_DEDICATED_WORKSPACE_IDS = Object.freeze([
  "analyze",
  "compare",
  "scenario",
  "war_room",
] as const satisfies readonly ExecutiveWorkspaceId[]);

export const WORKFLOW_LAUNCHER_ACTION_DEFINITIONS: readonly WorkflowLauncherActionDefinition[] =
  Object.freeze([
    Object.freeze({
      id: "analyze_system",
      title: "Analyze System",
      description: "Inspect current operational state",
      icon: "◈",
      handler: "workspace_launch",
      targetWorkspaceId: "analyze",
      targetDashboardMode: "analyze",
      requiresObject: true,
    }),
    Object.freeze({
      id: "compare_scenarios",
      title: "Compare Scenarios",
      description: "Evaluate competing futures",
      icon: "⇄",
      handler: "workspace_launch",
      targetWorkspaceId: "compare",
      targetDashboardMode: "compare",
      requiresObject: true,
    }),
    Object.freeze({
      id: "run_scenario",
      title: "Run Scenario",
      description: "Explore scenario paths",
      icon: "◎",
      handler: "workspace_launch",
      targetWorkspaceId: "scenario",
      targetDashboardMode: "scenario",
      requiresObject: true,
    }),
    Object.freeze({
      id: "open_war_room",
      title: "Open War Room",
      description: "Strategic decision workspace",
      icon: "⬡",
      handler: "workspace_launch",
      targetWorkspaceId: "war_room",
      targetDashboardMode: "war_room",
      requiresObject: true,
    }),
    Object.freeze({
      id: "review_recommendations",
      title: "Review Recommendations",
      description: "Focus advisory guidance",
      icon: "◉",
      handler: "focus_recommendations",
      targetWorkspaceId: null,
      targetDashboardMode: null,
      requiresObject: false,
    }),
    Object.freeze({
      id: "return_to_workspace",
      title: "Return To Workspace",
      description: "Resume operational context",
      icon: "↩",
      handler: "return_workspace",
      targetWorkspaceId: null,
      targetDashboardMode: null,
      requiresObject: false,
    }),
  ]);

const loggedBrakes = new Set<string>();

export function warnWorkflowLauncherBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[WorkflowLauncher][Brake]", { message, ...detail });
}

export function resetWorkflowLauncherBrakesForTests(): void {
  loggedBrakes.clear();
}
