/**
 * NEX-2:6 — Product Roadmap Platform.
 *
 * Canonical immutable metadata composition surface.
 */

import { ProductRoadmapManifest } from "./productRoadmapManifest.ts";
import { ProductRoadmapPlatformCapabilities } from "./productRoadmapPlatformCapabilities.ts";
import { ProductRoadmapPlatformComposition } from "./productRoadmapPlatformComposition.ts";
import { ProductRoadmapPlatformGuarantees } from "./productRoadmapPlatformGuarantees.ts";
import { ProductRoadmapPlatformIdentity } from "./productRoadmapPlatformIdentity.ts";
import { ProductRoadmapPlatformInventory } from "./productRoadmapPlatformInventory.ts";
import { ProductRoadmapPlatformPublicApiRegistry as PublicApiRegistry } from "./productRoadmapPlatformPublicApi.ts";

export const ProductRoadmapPlatformId = "NEX-2:6/ProductRoadmapPlatform" as const;
export const ProductRoadmapPlatformName = "Nexora Product Roadmap Platform" as const;
export const ProductRoadmapPlatformNamespace = "nexora.nex.product-roadmap.platform" as const;
export const ProductRoadmapPlatformVersion = "1.0.0" as const;
export const ProductRoadmapPlatformStatus = "Platform" as const;
export const ProductRoadmapPlatformReadiness = "ReadyForCertification" as const;
export const ProductRoadmapPlatformPublicApiRegistry = PublicApiRegistry;

export const ProductRoadmapPlatform = Object.freeze({
  identity: ProductRoadmapPlatformIdentity,
  dependency: Object.freeze({
    id: "NEX-2:6/Dependency/NEX25Manifest",
    upstreamId: ProductRoadmapManifest.identity.id,
    upstreamPhase: "NEX-2:5",
    manifestOnly: true,
    otherDependenciesAllowed: false,
    runtimeDependency: false,
    metadataOnly: true,
    immutable: true,
  } as const),
  inventory: ProductRoadmapPlatformInventory,
  composition: ProductRoadmapPlatformComposition,
  capabilities: ProductRoadmapPlatformCapabilities,
  guarantees: ProductRoadmapPlatformGuarantees,
  compatibility: ProductRoadmapPlatformComposition.compatibility,
  dependencies: ProductRoadmapPlatformComposition.dependencies,
  readinessDeclaration: ProductRoadmapPlatformComposition.readiness,
  lifecycle: ProductRoadmapPlatformComposition.lifecycle,
  publication: ProductRoadmapPlatformComposition.publication,
  versioning: ProductRoadmapPlatformComposition.versioning,
  relationships: ProductRoadmapPlatformComposition.relationships,
  constraints: ProductRoadmapPlatformComposition.constraints,
  assumptions: ProductRoadmapPlatformComposition.assumptions,
  metadata: ProductRoadmapPlatformComposition.metadata,
  publicApiRegistry: ProductRoadmapPlatformPublicApiRegistry,
  certificationSeedMetadata: Object.freeze({
    platforms: Object.freeze([ProductRoadmapPlatformIdentity]),
    criteriaSubjects: Object.freeze([
      "CanonicalIdentity",
      "PlatformInventory",
      "ManifestTraceability",
      "RegistryTraceability",
      "ModelTraceability",
      "ValidationTraceability",
      "MetadataIntegrity",
      "PublicationIntegrity",
      "DependencyIntegrity",
      "Compatibility",
      "CapabilityCompleteness",
      "GuaranteeCompleteness",
      "PublicApiRegistry",
      "MetadataOnlyArchitecture",
      "VersionConsistency",
      "PlatformCompleteness",
    ]),
    gateSubjects: Object.freeze([
      "Identity",
      "Inventory",
      "Dependency",
      "Relationship",
      "Capability",
      "Guarantee",
      "Compatibility",
      "Publication",
      "Metadata",
      "Architecture",
      "Readiness",
      "Release",
    ]),
    dependencies: Object.freeze([ProductRoadmapPlatformComposition.dependencies]),
    compatibilityDeclarations:
      ProductRoadmapManifest.platformSeedMetadata.compatibilityDeclarations,
    metadataOnly: true,
    immutable: true,
  } as const),
  status: ProductRoadmapPlatformStatus,
  readiness: ProductRoadmapPlatformReadiness,
  readyForCertification: true,
  nextPhase: "NEX-2:7 — Product Roadmap Certification",
  metadataOnly: true,
  immutable: true,
  runtimeExecution: false,
  roadmapExecution: false,
  scheduling: false,
  projectManagementExecution: false,
  businessLogic: false,
  persistence: false,
  networking: false,
  rendering: false,
  ui: false,
  apiImplementation: false,
  services: false,
  executableValidation: false,
  artificialIntelligenceImplementation: false,
  orchestration: false,
  integrations: false,
} as const);
