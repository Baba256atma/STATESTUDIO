import { stableSignature } from "../intelligence/shared/dedupe";
import { getAdaptationRecoveryStore } from "./adaptationRecoveryStore";
import { getDecisionOutcomeStore } from "./decisionOutcomeStore";
import { getInstitutionalDistillationStore } from "./institutionalDistillationStore";
import { getInstitutionalCorrelationStore } from "./institutionalCorrelationStore";
import { getInstitutionalMaturityStore } from "./institutionalMaturityStore";
import { getInstitutionalMemoryStore } from "./institutionalMemoryStore";
import { getInstitutionalRecallStore } from "./institutionalRecallStore";
import {
  beginInstitutionalContinuityEvaluation,
  continuityRank,
  endInstitutionalContinuityEvaluation,
  shouldAllowContinuityPromotion,
  shouldEvaluateInstitutionalContinuity,
  shouldRetainWisdomArtifact,
} from "./institutionalContinuityGuards";
import { getInstitutionalContinuityStore } from "./institutionalContinuityStore";
import type {
  ContinuityLevel,
  ExecutiveWisdomPreservationSignal,
  InstitutionalKnowledgeAnchor,
  InstitutionalKnowledgeContinuityInput,
  InstitutionalWisdomArtifact,
  OrganizationalContinuitySnapshot,
  StrategicKnowledgeContinuityRecord,
  StrategicWisdomCategory,
} from "./institutionalContinuityTypes";

const DEV_LOG_PREFIX = "[Nexora][WisdomContinuity]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildArtifactId(category: StrategicWisdomCategory, patterns: string[]): string {
  return stableSignature(["wisdom-artifact", category, ...patterns.sort().slice(0, 4)]).slice(
    0,
    56
  );
}

function createWisdomArtifact(params: {
  category: StrategicWisdomCategory;
  continuityLevel: ContinuityLevel;
  title: string;
  summary: string;
  supportingPatterns: string[];
  confidence: number;
  anchorIds: string[];
  now: number;
}): InstitutionalWisdomArtifact {
  const supportingPatterns = Object.freeze(params.supportingPatterns.slice(0, 6));
  return {
    wisdomArtifactId: buildArtifactId(params.category, [...supportingPatterns]),
    category: params.category,
    continuityLevel: params.continuityLevel,
    title: params.title,
    summary: params.summary,
    supportingPatterns,
    confidence: Number(Math.min(0.95, Math.max(0.5, params.confidence)).toFixed(2)),
    generatedAt: params.now,
    lastPreservedAt: params.now,
    occurrenceCount: 1,
    linkedAnchorIds: Object.freeze(params.anchorIds.slice(0, 6)),
  };
}

function computeEvidenceDepth(
  memoryCount: number,
  correlationCount: number,
  adaptationCount: number,
  outcomeCount: number,
  insightCount: number,
  recallCount: number,
  maturityCount: number
): number {
  return (
    memoryCount +
    correlationCount +
    adaptationCount +
    outcomeCount +
    insightCount +
    recallCount +
    maturityCount
  );
}

