/**
 * NPA-T DTH-EXP:8A — plan Multi-Nexo eligibility after primary 4A selection.
 * Does not merge layout, parse utterances, or select the primary family.
 */

import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import {
  DTH_EXP_MULTI_NEXO_ATTENTION_HIERARCHY,
  DTH_EXP_PRIMARY_VISUAL_ROLE,
  DTH_EXP_SUPPORTING_VISUAL_ROLE,
  type DthExpMultiNexoCompatibilityState,
  type DthExpMultiNexoCompositionInput,
  type DthExpMultiNexoCompositionPlan,
  type DthExpMultiNexoConflictCategory,
  type DthExpMultiNexoSupportEntry,
  type DthExpMultiNexoSupportReason,
} from "./dthExpMultiNexoCompositionContract.ts";
import {
  DTH_EXP_MULTI_NEXO_COMPOSITION_ENGINE,
  dthExpMultiNexoCompositionIdentity,
  dthExpMultiNexoCompositionVersion,
} from "./dthExpMultiNexoCompositionIdentity.ts";

const PAIR: Readonly<
  Partial<Record<DthExpNexoRecipeFamily, Partial<Record<DthExpNexoRecipeFamily, DthExpMultiNexoCompatibilityState>>>>
> = Object.freeze({
  NEXO_FLOW: Object.freeze({
    NEXO_RISK: "compatible",
    NEXO_IMPACT: "conditionally-compatible",
    NEXO_TIME: "compatible",
  }),
  NEXO_CAUSE: Object.freeze({
    NEXO_IMPACT: "conditionally-compatible",
    NEXO_RISK: "compatible",
    NEXO_TIME: "compatible",
  }),
  NEXO_EXECUTION: Object.freeze({ NEXO_TIME: "compatible" }),
  NEXO_OUTCOME: Object.freeze({ NEXO_TIME: "compatible" }),
  NEXO_BUBBLE: Object.freeze({ NEXO_RISK: "compatible" }),
  NEXO_BARS: Object.freeze({ NEXO_TIME: "compatible" }),
  NEXO_IMPACT: Object.freeze({ NEXO_RISK: "conditionally-compatible", NEXO_TIME: "compatible" }),
  NEXO_RISK: Object.freeze({ NEXO_TIME: "compatible" }),
  NEXO_TIME: Object.freeze({}),
});

const REASON: Readonly<Partial<Record<DthExpNexoRecipeFamily, DthExpMultiNexoSupportReason>>> = Object.freeze({
  NEXO_RISK: "supports-current-risk-context",
  NEXO_IMPACT: "supports-current-variable-context",
  NEXO_TIME: "supports-current-temporal-context",
  NEXO_EXECUTION: "supports-execution-state",
  NEXO_OUTCOME: "supports-outcome-interpretation",
  NEXO_CAUSE: "supports-current-investigation",
  NEXO_FLOW: "supports-focal-actor",
  NEXO_BARS: "supports-focal-actor",
  NEXO_BUBBLE: "supports-focal-actor",
});

function sortFamilies(families: readonly DthExpNexoRecipeFamily[]): readonly DthExpNexoRecipeFamily[] {
  return Object.freeze([...families].sort((left, right) => left.localeCompare(right)));
}

function sharesContext(input: DthExpMultiNexoCompositionInput, attached: readonly string[]): boolean {
  const allowed = new Set([input.canonicalSubjectId, ...input.primaryActorIds, input.bottleneckCanonicalObjectId ?? ""]);
  return attached.some((id) => allowed.has(id));
}

function evaluate(input: DthExpMultiNexoCompositionInput, family: DthExpNexoRecipeFamily, attached: readonly string[], contextAvailable: boolean, stale: boolean): DthExpMultiNexoSupportEntry {
  const pair = PAIR[input.primaryFamily]?.[family] ?? null;
  let compatibility: DthExpMultiNexoCompatibilityState = pair ?? "incompatible";
  let conflict: DthExpMultiNexoConflictCategory | null = pair == null ? "primary-grammar-conflict" : null;
  if (family === input.primaryFamily) {
    compatibility = "incompatible";
    conflict = "semantic-conflict";
  } else if (stale) {
    compatibility = "incompatible";
    conflict = "stale-context";
  } else if (!contextAvailable) {
    compatibility = "insufficient-context";
    conflict = "authority-conflict";
  } else if (pair != null && !sharesContext(input, attached)) {
    compatibility = "incompatible";
    conflict = "unrelated-subject";
  } else if (
    input.previousPrimaryFamily === input.primaryFamily &&
    input.bottleneckCanonicalObjectId != null &&
    !attached.includes(input.bottleneckCanonicalObjectId) &&
    !attached.includes(input.canonicalSubjectId)
  ) {
    compatibility = "incompatible";
    conflict = "unrelated-subject";
  }
  const eligible =
    conflict == null &&
    (compatibility === "compatible" || compatibility === "conditionally-compatible") &&
    contextAvailable &&
    !stale &&
    sharesContext(input, attached);
  const disclosure: DthExpMultiNexoSupportEntry["disclosure"] = eligible
    ? compatibility === "conditionally-compatible"
      ? "available-on-demand"
      : "contextual"
    : "omitted";
  const reason = eligible ? (REASON[family] ?? "supports-focal-actor") : null;
  return Object.freeze({
    family,
    compatibility,
    eligible,
    reason,
    disclosure,
    conflict,
    attachedCanonicalObjectIds: Object.freeze([...attached].sort((left, right) => left.localeCompare(right))),
    primaryAuthority: false as const,
    rearrangesBaseScene: false as const,
  });
}

