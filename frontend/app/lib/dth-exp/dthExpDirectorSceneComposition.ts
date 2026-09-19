/**
 * NPA-T DTH-EXP:4B — select minimum relevant canonical context for a 4A Nexo family.
 * Feeds DTH-EXP:3B family definitions into the DTH-EXP:3A resolver. Does not invent truth.
 */

import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import {
  defineNexoBarsRecipe,
  defineNexoBubbleRecipe,
  defineNexoCauseRecipe,
  defineNexoExecutionRecipe,
  defineNexoFlowRecipe,
  defineNexoImpactRecipe,
  defineNexoOutcomeRecipe,
  defineNexoRiskRecipe,
  defineNexoTimeRecipe,
  resolveNexoFamilyRecipe,
} from "./dthExpNexoFamilyRecipes.ts";
import type { DthExpNexoFamilyParticipant } from "./dthExpNexoFamilyRecipes.ts";
import type { DthExpNexoRecipeFamily, DthExpRecipeAnalyticalDimension, DthExpRecipeRelationshipContext } from "./dthExpSceneRecipeContract.ts";
import type { DthExpSceneAttention } from "./dthExpObjectStageRoleContract.ts";
import {
  dthExpDirectorSceneCompositionIdentity,
  dthExpDirectorSceneCompositionVersion,
} from "./dthExpDirectorSceneCompositionIdentity.ts";
import type {
  DthExpDirectorSceneActorSelection,
  DthExpDirectorSceneBindingHint,
  DthExpDirectorSceneComposition,
  DthExpDirectorSceneCompositionInput,
  DthExpDirectorSceneCompositionState,
  DthExpDirectorSceneEvidenceHint,
  DthExpDirectorSceneGraph,
  DthExpDirectorSceneObjectHint,
} from "./dthExpDirectorSceneCompositionContract.ts";

const FLOW_DIMENSIONS = Object.freeze(["kpi-value", "cost", "value"] as const);
const BARS_DIMENSIONS = Object.freeze(["kpi-value", "cost"] as const);
const BUBBLE_DIMENSIONS = Object.freeze(["value", "cost", "risk", "strategic-relevance", "effort", "time"] as const);
const CAUSE_DIMENSIONS = Object.freeze(["evidence-strength", "vai-role", "cost"] as const);

function unique<T>(items: readonly T[]): readonly T[] {
  return Object.freeze(items.filter((item, index, all) => all.indexOf(item) === index));
}

function relevantToFamily(
  family: DthExpNexoRecipeFamily,
  relevance: readonly DthExpNexoRecipeFamily[] | "all" | undefined,
): boolean {
  if (relevance == null || relevance === "all") return true;
  return relevance.includes(family);
}

function kindOf(hint: DthExpDirectorSceneObjectHint): string {
  return (hint.object.kind ?? hint.object.canonicalObjectType ?? "").toLowerCase();
}

function byId(graph: DthExpDirectorSceneGraph): Map<string, DthExpDirectorSceneObjectHint> {
  return new Map(graph.objects.map((item) => [item.object.id, item]));
}

function participant(hint: DthExpDirectorSceneObjectHint, extras?: Partial<DthExpNexoFamilyParticipant>): DthExpNexoFamilyParticipant {
  return Object.freeze({
    canonicalObjectId: hint.object.id,
    required: extras?.required ?? true,
    evidenceRefs: extras?.evidenceRefs,
    vaiRoleRef: extras?.vaiRoleRef ?? hint.vaiRoleRef ?? null,
    attention: extras?.attention ?? null,
    grouping: extras?.grouping ?? hint.groupingHint ?? null,
  });
}

function actorSelection(
  hint: DthExpDirectorSceneObjectHint,
  participation: DthExpDirectorSceneActorSelection["participation"],
  grouping: string | null,
  attention: DthExpSceneAttention | null,
  reason: string,
): DthExpDirectorSceneActorSelection {
  return Object.freeze({
    canonicalObjectId: hint.object.id,
    objectAuthority: hint.object.authority ?? null,
    participation,
    grouping,
    attention,
    sceneRelevanceReason: hint.sceneRelevanceReason ?? reason,
    vaiRoleRef: hint.vaiRoleRef ?? null,
    sourceAuthority: hint.object.authority ?? "MO:1 / NEX-MVP:4",
  });
}

