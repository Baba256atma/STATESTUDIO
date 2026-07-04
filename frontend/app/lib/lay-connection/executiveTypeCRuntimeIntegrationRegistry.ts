import {
  EXECUTIVE_TYPE_C_RUNTIME_INTEGRATION_PLATFORM_ID,
  EXECUTIVE_TYPE_C_RUNTIME_METADATA,
  EXECUTIVE_TYPE_C_RUNTIME_PARTICIPANTS,
  EXECUTIVE_TYPE_C_RUNTIME_POLICY,
} from "./executiveTypeCRuntimeIntegrationContracts.ts";
import { getExecutiveTypeCRuntimeCompatibilityMatrix } from "./executiveTypeCRuntimeIntegrationCompatibility.ts";
import type { ExecutiveTypeCRuntimeRegistry } from "./executiveTypeCRuntimeIntegrationTypes.ts";

export const EXECUTIVE_TYPE_C_RUNTIME_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveTypeCRuntimeIntegrationPlatform",
  "buildExecutiveTypeCRuntimeManifest",
  "validateExecutiveTypeCRuntimeIntegrationPlatform",
  "validateExecutiveTypeCRuntimeManifest",
  "validateExecutiveTypeCRuntimeRegistry",
  "getExecutiveTypeCRuntimeRegistry",
  "getExecutiveTypeCRuntimeCompatibilityMatrix",
] as const);

export function getExecutiveTypeCRuntimeRegistry(): ExecutiveTypeCRuntimeRegistry {
  return Object.freeze({
    platformId: EXECUTIVE_TYPE_C_RUNTIME_INTEGRATION_PLATFORM_ID,
    participants: EXECUTIVE_TYPE_C_RUNTIME_PARTICIPANTS,
    providers: Object.freeze([
      Object.freeze({ providerId: "lay-conn-1-provider", platformId: "LAY-CONN-1", certified: true, metadataOnly: true }),
      Object.freeze({ providerId: "lay-conn-2-provider", platformId: "LAY-CONN-2", certified: true, metadataOnly: true }),
      Object.freeze({ providerId: "lay-conn-3-provider", platformId: "LAY-CONN-3", certified: true, metadataOnly: true }),
      Object.freeze({ providerId: "lay-conn-4-provider", platformId: "LAY-CONN-4", certified: true, metadataOnly: true }),
      Object.freeze({ providerId: "lay-conn-5-provider", platformId: "LAY-CONN-5", certified: true, metadataOnly: true }),
      Object.freeze({ providerId: "lay-conn-6-provider", platformId: "LAY-CONN-6", certified: true, metadataOnly: true }),
      Object.freeze({ providerId: "lay-conn-7-provider", platformId: "LAY-CONN-7", certified: true, metadataOnly: true }),
      Object.freeze({ providerId: "lay-conn-8-provider", platformId: "LAY-CONN-8", certified: true, metadataOnly: true }),
      Object.freeze({ providerId: "lay-conn-9-provider", platformId: "LAY-CONN-9", certified: true, metadataOnly: true }),
      Object.freeze({ providerId: "lay-conn-10-provider", platformId: "LAY-CONN-10", certified: true, metadataOnly: true }),
    ] as const),
    consumers: Object.freeze([
      Object.freeze({ consumerId: "type-c-runtime-consumer", name: "Type-C Runtime Metadata Consumer", metadataOnly: true }),
      Object.freeze({ consumerId: "type-c-platform-consumer", name: "Type-C Platform Metadata Consumer", metadataOnly: true }),
    ] as const),
    capabilities: Object.freeze([
      Object.freeze({ capabilityId: "runtime-context-metadata", name: "Runtime Context Metadata", participantId: "RUNTIME", metadataOnly: true }),
      Object.freeze({ capabilityId: "runtime-participant-metadata", name: "Runtime Participant Metadata", participantId: "LAY-CONN", metadataOnly: true }),
      Object.freeze({ capabilityId: "runtime-boundary-metadata", name: "Runtime Boundary Metadata", participantId: "LAY-CONN", metadataOnly: true }),
      Object.freeze({ capabilityId: "runtime-compatibility-metadata", name: "Runtime Compatibility Metadata", participantId: "LAY-CONN", metadataOnly: true }),
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
      Object.freeze({ dependencyId: "CORE", required: false, mode: "metadata-only" }),
      Object.freeze({ dependencyId: "RUNTIME", required: false, mode: "metadata-only" }),
    ] as const),
    compatibilityMatrix: getExecutiveTypeCRuntimeCompatibilityMatrix(),
    versionMetadata: EXECUTIVE_TYPE_C_RUNTIME_METADATA,
    extensionPolicy: EXECUTIVE_TYPE_C_RUNTIME_POLICY,
    publicApis: EXECUTIVE_TYPE_C_RUNTIME_PUBLIC_APIS,
  });
}
