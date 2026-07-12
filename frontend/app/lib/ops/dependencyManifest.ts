import {
  ExecutiveDependencyIntelligenceFoundation,
} from "./dependencyIntelligenceIndex.ts";
import {
  ExecutiveDependencyRegistry,
} from "./dependencyRegistryIndex.ts";
import {
  ExecutiveDependencyModel,
} from "./dependencyModelIndex.ts";
import {
  DependencyValidationRegistry,
  getDependencyValidationSummary,
} from "./dependencyValidationIndex.ts";
import {
  DependencyPlatformDependencyMap,
  DependencyPlatformDependencyMapMetadata,
} from "./dependencyPlatformDependencyMap.ts";
import type {
  DependencyManifestDescriptor,
  DependencyManifestSummary,
} from "./dependencyManifestTypes.ts";
import {
  DependencyPlatformPhaseRegistry,
  DependencyPlatformPhaseRegistryMetadata,
} from "./dependencyPhaseRegistry.ts";
import {
  DependencyPlatformPublicSurface,
  DependencyPlatformPublicSurfaceMetadata,
} from "./dependencyPublicSurface.ts";

export const buildDependencyManifest = () =>
  Object.freeze({
    platformIdentity: ExecutiveDependencyIntelligenceFoundation.registry,
    foundation: ExecutiveDependencyIntelligenceFoundation,
    consumedPhases: Object.freeze(
      DependencyPlatformPhaseRegistry.map((phase) => phase.phaseId),
    ),
    phaseRegistry: DependencyPlatformPhaseRegistry,
    phaseRegistryMetadata: DependencyPlatformPhaseRegistryMetadata,
    dependencyMap: DependencyPlatformDependencyMap,
    dependencyMapMetadata: DependencyPlatformDependencyMapMetadata,
    publicApiSurface: DependencyPlatformPublicSurface,
    publicApiSurfaceMetadata: DependencyPlatformPublicSurfaceMetadata,
    capabilitySummary: Object.freeze({
      entityCount: ExecutiveDependencyRegistry.entities.length,
      relationshipCount: ExecutiveDependencyRegistry.relationships.length,
      lifecycleCount: ExecutiveDependencyRegistry.lifecycle.length,
      metadataOnly: true,
      immutable: true,
    }),
    modelSummary: Object.freeze({
      nodeCount: ExecutiveDependencyModel.nodes.length,
      edgeCount: ExecutiveDependencyModel.edges.length,
      graphCount: ExecutiveDependencyModel.graph.length,
      impactCount: ExecutiveDependencyModel.impact.length,
      metadataOnly: true,
      immutable: true,
    }),
    validationSummary: getDependencyValidationSummary(),
    compatibilitySummary: Object.freeze({
      internalDependencyCount: DependencyPlatformDependencyMap.filter(
        (entry) => entry.sourcePhaseId.startsWith("OPS-7"),
      ).length,
      crossPlatformCompatibilityCount: DependencyPlatformDependencyMap.filter(
        (entry) => entry.sourcePhaseId === "OPS-7",
      ).length,
      validationRegistryGroupCount:
        DependencyValidationRegistry.validationGroups.length,
      compatibilityStatus:
        getDependencyValidationSummary().status === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    dependencyPlatformVersion: ExecutiveDependencyIntelligenceFoundation.registry.version,
    releaseReadinessMetadata: Object.freeze({
      readinessState:
        getDependencyValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      publicApiStable: true,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    deterministicSummary: Object.freeze({
      deterministic: true,
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnlySummary: Object.freeze({
      metadataOnly: true,
      immutable: true,
      publicApiStable: true,
    }),
    summary: Object.freeze({
      phaseCount: DependencyPlatformPhaseRegistry.length,
      dependencyCount: DependencyPlatformDependencyMap.length,
      publicApiCount: DependencyPlatformPublicSurface.length,
      compatibilityStatus:
        getDependencyValidationSummary().status === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies DependencyManifestSummary),
    descriptor: Object.freeze({
      platformId: ExecutiveDependencyIntelligenceFoundation.registry.platformId,
      platformName: ExecutiveDependencyIntelligenceFoundation.registry.platformName,
      platformVersion: ExecutiveDependencyIntelligenceFoundation.registry.version,
      compatibilityVersion:
        ExecutiveDependencyRegistry.metadata.compatibilityVersion,
      releaseReadiness:
        getDependencyValidationSummary().status === "PASS" ? "Ready" : "Blocked",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies DependencyManifestDescriptor),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
