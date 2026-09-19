/**
 * NPA-T DTH-EXP:7A — bounded read-only Advisor Theatre awareness snapshot.
 * Does not resolve identity, switch Nexo family, or store conversation memory.
 */

import type { DthExpTheatreActor } from "./dthExpTheatreContract.ts";
import {
  DTH_EXP_ADVISOR_SCENE_AWARENESS_ENGINE,
  dthExpAdvisorSceneAwarenessIdentity,
  dthExpAdvisorSceneAwarenessVersion,
} from "./dthExpAdvisorSceneAwarenessIdentity.ts";
import type {
  DthExpAdvisorAmbiguityState,
  DthExpAdvisorGrounding,
  DthExpAdvisorSceneAwareness,
  DthExpAdvisorSceneAwarenessInput,
} from "./dthExpAdvisorSceneAwarenessContract.ts";

function sortIds(ids: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(ids)].sort((left, right) => left.localeCompare(right)));
}

function isVisible(actor: DthExpTheatreActor): boolean {
  return actor.presentation.visibility !== "hidden" && actor.attention !== "hidden" && actor.attention !== "collapsed";
}

function groundingSource(
  conversation: DthExpAdvisorSceneAwarenessInput["conversation"],
): DthExpAdvisorGrounding["source"] {
  if (conversation.subjectSource === "conversation-named" && conversation.canonicalSubjectId) {
    return "conversation-named";
  }
  if (conversation.selectedCanonicalObjectId) return "canonical-selection";
  if (conversation.canonicalSubjectId) return "conversation-deictic";
  return "none";
}

function groundedObjectId(conversation: DthExpAdvisorSceneAwarenessInput["conversation"]): string | null {
  if (conversation.subjectSource === "conversation-named") {
    return conversation.canonicalSubjectId;
  }
  if (conversation.selectedCanonicalObjectId) return conversation.selectedCanonicalObjectId;
  if (conversation.collectionMemberId) return conversation.collectionMemberId;
  return conversation.canonicalSubjectId;
}

export function projectDthExpAdvisorSceneAwareness(
  input: DthExpAdvisorSceneAwarenessInput,
): DthExpAdvisorSceneAwareness {
  const conversation = input.conversation;
  const staleTheatreIgnored =
    input.scene != null &&
    input.theatreGeneration != null &&
    conversation.generation > input.theatreGeneration;
  const scene = staleTheatreIgnored ? null : (input.scene ?? null);
  const spatial = staleTheatreIgnored ? null : (input.spatial ?? null);
  const evidence = staleTheatreIgnored ? null : (input.evidence ?? null);
  const visibleActors = (scene?.actors ?? []).filter(isVisible);
  const visibleActorIds = sortIds(visibleActors.map((item) => item.canonicalObjectId));
  const primaryActorIds = sortIds(
    visibleActors
      .filter((item) => item.attention === "focal" || item.attention === "emphasized")
      .map((item) => item.canonicalObjectId),
  );
  const supportingActorIds = sortIds(
    visibleActors.filter((item) => item.attention === "emphasized").map((item) => item.canonicalObjectId),
  );
  const contextualActorIds = sortIds(
    visibleActors
      .filter((item) => item.attention === "contextual" || item.attention === "de-emphasized")
      .map((item) => item.canonicalObjectId),
  );

  const objectId = groundedObjectId(conversation);
  const source = groundingSource(conversation);
  const evidenceRef = conversation.selectedEvidenceRef;
  const relationshipId = conversation.selectedRelationshipId;
  const utterance = input.utteranceKind ?? "other";
  const deixisKind = input.deixisKind ?? null;

  let ambiguity: DthExpAdvisorAmbiguityState = "none";
  let candidates: readonly string[] = Object.freeze([]);
  if (objectId == null && evidenceRef == null && relationshipId == null) {
    if (utterance === "deictic-object") {
      const pool = visibleActors.filter((item) =>
        deixisKind === "risk" ? item.canonicalObjectKind === "risk" : true,
      );
      const ids = sortIds(pool.map((item) => item.canonicalObjectId));
      if (ids.length > 1) {
        ambiguity = "ambiguous-object";
        candidates = ids;
      }
    } else if (utterance === "deictic-evidence") {
      const ids = sortIds((evidence?.participants ?? []).map((item) => item.evidenceRef));
      if (ids.length > 1) {
        ambiguity = "ambiguous-evidence";
        candidates = ids;
      }
    } else if (utterance === "deictic-relationship") {
      const ids = sortIds((scene?.relationships ?? []).map((item) => item.relationshipId));
      if (ids.length > 1) {
        ambiguity = "ambiguous-relationship";
        candidates = ids;
      }
    }
  }

  const grounding: DthExpAdvisorGrounding = Object.freeze({
    canonicalObjectId: objectId,
    evidenceRef,
    relationshipId,
    source,
    usedVisualLabel: false,
    usedScreenPosition: false,
    usedLargestActor: false,
    usedTheatreFocalOverride: false,
    usedAnimationProminence: false,
    usedEvidenceProminence: false,
  });

  return Object.freeze({
    identity: dthExpAdvisorSceneAwarenessIdentity,
    version: dthExpAdvisorSceneAwarenessVersion,
    engine: DTH_EXP_ADVISOR_SCENE_AWARENESS_ENGINE,
    advisorAuthority: "CC:5/ConversationalExperienceIntegration",
    referentAuthority: "CC:5 / ECA / NCA / MO referent",
    theatreAvailable: scene != null,
    staleTheatreIgnored,
    family: spatial?.family ?? evidence?.family ?? null,
    theatreFocalCanonicalObjectId: spatial?.focalCanonicalObjectId ?? scene?.focalCanonicalObjectIds[0] ?? null,
    conversationalSubjectId: conversation.canonicalSubjectId,
    selectedCanonicalObjectId: conversation.selectedCanonicalObjectId,
    visibleActorIds,
    primaryActorIds,
    supportingActorIds,
    contextualActorIds,
    visualRoles: Object.freeze(
      visibleActors.map((item) =>
        Object.freeze({
          canonicalObjectId: item.canonicalObjectId,
          visualRole: item.visualRole,
          attention: item.attention,
        }),
      ),
    ),
    relationshipRefs: Object.freeze(
      (scene?.relationships ?? []).map((item) =>
        Object.freeze({
          relationshipId: item.relationshipId,
          semanticRelation: item.semanticRelation,
          sourceAuthority: item.sourceAuthority,
        }),
      ),
    ),
    evidenceRefs: Object.freeze(
      (evidence?.participants ?? []).map((item) =>
        Object.freeze({
          evidenceRef: item.evidenceRef,
          authority: "CC:8" as const,
          attachedToId: item.attachedToId,
          attachmentTarget: item.attachmentTarget,
          disclosure: item.disclosure,
          isMoCatalogMember: false as const,
        }),
      ),
    ),
    grounding,
    ambiguity,
    candidateCanonicalObjectIds: candidates,
    nexoFamilyOverridesSubject: false,
    requestsSceneChange: false,
    parallelAdvisor: false,
    parallelReferentResolver: false,
    reducedMotionEquivalent: true,
    writesDecision: false,
    writesExecution: false,
    writesOutcome: false,
    assignsVaiRoles: false,
    upgradesCausality: false,
    liveStageWiring: false,
  });
}
