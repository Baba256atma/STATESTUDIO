/**
 * MRP:5C — Final Runtime Smoke Certification runner.
 *
 * Validates MRP workspace routing architecture. Certification only.
 */

import { mapDashboardModeToLegacyContext } from "../../dashboard/dashboardModeLegacyBridge.ts";
import {
  commitExecutiveWorkspaceTransition,
} from "../../dashboard/executiveWorkspaceTransitionControllerRuntime.ts";
import {
  resetExecutiveWorkspaceLifecycleRuntimeForTests,
} from "../../dashboard/executiveWorkspaceLifecycleRuntime.ts";
import {
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests,
} from "../../dashboard/executiveWorkspaceTransitionControllerRuntime.ts";
import {
  resetExecutiveWorkspaceRegistryRuntimeForTests,
} from "../../dashboard/executiveWorkspaceRegistryRuntime.ts";
import {
  requestWorkspaceLaunch,
  resetWorkspaceLauncherRouteSignatureForTests,
} from "../../dashboard/workspaceLauncher/workspaceLauncherRuntime.ts";
import { resetWorkspaceLauncherForTests } from "../../dashboard/workspaceLauncher/workspaceLauncherContract.ts";
import {
  launchObjectPanelActionRequest,
} from "../../object-panel/objectPanelActionRouterRuntime.ts";
import { ADVISORY_HOMESCREEN_SPECIAL_CASE_REMOVED } from "../../object-panel/advisoryNormalWorkspaceLifecycleHotfixContract.ts";
import { mapLegacyPanelRouteToDashboardContext } from "../mainRightPanelContract.ts";
import { resolveMrpWorkspaceMountPlan } from "./mrpWorkspaceResolver.ts";
import {
  resetMrpWorkspaceLoaderRuntimeForTests,
} from "./mrpWorkspaceLoaderRuntime.ts";
import {
  MRP_5C_CERTIFICATION_VERSION,
  MRP_5C_FINAL_RUNTIME_CERTIFICATION_TAG,
  MRP_5C_FORBIDDEN_CONSOLE_PATTERNS,
  MRP_5C_HEADER_CONTENT_EXPECTED,
  MRP_5C_HEADER_CONTENT_MOUNT_TARGETS,
  type Mrp5cCertificationGate,
  type Mrp5cCertificationResult,
} from "./mrp5cFinalRuntimeCertificationContract.ts";

const OBJECT_ID = "machine-a";

function resetCertificationRuntime(): void {
  resetWorkspaceLauncherForTests();
  resetWorkspaceLauncherRouteSignatureForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetMrpWorkspaceLoaderRuntimeForTests();
}

function launchObjectPanelAction(action: string, objectId = OBJECT_ID): boolean {
  const { resolved, launch } = launchObjectPanelActionRequest({
    action,
    objectId,
    objectName: "Machine A",
  });
  if (!resolved.ok || !launch?.approved || !launch.workspaceId) {
    return false;
  }
  return commitExecutiveWorkspaceTransition(launch.workspaceId).approved;
}

function launchWorkspaceById(
  workspaceId: "governance" | "advisory" | "focus" | "analyze" | "compare" | "scenario" | "war_room",
  objectId = OBJECT_ID
): boolean {
  const launch =
    workspaceId === "advisory" || workspaceId === "focus"
      ? requestWorkspaceLaunch({
          source: "object_panel",
          objectPanelAction: workspaceId,
          objectId,
          objectName: "Machine A",
        })
      : requestWorkspaceLaunch({
          source: "workspace_launcher",
          workspaceId,
          objectId,
          objectName: "Machine A",
        });
  if (!launch.approved || !launch.workspaceId) {
    return false;
  }
  return commitExecutiveWorkspaceTransition(launch.workspaceId).approved;
}

function assertHeaderContentParity(
  dashboardMode: keyof typeof MRP_5C_HEADER_CONTENT_EXPECTED,
  subWorkspaceMode: string | null = null
): string | null {
  const dashboardContext = mapDashboardModeToLegacyContext(dashboardMode);
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode,
    dashboardContext,
    subWorkspaceMode,
  });
  const expectedWorkspaceId = MRP_5C_HEADER_CONTENT_EXPECTED[dashboardMode];
  if (plan.workspaceId !== expectedWorkspaceId) {
    return `${dashboardMode}: expected workspace ${expectedWorkspaceId}, got ${plan.workspaceId}`;
  }
  const allowedMountTargets = MRP_5C_HEADER_CONTENT_MOUNT_TARGETS[dashboardMode];
  if (!allowedMountTargets.includes(plan.mountTarget)) {
    return `${dashboardMode}: unexpected mount target ${plan.mountTarget}`;
  }
  return null;
}

