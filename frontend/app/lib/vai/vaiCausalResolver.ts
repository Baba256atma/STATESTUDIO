/**
 * NPA-T VAI:3 — read-only evidence ladder and causal-safety resolver.
 * Consumes CC:8 evidence refs and CORE-INT:3 implication gate. Does not write truth.
 */

import { recordedRelationshipImpliesCause } from "@/app/lib/executive-intelligence/nexoraGroundedCausalConstraintIntelligence.ts";
import type { VaiSemanticStatus, VaiVariable } from "./vaiContract.ts";
import type { VaiObjectVariableRoleItem } from "./vaiObjectRoleContract.ts";
import { vaiCausalSafetyIdentity } from "./vaiCausalIdentity.ts";
import {
  VAI_CAUSAL_SAFETY_BOUNDARY,
  type VaiAnalyticalRelationship,
  type VaiAssociationStatus,
  type VaiCausalStatus,
  type VaiCoreInt3CausalGate,
  type VaiDirectionStatus,
  type VaiManagerCausalAssertion,
  type VaiRelationshipEvidenceRef,
  type VaiRelationshipLadder,
  type VaiRelationshipScope,
  type VaiSafeStatementClass,
} from "./vaiCausalContract.ts";

export type VaiCausalSafetyInput = {
  readonly relationshipId: string;
  readonly analysisContextId: string;
  readonly source: VaiVariable;
  readonly target: { readonly kind: "VARIABLE" | "OBJECT"; readonly id: string; readonly variable?: VaiVariable };
  readonly evidence: readonly VaiRelationshipEvidenceRef[];
  readonly scope: VaiRelationshipScope;
  readonly managerAssertion?: VaiManagerCausalAssertion | null;
  readonly coreInt3?: VaiCoreInt3CausalGate | null;
  readonly causalHypothesis?: boolean;
  readonly vai2?: {
    readonly sourceRole?: VaiObjectVariableRoleItem | null;
    readonly confounders?: readonly VaiObjectVariableRoleItem[];
    readonly moderators?: readonly VaiObjectVariableRoleItem[];
    readonly pathOfEffect?: readonly VaiObjectVariableRoleItem[];
  };
};

export type VaiCausalSafetyResult = {
  readonly identity: typeof vaiCausalSafetyIdentity;
  readonly relationship: VaiAnalyticalRelationship;
  readonly canonicalMutation: false;
  readonly causalAssertion: false;
};

export function relationshipAppliesToScope(
  relationship: VaiAnalyticalRelationship,
  scope: VaiRelationshipScope,
): boolean {
  return (
    matches(relationship.scope.businessContext, scope.businessContext) &&
    matches(relationship.scope.timeContext, scope.timeContext) &&
    matches(relationship.scope.sourceScope, scope.sourceScope) &&
    matches(relationship.scope.objectScope, scope.objectScope)
  );
}

