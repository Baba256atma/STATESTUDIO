/**
 * DTH:5 — Scene Script composer.
 * Selects existing authoritative participants. Does not invent actors.
 */

import type { NexoraDecisionTheatreExecutiveObject, NexoraDecisionTheatreRelationship } from "./nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreIconicObject } from "./nexoraDecisionTheatreIconicProjection.ts";
import type { NexoraDecisionTheatreVisualGrammarProjection } from "./nexoraDecisionTheatreVisualProjection.ts";
import type { NexoraDecisionTheatreAtmosphereProjection } from "./nexoraDecisionTheatreAtmosphere.ts";
import type { NexoraDecisionTheatreSceneIntent } from "./nexoraDecisionTheatreSceneIntent.ts";
import type { NexoraDecisionTheatreSceneSemanticInput } from "./nexoraDecisionTheatreSceneSemanticInput.ts";
import {
  nexoraDecisionTheatreSceneScriptIdentity,
  nexoraDecisionTheatreSceneScriptVersion,
  type NexoraDecisionTheatreAdvisorSceneSummary,
  type NexoraDecisionTheatreSceneActor,
  type NexoraDecisionTheatreSceneRelationship,
  type NexoraDecisionTheatreSceneScript,
  type NexoraDecisionTheatreSceneTransitionPolicy,
} from "./nexoraDecisionTheatreSceneScript.ts";
import type { NexoraDecisionTheatreSceneActorRole } from "./nexoraDecisionTheatreSceneActorRoles.ts";

export const nexoraDecisionTheatreSceneScriptComposerIdentity =
  "DTH:5/SceneScriptComposer" as const;

