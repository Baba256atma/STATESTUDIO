/**
 * NEX-1:5 — Vision & Product Strategy Manifest.
 *
 * Immutable metadata publication aggregate. Ready for Platform.
 */

import {
  ProductVisionStrategyManifestCompatibility,
  ProductVisionStrategyManifestReadinessDeclaration,
} from "./productVisionStrategyManifestCompatibility.ts";
import { ProductVisionStrategyManifestComposition } from "./productVisionStrategyManifestComposition.ts";
import { ProductVisionStrategyManifestGuarantees } from "./productVisionStrategyManifestGuarantees.ts";
import { ProductVisionStrategyManifestIdentity } from "./productVisionStrategyManifestIdentity.ts";
import {
  ProductVisionStrategyManifestInventories,
  ProductVisionStrategyManifestInventory,
} from "./productVisionStrategyManifestInventory.ts";
import { ProductVisionStrategyManifestPublicApiRegistry as PublicApiRegistry } from "./productVisionStrategyManifestPublicApi.ts";
import { ProductVisionStrategyValidation } from "./productVisionStrategyValidation.ts";

export const ProductVisionStrategyManifestId = "NEX-1:5/ProductVisionStrategyManifest" as const;
export const ProductVisionStrategyManifestName = "Nexora Vision & Product Strategy Manifest" as const;
export const ProductVisionStrategyManifestNamespace = "nexora.nex.product-vision-strategy.manifest" as const;
export const ProductVisionStrategyManifestVersion = "1.0.0" as const;
export const ProductVisionStrategyManifestStatus = "Manifest" as const;
export const ProductVisionStrategyManifestReadiness = "ReadyForPlatform" as const;
export const ProductVisionStrategyManifestPublicApiRegistry = PublicApiRegistry;

export const ProductVisionStrategyManifest = Object.freeze({
  identity: ProductVisionStrategyManifestIdentity,
  dependency: Object.freeze({
    id: "NEX-1:5/Dependency/NEX14Validation",
    upstreamId: ProductVisionStrategyValidation.identity.id,
    upstreamPhase: "NEX-1:4",
    validationOnly: true,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  } as const),
  inventory: ProductVisionStrategyManifestInventory,
  inventories: ProductVisionStrategyManifestInventories,
  guarantees: ProductVisionStrategyManifestGuarantees,
  compatibility: ProductVisionStrategyManifestCompatibility,
  readinessDeclaration: ProductVisionStrategyManifestReadinessDeclaration,
  composition: ProductVisionStrategyManifestComposition,
  publicApiRegistry: ProductVisionStrategyManifestPublicApiRegistry,
  status: ProductVisionStrategyManifestStatus,
  readiness: ProductVisionStrategyManifestReadiness,
  readyForPlatform: true,
  nextPhase: "NEX-1:6 — Vision & Product Strategy Platform",
  metadataOnly: true,
  immutable: true,
  runtimeExecution: false,
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
