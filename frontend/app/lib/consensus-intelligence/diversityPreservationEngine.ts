import { stableSignature } from "../intelligence/shared/dedupe";
import type { ExecutiveReasoningPerspective, PerspectiveCategory } from "./consensusIntelligenceTypes";
import {
  beginDiversityPreservationEvaluation,
  clampDiversityConfidence,
  DIVERSITY_PRESERVATION_MIN_DEBATE_DEPTH,
  DIVERSITY_PRESERVATION_MIN_UNIFIED_LAYERS,
  endDiversityPreservationEvaluation,
  fragilityStrengthRank,
  pluralityStateRank,
  shouldEvaluateDiversityPreservation,
  shouldRetainDiversityResilienceObservation,
} from "./diversityPreservationGuards";
import { getDiversityPreservationStore } from "./diversityPreservationStore";
import type {
  AntiConsensusFragilitySignal,
  DiversityCategory,
  DiversityPreservationSummary,
  DiversityResilienceObservation,
  EnterpriseGroupthinkIndicator,
  FragilityStrength,
  PerspectivePluralityField,
  PluralityPerspective,
  PluralityState,
  StrategicDiversityPreservationInput,
  StrategicDiversityPreservationResult,
  StrategicDiversitySnapshot,
} from "./diversityPreservationTypes";

