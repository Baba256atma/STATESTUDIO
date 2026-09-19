/**
 * NPA-T DTH-EXP:1 — project a Theatre Scene from existing DTH / DIR / Stage authority.
 * Removable projection. Does not write canonical Object, Evidence, VAI, Stage, or Director state.
 */

import type { NexoraDirectorPlan } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import type { NexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreContract.ts";
import type { NmiManagementRelationship } from "@/app/lib/nmi/nmiRelationshipContract.ts";
import { dthExpFoundationIdentity, dthExpFoundationVersion } from "./dthExpIdentity.ts";
import {
  type DthExpActorPresentation,
  type DthExpEvidenceAttachment,
  type DthExpSceneRelationship,
  type DthExpTheatreActor,
  type DthExpTheatreScene,
} from "./dthExpTheatreContract.ts";
import type { DthExpSceneAttention } from "./dthExpObjectStageRoleContract.ts";
import { isDthExpSceneAttention } from "./dthExpObjectStageRoleContract.ts";
import { canonicalRefFromTheatreObject, resolveDthExpTheatreActor } from "./dthExpResolveTheatreActor.ts";
import type { DthExpVisualRole } from "./dthExpVisualRole.ts";

export type DthExpTheatreProjectionInput = Readonly<{
  theatre?: NexoraDecisionTheatreFoundation | null;
  directorPlan?: NexoraDirectorPlan | null;
  visualRolesByCanonicalObjectId?: Readonly<Partial<Record<string, string>>>;
  presentationByCanonicalObjectId?: Readonly<Partial<Record<string, Partial<DthExpActorPresentation>>>>;
  evidenceRefsByCanonicalObjectId?: Readonly<Partial<Record<string, readonly string[]>>>;
  evidenceRefsByRelationshipId?: Readonly<Partial<Record<string, readonly string[]>>>;
  sceneEvidenceRefs?: readonly string[];
  vaiRoleByCanonicalObjectId?: Readonly<Partial<Record<string, string>>>;
  attentionByCanonicalObjectId?: Readonly<Partial<Record<string, string>>>;
  groupingByCanonicalObjectId?: Readonly<Partial<Record<string, string>>>;
  nmiRelationships?: readonly NmiManagementRelationship[];
}>;

function freezeTree<T>(value: T): T {
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) freezeTree(item);
    return Object.freeze(value) as T;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    freezeTree(nested);
  }
  return Object.freeze(value);
}

function directorComposition(input: {
  readonly intent?: string | null;
  readonly stageEffect?: string | null;
  readonly mutationRequired?: boolean | null;
}) {
  return Object.freeze({
    authority: nexoraSemanticPresentationDirectorIdentity,
    intent: input.intent ?? null,
    stageEffect: input.stageEffect ?? null,
    mutationRequired: input.mutationRequired ?? null,
    secondDirector: false as const,
    automaticNexoSelection: false as const,
  });
}

function failedScene(
  limitations: readonly string[],
  directorPlan?: NexoraDirectorPlan | null,
): DthExpTheatreScene {
  return freezeTree({
    identity: dthExpFoundationIdentity,
    version: dthExpFoundationVersion,
    sceneId: "dth-exp:1:failed",
    sceneIntentKind: null,
    sceneIntentRef: null,
    sceneScriptRef: null,
    dthTheatreSceneIdentity: null,
    recipeRef: null,
    focalCanonicalObjectIds: Object.freeze([]),
    participatingCanonicalObjectIds: Object.freeze([]),
    actors: Object.freeze([]),
    relationships: Object.freeze([]),
    visualRoles: Object.freeze([]),
    evidenceAttachments: Object.freeze([]),
    directorComposition: directorComposition({
      intent: directorPlan?.intent ?? null,
      stageEffect: directorPlan?.stageEffect ?? null,
      mutationRequired: directorPlan?.mutationRequired ?? null,
    }),
    advisorContextRef: "DTH:1/advisorReadable",
    advisorOwnedByTheatreExpansion: false,
    stageHost: "NEX-MVP:3/Nexora3DExecutiveStage",
    stageInteractionAuthority: "NEX-MVP:4/NexoraObjectInteraction",
    secondStage: false,
    secondDirector: false,
    nexoTimeParallelTimeline: false,
    nexoFamiliesImplemented: false,
    projectionStatus: "failed",
    limitations: Object.freeze(limitations.slice()),
    safeFallback: "preserve-existing-stage-and-dth",
    writes: Object.freeze({
      canonicalObjects: false,
      evidence: false,
      dataReality: false,
      vaiRoles: false,
      decisionState: false,
      executionState: false,
      outcome: false,
      learning: false,
      stageSnapshots: false,
      directorPlans: false,
    }),
  });
}

