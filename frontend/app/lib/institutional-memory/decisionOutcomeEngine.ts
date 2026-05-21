import { stableSignature } from "../intelligence/shared/dedupe";
import { getAdaptationRecoveryStore } from "./adaptationRecoveryStore";
import {
  beginDecisionOutcomeEvaluation,
  endDecisionOutcomeEvaluation,
  shouldEvaluateDecisionOutcomes,
  shouldRetainDecisionOutcome,
} from "./decisionOutcomeGuards";
import { getDecisionOutcomeStore } from "./decisionOutcomeStore";
import { getInstitutionalCorrelationStore } from "./institutionalCorrelationStore";
import { getInstitutionalMemoryStore } from "./institutionalMemoryStore";
import type {
  ConsequencePropagationType,
  DecisionCategory,
  DecisionImpactLevel,
  DecisionOutcomeSnapshot,
  ExecutiveConsequencePattern,
  InstitutionalDecisionOutcomeInput,
  InstitutionalDecisionRecord,
  OperationalOutcomeObservation,
  StrategicOutcomeCorrelation,
} from "./decisionOutcomeTypes";

const DEV_LOG_PREFIX = "[Nexora][DecisionOutcomeLearning]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildOutcomeId(category: DecisionCategory, observations: string[]): string {
  return stableSignature(["decision-outcome", category, ...observations.sort().slice(0, 4)]).slice(
    0,
    56
  );
}

function createOutcome(params: {
  decisionCategory: DecisionCategory;
  impactLevel: DecisionImpactLevel;
  propagationType: ConsequencePropagationType;
  summary: string;
  observations: string[];
  confidence: number;
  linkedMemoryIds: string[];
  now: number;
}): InstitutionalDecisionRecord {
  const observations = Object.freeze(params.observations.slice(0, 6));
  return {
    decisionOutcomeId: buildOutcomeId(params.decisionCategory, [...observations]),
    decisionCategory: params.decisionCategory,
    impactLevel: params.impactLevel,
    propagationType: params.propagationType,
    summary: params.summary,
    observations,
    confidence: Number(Math.min(0.92, Math.max(0.4, params.confidence)).toFixed(2)),
    generatedAt: params.now,
    lastObservedAt: params.now,
    occurrenceCount: 1,
    linkedMemoryIds: Object.freeze(params.linkedMemoryIds.slice(0, 8)),
  };
}

function hasSupportingEvidence(
  memoryCount: number,
  correlationCount: number,
  adaptationCount: number
): boolean {
  return memoryCount >= 2 && (correlationCount > 0 || adaptationCount > 0);
}

