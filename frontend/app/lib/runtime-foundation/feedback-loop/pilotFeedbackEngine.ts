import { stableSignature } from "../../intelligence/shared/dedupe";
import {
  beginPilotFeedbackEvaluation,
  clampPilotFeedbackConfidence,
  endPilotFeedbackEvaluation,
  inferFeedbackCategory,
  inferFeedbackSeverity,
  PILOT_FEEDBACK_MAX_RECOMMENDATIONS,
  sanitizePilotFeedbackCapture,
  shouldEvaluatePilotFeedbackLoop,
  validateMVPPilotFeedback,
  validatePilotLearningSnapshot,
} from "./pilotFeedbackGuards";
import { getPilotFeedbackStore } from "./pilotFeedbackStore";
import type {
  ExecutiveFeedbackSignal,
  FeedbackCategory,
  FeedbackSeverity,
  MVPPilotFeedback,
  PilotFeedbackHistoryEntry,
  PilotFeedbackLearningLoopInput,
  PilotFeedbackLearningLoopResult,
  PilotImprovementRecommendation,
  PilotLearningSnapshot,
  SubmitMVPPilotFeedbackInput,
  SubmitMVPPilotFeedbackResult,
} from "./pilotFeedbackTypes";

const DEV_LOG_PREFIX = "[Nexora][PilotFeedback]";
const FEEDBACK_LOOP_ID_PREFIX = "mvp_pilot_feedback";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildFeedbackSummary(
  sanitized: ReturnType<typeof sanitizePilotFeedbackCapture>,
  category: FeedbackCategory
): string {
  const primary =
    sanitized.whatShouldImprove ||
    sanitized.whatConfusedYou ||
    sanitized.whatFeltValuable ||
    sanitized.pilotNotes;
  if (!primary) return "Pilot feedback captured.";
  return `${category.replace(/_/g, " ")} — ${primary.slice(0, 120)}`;
}

export function submitMVPPilotFeedback(
  input: SubmitMVPPilotFeedbackInput
): SubmitMVPPilotFeedbackResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();
  const sanitized = sanitizePilotFeedbackCapture(input.capture);

  const hasContent =
    sanitized.whatConfusedYou.length > 0 ||
    sanitized.whatFeltValuable.length > 0 ||
    sanitized.whatShouldImprove.length > 0 ||
    sanitized.pilotNotes.length > 0;

  if (!hasContent) {
    return { submitted: false, reason: "empty_feedback", feedback: null, duplicate: false };
  }

  const combinedText = [
    sanitized.whatConfusedYou,
    sanitized.whatFeltValuable,
    sanitized.whatShouldImprove,
    sanitized.pilotNotes,
  ].join(" ");

  const category = inferFeedbackCategory(combinedText);
  const severity = inferFeedbackSeverity(
    category,
    combinedText,
    sanitized.containsSensitivePattern
  );

  const signature = stableSignature([
    "mvp-pilot-feedback-entry",
    organizationId,
    category,
    sanitized.whatConfusedYou,
    sanitized.whatFeltValuable,
    sanitized.whatShouldImprove,
    sanitized.pilotNotes,
  ]);

  const store = getPilotFeedbackStore(organizationId);
  const duplicate = store.getState().feedbackEntries.some((e) => e.signature === signature);
  if (duplicate) {
    return {
      submitted: false,
      reason: "duplicate_feedback",
      feedback: null,
      duplicate: true,
    };
  }

  const feedback: MVPPilotFeedback = {
    feedbackId: stableSignature(["feedback-id", signature, String(now)]).slice(0, 48),
    organizationId,
    signature,
    generatedAt: now,
    category,
    severity,
    summary: buildFeedbackSummary(sanitized, category),
    whatConfusedYou: sanitized.whatConfusedYou,
    whatFeltValuable: sanitized.whatFeltValuable,
    whatShouldImprove: sanitized.whatShouldImprove,
    pilotNotes: sanitized.pilotNotes,
    containsSensitivePattern: sanitized.containsSensitivePattern,
  };

  if (!validateMVPPilotFeedback(feedback)) {
    return { submitted: false, reason: "invalid_feedback", feedback: null, duplicate: false };
  }

  store.upsertFeedbackEntries([feedback], now);
  devLog(`feedback captured — category ${category}, severity ${severity}`);

  return { submitted: true, feedback, duplicate: false };
}

