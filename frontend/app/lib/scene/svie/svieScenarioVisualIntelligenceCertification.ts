/**
 * SVIE:4:8 — Scenario visual intelligence certification runner.
 *
 * Certifies SVIE:4:1 through 4:7 without introducing routing, workspace,
 * topology, camera, or object movement writes.
 */

import { generateTopology } from "../topology/topologyEngine.ts";
import { FLOW_NODE_SPACING } from "../topology/flowTopologyGenerator.ts";
import { resetTopologyDevLogsForTests } from "../topology/topologyDevLog.ts";
import {
  resetSvieAdvisoryVisualIntelligenceCertificationForTests,
  runSvieAdvisoryVisualIntelligenceCertification,
} from "./svieAdvisoryVisualIntelligenceCertification.ts";
import {
  resetSvieExecutiveFutureStoryLayerRuntimeForTests,
  syncExecutiveFutureStoryLayer,
} from "./svieExecutiveFutureStoryLayerRuntime.ts";
import {
  resetSvieFutureStateVisualizationRuntimeForTests,
  syncFutureStateOverlay,
} from "./svieFutureStateVisualizationRuntime.ts";
import {
  resetSvieScenarioComparisonLayerRuntimeForTests,
  syncScenarioComparisonLayer,
} from "./svieScenarioComparisonLayerRuntime.ts";
import {
  resetSvieScenarioConfidenceLayerRuntimeForTests,
  syncScenarioConfidenceLayer,
} from "./svieScenarioConfidenceLayerRuntime.ts";
import {
  resetSvieScenarioDeltaVisualizationRuntimeForTests,
  syncScenarioDeltaOverlay,
} from "./svieScenarioDeltaVisualizationRuntime.ts";
import {
  resetSvieScenarioImpactVisualizationRuntimeForTests,
  syncScenarioImpactVisualization,
} from "./svieScenarioImpactVisualizationRuntime.ts";
import { buildScenarioImpactChain } from "./svieScenarioImpactChainBuilder.ts";
import { readScenariosFromSceneJson } from "./svieScenarioLinkResolver.ts";
import {
  guardSvieScenarioLinkRouteWrite,
  guardSvieScenarioLinkWorkspaceWrite,
  resetSvieScenarioLinkRuntimeForTests,
  syncSvieScenarioLinks,
} from "./svieScenarioLinkRuntime.ts";
import { resetSvieRuntimeFoundationForTests } from "./svieRuntimeFoundation.ts";
import {
  SVIE_CERTIFICATION_EXECUTIVE_FUTURE_STORY_LOG,
  SVIE_CERTIFICATION_FUTURE_STATE_LOG,
  SVIE_CERTIFICATION_PHASE4_EXECUTIVE_READY_LOG,
  SVIE_CERTIFICATION_PHASE4_LIFECYCLE_LOG,
  SVIE_CERTIFICATION_PHASE4_PERFORMANCE_LOG,
  SVIE_CERTIFICATION_PHASE4_RENDER_LOG,
  SVIE_CERTIFICATION_PHASE4_SYNC_LOG,
  SVIE_CERTIFICATION_SCENARIO_COMPARISON_LOG,
  SVIE_CERTIFICATION_SCENARIO_CONFIDENCE_LOG,
  SVIE_CERTIFICATION_SCENARIO_DELTA_LOG,
  SVIE_CERTIFICATION_SCENARIO_IMPACT_LOG,
  SVIE_CERTIFICATION_SCENARIO_LINK_LOG,
  SVIE_PHASE4_COMPLETE_TAG,
  SVIE_PHASE4_FORBIDDEN_VISUAL_KEYS,
  SVIE_PHASE4_PERFORMANCE_OBJECT_COUNTS,
  SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_FREEZE_TAGS,
  SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_TAG,
  SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_VERSION,
  type SvieScenarioVisualIntelligenceCertificationGate,
  type SvieScenarioVisualIntelligenceCertificationResult,
} from "./svieScenarioVisualIntelligenceCertificationContract.ts";

