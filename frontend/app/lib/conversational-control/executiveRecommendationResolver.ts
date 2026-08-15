/**
 * CC:8 — Deterministic executive recommendation resolver.
 *
 * Evidence → Assessment → Policy → Recommendation → STOP
 * Pure. No Runtime/Stage mutation. No scenario execution. No decision commit.
 */

import type { NexoraExecutiveContextSnapshot } from "./executiveContextSnapshot.ts";
import {
  EXECUTIVE_REASONING_REASON,
} from "./executiveReasoning.ts";
import type {
  NexoraExecutiveAssessment,
  NexoraExecutiveAssessmentIssue,
  NexoraExecutiveConstraint,
  NexoraExecutiveConflict,
  NexoraExecutivePrioritySignal,
} from "./executiveAssessment.ts";
import type {
  NexoraExecutiveEvidenceFact,
  NexoraExecutiveEvidenceReference,
  NexoraExecutiveReason,
  NexoraExecutiveRecommendation,
  NexoraExecutiveRecommendationKind,
  NexoraExecutiveRecommendationResult,
  NexoraExecutiveRecommendationStatus,
  NexoraExecutiveRecommendationTrace,
  NexoraExecutiveReasoningEvidencePack,
  NexoraExecutiveSuggestedAction,
  NexoraExecutiveTradeoff,
  NexoraExecutiveUncertainty,
} from "./executiveRecommendation.ts";
import { assembleNexoraExecutiveReasoningEvidence } from "./executiveRecommendationEvidence.ts";
import {
  assessmentHasMaterialIssue,
  clampRecommendationConfidence,
  derivePriorityRank,
  hasCanonicalLink,
  relationshipSupportBetween,
  strengthFromConfidence,
} from "./executiveRecommendationPolicy.ts";

export type NexoraExecutiveRecommendationInput = {
  readonly executiveContext: NexoraExecutiveContextSnapshot;
  /** Explicit subject from CC:2 when present; otherwise CC:7 current. */
  readonly primarySubjectId?: string | null;
  readonly evidence: NexoraExecutiveReasoningEvidencePack;
  readonly requestKind?: "recommend" | "explain" | "prioritize";
};

function refFromFact(fact: NexoraExecutiveEvidenceFact): NexoraExecutiveEvidenceReference {
  return Object.freeze({ ...fact.source });
}

