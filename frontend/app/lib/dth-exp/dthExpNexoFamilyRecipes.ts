/**
 * NPA-T DTH-EXP:3B — nine Nexo family recipe definitions.
 * Each returns a DTH-EXP:3A Scene Recipe. Resolution is resolveDthExpSceneRecipe only.
 */

import type { VaiContextualRole } from "@/app/lib/vai/vaiContract.ts";
import { dthExpSceneRecipeIdentity, dthExpSceneRecipeVersion } from "./dthExpSceneRecipeIdentity.ts";
import { dthExpNexoFamilyIdentity, dthExpNexoFamilyVersion } from "./dthExpNexoFamilyIdentity.ts";
import {
  DTH_EXP_DEFAULT_RECIPE_FALLBACK,
  type DthExpNexoRecipeFamily,
  type DthExpRecipeActorRequirement,
  type DthExpRecipeAnalyticalBinding,
  type DthExpRecipeAnalyticalDimension,
  type DthExpRecipeEvidenceRequirement,
  type DthExpRecipeRelationshipRequirement,
  type DthExpSceneRecipe,
} from "./dthExpSceneRecipeContract.ts";
import type { DthExpSceneAttention } from "./dthExpObjectStageRoleContract.ts";
import type { DthExpVisualRole } from "./dthExpVisualRole.ts";
import { DTH_EXP_NEXO_TIME_BOUNDARY } from "./dthExpVisualRole.ts";
import {
  DTH_EXP_NEXO_FAMILY_DISPLAY_NAMES,
  DTH_EXP_NEXO_FAMILY_RESOLVER,
  type DthExpNexoFamilyDefinition,
} from "./dthExpNexoFamilyContract.ts";
import { resolveDthExpSceneRecipe } from "./dthExpResolveSceneRecipe.ts";
import type { DthExpSceneRecipeContext, DthExpSceneRecipeResolution } from "./dthExpSceneRecipeContract.ts";

export type DthExpNexoFamilyParticipant = Readonly<{
  canonicalObjectId: string;
  required?: boolean;
  evidenceRefs?: readonly string[];
  vaiRoleRef?: VaiContextualRole | null;
  attention?: DthExpSceneAttention | null;
  grouping?: string | null;
}>;

export type DthExpNexoFamilyBindingInput = Readonly<{
  bindingId: string;
  canonicalObjectId: string;
  dimension: DthExpRecipeAnalyticalDimension;
  authority: string;
  valueRef: string | null;
  required?: boolean;
}>;

export type DthExpNexoFamilyRelationshipInput = Readonly<{
  requirementId: string;
  relationshipId: string | null;
  fromCanonicalObjectId: string;
  toCanonicalObjectId: string;
  required?: boolean;
  evidenceRefs?: readonly string[];
}>;

function freezeActors(
  items: readonly DthExpRecipeActorRequirement[],
): readonly DthExpRecipeActorRequirement[] {
  return Object.freeze(items.map((item) => Object.freeze(item)));
}

function actor(
  slotId: string,
  participant: DthExpNexoFamilyParticipant,
  extras: {
    readonly participation: DthExpRecipeActorRequirement["participation"];
    readonly visualRole: DthExpVisualRole;
    readonly grouping?: string | null;
    readonly attention?: DthExpSceneAttention | null;
  },
): DthExpRecipeActorRequirement {
  return Object.freeze({
    slotId,
    participation: extras.participation,
    canonicalObjectId: participant.canonicalObjectId,
    visualRole: extras.visualRole,
    attention: extras.attention ?? participant.attention ?? null,
    grouping: extras.grouping ?? participant.grouping ?? null,
    required: participant.required ?? true,
    evidenceRefs: Object.freeze([...(participant.evidenceRefs ?? [])]),
    vaiRoleRef: participant.vaiRoleRef ?? null,
  });
}

