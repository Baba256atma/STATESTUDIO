/**
 * NEX-1:6 — Vision & Product Strategy Platform.
 *
 * Canonical immutable metadata composition surface.
 */

import { ProductVisionStrategyManifest } from "./productVisionStrategyManifest.ts";
import { ProductVisionStrategyPlatformCapabilities } from "./productVisionStrategyPlatformCapabilities.ts";
import { ProductVisionStrategyPlatformComposition } from "./productVisionStrategyPlatformComposition.ts";
import { ProductVisionStrategyPlatformGuarantees } from "./productVisionStrategyPlatformGuarantees.ts";
import { ProductVisionStrategyPlatformIdentity } from "./productVisionStrategyPlatformIdentity.ts";
import { ProductVisionStrategyPlatformInventory } from "./productVisionStrategyPlatformInventory.ts";
import { ProductVisionStrategyPlatformPublicApiRegistry as PublicApiRegistry } from "./productVisionStrategyPlatformPublicApi.ts";

export const ProductVisionStrategyPlatformId = "NEX-1:6/ProductVisionStrategyPlatform" as const;
export const ProductVisionStrategyPlatformName = "Nexora Vision & Product Strategy Platform" as const;
export const ProductVisionStrategyPlatformNamespace = "nexora.nex.product-vision-strategy.platform" as const;
export const ProductVisionStrategyPlatformVersion = "1.0.0" as const;
export const ProductVisionStrategyPlatformStatus = "Platform" as const;
export const ProductVisionStrategyPlatformReadiness = "ReadyForCertification" as const;
export const ProductVisionStrategyPlatformPublicApiRegistry = PublicApiRegistry;

export const ProductVisionStrategyPlatform = Object.freeze({
  identity: ProductVisionStrategyPlatformIdentity,
  dependency: Object.freeze({
    id: "NEX-1:6/Dependency/NEX15Manifest",
    upstreamId: ProductVisionStrategyManifest.identity.id,
    upstreamPhase: "NEX-1:5",
    manifestOnly: true,
    otherDependenciesAllowed: false,
    runtimeDependency: false,
    metadataOnly: true,
    immutable: true,
  } as const),
  inventory: ProductVisionStrategyPlatformInventory,
  composition: ProductVisionStrategyPlatformComposition,
  capabilities: ProductVisionStrategyPlatformCapabilities,
  guarantees: ProductVisionStrategyPlatformGuarantees,
  compatibility: ProductVisionStrategyPlatformComposition.compatibility,
  readinessDeclaration: ProductVisionStrategyPlatformComposition.readiness,
  lifecycle: ProductVisionStrategyPlatformComposition.lifecycle,
  publication: ProductVisionStrategyPlatformComposition.publication,
  versioning: ProductVisionStrategyPlatformComposition.versioning,
  relationships: ProductVisionStrategyPlatformComposition.relationships,
  constraints: ProductVisionStrategyPlatformComposition.constraints,
  assumptions: ProductVisionStrategyPlatformComposition.assumptions,
  metadata: ProductVisionStrategyPlatformComposition.metadata,
  publicApiInventory: ProductVisionStrategyPlatformPublicApiRegistry,
  status: ProductVisionStrategyPlatformStatus,
  readiness: ProductVisionStrategyPlatformReadiness,
  readyForCertification: true,
  nextPhase: "NEX-1:7 — Vision & Product Strategy Certification",
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