function inferWisdomArtifacts(
  input: InstitutionalKnowledgeContinuityInput,
  correlationCategories: readonly string[],
  adaptationTypes: readonly string[],
  outcomeCategories: readonly string[],
  distilledInsightIds: readonly string[],
  maturityLevels: readonly string[],
  maturityTrends: readonly string[],
  recallCategories: readonly string[],
  evidenceDepth: number,
  continuityPreserved: boolean,
  now: number
): InstitutionalWisdomArtifact[] {
  const stack = input.cognitionSnapshot;
  const hasGovernanceWisdomSupport =
    outcomeCategories.includes("governance") ||
    outcomeCategories.includes("recovery") ||
    Boolean(stack?.governanceOversightActive || stack?.executiveStabilityActive);
  const candidates: InstitutionalWisdomArtifact[] = [];

  const highConfidenceDistilled = distilledInsightIds.length >= 2;
  const resilientMaturity =
    maturityLevels.includes("resilient") || maturityLevels.includes("strategically_mature");
  const improvingTrend =
    maturityTrends.includes("improving") || maturityTrends.includes("accelerating");

  if (
    (adaptationTypes.includes("governance_stabilization") || hasGovernanceWisdomSupport) &&
    (highConfidenceDistilled || resilientMaturity)
  ) {
    const level: ContinuityLevel = shouldAllowContinuityPromotion(
      "institutionalized",
      evidenceDepth,
      2
    )
      ? "institutionalized"
      : "persistent";
    if (shouldAllowContinuityPromotion(level, evidenceDepth, 1)) {
      candidates.push(
        createWisdomArtifact({
          category: "resilience",
          continuityLevel: level,
          title:
            "Operational resilience improves when governance stabilization occurs early during escalation cycles.",
          summary:
            "Historical organizational experience consistently demonstrates faster recovery and reduced fragility when governance coordination stabilizes before systemic escalation spreads.",
          supportingPatterns: [
            "governance_stabilization",
            "reduced_escalation_spread",
            "improved_recovery_consistency",
          ],
          confidence: 0.91,
          anchorIds: [],
          now,
        })
      );
    }
  }

  if (
    adaptationTypes.includes("resilience_growth") &&
    improvingTrend &&
    shouldAllowContinuityPromotion("persistent", evidenceDepth, 1)
  ) {
    candidates.push(
      createWisdomArtifact({
        category: "resilience",
        continuityLevel: resilientMaturity ? "institutionalized" : "persistent",
        title: "Persistent resilience improvement pattern preserved as organizational continuity.",
        summary:
          "Long-term resilience knowledge indicates sustained adaptation strength — this wisdom must survive leadership and team transitions.",
        supportingPatterns: ["resilience_growth", "maturity_improvement", "continuity_preserved"],
        confidence: 0.88,
        anchorIds: [],
        now,
      })
    );
  }

  if (
    adaptationTypes.includes("governance_stabilization") &&
    !correlationCategories.includes("escalation_chain") &&
    continuityPreserved
  ) {
    candidates.push(
      createWisdomArtifact({
        category: "governance",
        continuityLevel: "persistent",
        title: "Long-term governance stabilization success preserved as executive wisdom.",
        summary:
          "Governance wisdom preservation: sustained oversight and stabilization correlate with reduced systemic escalation over observed institutional cycles.",
        supportingPatterns: ["governance_stabilization", "oversight_success", "escalation_reduction"],
        confidence: 0.86,
        anchorIds: [],
        now,
      })
    );
  }

  if (
    (correlationCategories.includes("fragility_cycle") ||
      correlationCategories.includes("escalation_chain")) &&
    recallCategories.includes("fragility")
  ) {
    candidates.push(
      createWisdomArtifact({
        category: "fragility",
        continuityLevel: "retained",
        title: "Recurring operational fragility preserved as structural weakness knowledge.",
        summary:
          "Institutional continuity retains awareness of persistent fragility concentration — leadership must not lose this structural weakness context during reorganization.",
        supportingPatterns: [
          "fragility_cycle",
          "structural_weakness",
          "historical_recall_parallel",
        ],
        confidence: 0.87,
        anchorIds: [],
        now,
      })
    );
  }

  if (
    (adaptationTypes.includes("recovery_cycle") || adaptationTypes.includes("pressure_absorption")) &&
    stack?.executiveStabilityActive
  ) {
    candidates.push(
      createWisdomArtifact({
        category: "recovery",
        continuityLevel: "persistent",
        title: "Successful recovery behaviors across time preserved as institutional recovery intelligence.",
        summary:
          "Recovery intelligence continuity: pressure absorption and recovery cycles form repeatable organizational response patterns worth long-term preservation.",
        supportingPatterns: ["recovery_cycle", "pressure_absorption", "executive_stability"],
        confidence: 0.84,
        anchorIds: [],
        now,
      })
    );
  }

  if (
    adaptationTypes.includes("coordination_recovery") &&
    !correlationCategories.includes("coordination_breakdown")
  ) {
    candidates.push(
      createWisdomArtifact({
        category: "coordination",
        continuityLevel: "retained",
        title: "Long-term coordination improvement preserved as organizational adaptation continuity.",
        summary:
          "Coordination best practices emerging from adaptation recovery should persist — cross-system alignment improvements reduce long-term instability.",
        supportingPatterns: ["coordination_recovery", "adaptation_continuity", "alignment_improvement"],
        confidence: 0.82,
        anchorIds: [],
        now,
      })
    );
  }

  if (highConfidenceDistilled && evidenceDepth >= 6) {
    const level: ContinuityLevel = shouldAllowContinuityPromotion("foundational", evidenceDepth, 2)
      ? "foundational"
      : "institutionalized";
    if (shouldAllowContinuityPromotion(level, evidenceDepth, 2)) {
      candidates.push(
        createWisdomArtifact({
          category: "strategic",
          continuityLevel: level,
          title: "Repeated high-confidence strategic lesson preserved as foundational wisdom.",
          summary:
            "Distilled strategic insights with multi-layer institutional support form foundational operational principles — executive organizational wisdom must survive organizational change.",
          supportingPatterns: [
            "distilled_strategic_insight",
            "high_confidence_lesson",
            "foundational_wisdom",
          ],
          confidence: 0.9,
          anchorIds: [],
          now,
        })
      );
    }
  }

  if (correlationCategories.includes("escalation_chain")) {
    candidates.push(
      createWisdomArtifact({
        category: "escalation",
        continuityLevel: "retained",
        title: "Escalation trajectory wisdom preserved for executive continuity.",
        summary:
          "Decision outcome and correlation memory confirm escalation propagation patterns — preserved so future leadership recognizes early intervention value.",
        supportingPatterns: ["escalation_chain", "decision_outcome_memory", "early_intervention"],
        confidence: 0.8,
        anchorIds: [],
        now,
      })
    );
  }

  if (stack?.strategicCalibrationActive && continuityPreserved) {
    candidates.push(
      createWisdomArtifact({
        category: "operational",
        continuityLevel: "retained",
        title: "Strategic operational calibration principles preserved for continuity.",
        summary:
          "Operational wisdom under strategic calibration indicates localized stability management — preserve as long-term operational intelligence during organizational transitions.",
        supportingPatterns: ["strategic_calibration", "operational_continuity"],
        confidence: 0.76,
        anchorIds: [],
        now,
      })
    );
  }

  return candidates.filter((c) => shouldRetainWisdomArtifact(c, evidenceDepth));
}

