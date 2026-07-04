export type ExecutiveTypeCRuntimeParticipantId =
  | "CORE"
  | "DS"
  | "INT"
  | "KNL"
  | "LLM"
  | "APP"
  | "APP-REASON"
  | "APP-JUDGE"
  | "ASS"
  | "IDN"
  | "SMM"
  | "LAY"
  | "LAY-CONN"
  | "DASHBOARD"
  | "ASSISTANT"
  | "SCENE"
  | "EVE"
  | "RUNTIME";

export type ExecutiveTypeCRuntimeMetadata = Readonly<{
  readonly platformId: string;
  readonly phaseId: "LAY-CONN-11";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
  readonly tags: readonly string[];
}>;

export type ExecutiveTypeCRuntimeContext = Readonly<{
  readonly contextId: string;
  readonly typeCContextId: string;
  readonly metadata: ExecutiveTypeCRuntimeMetadata;
}>;

export type ExecutiveTypeCRuntimeParticipant = Readonly<{
  readonly participantId: ExecutiveTypeCRuntimeParticipantId;
  readonly name: string;
  readonly required: boolean;
  readonly mode: "certified" | "metadata-only";
  readonly metadata: ExecutiveTypeCRuntimeMetadata;
}>;

export type ExecutiveTypeCRuntimeDependency = Readonly<{
  readonly dependencyId: string;
  readonly required: boolean;
  readonly mode: "certified" | "metadata-only";
}>;

export type ExecutiveTypeCRuntimeCapability = Readonly<{
  readonly capabilityId: string;
  readonly name: string;
  readonly participantId: ExecutiveTypeCRuntimeParticipantId;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveTypeCRuntimeProvider = Readonly<{
  readonly providerId: string;
  readonly platformId: string;
  readonly certified: boolean;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveTypeCRuntimeConsumer = Readonly<{
  readonly consumerId: string;
  readonly name: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveTypeCRuntimePolicy = Readonly<{
  readonly policyId: string;
  readonly runtimeBehaviorAllowed: boolean;
  readonly coordinationAllowed: boolean;
  readonly pipelineAllowed: boolean;
  readonly dispatchAllowed: boolean;
  readonly scheduleAllowed: boolean;
  readonly stateChangeAllowed: boolean;
  readonly extensionMode: "additive-only";
}>;

export type ExecutiveTypeCRuntimeBoundary = Readonly<{
  readonly boundaryId: string;
  readonly metadataOnly: boolean;
  readonly certifiedLayerMutationAllowed: boolean;
  readonly externalTransportAllowed: boolean;
}>;

export type ExecutiveTypeCRuntimeLifecycle = Readonly<{
  readonly lifecycleId: string;
  readonly state: "Draft" | "Certified" | "Frozen";
  readonly metadata: ExecutiveTypeCRuntimeMetadata;
}>;

export type ExecutiveTypeCRuntimeCompatibility = Readonly<{
  readonly platformId: string;
  readonly compatible: boolean;
  readonly required: boolean;
  readonly mode: "certified" | "metadata-only";
  readonly notes: readonly string[];
}>;

export type ExecutiveTypeCRuntimeIntegrationPlatform = Readonly<{
  readonly platformId: string;
  readonly name: string;
  readonly context: ExecutiveTypeCRuntimeContext;
  readonly participants: readonly ExecutiveTypeCRuntimeParticipant[];
  readonly capabilities: readonly ExecutiveTypeCRuntimeCapability[];
  readonly providers: readonly ExecutiveTypeCRuntimeProvider[];
  readonly consumers: readonly ExecutiveTypeCRuntimeConsumer[];
  readonly dependencies: readonly ExecutiveTypeCRuntimeDependency[];
  readonly boundaries: readonly ExecutiveTypeCRuntimeBoundary[];
  readonly lifecycle: ExecutiveTypeCRuntimeLifecycle;
  readonly policy: ExecutiveTypeCRuntimePolicy;
  readonly metadata: ExecutiveTypeCRuntimeMetadata;
}>;

export type ExecutiveTypeCRuntimeRegistry = Readonly<{
  readonly platformId: string;
  readonly participants: readonly ExecutiveTypeCRuntimeParticipant[];
  readonly providers: readonly ExecutiveTypeCRuntimeProvider[];
  readonly consumers: readonly ExecutiveTypeCRuntimeConsumer[];
  readonly capabilities: readonly ExecutiveTypeCRuntimeCapability[];
  readonly dependencies: readonly ExecutiveTypeCRuntimeDependency[];
  readonly compatibilityMatrix: readonly ExecutiveTypeCRuntimeCompatibility[];
  readonly versionMetadata: ExecutiveTypeCRuntimeMetadata;
  readonly extensionPolicy: ExecutiveTypeCRuntimePolicy;
  readonly publicApis: readonly string[];
}>;

export type ExecutiveTypeCRuntimeManifest = Readonly<{
  readonly platformId: string;
  readonly platformVersion: string;
  readonly supportedParticipants: readonly ExecutiveTypeCRuntimeParticipant[];
  readonly supportedCapabilities: readonly ExecutiveTypeCRuntimeCapability[];
  readonly registeredProviders: readonly ExecutiveTypeCRuntimeProvider[];
  readonly registeredConsumers: readonly ExecutiveTypeCRuntimeConsumer[];
  readonly dependencies: readonly ExecutiveTypeCRuntimeDependency[];
  readonly compatibility: readonly ExecutiveTypeCRuntimeCompatibility[];
  readonly extensionPolicy: ExecutiveTypeCRuntimePolicy;
  readonly releaseMetadata: ExecutiveTypeCRuntimeMetadata;
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveTypeCRuntimeValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveTypeCRuntimeCertification = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly validation: ExecutiveTypeCRuntimeValidation;
  readonly certifiedPlatformId: string;
}>;

export type ExecutiveTypeCRuntimeResult<T> = Readonly<{
  readonly ok: boolean;
  readonly value: T;
  readonly validation: ExecutiveTypeCRuntimeValidation;
}>;
