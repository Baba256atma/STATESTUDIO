/**
 * NPA-T DTH-EXP:8A — Multi-Nexo composition eligibility contract.
 * Read-only plan. Not a Theatre Scene store, dashboard, or truth store.
 */

import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import type { DthExpDirectorManagementNeed } from "./dthExpDirectorNexoSelectionContract.ts";
import type { DthExpVisualRole } from "./dthExpVisualRole.ts";
import {
  DTH_EXP_MULTI_NEXO_COMPOSITION_ENGINE,
  dthExpMultiNexoCompositionIdentity,
  dthExpMultiNexoCompositionVersion,
} from "./dthExpMultiNexoCompositionIdentity.ts";

export const DTH_EXP_MULTI_NEXO_COMPATIBILITY_STATES = Object.freeze([
  "compatible",
  "conditionally-compatible",
  "incompatible",
  "insufficient-context",
] as const);
export type DthExpMultiNexoCompatibilityState = (typeof DTH_EXP_MULTI_NEXO_COMPATIBILITY_STATES)[number];

export const DTH_EXP_MULTI_NEXO_CONFLICT_CATEGORIES = Object.freeze([
  "primary-grammar-conflict",
  "unrelated-subject",
  "unsupported-context",
  "semantic-conflict",
  "authority-conflict",
  "density-conflict",
  "causal-safety-conflict",
  "stale-context",
] as const);
export type DthExpMultiNexoConflictCategory = (typeof DTH_EXP_MULTI_NEXO_CONFLICT_CATEGORIES)[number];

export const DTH_EXP_MULTI_NEXO_SUPPORT_REASONS = Object.freeze([
  "supports-focal-actor",
  "supports-focal-relationship",
  "supports-current-investigation",
  "supports-current-risk-context",
  "supports-current-variable-context",
  "supports-current-temporal-context",
  "supports-execution-state",
  "supports-outcome-interpretation",
] as const);
export type DthExpMultiNexoSupportReason = (typeof DTH_EXP_MULTI_NEXO_SUPPORT_REASONS)[number];

export const DTH_EXP_MULTI_NEXO_DISCLOSURE_STATES = Object.freeze([
  "visible",
  "contextual",
  "collapsed",
  "available-on-demand",
  "omitted",
] as const);
export type DthExpMultiNexoDisclosureState = (typeof DTH_EXP_MULTI_NEXO_DISCLOSURE_STATES)[number];

export const DTH_EXP_MULTI_NEXO_ATTENTION_HIERARCHY = Object.freeze([
  "canonical-subject",
  "primary-nexo-perspective",
  "primary-focal-actors-relationships",
  "supporting-nexo-meaning",
  "evidence-contextual-detail",
] as const);

export const DTH_EXP_PRIMARY_VISUAL_ROLE: Readonly<Record<DthExpNexoRecipeFamily, DthExpVisualRole>> = Object.freeze({
  NEXO_BUBBLE: "bubble",
  NEXO_BARS: "bar",
  NEXO_FLOW: "flow-node",
  NEXO_IMPACT: "impact-node",
  NEXO_RISK: "risk-marker",
  NEXO_TIME: "time-point",
  NEXO_CAUSE: "cause-node",
  NEXO_EXECUTION: "execution-marker",
  NEXO_OUTCOME: "outcome-marker",
});

export const DTH_EXP_SUPPORTING_VISUAL_ROLE: Readonly<Record<DthExpNexoRecipeFamily, string>> = Object.freeze({
  NEXO_BUBBLE: "bubble-context",
  NEXO_BARS: "bar-context",
  NEXO_FLOW: "flow-context",
  NEXO_IMPACT: "impact-context",
  NEXO_RISK: "risk-context",
  NEXO_TIME: "time-context",
  NEXO_CAUSE: "cause-context",
  NEXO_EXECUTION: "execution-context",
  NEXO_OUTCOME: "outcome-context",
});

export type DthExpMultiNexoAvailableSupport = Readonly<{
  family: DthExpNexoRecipeFamily;
  contextAvailable: boolean;
  attachedCanonicalObjectIds: readonly string[];
  stale?: boolean;
}>;

export type DthExpMultiNexoActorAnnotation = Readonly<{
  canonicalObjectId: string;
  theatreActorCount: 1;
  primaryVisualRole: DthExpVisualRole;
  supportingVisualRoles: readonly string[];
}>;

export type DthExpMultiNexoSupportEntry = Readonly<{
  family: DthExpNexoRecipeFamily;
  compatibility: DthExpMultiNexoCompatibilityState;
  eligible: boolean;
  reason: DthExpMultiNexoSupportReason | null;
  disclosure: DthExpMultiNexoDisclosureState;
  conflict: DthExpMultiNexoConflictCategory | null;
  attachedCanonicalObjectIds: readonly string[];
  primaryAuthority: false;
  rearrangesBaseScene: false;
}>;

export type DthExpMultiNexoCompositionInput = Readonly<{
  canonicalSubjectId: string;
  primaryFamily: DthExpNexoRecipeFamily;
  primarySelectionAuthority: "DTH-EXP:4A";
  managementNeed: DthExpDirectorManagementNeed;
  primaryReason: string;
  primaryActorIds: readonly string[];
  relationshipRefs: readonly Readonly<{ relationshipId: string; semanticRelation: string | null }>[];
  evidenceRefs: readonly string[];
  availableSupports: readonly DthExpMultiNexoAvailableSupport[];
  previousPrimaryFamily?: DthExpNexoRecipeFamily | null;
  previousEligibleSupports?: readonly DthExpNexoRecipeFamily[];
  bottleneckCanonicalObjectId?: string | null;
  unsafeRequestedSupports?: readonly DthExpNexoRecipeFamily[];
}>;

export type DthExpMultiNexoCompositionPlan = Readonly<{
  identity: typeof dthExpMultiNexoCompositionIdentity;
  version: typeof dthExpMultiNexoCompositionVersion;
  engine: typeof DTH_EXP_MULTI_NEXO_COMPOSITION_ENGINE;
  compositionId: string;
  canonicalSubjectId: string;
  primaryFamily: DthExpNexoRecipeFamily;
  primaryCount: 1;
  supportingFamilies: readonly DthExpNexoRecipeFamily[];
  supports: readonly DthExpMultiNexoSupportEntry[];
  actors: readonly DthExpMultiNexoActorAnnotation[];
  relationshipRefs: readonly string[];
  evidenceRefs: readonly string[];
  evidenceCopiedPerFamily: false;
  nexoEvidenceFamily: false;
  compatibilitySemanticNotDecorative: true;
  attentionHierarchy: typeof DTH_EXP_MULTI_NEXO_ATTENTION_HIERARCHY;
  primaryOwnsBaseSpatialGrammar: true;
  compositionCreatesCausality: false;
  fallbackToSinglePrimary: boolean;
  supportsReevaluatedForPrimaryChange: boolean;
  advisorSelectsSupportingNexo: false;
  parsesRawText: false;
  mergedLayoutImplemented: false;
  multiNexoRendering: false;
  liveStageWiring: false;
  reducedMotionComplete: true;
  writesCanonicalObjects: false;
  writesDecision: false;
  writesExecution: false;
  writesOutcome: false;
  assignsVaiRoles: false;
  calculatesRisk: false;
}>;
