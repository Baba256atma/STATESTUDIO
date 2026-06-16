/**
 * SVIE:1:3 — Phase 1 certification runner.
 *
 * Certifies SVIE Foundation + Health Layer and validates no regression in certified
 * subsystems (MRP, Advisory, Governance, Assistant, workspace launcher, topology).
 */

import { runAssistantIntegrationQaMatrix } from "../../assistant-bridge/assistantIntegrationQaValidation.ts";
import { generateTopology } from "../topology/topologyEngine.ts";
import { resetTopologyDevLogsForTests } from "../topology/topologyDevLog.ts";
import { FLOW_NODE_SPACING } from "../topology/flowTopologyGenerator.ts";
import { HUB_RADIUS } from "../topology/hubTopologyGenerator.ts";
import type { TopologyNode } from "../topology/topologyTypes.ts";
import { runAdvisoryWorkspaceCertification } from "../../ui/mrpWorkspace/advisory/advisoryWorkspaceCertification.ts";
import { runGovernanceWorkspaceCertification } from "../../ui/mrpWorkspace/governance/governanceWorkspaceCertification.ts";
import {
  resetMrp5cFinalRuntimeCertificationForTests,
  runMrp5cFinalRuntimeCertification,
} from "../../ui/mrpWorkspace/mrp5cFinalRuntimeCertification.ts";
import {
  SVIE_HEALTH_COMPUTED_LOG,
  SVIE_HEALTH_VISUAL_PALETTE,
} from "./svieHealthVisualizationContract.ts";
import { deriveSvieObjectHealthLevel } from "./svieHealthDerivation.ts";
import { mapSvieHealthLevelToVisualStyle } from "./svieHealthVisualizationResolver.ts";
import {
  resetSvieHealthVisualizationRuntimeForTests,
  syncSvieHealthVisualization,
} from "./svieHealthVisualizationRuntime.ts";
import {
  SVIE_RUNTIME_BRAKE_LOG,
  SVIE_RUNTIME_FOUNDATION_TAG,
  SVIE_RUNTIME_READY_LOG,
} from "./svieRuntimeFoundationContract.ts";
import {
  buildSvieRuntimeSnapshot,
  guardSvieDashboardWrite,
  guardSvieRouteWrite,
  guardSvieWorkspaceWrite,
  initializeSvieRuntime,
  resetSvieRuntimeFoundationForTests,
} from "./svieRuntimeFoundation.ts";
import { readSceneObjectsFromJson, resolveSvieObjectState } from "./svieRuntimeFoundationResolver.ts";
import {
  SVIE_PHASE1_CERTIFICATION_TAG,
  SVIE_PHASE1_CERTIFICATION_VERSION,
  SVIE_PHASE1_FORBIDDEN_CONSOLE_PATTERNS,
  type SviePhase1CertificationGate,
  type SviePhase1CertificationResult,
  type SviePhase1ValidationCheck,
} from "./sviePhase1CertificationContract.ts";

const SAMPLE_SCENE_JSON = Object.freeze({
  state_vector: { volatility: 0.15, intensity: 0.25 },
  scene: Object.freeze({
    objects: Object.freeze([
      Object.freeze({ id: "machine-a", risk: 0.82, impact: 0.3, confidence: 0.4, status: "watch" }),
      Object.freeze({ id: "machine-b", risk: 0.12, confidence: 0.9, status: "opportunity" }),
      Object.freeze({ id: "machine-c", label: "Stable line" }),
    ]),
  }),
});

function buildTopologyNodes(count: number): TopologyNode[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `node-${index + 1}`,
    name: `Node ${index + 1}`,
    position: { x: index * 2, y: 0, z: index },
  }));
}

function resetSvieCertificationRuntime(): void {
  resetSvieRuntimeFoundationForTests();
  resetSvieHealthVisualizationRuntimeForTests();
  resetTopologyDevLogsForTests();
  resetMrp5cFinalRuntimeCertificationForTests();
}

