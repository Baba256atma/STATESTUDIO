/**
 * APP-2:12 — Executive Scenario Dashboard Resolver.
 * Workspace view validation and dashboard view resolution — read-only integration.
 */

import type { ExecutiveScenarioWorkspaceView } from "./executiveScenarioWorkspaceView.ts";
import { resolveExecutiveScenarioWorkspaceViewProbeExample } from "./executiveScenarioWorkspaceResolver.ts";
import {
  adaptExecutiveScenarioWorkspaceViewToDashboardView,
  ExecutiveScenarioDashboardAdapter,
} from "./executiveScenarioDashboardAdapter.ts";
import {
  createUnavailableExecutiveScenarioDashboardView,
  type ExecutiveScenarioDashboardAdapterRequest,
  type ExecutiveScenarioDashboardView,
} from "./executiveScenarioDashboardView.ts";
import { createExecutiveScenarioDashboardDiagnostic } from "./executiveScenarioDashboardDiagnostics.ts";

export type { ExecutiveScenarioDashboardAdapterRequest, ExecutiveScenarioDashboardView };

export function validateExecutiveScenarioDashboardWorkspaceView(
  view: ExecutiveScenarioWorkspaceView,
  workspaceId?: string
): Readonly<{ valid: boolean; message: string }> {
  if (!view.readOnly) {
    return Object.freeze({
      valid: false,
      message: "ExecutiveScenarioWorkspaceView must be read-only.",
    });
  }
  if (view.adapterVersion !== "APP-2/10") {
    return Object.freeze({
      valid: false,
      message: "ExecutiveScenarioWorkspaceView adapter version mismatch.",
    });
  }
  if (workspaceId !== undefined && view.workspaceId !== workspaceId.trim()) {
    return Object.freeze({ valid: false, message: "Workspace isolation violation." });
  }
  if (view.status === "unavailable") {
    return Object.freeze({
      valid: false,
      message: "ExecutiveScenarioWorkspaceView is unavailable.",
    });
  }
  return Object.freeze({ valid: true, message: "Workspace view valid for dashboard adapter." });
}

export function resolveExecutiveScenarioDashboardView(
  request: ExecutiveScenarioDashboardAdapterRequest
): ExecutiveScenarioDashboardView {
  const validation = validateExecutiveScenarioDashboardWorkspaceView(
    request.workspaceView,
    request.workspaceId
  );

  if (!validation.valid) {
    const code = validation.message.includes("read-only")
      ? "missing_workspace_view"
      : validation.message.includes("unavailable")
        ? "adapter_failure"
        : validation.message.includes("Workspace")
          ? "adapter_failure"
          : "adapter_failure";

    return createUnavailableExecutiveScenarioDashboardView(
      request.workspaceView.workspaceId,
      request.generatedAt,
      Object.freeze([
        createExecutiveScenarioDashboardDiagnostic(
          code,
          validation.message,
          request.generatedAt,
          Object.freeze({ workspaceId: request.workspaceId ?? null })
        ),
      ])
    );
  }

  return adaptExecutiveScenarioWorkspaceViewToDashboardView(request);
}

export function resolveExecutiveScenarioDashboardViewProbeExample(
  generatedAt: string = new Date(0).toISOString()
): ExecutiveScenarioDashboardView {
  const workspaceView = resolveExecutiveScenarioWorkspaceViewProbeExample(generatedAt);
  return resolveExecutiveScenarioDashboardView(
    Object.freeze({
      workspaceView,
      generatedAt,
      workspaceId: workspaceView.workspaceId,
    })
  );
}

export const ExecutiveScenarioDashboardIntegration = Object.freeze({
  resolveExecutiveScenarioDashboardView,
  resolveExecutiveScenarioDashboardViewProbeExample,
  validateExecutiveScenarioDashboardWorkspaceView,
  adapter: ExecutiveScenarioDashboardAdapter,
});
