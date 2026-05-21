import { stableSignature } from "../intelligence/shared/dedupe";
import { getAdaptationRecoveryStore } from "./adaptationRecoveryStore";
import { getDecisionOutcomeStore } from "./decisionOutcomeStore";
import { getInstitutionalDistillationStore } from "./institutionalDistillationStore";
import { getInstitutionalCorrelationStore } from "./institutionalCorrelationStore";
import { getInstitutionalMemoryStore } from "./institutionalMemoryStore";
import { getInstitutionalRecallStore } from "./institutionalRecallStore";
import {
  beginInstitutionalMaturityEvaluation,
  endInstitutionalMaturityEvaluation,
  maturityRank,
  shouldAllowMaturityInflation,
  shouldEvaluateInstitutionalMaturity,
  shouldRetainMaturitySnapshot,
  trendRank,
} from "./institutionalMaturityGuards";
import { getInstitutionalMaturityStore } from "./institutionalMaturityStore";
import type {
  CognitiveEvolutionObservation,
  EvolutionTrend,
  InstitutionalIntelligenceMaturitySnapshot,
  InstitutionalLearningEvolutionInput,
  InstitutionalMaturityLevel,
  InstitutionalMaturitySnapshot,
  IntelligenceMaturitySignal,
  MaturityCategory,
  OrganizationalLearningEvolution,
  ResilienceMaturityTrend,
  StrategicAdaptationProgress,
} from "./institutionalMaturityTypes";

const DEV_LOG_PREFIX = "[Nexora][InstitutionalMaturity]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildSnapshotId(category: MaturityCategory, observations: string[]): string {
  return stableSignature(["maturity-snapshot", category, ...observations.sort().slice(0, 4)]).slice(
    0,
    56
  );
}

function createMaturitySnapshot(params: {
  category: MaturityCategory;
  maturityLevel: InstitutionalMaturityLevel;
  evolutionTrend: EvolutionTrend;
  summary: string;
  observations: string[];
  confidence: number;
  now: number;
}): InstitutionalMaturitySnapshot {
  const observations = Object.freeze(params.observations.slice(0, 6));
  return {
    maturitySnapshotId: buildSnapshotId(params.category, [...observations]),
    maturityLevel: params.maturityLevel,
    evolutionTrend: params.evolutionTrend,
    category: params.category,
    summary: params.summary,
    observations,
    confidence: Number(Math.min(0.94, Math.max(0.45, params.confidence)).toFixed(2)),
    generatedAt: params.now,
    lastObservedAt: params.now,
    occurrenceCount: 1,
  };
}

function computeEvidenceDepth(
  memoryCount: number,
  correlationCount: number,
  adaptationCount: number,
  outcomeCount: number,
  insightCount: number,
  recallCount: number
): number {
  return memoryCount + correlationCount + adaptationCount + outcomeCount + insightCount + recallCount;
}

