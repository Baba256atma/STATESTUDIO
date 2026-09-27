/**
 * NPA-T DTH-EXP:LIVE-FIX1 — retain 7B spatial from live DTH composition.
 * Does not select Nexo families, command Stage, or wire OVS.
 */

import type { NexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreContract.ts";
import type { NexoraDirectorPlan } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import type { DthExpDirectorSceneGraph } from "./dthExpDirectorSceneCompositionContract.ts";
import { resolveDthExpManagementNeedFromLiveTheatre } from "./dthExpResolveLiveManagementNeed.ts";
import { orchestrateDthExpTheatreSceneResponse } from "./dthExpOrchestrateTheatreSceneResponse.ts";
import type { DthExpTheatreSceneResponse } from "./dthExpTheatreSceneResponseContract.ts";

function graphFromTheatre(theatre: NexoraDecisionTheatreFoundation): DthExpDirectorSceneGraph {
  return Object.freeze({
    objects: Object.freeze(
      theatre.visibleExecutiveObjects.map((object) =>
        Object.freeze({
          object: Object.freeze({
            id: object.id,
            kind: object.canonicalObjectType,
            label: object.label,
            authority: object.authoritativeSource,
          }),
          familyRelevance: undefined,
          participationHint: object.focused ? ("focal" as const) : null,
          groupingHint: null,
          sceneRelevanceReason: object.presenceReason,
          vaiRoleRef: null,
          timeBucket: null,
          bottleneck: false,
          collectionMember: object.collectionEligible,
        }),
      ),
    ),
    relationships: Object.freeze(
      theatre.relationships.map((relationship) =>
        Object.freeze({
          relationshipId: relationship.id,
          fromId: relationship.sourceId,
          toId: relationship.targetId,
          semanticRelation: relationship.semanticRelation,
          sourceAuthority: "DTH:1/relationship-projection",
          sourceRef: relationship.id,
        }),
      ),
    ),
    evidence: Object.freeze([]),
    bindings: Object.freeze([]),
    bottleneckCanonicalObjectId: null,
    collectionMemberIds: theatre.sceneIntent.activeCollectionRef?.memberIds ?? Object.freeze([]),
  });
}

export function projectDthExpLiveTheatreSceneResponse(input: Readonly<{
  theatre: NexoraDecisionTheatreFoundation | null;
  directorPlan?: NexoraDirectorPlan | null;
}>): DthExpTheatreSceneResponse {
  const theatre = input.theatre;
  const focal = theatre?.visibleExecutiveObjects.find((object) => object.focused) ?? null;
  const managementNeed = resolveDthExpManagementNeedFromLiveTheatre({
    sceneIntentKind: theatre?.sceneIntent.intentKind ?? null,
    focalCanonicalObjectType: focal?.canonicalObjectType ?? null,
    collectionKind: theatre?.sceneIntent.activeCollectionRef?.kind ?? null,
    directorPlan: input.directorPlan ?? null,
  });
  const canonicalSubjectId =
    theatre?.primaryExecutiveObjectId ??
    theatre?.selectedExecutiveObjectId ??
    focal?.id ??
    null;

  return orchestrateDthExpTheatreSceneResponse({
    turn: Object.freeze({
      referent: Object.freeze({
        authority: "CC:5 / ECA / NCA / MO referent" as const,
        canonicalSubjectId,
        subjectSource: canonicalSubjectId ? ("click" as const) : ("none" as const),
        selectedCanonicalObjectId: theatre?.selectedExecutiveObjectId ?? null,
        selectedRelationshipId: null,
        selectedEvidenceRef: null,
        collectionMemberId: null,
        generation: 1,
      }),
      managementNeed,
      responseKind: "compose",
      ambiguity: "none",
      managementReason: "live-dth-scene-intent",
      rawUtterance: null,
    }),
    directorPlan: input.directorPlan ?? null,
    graph: theatre == null ? Object.freeze({
      objects: Object.freeze([]),
      relationships: Object.freeze([]),
      evidence: Object.freeze([]),
      bindings: Object.freeze([]),
    }) : graphFromTheatre(theatre),
  });
}
