/**
 * DATA-UX:1 — read-only RDI source projection for Decision Theatre.
 *
 * This adapter references a committed RDI:2 import. It owns no source truth,
 * parsing, mapping, evidence, relationships, Stage state, or Director state.
 */

import type { CsvCommittedImport } from "../data-reality/csvRealDataImportStore.ts";
import { projectExecutiveSourceIntelligence } from "../data-reality/executiveSourceIntelligence.ts";
import type { NexoraExecutiveReference } from "../director/nexoraSemanticPresentationDirector.ts";
import { NEXORA_DECISION_THEATRE_DATA_ID_PREFIX } from "./nexoraDecisionTheatreVisualFamily.ts";
import { resolveNexoraDecisionTheatreRelationshipVisual } from "./nexoraDecisionTheatreRelationshipGrammar.ts";
import { createNexoraDecisionTheatreVisualClaim } from "./nexoraDecisionTheatreVisualClaimLedger.ts";

export const nexoraDecisionTheatreDataObjectProjectionIdentity =
  "DATA-UX:1/DecisionTheatreDataObjectProjection" as const;

export type NexoraDecisionTheatreDataRelationship = Readonly<{
  id: string;
  sourceId: string;
  targetId: string;
  targetLabel: string;
  semanticRelation: "supplies-data-to";
  supportState: "established";
  provenanceRef: string;
  claimId: string;
  impliesCausality: false;
  visual: ReturnType<typeof resolveNexoraDecisionTheatreRelationshipVisual>;
}>;

export type NexoraDecisionTheatreDataObject = Readonly<{
  visualFamily: "DATA_OBJECT";
  id: string;
  label: string;
  sourceType: "csv";
  workspaceId: string;
  sourceId: string;
  sourceSnapshotRef: string;
  dataRealityRef: string;
  provenanceRef: string;
  validationState: "valid";
  understandingState: "validated-mapping";
  recordCount: number;
  columnCount: number;
  confirmedFieldCount: number;
  unresolvedFieldCount: number;
  updatedAt: string;
  authoritativeSource: "RDI:2/CsvCommittedImport";
  projectionAuthority: typeof nexoraDecisionTheatreDataObjectProjectionIdentity;
  stageCompatibility: Readonly<{
    participantId: string;
    visualFamily: "DATA_OBJECT";
    rendererRequired: true;
    navigationEligible: false;
    inspectionEligible: true;
  }>;
  directorCompatibility: NexoraExecutiveReference;
  relationships: readonly NexoraDecisionTheatreDataRelationship[];
  semanticSafety: Readonly<{
    isEvidence: false;
    impliesCausality: false;
    createsBusinessTruth: false;
    ambiguityRequiresClarification: true;
  }>;
  writes: Readonly<{
    dataReality: false;
    sourceSnapshot: false;
    evidence: false;
    stage: false;
    director: false;
    advisor: false;
  }>;
}>;

/** Stable identity is derived only from the canonical workspace-scoped RDI source identity. */
export function deriveNexoraDecisionTheatreDataObjectId(
  workspaceId: string,
  sourceId: string,
): string {
  return `${NEXORA_DECISION_THEATRE_DATA_ID_PREFIX}${encodeURIComponent(workspaceId)}:${encodeURIComponent(sourceId)}`;
}

