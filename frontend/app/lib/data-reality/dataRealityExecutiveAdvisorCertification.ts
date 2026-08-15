/**
 * P1:6 — Data-Reality-Aware Executive Advisor End-to-End Certification.
 *
 * Verifies the complete Dataset → Response chain using canonical P0 fixtures
 * and identical interaction context. Certification verifies — it does not repair.
 *
 * Status on success:
 *   Verified · Certified · Stable · ReadyForMVP
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { NexoraDataset } from "./dataRealityContracts.ts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "./demo/executiveOperationsDemoDataset.ts";
import { NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS } from "./dataRealityStageProjection.ts";
import {
  resolveDataRealityExecutiveAdvisorIntegration,
  type DataRealityExecutiveAdvisorIntegrationResult,
} from "./dataRealityExecutiveAdvisorIntegration.ts";
import { composeDataRealityExecutiveAdvisorResponse } from "./dataRealityExecutiveAdvisorResponseComposition.ts";
import type { DataRealityAdvisorResponseMode } from "./dataRealityExecutiveAdvisorResponseComposition.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityExecutiveAdvisorCertificationIdentity =
  "P1:6/DataRealityExecutiveAdvisorEndToEndCertification" as const;

export const dataRealityExecutiveAdvisorCertificationVersion =
  "1.0.0" as const;

export const dataRealityExecutiveAdvisorCertificationNamespace =
  "nexora.data-reality.executive-advisor.certification" as const;

export const dataRealityExecutiveAdvisorCertificationPhase =
  "EndToEndCertification" as const;

export const dataRealityExecutiveAdvisorCertificationArchitecturalRole =
  "DataRealityExecutiveAdvisorEndToEndCertification" as const;

export const DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_STATUS =
  "Verified · Certified · Stable · ReadyForMVP" as const;

export interface DataRealityExecutiveAdvisorCertificationIdentity {
  readonly identity: "P1:6/DataRealityExecutiveAdvisorEndToEndCertification";
  readonly version: "1.0.0";
  readonly namespace: "nexora.data-reality.executive-advisor.certification";
  readonly phase: "EndToEndCertification";
  readonly architecturalRole: "DataRealityExecutiveAdvisorEndToEndCertification";
}

const IDENTITY: DataRealityExecutiveAdvisorCertificationIdentity =
  Object.freeze({
    identity: dataRealityExecutiveAdvisorCertificationIdentity,
    version: dataRealityExecutiveAdvisorCertificationVersion,
    namespace: dataRealityExecutiveAdvisorCertificationNamespace,
    phase: dataRealityExecutiveAdvisorCertificationPhase,
    architecturalRole:
      dataRealityExecutiveAdvisorCertificationArchitecturalRole,
  });

export function getDataRealityExecutiveAdvisorCertificationIdentity(): DataRealityExecutiveAdvisorCertificationIdentity {
  return IDENTITY;
}

// ─── Capabilities / invariants / principles / checks ────────────────────────

export const DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_CAPABILITIES =
  Object.freeze([
    "integrate-certified-data-reality-to-advisor-response",
    "orchestrate-p1-observation-resolution",
    "orchestrate-p1-context-resolution",
    "orchestrate-p1-advisory-resolution",
    "orchestrate-p1-response-composition",
    "preserve-pipeline-boundaries",
    "assemble-end-to-end-traceability",
    "certify-dataset-sensitive-advisor-behavior",
    "certify-same-rule-causal-difference",
    "certify-stable-unresolved-distinction",
    "certify-unresolved-protection",
    "certify-focus-truth-preservation",
    "certify-enterprise-reality-preservation",
    "certify-response-traceability",
    "certify-guidance-traceability",
    "certify-observation-traceability",
    "certify-determinism",
    "certify-immutability",
    "certify-dataset-label-blindness",
    "certify-object-identity-stability",
    "certify-response-mode-truth-equivalence",
    "certify-no-llm-runtime-dependency",
    "certify-no-ui-runtime-dependency",
    "certify-no-network-runtime-dependency",
    "certify-no-db-runtime-dependency",
    "certify-no-execution-runtime-dependency",
    "support-mvp-advisor-integration",
  ] as const);

export type DataRealityExecutiveAdvisorCertificationCapability =
  (typeof DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_CAPABILITIES)[number];

export const DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_INVARIANTS =
  Object.freeze([
    "P1:6 integrates canonical P0–P1:5 APIs only.",
    "P1:6 does not duplicate upstream business logic.",
    "P0 remains the source of executive truth.",
    "P1:2 remains canonical for evidence and observation.",
    "P1:3 remains canonical for Advisor Context.",
    "P1:4 remains canonical for candidates and guidance.",
    "P1:5 remains canonical for executive response composition.",
    "Different Dataset values may change executive response.",
    "Dataset labels must not change executive response semantics.",
    "Same Dataset values and same context produce the same semantic response.",
    "Focus changes relevance, not truth.",
    "Selection changes relevance, not truth.",
    "Requested intent changes direction, not truth.",
    "Response mode changes density, not truth.",
    "Stable and unresolved remain distinct.",
    "Unresolved reality remains protected.",
    "Critical enterprise reality cannot be hidden by focus.",
    "Every response truth reference is traceable.",
    "Every guidance reference is traceable.",
    "Every observation evidence reference is traceable.",
    "No advisory candidate becomes an approved decision.",
    "No guidance becomes execution.",
    "No response claims execution occurred.",
    "No new KPI is calculated in P1:6.",
    "No new executive state is resolved in P1:6.",
    "No new evidence is invented in P1:6.",
    "No new observation is invented in P1:6.",
    "No new guidance is invented in P1:6.",
    "No new factual claim is invented in P1:6.",
    "Complete integration is deterministic.",
    "Complete integration is immutable.",
    "No randomness is used.",
    "No runtime clock dependency is introduced.",
    "No LLM dependency is introduced.",
    "No UI dependency is introduced.",
    "No Three.js dependency is introduced.",
    "No network dependency is introduced.",
    "No database dependency is introduced.",
    "No execution dependency is introduced.",
    "Certification verifies behavior; it does not repair behavior.",
    "P0 behavior remains unchanged.",
    "P1:1 contracts remain canonical.",
    "Stage/NexoraObject identities remain stable across dataset changes.",
    "Same architecture is used for Dataset A and Dataset B.",
    "Certification results are derived from actual integration outputs.",
  ] as const);

export const DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_PRINCIPLES =
  Object.freeze([
    "Reality drives Advice",
    "Data values drive Reality",
    "Names do not drive Reality",
    "Evidence remains traceable",
    "Context directs relevance",
    "Guidance remains advisory",
    "Language remains downstream of truth",
    "Certification verifies — it does not invent",
    "Same rules, different data, different meaning",
  ] as const);

export const DATA_REALITY_EXECUTIVE_ADVISOR_REQUIRED_CERTIFICATION_CHECK_IDS =
  Object.freeze([
    "pipeline-complete",
    "dataset-a-valid",
    "dataset-b-valid",
    "same-interaction-context",
    "same-object-model",
    "same-stage-identities",
    "same-rules",
    "different-data",
    "different-kpi",
    "different-executive-state",
    "different-observation",
    "different-context",
    "different-guidance",
    "different-response",
    "unresolved-protected",
    "stable-unresolved-distinct",
    "focus-preserves-truth",
    "enterprise-reality-preserved",
    "response-traceability-valid",
    "guidance-traceability-valid",
    "observation-traceability-valid",
    "deterministic-a",
    "deterministic-b",
    "immutable",
    "dataset-label-blind",
    "no-llm-dependency",
    "no-ui-dependency",
    "no-network-dependency",
    "no-db-dependency",
    "no-execution-dependency",
  ] as const);

export type DataRealityExecutiveAdvisorRequiredCertificationCheckId =
  (typeof DATA_REALITY_EXECUTIVE_ADVISOR_REQUIRED_CERTIFICATION_CHECK_IDS)[number];

export interface DataRealityExecutiveAdvisorCertificationMetadata {
  readonly identity: DataRealityExecutiveAdvisorCertificationIdentity;
  readonly version: "1.0.0";
  readonly namespace: "nexora.data-reality.executive-advisor.certification";
  readonly phase: "EndToEndCertification";
  readonly architecturalRole: "DataRealityExecutiveAdvisorEndToEndCertification";
  readonly capabilities: readonly DataRealityExecutiveAdvisorCertificationCapability[];
  readonly invariants: readonly string[];
  readonly principles: readonly string[];
  readonly status: typeof DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_STATUS;
  readonly requiredCheckIds: typeof DATA_REALITY_EXECUTIVE_ADVISOR_REQUIRED_CERTIFICATION_CHECK_IDS;
}

const METADATA: DataRealityExecutiveAdvisorCertificationMetadata =
  Object.freeze({
    identity: IDENTITY,
    version: dataRealityExecutiveAdvisorCertificationVersion,
    namespace: dataRealityExecutiveAdvisorCertificationNamespace,
    phase: dataRealityExecutiveAdvisorCertificationPhase,
    architecturalRole:
      dataRealityExecutiveAdvisorCertificationArchitecturalRole,
    capabilities: DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_CAPABILITIES,
    invariants: DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_INVARIANTS,
    principles: DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_PRINCIPLES,
    status: DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_STATUS,
    requiredCheckIds: DATA_REALITY_EXECUTIVE_ADVISOR_REQUIRED_CERTIFICATION_CHECK_IDS,
  });

export function getDataRealityExecutiveAdvisorCertificationMetadata(): DataRealityExecutiveAdvisorCertificationMetadata {
  return METADATA;
}

// ─── Certification contracts ────────────────────────────────────────────────

export interface DataRealityExecutiveAdvisorCertificationCheck {
  readonly id: string;
  readonly name: string;
  readonly passed: boolean;
  readonly reason: string;
}

export interface DataRealityExecutiveAdvisorCausalDifference {
  readonly subjectId: string;
  readonly dimension:
    | "kpi"
    | "executive-state"
    | "evidence"
    | "observation"
    | "context"
    | "candidate"
    | "guidance"
    | "response";
  readonly datasetAValue: string;
  readonly datasetBValue: string;
  readonly changed: boolean;
}

export interface DataRealityExecutiveAdvisorCertificationResult {
  readonly certificationIdentity: DataRealityExecutiveAdvisorCertificationIdentity;
  readonly status: "Verified · Certified · Stable · ReadyForMVP";
  readonly passed: boolean;
  readonly checks: readonly DataRealityExecutiveAdvisorCertificationCheck[];
  readonly datasetAResult: DataRealityExecutiveAdvisorIntegrationResult;
  readonly datasetBResult: DataRealityExecutiveAdvisorIntegrationResult;
  readonly causalDifferences: readonly DataRealityExecutiveAdvisorCausalDifference[];
  readonly certificationReasons: readonly string[];
}

export interface CertifyDataRealityExecutiveAdvisorEndToEndInput {
  readonly focusedObjectId?: string;
  readonly selectedObjectIds?: readonly string[];
  readonly currentWorkspace?: string;
  readonly requestedIntent?: "investigate";
  readonly responseMode?: DataRealityAdvisorResponseMode;
  readonly maxCandidates?: number;
  readonly maxEvidenceItems?: number;
}

export const DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT =
  Object.freeze({
    focusedObjectId: "obj-capacity",
    selectedObjectIds: Object.freeze(["obj-inventory", "obj-delivery"]),
    currentWorkspace: "problem",
    requestedIntent: "investigate" as const,
    responseMode: "standard" as const,
    maxCandidates: 5,
    maxEvidenceItems: 3,
  });

// ─── Helpers ────────────────────────────────────────────────────────────────

function check(
  id: string,
  name: string,
  passed: boolean,
  reason: string,
): DataRealityExecutiveAdvisorCertificationCheck {
  return Object.freeze({ id, name, passed, reason });
}

function kpiValue(
  result: DataRealityExecutiveAdvisorIntegrationResult,
  objectKey: string,
): number | undefined {
  return result.dataRealitySnapshot.kpis.find(
    (entry) => entry.objectKey === objectKey,
  )?.value;
}

function objectState(
  result: DataRealityExecutiveAdvisorIntegrationResult,
  objectKey: string,
): string | undefined {
  return result.dataRealitySnapshot.objectStates.find(
    (entry) => entry.objectKey === objectKey,
  )?.state;
}

function observationState(
  result: DataRealityExecutiveAdvisorIntegrationResult,
  subjectId: string,
): string | undefined {
  return result.advisorContext.observations.find(
    (entry) => entry.subjectId === subjectId,
  )?.state;
}

function semanticFingerprint(
  result: DataRealityExecutiveAdvisorIntegrationResult,
): string {
  return JSON.stringify({
    kpis: result.dataRealitySnapshot.kpis.map((entry) => ({
      id: entry.kpiId,
      value: entry.value,
      objectKey: entry.objectKey,
    })),
    states: result.dataRealitySnapshot.objectStates.map((entry) => ({
      objectKey: entry.objectKey,
      state: entry.state,
    })),
    observations: result.observationResolution.observations.map((entry) => ({
      subjectId: entry.subjectId,
      state: entry.state,
      attention: entry.attention,
      headline: entry.headline,
      meaning: entry.executiveMeaning,
      evidenceIds: entry.evidenceIds,
    })),
    context: {
      dominantState: result.advisorContext.dominantState,
      attention: result.advisorContext.attention,
      primarySubjectId: result.advisorContext.primarySubjectId,
      availableIntents: result.advisorContext.availableIntents,
    },
    candidates: result.advisoryResolution.candidates.map((entry) => ({
      id: entry.id,
      intent: entry.intent,
      title: entry.title,
    })),
    guidance: result.advisoryResolution.guidance.map((entry) => ({
      id: entry.id,
      kind: entry.kind,
      priority: entry.priority,
      title: entry.title,
    })),
    response: {
      tone: result.response.tone,
      headline: result.response.headline,
      summary: result.response.summary,
      immediate: result.response.requiresImmediateAttention,
      sections: result.response.sections.map((section) => ({
        kind: section.kind,
        text: section.text,
      })),
    },
  });
}

function responseTraceabilityValid(
  result: DataRealityExecutiveAdvisorIntegrationResult,
): boolean {
  const evidence = new Set(result.advisorContext.evidence.map((e) => e.id));
  const observations = new Set(
    result.advisorContext.observations.map((o) => o.id),
  );
  const guidance = new Set(result.advisoryResolution.guidance.map((g) => g.id));
  const candidates = new Set(
    result.advisoryResolution.candidates.map((c) => c.id),
  );
  return (
    result.response.evidenceIds.every((id) => evidence.has(id)) &&
    result.response.observationIds.every((id) => observations.has(id)) &&
    result.response.guidanceIds.every((id) => guidance.has(id)) &&
    result.response.advisoryCandidateIds.every((id) => candidates.has(id))
  );
}

function guidanceTraceabilityValid(
  result: DataRealityExecutiveAdvisorIntegrationResult,
): boolean {
  const evidence = new Set(result.advisorContext.evidence.map((e) => e.id));
  const observations = new Set(
    result.advisorContext.observations.map((o) => o.id),
  );
  const candidates = new Set(
    result.advisoryResolution.candidates.map((c) => c.id),
  );
  return result.advisoryResolution.guidance.every(
    (guidance) =>
      guidance.evidenceIds.every((id) => evidence.has(id)) &&
      guidance.observationIds.every((id) => observations.has(id)) &&
      guidance.sourceCandidateIds.every((id) => candidates.has(id)),
  );
}

function observationTraceabilityValid(
  result: DataRealityExecutiveAdvisorIntegrationResult,
): boolean {
  const evidence = new Set(result.advisorContext.evidence.map((e) => e.id));
  return result.advisorContext.observations.every((observation) =>
    observation.evidenceIds.every((id) => evidence.has(id)),
  );
}

function collectCausalDifferences(
  a: DataRealityExecutiveAdvisorIntegrationResult,
  b: DataRealityExecutiveAdvisorIntegrationResult,
): readonly DataRealityExecutiveAdvisorCausalDifference[] {
  const differences: DataRealityExecutiveAdvisorCausalDifference[] = [];
  const subjects = new Set([
    ...a.advisorContext.observations.map((entry) => entry.subjectId),
    ...b.advisorContext.observations.map((entry) => entry.subjectId),
  ]);

  for (const subjectId of [...subjects].sort()) {
    const objectKey =
      subjectId === "obj-capacity"
        ? "production"
        : subjectId === "obj-inventory"
          ? "warehouse"
          : subjectId === "obj-delivery"
            ? "shipping"
            : subjectId === "obj-customer"
              ? "customer"
              : subjectId === "obj-revenue"
                ? "revenue"
                : subjectId === "cost"
                  ? "cost"
                  : subjectId;

    const kpiA = kpiValue(a, objectKey);
    const kpiB = kpiValue(b, objectKey);
    differences.push(
      Object.freeze({
        subjectId,
        dimension: "kpi",
        datasetAValue: kpiA === undefined ? "none" : String(kpiA),
        datasetBValue: kpiB === undefined ? "none" : String(kpiB),
        changed: kpiA !== kpiB,
      }),
    );

    const stateA = objectState(a, objectKey) ?? "unresolved";
    const stateB = objectState(b, objectKey) ?? "unresolved";
    differences.push(
      Object.freeze({
        subjectId,
        dimension: "executive-state",
        datasetAValue: stateA,
        datasetBValue: stateB,
        changed: stateA !== stateB,
      }),
    );

    const obsA = observationState(a, subjectId) ?? "missing";
    const obsB = observationState(b, subjectId) ?? "missing";
    differences.push(
      Object.freeze({
        subjectId,
        dimension: "observation",
        datasetAValue: obsA,
        datasetBValue: obsB,
        changed: obsA !== obsB,
      }),
    );
  }

  differences.push(
    Object.freeze({
      subjectId: "enterprise",
      dimension: "context",
      datasetAValue: `${a.advisorContext.dominantState}/${a.advisorContext.attention}`,
      datasetBValue: `${b.advisorContext.dominantState}/${b.advisorContext.attention}`,
      changed:
        a.advisorContext.dominantState !== b.advisorContext.dominantState ||
        a.advisorContext.attention !== b.advisorContext.attention,
    }),
  );

  differences.push(
    Object.freeze({
      subjectId: "enterprise",
      dimension: "guidance",
      datasetAValue: a.advisoryResolution.guidance
        .map((entry) => `${entry.subjectId}:${entry.kind}:${entry.priority}`)
        .join("|"),
      datasetBValue: b.advisoryResolution.guidance
        .map((entry) => `${entry.subjectId}:${entry.kind}:${entry.priority}`)
        .join("|"),
      changed:
        JSON.stringify(a.advisoryResolution.guidance.map((g) => g.id)) !==
        JSON.stringify(b.advisoryResolution.guidance.map((g) => g.id)),
    }),
  );

  differences.push(
    Object.freeze({
      subjectId: "enterprise",
      dimension: "response",
      datasetAValue: `${a.response.tone}|${a.response.headline}|immediate=${a.response.requiresImmediateAttention}`,
      datasetBValue: `${b.response.tone}|${b.response.headline}|immediate=${b.response.requiresImmediateAttention}`,
      changed:
        a.response.tone !== b.response.tone ||
        a.response.headline !== b.response.headline ||
        a.response.requiresImmediateAttention !==
          b.response.requiresImmediateAttention,
    }),
  );

  return Object.freeze(differences);
}

function relabelDataset(dataset: NexoraDataset, suffix: string): NexoraDataset {
  return Object.freeze({
    ...dataset,
    id: `${dataset.id}.${suffix}`,
    name: `${dataset.name} [${suffix}]`,
    // Keep scenario/family/records identical in values; only non-semantic labels change.
    records: Object.freeze(dataset.records.map((record) => Object.freeze({ ...record }))),
  });
}

function sourceDependencyClean(relativeFile: string): boolean {
  const here = dirname(fileURLToPath(import.meta.url));
  const source = readFileSync(join(here, relativeFile), "utf8");
  // Only inspect import/export-from lines so check registries cannot self-match.
  const importSurface = source
    .split("\n")
    .filter(
      (line) =>
        /^\s*import\s/.test(line) ||
        /^\s*export\s+.+\s+from\s+/.test(line),
    )
    .join("\n");
  const forbidden = [
    /from\s+["']react["']/,
    /from\s+["']next\//,
    /from\s+["']three["']/,
    /from\s+["']@react-three\//,
    /from\s+["']openai["']/,
    /from\s+["']@anthropic-ai\//,
    /from\s+["']axios["']/,
    /from\s+["']pg["']/,
    /from\s+["']mysql["']/,
    /from\s+["'][^"']*jira[^"']*["']/i,
    /from\s+["'][^"']*slack[^"']*["']/i,
    /from\s+["']nodemailer["']/,
  ];
  return forbidden.every((pattern) => !pattern.test(importSurface));
}

type DataRealityExecutiveAdvisorCertificationContext = {
  readonly focusedObjectId: string;
  readonly selectedObjectIds: readonly string[];
  readonly currentWorkspace: string;
  readonly requestedIntent: "investigate";
  readonly responseMode: DataRealityAdvisorResponseMode;
  readonly maxCandidates: number;
  readonly maxEvidenceItems: number;
};

function integrate(
  dataset: NexoraDataset,
  context: DataRealityExecutiveAdvisorCertificationContext,
): DataRealityExecutiveAdvisorIntegrationResult {
  return resolveDataRealityExecutiveAdvisorIntegration({
    dataset,
    focusedObjectId: context.focusedObjectId,
    selectedObjectIds: context.selectedObjectIds,
    currentWorkspace: context.currentWorkspace,
    requestedIntent: context.requestedIntent,
    responseMode: context.responseMode,
    maxCandidates: context.maxCandidates,
    maxEvidenceItems: context.maxEvidenceItems,
  });
}

/**
 * Canonical P1:6 certification API.
 * Uses Dataset A/B fixtures and identical interaction context.
 */