function inferMaturitySnapshots(
  input: InstitutionalLearningEvolutionInput,
  correlationCategories: readonly string[],
  adaptationTypes: readonly string[],
  outcomeCategories: readonly string[],
  recallCategories: readonly string[],
  distilledCategories: readonly string[],
  evidenceDepth: number,
  priorMaturity: InstitutionalMaturityLevel | null,
  fragilityElevated: boolean,
  continuityPreserved: boolean,
  now: number
): InstitutionalMaturitySnapshot[] {
  const stack = input.cognitionSnapshot;
  const candidates: InstitutionalMaturitySnapshot[] = [];

  const hasEscalationReduction =
    !correlationCategories.includes("escalation_chain") &&
    adaptationTypes.includes("governance_stabilization");
  const hasRecoveryAcceleration =
    adaptationTypes.includes("recovery_cycle") ||
    adaptationTypes.includes("pressure_absorption") ||
    outcomeCategories.includes("recovery");

  if (hasRecoveryAcceleration && (hasEscalationReduction || continuityPreserved)) {
    const level: InstitutionalMaturityLevel = shouldAllowMaturityInflation(
      "adaptive",
      priorMaturity,
      evidenceDepth
    )
      ? evidenceDepth >= 6
        ? "resilient"
        : "adaptive"
      : "unstable";
    if (shouldAllowMaturityInflation(level, priorMaturity, evidenceDepth)) {
      candidates.push(
        createMaturitySnapshot({
          category: "resilience",
          maturityLevel: level,
          evolutionTrend: evidenceDepth >= 6 ? "accelerating" : "improving",
          summary:
            "The organization demonstrates improving operational resilience maturity through reduced escalation frequency and faster recovery stabilization.",
          observations: [
            "improved_recovery_speed",
            "reduced_fragility_growth",
            "pressure_absorption_improvement",
          ],
          confidence: 0.84,
          now,
        })
      );
    }
  }

  if (
    correlationCategories.includes("governance_pressure") &&
    correlationCategories.includes("escalation_chain") &&
    !adaptationTypes.includes("governance_stabilization")
  ) {
    candidates.push(
      createMaturitySnapshot({
        category: "governance",
        maturityLevel: "unstable",
        evolutionTrend: "regressing",
        summary:
          "Repeated governance instability without improvement indicates institutional learning stagnation — governance maturity is regressing.",
        observations: ["governance_instability", "escalation_recurrence", "stagnation_signal"],
        confidence: 0.81,
        now,
      })
    );
  }

  if (
    adaptationTypes.includes("pressure_absorption") &&
    adaptationTypes.includes("coordination_recovery")
  ) {
    candidates.push(
      createMaturitySnapshot({
        category: "coordination",
        maturityLevel: "adaptive",
        evolutionTrend: "improving",
        summary:
          "Improved pressure absorption consistency and coordination recovery indicate adaptive maturity evolution across operational systems.",
        observations: [
          "pressure_absorption_consistency",
          "coordination_recovery",
          "adaptive_evolution",
        ],
        confidence: 0.8,
        now,
      })
    );
  }

  if (
    !correlationCategories.includes("coordination_breakdown") &&
    adaptationTypes.includes("coordination_recovery")
  ) {
    candidates.push(
      createMaturitySnapshot({
        category: "coordination",
        maturityLevel: "resilient",
        evolutionTrend: "improving",
        summary:
          "Recurring coordination failures are decreasing — coordination maturity is increasing through consistent operational learning.",
        observations: ["coordination_failures_decreasing", "coordination_maturity_increase"],
        confidence: 0.82,
        now,
      })
    );
  }

  if (
    fragilityElevated &&
    (correlationCategories.includes("fragility_cycle") ||
      correlationCategories.includes("escalation_chain") ||
      correlationCategories.includes("systemic_instability"))
  ) {
    const stagnation =
      !adaptationTypes.includes("fragility_reduction") ||
      correlationCategories.includes("escalation_chain");
    if (stagnation) {
      candidates.push(
        createMaturitySnapshot({
          category: "fragility",
          maturityLevel: "reactive",
          evolutionTrend: fragilityElevated ? "stagnant" : "inconsistent",
          summary:
            "Persistent fragility despite repeated intervention signals institutional learning stagnation — organization remains reactively unstable.",
          observations: [
            "persistent_fragility",
            "failed_intervention_pattern",
            "learning_stagnation",
          ],
          confidence: 0.86,
          now,
        })
      );
    }
  }

  if (
    adaptationTypes.includes("resilience_growth") &&
    distilledCategories.includes("strategic") &&
    evidenceDepth >= 6
  ) {
    const level: InstitutionalMaturityLevel = shouldAllowMaturityInflation(
      "strategically_mature",
      priorMaturity,
      evidenceDepth
    )
      ? "strategically_mature"
      : "resilient";
    if (shouldAllowMaturityInflation(level, priorMaturity, evidenceDepth)) {
      candidates.push(
        createMaturitySnapshot({
          category: "strategic",
          maturityLevel: level,
          evolutionTrend: "accelerating",
          summary:
            "Long-term operational learning consistency across resilience, governance, and strategic distillation indicates strategically mature institutional intelligence.",
          observations: [
            "long_horizon_learning",
            "strategic_consistency",
            "maturity_acceleration",
          ],
          confidence: 0.88,
          now,
        })
      );
    }
  }

  if (hasEscalationReduction) {
    candidates.push(
      createMaturitySnapshot({
        category: "operational",
        maturityLevel: "adaptive",
        evolutionTrend: "improving",
        summary:
          "Reduced escalation frequency over time indicates operational learning improvement — organization is adapting from prior instability cycles.",
        observations: ["reduced_escalation_frequency", "operational_learning_improvement"],
        confidence: 0.79,
        now,
      })
    );
  }

  if (
    correlationCategories.includes("systemic_instability") &&
    recallCategories.includes("fragility")
  ) {
    candidates.push(
      createMaturitySnapshot({
        category: "operational",
        maturityLevel: "unstable",
        evolutionTrend: "inconsistent",
        summary:
          "Inconsistent recovery patterns combined with historical fragility recall indicate unstable operational maturity — learning is partial and uneven.",
        observations: ["inconsistent_recovery", "historical_fragility_parallel"],
        confidence: 0.77,
        now,
      })
    );
  }

  if (stack?.executiveStabilityActive && stack?.organizationalEvolutionActive && !fragilityElevated) {
    candidates.push(
      createMaturitySnapshot({
        category: "recovery",
        maturityLevel: "adaptive",
        evolutionTrend: "improving",
        summary:
          "Executive stability and organizational evolution signals align with improving recovery maturity — adaptation progression is observable.",
        observations: ["executive_stability", "organizational_evolution_active"],
        confidence: 0.75,
        now,
      })
    );
  }

  return candidates.filter((c) => shouldRetainMaturitySnapshot(c, evidenceDepth));
}

