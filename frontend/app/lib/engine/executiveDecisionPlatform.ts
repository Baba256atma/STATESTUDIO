import { ExecutiveDecisionPlatformArchitecture } from "./executiveDecisionPlatformArchitecture.ts";
import {
  ExecutiveDecisionPlatformComponentRegistry,
  ExecutiveDecisionPlatformComponentTotals,
} from "./executiveDecisionPlatformComponentRegistry.ts";
import { ExecutiveDecisionPlatformMetadata } from "./executiveDecisionPlatformMetadata.ts";
import { ExecutiveDecisionPlatformReadiness } from "./executiveDecisionPlatformReadiness.ts";
import {
  getExecutiveDecisionFoundation,
} from "./executiveDecisionPublicApi.ts";
import {
  getExecutiveDecisionRegistryPlatform,
} from "./executiveDecisionRegistryPlatform.ts";
import {
  getExecutiveDecisionModelPlatform,
} from "./executiveDecisionModelPlatform.ts";
import {
  getExecutiveDecisionValidationPlatform,
  getExecutiveDecisionValidationSummary,
} from "./executiveDecisionValidationPlatform.ts";
import {
  getExecutiveDecisionCompatibilityManifest,
  getExecutiveDecisionGuaranteeManifest,
  getExecutiveDecisionManifestPlatform,
  getExecutiveDecisionManifestSummary,
  getExecutiveDecisionOwnershipManifest,
} from "./executiveDecisionManifestPlatform.ts";
import type {
  ExecutiveDecisionPlatformComponent,
  ExecutiveDecisionPlatformSummary as ExecutiveDecisionPlatformSummaryDescriptor,
} from "./executiveDecisionPlatformTypes.ts";

const validationSummary = getExecutiveDecisionValidationSummary();
const manifestSummary = getExecutiveDecisionManifestSummary();

