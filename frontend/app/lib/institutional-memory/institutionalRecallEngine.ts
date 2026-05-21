import { stableSignature } from "../intelligence/shared/dedupe";
import { getAdaptationRecoveryStore } from "./adaptationRecoveryStore";
import { getDecisionOutcomeStore } from "./decisionOutcomeStore";
import { getInstitutionalDistillationStore } from "./institutionalDistillationStore";
import { getInstitutionalCorrelationStore } from "./institutionalCorrelationStore";
import { getInstitutionalMemoryStore } from "./institutionalMemoryStore";
import {
  beginInstitutionalRecall,
  endInstitutionalRecall,
  shouldEvaluateInstitutionalRecall,
  shouldRetainInstitutionalRecall,
  similarityRank,
} from "./institutionalRecallGuards";
import { getInstitutionalRecallStore } from "./institutionalRecallStore";
import type {
  ExecutiveHistoricalReference,
  HistoricalContextFrame,
  HistoricalSituationReconstruction,
  InstitutionalCognitiveRecallInput,
  InstitutionalRecallResult,
  InstitutionalRecallSnapshot,
  OperationalSimilarityLevel,
  OperationalSimilarityScore,
  RecallCategory,
  StrategicMemoryMatch,
} from "./institutionalRecallTypes";

const DEV_LOG_PREFIX = "[Nexora][InstitutionalRecall]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildRecallId(category: RecallCategory, signals: string[]): string {
  return stableSignature(["institutional-recall", category, ...signals.sort().slice(0, 4)]).slice(
    0,
    56
  );
}

