import type { E2WorkspaceReadinessContext, WorkspaceStabilityGateReport } from "./e2ReadinessTypes";
import { logWorkspaceValidation } from "./e2ReadinessInstrumentation";

/** E2:50 Part 8 — technical stability gate. */
export function runWorkspaceStabilityGate(context: E2WorkspaceReadinessContext): WorkspaceStabilityGateReport {
  const issues: string[] = [];

  const renderStable = (context.unexpectedRerenderCount ?? 0) < 12;
  const panelStable = !context.panelJumpDetected;
  const layoutStable = !context.layoutShiftDetected;
  const selectionStable = context.selectionStable !== false;
  const cameraStable = context.cameraStable !== false;

  if (!renderStable) issues.push("Elevated rerender count detected.");
  if (!panelStable) issues.push("Panel jump detected.");
  if (!layoutStable) issues.push("Layout shift detected.");
  if (!selectionStable) issues.push("Selection stability issue reported.");
  if (!cameraStable) issues.push("Camera stability issue reported.");
  if (context.anchorFailureDetected) issues.push("HUD anchor failure detected.");

  const passed =
    renderStable &&
    panelStable &&
    layoutStable &&
    selectionStable &&
    cameraStable &&
    !context.anchorFailureDetected;

  const report: WorkspaceStabilityGateReport = {
    passed,
    renderStable,
    panelStable,
    layoutStable,
    selectionStable,
    cameraStable,
    issues,
  };

  logWorkspaceValidation("stabilityGate", { passed, issueCount: issues.length });
  return report;
}