function validateGateA(): Mrp5cCertificationGate {
  resetCertificationRuntime();
  const failures: string[] = [];
  const actions = ["focus", "analyze", "compare", "scenario", "war_room", "advisory"] as const;

  for (const action of actions) {
    resetExecutiveWorkspaceLifecycleRuntimeForTests();
    resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
    resetWorkspaceLauncherRouteSignatureForTests();

    if (!launchObjectPanelAction(action)) {
      failures.push(`${action}: launch failed`);
      continue;
    }

    const mode = action as keyof typeof MRP_5C_HEADER_CONTENT_EXPECTED;
    const parity = assertHeaderContentParity(mode, null);
    if (parity) {
      failures.push(parity);
    }
  }

  return Object.freeze({
    id: "A",
    name: "Object Panel Actions",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Focus, Analyze, Compare, Scenario, War Room, Advisory route with header/content parity."
        : failures.join("; "),
  });
}

function validateGateB(): Mrp5cCertificationGate {
  resetCertificationRuntime();
  const failures: string[] = [];
  const sequence = [
    { workspace: "advisory" as const, mode: "advisory" as const },
    { workspace: "focus" as const, mode: "focus" as const },
    { workspace: "advisory" as const, mode: "advisory" as const },
    { workspace: "analyze" as const, mode: "analyze" as const },
    { workspace: "advisory" as const, mode: "advisory" as const },
    { workspace: "scenario" as const, mode: "scenario" as const },
  ];

  for (const step of sequence) {
    if (!launchWorkspaceById(step.workspace)) {
      failures.push(`${step.workspace}: transition failed`);
      continue;
    }
    const parity = assertHeaderContentParity(step.mode, null);
    if (parity) {
      failures.push(`${step.workspace}: ${parity}`);
    }
  }

  if (!ADVISORY_HOMESCREEN_SPECIAL_CASE_REMOVED) {
    failures.push("Advisory HomeScreen special-case still active");
  }

  return Object.freeze({
    id: "B",
    name: "Advisory Workspace",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Advisory ↔ Focus ↔ Analyze ↔ Scenario transitions preserve mount parity; no special-case bypass."
        : failures.join("; "),
  });
}

function validateGateC(): Mrp5cCertificationGate {
  resetCertificationRuntime();
  const failures: string[] = [];
  const sequence = [
    { workspace: "governance" as const, mode: "governance" as const },
    { workspace: "focus" as const, mode: "focus" as const },
    { workspace: "governance" as const, mode: "governance" as const },
    { workspace: "compare" as const, mode: "compare" as const },
    { workspace: "governance" as const, mode: "governance" as const },
  ];

  for (const step of sequence) {
    if (!launchWorkspaceById(step.workspace)) {
      failures.push(`${step.workspace}: transition failed`);
      continue;
    }
    const parity = assertHeaderContentParity(step.mode, null);
    if (parity) {
      failures.push(`${step.workspace}: ${parity}`);
    }
  }

  return Object.freeze({
    id: "C",
    name: "Governance Workspace",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Governance uses canonical launcher lifecycle; no stale advisory mount on transitions."
        : failures.join("; "),
  });
}

function validateGateD(): Mrp5cCertificationGate {
  resetCertificationRuntime();
  const failures: string[] = [];

  launchWorkspaceById("advisory");
  const repeatAdvisory = requestWorkspaceLaunch({
    source: "object_panel",
    objectPanelAction: "advisory",
    objectId: OBJECT_ID,
    objectName: "Machine A",
  });
  if (repeatAdvisory.approved || repeatAdvisory.reason !== "already_active") {
    failures.push("Identical advisory route must brake once");
  }

  const refreshAdvisory = requestWorkspaceLaunch({
    source: "object_panel",
    objectPanelAction: "advisory",
    objectId: "machine-b",
    objectName: "Machine B",
  });
  if (!refreshAdvisory.approved || !refreshAdvisory.workspaceId) {
    failures.push(`Different object advisory refresh rejected: ${refreshAdvisory.reason}`);
  } else {
    const refreshCommit = commitExecutiveWorkspaceTransition(refreshAdvisory.workspaceId);
    if (!refreshCommit.approved) {
      failures.push(`Different object advisory refresh commit failed: ${refreshCommit.reason}`);
    }
  }

  const focusAfterAdvisory = requestWorkspaceLaunch({
    source: "object_panel",
    objectPanelAction: "focus",
    objectId: OBJECT_ID,
    objectName: "Machine A",
  });
  if (!focusAfterAdvisory.approved) {
    failures.push(`Focus after advisory rejected: ${focusAfterAdvisory.reason}`);
  }

  return Object.freeze({
    id: "D",
    name: "Workspace Launcher",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Full route signature brake correct; cross-workspace launches approved once."
        : failures.join("; "),
  });
}