function buildContinuityRecords(
  artifacts: readonly InstitutionalWisdomArtifact[]
): StrategicKnowledgeContinuityRecord[] {
  const byCategory = new Map<StrategicWisdomCategory, InstitutionalWisdomArtifact[]>();
  for (const a of artifacts) {
    const list = byCategory.get(a.category) ?? [];
    list.push(a);
    byCategory.set(a.category, list);
  }

  const records: StrategicKnowledgeContinuityRecord[] = [];
  for (const [category, group] of byCategory) {
    if (group.length === 0) continue;
    const anchor = group[0]!;
    records.push({
      continuityRecordId: stableSignature(["continuity-record", category, anchor.wisdomArtifactId]).slice(
        0,
        48
      ),
      category,
      continuityLevel: group.reduce<ContinuityLevel>((best, a) => {
        return continuityRank(a.continuityLevel) > continuityRank(best) ? a.continuityLevel : best;
      }, "temporary"),
      lesson: `Preserved ${category} wisdom: ${anchor.title}`,
      artifactIds: Object.freeze(group.map((a) => a.wisdomArtifactId)),
      firstPreservedAt: Math.min(...group.map((a) => a.generatedAt)),
      lastPreservedAt: Math.max(...group.map((a) => a.lastPreservedAt)),
      occurrenceCount: group.reduce((sum, a) => sum + a.occurrenceCount, 0),
    });
  }
  return records;
}

function buildKnowledgeAnchors(
  artifacts: readonly InstitutionalWisdomArtifact[],
  now: number
): InstitutionalKnowledgeAnchor[] {
  return artifacts
    .filter(
      (a) =>
        a.continuityLevel === "institutionalized" ||
        a.continuityLevel === "foundational" ||
        a.continuityLevel === "persistent"
    )
    .slice(0, 8)
    .map((a) => ({
      anchorId: stableSignature(["knowledge-anchor", a.wisdomArtifactId]).slice(0, 48),
      category: a.category,
      anchorLabel: `${a.category}_continuity_anchor`,
      wisdomSummary: a.summary,
      artifactIds: Object.freeze([a.wisdomArtifactId]),
      continuityLevel: a.continuityLevel,
      firstAnchoredAt: a.generatedAt,
      lastAnchoredAt: now,
    }));
}

