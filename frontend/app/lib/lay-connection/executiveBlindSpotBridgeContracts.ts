import type {
  ExecutiveBlindSpotBridge as ExecutiveBlindSpotBridgeContract,
  ExecutiveBlindSpotCategory,
  ExecutiveBlindSpotMetadata,
  ExecutiveBlindSpotPolicy,
} from "./executiveBlindSpotBridgeTypes.ts";

export const EXECUTIVE_BLIND_SPOT_BRIDGE_ID = "executive-blind-spot-bridge";
export const EXECUTIVE_BLIND_SPOT_BRIDGE_VERSION = "LAY-CONN-8";

export const EXECUTIVE_BLIND_SPOT_CATEGORIES: readonly ExecutiveBlindSpotCategory[] = Object.freeze([
  "Strategic",
  "Operational",
  "Decision",
  "Risk",
  "Opportunity",
  "Knowledge",
  "Assumption",
  "Constraint",
  "Dependency",
  "Stakeholder",
  "Timeline",
  "Awareness",
] as const);

export const EXECUTIVE_BLIND_SPOT_TYPES: readonly string[] = Object.freeze([
  "strategic-blind-spot",
  "operational-blind-spot",
  "decision-blind-spot",
  "risk-blind-spot",
  "opportunity-blind-spot",
  "knowledge-blind-spot",
  "assumption-blind-spot",
  "constraint-blind-spot",
  "dependency-blind-spot",
  "stakeholder-blind-spot",
  "timeline-blind-spot",
  "awareness-blind-spot",
] as const);

export const EXECUTIVE_BLIND_SPOT_METADATA: ExecutiveBlindSpotMetadata = Object.freeze({
  bridgeId: EXECUTIVE_BLIND_SPOT_BRIDGE_ID,
  phaseId: "LAY-CONN-8",
  metadataOnly: true,
  immutable: true,
  tags: Object.freeze(["lay-connection", "blind-spot", "metadata-contract"] as const),
});

export const EXECUTIVE_BLIND_SPOT_POLICY: ExecutiveBlindSpotPolicy = Object.freeze({
  policyId: "blind-spot-metadata-only-policy",
  derivationAllowed: false,
  assessmentAllowed: false,
  orderingAllowed: false,
  forecastingAllowed: false,
  distributionAllowed: false,
  pathSelectionAllowed: false,
  stateMutationAllowed: false,
  extensionMode: "additive-only",
});

export const ExecutiveBlindSpotBridge: ExecutiveBlindSpotBridgeContract = Object.freeze({
  bridgeId: EXECUTIVE_BLIND_SPOT_BRIDGE_ID,
  name: "Executive Blind Spot Bridge",
  context: Object.freeze({
    contextId: "blind-spot-context-contract",
    sourceContextId: "executive-awareness-context-contract",
    metadata: EXECUTIVE_BLIND_SPOT_METADATA,
  }),
  candidates: Object.freeze([
    Object.freeze({
      candidateId: "strategic-blind-spot-candidate",
      identity: Object.freeze({ blindSpotId: "strategic-blind-spot", name: "Strategic Blind Spot", category: "Strategic", blindSpotType: "strategic-blind-spot" }),
      metadata: EXECUTIVE_BLIND_SPOT_METADATA,
    }),
    Object.freeze({
      candidateId: "risk-blind-spot-candidate",
      identity: Object.freeze({ blindSpotId: "risk-blind-spot", name: "Risk Blind Spot", category: "Risk", blindSpotType: "risk-blind-spot" }),
      metadata: EXECUTIVE_BLIND_SPOT_METADATA,
    }),
    Object.freeze({
      candidateId: "assumption-blind-spot-candidate",
      identity: Object.freeze({ blindSpotId: "assumption-blind-spot", name: "Assumption Blind Spot", category: "Assumption", blindSpotType: "assumption-blind-spot" }),
      metadata: EXECUTIVE_BLIND_SPOT_METADATA,
    }),
  ] as const),
  evidence: Object.freeze([Object.freeze({ evidenceId: "blind-spot-evidence-reference", sourceEvidenceId: "judgment-evidence-reference", metadata: EXECUTIVE_BLIND_SPOT_METADATA })] as const),
  assumptions: Object.freeze([Object.freeze({ assumptionId: "blind-spot-assumption-reference", sourceAssumptionId: "reasoning-assumption-reference", metadata: EXECUTIVE_BLIND_SPOT_METADATA })] as const),
  constraints: Object.freeze([Object.freeze({ constraintId: "blind-spot-constraint-reference", sourceConstraintId: "judgment-constraint-reference", metadata: EXECUTIVE_BLIND_SPOT_METADATA })] as const),
  risks: Object.freeze([Object.freeze({ riskId: "blind-spot-risk-reference", sourceRiskId: "judgment-risk-reference", metadata: EXECUTIVE_BLIND_SPOT_METADATA })] as const),
  opportunities: Object.freeze([Object.freeze({ opportunityId: "blind-spot-opportunity-reference", sourceOpportunityId: "recommendation-opportunity-reference", metadata: EXECUTIVE_BLIND_SPOT_METADATA })] as const),
  recommendationReferences: Object.freeze(["recommendation-reference-metadata"] as const),
  explanationReferences: Object.freeze(["explanation-reference-metadata"] as const),
  awarenessReferences: Object.freeze(["awareness-reference-metadata"] as const),
  policy: EXECUTIVE_BLIND_SPOT_POLICY,
  metadata: EXECUTIVE_BLIND_SPOT_METADATA,
});
