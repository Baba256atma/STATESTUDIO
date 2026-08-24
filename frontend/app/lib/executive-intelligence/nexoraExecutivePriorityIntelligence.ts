/**
 * CORE-INT:4 — Executive Priority Intelligence.
 *
 * Comparative, evidence-bounded ranking of eligible executive issues.
 * Reuses EI:4 explainable-priority factors/comparison. Does not wire
 * EI:4 trade-offs, invent scores, or promote attention into priority.
 */

import type { NexoraExecutiveEvidenceReference } from "../conversational-control/executiveRecommendation.ts";
import type { SemanticConfidence } from "./problemRiskOpportunityIntelligence.ts";
import type { SharedEpistemicEvidenceStatus } from "./nexoraSharedEpistemicFoundation.ts";
import {
  compareExplainablePriorities,
  createPriorityFactor,
  resolveExplainablePriority,
  type ExplainablePriority,
  type PriorityDimension,
  type PriorityFactor,
} from "./scenarioPriorityTradeoffIntelligence.ts";

export const nexoraExecutivePriorityIntelligenceIdentity =
  "CORE-INT:4/ExecutivePriorityIntelligence" as const;
export const nexoraExecutivePriorityIntelligenceVersion = "1.0.0" as const;

export const EXECUTIVE_PRIORITY_BOUNDARY = Object.freeze({
  role: "comparative-executive-priority" as const,
  epistemicAuthority: "CORE-INT:2/SharedEpistemicUncertaintyFoundation" as const,
  causalConstraintAuthority: "CORE-INT:3/GroundedCausalConstraintIntelligence" as const,
  factorAuthority: "EI:4/createPriorityFactor" as const,
  comparisonAuthority: "EI:4/compareExplainablePriorities" as const,
  reusesEi4Tradeoffs: false as const,
  wiresEi4Runtime: false as const,
  startsExi4: false as const,
  usesLlm: false as const,
  inventsNumericScore: false as const,
  attentionEqualsPriority: false as const,
  severityEqualsPriority: false as const,
  urgencyEqualsPriority: false as const,
  bindingEqualsPriority: false as const,
  causeEqualsPriority: false as const,
  recommendationEqualsPriority: false as const,
  nbaEqualsPriority: false as const,
  writesMemory: false as const,
  mutatesStage: false as const,
  mutatesDecision: false as const,
  mutatesExecution: false as const,
  isExiWriter: false as const,
});

export const PRIORITY_ELIGIBLE_KINDS = Object.freeze([
  "problem",
  "risk",
  "opportunity",
  "decision",
] as const);

export type PriorityEligibleKind = (typeof PRIORITY_ELIGIBLE_KINDS)[number];
export type PriorityScopeKind = "workspace" | "problems" | "decisions" | "risks";
export type PriorityPositionStatus = "ranked" | "tied" | "unranked";

export type ExecutivePriorityCandidateSource = Readonly<{
  readonly subjectId: string;
  readonly subjectLabel: string;
  readonly subjectKind: string;
  readonly eligibleKind: PriorityEligibleKind;
  readonly attention: "normal" | "elevated" | "important" | "critical" | null;
  readonly status: string | null;
  readonly recordedConstraintCount: number;
  readonly downstreamCount: number;
  readonly linkedDecision: boolean;
  readonly evidenceConfidence: SemanticConfidence;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
  readonly additionalFactors?: readonly PriorityFactor[];
}>;

export type ExecutivePriorityCandidate = Readonly<{
  readonly subjectId: string;
  readonly subjectLabel: string;
  readonly subjectKind: string;
  readonly eligibleKind: PriorityEligibleKind;
  readonly attention: ExecutivePriorityCandidateSource["attention"];
  readonly status: string | null;
  readonly evidenceConfidence: SemanticConfidence;
  readonly constraintPressure: number;
  readonly downstreamCount: number;
  readonly decisionReadiness: boolean;
  readonly strategicRelevance: "missing";
  readonly urgency: "missing";
  readonly timeSensitivity: "missing";
  readonly opportunityValue: "missing";
  readonly factors: readonly PriorityFactor[];
  readonly explainable: ExplainablePriority;
}>;

export type ExecutivePriorityResult = Readonly<{
  readonly subjectId: string;
  readonly subjectLabel: string;
  readonly position: number | null;
  readonly status: PriorityPositionStatus;
  readonly rationale: readonly string[];
  readonly criteriaUsed: readonly PriorityDimension[];
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
  readonly confidence: SemanticConfidence;
  readonly numericalScore: null;
}>;

