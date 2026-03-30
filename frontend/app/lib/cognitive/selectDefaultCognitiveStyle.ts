import type { CognitiveStyle } from "./cognitiveStyleTypes";

type SelectDefaultCognitiveStyleInput = {
  activeMode?: string | null;
  rightPanelView?: string | null;
  responseData?: any | null;
  canonicalRecommendation?: any | null;
};

function text(value: unknown) {
  return String(value ?? "").toLowerCase();
}

export function selectDefaultCognitiveStyle(input: SelectDefaultCognitiveStyleInput): {
  style: CognitiveStyle;
  reason: string;
} {
  const mode = text(input.activeMode);
  const panel = text(input.rightPanelView);
  const recommendationText = [
    input.canonicalRecommendation?.primary?.action,
    input.canonicalRecommendation?.reasoning?.why,
    input.canonicalRecommendation?.reasoning?.risk_summary,
    input.responseData?.executive_summary_surface?.why_it_matters,
  ]
    .map(text)
    .join(" ");

  if (mode.includes("analyst") || panel.includes("compare") || panel.includes("confidence")) {
    return {
      style: "analyst",
      reason: "The current mode or panel emphasizes evidence, trade-offs, and uncertainty.",
    };
  }
  if (panel.includes("war_room") || panel.includes("timeline") || /dependency|bottleneck|node|throughput|flow/.test(recommendationText)) {
    return {
      style: "operator",
      reason: "The current context is execution-heavy, so operational dependencies and immediate steps matter most.",
    };
  }
  if (/capital|margin|portfolio|downside|exposure|liquidity|cash|allocation/.test(recommendationText)) {
    return {
      style: "investor",
      reason: "The current decision language is exposure- and capital-sensitive, so an investor lens is the best fit.",
    };
  }
  return {
    style: "executive",
    reason: "No stronger role signal was detected, so Nexora is defaulting to a concise executive framing.",
  };
}
