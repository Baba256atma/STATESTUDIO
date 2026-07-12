import type {
  ExecutionPlatformId as ExecutionPlatformIdValue,
  ExecutionPlatformVersion as ExecutionPlatformVersionValue,
  ExecutionMetadata,
} from "./executionTypes.ts";

export const ExecutionPlatformName =
  "Nexora Executive Operations Execution Foundation" as const;

export const ExecutionPlatformNamespace =
  "nexora.ops.execution.foundation" as const;

export const ExecutionPlatformDescription =
  "Canonical metadata-only execution architecture foundation for the Nexora Executive Operations Platform." as const;

export const ExecutionPlatformVersion =
  "1.0.0" as const satisfies ExecutionPlatformVersionValue;

export const ExecutionPlatformId =
  "OPS-1:1" as const satisfies ExecutionPlatformIdValue;

export const ExecutionReleaseStage = "Draft" as const;

export const ExecutionIdentityMetadata = Object.freeze({
  owner: "Nexora Architecture",
  namespace: ExecutionPlatformNamespace,
  releaseStage: ExecutionReleaseStage,
  metadataStatus: "Immutable",
  publicApiStatus: "Stable",
  deterministic: true,
  sideEffectFree: true,
  frameworkIndependent: true,
  tags: Object.freeze([
    "ops",
    "execution",
    "foundation",
    "metadata-only",
  ]),
} as const satisfies ExecutionMetadata);

export const ExecutionPlatformIdentity = Object.freeze({
  platformId: ExecutionPlatformId,
  platformName: ExecutionPlatformName,
  platformNamespace: ExecutionPlatformNamespace,
  platformDescription: ExecutionPlatformDescription,
  platformVersion: ExecutionPlatformVersion,
  releaseStage: ExecutionReleaseStage,
  metadata: ExecutionIdentityMetadata,
} as const);
