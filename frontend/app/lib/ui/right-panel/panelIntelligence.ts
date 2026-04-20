import type { PanelSafeStatus, PanelSharedData } from "../../panels/panelDataResolverTypes";
import type { CanonicalRightPanelView } from "./rightPanelTypes";

type LooseRecord = Record<string, unknown>;

export type PanelIntent = "analyze" | "decide" | "explore" | "risk" | "optimize" | "unknown";

export type PanelIntelligenceInput = {
  view: CanonicalRightPanelView;
  panelData: PanelSharedData | null | undefined;
  resolverStatus?: PanelSafeStatus | string;
  context: {
    selectedObjectId?: string | null;
    sceneJson?: unknown;
    activeMode?: unknown;
    memory?: unknown;
    simulation?: unknown;
    risk?: unknown;
    userIntent?: string | null;
  };
};

export type PanelIntelligenceOutput = {
  view: CanonicalRightPanelView;
  enhancements: {
    highlightSections?: string[];
    prioritizeBlocks?: string[];
    collapseBlocks?: string[];
  };
  uiHints: {
    showCTA?: boolean;
    showSimulation?: boolean;
    showRiskFirst?: boolean;
    showExecutiveSummary?: boolean;
  };
  reasoning: string;
};

function isObject(value: unknown): value is LooseRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function getNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getNestedRecord(value: unknown, key: string): LooseRecord | null {
  if (!isObject(value) || !isObject(value[key])) return null;
  return value[key];
}

function collectIntentText(input: PanelIntelligenceInput): string {
  const segments: string[] = [];
  const add = (value: unknown) => {
    const text = getString(value);
    if (text) segments.push(text.toLowerCase());
  };

  add(input.context.userIntent);
  add(getNestedRecord(input.panelData?.responseData, "ai_reasoning")?.intent);
  add(getNestedRecord(input.panelData?.raw, "ai_reasoning")?.intent);
  add(getNestedRecord(input.panelData?.promptFeedback, "advice_feedback")?.intent);
  add(getNestedRecord(input.panelData?.promptFeedback, "scene_feedback")?.intent);
  add(getNestedRecord(input.panelData?.promptFeedback, "risk_feedback")?.intent);
  add(getNestedRecord(input.panelData?.strategicAdvice, "intent")?.toString?.());

  return segments.join(" ");
}

function inferIntent(input: PanelIntelligenceInput): PanelIntent {
  const text = collectIntentText(input);
  if (!text) return "unknown";

  if (/\b(risk|risky|hazard|threat|exposure|fragility)\b/.test(text)) return "risk";
  if (/\b(decide|decision|approval|governance|policy|council|choose)\b/.test(text)) return "decide";
  if (/\b(explore|simulate|scenario|replay|branch|what if)\b/.test(text)) return "explore";
  if (/\b(optimi[sz]e|improve|maximi[sz]e|minimi[sz]e)\b/.test(text)) return "optimize";
  if (/\b(analy[sz]e|analysis|inspect|review|evaluate)\b/.test(text)) return "analyze";
  return "unknown";
}

function getRiskLevel(risk: unknown): string | null {
  if (!isObject(risk)) return null;
  return getString(risk.level) ?? getString(risk.risk_level) ?? getString(risk.severity);
}

function hasHighRiskSignal(input: PanelIntelligenceInput): boolean {
  const risk = input.context.risk ?? input.panelData?.risk ?? null;
  const riskLevel = getRiskLevel(risk)?.toLowerCase() ?? null;
  if (riskLevel && ["high", "critical", "severe"].includes(riskLevel)) return true;

  if (isObject(risk)) {
    const score =
      getNumber(risk.score) ??
      getNumber(risk.risk_score) ??
      getNumber(risk.confidence_score) ??
      getNumber(risk.level_score);
    if (score !== null && score >= 0.7) return true;
  }

  const riskFeedback = getNestedRecord(input.panelData?.promptFeedback, "risk_feedback");
  const affectedDimensions = riskFeedback?.affected_dimensions;
  return Array.isArray(affectedDimensions) && affectedDimensions.length >= 3;
}

