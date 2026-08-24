/**
 * CORE-INT:3 — Grounded Causal & Constraint Intelligence.
 *
 * Evidence-bounded interpretation over recorded relationships.
 * Reuses CORE-INT:2 / EI:3 claims. Does not infer causation, rank
 * contributors, designate binding constraints, or invent relief.
 */

import type { NexoraExecutiveEvidenceReference } from "../conversational-control/executiveRecommendation.ts";
import {
  createExecutiveClaim,
  type ExecutiveClaim,
  type SemanticConfidence,
} from "./problemRiskOpportunityIntelligence.ts";
import {
  classifyRecordedRelationInterpretation,
  mapSemanticConfidenceToPresentation,
  type SharedEpistemicEvidenceStatus,
  type SharedEpistemicRelationshipSource,
} from "./nexoraSharedEpistemicFoundation.ts";

export const nexoraGroundedCausalConstraintIntelligenceIdentity =
  "CORE-INT:3/GroundedCausalConstraintIntelligence" as const;
export const nexoraGroundedCausalConstraintIntelligenceVersion = "1.0.0" as const;

export const GROUNDED_CAUSAL_CONSTRAINT_BOUNDARY = Object.freeze({
  role: "evidence-bounded-causal-constraint-interpretation" as const,
  epistemicAuthority: "CORE-INT:2/SharedEpistemicUncertaintyFoundation" as const,
  relationshipAuthority: "EI:3/EvidenceBoundedRelationship" as const,
  infersCausality: false as const,
  infersTransitiveCausality: false as const,
  autoPrimaryContributor: false as const,
  autoRootCause: false as const,
  autoBindingConstraint: false as const,
  ranksContributors: false as const,
  inventsRelief: false as const,
  inventsPriority: false as const,
  wiresEi4: false as const,
  startsExi4: false as const,
  usesLlm: false as const,
  writesMemory: false as const,
  mutatesStage: false as const,
  mutatesDecision: false as const,
  isExiWriter: false as const,
});

export type CausalRelationSemantics =
  | "related"
  | "associated"
  | "dependency"
  | "contributor"
  | "causal"
  | "unknown";

export type ConstraintQualification = "recorded-limit" | "recorded-blocker";

export type CausalContributor = Readonly<{
  readonly contributorId: string;
  readonly subjectId: string | null;
  readonly label: string;
  readonly relationKind: string;
  readonly semantics: CausalRelationSemantics;
  readonly existenceClaim: ExecutiveClaim;
  readonly interpretationClaim: ExecutiveClaim;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
  readonly evidenceStatus: SharedEpistemicEvidenceStatus;
  readonly confidence: SemanticConfidence;
}>;

export type CausalChainEdge = Readonly<{
  readonly fromLabel: string;
  readonly toLabel: string;
  readonly relationKind: string;
  readonly semantics: CausalRelationSemantics;
  readonly claimId: string;
  readonly confidence: SemanticConfidence;
}>;

export type CausalAssessment = Readonly<{
  readonly identity: typeof nexoraGroundedCausalConstraintIntelligenceIdentity;
  readonly subjectId: string | null;
  readonly subjectLabel: string | null;
  readonly subjectKind: string | null;
  readonly contributors: readonly CausalContributor[];
  readonly relatedFactors: readonly CausalContributor[];
  readonly primaryContributor: CausalContributor | null;
  readonly rootCause: CausalContributor | null;
  readonly ranked: false;
  readonly causalConfidence: SemanticConfidence;
  readonly evidenceStatus: SharedEpistemicEvidenceStatus;
  readonly missingEvidence: string | null;
  readonly chain: readonly CausalChainEdge[];
  readonly writesMemory: false;
  readonly mutatesStage: false;
  readonly mutatesDecision: false;
}>;