function validateGateA(): SviePhase1CertificationGate {
  resetSvieRuntimeFoundationForTests();
  resetSvieHealthVisualizationRuntimeForTests();
  const failures: string[] = [];

  const init = initializeSvieRuntime();
  if (!init.initialized || !init.readOnly) {
    failures.push("SVIE runtime failed to initialize as read-only");
  }

  const objects = readSceneObjectsFromJson(SAMPLE_SCENE_JSON);
  if (objects.length !== 3) {
    failures.push(`Expected 3 scene objects, got ${objects.length}`);
  }

  const snapshot = buildSvieRuntimeSnapshot({
    sceneJson: SAMPLE_SCENE_JSON,
    selectedObjectId: "machine-c",
  });
  if (snapshot.objects.length !== 3) {
    failures.push("Runtime snapshot missing scene objects");
  }
  if (!snapshot.objects.every((entry) => entry.healthLevel && entry.visualPriority >= 0)) {
    failures.push("Objects missing health metadata");
  }

  const selected = snapshot.objects.find((entry) => entry.objectId === "machine-c");
  if (!selected) {
    failures.push("Selection priority check missing machine-c");
  }

  const baseState = resolveSvieObjectState(objects[2]!, { metrics: null, selectedObjectId: null });
  const selectedState = resolveSvieObjectState(objects[2]!, {
    metrics: null,
    selectedObjectId: "machine-c",
  });
  if (!baseState || !selectedState || selectedState.visualPriority <= baseState.visualPriority) {
    failures.push("Selection is read-only priority boost only");
  }

  const guards = [
    guardSvieDashboardWrite({ action: "setDashboardMode", source: "svie-phase1" }),
    guardSvieRouteWrite({ action: "requestWorkspaceLaunch", source: "svie-phase1" }),
    guardSvieWorkspaceWrite({ action: "commitExecutiveWorkspaceTransition", source: "svie-phase1" }),
  ];
  if (guards.some((guard) => guard.allowed)) {
    failures.push("SVIE write guards failed to block dashboard/route/workspace writes");
  }

  return Object.freeze({
    id: "A",
    name: "Runtime Foundation",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Scene loads; objects resolve health metadata; read-only guards block dashboard, route, and workspace writes; selection is read-only."
        : failures.join("; "),
  });
}

function validateGateB(): SviePhase1CertificationGate {
  resetSvieRuntimeFoundationForTests();
  resetSvieHealthVisualizationRuntimeForTests();
  const failures: string[] = [];

  const healthLevels = ["healthy", "warning", "critical", "opportunity"] as const;
  for (const level of healthLevels) {
    const style = mapSvieHealthLevelToVisualStyle(level);
    if (!style.showGlowLayer || !style.glowColor) {
      failures.push(`Missing glow style for ${level}`);
    }
    if (style.glowColor !== SVIE_HEALTH_VISUAL_PALETTE[level].glowColor) {
      failures.push(`Palette mismatch for ${level}`);
    }
  }

  const derivedCritical = deriveSvieObjectHealthLevel({
    id: "x",
    risk: 0.9,
    impact: 0.2,
    confidence: 0.3,
    status: "critical",
  });
  if (derivedCritical !== "critical") {
    failures.push("Health derivation failed for critical object");
  }

  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const first = syncSvieHealthVisualization({ sceneJson: SAMPLE_SCENE_JSON });
    const second = syncSvieHealthVisualization({ sceneJson: SAMPLE_SCENE_JSON });
    if (first !== second) {
      failures.push("Health sync did not cache snapshot for identical scene signature");
    }
    if (first.objectCount !== 3 || first.criticalCount < 1 || first.opportunityCount < 1) {
      failures.push("Health counts incomplete for sample scene");
    }
    if (!first.visualByObjectId["machine-a"]?.healthLevel) {
      failures.push("Objects missing health visual mapping");
    }
    if (logs.filter((entry) => entry === SVIE_HEALTH_COMPUTED_LOG).length !== 1) {
      failures.push("HealthComputed log should emit once per scene signature");
    }
  } finally {
    console.debug = originalDebug;
  }

  return Object.freeze({
    id: "B",
    name: "Health Layer",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "All objects receive health states and glow mapping; one recompute per scene signature."
        : failures.join("; "),
  });
}

