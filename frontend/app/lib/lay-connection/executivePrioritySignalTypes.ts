export type ExecutivePrioritySignalCategory =
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

export type ExecutivePrioritySignalLevel = "Reference" | "Low" | "Medium" | "High" | "Critical" | "Urgent";

export type ExecutivePrioritySignalSeverity = "Informational" | "Notable" | "Elevated" | "Critical" | "Urgent";

export type ExecutivePrioritySignalConfidence = "Unspecified" | "Low" | "Medium" | "High";

export type ExecutivePrioritySignalIdentity = Readonly<{
  readonly signalId: string;
  readonly name: string;
  readonly category: ExecutivePrioritySignalCategory;
  readonly priorityType: string;
}>;

export type ExecutivePrioritySignalSource = Readonly<{
  readonly sourceId: string;
  readonly platformId: string;
  readonly certified: boolean;
  readonly futureCompatible: boolean;
}>;

export type ExecutivePrioritySignalTarget = Readonly<{
  readonly targetId: string;
  readonly consumerId: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutivePrioritySignalMetadata = Readonly<{
  readonly platformId: string;
  readonly phaseId: "LAY-CONN-7";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
  readonly tags: readonly string[];
}>;

export type ExecutivePrioritySignal = Readonly<{
  readonly identity: ExecutivePrioritySignalIdentity;
  readonly level: ExecutivePrioritySignalLevel;
  readonly severity: ExecutivePrioritySignalSeverity;
  readonly confidence: ExecutivePrioritySignalConfidence;
  readonly sourceId: string;
  readonly targetId: string;
  readonly metadata: ExecutivePrioritySignalMetadata;
}>;

export type ExecutivePrioritySignalDependency = Readonly<{
  readonly dependencyId: string;
  readonly required: boolean;
  readonly mode: "certified" | "future-compatible";
}>;

export type ExecutivePrioritySignalCompatibility = Readonly<{
  readonly platformId: string;
  readonly compatible: boolean;
  readonly required: boolean;
  readonly mode: "certified" | "future-compatible";
  readonly notes: readonly string[];
}>;

export type ExecutivePrioritySignalPolicy = Readonly<{
  readonly policyId: string;
  readonly derivationAllowed: boolean;
  readonly confidenceAssignmentAllowed: boolean;
  readonly orderingAllowed: boolean;
  readonly timeAssignmentAllowed: boolean;
  readonly adjustmentAllowed: boolean;
  readonly finalizationAllowed: boolean;
  readonly distributionAllowed: boolean;
  readonly pathSelectionAllowed: boolean;
  readonly selectionAllowed: boolean;
  readonly stateMutationAllowed: boolean;
  readonly extensionMode: "additive-only";
}>;

export type ExecutivePrioritySignalProvider = Readonly<{
  readonly providerId: string;
  readonly platformId: string;
  readonly certified: boolean;
  readonly futureCompatible: boolean;
}>;

export type ExecutivePrioritySignalConsumer = Readonly<{
  readonly consumerId: string;
  readonly name: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutivePrioritySignalRegistry = Readonly<{
  readonly platformId: string;
  readonly providers: readonly ExecutivePrioritySignalProvider[];
  readonly consumers: readonly ExecutivePrioritySignalConsumer[];
  readonly categories: readonly ExecutivePrioritySignalCategory[];
  readonly priorityTypes: readonly string[];
  readonly dependencies: readonly ExecutivePrioritySignalDependency[];
  readonly compatibilityMatrix: readonly ExecutivePrioritySignalCompatibility[];
  readonly versionMetadata: ExecutivePrioritySignalMetadata;
  readonly extensionPolicy: ExecutivePrioritySignalPolicy;
  readonly publicApis: readonly string[];
}>;

export type ExecutivePrioritySignalPlatform = Readonly<{
  readonly platformId: string;
  readonly name: string;
  readonly signals: readonly ExecutivePrioritySignal[];
  readonly policy: ExecutivePrioritySignalPolicy;
  readonly metadata: ExecutivePrioritySignalMetadata;
}>;

export type ExecutivePrioritySignalManifest = Readonly<{
  readonly platformId: string;
  readonly platformVersion: string;
  readonly supportedPriorityCategories: readonly ExecutivePrioritySignalCategory[];
  readonly supportedPriorityTypes: readonly string[];
  readonly registeredProviders: readonly ExecutivePrioritySignalProvider[];
  readonly registeredConsumers: readonly ExecutivePrioritySignalConsumer[];
  readonly dependencies: readonly ExecutivePrioritySignalDependency[];
  readonly compatibility: readonly ExecutivePrioritySignalCompatibility[];
  readonly extensionPolicy: ExecutivePrioritySignalPolicy;
  readonly releaseMetadata: ExecutivePrioritySignalMetadata;
  readonly deterministicFingerprint: string;
}>;

export type ExecutivePrioritySignalValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutivePrioritySignalCertification = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly validation: ExecutivePrioritySignalValidation;
  readonly certifiedPlatformId: string;
}>;

export type ExecutivePrioritySignalResult<T> = Readonly<{
  readonly ok: boolean;
  readonly value: T;
  readonly validation: ExecutivePrioritySignalValidation;
}>;