const DEV_LOG_PREFIX = "[Nexora][DiversityPreservation]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildDiversityId(label: string): string {
  return stableSignature(["diversity-preservation", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: StrategicDiversityPreservationInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function uniquePerspectiveCategories(
  perspectives: readonly ExecutiveReasoningPerspective[]
): Set<PerspectiveCategory> {
  return new Set(perspectives.map((p) => p.perspectiveCategory));
}

function createObservation(
  label: string,
  pluralityState: PluralityState,
  fragilityStrength: FragilityStrength,
  diversityCategory: DiversityCategory,
  summary: string,
  preservedPerspectives: PluralityPerspective[],
  weakenedPerspectives: PluralityPerspective[],
  diversitySignals: string[],
  confidence: number,
  now: number
): DiversityResilienceObservation {
  return {
    diversityId: buildDiversityId(label),
    pluralityState,
    fragilityStrength,
    diversityCategory,
    summary,
    preservedPerspectives: Object.freeze(preservedPerspectives),
    weakenedPerspectives: Object.freeze(weakenedPerspectives),
    diversitySignals: Object.freeze(diversitySignals),
    confidence: clampDiversityConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildMonocultureRiskWarning(
  input: StrategicDiversityPreservationInput,
  now: number
): DiversityResilienceObservation | null {
  const consensus = input.strategicConsensusSnapshot;
  if (!consensus) return null;

  const categories = uniquePerspectiveCategories(consensus.reasoningPerspectives);
  const alignedDominant =
    consensus.awarenessSummary.dominantConsensusState === "aligned" ||
    consensus.awarenessSummary.dominantConsensusState === "converging";
  const lowDiversity = consensus.awarenessSummary.perspectiveDiversityPosture === "low";
  const highWeightCount = consensus.reasoningPerspectives.filter(
    (p) => p.perspectiveWeight >= 0.88
  ).length;

  if (!alignedDominant || (!lowDiversity && highWeightCount < 4)) return null;

  return createObservation(
    "monoculture_risk_warning",
    "narrowing",
    "elevated",
    "governance_diversity",
    "All perspectives are converging excessively without sufficient counterfactual resistance — strategic monoculture-risk warning indicates enterprise reasoning plurality may be narrowing.",
    Array.from(categories).slice(0, 3) as PluralityPerspective[],
    ["operational_speed"],
    ["monoculture_risk_warning", "excessive_convergence", "low_perspective_diversity"],
    0.78,
    now
  );
}

function buildCounterfactualDiversityDegradation(
  input: StrategicDiversityPreservationInput,
  now: number
): DiversityResilienceObservation | null {
  const debate = input.counterfactualSnapshot;
  const weakChallenge =
    (debate?.observationCount ?? 0) <= 1 ||
    debate?.awarenessSummary.robustnessPosture === "low" ||
    debate?.recentDebates.every((d) => d.counterfactualState === "exploratory");

  if (!weakChallenge) return null;

  return createObservation(
    "counterfactual_diversity_degradation",
    "narrowing",
    "monitored",
    "counterfactual_diversity",
    "Counterfactual pathways are weakening — diversity degradation signal indicates strategic challenge survivability may be declining across distributed cognition.",
    ["governance", "resilience"],
    ["counterfactual"],
    ["counterfactual_pathway_weakening", "diversity_degradation", "challenge_path_degradation"],
    0.74,
    now
  );
}

function buildResilientStrategicPlurality(
  input: StrategicDiversityPreservationInput,
  now: number
): DiversityResilienceObservation | null {
  const consensus = input.strategicConsensusSnapshot;
  const debate = input.counterfactualSnapshot;
  if (!consensus) return null;

  const categories = uniquePerspectiveCategories(consensus.reasoningPerspectives);
  const hasDebateChallenge =
    (debate?.recentDebates.length ?? 0) >= 2 &&
    debate?.recentDebates.some((d) => d.challengedAssumptions.length > 0);
  const hasDivergent = consensus.recentConsensusRecords.some(
    (r) => r.divergentPerspectives.length > 0
  );

  if (categories.size < 5 || (!hasDebateChallenge && !hasDivergent)) return null;

  const preserved: PluralityPerspective[] = Array.from(categories).slice(0, 4);
  if (hasDebateChallenge && !preserved.includes("counterfactual")) {
    preserved.push("counterfactual");
  }

  return createObservation(
    "resilient_strategic_plurality",
    "resilient",
    "monitored",
    "orchestration_diversity",
    "Minority perspectives and challenge pathways remain active — resilient strategic plurality preserves distributed reasoning diversity under coordinated guidance.",
    preserved.slice(0, 5),
    [],
    ["active_challenge_pathways", "minority_perspective_survivability", "distributed_reasoning_balance"],
    0.87,
    now
  );
}

function buildGovernanceDominanceFragility(
  input: StrategicDiversityPreservationInput,
  now: number
): DiversityResilienceObservation | null {
  const weighting = input.consensusPrioritySnapshot;
  const advisory = input.collectiveGuidanceSnapshot;
  const govDominant =
    weighting?.recentWeightings.some((w) => w.weightingCategory === "governance_priority") &&
    (advisory?.recentAdvisories.every((a) =>
      a.alignedGuidance.includes("governance_stabilization")
    ) ??
      false);

  if (!govDominant) return null;

  return createObservation(
    "governance_dominance_fragility",
    "narrowing",
    "elevated",
    "governance_diversity",
    "Governance perspectives dominate excessively — consensus fragility concern indicates alternative orchestration and operational-speed viewpoints may be underrepresented.",
    ["governance", "resilience"],
    ["operational_speed", "foresight"],
    ["governance_dominance", "consensus_fragility_concern", "alternative_suppression_risk"],
    0.81,
    now
  );
}

function buildExecutiveGradeDiversityResilience(
  input: StrategicDiversityPreservationInput,
  now: number
): DiversityResilienceObservation | null {
  const consensus = input.strategicConsensusSnapshot;
  const debate = input.counterfactualSnapshot;

  const diversityPosture = consensus?.awarenessSummary.perspectiveDiversityPosture;
  const healthyDisagreement =
    (debate?.recentDebates.length ?? 0) >= 2 &&
    (consensus?.perspectiveConflicts.length ?? 0) >= 1;
  if (diversityPosture === "low" || !healthyDisagreement) return null;

  return createObservation(
    "executive_grade_diversity_resilience",
    "balanced",
    "monitored",
    "counterfactual_diversity",
    "Distributed disagreement remains healthy — enterprise-grade diversity resilience maintains plurality without artificial disagreement amplification.",
    ["governance", "resilience", "counterfactual", "coordination"],
    [],
    [
      "executive_grade_diversity_resilience",
      "distributed_disagreement_healthy",
      "anti_fragile_cognition_reinforcement",
    ],
    0.92,
    now
  );
}

function buildEnterprisePluralityResilience(
  input: StrategicDiversityPreservationInput,
  now: number
): DiversityResilienceObservation | null {
  const consensus = input.strategicConsensusSnapshot;
  if (!consensus) return null;

  const categories = uniquePerspectiveCategories(consensus.reasoningPerspectives);
  const speedWeak = !categories.has("operational_speed");
  const hasCounterfactual = (input.counterfactualSnapshot?.observationCount ?? 0) >= 1;

  if (categories.size < 4) return null;

  const preserved: PluralityPerspective[] = ["governance", "resilience"];
  if (hasCounterfactual) preserved.push("counterfactual");
  if (categories.has("foresight")) preserved.push("foresight");
  if (categories.has("coordination")) preserved.push("coordination");

  return createObservation(
    "enterprise_plurality_resilience_01",
    "balanced",
    "monitored",
    "operational_diversity",
    "Enterprise strategic cognition maintains healthy governance, resilience, and counterfactual diversity, though operational-speed perspectives are becoming partially underrepresented.",
    preserved,
    speedWeak ? (["operational_speed"] as PluralityPerspective[]) : [],
    [
      "active_challenge_pathways",
      "counterfactual_survivability",
      "distributed_reasoning_balance",
    ],
    0.89,
    now
  );
}

function buildChallengePathSurvivability(
  input: StrategicDiversityPreservationInput,
  now: number
): DiversityResilienceObservation | null {
  const escalation = input.fragilityElevated;
  const debateActive = (input.counterfactualSnapshot?.recentDebates.length ?? 0) >= 1;
  const negotiationActive = (input.conflictResolutionSnapshot?.observationCount ?? 0) >= 1;

  if (!escalation || !debateActive || !negotiationActive) return null;

  return createObservation(
    "challenge_path_survivability",
    "diverse",
    "monitored",
    "resilience_diversity",
    "Strategic challenge pathways survive under pressure — anti-fragile cognition reinforcement preserves negotiation and counterfactual diversity without forcing artificial disagreement.",
    ["governance", "resilience", "counterfactual"],
    [],
    [
      "challenge_path_survivability",
      "anti_fragile_cognition_reinforcement",
      "plurality_under_pressure",
    ],
    0.86,
    now
  );
}

function buildFragilitySignal(
  observation: DiversityResilienceObservation,
  now: number
): AntiConsensusFragilitySignal {
  return {
    signalId: stableSignature(["anti-consensus-signal", observation.diversityId]).slice(0, 48),
    signalLabel: observation.fragilityStrength.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.diversityCategory]),
    signalIntensity:
      observation.fragilityStrength === "dangerous" || observation.fragilityStrength === "systemic"
        ? "high"
        : observation.fragilityStrength === "elevated"
          ? "moderate"
          : "low",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildGroupthinkIndicator(
  observation: DiversityResilienceObservation,
  now: number
): EnterpriseGroupthinkIndicator | null {
  if (
    observation.diversityCategory !== "governance_diversity" &&
    !observation.diversitySignals.includes("monoculture_risk_warning")
  ) {
    return null;
  }
  return {
    indicatorId: stableSignature(["groupthink-indicator", observation.diversityId]).slice(0, 48),
    indicatorLabel: "monoculture risk",
    indicatorSummary: observation.summary.slice(0, 100),
    monocultureRisk:
      observation.fragilityStrength === "systemic" || observation.fragilityStrength === "dangerous"
        ? "systemic"
        : observation.fragilityStrength === "elevated"
          ? "high"
          : observation.fragilityStrength === "monitored"
            ? "moderate"
            : "low",
    linkedCategories: Object.freeze([observation.diversityCategory]),
    generatedAt: now,
  };
}

function buildPluralityField(
  observation: DiversityResilienceObservation,
  now: number
): PerspectivePluralityField | null {
  if (
    observation.pluralityState !== "balanced" &&
    observation.pluralityState !== "diverse" &&
    observation.pluralityState !== "resilient"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["plurality-field", observation.diversityId]).slice(0, 48),
    fieldLabel: observation.pluralityState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    pluralityPosture:
      observation.pluralityState === "resilient"
        ? "executive_grade"
        : observation.pluralityState === "balanced"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.diversityCategory]),
    generatedAt: now,
  };
}

function buildStrategicDiversitySnapshot(
  organizationId: string,
  observations: DiversityResilienceObservation[],
  indicators: EnterpriseGroupthinkIndicator[],
  signals: AntiConsensusFragilitySignal[],
  fields: PerspectivePluralityField[],
  now: number
): StrategicDiversitySnapshot {
  const top = observations[0];
  const awarenessSummary: DiversityPreservationSummary = top
    ? {
        dominantPluralityState: top.pluralityState,
        dominantFragilityStrength: top.fragilityStrength,
        preservationHeadline: top.summary,
        resiliencePosture:
          top.pluralityState === "resilient"
            ? "executive_grade"
            : top.pluralityState === "balanced" || top.pluralityState === "diverse"
              ? "high"
              : top.pluralityState === "narrowing"
                ? "moderate"
                : "low",
      }
    : {
        dominantPluralityState: "narrowing",
        dominantFragilityStrength: "weak",
        preservationHeadline:
          "Enterprise strategic diversity preservation awaiting sufficient counterfactual debate runtime depth.",
        resiliencePosture: "low",
      };

  const signature = stableSignature([
    "d9-7-6-strategic-diversity-snapshot",
    organizationId,
    observations.map((o) => o.diversityId),
    awarenessSummary.resiliencePosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    awarenessSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    groupthinkIndicators: Object.freeze(indicators.slice(0, 6)),
    fragilitySignals: Object.freeze(signals.slice(0, 6)),
    pluralityFields: Object.freeze(fields.slice(0, 6)),
  };
}

export function evaluateStrategicDiversityPreservation(
  input: StrategicDiversityPreservationInput
): StrategicDiversityPreservationResult {
  if (!beginDiversityPreservationEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newObservations: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getDiversityPreservationStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-7-6-diversity-preservation-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.strategicConsensusSnapshot?.signature ?? "no-consensus",
      input.conflictResolutionSnapshot?.signature ?? "no-negotiation",
      input.consensusPrioritySnapshot?.signature ?? "no-weighting",
      input.collectiveGuidanceSnapshot?.signature ?? "no-advisory",
      input.counterfactualSnapshot?.signature ?? "no-debate",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-unified-reflective",
      input.memorySnapshot?.signature ?? "no-memory",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
    ]);

    if (
      !shouldEvaluateDiversityPreservation(
        organizationId,
        evaluationSignature,
        prior.lastEvaluationSignature,
        now
      )
    ) {
      return {
        evaluated: false,
        skipped: true,
        reason: "paced_or_unchanged",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const debateDepth = input.counterfactualSnapshot?.observationCount ?? 0;

    if (activeLayers < DIVERSITY_PRESERVATION_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_diversity_monitoring_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (debateDepth < DIVERSITY_PRESERVATION_MIN_DEBATE_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_debate_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: DiversityResilienceObservation[] = [];

    const monoculture = buildMonocultureRiskWarning(input, now);
    if (monoculture) candidates.push(monoculture);

    const counterfactualDegradation = buildCounterfactualDiversityDegradation(input, now);
    if (counterfactualDegradation) candidates.push(counterfactualDegradation);

    const resilientPlurality = buildResilientStrategicPlurality(input, now);
    if (resilientPlurality) candidates.push(resilientPlurality);

    const governanceFragility = buildGovernanceDominanceFragility(input, now);
    if (governanceFragility) candidates.push(governanceFragility);

    const executiveResilience = buildExecutiveGradeDiversityResilience(input, now);
    if (executiveResilience) candidates.push(executiveResilience);

    const pluralityResilience = buildEnterprisePluralityResilience(input, now);
    if (pluralityResilience) candidates.push(pluralityResilience);

    const challengeSurvivability = buildChallengePathSurvivability(input, now);
    if (challengeSurvivability) candidates.push(challengeSurvivability);

    const retained = candidates
      .filter(shouldRetainDiversityResilienceObservation)
      .sort(
        (a, b) =>
          pluralityStateRank(b.pluralityState) - pluralityStateRank(a.pluralityState) ||
          fragilityStrengthRank(a.fragilityStrength) - fragilityStrengthRank(b.fragilityStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_observations",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.observations.map((o) => o.diversityId));
    const newCount = retained.filter((o) => !priorIds.has(o.diversityId)).length;

    const signals = retained.map((o) => buildFragilitySignal(o, now));
    const indicators = retained
      .map((o) => buildGroupthinkIndicator(o, now))
      .filter((i): i is EnterpriseGroupthinkIndicator => i !== null);
    const fields = retained
      .map((o) => buildPluralityField(o, now))
      .filter((f): f is PerspectivePluralityField => f !== null);

    store.upsertObservations(retained, now);
    store.upsertFragilitySignals(signals, now);
    store.upsertGroupthinkIndicators(indicators, now);
    store.upsertPluralityFields(fields, now);

    const snapshot = buildStrategicDiversitySnapshot(
      organizationId,
      retained,
      indicators,
      signals,
      fields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastPluralityState(snapshot.awarenessSummary.dominantPluralityState);

    const finalState = store.getState();
    const priorPlurality = prior.lastPluralityState;

    if (monoculture || governanceFragility) {
      devLog("monoculture-risk emergence — strategic reasoning plurality narrowing");
    }

    if (counterfactualDegradation) {
      devLog("diversity degradation — counterfactual challenge pathways weakening");
    }

    if (resilientPlurality || executiveResilience || pluralityResilience) {
      devLog("executive-grade plurality stabilization — distributed diversity resilience maintained");
    }

    if (challengeSurvivability) {
      devLog("challenge-path survivability shift — anti-fragile cognition pathways preserved under pressure");
    }

    if (
      priorPlurality &&
      priorPlurality !== snapshot.awarenessSummary.dominantPluralityState &&
      (snapshot.awarenessSummary.dominantPluralityState === "resilient" ||
        snapshot.awarenessSummary.dominantPluralityState === "balanced")
    ) {
      devLog(
        `diversity recovery — ${priorPlurality} → ${snapshot.awarenessSummary.dominantPluralityState}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newObservations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endDiversityPreservationEvaluation();
  }
}