function buildAssessment(input: {
  readonly primarySubjectId: string | null;
  readonly evidence: NexoraExecutiveReasoningEvidencePack;
  readonly executiveContext: NexoraExecutiveContextSnapshot;
}): {
  readonly assessment: NexoraExecutiveAssessment;
  readonly signalCodes: readonly string[];
} {
  const issues: NexoraExecutiveAssessmentIssue[] = [];
  const constraints: NexoraExecutiveConstraint[] = [];
  const conflicts: NexoraExecutiveConflict[] = [];
  const uncertainties: NexoraExecutiveUncertainty[] = [];
  const prioritySignals: NexoraExecutivePrioritySignal[] = [];
  const signalCodes: string[] = [];

  const goalId = input.executiveContext.currentGoal?.subjectId ?? null;
  const problemId = input.executiveContext.currentProblem?.subjectId ?? null;

  for (const fact of input.evidence.facts) {
    const unresolved =
      fact.status === "unresolved" ||
      fact.factValue == null && fact.factKey === "kpi";
    const stale = fact.freshness === "stale";

    if (stale) {
      uncertainties.push(
        Object.freeze({
          kind: "stale-data",
          description: `${fact.subjectLabel ?? fact.subjectId} evidence may be stale.`,
          evidenceRefs: Object.freeze([refFromFact(fact)]),
        }),
      );
    }

    if (unresolved) {
      uncertainties.push(
        Object.freeze({
          kind: "missing-data",
          description: `${fact.subjectLabel ?? fact.subjectId} has unresolved evidence.`,
          evidenceRefs: Object.freeze([refFromFact(fact)]),
        }),
      );
    }

    const goalLinkedDirect =
      (goalId != null && fact.subjectId === goalId) ||
      (goalId != null &&
        hasCanonicalLink(input.evidence, fact.subjectId, goalId));
    const relationshipLinked =
      goalId != null
        ? hasCanonicalLink(input.evidence, fact.subjectId, goalId)
        : problemId != null
          ? hasCanonicalLink(input.evidence, fact.subjectId, problemId)
          : false;

    const priority = derivePriorityRank({
      attention: fact.attention,
      goalLinkedDirect,
      relationshipLinked,
      unresolved,
    });

    if (
      fact.attention === "critical" ||
      fact.attention === "important" ||
      fact.attention === "elevated" ||
      fact.status === "risk"
    ) {
      issues.push(
        Object.freeze({
          issueId: `issue:${fact.evidenceId}`,
          subjectId: fact.subjectId,
          summary: `${fact.subjectLabel ?? fact.subjectId} shows ${fact.attention ?? fact.status ?? "pressure"}.`,
          severity:
            fact.attention === "critical"
              ? "critical"
              : fact.attention === "important"
                ? "important"
                : fact.attention === "elevated"
                  ? "elevated"
                  : "normal",
          evidenceRefs: Object.freeze([refFromFact(fact)]),
        }),
      );
      signalCodes.push(priority.code);
    }

    if (
      (fact.attention === "critical" || fact.status === "risk") &&
      (goalLinkedDirect || relationshipLinked || problemId === fact.subjectId)
    ) {
      constraints.push(
        Object.freeze({
          constraintId: `constraint:${fact.evidenceId}`,
          subjectId: fact.subjectId,
          summary: `${fact.subjectLabel ?? fact.subjectId} is a material constraint.`,
          linkedGoalId: goalId,
          evidenceRefs: Object.freeze([refFromFact(fact)]),
        }),
      );
    }

    prioritySignals.push(
      Object.freeze({
        signalId: `signal:${fact.evidenceId}`,
        subjectId: fact.subjectId,
        rank: priority.rank,
        code: priority.code,
        evidenceRefs: Object.freeze([refFromFact(fact)]),
      }),
    );
  }

  // Conflict: critical expansion pressure vs cost/risk pressure without resolution.
  const criticalSubjects = input.evidence.facts.filter(
    (f) => f.attention === "critical" || f.status === "risk",
  );
  const costPressure = input.evidence.facts.find(
    (f) =>
      f.factKey === "cost-pressure" ||
      (f.subjectId.includes("budget") && f.attention === "critical"),
  );
  const expansionPressure = criticalSubjects.find(
    (f) =>
      f.factKey === "expansion-signal" ||
      f.subjectId.includes("capacity") ||
      f.subjectId.includes("revenue"),
  );
  if (
    costPressure &&
    expansionPressure &&
    costPressure.subjectId !== expansionPressure.subjectId
  ) {
    conflicts.push(
      Object.freeze({
        conflictId: `conflict:${costPressure.evidenceId}:${expansionPressure.evidenceId}`,
        summary:
          "Expansion pressure and cost/risk pressure point in opposing directions.",
        subjectIds: Object.freeze([
          expansionPressure.subjectId,
          costPressure.subjectId,
        ]),
        evidenceRefs: Object.freeze([
          refFromFact(expansionPressure),
          refFromFact(costPressure),
        ]),
      }),
    );
    signalCodes.push(EXECUTIVE_REASONING_REASON.CONFLICTING_EVIDENCE);
  }

  // Scenario / decision / execution are reference-only signals.
  if (input.executiveContext.currentScenario) {
    signalCodes.push(EXECUTIVE_REASONING_REASON.REFERENCE_ONLY_SCENARIO);
  }
  if (input.executiveContext.currentDecision) {
    signalCodes.push(EXECUTIVE_REASONING_REASON.REFERENCE_ONLY_DECISION);
  }
  if (input.executiveContext.currentExecution) {
    signalCodes.push(EXECUTIVE_REASONING_REASON.REFERENCE_ONLY_EXECUTION);
  }

  prioritySignals.sort((a, b) => b.rank - a.rank);

  return {
    assessment: Object.freeze({
      primarySubjectId: input.primarySubjectId,
      issues: Object.freeze(issues),
      opportunities: Object.freeze([]),
      constraints: Object.freeze(constraints),
      conflicts: Object.freeze(conflicts),
      uncertainties: Object.freeze(uncertainties),
      prioritySignals: Object.freeze(prioritySignals),
    }),
    signalCodes: Object.freeze(signalCodes),
  };
}

