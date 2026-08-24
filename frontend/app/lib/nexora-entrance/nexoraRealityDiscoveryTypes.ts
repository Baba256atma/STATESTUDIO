/**
 * NEX-EXP:3 — Current Reality & Executive Context Discovery contracts.
 * Consumes existing Data Reality / Stage / MO authorities. Does not own
 * issue intelligence, recommendations, or a parallel reality engine.
 */

export const nexoraRealityDiscoveryExperienceIdentity =
  "NEX-EXP:3/CurrentRealityExecutiveContextDiscovery" as const;
export const nexoraRealityDiscoveryExperienceVersion = "1.0.0" as const;
export const nexoraRealityDiscoveryExperienceNamespace =
  "nexora.experience.reality.executive-context-discovery" as const;

export const NEXORA_REALITY_SOURCE_PRECEDENCE =
  "VALID CURRENT DATA REALITY > AUTHORITATIVE RUNTIME STATE > VALID CONNECTED / IMPORTED DATA > CONFIRMED MANAGER-PROVIDED FACT > EXISTING WORKSPACE CONTEXT > INFERRED CONTEXT > PRESENTATION FIXTURE > UNKNOWN" as const;

export const NEXORA_REALITY_DISCOVERY_BOUNDARY = Object.freeze({
  identity: nexoraRealityDiscoveryExperienceIdentity,
  startsNexExp4: false as const,
  createsMo7: false as const,
  parallelDataReality: false as const,
  parallelKpiRuntime: false as const,
  parallelRdi: false as const,
  parallelObjectGraph: false as const,
  parallelRelationshipGraph: false as const,
  parallelAdvisor: false as const,
  newStageRuntime: false as const,
  parallelAttentionEngine: false as const,
  parallelIssueEngine: false as const,
  parallelRecommendationEngine: false as const,
  usesLlm: false as const,
  writesStageCoordinates: false as const,
  stealsGoalCenter: false as const,
  inventsCauses: false as const,
  inventsRecommendations: false as const,
  inventsGaps: false as const,
  replacesExistingWorkspace: false as const,
});

export const EXECUTIVE_CONTEXT_DISCOVERY_STATES = Object.freeze([
  "NOT_STARTED",
  "ASSESSING_EXISTING_CONTEXT",
  "REALITY_NEEDED",
  "COLLECTING_REALITY",
  "REALITY_PARTIAL",
  "REALITY_SUFFICIENT",
  "GAP_RESOLVED",
  "REALITY_OBJECTS_READY",
  "REALITY_ACTIVE",
  "READY_FOR_ISSUE_DISCOVERY",
] as const);

export type ExecutiveContextDiscoveryState =
  (typeof EXECUTIVE_CONTEXT_DISCOVERY_STATES)[number];

export type RealitySufficiency = "INSUFFICIENT" | "PARTIAL" | "SUFFICIENT";

export type RealityObservationSource =
  | "VALIDATED_DATA"
  | "RUNTIME_OBSERVED"
  | "CONNECTED_DATA"
  | "MANAGER_REPORTED"
  | "WORKSPACE"
  | "INFERRED"
  | "PRESENTATION_FIXTURE"
  | "UNKNOWN";

export type RealityFreshness = "CURRENT" | "HISTORICAL" | "BASELINE" | "STALE" | "UNKNOWN";

export type RealityTimeClass = "CURRENT" | "HISTORICAL" | "BASELINE";

export type GapStatus = "KNOWN" | "PARTIAL" | "UNKNOWN" | "NOT_MEASURABLE";

export type ExecutiveRealityObservation = {
  readonly id: string;
  readonly subject: string;
  readonly objectId: string;
  readonly value: string | null;
  readonly numericValue: number | null;
  readonly unit: string | null;
  readonly state: string | null;
  readonly timestamp: string | null;
  readonly source: RealityObservationSource;
  readonly sourceAuthority: string;
  readonly provenance: string | null;
  readonly freshness: RealityFreshness;
  readonly timeClass: RealityTimeClass;
  readonly epistemicStatus: "KNOWN" | "INFERRED" | "UNKNOWN";
  readonly goalRelevance: "relevant" | "unrelated" | "unknown";
};

export type ExecutiveGoalRealityGap = {
  readonly goalId: string | null;
  readonly measure: string | null;
  readonly currentValue: string | null;
  readonly targetValue: string | null;
  readonly delta: string | null;
  readonly numericDelta: number | null;
  readonly unit: string | null;
  readonly direction: string | null;
  readonly status: GapStatus;
  readonly evidence: readonly string[];
  readonly epistemicStatus: "KNOWN" | "INFERRED" | "UNKNOWN";
};

