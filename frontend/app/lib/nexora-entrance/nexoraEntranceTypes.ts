/**
 * NEX-EXP:1 — Nexora Entrance & Manager Identity Experience contracts.
 * Semantic state only. Does not own Stage, Advisor, Chat, Goal, or memory platforms.
 */

export const nexoraEntranceExperienceIdentity =
  "NEX-EXP:1/NexoraEntranceManagerIdentityExperience" as const;
export const nexoraEntranceExperienceVersion = "1.0.0" as const;
export const nexoraEntranceExperienceNamespace =
  "nexora.experience.entrance.manager-identity" as const;

export const NEXORA_ENTRANCE_OBJECT_ID = "obj-nexora-entrance" as const;
export const NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID =
  "obj-executive-context" as const;

export const NEXORA_ENTRANCE_SESSION_STORAGE_KEY =
  "nexora.entrance.identity.session.v1" as const;

export const NEXORA_IDENTITY_PRECEDENCE =
  "EXPLICIT CURRENT MANAGER STATEMENT > CONFIRMED EXISTING IDENTITY > AUTHORITATIVE WORKSPACE CONTEXT > INFERRED CONTEXT > UNKNOWN" as const;

export const NEXORA_ENTRANCE_BOUNDARY = Object.freeze({
  identity: nexoraEntranceExperienceIdentity,
  createsMo7: false as const,
  newStageRuntime: false as const,
  parallelObjectCatalog: false as const,
  parallelConversationEngine: false as const,
  parallelAdvisor: false as const,
  parallelIdentityMemoryPlatform: false as const,
  parallelGoalSystem: false as const,
  newDomainVertical: false as const,
  newDecisionRuntime: false as const,
  newExecutionRuntime: false as const,
  usesLlm: false as const,
  writesStageCoordinates: false as const,
  inventsIdentityFacts: false as const,
  collectsUnnecessaryPersonalData: false as const,
  replacesExistingWorkspace: false as const,
});

export const NEXORA_ENTRANCE_STATES = Object.freeze([
  "NEW",
  "INTRODUCING",
  "LEARNING_MANAGER",
  "LEARNING_ORGANIZATION",
  "LEARNING_ROLE",
  "LEARNING_DOMAIN",
  "IDENTITY_SUFFICIENT",
  "MANAGER_OBJECT_READY",
  "MANAGER_OBJECT_ACTIVE",
  "READY_FOR_GOAL_DISCOVERY",
] as const);

export type NexoraEntranceState = (typeof NEXORA_ENTRANCE_STATES)[number];

export type NexoraWorkspaceResolution =
  | "first-time"
  | "returning-sufficient"
  | "existing-workspace";

export type IdentityEpistemic = "KNOWN" | "INFERRED" | "UNKNOWN";

export type IdentitySufficiency = "INSUFFICIENT" | "PARTIAL" | "SUFFICIENT";

export type ExecutiveContextKind =
  | "PERSON"
  | "COMPANY"
  | "TEAM"
  | "PROJECT"
  | "BUSINESS"
  | "OTHER";

export type IdentityFactSource =
  | "explicit-manager"
  | "confirmed-identity"
  | "workspace"
  | "inferred";

export type IdentityFieldName =
  | "managerName"
  | "organizationName"
  | "role"
  | "responsibilities"
  | "domain"
  | "skills"
  | "workContext"
  | "contextKind";

export type IdentityFact = {
  readonly field: IdentityFieldName;
  readonly value: string;
  readonly epistemic: IdentityEpistemic;
  readonly source: IdentityFactSource;
};

export type ManagerPersonalIdentity = {
  readonly managerName: string | null;
  readonly role: string | null;
  readonly skills: readonly string[];
};

export type ExecutiveIdentityContext = {
  readonly kind: ExecutiveContextKind | null;
  readonly organizationName: string | null;
  readonly displayName: string;
};

export type CurrentWorkContext = {
  readonly workContext: string | null;
  readonly responsibilities: readonly string[];
  readonly domain: string | null;
  readonly domainEpistemic: IdentityEpistemic;
};

