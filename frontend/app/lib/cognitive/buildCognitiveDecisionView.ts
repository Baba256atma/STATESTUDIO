import { buildCognitiveNarrative } from "./buildCognitiveNarrative";
import type { CognitiveDecisionView, CognitiveStyle } from "./cognitiveStyleTypes";

type BuildCognitiveDecisionViewInput = {
  style: CognitiveStyle;
  canonicalRecommendation?: any | null;
  executiveSummary?: any | null;
  confidenceModel?: any | null;
  compareModel?: any | null;
  simulation?: any | null;
  patternIntelligence?: any | null;
  strategicLearning?: any | null;
  metaDecision?: any | null;
};

function text(value: unknown, fallback = "") {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  return normalized || fallback;
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
    text(input.simulation?.impact?.summary, "Expected impact remains limited")
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
        text(input.simulation?.risk?.summary),
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
        text(input.simulation?.timeline?.[0]?.summary),
        text(input.simulation?.risk?.summary, risk),
        text(input.canonicalRecommendation?.primary?.target_ids?.join(", "), "Target scope is limited"),
      ]),
      risks_to_watch: unique([
        risk,
        tradeoff,
        input.metaDecision?.warnings?.[0],
      ]),
      supporting_evidence: unique([
        text(input.simulation?.timeline?.[1]?.summary),
        text(input.simulation?.impact?.summary),
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