export type NexoraDecisionTheatreSceneScriptComposeInput = Readonly<{
  intent: NexoraDecisionTheatreSceneIntent;
  semantic: NexoraDecisionTheatreSceneSemanticInput;
  executives: readonly NexoraDecisionTheatreExecutiveObject[];
  relationships: readonly NexoraDecisionTheatreRelationship[];
  iconicObjects: readonly NexoraDecisionTheatreIconicObject[];
  visualGrammar: NexoraDecisionTheatreVisualGrammarProjection;
  atmosphere: NexoraDecisionTheatreAtmosphereProjection;
  presentationLevel: string;
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

function byId(executives: readonly NexoraDecisionTheatreExecutiveObject[]): ReadonlyMap<string, NexoraDecisionTheatreExecutiveObject> {
  return new Map(executives.map((item) => [item.id, item]));
}

function eligibleExecutive(
  id: string | null | undefined,
  index: ReadonlyMap<string, NexoraDecisionTheatreExecutiveObject>,
): NexoraDecisionTheatreExecutiveObject | null {
  if (id == null || id.length === 0) return null;
  return index.get(id) ?? null;
}

function uniqueIds(ids: readonly (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (id == null || id.length === 0 || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

function iconicRolesForIntent(kind: NexoraDecisionTheatreSceneIntent["intentKind"]): readonly string[] {
  if (kind === "COMPARE_CANDIDATES") return Object.freeze(["cost", "time"]);
  if (kind === "INVESTIGATE_CONDITION") return Object.freeze(["evidence", "uncertainty", "confidence"]);
  if (kind === "REVIEW_COMMITMENT") return Object.freeze(["reversibility"]);
  if (kind === "REVIEW_EXECUTION") return Object.freeze(["capacity"]);
  if (kind === "REVIEW_OUTCOME") return Object.freeze(["goal-impact"]);
  return Object.freeze([]);
}

function transitionPolicy(
  intent: NexoraDecisionTheatreSceneIntent,
  semantic: NexoraDecisionTheatreSceneSemanticInput,
): NexoraDecisionTheatreSceneTransitionPolicy {
  if (semantic.navigationRestore === "back" || semantic.navigationRestore === "forward") {
    return "RESTORE_SNAPSHOT";
  }
  if (intent.stageMutationPermission === "NO_CHANGE" || intent.stageMutationPermission === "CLARIFY_WITHOUT_CHANGE") {
    return "NO_VISUAL_TRANSITION";
  }
  if (intent.stageMutationPermission === "PRESERVE_AND_EXPLAIN") return "PRESERVE";
  if (intent.intentKind === "REVIEW_FOCAL_OBJECT") return "FOCUS_EXISTING";
  if (intent.stageMutationPermission === "RECOMPOSE_EXISTING") return "RECOMPOSE";
  return "PRESERVE";
}

function preserveLastValid(intent: NexoraDecisionTheatreSceneIntent, semantic: NexoraDecisionTheatreSceneSemanticInput): boolean {
  if (intent.intentKind === "PRESERVE_SCENE" || intent.intentKind === "CLARIFY_SCENE") {
    return semantic.lastValidSceneScriptId != null;
  }
  if (intent.intentKind === "ORIENT_TO_STAGE" && semantic.lastValidSceneScriptId != null) {
    return true;
  }
  return false;
}

export function composeNexoraDecisionTheatreSceneScript(
  input: NexoraDecisionTheatreSceneScriptComposeInput,
): NexoraDecisionTheatreSceneScript {
  const { intent, semantic, executives, relationships, iconicObjects, visualGrammar, atmosphere } = input;
  const index = byId(executives);
  const collectionIds = intent.activeCollectionRef?.memberIds ?? [];
  const comparisonIds = intent.comparisonMembers;
  const focalId = intent.focalExecutiveObjectRef;
  const limitations: string[] = [...intent.limitations];

  let anchorId: string | null = null;
  if (intent.intentKind === "REVIEW_COLLECTION") {
    anchorId = collectionIds[0] && eligibleExecutive(collectionIds[0], index) ? collectionIds[0] : focalId;
  } else if (intent.intentKind === "COMPARE_CANDIDATES") {
    anchorId = comparisonIds[0] ?? focalId;
  } else {
    anchorId = eligibleExecutive(focalId, index)?.id ?? null;
  }
  if (intent.intentKind === "PRESERVE_SCENE" && semantic.unknownEntityNamed) {
    anchorId = eligibleExecutive(semantic.focalExecutiveObject?.id, index)?.id ?? null;
  }
  if (anchorId != null && eligibleExecutive(anchorId, index) == null) {
    limitations.push("Requested anchor was omitted because it is not an authoritative Stage participant.");
    anchorId = null;
  }

  const primaryIds = uniqueIds(
    intent.intentKind === "COMPARE_CANDIDATES"
      ? comparisonIds
      : intent.intentKind === "REVIEW_COLLECTION"
        ? collectionIds
        : [anchorId],
  ).filter((id) => eligibleExecutive(id, index) != null);

  if (intent.intentKind === "COMPARE_CANDIDATES" && primaryIds.length < 2) {
    limitations.push("Comparison members missing from Stage were omitted; no pair was manufactured.");
  }
  if (intent.intentKind === "REVIEW_COLLECTION" && collectionIds.length > 0) {
    const missing = collectionIds.filter((id) => eligibleExecutive(id, index) == null);
    if (missing.length > 0) {
      limitations.push("Collection membership is preserved only for members present on Stage.");
    }
  }

  const relatedIds = uniqueIds(
    executives
      .filter((item) => item.visibility === "visible-related")
      .map((item) => item.id),
  ).filter((id) => !primaryIds.includes(id) && id !== anchorId);

  const remainingIds = executives
    .map((item) => item.id)
    .filter((id) => !primaryIds.includes(id) && !relatedIds.includes(id) && id !== anchorId);

  const actors: NexoraDecisionTheatreSceneActor[] = [];
  const seen = new Set<string>();

  function pushActor(
    id: string,
    role: NexoraDecisionTheatreSceneActorRole,
    reason: string,
    extra?: { readonly executive?: boolean; readonly owner?: string | null; readonly iconicRole?: string | null },
  ) {
    if (seen.has(`${id}:${role}`)) return;
    const executive = extra?.executive !== false;
    if (executive && eligibleExecutive(id, index) == null) {
      limitations.push(`Actor ${id} omitted: canonical identity is not on Stage.`);
      return;
    }
    seen.add(`${id}:${role}`);
    actors.push(
      Object.freeze({
        canonicalId: id,
        role,
        executive,
        ownerExecutiveObjectId: extra?.owner ?? null,
        presenceReason: reason,
        iconicRole: extra?.iconicRole ?? null,
      }),
    );
  }

  if (anchorId != null) {
    pushActor(anchorId, "ANCHOR", "Organizes the current scene.");
  }
  for (const id of primaryIds) {
    const role: NexoraDecisionTheatreSceneActorRole =
      intent.intentKind === "COMPARE_CANDIDATES" ? "ALTERNATIVE_ACTOR" : "PRIMARY_ACTOR";
    if (id === anchorId && role === "PRIMARY_ACTOR") {
      pushActor(id, "PRIMARY_ACTOR", "Directly answers the active question.");
      continue;
    }
    pushActor(
      id,
      role,
      role === "ALTERNATIVE_ACTOR"
        ? "Participates in comparison; alternative does not mean preferred."
        : "Directly answers the active question.",
    );
  }
  for (const id of relatedIds) {
    pushActor(id, "SUPPORTING_ACTOR", "Supported related context.");
  }
  for (const id of remainingIds) {
    const executive = index.get(id);
    if (executive == null) continue;
    if (executive.canonicalObjectType === "outcome") {
      pushActor(id, "OUTCOME_ACTOR", "Expected or observed outcome already supported by authority.");
      continue;
    }
    if (executive.attention !== "normal") {
      pushActor(id, "ATTENTION_ACTOR", "Existing attention state is preserved; this role does not create attention.");
    }
    pushActor(id, "CONTEXT_ACTOR", "Remains relevant but is not central.");
  }

  const ownerIds = new Set(actors.filter((item) => item.executive).map((item) => item.canonicalId));
  const allowedIconicRoles = iconicRolesForIntent(intent.intentKind);
  const iconicParticipantIds: string[] = [];
  for (const iconic of iconicObjects) {
    if (!ownerIds.has(iconic.ownerExecutiveObjectId)) {
      limitations.push("Iconic Object omitted because its owner is not in the scene.");
      continue;
    }
    if (allowedIconicRoles.length > 0 && !allowedIconicRoles.includes(iconic.role)) {
      continue;
    }
    if (iconic.unknown || iconic.missing) {
      limitations.push(`Iconic ${iconic.role} remains ${iconic.unknown ? "unknown" : "missing"}; no value was fabricated.`);
      continue;
    }
    iconicParticipantIds.push(iconic.presentationId);
    pushActor(iconic.presentationId, "ICONIC_INDICATOR", iconic.whyVisible, {
      executive: false,
      owner: iconic.ownerExecutiveObjectId,
      iconicRole: iconic.role,
    });
  }

  const sceneRelationships: NexoraDecisionTheatreSceneRelationship[] = [];
  for (const relationship of relationships) {
    const sourceOk = ownerIds.has(relationship.sourceId);
    const targetOk = ownerIds.has(relationship.targetId);
    if (!sourceOk || !targetOk) continue;
    if (relationship.semanticRelation == null) {
      limitations.push("Relationship omitted: semantic relation is unknown.");
      continue;
    }
    sceneRelationships.push(
      Object.freeze({
        relationshipId: relationship.id,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
        semanticRelation: relationship.semanticRelation,
        causalStatus: "unsupported" as const,
        provenance: "DTH:1/relationship-projection",
      }),
    );
  }

  const requestedGrammarDirectives: string[] = [];
  for (const directive of visualGrammar.directives) {
    const participantKnown =
      ownerIds.has(directive.participantId) || iconicParticipantIds.includes(directive.participantId);
    if (!participantKnown) continue;
    if (directive.channel === "size" && !semantic.impactScaleEvidenceSufficient) {
      if (directive.semanticToken !== "size-equal" && directive.semanticToken !== "size-subordinate") {
        limitations.push("Unequal size was not requested because comparable impact evidence is insufficient.");
        continue;
      }
    }
    if (directive.channel === "direction" && !semantic.causalitySupported) {
      limitations.push("Causal direction was not requested without authority.");
      continue;
    }
    requestedGrammarDirectives.push(`${directive.participantId}:${directive.channel}:${directive.semanticToken}`);
  }

  if (preserveLastValid(intent, semantic) && semantic.lastValidSceneScript != null) {
    return freezeTree(semantic.lastValidSceneScript);
  }
  const reuseScriptId =
    preserveLastValid(intent, semantic) && semantic.lastValidSceneScriptId != null
      ? semantic.lastValidSceneScriptId
      : null;
  const actorFingerprint = actors
    .map((item) => `${item.canonicalId}:${item.role}`)
    .sort()
    .join(",");
  const scriptId =
    reuseScriptId ??
    `dth5-script:1.0.0:${intent.sceneIntentId}:${anchorId ?? "none"}:${actorFingerprint}:${sceneRelationships.map((item) => item.relationshipId).sort().join(",")}:${atmosphere.mode}`;

  const reconstructing =
    semantic.canonicalOperation == null &&
    semantic.conversationIntentKind == null &&
    !semantic.explicitCollectionRequest &&
    semantic.comparison?.active !== true;
  const stagePreserved =
    reconstructing ||
    intent.stageMutationPermission === "NO_CHANGE" ||
    intent.stageMutationPermission === "CLARIFY_WITHOUT_CHANGE" ||
    intent.stageMutationPermission === "PRESERVE_AND_EXPLAIN";

  const deferred = Object.freeze([
    "object-investigation-cards-and-charts",
    "nexo-select-scenario-theatre",
    "nexo-compare-decision-arena",
    "nexo-time-and-theatre-replay",
    "visual-behavior-engine",
  ]);

  const advisorReadable: NexoraDecisionTheatreAdvisorSceneSummary = Object.freeze({
    question: intent.managerQuestionPurpose,
    anchor: anchorId != null ? index.get(anchorId)?.label ?? anchorId : null,
    visibleActors: Object.freeze(
      actors.filter((item) => item.executive).map((item) => index.get(item.canonicalId)?.label ?? item.canonicalId),
    ),
    roles: Object.freeze(actors.map((item) => `${item.canonicalId}:${item.role}`)),
    whyPresent: Object.freeze(actors.filter((item) => item.executive).map((item) => item.presenceReason)),
    relationshipsThatMatter: Object.freeze(
      sceneRelationships.map((item) => `${item.sourceId} ${item.semanticRelation} ${item.targetId}`),
    ),
    uncertainRelationships: Object.freeze(
      sceneRelationships.filter((item) => item.causalStatus !== "confirmed").map((item) => item.relationshipId),
    ),
    iconicObjects: Object.freeze(iconicParticipantIds.slice()),
    evidence: Object.freeze(
      iconicObjects
        .filter((item) => iconicParticipantIds.includes(item.presentationId) && item.role === "evidence")
        .map((item) => item.provenance),
    ),
    unavailable: Object.freeze(
      deferred.map((item) => item.replace(/-/g, " ")),
    ),
    mustNotInfer: Object.freeze([
      "Visible relatedness is not a confirmed cause.",
      "A comparison alternative is not a preferred or approved option.",
      "The Stage environment is not chosen by this scene purpose.",
      "This explanation does not approve a Decision, start Execution, or create an Outcome.",
    ]),
    stagePreserved,
  });

  return freezeTree({
    identity: nexoraDecisionTheatreSceneScriptIdentity,
    version: nexoraDecisionTheatreSceneScriptVersion,
    scriptId,
    sceneIntentId: intent.sceneIntentId,
    intentKind: intent.intentKind,
    activeQuestion: intent.managerQuestionPurpose,
    anchorActorId: anchorId,
    actors: Object.freeze(actors),
    iconicParticipantIds: Object.freeze(iconicParticipantIds),
    relationships: Object.freeze(sceneRelationships),
    visualGrammarRef: visualGrammar.identity,
    requestedGrammarDirectives: Object.freeze(requestedGrammarDirectives),
    atmosphereRef: atmosphere.mode,
    presentationLevel: input.presentationLevel,
    contextEvidenceRefs: Object.freeze(intent.provenance.slice()),
    unsupportedOrDeferred: deferred,
    preservationRules: Object.freeze([
      intent.preservationRequirement,
      "Compose only existing authoritative participants.",
      "Do not invent actors for visual balance.",
    ]),
    transitionPolicy: transitionPolicy(intent, semantic),
    advisorReadable,
    provenance: Object.freeze(["DTH:5/SceneScriptComposer", intent.sceneIntentId, visualGrammar.identity, atmosphere.identity]),
    limitations: Object.freeze(limitations),
    safeFallback: "preserve-last-valid-script",
    derivationMetadata: Object.freeze({
      composer: "DTH:5/SceneScriptComposer" as const,
      timestampUsed: false as const,
      randomUsed: false as const,
      rawCssPresent: false as const,
      coordinatesPresent: false as const,
      nexoSelectIntroduced: false as const,
      nexoCompareIntroduced: false as const,
      nexoTimeIntroduced: false as const,
      cardOrChartIntroduced: false as const,
      mutatedDecision: false as const,
      startedExecution: false as const,
      createdOutcomeOrLearning: false as const,
      atmosphereSelectedIndependently: false as const,
    }),
  });
}
