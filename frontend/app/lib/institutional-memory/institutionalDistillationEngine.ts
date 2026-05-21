import { stableSignature } from "../intelligence/shared/dedupe";
import { getAdaptationRecoveryStore } from "./adaptationRecoveryStore";
import { getDecisionOutcomeStore } from "./decisionOutcomeStore";
import {
  beginInstitutionalDistillation,
  endInstitutionalDistillation,
  shouldAllowCompressionLevel,
  shouldEvaluateInstitutionalDistillation,
  shouldRetainDistilledInsight,
} from "./institutionalDistillationGuards";
import { getInstitutionalDistillationStore } from "./institutionalDistillationStore";
import { getInstitutionalCorrelationStore } from "./institutionalCorrelationStore";
import { getInstitutionalMemoryStore } from "./institutionalMemoryStore";
import type {
  DistilledInstitutionalInsight,
  ExecutiveLearningSummary,
  InsightCategory,
  InstitutionalCompressionSnapshot,
  InstitutionalKnowledgeDistillationInput,
  MemoryCompressionLevel,
  OrganizationalWisdomPattern,
  StrategicKnowledgeArtifact,
} from "./institutionalDistillationTypes";

const DEV_LOG_PREFIX = "[Nexora][KnowledgeDistillation]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildInsightId(category: InsightCategory, patterns: string[]): string {
  return stableSignature(["distilled-insight", category, ...patterns.sort().slice(0, 4)]).slice(
    0,
    56
  );
}

function createInsight(params: {
  category: InsightCategory;
  compressionLevel: MemoryCompressionLevel;
  title: string;
  summary: string;
  supportingPatterns: string[];
  confidence: number;
  linkedMemoryIds: string[];
  now: number;
}): DistilledInstitutionalInsight {
  const supportingPatterns = Object.freeze(params.supportingPatterns.slice(0, 6));
  return {
    distilledInsightId: buildInsightId(params.category, [...supportingPatterns]),
    category: params.category,
    compressionLevel: params.compressionLevel,
    title: params.title,
    summary: params.summary,
    supportingPatterns,
    confidence: Number(Math.min(0.94, Math.max(0.45, params.confidence)).toFixed(2)),
    generatedAt: params.now,
    lastObservedAt: params.now,
    occurrenceCount: 1,
    linkedMemoryIds: Object.freeze(params.linkedMemoryIds.slice(0, 8)),
  };
}

function computeEvidenceDepth(
  memoryCount: number,
  correlationCount: number,
  adaptationCount: number,
  outcomeCount: number
): number {
  return memoryCount + correlationCount + adaptationCount + outcomeCount;
}