function defaultAttention(object: {
  readonly focused: boolean;
  readonly selected: boolean;
  readonly visibility: string;
}): DthExpSceneAttention {
  if (object.visibility === "hidden") return "hidden";
  if (object.focused) return "focal";
  if (object.selected) return "emphasized";
  if (object.visibility === "collapsed-thread") return "collapsed";
  if (object.visibility === "background-discoverable") return "de-emphasized";
  return "contextual";
}

export function projectDthExpTheatreScene(input: DthExpTheatreProjectionInput): DthExpTheatreScene {
  const theatre = input.theatre ?? null;
  if (theatre == null) {
    return failedScene(["missing-theatre-projection"], input.directorPlan ?? null);
  }

  const limitations: string[] = [];
  const canonicalIds = new Set(theatre.visibleExecutiveObjects.map((item) => item.id));
  for (const objectId of Object.keys(input.visualRolesByCanonicalObjectId ?? {})) {
    if (!canonicalIds.has(objectId)) limitations.push(`unknown-canonical-object:${objectId}`);
  }
  for (const objectId of Object.keys(input.presentationByCanonicalObjectId ?? {})) {
    if (!canonicalIds.has(objectId)) limitations.push(`unknown-canonical-object:${objectId}`);
  }
  for (const objectId of Object.keys(input.evidenceRefsByCanonicalObjectId ?? {})) {
    if (!canonicalIds.has(objectId)) limitations.push(`unknown-canonical-object:${objectId}`);
  }
  for (const objectId of Object.keys(input.vaiRoleByCanonicalObjectId ?? {})) {
    if (!canonicalIds.has(objectId)) limitations.push(`unknown-canonical-object:${objectId}`);
  }
  for (const objectId of Object.keys(input.attentionByCanonicalObjectId ?? {})) {
    if (!canonicalIds.has(objectId)) limitations.push(`unknown-canonical-object:${objectId}`);
  }
  for (const objectId of Object.keys(input.groupingByCanonicalObjectId ?? {})) {
    if (!canonicalIds.has(objectId)) limitations.push(`unknown-canonical-object:${objectId}`);
  }

  const scriptActors = theatre.sceneScript.actors;
  const actors: DthExpTheatreActor[] = [];
  for (const object of theatre.visibleExecutiveObjects) {
    const requestedAttention = input.attentionByCanonicalObjectId?.[object.id];
    if (requestedAttention != null && !isDthExpSceneAttention(requestedAttention)) {
      limitations.push(`unknown-attention:${object.id}:${requestedAttention}`);
    }
    const resolved = resolveDthExpTheatreActor({
      object: canonicalRefFromTheatreObject(object),
      sceneIdentity: theatre.theatreSceneIdentity,
      visualRole: input.visualRolesByCanonicalObjectId?.[object.id],
      attention: requestedAttention ?? defaultAttention(object),
      grouping: input.groupingByCanonicalObjectId?.[object.id] ?? null,
      presentation: input.presentationByCanonicalObjectId?.[object.id],
      vaiRole: input.vaiRoleByCanonicalObjectId?.[object.id],
      sceneActorRole: scriptActors.find((item) => item.executive && item.canonicalId === object.id)?.role ?? null,
      evidenceRefs: input.evidenceRefsByCanonicalObjectId?.[object.id],
    });
    limitations.push(...resolved.limitations);
    if (resolved.actor != null) {
      actors.push(resolved.actor);
    }
  }

  const actorByCanonical = new Map(actors.map((actor) => [actor.canonicalObjectId, actor]));
  const nmiById = new Map((input.nmiRelationships ?? []).map((item) => [item.relationshipId, item]));

  const relationships: DthExpSceneRelationship[] = [];
  for (const relationship of theatre.relationships) {
    const from = actorByCanonical.get(relationship.sourceId);
    const to = actorByCanonical.get(relationship.targetId);
    if (from == null || to == null) {
      limitations.push(`relationship-missing-actor:${relationship.id}`);
      continue;
    }
    const nmi = nmiById.get(relationship.id);
    relationships.push(
      Object.freeze({
        relationshipId: relationship.id,
        fromCanonicalObjectId: relationship.sourceId,
        toCanonicalObjectId: relationship.targetId,
        fromActorId: from.actorId,
        toActorId: to.actorId,
        semanticRelation: nmi?.kind ?? relationship.semanticRelation,
        sourceAuthority: nmi?.sourceAuthority ?? "DTH:1/relationship-projection",
        sourceRef: nmi?.sourceRef ?? relationship.id,
        impliesCausality: false as const,
        manufacturedCausalTruth: false as const,
        evidenceRefs: Object.freeze([...(input.evidenceRefsByRelationshipId?.[relationship.id] ?? [])]),
      }),
    );
  }

  for (const nmi of input.nmiRelationships ?? []) {
    if (relationships.some((item) => item.relationshipId === nmi.relationshipId)) continue;
    const from = actorByCanonical.get(nmi.fromId);
    const to = actorByCanonical.get(nmi.toId);
    if (from == null || to == null) {
      limitations.push(`nmi-relationship-missing-actor:${nmi.relationshipId}`);
      continue;
    }
    relationships.push(
      Object.freeze({
        relationshipId: nmi.relationshipId,
        fromCanonicalObjectId: nmi.fromId,
        toCanonicalObjectId: nmi.toId,
        fromActorId: from.actorId,
        toActorId: to.actorId,
        semanticRelation: nmi.kind,
        sourceAuthority: nmi.sourceAuthority,
        sourceRef: nmi.sourceRef,
        impliesCausality: false as const,
        manufacturedCausalTruth: false as const,
        evidenceRefs: Object.freeze([...(input.evidenceRefsByRelationshipId?.[nmi.relationshipId] ?? [])]),
      }),
    );
  }

  const evidenceAttachments: DthExpEvidenceAttachment[] = [];
  for (const actor of actors) {
    for (const evidenceRef of actor.evidenceRefs) {
      evidenceAttachments.push(
        Object.freeze({
          evidenceRef,
          authority: "CC:8" as const,
          attachedToKind: "object" as const,
          attachedToId: actor.canonicalObjectId,
          copiesEvidence: false as const,
          copiesDataReality: false as const,
        }),
      );
    }
  }
  for (const relationship of relationships) {
    for (const evidenceRef of relationship.evidenceRefs) {
      evidenceAttachments.push(
        Object.freeze({
          evidenceRef,
          authority: "CC:8" as const,
          attachedToKind: "relationship" as const,
          attachedToId: relationship.relationshipId,
          copiesEvidence: false as const,
          copiesDataReality: false as const,
        }),
      );
    }
  }
  for (const evidenceRef of input.sceneEvidenceRefs ?? []) {
    evidenceAttachments.push(
      Object.freeze({
        evidenceRef,
        authority: "CC:8" as const,
        attachedToKind: "scene" as const,
        attachedToId: theatre.theatreSceneIdentity,
        copiesEvidence: false as const,
        copiesDataReality: false as const,
      }),
    );
  }

  const focal = Object.freeze(
    [theatre.primaryExecutiveObjectId, theatre.selectedExecutiveObjectId].filter(
      (id): id is string => id != null && canonicalIds.has(id),
    ),
  );
  const participating = Object.freeze(actors.map((actor) => actor.canonicalObjectId));
  const visualRoles = Object.freeze(
    actors
      .map((actor) => actor.visualRole)
      .filter((role): role is DthExpVisualRole => role != null)
      .filter((role, index, all) => all.indexOf(role) === index),
  );
  const uniqueLimitations = Object.freeze(
    limitations.filter((item, index, all) => all.indexOf(item) === index),
  );
  const projectionStatus = uniqueLimitations.length > 0 ? "partial" : "ok";
  const sceneId = [
    "dth-exp:1",
    theatre.theatreSceneIdentity,
    visualRoles.join(",") || "none",
    projectionStatus,
  ].join(":");

  return freezeTree({
    identity: dthExpFoundationIdentity,
    version: dthExpFoundationVersion,
    sceneId,
    sceneIntentKind: theatre.sceneIntent.intentKind,
    sceneIntentRef: theatre.sceneIntent.sceneIntentId,
    sceneScriptRef: theatre.sceneScript.scriptId,
    dthTheatreSceneIdentity: theatre.theatreSceneIdentity,
    recipeRef: null,
    focalCanonicalObjectIds: focal,
    participatingCanonicalObjectIds: participating,
    actors: Object.freeze(actors),
    relationships: Object.freeze(relationships),
    visualRoles,
    evidenceAttachments: Object.freeze(evidenceAttachments),
    directorComposition: directorComposition({
      intent: input.directorPlan?.intent ?? theatre.directorProjection?.intent ?? null,
      stageEffect: input.directorPlan?.stageEffect ?? theatre.directorProjection?.stageEffect ?? null,
      mutationRequired:
        input.directorPlan?.mutationRequired ?? theatre.directorProjection?.mutationRequired ?? null,
    }),
    advisorContextRef: "DTH:1/advisorReadable",
    advisorOwnedByTheatreExpansion: false,
    stageHost: "NEX-MVP:3/Nexora3DExecutiveStage",
    stageInteractionAuthority: "NEX-MVP:4/NexoraObjectInteraction",
    secondStage: false,
    secondDirector: false,
    nexoTimeParallelTimeline: false,
    nexoFamiliesImplemented: false,
    projectionStatus,
    limitations: uniqueLimitations,
    safeFallback: "preserve-existing-stage-and-dth",
    writes: Object.freeze({
      canonicalObjects: false,
      evidence: false,
      dataReality: false,
      vaiRoles: false,
      decisionState: false,
      executionState: false,
      outcome: false,
      learning: false,
      stageSnapshots: false,
      directorPlans: false,
    }),
  });
}
