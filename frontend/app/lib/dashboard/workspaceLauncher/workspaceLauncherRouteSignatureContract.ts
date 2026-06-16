/**
 * Workspace Launcher full route signature — brake only when entire MRP route matches.
 *
 * Tag: [WORKSPACE_LAUNCHER_FULL_ROUTE_SIGNATURE_FIXED]
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { DashboardMode } from "../dashboardModeRuntimeContract.ts";
import { mapDashboardModeToLegacyContext } from "../dashboardModeLegacyBridge.ts";
import type { ObjectPanelDashboardAction } from "../../object-panel/objectPanelActionRouterContract.ts";
import type { ExecutiveWorkspaceId } from "../executiveWorkspaceRegistryContract.ts";
import type { WorkspaceLaunchSource } from "./workspaceLauncherContract.ts";

export const WORKSPACE_LAUNCHER_FULL_ROUTE_SIGNATURE_FIXED_TAG =
  "[WORKSPACE_LAUNCHER_FULL_ROUTE_SIGNATURE_FIXED]" as const;

export type WorkspaceLauncherRouteSignature = Readonly<{
  workspaceId: ExecutiveWorkspaceId;
  dashboardContext: DashboardContext;
  selectedObjectId: string | null;
  objectPanelAction: ObjectPanelDashboardAction | null;
  source: WorkspaceLaunchSource;
  mountKey: string;
  routeGeneration: number;
}>;

export type WorkspaceLauncherRouteSignatureInput = Readonly<{
  workspaceId: ExecutiveWorkspaceId;
  dashboardMode: DashboardMode | null;
  dashboardContext?: DashboardContext | null;
  selectedObjectId?: string | null;
  objectPanelAction?: ObjectPanelDashboardAction | null;
  source: WorkspaceLaunchSource;
  subWorkspaceMode?: string | null;
  routeGeneration?: number;
}>;

function normalizeObjectId(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeSubWorkspaceMode(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function buildWorkspaceLauncherMountKey(input: {
  workspaceId: ExecutiveWorkspaceId;
  dashboardMode: DashboardMode | null;
  dashboardContext: DashboardContext;
  subWorkspaceMode?: string | null;
}): string {
  const dashboardMode = input.dashboardMode ?? "overview";
  const mountTarget =
    input.dashboardContext === "advisory"
      ? "advisory_workspace"
      : input.dashboardContext === "governance"
        ? "governance_workspace"
        : dashboardMode !== "overview"
          ? "dashboard_runtime"
          : "loader_shell";

  return [
    input.workspaceId,
    mountTarget,
    dashboardMode,
    input.dashboardContext,
    normalizeSubWorkspaceMode(input.subWorkspaceMode) || "none",
  ].join(":");
}

export function buildWorkspaceLauncherRouteSignature(
  input: WorkspaceLauncherRouteSignatureInput
): WorkspaceLauncherRouteSignature {
  const dashboardContext =
    input.dashboardContext ??
    (input.dashboardMode ? mapDashboardModeToLegacyContext(input.dashboardMode) : "overview");

  return Object.freeze({
    workspaceId: input.workspaceId,
    dashboardContext,
    selectedObjectId: normalizeObjectId(input.selectedObjectId),
    objectPanelAction: input.objectPanelAction ?? null,
    source: input.source,
    mountKey: buildWorkspaceLauncherMountKey({
      workspaceId: input.workspaceId,
      dashboardMode: input.dashboardMode,
      dashboardContext,
      subWorkspaceMode: input.subWorkspaceMode,
    }),
    routeGeneration: input.routeGeneration ?? 0,
  });
}

export function serializeWorkspaceLauncherRouteSignature(
  signature: WorkspaceLauncherRouteSignature
): string {
  return JSON.stringify({
    workspaceId: signature.workspaceId,
    dashboardContext: signature.dashboardContext,
    selectedObjectId: signature.selectedObjectId,
    objectPanelAction: signature.objectPanelAction,
    source: signature.source,
    mountKey: signature.mountKey,
  });
}

export function areWorkspaceLauncherRouteSignaturesEqual(
  left: WorkspaceLauncherRouteSignature | null | undefined,
  right: WorkspaceLauncherRouteSignature | null | undefined
): boolean {
  if (!left || !right) return false;
  return serializeWorkspaceLauncherRouteSignature(left) === serializeWorkspaceLauncherRouteSignature(right);
}
