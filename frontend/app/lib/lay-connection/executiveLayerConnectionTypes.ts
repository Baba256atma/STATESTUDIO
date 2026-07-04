export type ExecutiveConnectionDirection = "Inbound" | "Outbound" | "Bidirectional" | "Broadcast" | "Internal" | "External";

export type ExecutiveConnectionCategory =
  | "Reasoning"
  | "Judgment"
  | "Recommendation"
  | "Explanation"
  | "Awareness"
  | "Attention"
  | "Priority"
  | "Blind Spot"
  | "Coaching"
  | "Dashboard"
  | "Assistant"
  | "Scene"
  | "Runtime"
  | "EVE";

export type ExecutiveConnectionLifecycle = "Draft" | "Active" | "Deprecated" | "Frozen";

export type ExecutiveConnectionVersion = Readonly<{
  readonly contractVersion: string;
  readonly apiVersion: string;
  readonly platformVersion: string;
}>;

export type ExecutiveConnectionIdentity = Readonly<{
  readonly connectionId: string;
  readonly name: string;
  readonly domain: string;
  readonly category: ExecutiveConnectionCategory;
  readonly description: string;
}>;

export type ExecutiveConnectionProvider = Readonly<{
  readonly providerId: string;
  readonly name: string;
  readonly layer: string;
  readonly capabilities: readonly string[];
}>;

export type ExecutiveConnectionConsumer = Readonly<{
  readonly consumerId: string;
  readonly name: string;
  readonly layer: string;
  readonly capabilities: readonly string[];
}>;

export type ExecutiveConnectionDependency = Readonly<{
  readonly dependencyId: string;
  readonly name: string;
  readonly required: boolean;
  readonly boundary: string;
}>;

export type ExecutiveConnectionCapability = Readonly<{
  readonly capabilityId: string;
  readonly name: string;
  readonly category: ExecutiveConnectionCategory;
  readonly description: string;
}>;

export type ExecutiveConnectionSignal = Readonly<{
  readonly signalId: string;
  readonly name: string;
  readonly category: ExecutiveConnectionCategory;
  readonly payloadSchemaId: string;
}>;

export type ExecutiveConnectionPayload = Readonly<{
  readonly payloadId: string;
  readonly schemaId: string;
  readonly metadataOnly: boolean;
  readonly fields: readonly string[];
}>;

export type ExecutiveConnectionMetadata = Readonly<{
  readonly tags: readonly string[];
  readonly ownerLayer: string;
  readonly sourcePhase: string;
  readonly immutable: boolean;
}>;

export type ExecutiveConnectionCompatibility = Readonly<{
  readonly layerId: string;
  readonly compatible: boolean;
  readonly mode: "direct" | "metadata-only" | "future";
  readonly notes: readonly string[];
}>;

export type ExecutiveConnectionBoundary = Readonly<{
  readonly boundaryId: string;
  readonly name: string;
  readonly allowsRuntime: boolean;
  readonly allowsNetwork: boolean;
  readonly allowsUi: boolean;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveConnectionPermission = Readonly<{
  readonly permissionId: string;
  readonly description: string;
  readonly grantsRuntimeAccess: boolean;
  readonly grantsMutationAccess: boolean;
}>;

export type ExecutiveConnectionPolicy = Readonly<{
  readonly policyId: string;
  readonly extensionMode: "additive-only" | "closed";
  readonly breakingChangesAllowed: boolean;
  readonly runtimeBehaviorAllowed: boolean;
  readonly notes: readonly string[];
}>;

export type ExecutiveLayerConnectionContract = Readonly<{
  readonly identity: ExecutiveConnectionIdentity;
  readonly providerId: string;
  readonly consumerId: string;
  readonly direction: ExecutiveConnectionDirection;
  readonly capabilities: readonly string[];
  readonly dependencies: readonly string[];
  readonly signal: ExecutiveConnectionSignal;
  readonly payload: ExecutiveConnectionPayload;
  readonly boundary: ExecutiveConnectionBoundary;
  readonly permissions: readonly ExecutiveConnectionPermission[];
  readonly lifecycle: ExecutiveConnectionLifecycle;
  readonly version: ExecutiveConnectionVersion;
  readonly metadata: ExecutiveConnectionMetadata;
}>;

export type ExecutiveConnectionRegistry = Readonly<{
  readonly contracts: readonly ExecutiveLayerConnectionContract[];
  readonly categories: readonly ExecutiveConnectionCategory[];
  readonly directions: readonly ExecutiveConnectionDirection[];
  readonly providers: readonly ExecutiveConnectionProvider[];
  readonly consumers: readonly ExecutiveConnectionConsumer[];
  readonly capabilities: readonly ExecutiveConnectionCapability[];
  readonly dependencies: readonly ExecutiveConnectionDependency[];
  readonly version: ExecutiveConnectionVersion;
  readonly releaseMetadata: ExecutiveConnectionMetadata;
  readonly extensionPolicy: ExecutiveConnectionPolicy;
}>;

export type ExecutiveConnectionManifest = Readonly<{
  readonly platformId: string;
  readonly platformName: string;
  readonly platformVersion: string;
  readonly supportedCategories: readonly ExecutiveConnectionCategory[];
  readonly supportedDirections: readonly ExecutiveConnectionDirection[];
  readonly registeredProviders: readonly ExecutiveConnectionProvider[];
  readonly registeredConsumers: readonly ExecutiveConnectionConsumer[];
  readonly compatibility: readonly ExecutiveConnectionCompatibility[];
  readonly extensionPolicy: ExecutiveConnectionPolicy;
  readonly releaseMetadata: ExecutiveConnectionMetadata;
  readonly registryFingerprint: string;
}>;

export type ExecutiveConnectionValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveConnectionCertification = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly validation: ExecutiveConnectionValidation;
  readonly certifiedContracts: number;
}>;

export type ExecutiveConnectionResult<T> = Readonly<{
  readonly ok: boolean;
  readonly value: T;
  readonly validation: ExecutiveConnectionValidation;
}>;
