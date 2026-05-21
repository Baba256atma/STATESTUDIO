import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginAdaptationRecoveryEvaluation,
  endAdaptationRecoveryEvaluation,
  shouldEvaluateAdaptationRecovery,
  shouldRetainAdaptationRecord,
  validateAdaptationRecord,
} from "./adaptationRecoveryGuards";
import { getAdaptationRecoveryStore } from "./adaptationRecoveryStore";
import { getInstitutionalCorrelationStore } from "./institutionalCorrelationStore";
import { getInstitutionalMemoryStore } from "./institutionalMemoryStore";
import type {
  AdaptationBehaviorType,
  AdaptationRecoverySnapshot,
  OrganizationalAdaptationMemoryInput,
  OrganizationalAdaptationRecord,
  RecoveryIntelligenceSignal,
  RecoveryStabilityLevel,
  ResilienceEvolutionObservation,
  StrategicRecoveryPattern,
} from "./adaptationRecoveryTypes";
import type { InstitutionalMemoryRecord } from "./institutionalMemoryTypes";

const DEV_LOG_PREFIX = "[Nexora][RecoveryIntelligence]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildAdaptationId(type: AdaptationBehaviorType, memoryIds: string[]): string {
  return stableSignature(["adaptation", type, ...memoryIds.sort().slice(0, 4)]).slice(0, 56);
}

function hasRecoverySignal(records: readonly InstitutionalMemoryRecord[]): boolean {
  return records.some((r) => r.category === "recovery" || r.category === "resilience");
}

function inferOverallStability(
  adaptations: readonly OrganizationalAdaptationRecord[],
  fragilityElevated: boolean,
  continuityPreserved: boolean
): RecoveryStabilityLevel {
  if (fragilityElevated && !continuityPreserved) return "unstable";
  if (adaptations.some((a) => a.recoveryStability === "highly_resilient")) return "highly_resilient";
  if (adaptations.some((a) => a.recoveryStability === "resilient")) return "resilient";
  if (adaptations.some((a) => a.recoveryStability === "adaptive")) return "adaptive";
  if (adaptations.length > 0) return "weak";
  return "unstable";
}

function createAdaptation(params: {
  adaptationType: AdaptationBehaviorType;
  recoveryStability: RecoveryStabilityLevel;
  summary: string;
  observations: string[];
  confidence: number;
  linkedMemoryIds: string[];
  now: number;
}): OrganizationalAdaptationRecord {
  const linked = Object.freeze(params.linkedMemoryIds.slice(0, 8));
  return {
    adaptationId: buildAdaptationId(params.adaptationType, [...linked]),
    adaptationType: params.adaptationType,
    recoveryStability: params.recoveryStability,
    summary: params.summary,
    observations: Object.freeze(params.observations.slice(0, 6)),
    confidence: Number(Math.min(0.92, Math.max(0.35, params.confidence)).toFixed(2)),
    generatedAt: params.now,
    lastObservedAt: params.now,
    occurrenceCount: 1,
    linkedMemoryIds: linked,
  };
}