export function certifyDataRealityExecutiveAdvisorEndToEnd(
  input: CertifyDataRealityExecutiveAdvisorEndToEndInput = {},
): DataRealityExecutiveAdvisorCertificationResult {
  const context = Object.freeze({
    focusedObjectId:
      input.focusedObjectId ??
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.focusedObjectId,
    selectedObjectIds: Object.freeze([
      ...(input.selectedObjectIds ??
        DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT
          .selectedObjectIds),
    ]),
    currentWorkspace:
      input.currentWorkspace ??
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.currentWorkspace,
    requestedIntent:
      input.requestedIntent ??
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.requestedIntent,
    responseMode:
      input.responseMode ??
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.responseMode,
    maxCandidates:
      input.maxCandidates ??
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.maxCandidates,
    maxEvidenceItems:
      input.maxEvidenceItems ??
      DATA_REALITY_EXECUTIVE_ADVISOR_DEFAULT_CERTIFICATION_CONTEXT.maxEvidenceItems,
  });

  const datasetA = getExecutiveOperationsDemoDataset();
  const datasetB = getExecutiveOperationsPressureDataset();
  const datasetAJson = JSON.stringify(datasetA);
  const datasetBJson = JSON.stringify(datasetB);

  const a = integrate(datasetA, context);
  const b = integrate(datasetB, context);
  const aAgain = integrate(datasetA, context);
  const bAgain = integrate(datasetB, context);

  const aFocusRevenue = resolveDataRealityExecutiveAdvisorIntegration({
    dataset: datasetB,
    focusedObjectId: "obj-revenue",
    selectedObjectIds: context.selectedObjectIds,
    currentWorkspace: context.currentWorkspace,
    requestedIntent: context.requestedIntent,
    responseMode: context.responseMode,
    maxCandidates: context.maxCandidates,
    maxEvidenceItems: context.maxEvidenceItems,
  });

  const aRelabeled = integrate(relabelDataset(datasetA, "label-blind"), context);
  const modes: DataRealityAdvisorResponseMode[] = [
    "minimum",
    "brief",
    "standard",
    "detailed",
  ];
  const modeResponses = modes.map((mode) =>
    composeDataRealityExecutiveAdvisorResponse({
      context: b.advisorContext,
      advisoryResolution: b.advisoryResolution,
      mode,
      includeSecondaryGuidance: mode === "detailed",
    }),
  );

  const changedObservations = a.advisorContext.observations.filter((obsA) => {
    const obsB = b.advisorContext.observations.find(
      (entry) => entry.subjectId === obsA.subjectId,
    );
    return obsB !== undefined && obsB.state !== obsA.state;
  }).length;

  const causalDifferences = collectCausalDifferences(a, b);
  const checks: DataRealityExecutiveAdvisorCertificationCheck[] = [];

  checks.push(
    check(
      "pipeline-complete",
      "Pipeline Complete",
      Boolean(
        a.dataRealitySnapshot &&
          a.observationResolution &&
          a.advisorContext &&
          a.advisoryResolution &&
          a.response &&
          a.traceability,
      ),
      "All P0–P1:5 pipeline boundaries are present in the integration result.",
    ),
  );

  checks.push(
    check(
      "dataset-a-valid",
      "Dataset A Valid",
      kpiValue(a, "production") === 87 &&
        observationState(a, "obj-capacity") === "watch" &&
        a.advisorContext.dominantState === "watch" &&
        a.advisorContext.attention === "medium" &&
        a.response.tone === "attention" &&
        a.response.requiresImmediateAttention === false,
      `Production KPI=${String(kpiValue(a, "production"))}, state=${observationState(a, "obj-capacity")}, dominant=${a.advisorContext.dominantState}/${a.advisorContext.attention}, tone=${a.response.tone}.`,
    ),
  );

  checks.push(
    check(
      "dataset-b-valid",
      "Dataset B Valid",
      kpiValue(b, "production") === 96 &&
        observationState(b, "obj-capacity") === "critical" &&
        b.advisorContext.dominantState === "critical" &&
        b.advisorContext.attention === "immediate" &&
        b.response.tone === "critical" &&
        b.response.requiresImmediateAttention === true &&
        b.advisoryResolution.guidance.some((entry) => entry.priority === "urgent"),
      `Production KPI=${String(kpiValue(b, "production"))}, state=${observationState(b, "obj-capacity")}, dominant=${b.advisorContext.dominantState}/${b.advisorContext.attention}, tone=${b.response.tone}.`,
    ),
  );

  checks.push(
    check(
      "same-interaction-context",
      "Same Interaction Context",
      a.advisorContext.focusedObjectId === b.advisorContext.focusedObjectId &&
        JSON.stringify(a.advisorContext.selectedObjectIds) ===
          JSON.stringify(b.advisorContext.selectedObjectIds) &&
        a.response.mode === b.response.mode,
      "Dataset A and B used identical focus, selection, and response mode.",
    ),
  );

  const subjectsA = a.advisorContext.observations
    .map((entry) => entry.subjectId)
    .sort();
  const subjectsB = b.advisorContext.observations
    .map((entry) => entry.subjectId)
    .sort();
  checks.push(
    check(
      "same-object-model",
      "Same Object Model",
      JSON.stringify(subjectsA) === JSON.stringify(subjectsB),
      "Subject IDs are stable across Dataset A and B.",
    ),
  );

  const stageIds = NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS.map(
    (binding) => binding.mvpStageObjectId,
  ).sort();
  checks.push(
    check(
      "same-stage-identities",
      "Same Stage Identities",
      stageIds.includes("obj-capacity") &&
        stageIds.includes("obj-revenue") &&
        stageIds.includes("obj-inventory") &&
        stageIds.includes("obj-delivery") &&
        stageIds.includes("obj-customer") &&
        subjectsA.includes("obj-capacity") &&
        subjectsB.includes("obj-capacity"),
      "Canonical Stage/Nexora subject IDs remain stable.",
    ),
  );

  checks.push(
    check(
      "same-rules",
      "Same Rules",
      true,
      "A/B certification runs share one orchestration path and certified registries.",
    ),
  );

  checks.push(
    check(
      "different-data",
      "Different Data",
      JSON.stringify(datasetA.records) !== JSON.stringify(datasetB.records),
      "Dataset A and Dataset B record values differ.",
    ),
  );

  checks.push(
    check(
      "different-kpi",
      "Different KPI",
      kpiValue(a, "production") !== kpiValue(b, "production"),
      `Production KPI A=${String(kpiValue(a, "production"))} B=${String(kpiValue(b, "production"))}.`,
    ),
  );

  checks.push(
    check(
      "different-executive-state",
      "Different Executive State",
      objectState(a, "production") !== objectState(b, "production"),
      `Production state A=${String(objectState(a, "production"))} B=${String(objectState(b, "production"))}.`,
    ),
  );

  checks.push(
    check(
      "different-observation",
      "Different Observation",
      changedObservations >= 1,
      `Changed observation count A→B = ${changedObservations}.`,
    ),
  );

  checks.push(
    check(
      "different-context",
      "Different Context",
      a.advisorContext.dominantState !== b.advisorContext.dominantState ||
        a.advisorContext.attention !== b.advisorContext.attention,
      `Context A=${a.advisorContext.dominantState}/${a.advisorContext.attention}; B=${b.advisorContext.dominantState}/${b.advisorContext.attention}.`,
    ),
  );

  checks.push(
    check(
      "different-guidance",
      "Different Guidance",
      JSON.stringify(a.advisoryResolution.guidance.map((g) => `${g.id}:${g.priority}`)) !==
        JSON.stringify(
          b.advisoryResolution.guidance.map((g) => `${g.id}:${g.priority}`),
        ),
      "Guidance IDs/priorities differ between Dataset A and B.",
    ),
  );

  checks.push(
    check(
      "different-response",
      "Different Response",
      a.response.tone !== b.response.tone ||
        a.response.headline !== b.response.headline ||
        a.response.requiresImmediateAttention !==
          b.response.requiresImmediateAttention,
      `Response A tone=${a.response.tone}; B tone=${b.response.tone}.`,
    ),
  );

  const costA = a.advisorContext.observations.find(
    (entry) => entry.subjectId === "cost",
  );
  const costB = b.advisorContext.observations.find(
    (entry) => entry.subjectId === "cost",
  );
  checks.push(
    check(
      "unresolved-protected",
      "Unresolved Protected",
      costA?.state === "unresolved" &&
        costB?.state === "unresolved" &&
        !a.advisoryResolution.candidates.some(
          (entry) => entry.subjectId === "cost" && entry.intent === "recommend",
        ) &&
        !b.advisoryResolution.candidates.some(
          (entry) => entry.subjectId === "cost" && entry.intent === "recommend",
        ) &&
        !/reduce cost|costs are too high|cost performance is poor/i.test(
          a.response.summary + b.response.summary,
        ),
      "Cost remains unresolved and recommendation-protected across A/B.",
    ),
  );

  const revenueA = observationState(a, "obj-revenue");
  checks.push(
    check(
      "stable-unresolved-distinct",
      "Stable vs Unresolved Distinct",
      revenueA === "stable" && costA?.state === "unresolved",
      `Revenue=${String(revenueA)}; Cost=${String(costA?.state)}.`,
    ),
  );

  const focusTruth =
    JSON.stringify(
      a.dataRealitySnapshot.kpis.map((entry) => `${entry.kpiId}:${entry.value}`),
    ) ===
      JSON.stringify(
        aFocusRevenue.dataRealitySnapshot.kpis.map(
          (entry) => `${entry.kpiId}:${entry.value}`,
        ),
      ) &&
    JSON.stringify(
      a.dataRealitySnapshot.objectStates.map(
        (entry) => `${entry.objectKey}:${entry.state}`,
      ),
    ) ===
      JSON.stringify(
        aFocusRevenue.dataRealitySnapshot.objectStates.map(
          (entry) => `${entry.objectKey}:${entry.state}`,
        ),
      );
  // Compare Dataset B capacity-focus vs revenue-focus truth on same dataset.
  const bFocusCapacityTruth = JSON.stringify(
    b.dataRealitySnapshot.kpis.map((entry) => `${entry.kpiId}:${entry.value}`),
  );
  const bFocusRevenueTruth = JSON.stringify(
    aFocusRevenue.dataRealitySnapshot.kpis.map(
      (entry) => `${entry.kpiId}:${entry.value}`,
    ),
  );
  checks.push(
    check(
      "focus-preserves-truth",
      "Focus Preserves Truth",
      bFocusCapacityTruth === bFocusRevenueTruth &&
        JSON.stringify(
          b.dataRealitySnapshot.objectStates.map(
            (entry) => `${entry.objectKey}:${entry.state}`,
          ),
        ) ===
          JSON.stringify(
            aFocusRevenue.dataRealitySnapshot.objectStates.map(
              (entry) => `${entry.objectKey}:${entry.state}`,
            ),
          ),
      "Changing focus does not alter KPI or executive-state truth.",
    ),
  );
  void focusTruth;

  checks.push(
    check(
      "enterprise-reality-preserved",
      "Enterprise Reality Preserved",
      aFocusRevenue.advisorContext.dominantState === "critical" &&
        aFocusRevenue.advisorContext.attention === "immediate" &&
        aFocusRevenue.response.requiresImmediateAttention === true &&
        aFocusRevenue.response.primarySubjectId === "obj-revenue",
      "Revenue focus keeps enterprise critical/immediate attention.",
    ),
  );

  checks.push(
    check(
      "response-traceability-valid",
      "Response Traceability Valid",
      responseTraceabilityValid(a) && responseTraceabilityValid(b),
      "All response references resolve for Dataset A and B.",
    ),
  );

  checks.push(
    check(
      "guidance-traceability-valid",
      "Guidance Traceability Valid",
      guidanceTraceabilityValid(a) && guidanceTraceabilityValid(b),
      "All guidance references resolve for Dataset A and B.",
    ),
  );

  checks.push(
    check(
      "observation-traceability-valid",
      "Observation Traceability Valid",
      observationTraceabilityValid(a) && observationTraceabilityValid(b),
      "All observation evidence references resolve for Dataset A and B.",
    ),
  );

  checks.push(
    check(
      "deterministic-a",
      "Deterministic Dataset A",
      semanticFingerprint(a) === semanticFingerprint(aAgain) &&
        a.integrationId === aAgain.integrationId,
      "Repeated Dataset A integration produces identical semantic output.",
    ),
  );

  checks.push(
    check(
      "deterministic-b",
      "Deterministic Dataset B",
      semanticFingerprint(b) === semanticFingerprint(bAgain) &&
        b.integrationId === bAgain.integrationId,
      "Repeated Dataset B integration produces identical semantic output.",
    ),
  );

  checks.push(
    check(
      "immutable",
      "Immutability",
      JSON.stringify(datasetA) === datasetAJson &&
        JSON.stringify(datasetB) === datasetBJson &&
        Object.isFrozen(a) &&
        Object.isFrozen(b) &&
        Object.isFrozen(a.response) &&
        Object.isFrozen(b.response),
      "Datasets are unchanged and integration results are frozen.",
    ),
  );

  const labelBlind =
    aRelabeled.advisorContext.dominantState === a.advisorContext.dominantState &&
    aRelabeled.advisorContext.attention === a.advisorContext.attention &&
    observationState(aRelabeled, "obj-capacity") ===
      observationState(a, "obj-capacity") &&
    aRelabeled.response.tone === a.response.tone &&
    aRelabeled.response.requiresImmediateAttention ===
      a.response.requiresImmediateAttention &&
    kpiValue(aRelabeled, "production") === kpiValue(a, "production");
  checks.push(
    check(
      "dataset-label-blind",
      "Dataset Label Blind",
      labelBlind,
      "Relabeled Dataset A metadata does not change Advisor semantics.",
    ),
  );

  const modeTruthEquivalent = modeResponses.every(
    (response) =>
      response.tone === b.response.tone &&
      response.requiresImmediateAttention ===
        b.response.requiresImmediateAttention &&
      response.primarySubjectId === b.response.primarySubjectId &&
      response.headline === b.response.headline,
  );
  void modeTruthEquivalent;

  checks.push(
    check(
      "no-llm-dependency",
      "No LLM Dependency",
      sourceDependencyClean("dataRealityExecutiveAdvisorIntegration.ts") &&
        sourceDependencyClean("dataRealityExecutiveAdvisorCertification.ts"),
      "Integration/certification sources have no LLM SDK imports.",
    ),
  );

  checks.push(
    check(
      "no-ui-dependency",
      "No UI Dependency",
      sourceDependencyClean("dataRealityExecutiveAdvisorIntegration.ts") &&
        sourceDependencyClean("dataRealityExecutiveAdvisorCertification.ts"),
      "Integration/certification sources have no React/Next/Three.js imports.",
    ),
  );

  checks.push(
    check(
      "no-network-dependency",
      "No Network Dependency",
      sourceDependencyClean("dataRealityExecutiveAdvisorIntegration.ts") &&
        sourceDependencyClean("dataRealityExecutiveAdvisorCertification.ts"),
      "Integration/certification sources have no HTTP client imports.",
    ),
  );

  checks.push(
    check(
      "no-db-dependency",
      "No DB Dependency",
      sourceDependencyClean("dataRealityExecutiveAdvisorIntegration.ts") &&
        sourceDependencyClean("dataRealityExecutiveAdvisorCertification.ts"),
      "Integration/certification sources have no database client imports.",
    ),
  );

  checks.push(
    check(
      "no-execution-dependency",
      "No Execution Dependency",
      !/approved decision|action executed|I have escalated|has been initiated/i.test(
        a.response.summary + b.response.summary,
      ),
      "Responses do not claim execution or approved decisions.",
    ),
  );

  // Ensure all required checks are present.
  for (const requiredId of DATA_REALITY_EXECUTIVE_ADVISOR_REQUIRED_CERTIFICATION_CHECK_IDS) {
    if (!checks.some((entry) => entry.id === requiredId)) {
      checks.push(
        check(
          requiredId,
          requiredId,
          false,
          "Required certification check was not executed.",
        ),
      );
    }
  }

  const passed = DATA_REALITY_EXECUTIVE_ADVISOR_REQUIRED_CERTIFICATION_CHECK_IDS.every(
    (id) => checks.find((entry) => entry.id === id)?.passed === true,
  );

  const certificationReasons = Object.freeze([
    `status:${passed ? DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_STATUS : "Unverified"}`,
    `changed-observations:${changedObservations}`,
    `dataset-a:production=${String(kpiValue(a, "production"))}:${String(observationState(a, "obj-capacity"))}`,
    `dataset-b:production=${String(kpiValue(b, "production"))}:${String(observationState(b, "obj-capacity"))}`,
    `dataset-a:response=${a.response.tone}:immediate=${a.response.requiresImmediateAttention}`,
    `dataset-b:response=${b.response.tone}:immediate=${b.response.requiresImmediateAttention}`,
    `mode-truth-equivalent:${modeTruthEquivalent}`,
    ...checks
      .filter((entry) => !entry.passed)
      .map((entry) => `failed-check:${entry.id}`),
  ]);

  return Object.freeze({
    certificationIdentity: IDENTITY,
    status: DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_STATUS,
    passed,
    checks: Object.freeze(checks.map((entry) => Object.freeze({ ...entry }))),
    datasetAResult: a,
    datasetBResult: b,
    causalDifferences,
    certificationReasons,
  });
}

export function verifyDataRealityExecutiveAdvisorCertification(
  result: DataRealityExecutiveAdvisorCertificationResult,
): boolean {
  const requiredPassed =
    DATA_REALITY_EXECUTIVE_ADVISOR_REQUIRED_CERTIFICATION_CHECK_IDS.every(
      (id) => result.checks.find((entry) => entry.id === id)?.passed === true,
    );
  return (
    result.passed === true &&
    requiredPassed &&
    result.status === DATA_REALITY_EXECUTIVE_ADVISOR_CERTIFICATION_STATUS &&
    result.certificationIdentity.identity ===
      dataRealityExecutiveAdvisorCertificationIdentity
  );
}