function collectExecutiveSignals(
  entries: readonly MVPPilotFeedback[],
  input: PilotFeedbackLearningLoopInput,
  now: number
): ExecutiveFeedbackSignal[] {
  const signalCounts = new Map<string, { category: FeedbackCategory; severity: FeedbackSeverity; summary: string; count: number }>();

  for (const entry of entries) {
    const key = stableSignature([entry.category, entry.summary.slice(0, 80)]).slice(0, 32);
    const existing = signalCounts.get(key);
    if (existing) {
      existing.count += 1;
      if (severityRank(entry.severity) > severityRank(existing.severity)) {
        existing.severity = entry.severity;
      }
    } else {
      signalCounts.set(key, {
        category: entry.category,
        severity: entry.severity,
        summary: entry.summary,
        count: 1,
      });
    }
  }

  const demo = input.demoModeSnapshot;
  if (demo?.demoRisks.length) {
    for (const risk of demo.demoRisks.slice(0, 3)) {
      const key = stableSignature(["runtime-demo-risk", risk.summary]).slice(0, 32);
      signalCounts.set(key, {
        category: risk.category === "panel_readiness" ? "panel_confusion" : "ui_stability",
        severity: risk.severity === "critical" ? "high" : "medium",
        summary: risk.summary,
        count: 1,
      });
    }
  }

  const smoke = input.smokeTestSuite;
  if (smoke && smoke.warned > 0) {
    signalCounts.set("smoke_validation_warnings", {
      category: "demo_flow",
      severity: "medium",
      summary: "Smoke validation warnings suggest demo flow review.",
      count: smoke.warned,
    });
  }

  const operational = input.operationalReliabilitySnapshot;
  if (operational?.trustState === "monitored" || operational?.trustState === "conditionally_trusted") {
    signalCounts.set("runtime_trust_monitoring", {
      category: "trust",
      severity: "medium",
      summary: "Executive trust remains under monitoring during pilot.",
      count: 1,
    });
  }

  return Array.from(signalCounts.entries())
    .map(([signalKey, value]) => ({
      signalId: stableSignature(["exec-feedback-signal", signalKey]).slice(0, 48),
      signalKey,
      category: value.category,
      severity: value.severity,
      summary: value.summary,
      occurrenceCount: value.count,
      generatedAt: now,
    }))
    .sort((a, b) => b.occurrenceCount - a.occurrenceCount);
}

function severityRank(severity: FeedbackSeverity): number {
  const ranks: Record<FeedbackSeverity, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };
  return ranks[severity];
}

function deriveOverallSeverity(
  entries: readonly MVPPilotFeedback[],
  signals: readonly ExecutiveFeedbackSignal[]
): FeedbackSeverity {
  const severities = [
    ...entries.map((e) => e.severity),
    ...signals.map((s) => s.severity),
  ];
  if (severities.some((s) => s === "critical")) return "critical";
  if (severities.some((s) => s === "high")) return "high";
  if (severities.some((s) => s === "medium")) return "medium";
  return "low";
}

