/**
 * SVIE:2:4 — Risk layer certification runner.
 *
 * Certifies SVIE:2:1 Risk Runtime, 2:2 Hotspot Visualization, and 2:3 Executive Attention.
 * Certification only — no new features.
 */

import { runAssistantIntegrationQaMatrix } from "../../assistant-bridge/assistantIntegrationQaValidation.ts";
import { generateTopology } from "../topology/topologyEngine.ts";
import { FLOW_NODE_SPACING } from "../topology/flowTopologyGenerator.ts";
import { resetTopologyDevLogsForTests } from "../topology/topologyDevLog.ts";
import { runAdvisoryWorkspaceCertification } from "../../ui/mrpWorkspace/advisory/advisoryWorkspaceCertification.ts";
import { runGovernanceWorkspaceCertification } from "../../ui/mrpWorkspace/governance/governanceWorkspaceCertification.ts";
import {
  resetMrp5cFinalRuntimeCertificationForTests,
  runMrp5cFinalRuntimeCertification,
} from "../../ui/mrpWorkspace/mrp5cFinalRuntimeCertification.ts";
import { applyExecutiveAttentionVisualGuidance } from "./svieExecutiveRiskAttentionVisualizationResolver.ts";
import {
  resetSvieExecutiveRiskAttentionRuntimeForTests,
  syncSvieExecutiveRiskAttention,
} from "./svieExecutiveRiskAttentionRuntime.ts";
import {
  resetSviePhase1CertificationForTests,
  runSviePhase1Certification,
} from "./sviePhase1Certification.ts";
import { classifySvieRiskLevel, deriveSvieObjectRiskScore } from "./svieRiskDerivation.ts";
import type { SvieObjectRiskHotspotVisualStyle } from "./svieRiskHotspotVisualizationContract.ts";
import {
  resetSvieRiskHotspotVisualizationRuntimeForTests,
  syncSvieRiskHotspotVisualization,
} from "./svieRiskHotspotVisualizationRuntime.ts";
import {
  buildSvieRiskSnapshot,
  guardSvieRiskRouteWrite,
  guardSvieRiskSceneWrite,
  guardSvieRiskWorkspaceWrite,
  resetSvieRiskRuntimeForTests,
} from "./svieRiskRuntime.ts";
import { readSceneObjectsFromJson } from "./svieRuntimeFoundationResolver.ts";
import { resetSvieRuntimeFoundationForTests } from "./svieRuntimeFoundation.ts";
import {
  SVIE_CERTIFICATION_EXECUTIVE_ATTENTION_LOG,
  SVIE_CERTIFICATION_EXECUTIVE_READY_LOG,
  SVIE_CERTIFICATION_HOTSPOT_LOG,
  SVIE_CERTIFICATION_LIFECYCLE_LOG,
  SVIE_CERTIFICATION_PERFORMANCE_LOG,
  SVIE_CERTIFICATION_RENDER_LOG,
  SVIE_CERTIFICATION_RISK_RUNTIME_LOG,
  SVIE_CERTIFICATION_SYNC_LOG,
  SVIE_PHASE2_COMPLETE_TAG,
  SVIE_RISK_LAYER_CERTIFICATION_FREEZE_TAGS,
  SVIE_RISK_LAYER_CERTIFICATION_TAG,
  SVIE_RISK_LAYER_CERTIFICATION_VERSION,
  SVIE_RISK_LAYER_FORBIDDEN_VISUAL_KEYS,
  SVIE_RISK_LAYER_PERFORMANCE_OBJECT_COUNTS,
  type SvieRiskLayerCertificationGate,
  type SvieRiskLayerCertificationResult,
} from "./svieRiskLayerCertificationContract.ts";

const CERT_SAMPLE_SCENE = Object.freeze({
  scene: Object.freeze({
    objects: Object.freeze([
      Object.freeze({ id: "critical-a", risk: 0.9, impact: 0.85, confidence: 0.3, status: "critical" }),
      Object.freeze({ id: "high-b", risk: 0.62, impact: 0.55, confidence: 0.45 }),
      Object.freeze({ id: "medium-c", risk: 0.35, impact: 0.4, confidence: 0.55 }),
      Object.freeze({ id: "low-d", label: "stable" }),
      Object.freeze({ notAnObject: true }),
    ]),
  }),
});

function resetRiskLayerCertificationRuntime(): void {
  resetSvieRuntimeFoundationForTests();
  resetSvieRiskRuntimeForTests();
  resetSvieRiskHotspotVisualizationRuntimeForTests();
  resetSvieExecutiveRiskAttentionRuntimeForTests();
  resetSviePhase1CertificationForTests();
  resetMrp5cFinalRuntimeCertificationForTests();
  resetTopologyDevLogsForTests();
}

