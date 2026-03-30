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
  adaptedView: CanonicalRightPanelView;
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

function canAdaptFromView(view: CanonicalRightPanelView): boolean {
  return (
    view === "dashboard" ||
    view === "strategic_command" ||
    view === "simulate"
  );
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
  const adaptable = canAdaptFromView(input.view);

  let adaptedView: CanonicalRightPanelView = input.view;
  let reasoning = "Kept the current panel because no higher-confidence adaptation signal was found.";

  if (adaptable) {
    if (highRisk) {
      adaptedView = input.panelData?.warRoom ? "war_room" : "risk";
      reasoning = "Detected a strong risk signal, so Nexora is prioritizing the risk-oriented panel.";
    } else if (intent === "risk" && input.panelData?.risk) {
      adaptedView = "risk";
      reasoning = "User intent and available data both point to risk exploration.";
    } else if (intent === "decide" && (strongRecommendation || input.panelData?.strategicCouncil)) {
      adaptedView = "decision_council";
      reasoning = "Decision-focused intent with recommendation context makes the council view the safest upgrade.";
    } else if (intent === "explore" && hasSimulation(input)) {
      adaptedView = "simulate";
      reasoning = "Exploration intent with simulation data available makes simulation the most useful panel.";
    } else if (strongRecommendation && input.view !== "advice") {
      adaptedView = "advice";
      reasoning = "A strong recommendation is available, so advice is surfaced first.";
    }
  } else {
    reasoning = "Kept the current panel because it appears to be an explicit, specialized view.";
  }

  const output: PanelIntelligenceOutput = {
    adaptedView,
    enhancements: buildEnhancements(adaptedView, highRisk),
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
      originalView: input.view,
      adaptedView: output.adaptedView,
      intent,
      reasoning: output.reasoning,
    });
  }

  return output;
}
