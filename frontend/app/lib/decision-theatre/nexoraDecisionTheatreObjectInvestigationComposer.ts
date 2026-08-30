/**
 * DTH:6 — Object Investigation composer.
 * Projects a read-only investigation context from Theatre + current selection.
 */

import type { NexoraDecisionTheatreFoundation } from "./nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreExecutiveObject } from "./nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreIconicObject } from "./nexoraDecisionTheatreIconicProjection.ts";
import {
  nexoraDecisionTheatreObjectInvestigationIdentity,
  nexoraDecisionTheatreObjectInvestigationVersion,
  type NexoraDecisionTheatreInvestigationAction,
  type NexoraDecisionTheatreInvestigationActionAvailability,
  type NexoraDecisionTheatreInvestigationLevel,
  type NexoraDecisionTheatreInvestigationRelatedRef,
  type NexoraDecisionTheatreObjectInvestigation,
} from "./nexoraDecisionTheatreObjectInvestigation.ts";
import {
  investigationTypePriority,
  managerRelationLanguage,
} from "./nexoraDecisionTheatreObjectInvestigationRegistry.ts";

export const nexoraDecisionTheatreObjectInvestigationComposerIdentity =
  "DTH:6/ObjectInvestigationComposer" as const;

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

function relatedRef(
  object: NexoraDecisionTheatreExecutiveObject,
  relation: string | null,
): NexoraDecisionTheatreInvestigationRelatedRef {
  return Object.freeze({
    id: object.id,
    label: object.label,
    kind: object.canonicalObjectType,
    relation: managerRelationLanguage(relation),
    causalStatus: "unsupported" as const,
  });
}

function firstOfType(
  objects: readonly NexoraDecisionTheatreExecutiveObject[],
  type: string,
): NexoraDecisionTheatreExecutiveObject | null {
  return objects.find((item) => item.canonicalObjectType === type) ?? null;
}

function action(
  name: NexoraDecisionTheatreInvestigationAction,
  available: boolean,
  reason: string,
): NexoraDecisionTheatreInvestigationActionAvailability {
  return Object.freeze({ action: name, available, reason });
}

function suggestionsFor(input: {
  readonly type: string;
  readonly hasEvidence: boolean;
  readonly hasRelationships: boolean;
  readonly comparisonCount: number;
  readonly hasDecision: boolean;
  readonly hasGoal: boolean;
}): readonly string[] {
  const out: string[] = [];
  if (input.type === "problem") {
    if (input.hasEvidence) out.push("What evidence supports this?");
    if (input.hasRelationships) out.push("What is related to it?");
    if (input.hasGoal) out.push("Which Goal does it threaten?");
    out.push("What should I investigate next?");
  } else if (input.type === "scenario") {
    if (input.hasEvidence) out.push("What evidence supports this scenario?");
    if (input.comparisonCount >= 2) out.push("How does it compare with the alternative?");
    out.push("What happens if we choose it?");
  } else if (input.type === "decision") {
    if (input.hasEvidence) out.push("What supports this Decision?");
    out.push("What would we be committing to?");
  } else if (input.type === "execution") {
    out.push("What happens next?");
    if (input.hasDecision) out.push("Which Decision does this carry out?");
  } else if (input.type === "kpi" || input.type === "object") {
    out.push("Why is this important?");
    if (input.hasRelationships) out.push("What is related to it?");
  } else {
    out.push("Explain this.");
    if (input.hasEvidence) out.push("What evidence supports it?");
  }
  return Object.freeze(out.slice(0, 4));
}