function buildPerformanceSceneJson(objectCount: number): { scene: { objects: Array<Record<string, unknown>> } } {
  return {
    scene: {
      objects: Array.from({ length: objectCount }, (_, index) => ({
        id: `perf-${String(index + 1).padStart(4, "0")}`,
        risk: ((index * 17) % 100) / 100,
        impact: ((index * 11) % 100) / 100,
        confidence: ((index * 7) % 100) / 100,
      })),
    },
  };
}

function syncRiskLayerPipeline(sceneJson: unknown) {
  const hotspot = syncSvieRiskHotspotVisualization({ sceneJson });
  const attention = syncSvieExecutiveRiskAttention({ sceneJson });
  const merged = applyExecutiveAttentionVisualGuidance(hotspot, attention);
  return Object.freeze({ hotspot, attention, merged });
}

function visualStyleHasForbiddenTransformKeys(visual: SvieObjectRiskHotspotVisualStyle): boolean {
  return SVIE_RISK_LAYER_FORBIDDEN_VISUAL_KEYS.some((key) =>
    Object.prototype.hasOwnProperty.call(visual, key)
  );
}

function logCertificationGate(logTag: string, detail: Readonly<Record<string, unknown>>): void {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.(logTag, detail);
}

function validateGateA(): SvieRiskLayerCertificationGate {
  resetSvieRiskRuntimeForTests();
  const failures: string[] = [];

  const first = buildSvieRiskSnapshot({ sceneJson: CERT_SAMPLE_SCENE });
  const second = buildSvieRiskSnapshot({ sceneJson: CERT_SAMPLE_SCENE });
  if (JSON.stringify(first.objects) !== JSON.stringify(second.objects)) {
    failures.push("Risk snapshot not deterministic for identical input");
  }

  const sortedScores = [...first.objects].map((entry) => entry.riskScore);
  const expectedSorted = [...sortedScores].sort((left, right) => right - left);
  if (JSON.stringify(sortedScores) !== JSON.stringify(expectedSorted)) {
    failures.push("Risk objects not deterministically ordered by score");
  }

  if (deriveSvieObjectRiskScore({ id: "missing" }) !== 0) {
    failures.push("Missing risk values must fall back to score 0");
  }

  const invalidObjects = readSceneObjectsFromJson({
    scene: { objects: [{ label: "no-id" }, { id: "valid", risk: 0.4 }] },
  });
  if (invalidObjects.length !== 1 || invalidObjects[0]?.id !== "valid") {
    failures.push("Invalid object payloads must be ignored safely");
  }

  const lowEntry = first.objects.find((entry) => entry.objectId === "low-d");
  if (!lowEntry || lowEntry.riskScore !== 0 || lowEntry.riskLevel !== "low") {
    failures.push("Low-risk safe object must resolve to score 0 / level low");
  }

  logCertificationGate(SVIE_CERTIFICATION_RISK_RUNTIME_LOG, {
    objectCount: first.objects.length,
    deterministic: failures.length === 0,
  });

  return Object.freeze({
    id: "A",
    name: "Risk Score Runtime",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Risk score derivation is deterministic; missing/invalid inputs handled safely."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_RISK_RUNTIME_LOG,
  });
}

function validateGateB(): SvieRiskLayerCertificationGate {
  resetSvieRiskRuntimeForTests();
  resetSvieRiskHotspotVisualizationRuntimeForTests();
  const failures: string[] = [];

  const { hotspot } = syncRiskLayerPipeline(CERT_SAMPLE_SCENE);
  const visuals = hotspot.visualByObjectId;

  const critical = visuals["critical-a"];
  const high = visuals["high-b"];
  const medium = visuals["medium-c"];
  const low = visuals["low-d"];

  if (!critical?.showOverlay || !critical.pulseEnabled) {
    failures.push("High/critical object must receive hotspot visualization");
  }
  if (!medium?.showOverlay || !medium.showOutline || medium.pulseEnabled) {
    failures.push("Medium-risk object must receive medium outline without pulse");
  }
  if (low?.showOverlay) {
    failures.push("Low-risk safe object must receive no hotspot overlay");
  }

  for (const visual of Object.values(visuals)) {
    if (visualStyleHasForbiddenTransformKeys(visual)) {
      failures.push("Hotspot visual metadata must not encode transform writes");
    }
  }

  const topologyBefore = generateTopology("flow", [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ]);
  const topologyAfter = generateTopology("flow", [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ]);
  if (
    topologyBefore.nodes[1]?.position?.x !== FLOW_NODE_SPACING ||
    topologyAfter.nodes[1]?.position?.x !== FLOW_NODE_SPACING
  ) {
    failures.push("Topology positions changed during hotspot certification");
  }

  logCertificationGate(SVIE_CERTIFICATION_HOTSPOT_LOG, {
    criticalOverlay: critical?.showOverlay === true,
    mediumOutline: medium?.showOutline === true,
    lowOverlay: low?.showOverlay === true,
  });

  return Object.freeze({
    id: "B",
    name: "Risk Hotspot Overlay",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Hotspot tiers mapped correctly; material-only metadata; topology unchanged."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_HOTSPOT_LOG,
  });
}

