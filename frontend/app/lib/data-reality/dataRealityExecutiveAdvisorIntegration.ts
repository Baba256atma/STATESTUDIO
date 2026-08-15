/**
 * P1:6 — Data-Reality-Aware Executive Advisor Integration.
 *
 * Orchestrates the certified P0 → P1:5 chain into one integration result.
 * Does not reinterpret upstream logic, invent claims, or call generative AI.
 *
 * Chain:
 *   NexoraDataset
 *   → P0 Data Reality Snapshot
 *   → P1:2 Observation & Evidence
 *   → P1:3 Advisor Context
 *   → P1:4 Advisory Resolution
 *   → P1:5 Executive Advisor Response
 *   → Traceability Assembly
 */

import type { NexoraDataRealitySnapshot, NexoraDataset } from "./dataRealityContracts.ts";
import type { DataRealityAdvisorIntentKind } from "./dataRealityAwareExecutiveAdvisorFoundation.ts";
import type { DataRealityAwareAdvisorContext } from "./dataRealityAwareExecutiveAdvisorFoundation.ts";
import type { DataRealityAdvisorResponseMode } from "./dataRealityExecutiveAdvisorResponseComposition.ts";
import type { DataRealityExecutiveObservationResolutionResult } from "./dataRealityExecutiveObservationResolution.ts";
import type { DataRealityExecutiveAdvisoryResolutionResult } from "./dataRealityExecutiveAdvisoryResolution.ts";
import type { DataRealityExecutiveAdvisorResponse } from "./dataRealityExecutiveAdvisorResponseComposition.ts";

import { resolveDatasetExecutiveReality } from "./dataRealityFoundation.ts";
import { resolveDataRealityExecutiveObservationResolution } from "./dataRealityExecutiveObservationResolution.ts";
import { buildDataRealityAwareAdvisorContext } from "./dataRealityAwareAdvisorContextResolution.ts";
import { resolveDataRealityExecutiveAdvisoryResolution } from "./dataRealityExecutiveAdvisoryResolution.ts";
import { composeDataRealityExecutiveAdvisorResponse } from "./dataRealityExecutiveAdvisorResponseComposition.ts";
import { getExecutiveOperationsResolvedObjectBindings } from "./demo/executiveOperationsObjectBindings.ts";
import { getExecutiveOperationsKpiDefinitions } from "./demo/executiveOperationsKPIDefinitions.ts";
import { getExecutiveOperationsExecutiveStateRules } from "./demo/executiveOperationsExecutiveStateRules.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityExecutiveAdvisorIntegrationIdentity =
  "P1:6/DataRealityExecutiveAdvisorIntegration" as const;

export const dataRealityExecutiveAdvisorIntegrationVersion = "1.0.0" as const;

export const dataRealityExecutiveAdvisorIntegrationNamespace =
  "nexora.data-reality.executive-advisor.integration" as const;

export const dataRealityExecutiveAdvisorIntegrationPhase =
  "Integration" as const;

export const dataRealityExecutiveAdvisorIntegrationArchitecturalRole =
  "DataRealityExecutiveAdvisorIntegration" as const;

export interface DataRealityExecutiveAdvisorIntegrationIdentity {
  readonly identity: "P1:6/DataRealityExecutiveAdvisorIntegration";
  readonly version: "1.0.0";
  readonly namespace: "nexora.data-reality.executive-advisor.integration";
  readonly phase: "Integration";
  readonly architecturalRole: "DataRealityExecutiveAdvisorIntegration";
}

const IDENTITY: DataRealityExecutiveAdvisorIntegrationIdentity = Object.freeze({
  identity: dataRealityExecutiveAdvisorIntegrationIdentity,
  version: dataRealityExecutiveAdvisorIntegrationVersion,
  namespace: dataRealityExecutiveAdvisorIntegrationNamespace,
  phase: dataRealityExecutiveAdvisorIntegrationPhase,
  architecturalRole: dataRealityExecutiveAdvisorIntegrationArchitecturalRole,
});

export function getDataRealityExecutiveAdvisorIntegrationIdentity(): DataRealityExecutiveAdvisorIntegrationIdentity {
  return IDENTITY;
}

// ─── Traceability ───────────────────────────────────────────────────────────

export type DataRealityExecutiveAdvisorTraceKind =
  | "dataset"
  | "snapshot"
  | "subject"
  | "evidence"
  | "observation"
  | "context"
  | "candidate"
  | "guidance"
  | "response";