export function projectCsvImportAsDecisionTheatreDataObject(
  committed: CsvCommittedImport,
): NexoraDecisionTheatreDataObject {
  const snapshot = committed.prepared.snapshot;
  const handoff = committed.prepared.handoff;
  if (!committed.prepared.ready || !snapshot || !handoff) {
    throw new Error("Decision Theatre can project only a validated committed RDI:2 source.");
  }
  if (
    committed.workspaceId !== committed.prepared.workspaceId ||
    committed.workspaceId !== snapshot.source.identity.workspaceId ||
    committed.sourceContextId !== snapshot.source.identity.sourceId ||
    committed.sourceContextId !== handoff.sourceId
  ) {
    throw new Error("Committed CSV identity is not aligned with its canonical RDI source.");
  }

  const id = deriveNexoraDecisionTheatreDataObjectId(
    committed.workspaceId,
    committed.sourceContextId,
  );
  const intelligence = projectExecutiveSourceIntelligence(committed);
  const relationships = Object.freeze(
    intelligence.affectedObjects.flatMap((affected) => {
      if (!affected.stageObjectId) return [];
      const relationshipId = `data-support:${id}:${affected.stageObjectId}`;
      const visual = resolveNexoraDecisionTheatreRelationshipVisual({
        relationshipId,
        semanticType: "supplies-data-to",
        supportState: "established",
        direction: "source-to-target",
        causalAuthority: false,
        provenance: intelligence.provenance.snapshotId,
      });
      const claim = createNexoraDecisionTheatreVisualClaim({
        participantId: relationshipId,
        channel: "line-pattern",
        channelMeaning: "Authoritative source dependency support",
        semanticToken: visual.patternToken,
        supportingFact: `${committed.sourceContextId} supplies mapped data to ${affected.objectKey}.`,
        provenance: intelligence.provenance.snapshotId,
        confidenceOrLimitation: "Source association is established; causality is not supported.",
        whyVisible: "The committed source produced the canonical affected object state.",
        mustNotInfer: Object.freeze(["causality", "business importance", "data quality"]),
        advisorExplanation: `This line means ${committed.prepared.fileName} supplies mapped data to ${affected.objectLabel}; it does not mean the source caused that business state.`,
      });
      return [Object.freeze({
        id: relationshipId,
        sourceId: id,
        targetId: affected.stageObjectId,
        targetLabel: affected.objectLabel,
        semanticRelation: "supplies-data-to" as const,
        supportState: "established" as const,
        provenanceRef: intelligence.provenance.snapshotId,
        claimId: claim.claimId,
        impliesCausality: false as const,
        visual,
      })];
    }),
  );
  const confirmedFieldCount = committed.prepared.mapping.mappings.filter(
    (entry) => entry.semantic?.confirmedMeaning,
  ).length;
  const unresolvedFieldCount = committed.prepared.mapping.mappings.filter(
    (entry) => entry.semantic?.material && entry.semantic.confirmationSource === "none",
  ).length;
  return Object.freeze({
    visualFamily: "DATA_OBJECT" as const,
    id,
    label: committed.prepared.fileName,
    sourceType: "csv" as const,
    workspaceId: committed.workspaceId,
    sourceId: committed.sourceContextId,
    sourceSnapshotRef: handoff.sourceSnapshotId,
    dataRealityRef: handoff.dataset.id,
    provenanceRef: handoff.sourceSnapshotId,
    validationState: "valid" as const,
    understandingState: "validated-mapping" as const,
    recordCount: snapshot.records.length,
    columnCount: committed.prepared.parse.columns.length,
    confirmedFieldCount,
    unresolvedFieldCount,
    updatedAt: committed.committedAt,
    authoritativeSource: "RDI:2/CsvCommittedImport" as const,
    projectionAuthority: nexoraDecisionTheatreDataObjectProjectionIdentity,
    stageCompatibility: Object.freeze({
      participantId: id,
      visualFamily: "DATA_OBJECT" as const,
      rendererRequired: true as const,
      navigationEligible: false as const,
      inspectionEligible: true as const,
    }),
    directorCompatibility: Object.freeze({
      id,
      label: committed.prepared.fileName,
      kind: "data-source",
    }),
    relationships,
    semanticSafety: Object.freeze({
      isEvidence: false as const,
      impliesCausality: false as const,
      createsBusinessTruth: false as const,
      ambiguityRequiresClarification: true as const,
    }),
    writes: Object.freeze({
      dataReality: false as const,
      sourceSnapshot: false as const,
      evidence: false as const,
      stage: false as const,
      director: false as const,
      advisor: false as const,
    }),
  });
}
