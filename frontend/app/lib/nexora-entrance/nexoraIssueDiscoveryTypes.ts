/**
 * NEX-EXP:4 — Problem, Risk & Opportunity Discovery contracts.
 * Classification/projection over EI:3 and Stage/MO. Does not infer causes or recommend.
 */

export const nexoraIssueDiscoveryExperienceIdentity =
  "NEX-EXP:4/ProblemRiskOpportunityDiscovery" as const;
export const nexoraIssueDiscoveryExperienceVersion = "1.0.0" as const;
export const nexoraIssueDiscoveryExperienceNamespace =
  "nexora.experience.issue.problem-risk-opportunity-discovery" as const;

export const NEXORA_ISSUE_DISCOVERY_BOUNDARY = Object.freeze({
  identity: nexoraIssueDiscoveryExperienceIdentity,
  startsNexExp5: false as const,
  createsMo7: false as const,
  parallelProblemIntelligence: false as const,
  parallelRiskEngine: false as const,
  parallelOpportunityEngine: false as const,
  parallelConstraintPlatform: false as const,
  parallelCausalEngine: false as const,
  parallelRelationshipGraph: false as const,
  parallelObjectCatalog: false as const,
  parallelAdvisor: false as const,
  newStageRuntime: false as const,
  parallelRecommendationEngine: false as const,
  parallelScenarioEngine: false as const,
  usesLlm: false as const,
  writesStageCoordinates: false as const,
  stealsGoalCenter: false as const,
  inventsRootCause: false as const,
  inventsRecommendations: false as const,
  inventsProbability: false as const,
  inventsOpportunityValue: false as const,
  replacesExistingWorkspace: false as const,
  ei3Authority: "EI:3/ProblemRiskOpportunityIntelligence" as const,
});

export const ISSUE_DISCOVERY_STATES = Object.freeze([
  "NOT_STARTED",
  "ASSESSING_SIGNALS",
  "CANDIDATES_FOUND",
  "INVESTIGATING",
  "ISSUES_PARTIAL",
  "ISSUES_SUFFICIENT",
  "ISSUE_OBJECTS_READY",
  "ISSUE_CONTEXT_ACTIVE",
  "READY_FOR_SCENARIO_DISCOVERY",
] as const);

export type IssueDiscoveryState = (typeof ISSUE_DISCOVERY_STATES)[number];

export type IssueKind =
  | "PROBLEM"
  | "RISK"
  | "OPPORTUNITY"
  | "CONSTRAINT"
  | "UNKNOWN";

export type IssueEvidenceSufficiency = "WEAK" | "PARTIAL" | "SUFFICIENT";

export type CausalStatus =
  | "NONE"
  | "HYPOTHESIZED"
  | "SUPPORTED"
  | "CONFIRMED"
  | "UNKNOWN";

export type IssueMateriality = "TRIVIAL" | "MATERIAL" | "UNKNOWN";

export type IssueTimeClass = "CURRENT" | "FUTURE" | "UNKNOWN";

export type OpportunityWindow = "ACTIVE" | "EXPIRING" | "EXPIRED" | "UNKNOWN";

export type ExecutiveIssueCandidate = {
  readonly candidateId: string;
  readonly kind: IssueKind;
  readonly subject: string;
  readonly description: string | null;
  readonly relatedGoalId: string | null;
  readonly relatedRealityIds: readonly string[];
  readonly evidence: readonly string[];
  readonly source: "MANAGER_STATED" | "REALITY_SIGNAL" | "CANONICAL" | "INFERRED";
  readonly epistemicStatus: "KNOWN" | "INFERRED" | "UNKNOWN";
  readonly confidence: null;
  readonly materiality: IssueMateriality;
  readonly currentOrFuture: IssueTimeClass;
  readonly managerStated: boolean;
  readonly validated: boolean;
  readonly causalStatus: CausalStatus;
  readonly sufficiency: IssueEvidenceSufficiency;
  readonly objectId: string | null;
  readonly probability: null;
  readonly valuePotential: null;
  readonly opportunityWindow: OpportunityWindow;
  readonly staleEvidence: boolean;
};

export type ExecutiveIssueObject = {
  readonly id: string;
  readonly kind: Exclude<IssueKind, "UNKNOWN">;
  readonly displayName: string;
  readonly description: string | null;
  readonly relatedGoalId: string | null;
  readonly relatedRealityIds: readonly string[];
  readonly evidence: readonly string[];
  readonly epistemicStatus: "KNOWN" | "INFERRED" | "UNKNOWN";
  readonly causalStatus: CausalStatus;
  readonly source: ExecutiveIssueCandidate["source"];
  readonly reusedExisting: boolean;
};

export type NexoraScenarioDiscoveryHandoff = {
  readonly identityContext: unknown;
  readonly executiveContextObject: unknown;
  readonly activeGoal: unknown;
  readonly goalObject: unknown;
  readonly realityContext: unknown;
  readonly goalRealityGap: unknown;
  readonly problems: readonly ExecutiveIssueObject[];
  readonly risks: readonly ExecutiveIssueObject[];
  readonly opportunities: readonly ExecutiveIssueObject[];
  readonly constraints: readonly ExecutiveIssueObject[];
  readonly causalHypotheses: readonly string[];
  readonly evidence: readonly string[];
  readonly provenance: readonly string[];
  readonly unknowns: readonly string[];
  readonly primaryInvestigationSubject: string | null;
  readonly conversationContext: string;
};

export type NexoraIssueDiscoverySession = {
  readonly state: IssueDiscoveryState;
  readonly candidates: readonly ExecutiveIssueCandidate[];
  readonly objects: readonly ExecutiveIssueObject[];
  readonly causalHypotheses: readonly string[];
  readonly askedQuestionKeys: readonly string[];
  readonly introduced: boolean;
  readonly noSupportedIssue: boolean;
  readonly handoff: NexoraScenarioDiscoveryHandoff | null;
};

export function getNexoraIssueDiscoveryExperienceIdentity() {
  return Object.freeze({
    id: nexoraIssueDiscoveryExperienceIdentity,
    version: nexoraIssueDiscoveryExperienceVersion,
    namespace: nexoraIssueDiscoveryExperienceNamespace,
  });
}

export function verifyNexoraIssueDiscoveryExperience(): { readonly ok: true } {
  if (
    getNexoraIssueDiscoveryExperienceIdentity().id !==
    "NEX-EXP:4/ProblemRiskOpportunityDiscovery"
  ) {
    throw new Error("NEX-EXP:4 identity mismatch");
  }
  if (NEXORA_ISSUE_DISCOVERY_BOUNDARY.startsNexExp5) {
    throw new Error("NEX-EXP:4 must not start NEX-EXP:5");
  }
  if (NEXORA_ISSUE_DISCOVERY_BOUNDARY.inventsRootCause) {
    throw new Error("NEX-EXP:4 must not invent root cause");
  }
  if (NEXORA_ISSUE_DISCOVERY_BOUNDARY.parallelCausalEngine) {
    throw new Error("NEX-EXP:4 must not create a parallel causal engine");
  }
  return Object.freeze({ ok: true as const });
}
