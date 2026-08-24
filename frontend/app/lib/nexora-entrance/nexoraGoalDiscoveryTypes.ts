/**
 * NEX-EXP:2 — Goal Discovery & Goal Object Emergence contracts.
 * Semantic discovery only. Does not own Stage, Advisor, MO:4, or a parallel goal platform.
 */

export const nexoraGoalDiscoveryExperienceIdentity =
  "NEX-EXP:2/GoalDiscoveryGoalObjectEmergence" as const;
export const nexoraGoalDiscoveryExperienceVersion = "1.0.0" as const;
export const nexoraGoalDiscoveryExperienceNamespace =
  "nexora.experience.goal-discovery.object-emergence" as const;

export const NEXORA_EXECUTIVE_GOAL_OBJECT_ID = "goal-executive-discovered" as const;

export const NEXORA_GOAL_RESOLUTION_PRECEDENCE =
  "EXPLICIT CURRENT MANAGER GOAL > CONFIRMED EXISTING GOAL > AUTHORITATIVE WORKSPACE OBJECTIVE > INFERRED GOAL > UNKNOWN" as const;

export const NEXORA_GOAL_DISCOVERY_BOUNDARY = Object.freeze({
  identity: nexoraGoalDiscoveryExperienceIdentity,
  createsMo7: false as const,
  startsNexExp3: false as const,
  parallelGoalSystem: false as const,
  parallelStrategySystem: false as const,
  parallelOkrEngine: false as const,
  newStageRuntime: false as const,
  parallelObjectGraph: false as const,
  parallelAdvisor: false as const,
  parallelConversationRuntime: false as const,
  parallelGoalMemoryPlatform: false as const,
  usesLlm: false as const,
  writesStageCoordinates: false as const,
  inventsGoals: false as const,
  inventsPriorities: false as const,
  inventsTargets: false as const,
  inventsDeadlines: false as const,
  inventsKpis: false as const,
  inventsRelationships: false as const,
  promotesInferredToConfirmed: false as const,
  replacesExistingWorkspace: false as const,
});

export const GOAL_DISCOVERY_STATES = Object.freeze([
  "NOT_STARTED",
  "LISTENING",
  "GOAL_SIGNAL_FOUND",
  "CLARIFYING",
  "GOAL_UNDERSTOOD",
  "GOAL_CONFIRMED",
  "GOAL_OBJECT_READY",
  "GOAL_OBJECT_ACTIVE",
  "READY_FOR_EXECUTIVE_CONTEXT",
] as const);

export type GoalDiscoveryState = (typeof GOAL_DISCOVERY_STATES)[number];

export type GoalSignalClarity =
  | "CLEAR"
  | "AMBIGUOUS"
  | "TOO_BROAD"
  | "CONFLICTING"
  | "INFERRED"
  | "UNKNOWN";

export type GoalSufficiency = "INSUFFICIENT" | "PARTIAL" | "SUFFICIENT";

export type GoalEpistemicSource =
  | "EXPLICIT"
  | "RESOLVED"
  | "INFERRED"
  | "UNKNOWN";

export type GoalPersistenceState =
  | "SESSION_ONLY"
  | "REGISTERED_RUNTIME"
  | "DURABLE";

export type GoalPriorityRole =
  | "ACTIVE"
  | "SECONDARY"
  | "UNKNOWN_PRIORITY"
  | "CONFLICTING";

export type GoalMutationKind = "REFINEMENT" | "CHANGE" | "CORRECTION" | "NONE";

export type ExecutiveGoalDiscoveryContext = {
  readonly goalSignal: string | null;
  readonly goalTitle: string | null;
  readonly goalDescription: string | null;
  readonly source: GoalEpistemicSource;
  readonly scope: string | null;
  readonly targetState: string | null;
  readonly currentState: string | null;
  readonly successSignals: readonly string[];
  readonly timeHorizon: string | null;
  readonly priority: GoalPriorityRole;
  readonly relatedExecutiveContext: string | null;
  readonly constraints: readonly string[];
  readonly unknowns: readonly string[];
  readonly epistemicStatus: "KNOWN" | "INFERRED" | "UNKNOWN";
  readonly managerConfirmed: boolean;
  readonly sufficiency: GoalSufficiency;
  readonly clarity: GoalSignalClarity;
  readonly needsConfirmation: boolean;
};