function connectedIds(subjectId: string, relationships: readonly DthExpRecipeRelationshipContext[], hops: number): Set<string> {
  const selected = new Set<string>([subjectId]);
  for (let i = 0; i < hops; i += 1) {
    for (const rel of relationships) {
      if (selected.has(rel.fromId)) selected.add(rel.toId);
      if (selected.has(rel.toId)) selected.add(rel.fromId);
    }
  }
  return selected;
}

function upstreamOf(targetId: string, relationships: readonly DthExpRecipeRelationshipContext[]): readonly string[] {
  const incoming = relationships.filter((item) => item.toId === targetId).map((item) => item.fromId);
  const farther = incoming.flatMap((id) => relationships.filter((item) => item.toId === id).map((item) => item.fromId));
  return unique([...farther, ...incoming]);
}

function downstreamOf(sourceId: string, relationships: readonly DthExpRecipeRelationshipContext[]): readonly string[] {
  const outgoing = relationships.filter((item) => item.fromId === sourceId).map((item) => item.toId);
  const farther = outgoing.flatMap((id) => relationships.filter((item) => item.fromId === id).map((item) => item.toId));
  return unique([...outgoing, ...farther]);
}

function emptyComposition(
  input: DthExpDirectorSceneCompositionInput,
  state: DthExpDirectorSceneCompositionState,
  reason: string,
  omitted: readonly string[] = [],
): DthExpDirectorSceneComposition {
  return freezeComposition({
    selectedFamily: input.selection.selectedFamily,
    canonicalSubjectId: input.selection.canonicalSubjectId?.trim() || null,
    compositionState: state,
    compositionReason: reason,
    actors: Object.freeze([]),
    relationships: Object.freeze([]),
    evidenceRefs: Object.freeze([]),
    analyticalBindings: Object.freeze([]),
    omittedCanonicalObjectIds: omitted,
    recipeResolution: null,
  });
}

function freezeComposition(
  partial: Omit<
    DthExpDirectorSceneComposition,
    | "identity"
    | "version"
    | "sourceDirectorIdentity"
    | "actorResolver"
    | "recipePipeline"
    | "copiesManagementTruth"
    | "inventsActors"
    | "inventsRelationships"
    | "inventsEvidence"
    | "calculatesTruth"
    | "assignsVaiRoles"
    | "upgradesRelationshipSemantics"
    | "createsCausalTruth"
    | "writesDecision"
    | "writesExecution"
    | "writesOutcome"
    | "writesCanonicalObjects"
    | "parallelTimelineAuthority"
    | "bottleneckFamily"
  >,
): DthExpDirectorSceneComposition {
  return Object.freeze({
    identity: dthExpDirectorSceneCompositionIdentity,
    version: dthExpDirectorSceneCompositionVersion,
    sourceDirectorIdentity: nexoraSemanticPresentationDirectorIdentity,
    actorResolver: "DTH-EXP:2/ObjectStageRoles",
    recipePipeline: "DTH-EXP:3B→DTH-EXP:3A",
    copiesManagementTruth: false,
    inventsActors: false,
    inventsRelationships: false,
    inventsEvidence: false,
    calculatesTruth: false,
    assignsVaiRoles: false,
    upgradesRelationshipSemantics: false,
    createsCausalTruth: false,
    writesDecision: false,
    writesExecution: false,
    writesOutcome: false,
    writesCanonicalObjects: false,
    parallelTimelineAuthority: false,
    bottleneckFamily: false,
    ...partial,
  });
}

function familyMatchesHint(family: DthExpNexoRecipeFamily, hint: DthExpDirectorSceneObjectHint): boolean {
  if (hint.familyRelevance != null && hint.familyRelevance !== "all") {
    return hint.familyRelevance.includes(family);
  }
  return false;
}

function isStaleUnrelated(
  id: string,
  selected: Set<string>,
  previous: readonly string[] | undefined,
): boolean {
  return Boolean(previous?.includes(id) && !selected.has(id));
}

