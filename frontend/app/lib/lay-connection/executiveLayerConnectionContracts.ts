import type {
  ExecutiveConnectionBoundary,
  ExecutiveConnectionCapability,
  ExecutiveConnectionCategory,
  ExecutiveConnectionConsumer,
  ExecutiveConnectionDependency,
  ExecutiveConnectionDirection,
  ExecutiveConnectionMetadata,
  ExecutiveConnectionPermission,
  ExecutiveConnectionPolicy,
  ExecutiveConnectionProvider,
  ExecutiveConnectionVersion,
  ExecutiveLayerConnectionContract,
} from "./executiveLayerConnectionTypes.ts";

export const EXECUTIVE_CONNECTION_VERSION: ExecutiveConnectionVersion = Object.freeze({
  contractVersion: "LAY-CONN-1",
  apiVersion: "1.0.0",
  platformVersion: "LAY-CONN-1",
});

export const EXECUTIVE_CONNECTION_CATEGORIES: readonly ExecutiveConnectionCategory[] = Object.freeze([
  "Reasoning",
  "Judgment",
  "Recommendation",
  "Explanation",
  "Awareness",
  "Attention",
  "Priority",
  "Blind Spot",
  "Coaching",
  "Dashboard",
  "Assistant",
  "Scene",
  "Runtime",
  "EVE",
] as const);

export const EXECUTIVE_CONNECTION_DIRECTIONS: readonly ExecutiveConnectionDirection[] = Object.freeze([
  "Inbound",
  "Outbound",
  "Bidirectional",
  "Broadcast",
  "Internal",
  "External",
] as const);

export const EXECUTIVE_CONNECTION_METADATA: ExecutiveConnectionMetadata = Object.freeze({
  tags: Object.freeze(["executive-layer", "connection-contracts", "metadata-only"] as const),
  ownerLayer: "LAY",
  sourcePhase: "LAY-CONN-1",
  immutable: true,
});

export const EXECUTIVE_CONNECTION_EXTENSION_POLICY: ExecutiveConnectionPolicy = Object.freeze({
  policyId: "lay-conn-extension-policy",
  extensionMode: "additive-only",
  breakingChangesAllowed: false,
  runtimeBehaviorAllowed: false,
  notes: Object.freeze([
    "Future bridge phases may add connection contracts without changing certified contracts.",
    "Execution, routing, mutable coordination, presentation, and endpoint behavior are outside this phase.",
  ] as const),
});

export const EXECUTIVE_CONNECTION_BOUNDARY: ExecutiveConnectionBoundary = Object.freeze({
  boundaryId: "metadata-only-boundary",
  name: "Metadata Only Boundary",
  allowsRuntime: false,
  allowsNetwork: false,
  allowsUi: false,
  metadataOnly: true,
});

export const EXECUTIVE_CONNECTION_PERMISSION: ExecutiveConnectionPermission = Object.freeze({
  permissionId: "metadata-read-contract",
  description: "Allows consumers to inspect immutable connection metadata only.",
  grantsRuntimeAccess: false,
  grantsMutationAccess: false,
});

export const EXECUTIVE_CONNECTION_PROVIDERS: readonly ExecutiveConnectionProvider[] = Object.freeze([
  Object.freeze({ providerId: "lay-provider", name: "Executive Layer", layer: "LAY", capabilities: Object.freeze(["context", "signal", "explanation"] as const) }),
  Object.freeze({ providerId: "app-provider", name: "Executive Intelligence Platform", layer: "APP", capabilities: Object.freeze(["decision", "recommendation", "priority"] as const) }),
  Object.freeze({ providerId: "ass-provider", name: "Assistant Layer", layer: "ASS", capabilities: Object.freeze(["assistant", "coaching"] as const) }),
  Object.freeze({ providerId: "scene-provider", name: "Executive Scene Layer", layer: "Scene", capabilities: Object.freeze(["scene", "dashboard"] as const) }),
  Object.freeze({ providerId: "eve-provider", name: "Executive Event Layer", layer: "EVE", capabilities: Object.freeze(["eve", "runtime"] as const) }),
]);

export const EXECUTIVE_CONNECTION_CONSUMERS: readonly ExecutiveConnectionConsumer[] = Object.freeze([
  Object.freeze({ consumerId: "lay-consumer", name: "Executive Layer Consumer", layer: "LAY", capabilities: Object.freeze(["context", "awareness"] as const) }),
  Object.freeze({ consumerId: "app-consumer", name: "Executive Intelligence Consumer", layer: "APP", capabilities: Object.freeze(["decision", "priority"] as const) }),
  Object.freeze({ consumerId: "dashboard-consumer", name: "Executive Dashboard Consumer", layer: "Dashboard", capabilities: Object.freeze(["dashboard", "attention"] as const) }),
  Object.freeze({ consumerId: "assistant-consumer", name: "Executive Assistant Consumer", layer: "Assistant", capabilities: Object.freeze(["assistant", "coaching"] as const) }),
  Object.freeze({ consumerId: "runtime-consumer", name: "Executive Runtime Consumer", layer: "Runtime", capabilities: Object.freeze(["runtime", "eve"] as const) }),
]);

export const EXECUTIVE_CONNECTION_DEPENDENCIES: readonly ExecutiveConnectionDependency[] = Object.freeze([
  Object.freeze({ dependencyId: "core-contracts", name: "CORE Contract Surface", required: true, boundary: "metadata-only" }),
  Object.freeze({ dependencyId: "lay-platform-freeze", name: "LAY Platform Freeze", required: true, boundary: "metadata-only" }),
  Object.freeze({ dependencyId: "app-judgment-freeze", name: "APP Judgment Platform Freeze", required: false, boundary: "metadata-only" }),
  Object.freeze({ dependencyId: "assistant-contracts", name: "ASS Contract Surface", required: false, boundary: "metadata-only" }),
]);