export type ExecutiveRealityDiscoveryContext = {
  readonly goalId: string | null;
  readonly goalTitle: string | null;
  readonly observations: readonly ExecutiveRealityObservation[];
  readonly measurements: readonly string[];
  readonly kpis: readonly string[];
  readonly states: readonly string[];
  readonly constraints: readonly string[];
  readonly knownIssues: readonly string[];
  readonly knownRisks: readonly string[];
  readonly knownOpportunities: readonly string[];
  readonly currentStateSummary: string | null;
  readonly targetState: string | null;
  readonly gap: ExecutiveGoalRealityGap | null;
  readonly evidence: readonly string[];
  readonly provenance: readonly string[];
  readonly unknowns: readonly string[];
  readonly freshness: RealityFreshness;
  readonly confidence: "KNOWN" | "INFERRED" | "UNKNOWN";
  readonly epistemicStatus: "KNOWN" | "INFERRED" | "UNKNOWN";
  readonly sufficiency: RealitySufficiency;
  readonly conflicts: readonly string[];
};

export type RealityEmergedObject = {
  readonly id: string;
  readonly displayName: string;
  readonly kind: "object";
  readonly observationId: string;
  readonly reusedExisting: boolean;
};

export type NexoraIssueDiscoveryHandoff = {
  readonly identityContext: unknown;
  readonly executiveContextObject: unknown;
  readonly activeGoal: unknown;
  readonly goalObject: unknown;
  readonly realityContext: ExecutiveRealityDiscoveryContext;
  readonly goalRealityGap: ExecutiveGoalRealityGap | null;
  readonly realityObjects: readonly RealityEmergedObject[];
  readonly constraints: readonly string[];
  readonly knownIssueSignals: readonly string[];
  readonly knownRiskSignals: readonly string[];
  readonly knownOpportunitySignals: readonly string[];
  readonly evidence: readonly string[];
  readonly provenance: readonly string[];
  readonly unknowns: readonly string[];
  readonly conversationContext: string;
};

export type NexoraRealityDiscoverySession = {
  readonly state: ExecutiveContextDiscoveryState;
  readonly context: ExecutiveRealityDiscoveryContext;
  readonly objects: readonly RealityEmergedObject[];
  readonly askedQuestionKeys: readonly string[];
  readonly introduced: boolean;
  readonly handoff: NexoraIssueDiscoveryHandoff | null;
};

export function getNexoraRealityDiscoveryExperienceIdentity(): {
  readonly id: typeof nexoraRealityDiscoveryExperienceIdentity;
  readonly version: typeof nexoraRealityDiscoveryExperienceVersion;
  readonly namespace: typeof nexoraRealityDiscoveryExperienceNamespace;
} {
  return Object.freeze({
    id: nexoraRealityDiscoveryExperienceIdentity,
    version: nexoraRealityDiscoveryExperienceVersion,
    namespace: nexoraRealityDiscoveryExperienceNamespace,
  });
}

export function verifyNexoraRealityDiscoveryExperience(): { readonly ok: true } {
  if (
    getNexoraRealityDiscoveryExperienceIdentity().id !==
    "NEX-EXP:3/CurrentRealityExecutiveContextDiscovery"
  ) {
    throw new Error("NEX-EXP:3 identity mismatch");
  }
  if (NEXORA_REALITY_DISCOVERY_BOUNDARY.startsNexExp4) {
    throw new Error("NEX-EXP:3 must not start NEX-EXP:4");
  }
  if (NEXORA_REALITY_DISCOVERY_BOUNDARY.parallelDataReality) {
    throw new Error("NEX-EXP:3 must not create a parallel Data Reality engine");
  }
  if (NEXORA_REALITY_DISCOVERY_BOUNDARY.inventsCauses) {
    throw new Error("NEX-EXP:3 must not invent causes");
  }
  if (NEXORA_REALITY_DISCOVERY_BOUNDARY.writesStageCoordinates) {
    throw new Error("NEX-EXP:3 must not write Stage coordinates");
  }
  if (NEXORA_REALITY_DISCOVERY_BOUNDARY.stealsGoalCenter) {
    throw new Error("NEX-EXP:3 must not steal Goal center");
  }
  return Object.freeze({ ok: true as const });
}
