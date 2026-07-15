import { ExecutiveContextAssemblyDependencyManifest } from "./executiveContextAssemblyManifest.ts";
import { ExecutiveContextAssemblyPlatformCompatibility } from "./executiveContextAssemblyPlatformCompatibility.ts";
import { ExecutiveContextAssemblyPlatformComponents } from "./executiveContextAssemblyPlatformComponents.ts";
import {
  ExecutiveContextAssemblyPlatformGuarantees,
  ExecutiveContextAssemblyPlatformReadiness,
} from "./executiveContextAssemblyPlatformReadiness.ts";
import type { ExecutiveContextPlatformMetadata } from "./executiveContextAssemblyPlatformTypes.ts";

export const ExecutiveContextAssemblyPlatformMetadata = Object.freeze({
  platformId: "ENG-4:6",
  platformVersion: "1.0.0",
  platformName: "Executive Context Assembly Platform",
  description: "Canonical metadata-only platform aggregation surface for Executive Context Assembly.",
  namespace: "nexora.engine.executive.context-assembly.platform",
  phase: "ENG-4:6",
  owner: "ENG-4",
  platformCategory: "ExecutiveContextAssembly",
  componentCount: ExecutiveContextAssemblyPlatformComponents.length,
  sectionCount: 6,
  dependencyCount: ExecutiveContextAssemblyDependencyManifest.length,
  compatibilityCount: ExecutiveContextAssemblyPlatformCompatibility.length,
  guaranteeCount: ExecutiveContextAssemblyPlatformGuarantees.length,
  readinessGateCount: ExecutiveContextAssemblyPlatformReadiness.length,
  status: Object.freeze({
    platform: "Platform",
    assembled: "Assembled",
    validated: "Validated",
    manifestComplete: "ManifestComplete",
    metadataOnly: "MetadataOnly",
    immutable: "Immutable",
    runtimeFree: "RuntimeFree",
    deterministic: "Deterministic",
    readyForCertification: "ReadyForCertification",
  } as const),
  nextPhase: "ENG-4:7",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextPlatformMetadata);