export function planDthExpMultiNexoComposition(input: DthExpMultiNexoCompositionInput): DthExpMultiNexoCompositionPlan {
  const requestedUnsafe = new Set(input.unsafeRequestedSupports ?? []);
  const supports = sortFamilies(input.availableSupports.map((item) => item.family)).map((family) => {
    const available = input.availableSupports.find((item) => item.family === family)!;
    if (requestedUnsafe.has(family)) {
      return Object.freeze({
        family,
        compatibility: "incompatible" as const,
        eligible: false,
        reason: null,
        disclosure: "omitted" as const,
        conflict: "causal-safety-conflict" as const,
        attachedCanonicalObjectIds: Object.freeze([...available.attachedCanonicalObjectIds]),
        primaryAuthority: false as const,
        rearrangesBaseScene: false as const,
      });
    }
    return evaluate(input, family, available.attachedCanonicalObjectIds, available.contextAvailable, available.stale === true);
  });
  const eligible = requestedUnsafe.size > 0 ? [] : supports.filter((item) => item.eligible).map((item) => item.family);
  const fallbackToSinglePrimary = eligible.length === 0;
  const primaryRole = DTH_EXP_PRIMARY_VISUAL_ROLE[input.primaryFamily];
  const sortedActors = Object.freeze([...new Set([input.canonicalSubjectId, ...input.primaryActorIds])].sort((left, right) => left.localeCompare(right)));
  const actors = sortedActors.map((id) => {
    const supportingVisualRoles = Object.freeze(
      supports
        .filter((item) => eligible.includes(item.family) && item.attachedCanonicalObjectIds.includes(id))
        .map((item) => DTH_EXP_SUPPORTING_VISUAL_ROLE[item.family]),
    );
    return Object.freeze({
      canonicalObjectId: id,
      theatreActorCount: 1 as const,
      primaryVisualRole: primaryRole,
      supportingVisualRoles,
    });
  });
  const primaryChanged =
    input.previousPrimaryFamily != null && input.previousPrimaryFamily !== input.primaryFamily;

  return Object.freeze({
    identity: dthExpMultiNexoCompositionIdentity,
    version: dthExpMultiNexoCompositionVersion,
    engine: DTH_EXP_MULTI_NEXO_COMPOSITION_ENGINE,
    compositionId: `dth-exp:8a:${input.canonicalSubjectId}:${input.primaryFamily}:${eligible.join("+") || "primary-only"}`,
    canonicalSubjectId: input.canonicalSubjectId,
    primaryFamily: input.primaryFamily,
    primaryCount: 1 as const,
    supportingFamilies: Object.freeze(eligible),
    supports: Object.freeze(supports),
    actors: Object.freeze(actors),
    relationshipRefs: Object.freeze([...input.relationshipRefs.map((item) => item.relationshipId)].sort((left, right) => left.localeCompare(right))),
    evidenceRefs: Object.freeze([...input.evidenceRefs].sort((left, right) => left.localeCompare(right))),
    evidenceCopiedPerFamily: false,
    nexoEvidenceFamily: false,
    compatibilitySemanticNotDecorative: true,
    attentionHierarchy: DTH_EXP_MULTI_NEXO_ATTENTION_HIERARCHY,
    primaryOwnsBaseSpatialGrammar: true,
    compositionCreatesCausality: false,
    fallbackToSinglePrimary: fallbackToSinglePrimary || requestedUnsafe.size > 0,
    supportsReevaluatedForPrimaryChange: primaryChanged,
    advisorSelectsSupportingNexo: false,
    parsesRawText: false,
    mergedLayoutImplemented: false,
    multiNexoRendering: false,
    liveStageWiring: false,
    reducedMotionComplete: true,
    writesCanonicalObjects: false,
    writesDecision: false,
    writesExecution: false,
    writesOutcome: false,
    assignsVaiRoles: false,
    calculatesRisk: false,
  });
}