const CERT_SAMPLE_SCENE = Object.freeze({
  scene: Object.freeze({
    objects: Object.freeze([
      Object.freeze({ id: "supplier", name: "Supplier" }),
      Object.freeze({ id: "inventory", name: "Inventory" }),
      Object.freeze({ id: "production", name: "Production" }),
      Object.freeze({ id: "revenue", name: "Revenue" }),
      Object.freeze({ id: "market", name: "Market Impact" }),
    ]),
  }),
  svie: Object.freeze({
    scenarios: Object.freeze([
      Object.freeze({
        scenarioId: "scenario:a-supplier-failure",
        label: "Supplier Failure",
        scenarioImpactSteps: Object.freeze([
          "Supplier",
          "Inventory",
          "Production",
          "Revenue",
          "Market Impact",
        ]),
        objectImpacts: Object.freeze([
          Object.freeze({ objectId: "supplier", beforeRisk: 0.22, afterRisk: 0.91 }),
          Object.freeze({ objectId: "inventory", beforeRisk: 0.26, afterRisk: 0.78 }),
          Object.freeze({ objectId: "production", beforeActivity: 0.84, afterActivity: 0.5 }),
          Object.freeze({ objectId: "revenue", beforeRisk: 0.34, afterRisk: 0.69 }),
          Object.freeze({ objectId: "market", beforeRisk: 0.18, afterRisk: 0.63 }),
        ]),
        confidence: 0.92,
      }),
      Object.freeze({
        scenarioId: "scenario:b-recovery-plan",
        label: "Recovery Plan",
        scenarioImpactSteps: Object.freeze(["Supplier", "Inventory", "Production"]),
        objectImpacts: Object.freeze([
          Object.freeze({ objectId: "supplier", beforeRisk: 0.72, afterRisk: 0.48 }),
          Object.freeze({ objectId: "inventory", beforeRisk: 0.78, afterRisk: 0.44 }),
          Object.freeze({ objectId: "production", beforeActivity: 0.55, afterActivity: 0.75 }),
        ]),
        confidence: 0.76,
      }),
      Object.freeze({
        scenarioId: "scenario:c-demand-shift",
        label: "Demand Shift",
        linkedLabels: Object.freeze(["Production", "Revenue", "Market Impact"]),
        objectImpacts: Object.freeze([
          Object.freeze({ objectId: "production", beforeRisk: 0.38, afterRisk: 0.52 }),
          Object.freeze({ objectId: "revenue", beforeRisk: 0.48, afterRisk: 0.48 }),
          Object.freeze({ objectId: "market", beforeRisk: 0.4, afterRisk: 0.55 }),
        ]),
        confidence: 0.58,
      }),
    ]),
  }),
});

function resetPhase4CertificationRuntime(): void {
  resetSvieRuntimeFoundationForTests();
  resetSvieScenarioLinkRuntimeForTests();
  resetSvieFutureStateVisualizationRuntimeForTests();
  resetSvieScenarioDeltaVisualizationRuntimeForTests();
  resetSvieScenarioImpactVisualizationRuntimeForTests();
  resetSvieScenarioComparisonLayerRuntimeForTests();
  resetSvieScenarioConfidenceLayerRuntimeForTests();
  resetSvieExecutiveFutureStoryLayerRuntimeForTests();
  resetSvieAdvisoryVisualIntelligenceCertificationForTests();
  resetTopologyDevLogsForTests();
}