function makeRecommendation(input: {
  readonly idSuffix: string;
  readonly kind: NexoraExecutiveRecommendationKind;
  readonly status: NexoraExecutiveRecommendationStatus;
  readonly subjectIds: readonly string[];
  readonly summary: string;
  readonly confidence: number;
  readonly rationale: readonly NexoraExecutiveReason[];
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly tradeoffs?: readonly NexoraExecutiveTradeoff[];
  readonly uncertainties?: readonly NexoraExecutiveUncertainty[];
  readonly nextBestActions?: readonly NexoraExecutiveSuggestedAction[];
  readonly requiresScenarioAnalysis?: boolean;
}): NexoraExecutiveRecommendation {
  const confidence = clampRecommendationConfidence(input.confidence);
  return Object.freeze({
    recommendationId: `cc8:${input.kind}:${input.idSuffix}`,
    subjectIds: Object.freeze([...input.subjectIds]),
    summary: input.summary,
    recommendationKind: input.kind,
    confidence,
    strength: strengthFromConfidence(confidence),
    rationale: Object.freeze([...input.rationale]),
    evidenceRefs: Object.freeze([...input.evidenceRefs]),
    tradeoffs: Object.freeze([...(input.tradeoffs ?? [])]),
    uncertainties: Object.freeze([...(input.uncertainties ?? [])]),
    nextBestActions: Object.freeze([...(input.nextBestActions ?? [])]),
    requiresScenarioAnalysis: input.requiresScenarioAnalysis === true,
    requiresDecisionCommitment: false,
    status: input.status,
  });
}

/**
 * Primary CC:8 API.
 */
