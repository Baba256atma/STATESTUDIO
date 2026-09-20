/**
 * NPA-T STAGE-PROD:3 — read-only DTH scene-script → existing Stage projection.
 * DTH owns scene meaning; this adapter owns only deterministic Stage placement.
 */

import type { NexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreSceneActorRole } from "@/app/lib/decision-theatre/nexoraDecisionTheatreSceneActorRoles.ts";
import type {
  NexoraMVPStageConnectionPresentation,
  NexoraMVPStageObjectPresentation,
} from "@/app/lib/nex-mvp/nexora3DExecutiveStage.ts";
import type { NexoraMVPStageInteractionPresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

export const stageProdDirectorCompositionIdentity =
  "NPA-T STAGE-PROD:3/DirectorStageComposition" as const;

export type StageProdSceneFamily =
  | "preserved"
  | "orientation"
  | "investigation"
  | "comparison"
  | "commitment"
  | "execution"
  | "outcome";

export type StageProdDirectorComposition = Readonly<{
  identity: typeof stageProdDirectorCompositionIdentity;
  status: "applied" | "preserved" | "missing";
  family: StageProdSceneFamily;
  sceneIntentKind: string | null;
  sceneScriptId: string | null;
  canonicalObjectIds: readonly string[];
  structuralSignature: string;
  presentation: NexoraMVPStageInteractionPresentation;
  writesCanonicalManagementState: false;
  parallelDirector: false;
  parallelTheatre: false;
  parallelStageStore: false;
  inventedObjects: false;
}>;

type Candidate = Readonly<{
  id: string;
  label: string;
  kind: string;
  status: string | null;
}>;

function sceneFamily(
  theatre: NexoraDecisionTheatreFoundation,
): StageProdSceneFamily {
  if (theatre.outcomeObservation != null || theatre.learningReassessment != null) {
    return "outcome";
  }
  if (theatre.liveExecution != null || theatre.executionReadiness != null) {
    return "execution";
  }
  if (theatre.decisionCommitment != null) return "commitment";
  if (theatre.decisionComparison != null) return "comparison";
  if (theatre.objectInvestigation != null) return "investigation";
  switch (theatre.sceneIntent.intentKind) {
    case "INVESTIGATE_CONDITION":
    case "REVIEW_FOCAL_OBJECT":
    case "REVIEW_CONSEQUENCE":
      return "investigation";
    case "COMPARE_CANDIDATES":
      return "comparison";
    case "REVIEW_COMMITMENT":
      return "commitment";
    case "REVIEW_EXECUTION":
      return "execution";
    case "REVIEW_OUTCOME":
      return "outcome";
    case "ORIENT_TO_STAGE":
    case "REVIEW_COLLECTION":
      return "orientation";
    default:
      return "preserved";
  }
}

function comparisonCandidates(
  theatre: NexoraDecisionTheatreFoundation,
): readonly Candidate[] {
  return Object.freeze(
    (theatre.decisionComparison?.candidates ?? []).map((candidate) =>
      Object.freeze({
        id: candidate.id,
        label: candidate.label,
        kind: candidate.kind,
        status: candidate.state,
      }),
    ),
  );
}

function commitmentCandidates(
  theatre: NexoraDecisionTheatreFoundation,
): readonly Candidate[] {
  const commitment = theatre.decisionCommitment;
  if (commitment == null) return Object.freeze([]);
  const comparisonById = new Map(
    comparisonCandidates(theatre).map((candidate) => [candidate.id, candidate]),
  );
  return Object.freeze(
    commitment.candidateChoices.map((choice) => {
      const comparison = comparisonById.get(choice.id);
      return Object.freeze({
        id: choice.id,
        label: choice.label,
        kind:
          comparison?.kind ??
          (choice.id === commitment.candidateId
            ? commitment.candidateType ?? "unknown"
            : "unknown"),
        status: comparison?.status ?? commitment.state,
      });
    }),
  );
}

function candidateIndex(
  theatre: NexoraDecisionTheatreFoundation,
  family: StageProdSceneFamily,
): ReadonlyMap<string, Candidate> {
  const visible = theatre.visibleExecutiveObjects.map((object) =>
    Object.freeze({
      id: object.id,
      label: object.label,
      kind: object.canonicalObjectType,
      status: object.lifecycleStatus,
    }),
  );
  const familyCandidates =
    family === "commitment"
      ? commitmentCandidates(theatre)
      : family === "comparison"
        ? comparisonCandidates(theatre)
        : [];
  return new Map([...visible, ...familyCandidates].map((item) => [item.id, item]));
}

function actorRoleById(
  theatre: NexoraDecisionTheatreFoundation,
): ReadonlyMap<string, NexoraDecisionTheatreSceneActorRole> {
  const roles = new Map<string, NexoraDecisionTheatreSceneActorRole>();
  for (const actor of theatre.sceneScript.actors) {
    if (!actor.executive) continue;
    const current = roles.get(actor.canonicalId);
    if (current == null || actor.role === "ANCHOR" || actor.role === "PRIMARY_ACTOR") {
      roles.set(actor.canonicalId, actor.role);
    }
  }
  return roles;
}

function familyPrimaryIds(
  theatre: NexoraDecisionTheatreFoundation,
  family: StageProdSceneFamily,
): readonly string[] {
  if (family === "comparison") {
    return Object.freeze([...(theatre.decisionComparison?.candidateIds ?? [])]);
  }
  if (family === "commitment") {
    const id = theatre.decisionCommitment?.candidateId;
    return Object.freeze(id == null ? [] : [id]);
  }
  const id =
    theatre.sceneScript.anchorActorId ?? theatre.primaryExecutiveObjectId ?? null;
  return Object.freeze(id == null ? [] : [id]);
}

function positionFor(input: Readonly<{
  family: StageProdSceneFamily;
  id: string;
  primaryIds: readonly string[];
  supportIndex: number;
  supportCount: number;
  role: NexoraDecisionTheatreSceneActorRole | null;
}>): readonly [number, number, number] {
  const primaryIndex = input.primaryIds.indexOf(input.id);
  if (primaryIndex >= 0) {
    if (input.family === "comparison") {
      const x = (primaryIndex - (input.primaryIds.length - 1) / 2) * 2.4;
      return Object.freeze([x, 0.45, 0] as const);
    }
    return Object.freeze([0, 0.45, 0] as const);
  }
  const spread = Math.min(1.8, 6 / Math.max(1, input.supportCount));
  const x = (input.supportIndex - (input.supportCount - 1) / 2) * spread;
  const y =
    input.role === "OUTCOME_ACTOR"
      ? -0.75
      : input.role === "SUPPORTING_ACTOR" || input.role === "ATTENTION_ACTOR"
        ? -1.15
        : -2.05;
  return Object.freeze([x, y, 0] as const);
}

function createPresentation(
  candidate: Candidate,
  position: readonly [number, number, number],
  focusedId: string | null,
  selectedId: string | null,
  primary: boolean,
): NexoraMVPStageObjectPresentation {
  const focused = candidate.id === focusedId;
  const selected = candidate.id === selectedId;
  return Object.freeze({
    id: candidate.id,
    label: candidate.label,
    kind: candidate.kind,
    role: focused ? "focused" : primary ? "related" : "peripheral",
    overviewPosition: position,
    targetPosition: position,
    scale: primary ? 1.08 : 0.82,
    opacity: primary ? 1 : 0.72,
    emissiveIntensity: focused ? 0.28 : primary ? 0.16 : 0.05,
    labelProminence: primary ? "full" : "reduced",
    selected,
    focused,
    attention: "normal",
    status: candidate.status ?? "unresolved",
    disclosureState: primary ? "visible-primary" : "visible-related",
    spatialRole: primary ? "center" : "related",
    interactive: true,
    labelVisible: true,
    labelPrimaryLine: candidate.label,
    labelSecondaryLine: candidate.kind,
    compositionMode: "executive-2_5d",
    presentationPosition: Object.freeze({ x: position[0], y: position[1] }),
    depthRole: primary ? "focus" : "background",
    presentationRegion: primary
      ? "business-network"
      : "background-context",
  });
}

function composeConnections(
  theatre: NexoraDecisionTheatreFoundation,
  current: readonly NexoraMVPStageConnectionPresentation[],
  visibleIds: ReadonlySet<string>,
): readonly NexoraMVPStageConnectionPresentation[] {
  const byId = new Map(current.map((connection) => [connection.id, connection]));
  for (const relationship of theatre.sceneScript.relationships) {
    if (
      byId.has(relationship.relationshipId) ||
      !visibleIds.has(relationship.sourceId) ||
      !visibleIds.has(relationship.targetId)
    ) {
      continue;
    }
    byId.set(
      relationship.relationshipId,
      Object.freeze({
        id: relationship.relationshipId,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
        emphasized: true,
        opacity: 0.68,
        relation: relationship.semanticRelation ?? undefined,
        visualRole: "related" as const,
        directionCue: "none" as const,
        lineWidth: 1,
        impliesCausality: false as const,
      }),
    );
  }
  return Object.freeze([...byId.values()]);
}

function signature(
  family: StageProdSceneFamily,
  objects: readonly NexoraMVPStageObjectPresentation[],
  connections: readonly NexoraMVPStageConnectionPresentation[],
): string {
  const objectPart = objects
    .map(
      (object) =>
        `${object.id}@${object.targetPosition[0].toFixed(2)},${object.targetPosition[1].toFixed(2)}:${object.role}`,
    )
    .sort()
    .join("|");
  return `${family}:${objectPart}:rel=${connections
    .map((connection) => connection.id)
    .sort()
    .join(",")}`;
}

export function projectStageProdDirectorComposition(input: Readonly<{
  presentation: NexoraMVPStageInteractionPresentation;
  theatre?: NexoraDecisionTheatreFoundation | null;
}>): StageProdDirectorComposition {
  const theatre = input.theatre ?? null;
  if (theatre == null) {
    return Object.freeze({
      identity: stageProdDirectorCompositionIdentity,
      status: "missing" as const,
      family: "preserved" as const,
      sceneIntentKind: null,
      sceneScriptId: null,
      canonicalObjectIds: Object.freeze(
        input.presentation.scene.objects.map((object) => object.id),
      ),
      structuralSignature: signature(
        "preserved",
        input.presentation.scene.objects,
        input.presentation.scene.connections,
      ),
      presentation: input.presentation,
      writesCanonicalManagementState: false as const,
      parallelDirector: false as const,
      parallelTheatre: false as const,
      parallelStageStore: false as const,
      inventedObjects: false as const,
    });
  }

  const family = sceneFamily(theatre);
  const preserve =
    family === "preserved" ||
    (family === "orientation" &&
      (theatre.sceneScript.transitionPolicy === "PRESERVE" ||
        theatre.sceneScript.transitionPolicy === "NO_VISUAL_TRANSITION"));
  if (preserve) {
    return Object.freeze({
      identity: stageProdDirectorCompositionIdentity,
      status: "preserved" as const,
      family,
      sceneIntentKind: theatre.sceneIntent.intentKind,
      sceneScriptId: theatre.sceneScript.scriptId,
      canonicalObjectIds: Object.freeze(
        input.presentation.scene.objects.map((object) => object.id),
      ),
      structuralSignature: signature(
        family,
        input.presentation.scene.objects,
        input.presentation.scene.connections,
      ),
      presentation: input.presentation,
      writesCanonicalManagementState: false as const,
      parallelDirector: false as const,
      parallelTheatre: false as const,
      parallelStageStore: false as const,
      inventedObjects: false as const,
    });
  }

  const candidates = candidateIndex(theatre, family);
  const roles = actorRoleById(theatre);
  const primaryIds = familyPrimaryIds(theatre, family).filter((id) =>
    candidates.has(id),
  );
  const orderedIds = Object.freeze([
    ...new Set(
      family === "comparison"
        ? [
            ...primaryIds,
            ...(theatre.decisionComparison?.candidateIds ?? []),
          ]
        : [
            ...primaryIds,
            ...theatre.sceneScript.actors
              .filter((actor) => actor.executive)
              .map((actor) => actor.canonicalId),
            ...(family === "commitment"
              ? theatre.decisionCommitment?.comparisonMemberIds ?? []
              : []),
          ],
    ),
  ]);
  const existingById = new Map(
    input.presentation.scene.objects.map((object) => [object.id, object]),
  );
  const supportIds = orderedIds.filter(
    (id) => !primaryIds.includes(id) && candidates.has(id),
  );
  const objects = Object.freeze(
    orderedIds.flatMap((id) => {
      const candidate = candidates.get(id);
      if (candidate == null) return [];
      const supportIndex = Math.max(0, supportIds.indexOf(id));
      const position = positionFor({
        family,
        id,
        primaryIds,
        supportIndex,
        supportCount: supportIds.length,
        role: roles.get(id) ?? null,
      });
      const existing = existingById.get(id);
      if (existing == null) {
        return [
          createPresentation(
            candidate,
            position,
            input.presentation.focusedSubjectId,
            input.presentation.selectedSubjectId,
            primaryIds.includes(id),
          ),
        ];
      }
      const primary = primaryIds.includes(id);
      const focused = id === input.presentation.focusedSubjectId;
      return [
        Object.freeze({
          ...existing,
          targetPosition: position,
          overviewPosition: position,
          presentationPosition: Object.freeze({
            x: position[0],
            y: position[1],
          }),
          role: focused ? "focused" as const : primary ? "related" as const : "peripheral" as const,
          focused,
          selected: id === input.presentation.selectedSubjectId,
          scale: primary ? Math.max(existing.scale, 1.08) : Math.min(existing.scale, 0.86),
          opacity: primary ? 1 : Math.min(existing.opacity, 0.74),
          emissiveIntensity: focused
            ? Math.max(existing.emissiveIntensity, 0.28)
            : primary
              ? Math.max(existing.emissiveIntensity, 0.16)
              : Math.min(existing.emissiveIntensity, 0.08),
          labelProminence: primary ? "full" as const : "reduced" as const,
          disclosureState: primary ? "visible-primary" as const : "visible-related" as const,
          spatialRole: primary ? "center" as const : "related" as const,
          interactive: true,
          labelVisible: true,
        }),
      ];
    }),
  );
  const visibleIds = new Set(objects.map((object) => object.id));
  const connections = composeConnections(
    theatre,
    input.presentation.scene.connections.filter(
      (connection) =>
        visibleIds.has(connection.sourceId) && visibleIds.has(connection.targetId),
    ),
    visibleIds,
  );
  const presentation = Object.freeze({
    ...input.presentation,
    scene: Object.freeze({
      ...input.presentation.scene,
      objects,
      connections,
      focusedObjectId: input.presentation.focusedSubjectId,
      selectedObjectId: input.presentation.selectedSubjectId,
    }),
  });
  return Object.freeze({
    identity: stageProdDirectorCompositionIdentity,
    status: "applied" as const,
    family,
    sceneIntentKind: theatre.sceneIntent.intentKind,
    sceneScriptId: theatre.sceneScript.scriptId,
    canonicalObjectIds: Object.freeze(objects.map((object) => object.id)),
    structuralSignature: signature(family, objects, connections),
    presentation,
    writesCanonicalManagementState: false as const,
    parallelDirector: false as const,
    parallelTheatre: false as const,
    parallelStageStore: false as const,
    inventedObjects: false as const,
  });
}
