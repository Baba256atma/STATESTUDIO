import type { ExecutiveRequestCategory, ExecutiveRequestIntentRegistryEntry } from "./executiveRequestIntentTypes.ts";

const entry = (id: string, category: ExecutiveRequestCategory, name: string, description: string) => Object.freeze({
  id, category, name, description,
  status: "Approved", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRequestIntentRegistryEntry);

export const ExecutiveRequestIntentRegistry = Object.freeze([
  entry("request-category-analysis", "Analysis", "Analysis", "Requests for descriptive examination metadata."),
  entry("request-category-planning", "Planning", "Planning", "Requests associated with future planning architecture."),
  entry("request-category-monitoring", "Monitoring", "Monitoring", "Requests associated with observation and monitoring architecture."),
  entry("request-category-decision-support", "DecisionSupport", "Decision Support", "Requests associated with decision-support architecture."),
  entry("request-category-reporting", "Reporting", "Reporting", "Requests associated with report-oriented architecture."),
  entry("request-category-navigation", "Navigation", "Navigation", "Requests associated with navigation-oriented architecture."),
  entry("request-category-explanation", "Explanation", "Explanation", "Requests associated with explanatory architecture."),
  entry("request-category-recommendation", "Recommendation", "Recommendation", "Requests associated with recommendation architecture."),
  entry("request-category-simulation", "Simulation", "Simulation", "Requests associated with simulation architecture."),
  entry("request-category-investigation", "Investigation", "Investigation", "Requests associated with investigation architecture."),
] as const);
