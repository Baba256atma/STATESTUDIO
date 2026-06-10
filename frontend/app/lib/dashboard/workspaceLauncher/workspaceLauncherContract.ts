/**
 * MRP:9:1 — Dashboard Workspace Launcher contract.
 *
 * Launcher is an entry surface only. Dashboard executes. Controller authorizes.
 */

import type { DashboardMode } from "../dashboardModeRuntimeContract.ts";
import type { ObjectPanelDashboardAction } from "../../object-panel/objectPanelActionRouterContract.ts";
import type {
  ExecutiveWorkspaceAvailabilityState,
  ExecutiveWorkspaceId,
} from "../executiveWorkspaceRegistryContract.ts";

export type WorkspaceLaunchSource =
  | "workspace_launcher"
  | "object_panel"
  | "assistant_bridge"
  | "timeline"
  | "dashboard_control"
  | "future";

export type WorkspaceLauncherCardStatus =
  | "active"
  | "available"
  | "future"
  | "disabled";

/** Registry-driven workspace card — no workspace-specific UI fields. */
export type WorkspaceLauncherCardView = Readonly<{
  workspaceId: ExecutiveWorkspaceId;
  name: string;
  description: string;
  availability: ExecutiveWorkspaceAvailabilityState;
  status: WorkspaceLauncherCardStatus;
  launchable: boolean;
  badge: string | null;
  isActive: boolean;
  dashboardMode: DashboardMode | null;
  objectPanelAction: ObjectPanelDashboardAction | null;
}>;

export type WorkspaceLauncherStateView = Readonly<{
  activeWorkspaceId: ExecutiveWorkspaceId | null;
  activeWorkspaceName: string | null;
  recentWorkspaceId: ExecutiveWorkspaceId | null;
  recentWorkspaceName: string | null;
  cards: readonly WorkspaceLauncherCardView[];
  source: "workspace_launcher";
}>;

export type WorkspaceLaunchRequestInput = Readonly<{
  workspaceId?: ExecutiveWorkspaceId;
  objectPanelAction?: ObjectPanelDashboardAction | string;
  source: WorkspaceLaunchSource;
  objectId?: string;
  objectName?: string;
}>;

export type WorkspaceLaunchRequestResult = Readonly<{
  approved: boolean;
  workspaceId: ExecutiveWorkspaceId | null;
  dashboardMode: DashboardMode | null;
  objectPanelAction: ObjectPanelDashboardAction | null;
  routeObject: Readonly<{ objectId: string; objectName: string }> | null;
  source: WorkspaceLaunchSource;
  reason: string;
}>;

const loggedBrakes = new Set<string>();

function logBrake(prefix: string, message: string, detail: Readonly<Record<string, unknown>> = {}): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${prefix}:${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.(prefix, { message, ...detail });
}

export function warnWorkspaceLauncherBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[WorkspaceLauncher][Brake]", message, detail);
}

export function warnWorkspaceEntryPointBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[WorkspaceEntryPoint][Brake]", message, detail);
}

export function warnWorkspaceLaunchTransitionBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[WorkspaceLaunchTransition][Brake]", message, detail);
}

export function warnWorkspaceLauncherStateBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  logBrake("[WorkspaceLauncherState][Brake]", message, detail);
}

export function resetWorkspaceLauncherForTests(): void {
  loggedBrakes.clear();
}

export function resolveLauncherCardStatus(input: {
  availability: ExecutiveWorkspaceAvailabilityState;
  isActive: boolean;
  launchable: boolean;
}): WorkspaceLauncherCardStatus {
  if (input.isActive) return "active";
  if (input.availability === "future") return "future";
  if (input.availability === "disabled" || input.availability === "deprecated") return "disabled";
  return input.launchable ? "available" : "disabled";
}

export function resolveLauncherCardBadge(input: {
  status: WorkspaceLauncherCardStatus;
  availability: ExecutiveWorkspaceAvailabilityState;
}): string | null {
  if (input.status === "active") return "Active";
  if (input.availability === "future") return "Coming Soon";
  if (input.availability === "experimental") return "Preview";
  return null;
}