function buildPerformanceSceneJson(objectCount: number): {
  scene: { objects: Array<Record<string, unknown>> };
  svie: { scenarios: Array<Record<string, unknown>> };
} {
  const objects = Array.from({ length: objectCount }, (_, index) => ({
    id: `perf-${String(index + 1).padStart(4, "0")}`,
    name: `Node ${index + 1}`,
  }));
  const objectImpacts = objects.map((object, index) => ({
    objectId: object.id,
    beforeRisk: ((index * 13) % 60) / 100,
    afterRisk: Math.min(0.95, 0.35 + ((index * 17) % 60) / 100),
  }));
  return {
    scene: { objects },
    svie: {
      scenarios: [
        {
          scenarioId: "scenario:perf-a",
          scenarioImpactSteps: objects.slice(0, Math.min(5, objectCount)).map((object) => object.name),
          objectImpacts,
          confidence: 0.82,
        },
        {
          scenarioId: "scenario:perf-b",
          scenarioImpactSteps: objects.slice(0, Math.min(4, objectCount)).map((object) => object.name).reverse(),
          objectImpacts: objectImpacts.slice(0, Math.min(objectCount, 60)),
          confidence: 0.66,
        },
        {
          scenarioId: "scenario:perf-c",
          linkedLabels: objects.slice(0, Math.min(3, objectCount)).map((object) => object.name),
          objectImpacts: objectImpacts.slice(0, Math.min(objectCount, 30)),
          confidence: 0.54,
        },
      ],
    },
  };
}

function syncPhase4Pipeline(sceneJson: unknown) {
  const scenarios = readScenariosFromSceneJson(sceneJson);
  const scenarioLinks = syncSvieScenarioLinks({ scenarios, sceneJson });
  const futureState = syncFutureStateOverlay({ scenarios, sceneJson });
  const scenarioDelta = syncScenarioDeltaOverlay({ scenarios, sceneJson });
  const scenarioImpact = syncScenarioImpactVisualization({ scenarios, sceneJson });
  const scenarioComparison = syncScenarioComparisonLayer({ scenarios, sceneJson });
  const scenarioConfidence = syncScenarioConfidenceLayer({ scenarios, sceneJson });
  const executiveFutureStory = syncExecutiveFutureStoryLayer({ scenarios, sceneJson });
  return Object.freeze({
    scenarioLinks,
    futureState,
    scenarioDelta,
    scenarioImpact,
    scenarioComparison,
    scenarioConfidence,
    executiveFutureStory,
  });
}

function visualHasForbiddenKeys(visual: Record<string, unknown>): boolean {
  return SVIE_PHASE4_FORBIDDEN_VISUAL_KEYS.some((key) => Object.prototype.hasOwnProperty.call(visual, key));
}

function logCertificationGate(logTag: string, detail: Readonly<Record<string, unknown>>): void {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.(logTag, detail);
}

function validateGateA(): SvieScenarioVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const snapshot = syncSvieScenarioLinks({ sceneJson: CERT_SAMPLE_SCENE });
  const link = snapshot.linkByScenarioId["scenario:a-supplier-failure"];

  if (!link || link.objectIds.length < 5) failures.push("Scenario link mapping incomplete");
  if ((link?.predictedChanges.length ?? 0) < 5) failures.push("Predicted changes missing");
  if (snapshot.contexts.length < 3) failures.push("Scenario contexts missing");

  logCertificationGate(SVIE_CERTIFICATION_SCENARIO_LINK_LOG, {
    linkCount: snapshot.links.length,
    primaryObjectCount: link?.objectIds.length ?? 0,
  });

  return Object.freeze({
    id: "A",
    name: "Scenario Link Runtime",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Scenario runtime resolves deterministic scenario links, predicted changes, and contexts."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_SCENARIO_LINK_LOG,
  });
}

function validateGateB(): SvieScenarioVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const snapshot = syncFutureStateOverlay({ sceneJson: CERT_SAMPLE_SCENE });

  if (snapshot.futureStates.length < 5) failures.push("Future state mapping incomplete");
  if (snapshot.nodeVisualByObjectId.supplier?.futureLevel !== "critical") {
    failures.push("Critical supplier future state missing");
  }
  if (!snapshot.nodeVisualByObjectId.inventory) failures.push("Inventory future visual missing");

  logCertificationGate(SVIE_CERTIFICATION_FUTURE_STATE_LOG, {
    futureStateCount: snapshot.futureStates.length,
    highlightedCount: Object.keys(snapshot.nodeVisualByObjectId).length,
  });

  return Object.freeze({
    id: "B",
    name: "Future State Visualization",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Future object states map to stable, moderate, high, and critical visual tiers."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_FUTURE_STATE_LOG,
  });
}

