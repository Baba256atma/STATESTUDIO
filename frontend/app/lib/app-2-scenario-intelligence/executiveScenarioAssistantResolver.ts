/**
 * APP-2:11 — Executive Scenario Assistant Resolver.
 * Workspace view validation and assistant view resolution — read-only integration.
 */

import type { ExecutiveScenarioWorkspaceView } from "./executiveScenarioWorkspaceView.ts";
import { resolveExecutiveScenarioWorkspaceViewProbeExample } from "./executiveScenarioWorkspaceResolver.ts";
import {
  adaptExecutiveScenarioWorkspaceViewToAssistantView,
  ExecutiveScenarioAssistantAdapter,
} from "./executiveScenarioAssistantAdapter.ts";
import {
  createUnavailableExecutiveScenarioAssistantView,
  type ExecutiveScenarioAssistantAdapterRequest,
  type ExecutiveScenarioAssistantView,
} from "./executiveScenarioAssistantView.ts";
import { createExecutiveScenarioAssistantDiagnostic } from "./executiveScenarioAssistantDiagnostics.ts";

export type { ExecutiveScenarioAssistantAdapterRequest, ExecutiveScenarioAssistantView };

export function validateExecutiveScenarioAssistantWorkspaceView(
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
  return Object.freeze({ valid: true, message: "Workspace view valid for assistant adapter." });
}

export function resolveExecutiveScenarioAssistantView(
  request: ExecutiveScenarioAssistantAdapterRequest
): ExecutiveScenarioAssistantView {
  const validation = validateExecutiveScenarioAssistantWorkspaceView(
    request.workspaceView,
    request.workspaceId
  );

  if (!validation.valid) {
    const code = validation.message.includes("read-only")
      ? "missing_workspace_view"
      : validation.message.includes("unavailable")
        ? "adapter_failure"
        : validation.message.includes("Workspace")
          ? "invalid_conversation_context"
          : "adapter_failure";

    return createUnavailableExecutiveScenarioAssistantView(
      request.workspaceView.workspaceId,
      request.generatedAt,
      Object.freeze([
        createExecutiveScenarioAssistantDiagnostic(
          code,
          validation.message,
          request.generatedAt,
          Object.freeze({ workspaceId: request.workspaceId ?? null })
        ),
      ])
    );
  }

  return adaptExecutiveScenarioWorkspaceViewToAssistantView(request);
}

export function resolveExecutiveScenarioAssistantViewProbeExample(
  generatedAt: string = new Date(0).toISOString()
): ExecutiveScenarioAssistantView {
  const workspaceView = resolveExecutiveScenarioWorkspaceViewProbeExample(generatedAt);
  return resolveExecutiveScenarioAssistantView(
    Object.freeze({
      workspaceView,
      generatedAt,
      workspaceId: workspaceView.workspaceId,
    })
  );
}

export const ExecutiveScenarioAssistantIntegration = Object.freeze({
  resolveExecutiveScenarioAssistantView,
  resolveExecutiveScenarioAssistantViewProbeExample,
  validateExecutiveScenarioAssistantWorkspaceView,
  adapter: ExecutiveScenarioAssistantAdapter,
});
