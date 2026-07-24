/**
 * NEX-2:5 — Product Roadmap Manifest.
 *
 * Immutable validated metadata publication package. Ready for Platform.
 */

import { ProductRoadmapManifestComposition } from "./productRoadmapManifestComposition.ts";
import { ProductRoadmapManifestGuarantees } from "./productRoadmapManifestGuarantees.ts";
import { ProductRoadmapManifestIdentity } from "./productRoadmapManifestIdentity.ts";
import { ProductRoadmapManifestInventories } from "./productRoadmapManifestInventories.ts";
import { ProductRoadmapManifestInventory } from "./productRoadmapManifestInventory.ts";
import { ProductRoadmapManifestPublicApiRegistry as PublicApiRegistry } from "./productRoadmapManifestPublicApi.ts";
import { ProductRoadmapValidation } from "./productRoadmapValidation.ts";

export const ProductRoadmapManifestId = "NEX-2:5/ProductRoadmapManifest" as const;
export const ProductRoadmapManifestName = "Nexora Product Roadmap Manifest" as const;
export const ProductRoadmapManifestNamespace = "nexora.nex.product-roadmap.manifest" as const;
export const ProductRoadmapManifestVersion = "1.0.0" as const;
export const ProductRoadmapManifestStatus = "Manifest" as const;
export const ProductRoadmapManifestReadiness = "ReadyForPlatform" as const;
export const ProductRoadmapManifestPublicApiRegistry = PublicApiRegistry;

export const ProductRoadmapManifest = Object.freeze({
  identity: ProductRoadmapManifestIdentity,
  dependency: Object.freeze({
    id: "NEX-2:5/Dependency/NEX24Validation",
    upstreamId: ProductRoadmapValidation.identity.id,
    upstreamPhase: "NEX-2:4",
    validationOnly: true,
    otherDependenciesAllowed: false,
    runtimeDependency: false,
    metadataOnly: true,
    immutable: true,
  } as const),
  inventory: ProductRoadmapManifestInventory,
  inventories: ProductRoadmapManifestInventories,
  composition: ProductRoadmapManifestComposition,
  guarantees: ProductRoadmapManifestGuarantees,
  compatibility: ProductRoadmapManifestComposition.compatibility,
  dependencies: ProductRoadmapManifestComposition.dependencies,
  lifecycle: ProductRoadmapManifestComposition.lifecycle,
  readinessDeclaration: ProductRoadmapManifestComposition.readiness,
  publication: ProductRoadmapManifestComposition.publication,
  metadata: ProductRoadmapManifestComposition.metadata,
  publicApiRegistry: ProductRoadmapManifestPublicApiRegistry,
  platformSeedMetadata: Object.freeze({
    manifests: Object.freeze([ProductRoadmapManifestIdentity]),
    capabilitySubjects: Object.freeze([
      "Roadmap",
      "ReleaseStrategy",
      "Milestone",
      "StrategicInitiative",
      "ProductTheme",
      "ProductPriority",
      "RoadmapGovernance",
      "ProductEvolution",
    ]),
    compatibilityDeclarations: Object.freeze([
      "BackwardCompatible",
      "ForwardExtendable",
      "MetadataCompatible",
      "VersionCompatible",
    ]),
    metadataOnly: true,
    immutable: true,
  } as const),
  status: ProductRoadmapManifestStatus,
  readiness: ProductRoadmapManifestReadiness,
  readyForPlatform: true,
  nextPhase: "NEX-2:6 — Product Roadmap Platform",
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
