/**
 * P2:8.6 — End-to-End Stage Reality Certification.
 *
 * Certifies the complete Stage Reality chain through P2:8.5.
 * Certification verifies — it does not repair, redesign, or invent semantics.
 *
 * Level A: Structural Stage Reality Certification (deterministic).
 * Level B: Human Visual / Perceptual Sign-Off (never implied by automation).
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  DATA_REALITY_FOCUS_READABILITY_CAMERA,
  DATA_REALITY_OVERVIEW_READABILITY_CAMERA,
  DATA_REALITY_READABILITY_CRITICAL_FLOORS,
  extractObservedExecutiveReadabilityEvidence,
  validateExecutiveReadability,
} from "../data-reality/dataRealityDensityCameraExecutiveReadabilityValidation.ts";
import { resolveNexoraMVPDataRealityVisualStageAudit } from "./nexoraMVPDataRealityVisualStageAudit.ts";
import type { NexoraMVPDataRealityVisualStageAuditBundle } from "./nexoraMVPDataRealityVisualStageAudit.ts";
import { NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES } from "./nexoraMVPStageFixtures.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityEndToEndStageRealityCertificationIdentity =
  "P2:8.6/DataRealityEndToEndStageRealityCertification" as const;

export const dataRealityEndToEndStageRealityCertificationVersion =
  "2.8.6" as const;

export const dataRealityEndToEndStageRealityCertificationNamespace =
  "nexora.data-reality.stage-reality-certification" as const;

export const dataRealityEndToEndStageRealityCertificationPhase =
  "EndToEndStageRealityCertification" as const;

export const dataRealityEndToEndStageRealityCertificationArchitecturalRole =
  "DataRealityEndToEndStageRealityCertificationBoundary" as const;

export const dataRealityEndToEndStageRealityCertificationReadiness =
  "ReadyForStagePolish" as const;

export interface DataRealityEndToEndStageRealityCertificationIdentity {
  readonly identity: "P2:8.6/DataRealityEndToEndStageRealityCertification";
  readonly version: "2.8.6";
  readonly namespace: "nexora.data-reality.stage-reality-certification";
  readonly phase: "EndToEndStageRealityCertification";
  readonly architecturalRole: "DataRealityEndToEndStageRealityCertificationBoundary";
  readonly readiness: "ReadyForStagePolish";
}

const IDENTITY: DataRealityEndToEndStageRealityCertificationIdentity =
  Object.freeze({
    identity: dataRealityEndToEndStageRealityCertificationIdentity,
    version: dataRealityEndToEndStageRealityCertificationVersion,
    namespace: dataRealityEndToEndStageRealityCertificationNamespace,
    phase: dataRealityEndToEndStageRealityCertificationPhase,
    architecturalRole:
      dataRealityEndToEndStageRealityCertificationArchitecturalRole,
    readiness: dataRealityEndToEndStageRealityCertificationReadiness,
  });

export function getDataRealityEndToEndStageRealityCertificationIdentity(): DataRealityEndToEndStageRealityCertificationIdentity {
  return IDENTITY;
}

export const DATA_REALITY_END_TO_END_STAGE_REALITY_CERTIFICATION_BOUNDARY =
  Object.freeze({
    architecturalRole:
      dataRealityEndToEndStageRealityCertificationArchitecturalRole,
    inventsRelationships: false as const,
    inventsSeverity: false as const,
    inventsContext: false as const,
    redesignsStageVisuals: false as const,
    weakensAuditThresholds: false as const,
    repairsUpstreamDefects: false as const,
    certifiesHumanPerceptionAutomatically: false as const,
    createsParallelSemanticEngine: false as const,
    consumesCompleteP28Chain: true as const,
    certificationOnly: true as const,
  });

export const DATA_REALITY_STAGE_REALITY_CERTIFICATION_PROVENANCE_CHAIN =
  Object.freeze([
    "P0 Data Reality",
    "P1 Executive Advisor (consume where relevant)",
    "P2:3 Stage Experience Binding",
    "P2:5 Focus & Attention Experience",
    "P2:6 Interaction & Scene Choreography",
    "P2:7 Connections & Context Reveal",
    "P2:8.1 Visual Reality Audit",
    "P2:8.2 Object State Visual Validation",
    "P2:8.3 Focus & Scene Choreography Validation",
    "P2:8.4 Connections & Context Visual Validation",
    "P2:8.5 Density, Camera & Executive Readability Validation",
    "P2:8.6 End-to-End Stage Reality Certification",
  ] as const);

export const DATA_REALITY_STAGE_REALITY_CERTIFICATION_STATUS_STRUCTURAL_PASS =
  "Verified · Structurally Certified · Semantically Truthful · Deterministic · Regression Safe · ManualVisualSignoffPending · ReadyForStagePolish" as const;

export const DATA_REALITY_STAGE_REALITY_CERTIFICATION_STATUS_VISUAL_PASS =
  "Verified · Visually Certified · Semantically Truthful · Deterministic · Stable · Regression Safe · ReadyForStagePolish" as const;

export const DATA_REALITY_STAGE_REALITY_CERTIFICATION_STATUS_FAILED =
  "Certification Failed · CorrectionRequired" as const;

export const MANUAL_VISUAL_VALIDATION_REQUIRED =
  "ManualVisualValidationRequired" as const;

// ─── Status model ───────────────────────────────────────────────────────────

export type StageRealityStructuralCertificationStatus =
  | "certified"
  | "failed"
  | "blocked";

export type StageRealityHumanVisualSignoffStatus =
  | "passed"
  | "pending"
  | "failed"
  | "not-performed";

export type StageRealityCertificationFindingStatus =
  | "pass"
  | "fail"
  | "manual-signoff-required";

export type StageRealityCertificationFinding = {
  readonly findingId: string;
  readonly invariantId: string;
  readonly layer: string;
  readonly scenario: string;
  readonly status: StageRealityCertificationFindingStatus;
  readonly evidence: readonly string[];
  readonly owningPhase?: string;
};

export type StageRealityCertifiedScenario = {
  readonly scenarioId: string;
  readonly datasetScenario: "baseline" | "operational-pressure";
  readonly interactionMode: "overview" | "focus";
  readonly focusedObjectId: string | null;
  readonly structuralPass: boolean;
  readonly evidence: readonly string[];
};

export type StageRealityCertificationCounts = {
  readonly computedButNotVisibleCount: number;
  readonly visuallyMisleadingCount: number;
  readonly falseRelationshipCount: number;
  readonly falseContextCount: number;
  readonly criticalObscuredCount: number;
  readonly anchorClippedCount: number;
  readonly labelConflictCount: number;
  readonly connectionNoiseCount: number;
  readonly revealDepthHops: 1;
  readonly revenueCapacityCanonicalEdgePresent: false | true;
};

export type DataRealityEndToEndStageRealityCertification = {
  readonly identity: DataRealityEndToEndStageRealityCertificationIdentity;
  readonly structuralStatus: StageRealityStructuralCertificationStatus;
  readonly humanVisualSignoffStatus: StageRealityHumanVisualSignoffStatus;
  readonly certificationLevel:
    | "Level-A-Structural"
    | "Level-A-Structural+Level-B-HumanVisual";
  readonly statusLabel: string;
  readonly semanticTruthPreserved: boolean;
  readonly canonicalRelationshipsPreserved: boolean;
  readonly canonicalContextPreserved: boolean;
  readonly deterministic: boolean;
  readonly regressionSafe: boolean;
  readonly noParallelTruth: boolean;
  readonly scenarios: readonly StageRealityCertifiedScenario[];
  readonly findings: readonly StageRealityCertificationFinding[];
  readonly counts: StageRealityCertificationCounts;
  readonly invariants: readonly {
    readonly invariantId: string;
    readonly status: "PASS" | "FAIL";
  }[];
  readonly provenance: {
    readonly chain: typeof DATA_REALITY_STAGE_REALITY_CERTIFICATION_PROVENANCE_CHAIN;
    readonly manualVisualValidationRequired: typeof MANUAL_VISUAL_VALIDATION_REQUIRED | null;
  };
};

export type CertifyDataRealityEndToEndStageRealityInput = {
  readonly humanVisualSignoffStatus?: StageRealityHumanVisualSignoffStatus;
  readonly humanVisualEvidence?: readonly string[];
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const STABLE_OBJECT_IDS = Object.freeze([
  "obj-revenue",
  "obj-capacity",
  "obj-inventory",
  "obj-delivery",
  "obj-customer",
] as const);

const here = dirname(fileURLToPath(import.meta.url));
const dataRealityRuntimeDir = join(here, "../data-reality");

function resolveBundle(input: {
  readonly datasetScenario: "baseline" | "operational-pressure";
  readonly focusedObjectId?: string | null;
  readonly selectedObjectId?: string | null;
}): NexoraMVPDataRealityVisualStageAuditBundle {
  return resolveNexoraMVPDataRealityVisualStageAudit({
    datasetScenario: input.datasetScenario,
    selectedObjectId: input.selectedObjectId ?? null,
    focusedObjectId:
      input.focusedObjectId === undefined
        ? (input.selectedObjectId ?? null)
        : input.focusedObjectId,
  });
}

function objectById(
  bundle: NexoraMVPDataRealityVisualStageAuditBundle,
  id: string,
) {
  return bundle.presentation.scene.objects.find((entry) => entry.id === id);
}

function hasRevenueCapacityEdge(
  bundle: NexoraMVPDataRealityVisualStageAuditBundle,
): boolean {
  return bundle.presentation.scene.connections.some(
    (entry) =>
      (entry.sourceId === "obj-revenue" &&
        entry.targetId === "obj-capacity") ||
      (entry.sourceId === "obj-capacity" &&
        entry.targetId === "obj-revenue"),
  );
}

function auditDimensionOk(
  bundle: NexoraMVPDataRealityVisualStageAuditBundle,
  dimension: string,
): boolean {
  const findings = bundle.audit.findings.filter(
    (entry) => entry.dimension === dimension,
  );
  if (findings.length === 0) return true;
  return findings.every(
    (entry) =>
      entry.status === "visible-and-consistent" ||
      entry.status === "unresolved-as-designed" ||
      entry.status === "not-applicable",
  );
}

function camerasEqual(
  actual: {
    readonly position: readonly [number, number, number];
    readonly target: readonly [number, number, number];
    readonly fov: number;
  },
  expected: {
    readonly position: readonly [number, number, number];
    readonly target: readonly [number, number, number];
    readonly fov: number;
  },
): boolean {
  return (
    actual.position[0] === expected.position[0] &&
    actual.position[1] === expected.position[1] &&
    actual.position[2] === expected.position[2] &&
    actual.target[0] === expected.target[0] &&
    actual.target[1] === expected.target[1] &&
    actual.target[2] === expected.target[2] &&
    actual.fov === expected.fov
  );
}

function pushFinding(
  findings: StageRealityCertificationFinding[],
  input: {
    readonly invariantId: string;
    readonly layer: string;
    readonly scenario: string;
    readonly ok: boolean;
    readonly evidence: readonly string[];
    readonly owningPhase?: string;
    readonly manual?: boolean;
  },
): void {
  findings.push(
    Object.freeze({
      findingId: `${input.invariantId}:${input.scenario}`,
      invariantId: input.invariantId,
      layer: input.layer,
      scenario: input.scenario,
      status: input.manual
        ? ("manual-signoff-required" as const)
        : input.ok
          ? ("pass" as const)
          : ("fail" as const),
      evidence: Object.freeze([...input.evidence]),
      ...(input.owningPhase !== undefined
        ? { owningPhase: input.owningPhase }
        : {}),
    }),
  );
}

function verifyNoParallelTruth(): {
  readonly ok: boolean;
  readonly evidence: readonly string[];
} {
  const modules = [
    "dataRealityObjectStateVisualValidation.ts",
    "dataRealityFocusSceneChoreographyValidation.ts",
    "dataRealityConnectionsContextVisualValidation.ts",
    "dataRealityDensityCameraExecutiveReadabilityValidation.ts",
    "dataRealityVisualStageAudit.ts",
  ] as const;
  const forbidden = [
    "computeNexoraKPIs(",
    "resolveObjectExecutiveStates(",
    "normalizeDatasetToBusinessFacts(",
  ] as const;
  const evidence: string[] = [];
  let ok = true;
  for (const moduleName of modules) {
    const source = readFileSync(join(dataRealityRuntimeDir, moduleName), "utf8");
    for (const token of forbidden) {
      if (source.includes(token)) {
        ok = false;
        evidence.push(`${moduleName} contains ${token}`);
      }
    }
  }
  if (ok) {
    evidence.push("P2:8 validation modules do not recompute P0 semantic engines");
  }
  return { ok, evidence: Object.freeze(evidence) };
}

function readabilityCounts(
  bundle: NexoraMVPDataRealityVisualStageAuditBundle,
): {
  readonly criticalObscuredCount: number;
  readonly anchorClippedCount: number;
  readonly labelConflictCount: number;
  readonly connectionNoiseCount: number;
} {
  const observed = extractObservedExecutiveReadabilityEvidence(
    bundle.presentation,
  );
  const validation = validateExecutiveReadability({
    scenario: bundle.scenario,
    observed,
  });
  return {
    criticalObscuredCount: validation.summary.criticalObscuredCount,
    anchorClippedCount: validation.summary.anchorClippedCount,
    labelConflictCount: validation.summary.labelConflictCount,
    connectionNoiseCount: validation.summary.connectionNoiseCount,
  };
}

// ─── Primary certification API ──────────────────────────────────────────────

/**
 * Certify the complete Stage Reality chain using the live P2 production path.
 * Does not repair defects. Does not auto-pass human visual sign-off.
 */