function validateGateC(): SvieScenarioVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const snapshot = syncScenarioDeltaOverlay({ sceneJson: CERT_SAMPLE_SCENE });

  if (snapshot.deltas.length < 5) failures.push("Scenario deltas incomplete");
  if (!snapshot.deltas.some((delta) => delta.direction === "increase")) {
    failures.push("Increase delta not detected");
  }
  if (!snapshot.deltas.some((delta) => delta.direction === "decrease")) {
    failures.push("Decrease delta not detected");
  }
  if (!snapshot.deltas.some((delta) => delta.direction === "stable")) {
    failures.push("Stable delta not detected");
  }

  logCertificationGate(SVIE_CERTIFICATION_SCENARIO_DELTA_LOG, {
    deltaCount: snapshot.deltas.length,
    directions: [...new Set(snapshot.deltas.map((delta) => delta.direction))],
  });

  return Object.freeze({
    id: "C",
    name: "Scenario Delta Visualization",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Current-vs-future deltas derive visual-only increase, decrease, and stable states."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_SCENARIO_DELTA_LOG,
  });
}

function validateGateD(): SvieScenarioVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const scenarios = readScenariosFromSceneJson(CERT_SAMPLE_SCENE);
  const linkSnapshot = syncSvieScenarioLinks({ scenarios, sceneJson: CERT_SAMPLE_SCENE });
  const link = linkSnapshot.linkByScenarioId["scenario:a-supplier-failure"];
  const chain = link
    ? buildScenarioImpactChain({
        link,
        scenario: scenarios[0],
        sceneJson: CERT_SAMPLE_SCENE,
      })
    : null;
  const snapshot = syncScenarioImpactVisualization({ scenarios, sceneJson: CERT_SAMPLE_SCENE });

  if (!chain || chain.steps.length < 5 || chain.connections.length < 4) {
    failures.push("Scenario impact chain generation incomplete");
  }
  if (snapshot.connectionVisuals.length < 4) failures.push("Scenario impact connection visuals missing");

  logCertificationGate(SVIE_CERTIFICATION_SCENARIO_IMPACT_LOG, {
    chainCount: snapshot.chains.length,
    primaryStepCount: chain?.steps.length ?? 0,
    connectionCount: snapshot.connectionVisuals.length,
  });

  return Object.freeze({
    id: "D",
    name: "Scenario Impact Chain",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Scenario impact chains generate ordered future propagation and connection visuals."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_SCENARIO_IMPACT_LOG,
  });
}

function validateGateE(): SvieScenarioVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const snapshot = syncScenarioComparisonLayer({ sceneJson: CERT_SAMPLE_SCENE });

  if (snapshot.model.entries.length !== 3) failures.push("Expected three comparison scenarios");
  if (snapshot.model.roleByScenarioId["scenario:a-supplier-failure"] !== "primary") {
    failures.push("Primary scenario role missing");
  }
  if (snapshot.model.roleByScenarioId["scenario:b-recovery-plan"] !== "secondary") {
    failures.push("Secondary scenario role missing");
  }
  if (snapshot.model.roleByScenarioId["scenario:c-demand-shift"] !== "alternative") {
    failures.push("Alternative scenario role missing");
  }

  logCertificationGate(SVIE_CERTIFICATION_SCENARIO_COMPARISON_LOG, {
    entries: snapshot.model.entries.length,
    roles: snapshot.model.roleByScenarioId,
  });

  return Object.freeze({
    id: "E",
    name: "Multi-Scenario Comparison",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Primary, secondary, and alternative scenario roles resolve deterministically."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_SCENARIO_COMPARISON_LOG,
  });
}