function validateGateC(): SviePhase1CertificationGate {
  const result = runMrp5cFinalRuntimeCertification({ force: true });
  const failedGates = result.gates.filter((gate) => gate.status === "FAIL");
  const warnedGates = result.gates.filter((gate) => gate.status === "WARN");

  return Object.freeze({
    id: "C",
    name: "MRP Integrity",
    status: failedGates.length === 0 ? (warnedGates.length > 0 ? "WARN" : "PASS") : "FAIL",
    detail:
      failedGates.length === 0
        ? `MRP 5C certification ${result.finalStatus}; workspace launcher route signature and header/content parity verified.`
        : `MRP regression: failed gates ${failedGates.map((gate) => gate.id).join(", ")}`,
  });
}

function validateGateD(): SviePhase1CertificationGate {
  const result = runAdvisoryWorkspaceCertification({ force: true });
  const failedGates = result.gates.filter((gate) => gate.status === "FAIL");

  return Object.freeze({
    id: "D",
    name: "Advisory Integrity",
    status: result.verdict === "FAIL" || failedGates.length > 0 ? "FAIL" : "PASS",
    detail:
      failedGates.length === 0
        ? `Advisory workspace certification ${result.verdict}; normal lifecycle preserved.`
        : `Advisory regression: ${failedGates.map((gate) => gate.id).join(", ")}`,
  });
}

function validateGateE(): SviePhase1CertificationGate {
  const result = runGovernanceWorkspaceCertification({ force: true });
  const failedGates = result.gates.filter((gate) => gate.status === "FAIL");

  return Object.freeze({
    id: "E",
    name: "Governance Integrity",
    status: result.verdict === "FAIL" || failedGates.length > 0 ? "FAIL" : "PASS",
    detail:
      failedGates.length > 0
        ? `Governance regression: ${failedGates.map((gate) => gate.id).join(", ")}`
        : `Governance workspace certification ${result.verdict}; canonical lifecycle preserved.`,
  });
}

function validateGateF(): SviePhase1CertificationGate {
  const matrix = runAssistantIntegrationQaMatrix();
  const failed = matrix.results.filter((entry) => entry.status === "fail");

  return Object.freeze({
    id: "F",
    name: "Assistant Integrity",
    status: failed.length === 0 ? "PASS" : "FAIL",
    detail:
      failed.length === 0
        ? `Assistant integration QA matrix pass (${matrix.passCount}/${matrix.results.length}).`
        : `Assistant regression: ${failed.map((entry) => entry.id).join(", ")}`,
  });
}

function validateGateG(): SviePhase1CertificationGate {
  resetTopologyDevLogsForTests();
  const failures: string[] = [];

  const flow = generateTopology("flow", buildTopologyNodes(4));
  if (flow.topology !== "flow" || flow.nodes.length !== 4) {
    failures.push("Flow topology generation failed");
  }
  flow.nodes.forEach((node, index) => {
    const expected = { x: index * FLOW_NODE_SPACING, y: 0, z: 0 };
    if (
      node.position?.x !== expected.x ||
      node.position?.y !== expected.y ||
      node.position?.z !== expected.z
    ) {
      failures.push(`Flow node ${node.id} position drift`);
    }
  });

  const hub = generateTopology("hub", buildTopologyNodes(5));
  if (hub.topology !== "hub" || hub.nodes.length !== 5) {
    failures.push("Hub topology generation failed");
  }
  if (hub.nodes[0]?.position?.x !== 0 || hub.nodes[0]?.position?.y !== 0 || hub.nodes[0]?.position?.z !== 0) {
    failures.push("Hub center position drift");
  }
  const satelliteCount = hub.nodes.length - 1;
  for (let index = 0; index < satelliteCount; index += 1) {
    const angle = (Math.PI * 2 * index) / satelliteCount;
    const expected = {
      x: Math.round(HUB_RADIUS * Math.cos(angle) * 1000) / 1000,
      y: 0,
      z: Math.round(HUB_RADIUS * Math.sin(angle) * 1000) / 1000,
    };
    const actual = hub.nodes[index + 1]?.position;
    if (!actual || actual.x !== expected.x || actual.y !== expected.y || actual.z !== expected.z) {
      failures.push(`Hub satellite ${index + 1} position drift`);
      break;
    }
  }

  return Object.freeze({
    id: "G",
    name: "Topology Integrity",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Topology engine positions unchanged; SVIE health layer uses material/glow only (no coordinate writes)."
        : failures.join("; "),
  });
}