function validateGateC(): SvieRiskLayerCertificationGate {
  resetSvieRiskRuntimeForTests();
  resetSvieRiskHotspotVisualizationRuntimeForTests();
  resetSvieExecutiveRiskAttentionRuntimeForTests();
  const failures: string[] = [];

  const runs = Array.from({ length: 5 }, () => syncSvieExecutiveRiskAttention({ sceneJson: CERT_SAMPLE_SCENE }));
  const baseline = runs[0];
  if (!baseline) {
    failures.push("Executive attention snapshot missing");
  } else {
    for (const run of runs) {
      if (JSON.stringify(run.top1) !== JSON.stringify(baseline.top1)) failures.push("Top 1 unstable");
      if (JSON.stringify(run.top3) !== JSON.stringify(baseline.top3)) failures.push("Top 3 unstable");
      if (JSON.stringify(run.top5) !== JSON.stringify(baseline.top5)) failures.push("Top 5 unstable");
    }

    const tieScene = {
      scene: {
        objects: [
          { id: "b", risk: 0.7, impact: 0.6, confidence: 0.4 },
          { id: "a", risk: 0.7, impact: 0.6, confidence: 0.4 },
        ],
      },
    };
    const tieSnapshot = syncSvieExecutiveRiskAttention({ sceneJson: tieScene });
    if (tieSnapshot.top1[0] !== "a") {
      failures.push("Tie-break must be deterministic by objectId ascending");
    }
  }

  const { hotspot, attention, merged } = syncRiskLayerPipeline(CERT_SAMPLE_SCENE);
  const topId = attention.topObjectId;
  if (topId) {
    const mergedTop = merged[topId];
    const baseTop = hotspot.visualByObjectId[topId];
    if (!mergedTop?.executivePulseEnabled || mergedTop.executiveAttentionTier !== "top1") {
      failures.push("Top attention object must receive strongest executive pulse tier");
    }
    if (
      mergedTop?.executivePulseEnabled &&
      baseTop?.pulseEnabled &&
      mergedTop.executivePulseMaxIntensity <= baseTop.pulseMaxIntensity
    ) {
      failures.push("Executive pulse must override hotspot pulse intensity for top 1");
    }
  }

  logCertificationGate(SVIE_CERTIFICATION_EXECUTIVE_ATTENTION_LOG, {
    topObjectId: baseline?.topObjectId ?? null,
    top3Count: baseline?.top3.length ?? 0,
    top5Count: baseline?.top5.length ?? 0,
  });

  return Object.freeze({
    id: "C",
    name: "Executive Attention Ranking",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Top 1/3/5 rankings stable; tie-break deterministic; executive pulse overrides hotspot pulse."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_EXECUTIVE_ATTENTION_LOG,
  });
}

function validateGateD(): SvieRiskLayerCertificationGate {
  resetRiskLayerCertificationRuntime();
  const failures: string[] = [];

  const first = syncRiskLayerPipeline(CERT_SAMPLE_SCENE);
  const second = syncRiskLayerPipeline(CERT_SAMPLE_SCENE);

  if (first.hotspot !== second.hotspot) {
    failures.push("Hotspot sync not cached for identical scene signature");
  }
  if (first.attention !== second.attention) {
    failures.push("Executive attention sync not cached for identical scene signature");
  }

  for (const objectId of Object.keys(first.hotspot.visualByObjectId)) {
    if (!first.merged[objectId]) {
      failures.push(`Orphan merged visual for ${objectId}`);
    }
  }

  for (const entry of first.attention.objects) {
    const merged = first.merged[entry.objectId];
    if (!merged) {
      failures.push(`Missing merged visual for attention object ${entry.objectId}`);
      continue;
    }
    if (entry.attentionTier !== "normal" && !merged.executivePulseEnabled) {
      failures.push(`Stale executive pulse for ${entry.objectId}`);
    }
    if (entry.attentionTier === "normal" && merged.executivePulseEnabled) {
      failures.push(`Unexpected executive pulse for normal-tier ${entry.objectId}`);
    }
  }

  logCertificationGate(SVIE_CERTIFICATION_SYNC_LOG, {
    hotspotSignature: first.hotspot.sceneSignature,
    attentionSignature: first.attention.sceneSignature,
    mergedCount: Object.keys(first.merged).length,
  });

  return Object.freeze({
    id: "D",
    name: "Scene Synchronization",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Hotspot, attention, and merged visuals remain synchronized with no orphan or stale states."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_SYNC_LOG,
  });
}

