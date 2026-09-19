/**
 * NPA-T DTH-EXP:6 — project existing Evidence into Theatre presentation.
 * One shared engine. Does not copy Evidence, invent provenance, or upgrade causality.
 */

import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import {
  DTH_EXP_EVIDENCE_SCENE_ENGINE,
  dthExpEvidenceSceneIdentity,
  dthExpEvidenceSceneVersion,
} from "./dthExpEvidenceSceneIdentity.ts";
import type {
  DthExpCanonicalEvidenceRecord,
  DthExpEvidenceAttachmentTarget,
  DthExpEvidenceCluster,
  DthExpEvidenceDisclosureState,
  DthExpEvidenceParticipant,
  DthExpEvidenceSceneInput,
  DthExpEvidenceSceneProjection,
} from "./dthExpEvidenceSceneContract.ts";

function sortRefs(ids: readonly string[]): readonly string[] {
  return Object.freeze([...ids].sort((left, right) => left.localeCompare(right)));
}

function attachmentTarget(kind: DthExpCanonicalEvidenceRecord["attachedToKind"]): DthExpEvidenceAttachmentTarget {
  if (kind === "object") return "actor";
  if (kind === "relationship") return "relationship";
  if (kind === "investigation") return "investigation";
  return "scene";
}

function disclosureFor(family: DthExpNexoRecipeFamily, record: DthExpCanonicalEvidenceRecord): DthExpEvidenceDisclosureState {
  if (!record.relevantToQuestion) return "hidden";
  if (record.dataRealityAcceptance === "removed") return "hidden";
  if (family === "NEXO_CAUSE") {
    return record.sceneRelevance === "high" ? "expanded" : "summary";
  }
  if (family === "NEXO_FLOW") {
    return record.sceneRelevance === "high" ? "summary" : "indicator";
  }
  if (family === "NEXO_IMPACT" || family === "NEXO_RISK") return "contextual";
  if (family === "NEXO_TIME" || family === "NEXO_EXECUTION" || family === "NEXO_OUTCOME") return "summary";
  return "indicator";
}

function suppliesCurrentReality(record: DthExpCanonicalEvidenceRecord): boolean {
  if (record.dataRealityAcceptance === "historical" || record.dataRealityAcceptance === "removed") return false;
  if (record.dataRealityAcceptance === "under-review") return false;
  if (record.freshness === "historical" || record.freshness === "stale") return false;
  return record.dataRealityAcceptance === "accepted";
}

function presentedAcceptance(record: DthExpCanonicalEvidenceRecord): DthExpCanonicalEvidenceRecord["dataRealityAcceptance"] {
  if (record.dataRealityAcceptance === "under-review") return "under-review";
  if (record.dataRealityAcceptance === "historical") return "historical";
  if (record.dataRealityAcceptance === "removed") return "removed";
  return record.dataRealityAcceptance;
}