function validateGateF(): SvieScenarioVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const snapshot = syncScenarioConfidenceLayer({ sceneJson: CERT_SAMPLE_SCENE });

  if (snapshot.entries.length < 3) failures.push("Scenario confidence entries missing");
  if (snapshot.entries[0]?.tier !== "executive_high") failures.push("Executive high tier missing");
  if (!snapshot.entries.some((entry) => entry.tier === "high")) failures.push("High tier missing");
  if (!snapshot.entries.some((entry) => entry.tier === "moderate")) failures.push("Moderate tier missing");
  if (Object.values(snapshot.nodeVisualByObjectId).some((visual) => visual.pulseMode === "unstable")) {
    failures.push("Certification sample should not require unstable executive pulse");
  }

  logCertificationGate(SVIE_CERTIFICATION_SCENARIO_CONFIDENCE_LOG, {
    entries: snapshot.entries.length,
    tiers: snapshot.entries.map((entry) => entry.tier),
  });

  return Object.freeze({
    id: "F",
    name: "Scenario Confidence Layer",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Scenario confidence maps to visual tiers without percentages in scene."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_SCENARIO_CONFIDENCE_LOG,
  });
}

function validateGateG(): SvieScenarioVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const snapshot = syncExecutiveFutureStoryLayer({ sceneJson: CERT_SAMPLE_SCENE });
  const story = snapshot.stories.find((entry) => entry.scenarioId === "scenario:a-supplier-failure");
  const roles = new Set(story?.nodes.map((node) => node.role) ?? []);

  if (!story || story.nodes.length < 5 || story.connections.length < 4) {
    failures.push("Executive future story generation incomplete");
  }
  for (const role of ["future_cause", "future_impact", "future_recommendation", "future_outcome"] as const) {
    if (!roles.has(role)) failures.push(`Missing future story role: ${role}`);
  }
  if (snapshot.connectionVisuals.length < 4) failures.push("Executive future story connection visuals missing");

  logCertificationGate(SVIE_CERTIFICATION_EXECUTIVE_FUTURE_STORY_LOG, {
    storyCount: snapshot.stories.length,
    roles: [...roles],
    connectionCount: snapshot.connectionVisuals.length,
  });

  return Object.freeze({
    id: "G",
    name: "Executive Future Story Layer",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Future simulations resolve to executive future stories with cause, impact, recommendation, and outcome roles."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_EXECUTIVE_FUTURE_STORY_LOG,
  });
}

function validateGateH(): SvieScenarioVisualIntelligenceCertificationGate {
  resetPhase4CertificationRuntime();
  const failures: string[] = [];
  const first = syncPhase4Pipeline(CERT_SAMPLE_SCENE);

  for (let index = 0; index < 24; index += 1) {
    const next = syncPhase4Pipeline(CERT_SAMPLE_SCENE);
    if (
      first.scenarioLinks !== next.scenarioLinks ||
      first.futureState !== next.futureState ||
      first.scenarioDelta !== next.scenarioDelta ||
      first.scenarioImpact !== next.scenarioImpact ||
      first.scenarioComparison !== next.scenarioComparison ||
      first.scenarioConfidence !== next.scenarioConfidence ||
      first.executiveFutureStory !== next.executiveFutureStory
    ) {
      failures.push(`Phase 4 sync cache miss at iteration ${index}`);
      break;
    }
  }

  logCertificationGate(SVIE_CERTIFICATION_PHASE4_SYNC_LOG, {
    cacheStable: failures.length === 0,
  });

  return Object.freeze({
    id: "H",
    name: "Scene Synchronization",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "All phase 4 scenario SVIE sync layers return stable cached snapshots."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_PHASE4_SYNC_LOG,
  });
}

