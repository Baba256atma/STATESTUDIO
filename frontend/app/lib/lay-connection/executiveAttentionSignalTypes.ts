export type ExecutiveAttentionSignalCategory =
  | "Strategic"
  | "Operational"
  | "Decision"
  | "Risk"
  | "Opportunity"
  | "Resource"
  | "Timeline"
  | "Stakeholder"
  | "Dependency"
  | "Awareness"
  | "Confidence"
  | "Constraint";

export type ExecutiveAttentionSignalSeverity = "Informational" | "Notable" | "Elevated" | "Critical" | "Urgent";

export type ExecutiveAttentionSignalPriority = "MetadataOnly" | "Low" | "Medium" | "High" | "Future";

export type ExecutiveAttentionSignalConfidence = "Unspecified" | "Low" | "Medium" | "High";

export type ExecutiveAttentionSignalIdentity = Readonly<{
  readonly signalId: string;
  readonly name: string;
  readonly category: ExecutiveAttentionSignalCategory;
  readonly signalType: string;
}>;

export type ExecutiveAttentionSignalSource = Readonly<{
  readonly sourceId: string;
  readonly platformId: string;
  readonly certified: boolean;
  readonly futureCompatible: boolean;
}>;

export type ExecutiveAttentionSignalTarget = Readonly<{
  readonly targetId: string;
  readonly consumerId: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveAttentionSignalMetadata = Readonly<{
  readonly platformId: string;
  readonly phaseId: "LAY-CONN-6";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
  readonly tags: readonly string[];
}>;

export type ExecutiveAttentionSignal = Readonly<{
  readonly identity: ExecutiveAttentionSignalIdentity;
  readonly severity: ExecutiveAttentionSignalSeverity;
  readonly priority: ExecutiveAttentionSignalPriority;
  readonly confidence: ExecutiveAttentionSignalConfidence;
  readonly sourceId: string;
  readonly targetId: string;
  readonly metadata: ExecutiveAttentionSignalMetadata;
}>;

export type ExecutiveAttentionSignalDependency = Readonly<{
  readonly dependencyId: string;
  readonly required: boolean;
  readonly mode: "certified" | "future-compatible";
}>;

export type ExecutiveAttentionSignalCompatibility = Readonly<{
  readonly platformId: string;
  readonly compatible: boolean;
  readonly required: boolean;
  readonly mode: "certified" | "future-compatible";
  readonly notes: readonly string[];
}>;

export type ExecutiveAttentionSignalPolicy = Readonly<{
  readonly policyId: string;
  readonly creationAllowed: boolean;
  readonly distributionAllowed: boolean;
  readonly pathSelectionAllowed: boolean;
  readonly orderingAllowed: boolean;
  readonly selectionAllowed: boolean;
  readonly stateMutationAllowed: boolean;
  readonly extensionMode: "additive-only";
}>;

export type ExecutiveAttentionSignalProvider = Readonly<{
  readonly providerId: string;
  readonly platformId: string;
  readonly certified: boolean;
  readonly futureCompatible: boolean;
}>;

export type ExecutiveAttentionSignalConsumer = Readonly<{
  readonly consumerId: string;
  readonly name: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveAttentionSignalRegistry = Readonly<{
  readonly platformId: string;
  readonly providers: readonly ExecutiveAttentionSignalProvider[];
  readonly consumers: readonly ExecutiveAttentionSignalConsumer[];
  readonly categories: readonly ExecutiveAttentionSignalCategory[];
  readonly signalTypes: readonly string[];
  readonly dependencies: readonly ExecutiveAttentionSignalDependency[];
  readonly compatibilityMatrix: readonly ExecutiveAttentionSignalCompatibility[];
  readonly versionMetadata: ExecutiveAttentionSignalMetadata;
  readonly extensionPolicy: ExecutiveAttentionSignalPolicy;
  readonly publicApis: readonly string[];
}>;

export type ExecutiveAttentionSignalPlatform = Readonly<{
  readonly platformId: string;
  readonly name: string;
  readonly signals: readonly ExecutiveAttentionSignal[];
  readonly policy: ExecutiveAttentionSignalPolicy;
  readonly metadata: ExecutiveAttentionSignalMetadata;
}>;

export type ExecutiveAttentionSignalManifest = Readonly<{
  readonly platformId: string;
  readonly platformVersion: string;
  readonly supportedSignalCategories: readonly ExecutiveAttentionSignalCategory[];
  readonly supportedSignalTypes: readonly string[];
  readonly registeredProviders: readonly ExecutiveAttentionSignalProvider[];
  readonly registeredConsumers: readonly ExecutiveAttentionSignalConsumer[];
  readonly dependencies: readonly ExecutiveAttentionSignalDependency[];
  readonly compatibility: readonly ExecutiveAttentionSignalCompatibility[];
  readonly extensionPolicy: ExecutiveAttentionSignalPolicy;
  readonly releaseMetadata: ExecutiveAttentionSignalMetadata;
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveAttentionSignalValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveAttentionSignalCertification = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly validation: ExecutiveAttentionSignalValidation;
  readonly certifiedPlatformId: string;
}>;

export type ExecutiveAttentionSignalResult<T> = Readonly<{
  readonly ok: boolean;
  readonly value: T;
  readonly validation: ExecutiveAttentionSignalValidation;
}>;