function buildPreservationSignals(
  artifacts: readonly InstitutionalWisdomArtifact[],
  anchors: readonly InstitutionalKnowledgeAnchor[],
  now: number
): ExecutiveWisdomPreservationSignal[] {
  const signals: ExecutiveWisdomPreservationSignal[] = [];

  for (const a of artifacts.filter((x) => x.continuityLevel === "foundational").slice(0, 2)) {
    signals.push({
      signalId: stableSignature(["preservation-foundational", a.wisdomArtifactId]).slice(0, 48),
      category: a.category,
      signalType: "foundational",
      summary: a.summary,
      confidence: a.confidence,
      generatedAt: now,
    });
  }

  for (const anchor of anchors.slice(0, 2)) {
    signals.push({
      signalId: stableSignature(["preservation-anchor", anchor.anchorId]).slice(0, 48),
      category: anchor.category,
      signalType: "anchor",
      summary: anchor.wisdomSummary,
      confidence: 0.85,
      generatedAt: now,
    });
  }

  for (const a of artifacts
    .filter((x) => x.continuityLevel === "institutionalized")
    .slice(0, 2)) {
    signals.push({
      signalId: stableSignature(["preservation-institutional", a.wisdomArtifactId]).slice(0, 48),
      category: a.category,
      signalType: "preservation",
      summary: a.summary,
      confidence: a.confidence,
      generatedAt: now,
    });
  }

  return signals;
}

function resolveDominantContinuity(
  artifacts: readonly InstitutionalWisdomArtifact[]
): ContinuityLevel {
  if (artifacts.length === 0) return "temporary";
  return artifacts.reduce<ContinuityLevel>((best, a) => {
    return continuityRank(a.continuityLevel) > continuityRank(best) ? a.continuityLevel : best;
  }, "temporary");
}

function buildContinuityAggregateSnapshot(
  organizationId: string,
  storeState: ReturnType<ReturnType<typeof getInstitutionalContinuityStore>["getState"]>,
  now: number
): OrganizationalContinuitySnapshot {
  const summary =
    storeState.artifacts.length === 0
      ? "Wisdom continuity preservation awaiting sufficient institutional learning depth."
      : `Preserved ${storeState.artifacts.length} strategic organizational wisdom artifacts for long-term institutional continuity.`;

  return {
    signature: storeState.signature,
    organizationId,
    generatedAt: now,
    artifactCount: storeState.artifacts.length,
    anchorCount: storeState.knowledgeAnchors.length,
    continuitySummary: summary,
    dominantCategories: Object.freeze(
      Array.from(new Set(storeState.artifacts.map((a) => a.category))).slice(0, 4)
    ),
    dominantContinuityLevel: resolveDominantContinuity(storeState.artifacts),
    recentArtifacts: Object.freeze(storeState.artifacts.slice(0, 6)),
    continuityRecords: Object.freeze(storeState.continuityRecords.slice(0, 6)),
    preservationSignals: Object.freeze(storeState.preservationSignals.slice(0, 6)),
    knowledgeAnchors: Object.freeze(storeState.knowledgeAnchors.slice(0, 6)),
  };
}

export type InstitutionalKnowledgeContinuityResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: OrganizationalContinuitySnapshot | null;
  newArtifacts: number;
  storeSignature: string;
};