function buildRecommendations(
  signals: readonly ExecutiveFeedbackSignal[],
  entries: readonly MVPPilotFeedback[],
  now: number
): PilotImprovementRecommendation[] {
  const recommendations: PilotImprovementRecommendation[] = [];
  let priority = 1;

  const add = (category: FeedbackCategory, summary: string, rationale: string) => {
    recommendations.push({
      recommendationId: stableSignature(["pilot-rec", category, summary]).slice(0, 48),
      priority: priority++,
      category,
      summary,
      rationale,
      generatedAt: now,
    });
  };

  const confusedCount = entries.filter((e) => e.whatConfusedYou.length > 0).length;
  const improveCount = entries.filter((e) => e.whatShouldImprove.length > 0).length;
  const valuableCount = entries.filter((e) => e.whatFeltValuable.length > 0).length;

  if (signals.some((s) => s.signalKey.includes("input") || s.category === "data_input") || confusedCount > 0) {
    add(
      "data_input",
      "Simplify first-run input instructions.",
      "Pilot feedback references input flow confusion."
    );
  }

  if (signals.some((s) => s.category === "panel_confusion")) {
    add(
      "panel_confusion",
      "Add short explanation under each executive panel.",
      "Repeated panel language or navigation confusion detected."
    );
  }

  if (signals.some((s) => s.category === "trust") || entries.some((e) => e.category === "trust")) {
    add(
      "trust",
      "Show why Nexora recommends the current focus.",
      "Executive trust explanation requested in pilot feedback."
    );
  }

  if (signals.some((s) => s.category === "decision_value") || valuableCount > 0) {
    add(
      "decision_value",
      "Highlight decision value earlier in the demo flow.",
      "Pilot feedback shows interest in executive risk explanation."
    );
  }

  if (signals.some((s) => s.category === "clarity") || improveCount > 0) {
    add(
      "clarity",
      "Reduce technical panel language in first executive view.",
      "Improvement notes reference clarity and simpler language."
    );
  }

  if (signals.some((s) => s.category === "demo_flow")) {
    add(
      "demo_flow",
      "Rehearse demo path after smoke validation warnings.",
      "Demo flow friction aligned with runtime validation signals."
    );
  }

  if (recommendations.length === 0) {
    add(
      "unknown",
      "Collect additional pilot notes after next executive session.",
      "Insufficient structured feedback for iteration priorities."
    );
  }

  return recommendations.slice(0, PILOT_FEEDBACK_MAX_RECOMMENDATIONS);
}

function buildLearningSummary(
  entries: readonly MVPPilotFeedback[],
  signals: readonly ExecutiveFeedbackSignal[],
  recommendations: readonly PilotImprovementRecommendation[]
): string {
  if (entries.length === 0 && signals.length === 0) {
    return "Awaiting pilot feedback. Runtime signals are monitored; no executive learning summary yet.";
  }

  const valuableThemes = entries
    .filter((e) => e.whatFeltValuable.length > 0)
    .map((e) => e.category);
  const confusionThemes = entries
    .filter((e) => e.whatConfusedYou.length > 0)
    .map((e) => e.category);

  const hasValue = valuableThemes.includes("decision_value") || valuableThemes.includes("trust");
  const hasConfusion =
    confusionThemes.includes("data_input") ||
    confusionThemes.includes("panel_confusion") ||
    confusionThemes.includes("clarity");

  if (hasValue && hasConfusion) {
    return "Pilot feedback indicates strong interest in executive risk explanation, but users need clearer input guidance and simpler panel language.";
  }

  if (hasConfusion) {
    return "Pilot feedback highlights confusion areas that should be simplified before wider release.";
  }

  if (hasValue) {
    return "Pilot feedback shows executive value in risk explanation and recommended focus — refine presentation clarity.";
  }

  if (recommendations[0]) {
    return `Pilot learning loop identified ${recommendations.length} improvement area(s) for controlled MVP iteration.`;
  }

  return "Pilot feedback captured with bounded runtime learning signals.";
}

function buildTopSignals(signals: readonly ExecutiveFeedbackSignal[]): string[] {
  const keys = signals.map((s) => {
    if (s.category === "data_input") return "input_flow_confusion";
    if (s.category === "panel_confusion") return "panel_language_too_technical";
    if (s.category === "trust") return "trust_explanation_needed";
    if (s.category === "decision_value") return "decision_value_recognized";
    if (s.category === "clarity") return "clarity_improvement_needed";
    if (s.category === "demo_flow") return "demo_flow_friction";
    if (s.category === "ui_stability") return "ui_stability_concern";
    if (s.category === "scene_understanding") return "scene_understanding_gap";
    return s.signalKey.replace(/[^a-z0-9]+/gi, "_").slice(0, 40);
  });

  return Array.from(new Set(keys)).slice(0, 6);
}