export interface DataRealityExecutiveAdvisorTraceLink {
  readonly fromKind: DataRealityExecutiveAdvisorTraceKind;
  readonly fromId: string;
  readonly toKind: Exclude<DataRealityExecutiveAdvisorTraceKind, "dataset">;
  readonly toId: string;
  readonly relation: string;
}

export interface DataRealityExecutiveAdvisorTraceability {
  readonly datasetId?: string;
  readonly snapshotId?: string;
  readonly contextId: string;
  readonly responseId: string;
  readonly subjectIds: readonly string[];
  readonly evidenceIds: readonly string[];
  readonly observationIds: readonly string[];
  readonly candidateIds: readonly string[];
  readonly guidanceIds: readonly string[];
  readonly traceLinks: readonly DataRealityExecutiveAdvisorTraceLink[];
}

// ─── Integration contracts ──────────────────────────────────────────────────

export interface ResolveDataRealityExecutiveAdvisorIntegrationInput {
  readonly dataset: NexoraDataset;
  readonly focusedObjectId?: string;
  readonly selectedObjectIds?: readonly string[];
  readonly currentWorkspace?: string;
  readonly currentGoalId?: string;
  readonly currentScenarioId?: string;
  readonly currentDecisionId?: string;
  readonly requestedIntent?: DataRealityAdvisorIntentKind;
  readonly responseMode?: DataRealityAdvisorResponseMode;
  readonly includeSecondaryGuidance?: boolean;
  readonly maxEvidenceItems?: number;
  readonly maxCandidates?: number;
}

export interface DataRealityExecutiveAdvisorIntegrationResult {
  readonly integrationId: string;
  readonly dataRealitySnapshot: NexoraDataRealitySnapshot;
  readonly observationResolution: DataRealityExecutiveObservationResolutionResult;
  readonly advisorContext: DataRealityAwareAdvisorContext;
  readonly advisoryResolution: DataRealityExecutiveAdvisoryResolutionResult;
  readonly response: DataRealityExecutiveAdvisorResponse;
  readonly traceability: DataRealityExecutiveAdvisorTraceability;
  readonly resolutionReasons: readonly string[];
}