function validateGateI(): SvieScenarioVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const pipeline = syncPhase4Pipeline(CERT_SAMPLE_SCENE);

  for (const visualSet of [
    pipeline.futureState.nodeVisualByObjectId,
    pipeline.scenarioDelta.nodeVisualByObjectId,
    pipeline.scenarioImpact.nodeVisualByObjectId,
    pipeline.scenarioComparison.nodeVisualByObjectId,
    pipeline.scenarioConfidence.nodeVisualByObjectId,
    pipeline.executiveFutureStory.nodeVisualByObjectId,
  ]) {
    for (const visual of Object.values(visualSet)) {
      if (visualHasForbiddenKeys(visual as unknown as Record<string, unknown>)) {
        failures.push("Node visual contains forbidden scene/display keys");
        break;
      }
    }
  }

  const connectionVisuals = [
    ...pipeline.scenarioImpact.connectionVisuals,
    ...pipeline.executiveFutureStory.connectionVisuals,
  ];
  for (const visual of connectionVisuals) {
    if (visualHasForbiddenKeys(visual as unknown as Record<string, unknown>)) {
      failures.push("Connection visual contains forbidden scene/display keys");
      break;
    }
  }

  const topology = generateTopology("flow", [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ]);
  if (topology.nodes[1]?.position?.x !== FLOW_NODE_SPACING) failures.push("Topology mutation detected");

  logCertificationGate(SVIE_CERTIFICATION_PHASE4_RENDER_LOG, {
    materialOnly: failures.length === 0,
    connectionVisualCount: connectionVisuals.length,
  });

  return Object.freeze({
    id: "I",
    name: "Rendering Stability",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Phase 4 overlays remain material-only with no text, labels, transforms, or topology mutation."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_PHASE4_RENDER_LOG,
  });
}

function validateGateJ(): SvieScenarioVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const routeGuard = guardSvieScenarioLinkRouteWrite({
    action: "requestWorkspaceLaunch",
    source: "svie-phase4-cert",
  });
  const workspaceGuard = guardSvieScenarioLinkWorkspaceWrite({
    action: "commitExecutiveWorkspaceTransition",
    source: "svie-phase4-cert",
  });
  if (routeGuard.allowed) failures.push("Scenario route guard allowed a write");
  if (workspaceGuard.allowed) failures.push("Scenario workspace guard allowed a write");

  const phase3 = runSvieAdvisoryVisualIntelligenceCertification({ force: true });
  if (!phase3.certified || phase3.gates.some((gate) => gate.status === "FAIL")) {
    failures.push("Phase 3 certification regression");
  }

  logCertificationGate(SVIE_CERTIFICATION_PHASE4_LIFECYCLE_LOG, {
    routeGuardAllowed: routeGuard.allowed,
    workspaceGuardAllowed: workspaceGuard.allowed,
    phase3Status: phase3.finalStatus,
  });

  return Object.freeze({
    id: "J",
    name: "Lifecycle Safety",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Phase 4 write guards block route/workspace mutation and Phase 3 remains certified."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_PHASE4_LIFECYCLE_LOG,
  });
}

function validateGateK(): SvieScenarioVisualIntelligenceCertificationGate {
  resetPhase4CertificationRuntime();
  const failures: string[] = [];
  const timings: Record<string, number> = {};

  for (const objectCount of SVIE_PHASE4_PERFORMANCE_OBJECT_COUNTS) {
    const sceneJson = buildPerformanceSceneJson(objectCount);
    const startedAt = performance.now();
    const first = syncPhase4Pipeline(sceneJson);
    const elapsedMs = performance.now() - startedAt;
    timings[String(objectCount)] = Math.round(elapsedMs * 100) / 100;

    const second = syncPhase4Pipeline(sceneJson);
    if (
      first.scenarioLinks !== second.scenarioLinks ||
      first.futureState !== second.futureState ||
      first.scenarioDelta !== second.scenarioDelta ||
      first.scenarioImpact !== second.scenarioImpact ||
      first.scenarioComparison !== second.scenarioComparison ||
      first.scenarioConfidence !== second.scenarioConfidence ||
      first.executiveFutureStory !== second.executiveFutureStory
    ) {
      failures.push(`Cache miss at object count ${objectCount}`);
    }
    if (elapsedMs > 400) {
      failures.push(`Object count ${objectCount} exceeded 400ms (${elapsedMs.toFixed(2)}ms)`);
    }
  }

  logCertificationGate(SVIE_CERTIFICATION_PHASE4_PERFORMANCE_LOG, {
    timings,
    objectCounts: SVIE_PHASE4_PERFORMANCE_OBJECT_COUNTS,
  });

  return Object.freeze({
    id: "K",
    name: "Performance Safety",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? `Phase 4 pipeline responsive for counts ${SVIE_PHASE4_PERFORMANCE_OBJECT_COUNTS.join(", ")}.`
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_PHASE4_PERFORMANCE_LOG,
  });
}