export function resolveNexoraExecutiveRecommendation(
  input: NexoraExecutiveRecommendationInput,
): NexoraExecutiveRecommendationResult {
  const primarySubjectId =
    input.primarySubjectId ??
    input.executiveContext.currentSubject?.subjectId ??
    null;

  const evidence =
    input.evidence.scopeSubjectIds.length > 0
      ? input.evidence
      : assembleNexoraExecutiveReasoningEvidence({
          executiveContext: input.executiveContext,
          primarySubjectId,
          facts: input.evidence.facts,
          relationships: input.evidence.relationships,
        });

  const { assessment, signalCodes } = buildAssessment({
    primarySubjectId,
    evidence,
    executiveContext: input.executiveContext,
  });

  const reasons: string[] = [
    primarySubjectId
      ? input.primarySubjectId
        ? EXECUTIVE_REASONING_REASON.EXPLICIT_SUBJECT_SCOPE
        : EXECUTIVE_REASONING_REASON.CONTEXT_SUBJECT_SCOPE
      : EXECUTIVE_REASONING_REASON.INSUFFICIENT_EVIDENCE,
    ...signalCodes,
    EXECUTIVE_REASONING_REASON.DETERMINISTIC,
  ];

  const policyMatches: string[] = [];
  const candidateKinds: string[] = [];
  const primaryFact =
    evidence.facts.find((f) => f.subjectId === primarySubjectId) ?? null;
  const goalId = input.executiveContext.currentGoal?.subjectId ?? null;
  const problemId = input.executiveContext.currentProblem?.subjectId ?? null;

  // Insufficient evidence
  if (
    !primarySubjectId ||
    evidence.facts.length === 0 ||
    (primaryFact == null &&
      !assessmentHasMaterialIssue(assessment) &&
      assessment.constraints.length === 0)
  ) {
    const status: NexoraExecutiveRecommendationStatus = "insufficient-evidence";
    policyMatches.push(EXECUTIVE_REASONING_REASON.INSUFFICIENT_EVIDENCE);
    const trace = buildTrace({
      primarySubjectId,
      evidence,
      signalCodes,
      policyMatches,
      conflicts: assessment.conflicts.map((c) => c.conflictId),
      candidateKinds,
      finalKind: null,
      finalStatus: status,
      reasons: Object.freeze([
        ...reasons,
        EXECUTIVE_REASONING_REASON.INSUFFICIENT_EVIDENCE,
      ]),
    });
    return Object.freeze({
      primaryRecommendation: null,
      alternatives: Object.freeze([]),
      assessment,
      status,
      trace,
    });
  }

  // Conflicting evidence
  if (assessment.conflicts.length > 0) {
    policyMatches.push(EXECUTIVE_REASONING_REASON.CONFLICTING_EVIDENCE);
    candidateKinds.push("defer", "compare-options", "prepare-scenario");
    const conflict = assessment.conflicts[0]!;
    const tradeoffs: NexoraExecutiveTradeoff[] = [
      Object.freeze({
        dimension: "risk" as const,
        upside: "Acting may relieve expansion pressure.",
        downside: "Acting may increase cost/risk pressure.",
        evidenceRefs: conflict.evidenceRefs,
      }),
    ];
    const recommendation = makeRecommendation({
      idSuffix: primarySubjectId ?? "conflict",
      kind: "defer",
      status: "conflicted",
      subjectIds: conflict.subjectIds,
      summary:
        "Evidence is conflicted — defer commitment and compare options before acting.",
      confidence: 0.55,
      rationale: Object.freeze([
        Object.freeze({
          code: EXECUTIVE_REASONING_REASON.CONFLICTING_EVIDENCE,
          summary: conflict.summary,
          evidenceRefs: conflict.evidenceRefs,
        }),
        Object.freeze({
          code: EXECUTIVE_REASONING_REASON.CAUSALITY_NOT_PROVEN,
          summary: "Opposing signals are present; causality is not established.",
          evidenceRefs: conflict.evidenceRefs,
        }),
      ]),
      evidenceRefs: conflict.evidenceRefs,
      tradeoffs,
      uncertainties: assessment.uncertainties,
      nextBestActions: Object.freeze([
        Object.freeze({
          actionId: "prepare-scenario",
          label: "Prepare scenario analysis",
          kind: "prepare-scenario" as const,
          subjectId: primarySubjectId,
        }),
      ]),
      requiresScenarioAnalysis: true,
    });
    const alt = makeRecommendation({
      idSuffix: `${primarySubjectId ?? "conflict"}:scenario`,
      kind: "prepare-scenario",
      status: "conflicted",
      subjectIds: conflict.subjectIds,
      summary: "Prepare scenario analysis before committing.",
      confidence: 0.5,
      rationale: recommendation.rationale,
      evidenceRefs: conflict.evidenceRefs,
      requiresScenarioAnalysis: true,
    });
    policyMatches.push(EXECUTIVE_REASONING_REASON.SCENARIO_ANALYSIS_REQUIRED);
    return finish({
      primary: recommendation,
      alternatives: [alt],
      assessment,
      status: "conflicted",
      primarySubjectId,
      evidence,
      signalCodes,
      policyMatches,
      candidateKinds,
      reasons,
    });
  }

  const support =
    goalId && primarySubjectId
      ? relationshipSupportBetween(evidence, primarySubjectId, goalId)
      : problemId && primarySubjectId
        ? relationshipSupportBetween(evidence, primarySubjectId, problemId)
        : null;

  const critical =
    primaryFact?.attention === "critical" || primaryFact?.status === "risk";
  const attention =
    primaryFact?.attention === "important" ||
    primaryFact?.attention === "elevated";
  const linked =
    support === "related" ||
    support === "constraining" ||
    support === "correlated" ||
    support === "causal" ||
    (goalId != null &&
      primarySubjectId != null &&
      hasCanonicalLink(evidence, primarySubjectId, goalId)) ||
    (problemId != null && primarySubjectId === problemId);

  if (support && support !== "causal") {
    reasons.push(EXECUTIVE_REASONING_REASON.CAUSALITY_NOT_PROVEN);
  }
  if (support) {
    reasons.push(EXECUTIVE_REASONING_REASON.CANONICAL_RELATIONSHIP_SUPPORTED);
    policyMatches.push(EXECUTIVE_REASONING_REASON.CANONICAL_RELATIONSHIP_SUPPORTED);
  }
  if (goalId) {
    reasons.push(EXECUTIVE_REASONING_REASON.GOAL_ALIGNMENT);
    policyMatches.push(EXECUTIVE_REASONING_REASON.GOAL_ALIGNMENT);
  }
  if (problemId) {
    reasons.push(EXECUTIVE_REASONING_REASON.PROBLEM_ALIGNMENT);
    policyMatches.push(EXECUTIVE_REASONING_REASON.PROBLEM_ALIGNMENT);
  }

  const evidenceRefs = Object.freeze(
    [
      ...(primaryFact ? [refFromFact(primaryFact)] : []),
      ...assessment.constraints.flatMap((c) => c.evidenceRefs),
      ...assessment.issues
        .filter((i) => i.subjectId === primarySubjectId)
        .flatMap((i) => i.evidenceRefs),
    ].filter(
      (r, index, all) =>
        all.findIndex((x) => x.sourceId === r.sourceId) === index,
    ),
  );

  // Scenario handoff when impact is explicitly unknown (before stronger action kinds).
  const unknownImpact = evidence.facts.some(
    (f) =>
      f.subjectId === primarySubjectId && f.factKey === "unknown-impact",
  );
  if (unknownImpact) {
    candidateKinds.push("prepare-scenario");
    policyMatches.push(EXECUTIVE_REASONING_REASON.SCENARIO_ANALYSIS_REQUIRED);
    const recommendation = makeRecommendation({
      idSuffix: primarySubjectId!,
      kind: "prepare-scenario",
      status: "supported",
      subjectIds: Object.freeze([primarySubjectId!]),
      summary:
        "Prepare scenario analysis before committing — impact is not yet established.",
      confidence: 0.5,
      rationale: Object.freeze([
        Object.freeze({
          code: EXECUTIVE_REASONING_REASON.SCENARIO_ANALYSIS_REQUIRED,
          summary: "Trusted evidence marks impact as unknown.",
          evidenceRefs,
        }),
      ]),
      evidenceRefs,
      requiresScenarioAnalysis: true,
    });
    return finish({
      primary: recommendation,
      alternatives: [],
      assessment,
      status: "supported",
      primarySubjectId,
      evidence,
      signalCodes,
      policyMatches,
      candidateKinds,
      reasons,
    });
  }

  // Strong prioritize/mitigate
  if (critical && linked) {
    candidateKinds.push("prioritize", "mitigate");
    policyMatches.push(
      EXECUTIVE_REASONING_REASON.CRITICAL_GOAL_LINKED_CONSTRAINT,
    );
    const label = primaryFact?.subjectLabel ?? primarySubjectId!;
    const goalLabel =
      input.executiveContext.currentGoal?.canonicalName ?? "the current goal";
    const recommendation = makeRecommendation({
      idSuffix: primarySubjectId!,
      kind: "prioritize",
      status: "supported",
      subjectIds: Object.freeze([primarySubjectId!]),
      summary: `Prioritize ${label} before increasing ${goalLabel}.`,
      confidence: support === "causal" ? 0.9 : 0.82,
      rationale: Object.freeze([
        Object.freeze({
          code: EXECUTIVE_REASONING_REASON.CRITICAL_GOAL_LINKED_CONSTRAINT,
          summary: `${label} is critical and relevant to the active goal/problem chain.`,
          evidenceRefs,
        }),
        Object.freeze({
          code: EXECUTIVE_REASONING_REASON.CANONICAL_RELATIONSHIP_SUPPORTED,
          summary: support
            ? `A canonical ${support} relationship supports relevance (causality not assumed unless causal evidence exists).`
            : "Relevance is supported by active problem/goal alignment.",
          evidenceRefs,
        }),
        Object.freeze({
          code: EXECUTIVE_REASONING_REASON.CAUSALITY_NOT_PROVEN,
          summary:
            support === "causal"
              ? "Causal evidence is present in the trusted pack."
              : "Causality is not proven; recommendation is relevance-based.",
          evidenceRefs,
        }),
      ]),
      evidenceRefs,
      tradeoffs: Object.freeze([
        Object.freeze({
          dimension: "capacity" as const,
          upside: `Addressing ${label} may relieve a material constraint.`,
          downside: "Deferring other initiatives may slow alternate outcomes.",
          evidenceRefs,
        }),
      ]),
      uncertainties: assessment.uncertainties,
      nextBestActions: Object.freeze([
        Object.freeze({
          actionId: "inspect-constraint",
          label: `Inspect ${label}`,
          kind: "inspect" as const,
          subjectId: primarySubjectId,
        }),
      ]),
    });
    const alt = makeRecommendation({
      idSuffix: `${primarySubjectId}:monitor`,
      kind: "monitor",
      status: "supported",
      subjectIds: Object.freeze([primarySubjectId!]),
      summary: `Maintain the current plan and monitor ${label} for one cycle.`,
      confidence: 0.48,
      rationale: recommendation.rationale,
      evidenceRefs,
      tradeoffs: Object.freeze([
        Object.freeze({
          dimension: "time" as const,
          upside: "Avoids immediate disruption.",
          downside: `Critical ${label} pressure may worsen.`,
          evidenceRefs,
        }),
      ]),
    });
    return finish({
      primary: recommendation,
      alternatives: [alt],
      assessment,
      status: "supported",
      primarySubjectId,
      evidence,
      signalCodes,
      policyMatches,
      candidateKinds,
      reasons,
    });
  }

  // Weak evidence → investigate (attention without strong link / no causal claim)
  if (attention && !linked) {
    candidateKinds.push("investigate");
    policyMatches.push(EXECUTIVE_REASONING_REASON.WEAK_EVIDENCE_INVESTIGATE);
    const label = primaryFact?.subjectLabel ?? primarySubjectId!;
    const recommendation = makeRecommendation({
      idSuffix: primarySubjectId!,
      kind: "investigate",
      status: "supported",
      subjectIds: Object.freeze([primarySubjectId!]),
      summary: `Investigate ${label} as a possible contributor — evidence is not strong enough to prioritize action.`,
      confidence: 0.42,
      rationale: Object.freeze([
        Object.freeze({
          code: EXECUTIVE_REASONING_REASON.WEAK_EVIDENCE_INVESTIGATE,
          summary: `${label} shows attention, but a goal-linked canonical relationship is not established.`,
          evidenceRefs,
        }),
        Object.freeze({
          code: EXECUTIVE_REASONING_REASON.CAUSALITY_NOT_PROVEN,
          summary: "No causal claim is made.",
          evidenceRefs,
        }),
      ]),
      evidenceRefs,
      uncertainties: Object.freeze([
        ...assessment.uncertainties,
        Object.freeze({
          kind: "weak-relationship",
          description: "Canonical goal linkage is missing or uncertain.",
          evidenceRefs,
        }),
      ]),
    });
    return finish({
      primary: recommendation,
      alternatives: [],
      assessment,
      status: "supported",
      primarySubjectId,
      evidence,
      signalCodes,
      policyMatches,
      candidateKinds,
      reasons,
    });
  }

  // Attention + linked → monitor or investigate
  if (attention && linked) {
    candidateKinds.push("monitor", "investigate");
    policyMatches.push(EXECUTIVE_REASONING_REASON.MONITOR_ATTENTION_SIGNAL);
    const label = primaryFact?.subjectLabel ?? primarySubjectId!;
    const recommendation = makeRecommendation({
      idSuffix: primarySubjectId!,
      kind: "monitor",
      status: "supported",
      subjectIds: Object.freeze([primarySubjectId!]),
      summary: `Monitor ${label} before changing the operating plan.`,
      confidence: 0.58,
      rationale: Object.freeze([
        Object.freeze({
          code: EXECUTIVE_REASONING_REASON.MONITOR_ATTENTION_SIGNAL,
          summary: `${label} is attention-level and goal/problem linked.`,
          evidenceRefs,
        }),
        Object.freeze({
          code: EXECUTIVE_REASONING_REASON.CAUSALITY_NOT_PROVEN,
          summary: "Causality is not proven.",
          evidenceRefs,
        }),
      ]),
      evidenceRefs,
      uncertainties: assessment.uncertainties,
    });
    return finish({
      primary: recommendation,
      alternatives: [],
      assessment,
      status: "supported",
      primarySubjectId,
      evidence,
      signalCodes,
      policyMatches,
      candidateKinds,
      reasons,
    });
  }

  // Explicit prepare-scenario request when unknown impact flagged
  if (
    input.requestKind === "recommend" &&
    primaryFact?.factKey === "unknown-impact"
  ) {
    candidateKinds.push("prepare-scenario");
    policyMatches.push(EXECUTIVE_REASONING_REASON.SCENARIO_ANALYSIS_REQUIRED);
    const recommendation = makeRecommendation({
      idSuffix: primarySubjectId!,
      kind: "prepare-scenario",
      status: "supported",
      subjectIds: Object.freeze([primarySubjectId!]),
      summary:
        "Prepare scenario analysis before committing — impact is not yet established.",
      confidence: 0.5,
      rationale: Object.freeze([
        Object.freeze({
          code: EXECUTIVE_REASONING_REASON.SCENARIO_ANALYSIS_REQUIRED,
          summary: "Trusted evidence marks impact as unknown.",
          evidenceRefs,
        }),
      ]),
      evidenceRefs,
      requiresScenarioAnalysis: true,
    });
    return finish({
      primary: recommendation,
      alternatives: [],
      assessment,
      status: "supported",
      primarySubjectId,
      evidence,
      signalCodes,
      policyMatches,
      candidateKinds,
      reasons,
    });
  }

  // No material action
  if (!assessmentHasMaterialIssue(assessment)) {
    candidateKinds.push("no-action");
    policyMatches.push(EXECUTIVE_REASONING_REASON.NO_MATERIAL_ACTION_REQUIRED);
    const recommendation = makeRecommendation({
      idSuffix: primarySubjectId ?? "none",
      kind: "no-action",
      status: "supported",
      subjectIds: Object.freeze(
        primarySubjectId ? [primarySubjectId] : [],
      ),
      summary: "No immediate action is recommended.",
      confidence: 0.7,
      rationale: Object.freeze([
        Object.freeze({
          code: EXECUTIVE_REASONING_REASON.NO_MATERIAL_ACTION_REQUIRED,
          summary: "No material unresolved critical issue is present in scope.",
          evidenceRefs,
        }),
      ]),
      evidenceRefs,
      nextBestActions: Object.freeze([
        Object.freeze({
          actionId: "none",
          label: "No action",
          kind: "none" as const,
          subjectId: primarySubjectId,
        }),
      ]),
    });
    return finish({
      primary: recommendation,
      alternatives: [],
      assessment,
      status: "supported",
      primarySubjectId,
      evidence,
      signalCodes,
      policyMatches,
      candidateKinds,
      reasons,
    });
  }

  // Fallback investigate
  candidateKinds.push("investigate");
  policyMatches.push(EXECUTIVE_REASONING_REASON.WEAK_EVIDENCE_INVESTIGATE);
  const recommendation = makeRecommendation({
    idSuffix: primarySubjectId ?? "investigate",
    kind: "investigate",
    status: "supported",
    subjectIds: Object.freeze(primarySubjectId ? [primarySubjectId] : []),
    summary: "Investigate further before committing to a course of action.",
    confidence: 0.4,
    rationale: Object.freeze([
      Object.freeze({
        code: EXECUTIVE_REASONING_REASON.WEAK_EVIDENCE_INVESTIGATE,
        summary: "Evidence is material but incomplete for a stronger recommendation.",
        evidenceRefs,
      }),
    ]),
    evidenceRefs,
    uncertainties: assessment.uncertainties,
  });
  return finish({
    primary: recommendation,
    alternatives: [],
    assessment,
    status: "supported",
    primarySubjectId,
    evidence,
    signalCodes,
    policyMatches,
    candidateKinds,
    reasons,
  });
}