function bindings(items: readonly DthExpNexoFamilyBindingInput[] | undefined): readonly DthExpRecipeAnalyticalBinding[] {
  return Object.freeze(
    (items ?? []).map((item) =>
      Object.freeze({
        bindingId: item.bindingId,
        canonicalObjectId: item.canonicalObjectId,
        dimension: item.dimension,
        authority: item.authority,
        valueRef: item.valueRef,
        required: item.required ?? false,
        calculatesTruth: false as const,
        redefinesVaiRole: false as const,
      }),
    ),
  );
}

function relationships(
  items: readonly DthExpNexoFamilyRelationshipInput[] | undefined,
): readonly DthExpRecipeRelationshipRequirement[] {
  return Object.freeze(
    (items ?? []).map((item) =>
      Object.freeze({
        requirementId: item.requirementId,
        relationshipId: item.relationshipId,
        fromCanonicalObjectId: item.fromCanonicalObjectId,
        toCanonicalObjectId: item.toCanonicalObjectId,
        required: item.required ?? false,
        evidenceRefs: Object.freeze([...(item.evidenceRefs ?? [])]),
      }),
    ),
  );
}

function evidence(
  items: readonly DthExpRecipeEvidenceRequirement[] | undefined,
): readonly DthExpRecipeEvidenceRequirement[] {
  return Object.freeze((items ?? []).map((item) => Object.freeze(item)));
}

function composeRecipe(input: {
  readonly recipeId: string;
  readonly family: DthExpNexoRecipeFamily;
  readonly managementIntent: string;
  readonly actors: readonly DthExpRecipeActorRequirement[];
  readonly relationshipRequirements?: readonly DthExpNexoFamilyRelationshipInput[];
  readonly evidenceRequirements?: readonly DthExpRecipeEvidenceRequirement[];
  readonly analyticalBindings?: readonly DthExpNexoFamilyBindingInput[];
}): DthExpSceneRecipe {
  return Object.freeze({
    identity: dthExpSceneRecipeIdentity,
    version: dthExpSceneRecipeVersion,
    recipeId: input.recipeId,
    family: input.family,
    nexoFamilyRecipeImplemented: false,
    managementIntent: input.managementIntent,
    actorRequirements: freezeActors(input.actors),
    relationshipRequirements: relationships(input.relationshipRequirements),
    evidenceRequirements: evidence(input.evidenceRequirements),
    analyticalBindings: bindings(input.analyticalBindings),
    fallback: DTH_EXP_DEFAULT_RECIPE_FALLBACK,
    compositionMetadata: Object.freeze({
      composer: "DTH-EXP:3A/SceneRecipeResolver",
      automaticDirectorSelection: false,
      animationImplemented: false,
      layoutImplemented: false,
    }),
    isTheatreScene: false,
    copiesManagementTruth: false,
    writesCanonicalObjectVisualRole: false,
  });
}

function definition(
  family: DthExpNexoRecipeFamily,
  recipe: DthExpSceneRecipe,
  extras?: {
    readonly bottleneckCanonicalObjectId?: string | null;
    readonly consumesVai?: boolean;
  },
): DthExpNexoFamilyDefinition {
  return Object.freeze({
    identity: dthExpNexoFamilyIdentity,
    version: dthExpNexoFamilyVersion,
    family,
    displayName: DTH_EXP_NEXO_FAMILY_DISPLAY_NAMES[family],
    recipe,
    resolver: DTH_EXP_NEXO_FAMILY_RESOLVER,
    parallelEngine: false,
    isBusinessTruthAuthority: false,
    bottleneckIsNexoFamily: false,
    bottleneckCanonicalObjectId: extras?.bottleneckCanonicalObjectId ?? null,
    ranksCandidates: false,
    calculatesKpi: false,
    consumesVai: extras?.consumesVai === true,
    convertsCorrelationToCause: false,
    candidateMeansConfirmedCause: false,
    writesExecution: false,
    writesOutcome: false,
    writesLearning: false,
    parallelTimelineAuthority: false,
    timelineIsNexoTimeTechnique: DTH_EXP_NEXO_TIME_BOUNDARY.timelineIsVisualizationTechniqueInsideNexoTime,
    automaticDirectorSelection: false,
  });
}