function buildLearningEvolutions(
  snapshots: readonly InstitutionalMaturitySnapshot[]
): OrganizationalLearningEvolution[] {
  const byCategory = new Map<MaturityCategory, InstitutionalMaturitySnapshot[]>();
  for (const s of snapshots) {
    const list = byCategory.get(s.category) ?? [];
    list.push(s);
    byCategory.set(s.category, list);
  }

  const evolutions: OrganizationalLearningEvolution[] = [];
  for (const [category, group] of byCategory) {
    if (group.length === 0) continue;
    const anchor = group[0]!;
    evolutions.push({
      evolutionId: stableSignature(["learning-evolution", category, anchor.maturitySnapshotId]).slice(
        0,
        48
      ),
      category,
      maturityLevel: group.reduce<InstitutionalMaturityLevel>((best, s) => {
        return maturityRank(s.maturityLevel) > maturityRank(best) ? s.maturityLevel : best;
      }, "reactive"),
      evolutionTrend: group.reduce<EvolutionTrend>((best, s) => {
        return trendRank(s.evolutionTrend) > trendRank(best) ? s.evolutionTrend : best;
      }, "stagnant"),
      progressionSummary: `Organizational learning evolution in ${category}: ${anchor.summary}`,
      snapshotIds: Object.freeze(group.map((s) => s.maturitySnapshotId)),
      firstObservedAt: Math.min(...group.map((s) => s.generatedAt)),
      lastObservedAt: Math.max(...group.map((s) => s.lastObservedAt)),
      occurrenceCount: group.reduce((sum, s) => sum + s.occurrenceCount, 0),
    });
  }
  return evolutions;
}

function buildMaturitySignals(
  snapshots: readonly InstitutionalMaturitySnapshot[],
  now: number
): IntelligenceMaturitySignal[] {
  return snapshots.slice(0, 6).map((s) => {
    let signalType: IntelligenceMaturitySignal["signalType"] = "stability";
    if (s.evolutionTrend === "regressing" || s.evolutionTrend === "stagnant") {
      signalType = s.evolutionTrend === "regressing" ? "regression" : "stagnation";
    } else if (s.evolutionTrend === "improving" || s.evolutionTrend === "accelerating") {
      signalType = "growth";
    }
    return {
      signalId: stableSignature(["maturity-signal", s.maturitySnapshotId]).slice(0, 48),
      category: s.category,
      signalType,
      summary: s.summary,
      confidence: s.confidence,
      generatedAt: now,
    };
  });
}

function buildResilienceTrends(
  snapshots: readonly InstitutionalMaturitySnapshot[],
  now: number
): ResilienceMaturityTrend[] {
  return snapshots
    .filter((s) => s.category === "resilience" || s.category === "recovery")
    .slice(0, 4)
    .map((s) => ({
      trendId: stableSignature(["resilience-trend", s.maturitySnapshotId]).slice(0, 48),
      evolutionTrend: s.evolutionTrend,
      maturityLevel: s.maturityLevel,
      summary: s.summary,
      linkedSnapshotIds: Object.freeze([s.maturitySnapshotId]),
      generatedAt: now,
    }));
}

