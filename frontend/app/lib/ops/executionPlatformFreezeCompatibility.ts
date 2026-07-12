import type { ExecutionPlatformFreezeCompatibilityEntry } from "./executionPlatformFreezeTypes.ts";

export const ExecutionPlatformFreezeCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-1 Foundation",
    freezeStatus: "Frozen",
    description: "Foundation compatibility frozen for certified execution architecture.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "BUS",
    freezeStatus: "Frozen",
    description: "BUS integration compatibility frozen at public API boundary.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "CORE",
    freezeStatus: "Frozen",
    description: "CORE compatibility frozen for platform-level architectural use.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "APP",
    freezeStatus: "Frozen",
    description: "APP compatibility frozen for consumer-facing execution metadata.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "LAY",
    freezeStatus: "Frozen",
    description: "LAY compatibility frozen for public surface composition.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Future OPS Phases",
    freezeStatus: "Frozen",
    description: "Future OPS extensions must consume the frozen public architecture only.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformFreezeCompatibilityEntry),
] as const);

export const ExecutionPlatformFreezeCompatibilityMetadata = Object.freeze({
  freezeCompatibilityId: "ops.execution.platform-freeze-compatibility",
  freezeCompatibilityVersion: "1.0.0",
  compatibilityCount: ExecutionPlatformFreezeCompatibility.length,
  metadataOnly: true,
  immutable: true,
} as const);