export type ExecutivePriorityAssessment = Readonly<{
  readonly identity: typeof nexoraExecutivePriorityIntelligenceIdentity;
  readonly scopeId: PriorityScopeKind;
  readonly candidates: readonly ExecutivePriorityCandidate[];
  readonly orderedCandidates: readonly ExecutivePriorityResult[];
  readonly topPriority: ExecutivePriorityResult | null;
  readonly secondPriority: ExecutivePriorityResult | null;
  readonly rationale: readonly string[];
  readonly evidenceStatus: SharedEpistemicEvidenceStatus;
  readonly confidence: SemanticConfidence;
  readonly unrankedReason: string | null;
  readonly attentionSubjectId: string | null;
  readonly writesMemory: false;
  readonly mutatesStage: false;
  readonly mutatesDecision: false;
}>;

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

function lowestConfidence(
  values: readonly SemanticConfidence[],
): SemanticConfidence {
  if (values.includes("unknown")) return "unknown";
  if (values.includes("low")) return "low";
  if (values.includes("medium")) return "medium";
  if (values.includes("high") && values.length > 0) return "high";
  return "unknown";
}

export function isPriorityEligibleKind(
  kind: string,
  label?: string | null,
  subjectId?: string | null,
): kind is PriorityEligibleKind {
  if ((PRIORITY_ELIGIBLE_KINDS as readonly string[]).includes(kind)) return true;
  if (subjectId === "obj-risk" || /^risk$/i.test(label ?? "")) return true;
  return false;
}

export function resolvePriorityEligibleKind(
  kind: string,
  label?: string | null,
  subjectId?: string | null,
): PriorityEligibleKind | null {
  if (kind === "problem" || kind === "decision" || kind === "opportunity" || kind === "risk") {
    return kind;
  }
  if (subjectId === "obj-risk" || /^risk$/i.test(label ?? "")) return "risk";
  return null;
}

function unknownFactor(
  subjectId: string,
  dimension: PriorityDimension,
  reason: string,
): PriorityFactor {
  return createPriorityFactor({
    factorId: `core-int4:${subjectId}:${dimension}:unknown`,
    dimension,
    level: "unknown",
    effect: "unresolved",
    reason,
    evidenceRefs: [],
    assumptionRefs: [],
  });
}

function factorFromSource(
  source: ExecutivePriorityCandidateSource,
): readonly PriorityFactor[] {
  const factors: PriorityFactor[] = [];
  const support = {
    evidenceRefs: source.evidenceRefs,
    assumptionRefs: source.provenanceRefs,
  };

  if (source.eligibleKind === "risk" || source.status === "risk") {
    factors.push(
      createPriorityFactor({
        factorId: `core-int4:${source.subjectId}:risk-exposure`,
        dimension: "risk-exposure",
        level: "medium",
        effect: "neutral",
        reason: `${source.subjectLabel} has recorded risk exposure. That is an input, not an automatic priority rank.`,
        ...support,
      }),
    );
  }

  if (source.recordedConstraintCount > 0) {
    const distinctive = source.recordedConstraintCount >= 2 || source.downstreamCount >= 2;
    factors.push(
      createPriorityFactor({
        factorId: `core-int4:${source.subjectId}:constraint-pressure`,
        dimension: "constraint-pressure",
        level: distinctive ? "medium" : "low",
        effect: distinctive ? "raises" : "neutral",
        reason: distinctive
          ? `${source.subjectLabel} has recorded constraint pressure across multiple downstream subjects.`
          : `${source.subjectLabel} has a recorded constraint. That alone does not establish comparative priority.`,
        ...support,
      }),
    );
  }

  if (source.downstreamCount >= 2) {
    factors.push(
      createPriorityFactor({
        factorId: `core-int4:${source.subjectId}:impact`,
        dimension: "impact",
        level: "medium",
        effect: "raises",
        reason: `${source.subjectLabel} is recorded as affecting multiple downstream subjects.`,
        ...support,
      }),
    );
  }

  if (source.evidenceConfidence === "unknown" || source.evidenceConfidence === "low") {
    factors.push(
      createPriorityFactor({
        factorId: `core-int4:${source.subjectId}:uncertainty`,
        dimension: "uncertainty",
        level: source.evidenceConfidence === "unknown" ? "high" : "medium",
        effect: "reduces",
        reason: `Evidence confidence for ${source.subjectLabel} is ${source.evidenceConfidence}.`,
        ...support,
      }),
    );
  } else {
    factors.push(
      createPriorityFactor({
        factorId: `core-int4:${source.subjectId}:evidence-strength`,
        dimension: "evidence-strength",
        level: source.evidenceConfidence === "high" ? "high" : "medium",
        effect: "neutral",
        reason: `Priority confidence for ${source.subjectLabel} cannot exceed ${source.evidenceConfidence} evidence.`,
        ...support,
      }),
    );
  }

  factors.push(
    unknownFactor(source.subjectId, "strategic-relevance", "Live Strategy/OKR linkage is not available."),
  );
  factors.push(unknownFactor(source.subjectId, "urgency", "No validated urgency signal is recorded."));
  factors.push(
    unknownFactor(source.subjectId, "time-sensitivity", "No validated deadline or time-sensitivity is recorded."),
  );
  if (source.eligibleKind !== "opportunity") {
    factors.push(
      unknownFactor(source.subjectId, "opportunity-value", "No Opportunity value is recorded."),
    );
  }

  return Object.freeze(factors);
}