export function resolveNexoFamilyRecipe(input: {
  readonly definition: DthExpNexoFamilyDefinition;
  readonly context: DthExpSceneRecipeContext;
}): DthExpSceneRecipeResolution {
  return resolveDthExpSceneRecipe({
    recipe: input.definition.recipe,
    context: input.context,
  });
}

export function defineNexoBubbleRecipe(input: {
  readonly recipeId: string;
  readonly managementIntent?: string;
  readonly candidates: readonly DthExpNexoFamilyParticipant[];
  readonly focalCanonicalObjectId?: string | null;
  readonly analyticalBindings?: readonly DthExpNexoFamilyBindingInput[];
  readonly evidenceRequirements?: readonly DthExpRecipeEvidenceRequirement[];
}): DthExpNexoFamilyDefinition {
  const actors = input.candidates.map((candidate, index) =>
    actor(`candidate-${index}`, candidate, {
      participation: candidate.canonicalObjectId === input.focalCanonicalObjectId ? "focal" : "primary",
      visualRole: "bubble",
      grouping: candidate.grouping ?? "candidates",
      attention:
        candidate.attention ??
        (candidate.canonicalObjectId === input.focalCanonicalObjectId ? "focal" : "contextual"),
    }),
  );
  return definition(
    "NEXO_BUBBLE",
    composeRecipe({
      recipeId: input.recipeId,
      family: "NEXO_BUBBLE",
      managementIntent: input.managementIntent ?? "Compare candidate investments, projects, or scenarios",
      actors,
      analyticalBindings: input.analyticalBindings,
      evidenceRequirements: input.evidenceRequirements,
    }),
  );
}

export function defineNexoBarsRecipe(input: {
  readonly recipeId: string;
  readonly managementIntent?: string;
  readonly comparable: readonly DthExpNexoFamilyParticipant[];
  readonly focalCanonicalObjectId?: string | null;
  readonly analyticalBindings?: readonly DthExpNexoFamilyBindingInput[];
  readonly evidenceRequirements?: readonly DthExpRecipeEvidenceRequirement[];
}): DthExpNexoFamilyDefinition {
  const actors = input.comparable.map((item, index) =>
    actor(`bar-${index}`, item, {
      participation: item.canonicalObjectId === input.focalCanonicalObjectId ? "focal" : "primary",
      visualRole: "bar",
      attention:
        item.attention ?? (item.canonicalObjectId === input.focalCanonicalObjectId ? "focal" : "contextual"),
    }),
  );
  return definition(
    "NEXO_BARS",
    composeRecipe({
      recipeId: input.recipeId,
      family: "NEXO_BARS",
      managementIntent: input.managementIntent ?? "Compare magnitudes using authoritative values",
      actors,
      analyticalBindings: input.analyticalBindings,
      evidenceRequirements: input.evidenceRequirements,
    }),
  );
}