export type ConstraintEvidence = Readonly<{
  readonly constraintId: string;
  readonly subjectId: string | null;
  readonly label: string;
  readonly relationKind: "constrained-by" | "blocks";
  readonly qualification: ConstraintQualification;
  readonly existenceClaim: ExecutiveClaim;
  readonly interpretationClaim: ExecutiveClaim;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
  readonly evidenceStatus: SharedEpistemicEvidenceStatus;
  readonly confidence: SemanticConfidence;
  readonly relief: null;
}>;

export type ConstraintAssessment = Readonly<{
  readonly identity: typeof nexoraGroundedCausalConstraintIntelligenceIdentity;
  readonly subjectId: string | null;
  readonly subjectLabel: string | null;
  readonly subjectKind: string | null;
  readonly constraints: readonly ConstraintEvidence[];
  readonly bindingConstraint: ConstraintEvidence | null;
  readonly unresolvedConstraints: readonly ConstraintEvidence[];
  readonly evidenceStatus: SharedEpistemicEvidenceStatus;
  readonly confidence: SemanticConfidence;
  readonly missingEvidence: string | null;
  readonly writesMemory: false;
  readonly mutatesStage: false;
  readonly mutatesDecision: false;
}>;

export type GroundedCausalConstraintIntelligence = Readonly<{
  readonly causal: CausalAssessment;
  readonly constraint: ConstraintAssessment;
}>;

const CONSTRAINT_KINDS = new Set(["constrained-by", "blocks"]);
const CONTRIBUTOR_KINDS = new Set(["constrained-by", "affected-by", "affects", "blocks"]);
const DEPENDENCY_KINDS = new Set(["depends-on"]);
const ASSOCIATED_KINDS = new Set(["associated-with", "influences"]);
const RELATED_KINDS = new Set(["related", "related-to"]);
const WORKFLOW_KINDS = new Set(["explored-by", "acts-on", "implements", "sources"]);

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
    Object.freeze(value);
  }
  return value;
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}

function safeClaim(input: {
  readonly claimId: string;
  readonly type: ExecutiveClaim["type"];
  readonly statement: string;
  readonly evidenceRefs?: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs?: readonly string[];
}): ExecutiveClaim {
  try {
    return createExecutiveClaim(input);
  } catch {
    return createExecutiveClaim({
      claimId: `${input.claimId}:unknown`,
      type: "UNKNOWN",
      statement: input.statement,
    });
  }
}

export function classifyCausalRelationSemantics(
  relationKind: string,
): CausalRelationSemantics {
  if (relationKind === "supported-causal") return "causal";
  if (CONTRIBUTOR_KINDS.has(relationKind)) return "contributor";
  if (DEPENDENCY_KINDS.has(relationKind)) return "dependency";
  if (ASSOCIATED_KINDS.has(relationKind)) return "associated";
  if (RELATED_KINDS.has(relationKind)) return "related";
  if (WORKFLOW_KINDS.has(relationKind)) return "unknown";
  return "unknown";
}

export function isConstraintRelationKind(relationKind: string): boolean {
  return CONSTRAINT_KINDS.has(relationKind);
}

export function isInboundContributorRelation(relationKind: string): boolean {
  return relationKind === "constrained-by" || relationKind === "affected-by";
}

export function isOutgoingConsequenceRelation(
  relationKind: string,
  direction?: SharedEpistemicRelationshipSource["direction"],
): boolean {
  if (relationKind === "blocks" && direction === "inbound") return false;
  return relationKind === "blocks" || relationKind === "affects";
}

export function recordedRelationshipImpliesCause(
  relationKind: string,
  causeEstablished = false,
): boolean {
  return relationKind === "supported-causal" && causeEstablished === true;
}

function relationshipEvidence(
  source: SharedEpistemicRelationshipSource,
  subjectId: string,
): {
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
} {
  const evidenceRefs = Object.freeze([
    {
      sourceKind: "relationship" as const,
      sourceId: source.relationshipId,
      subjectId,
      factKey: source.relationKind,
    },
  ]);
  return {
    evidenceRefs,
    provenanceRefs: unique([
      `recorded-relationship:${source.relationshipId}:${source.relationKind}`,
    ]),
  };
}

