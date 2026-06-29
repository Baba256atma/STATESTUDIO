/**
 * APP-2:10 — Executive Scenario Workspace Resolver.
 * Package validation and workspace view resolution — read-only integration.
 */

import type { ExecutiveScenarioPackage } from "./executiveScenarioPackage.ts";
import { resolveExecutiveScenarioPackageProbeExample } from "./executiveScenarioPackageResolver.ts";
import {
  adaptExecutiveScenarioPackageToWorkspaceView,
  ExecutiveScenarioWorkspaceAdapter,
} from "./executiveScenarioWorkspaceAdapter.ts";
import {
  createUnavailableExecutiveScenarioWorkspaceView,
  type ExecutiveScenarioWorkspaceAdapterRequest,
  type ExecutiveScenarioWorkspaceView,
} from "./executiveScenarioWorkspaceView.ts";
import { createExecutiveScenarioWorkspaceDiagnostic } from "./executiveScenarioWorkspaceDiagnostics.ts";

export type { ExecutiveScenarioWorkspaceAdapterRequest, ExecutiveScenarioWorkspaceView };

export function validateExecutiveScenarioWorkspacePackage(
  pkg: ExecutiveScenarioPackage,
  workspaceId: string
): Readonly<{ valid: boolean; message: string }> {
  if (!pkg.readOnly) {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioPackage must be read-only." });
  }
  if (pkg.packageVersion !== "APP-2/9.5") {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioPackage version mismatch." });
  }
  if (pkg.workspaceId !== workspaceId.trim()) {
    return Object.freeze({ valid: false, message: "Workspace isolation violation." });
  }
  return Object.freeze({ valid: true, message: "Package valid for workspace adapter." });
}

export function resolveExecutiveScenarioWorkspaceView(
  request: ExecutiveScenarioWorkspaceAdapterRequest
): ExecutiveScenarioWorkspaceView {
  const validation = validateExecutiveScenarioWorkspacePackage(
    request.package,
    request.workspaceId
  );

  if (!validation.valid) {
    const code = validation.message.includes("read-only")
      ? "missing_package"
      : validation.message.includes("version")
        ? "version_mismatch"
        : validation.message.includes("Workspace")
          ? "workspace_isolation_failure"
          : "missing_package";

    return createUnavailableExecutiveScenarioWorkspaceView(
      request.workspaceId,
      request.generatedAt,
      Object.freeze([
        createExecutiveScenarioWorkspaceDiagnostic(
          code,
          validation.message,
          request.generatedAt,
          Object.freeze({ workspaceId: request.workspaceId })
        ),
      ])
    );
  }

  return adaptExecutiveScenarioPackageToWorkspaceView(request);
}

export function resolveExecutiveScenarioWorkspaceViewProbeExample(
  generatedAt: string = new Date(0).toISOString()
): ExecutiveScenarioWorkspaceView {
  const pkg = resolveExecutiveScenarioPackageProbeExample(generatedAt);
  return resolveExecutiveScenarioWorkspaceView(
    Object.freeze({
      package: pkg,
      workspaceId: pkg.workspaceId,
      selectedScenarioId: pkg.scenarioId,
      refreshState: "synchronized",
      generatedAt,
    })
  );
}

export const ExecutiveScenarioWorkspaceIntegration = Object.freeze({
  resolveExecutiveScenarioWorkspaceView,
  resolveExecutiveScenarioWorkspaceViewProbeExample,
  validateExecutiveScenarioWorkspacePackage,
  adapter: ExecutiveScenarioWorkspaceAdapter,
});