function inferAdaptations(
  records: readonly InstitutionalMemoryRecord[],
  correlationCategories: readonly string[],
  stack: OrganizationalAdaptationMemoryInput["cognitionSnapshot"],
  fragilityElevated: boolean,
  continuityPreserved: boolean,
  now: number
): OrganizationalAdaptationRecord[] {
  const recovery = records.filter((r) => r.category === "recovery");
  const resilience = records.filter((r) => r.category === "resilience");
  const escalation = records.filter((r) => r.category === "escalation");
  const governance = records.filter((r) => r.category === "governance");
  const fragility = records.filter((r) => r.category === "fragility");
  const recoveryLinked = hasRecoverySignal(records);

  const candidates: OrganizationalAdaptationRecord[] = [];

  if (recovery.length > 0 && escalation.length > 0) {
    const linked = [...recovery, ...escalation].map((r) => r.memoryId);
    const recurrence = recovery.reduce((m, r) => Math.max(m, r.recurrenceCount), 0);
    candidates.push(
      createAdaptation({
        adaptationType: "recovery_cycle",
        recoveryStability: recurrence >= 2 ? "adaptive" : "weak",
        summary:
          "Organization demonstrates stabilization cycles following escalation — recovery habits forming across pressure events.",
        observations: ["post_escalation_stabilization", "recovery_cycle"],
        confidence: 0.72 + (recurrence >= 2 ? 0.1 : 0),
        linkedMemoryIds: linked,
        now,
      })
    );
  }

  if (
    correlationCategories.includes("operational_recovery") ||
    correlationCategories.includes("resilience_growth")
  ) {
    const linked = [...recovery, ...resilience].map((r) => r.memoryId);
    if (linked.length >= 1) {
      candidates.push(
        createAdaptation({
          adaptationType: "resilience_growth",
          recoveryStability: "resilient",
          summary:
            "Correlated learning indicates resilience growth — organization adapting with strengthening recovery patterns.",
          observations: ["resilience_strengthening", "institutional_learning"],
          confidence: 0.8,
          linkedMemoryIds: linked.length > 0 ? linked : records.slice(0, 2).map((r) => r.memoryId),
          now,
        })
      );
    }
  }

  if (!fragilityElevated && fragility.length > 0 && recovery.length > 0) {
    candidates.push(
      createAdaptation({
        adaptationType: "fragility_reduction",
        recoveryStability: "adaptive",
        summary:
          "Fragility reduction trend observed after recovery events — operational pressure absorption improving.",
        observations: ["fragility_reduction", "pressure_absorption"],
        confidence: 0.76,
        linkedMemoryIds: [...fragility, ...recovery].map((r) => r.memoryId),
        now,
      })
    );
  }

  if (governance.length > 0 && (recovery.length > 0 || stack?.executiveStabilityActive)) {
    candidates.push(
      createAdaptation({
        adaptationType: "governance_stabilization",
        recoveryStability: stack?.governanceOversightActive ? "adaptive" : "weak",
        summary:
          "Governance stabilization behavior follows instability — oversight and stability governance engaged during recovery.",
        observations: ["governance_stabilization", "oversight_recovery"],
        confidence: 0.74,
        linkedMemoryIds: [...governance, ...recovery].map((r) => r.memoryId).slice(0, 6),
        now,
      })
    );
  }

  if (
    stack?.executiveStabilityActive &&
    stack.pressureGovernanceActive &&
    !fragilityElevated
  ) {
    candidates.push(
      createAdaptation({
        adaptationType: "pressure_absorption",
        recoveryStability: continuityPreserved ? "resilient" : "adaptive",
        summary:
          "Pressure absorption without systemic collapse — executive stability governance holding under sustained load.",
        observations: ["pressure_absorption", "executive_stability"],
        confidence: 0.78,
        linkedMemoryIds: records
          .filter((r) => ["recovery", "resilience", "governance"].includes(r.category))
          .map((r) => r.memoryId)
          .slice(0, 6),
        now,
      })
    );
  }

  if (resilience.length > 0 && stack?.cognitiveEvolutionActive) {
    candidates.push(
      createAdaptation({
        adaptationType: "resilience_growth",
        recoveryStability: "highly_resilient",
        summary:
          "Resilience evolution aligns with cognitive maturity — organization demonstrates increasing resilience and faster stabilization.",
        observations: ["resilience_growth", "cognitive_maturity"],
        confidence: 0.83,
        linkedMemoryIds: resilience.map((r) => r.memoryId),
        now,
      })
    );
  }

  if (records.some((r) => r.category === "coordination") && recovery.length > 0) {
    candidates.push(
      createAdaptation({
        adaptationType: "coordination_recovery",
        recoveryStability: "adaptive",
        summary:
          "Coordination recovery observed after cross-system strain — operational adjustment stabilizing dependencies.",
        observations: ["coordination_recovery", "operational_adjustment"],
        confidence: 0.7,
        linkedMemoryIds: records
          .filter((r) => r.category === "coordination" || r.category === "recovery")
          .map((r) => r.memoryId),
        now,
      })
    );
  }

  if (stack?.organizationalEvolutionActive && recoveryLinked) {
    candidates.push(
      createAdaptation({
        adaptationType: "operational_adjustment",
        recoveryStability: "adaptive",
        summary:
          "Operational adjustment cycles correlate with organizational evolution — adaptation learning forming under recovery.",
        observations: ["operational_adjustment", "evolution_recovery"],
        confidence: 0.71,
        linkedMemoryIds: records.slice(0, 4).map((r) => r.memoryId),
        now,
      })
    );
  }

  return candidates.filter((c) => shouldRetainAdaptationRecord(c, recoveryLinked));
}

