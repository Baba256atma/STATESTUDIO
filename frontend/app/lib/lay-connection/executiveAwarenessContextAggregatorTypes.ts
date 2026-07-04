export type ExecutiveContextCategory =
  | "Strategic Context"
  | "Operational Context"
  | "Decision Context"
  | "Risk Context"
  | "Opportunity Context"
  | "Evidence Context"
  | "Constraint Context"
  | "Assumption Context"
  | "Stakeholder Context"
  | "Timeline Context"
  | "Knowledge Context"
  | "Identity Context";

export type ExecutiveContextSource =
  | "Executive Reasoning"
  | "Executive Judgment"
  | "Executive Recommendation"
  | "Executive Explanation"
  | "Shared Mental Model"
  | "Identity"
  | "Knowledge"
  | "Assistant"
  | "Dashboard"
  | "Scene"
  | "Runtime";

export type ExecutiveContextPriority = "Required" | "Recommended" | "Optional" | "Future";

export type ExecutiveContextMetadata = Readonly<{
  readonly aggregatorId: string;
  readonly phaseId: "LAY-CONN-5";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
  readonly tags: readonly string[];
}>;

export type ExecutiveAwarenessContextEntry = Readonly<{
  readonly entryId: string;
  readonly source: ExecutiveContextSource;
  readonly category: ExecutiveContextCategory;
  readonly contextType: string;
  readonly priority: ExecutiveContextPriority;
  readonly metadata: ExecutiveContextMetadata;
}>;

export type ExecutiveAwarenessContext = Readonly<{
  readonly contextId: string;
  readonly entries: readonly ExecutiveAwarenessContextEntry[];
  readonly metadata: ExecutiveContextMetadata;
}>;

export type ExecutiveContextDependency = Readonly<{
  readonly dependencyId: string;
  readonly required: boolean;
  readonly mode: "certified" | "future-compatible";
}>;

export type ExecutiveContextCompatibility = Readonly<{
  readonly platformId: string;
  readonly compatible: boolean;
  readonly required: boolean;
  readonly mode: "certified" | "future-compatible";
  readonly notes: readonly string[];
}>;

export type ExecutiveContextAggregationPolicy = Readonly<{
  readonly policyId: string;
  readonly executionAllowed: boolean;
  readonly stateMutationAllowed: boolean;
  readonly derivedContextAllowed: boolean;
  readonly extensionMode: "additive-only";
}>;

export type ExecutiveContextProvider = Readonly<{
  readonly providerId: string;
  readonly source: ExecutiveContextSource;
  readonly certified: boolean;
  readonly futureCompatible: boolean;
}>;

export type ExecutiveContextConsumer = Readonly<{
  readonly consumerId: string;
  readonly name: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveContextRegistry = Readonly<{
  readonly aggregatorId: string;
  readonly providers: readonly ExecutiveContextProvider[];
  readonly consumers: readonly ExecutiveContextConsumer[];
  readonly categories: readonly ExecutiveContextCategory[];
  readonly contextTypes: readonly string[];
  readonly dependencies: readonly ExecutiveContextDependency[];
  readonly compatibilityMatrix: readonly ExecutiveContextCompatibility[];
  readonly versionMetadata: ExecutiveContextMetadata;
  readonly extensionPolicy: ExecutiveContextAggregationPolicy;
  readonly publicApis: readonly string[];
}>;

export type ExecutiveAwarenessContextAggregator = Readonly<{
  readonly aggregatorId: string;
  readonly name: string;
  readonly context: ExecutiveAwarenessContext;
  readonly policy: ExecutiveContextAggregationPolicy;
  readonly metadata: ExecutiveContextMetadata;
}>;

export type ExecutiveContextManifest = Readonly<{
  readonly platformId: string;
  readonly aggregatorId: string;
  readonly version: string;
  readonly supportedContextTypes: readonly string[];
  readonly supportedProviders: readonly ExecutiveContextProvider[];
  readonly supportedConsumers: readonly ExecutiveContextConsumer[];
  readonly compatibility: readonly ExecutiveContextCompatibility[];
  readonly dependencies: readonly ExecutiveContextDependency[];
  readonly extensionPolicy: ExecutiveContextAggregationPolicy;
  readonly releaseMetadata: ExecutiveContextMetadata;
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveContextValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveContextCertification = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly validation: ExecutiveContextValidation;
  readonly certifiedAggregatorId: string;
}>;

export type ExecutiveAwarenessContextResult<T> = Readonly<{
  readonly ok: boolean;
  readonly value: T;
  readonly validation: ExecutiveContextValidation;
}>;