function makeContributor(
  source: SharedEpistemicRelationshipSource,
  subjectId: string,
  subjectLabel: string,
): CausalContributor {
  const semantics = classifyCausalRelationSemantics(source.relationKind);
  const support = relationshipEvidence(source, subjectId);
  const existence = safeClaim({
    claimId: `core-int3:rel-exists:${subjectId}:${source.relationshipId}`,
    type: "FACT",
    statement: `A ${source.relationKind} relationship with ${source.otherLabel} is recorded.`,
    evidenceRefs: support.evidenceRefs,
    provenanceRefs: support.provenanceRefs,
  });
  const interpretationType = classifyRecordedRelationInterpretation(source.relationKind);
  const interpretation = safeClaim({
    claimId: `core-int3:interpretation:${subjectId}:${source.relationshipId}`,
    type: interpretationType,
    statement:
      semantics === "contributor"
        ? `${source.otherLabel} is a possible contributor to ${subjectLabel}. That is a recorded hypothesis, not proven causation.`
        : semantics === "dependency"
          ? `${subjectLabel} depends on ${source.otherLabel}. That is a recorded dependency, not a proven cause.`
          : `${source.otherLabel} is related to ${subjectLabel}, but the available evidence does not establish causation.`,
    evidenceRefs: interpretationType === "UNKNOWN" ? [] : support.evidenceRefs,
    provenanceRefs: interpretationType === "UNKNOWN" ? [] : support.provenanceRefs,
  });
  return deepFreeze({
    contributorId: source.relationshipId,
    subjectId: source.otherId,
    label: source.otherLabel,
    relationKind: source.relationKind,
    semantics,
    existenceClaim: existence,
    interpretationClaim: interpretation,
    evidenceRefs: support.evidenceRefs,
    provenanceRefs: support.provenanceRefs,
    evidenceStatus: "present" as const,
    confidence: interpretation.confidence,
  });
}

function makeConstraint(
  source: SharedEpistemicRelationshipSource,
  subjectId: string,
  subjectLabel: string,
): ConstraintEvidence | null {
  if (source.relationKind === "constrained-by") {
    return constraintFromSource(source, subjectId, subjectLabel, "recorded-limit");
  }
  if (source.relationKind === "blocks" && source.direction === "inbound") {
    return constraintFromSource(source, subjectId, subjectLabel, "recorded-blocker");
  }
  return null;
}

function constraintFromSource(
  source: SharedEpistemicRelationshipSource,
  subjectId: string,
  subjectLabel: string,
  qualification: ConstraintQualification,
): ConstraintEvidence {
  const support = relationshipEvidence(source, subjectId);
  const relationKind = qualification === "recorded-blocker" ? "blocks" : "constrained-by";
  const existence = safeClaim({
    claimId: `core-int3:constraint-exists:${subjectId}:${source.relationshipId}`,
    type: "FACT",
    statement:
      qualification === "recorded-blocker"
        ? `${source.otherLabel} is recorded as blocking ${subjectLabel}.`
        : `${source.otherLabel} is recorded as a constraint on ${subjectLabel}.`,
    evidenceRefs: support.evidenceRefs,
    provenanceRefs: support.provenanceRefs,
  });
  const interpretation = safeClaim({
    claimId: `core-int3:constraint-interp:${subjectId}:${source.relationshipId}`,
    type: "ASSUMPTION",
    statement:
      qualification === "recorded-blocker"
        ? `${source.otherLabel} is a recorded blocker of ${subjectLabel}. That is stronger recorded-limit wording only because the recorded relation is blocks, not because Nexora ranked it as binding.`
        : `${source.otherLabel} may be limiting ${subjectLabel}. That is a recorded constraint, not a binding determination.`,
    evidenceRefs: support.evidenceRefs,
    provenanceRefs: support.provenanceRefs,
  });
  return deepFreeze({
    constraintId: source.relationshipId,
    subjectId: source.otherId,
    label: source.otherLabel,
    relationKind,
    qualification,
    existenceClaim: existence,
    interpretationClaim: interpretation,
    evidenceRefs: support.evidenceRefs,
    provenanceRefs: support.provenanceRefs,
    evidenceStatus: "present" as const,
    confidence: interpretation.confidence,
    relief: null,
  });
}

