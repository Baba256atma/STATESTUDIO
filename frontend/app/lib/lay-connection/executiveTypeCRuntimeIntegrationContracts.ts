import type {
  ExecutiveTypeCRuntimeIntegrationPlatform as ExecutiveTypeCRuntimeIntegrationPlatformContract,
  ExecutiveTypeCRuntimeMetadata,
  ExecutiveTypeCRuntimeParticipant,
  ExecutiveTypeCRuntimeParticipantId,
  ExecutiveTypeCRuntimePolicy,
} from "./executiveTypeCRuntimeIntegrationTypes.ts";

export const EXECUTIVE_TYPE_C_RUNTIME_INTEGRATION_PLATFORM_ID = "executive-type-c-runtime-integration-platform";
export const EXECUTIVE_TYPE_C_RUNTIME_INTEGRATION_VERSION = "LAY-CONN-11";

export const EXECUTIVE_TYPE_C_RUNTIME_PARTICIPANT_IDS: readonly ExecutiveTypeCRuntimeParticipantId[] = Object.freeze([
  "CORE",
  "DS",
  "INT",
  "KNL",
  "LLM",
  "APP",
  "APP-REASON",
  "APP-JUDGE",
  "ASS",
  "IDN",
  "SMM",
  "LAY",
  "LAY-CONN",
  "DASHBOARD",
  "ASSISTANT",
  "SCENE",
  "EVE",
  "RUNTIME",
] as const);

export const EXECUTIVE_TYPE_C_RUNTIME_METADATA: ExecutiveTypeCRuntimeMetadata = Object.freeze({
  platformId: EXECUTIVE_TYPE_C_RUNTIME_INTEGRATION_PLATFORM_ID,
  phaseId: "LAY-CONN-11",
  metadataOnly: true,
  immutable: true,
  tags: Object.freeze(["lay-connection", "type-c", "integration-metadata"] as const),
});

export const EXECUTIVE_TYPE_C_RUNTIME_POLICY: ExecutiveTypeCRuntimePolicy = Object.freeze({
  policyId: "type-c-integration-metadata-only-policy",
  runtimeBehaviorAllowed: false,
  coordinationAllowed: false,
  pipelineAllowed: false,
  dispatchAllowed: false,
  scheduleAllowed: false,
  stateChangeAllowed: false,
  extensionMode: "additive-only",
});

export const EXECUTIVE_TYPE_C_RUNTIME_PARTICIPANTS: readonly ExecutiveTypeCRuntimeParticipant[] = Object.freeze(
  EXECUTIVE_TYPE_C_RUNTIME_PARTICIPANT_IDS.map((participantId) =>
    Object.freeze({
      participantId,
      name: `${participantId} Type-C Participant`,
      required: participantId === "LAY-CONN" || participantId === "RUNTIME",
      mode: participantId === "LAY-CONN" ? "certified" : "metadata-only",
      metadata: EXECUTIVE_TYPE_C_RUNTIME_METADATA,
    })
  )
);

export const ExecutiveTypeCRuntimeIntegrationPlatform: ExecutiveTypeCRuntimeIntegrationPlatformContract = Object.freeze({
  platformId: EXECUTIVE_TYPE_C_RUNTIME_INTEGRATION_PLATFORM_ID,
  name: "Executive Type-C Runtime Integration Platform",
  context: Object.freeze({
    contextId: "type-c-integration-context",
    typeCContextId: "type-c-runtime-metadata-context",
    metadata: EXECUTIVE_TYPE_C_RUNTIME_METADATA,
  }),
  participants: EXECUTIVE_TYPE_C_RUNTIME_PARTICIPANTS,
  capabilities: Object.freeze([
    Object.freeze({ capabilityId: "participant-metadata", name: "Participant Metadata", participantId: "LAY-CONN", metadataOnly: true }),
    Object.freeze({ capabilityId: "compatibility-metadata", name: "Compatibility Metadata", participantId: "LAY-CONN", metadataOnly: true }),
    Object.freeze({ capabilityId: "boundary-metadata", name: "Boundary Metadata", participantId: "RUNTIME", metadataOnly: true }),
  ] as const),
  providers: Object.freeze([
    Object.freeze({ providerId: "lay-conn-provider", platformId: "LAY-CONN", certified: true, metadataOnly: true }),
    Object.freeze({ providerId: "runtime-metadata-provider", platformId: "RUNTIME", certified: false, metadataOnly: true }),
  ] as const),
  consumers: Object.freeze([
    Object.freeze({ consumerId: "type-c-runtime-consumer", name: "Type-C Runtime Metadata Consumer", metadataOnly: true }),
    Object.freeze({ consumerId: "lay-conn-consumer", name: "LAY-CONN Metadata Consumer", metadataOnly: true }),
  ] as const),
  dependencies: Object.freeze([
    Object.freeze({ dependencyId: "LAY-CONN-1", required: true, mode: "certified" }),
    Object.freeze({ dependencyId: "LAY-CONN-2", required: true, mode: "certified" }),
    Object.freeze({ dependencyId: "LAY-CONN-3", required: true, mode: "certified" }),
    Object.freeze({ dependencyId: "LAY-CONN-4", required: true, mode: "certified" }),
    Object.freeze({ dependencyId: "LAY-CONN-5", required: true, mode: "certified" }),
    Object.freeze({ dependencyId: "LAY-CONN-6", required: true, mode: "certified" }),
    Object.freeze({ dependencyId: "LAY-CONN-7", required: true, mode: "certified" }),
    Object.freeze({ dependencyId: "LAY-CONN-8", required: true, mode: "certified" }),
    Object.freeze({ dependencyId: "LAY-CONN-9", required: true, mode: "certified" }),
    Object.freeze({ dependencyId: "LAY-CONN-10", required: true, mode: "certified" }),
  ] as const),
  boundaries: Object.freeze([
    Object.freeze({ boundaryId: "metadata-only-boundary", metadataOnly: true, certifiedLayerMutationAllowed: false, externalTransportAllowed: false }),
    Object.freeze({ boundaryId: "future-runtime-boundary", metadataOnly: true, certifiedLayerMutationAllowed: false, externalTransportAllowed: false }),
  ] as const),
  lifecycle: Object.freeze({
    lifecycleId: "type-c-integration-lifecycle",
    state: "Certified",
    metadata: EXECUTIVE_TYPE_C_RUNTIME_METADATA,
  }),
  policy: EXECUTIVE_TYPE_C_RUNTIME_POLICY,
  metadata: EXECUTIVE_TYPE_C_RUNTIME_METADATA,
});