export function projectDthExpEvidenceScene(input: DthExpEvidenceSceneInput): DthExpEvidenceSceneProjection {
  const actorIds = new Set(input.scene.actors.map((item) => item.canonicalObjectId));
  const relationshipIds = new Set(input.scene.relationships.map((item) => item.relationshipId));
  const hints = new Map(input.spatial.evidenceHints.map((item) => [item.evidenceRef, item]));
  const transitionRefs = new Set(input.transition?.evidence.map((item) => item.evidenceRef) ?? []);

  const selectedRefs = new Set(input.scene.evidenceAttachments.map((item) => item.evidenceRef));
  const selected = input.records.filter((record) => {
    if (!record.relevantToQuestion) return false;
    if (selectedRefs.size > 0 && !selectedRefs.has(record.evidenceRef)) return false;
    if (record.attachedToKind === "object") return actorIds.has(record.attachedToId);
    if (record.attachedToKind === "relationship") return relationshipIds.has(record.attachedToId);
    if (record.attachedToKind === "investigation") return actorIds.has(record.attachedToId) || relationshipIds.has(record.attachedToId);
    return record.attachedToKind === "scene";
  });

  const participants: DthExpEvidenceParticipant[] = sortRefs(selected.map((item) => item.evidenceRef)).map((ref) => {
    const record = selected.find((item) => item.evidenceRef === ref)!;
    const hint = hints.get(record.evidenceRef) ?? null;
    const specific = record.attachedToKind !== "scene";
    return Object.freeze({
      evidenceRef: record.evidenceRef,
      authority: "CC:8" as const,
      isTheatreActor: false as const,
      isCanonicalManagementObject: false as const,
      isMoCatalogMember: false as const,
      copiesEvidence: false as const,
      attachmentTarget: specific ? attachmentTarget(record.attachedToKind) : "scene",
      attachedToId: record.attachedToId,
      provenanceRef: record.provenanceRef,
      provenanceKind: record.provenanceKind,
      provenanceInvented: false as const,
      dataRealityAcceptance: presentedAcceptance(record),
      suppliesCurrentReality: suppliesCurrentReality(record),
      supportState: record.supportState,
      semanticConfirmationState: record.semanticFieldLabel && record.semanticConfirmationState == null ? "unresolved" : record.semanticConfirmationState,
      semanticFieldLabel: record.semanticFieldLabel,
      inventedSemanticMeaning: false as const,
      freshness: record.freshness,
      causalSupport: record.causalSupport,
      sceneRelevance: record.sceneRelevance ?? (record.relevantToQuestion ? "medium" : "low"),
      disclosure: disclosureFor(input.family, record),
      position: hint?.position ?? null,
      placementHintReusedFrom5A: hint != null,
      visualProminenceCreatesConfidence: false as const,
      evidenceReason:
        transitionRefs.has(record.evidenceRef)
          ? `5b-identity-preserved:${record.evidenceRef}`
          : `scene-relevant-${attachmentTarget(record.attachedToKind)}`,
    });
  });

  const grouped = new Map<string, string[]>();
  for (const item of participants) {
    const key = `${item.attachmentTarget}:${item.attachedToId}`;
    const list = grouped.get(key) ?? [];
    list.push(item.evidenceRef);
    grouped.set(key, list);
  }
  const clusters: DthExpEvidenceCluster[] = [...grouped.entries()]
    .filter(([, members]) => members.length > 1)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, members]) => {
      const [target, attachedToId] = key.split(":") as [DthExpEvidenceAttachmentTarget, string];
      return Object.freeze({
        clusterId: `cluster:${key}`,
        attachedToId,
        attachmentTarget: target,
        memberEvidenceRefs: sortRefs(members),
        mergesIntoCanonicalEvidence: false as const,
      });
    });

  return Object.freeze({
    identity: dthExpEvidenceSceneIdentity,
    version: dthExpEvidenceSceneVersion,
    engine: DTH_EXP_EVIDENCE_SCENE_ENGINE,
    family: input.family,
    participants: Object.freeze(participants),
    clusters: Object.freeze(clusters),
    missing: Object.freeze(input.missing ?? []),
    reducedMotion: Object.freeze({
      movement: false as const,
      managementMeaningPreserved: true as const,
      attachments: Object.freeze(participants.map((item) => `${item.attachmentTarget}:${item.attachedToId}`)),
      disclosure: Object.freeze(participants.map((item) => item.disclosure)),
      supportStates: Object.freeze(participants.map((item) => item.supportState)),
      provenanceRefs: Object.freeze(participants.map((item) => item.provenanceRef)),
      uncertainty: Object.freeze(participants.map((item) => item.semanticConfirmationState)),
    }),
    visualProminenceCreatesConfidence: false,
    evidenceCountCreatesConfidence: false,
    ranksBubbleCandidates: false,
    recalculatesBars: false,
    assignsVaiRoles: false,
    calculatesRisk: false,
    parallelTimelineAuthority: false,
    upgradesCausality: false,
    writesDecision: false,
    writesExecution: false,
    writesOutcome: false,
    liveStageWiring: false,
  });
}