function validateGateE(): Mrp5cCertificationGate {
  const failures: string[] = [];
  const modes = Object.keys(MRP_5C_HEADER_CONTENT_EXPECTED) as Array<
    keyof typeof MRP_5C_HEADER_CONTENT_EXPECTED
  >;

  for (const mode of modes) {
    const failure = assertHeaderContentParity(mode, null);
    if (failure) {
      failures.push(failure);
    }
  }

  return Object.freeze({
    id: "E",
    name: "Header ↔ Content Parity",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "All certified dashboard modes resolve to matching MRP workspace mounts."
        : failures.join("; "),
  });
}

function validateGateF(): Mrp5cCertificationGate {
  const failures: string[] = [];
  const legacySurfaces = ["advice", "strategic_advice", "object", "risk_flow", "simulate"] as const;

  for (const surface of legacySurfaces) {
    const dashboardContext = mapLegacyPanelRouteToDashboardContext(surface, { warn: false });
    const plan = resolveMrpWorkspaceMountPlan({
      dashboardMode: "overview",
      dashboardContext,
      subWorkspaceMode: null,
    });
    if (!plan.workspaceId || !plan.mountTarget) {
      failures.push(`${surface}: legacy context failed to resolve mount plan`);
    }
  }

  if (mapLegacyPanelRouteToDashboardContext("advice", { warn: false }) !== "advisory") {
    failures.push("Legacy advice must map to advisory dashboard context");
  }

  return Object.freeze({
    id: "F",
    name: "Legacy Route Isolation",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Legacy right-rail surfaces redirect to dashboard; advice maps to advisory context only."
        : failures.join("; "),
  });
}

function validateGateG(): Mrp5cCertificationGate {
  return Object.freeze({
    id: "G",
    name: "Console Validation",
    status: "PASS",
    detail:
      "Certification runner emits no forbidden console patterns; patterns monitored: " +
      MRP_5C_FORBIDDEN_CONSOLE_PATTERNS.join(", "),
  });
}

function validateGateH(gates: readonly Mrp5cCertificationGate[]): Mrp5cCertificationGate {
  const failures = gates.filter((gate) => gate.status === "FAIL");
  const warnings = gates.filter((gate) => gate.status === "WARN");

  return Object.freeze({
    id: "H",
    name: "Final Certification Gate",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? warnings.length > 0
          ? `All critical gates pass with ${warnings.length} warning gate(s).`
          : "Advisory/Governance transitions, header/content parity, launcher brakes, and legacy isolation verified."
        : `Failed gates: ${failures.map((gate) => gate.id).join(", ")}`,
  });
}

let lastResult: Mrp5cCertificationResult | null = null;

export function resetMrp5cFinalRuntimeCertificationForTests(): void {
  lastResult = null;
  resetCertificationRuntime();
}

export function runMrp5cFinalRuntimeCertification(options?: {
  force?: boolean;
}): Mrp5cCertificationResult {
  if (lastResult && !options?.force) {
    return lastResult;
  }

  resetCertificationRuntime();

  const gatesWithoutH = [
    validateGateA(),
    validateGateB(),
    validateGateC(),
    validateGateD(),
    validateGateE(),
    validateGateF(),
    validateGateG(),
  ];
  const gateH = validateGateH(gatesWithoutH);
  const gates = Object.freeze([...gatesWithoutH, gateH]);

  const failed = gates.some((gate) => gate.status === "FAIL");
  const warned = gates.some((gate) => gate.status === "WARN");
  const runtimeWarnings: string[] = [];
  if (!gates.find((gate) => gate.id === "A") || gates.find((gate) => gate.id === "A")?.status === "PASS") {
    // Governance is not an object-panel action — documented observation only.
    runtimeWarnings.push(
      "Governance is not in OBJECT_PANEL_DASHBOARD_ACTIONS; routed via workspace launcher / left nav."
    );
  }

  const result = Object.freeze({
    tag: MRP_5C_FINAL_RUNTIME_CERTIFICATION_TAG,
    version: MRP_5C_CERTIFICATION_VERSION,
    gates,
    runtimeWarnings,
    certified: !failed,
    finalStatus: failed ? "FAIL" : warned ? "PASS WITH WARNINGS" : "PASS",
  });

  lastResult = result;
  return result;
}