function validateGateH(): SviePhase1CertificationGate {
  resetSvieRuntimeFoundationForTests();
  resetSvieHealthVisualizationRuntimeForTests();
  const failures: string[] = [];

  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    let lastSnapshot = syncSvieHealthVisualization({ sceneJson: SAMPLE_SCENE_JSON });
    for (let index = 0; index < 24; index += 1) {
      const next = syncSvieHealthVisualization({ sceneJson: SAMPLE_SCENE_JSON });
      if (next !== lastSnapshot) {
        failures.push(`Health snapshot recomputed on identical signature at iteration ${index}`);
        break;
      }
      lastSnapshot = next;
    }
    if (logs.filter((entry) => entry === SVIE_HEALTH_COMPUTED_LOG).length !== 1) {
      failures.push("Expected single HealthComputed log across repeated sync calls");
    }
    if (logs.filter((entry) => entry === SVIE_RUNTIME_READY_LOG).length !== 1) {
      failures.push("Expected single RuntimeReady log across repeated sync calls");
    }
  } finally {
    console.debug = originalDebug;
  }

  return Object.freeze({
    id: "H",
    name: "Performance",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "SVIE health sync dedupes identical scene signatures; no per-frame recompute pattern detected."
        : failures.join("; "),
  });
}

function buildValidationChecks(gates: readonly SviePhase1CertificationGate[]): readonly SviePhase1ValidationCheck[] {
  const gate = (id: SviePhase1CertificationGate["id"]) => gates.find((entry) => entry.id === id);
  const pass = (id: SviePhase1CertificationGate["id"]) =>
    gate(id)?.status === "PASS" || gate(id)?.status === "WARN";

  return Object.freeze([
    Object.freeze({
      id: "scene_loads",
      label: "Scene loads normally",
      status: pass("A") ? "PASS" : "FAIL",
      detail: gate("A")?.detail ?? "Missing gate A",
    }),
    Object.freeze({
      id: "objects_receive_health",
      label: "Objects receive health states",
      status: pass("B") ? "PASS" : "FAIL",
      detail: gate("B")?.detail ?? "Missing gate B",
    }),
    Object.freeze({
      id: "topology_unchanged",
      label: "Topology remains unchanged",
      status: pass("G") ? "PASS" : "FAIL",
      detail: gate("G")?.detail ?? "Missing gate G",
    }),
    Object.freeze({
      id: "object_selection_unchanged",
      label: "Object selection remains unchanged",
      status: pass("A") ? "PASS" : "FAIL",
      detail: "SVIE reads selectedObjectId for visual priority only; no selection write APIs exported.",
    }),
    Object.freeze({
      id: "advisory_workspace",
      label: "Advisory workspace still works",
      status: pass("D") ? "PASS" : "FAIL",
      detail: gate("D")?.detail ?? "Missing gate D",
    }),
    Object.freeze({
      id: "governance_workspace",
      label: "Governance workspace still works",
      status: pass("E") ? "PASS" : "FAIL",
      detail: gate("E")?.detail ?? "Missing gate E",
    }),
    Object.freeze({
      id: "mrp_certified",
      label: "MRP remains certified",
      status: pass("C") ? "PASS" : "FAIL",
      detail: gate("C")?.detail ?? "Missing gate C",
    }),
    Object.freeze({
      id: "assistant_certified",
      label: "Assistant remains certified",
      status: pass("F") ? "PASS" : "FAIL",
      detail: gate("F")?.detail ?? "Missing gate F",
    }),
    Object.freeze({
      id: "workspace_launcher_certified",
      label: "Workspace launcher remains certified",
      status: pass("C") ? "PASS" : "FAIL",
      detail: "Validated via MRP 5C gate D (full route signature brake + cross-workspace launches).",
    }),
    Object.freeze({
      id: "no_route_regressions",
      label: "No route regressions",
      status: pass("C") && pass("D") && pass("E") ? "PASS" : "FAIL",
      detail: "MRP 5C, Advisory, and Governance certification suites report no route regressions.",
    }),
  ]);
}

