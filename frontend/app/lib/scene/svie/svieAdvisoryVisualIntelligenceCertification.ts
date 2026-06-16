/**
 * SVIE:3:6 — Advisory visual intelligence certification runner.
 *
 * Certifies SVIE:3:1 through 3:5 without introducing new features.
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
import {
  guardSvieAdvisoryLinkRouteWrite,
  guardSvieAdvisoryLinkWorkspaceWrite,
  resetSvieAdvisoryLinkRuntimeForTests,
  syncSvieAdvisoryLinkSnapshot,
} from "./svieAdvisoryLinkRuntime.ts";
import {
  SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_FREEZE_TAGS,
  SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_TAG,
  SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_VERSION,
  SVIE_CERTIFICATION_ADVISORY_LINK_LOG,
  SVIE_CERTIFICATION_CAUSE_CHAIN_LOG,
  SVIE_CERTIFICATION_CONFIDENCE_LOG,
  SVIE_CERTIFICATION_EXECUTIVE_STORY_LOG,
  SVIE_CERTIFICATION_PHASE3_EXECUTIVE_READY_LOG,
  SVIE_CERTIFICATION_PHASE3_LIFECYCLE_LOG,
  SVIE_CERTIFICATION_PHASE3_PERFORMANCE_LOG,
  SVIE_CERTIFICATION_PHASE3_RENDER_LOG,
  SVIE_CERTIFICATION_PHASE3_SYNC_LOG,
  SVIE_CERTIFICATION_RECOMMENDATION_LOG,
  SVIE_PHASE3_COMPLETE_TAG,
  SVIE_PHASE3_FORBIDDEN_VISUAL_KEYS,
  SVIE_PHASE3_PERFORMANCE_OBJECT_COUNTS,
  type SvieAdvisoryVisualIntelligenceCertificationGate,
  type SvieAdvisoryVisualIntelligenceCertificationResult,
} from "./svieAdvisoryVisualIntelligenceCertificationContract.ts";
import { readAdvisoryFindingsFromSceneJson } from "./svieCauseChainVisualizationRuntime.ts";
import { deriveCauseChain } from "./svieCauseChainDerivation.ts";
import {
  resetSvieCauseChainVisualizationRuntimeForTests,
  syncSvieCauseChainVisualization,
} from "./svieCauseChainVisualizationRuntime.ts";
import {
  mapRecommendationConfidence,
} from "./svieConfidenceMapping.ts";
import {
  resetSvieConfidenceVisualizationRuntimeForTests,
  syncSvieConfidenceVisualization,
} from "./svieConfidenceVisualizationRuntime.ts";
import {
  resetSvieExecutiveStoryLayerRuntimeForTests,
  syncSvieExecutiveStoryLayer,
} from "./svieExecutiveStoryLayerRuntime.ts";
import {
  resetSvieRecommendationVisualizationRuntimeForTests,
  syncSvieRecommendationVisualization,
} from "./svieRecommendationVisualizationRuntime.ts";
import {
  resetSvieRiskLayerCertificationForTests,
  runSvieRiskLayerCertification,
} from "./svieRiskLayerCertification.ts";
import { resetSvieRiskRuntimeForTests } from "./svieRiskRuntime.ts";
import {
  resetSviePhase1CertificationForTests,
  runSviePhase1Certification,
} from "./sviePhase1Certification.ts";
import { resetSvieRuntimeFoundationForTests } from "./svieRuntimeFoundation.ts";

const CERT_SAMPLE_SCENE = Object.freeze({
  scene: Object.freeze({
    objects: Object.freeze([
      Object.freeze({ id: "supplier", name: "Supplier", risk: 0.72, impact: 0.68 }),
      Object.freeze({ id: "inventory", name: "Inventory", risk: 0.58, impact: 0.82 }),
      Object.freeze({ id: "production", name: "Production", risk: 0.81, impact: 0.77 }),
      Object.freeze({ id: "revenue", name: "Revenue", risk: 0.9, impact: 0.88 }),
    ]),
  }),
  svie: Object.freeze({
    advisoryFindings: Object.freeze([
      Object.freeze({
        recommendationId: "recommendation:phase3-cert",
        title: "Increase Safety Stock",
        linkedLabels: Object.freeze(["Supplier", "Inventory", "Production", "Revenue"]),
        targetObjectIds: Object.freeze(["inventory"]),
        confidence: 0.86,
        impact: 0.79,
      }),
    ]),
  }),
});

function resetPhase3CertificationRuntime(): void {
  resetSvieRuntimeFoundationForTests();
  resetSvieRiskRuntimeForTests();
  resetSvieAdvisoryLinkRuntimeForTests();
  resetSvieCauseChainVisualizationRuntimeForTests();
  resetSvieRecommendationVisualizationRuntimeForTests();
  resetSvieConfidenceVisualizationRuntimeForTests();
  resetSvieExecutiveStoryLayerRuntimeForTests();
  resetSviePhase1CertificationForTests();
  resetSvieRiskLayerCertificationForTests();
  resetMrp5cFinalRuntimeCertificationForTests();
  resetTopologyDevLogsForTests();
}

function buildPerformanceSceneJson(objectCount: number): {
  scene: { objects: Array<Record<string, unknown>> };
  svie: { advisoryFindings: Array<Record<string, unknown>> };
} {
  const objects = Array.from({ length: objectCount }, (_, index) => ({
    id: `perf-${String(index + 1).padStart(4, "0")}`,
    name: `Node ${index + 1}`,
    risk: ((index * 17) % 100) / 100,
    impact: ((index * 11) % 100) / 100,
    confidence: ((index * 7) % 100) / 100,
  }));
  return {
    scene: { objects },
    svie: {
      advisoryFindings: [
        {
          recommendationId: "recommendation:perf",
          linkedLabels: objects.slice(0, Math.min(4, objectCount)).map((object) => object.name),
          confidence: 0.75,
          impact: 0.65,
        },
      ],
    },
  };
}

function syncPhase3Pipeline(sceneJson: unknown) {
  const findings = readAdvisoryFindingsFromSceneJson(sceneJson);
  const advisoryLinks = syncSvieAdvisoryLinkSnapshot({ findings, sceneJson });
  const causeChain = syncSvieCauseChainVisualization({ findings, sceneJson });
  const recommendation = syncSvieRecommendationVisualization({ findings, sceneJson });
  const confidence = syncSvieConfidenceVisualization({ findings, sceneJson });
  const executiveStory = syncSvieExecutiveStoryLayer({ findings, sceneJson });
  return Object.freeze({ advisoryLinks, causeChain, recommendation, confidence, executiveStory });
}

function visualHasForbiddenKeys(visual: Record<string, unknown>): boolean {
  return SVIE_PHASE3_FORBIDDEN_VISUAL_KEYS.some((key) => Object.prototype.hasOwnProperty.call(visual, key));
}

function logCertificationGate(logTag: string, detail: Readonly<Record<string, unknown>>): void {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.(logTag, detail);
}

function validateGateA(): SvieAdvisoryVisualIntelligenceCertificationGate {
  resetSvieAdvisoryLinkRuntimeForTests();
  const failures: string[] = [];
  const findings = readAdvisoryFindingsFromSceneJson(CERT_SAMPLE_SCENE);
  const snapshot = syncSvieAdvisoryLinkSnapshot({ findings, sceneJson: CERT_SAMPLE_SCENE });
  const link = snapshot.linkByRecommendationId["recommendation:phase3-cert"];
  if (!link || link.objectIds.length < 3) {
    failures.push("Advisory link mapping incomplete");
  }

  logCertificationGate(SVIE_CERTIFICATION_ADVISORY_LINK_LOG, {
    linkCount: snapshot.links.length,
    objectCount: link?.objectIds.length ?? 0,
  });

  return Object.freeze({
    id: "A",
    name: "Advisory Link Runtime",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Advisory findings resolve to deterministic scene object links."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_ADVISORY_LINK_LOG,
  });
}

function validateGateB(): SvieAdvisoryVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const pipeline = syncPhase3Pipeline(CERT_SAMPLE_SCENE);
  const link = pipeline.advisoryLinks.linkByRecommendationId["recommendation:phase3-cert"];
  const chain = link
    ? deriveCauseChain({
        link,
        finding: CERT_SAMPLE_SCENE.svie.advisoryFindings[0],
        sceneJson: CERT_SAMPLE_SCENE,
      })
    : null;
  if (!chain || chain.steps.length < 4 || chain.connections.length < 3) {
    failures.push("Cause chain derivation incomplete");
  }
  if (pipeline.causeChain.connectionVisuals.length < 3) {
    failures.push("Cause chain visuals missing");
  }

  logCertificationGate(SVIE_CERTIFICATION_CAUSE_CHAIN_LOG, {
    stepCount: chain?.steps.length ?? 0,
    connectionCount: pipeline.causeChain.connectionVisuals.length,
  });

  return Object.freeze({
    id: "B",
    name: "Cause Chain Visualization",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Cause chains derive ordered steps and connection visuals."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_CAUSE_CHAIN_LOG,
  });
}

function validateGateC(): SvieAdvisoryVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const pipeline = syncPhase3Pipeline(CERT_SAMPLE_SCENE);
  const hierarchy = pipeline.recommendation.hierarchies[0] ?? null;
  if (!hierarchy || hierarchy.rankedObjects.length < 3) {
    failures.push("Recommendation hierarchy incomplete");
  }
  const tier1 = hierarchy?.rankedObjects.find((entry) => entry.tier === 1);
  if (!tier1 || tier1.objectId !== "inventory") {
    failures.push("Primary recommendation object not ranked tier 1");
  }

  logCertificationGate(SVIE_CERTIFICATION_RECOMMENDATION_LOG, {
    rankedCount: hierarchy?.rankedObjects.length ?? 0,
    tier1: tier1?.objectId ?? null,
  });

  return Object.freeze({
    id: "C",
    name: "Recommendation Visualization",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Recommendation hierarchy assigns tier 1 primary and supporting tiers."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_RECOMMENDATION_LOG,
  });
}

function validateGateD(): SvieAdvisoryVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const pipeline = syncPhase3Pipeline(CERT_SAMPLE_SCENE);
  const mapped = pipeline.confidence.mappedRecommendations;
  const primary = mapped.find((entry) => entry.recommendationId === "recommendation:phase3-cert");
  if (primary?.tier !== "high") {
    failures.push(`Expected high confidence tier, received ${primary?.tier ?? "none"}`);
  }
  if (mapRecommendationConfidence(0.95) !== "executive_high") {
    failures.push("Executive high confidence mapping failed");
  }
  const inventoryVisual = pipeline.confidence.nodeVisualByObjectId.inventory;
  if (!inventoryVisual || inventoryVisual.pulseMode !== "stable") {
    failures.push("High confidence should render stable glow");
  }

  logCertificationGate(SVIE_CERTIFICATION_CONFIDENCE_LOG, {
    tier: mapped[0]?.tier ?? null,
    pulseMode: inventoryVisual?.pulseMode ?? null,
  });

  return Object.freeze({
    id: "D",
    name: "Confidence Visualization",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Confidence tiers map to stable, soft, and unstable pulse modes without numeric scene display."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_CONFIDENCE_LOG,
  });
}

function validateGateE(): SvieAdvisoryVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const pipeline = syncPhase3Pipeline(CERT_SAMPLE_SCENE);
  const story = pipeline.executiveStory.stories[0] ?? null;
  if (!story || story.nodes.length < 4) {
    failures.push("Executive story generation incomplete");
  }
  const roles = new Set(story?.nodes.map((node) => node.role) ?? []);
  for (const role of ["start", "impact", "recommendation"] as const) {
    if (!roles.has(role)) failures.push(`Missing executive story role: ${role}`);
  }
  if (pipeline.executiveStory.connectionVisuals.length < 3) {
    failures.push("Executive story connection visuals missing");
  }

  logCertificationGate(SVIE_CERTIFICATION_EXECUTIVE_STORY_LOG, {
    nodeCount: story?.nodes.length ?? 0,
    roles: [...roles],
  });

  return Object.freeze({
    id: "E",
    name: "Executive Story Layer",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Executive stories combine cause chain ordering with recommendation and impact roles."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_EXECUTIVE_STORY_LOG,
  });
}

function validateGateF(): SvieAdvisoryVisualIntelligenceCertificationGate {
  resetPhase3CertificationRuntime();
  const failures: string[] = [];
  const findings = readAdvisoryFindingsFromSceneJson(CERT_SAMPLE_SCENE);
  let lastAdvisory = syncSvieAdvisoryLinkSnapshot({ findings, sceneJson: CERT_SAMPLE_SCENE });
  let lastCauseChain = syncSvieCauseChainVisualization({ findings, sceneJson: CERT_SAMPLE_SCENE });
  let lastRecommendation = syncSvieRecommendationVisualization({ findings, sceneJson: CERT_SAMPLE_SCENE });
  let lastConfidence = syncSvieConfidenceVisualization({ findings, sceneJson: CERT_SAMPLE_SCENE });
  let lastExecutiveStory = syncSvieExecutiveStoryLayer({ findings, sceneJson: CERT_SAMPLE_SCENE });

  for (let index = 0; index < 24; index += 1) {
    const nextAdvisory = syncSvieAdvisoryLinkSnapshot({ findings, sceneJson: CERT_SAMPLE_SCENE });
    const nextCauseChain = syncSvieCauseChainVisualization({ findings, sceneJson: CERT_SAMPLE_SCENE });
    const nextRecommendation = syncSvieRecommendationVisualization({ findings, sceneJson: CERT_SAMPLE_SCENE });
    const nextConfidence = syncSvieConfidenceVisualization({ findings, sceneJson: CERT_SAMPLE_SCENE });
    const nextExecutiveStory = syncSvieExecutiveStoryLayer({ findings, sceneJson: CERT_SAMPLE_SCENE });
    if (
      nextAdvisory !== lastAdvisory ||
      nextCauseChain !== lastCauseChain ||
      nextRecommendation !== lastRecommendation ||
      nextConfidence !== lastConfidence ||
      nextExecutiveStory !== lastExecutiveStory
    ) {
      failures.push(`Phase 3 sync cache miss at iteration ${index}`);
      break;
    }
    lastAdvisory = nextAdvisory;
    lastCauseChain = nextCauseChain;
    lastRecommendation = nextRecommendation;
    lastConfidence = nextConfidence;
    lastExecutiveStory = nextExecutiveStory;
  }

  logCertificationGate(SVIE_CERTIFICATION_PHASE3_SYNC_LOG, {
    cacheStable: failures.length === 0,
  });

  return Object.freeze({
    id: "F",
    name: "Scene Synchronization",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "All phase 3 SVIE sync layers return stable cached snapshots."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_PHASE3_SYNC_LOG,
  });
}

function validateGateG(): SvieAdvisoryVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const pipeline = syncPhase3Pipeline(CERT_SAMPLE_SCENE);

  for (const visual of Object.values(pipeline.causeChain.nodeVisualByObjectId)) {
    if (visualHasForbiddenKeys(visual as unknown as Record<string, unknown>)) {
      failures.push("Cause chain visual contains forbidden keys");
      break;
    }
  }
  for (const visual of Object.values(pipeline.recommendation.nodeVisualByObjectId)) {
    if (visualHasForbiddenKeys(visual as unknown as Record<string, unknown>)) {
      failures.push("Recommendation visual contains forbidden keys");
      break;
    }
  }
  for (const visual of Object.values(pipeline.confidence.nodeVisualByObjectId)) {
    if (visualHasForbiddenKeys(visual as unknown as Record<string, unknown>)) {
      failures.push("Confidence visual contains forbidden keys");
      break;
    }
  }
  for (const visual of Object.values(pipeline.executiveStory.nodeVisualByObjectId)) {
    if (visualHasForbiddenKeys(visual as unknown as Record<string, unknown>)) {
      failures.push("Executive story visual contains forbidden keys");
      break;
    }
  }

  const routeGuard = guardSvieAdvisoryLinkRouteWrite({ action: "setDashboardMode", source: "svie-phase3-cert-g" });
  const workspaceGuard = guardSvieAdvisoryLinkWorkspaceWrite({
    action: "commitExecutiveWorkspaceTransition",
    source: "svie-phase3-cert-g",
  });
  if (routeGuard.allowed || workspaceGuard.allowed) {
    failures.push("Phase 3 write guards failed");
  }

  const topology = generateTopology("flow", [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ]);
  if (topology.nodes[1]?.position?.x !== FLOW_NODE_SPACING) {
    failures.push("Topology mutation detected");
  }

  logCertificationGate(SVIE_CERTIFICATION_PHASE3_RENDER_LOG, {
    materialOnly: failures.length === 0,
    readOnlyGuards: true,
  });

  return Object.freeze({
    id: "G",
    name: "Rendering Stability",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Phase 3 overlays are material-only with read-only guards and no topology mutation."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_PHASE3_RENDER_LOG,
  });
}

function validateGateH(): SvieAdvisoryVisualIntelligenceCertificationGate {
  const failures: string[] = [];
  const warnings: string[] = [];

  const mrp = runMrp5cFinalRuntimeCertification({ force: true });
  if (!mrp.certified || mrp.gates.some((gate) => gate.status === "FAIL")) {
    failures.push("MRP lifecycle regression");
  } else if (mrp.finalStatus === "PASS WITH WARNINGS") {
    warnings.push("MRP PASS WITH WARNINGS");
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
    failures.push("SVIE phase 1 regression");
  }

  const phase2 = runSvieRiskLayerCertification({ force: true });
  if (!phase2.certified || phase2.gates.some((gate) => gate.status === "FAIL")) {
    failures.push("SVIE phase 2 regression");
  }

  logCertificationGate(SVIE_CERTIFICATION_PHASE3_LIFECYCLE_LOG, {
    mrp: mrp.finalStatus,
    advisory: advisory.verdict,
    governance: governance.verdict,
    phase1: phase1.finalStatus,
    phase2: phase2.finalStatus,
  });

  return Object.freeze({
    id: "H",
    name: "Lifecycle Safety",
    status: failures.length === 0 ? (warnings.length > 0 ? "WARN" : "PASS") : "FAIL",
    detail:
      failures.length === 0
        ? "MRP, Advisory, Governance, Assistant, SVIE phase 1, and phase 2 verified."
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_PHASE3_LIFECYCLE_LOG,
  });
}

function validateGateI(): SvieAdvisoryVisualIntelligenceCertificationGate {
  resetPhase3CertificationRuntime();
  const failures: string[] = [];
  const timings: Record<string, number> = {};

  for (const objectCount of SVIE_PHASE3_PERFORMANCE_OBJECT_COUNTS) {
    const sceneJson = buildPerformanceSceneJson(objectCount);
    const findings = readAdvisoryFindingsFromSceneJson(sceneJson);
    const startedAt = performance.now();
    syncSvieAdvisoryLinkSnapshot({ findings, sceneJson });
    syncSvieCauseChainVisualization({ findings, sceneJson });
    syncSvieRecommendationVisualization({ findings, sceneJson });
    syncSvieConfidenceVisualization({ findings, sceneJson });
    syncSvieExecutiveStoryLayer({ findings, sceneJson });
    const elapsedMs = performance.now() - startedAt;
    timings[String(objectCount)] = Math.round(elapsedMs * 100) / 100;

    const cachedAdvisory = syncSvieAdvisoryLinkSnapshot({ findings, sceneJson });
    const cachedAgain = syncSvieAdvisoryLinkSnapshot({ findings, sceneJson });
    const cachedStory = syncSvieExecutiveStoryLayer({ findings, sceneJson });
    const cachedStoryAgain = syncSvieExecutiveStoryLayer({ findings, sceneJson });
    if (cachedAdvisory !== cachedAgain || cachedStory !== cachedStoryAgain) {
      failures.push(`Cache miss at object count ${objectCount}`);
    }

    if (elapsedMs > 350) {
      failures.push(`Object count ${objectCount} exceeded 350ms (${elapsedMs.toFixed(2)}ms)`);
    }
  }

  logCertificationGate(SVIE_CERTIFICATION_PHASE3_PERFORMANCE_LOG, {
    timings,
    objectCounts: SVIE_PHASE3_PERFORMANCE_OBJECT_COUNTS,
  });

  return Object.freeze({
    id: "I",
    name: "Performance Safety",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? `Phase 3 pipeline responsive for counts ${SVIE_PHASE3_PERFORMANCE_OBJECT_COUNTS.join(", ")}.`
        : failures.join("; "),
    certificationLog: SVIE_CERTIFICATION_PHASE3_PERFORMANCE_LOG,
  });
}

function validateGateJ(
  gates: readonly SvieAdvisoryVisualIntelligenceCertificationGate[]
): SvieAdvisoryVisualIntelligenceCertificationGate {
  const failures = gates.filter((gate) => gate.status === "FAIL");
  const warnings = gates.filter((gate) => gate.status === "WARN");

  logCertificationGate(SVIE_CERTIFICATION_PHASE3_EXECUTIVE_READY_LOG, {
    failedGates: failures.map((gate) => gate.id),
    warningGates: warnings.map((gate) => gate.id),
    freezeTags:
      failures.length === 0 ? SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_FREEZE_TAGS : [],
  });

  return Object.freeze({
    id: "J",
    name: "Executive Readiness",
    status: failures.length === 0 ? (warnings.length > 0 ? "WARN" : "PASS") : "FAIL",
    detail:
      failures.length === 0
        ? warnings.length > 0
          ? `Phase 3 certified with ${warnings.length} warning gate(s).`
          : "SVIE Advisory Visual Intelligence deterministic, stable, render-safe, lifecycle-safe, and executive-ready."
        : `Failed gates: ${failures.map((gate) => gate.id).join(", ")}`,
    certificationLog: SVIE_CERTIFICATION_PHASE3_EXECUTIVE_READY_LOG,
  });
}

let lastResult: SvieAdvisoryVisualIntelligenceCertificationResult | null = null;

export function resetSvieAdvisoryVisualIntelligenceCertificationForTests(): void {
  lastResult = null;
  resetPhase3CertificationRuntime();
}

export function runSvieAdvisoryVisualIntelligenceCertification(options?: {
  force?: boolean;
}): SvieAdvisoryVisualIntelligenceCertificationResult {
  if (lastResult && !options?.force) {
    return lastResult;
  }

  resetPhase3CertificationRuntime();

  const gatesWithoutJ = [
    validateGateA(),
    validateGateB(),
    validateGateC(),
    validateGateD(),
    validateGateE(),
    validateGateF(),
    validateGateG(),
    validateGateH(),
    validateGateI(),
  ];
  const gateJ = validateGateJ(gatesWithoutJ);
  const gates = Object.freeze([...gatesWithoutJ, gateJ]);

  const failed = gates.some((gate) => gate.status === "FAIL");
  const warned = gates.some((gate) => gate.status === "WARN");
  const runtimeWarnings: string[] = [];
  if (gates.find((gate) => gate.id === "H")?.status === "WARN") {
    runtimeWarnings.push("MRP 5C certification reported PASS WITH WARNINGS during lifecycle gate.");
  }

  const certified = !failed;
  const finalStatus: SvieAdvisoryVisualIntelligenceCertificationResult["finalStatus"] = !certified
    ? "FAIL"
    : warned
      ? "PASS WITH WARNINGS"
      : "PASS";

  const result = Object.freeze({
    tag: SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_TAG,
    phaseCompleteTag: SVIE_PHASE3_COMPLETE_TAG,
    version: SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_VERSION,
    gates,
    freezeTags: certified ? SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_FREEZE_TAGS : Object.freeze([]),
    runtimeWarnings: Object.freeze([...runtimeWarnings]),
    certified,
    finalStatus,
  });

  lastResult = result;
  return result;
}