function inferDecisionOutcomes(
  input: InstitutionalDecisionOutcomeInput,
  correlationCategories: readonly string[],
  adaptationTypes: readonly string[],
  memoryIds: string[],
  now: number
): InstitutionalDecisionRecord[] {
  const stack = input.cognitionSnapshot;
  const fragilityElevated = input.fragilityElevated ?? false;
  const continuityPreserved = input.continuityPreserved ?? true;
  const evidence = hasSupportingEvidence(
    memoryIds.length,
    correlationCategories.length,
    adaptationTypes.length
  );

  const candidates: InstitutionalDecisionRecord[] = [];

  if (
    adaptationTypes.includes("governance_stabilization") ||
    (correlationCategories.includes("governance_pressure") && stack?.governanceOversightActive)
  ) {
    candidates.push(
      createOutcome({
        decisionCategory: "governance",
        impactLevel: "significant",
        propagationType: "distributed",
        summary:
          "Governance stabilization interventions repeatedly correlate with reduced escalation pressure and improved operational recovery.",
        observations: ["reduced_fragility", "stabilized_coordination", "improved_recovery_speed"],
        confidence: 0.86,
        linkedMemoryIds: memoryIds,
        now,
      })
    );
  }

  if (
    adaptationTypes.includes("fragility_reduction") ||
    adaptationTypes.includes("resilience_growth")
  ) {
    candidates.push(
      createOutcome({
        decisionCategory: "resilience",
        impactLevel: "moderate",
        propagationType: "localized",
        summary:
          "Repeated operational interventions correlate with fragility reduction and resilience-supporting outcomes.",
        observations: ["fragility_reduction", "resilience_supporting", "pressure_absorption"],
        confidence: 0.82,
        linkedMemoryIds: memoryIds,
        now,
      })
    );
  }

  if (correlationCategories.includes("escalation_chain")) {
    candidates.push(
      createOutcome({
        decisionCategory: "escalation",
        impactLevel: fragilityElevated ? "major" : "significant",
        propagationType: "cascading",
        summary:
          "Escalation responses create downstream operational pressure — consequence propagation follows fragility escalation chains.",
        observations: ["downstream_pressure", "cascading_instability", "escalation_propagation"],
        confidence: 0.78,
        linkedMemoryIds: memoryIds,
        now,
      })
    );
  }

  if (
    adaptationTypes.includes("coordination_recovery") ||
    correlationCategories.includes("coordination_breakdown")
  ) {
    candidates.push(
      createOutcome({
        decisionCategory: "coordination",
        impactLevel: "moderate",
        propagationType: "distributed",
        summary:
          "Coordination improvements correlate with reduced cross-system instability — adaptive operational outcome forming.",
        observations: ["coordination_improvement", "reduced_instability", "adaptive_outcome"],
        confidence: 0.75,
        linkedMemoryIds: memoryIds,
        now,
      })
    );
  }

  if (
    correlationCategories.includes("systemic_instability") &&
    !adaptationTypes.includes("recovery_cycle") &&
    fragilityElevated
  ) {
    candidates.push(
      createOutcome({
        decisionCategory: "strategic",
        impactLevel: "systemic",
        propagationType: "systemic",
        summary:
          "Repeated interventions fail to stabilize systemic pressure — ineffective strategic response pattern with unintended instability consequences.",
        observations: ["ineffective_intervention", "systemic_pressure", "unintended_instability"],
        confidence: 0.8,
        linkedMemoryIds: memoryIds,
        now,
      })
    );
  }

  if (
    (adaptationTypes.includes("recovery_cycle") ||
      correlationCategories.includes("operational_recovery")) &&
    stack?.executiveStabilityActive
  ) {
    candidates.push(
      createOutcome({
        decisionCategory: "recovery",
        impactLevel: "significant",
        propagationType: "localized",
        summary:
          "Recovery acceleration after resilience strategy correlates with executive stability governance — positive recovery outcome pattern.",
        observations: ["recovery_acceleration", "executive_stability", "positive_correlation"],
        confidence: 0.84,
        linkedMemoryIds: memoryIds,
        now,
      })
    );
  }

  if (stack?.strategicCalibrationActive && continuityPreserved && !fragilityElevated) {
    candidates.push(
      createOutcome({
        decisionCategory: "operational",
        impactLevel: "moderate",
        propagationType: "isolated",
        summary:
          "Operational prioritization under calibration correlates with localized stability improvements without systemic propagation.",
        observations: ["localized_stability", "calibration_outcome", "minimal_propagation"],
        confidence: 0.72,
        linkedMemoryIds: memoryIds,
        now,
      })
    );
  }

  if (stack?.pressureGovernanceActive && adaptationTypes.includes("pressure_absorption")) {
    candidates.push(
      createOutcome({
        decisionCategory: "governance",
        impactLevel: "moderate",
        propagationType: "distributed",
        summary:
          "Pressure governance interventions correlate with operational pressure redistribution rather than collapse.",
        observations: ["pressure_redistribution", "governance_intervention", "absorption"],
        confidence: 0.77,
        linkedMemoryIds: memoryIds,
        now,
      })
    );
  }

  return candidates.filter((c) => shouldRetainDecisionOutcome(c, evidence));
}

function buildConsequencePatterns(
  outcomes: readonly InstitutionalDecisionRecord[]
): ExecutiveConsequencePattern[] {
  const byCategory = new Map<DecisionCategory, InstitutionalDecisionRecord[]>();
  for (const o of outcomes) {
    const list = byCategory.get(o.decisionCategory) ?? [];
    list.push(o);
    byCategory.set(o.decisionCategory, list);
  }

  const patterns: ExecutiveConsequencePattern[] = [];
  for (const [decisionCategory, group] of byCategory) {
    if (group.length === 0) continue;
    const anchor = group[0]!;
    patterns.push({
      patternId: stableSignature(["consequence-pattern", decisionCategory, anchor.decisionOutcomeId]).slice(
        0,
        48
      ),
      decisionCategory,
      impactLevel: group.reduce<DecisionImpactLevel>((best, o) => {
        const ranks: Record<DecisionImpactLevel, number> = {
          minimal: 1,
          moderate: 2,
          significant: 3,
          major: 4,
          systemic: 5,
        };
        return ranks[o.impactLevel] > ranks[best] ? o.impactLevel : best;
      }, "minimal"),
      lesson: `Executive consequence pattern: ${anchor.summary}`,
      outcomeIds: Object.freeze(group.map((o) => o.decisionOutcomeId)),
      linkedMemoryIds: Object.freeze(
        Array.from(new Set(group.flatMap((o) => [...o.linkedMemoryIds]))).slice(0, 10)
      ),
      firstObservedAt: Math.min(...group.map((o) => o.generatedAt)),
      lastObservedAt: Math.max(...group.map((o) => o.lastObservedAt)),
      occurrenceCount: group.reduce((sum, o) => sum + o.occurrenceCount, 0),
    });
  }
  return patterns;
}

function buildStrategicCorrelations(
  outcomes: readonly InstitutionalDecisionRecord[]
): StrategicOutcomeCorrelation[] {
  return outcomes
    .filter((o) => o.impactLevel === "significant" || o.impactLevel === "major" || o.impactLevel === "systemic")
    .slice(0, 6)
    .map((o) => ({
      correlationId: stableSignature(["strategic-outcome", o.decisionOutcomeId]).slice(0, 48),
      decisionCategory: o.decisionCategory,
      propagationType: o.propagationType,
      summary: o.summary,
      linkedOutcomeIds: Object.freeze([o.decisionOutcomeId]),
      generatedAt: o.generatedAt,
    }));
}