export function defineNexoFlowRecipe(input: {
  readonly recipeId: string;
  readonly managementIntent?: string;
  readonly upstream: readonly DthExpNexoFamilyParticipant[];
  readonly focal: DthExpNexoFamilyParticipant;
  readonly downstream: readonly DthExpNexoFamilyParticipant[];
  readonly relationships?: readonly DthExpNexoFamilyRelationshipInput[];
  readonly bottleneckCanonicalObjectId?: string | null;
  readonly analyticalBindings?: readonly DthExpNexoFamilyBindingInput[];
  readonly evidenceRequirements?: readonly DthExpRecipeEvidenceRequirement[];
}): DthExpNexoFamilyDefinition {
  const bottleneck = input.bottleneckCanonicalObjectId ?? null;
  const flowAttention = (participant: DthExpNexoFamilyParticipant, fallback: DthExpSceneAttention): DthExpSceneAttention => {
    if (participant.canonicalObjectId === bottleneck) return participant.attention ?? "emphasized";
    return participant.attention ?? fallback;
  };
  const actors = [
    ...input.upstream.map((item, index) =>
      actor(`upstream-${index}`, item, {
        participation: "supporting",
        visualRole: "flow-node",
        grouping: "upstream",
        attention: flowAttention(item, "contextual"),
      }),
    ),
    actor("focal", input.focal, {
      participation: "focal",
      visualRole: "flow-node",
      grouping: "focal",
      attention: flowAttention(input.focal, "focal"),
    }),
    ...input.downstream.map((item, index) =>
      actor(`downstream-${index}`, item, {
        participation: "supporting",
        visualRole: "flow-node",
        grouping: "downstream",
        attention: flowAttention(item, "contextual"),
      }),
    ),
  ];
  return definition(
    "NEXO_FLOW",
    composeRecipe({
      recipeId: input.recipeId,
      family: "NEXO_FLOW",
      managementIntent: input.managementIntent ?? "Show operational flow and where movement is constrained",
      actors,
      relationshipRequirements: input.relationships,
      analyticalBindings: input.analyticalBindings,
      evidenceRequirements: input.evidenceRequirements,
    }),
    { bottleneckCanonicalObjectId: bottleneck },
  );
}

export function defineNexoImpactRecipe(input: {
  readonly recipeId: string;
  readonly managementIntent?: string;
  readonly focal: DthExpNexoFamilyParticipant;
  readonly variables: readonly DthExpNexoFamilyParticipant[];
  readonly relationships?: readonly DthExpNexoFamilyRelationshipInput[];
  readonly analyticalBindings?: readonly DthExpNexoFamilyBindingInput[];
  readonly evidenceRequirements?: readonly DthExpRecipeEvidenceRequirement[];
}): DthExpNexoFamilyDefinition {
  const actors = [
    actor("focal", input.focal, {
      participation: "focal",
      visualRole: "impact-node",
      grouping: "impacts",
      attention: input.focal.attention ?? "focal",
    }),
    ...input.variables.map((item, index) =>
      actor(`variable-${index}`, item, {
        participation: item.vaiRoleRef === "LEVER" ? "primary" : "supporting",
        visualRole: "impact-node",
        grouping: "impacts",
        attention: item.attention ?? (item.vaiRoleRef === "LEVER" ? "emphasized" : "contextual"),
      }),
    ),
  ];
  return definition(
    "NEXO_IMPACT",
    composeRecipe({
      recipeId: input.recipeId,
      family: "NEXO_IMPACT",
      managementIntent: input.managementIntent ?? "Show variables, levers, and supported paths of effect",
      actors,
      relationshipRequirements: input.relationships,
      analyticalBindings: input.analyticalBindings,
      evidenceRequirements: input.evidenceRequirements,
    }),
    { consumesVai: true },
  );
}

export function defineNexoRiskRecipe(input: {
  readonly recipeId: string;
  readonly managementIntent?: string;
  readonly risks: readonly DthExpNexoFamilyParticipant[];
  readonly related?: readonly DthExpNexoFamilyParticipant[];
  readonly focalCanonicalObjectId?: string | null;
  readonly analyticalBindings?: readonly DthExpNexoFamilyBindingInput[];
  readonly evidenceRequirements?: readonly DthExpRecipeEvidenceRequirement[];
}): DthExpNexoFamilyDefinition {
  const actors = [
    ...input.risks.map((item, index) =>
      actor(`risk-${index}`, item, {
        participation: item.canonicalObjectId === input.focalCanonicalObjectId ? "focal" : "primary",
        visualRole: "risk-marker",
        grouping: "risks",
        attention:
          item.attention ??
          (item.canonicalObjectId === input.focalCanonicalObjectId ? "focal" : "emphasized"),
      }),
    ),
    ...(input.related ?? []).map((item, index) =>
      actor(`related-${index}`, { ...item, required: item.required ?? false }, {
        participation: "contextual",
        visualRole: "risk-marker",
        grouping: "risks",
        attention: item.attention ?? "contextual",
      }),
    ),
  ];
  return definition(
    "NEXO_RISK",
    composeRecipe({
      recipeId: input.recipeId,
      family: "NEXO_RISK",
      managementIntent: input.managementIntent ?? "Show risk concentration and exposure from existing Risk authority",
      actors,
      analyticalBindings: input.analyticalBindings,
      evidenceRequirements: input.evidenceRequirements,
    }),
  );
}

