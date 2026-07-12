import type { ExecutiveIntentRegistry, ExecutiveIntentRegistryEntry } from "./executiveIntentResolutionTypes.ts";

const entry = (group: string, key: string, name: string, description: string) => Object.freeze({
  id: `eng-3-${group}-${key}`, key, name, description,
  status: "Approved", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveIntentRegistryEntry);
const entries = (group: string, values: readonly string[]) => Object.freeze(values.map((name) => entry(group, name.replaceAll(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), name, `Approved ${group} metadata for ${name}.`)));

export const ExecutiveIntentResolutionRegistry = Object.freeze({
  intentTypes: entries("intent-type", ["Analysis", "Recommendation", "Planning", "Prediction", "Simulation", "Monitoring", "Explanation", "Comparison", "Investigation", "Optimization", "Forecast", "Validation", "DecisionSupport", "Reporting", "GeneralInquiry"]),
  goals: entries("goal", ["Understand", "Evaluate", "Decide", "Improve", "Communicate"]),
  domains: entries("domain", ["Strategy", "Finance", "Revenue", "Operations", "Projects", "Resources", "Organization", "Risk", "Performance", "KPI", "OKR", "Workflow", "Scheduling", "Automation", "BusinessHealth", "Reporting", "General"]),
  capabilities: entries("capability", ["Read", "Analyze", "Compare", "Summarize", "Explain", "Predict", "Recommend", "Optimize", "Plan", "Validate", "Monitor", "Simulate", "Prioritize"]),
  outputExpectations: entries("output", ["Summary", "ExecutiveReport", "ActionPlan", "RecommendationList", "RiskAssessment", "ComparisonTable", "DecisionBrief", "ForecastReport", "Explanation", "Dashboard"]),
  lifecycleStages: entries("lifecycle", ["Received", "Normalized", "Classified", "Resolved", "Validated", "Approved", "Released"]),
  priorities: entries("priority", ["Critical", "High", "Normal", "Low"]),
  confidenceLevels: entries("confidence", ["Unspecified", "Low", "Medium", "High"]),
  statuses: entries("status", ["Received", "Normalized", "Classified", "Resolved", "Validated", "Approved", "Released"]),
} as const satisfies ExecutiveIntentRegistry);