export const EXECUTIVE_CONNECTION_CAPABILITIES: readonly ExecutiveConnectionCapability[] = Object.freeze(
  EXECUTIVE_CONNECTION_CATEGORIES.map((category) =>
    Object.freeze({
      capabilityId: category.toLowerCase().replaceAll(" ", "-"),
      name: `Executive ${category}`,
      category,
      description: `Immutable metadata contract capability for Executive ${category}.`,
    })
  )
);

const DOMAIN_CONTRACTS: readonly Readonly<{
  readonly id: string;
  readonly name: string;
  readonly domain: string;
  readonly category: ExecutiveConnectionCategory;
  readonly providerId: string;
  readonly consumerId: string;
  readonly direction: ExecutiveConnectionDirection;
}>[] = Object.freeze([
  Object.freeze({ id: "executive-context", name: "Executive Context", domain: "context", category: "Reasoning", providerId: "lay-provider", consumerId: "app-consumer", direction: "Bidirectional" }),
  Object.freeze({ id: "executive-signal", name: "Executive Signal", domain: "signal", category: "Awareness", providerId: "lay-provider", consumerId: "dashboard-consumer", direction: "Broadcast" }),
  Object.freeze({ id: "executive-decision", name: "Executive Decision", domain: "decision", category: "Judgment", providerId: "app-provider", consumerId: "lay-consumer", direction: "Outbound" }),
  Object.freeze({ id: "executive-recommendation", name: "Executive Recommendation", domain: "recommendation", category: "Recommendation", providerId: "app-provider", consumerId: "assistant-consumer", direction: "Outbound" }),
  Object.freeze({ id: "executive-explanation", name: "Executive Explanation", domain: "explanation", category: "Explanation", providerId: "lay-provider", consumerId: "assistant-consumer", direction: "Outbound" }),
  Object.freeze({ id: "executive-attention", name: "Executive Attention", domain: "attention", category: "Attention", providerId: "lay-provider", consumerId: "dashboard-consumer", direction: "Broadcast" }),
  Object.freeze({ id: "executive-awareness", name: "Executive Awareness", domain: "awareness", category: "Awareness", providerId: "lay-provider", consumerId: "dashboard-consumer", direction: "Broadcast" }),
  Object.freeze({ id: "executive-priority", name: "Executive Priority", domain: "priority", category: "Priority", providerId: "app-provider", consumerId: "dashboard-consumer", direction: "Outbound" }),
  Object.freeze({ id: "executive-blind-spot", name: "Executive Blind Spot", domain: "blindSpot", category: "Blind Spot", providerId: "lay-provider", consumerId: "assistant-consumer", direction: "Outbound" }),
  Object.freeze({ id: "executive-coaching", name: "Executive Coaching", domain: "coaching", category: "Coaching", providerId: "ass-provider", consumerId: "app-consumer", direction: "Bidirectional" }),
  Object.freeze({ id: "executive-dashboard", name: "Executive Dashboard", domain: "dashboard", category: "Dashboard", providerId: "scene-provider", consumerId: "dashboard-consumer", direction: "Internal" }),
  Object.freeze({ id: "executive-assistant", name: "Executive Assistant", domain: "assistant", category: "Assistant", providerId: "ass-provider", consumerId: "assistant-consumer", direction: "Internal" }),
  Object.freeze({ id: "executive-scene", name: "Executive Scene", domain: "scene", category: "Scene", providerId: "scene-provider", consumerId: "lay-consumer", direction: "Inbound" }),
  Object.freeze({ id: "executive-eve", name: "Executive EVE", domain: "eve", category: "EVE", providerId: "eve-provider", consumerId: "runtime-consumer", direction: "External" }),
  Object.freeze({ id: "executive-runtime", name: "Executive Runtime", domain: "runtime", category: "Runtime", providerId: "eve-provider", consumerId: "runtime-consumer", direction: "Internal" }),
]);

export const ExecutiveLayerConnectionContracts: readonly ExecutiveLayerConnectionContract[] = Object.freeze(
  DOMAIN_CONTRACTS.map((contract) =>
    Object.freeze({
      identity: Object.freeze({
        connectionId: contract.id,
        name: contract.name,
        domain: contract.domain,
        category: contract.category,
        description: `Canonical immutable connection contract for ${contract.name}.`,
      }),
      providerId: contract.providerId,
      consumerId: contract.consumerId,
      direction: contract.direction,
      capabilities: Object.freeze([contract.category.toLowerCase().replaceAll(" ", "-")] as const),
      dependencies: Object.freeze(["core-contracts", "lay-platform-freeze"] as const),
      signal: Object.freeze({
        signalId: `${contract.id}-signal`,
        name: `${contract.name} Signal`,
        category: contract.category,
        payloadSchemaId: `${contract.id}-payload`,
      }),
      payload: Object.freeze({
        payloadId: `${contract.id}-payload`,
        schemaId: `${contract.id}-schema`,
        metadataOnly: true,
        fields: Object.freeze(["identity", "metadata", "traceability"] as const),
      }),
      boundary: EXECUTIVE_CONNECTION_BOUNDARY,
      permissions: Object.freeze([EXECUTIVE_CONNECTION_PERMISSION] as const),
      lifecycle: "Frozen",
      version: EXECUTIVE_CONNECTION_VERSION,
      metadata: EXECUTIVE_CONNECTION_METADATA,
    })
  )
);