function hasStrongRecommendation(input: PanelIntelligenceInput): boolean {
  const advice = input.panelData?.strategicAdvice;
  const recommendation = input.panelData?.canonicalRecommendation;
  if (isObject(advice)) {
    const actions = advice.recommended_actions;
    if (Array.isArray(actions) && actions.length > 0) return true;
    if (getString(advice.summary) || getString(advice.recommendation)) return true;
  }
  if (isObject(recommendation)) {
    const primary = getNestedRecord(recommendation, "primary");
    if (primary && getString(primary.action)) return true;
    if (getString(recommendation.summary)) return true;
  }
  return false;
}

function hasSimulation(input: PanelIntelligenceInput): boolean {
  return Boolean(input.context.simulation ?? input.panelData?.simulation);
}

function hasExecutiveSummary(input: PanelIntelligenceInput): boolean {
  return Boolean(input.panelData?.executiveSummary ?? input.panelData?.decisionCockpit);
}

function hasActionGap(input: PanelIntelligenceInput): boolean {
  const advice = isObject(input.panelData?.strategicAdvice) ? input.panelData?.strategicAdvice : null;
  const actions = advice?.recommended_actions;
  return !Array.isArray(actions) || actions.length === 0;
}

function buildEnhancements(view: CanonicalRightPanelView, highRisk: boolean): PanelIntelligenceOutput["enhancements"] {
  if (view === "advice") {
    return {
      highlightSections: ["recommended_actions"],
      prioritizeBlocks: highRisk ? ["risk", "impact"] : ["recommendation", "summary"],
      collapseBlocks: ["low_signal_insights"],
    };
  }

  if (view === "risk" || view === "war_room") {
    return {
      highlightSections: ["risk_sources", "propagation_chain"],
      prioritizeBlocks: ["risk", "impact"],
      collapseBlocks: ["secondary_context"],
    };
  }

  if (view === "explanation") {
    return {
      highlightSections: ["recommendation", "evidence"],
      prioritizeBlocks: ["recommendation", "summary"],
      collapseBlocks: ["secondary_context"],
    };
  }

  if (view === "memory" || view === "org_memory") {
    return {
      highlightSections: ["volatile_nodes"],
      prioritizeBlocks: ["memory", "patterns"],
      collapseBlocks: ["secondary_context"],
    };
  }

  return {
    highlightSections: highRisk ? ["risk"] : ["summary"],
    prioritizeBlocks: highRisk ? ["risk", "impact"] : ["summary", "actions"],
    collapseBlocks: ["secondary_context"],
  };
}

export function getPanelIntelligence(input: PanelIntelligenceInput): PanelIntelligenceOutput {
  const intent = inferIntent(input);
  const highRisk = hasHighRiskSignal(input);
  const strongRecommendation = hasStrongRecommendation(input);
  const view = input.view;

  let reasoning = "No stronger emphasis signal was detected, so the current panel should keep its default presentation.";

  if (highRisk) {
    reasoning = "Detected strong risk signals; risk-related sections should be emphasized in the current panel.";
  } else if (intent === "decide" && (strongRecommendation || input.panelData?.strategicCouncil)) {
    reasoning = "Decision-focused intent suggests governance and recommendation content should be prioritized within the current panel.";
  } else if (intent === "explore" && hasSimulation(input)) {
    reasoning = "Simulation data is available and can be surfaced as an action or secondary section within the current panel.";
  } else if (intent === "risk" && input.panelData?.risk) {
    reasoning = "Risk-oriented intent was detected, so risk-related sections should be emphasized in the current panel.";
  } else if (strongRecommendation) {
    reasoning = "A strong recommendation is available, so recommendation-focused content should be prioritized in the current panel.";
  } else if (intent === "analyze") {
    reasoning = "Analysis-oriented intent suggests summary and evidence blocks should be emphasized in the current panel.";
  } else if (intent === "optimize") {
    reasoning = "Optimization intent suggests action-oriented and impact-related content should be emphasized in the current panel.";
  }

  const output: PanelIntelligenceOutput = {
    view,
    enhancements: buildEnhancements(input.view, highRisk),
    uiHints: {
      showCTA: hasActionGap(input),
      showSimulation: hasSimulation(input),
      showRiskFirst: highRisk,
      showExecutiveSummary: hasExecutiveSummary(input),
    },
    reasoning,
  };

  if (process.env.NODE_ENV !== "production") {
    console.log("[Nexora][PanelIntelligence]", {
      view: input.view,
      intent,
      reasoning: output.reasoning,
      uiHints: output.uiHints,
    });
  }

  return output;
}