export function resolveVaiCausalSafety(input: VaiCausalSafetyInput): VaiCausalSafetyResult {
  if (!input.relationshipId.trim() || !input.analysisContextId.trim()) {
    throw new Error("VAI:3 relationshipId and analysisContextId are required");
  }
  const semanticBlocked = semanticsBlockClaims(input.source) || semanticsBlockClaims(input.target.variable ?? null);
  const semanticCertainty: VaiSemanticStatus | "NOT_APPLICABLE" = input.source.semanticStatus;
  const confounders = (input.vai2?.confounders ?? []).filter((item) => item.primaryRole === "CONFOUNDER" || item.candidateRoles.some((role) => role.role === "CONFOUNDER"));
  const unresolvedConfounders = Object.freeze(confounders.map((item) => item.displayName || item.variableId));
  const moderators = Object.freeze((input.vai2?.moderators ?? []).map((item) => item.displayName || item.variableId));
  const pathItems = input.vai2?.pathOfEffect ?? [];
  const leverIdentified = input.vai2?.sourceRole?.primaryRole === "LEVER" || (input.vai2?.sourceRole?.candidateRoles.some((role) => role.role === "LEVER") ?? false);
  const supporting = input.evidence.filter((item) => item.polarity !== "CONFLICTING");
  const conflicting = input.evidence.some((item) => item.kind === "CONTRADICTION" || item.polarity === "CONFLICTING");
  const coObs = supporting.filter((item) => item.kind === "CO_OBSERVATION");
  const associations = supporting.filter((item) => item.kind === "ASSOCIATION");
  const directional = supporting.filter((item) => item.kind === "DIRECTIONAL");
  const temporal = supporting.filter((item) => item.kind === "TEMPORAL");
  const scenarios = supporting.filter((item) => item.kind === "SCENARIO_ASSUMPTION");
  const coreInt3Supported = recordedRelationshipImpliesCause(
    input.coreInt3?.relationKind ?? "",
    input.coreInt3?.causeEstablished === true,
  );
  const evidenceSupportedCausal = canEmitEvidenceSupportedCausal({
    coreInt3Supported,
    semanticBlocked,
    unresolvedConfounders: unresolvedConfounders.length > 0,
    conflicting,
  });

  const associationStatus = associationFrom(semanticBlocked, conflicting, coObs.length, associations.length, directional.length);
  const directionStatus = directionFrom(temporal.length, directional.length);
  const temporalRelevance = temporal.length > 0;
  const ladder = ladderFrom({
    semanticBlocked,
    evidenceCount: input.evidence.length,
    coObs: coObs.length,
    associations: associations.length,
    directional: directional.length,
    conflicting,
    managerAssertion: Boolean(input.managerAssertion),
    causalHypothesis: input.causalHypothesis === true,
    evidenceSupportedCausal,
  });
  const causalStatus = causalFrom({
    evidenceSupportedCausal,
    unresolvedConfounders: unresolvedConfounders.length > 0,
    managerAssertion: Boolean(input.managerAssertion),
    causalHypothesis: input.causalHypothesis === true,
  });
  const safe = safeStatement(ladder, Boolean(input.managerAssertion), conflicting, associationStatus);
  const reasonCodes = Object.freeze([
    semanticBlocked ? "SEMANTIC_UNRESOLVED" : "SEMANTIC_OK",
    conflicting ? "CONFLICTING_EVIDENCE" : null,
    unresolvedConfounders.length ? "CONFOUNDER_UNBOUNDED" : null,
    temporalRelevance ? "TEMPORAL_RELEVANCE_NOT_CAUSE" : null,
    leverIdentified ? "LEVER_NOT_INTERVENTION_EFFECT" : null,
    pathItems.length ? "PATH_CANDIDATE_NOT_MEDIATOR" : null,
    moderators.length ? "MODERATOR_NOT_PROVEN_EFFECT" : null,
    scenarios.length ? "SCENARIO_ASSUMPTION_NOT_CAUSE" : null,
    evidenceSupportedCausal ? "CORE_INT3_CAUSAL_GATE" : "EVIDENCE_SUPPORTED_CAUSAL_NOT_MET",
    "CORRELATION_NOT_CAUSE",
    "CONTEXT_SCOPED",
    "CAUSAL_ASSERTION_FALSE",
  ].filter((code): code is string => Boolean(code)));

  const relationship: VaiAnalyticalRelationship = Object.freeze({
    identity: vaiCausalSafetyIdentity,
    relationshipId: input.relationshipId,
    analysisContextId: input.analysisContextId,
    sourceVariableId: input.source.variableId,
    targetRef: input.target.id,
    targetKind: input.target.kind,
    relationshipStatus: ladder,
    associationStatus,
    directionStatus,
    causalStatus,
    confidence: evidenceSupportedCausal ? "HIGH" : conflicting || semanticBlocked ? "LOW" : associationStatus === "STRONG" || associationStatus === "SUPPORTED" ? "MEDIUM" : "UNKNOWN",
    evidenceRefs: Object.freeze(input.evidence.map((item) => item.evidenceRef)),
    provenance: Object.freeze([
      ...input.evidence.map((item) => `CC:8::${item.evidenceRef}`),
      ...(input.managerAssertion ? [`manager::${input.managerAssertion.sourceRef}`] : []),
      ...(coreInt3Supported ? ["CORE-INT:3"] : []),
    ]),
    managerAssertion: input.managerAssertion ? Object.freeze({ ...input.managerAssertion }) : null,
    evidenceSupportedCausal,
    alternativeExplanations: unresolvedConfounders,
    unresolvedConfounders,
    moderatorsConsidered: moderators,
    moderationProven: false,
    pathOfEffectCandidate: pathItems.length > 0,
    mediationEstablished: false,
    leverIdentified,
    interventionEffectivenessClaimed: false,
    temporalRelevance,
    semanticCertainty,
    conflictingEvidence: conflicting,
    scope: Object.freeze({ ...input.scope }),
    safeStatementClass: safe.class,
    safeStatement: safe.text,
    reasonCodes,
    causalAssertion: false,
  });

  return Object.freeze({
    identity: vaiCausalSafetyIdentity,
    relationship,
    canonicalMutation: false,
    causalAssertion: false,
  });
}

export function verifyVaiCausalSafety(): { readonly ok: true } {
  if (VAI_CAUSAL_SAFETY_BOUNDARY.correlationEqualsCausation) throw new Error("VAI:3 correlation must not equal causation");
  if (VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore) throw new Error("VAI:3 must not create a causal truth store");
  if (VAI_CAUSAL_SAFETY_BOUNDARY.startsVai4) throw new Error("VAI:3 must not start VAI:4");
  return Object.freeze({ ok: true as const });
}