export function evaluateInstitutionalKnowledgeContinuity(
  input: InstitutionalKnowledgeContinuityInput
): InstitutionalKnowledgeContinuityResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginInstitutionalContinuityEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_continuity_guard",
      snapshot: null,
      newArtifacts: 0,
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
    const maturityState = getInstitutionalMaturityStore(organizationId).getState();

    const depth =
      memoryState.records.length +
      correlationState.correlations.length +
      adaptationState.adaptations.length +
      outcomeState.decisions.length +
      distillationState.insights.length +
      recallState.recalls.length +
      maturityState.snapshots.length;

    if (depth < 5) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_institutional_depth",
        snapshot: null,
        newArtifacts: 0,
        storeSignature: "",
      };
    }

    const store = getInstitutionalContinuityStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-2-8-continuity-eval",
      organizationId,
      memoryState.signature,
      correlationState.signature,
      adaptationState.signature,
      outcomeState.signature,
      distillationState.signature,
      recallState.signature,
      maturityState.signature,
      input.cognitionSnapshot?.signature ?? "no-cognition",
    ]);

    if (
      !shouldEvaluateInstitutionalContinuity(
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
          prior.artifacts.length > 0
            ? buildContinuityAggregateSnapshot(organizationId, prior, now)
            : null,
        newArtifacts: 0,
        storeSignature: prior.signature,
      };
    }

    const correlationCategories = correlationState.correlations.map((c) => c.category);
    const adaptationTypes = adaptationState.adaptations.map((a) => a.adaptationType);
    const outcomeCategories = outcomeState.decisions.map((d) => d.decisionCategory);
    const distilledInsightIds = distillationState.insights.map((i) => i.distilledInsightId);
    const maturityLevels = maturityState.snapshots.map((s) => s.maturityLevel);
    const maturityTrends = maturityState.snapshots.map((s) => s.evolutionTrend);
    const recallCategories = recallState.recalls.map((r) => r.category);
    const evidenceDepth = computeEvidenceDepth(
      memoryState.records.length,
      correlationState.correlations.length,
      adaptationState.adaptations.length,
      outcomeState.decisions.length,
      distillationState.insights.length,
      recallState.recalls.length,
      maturityState.snapshots.length
    );
    const priorCount = prior.artifacts.length;

    const candidates = inferWisdomArtifacts(
      input,
      correlationCategories,
      adaptationTypes,
      outcomeCategories,
      distilledInsightIds,
      maturityLevels,
      maturityTrends,
      recallCategories,
      evidenceDepth,
      input.continuityPreserved ?? true,
      now
    );

    if (candidates.length > 0) {
      store.upsertArtifacts(candidates, now);
    }

    const afterArtifacts = store.getState();
    const anchors = buildKnowledgeAnchors(afterArtifacts.artifacts, now);
    if (anchors.length > 0) {
      store.upsertKnowledgeAnchors(anchors, now);
      const anchorIds = anchors.map((a) => a.anchorId);
      const linked = afterArtifacts.artifacts.map((a) => ({
        ...a,
        linkedAnchorIds: Object.freeze(
          Array.from(new Set([...a.linkedAnchorIds, ...anchorIds.slice(0, 2)])).slice(0, 6)
        ),
      }));
      store.upsertArtifacts(linked, now);
    }

    const records = buildContinuityRecords(store.getState().artifacts);
    if (records.length > 0) {
      store.upsertContinuityRecords(records, now);
    }

    const finalAnchors = store.getState().knowledgeAnchors;
    const signals = buildPreservationSignals(store.getState().artifacts, finalAnchors, now);
    if (signals.length > 0) {
      store.upsertPreservationSignals(signals, now);
    }

    store.setLastEvaluationSignature(evaluationSignature);
    const finalState = store.getState();
    const newArtifacts = Math.max(0, finalState.artifacts.length - priorCount);

    const foundational = finalState.artifacts.find((a) => a.continuityLevel === "foundational");
    if (foundational && newArtifacts > 0) {
      devLog(`foundational wisdom — ${foundational.category}: ${foundational.title.slice(0, 72)}`);
    }

    const anchor = finalState.knowledgeAnchors[0];
    if (anchor && newArtifacts > 0) {
      devLog(`continuity anchor — ${anchor.category}: ${anchor.anchorLabel}`);
    }

    const institutionalized = finalState.artifacts.find(
      (a) => a.continuityLevel === "institutionalized"
    );
    if (institutionalized && newArtifacts > 0 && !foundational) {
      devLog(
        `institutionalized lesson — ${institutionalized.category}: ${institutionalized.summary.slice(0, 72)}`
      );
    }

    const snapshot = buildContinuityAggregateSnapshot(organizationId, finalState, now);

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newArtifacts,
      storeSignature: finalState.signature,
    };
  } finally {
    endInstitutionalContinuityEvaluation();
  }
}