function beats(
  left: ExecutivePriorityCandidate,
  right: ExecutivePriorityCandidate,
): boolean {
  const comparison = compareExplainablePriorities({
    leftId: left.subjectId,
    left: left.explainable,
    rightId: right.subjectId,
    right: right.explainable,
  });
  return comparison.higherPriorityId === left.subjectId;
}

export function projectExecutivePriorityIntelligence(input: {
  readonly scopeId: PriorityScopeKind;
  readonly sources: readonly ExecutivePriorityCandidateSource[];
  readonly attentionSubjectId?: string | null;
}): ExecutivePriorityAssessment {
  const seen = new Set<string>();
  const candidates = input.sources
    .filter((source) => {
      if (seen.has(source.subjectId)) return false;
      seen.add(source.subjectId);
      return true;
    })
    .map((source) => {
      const factors = Object.freeze([
        ...factorFromSource(source),
        ...(source.additionalFactors ?? []),
      ]);
      return deepFreeze({
        subjectId: source.subjectId,
        subjectLabel: source.subjectLabel,
        subjectKind: source.subjectKind,
        eligibleKind: source.eligibleKind,
        attention: source.attention,
        status: source.status,
        evidenceConfidence: source.evidenceConfidence,
        constraintPressure: source.recordedConstraintCount,
        downstreamCount: source.downstreamCount,
        decisionReadiness: source.linkedDecision || source.eligibleKind === "decision",
        strategicRelevance: "missing" as const,
        urgency: "missing" as const,
        timeSensitivity: "missing" as const,
        opportunityValue: "missing" as const,
        factors,
        explainable: resolveExplainablePriority(factors),
      });
    });

  if (candidates.length < 2) {
    const only = candidates[0];
    const insufficient =
      "Nexora can identify items needing attention, but current evidence is not sufficient to prioritize one over the others.";
    const singleResult = only
      ? Object.freeze({
          subjectId: only.subjectId,
          subjectLabel: only.subjectLabel,
          position: null,
          status: "unranked" as const,
          rationale: Object.freeze([
            "A single eligible candidate is not a comparative ranking.",
          ]),
          criteriaUsed: Object.freeze(
            only.factors
              .filter((factor) => factor.level !== "unknown")
              .map((factor) => factor.dimension),
          ),
          evidenceRefs: Object.freeze(
            only.factors.flatMap((factor) => factor.evidenceRefs),
          ),
          provenanceRefs: unique(only.factors.flatMap((factor) => factor.assumptionRefs)),
          confidence: only.evidenceConfidence,
          numericalScore: null,
        })
      : null;
    return deepFreeze({
      identity: nexoraExecutivePriorityIntelligenceIdentity,
      scopeId: input.scopeId,
      candidates: Object.freeze(candidates),
      orderedCandidates: Object.freeze(singleResult ? [singleResult] : []),
      topPriority: null,
      secondPriority: null,
      rationale: Object.freeze([insufficient]),
      evidenceStatus: candidates.length === 0 ? "missing" : "present",
      confidence: "unknown",
      unrankedReason: insufficient,
      attentionSubjectId: input.attentionSubjectId ?? null,
      writesMemory: false,
      mutatesStage: false,
      mutatesDecision: false,
    });
  }

  const winners = candidates.filter((candidate) =>
    candidates.every(
      (other) => other.subjectId === candidate.subjectId || beats(candidate, other),
    ),
  );

  const insufficient =
    "Nexora can identify items needing attention, but current evidence is not sufficient to prioritize one over the others.";
  const tiedCopy =
    "Nexora cannot confidently distinguish priority between these issues with the current evidence.";

  if (winners.length !== 1) {
    const results = candidates.map((candidate) =>
      Object.freeze({
        subjectId: candidate.subjectId,
        subjectLabel: candidate.subjectLabel,
        position: null,
        status: "tied" as const,
        rationale: Object.freeze([
          ...candidate.explainable.primaryReasons,
          tiedCopy,
        ]),
        criteriaUsed: Object.freeze(
          candidate.factors
            .filter((factor) => factor.level !== "unknown" && factor.effect === "raises")
            .map((factor) => factor.dimension),
        ),
        evidenceRefs: Object.freeze(
          candidate.factors.flatMap((factor) => factor.evidenceRefs),
        ),
        provenanceRefs: unique(
          candidate.factors.flatMap((factor) => factor.assumptionRefs),
        ),
        confidence: lowestConfidence([
          candidate.evidenceConfidence,
          candidate.explainable.level === "unresolved" ? "unknown" : "medium",
        ]),
        numericalScore: null,
      }),
    );
    return deepFreeze({
      identity: nexoraExecutivePriorityIntelligenceIdentity,
      scopeId: input.scopeId,
      candidates: Object.freeze(candidates),
      orderedCandidates: Object.freeze(results),
      topPriority: null,
      secondPriority: null,
      rationale: Object.freeze([tiedCopy, insufficient]),
      evidenceStatus: "present",
      confidence: "unknown",
      unrankedReason: insufficient,
      attentionSubjectId: input.attentionSubjectId ?? null,
      writesMemory: false,
      mutatesStage: false,
      mutatesDecision: false,
    });
  }

  const top = winners[0]!;
  const remaining = candidates.filter((candidate) => candidate.subjectId !== top.subjectId);
  const secondWinners = remaining.filter((candidate) =>
    remaining.every(
      (other) => other.subjectId === candidate.subjectId || beats(candidate, other),
    ),
  );
  const second = secondWinners.length === 1 ? secondWinners[0]! : null;

  const toResult = (
    candidate: ExecutivePriorityCandidate,
    position: number | null,
    status: PriorityPositionStatus,
  ): ExecutivePriorityResult =>
    Object.freeze({
      subjectId: candidate.subjectId,
      subjectLabel: candidate.subjectLabel,
      position,
      status,
      rationale: Object.freeze(
        candidate.explainable.primaryReasons.length > 0
          ? candidate.explainable.primaryReasons
          : [`${candidate.subjectLabel} was compared using recorded executive evidence.`],
      ),
      criteriaUsed: Object.freeze(
        candidate.factors
          .filter((factor) => factor.level !== "unknown" && factor.effect !== "unresolved")
          .map((factor) => factor.dimension),
      ),
      evidenceRefs: Object.freeze(
        candidate.factors.flatMap((factor) => factor.evidenceRefs),
      ),
      provenanceRefs: unique(candidate.factors.flatMap((factor) => factor.assumptionRefs)),
      confidence: lowestConfidence([
        candidate.evidenceConfidence,
        candidate.explainable.level === "high" ? "medium" : "medium",
      ]),
      numericalScore: null,
    });

  const ordered = [
    toResult(top, 1, "ranked"),
    ...(second ? [toResult(second, 2, "ranked")] : remaining.map((candidate) =>
      toResult(candidate, null, "tied"),
    )),
  ];

  return deepFreeze({
    identity: nexoraExecutivePriorityIntelligenceIdentity,
    scopeId: input.scopeId,
    candidates: Object.freeze(candidates),
    orderedCandidates: Object.freeze(ordered),
    topPriority: ordered[0] ?? null,
    secondPriority: second ? ordered[1] ?? null : null,
    rationale: Object.freeze([
      `${top.subjectLabel} is currently the highest supported priority because ${top.explainable.primaryReasons[0] ?? "recorded comparative evidence distinguishes it"}. Evidence is limited.`,
    ]),
    evidenceStatus: "present",
    confidence: lowestConfidence(candidates.map((entry) => entry.evidenceConfidence)),
    unrankedReason: null,
    attentionSubjectId: input.attentionSubjectId ?? null,
    writesMemory: false,
    mutatesStage: false,
    mutatesDecision: false,
  });
}