function canEmitEvidenceSupportedCausal(input: {
  readonly coreInt3Supported: boolean;
  readonly semanticBlocked: boolean;
  readonly unresolvedConfounders: boolean;
  readonly conflicting: boolean;
}): boolean {
  return input.coreInt3Supported && !input.semanticBlocked && !input.unresolvedConfounders && !input.conflicting;
}

function semanticsBlockClaims(variable: VaiVariable | null): boolean {
  if (!variable) return false;
  return variable.semanticStatus === "AMBIGUOUS" || variable.semanticStatus === "UNKNOWN";
}

function associationFrom(
  semanticBlocked: boolean,
  conflicting: boolean,
  coObs: number,
  associations: number,
  directional: number,
): VaiAssociationStatus {
  if (semanticBlocked) return "NONE";
  if (conflicting) return "CONFLICTING";
  if (associations >= 3 || directional >= 3) return "STRONG";
  if (associations >= 1 || directional >= 1) return "SUPPORTED";
  if (coObs >= 1) return "WEAK";
  return "NONE";
}

function directionFrom(temporal: number, directional: number): VaiDirectionStatus {
  if (directional >= 1) return "DIRECTIONAL";
  if (temporal >= 1) return "TEMPORAL_CONSISTENT";
  return "NONE";
}

function ladderFrom(input: {
  readonly semanticBlocked: boolean;
  readonly evidenceCount: number;
  readonly coObs: number;
  readonly associations: number;
  readonly directional: number;
  readonly conflicting: boolean;
  readonly managerAssertion: boolean;
  readonly causalHypothesis: boolean;
  readonly evidenceSupportedCausal: boolean;
}): VaiRelationshipLadder {
  if (input.evidenceSupportedCausal) return "EVIDENCE_SUPPORTED_CAUSAL";
  if (input.semanticBlocked && input.evidenceCount > 0) return "INSUFFICIENT";
  if (input.evidenceCount === 0 && !input.managerAssertion) return "INSUFFICIENT";
  if (input.managerAssertion) return "MANAGER_ASSERTED_CAUSE";
  if (input.causalHypothesis) return "CAUSAL_HYPOTHESIS";
  if (input.directional >= 1) return "DIRECTIONALLY_ASSOCIATED";
  if (input.associations >= 1) return "ASSOCIATED";
  if (input.coObs >= 1) return "OBSERVED_TOGETHER";
  return "INSUFFICIENT";
}

function causalFrom(input: {
  readonly evidenceSupportedCausal: boolean;
  readonly unresolvedConfounders: boolean;
  readonly managerAssertion: boolean;
  readonly causalHypothesis: boolean;
}): VaiCausalStatus {
  if (input.evidenceSupportedCausal) return "EVIDENCE_SUPPORTED";
  if (input.unresolvedConfounders) return "BOUNDED_UNRESOLVED";
  if (input.managerAssertion) return "MANAGER_ASSERTED";
  if (input.causalHypothesis) return "HYPOTHESIS";
  return "UNCONFIRMED";
}

function safeStatement(
  ladder: VaiRelationshipLadder,
  manager: boolean,
  conflicting: boolean,
  association: VaiAssociationStatus,
): { readonly class: VaiSafeStatementClass; readonly text: string } {
  if (conflicting) {
    return {
      class: "CONFLICTING",
      text: "Trusted evidence supports conflicting relationship patterns. No single relationship conclusion is selected.",
    };
  }
  if (ladder === "INSUFFICIENT") {
    return {
      class: "INSUFFICIENT",
      text: "Current evidence is not sufficient to determine whether these variables are related.",
    };
  }
  if (manager) {
    return {
      class: "MANAGER_ASSERTION",
      text: "The manager identifies a cause; current evidence has not independently confirmed that conclusion.",
    };
  }
  if (ladder === "CAUSAL_HYPOTHESIS") {
    return {
      class: "HYPOTHESIS",
      text: "A causal explanation remains a hypothesis. Available evidence has not confirmed causation.",
    };
  }
  if (ladder === "ASSOCIATED" || ladder === "DIRECTIONALLY_ASSOCIATED" || association === "SUPPORTED" || association === "STRONG") {
    return {
      class: "ASSOCIATION",
      text: "The variables appear associated in the available observations. This is not a causal conclusion.",
    };
  }
  return {
    class: "OBSERVATION",
    text: "The variables were observed together in the bounded period. This establishes no directional or causal relationship.",
  };
}

function matches(actual: string | undefined, requested: string | undefined): boolean {
  if (requested == null || requested === "") return true;
  return actual === requested;
}