function validateGateL(
  gates: readonly SvieScenarioVisualIntelligenceCertificationGate[]
): SvieScenarioVisualIntelligenceCertificationGate {
  const failures = gates.filter((gate) => gate.status === "FAIL");
  const warnings = gates.filter((gate) => gate.status === "WARN");

  logCertificationGate(SVIE_CERTIFICATION_PHASE4_EXECUTIVE_READY_LOG, {
    failedGates: failures.map((gate) => gate.id),
    warningGates: warnings.map((gate) => gate.id),
    freezeTags:
      failures.length === 0 ? SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_FREEZE_TAGS : [],
  });

  return Object.freeze({
    id: "L",
    name: "Executive Readiness",
    status: failures.length === 0 ? (warnings.length > 0 ? "WARN" : "PASS") : "FAIL",
    detail:
      failures.length === 0
        ? warnings.length > 0
          ? `Phase 4 certified with ${warnings.length} warning gate(s).`
          : "SVIE Scenario Visual Intelligence deterministic, stable, render-safe, lifecycle-safe, and executive-ready."
        : `Failed gates: ${failures.map((gate) => gate.id).join(", ")}`,
    certificationLog: SVIE_CERTIFICATION_PHASE4_EXECUTIVE_READY_LOG,
  });
}

let lastResult: SvieScenarioVisualIntelligenceCertificationResult | null = null;

export function resetSvieScenarioVisualIntelligenceCertificationForTests(): void {
  lastResult = null;
  resetPhase4CertificationRuntime();
}

export function runSvieScenarioVisualIntelligenceCertification(options?: {
  force?: boolean;
}): SvieScenarioVisualIntelligenceCertificationResult {
  if (lastResult && !options?.force) {
    return lastResult;
  }

  resetPhase4CertificationRuntime();

  const gatesWithoutL = [
    validateGateA(),
    validateGateB(),
    validateGateC(),
    validateGateD(),
    validateGateE(),
    validateGateF(),
    validateGateG(),
    validateGateH(),
    validateGateI(),
    validateGateJ(),
    validateGateK(),
  ];
  const gateL = validateGateL(gatesWithoutL);
  const gates = Object.freeze([...gatesWithoutL, gateL]);

  const failed = gates.some((gate) => gate.status === "FAIL");
  const warned = gates.some((gate) => gate.status === "WARN");
  const runtimeWarnings: string[] = [];
  if (warned) runtimeWarnings.push("Phase 4 certification completed with warning gates.");

  const certified = !failed;
  const finalStatus: SvieScenarioVisualIntelligenceCertificationResult["finalStatus"] = !certified
    ? "FAIL"
    : warned
      ? "PASS WITH WARNINGS"
      : "PASS";

  const result = Object.freeze({
    tag: SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_TAG,
    phaseCompleteTag: SVIE_PHASE4_COMPLETE_TAG,
    version: SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_VERSION,
    gates,
    freezeTags: certified ? SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_FREEZE_TAGS : Object.freeze([]),
    runtimeWarnings: Object.freeze([...runtimeWarnings]),
    certified,
    finalStatus,
  });

  lastResult = result;
  return result;
}
