/**
 * MRP:9:2 — Legacy recommendation system findings.
 */

export const WORKSPACE_RECOMMENDATION_LEGACY_FINDINGS = Object.freeze({
  enterpriseStrategicRecommendation: {
    path: "frontend/app/lib/recommendation/",
    behavior: "Enterprise strategic recommendation engines and advisory models.",
    conflict: "Different domain — strategic AI recommendations vs workspace navigation guidance.",
    migration: "Keep separate; workspace recommendations route to executive workspaces only.",
    status: "decoupled",
  },
  executiveOsRecommendations: {
    path: "frontend/app/lib/executive/useExecutiveOS.ts",
    behavior: "runRecommendation opens war room / compare directly.",
    conflict: "Bypasses workspace launcher and recommendation surface.",
    migration: "Emit advisory cards; executive launches via requestWorkspaceLaunch.",
    status: "documented_bypass",
  },
  riskIntelligenceRecommendation: {
    path: "frontend/app/lib/dashboard/riskIntelligence/",
    behavior: "executiveAttention.recommendation text in intelligence surfaces.",
    conflict: "Observational text — not actionable quick actions.",
    migration: "Feed signals into WorkspaceRecommendationContext.systemSignals.",
    status: "partial_integration",
  },
  warRoomDecisionFocus: {
    path: "frontend/app/lib/dashboard/warRoomIntelligence/",
    behavior: "decisionFocus.recommendation in war room intelligence.",
    conflict: "Intelligence layer text — not workspace routing.",
    status: "decoupled",
  },
  executiveAdvisoryPriority: {
    path: "frontend/app/lib/dashboard/executiveAdvisory/aggregation/advisoryPriorityScoring.ts",
    behavior: "Advisory priority scoring for intelligence accordion.",
    conflict: "Different priority semantics (advisory vs workspace quick actions).",
    status: "decoupled",
  },
  assistantActionCards: {
    path: "frontend/app/lib/assistant-bridge/assistantActionCardContract.ts",
    behavior: "Assistant action cards launch workspaces on user click.",
    conflict: "None — assistant reads recommendations read-only; does not inject.",
    status: "read_only_compatible",
  },
  legacyComparePanelModel: {
    path: "frontend/app/lib/decision/recommendation/buildComparePanelModel.ts",
    behavior: "Legacy recommendation comparison model.",
    conflict: "Parallel recommendation UI in legacy panels.",
    status: "documented_parallel",
  },
});