export function defineNexoTimeRecipe(input: {
  readonly recipeId: string;
  readonly managementIntent?: string;
  readonly historical?: readonly DthExpNexoFamilyParticipant[];
  readonly current: readonly DthExpNexoFamilyParticipant[];
  readonly future?: readonly DthExpNexoFamilyParticipant[];
  readonly focalCanonicalObjectId?: string | null;
  readonly analyticalBindings?: readonly DthExpNexoFamilyBindingInput[];
  readonly evidenceRequirements?: readonly DthExpRecipeEvidenceRequirement[];
}): DthExpNexoFamilyDefinition {
  const timeActor = (
    prefix: string,
    grouping: "historical" | "current" | "future",
    participation: DthExpRecipeActorRequirement["participation"],
    items: readonly DthExpNexoFamilyParticipant[],
  ) =>
    items.map((item, index) =>
      actor(`${prefix}-${index}`, { ...item, required: item.required ?? grouping !== "future" }, {
        participation: item.canonicalObjectId === input.focalCanonicalObjectId ? "focal" : participation,
        visualRole: "time-point",
        grouping,
        attention:
          item.attention ??
          (item.canonicalObjectId === input.focalCanonicalObjectId
            ? "focal"
            : grouping === "current"
              ? "emphasized"
              : "contextual"),
      }),
    );
  const actors = [
    ...timeActor("past", "historical", "contextual", input.historical ?? []),
    ...timeActor("now", "current", "primary", input.current),
    ...timeActor("next", "future", "optional", input.future ?? []),
  ];
  return definition(
    "NEXO_TIME",
    composeRecipe({
      recipeId: input.recipeId,
      family: "NEXO_TIME",
      managementIntent: input.managementIntent ?? "Express management state across time using existing references",
      actors,
      analyticalBindings: input.analyticalBindings,
      evidenceRequirements: input.evidenceRequirements,
    }),
  );
}

export function defineNexoCauseRecipe(input: {
  readonly recipeId: string;
  readonly managementIntent?: string;
  readonly focal: DthExpNexoFamilyParticipant;
  readonly candidateCauses: readonly DthExpNexoFamilyParticipant[];
  readonly relationships?: readonly DthExpNexoFamilyRelationshipInput[];
  readonly analyticalBindings?: readonly DthExpNexoFamilyBindingInput[];
  readonly evidenceRequirements?: readonly DthExpRecipeEvidenceRequirement[];
}): DthExpNexoFamilyDefinition {
  const actors = [
    actor("focal", input.focal, {
      participation: "focal",
      visualRole: "cause-node",
      grouping: "focal",
      attention: input.focal.attention ?? "focal",
    }),
    ...input.candidateCauses.map((item, index) =>
      actor(`cause-${index}`, item, {
        participation: "supporting",
        visualRole: "cause-node",
        grouping: "causes",
        attention: item.attention ?? "emphasized",
      }),
    ),
  ];
  return definition(
    "NEXO_CAUSE",
    composeRecipe({
      recipeId: input.recipeId,
      family: "NEXO_CAUSE",
      managementIntent: input.managementIntent ?? "Investigate candidate causes without confirming causality",
      actors,
      relationshipRequirements: input.relationships,
      analyticalBindings: input.analyticalBindings,
      evidenceRequirements: input.evidenceRequirements,
    }),
    { consumesVai: input.candidateCauses.some((item) => item.vaiRoleRef != null) || input.focal.vaiRoleRef != null },
  );
}

