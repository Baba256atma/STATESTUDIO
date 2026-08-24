/**
 * MVP-OUT:1-R2 — post-decision Data Reality observation capture seam.
 *
 * Trigger is canonical Data Reality journal commit, not React render.
 * CORE-OUT:1A remains the capture/linkage writer.
 */

import type { NexoraKPIResult } from "../data-reality/dataRealityContracts.ts";
import type { NexoraLiveCommittedObservation } from "../data-reality/liveDataConnectorFoundation.ts";
import {
  listAllNexoraLiveCommittedObservations,
  subscribeLiveDataConnections,
} from "../data-reality/liveDataConnectionStore.ts";
import type { ExecutiveOutcomeExpectation } from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import {
  captureOutcomeObservation,
  type OutcomeLinkBasis,
  type OutcomeObservationInput,
  type OutcomeObservationWindowRecord,
} from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import type { DecisionExpectedOutcomeBinding } from "./nexoraDecisionExpectedOutcomeBinding.ts";
import { isPostBoundaryObservation } from "./nexoraDecisionOutcomeCommitment.ts";

export const nexoraPostDecisionObservationCaptureIdentity =
  "MVP-OUT:1-R2/PostDecisionObservationCapture" as const;

export type PostDecisionCaptureContext = Readonly<{
  readonly decisionId: string | null;
  readonly executionId: string | null;
  readonly subjectId: string | null;
  readonly expected: ExecutiveOutcomeExpectation | null;
  readonly window: OutcomeObservationWindowRecord | null;
  readonly binding: DecisionExpectedOutcomeBinding | null;
  readonly linkBasis: OutcomeLinkBasis | null;
}>;

let captureContext: PostDecisionCaptureContext | null = null;
let ingestCount = 0;
const ingestedLiveIds = new Set<string>();

function onLiveJournalPublish(): void {
  if (captureContext == null) return;
  for (const observation of listAllNexoraLiveCommittedObservations()) {
    if (ingestedLiveIds.has(observation.observationId)) continue;
    ingestedLiveIds.add(observation.observationId);
    ingestCommittedLiveObservation(observation);
  }
}

subscribeLiveDataConnections(onLiveJournalPublish);

export function registerPostDecisionCaptureContext(
  context: PostDecisionCaptureContext | null,
): void {
  captureContext = context;
  onLiveJournalPublish();
}

export function resetPostDecisionCaptureForTests(): void {
  captureContext = null;
  ingestCount = 0;
  ingestedLiveIds.clear();
}

export function getPostDecisionCaptureIngestCount(): number {
  return ingestCount;
}

function validationFromSnapshot(
  observation: NexoraLiveCommittedObservation,
): OutcomeObservationInput["validationState"] {
  return observation.snapshot.validation.state;
}

export function ingestDataRealityKpisForOutcomeCapture(input: {
  readonly kpis: readonly NexoraKPIResult[];
  readonly sourceId: string | null;
  readonly datasetId: string | null;
  readonly observedAt: string | null;
  readonly capturedAt: string | null;
  readonly provenanceRefs: readonly string[];
  readonly validationState: OutcomeObservationInput["validationState"];
  readonly freshnessState?: OutcomeObservationInput["freshnessState"];
}): readonly ReturnType<typeof captureOutcomeObservation>[] {
  ingestCount += 1;
  const context = captureContext;
  const captured = input.kpis.map((kpi) => {
    const observation: OutcomeObservationInput = Object.freeze({
      subjectId: kpi.nexoraObjectId || context?.subjectId || "",
      metricId: kpi.kpiId,
      dimension: kpi.kpiId,
      unit: kpi.unit,
      value: kpi.value,
      qualitativeState: null,
      observedAt: input.observedAt ?? kpi.calculatedAt,
      capturedAt: input.capturedAt ?? kpi.calculatedAt,
      sourceId: input.sourceId,
      datasetId: input.datasetId,
      evidenceRefs: Object.freeze([
        Object.freeze({
          sourceKind: "data-reality" as const,
          sourceId: input.sourceId ?? kpi.kpiId,
          subjectId: kpi.nexoraObjectId,
          factKey: kpi.kpiId,
        }),
      ]),
      provenanceRefs: Object.freeze([...input.provenanceRefs]),
      validationState: input.validationState,
      freshnessState: input.freshnessState ?? "current",
      decisionId: context?.decisionId ?? null,
      executionId: context?.executionId ?? null,
      expectedOutcomeId: context?.binding?.expectedOutcomeId ?? null,
      observationWindowId: context?.window?.id ?? null,
    });
    return captureOutcomeObservation({
      observation,
      expected: context?.expected ?? null,
      window: context?.window ?? null,
      linkBasis:
        context?.binding?.status === "bound" &&
        isPostBoundaryObservation(
          input.observedAt ?? kpi.calculatedAt,
          context.window?.openedAt ?? context.window?.expectedStartAt,
        )
          ? (context.linkBasis ?? "metric-binding")
          : null,
    });
  });
  return Object.freeze(captured);
}

export function ingestCommittedLiveObservation(
  observation: NexoraLiveCommittedObservation,
): void {
  const provenance = Object.freeze([
    observation.observationId,
    observation.handoff.dataset.id,
    observation.snapshot.source.identity.connectionId,
  ]);
  ingestDataRealityKpisForOutcomeCapture({
    kpis: observation.dataReality.kpis,
    sourceId: observation.sourceContextId,
    datasetId: observation.handoff.dataset.id,
    observedAt: observation.observedAt,
    capturedAt: observation.committedAt,
    provenanceRefs: provenance,
    validationState: validationFromSnapshot(observation),
    freshnessState:
      observation.snapshot.validation.state === "stale" ? "stale" : "current",
  });
}