function buildIterationPriorities(recommendations: readonly PilotImprovementRecommendation[]): string[] {
  return [...recommendations]
    .sort((a, b) => a.priority - b.priority)
    .map((r) => r.summary)
    .slice(0, 5);
}

export function evaluatePilotFeedbackLearningLoop(
  input: PilotFeedbackLearningLoopInput
): PilotFeedbackLearningLoopResult {
  if (!beginPilotFeedbackEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getPilotFeedbackStore(organizationId);
    const prior = store.getState();
    const entries = prior.feedbackEntries;

    const executiveSignals = collectExecutiveSignals(entries, input, now);
    const recommendations = buildRecommendations(executiveSignals, entries, now);
    const severity = deriveOverallSeverity(entries, executiveSignals);
    const topSignals = buildTopSignals(executiveSignals);
    const summary = buildLearningSummary(entries, executiveSignals, recommendations);
    const iterationPriorities = buildIterationPriorities(recommendations);

    const confidence = clampPilotFeedbackConfidence(
      0.5 +
        Math.min(entries.length, 5) * 0.06 +
        Math.min(executiveSignals.length, 4) * 0.04 -
        (severity === "critical" ? 0.1 : 0)
    );

    const evaluationSignature = stableSignature([
      "mvp-pilot-feedback-loop",
      organizationId,
      entries.length,
      topSignals.join(","),
      recommendations.map((r) => r.recommendationId).join(","),
      severity,
      input.demoModeSnapshot?.signature ?? "no-demo",
      input.smokeTestSuite?.signature ?? "no-smoke",
      input.readinessDashboardStatus ?? "unknown",
    ]);

    if (
      !shouldEvaluatePilotFeedbackLoop(
        organizationId,
        evaluationSignature,
        prior.lastEvaluationSignature,
        now
      )
    ) {
      return {
        evaluated: false,
        skipped: true,
        reason: "deduped_or_paced",
        snapshot: prior.learningSnapshots[0] ?? null,
        storeSignature: prior.signature,
      };
    }

    const snapshot: PilotLearningSnapshot = {
      feedbackLoopId: `${FEEDBACK_LOOP_ID_PREFIX}_${stableSignature([organizationId, evaluationSignature]).slice(0, 8)}`,
      organizationId,
      signature: evaluationSignature,
      generatedAt: now,
      summary,
      topSignals: Object.freeze(topSignals),
      recommendations: Object.freeze(recommendations),
      severity,
      confidence,
      feedbackEntryCount: entries.length,
      executiveSignals: Object.freeze(executiveSignals),
      iterationPriorities: Object.freeze(iterationPriorities),
    };

    if (!validatePilotLearningSnapshot(snapshot)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "invalid_learning_snapshot",
        snapshot: prior.learningSnapshots[0] ?? null,
        storeSignature: prior.signature,
      };
    }

    const historyEntry: PilotFeedbackHistoryEntry = {
      entryId: stableSignature(["pilot-feedback-history", snapshot.signature]).slice(0, 48),
      severity,
      headline: summary.slice(0, 100),
      generatedAt: now,
    };

    store.upsertLearningSnapshots([snapshot], now);
    store.upsertImprovementSignals(executiveSignals, now);
    store.upsertFeedbackHistory([historyEntry], now);
    store.setLastEvaluationSignature(evaluationSignature);

    if (entries.length === 0) {
      devLog("learning loop — awaiting pilot feedback, runtime-only signals summarized");
    } else {
      devLog(`learning loop — ${entries.length} feedback entries, severity ${severity}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      storeSignature: store.getState().signature,
    };
  } finally {
    endPilotFeedbackEvaluation();
  }
}