function auditConsoleOutput(entries: readonly string[]): Readonly<{
  forbiddenPatterns: readonly string[];
  violations: readonly string[];
  status: "PASS" | "FAIL";
}> {
  const violations = SVIE_PHASE1_FORBIDDEN_CONSOLE_PATTERNS.filter((pattern) =>
    entries.some((entry) => entry.includes(pattern))
  );
  return Object.freeze({
    forbiddenPatterns: SVIE_PHASE1_FORBIDDEN_CONSOLE_PATTERNS,
    violations: Object.freeze([...violations]),
    status: violations.length === 0 ? "PASS" : "FAIL",
  });
}

let lastResult: SviePhase1CertificationResult | null = null;

export function resetSviePhase1CertificationForTests(): void {
  lastResult = null;
  resetSvieCertificationRuntime();
}

export function runSviePhase1Certification(options?: {
  force?: boolean;
}): SviePhase1CertificationResult {
  if (lastResult && !options?.force) {
    return lastResult;
  }

  resetSvieCertificationRuntime();

  const consoleEntries: string[] = [];
  const originalWarn = console.warn;
  const originalError = console.error;
  console.warn = (...args: unknown[]) => {
    consoleEntries.push(args.map((entry) => String(entry)).join(" "));
    originalWarn.apply(console, args as []);
  };
  console.error = (...args: unknown[]) => {
    consoleEntries.push(args.map((entry) => String(entry)).join(" "));
    originalError.apply(console, args as []);
  };

  let gates: readonly SviePhase1CertificationGate[];
  try {
    gates = Object.freeze([
      validateGateA(),
      validateGateB(),
      validateGateC(),
      validateGateD(),
      validateGateE(),
      validateGateF(),
      validateGateG(),
      validateGateH(),
    ]);
  } finally {
    console.warn = originalWarn;
    console.error = originalError;
  }

  const consoleAudit = auditConsoleOutput(consoleEntries);
  const validationChecks = buildValidationChecks(gates);
  const failedGates = gates.filter((gate) => gate.status === "FAIL");
  const warnedGates = gates.filter((gate) => gate.status === "WARN");
  const failedChecks = validationChecks.filter((check) => check.status === "FAIL");

  const runtimeWarnings: string[] = [];
  if (warnedGates.length > 0) {
    runtimeWarnings.push(`MRP integrity gate reported warnings: ${warnedGates.map((gate) => gate.id).join(", ")}`);
  }
  if (consoleEntries.some((entry) => entry.includes(SVIE_RUNTIME_BRAKE_LOG))) {
    runtimeWarnings.push("Expected [SVIE][Brake] entries during write-guard validation only.");
  }
  runtimeWarnings.push(
    "Governance is not in OBJECT_PANEL_DASHBOARD_ACTIONS; routed via workspace launcher / left nav."
  );

  const certified =
    failedGates.length === 0 && failedChecks.length === 0 && consoleAudit.status === "PASS";
  const finalStatus: SviePhase1CertificationResult["finalStatus"] = !certified
    ? "FAIL"
    : warnedGates.length > 0 || runtimeWarnings.length > 1
      ? "PASS WITH WARNINGS"
      : "PASS";

  const result = Object.freeze({
    tag: SVIE_PHASE1_CERTIFICATION_TAG,
    version: SVIE_PHASE1_CERTIFICATION_VERSION,
    gates,
    validationChecks,
    consoleAudit,
    runtimeWarnings: Object.freeze([...runtimeWarnings]),
    certified,
    finalStatus,
  });

  lastResult = result;
  return result;
}

export const SVIE_PHASE1_FOUNDATION_TAG = SVIE_RUNTIME_FOUNDATION_TAG;