function normalizeToken(value: string | undefined): string {
  if (!value || value.length === 0) return "none";
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function freezeLink(
  link: DataRealityExecutiveAdvisorTraceLink,
): DataRealityExecutiveAdvisorTraceLink {
  return Object.freeze({ ...link });
}

function assembleTraceability(input: {
  readonly datasetId: string;
  readonly snapshot: NexoraDataRealitySnapshot;
  readonly observationResolution: DataRealityExecutiveObservationResolutionResult;
  readonly advisorContext: DataRealityAwareAdvisorContext;
  readonly advisoryResolution: DataRealityExecutiveAdvisoryResolutionResult;
  readonly response: DataRealityExecutiveAdvisorResponse;
}): DataRealityExecutiveAdvisorTraceability {
  const snapshotId = input.snapshot.datasetId;
  const subjectIds = Object.freeze(
    [...new Set(input.advisorContext.observations.map((entry) => entry.subjectId))]
      .sort((a, b) => a.localeCompare(b)),
  );
  const evidenceIds = Object.freeze(
    input.advisorContext.evidence.map((entry) => entry.id),
  );
  const observationIds = Object.freeze(
    input.advisorContext.observations.map((entry) => entry.id),
  );
  const candidateIds = Object.freeze(
    input.advisoryResolution.candidates.map((entry) => entry.id),
  );
  const guidanceIds = Object.freeze(
    input.advisoryResolution.guidance.map((entry) => entry.id),
  );

  const links: DataRealityExecutiveAdvisorTraceLink[] = [];
  links.push(
    freezeLink({
      fromKind: "dataset",
      fromId: input.datasetId,
      toKind: "snapshot",
      toId: snapshotId,
      relation: "dataset-produces-snapshot",
    }),
  );

  for (const evidence of input.advisorContext.evidence) {
    links.push(
      freezeLink({
        fromKind: "snapshot",
        fromId: snapshotId,
        toKind: "evidence",
        toId: evidence.id,
        relation: "snapshot-supports-evidence",
      }),
    );
  }

  for (const observation of input.advisorContext.observations) {
    for (const evidenceId of observation.evidenceIds) {
      links.push(
        freezeLink({
          fromKind: "evidence",
          fromId: evidenceId,
          toKind: "observation",
          toId: observation.id,
          relation: "evidence-supports-observation",
        }),
      );
    }
    links.push(
      freezeLink({
        fromKind: "observation",
        fromId: observation.id,
        toKind: "context",
        toId: input.advisorContext.contextId,
        relation: "observation-informs-context",
      }),
    );
  }

  for (const candidate of input.advisoryResolution.candidates) {
    links.push(
      freezeLink({
        fromKind: "context",
        fromId: input.advisorContext.contextId,
        toKind: "candidate",
        toId: candidate.id,
        relation: "context-produces-candidate",
      }),
    );
  }

  for (const guidance of input.advisoryResolution.guidance) {
    for (const candidateId of guidance.sourceCandidateIds) {
      links.push(
        freezeLink({
          fromKind: "candidate",
          fromId: candidateId,
          toKind: "guidance",
          toId: guidance.id,
          relation: "candidate-supports-guidance",
        }),
      );
    }
    links.push(
      freezeLink({
        fromKind: "guidance",
        fromId: guidance.id,
        toKind: "response",
        toId: input.response.id,
        relation: "guidance-composes-response",
      }),
    );
  }

  links.push(
    freezeLink({
      fromKind: "context",
      fromId: input.advisorContext.contextId,
      toKind: "response",
      toId: input.response.id,
      relation: "context-composes-response",
    }),
  );

  return Object.freeze({
    datasetId: input.datasetId,
    snapshotId,
    contextId: input.advisorContext.contextId,
    responseId: input.response.id,
    subjectIds,
    evidenceIds,
    observationIds,
    candidateIds,
    guidanceIds,
    traceLinks: Object.freeze(links),
  });
}

/**
 * Canonical P1:6 orchestration API.
 * One pass: Dataset → P0 → P1:2 → P1:3 → P1:4 → P1:5 → Traceability.
 */
export function resolveDataRealityExecutiveAdvisorIntegration(
  input: ResolveDataRealityExecutiveAdvisorIntegrationInput,
): DataRealityExecutiveAdvisorIntegrationResult {
  const responseMode = input.responseMode ?? "standard";
  const requestedIntent = input.requestedIntent ?? "investigate";

  const p0 = resolveDatasetExecutiveReality(input.dataset, {
    bindings: getExecutiveOperationsResolvedObjectBindings(),
    definitions: getExecutiveOperationsKpiDefinitions(),
    rules: getExecutiveOperationsExecutiveStateRules(),
  });
  const snapshot = p0.snapshot;

  const observationResolution = resolveDataRealityExecutiveObservationResolution({
    snapshot,
    focusedObjectId: input.focusedObjectId,
    selectedObjectIds: input.selectedObjectIds,
  });

  const advisorContext = buildDataRealityAwareAdvisorContext({
    dataRealitySnapshot: snapshot,
    focusedObjectId: input.focusedObjectId,
    selectedObjectIds: input.selectedObjectIds,
    currentWorkspace: input.currentWorkspace,
    currentGoalId: input.currentGoalId,
    currentScenarioId: input.currentScenarioId,
    currentDecisionId: input.currentDecisionId,
    requestedIntent,
  });

  const advisoryResolution = resolveDataRealityExecutiveAdvisoryResolution({
    context: advisorContext,
    requestedIntent,
    maxCandidates: input.maxCandidates,
  });

  const response = composeDataRealityExecutiveAdvisorResponse({
    context: advisorContext,
    advisoryResolution,
    mode: responseMode,
    includeSecondaryGuidance: input.includeSecondaryGuidance,
    maxEvidenceItems: input.maxEvidenceItems,
  });

  const traceability = assembleTraceability({
    datasetId: input.dataset.id,
    snapshot,
    observationResolution,
    advisorContext,
    advisoryResolution,
    response,
  });

  const integrationId = [
    "advisor-integration",
    normalizeToken(input.dataset.id),
    normalizeToken(advisorContext.contextId),
    normalizeToken(response.id),
  ].join(":");

  const resolutionReasons = Object.freeze([
    `p0-status:${p0.status}`,
    `snapshot:${snapshot.datasetId}`,
    `dominant-state:${advisorContext.dominantState}`,
    `dominant-attention:${advisorContext.attention}`,
    `primary-subject:${advisorContext.primarySubjectKind}:${advisorContext.primarySubjectId ?? "none"}`,
    `response-mode:${responseMode}`,
    `response-tone:${response.tone}`,
    `requested-intent:${requestedIntent}`,
    ...observationResolution.resolutionReasons.map(
      (reason) => `observation:${reason}`,
    ),
    ...advisoryResolution.resolutionReasons.map(
      (reason) => `advisory:${reason}`,
    ),
  ]);

  return Object.freeze({
    integrationId,
    dataRealitySnapshot: snapshot,
    observationResolution,
    advisorContext,
    advisoryResolution,
    response,
    traceability,
    resolutionReasons,
  });
}