function createRecall(params: {
  category: RecallCategory;
  similarityLevel: OperationalSimilarityLevel;
  title: string;
  summary: string;
  relatedMemories: string[];
  confidence: number;
  now: number;
}): InstitutionalRecallResult {
  const relatedMemories = Object.freeze(params.relatedMemories.slice(0, 8));
  return {
    recallId: buildRecallId(params.category, [...relatedMemories]),
    similarityLevel: params.similarityLevel,
    category: params.category,
    title: params.title,
    summary: params.summary,
    relatedMemories,
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
  insightCount: number
): number {
  return memoryCount + correlationCount + adaptationCount + outcomeCount + insightCount;
}

function buildRelatedMemories(
  memoryIds: string[],
  correlationIds: string[],
  adaptationIds: string[],
  outcomeIds: string[],
  insightIds: string[]
): string[] {
  return [
    ...memoryIds.map((id) => `memory_${id}`),
    ...correlationIds.map((id) => `correlation_${id}`),
    ...adaptationIds.map((id) => `adaptation_${id}`),
    ...outcomeIds.map((id) => `outcome_${id}`),
    ...insightIds.map((id) => `insight_${id}`),
  ].slice(0, 8);
}

function inferInstitutionalRecalls(
  input: InstitutionalCognitiveRecallInput,
  correlationCategories: readonly string[],
  adaptationTypes: readonly string[],
  outcomeCategories: readonly string[],
  distilledCategories: readonly string[],
  memoryIds: string[],
  correlationIds: string[],
  adaptationIds: string[],
  outcomeIds: string[],
  insightIds: string[],
  evidenceDepth: number,
  now: number
): InstitutionalRecallResult[] {
  const stack = input.cognitionSnapshot;
  const fragilityElevated = input.fragilityElevated ?? false;
  const continuityPreserved = input.continuityPreserved ?? true;

  const related = (extra: string[] = []) =>
    buildRelatedMemories(memoryIds, correlationIds, adaptationIds, outcomeIds, [
      ...insightIds,
      ...extra,
    ]);

  const candidates: InstitutionalRecallResult[] = [];

  if (
    correlationCategories.includes("fragility_cycle") ||
    correlationCategories.includes("escalation_chain") ||
    fragilityElevated
  ) {
    candidates.push(
      createRecall({
        category: "fragility",
        similarityLevel: fragilityElevated ? "highly_similar" : "strong",
        title: "Current operational instability resembles prior supply-chain escalation cycle.",
        summary:
          "The current fragility trajectory closely resembles a previous operational pressure event characterized by escalation concentration, coordination degradation, and delayed governance stabilization.",
        relatedMemories: related(["fragility_cycle", "escalation_concentration"]),
        confidence: 0.87,
        now,
      })
    );
  }

  if (
    correlationCategories.includes("escalation_chain") &&
    correlationCategories.includes("governance_pressure")
  ) {
    candidates.push(
      createRecall({
        category: "governance",
        similarityLevel: "strong",
        title: "Repeated governance instability sequence matches historical governance context.",
        summary:
          "Institutional recall identifies a governance instability sequence previously associated with escalation pressure and executive oversight gaps — leadership should reference prior stabilization responses.",
        relatedMemories: related(["governance_pressure", "escalation_chain"]),
        confidence: 0.85,
        now,
      })
    );
  }

  if (stack?.pressureGovernanceActive && correlationCategories.includes("systemic_instability")) {
    candidates.push(
      createRecall({
        category: "operational",
        similarityLevel: "moderate",
        title: "Pressure topology structure resembles prior systemic operational pressure event.",
        summary:
          "Historical operational similarity reconstruction indicates pressure redistribution patterns comparable to prior systemic instability periods under active governance.",
        relatedMemories: related(["pressure_topology", "systemic_instability"]),
        confidence: 0.78,
        now,
      })
    );
  }

  if (
    adaptationTypes.includes("recovery_cycle") ||
    adaptationTypes.includes("coordination_recovery") ||
    correlationCategories.includes("operational_recovery")
  ) {
    candidates.push(
      createRecall({
        category: "recovery",
        similarityLevel: continuityPreserved ? "strong" : "moderate",
        title: "Recovery stabilization behavior parallels prior resilience recovery period.",
        summary:
          "Similar recovery stabilization behavior observed historically — coordination improvements and recovery cycles align with prior resilience recall patterns.",
        relatedMemories: related(["recovery_cycle", "coordination_recovery"]),
        confidence: 0.84,
        now,
      })
    );
  }

  if (correlationCategories.includes("coordination_breakdown")) {
    candidates.push(
      createRecall({
        category: "coordination",
        similarityLevel: "strong",
        title: "Coordination breakdown structure matches historical coordination failure context.",
        summary:
          "Reconstructed historical context indicates recurring coordination breakdown under operational pressure — prior responses involved cross-system stabilization and executive alignment.",
        relatedMemories: related(["coordination_breakdown"]),
        confidence: 0.81,
        now,
      })
    );
  }

  if (
    adaptationTypes.includes("resilience_growth") ||
    correlationCategories.includes("resilience_growth") ||
    distilledCategories.includes("resilience")
  ) {
    const level: OperationalSimilarityLevel =
      evidenceDepth >= 5 ? "highly_similar" : "strong";
    candidates.push(
      createRecall({
        category: "resilience",
        similarityLevel: level,
        title: "Resilience improvement trajectory resembles prior organizational adaptation period.",
        summary:
          "Strategic operational similarity indicates resilience growth parallels — historical recovery behaviors and adaptation strength patterns align with current stabilization signals.",
        relatedMemories: related(["resilience_growth", "adaptation_strength"]),
        confidence: 0.86,
        now,
      })
    );
  }

  if (outcomeCategories.includes("escalation") || outcomeCategories.includes("governance")) {
    candidates.push(
      createRecall({
        category: "escalation",
        similarityLevel: "moderate",
        title: "Escalation trajectory recalls prior executive consequence patterns.",
        summary:
          "Decision outcome memory links current escalation dynamics to historical consequence patterns — downstream pressure propagation previously required governance intervention.",
        relatedMemories: related(["decision_outcome_escalation"]),
        confidence: 0.79,
        now,
      })
    );
  }

  if (distilledCategories.includes("strategic") || distilledCategories.includes("fragility")) {
    candidates.push(
      createRecall({
        category: "strategic",
        similarityLevel: "strong",
        title: "Distilled strategic wisdom recalls prior structural organizational weakness.",
        summary:
          "Knowledge distillation surfaces strategic lessons historically relevant to current conditions — recurring structural weaknesses and adaptation strengths should inform executive context.",
        relatedMemories: related(["distilled_strategic_wisdom"]),
        confidence: 0.82,
        now,
      })
    );
  }

  if (stack?.governanceOversightActive && !fragilityElevated && continuityPreserved) {
    candidates.push(
      createRecall({
        category: "governance",
        similarityLevel: "weak",
        title: "Governance oversight context resembles prior stable operational period.",
        summary:
          "Historical governance reference: prior periods with active oversight and managed pressure resemble current continuity-preserving operational posture.",
        relatedMemories: related(["governance_oversight_stable"]),
        confidence: 0.72,
        now,
      })
    );
  }

  return candidates.filter((c) => shouldRetainInstitutionalRecall(c, evidenceDepth));
}

function buildContextFrames(
  recalls: readonly InstitutionalRecallResult[]
): HistoricalContextFrame[] {
  const byCategory = new Map<RecallCategory, InstitutionalRecallResult[]>();
  for (const r of recalls) {
    const list = byCategory.get(r.category) ?? [];
    list.push(r);
    byCategory.set(r.category, list);
  }

  const frames: HistoricalContextFrame[] = [];
  for (const [category, group] of byCategory) {
    if (group.length === 0) continue;
    const anchor = group[0]!;
    frames.push({
      frameId: stableSignature(["context-frame", category, anchor.recallId]).slice(0, 48),
      category,
      timelineLabel: `Historical ${category} context`,
      narrative: `Reconstructed timeline: ${group.map((r) => r.title).join(" ")}`,
      recallIds: Object.freeze(group.map((r) => r.recallId)),
      relatedMemories: Object.freeze(
        Array.from(new Set(group.flatMap((r) => [...r.relatedMemories]))).slice(0, 10)
      ),
      firstObservedAt: Math.min(...group.map((r) => r.generatedAt)),
      lastObservedAt: Math.max(...group.map((r) => r.lastObservedAt)),
    });
  }
  return frames;
}

function buildExecutiveReferences(
  recalls: readonly InstitutionalRecallResult[],
  now: number
): ExecutiveHistoricalReference[] {
  return recalls
    .filter((r) => similarityRank(r.similarityLevel) >= similarityRank("strong"))
    .slice(0, 4)
    .map((r) => ({
      referenceId: stableSignature(["exec-historical-ref", r.recallId]).slice(0, 48),
      category: r.category,
      headline: r.title,
      executiveContext: `Leadership should remember: ${r.summary}`,
      recallIds: Object.freeze([r.recallId]),
      generatedAt: now,
    }));
}

function buildStrategicMatches(
  recalls: readonly InstitutionalRecallResult[],
  insightIds: string[],
  now: number
): StrategicMemoryMatch[] {
  return recalls.slice(0, 6).map((r) => ({
    matchId: stableSignature(["strategic-match", r.recallId]).slice(0, 48),
    category: r.category,
    similarityLevel: r.similarityLevel,
    matchedInsightId: insightIds[0] ?? null,
    matchedRecallId: r.recallId,
    summary: r.summary,
    generatedAt: now,
  }));
}

function buildReconstructions(
  recalls: readonly InstitutionalRecallResult[],
  now: number
): HistoricalSituationReconstruction[] {
  return recalls
    .filter((r) => r.similarityLevel !== "weak")
    .slice(0, 6)
    .map((r) => ({
      reconstructionId: stableSignature(["situation-recon", r.recallId]).slice(0, 48),
      category: r.category,
      situationSummary: r.title,
      historicalParallels: Object.freeze(r.relatedMemories),
      consequenceContext: `Historical consequence context: ${r.summary}`,
      recallIds: Object.freeze([r.recallId]),
      generatedAt: now,
    }));
}

function buildSimilarityScores(
  recalls: readonly InstitutionalRecallResult[],
  now: number
): OperationalSimilarityScore[] {
  return recalls.map((r) => ({
    scoreId: stableSignature(["similarity-score", r.recallId]).slice(0, 48),
    level: r.similarityLevel,
    numericScore: Number(
      (similarityRank(r.similarityLevel) * 0.22 + r.confidence * 0.78).toFixed(2)
    ),
    matchedSignals: Object.freeze(r.relatedMemories.slice(0, 4)),
    generatedAt: now,
  }));
}

function buildRecallSnapshot(
  organizationId: string,
  storeState: ReturnType<ReturnType<typeof getInstitutionalRecallStore>["getState"]>,
  now: number
): InstitutionalRecallSnapshot {
  const summary =
    storeState.recalls.length === 0
      ? "Institutional recall awaiting sufficient organizational learning depth."
      : `Reconstructed ${storeState.recalls.length} historically relevant operational contexts for executive awareness.`;

  return {
    signature: storeState.signature,
    organizationId,
    generatedAt: now,
    recallCount: storeState.recalls.length,
    contextFrameCount: storeState.contextFrames.length,
    reconstructionCount: storeState.reconstructions.length,
    recallSummary: summary,
    dominantCategories: Object.freeze(
      Array.from(new Set(storeState.recalls.map((r) => r.category))).slice(0, 4)
    ),
    recentRecalls: Object.freeze(storeState.recalls.slice(0, 6)),
    contextFrames: Object.freeze(storeState.contextFrames.slice(0, 6)),
    executiveReferences: Object.freeze(storeState.executiveReferences.slice(0, 4)),
    strategicMatches: Object.freeze(storeState.strategicMatches.slice(0, 6)),
    reconstructions: Object.freeze(storeState.reconstructions.slice(0, 6)),
  };
}

export type InstitutionalCognitiveRecallResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: InstitutionalRecallSnapshot | null;
  newRecalls: number;
  storeSignature: string;
};

