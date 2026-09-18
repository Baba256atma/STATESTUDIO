/**
 * NPA-T RMS:FINAL — RMS v1 architecture certification contract.
 * Not RMS:11. Audit of RMS:1–10 as one management simulation system.
 */

export const rmsFinalIdentity = "NPA-T RMS:FINAL/ManagementSimulationSystem" as const;

export const RMS_FINAL_BOUNDARY = Object.freeze({
  identity: rmsFinalIdentity,
  productName: "RMS v1 — Management Simulation System" as const,
  startsRms11: false as const,
  parallelD7GroundTruth: false as const,
  browserWalkthroughRequired: false as const,
  decisionTheatreRequired: false as const,
  hybridExpanded: false as const,
});

export const RMS_V1_INVARIANTS = Object.freeze([
  "sealed-ground-truth",
  "gt-not-nexora-knowledge",
  "operator-mediates-observability",
  "data-reality-canonical",
  "scenario-has-no-correct-answer",
  "event-not-problem",
  "simulation-causality-not-evidence",
  "manager-uses-real-nexora",
  "observer-read-only",
  "information-bounded-expectation",
  "watch-is-presentation",
  "one-active-manager-authority",
  "human-inherits-without-gt",
  "fork-equivalent-start",
  "branches-isolated",
  "simulation-action-provenance",
  "unsupported-no-invented-effects",
  "no-cc10-cc11-bypass",
  "comparison-descriptive",
  "not-real-world-prediction",
  "not-canonical-outcome",
  "not-durable-learning",
  "nmi-owns-structure",
  "vai-owns-causal-analysis",
  "nps-owns-problem-solving",
  "stage-advisor-production",
  "one-architecture-business-project",
  "runs-do-not-contaminate",
  "production-watch-path",
  "no-open-critical-regression",
] as const);