function lowestConfidence(
  values: readonly SemanticConfidence[],
): SemanticConfidence {
  if (values.includes("unknown")) return "unknown";
  if (values.includes("low")) return "low";
  if (values.includes("medium")) return "medium";
  if (values.includes("high") && values.length > 0) return "high";
  return "unknown";
}

export function projectGroundedCausalConstraintIntelligence(input: {
  readonly subjectId: string | null;
  readonly subjectLabel: string | null;
  readonly subjectKind: string | null;
  readonly isOverview: boolean;
  readonly relationships: readonly SharedEpistemicRelationshipSource[];
  readonly explicitPrimaryContributorId?: string | null;
  readonly explicitRootCauseId?: string | null;
  readonly explicitBindingConstraintId?: string | null;
  readonly causeEstablishedIds?: readonly string[];
  readonly conflictingEvidence?: boolean;
}): GroundedCausalConstraintIntelligence {
  const subjectId = input.isOverview ? null : input.subjectId;
  const subjectLabel = input.isOverview ? null : input.subjectLabel;
  const subjectKind = input.isOverview ? null : input.subjectKind;
  const conflicting = input.conflictingEvidence === true;

  if (subjectId == null || subjectLabel == null) {
    return deepFreeze({
      causal: emptyCausal(null, null, null, "No subject is in focus."),
      constraint: emptyConstraint(null, null, null, "No subject is in focus."),
    });
  }

  const seen = new Set<string>();
  const uniqueRels = input.relationships.filter((rel) => {
    const key = `${rel.otherLabel}:${rel.relationKind}:${rel.direction ?? "undirected"}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const inbound = uniqueRels.filter((rel) =>
    isInboundContributorRelation(rel.relationKind),
  );
  const dependencies = uniqueRels.filter((rel) =>
    DEPENDENCY_KINDS.has(rel.relationKind),
  );
  const related = uniqueRels.filter(
    (rel) =>
      ASSOCIATED_KINDS.has(rel.relationKind) ||
      RELATED_KINDS.has(rel.relationKind) ||
      rel.relationKind === "unknown",
  );
  const outgoing = uniqueRels.filter((rel) =>
    isOutgoingConsequenceRelation(rel.relationKind, rel.direction),
  );

  const contributors = inbound.map((rel) =>
    makeContributor(rel, subjectId, subjectLabel),
  );
  const relatedFactors = [...dependencies, ...related].map((rel) =>
    makeContributor(rel, subjectId, subjectLabel),
  );

  const established = new Set(input.causeEstablishedIds ?? []);
  const allowDistinguished = !conflicting;
  const primary =
    allowDistinguished && input.explicitPrimaryContributorId != null
      ? contributors.find(
          (entry) => entry.contributorId === input.explicitPrimaryContributorId,
        ) ?? null
      : null;
  const rootCause =
    allowDistinguished &&
    input.explicitRootCauseId != null &&
    established.has(input.explicitRootCauseId)
      ? contributors.find((entry) => entry.contributorId === input.explicitRootCauseId) ??
        null
      : null;

  const chain: CausalChainEdge[] = [];
  for (const edge of inbound) {
    const contributor = contributors.find((entry) => entry.contributorId === edge.relationshipId);
    chain.push({
      fromLabel: edge.otherLabel,
      toLabel: subjectLabel,
      relationKind: edge.relationKind,
      semantics: classifyCausalRelationSemantics(edge.relationKind),
      claimId: contributor?.interpretationClaim.claimId ?? `core-int3:interpretation:${subjectId}:${edge.relationshipId}`,
      confidence: contributor?.confidence ?? "medium",
    });
  }
  for (const edge of outgoing) {
    chain.push({
      fromLabel: subjectLabel,
      toLabel: edge.otherLabel,
      relationKind: edge.relationKind,
      semantics: classifyCausalRelationSemantics(edge.relationKind),
      claimId: `core-int3:rel-exists:${subjectId}:${edge.relationshipId}`,
      confidence: "medium",
    });
  }

  const constraints = uniqueRels
    .map((rel) => makeConstraint(rel, subjectId, subjectLabel))
    .filter((entry): entry is ConstraintEvidence => entry != null);

  const binding =
    allowDistinguished && input.explicitBindingConstraintId != null
      ? constraints.find((entry) => entry.constraintId === input.explicitBindingConstraintId) ??
        null
      : null;

  const causalConfidence = conflicting
    ? lowestConfidence(["unknown", ...contributors.map((entry) => entry.confidence)])
    : contributors.length
      ? lowestConfidence(contributors.map((entry) => entry.confidence))
      : "unknown";

  const constraintConfidence = conflicting
    ? lowestConfidence(["unknown", ...constraints.map((entry) => entry.confidence)])
    : constraints.length
      ? lowestConfidence(constraints.map((entry) => entry.confidence))
      : "unknown";

  const causalMissing =
    contributors.length === 0
      ? relatedFactors.length > 0
        ? "Related factors are recorded, but current evidence does not establish a cause."
        : "Nexora does not currently have enough evidence to identify a cause."
      : rootCause == null
        ? conflicting
          ? "Evidence conflicts. A possible contributor is known, but a root cause has not been established."
          : "A possible contributor is known, but a root cause has not been established."
        : null;

  const constraintMissing =
    constraints.length === 0
      ? "No validated constraint is currently recorded."
      : binding == null
        ? "Nexora has identified the recorded constraints, but does not yet have enough evidence to determine which one is binding."
        : null;

  return deepFreeze({
    causal: {
      identity: nexoraGroundedCausalConstraintIntelligenceIdentity,
      subjectId,
      subjectLabel,
      subjectKind,
      contributors: Object.freeze(contributors),
      relatedFactors: Object.freeze(relatedFactors),
      primaryContributor: primary,
      rootCause,
      ranked: false,
      causalConfidence,
      evidenceStatus: conflicting
        ? "conflicting"
        : contributors.length || relatedFactors.length
          ? "present"
          : "missing",
      missingEvidence: causalMissing,
      chain: Object.freeze(chain),
      writesMemory: false,
      mutatesStage: false,
      mutatesDecision: false,
    },
    constraint: {
      identity: nexoraGroundedCausalConstraintIntelligenceIdentity,
      subjectId,
      subjectLabel,
      subjectKind,
      constraints: Object.freeze(constraints),
      bindingConstraint: binding,
      unresolvedConstraints: Object.freeze(
        binding
          ? constraints.filter((entry) => entry.constraintId !== binding.constraintId)
          : constraints,
      ),
      evidenceStatus: conflicting ? "conflicting" : constraints.length ? "present" : "missing",
      confidence: constraintConfidence,
      missingEvidence: constraintMissing,
      writesMemory: false,
      mutatesStage: false,
      mutatesDecision: false,
    },
  });
}

function emptyCausal(
  subjectId: string | null,
  subjectLabel: string | null,
  subjectKind: string | null,
  missing: string,
): CausalAssessment {
  return {
    identity: nexoraGroundedCausalConstraintIntelligenceIdentity,
    subjectId,
    subjectLabel,
    subjectKind,
    contributors: Object.freeze([]),
    relatedFactors: Object.freeze([]),
    primaryContributor: null,
    rootCause: null,
    ranked: false,
    causalConfidence: "unknown",
    evidenceStatus: "missing",
    missingEvidence: missing,
    chain: Object.freeze([]),
    writesMemory: false,
    mutatesStage: false,
    mutatesDecision: false,
  };
}

function emptyConstraint(
  subjectId: string | null,
  subjectLabel: string | null,
  subjectKind: string | null,
  missing: string,
): ConstraintAssessment {
  return {
    identity: nexoraGroundedCausalConstraintIntelligenceIdentity,
    subjectId,
    subjectLabel,
    subjectKind,
    constraints: Object.freeze([]),
    bindingConstraint: null,
    unresolvedConstraints: Object.freeze([]),
    evidenceStatus: "missing",
    confidence: "unknown",
    missingEvidence: missing,
    writesMemory: false,
    mutatesStage: false,
    mutatesDecision: false,
  };
}

export function presentCausalAssessment(causal: CausalAssessment): string {
  if (causal.contributors.length === 0 && causal.relatedFactors.length === 0) {
    return causal.missingEvidence ?? "Nexora does not currently have enough evidence to identify a cause.";
  }
  if (causal.contributors.length === 0) {
    const names = causal.relatedFactors.map((entry) => entry.label);
    return `Nexora can show related factors (${names.join(" and ")}), but current evidence does not establish a cause.`;
  }
  const lines = causal.contributors.map((entry) => entry.interpretationClaim.statement);
  const root =
    causal.rootCause == null
      ? "A possible contributor is known, but a root cause has not been established."
      : "";
  return `${lines.join(" ")} ${root}`.trim();
}

export function presentConstraintAssessment(constraint: ConstraintAssessment): string {
  if (constraint.constraints.length === 0) {
    return constraint.missingEvidence ?? "No validated constraint is currently recorded.";
  }
  const recorded = constraint.constraints
    .map((entry) =>
      entry.qualification === "recorded-blocker"
        ? `${entry.label} is a recorded blocker.`
        : `${entry.label} is a recorded constraint.`,
    )
    .join(" ");
  if (constraint.bindingConstraint == null) {
    return `${recorded} Nexora has identified the recorded constraints, but does not yet have enough evidence to determine which one is binding.`;
  }
  return recorded;
}

export function presentProvenAnswer(causal: CausalAssessment): string {
  const claim = causal.contributors[0]?.interpretationClaim ?? causal.relatedFactors[0]?.interpretationClaim;
  if (claim == null) {
    return "Nexora does not currently have enough evidence to identify a cause, so nothing is proven.";
  }
  if (claim.type === "FACT") {
    return `Current data confirms the recorded relationship. That does not by itself prove causation. ${claim.statement}`;
  }
  if (claim.type === "ASSUMPTION") {
    return `That is not proven. One possible explanation is being used, not observed truth. ${claim.statement}`;
  }
  return `That is not proven. ${claim.statement}`;
}

export function presentBindingAnswer(constraint: ConstraintAssessment): string {
  if (constraint.constraints.length === 0) {
    return "No validated constraint is currently recorded, so a binding constraint is not established.";
  }
  if (constraint.bindingConstraint == null) {
    return "Nexora has identified the recorded constraints, but does not yet have enough evidence to determine which one is binding.";
  }
  return `${constraint.bindingConstraint.label} is the binding constraint on the current evidence.`;
}

export function presentContributorEvidence(causal: CausalAssessment): string {
  const contributor = causal.contributors[0] ?? causal.relatedFactors[0];
  if (contributor == null) {
    return "Nexora does not have additional validated evidence for that assessment.";
  }
  return `This claim is supported by a recorded relationship. Claim ${contributor.interpretationClaim.claimId}. ${contributor.existenceClaim.statement}`;
}

export { mapSemanticConfidenceToPresentation };
