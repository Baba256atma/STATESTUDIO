/**
 * NCA:6 — Manager model, communication adaptation, and trust intelligence.
 * Presentation only. Does not own executive truth, recommendation, Decision, or Execution.
 */

export const nexoraNca6Identity =
  "NCA:6/ManagerModelCommunicationAdaptationTrustIntelligence" as const;
export const nexoraNca6Version = "1.0.0" as const;
export const nexoraNca6Namespace =
  "nexora.nca.manager-model-communication-adaptation-trust" as const;

export const NEXORA_NCA6_BOUNDARY = Object.freeze({
  identity: nexoraNca6Identity,
  createsPersonalityProfiler: false as const,
  createsSecondDomainModel: false as const,
  createsSecondAdvisor: false as const,
  createsSecondRecommendationEngine: false as const,
  usesLiveLlm: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  mutatesAuthoritativeRdi: false as const,
  implementsDirector: false as const,
  implementsInformationCards: false as const,
  inventsBusinessTruth: false as const,
  adaptsTruthToPersonality: false as const,
});

export const COMMUNICATION_DEPTHS = Object.freeze([
  "BRIEF",
  "STANDARD",
  "DETAILED",
] as const);
export type CommunicationDepth = (typeof COMMUNICATION_DEPTHS)[number];

export const COMMUNICATION_FRAMINGS = Object.freeze([
  "NEUTRAL",
  "EXECUTIVE",
  "OPERATIONS",
  "FINANCE",
  "PROJECT",
] as const);
export type CommunicationFraming = (typeof COMMUNICATION_FRAMINGS)[number];

export const MANAGER_ROLES = Object.freeze([
  "EXECUTIVE",
  "OPERATIONS",
  "PROJECT",
  "FINANCE",
  "ENGINEERING",
  "PMO",
  "GENERAL",
  "UNKNOWN",
] as const);
export type ManagerRole = (typeof MANAGER_ROLES)[number];

export const NEXORA_FAMILIARITY_LEVELS = Object.freeze([
  "NEW",
  "LEARNING",
  "FAMILIAR",
  "UNKNOWN",
] as const);
export type NexoraFamiliarity = (typeof NEXORA_FAMILIARITY_LEVELS)[number];

export const MANAGER_MODEL_SOURCES = Object.freeze([
  "EXPLICIT",
  "CONTEXTUAL",
  "OBSERVED",
  "UNKNOWN",
] as const);
export type ManagerModelSource = (typeof MANAGER_MODEL_SOURCES)[number];

export const COMMUNICATION_STRUCTURES = Object.freeze([
  "DIRECT",
  "ADVISORY",
  "TEACHING",
  "INVESTIGATION",
  "CRITICAL",
  "SUMMARY",
] as const);
export type CommunicationStructure = (typeof COMMUNICATION_STRUCTURES)[number];

export const VOCABULARY_TECHNICALITY = Object.freeze([
  "LOW",
  "STANDARD",
  "HIGH",
] as const);
export type VocabularyTechnicality = (typeof VOCABULARY_TECHNICALITY)[number];

export const ADAPTATION_CONFIDENCE = Object.freeze([
  "LOW",
  "MODERATE",
  "HIGH",
] as const);
export type AdaptationConfidence = (typeof ADAPTATION_CONFIDENCE)[number];

export type SourcedManagerField<T> = {
  readonly value: T;
  readonly source: ManagerModelSource;
  readonly confidence: AdaptationConfidence;
  readonly persist: boolean;
};

export const ADVISOR_TRUST_CONTRACT = Object.freeze({
  preserveFacts: true as const,
  preserveEvidenceState: true as const,
  preserveUncertainty: true as const,
  preserveRecommendationMeaning: true as const,
  preserveDecisionAuthority: true as const,
  preserveExecutionAuthority: true as const,
  avoidFabricatedCertainty: true as const,
  avoidFabricatedCapability: true as const,
  avoidManipulativeFraming: true as const,
});

export type AdvisorTrustContract = typeof ADVISOR_TRUST_CONTRACT;

export type Nca6ManagerContextInput = {
  readonly role?: string | null;
  readonly domain?: string | null;
  readonly displayName?: string | null;
  readonly familiarity?: NexoraFamiliarity | null;
  readonly persistentPreferredDepth?: CommunicationDepth | null;
};

export type NexoraManagerModel = {
  readonly identity: {
    readonly known: boolean;
    readonly displayName: string | null;
  };
  readonly professionalContext: {
    readonly role: SourcedManagerField<ManagerRole>;
    readonly domain: SourcedManagerField<string | null>;
    readonly responsibilityScope: string | null;
  };
  readonly interactionProfile: {
    readonly preferredDepth: SourcedManagerField<CommunicationDepth | null>;
    readonly preferredFraming: SourcedManagerField<CommunicationFraming>;
    readonly nexoraFamiliarity: SourcedManagerField<NexoraFamiliarity>;
  };
  readonly currentInteraction: {
    readonly requestedDepth: CommunicationDepth | null;
    readonly confusionDetected: boolean;
    readonly challengeRequested: boolean;
    readonly explanationRequested: boolean;
    readonly teachingRequested: boolean;
    readonly disagreementDetected: boolean;
    readonly correctionOffered: boolean;
    readonly technicalityRequested: boolean;
  };
  readonly decisionContext: {
    readonly activeGoal: string | null;
    readonly explicitPriorities: readonly string[];
    readonly explicitConstraints: readonly string[];
    readonly explicitPreferences: readonly string[];
  };
};

export type ManagerCommunicationStrategy = {
  readonly depth: CommunicationDepth;
  readonly framing: CommunicationFraming;
  readonly vocabulary: {
    readonly technicality: VocabularyTechnicality;
    readonly explainInternalTerms: boolean;
  };
  readonly structure: CommunicationStructure;
  readonly trustRequirements: {
    readonly exposeUncertainty: boolean;
    readonly exposeAssumption: boolean;
    readonly exposeTradeoff: boolean;
    readonly explainRevision: boolean;
    readonly preserveDisagreement: boolean;
  };
  readonly source: {
    readonly explicitRequest: boolean;
    readonly role: boolean;
    readonly domain: boolean;
    readonly dialogueContext: boolean;
  };
};

export type CommunicationPresentationIntent = {
  readonly depth: CommunicationDepth;
  readonly framing: CommunicationFraming;
  readonly importance: "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
  readonly structure: CommunicationStructure;
  readonly subject: string | null;
};

export type NcaCommunicationSnapshot = {
  readonly depth: CommunicationDepth;
  readonly framing: CommunicationFraming;
  readonly structure: CommunicationStructure;
  readonly familiarity: NexoraFamiliarity;
  readonly role: ManagerRole;
  readonly requestedDepth: CommunicationDepth | null;
  readonly sessionPreferredDepth: CommunicationDepth | null;
  readonly confusionDetected: boolean;
};

export type ExecutiveCommunicationStrategy = {
  readonly identity: typeof nexoraNca6Identity;
  readonly model: NexoraManagerModel;
  readonly strategy: ManagerCommunicationStrategy;
  readonly snapshot: NcaCommunicationSnapshot;
  readonly presentationIntent: CommunicationPresentationIntent;
  readonly trust: AdvisorTrustContract;
  readonly response: string | null;
  readonly reason: string;
  readonly commitsDecision: false;
  readonly startsExecution: false;
  readonly mutatesAuthoritativeRdi: false;
};