export function defineNexoExecutionRecipe(input: {
  readonly recipeId: string;
  readonly managementIntent?: string;
  readonly decision?: DthExpNexoFamilyParticipant | null;
  readonly execution: DthExpNexoFamilyParticipant;
  readonly milestones?: readonly DthExpNexoFamilyParticipant[];
  readonly blockers?: readonly DthExpNexoFamilyParticipant[];
  readonly analyticalBindings?: readonly DthExpNexoFamilyBindingInput[];
  readonly evidenceRequirements?: readonly DthExpRecipeEvidenceRequirement[];
}): DthExpNexoFamilyDefinition {
  const actors = [
    ...(input.decision
      ? [
          actor("decision", input.decision, {
            participation: "supporting",
            visualRole: "execution-marker",
            grouping: "planned",
            attention: input.decision.attention ?? "contextual",
          }),
        ]
      : []),
    actor("execution", input.execution, {
      participation: "focal",
      visualRole: "execution-marker",
      grouping: "active",
      attention: input.execution.attention ?? "focal",
    }),
    ...(input.milestones ?? []).map((item, index) =>
      actor(`milestone-${index}`, item, {
        participation: "supporting",
        visualRole: "execution-marker",
        grouping: item.grouping ?? "planned",
        attention: item.attention ?? "contextual",
      }),
    ),
    ...(input.blockers ?? []).map((item, index) =>
      actor(`blocker-${index}`, { ...item, required: item.required ?? false }, {
        participation: "optional",
        visualRole: "execution-marker",
        grouping: "blocked",
        attention: item.attention ?? "emphasized",
      }),
    ),
  ];
  return definition(
    "NEXO_EXECUTION",
    composeRecipe({
      recipeId: input.recipeId,
      family: "NEXO_EXECUTION",
      managementIntent: input.managementIntent ?? "Show execution progress from existing Execution authority",
      actors,
      analyticalBindings: input.analyticalBindings,
      evidenceRequirements: input.evidenceRequirements,
    }),
  );
}

export function defineNexoOutcomeRecipe(input: {
  readonly recipeId: string;
  readonly managementIntent?: string;
  readonly goal?: DthExpNexoFamilyParticipant | null;
  readonly expected?: DthExpNexoFamilyParticipant | null;
  readonly observed: DthExpNexoFamilyParticipant;
  readonly learning?: DthExpNexoFamilyParticipant | null;
  readonly analyticalBindings?: readonly DthExpNexoFamilyBindingInput[];
  readonly evidenceRequirements?: readonly DthExpRecipeEvidenceRequirement[];
}): DthExpNexoFamilyDefinition {
  const actors = [
    ...(input.goal
      ? [
          actor("goal", input.goal, {
            participation: "supporting",
            visualRole: "outcome-marker",
            grouping: "planned",
            attention: input.goal.attention ?? "contextual",
          }),
        ]
      : []),
    ...(input.expected
      ? [
          actor("expected", input.expected, {
            participation: "supporting",
            visualRole: "outcome-marker",
            grouping: "planned",
            attention: input.expected.attention ?? "contextual",
          }),
        ]
      : []),
    actor("observed", input.observed, {
      participation: "focal",
      visualRole: "outcome-marker",
      grouping: "current",
      attention: input.observed.attention ?? "focal",
    }),
    ...(input.learning
      ? [
          actor("learning", { ...input.learning, required: input.learning.required ?? false }, {
            participation: "optional",
            visualRole: "outcome-marker",
            grouping: "current",
            attention: input.learning.attention ?? "contextual",
          }),
        ]
      : []),
  ];
  return definition(
    "NEXO_OUTCOME",
    composeRecipe({
      recipeId: input.recipeId,
      family: "NEXO_OUTCOME",
      managementIntent: input.managementIntent ?? "Compare observed results with intended outcomes",
      actors,
      analyticalBindings: input.analyticalBindings,
      evidenceRequirements: input.evidenceRequirements,
    }),
  );
}
