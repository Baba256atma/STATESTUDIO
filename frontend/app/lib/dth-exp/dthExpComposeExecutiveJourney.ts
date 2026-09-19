/**
 * NPA-T DTH-EXP:10 — sequence certified 7A→7B→8A→8B→9.
 * Does not parse utterances, select primary Nexo, or write management truth.
 */

import { projectDthExpAdvisorSceneAwareness } from "./dthExpProjectAdvisorSceneAwareness.ts";
import { orchestrateDthExpTheatreSceneResponse } from "./dthExpOrchestrateTheatreSceneResponse.ts";
import { planDthExpMultiNexoComposition } from "./dthExpPlanMultiNexoComposition.ts";
import { composeDthExpMultiNexoScene } from "./dthExpComposeMultiNexoScene.ts";
import { applyDthExpTheatreScale } from "./dthExpApplyTheatreScale.ts";
import type { DthExpMultiNexoAvailableSupport } from "./dthExpMultiNexoCompositionContract.ts";
import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import type { DthExpTheatreScaleAdmissionClass, DthExpTheatreScaleActorCandidate, DthExpTheatreScaleEvidenceCandidate } from "./dthExpTheatreScaleContract.ts";
import type { DthExpExecutiveJourneyInput, DthExpExecutiveJourneySnapshot } from "./dthExpExecutiveJourneyContract.ts";
import { DTH_EXP_EXECUTIVE_JOURNEY_PIPELINE } from "./dthExpExecutiveJourneyContract.ts";
import {
  DTH_EXP_EXECUTIVE_JOURNEY_ENGINE,
  dthExpExecutiveJourneyIdentity,
  dthExpExecutiveJourneyVersion,
} from "./dthExpExecutiveJourneyIdentity.ts";

function defaultSupports(input: DthExpExecutiveJourneyInput, subjectId: string): readonly DthExpMultiNexoAvailableSupport[] {
  if (input.availableSupports != null) return input.availableSupports;
  const actorIds = new Set(input.graph.objects.map((item) => item.object.id));
  const attached = [...actorIds].filter((id) => id === subjectId || id === "obj-production" || id === input.graph.bottleneckCanonicalObjectId);
  return Object.freeze([
    Object.freeze({ family: "NEXO_RISK" as const, contextAvailable: input.graph.objects.some((item) => item.object.kind === "risk"), attachedCanonicalObjectIds: Object.freeze(attached) }),
    Object.freeze({
      family: "NEXO_IMPACT" as const,
      contextAvailable: input.graph.objects.some((item) => item.vaiRoleRef === "LEVER" || item.object.id === "obj-staffing"),
      attachedCanonicalObjectIds: Object.freeze(["obj-production", subjectId].filter((id) => actorIds.has(id))),
    }),
    Object.freeze({ family: "NEXO_TIME" as const, contextAvailable: input.graph.objects.some((item) => item.timeBucket != null), attachedCanonicalObjectIds: Object.freeze([subjectId]) }),
    Object.freeze({ family: "NEXO_BUBBLE" as const, contextAvailable: (input.graph.collectionMemberIds?.length ?? 0) > 0, attachedCanonicalObjectIds: Object.freeze(input.graph.collectionMemberIds ?? []) }),
  ]);
}

function actorClass(
  canonicalObjectId: string,
  subjectId: string,
  bottleneckId: string | null,
  participation: string | null,
  attention: string | null,
): DthExpTheatreScaleAdmissionClass {
  if (canonicalObjectId === subjectId) return "required-subject";
  if (canonicalObjectId === bottleneckId || attention === "focal") return "required-focal";
  if (participation === "primary" || participation === "focal") return "required-primary";
  if (participation === "supporting") return "focused";
  return "contextual";
}