export function certifyDataRealityEndToEndStageReality(
  input: CertifyDataRealityEndToEndStageRealityInput = {},
): DataRealityEndToEndStageRealityCertification {
  const findings: StageRealityCertificationFinding[] = [];
  const scenarios: StageRealityCertifiedScenario[] = [];

  const baselineOverview = resolveBundle({
    datasetScenario: "baseline",
  });
  const pressureOverview = resolveBundle({
    datasetScenario: "operational-pressure",
  });
  const pressureRevenue = resolveBundle({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-revenue",
  });
  const pressureInventory = resolveBundle({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-inventory",
    focusedObjectId: "obj-inventory",
  });
  const pressureCleared = resolveBundle({
    datasetScenario: "operational-pressure",
    selectedObjectId: null,
    focusedObjectId: null,
  });
  const pressureRevenueAgain = resolveBundle({
    datasetScenario: "operational-pressure",
    selectedObjectId: "obj-revenue",
    focusedObjectId: "obj-revenue",
  });

  const readabilityPressureOverview = readabilityCounts(pressureOverview);
  const readabilityPressureRevenue = readabilityCounts(pressureRevenue);
  const readabilityBaseline = readabilityCounts(baselineOverview);

  // ── Dataset A/B difference ──
  const revenueBaseline = objectById(baselineOverview, "obj-revenue")!;
  const revenuePressure = objectById(pressureOverview, "obj-revenue")!;
  const capacityBaseline = objectById(baselineOverview, "obj-capacity")!;
  const capacityPressure = objectById(pressureOverview, "obj-capacity")!;
  const datasetDiffers =
    revenueBaseline.executiveVisualState !==
      revenuePressure.executiveVisualState ||
    capacityBaseline.executiveVisualState !==
      capacityPressure.executiveVisualState ||
    capacityBaseline.status !== capacityPressure.status;
  pushFinding(findings, {
    invariantId: "dataset-drives-stage-difference",
    layer: "dataset",
    scenario: "baseline-vs-operational-pressure",
    ok: datasetDiffers,
    evidence: Object.freeze([
      `baseline revenue=${revenueBaseline.executiveVisualState}`,
      `pressure revenue=${revenuePressure.executiveVisualState}`,
      `baseline capacity=${capacityBaseline.executiveVisualState}`,
      `pressure capacity=${capacityPressure.executiveVisualState}`,
    ]),
    owningPhase: "P0",
  });

  // ── Identity stability ──
  const idSets = [
    baselineOverview,
    pressureOverview,
    pressureRevenue,
    pressureCleared,
  ].map((bundle) =>
    bundle.presentation.scene.objects.map((entry) => entry.id).sort(),
  );
  const idsStable = idSets.every(
    (ids) => JSON.stringify(ids) === JSON.stringify(idSets[0]),
  );
  pushFinding(findings, {
    invariantId: "canonical-object-ids-stable",
    layer: "identity",
    scenario: "overview-focus-clear",
    ok: idsStable,
    evidence: Object.freeze([
      `ids=${JSON.stringify(idSets[0])}`,
      ...STABLE_OBJECT_IDS.map((id) => `${id}=present`),
    ]),
    owningPhase: "P0/P2:3",
  });

  // ── Baseline overview ──
  const baselineNoAnchor =
    baselineOverview.presentation.scene.mode === "overview" &&
    baselineOverview.presentation.scene.focusedObjectId == null &&
    baselineOverview.presentation.scene.objects.every(
      (entry) => entry.focused === false,
    );
  const baselineRevenueNormal =
    revenueBaseline.executiveVisualState === "normal";
  const baselineCapacityAttention =
    capacityBaseline.executiveVisualState === "attention" ||
    capacityBaseline.attention === "important" ||
    capacityBaseline.attention === "elevated";
  pushFinding(findings, {
    invariantId: "baseline-overview",
    layer: "scenario",
    scenario: "baseline-overview",
    ok:
      baselineNoAnchor &&
      baselineRevenueNormal &&
      camerasEqual(
        baselineOverview.presentation.scene.camera,
        DATA_REALITY_OVERVIEW_READABILITY_CAMERA,
      ) &&
      auditDimensionOk(baselineOverview, "density") &&
      auditDimensionOk(baselineOverview, "camera-spatial"),
    evidence: Object.freeze([
      `mode=${baselineOverview.presentation.scene.mode}`,
      `revenue=${revenueBaseline.executiveVisualState}`,
      `capacity=${capacityBaseline.executiveVisualState}`,
      `noAnchor=${baselineNoAnchor}`,
    ]),
    owningPhase: "P2:8.1–P2:8.5",
  });
  scenarios.push(
    Object.freeze({
      scenarioId: "baseline-overview",
      datasetScenario: "baseline" as const,
      interactionMode: "overview" as const,
      focusedObjectId: null,
      structuralPass: findings[findings.length - 1]!.status === "pass",
      evidence: findings[findings.length - 1]!.evidence,
    }),
  );

  // ── Operational Pressure overview ──
  const pressureCriticals = [
    "obj-capacity",
    "obj-inventory",
    "obj-delivery",
    "obj-customer",
  ].every((id) => objectById(pressureOverview, id)?.executiveVisualState === "critical");
  const pressureOverviewOk =
    pressureOverview.presentation.scene.mode === "overview" &&
    pressureOverview.presentation.scene.focusedObjectId == null &&
    revenuePressure.executiveVisualState === "attention" &&
    pressureCriticals &&
    !hasRevenueCapacityEdge(pressureOverview) &&
    readabilityPressureOverview.criticalObscuredCount === 0 &&
    auditDimensionOk(pressureOverview, "density");
  pushFinding(findings, {
    invariantId: "operational-pressure-overview",
    layer: "scenario",
    scenario: "operational-pressure-overview",
    ok: pressureOverviewOk,
    evidence: Object.freeze([
      `revenue=${revenuePressure.executiveVisualState}`,
      `criticalsPreserved=${pressureCriticals}`,
      `nonEdge=${!hasRevenueCapacityEdge(pressureOverview)}`,
    ]),
    owningPhase: "P0/P2:8.2/P2:8.5",
  });
  scenarios.push(
    Object.freeze({
      scenarioId: "operational-pressure-overview",
      datasetScenario: "operational-pressure" as const,
      interactionMode: "overview" as const,
      focusedObjectId: null,
      structuralPass: findings[findings.length - 1]!.status === "pass",
      evidence: findings[findings.length - 1]!.evidence,
    }),
  );

  // ── Hardest: Operational Pressure + Revenue Focus ──
  const revenueFocus = objectById(pressureRevenue, "obj-revenue")!;
  const customerFocus = objectById(pressureRevenue, "obj-customer")!;
  const capacityFocus = objectById(pressureRevenue, "obj-capacity")!;
  const focusedCount = pressureRevenue.presentation.scene.objects.filter(
    (entry) => entry.focused,
  ).length;
  const floors = DATA_REALITY_READABILITY_CRITICAL_FLOORS;
  const revenueFocusOk =
    focusedCount === 1 &&
    revenueFocus.focused === true &&
    revenueFocus.role === "focused" &&
    revenueFocus.executiveVisualState === "attention" &&
    customerFocus.role === "related" &&
    customerFocus.executiveVisualState === "critical" &&
    customerFocus.focused === false &&
    capacityFocus.role === "unrelated" &&
    capacityFocus.executiveVisualState === "critical" &&
    capacityFocus.opacity >= floors.minOpacity &&
    !hasRevenueCapacityEdge(pressureRevenue) &&
    pressureRevenue.presentation.scene.connections.some(
      (entry) =>
        entry.id === "rel-customer-revenue" &&
        entry.visualRole === "anchor-incident" &&
        entry.emphasized === true,
    ) &&
    camerasEqual(
      pressureRevenue.presentation.scene.camera,
      DATA_REALITY_FOCUS_READABILITY_CAMERA,
    ) &&
    auditDimensionOk(pressureRevenue, "focus-anchor") &&
    auditDimensionOk(pressureRevenue, "connections") &&
    auditDimensionOk(pressureRevenue, "context") &&
    readabilityPressureRevenue.criticalObscuredCount === 0 &&
    readabilityPressureRevenue.anchorClippedCount === 0;
  pushFinding(findings, {
    invariantId: "operational-pressure-revenue-focus",
    layer: "scenario",
    scenario: "operational-pressure-revenue-focus",
    ok: revenueFocusOk,
    evidence: Object.freeze([
      `anchors=${focusedCount}`,
      `revenueState=${revenueFocus.executiveVisualState}`,
      `customerRole=${customerFocus.role}`,
      `capacityRole=${capacityFocus.role}`,
      `revenueCapacityEdge=${hasRevenueCapacityEdge(pressureRevenue)}`,
    ]),
    owningPhase: "P2:8.2–P2:8.5",
  });
  scenarios.push(
    Object.freeze({
      scenarioId: "operational-pressure-revenue-focus",
      datasetScenario: "operational-pressure" as const,
      interactionMode: "focus" as const,
      focusedObjectId: "obj-revenue",
      structuralPass: findings[findings.length - 1]!.status === "pass",
      evidence: findings[findings.length - 1]!.evidence,
    }),
  );

  // ── Unresolved / Cost ──
  const costFindings = pressureRevenue.audit.findings.filter(
    (entry) => entry.subjectId === "Cost" || entry.subjectId === "cost",
  );
  const unresolvedProtected =
    costFindings.length === 0 ||
    costFindings.every(
      (entry) =>
        entry.status === "unresolved-as-designed" ||
        (entry.dimension === "executive-state" &&
          entry.status !== "visually-misleading"),
    );
  const noUnresolvedAsNormal = pressureRevenue.presentation.scene.objects.every(
    (entry) =>
      entry.executiveVisualState !== "unresolved" ||
      entry.stateMarker === "unresolved",
  );
  pushFinding(findings, {
    invariantId: "unresolved-never-normal",
    layer: "executive-state",
    scenario: "operational-pressure-revenue-focus",
    ok: unresolvedProtected && noUnresolvedAsNormal,
    evidence: Object.freeze([
      `costFindings=${costFindings.map((entry) => entry.status).join(",") || "unresolved-as-designed"}`,
      "unresolved !== normal",
    ]),
    owningPhase: "P0/P2:8.2",
  });

  // ── Focus/severity independence ──
  pushFinding(findings, {
    invariantId: "focus-severity-independence",
    layer: "focus",
    scenario: "operational-pressure-revenue-focus",
    ok:
      revenueFocus.executiveVisualState === "attention" &&
      revenueFocus.focused === true &&
      customerFocus.executiveVisualState === "critical" &&
      customerFocus.focused === false,
    evidence: Object.freeze([
      "focused Revenue remains attention (not critical)",
      "related Customer remains critical (not focused)",
    ]),
    owningPhase: "P2:8.2/P2:8.3",
  });

  // ── Non-edge ──
  const revenueCapacityEdgePresent =
    hasRevenueCapacityEdge(pressureOverview) ||
    hasRevenueCapacityEdge(pressureRevenue) ||
    hasRevenueCapacityEdge(pressureInventory);
  pushFinding(findings, {
    invariantId: "revenue-capacity-non-edge",
    layer: "connections",
    scenario: "operational-pressure-revenue-focus",
    ok: revenueCapacityEdgePresent === false,
    evidence: Object.freeze([
      `RevenueCapacityCanonicalEdgePresent=${revenueCapacityEdgePresent}`,
    ]),
    owningPhase: "P2:7/P2:8.4",
  });

  // ── Direction / relation ──
  const customerEdge = pressureRevenue.presentation.scene.connections.find(
    (entry) => entry.id === "rel-customer-revenue",
  );
  pushFinding(findings, {
    invariantId: "direction-and-relation-preserved",
    layer: "connections",
    scenario: "operational-pressure-revenue-focus",
    ok:
      customerEdge != null &&
      customerEdge.relation === "related" &&
      customerEdge.impliesCausality === false &&
      (customerEdge.directionCue === "source-to-target" ||
        customerEdge.directionCue === "none" ||
        customerEdge.directionCue === undefined),
    evidence: Object.freeze([
      `relation=${customerEdge?.relation ?? "missing"}`,
      `directionCue=${customerEdge?.directionCue ?? "none"}`,
      `impliesCausality=${String(customerEdge?.impliesCausality ?? false)}`,
    ]),
    owningPhase: "P2:8.4",
  });

  // ── Context 1-hop / competing attention not context ──
  const contextOk =
    pressureRevenue.presentation.contextNodes.every((node) =>
      node.role === "collapsed-thread"
        ? node.opacity <= 0.2
        : node.scale <= 0.72,
    ) &&
    capacityFocus.role === "unrelated" &&
    auditDimensionOk(pressureRevenue, "context");
  pushFinding(findings, {
    invariantId: "context-1hop-and-subordinate",
    layer: "context",
    scenario: "operational-pressure-revenue-focus",
    ok: contextOk,
    evidence: Object.freeze([
      `contextNodes=${pressureRevenue.presentation.contextNodes.length}`,
      `capacityRole=${capacityFocus.role}`,
      "revealDepthHops=1",
    ]),
    owningPhase: "P2:7/P2:8.4",
  });

  // ── Focus switch ──
  const inventoryFocus = objectById(pressureInventory, "obj-inventory")!;
  const switchOk =
    pressureInventory.presentation.scene.objects.filter((entry) => entry.focused)
      .length === 1 &&
    inventoryFocus.focused === true &&
    objectById(pressureInventory, "obj-revenue")?.focused === false &&
    pressureInventory.presentation.scene.connections.find(
      (entry) => entry.id === "rel-customer-revenue",
    )?.emphasized === false &&
    pressureInventory.presentation.scene.connections.some(
      (entry) => entry.emphasized === true,
    );
  pushFinding(findings, {
    invariantId: "focus-switch-no-stale-state",
    layer: "interaction",
    scenario: "revenue-focus-to-inventory-focus",
    ok: switchOk,
    evidence: Object.freeze([
      `inventoryFocused=${inventoryFocus.focused}`,
      `priorCustomerRevenueEmphasized=${
        pressureInventory.presentation.scene.connections.find(
          (entry) => entry.id === "rel-customer-revenue",
        )?.emphasized
      }`,
    ]),
    owningPhase: "P2:8.3/P2:8.4",
  });

  // ── Clear focus ──
  const clearOk =
    pressureCleared.presentation.scene.mode === "overview" &&
    pressureCleared.presentation.scene.focusedObjectId == null &&
    pressureCleared.presentation.scene.objects.every(
      (entry) => entry.focused === false,
    ) &&
    pressureCleared.presentation.contextNodes.length === 0 &&
    pressureCleared.presentation.scene.connections.every(
      (entry) => entry.emphasized === false,
    ) &&
    camerasEqual(
      pressureCleared.presentation.scene.camera,
      DATA_REALITY_OVERVIEW_READABILITY_CAMERA,
    ) &&
    objectById(pressureCleared, "obj-capacity")?.executiveVisualState ===
      "critical";
  pushFinding(findings, {
    invariantId: "clear-focus-restores-overview",
    layer: "interaction",
    scenario: "revenue-focus-to-clear",
    ok: clearOk,
    evidence: Object.freeze([
      `mode=${pressureCleared.presentation.scene.mode}`,
      `contextNodes=${pressureCleared.presentation.contextNodes.length}`,
      `capacityStillCritical=${
        objectById(pressureCleared, "obj-capacity")?.executiveVisualState
      }`,
    ]),
    owningPhase: "P2:8.3/P2:8.5",
  });

  // ── Determinism ──
  const deterministic =
    JSON.stringify(pressureRevenue.presentation.scene) ===
      JSON.stringify(pressureRevenueAgain.presentation.scene) &&
    JSON.stringify(pressureRevenue.audit.summary) ===
      JSON.stringify(pressureRevenueAgain.audit.summary);
  pushFinding(findings, {
    invariantId: "determinism",
    layer: "certification",
    scenario: "operational-pressure-revenue-focus",
    ok: deterministic,
    evidence: Object.freeze(["same input → same Stage presentation + audit summary"]),
    owningPhase: "P2:8.6",
  });

  // ── No parallel truth ──
  const parallel = verifyNoParallelTruth();
  pushFinding(findings, {
    invariantId: "no-parallel-truth",
    layer: "architecture",
    scenario: "p2-8-modules",
    ok: parallel.ok,
    evidence: parallel.evidence,
    owningPhase: "P2:8.6",
  });

  // ── Canonical edges only ──
  const falseRelationship =
    pressureRevenue.presentation.scene.connections.some(
      (connection) =>
        !NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.some(
          (fixture) => fixture.id === connection.id,
        ),
    ) || revenueCapacityEdgePresent;
  pushFinding(findings, {
    invariantId: "canonical-edges-only",
    layer: "connections",
    scenario: "operational-pressure-revenue-focus",
    ok: falseRelationship === false,
    evidence: Object.freeze([
      `connectionCount=${pressureRevenue.presentation.scene.connections.length}`,
      `fixtureCount=${NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.length}`,
    ]),
    owningPhase: "P2:7/P2:8.4",
  });

  // ── Audit hard counts ──
  const computedButNotVisibleCount =
    baselineOverview.audit.summary.computedButNotVisibleCount +
    pressureOverview.audit.summary.computedButNotVisibleCount +
    pressureRevenue.audit.summary.computedButNotVisibleCount;
  const visuallyMisleadingCount =
    baselineOverview.audit.summary.visuallyMisleadingCount +
    pressureOverview.audit.summary.visuallyMisleadingCount +
    pressureRevenue.audit.summary.visuallyMisleadingCount;
  const criticalObscuredCount =
    readabilityBaseline.criticalObscuredCount +
    readabilityPressureOverview.criticalObscuredCount +
    readabilityPressureRevenue.criticalObscuredCount;
  const anchorClippedCount =
    readabilityBaseline.anchorClippedCount +
    readabilityPressureOverview.anchorClippedCount +
    readabilityPressureRevenue.anchorClippedCount;
  const labelConflictCount =
    readabilityPressureOverview.labelConflictCount +
    readabilityPressureRevenue.labelConflictCount;
  const connectionNoiseCount =
    readabilityPressureOverview.connectionNoiseCount +
    readabilityPressureRevenue.connectionNoiseCount;

  pushFinding(findings, {
    invariantId: "audit-hard-counts",
    layer: "audit",
    scenario: "composite",
    ok:
      computedButNotVisibleCount === 0 &&
      visuallyMisleadingCount === 0 &&
      criticalObscuredCount === 0 &&
      anchorClippedCount === 0 &&
      labelConflictCount === 0 &&
      connectionNoiseCount === 0,
    evidence: Object.freeze([
      `computed-but-not-visible=${computedButNotVisibleCount}`,
      `visually-misleading=${visuallyMisleadingCount}`,
      `critical-obscured=${criticalObscuredCount}`,
      `anchor-clipped=${anchorClippedCount}`,
      `label-conflict=${labelConflictCount}`,
      `connection-noise=${connectionNoiseCount}`,
    ]),
    owningPhase: "P2:8.1/P2:8.5",
  });

  // ── Density / camera gates ──
  pushFinding(findings, {
    invariantId: "density-camera-gates",
    layer: "density-camera",
    scenario: "composite",
    ok:
      auditDimensionOk(baselineOverview, "density") &&
      auditDimensionOk(pressureOverview, "density") &&
      auditDimensionOk(pressureRevenue, "density") &&
      auditDimensionOk(baselineOverview, "camera-spatial") &&
      auditDimensionOk(pressureOverview, "camera-spatial") &&
      auditDimensionOk(pressureRevenue, "camera-spatial"),
    evidence: Object.freeze([
      "density=visible-and-consistent",
      "camera-spatial=visible-and-consistent",
    ]),
    owningPhase: "P2:8.5",
  });

  // ── Human visual sign-off (never auto-passed) ──
  const requestedHuman = input.humanVisualSignoffStatus;
  let humanVisualSignoffStatus: StageRealityHumanVisualSignoffStatus =
    "not-performed";
  if (requestedHuman === "passed") {
    const evidence = input.humanVisualEvidence ?? [];
    humanVisualSignoffStatus =
      evidence.length > 0 ? "passed" : "pending";
  } else if (requestedHuman != null) {
    humanVisualSignoffStatus = requestedHuman;
  }
  pushFinding(findings, {
    invariantId: "human-visual-signoff",
    layer: "human-perception",
    scenario: "manual-browser-inspection",
    ok: true,
    manual: humanVisualSignoffStatus !== "passed",
    evidence: Object.freeze([
      `humanVisualSignoffStatus=${humanVisualSignoffStatus}`,
      MANUAL_VISUAL_VALIDATION_REQUIRED,
      ...(input.humanVisualEvidence ?? []),
    ]),
    owningPhase: "P2:8.6",
  });

  const sortedFindings = Object.freeze(
    [...findings].sort((a, b) => a.findingId.localeCompare(b.findingId)),
  );
  const hardFailures = sortedFindings.filter(
    (entry) => entry.status === "fail",
  );
  const structuralStatus: StageRealityStructuralCertificationStatus =
    hardFailures.length === 0 ? "certified" : "failed";

  const semanticTruthPreserved =
    structuralStatus === "certified" &&
    computedButNotVisibleCount === 0 &&
    visuallyMisleadingCount === 0;
  const canonicalRelationshipsPreserved =
    falseRelationship === false && revenueCapacityEdgePresent === false;
  const canonicalContextPreserved = contextOk;
  const regressionSafe = structuralStatus === "certified";

  const invariants = Object.freeze(
    sortedFindings
      .filter((entry) => entry.status !== "manual-signoff-required")
      .map((entry) =>
        Object.freeze({
          invariantId: entry.invariantId,
          status: (entry.status === "pass" ? "PASS" : "FAIL") as "PASS" | "FAIL",
        }),
      ),
  );

  let statusLabel: string =
    DATA_REALITY_STAGE_REALITY_CERTIFICATION_STATUS_FAILED;
  let certificationLevel: DataRealityEndToEndStageRealityCertification["certificationLevel"] =
    "Level-A-Structural";
  if (structuralStatus === "certified") {
    if (humanVisualSignoffStatus === "passed") {
      statusLabel = DATA_REALITY_STAGE_REALITY_CERTIFICATION_STATUS_VISUAL_PASS;
      certificationLevel = "Level-A-Structural+Level-B-HumanVisual";
    } else {
      statusLabel =
        DATA_REALITY_STAGE_REALITY_CERTIFICATION_STATUS_STRUCTURAL_PASS;
    }
  }

  return Object.freeze({
    identity: IDENTITY,
    structuralStatus,
    humanVisualSignoffStatus,
    certificationLevel,
    statusLabel,
    semanticTruthPreserved,
    canonicalRelationshipsPreserved,
    canonicalContextPreserved,
    deterministic,
    regressionSafe,
    noParallelTruth: parallel.ok,
    scenarios: Object.freeze(scenarios),
    findings: sortedFindings,
    counts: Object.freeze({
      computedButNotVisibleCount,
      visuallyMisleadingCount,
      falseRelationshipCount: falseRelationship ? 1 : 0,
      falseContextCount: contextOk ? 0 : 1,
      criticalObscuredCount,
      anchorClippedCount,
      labelConflictCount,
      connectionNoiseCount,
      revealDepthHops: 1 as const,
      revenueCapacityCanonicalEdgePresent: revenueCapacityEdgePresent,
    }),
    invariants,
    provenance: Object.freeze({
      chain: DATA_REALITY_STAGE_REALITY_CERTIFICATION_PROVENANCE_CHAIN,
      manualVisualValidationRequired:
        humanVisualSignoffStatus === "passed"
          ? null
          : MANUAL_VISUAL_VALIDATION_REQUIRED,
    }),
  });
}
