import { buildCognitiveNarrative } from "./buildCognitiveNarrative";
import type { DecisionConfidenceModel } from "../decision/confidence/buildDecisionConfidenceModel";
import type { StrategicLearningState } from "../decision/learning/strategicLearningTypes";
import type { MetaDecisionState } from "../decision/meta/metaDecisionTypes";
import type { DecisionPatternIntelligence } from "../decision/patterns/decisionPatternTypes";
import type { ComparePanelModel } from "../decision/recommendation/buildComparePanelModel";
import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import type { CognitiveDecisionView, CognitiveStyle } from "./cognitiveStyleTypes";

type BuildCognitiveDecisionViewInput = {
  style: CognitiveStyle;
  canonicalRecommendation?: CanonicalRecommendation | null;
  executiveSummary?: Record<string, unknown> | null;
  confidenceModel?: DecisionConfidenceModel | null;
  compareModel?: ComparePanelModel | null;
  simulation?: Record<string, unknown> | null;
  patternIntelligence?: DecisionPatternIntelligence | null;
  strategicLearning?: StrategicLearningState | null;
  metaDecision?: MetaDecisionState | null;
};

function text(value: unknown, fallback = "") {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  return normalized || fallback;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readNestedString(record: Record<string, unknown> | null | undefined, ...keys: string[]): string {
  let current: unknown = record;
  for (const key of keys) {
    current = asRecord(current)?.[key];
  }
  return text(current);
}

function readNestedArray(record: Record<string, unknown> | null | undefined, ...keys: string[]): unknown[] {
  let current: unknown = record;
  for (const key of keys) {
    current = asRecord(current)?.[key];
  }
  return Array.isArray(current) ? current : [];
}

function readTimelineSummary(record: Record<string, unknown> | null | undefined, index: number): string {
  const timeline = readNestedArray(record, "timeline");
  return text(asRecord(timeline[index])?.summary);
}

function unique(values: unknown[], limit = 4) {
  return Array.from(new Set(values.map((value) => text(value)).filter(Boolean))).slice(0, limit);
}

export function buildCognitiveDecisionView(input: BuildCognitiveDecisionViewInput): CognitiveDecisionView {
  const action = text(input.canonicalRecommendation?.primary?.action, "No recommendation available yet");
  const why = text(
    input.canonicalRecommendation?.reasoning?.why,
    text(input.executiveSummary?.why_it_matters, "the current situation warrants a deliberate response")
  );
  const impact = text(
    input.canonicalRecommendation?.primary?.impact_summary,
    readNestedString(input.simulation, "impact", "summary") || "Expected impact remains limited"
  );
  const risk = text(
    input.canonicalRecommendation?.reasoning?.risk_summary,
    text(input.executiveSummary?.why_it_matters, "risk visibility remains limited")
  );
  const tradeoff = text(
    input.compareModel?.tradeoffs?.[0],
    input.compareModel?.whyNotOthers?.[0] ?? "the main trade-offs remain material"
  );
  const confidence = `${text(input.confidenceModel?.level, "moderate")} confidence`;
  const defaultActions = unique([
    ...(input.metaDecision?.next_best_actions ?? []),
    "Review the recommended move",
    "Keep simulation and compare available",
  ]);
  const evidence = unique([
    input.confidenceModel?.explanation,
    input.patternIntelligence?.top_success_patterns?.[0],
    input.strategicLearning?.strategic_guidance,
    input.metaDecision?.rationale,
  ]);
  const risks = unique([
    input.confidenceModel?.uncertainties?.[0],
    input.patternIntelligence?.top_failure_patterns?.[0],
    input.strategicLearning?.domain_drift?.summary,
    risk,
  ]);

  if (input.style === "analyst") {
    return {
      style: input.style,
      headline: `${action} with ${confidence}`,
      summary: buildCognitiveNarrative({ style: input.style, action, why, confidence, tradeoff, impact, risk }),
      primary_focus: unique([
        confidence,
        text(input.metaDecision?.rationale, why),
        text(tradeoff, "Trade-offs remain visible"),
      ]),
      risks_to_watch: risks,
      supporting_evidence: unique([
        readNestedString(input.simulation, "risk", "summary"),
        text(input.confidenceModel?.assumptions?.[0]),
        ...evidence,
      ]),
      next_actions: unique([
        "Check assumptions and uncertainty first",
        ...defaultActions,
      ]),
      decision_framing: "Evidence-first framing",
      confidence_framing: text(input.confidenceModel?.explanation, confidence),
      tradeoff_framing: tradeoff,
    };
  }

  if (input.style === "operator") {
    return {
      style: input.style,
      headline: `${text(input.executiveSummary?.happened, "Operational pressure is building")} -> ${action}`,
      summary: buildCognitiveNarrative({ style: input.style, action, why, confidence, tradeoff, impact, risk }),
      primary_focus: unique([
        readTimelineSummary(input.simulation, 0),
        readNestedString(input.simulation, "risk", "summary") || risk,
        text(input.canonicalRecommendation?.primary?.target_ids?.join(", "), "Target scope is limited"),
      ]),
      risks_to_watch: unique([
        risk,
        tradeoff,
        input.metaDecision?.warnings?.[0],
      ]),
      supporting_evidence: unique([
        readTimelineSummary(input.simulation, 1),
        readNestedString(input.simulation, "impact", "summary"),
        text(input.metaDecision?.selected_strategy?.replace(/_/g, " ")),
      ]),
      next_actions: unique([
        "Preview the affected nodes first",
        "Run simulation before escalation",
        ...defaultActions,
      ]),
      decision_framing: "Execution-first framing",
      confidence_framing: "Use confidence as an operating risk signal, not just a summary score.",
      tradeoff_framing: tradeoff,
    };
  }

  if (input.style === "investor") {
    return {
      style: input.style,
      headline: `${action} to improve resilience and reduce downside`,
      summary: buildCognitiveNarrative({ style: input.style, action, why, confidence, tradeoff, impact, risk }),
      primary_focus: unique([
        risk,
        impact,
        text(input.strategicLearning?.strategic_guidance),
      ]),
      risks_to_watch: unique([
        tradeoff,
        input.confidenceModel?.uncertainties?.[0],
        input.patternIntelligence?.top_failure_patterns?.[0],
      ]),
      supporting_evidence: unique([
        confidence,
        text(input.executiveSummary?.why_it_matters),
        text(input.metaDecision?.rationale),
      ]),
      next_actions: unique([
        "Review downside before upside",
        "Compare one lower-risk alternative",
        ...defaultActions,
      ]),
      decision_framing: "Exposure and resilience framing",
      confidence_framing: "Confidence should be read through downside protection and calibration quality.",
      tradeoff_framing: tradeoff,
    };
  }

  return {
    style: input.style,
    headline: `${text(input.executiveSummary?.happened, "Current pressure")} -> ${action}`,
    summary: buildCognitiveNarrative({ style: input.style, action, why, confidence, tradeoff, impact, risk }),
    primary_focus: unique([
      action,
      impact,
      text(input.metaDecision?.rationale, why),
    ]),
    risks_to_watch: risks,
    supporting_evidence: evidence,
    next_actions: unique([
      "Act on the clearest next move",
      ...defaultActions,
    ]),
    decision_framing: "Strategic executive framing",
    confidence_framing: text(input.confidenceModel?.explanation, confidence),
    tradeoff_framing: tradeoff,
  };
}