function buildTrace(input: {
  readonly primarySubjectId: string | null;
  readonly evidence: NexoraExecutiveReasoningEvidencePack;
  readonly signalCodes: readonly string[];
  readonly policyMatches: readonly string[];
  readonly conflicts: readonly string[];
  readonly candidateKinds: readonly string[];
  readonly finalKind: NexoraExecutiveRecommendationKind | null;
  readonly finalStatus: NexoraExecutiveRecommendationStatus;
  readonly reasons: readonly string[];
}): NexoraExecutiveRecommendationTrace {
  return Object.freeze({
    scopeSubjectId: input.primarySubjectId,
    evidenceFactIds: Object.freeze(input.evidence.facts.map((f) => f.evidenceId)),
    relationshipIds: Object.freeze(
      input.evidence.relationships.map((r) => r.relationshipId),
    ),
    assessmentSignalCodes: Object.freeze([...input.signalCodes]),
    policyMatches: Object.freeze([...input.policyMatches]),
    conflicts: Object.freeze([...input.conflicts]),
    candidateKinds: Object.freeze([...input.candidateKinds]),
    finalKind: input.finalKind,
    finalStatus: input.finalStatus,
    reasons: Object.freeze([...input.reasons]),
  });
}

function finish(input: {
  readonly primary: NexoraExecutiveRecommendation;
  readonly alternatives: readonly NexoraExecutiveRecommendation[];
  readonly assessment: NexoraExecutiveAssessment;
  readonly status: NexoraExecutiveRecommendationStatus;
  readonly primarySubjectId: string | null;
  readonly evidence: NexoraExecutiveReasoningEvidencePack;
  readonly signalCodes: readonly string[];
  readonly policyMatches: readonly string[];
  readonly candidateKinds: readonly string[];
  readonly reasons: readonly string[];
}): NexoraExecutiveRecommendationResult {
  return Object.freeze({
    primaryRecommendation: input.primary,
    alternatives: Object.freeze([...input.alternatives]),
    assessment: input.assessment,
    status: input.status,
    trace: buildTrace({
      primarySubjectId: input.primarySubjectId,
      evidence: input.evidence,
      signalCodes: input.signalCodes,
      policyMatches: input.policyMatches,
      conflicts: input.assessment.conflicts.map((c) => c.conflictId),
      candidateKinds: input.candidateKinds,
      finalKind: input.primary.recommendationKind,
      finalStatus: input.status,
      reasons: input.reasons,
    }),
  });
}
