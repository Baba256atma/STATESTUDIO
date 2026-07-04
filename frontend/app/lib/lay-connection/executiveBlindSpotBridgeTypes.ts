export type ExecutiveBlindSpotCategory =
  | "Strategic"
  | "Operational"
  | "Decision"
  | "Risk"
  | "Opportunity"
  | "Knowledge"
  | "Assumption"
  | "Constraint"
  | "Dependency"
  | "Stakeholder"
  | "Timeline"
  | "Awareness";

export type ExecutiveBlindSpotIdentity = Readonly<{
  readonly blindSpotId: string;
  readonly name: string;
  readonly category: ExecutiveBlindSpotCategory;
  readonly blindSpotType: string;
}>;

export type ExecutiveBlindSpotMetadata = Readonly<{
  readonly bridgeId: string;
  readonly phaseId: "LAY-CONN-8";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
  readonly tags: readonly string[];
}>;

export type ExecutiveBlindSpotContext = Readonly<{
  readonly contextId: string;
  readonly sourceContextId: string;
  readonly metadata: ExecutiveBlindSpotMetadata;
}>;

export type ExecutiveBlindSpotCandidate = Readonly<{
  readonly candidateId: string;
  readonly identity: ExecutiveBlindSpotIdentity;
  readonly metadata: ExecutiveBlindSpotMetadata;
}>;

export type ExecutiveBlindSpotEvidence = Readonly<{
  readonly evidenceId: string;
  readonly sourceEvidenceId: string;
  readonly metadata: ExecutiveBlindSpotMetadata;
}>;

export type ExecutiveBlindSpotAssumption = Readonly<{
  readonly assumptionId: string;
  readonly sourceAssumptionId: string;
  readonly metadata: ExecutiveBlindSpotMetadata;
}>;

export type ExecutiveBlindSpotConstraint = Readonly<{
  readonly constraintId: string;
  readonly sourceConstraintId: string;
  readonly metadata: ExecutiveBlindSpotMetadata;
}>;

export type ExecutiveBlindSpotDependency = Readonly<{
  readonly dependencyId: string;
  readonly required: boolean;
  readonly mode: "certified" | "future-compatible";
}>;

export type ExecutiveBlindSpotRisk = Readonly<{
  readonly riskId: string;
  readonly sourceRiskId: string;
  readonly metadata: ExecutiveBlindSpotMetadata;
}>;

export type ExecutiveBlindSpotOpportunity = Readonly<{
  readonly opportunityId: string;
  readonly sourceOpportunityId: string;
  readonly metadata: ExecutiveBlindSpotMetadata;
}>;

export type ExecutiveBlindSpotProvider = Readonly<{
  readonly providerId: string;
  readonly platformId: string;
  readonly certified: boolean;
  readonly futureCompatible: boolean;
}>;

export type ExecutiveBlindSpotConsumer = Readonly<{
  readonly consumerId: string;
  readonly name: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveBlindSpotCompatibility = Readonly<{
  readonly platformId: string;
  readonly compatible: boolean;
  readonly required: boolean;
  readonly mode: "certified" | "future-compatible";
  readonly notes: readonly string[];
}>;

export type ExecutiveBlindSpotPolicy = Readonly<{
  readonly policyId: string;
  readonly derivationAllowed: boolean;
  readonly assessmentAllowed: boolean;
  readonly orderingAllowed: boolean;
  readonly forecastingAllowed: boolean;
  readonly distributionAllowed: boolean;
  readonly pathSelectionAllowed: boolean;
  readonly stateMutationAllowed: boolean;
  readonly extensionMode: "additive-only";
}>;

export type ExecutiveBlindSpotBridge = Readonly<{
  readonly bridgeId: string;
  readonly name: string;
  readonly context: ExecutiveBlindSpotContext;
  readonly candidates: readonly ExecutiveBlindSpotCandidate[];
  readonly evidence: readonly ExecutiveBlindSpotEvidence[];
  readonly assumptions: readonly ExecutiveBlindSpotAssumption[];
  readonly constraints: readonly ExecutiveBlindSpotConstraint[];
  readonly risks: readonly ExecutiveBlindSpotRisk[];
  readonly opportunities: readonly ExecutiveBlindSpotOpportunity[];
  readonly recommendationReferences: readonly string[];
  readonly explanationReferences: readonly string[];
  readonly awarenessReferences: readonly string[];
  readonly policy: ExecutiveBlindSpotPolicy;
  readonly metadata: ExecutiveBlindSpotMetadata;
}>;

export type ExecutiveBlindSpotRegistry = Readonly<{
  readonly bridgeId: string;
  readonly providers: readonly ExecutiveBlindSpotProvider[];
  readonly consumers: readonly ExecutiveBlindSpotConsumer[];
  readonly categories: readonly ExecutiveBlindSpotCategory[];
  readonly blindSpotTypes: readonly string[];
  readonly dependencies: readonly ExecutiveBlindSpotDependency[];
  readonly compatibilityMatrix: readonly ExecutiveBlindSpotCompatibility[];
  readonly versionMetadata: ExecutiveBlindSpotMetadata;
  readonly extensionPolicy: ExecutiveBlindSpotPolicy;
  readonly publicApis: readonly string[];
}>;

export type ExecutiveBlindSpotManifest = Readonly<{
  readonly platformId: string;
  readonly platformVersion: string;
  readonly supportedBlindSpotCategories: readonly ExecutiveBlindSpotCategory[];
  readonly supportedBlindSpotTypes: readonly string[];
  readonly registeredProviders: readonly ExecutiveBlindSpotProvider[];
  readonly registeredConsumers: readonly ExecutiveBlindSpotConsumer[];
  readonly dependencies: readonly ExecutiveBlindSpotDependency[];
  readonly compatibility: readonly ExecutiveBlindSpotCompatibility[];
  readonly extensionPolicy: ExecutiveBlindSpotPolicy;
  readonly releaseMetadata: ExecutiveBlindSpotMetadata;
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveBlindSpotValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveBlindSpotCertification = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly validation: ExecutiveBlindSpotValidation;
  readonly certifiedBridgeId: string;
}>;

export type ExecutiveBlindSpotResult<T> = Readonly<{
  readonly ok: boolean;
  readonly value: T;
  readonly validation: ExecutiveBlindSpotValidation;
}>;
