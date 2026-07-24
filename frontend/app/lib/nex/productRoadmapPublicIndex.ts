/**
 * NEX-2:9 — Product Roadmap Public Index.
 *
 * Sole supported consumer entry for the frozen NEX-2 architecture.
 * Freeze-only. Metadata-only. Runtime-free.
 */

import { ProductRoadmapFreeze } from "./productRoadmapFreeze.ts";

export const ProductRoadmapPublicIndexIdentity = Object.freeze({
  id: "NEX-2:9/ProductRoadmapPublicIndex",
  name: "Nexora Product Roadmap Public Index",
  domain: "NEX Product Roadmap",
  phase: "NEX-2:9",
  namespace: "nexora.nex.product-roadmap.public-index",
  version: "1.0.0",
  status: "Released",
  description:
    "Canonical sole consumer entry point for the frozen NEX-2 Product Roadmap metadata architecture.",
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
  metadataOnly: true,
  immutable: true,
} as const);

export const ProductRoadmapPublicNamespace = Object.freeze({
  identity: ProductRoadmapPublicIndexIdentity,
  foundation: ProductRoadmapFreeze.baselines[0],
  registry: ProductRoadmapFreeze.baselines[1],
  model: ProductRoadmapFreeze.baselines[2],
  validation: ProductRoadmapFreeze.baselines[3],
  manifest: ProductRoadmapFreeze.baselines[4],
  platform: ProductRoadmapFreeze.baselines[5],
  certification: ProductRoadmapFreeze.baselines[6],
  freeze: ProductRoadmapFreeze,
} as const);

const PublicIndexExportAugmentationCount = 4 as const;

export const ProductRoadmapPublicApiCount =
  ProductRoadmapFreeze.publicApiRegistry.length +
  PublicIndexExportAugmentationCount;

export const ProductRoadmapPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-2:9/PublicExport/01/Identity", order: 1, exportName: "ProductRoadmapPublicIndexIdentity", kind: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:9/PublicExport/02/Namespace", order: 2, exportName: "ProductRoadmapPublicNamespace", kind: "Namespace", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:9/PublicExport/03/ApiRegistry", order: 3, exportName: "ProductRoadmapPublicApiRegistry", kind: "PublicApiRegistry", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:9/PublicExport/04/ApiCount", order: 4, exportName: "ProductRoadmapPublicApiCount", kind: "Inventory", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:9/PublicExport/05/ReleaseMetadata", order: 5, exportName: "ProductRoadmapReleaseMetadata", kind: "Release", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:9/PublicExport/06/CompatibilityMetadata", order: 6, exportName: "ProductRoadmapCompatibilityMetadata", kind: "Compatibility", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:9/PublicExport/07/ConsumerEntry", order: 7, exportName: "ProductRoadmapConsumerEntryDeclaration", kind: "ConsumerContract", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:9/PublicExport/08/PublicVersion", order: 8, exportName: "ProductRoadmapPublicVersion", kind: "Version", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:9/PublicExport/09/PublicReadiness", order: 9, exportName: "ProductRoadmapPublicReadiness", kind: "Readiness", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:9/PublicExport/10/PublicStability", order: 10, exportName: "ProductRoadmapPublicStability", kind: "Stability", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:9/PublicExport/11/FreezeReference", order: 11, exportName: "ProductRoadmapFreezeReference", kind: "FreezeReference", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:9/PublicExport/12/Default", order: 12, exportName: "default", kind: "DefaultPublicExport", executableApi: false, metadataOnly: true }),
] as const);

export const ProductRoadmapReleaseMetadata = Object.freeze({
  id: "NEX-2:9/ReleaseMetadata",
  release: "Released",
  certification: "Certified",
  freeze: "Frozen",
  stability: "Stable",
  readiness: "ReadyForConsumer",
  canonicalLockIdentifier: ProductRoadmapFreeze.canonicalLockIdentifier,
  metadataOnly: true,
  immutable: true,
} as const);

export const ProductRoadmapCompatibilityMetadata =
  ProductRoadmapFreeze.compatibility;

export const ProductRoadmapConsumerEntryDeclaration = Object.freeze({
  id: "NEX-2:9/ConsumerEntryDeclaration",
  entryPoint: "productRoadmapPublicIndex.ts",
  soleSupportedConsumerEntryPoint: true,
  freezeOnlyDependency: true,
  metadataOnlyPublication: true,
  stablePublicSurface: true,
  backwardCompatibleConsumerContract: true,
  runtimeContract: false,
  immutable: true,
} as const);

export const ProductRoadmapPublicVersion = "1.0.0" as const;
export const ProductRoadmapPublicReadiness = "ReadyForConsumer" as const;
export const ProductRoadmapPublicStability = "Stable" as const;
export const ProductRoadmapFreezeReference = ProductRoadmapFreeze;

const ProductRoadmapPublicValidationMetadata = Object.freeze([
  Object.freeze({ id: "NEX-2:9/Validation/FreezeOnlyDependency", requirement: "Freeze is the only dependency.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:9/Validation/TwoFiles", requirement: "Exactly two Public Index files exist.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:9/Validation/TwelveExports", requirement: "Exactly twelve public exports exist.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:9/Validation/NineSections", requirement: "Exactly nine namespace sections exist.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:9/Validation/UniqueApiRegistry", requirement: "Public API Registry identifiers are unique.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:9/Validation/DeterministicOrdering", requirement: "Public API Registry ordering is deterministic.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:9/Validation/CanonicalNamespace", requirement: "Namespace is canonical.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:9/Validation/UniqueConsumerEntry", requirement: "Consumer entry is unique.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:9/Validation/ConsumerReadiness", requirement: "Readiness equals ReadyForConsumer.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:9/Validation/NoProhibitedImports", requirement: "No prohibited imports are permitted.", executesValidation: false, metadataOnly: true, immutable: true }),
] as const);

const ProductRoadmapDefaultPublicExport = Object.freeze({
  identity: ProductRoadmapPublicIndexIdentity,
  namespace: ProductRoadmapPublicNamespace,
  publicApiRegistry: ProductRoadmapPublicApiRegistry,
  publicApiCount: ProductRoadmapPublicApiCount,
  release: ProductRoadmapReleaseMetadata,
  compatibility: ProductRoadmapCompatibilityMetadata,
  consumerEntry: ProductRoadmapConsumerEntryDeclaration,
  validationMetadata: ProductRoadmapPublicValidationMetadata,
  version: ProductRoadmapPublicVersion,
  readiness: ProductRoadmapPublicReadiness,
  stability: ProductRoadmapPublicStability,
  freeze: ProductRoadmapFreezeReference,
  status: "Released · Certified · Frozen · Stable",
  domainCompletion: "NEX-2 — Product Roadmap COMPLETE",
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
} as const);

export default ProductRoadmapDefaultPublicExport;