export function evaluateInstitutionalCognitiveRecall(
  input: InstitutionalCognitiveRecallInput
): InstitutionalCognitiveRecallResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginInstitutionalRecall()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_recall_guard",
      snapshot: null,
      newRecalls: 0,
      storeSignature: "",
    };
  }

  try {
    const memoryState = getInstitutionalMemoryStore(organizationId).getState();
    const correlationState = getInstitutionalCorrelationStore(organizationId).getState();
    const adaptationState = getAdaptationRecoveryStore(organizationId).getState();
    const outcomeState = getDecisionOutcomeStore(organizationId).getState();
    const distillationState = getInstitutionalDistillationStore(organizationId).getState();

    const depth =
      memoryState.records.length +
      correlationState.correlations.length +
      adaptationState.adaptations.length +
      outcomeState.decisions.length +
      distillationState.insights.length;

    if (depth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_institutional_depth",
        snapshot: null,
        newRecalls: 0,
        storeSignature: "",
      };
    }

    const store = getInstitutionalRecallStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-2-6-recall-eval",
      organizationId,
      memoryState.signature,
      correlationState.signature,
      adaptationState.signature,
      outcomeState.signature,
      distillationState.signature,
      input.cognitionSnapshot?.signature ?? "no-cognition",
    ]);

    if (
      !shouldEvaluateInstitutionalRecall(
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
          prior.recalls.length > 0 ? buildRecallSnapshot(organizationId, prior, now) : null,
        newRecalls: 0,
        storeSignature: prior.signature,
      };
    }

    const correlationCategories = correlationState.correlations.map((c) => c.category);
    const correlationIds = correlationState.correlations.map((c) => c.correlationId).slice(0, 4);
    const adaptationTypes = adaptationState.adaptations.map((a) => a.adaptationType);
    const adaptationIds = adaptationState.adaptations.map((a) => a.adaptationId).slice(0, 4);
    const outcomeCategories = outcomeState.decisions.map((d) => d.decisionCategory);
    const outcomeIds = outcomeState.decisions.map((d) => d.decisionOutcomeId).slice(0, 4);
    const distilledCategories = distillationState.insights.map((i) => i.category);
    const insightIds = distillationState.insights.map((i) => i.distilledInsightId).slice(0, 4);
    const memoryIds = memoryState.records.map((r) => r.memoryId).slice(0, 8);
    const evidenceDepth = computeEvidenceDepth(
      memoryState.records.length,
      correlationState.correlations.length,
      adaptationState.adaptations.length,
      outcomeState.decisions.length,
      distillationState.insights.length
    );
    const priorCount = prior.recalls.length;

    const candidates = inferInstitutionalRecalls(
      input,
      correlationCategories,
      adaptationTypes,
      outcomeCategories,
      distilledCategories,
      memoryIds,
      correlationIds,
      adaptationIds,
      outcomeIds,
      insightIds,
      evidenceDepth,
      now
    );

    if (candidates.length > 0) {
      store.upsertRecalls(candidates, now);
    }

    const afterRecalls = store.getState();
    const contextFrames = buildContextFrames(afterRecalls.recalls);
    if (contextFrames.length > 0) {
      store.upsertContextFrames(contextFrames, now);
    }

    const executiveReferences = buildExecutiveReferences(afterRecalls.recalls, now);
    if (executiveReferences.length > 0) {
      store.upsertExecutiveReferences(executiveReferences, now);
    }

    const strategicMatches = buildStrategicMatches(afterRecalls.recalls, insightIds, now);
    if (strategicMatches.length > 0) {
      store.upsertStrategicMatches(strategicMatches, now);
    }

    const reconstructions = buildReconstructions(afterRecalls.recalls, now);
    if (reconstructions.length > 0) {
      store.upsertReconstructions(reconstructions, now);
    }

    const similarityScores = buildSimilarityScores(afterRecalls.recalls, now);
    if (similarityScores.length > 0) {
      store.upsertSimilarityScores(similarityScores, now);
    }

    store.setLastEvaluationSignature(evaluationSignature);
    const finalState = store.getState();
    const newRecalls = Math.max(0, finalState.recalls.length - priorCount);

    const strong = finalState.recalls.find(
      (r) => r.similarityLevel === "strong" || r.similarityLevel === "highly_similar"
    );
    if (strong && newRecalls > 0) {
      devLog(`historical match — ${strong.category}: ${strong.title.slice(0, 72)}`);
    }

    const snapshot = buildRecallSnapshot(organizationId, finalState, now);

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newRecalls,
      storeSignature: finalState.signature,
    };
  } finally {
    endInstitutionalRecall();
  }
}