function inferDistilledInsights(
  input: InstitutionalKnowledgeDistillationInput,
  correlationCategories: readonly string[],
  adaptationTypes: readonly string[],
  outcomeCategories: readonly string[],
  outcomeObservations: readonly string[],
  memoryIds: string[],
  evidenceDepth: number,
  now: number
): DistilledInstitutionalInsight[] {
  const stack = input.cognitionSnapshot;
  const fragilityElevated = input.fragilityElevated ?? false;
  const continuityPreserved = input.continuityPreserved ?? true;

  const candidates: DistilledInstitutionalInsight[] = [];

  if (
    correlationCategories.includes("escalation_chain") &&
    correlationCategories.includes("governance_pressure")
  ) {
    const level: MemoryCompressionLevel = shouldAllowCompressionLevel("distilled", evidenceDepth)
      ? "distilled"
      : "condensed";
    candidates.push(
      createInsight({
        category: "governance",
        compressionLevel: level,
        title: "Governance instability repeatedly precedes operational escalation.",
        summary:
          "Historical operational patterns show escalation concentration following governance pressure — a recurring governance weakness requiring executive oversight.",
        supportingPatterns: [
          "recurring_escalation_chain",
          "governance_pressure",
          "executive_oversight_gap",
        ],
        confidence: 0.87,
        linkedMemoryIds: memoryIds,
        now,
      })
    );
  }

  if (
    adaptationTypes.includes("coordination_recovery") ||
    (correlationCategories.includes("operational_recovery") && continuityPreserved)
  ) {
    candidates.push(
      createInsight({
        category: "resilience",
        compressionLevel: "distilled",
        title: "Coordination improvements consistently support organizational recovery.",
        summary:
          "Compressed institutional experience indicates recovery acceleration after coordination improvements — a resilience-supporting organizational lesson.",
        supportingPatterns: [
          "coordination_recovery",
          "recovery_acceleration",
          "resilience_supporting",
        ],
        confidence: 0.85,
        linkedMemoryIds: memoryIds,
        now,
      })
    );
  }

  if (
    correlationCategories.includes("fragility_cycle") ||
    correlationCategories.includes("escalation_chain") ||
    fragilityElevated
  ) {
    const level: MemoryCompressionLevel =
      evidenceDepth >= 5 && fragilityElevated ? "strategic_core" : "distilled";
    if (shouldAllowCompressionLevel(level, evidenceDepth)) {
      candidates.push(
        createInsight({
          category: "fragility",
          compressionLevel: level,
          title: "Supply-chain coordination instability remains a recurring structural weakness.",
          summary:
            "Historical operational patterns consistently show escalation concentration around coordination failures during sustained pressure periods — persistent fragility concentration across systems.",
          supportingPatterns: [
            "recurring_escalation_chain",
            "cross_system_fragility",
            "pressure_concentration",
          ],
          confidence: 0.89,
          linkedMemoryIds: memoryIds,
          now,
        })
      );
    }
  }

  if (
    adaptationTypes.includes("pressure_absorption") ||
    adaptationTypes.includes("recovery_cycle") ||
    outcomeObservations.includes("recovery_acceleration")
  ) {
    candidates.push(
      createInsight({
        category: "recovery",
        compressionLevel: "condensed",
        title: "Pressure reduction correlates with adaptive resilience recovery.",
        summary:
          "Distilled experience shows recovery acceleration after pressure absorption — an adaptive resilience lesson for executive planning.",
        supportingPatterns: ["pressure_absorption", "recovery_acceleration", "adaptive_resilience"],
        confidence: 0.83,
        linkedMemoryIds: memoryIds,
        now,
      })
    );
  }

  if (
    outcomeCategories.includes("operational") ||
    (stack?.strategicCalibrationActive && correlationCategories.includes("systemic_instability"))
  ) {
    candidates.push(
      createInsight({
        category: "operational",
        compressionLevel: "summarized",
        title: "Repeated operational bottlenecks signal strategic inefficiency.",
        summary:
          "Compressed operational history reveals recurring bottlenecks under calibration — a strategic operational inefficiency pattern leadership should prioritize.",
        supportingPatterns: [
          "operational_bottleneck",
          "calibration_pressure",
          "strategic_inefficiency",
        ],
        confidence: 0.76,
        linkedMemoryIds: memoryIds,
        now,
      })
    );
  }

  if (
    adaptationTypes.includes("resilience_growth") ||
    correlationCategories.includes("resilience_growth")
  ) {
    const level: MemoryCompressionLevel = shouldAllowCompressionLevel("strategic_core", evidenceDepth)
      ? "strategic_core"
      : "distilled";
    if (shouldAllowCompressionLevel(level, evidenceDepth)) {
      candidates.push(
        createInsight({
          category: "strategic",
          compressionLevel: level,
          title: "Long-term resilience improvement reflects organizational adaptation strength.",
          summary:
            "Institutional memory compression reveals a sustained resilience growth trend — organizational adaptation strength emerging from repeated recovery behaviors.",
          supportingPatterns: [
            "resilience_growth",
            "adaptation_strength",
            "long_horizon_improvement",
          ],
          confidence: 0.88,
          linkedMemoryIds: memoryIds,
          now,
        })
      );
    }
  }

  if (outcomeCategories.includes("governance") || outcomeCategories.includes("escalation")) {
    candidates.push(
      createInsight({
        category: "escalation",
        compressionLevel: "condensed",
        title: "Executive consequence memory confirms escalation governance lessons.",
        summary:
          "Decision outcome learning compressed into strategic knowledge: escalation mitigation and governance interventions shape downstream operational stability.",
        supportingPatterns: [
          "decision_outcome_learning",
          "escalation_mitigation",
          "governance_lesson",
        ],
        confidence: 0.81,
        linkedMemoryIds: memoryIds,
        now,
      })
    );
  }

  if (stack?.governanceOversightActive && !fragilityElevated && continuityPreserved) {
    candidates.push(
      createInsight({
        category: "coordination",
        compressionLevel: "summarized",
        title: "Governance oversight preserves coordination stability under pressure.",
        summary:
          "Distilled organizational experience indicates coordination stability when governance oversight remains active without elevated fragility.",
        supportingPatterns: ["governance_oversight", "coordination_stability", "pressure_managed"],
        confidence: 0.74,
        linkedMemoryIds: memoryIds,
        now,
      })
    );
  }

  return candidates.filter((c) => shouldRetainDistilledInsight(c, evidenceDepth));
}