function validateGateE(): SvieRiskLayerCertificationGate {
  resetRiskLayerCertificationRuntime();
  const failures: string[] = [];

  let lastHotspot = syncSvieRiskHotspotVisualization({ sceneJson: CERT_SAMPLE_SCENE });
  for (let index = 0; index < 24; index += 1) {
    const next = syncSvieRiskHotspotVisualization({ sceneJson: CERT_SAMPLE_SCENE });
    if (next !== lastHotspot) {
      failures.push(`Hotspot sync recomputed at iteration ${index}`);
      break;
    }
    lastHotspot = next;
  }

  let lastAttention = syncSvieExecutiveRiskAttention({ sceneJson: CERT_SAMPLE_SCENE });
  for (let index = 0; index < 24; index += 1) {
    const next = syncSvieExecutiveRiskAttention({ sceneJson: CERT_SAMPLE_SCENE });
    if (next !== lastAttention) {
      failures.push(`Executive attention sync recomputed at iteration ${index}`);
      break;
    }
    lastAttention = next;
  }

  const routeGuard = guardSvieRiskRouteWrite({ action: "setDashboardMode", source: "svie-risk-cert-e" });
  const workspaceGuard = guardSvieRiskWorkspaceWrite({
    action: "commitExecutiveWorkspaceTransition",
    source: "svie-risk-cert-e",
  });
  const sceneGuard = guardSvieRiskSceneWrite({ action: "mutateSceneObject", source: "svie-risk-cert-e" });
  if (routeGuard.allowed || workspaceGuard.allowed || sceneGuard.allowed) {
    failures.push("Risk layer write guards failed");
  }

  logCertificationGate(SVIE_CERTIFICATION_RENDER_LOG, {
    hotspotCacheStable: failures.length === 0,
    attentionCacheStable: failures.length === 0,
    readOnlyGuards: true,
  });

  return Object.freeze({
    id: "E",
    name: "Rendering Stability",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Risk layer sync caches stable snapshots; read-only guards prevent churn-inducing writes."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_RENDER_LOG,
  });
}

function validateGateF(): SvieRiskLayerCertificationGate {
  const failures: string[] = [];
  const warnings: string[] = [];

  const mrp = runMrp5cFinalRuntimeCertification({ force: true });
  if (!mrp.certified || mrp.gates.some((gate) => gate.status === "FAIL")) {
    failures.push("MRP 5C lifecycle regression");
  } else if (mrp.finalStatus === "PASS WITH WARNINGS") {
    warnings.push("MRP 5C PASS WITH WARNINGS");
  }

  const advisory = runAdvisoryWorkspaceCertification({ force: true });
  if (advisory.verdict === "FAIL" || advisory.gates.some((gate) => gate.status === "FAIL")) {
    failures.push("Advisory lifecycle regression");
  }

  const governance = runGovernanceWorkspaceCertification({ force: true });
  if (governance.verdict === "FAIL" || governance.gates.some((gate) => gate.status === "FAIL")) {
    failures.push("Governance lifecycle regression");
  }

  const assistant = runAssistantIntegrationQaMatrix();
  if (assistant.failCount > 0) {
    failures.push("Assistant routing regression");
  }

  const phase1 = runSviePhase1Certification({ force: true });
  if (!phase1.certified || phase1.gates.some((gate) => gate.status === "FAIL")) {
    failures.push("SVIE phase 1 lifecycle regression");
  }

  if (mrp.gates.find((gate) => gate.id === "A")?.status === "FAIL") {
    failures.push("Object panel workspace modes regression");
  }

  logCertificationGate(SVIE_CERTIFICATION_LIFECYCLE_LOG, {
    mrp: mrp.finalStatus,
    advisory: advisory.verdict,
    governance: governance.verdict,
    assistantFails: assistant.failCount,
    phase1: phase1.finalStatus,
  });

  return Object.freeze({
    id: "F",
    name: "Lifecycle Safety",
    status: failures.length === 0 ? (warnings.length > 0 ? "WARN" : "PASS") : "FAIL",
    detail:
      failures.length === 0
        ? "Workspace launcher, Advisory, Governance, Assistant, object panel modes, and SVIE phase 1 verified."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_LIFECYCLE_LOG,
  });
}

