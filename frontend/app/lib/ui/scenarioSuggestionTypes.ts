/** E2:13 — Executive scenario suggestion contracts. */
// E2:14 Scenario comparison workspace
// D4 Decision recommendation engine
// D6 Simulation execution
// D7 Advisory reasoning
// D8 Strategic memory
// D9 Executive governance review

export type ScenarioSuggestionStatus = "recommended" | "candidate" | "selected" | "active";

export type ScenarioImpactIndicators = {
  risk?: number;
  cost?: number;
  stability?: number;
  flow?: number;
  confidence?: number;
};

export type ScenarioSuggestion = {
  id: string;
  title: string;
  confidence?: number;
  impact?: number;
  description?: string;
  status?: ScenarioSuggestionStatus;
  riskReduction?: number;
  indicators?: ScenarioImpactIndicators;
};

export type ExecutiveScenarioSuggestionsModel = {
  scenarios: ScenarioSuggestion[];
  compareReady: boolean;
};

export const DEFAULT_EXECUTIVE_SCENARIO_SUGGESTIONS: ScenarioSuggestion[] = [
  {
    id: "expedite_supplier_b",
    title: "Expedite Supplier B",
    confidence: 72,
    impact: -18,
    riskReduction: 14,
    status: "recommended",
    description: "Accelerate Supplier B fulfillment to recover near-term delivery pressure.",
    indicators: { risk: 68, cost: 42, stability: 55, flow: 61, confidence: 72 },
  },
  {
    id: "find_alt_supplier",
    title: "Find Alternative Supplier",
    confidence: 78,
    impact: -25,
    riskReduction: 22,
    status: "candidate",
    description: "Reduces dependency risk by introducing a second supply source.",
    indicators: { risk: 74, cost: 48, stability: 62, flow: 58, confidence: 78 },
  },
  {
    id: "adjust_production",
    title: "Adjust Production Plan",
    confidence: 65,
    impact: -12,
    riskReduction: 10,
    status: "candidate",
    description: "Re-sequence production to protect high-priority orders.",
    indicators: { risk: 58, cost: 52, stability: 60, flow: 54, confidence: 65 },
  },
  {
    id: "increase_safety_stock",
    title: "Increase Safety Stock",
    confidence: 61,
    impact: -9,
    riskReduction: 16,
    status: "candidate",
    description: "Buffers short-term volatility while supplier recovery stabilizes.",
    indicators: { risk: 52, cost: 38, stability: 66, flow: 50, confidence: 61 },
  },
  {
    id: "delay_low_priority",
    title: "Delay Low-Priority Orders",
    confidence: 58,
    impact: -7,
    riskReduction: 8,
    status: "candidate",
    description: "Protects critical commitments by deferring non-essential demand.",
    indicators: { risk: 46, cost: 35, stability: 57, flow: 44, confidence: 58 },
  },
  {
    id: "diversify_vendor",
    title: "Diversify Vendor Base",
    confidence: 70,
    impact: -20,
    riskReduction: 24,
    status: "candidate",
    description: "Spreads concentration risk across additional qualified vendors.",
    indicators: { risk: 71, cost: 45, stability: 64, flow: 56, confidence: 70 },
  },
];

export function buildDefaultExecutiveScenarioSuggestionsModel(): ExecutiveScenarioSuggestionsModel {
  return {
    scenarios: DEFAULT_EXECUTIVE_SCENARIO_SUGGESTIONS,
    compareReady: DEFAULT_EXECUTIVE_SCENARIO_SUGGESTIONS.length >= 2,
  };
}