export function presentPriorityAssessment(
  assessment: ExecutivePriorityAssessment,
): string {
  if (assessment.topPriority == null) {
    return (
      assessment.unrankedReason ??
      "Nexora can identify items needing attention, but current evidence is not sufficient to prioritize one over the others."
    );
  }
  return assessment.rationale[0] ?? `${assessment.topPriority.subjectLabel} is currently the highest supported priority. Evidence is limited.`;
}

export function presentSecondPriority(
  assessment: ExecutivePriorityAssessment,
): string {
  if (assessment.topPriority == null) {
    return "There is no first priority yet, so a second priority is not established.";
  }
  if (assessment.secondPriority == null) {
    return "Nexora cannot confidently distinguish a second priority with the current evidence.";
  }
  return `${assessment.secondPriority.subjectLabel} is the next supported priority after ${assessment.topPriority.subjectLabel}.`;
}

export function presentWhyAOverB(
  assessment: ExecutivePriorityAssessment,
  leftLabel: string,
  rightLabel: string,
): string {
  const left = assessment.candidates.find(
    (entry) =>
      entry.subjectLabel.toLowerCase() === leftLabel.toLowerCase() ||
      entry.subjectId === leftLabel,
  );
  const right = assessment.candidates.find(
    (entry) =>
      entry.subjectLabel.toLowerCase() === rightLabel.toLowerCase() ||
      entry.subjectId === rightLabel,
  );
  if (left == null || right == null) {
    const missing = left == null ? leftLabel : rightLabel;
    return `${missing} is not in the current priority scope. Priority compares eligible executive issues, not every attention object.`;
  }
  if (assessment.topPriority == null) {
    const leftCriteria = left.factors
      .filter((factor) => factor.effect === "raises" && factor.level !== "unknown")
      .map((factor) => factor.reason);
    const rightCriteria = right.factors
      .filter((factor) => factor.effect === "raises" && factor.level !== "unknown")
      .map((factor) => factor.reason);
    return `Current evidence does not distinguish ${left.subjectLabel} from ${right.subjectLabel}. ${leftCriteria.join(" ")} ${rightCriteria.join(" ")} Nexora cannot confidently distinguish priority between these two issues with the current evidence.`.replace(/\s+/g, " ").trim();
  }
  if (assessment.topPriority.subjectId === left.subjectId) {
    return `${left.subjectLabel} ranks above ${right.subjectLabel} on the current evidence. ${assessment.rationale[0] ?? left.explainable.primaryReasons[0] ?? ""}`;
  }
  return `${left.subjectLabel} is not ranked above ${right.subjectLabel} on the current evidence.`;
}