export function composeDthExpExecutiveJourney(input: DthExpExecutiveJourneyInput): DthExpExecutiveJourneySnapshot {
  const awareness = projectDthExpAdvisorSceneAwareness({
    conversation: input.turn.referent,
    scene: input.sourceScene ?? null,
    spatial: input.sourceSpatial ?? null,
    theatreGeneration: input.theatreGeneration ?? null,
    utteranceKind: input.utteranceKind,
    deixisKind: input.deixisKind ?? null,
    reducedMotion: input.reducedMotion,
  });
  const response = orchestrateDthExpTheatreSceneResponse({
    turn: input.turn,
    directorPlan: input.directorPlan,
    graph: input.graph,
    awareness,
    sourceScene: input.sourceScene,
    sourceSpatial: input.sourceSpatial,
    sourceFamily: input.sourceFamily,
    evidenceRecords: input.evidenceRecords,
    previousTransition: input.previousTransition,
    theatreGeneration: input.theatreGeneration,
    reducedMotion: input.reducedMotion,
  });

  const family = response.targetFamily;
  const scene = response.scene;
  const spatial = response.spatial;
  const subjectId = response.canonicalSubjectId;
  const composition = response.composition;

  let eligibility = null;
  let composed = null;
  let workingSet = null;

  if (family != null && scene != null && spatial != null && subjectId != null && input.turn.ambiguity === "none") {
    const primaryActorIds = Object.freeze((composition?.actors ?? scene.actors).map((item) => item.canonicalObjectId));
    const relationshipRefs = Object.freeze(
      (composition?.relationships ?? scene.relationships).map((item) =>
        Object.freeze({ relationshipId: item.relationshipId, semanticRelation: item.semanticRelation }),
      ),
    );
    eligibility = planDthExpMultiNexoComposition({
      canonicalSubjectId: subjectId,
      primaryFamily: family,
      primarySelectionAuthority: "DTH-EXP:4A",
      managementNeed: response.managementNeed ?? "UNSPECIFIED",
      primaryReason: response.selection?.selectionReason ?? response.managementReason,
      primaryActorIds,
      relationshipRefs,
      evidenceRefs: Object.freeze(composition?.evidenceRefs ?? response.evidence?.participants.map((item) => item.evidenceRef) ?? []),
      availableSupports: defaultSupports(input, subjectId),
      previousPrimaryFamily: input.sourceFamily ?? null,
      bottleneckCanonicalObjectId: input.graph.bottleneckCanonicalObjectId ?? null,
      unsafeRequestedSupports: input.unsafeRequestedSupports,
    });
    composed = composeDthExpMultiNexoScene({
      eligibility,
      spatial,
      evidence: response.evidence,
      scene,
      reducedMotion: input.reducedMotion,
    });

    const bottleneckId = input.graph.bottleneckCanonicalObjectId ?? null;
    const selectedActors: DthExpTheatreScaleActorCandidate[] = (composition?.actors ?? scene.actors).map((item) =>
      Object.freeze({
        canonicalObjectId: item.canonicalObjectId,
        admissionClass: actorClass(
          item.canonicalObjectId,
          subjectId,
          bottleneckId,
          "participation" in item ? item.participation : null,
          item.attention,
        ),
      }),
    );
    const unrelatedCount = input.unrelatedObjectCount ?? 0;
    const unrelatedActors = Array.from({ length: unrelatedCount }, (_, index) =>
      Object.freeze({
        canonicalObjectId: `obj-unrelated-${String(index).padStart(4, "0")}`,
        admissionClass: "unrelated" as const,
      }),
    );
    const evidenceCandidates: DthExpTheatreScaleEvidenceCandidate[] = (response.evidence?.participants ?? []).map((item) =>
      Object.freeze({
        evidenceRef: item.evidenceRef,
        admissionClass: item.evidenceRef === "cc8:ev-capacity-17" ? ("essential-evidence" as const) : ("focused" as const),
        attachedToId: item.attachedToId,
      }),
    );
    const supportCandidates = eligibility.supportingFamilies.map((supportFamily: DthExpNexoRecipeFamily) =>
      Object.freeze({
        family: supportFamily,
        admissionClass: supportFamily === "NEXO_TIME" ? ("contextual" as const) : ("focused" as const),
      }),
    );
    workingSet = applyDthExpTheatreScale({
      canonicalSubjectId: subjectId,
      primaryFamily: family,
      managementNeed: response.managementNeed ?? "UNSPECIFIED",
      canonicalWorldObjectCount: selectedActors.length + unrelatedCount,
      canonicalWorldRelationshipCount: relationshipRefs.length,
      canonicalWorldEvidenceCount: evidenceCandidates.length,
      actors: Object.freeze([...selectedActors, ...unrelatedActors]),
      relationships: Object.freeze(
        relationshipRefs.map((item) =>
          Object.freeze({
            relationshipId: item.relationshipId,
            admissionClass: "required-relationship" as const,
            semanticRelation: item.semanticRelation,
            directional: item.semanticRelation === "feeds",
          }),
        ),
      ),
      evidence: evidenceCandidates,
      supports: supportCandidates,
      reducedMotion: input.reducedMotion,
      fallbackToSinglePrimary: eligibility.fallbackToSinglePrimary,
    });
  }

  return Object.freeze({
    identity: dthExpExecutiveJourneyIdentity,
    version: dthExpExecutiveJourneyVersion,
    engine: DTH_EXP_EXECUTIVE_JOURNEY_ENGINE,
    pipeline: DTH_EXP_EXECUTIVE_JOURNEY_PIPELINE,
    awareness,
    response,
    eligibility,
    composed,
    workingSet,
    reusedCertifiedPipeline: true,
    newTheatreCapability: false,
    advisorToStageCommands: false,
    parsesRawText: false,
    browserPerformanceCertified: false,
    liveStageWiring: false,
    writesCanonicalObjects: false,
    writesDecision: false,
    writesExecution: false,
    writesOutcome: false,
    writesLearning: false,
    assignsVaiRoles: false,
    calculatesRisk: false,
    upgradesCausality: false,
    nexoBottleneck: false,
    nexoEvidence: false,
    parallelTimelineAuthority: false,
  });
}