function buildOutcomeSnapshot(
  organizationId: string,
  storeState: ReturnType<ReturnType<typeof getDecisionOutcomeStore>["getState"]>,
  now: number
): DecisionOutcomeSnapshot {
  const summary =
    storeState.decisions.length === 0
      ? "Decision outcome learning awaiting sufficient institutional adaptation depth."
      : `Tracked ${storeState.decisions.length} institutional decision consequence patterns for executive awareness.`;

  return {
    signature: storeState.signature,
    organizationId,
    generatedAt: now,
    outcomeCount: storeState.decisions.length,
    patternCount: storeState.patterns.length,
    consequenceSummary: summary,
    dominantCategories: Object.freeze(
      Array.from(new Set(storeState.decisions.map((d) => d.decisionCategory))).slice(0, 4)
    ),
    recentOutcomes: Object.freeze(storeState.decisions.slice(0, 6)),
    consequencePatterns: Object.freeze(storeState.patterns.slice(0, 6)),
    strategicCorrelations: Object.freeze(storeState.correlations.slice(0, 6)),
  };
}

export type InstitutionalDecisionOutcomeResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: DecisionOutcomeSnapshot | null;
  newOutcomes: number;
  storeSignature: string;
};

export function evaluateInstitutionalDecisionOutcomes(
  input: InstitutionalDecisionOutcomeInput
): InstitutionalDecisionOutcomeResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginDecisionOutcomeEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_outcome_guard",
      snapshot: null,
      newOutcomes: 0,
      storeSignature: "",
    };
  }

  try {
    const memoryState = getInstitutionalMemoryStore(organizationId).getState();
    const correlationState = getInstitutionalCorrelationStore(organizationId).getState();
    const adaptationState = getAdaptationRecoveryStore(organizationId).getState();

    if (
      memoryState.records.length < 2 &&
      correlationState.correlations.length === 0 &&
      adaptationState.adaptations.length === 0
    ) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_institutional_depth",
        snapshot: null,
        newOutcomes: 0,
        storeSignature: "",
      };
    }

    const store = getDecisionOutcomeStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-2-4-outcome-eval",
      organizationId,
      memoryState.signature,
      correlationState.signature,
      adaptationState.signature,
      input.cognitionSnapshot?.signature ?? "no-cognition",
    ]);

    if (
      !shouldEvaluateDecisionOutcomes(
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
        snapshot:
          prior.decisions.length > 0
            ? buildOutcomeSnapshot(organizationId, prior, now)
            : null,
        newOutcomes: 0,
        storeSignature: prior.signature,
      };
    }

    const correlationCategories = correlationState.correlations.map((c) => c.category);
    const adaptationTypes = adaptationState.adaptations.map((a) => a.adaptationType);
    const memoryIds = memoryState.records.map((r) => r.memoryId).slice(0, 8);
    const priorCount = prior.decisions.length;

    const candidates = inferDecisionOutcomes(
      input,
      correlationCategories,
      adaptationTypes,
      memoryIds,
      now
    );

    if (candidates.length > 0) {
      store.upsertDecisions(candidates, now);
    }

    const afterDecisions = store.getState();
    const patterns = buildConsequencePatterns(afterDecisions.decisions);
    if (patterns.length > 0) {
      store.upsertPatterns(patterns, now);
    }

    const strategicCorrelations = buildStrategicCorrelations(afterDecisions.decisions);
    if (strategicCorrelations.length > 0) {
      store.upsertCorrelations(strategicCorrelations, now);
    }

    const observations: OperationalOutcomeObservation[] = afterDecisions.decisions
      .filter((d) => d.impactLevel !== "minimal")
      .slice(0, 4)
      .map((d) => ({
        observationId: stableSignature(["outcome-obs", d.decisionOutcomeId]).slice(0, 40),
        label: d.decisionCategory,
        impactLevel: d.impactLevel,
        summary: d.summary,
        generatedAt: now,
      }));
    if (observations.length > 0) {
      store.upsertObservations(observations, now);
    }

    store.setLastEvaluationSignature(evaluationSignature);
    const finalState = store.getState();
    const newOutcomes = Math.max(0, finalState.decisions.length - priorCount);

    const strong = finalState.decisions.find(
      (d) => d.impactLevel === "significant" || d.impactLevel === "systemic"
    );
    if (strong && newOutcomes > 0) {
      devLog(`consequence pattern — ${strong.decisionCategory}: ${strong.summary.slice(0, 72)}`);
    }

    const snapshot = buildOutcomeSnapshot(organizationId, finalState, now);

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newOutcomes,
      storeSignature: finalState.signature,
    };
  } finally {
    endDecisionOutcomeEvaluation();
  }
}