export function presentPriorityConfidence(
  assessment: ExecutivePriorityAssessment,
): string {
  if (assessment.topPriority == null) {
    return "Evidence is not strong enough to rank one issue over the others. This is not the same as causal confidence.";
  }
  return "Evidence limited. This ranking is supported, but it is not stronger than the current evidence.";
}

export function presentPriorityEvidence(
  assessment: ExecutivePriorityAssessment,
): string {
  const focus = assessment.topPriority ?? assessment.orderedCandidates[0];
  if (focus == null || focus.evidenceRefs.length === 0) {
    return "Nexora does not have additional validated evidence for a priority ranking.";
  }
  return `This ranking is supported by recorded executive evidence. ${focus.rationale[0] ?? ""}`.trim();
}

export function presentAttentionVersusPriority(
  assessment: ExecutivePriorityAssessment,
): string {
  const attention = assessment.attentionSubjectId;
  if (assessment.topPriority == null) {
    return attention
      ? "Needs Attention is a notice signal. Current evidence is not sufficient to name a top priority."
      : "No top priority is established. Attention remains a separate notice signal.";
  }
  if (attention && attention === assessment.topPriority.subjectId) {
    return `${assessment.topPriority.subjectLabel} currently has both the strongest attention signal and the highest supported priority. Those authorities remain separate.`;
  }
  return `Top Priority is ${assessment.topPriority.subjectLabel}. Attention remains a separate notice signal.`;
}
