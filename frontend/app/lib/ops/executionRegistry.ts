import { ExecutionPlatformId, ExecutionPlatformIdentity } from "./executionIdentity.ts";

export const ExecutionRegistry = Object.freeze({
  platformId: ExecutionPlatformId,
  platformName: ExecutionPlatformIdentity.platformName,
  namespace: ExecutionPlatformIdentity.platformNamespace,
  version: ExecutionPlatformIdentity.platformVersion,
  architectureOwner: "Nexora Architecture",
  releaseState: "Draft",
  metadataStatus: "Immutable",
  publicApiStatus: "Stable",
  registeredPhases: Object.freeze([
    Object.freeze({
      phaseId: "OPS-1:1",
      phaseName: "Execution Foundation",
      phaseVersion: "1.0.0",
      phaseStatus: "Foundation",
      metadataOnly: true,
      deterministic: true,
    }),
  ]),
  metadata: Object.freeze({
    registryId: "ops.execution.registry",
    registryVersion: "1.0.0",
    registryStatus: "Active",
    namespace: ExecutionPlatformIdentity.platformNamespace,
  }),
} as const);
