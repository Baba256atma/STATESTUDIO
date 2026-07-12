import { DependencyIntelligenceRegistry } from "./dependencyIntelligenceIndex.ts";
import type { DependencyPhaseEntry } from "./dependencyManifestTypes.ts";

export const DependencyPlatformPhaseRegistry = Object.freeze([
  Object.freeze({
    phaseId: "OPS-7:1",
    phaseName: "Executive Dependency Intelligence Foundation",
    phaseVersion: "1.0.0",
    phaseStatus: "Foundation",
    description:
      "Canonical metadata-only foundation for executive dependency intelligence.",
    metadataOnly: true,
  } as const satisfies DependencyPhaseEntry),
  Object.freeze({
    phaseId: "OPS-7:2",
    phaseName: "Executive Dependency Intelligence Registry",
    phaseVersion: "1.0.0",
    phaseStatus: "Registry",
    description:
      "Canonical metadata-only registry for dependency entities, relationships, and lifecycle catalogs.",
    metadataOnly: true,
  } as const satisfies DependencyPhaseEntry),
  Object.freeze({
    phaseId: "OPS-7:3",
    phaseName: "Executive Dependency Intelligence Model",
    phaseVersion: "1.0.0",
    phaseStatus: "Model",
    description:
      "Canonical metadata-only structural model for dependency nodes, edges, graphs, and impacts.",
    metadataOnly: true,
  } as const satisfies DependencyPhaseEntry),
  Object.freeze({
    phaseId: "OPS-7:4",
    phaseName: "Executive Dependency Intelligence Validation",
    phaseVersion: "1.0.0",
    phaseStatus: "Validation",
    description:
      "Canonical metadata-only validation framework for dependency architecture completeness.",
    metadataOnly: true,
  } as const satisfies DependencyPhaseEntry),
] as const);

export const DependencyPlatformPhaseRegistryMetadata = Object.freeze({
  registryId: "ops.executive-dependency.platform-phase-registry",
  registryVersion: DependencyIntelligenceRegistry.version,
  phaseCount: DependencyPlatformPhaseRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