function validateGateG(): SvieRiskLayerCertificationGate {
  resetRiskLayerCertificationRuntime();
  const failures: string[] = [];
  const timings: Record<string, number> = {};

  for (const objectCount of SVIE_RISK_LAYER_PERFORMANCE_OBJECT_COUNTS) {
    const sceneJson = buildPerformanceSceneJson(objectCount);
    const startedAt = performance.now();
    syncRiskLayerPipeline(sceneJson);
    const elapsedMs = performance.now() - startedAt;
    timings[String(objectCount)] = Math.round(elapsedMs * 100) / 100;

    const cached = syncRiskLayerPipeline(sceneJson);
    const cachedAgain = syncRiskLayerPipeline(sceneJson);
    if (cached.hotspot !== cachedAgain.hotspot || cached.attention !== cachedAgain.attention) {
      failures.push(`Cache miss at object count ${objectCount}`);
    }

    if (elapsedMs > 250) {
      failures.push(`Object count ${objectCount} exceeded 250ms (${elapsedMs.toFixed(2)}ms)`);
    }
  }

  logCertificationGate(SVIE_CERTIFICATION_PERFORMANCE_LOG, {
    timings,
    objectCounts: SVIE_RISK_LAYER_PERFORMANCE_OBJECT_COUNTS,
  });

  return Object.freeze({
    id: "G",
    name: "Performance Safety",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? `Risk layer responsive for counts ${SVIE_RISK_LAYER_PERFORMANCE_OBJECT_COUNTS.join(", ")}; cached sync verified.`
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_PERFORMANCE_LOG,
  });
}

function validateGateH(gates: readonly SvieRiskLayerCertificationGate[]): SvieRiskLayerCertificationGate {
  const failures = gates.filter((gate) => gate.status === "FAIL");
  const warnings = gates.filter((gate) => gate.status === "WARN");

  logCertificationGate(SVIE_CERTIFICATION_EXECUTIVE_READY_LOG, {
    failedGates: failures.map((gate) => gate.id),
    warningGates: warnings.map((gate) => gate.id),
    freezeTags: failures.length === 0 ? SVIE_RISK_LAYER_CERTIFICATION_FREEZE_TAGS : [],
  });

  return Object.freeze({
    id: "H",
    name: "Final Executive Readiness",
    status: failures.length === 0 ? (warnings.length > 0 ? "WARN" : "PASS") : "FAIL",
    detail:
      failures.length === 0
        ? warnings.length > 0
          ? `Risk layer certified with ${warnings.length} warning gate(s).`
          : "SVIE Risk Layer deterministic, stable, render-safe, lifecycle-safe, topology-safe, navigation-safe."
        : `Failed gates: ${failures.map((gate) => gate.id).join(", ")}`,
    certificationLog: SVIE_CERTIFICATION_EXECUTIVE_READY_LOG,
  });
}

let lastResult: SvieRiskLayerCertificationResult | null = null;

export function resetSvieRiskLayerCertificationForTests(): void {
  lastResult = null;
  resetRiskLayerCertificationRuntime();
}

export function runSvieRiskLayerCertification(options?: {
  force?: boolean;
}): SvieRiskLayerCertificationResult {
  if (lastResult && !options?.force) {
    return lastResult;
  }

  resetRiskLayerCertificationRuntime();

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
  if (gates.find((gate) => gate.id === "F")?.status === "WARN") {
    runtimeWarnings.push("MRP 5C certification reported PASS WITH WARNINGS during lifecycle gate.");
  }

  const certified = !failed;
  const finalStatus: SvieRiskLayerCertificationResult["finalStatus"] = !certified
    ? "FAIL"
    : warned
      ? "PASS WITH WARNINGS"
      : "PASS";

  const result = Object.freeze({
    tag: SVIE_RISK_LAYER_CERTIFICATION_TAG,
    phaseCompleteTag: SVIE_PHASE2_COMPLETE_TAG,
    version: SVIE_RISK_LAYER_CERTIFICATION_VERSION,
    gates,
    freezeTags: certified ? SVIE_RISK_LAYER_CERTIFICATION_FREEZE_TAGS : Object.freeze([]),
    runtimeWarnings: Object.freeze([...runtimeWarnings]),
    certified,
    finalStatus,
  });

  lastResult = result;
  return result;
}