function buildAdaptationProgress(
  snapshots: readonly InstitutionalMaturitySnapshot[],
  now: number
): StrategicAdaptationProgress[] {
  return snapshots
    .filter((s) => s.maturityLevel === "adaptive" || s.maturityLevel === "resilient")
    .slice(0, 6)
    .map((s) => ({
      progressId: stableSignature(["adaptation-progress", s.maturitySnapshotId]).slice(0, 48),
      category: s.category,
      maturityLevel: s.maturityLevel,
      adaptationSummary: s.summary,
      generatedAt: now,
    }));
}

function buildEvolutionObservations(
  snapshots: readonly InstitutionalMaturitySnapshot[],
  now: number
): CognitiveEvolutionObservation[] {
  return snapshots.slice(0, 4).map((s) => ({
    observationId: stableSignature(["cognitive-evolution-obs", s.maturitySnapshotId]).slice(0, 48),
    label: s.category,
    maturityLevel: s.maturityLevel,
    summary: s.summary,
    generatedAt: now,
  }));
}

function resolveDominantMaturity(
  snapshots: readonly InstitutionalMaturitySnapshot[]
): InstitutionalMaturityLevel {
  if (snapshots.length === 0) return "reactive";
  return snapshots.reduce<InstitutionalMaturityLevel>((best, s) => {
    return maturityRank(s.maturityLevel) > maturityRank(best) ? s.maturityLevel : best;
  }, "reactive");
}

function resolveDominantTrend(snapshots: readonly InstitutionalMaturitySnapshot[]): EvolutionTrend {
  if (snapshots.length === 0) return "stagnant";
  return snapshots.reduce<EvolutionTrend>((best, s) => {
    return trendRank(s.evolutionTrend) > trendRank(best) ? s.evolutionTrend : best;
  }, "stagnant");
}

function buildMaturityAggregateSnapshot(
  organizationId: string,
  storeState: ReturnType<ReturnType<typeof getInstitutionalMaturityStore>["getState"]>,
  now: number
): InstitutionalIntelligenceMaturitySnapshot {
  const dominantMaturityLevel = resolveDominantMaturity(storeState.snapshots);
  const dominantEvolutionTrend = resolveDominantTrend(storeState.snapshots);
  const summary =
    storeState.snapshots.length === 0
      ? "Institutional maturity evaluation awaiting sufficient organizational learning depth."
      : `Organization exhibits ${dominantMaturityLevel} institutional intelligence with ${dominantEvolutionTrend} learning evolution.`;

  return {
    signature: storeState.signature,
    organizationId,
    generatedAt: now,
    snapshotCount: storeState.snapshots.length,
    dominantMaturityLevel,
    dominantEvolutionTrend,
    maturitySummary: summary,
    dominantCategories: Object.freeze(
      Array.from(new Set(storeState.snapshots.map((s) => s.category))).slice(0, 4)
    ),
    recentSnapshots: Object.freeze(storeState.snapshots.slice(0, 6)),
    learningEvolutions: Object.freeze(storeState.evolutions.slice(0, 6)),
    maturitySignals: Object.freeze(storeState.signals.slice(0, 6)),
    resilienceTrends: Object.freeze(storeState.resilienceTrends.slice(0, 4)),
    adaptationProgress: Object.freeze(storeState.adaptationProgress.slice(0, 6)),
  };
}

export type InstitutionalLearningEvolutionResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: InstitutionalIntelligenceMaturitySnapshot | null;
  newSnapshots: number;
  storeSignature: string;
  maturityTransition?: {
    from: InstitutionalMaturityLevel | null;
    to: InstitutionalMaturityLevel;
  };
};