export function projectNexoraDecisionTheatreObjectInvestigation(input: {
  readonly theatre: NexoraDecisionTheatreFoundation;
  readonly level?: NexoraDecisionTheatreInvestigationLevel | null;
}): NexoraDecisionTheatreObjectInvestigation | null {
  const theatre = input.theatre;
  const selectedId = theatre.selectedExecutiveObjectId;
  const focusedId = theatre.primaryExecutiveObjectId;
  const subjectId = selectedId ?? focusedId;
  if (subjectId == null) return null;
  const executive =
    theatre.visibleExecutiveObjects.find((item) => item.id === subjectId) ??
    theatre.visibleExecutiveObjects.find((item) => item.id === focusedId) ??
    null;
  const iconic: NexoraDecisionTheatreIconicObject | null =
    executive == null
      ? theatre.iconicObjects.find((item) => item.presentationId === subjectId) ?? null
      : null;
  const owner =
    iconic != null
      ? theatre.visibleExecutiveObjects.find((item) => item.id === iconic.ownerExecutiveObjectId) ?? null
      : executive;
  if (owner == null && executive == null) return null;
  const target = executive ?? owner;
  if (target == null) return null;
  const level = input.level ?? "glance";
  const sceneActor = theatre.sceneScript.actors.find((item) => item.canonicalId === target.id);
  const relatedIds = new Set(
    theatre.relationships
      .filter((item) => item.sourceId === target.id || item.targetId === target.id)
      .flatMap((item) => [item.sourceId, item.targetId])
      .filter((id) => id !== target.id),
  );
  const relatedObjects = theatre.visibleExecutiveObjects
    .filter((item) => relatedIds.has(item.id))
    .slice()
    .sort((left, right) => {
      const order = investigationTypePriority(target.canonicalObjectType);
      const leftIndex = order.indexOf(left.canonicalObjectType);
      const rightIndex = order.indexOf(right.canonicalObjectType);
      return (leftIndex === -1 ? 99 : leftIndex) - (rightIndex === -1 ? 99 : rightIndex);
    });
  const relationFor = (id: string) =>
    theatre.relationships.find((item) => item.sourceId === target.id && item.targetId === id) ??
    theatre.relationships.find((item) => item.targetId === target.id && item.sourceId === id);
  const asRelated = (object: NexoraDecisionTheatreExecutiveObject | null) =>
    object == null ? null : relatedRef(object, relationFor(object.id)?.semanticRelation ?? null);
  const ownerIconics = theatre.iconicObjects.filter((item) => item.ownerExecutiveObjectId === target.id);
  const evidenceIconics = ownerIconics.filter((item) => item.role === "evidence" || item.role === "confidence");
  const costIconic = ownerIconics.find((item) => item.role === "cost");
  const timeIconic = ownerIconics.find((item) => item.role === "time");
  const honestValue = (item: NexoraDecisionTheatreIconicObject | undefined) => {
    if (item == null) return null;
    if (item.unknown) return "unknown";
    if (item.missing || item.value == null) return "unavailable";
    return `${item.value}${item.unit && item.unit !== "none" ? ` ${item.unit}` : ""}`;
  };
  const evidence = Object.freeze(
    evidenceIconics.map((item) =>
      Object.freeze({
        label: item.managerReadableLabel,
        epistemicStatus: item.unknown
          ? ("unknown" as const)
          : item.missing
            ? ("unavailable" as const)
            : item.epistemicStatus === "prediction"
              ? ("predicted" as const)
              : item.epistemicStatus === "expectation"
                ? ("inferred" as const)
                : ("known" as const),
        strength: item.unknown || item.missing ? null : item.confidenceRef,
        mustNotInfer: item.mustNotInterpretAs[0] ?? "This is not a confirmed cause.",
      }),
    ),
  );
  const relationships = Object.freeze(
    relatedObjects.map((item) => relatedRef(item, relationFor(item.id)?.semanticRelation ?? "related")),
  );
  const comparisonMemberIds =
    theatre.sceneIntent.intentKind === "COMPARE_CANDIDATES"
      ? theatre.sceneIntent.comparisonMembers
      : Object.freeze([] as string[]);
  const inComparison = comparisonMemberIds.includes(target.id);
  const comparisonPreserved = inComparison && comparisonMemberIds.length >= 2;
  const hasEvidence = evidence.length > 0 && evidence.some((item) => item.epistemicStatus !== "unavailable" && item.epistemicStatus !== "unknown");
  const relatedGoal = asRelated(firstOfType(relatedObjects, "goal"));
  const relatedProblem = asRelated(firstOfType(relatedObjects, "problem"));
  const relatedDecision = asRelated(firstOfType(relatedObjects, "decision"));
  const suggestedQuestions = suggestionsFor({
    type: target.canonicalObjectType,
    hasEvidence,
    hasRelationships: relationships.length > 0,
    comparisonCount: comparisonMemberIds.length,
    hasDecision: relatedDecision != null || target.canonicalObjectType === "decision",
    hasGoal: relatedGoal != null || target.canonicalObjectType === "goal",
  });
  const temporal = null;
  const actions = Object.freeze([
    action("EXPLAIN_OBJECT", true, "Explanation uses the existing explain authority."),
    action("SHOW_EVIDENCE", hasEvidence, hasEvidence ? "Evidence is present from an authoritative source." : "No supporting evidence is available."),
    action("SHOW_RELATIONSHIPS", relationships.length > 0, relationships.length > 0 ? "Supported relationships are on Stage." : "No supported relationships are in this scene."),
    action("SHOW_HISTORY", false, "No temporal authority is available for a history view."),
    action(
      "SHOW_DECISION_RELEVANCE",
      relatedDecision != null || target.canonicalObjectType === "decision",
      relatedDecision != null || target.canonicalObjectType === "decision"
        ? "Decision context is present."
        : "No Decision is related in this scene.",
    ),
    action(
      "COMPARE_RELATED",
      comparisonPreserved,
      comparisonPreserved
        ? "The current comparison members remain available."
        : "Comparison requires at least two resolved members.",
    ),
    action("RETURN_TO_SCENE", true, "Close investigation without changing the Scene."),
  ]);
  const whyRelevant =
    sceneActor?.presenceReason ??
    target.presenceReason ??
    "It is part of the current Stage.";
  const uncertainty = hasEvidence
    ? "Available support is limited to what the current sources provide."
    : "Nexora does not yet have enough evidence to determine this.";
  const limitations = Object.freeze(
    [
      hasEvidence ? null : "No synthetic evidence was added.",
      temporal == null ? "No timeline was fabricated." : null,
      comparisonMemberIds.length === 1 ? "A singleton cannot produce comparison." : null,
    ].filter((item): item is string => Boolean(item)),
  );
  const investigationId = `dth6-investigation:${theatre.sceneScript.scriptId}:${target.id}:${level}:${iconic?.presentationId ?? "executive"}`;
  const objectKind = iconic != null ? iconic.role : target.canonicalObjectType;
  const displayName = iconic != null ? iconic.managerReadableLabel : target.label;
  const currentState = iconic != null
    ? honestValue(iconic) ?? iconic.epistemicStatus
    : target.lifecycleStatus ?? "active";
  return freezeTree({
    identity: nexoraDecisionTheatreObjectInvestigationIdentity,
    version: nexoraDecisionTheatreObjectInvestigationVersion,
    investigationId,
    open: true,
    level,
    objectId: iconic?.presentationId ?? target.id,
    canonicalObjectType: objectKind,
    visualFamily: iconic != null ? "ICONIC_OBJECT" : "EXECUTIVE_OBJECT",
    managerReadableName: displayName,
    currentState,
    sceneRole: sceneActor?.role ?? null,
    presenceReason: whyRelevant,
    sceneIntentKind: theatre.sceneIntent.intentKind,
    sceneScriptId: theatre.sceneScript.scriptId,
    relatedGoal,
    relatedProblem,
    relatedOpportunity: asRelated(firstOfType(relatedObjects, "opportunity")),
    relatedScenario: asRelated(firstOfType(relatedObjects, "scenario")),
    relatedDecision,
    relatedExecution: asRelated(firstOfType(relatedObjects, "execution")),
    relatedOutcome: asRelated(firstOfType(relatedObjects, "outcome")),
    relatedKpi: asRelated(firstOfType(relatedObjects, "kpi")),
    evidence,
    cost: honestValue(costIconic),
    time: honestValue(timeIconic),
    uncertainty,
    confidenceOrLimitation: hasEvidence
      ? "Confidence follows the supporting source."
      : "Missing values are not treated as zero.",
    temporal,
    relationships,
    comparisonMemberIds,
    comparisonPreserved,
    suggestedQuestions,
    actions,
    glance: Object.freeze({
      identity: `${displayName} is a ${objectKind.replace(/-/g, " ")}.`,
      state: `Current state: ${currentState}.`,
      whyRelevant,
    }),
    advisorReadable: Object.freeze({
      objectName: displayName,
      objectKind: objectKind.replace(/-/g, " "),
      whyInvestigating: `${displayName} is being investigated because it is part of the current scene.`,
      currentState: `It is currently ${currentState}.`,
      evidence: hasEvidence
        ? "Supporting information is available from existing sources. Association is not a confirmed cause."
        : "Nexora does not yet have enough evidence to determine this.",
      related:
        relationships.length > 0
          ? relationships.map((item) => `${item.label} (${item.relation})`).join("; ")
          : "No supported relationships are shown for this object.",
      uncertainty,
      comparison: comparisonPreserved
        ? "This object is being investigated inside the current comparison. The other candidates remain."
        : null,
      suggestedQuestions,
      mustNotInfer: Object.freeze([
        "Relatedness is not a confirmed cause.",
        "Missing cost or time is not zero.",
        "A prediction is not an observed result.",
        "Investigating an object does not approve a Decision or start Execution.",
      ]),
    }),
    provenance: Object.freeze([
      "DTH:6/ObjectInvestigationComposer",
      theatre.sceneScript.scriptId,
      target.id,
    ]),
    limitations,
    safeFallback: "close-without-scene-change",
    derivationMetadata: Object.freeze({
      composer: "DTH:6/ObjectInvestigationComposer" as const,
      parsedRawManagerText: false as const,
      inventedEvidence: false as const,
      inventedCausality: false as const,
      manufacturedComparison: false as const,
      mutatedStage: false as const,
      mutatedDecision: false as const,
      startedExecution: false as const,
      timestampUsed: false as const,
      randomUsed: false as const,
      coveredWholeTheatre: false as const,
    }),
  });
}
