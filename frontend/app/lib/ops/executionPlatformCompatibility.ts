import type { ExecutionPlatformCompatibilityEntry } from "./executionPlatformCertificationTypes.ts";

export const ExecutionPlatformCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-1 Foundation",
    compatibilityStatus: "Compatible",
    description: "Compatible with the immutable execution foundation.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformCompatibilityEntry),
  Object.freeze({
    target: "BUS",
    compatibilityStatus: "Compatible",
    description: "Compatible with executive business intelligence decision surfaces.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformCompatibilityEntry),
  Object.freeze({
    target: "CORE",
    compatibilityStatus: "Compatible",
    description: "Compatible with Nexora core architectural layers.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformCompatibilityEntry),
  Object.freeze({
    target: "APP",
    compatibilityStatus: "Compatible",
    description: "Compatible with application-layer consumers of public OPS metadata.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformCompatibilityEntry),
  Object.freeze({
    target: "LAY",
    compatibilityStatus: "Compatible",
    description: "Compatible with layout and composition layers via public APIs only.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformCompatibilityEntry),
  Object.freeze({
    target: "Future OPS Phases",
    compatibilityStatus: "Compatible",
    description: "Compatible with future OPS phases extending the certified platform.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformCompatibilityEntry),
] as const);

export const ExecutionPlatformCompatibilityMetadata = Object.freeze({
  compatibilityMatrixId: "ops.execution.platform-compatibility",
  compatibilityVersion: "1.0.0",
  compatibilityCount: ExecutionPlatformCompatibility.length,
  metadataOnly: true,
  immutable: true,
} as const);