function selectEvidence(
  family: DthExpNexoRecipeFamily,
  graph: DthExpDirectorSceneGraph,
  actorIds: Set<string>,
  relationshipIds: Set<string>,
): readonly DthExpDirectorSceneEvidenceHint[] {
  return Object.freeze(
    graph.evidence.filter((item) => {
      if (item.relevantToQuestion === false) return false;
      if (!relevantToFamily(family, item.familyRelevance)) return false;
      if (item.attachedToKind === "scene") return item.relevantToQuestion === true;
      if (item.attachedToKind === "object") return actorIds.has(item.attachedToId);
      return relationshipIds.has(item.attachedToId);
    }),
  );
}

function selectBindings(
  family: DthExpNexoRecipeFamily,
  graph: DthExpDirectorSceneGraph,
  actorIds: Set<string>,
  dimensions: readonly DthExpRecipeAnalyticalDimension[],
): readonly DthExpDirectorSceneBindingHint[] {
  return Object.freeze(
    graph.bindings.filter((item) => {
      if (!actorIds.has(item.canonicalObjectId)) return false;
      if (!relevantToFamily(family, item.familyRelevance)) return false;
      return dimensions.includes(item.dimension);
    }),
  );
}

function selectRelationships(
  graph: DthExpDirectorSceneGraph,
  actorIds: Set<string>,
): readonly DthExpRecipeRelationshipContext[] {
  return Object.freeze(
    graph.relationships.filter((item) => actorIds.has(item.fromId) && actorIds.has(item.toId)),
  );
}

function omittedIds(graph: DthExpDirectorSceneGraph, selected: Set<string>): readonly string[] {
  return Object.freeze(graph.objects.map((item) => item.object.id).filter((id) => !selected.has(id)));
}

function flowIds(
  familyNeed: string,
  subjectId: string,
  graph: DthExpDirectorSceneGraph,
  objects: Map<string, DthExpDirectorSceneObjectHint>,
): Set<string> {
  const bottleneck =
    graph.objects.find((item) => item.bottleneck)?.object.id ?? graph.bottleneckCanonicalObjectId ?? null;
  if (familyNeed === "BOTTLENECK_LOCATION" && bottleneck && objects.has(bottleneck)) {
    const ids = new Set<string>([subjectId, bottleneck]);
    for (const rel of graph.relationships) {
      if (rel.fromId === bottleneck || rel.toId === bottleneck) {
        ids.add(rel.fromId);
        ids.add(rel.toId);
      }
    }
    return ids;
  }
  const path = connectedIds(subjectId, graph.relationships, 3);
  const selected = new Set<string>([subjectId]);
  for (const id of path) {
    const hint = objects.get(id);
    if (!hint) continue;
    const kind = kindOf(hint);
    if (["risk", "scenario", "decision", "execution", "outcome", "goal"].includes(kind) && !familyMatchesHint("NEXO_FLOW", hint)) {
      continue;
    }
    if (hint.familyRelevance != null && hint.familyRelevance !== "all" && !hint.familyRelevance.includes("NEXO_FLOW")) {
      continue;
    }
    selected.add(id);
  }
  return selected;
}