export type ExecutiveGoalObject = {
  readonly id: string;
  readonly kind: "GOAL";
  readonly displayName: string;
  readonly description: string | null;
  readonly scope: string | null;
  readonly targetState: string | null;
  readonly successSignals: readonly string[];
  readonly source: GoalEpistemicSource;
  readonly epistemicStatus: "KNOWN" | "INFERRED" | "UNKNOWN";
  readonly managerConfirmed: boolean;
  readonly persistenceState: GoalPersistenceState;
};

export type GoalCandidate = {
  readonly title: string;
  readonly signal: string;
  readonly clarity: GoalSignalClarity;
  readonly source: GoalEpistemicSource;
  readonly role: GoalPriorityRole;
};

export type NexoraExecutiveContextDiscoveryHandoff = {
  readonly identityContext: unknown;
  readonly executiveContextObject: unknown;
  readonly activeGoal: ExecutiveGoalDiscoveryContext | null;
  readonly goalObject: ExecutiveGoalObject | null;
  readonly goalSuccessSignals: readonly string[];
  readonly goalTargetState: string | null;
  readonly goalTimeHorizon: string | null;
  readonly knownRealitySignals: readonly string[];
  readonly knownIssueSignals: readonly string[];
  readonly managerCausalHypotheses: readonly string[];
  readonly unknowns: readonly string[];
  readonly conversationContext: string;
};

export type NexoraGoalDiscoverySession = {
  readonly state: GoalDiscoveryState;
  readonly context: ExecutiveGoalDiscoveryContext;
  readonly object: ExecutiveGoalObject | null;
  readonly candidates: readonly GoalCandidate[];
  readonly askedQuestionKeys: readonly string[];
  readonly knownRealitySignals: readonly string[];
  readonly knownIssueSignals: readonly string[];
  readonly managerCausalHypotheses: readonly string[];
  readonly previousTitle: string | null;
  readonly lastMutation: GoalMutationKind;
  readonly handoff: NexoraExecutiveContextDiscoveryHandoff | null;
  readonly introduced: boolean;
};

export function getNexoraGoalDiscoveryExperienceIdentity(): {
  readonly id: typeof nexoraGoalDiscoveryExperienceIdentity;
  readonly version: typeof nexoraGoalDiscoveryExperienceVersion;
  readonly namespace: typeof nexoraGoalDiscoveryExperienceNamespace;
} {
  return Object.freeze({
    id: nexoraGoalDiscoveryExperienceIdentity,
    version: nexoraGoalDiscoveryExperienceVersion,
    namespace: nexoraGoalDiscoveryExperienceNamespace,
  });
}

export function verifyNexoraGoalDiscoveryExperience(): { readonly ok: true } {
  if (
    getNexoraGoalDiscoveryExperienceIdentity().id !==
    "NEX-EXP:2/GoalDiscoveryGoalObjectEmergence"
  ) {
    throw new Error("NEX-EXP:2 identity mismatch");
  }
  if (NEXORA_GOAL_DISCOVERY_BOUNDARY.createsMo7) {
    throw new Error("NEX-EXP:2 must not create MO:7");
  }
  if (NEXORA_GOAL_DISCOVERY_BOUNDARY.startsNexExp3) {
    throw new Error("NEX-EXP:2 must not start NEX-EXP:3");
  }
  if (NEXORA_GOAL_DISCOVERY_BOUNDARY.usesLlm) {
    throw new Error("NEX-EXP:2 must remain deterministic");
  }
  if (NEXORA_GOAL_DISCOVERY_BOUNDARY.writesStageCoordinates) {
    throw new Error("NEX-EXP:2 must not write Stage coordinates");
  }
  return Object.freeze({ ok: true as const });
}