export const ExecutiveDecisionPlatformInventory = Object.freeze({
  phaseCount: 5,
  componentCount: 5,
  representedFileCount: 40,
  approvedPublicExportCount: 34,
  foundationCapabilityCount: 8,
  decisionDomainCount: 12,
  decisionTypeCount: 16,
  decisionCapabilityCount: 8,
  decisionOutputCount: 8,
  lifecycleStateCount: 8,
  canonicalModelCount: 10,
  validationCategoryCount: 8,
  validationSeverityCount: 4,
  validationRuleCount: 32,
  passingValidationRuleCount: 32,
  failingValidationRuleCount: 0,
  compatibilityDeclarationCount: 8,
  architecturalGuaranteeCount: 12,
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveDecisionPlatformSummary = Object.freeze({
  platformId: "ENG-7:6",
  phase: "ENG-7:6",
  namespace: "Nexora.Engine.ExecutiveDecision.Platform",
  owner: "ENG-7",
  componentCount: 5,
  completedPhaseCount: 5,
  representedFileCount: 40,
  approvedPublicExportCount: 34,
  canonicalModelCount: 10,
  validationRuleCount: 32,
  passingValidationRuleCount: 32,
  compatibilityDeclarationCount: 8,
  architecturalGuaranteeCount: 12,
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  validationStatus: "ValidationCertified",
  manifestStatus: "ManifestComplete",
  platformStatus: "PlatformAssembled",
  ownershipStatus: "OwnershipProtected",
  dependencyStatus: "DependencySafe",
  publicApiStatus: "PublicApiStable",
  antiDuplicationStatus: "AntiDuplicationCompliant",
  readiness: "ReadyForDecisionCertification",
  nextPhase: "ENG-7:7",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionPlatformSummaryDescriptor);

/**
 * Canonical Executive Decision Platform.
 * Aggregates ENG-7:1 through ENG-7:5 without redefining prior architecture.
 */
export const ExecutiveDecisionPlatform = Object.freeze({
  foundation: getExecutiveDecisionFoundation(),
  registry: getExecutiveDecisionRegistryPlatform(),
  model: getExecutiveDecisionModelPlatform(),
  validation: getExecutiveDecisionValidationPlatform(),
  manifest: getExecutiveDecisionManifestPlatform(),
  metadata: ExecutiveDecisionPlatformMetadata,
  componentRegistry: ExecutiveDecisionPlatformComponentRegistry,
  architecture: ExecutiveDecisionPlatformArchitecture,
  readiness: ExecutiveDecisionPlatformReadiness,
  inventory: ExecutiveDecisionPlatformInventory,
  dependencySummary: Object.freeze({
    direction: "ForwardOnly",
    edgeCount: ExecutiveDecisionPlatformArchitecture.dependencies.length,
    totals: ExecutiveDecisionPlatformComponentTotals,
  } as const),
  ownershipSummary: getExecutiveDecisionOwnershipManifest(),
  compatibilitySummary: Object.freeze({
    count: getExecutiveDecisionCompatibilityManifest().length,
    entries: getExecutiveDecisionCompatibilityManifest(),
    alignedWithManifest: getExecutiveDecisionCompatibilityManifest().length
      === manifestSummary.compatibilityCount,
  } as const),
  guaranteeSummary: Object.freeze({
    count: getExecutiveDecisionGuaranteeManifest().length,
    entries: getExecutiveDecisionGuaranteeManifest(),
    alignedWithManifest: getExecutiveDecisionGuaranteeManifest().length
      === manifestSummary.guaranteeCount,
  } as const),
  consumerSummary: Object.freeze({
    consumers: ExecutiveDecisionPlatformArchitecture.consumers,
    count: ExecutiveDecisionPlatformArchitecture.consumers.length,
  } as const),
  summary: ExecutiveDecisionPlatformSummary,
  validationAlignment: Object.freeze({
    declaredPassing: 32,
    summaryPassing: validationSummary.passedRules,
    summaryStatus: validationSummary.validationStatus,
  } as const),
  guarantees: Object.freeze({
    status: "Stable",
    architectureMode: "MetadataOnly",
    immutability: "DeeplyFrozen",
    validationStatus: "ValidationCertified",
    manifestStatus: "ManifestComplete",
    platformStatus: "PlatformAssembled",
    ownershipStatus: "OwnershipProtected",
    dependencyStatus: "DependencySafe",
    publicApiStatus: "PublicApiStable",
    antiDuplicationStatus: "AntiDuplicationCompliant",
    readiness: "ReadyForDecisionCertification",
  } as const),
  consumedSurfaces: Object.freeze({
    foundation: "executiveDecisionPublicApi.ts",
    registry: "executiveDecisionRegistryPlatform.ts",
    model: "executiveDecisionModelPlatform.ts",
    validation: "executiveDecisionValidationPlatform.ts",
    manifest: "executiveDecisionManifestPlatform.ts",
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

const componentIndex = Object.freeze(
  Object.fromEntries(
    ExecutiveDecisionPlatformComponentRegistry.map((entry) => [entry.id, entry]),
  ) as Readonly<Record<string, ExecutiveDecisionPlatformComponent | undefined>>,
);

export const getExecutiveDecisionPlatform = () => ExecutiveDecisionPlatform;
export const getExecutiveDecisionPlatformMetadata = () => ExecutiveDecisionPlatformMetadata;
export const getExecutiveDecisionPlatformComponents = () => ExecutiveDecisionPlatformComponentRegistry;
export const getExecutiveDecisionPlatformComponentById = (
  id: string,
): ExecutiveDecisionPlatformComponent | undefined => componentIndex[id];
export const getExecutiveDecisionPlatformArchitecture = () => ExecutiveDecisionPlatformArchitecture;
export const getExecutiveDecisionPlatformReadiness = () => ExecutiveDecisionPlatformReadiness;
export const getExecutiveDecisionPlatformInventory = () => ExecutiveDecisionPlatformInventory;
export const getExecutiveDecisionPlatformConsumers = () => ExecutiveDecisionPlatformArchitecture.consumers;
export const getExecutiveDecisionPlatformSummary = () => ExecutiveDecisionPlatformSummary;

export {
  ExecutiveDecisionPlatformArchitecture,
  ExecutiveDecisionPlatformComponentRegistry,
  ExecutiveDecisionPlatformMetadata,
  ExecutiveDecisionPlatformReadiness,
};
