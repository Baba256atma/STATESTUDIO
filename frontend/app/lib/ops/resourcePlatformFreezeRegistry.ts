import type { ResourcePlatformFreezeRegistryEntry } from "./resourcePlatformFreezeTypes.ts";

export const ResourcePlatformFreezeRegistry = Object.freeze([
  Object.freeze({
    phaseId: "OPS-5:1",
    phaseName: "Resource Intelligence Foundation",
    phaseVersion: "1.0.0",
    certificationStatus: "PASS",
    frozen: true,
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeRegistryEntry),
  Object.freeze({
    phaseId: "OPS-5:2",
    phaseName: "Resource Registry & Metadata",
    phaseVersion: "1.0.0",
    certificationStatus: "PASS",
    frozen: true,
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeRegistryEntry),
  Object.freeze({
    phaseId: "OPS-5:3",
    phaseName: "Resource Model",
    phaseVersion: "1.0.0",
    certificationStatus: "PASS",
    frozen: true,
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeRegistryEntry),
  Object.freeze({
    phaseId: "OPS-5:4",
    phaseName: "Resource Validation Layer",
    phaseVersion: "1.0.0",
    certificationStatus: "PASS",
    frozen: true,
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeRegistryEntry),
  Object.freeze({
    phaseId: "OPS-5:5",
    phaseName: "Resource Manifest Layer",
    phaseVersion: "1.0.0",
    certificationStatus: "PASS",
    frozen: true,
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeRegistryEntry),
  Object.freeze({
    phaseId: "OPS-5:6",
    phaseName: "Resource Platform Index",
    phaseVersion: "1.0.0",
    certificationStatus: "PASS",
    frozen: true,
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeRegistryEntry),
  Object.freeze({
    phaseId: "OPS-5:7",
    phaseName: "Resource Platform Certification",
    phaseVersion: "1.0.0",
    certificationStatus: "PASS",
    frozen: true,
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeRegistryEntry),
] as const);

export const ResourcePlatformFreezeRegistryMetadata = Object.freeze({
  freezeRegistryId: "ops.resource.platform-freeze-registry",
  freezeRegistryVersion: "1.0.0",
  phaseCount: ResourcePlatformFreezeRegistry.length,
  freezeStatus: "Frozen",
  metadataOnly: true,
  immutable: true,
} as const);