export function evaluateInstitutionalLearningEvolution(
  input: InstitutionalLearningEvolutionInput
): InstitutionalLearningEvolutionResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginInstitutionalMaturityEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_maturity_guard",
      snapshot: null,
      newSnapshots: 0,
      storeSignature: "",
    };
  }

  try {
    const memoryState = getInstitutionalMemoryStore(organizationId).getState();
    const correlationState = getInstitutionalCorrelationStore(organizationId).getState();
    const adaptationState = getAdaptationRecoveryStore(organizationId).getState();
    const outcomeState = getDecisionOutcomeStore(organizationId).getState();
    const distillationState = getInstitutionalDistillationStore(organizationId).getState();
    const recallState = getInstitutionalRecallStore(organizationId).getState();

    const depth =
      memoryState.records.length +
      correlationState.correlations.length +
      adaptationState.adaptations.length +
      outcomeState.decisions.length +
      distillationState.insights.length +
      recallState.recalls.length;

    if (depth < 4) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_institutional_depth",
        snapshot: null,
        newSnapshots: 0,
        storeSignature: "",
      };
    }

    const store = getInstitutionalMaturityStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-2-7-maturity-eval",
      organizationId,
      memoryState.signature,
      correlationState.signature,
      adaptationState.signature,
      outcomeState.signature,
      distillationState.signature,
      recallState.signature,
      input.cognitionSnapshot?.signature ?? "no-cognition",
    ]);

    if (
      !shouldEvaluateInstitutionalMaturity(
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
          prior.snapshots.length > 0
            ? buildMaturityAggregateSnapshot(organizationId, prior, now)
            : null,
        newSnapshots: 0,
        storeSignature: prior.signature,
      };
    }

    const correlationCategories = correlationState.correlations.map((c) => c.category);
    const adaptationTypes = adaptationState.adaptations.map((a) => a.adaptationType);
    const outcomeCategories = outcomeState.decisions.map((d) => d.decisionCategory);
    const recallCategories = recallState.recalls.map((r) => r.category);
    const distilledCategories = distillationState.insights.map((i) => i.category);
    const evidenceDepth = computeEvidenceDepth(
      memoryState.records.length,
      correlationState.correlations.length,
      adaptationState.adaptations.length,
      outcomeState.decisions.length,
      distillationState.insights.length,
      recallState.recalls.length
    );
    const priorCount = prior.snapshots.length;
    const priorMaturity = prior.lastDominantMaturityLevel;

    const candidates = inferMaturitySnapshots(
      input,
      correlationCategories,
      adaptationTypes,
      outcomeCategories,
      recallCategories,
      distilledCategories,
      evidenceDepth,
      priorMaturity,
      input.fragilityElevated ?? false,
      input.continuityPreserved ?? true,
      now
    );

    if (candidates.length > 0) {
      store.upsertSnapshots(candidates, now);
    }

    const afterSnapshots = store.getState();
    const evolutions = buildLearningEvolutions(afterSnapshots.snapshots);
    if (evolutions.length > 0) {
      store.upsertEvolutions(evolutions, now);
    }

    const signals = buildMaturitySignals(afterSnapshots.snapshots, now);
    if (signals.length > 0) {
      store.upsertSignals(signals, now);
    }

    const resilienceTrends = buildResilienceTrends(afterSnapshots.snapshots, now);
    if (resilienceTrends.length > 0) {
      store.upsertResilienceTrends(resilienceTrends, now);
    }

    const adaptationProgress = buildAdaptationProgress(afterSnapshots.snapshots, now);
    if (adaptationProgress.length > 0) {
      store.upsertAdaptationProgress(adaptationProgress, now);
    }

    const observations = buildEvolutionObservations(afterSnapshots.snapshots, now);
    if (observations.length > 0) {
      store.upsertObservations(observations, now);
    }

    store.setLastEvaluationSignature(evaluationSignature);
    const finalState = store.getState();
    const newSnapshots = Math.max(0, finalState.snapshots.length - priorCount);
    const dominant = resolveDominantMaturity(finalState.snapshots);
    store.setLastDominantMaturityLevel(dominant);

    const maturityTransition =
      priorMaturity && priorMaturity !== dominant
        ? { from: priorMaturity, to: dominant }
        : undefined;

    if (maturityTransition) {
      devLog(
        `maturity transition — ${maturityTransition.from} → ${maturityTransition.to}: ${dominant}`
      );
    }

    const stagnation = finalState.signals.find((s) => s.signalType === "stagnation");
    if (stagnation && newSnapshots > 0) {
      devLog(`stagnation detected — ${stagnation.category}: ${stagnation.summary.slice(0, 72)}`);
    }

    const growth = finalState.snapshots.find(
      (s) => s.evolutionTrend === "improving" || s.evolutionTrend === "accelerating"
    );
    if (growth && newSnapshots > 0 && !maturityTransition) {
      devLog(`resilience evolution — ${growth.category}: ${growth.summary.slice(0, 72)}`);
    }

    const snapshot = buildMaturityAggregateSnapshot(organizationId, finalState, now);

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newSnapshots,
      storeSignature: finalState.signature,
      maturityTransition,
    };
  } finally {
    endInstitutionalMaturityEvaluation();
  }
}