function buildStrategicArtifacts(
  insights: readonly DistilledInstitutionalInsight[]
): StrategicKnowledgeArtifact[] {
  const byCategory = new Map<InsightCategory, DistilledInstitutionalInsight[]>();
  for (const i of insights) {
    const list = byCategory.get(i.category) ?? [];
    list.push(i);
    byCategory.set(i.category, list);
  }

  const artifacts: StrategicKnowledgeArtifact[] = [];
  for (const [category, group] of byCategory) {
    if (group.length === 0) continue;
    const anchor = group[0]!;
    const compressionLevel = group.reduce<MemoryCompressionLevel>((best, i) => {
      const ranks: Record<MemoryCompressionLevel, number> = {
        raw: 1,
        summarized: 2,
        condensed: 3,
        distilled: 4,
        strategic_core: 5,
      };
      return ranks[i.compressionLevel] > ranks[best] ? i.compressionLevel : best;
    }, "summarized");

    artifacts.push({
      artifactId: stableSignature(["knowledge-artifact", category, anchor.distilledInsightId]).slice(
        0,
        48
      ),
      category,
      compressionLevel,
      lesson: `Strategic knowledge: ${anchor.title}`,
      insightIds: Object.freeze(group.map((i) => i.distilledInsightId)),
      linkedMemoryIds: Object.freeze(
        Array.from(new Set(group.flatMap((i) => [...i.linkedMemoryIds]))).slice(0, 10)
      ),
      firstObservedAt: Math.min(...group.map((i) => i.generatedAt)),
      lastObservedAt: Math.max(...group.map((i) => i.lastObservedAt)),
      occurrenceCount: group.reduce((sum, i) => sum + i.occurrenceCount, 0),
    });
  }
  return artifacts;
}

function buildWisdomPatterns(
  insights: readonly DistilledInstitutionalInsight[]
): OrganizationalWisdomPattern[] {
  return insights
    .filter((i) => i.compressionLevel === "distilled" || i.compressionLevel === "strategic_core")
    .slice(0, 8)
    .map((i) => ({
      patternId: stableSignature(["wisdom-pattern", i.distilledInsightId]).slice(0, 48),
      category: i.category,
      wisdom: i.summary,
      supportingInsightIds: Object.freeze([i.distilledInsightId]),
      compressionLevel: i.compressionLevel,
      confidence: i.confidence,
      firstObservedAt: i.generatedAt,
      lastObservedAt: i.lastObservedAt,
      occurrenceCount: i.occurrenceCount,
    }));
}

function buildExecutiveSummary(
  organizationId: string,
  insights: readonly DistilledInstitutionalInsight[],
  now: number
): ExecutiveLearningSummary | null {
  if (insights.length === 0) return null;

  const dominantCategories = Object.freeze(
    Array.from(new Set(insights.map((i) => i.category))).slice(0, 4)
  );
  const top = insights[0]!;

  return {
    summaryId: stableSignature(["executive-summary", organizationId, insights.length]).slice(
      0,
      48
    ),
    headline: `Distilled ${insights.length} strategic lessons for executive awareness.`,
    narrative: `Compressed organizational wisdom prioritizes: ${top.title} Additional themes span ${dominantCategories.join(", ")}.`,
    dominantCategories,
    insightCount: insights.length,
    generatedAt: now,
  };
}

function buildCompressionSnapshot(
  organizationId: string,
  storeState: ReturnType<ReturnType<typeof getInstitutionalDistillationStore>["getState"]>,
  executiveSummary: ExecutiveLearningSummary | null,
  now: number
): InstitutionalCompressionSnapshot {
  const summary =
    storeState.insights.length === 0
      ? "Knowledge distillation awaiting sufficient institutional learning depth."
      : `Compressed ${storeState.insights.length} high-value institutional insights into executive strategic knowledge.`;

  return {
    signature: storeState.signature,
    organizationId,
    generatedAt: now,
    insightCount: storeState.insights.length,
    artifactCount: storeState.artifacts.length,
    wisdomPatternCount: storeState.wisdomPatterns.length,
    distillationSummary: summary,
    dominantCategories: Object.freeze(
      Array.from(new Set(storeState.insights.map((i) => i.category))).slice(0, 4)
    ),
    recentInsights: Object.freeze(storeState.insights.slice(0, 6)),
    strategicArtifacts: Object.freeze(storeState.artifacts.slice(0, 6)),
    executiveSummary,
    wisdomPatterns: Object.freeze(storeState.wisdomPatterns.slice(0, 6)),
  };
}

export type InstitutionalKnowledgeDistillationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: InstitutionalCompressionSnapshot | null;
  newInsights: number;
  storeSignature: string;
};

export function evaluateInstitutionalKnowledgeDistillation(
  input: InstitutionalKnowledgeDistillationInput
): InstitutionalKnowledgeDistillationResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginInstitutionalDistillation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_distillation_guard",
      snapshot: null,
      newInsights: 0,
      storeSignature: "",
    };
  }

  try {
    const memoryState = getInstitutionalMemoryStore(organizationId).getState();
    const correlationState = getInstitutionalCorrelationStore(organizationId).getState();
    const adaptationState = getAdaptationRecoveryStore(organizationId).getState();
    const outcomeState = getDecisionOutcomeStore(organizationId).getState();

    const depth =
      memoryState.records.length +
      correlationState.correlations.length +
      adaptationState.adaptations.length +
      outcomeState.decisions.length;

    if (depth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_institutional_depth",
        snapshot: null,
        newInsights: 0,
        storeSignature: "",
      };
    }

    const store = getInstitutionalDistillationStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-2-5-distillation-eval",
      organizationId,
      memoryState.signature,
      correlationState.signature,
      adaptationState.signature,
      outcomeState.signature,
      input.cognitionSnapshot?.signature ?? "no-cognition",
    ]);

    if (
      !shouldEvaluateInstitutionalDistillation(
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
          prior.insights.length > 0
            ? buildCompressionSnapshot(
                organizationId,
                prior,
                prior.summaries[0] ?? null,
                now
              )
            : null,
        newInsights: 0,
        storeSignature: prior.signature,
      };
    }

    const correlationCategories = correlationState.correlations.map((c) => c.category);
    const adaptationTypes = adaptationState.adaptations.map((a) => a.adaptationType);
    const outcomeCategories = outcomeState.decisions.map((d) => d.decisionCategory);
    const outcomeObservations = outcomeState.decisions.flatMap((d) => [...d.observations]);
    const memoryIds = memoryState.records.map((r) => r.memoryId).slice(0, 8);
    const evidenceDepth = computeEvidenceDepth(
      memoryState.records.length,
      correlationState.correlations.length,
      adaptationState.adaptations.length,
      outcomeState.decisions.length
    );
    const priorCount = prior.insights.length;

    const candidates = inferDistilledInsights(
      input,
      correlationCategories,
      adaptationTypes,
      outcomeCategories,
      outcomeObservations,
      memoryIds,
      evidenceDepth,
      now
    );

    if (candidates.length > 0) {
      store.upsertInsights(candidates, now);
    }

    const afterInsights = store.getState();
    const artifacts = buildStrategicArtifacts(afterInsights.insights);
    if (artifacts.length > 0) {
      store.upsertArtifacts(artifacts, now);
    }

    const wisdomPatterns = buildWisdomPatterns(afterInsights.insights);
    if (wisdomPatterns.length > 0) {
      store.upsertWisdomPatterns(wisdomPatterns, now);
    }

    const executiveSummary = buildExecutiveSummary(
      organizationId,
      afterInsights.insights,
      now
    );
    if (executiveSummary) {
      store.upsertSummaries([executiveSummary], now);
    }

    store.setLastEvaluationSignature(evaluationSignature);
    const finalState = store.getState();
    const newInsights = Math.max(0, finalState.insights.length - priorCount);

    const strong = finalState.insights.find(
      (i) => i.compressionLevel === "distilled" || i.compressionLevel === "strategic_core"
    );
    if (strong && newInsights > 0) {
      devLog(`strategic wisdom — ${strong.category}: ${strong.title.slice(0, 72)}`);
    }

    const snapshot = buildCompressionSnapshot(
      organizationId,
      finalState,
      executiveSummary,
      now
    );

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newInsights,
      storeSignature: finalState.signature,
    };
  } finally {
    endInstitutionalDistillation();
  }
}