export function composeNexoraDirectorSceneContext(
  input: DthExpDirectorSceneCompositionInput,
): DthExpDirectorSceneComposition {
  const plan = input.directorPlan ?? null;
  if (plan != null && plan.authority !== nexoraSemanticPresentationDirectorIdentity) {
    return emptyComposition(input, "insufficient-context", "director-authority-not-dir1");
  }
  const family = input.selection.selectedFamily;
  const subjectId = input.selection.canonicalSubjectId?.trim() || null;
  const graph = input.graph;
  const objects = byId(graph);
  const allIds = graph.objects.map((item) => item.object.id);
  const previous = graph.previousSceneActorIds ?? [];

  if (family == null || input.selection.selectionState === "unresolved") {
    return emptyComposition(input, "no-selection", "4a-family-not-selected", allIds);
  }
  if (subjectId == null) {
    return emptyComposition(input, "insufficient-context", "canonical-subject-missing", allIds);
  }
  if (graph.collectionMemberIds && graph.collectionMemberIds.length > 0) {
    const first = graph.collectionMemberIds[0];
    if (subjectId !== first && !objects.has(subjectId)) {
      return emptyComposition(input, "missing-required-actor", "collection-member-not-substituted", allIds);
    }
  }
  const subject = objects.get(subjectId);
  if (!subject) {
    return emptyComposition(input, "missing-required-actor", "canonical-subject-not-in-graph", allIds);
  }

  const need = input.selection.managementNeed;
  let selectedIds = new Set<string>([subjectId]);
  let actors: DthExpDirectorSceneActorSelection[] = [
    actorSelection(subject, "focal", "focal", "focal", "canonical-subject-anchor"),
  ];

  const add = (
    id: string,
    participation: DthExpDirectorSceneActorSelection["participation"],
    grouping: string | null,
    attention: DthExpSceneAttention | null,
    reason: string,
  ) => {
    const hint = objects.get(id);
    if (!hint || selectedIds.has(id)) return;
    selectedIds.add(id);
    actors.push(actorSelection(hint, participation, grouping, attention, reason));
  };

  if (family === "NEXO_FLOW") {
    selectedIds = flowIds(need, subjectId, graph, objects);
    actors = [];
    const bottleneck =
      graph.objects.find((item) => item.bottleneck)?.object.id ?? graph.bottleneckCanonicalObjectId ?? null;
    const recipeFocal = need === "BOTTLENECK_LOCATION" && bottleneck && selectedIds.has(bottleneck) ? bottleneck : subjectId;
    const up = upstreamOf(recipeFocal, graph.relationships).filter((id) => selectedIds.has(id) && id !== recipeFocal);
    const down = downstreamOf(recipeFocal, graph.relationships).filter((id) => selectedIds.has(id) && id !== recipeFocal && !up.includes(id));
    for (const id of up) {
      const hint = objects.get(id);
      if (hint) actors.push(actorSelection(hint, "supporting", "upstream", "contextual", "flow-upstream"));
    }
    const focalHint = objects.get(recipeFocal);
    if (focalHint) {
      actors.push(
        actorSelection(
          focalHint,
          "focal",
          "focal",
          recipeFocal === bottleneck ? "emphasized" : "focal",
          recipeFocal === bottleneck ? "flow-bottleneck-condition" : "flow-focal",
        ),
      );
    }
    for (const id of down) {
      const hint = objects.get(id);
      if (hint) actors.push(actorSelection(hint, "supporting", "downstream", "contextual", "flow-downstream"));
    }
    if (!actors.some((item) => item.canonicalObjectId === subjectId) && objects.has(subjectId)) {
      actors.push(actorSelection(subject, "contextual", "focal", "contextual", "canonical-subject-anchor"));
    }
  } else if (family === "NEXO_CAUSE") {
    for (const hint of graph.objects) {
      const id = hint.object.id;
      if (id === subjectId) continue;
      if (previous.includes(id) && !familyMatchesHint("NEXO_CAUSE", hint) && hint.collectionMember) continue;
      if (familyMatchesHint("NEXO_CAUSE", hint) || kindOf(hint) === "kpi" || hint.vaiRoleRef != null) {
        if (hint.familyRelevance != null && hint.familyRelevance !== "all" && !hint.familyRelevance.includes("NEXO_CAUSE")) continue;
        add(id, "supporting", "causes", "emphasized", "candidate-cause-context");
      }
    }
  } else if (family === "NEXO_IMPACT") {
    for (const hint of graph.objects) {
      if (hint.object.id === subjectId) continue;
      if (hint.vaiRoleRef == null) continue;
      add(hint.object.id, hint.vaiRoleRef === "LEVER" ? "primary" : "supporting", "impacts", "emphasized", "existing-vai-context");
    }
    if (![...selectedIds].some((id) => objects.get(id)?.vaiRoleRef != null && id !== subjectId)) {
      return emptyComposition(input, "insufficient-context", "vai-backed-variables-missing", omittedIds(graph, selectedIds));
    }
  } else if (family === "NEXO_RISK") {
    for (const hint of graph.objects) {
      if (kindOf(hint) !== "risk" && !familyMatchesHint("NEXO_RISK", hint)) continue;
      add(hint.object.id, "primary", "risks", "emphasized", "existing-risk-context");
    }
    if (![...selectedIds].some((id) => kindOf(objects.get(id)!) === "risk" || familyMatchesHint("NEXO_RISK", objects.get(id)!))) {
      return emptyComposition(input, "insufficient-context", "risk-context-missing", omittedIds(graph, selectedIds));
    }
  } else if (family === "NEXO_TIME") {
    for (const hint of graph.objects) {
      if (hint.object.id === subjectId) continue;
      if (hint.timeBucket == null && !familyMatchesHint("NEXO_TIME", hint)) continue;
      add(
        hint.object.id,
        hint.timeBucket === "current" ? "primary" : "contextual",
        hint.timeBucket ?? "current",
        "contextual",
        "existing-time-context",
      );
    }
  } else if (family === "NEXO_BARS") {
    for (const hint of graph.objects) {
      if (hint.object.id === subjectId) continue;
      if (kindOf(hint) === "kpi" || familyMatchesHint("NEXO_BARS", hint)) {
        add(hint.object.id, "primary", null, "contextual", "magnitude-comparable");
      }
    }
  } else if (family === "NEXO_BUBBLE") {
    const members = graph.collectionMemberIds ?? plan?.collection?.members.map((item) => item.id) ?? [];
    const candidateIds = members.length > 0 ? members : graph.objects.filter((item) => item.collectionMember || familyMatchesHint("NEXO_BUBBLE", item)).map((item) => item.object.id);
    for (const id of candidateIds) {
      if (id === subjectId) continue;
      if (!objects.has(id)) continue;
      add(id, "primary", "candidates", "contextual", "portfolio-candidate");
    }
    if (selectedIds.size < 2) {
      return emptyComposition(input, "insufficient-context", "portfolio-candidates-missing", omittedIds(graph, selectedIds));
    }
  } else if (family === "NEXO_EXECUTION") {
    for (const hint of graph.objects) {
      const kind = kindOf(hint);
      if (kind === "execution") add(hint.object.id, "focal", "active", "focal", "execution-authority-cc11");
      if (kind === "decision") add(hint.object.id, "supporting", "planned", "contextual", "decision-context-cc10");
    }
    if (![...selectedIds].some((id) => kindOf(objects.get(id)!) === "execution")) {
      return emptyComposition(input, "missing-required-actor", "execution-object-missing", omittedIds(graph, selectedIds));
    }
  } else if (family === "NEXO_OUTCOME") {
    for (const hint of graph.objects) {
      const kind = kindOf(hint);
      if (kind === "outcome") add(hint.object.id, "focal", "current", "focal", "outcome-authority-core-out");
      if (kind === "goal") add(hint.object.id, "supporting", "planned", "contextual", "goal-context");
    }
    if (![...selectedIds].some((id) => kindOf(objects.get(id)!) === "outcome")) {
      return emptyComposition(input, "missing-required-actor", "outcome-object-missing", omittedIds(graph, selectedIds));
    }
  }

  selectedIds = new Set(actors.map((item) => item.canonicalObjectId));
  for (const id of previous) {
    if (isStaleUnrelated(id, selectedIds, previous)) {
      /* omitted via omittedCanonicalObjectIds */
    }
  }

  const relationships = selectRelationships(graph, selectedIds);
  const missingRequiredRelationship = (graph.requiredRelationshipIds ?? []).find(
    (id) => !graph.relationships.some((item) => item.relationshipId === id),
  );
  if (missingRequiredRelationship) {
    return emptyComposition(input, "unsupported-relationship", "required-relationship-not-in-authority", omittedIds(graph, selectedIds));
  }
  const evidence = selectEvidence(
    family,
    graph,
    selectedIds,
    new Set(relationships.map((item) => item.relationshipId)),
  );
  const dimensions: readonly DthExpRecipeAnalyticalDimension[] =
    family === "NEXO_FLOW"
      ? FLOW_DIMENSIONS
      : family === "NEXO_BARS"
        ? BARS_DIMENSIONS
        : family === "NEXO_BUBBLE"
          ? BUBBLE_DIMENSIONS
          : family === "NEXO_IMPACT"
            ? ["vai-role"]
            : family === "NEXO_RISK"
              ? ["risk"]
              : family === "NEXO_TIME"
                ? ["time"]
                : family === "NEXO_CAUSE"
                  ? CAUSE_DIMENSIONS
                  : family === "NEXO_EXECUTION"
                    ? ["execution-progress"]
                    : family === "NEXO_OUTCOME"
                      ? ["outcome-vs-goal"]
                      : [];
  const bindings = selectBindings(family, graph, selectedIds, dimensions);
  const missingRequiredBinding = graph.bindings.find(
    (item) => item.required && relevantToFamily(family, item.familyRelevance) && !bindings.some((selected) => selected.bindingId === item.bindingId),
  );
  if (missingRequiredBinding) {
    return emptyComposition(input, "missing-required-binding", "required-analytical-binding-missing", omittedIds(graph, selectedIds));
  }

  const evidenceByObject = (id: string) => evidence.filter((item) => item.attachedToId === id).map((item) => item.evidenceRef);
  const bindingInputs = bindings.map((item) =>
    Object.freeze({
      bindingId: item.bindingId,
      canonicalObjectId: item.canonicalObjectId,
      dimension: item.dimension,
      authority: item.authority,
      valueRef: item.valueRef,
      required: item.required ?? false,
    }),
  );
  const evidenceRequirements = evidence.map((item, index) =>
    Object.freeze({
      requirementId: `ev-${index}`,
      evidenceRef: item.evidenceRef,
      attachedToKind: item.attachedToKind,
      attachedToId: item.attachedToId,
      required: false,
    }),
  );
  const relationshipInputs = relationships.map((item, index) =>
    Object.freeze({
      requirementId: `rel-${index}`,
      relationshipId: item.relationshipId,
      fromCanonicalObjectId: item.fromId,
      toCanonicalObjectId: item.toId,
      required: false,
      evidenceRefs: Object.freeze([]) as readonly string[],
    }),
  );

  const hint = (id: string) => objects.get(id)!;
  let definition;
  try {
    if (family === "NEXO_FLOW") {
      const focalActor = actors.find((item) => item.participation === "focal") ?? actors[0]!;
      definition = defineNexoFlowRecipe({
        recipeId: `dth-exp:4b:flow:${subjectId}`,
        upstream: actors.filter((item) => item.grouping === "upstream").map((item) => participant(hint(item.canonicalObjectId), { evidenceRefs: evidenceByObject(item.canonicalObjectId) })),
        focal: participant(hint(focalActor.canonicalObjectId), { evidenceRefs: evidenceByObject(focalActor.canonicalObjectId) }),
        downstream: actors.filter((item) => item.grouping === "downstream").map((item) => participant(hint(item.canonicalObjectId), { evidenceRefs: evidenceByObject(item.canonicalObjectId) })),
        bottleneckCanonicalObjectId: graph.bottleneckCanonicalObjectId ?? graph.objects.find((item) => item.bottleneck)?.object.id ?? null,
        relationships: relationshipInputs,
        analyticalBindings: bindingInputs,
        evidenceRequirements,
      });
    } else if (family === "NEXO_CAUSE") {
      definition = defineNexoCauseRecipe({
        recipeId: `dth-exp:4b:cause:${subjectId}`,
        focal: participant(subject, { evidenceRefs: evidenceByObject(subjectId) }),
        candidateCauses: actors
          .filter((item) => item.canonicalObjectId !== subjectId)
          .map((item) => participant(hint(item.canonicalObjectId), { evidenceRefs: evidenceByObject(item.canonicalObjectId) })),
        relationships: relationshipInputs,
        analyticalBindings: bindingInputs,
        evidenceRequirements,
      });
    } else if (family === "NEXO_IMPACT") {
      definition = defineNexoImpactRecipe({
        recipeId: `dth-exp:4b:impact:${subjectId}`,
        focal: participant(subject, { vaiRoleRef: subject.vaiRoleRef ?? null }),
        variables: actors
          .filter((item) => item.canonicalObjectId !== subjectId)
          .map((item) => participant(hint(item.canonicalObjectId), { vaiRoleRef: hint(item.canonicalObjectId).vaiRoleRef })),
        relationships: relationshipInputs,
        analyticalBindings: bindingInputs,
        evidenceRequirements,
      });
    } else if (family === "NEXO_RISK") {
      const risks = actors.filter((item) => kindOf(hint(item.canonicalObjectId)) === "risk" || familyMatchesHint("NEXO_RISK", hint(item.canonicalObjectId)));
      definition = defineNexoRiskRecipe({
        recipeId: `dth-exp:4b:risk:${subjectId}`,
        risks: risks.map((item) => participant(hint(item.canonicalObjectId))),
        related: actors.filter((item) => !risks.includes(item)).map((item) => participant(hint(item.canonicalObjectId), { required: false })),
        focalCanonicalObjectId: subjectId,
        analyticalBindings: bindingInputs,
        evidenceRequirements,
      });
    } else if (family === "NEXO_TIME") {
      definition = defineNexoTimeRecipe({
        recipeId: `dth-exp:4b:time:${subjectId}`,
        historical: actors.filter((item) => item.grouping === "historical").map((item) => participant(hint(item.canonicalObjectId), { required: false })),
        current: actors.filter((item) => item.grouping !== "historical" && item.grouping !== "future").map((item) => participant(hint(item.canonicalObjectId))),
        future: actors.filter((item) => item.grouping === "future").map((item) => participant(hint(item.canonicalObjectId), { required: false })),
        focalCanonicalObjectId: subjectId,
        analyticalBindings: bindingInputs,
        evidenceRequirements,
      });
    } else if (family === "NEXO_BARS") {
      definition = defineNexoBarsRecipe({
        recipeId: `dth-exp:4b:bars:${subjectId}`,
        comparable: actors.map((item) => participant(hint(item.canonicalObjectId))),
        focalCanonicalObjectId: subjectId,
        analyticalBindings: bindingInputs,
        evidenceRequirements,
      });
    } else if (family === "NEXO_BUBBLE") {
      definition = defineNexoBubbleRecipe({
        recipeId: `dth-exp:4b:bubble:${subjectId}`,
        candidates: actors.map((item) => participant(hint(item.canonicalObjectId))),
        focalCanonicalObjectId: subjectId,
        analyticalBindings: bindingInputs,
        evidenceRequirements,
      });
    } else if (family === "NEXO_EXECUTION") {
      const execution = actors.find((item) => kindOf(hint(item.canonicalObjectId)) === "execution");
      if (!execution) {
        return emptyComposition(input, "missing-required-actor", "execution-object-missing", omittedIds(graph, selectedIds));
      }
      const decision = actors.find((item) => kindOf(hint(item.canonicalObjectId)) === "decision");
      definition = defineNexoExecutionRecipe({
        recipeId: `dth-exp:4b:execution:${subjectId}`,
        execution: participant(hint(execution.canonicalObjectId)),
        decision: decision ? participant(hint(decision.canonicalObjectId)) : null,
        analyticalBindings: bindingInputs,
        evidenceRequirements,
      });
    } else {
      const observed = actors.find((item) => kindOf(hint(item.canonicalObjectId)) === "outcome");
      if (!observed) {
        return emptyComposition(input, "missing-required-actor", "outcome-object-missing", omittedIds(graph, selectedIds));
      }
      const goal = actors.find((item) => kindOf(hint(item.canonicalObjectId)) === "goal");
      definition = defineNexoOutcomeRecipe({
        recipeId: `dth-exp:4b:outcome:${subjectId}`,
        observed: participant(hint(observed.canonicalObjectId)),
        goal: goal ? participant(hint(goal.canonicalObjectId)) : null,
        analyticalBindings: bindingInputs,
        evidenceRequirements,
      });
    }
  } catch {
    return emptyComposition(input, "insufficient-context", "recipe-definition-failed", omittedIds(graph, selectedIds));
  }

  const resolution = resolveNexoFamilyRecipe({
    definition,
    context: {
      objects: Object.freeze(graph.objects.map((item) => item.object)),
      relationships,
      availableEvidenceRefs: Object.freeze(evidence.map((item) => item.evidenceRef)),
      availableBindingRefs: Object.freeze(bindings.map((item) => item.valueRef).filter((item): item is string => item != null)),
      theatreSceneIdentity: "dth-exp:4b:scene",
    },
  });

  if (resolution.projectionStatus === "failed") {
    const reason = resolution.limitations[0] ?? "recipe-resolution-failed";
    const state: DthExpDirectorSceneCompositionState = reason.includes("relationship")
      ? "unsupported-relationship"
      : reason.includes("binding")
        ? "missing-required-binding"
        : "insufficient-context";
    return emptyComposition(input, state, reason, omittedIds(graph, selectedIds));
  }

  return freezeComposition({
    selectedFamily: family,
    canonicalSubjectId: subjectId,
    compositionState: "ok",
    compositionReason: `4a:${family}:minimum-relevant-context`,
    actors: Object.freeze(actors),
    relationships,
    evidenceRefs: unique(evidence.map((item) => item.evidenceRef)),
    analyticalBindings: bindings,
    omittedCanonicalObjectIds: omittedIds(graph, selectedIds),
    recipeResolution: resolution,
  });
}