function buildPatternsFromAdaptations(
  adaptations: readonly OrganizationalAdaptationRecord[]
): StrategicRecoveryPattern[] {
  const byType = new Map<AdaptationBehaviorType, OrganizationalAdaptationRecord[]>();
  for (const a of adaptations) {
    const list = byType.get(a.adaptationType) ?? [];
    list.push(a);
    byType.set(a.adaptationType, list);
  }

  const patterns: StrategicRecoveryPattern[] = [];
  for (const [adaptationType, group] of byType) {
    if (group.length === 0) continue;
    const anchor = group[0]!;
    patterns.push({
      patternId: stableSignature(["recovery-pattern", adaptationType, anchor.adaptationId]).slice(
        0,
        48
      ),
      adaptationType,
      recoveryStability: group.reduce<RecoveryStabilityLevel>((best, a) => {
        const ranks: Record<RecoveryStabilityLevel, number> = {
          weak: 1,
          unstable: 2,
          adaptive: 3,
          resilient: 4,
          highly_resilient: 5,
        };
        return ranks[a.recoveryStability] > ranks[best] ? a.recoveryStability : best;
      }, "weak"),
      lesson: `Strategic recovery lesson: ${anchor.summary}`,
      adaptationIds: Object.freeze(group.map((a) => a.adaptationId)),
      linkedMemoryIds: Object.freeze(
        Array.from(new Set(group.flatMap((a) => [...a.linkedMemoryIds]))).slice(0, 10)
      ),
      firstObservedAt: Math.min(...group.map((a) => a.generatedAt)),
      lastObservedAt: Math.max(...group.map((a) => a.lastObservedAt)),
      occurrenceCount: group.reduce((sum, a) => sum + a.occurrenceCount, 0),
    });
  }
  return patterns;
}

function buildResilienceObservations(
  stack: OrganizationalAdaptationMemoryInput["cognitionSnapshot"],
  fragilityElevated: boolean,
  now: number
): ResilienceEvolutionObservation[] {
  const observations: ResilienceEvolutionObservation[] = [];

  if (stack?.resilienceForecastLine.includes("strengthen")) {
    observations.push({
      observationId: stableSignature(["res-obs", "strengthening", now]).slice(0, 40),
      trajectory: "strengthening",
      summary: stack.resilienceForecastLine,
      generatedAt: now,
    });
  } else if (fragilityElevated) {
    observations.push({
      observationId: stableSignature(["res-obs", "at_risk", now]).slice(0, 40),
      trajectory: "at_risk",
      summary: "Resilience trajectory at risk — recovery intelligence monitoring stabilization windows.",
      generatedAt: now,
    });
  } else if (stack?.executiveStabilityActive) {
    observations.push({
      observationId: stableSignature(["res-obs", "recovering", now]).slice(0, 40),
      trajectory: "recovering",
      summary: "Operational recovery adaptation forming under executive stability governance.",
      generatedAt: now,
    });
  }

  return observations;
}

function buildRecoverySnapshot(
  organizationId: string,
  storeState: ReturnType<ReturnType<typeof getAdaptationRecoveryStore>["getState"]>,
  overallStability: RecoveryStabilityLevel,
  now: number
): AdaptationRecoverySnapshot {
  const summary =
    storeState.adaptations.length === 0
      ? "Adaptation recovery intelligence awaiting correlated institutional learning depth."
      : `Organization demonstrates ${overallStability} recovery stability across ${storeState.adaptations.length} adaptation records.`;

  return {
    signature: storeState.signature,
    organizationId,
    generatedAt: now,
    adaptationCount: storeState.adaptations.length,
    patternCount: storeState.patterns.length,
    recoverySummary: summary,
    dominantAdaptationTypes: Object.freeze(
      Array.from(new Set(storeState.adaptations.map((a) => a.adaptationType))).slice(0, 4)
    ),
    recoveryStability: overallStability,
    recentAdaptations: Object.freeze(storeState.adaptations.slice(0, 6)),
    recoveryPatterns: Object.freeze(storeState.patterns.slice(0, 6)),
    resilienceObservations: Object.freeze(storeState.resilienceObservations.slice(0, 4)),
  };
}

export type OrganizationalAdaptationMemoryResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: AdaptationRecoverySnapshot | null;
  newAdaptations: number;
  storeSignature: string;
};

export function evaluateOrganizationalAdaptationMemory(
  input: OrganizationalAdaptationMemoryInput
): OrganizationalAdaptationMemoryResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();
  const fragilityElevated = input.fragilityElevated ?? false;
  const continuityPreserved = input.continuityPreserved ?? true;

  if (!beginAdaptationRecoveryEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_adaptation_guard",
      snapshot: null,
      newAdaptations: 0,
      storeSignature: "",
    };
  }

  try {
    const memoryState = getInstitutionalMemoryStore(organizationId).getState();
    const correlationState = getInstitutionalCorrelationStore(organizationId).getState();
    const records = memoryState.records;

    if (records.length < 2 && correlationState.correlations.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_learning_depth",
        snapshot: null,
        newAdaptations: 0,
        storeSignature: "",
      };
    }

    const store = getAdaptationRecoveryStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-2-3-adaptation-eval",
      organizationId,
      memoryState.signature,
      correlationState.signature,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      fragilityElevated,
      continuityPreserved,
    ]);

    if (
      !shouldEvaluateAdaptationRecovery(
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
          prior.adaptations.length > 0
            ? buildRecoverySnapshot(
                organizationId,
                prior,
                inferOverallStability(prior.adaptations, fragilityElevated, continuityPreserved),
                now
              )
            : null,
        newAdaptations: 0,
        storeSignature: prior.signature,
      };
    }

    const correlationCategories = correlationState.correlations.map((c) => c.category);
    const priorCount = prior.adaptations.length;

    const candidates = inferAdaptations(
      records,
      correlationCategories,
      input.cognitionSnapshot,
      fragilityElevated,
      continuityPreserved,
      now
    );

    if (candidates.length > 0) {
      store.upsertAdaptations(candidates, now);
    }

    const afterAdapt = store.getState();
    const patterns = buildPatternsFromAdaptations(afterAdapt.adaptations);
    if (patterns.length > 0) {
      store.upsertPatterns(patterns, now);
    }

    const signals: RecoveryIntelligenceSignal[] = afterAdapt.adaptations
      .filter((a) => a.recoveryStability === "adaptive" || a.recoveryStability === "resilient")
      .slice(0, 4)
      .map((a) => ({
        signalId: stableSignature(["signal", a.adaptationId]).slice(0, 40),
        label: a.adaptationType,
        stability: a.recoveryStability,
        summary: a.summary,
        generatedAt: now,
      }));
    if (signals.length > 0) {
      store.upsertSignals(signals, now);
    }

    const resilienceObs = buildResilienceObservations(
      input.cognitionSnapshot,
      fragilityElevated,
      now
    );
    if (resilienceObs.length > 0) {
      store.upsertResilienceObservations(resilienceObs, now);
    }

    store.setLastEvaluationSignature(evaluationSignature);
    const finalState = store.getState();
    const newAdaptations = Math.max(0, finalState.adaptations.length - priorCount);
    const overallStability = inferOverallStability(
      finalState.adaptations,
      fragilityElevated,
      continuityPreserved
    );

    if (newAdaptations > 0) {
      const highlight = finalState.adaptations.find(
        (a) => a.adaptationType === "resilience_growth" || a.adaptationType === "recovery_cycle"
      );
      if (highlight) {
        devLog(`adaptation pattern — ${highlight.adaptationType}: ${highlight.summary.slice(0, 72)}`);
      }
    }

    const snapshot = buildRecoverySnapshot(organizationId, finalState, overallStability, now);

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newAdaptations,
      storeSignature: finalState.signature,
    };
  } finally {
    endAdaptationRecoveryEvaluation();
  }
}