export type ManagerIdentityContext = {
  readonly managerName: string | null;
  readonly organizationName: string | null;
  readonly role: string | null;
  readonly responsibilities: readonly string[];
  readonly domain: string | null;
  readonly domainEpistemic: IdentityEpistemic;
  readonly skills: readonly string[];
  readonly workContext: string | null;
  readonly contextKind: ExecutiveContextKind | null;
  readonly personal: ManagerPersonalIdentity;
  readonly executive: ExecutiveIdentityContext;
  readonly currentWork: CurrentWorkContext;
  readonly sourceFacts: readonly IdentityFact[];
  readonly unknowns: readonly IdentityFieldName[];
  readonly confidence: number;
  readonly sufficiency: IdentitySufficiency;
};

export type ExecutiveIdentityObject = {
  readonly id: typeof NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID;
  readonly kind: ExecutiveContextKind;
  readonly displayName: string;
  readonly managerName: string | null;
  readonly organizationName: string | null;
  readonly role: string | null;
  readonly domain: string | null;
  readonly skills: readonly string[];
  readonly contextSummary: string;
  readonly epistemicStatus: IdentityEpistemic;
};

export type NexoraGoalDiscoveryHandoff = {
  readonly identityContext: ManagerIdentityContext;
  readonly executiveContextObject: ExecutiveIdentityObject | null;
  readonly domain: string | null;
  readonly knownResponsibilities: readonly string[];
  readonly knownSkills: readonly string[];
  readonly conversationContext: string;
  readonly knownGoalSignals: readonly string[];
  readonly unknowns: readonly IdentityFieldName[];
};

export type NexoraEntranceSession = {
  readonly workspaceResolution: NexoraWorkspaceResolution;
  readonly state: NexoraEntranceState;
  readonly identity: ManagerIdentityContext;
  readonly askedQuestionKeys: readonly string[];
  readonly lastQuestionKey: string | null;
  readonly knownGoalSignals: readonly string[];
  readonly conversationNotes: readonly string[];
  readonly centerSubjectId: string | null;
  readonly identityObject: ExecutiveIdentityObject | null;
  readonly handoff: NexoraGoalDiscoveryHandoff | null;
  readonly introduced: boolean;
  readonly goalDiscovery: import("./nexoraGoalDiscoveryTypes.ts").NexoraGoalDiscoverySession | null;
  readonly realityDiscovery: import("./nexoraRealityDiscoveryTypes.ts").NexoraRealityDiscoverySession | null;
  readonly issueDiscovery: import("./nexoraIssueDiscoveryTypes.ts").NexoraIssueDiscoverySession | null;
  readonly scenarioDiscovery: import("./nexoraScenarioDiscoveryTypes.ts").NexoraScenarioDiscoverySession | null;
  readonly scenarioComparison: import("./nexoraScenarioComparisonTypes.ts").NexoraScenarioComparisonSession | null;
  readonly decisionExperience: import("./nexoraDecisionExperienceTypes.ts").NexoraDecisionExperienceSession | null;
  readonly executionPlanning: import("./nexoraExecutionPlanningTypes.ts").NexoraExecutionPlanningSession | null;
  readonly outcomeMonitoring: import("./nexoraOutcomeMonitoringTypes.ts").NexoraOutcomeMonitoringSession | null;
  readonly learningReassessment: import("./nexoraLearningReassessmentTypes.ts").NexoraLearningReassessmentSession | null;
};

export function getNexoraEntranceExperienceIdentity(): {
  readonly id: typeof nexoraEntranceExperienceIdentity;
  readonly version: typeof nexoraEntranceExperienceVersion;
  readonly namespace: typeof nexoraEntranceExperienceNamespace;
} {
  return Object.freeze({
    id: nexoraEntranceExperienceIdentity,
    version: nexoraEntranceExperienceVersion,
    namespace: nexoraEntranceExperienceNamespace,
  });
}

export function verifyNexoraEntranceExperience(): { readonly ok: true } {
  if (
    getNexoraEntranceExperienceIdentity().id !==
    "NEX-EXP:1/NexoraEntranceManagerIdentityExperience"
  ) {
    throw new Error("NEX-EXP:1 identity mismatch");
  }
  if (NEXORA_ENTRANCE_BOUNDARY.createsMo7) {
    throw new Error("NEX-EXP:1 must not create MO:7");
  }
  if (NEXORA_ENTRANCE_BOUNDARY.usesLlm) {
    throw new Error("NEX-EXP:1 must remain deterministic");
  }
  if (NEXORA_ENTRANCE_BOUNDARY.writesStageCoordinates) {
    throw new Error("NEX-EXP:1 must not write Stage coordinates");
  }
  return Object.freeze({ ok: true as const });
}
