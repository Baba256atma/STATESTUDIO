/**
 * DKL-9:6 — Data Knowledge Suite Platform.
 *
 * Canonical immutable runtime-neutral integration surface for the Data
 * Knowledge Suite through DKL-9:5. Consumes only DataKnowledgeSuiteManifestPlatform.
 * Metadata-only. Platform-only. Runtime-free.
 *
 * Ownership: owned exclusively by DKL-9:6.
 *
 * Public exports (exactly 8):
 *   DataKnowledgeSuitePlatformId
 *   DataKnowledgeSuitePlatformVersion
 *   DataKnowledgeSuitePlatformName
 *   DataKnowledgeSuitePlatformNamespace
 *   DataKnowledgeSuitePlatformStatus
 *   DataKnowledgeSuitePlatformReadiness
 *   DataKnowledgeSuitePlatform
 *   getDataKnowledgeSuitePlatformSummary()
 */

import { DataKnowledgeSuiteManifestPlatform } from "./dataKnowledgeSuiteManifest.ts";
import {
  DataKnowledgeSuitePlatformChainIds,
  DataKnowledgeSuitePlatformObservedCounts,
  DataKnowledgeSuitePlatformPhases,
  DataKnowledgeSuitePlatformUpstreamSurfaces,
} from "./dataKnowledgeSuitePlatformArchitecture.ts";
import { DataKnowledgeSuitePlatformCompatibility } from "./dataKnowledgeSuitePlatformCompatibility.ts";
import { DataKnowledgeSuitePlatformDependencies } from "./dataKnowledgeSuitePlatformDependencies.ts";
import { DataKnowledgeSuitePlatformGuarantees } from "./dataKnowledgeSuitePlatformGuarantees.ts";
import {
  DataKnowledgeSuitePlatformArchitectureStatus,
  DataKnowledgeSuitePlatformPublicApis,
  DataKnowledgeSuitePlatformReadinessValue,
} from "./dataKnowledgeSuitePlatformReadiness.ts";
import type { DataKnowledgeSuitePlatformSummary } from "./dataKnowledgeSuitePlatformTypes.ts";

export const DataKnowledgeSuitePlatformId =
  "DKL-9:6/DataKnowledgeSuitePlatform" as const;

export const DataKnowledgeSuitePlatformName =
  "Data Knowledge Suite Platform" as const;

export const DataKnowledgeSuitePlatformVersion = "1.0.0" as const;

export const DataKnowledgeSuitePlatformNamespace =
  "nexora.dkl.data-knowledge-suite.platform" as const;

export const DataKnowledgeSuitePlatformStatus = "PlatformDefined" as const;

export const DataKnowledgeSuitePlatformReadiness =
  DataKnowledgeSuitePlatformReadinessValue;

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "metadata",
  "dependency",
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "capabilityCatalog",
  "ownership",
  "boundaries",
  "contracts",
  "integrationContracts",
  "inventory",
  "counts",
  "compatibility",
  "guarantees",
  "readiness",
] as const);

/**
 * Counting rule for Platform totalEntryCount:
 * completedPhases + futurePhases + platformDependencies +
 * manifestTotalEntryCount + platformGuarantees + platformCompatibility +
 * platformPublicApis
 */
const COUNTING_RULE =
  "completedPhases + futurePhases + platformDependencies + manifestTotalEntryCount + platformGuarantees + platformCompatibility + platformPublicApis";

const manifest = DataKnowledgeSuiteManifestPlatform;
const counts = DataKnowledgeSuitePlatformObservedCounts;
const upstream = DataKnowledgeSuitePlatformUpstreamSurfaces;

const totalEntryCount =
  counts.completedPhaseCount +
  counts.futurePhaseCount +
  DataKnowledgeSuitePlatformDependencies.length +
  counts.manifestTotalEntryCount +
  DataKnowledgeSuitePlatformGuarantees.length +
  DataKnowledgeSuitePlatformCompatibility.length +
  DataKnowledgeSuitePlatformPublicApis.length;

const inventory = Object.freeze({
  inventoryId: "DKL-9:6/DataKnowledgeSuitePlatformInventory",
  completedPhaseCount: counts.completedPhaseCount,
  futurePhaseCount: counts.futurePhaseCount,
  totalDkl9PhaseCount: counts.totalDkl9PhaseCount,
  dependencyCount: DataKnowledgeSuitePlatformDependencies.length,
  manifestTotalEntryCount: counts.manifestTotalEntryCount,
  capabilityCount: counts.capabilityCount,
  publicPlatformReferenceCount: counts.publicPlatformReferenceCount,
  publicApiRegistryReferenceCount: counts.publicApiRegistryReferenceCount,
  publicApiInventoryTotal: counts.publicApiInventoryTotal,
  dependencyGraphCount: counts.dependencyCount,
  ownershipReferenceCount: counts.ownershipReferenceCount,
  boundaryReferenceCount: counts.boundaryReferenceCount,
  modelKindCount: counts.modelKindCount,
  validationRuleCount: counts.validationRuleCount,
  validationGateCount: counts.validationGateCount,
  validationCategoryCount: counts.validationCategoryCount,
  registryTotalEntryCount: counts.registryTotalEntryCount,
  guaranteeCount: DataKnowledgeSuitePlatformGuarantees.length,
  compatibilityCount: DataKnowledgeSuitePlatformCompatibility.length,
  publicApiCount: DataKnowledgeSuitePlatformPublicApis.length,
  sectionCount: PLATFORM_SECTIONS.length,
  totalEntryCount,
  countingRule: COUNTING_RULE,
  manifestInventory: manifest.inventory,
  sourcedThroughManifest: true as const,
  reconstructed: false as const,
  hardcoded: false as const,
  duplicated: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const identity = Object.freeze({
  platformId: DataKnowledgeSuitePlatformId,
  platformName: DataKnowledgeSuitePlatformName,
  platformVersion: DataKnowledgeSuitePlatformVersion,
  platformNamespace: DataKnowledgeSuitePlatformNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-9" as const,
  stage: "Platform" as const,
  sourcePhase: "DKL-9:6" as const,
  owner: "DKL-9 Data Knowledge Suite",
  status: DataKnowledgeSuitePlatformStatus,
  readiness: DataKnowledgeSuitePlatformReadiness,
  manifestId: manifest.identity.manifestId,
  manifestVersion: manifest.identity.manifestVersion,
  architectureStatus: DataKnowledgeSuitePlatformArchitectureStatus,
  metadataOnly: true as const,
  immutable: true as const,
});

const metadata = Object.freeze({
  metadataId: "DKL-9:6/DataKnowledgeSuitePlatformMetadata",
  suiteName: "Data Knowledge Suite" as const,
  architecturePhases: DataKnowledgeSuitePlatformPhases,
  chainIds: DataKnowledgeSuitePlatformChainIds,
  architectureStatus: DataKnowledgeSuitePlatformArchitectureStatus,
  manifestMetadata: manifest.metadata,
  releaseMetadataOnly: true as const,
  reconstructsUpstream: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-9:6/Dependency/DKL95Manifest",
  directPreviousPhaseModule: "dataKnowledgeSuiteManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: manifest.identity.manifestId,
  manifestVersion: manifest.identity.manifestVersion,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  publicIndexDirectImport: false as const,
  dkl1DirectImport: false as const,
  dkl2DirectImport: false as const,
  dkl3DirectImport: false as const,
  dkl4DirectImport: false as const,
  dkl5DirectImport: false as const,
  dkl6DirectImport: false as const,
  dkl7DirectImport: false as const,
  dkl8DirectImport: false as const,
  reconstructsManifest: false as const,
  reconstructsUpstream: false as const,
  platformDependencies: DataKnowledgeSuitePlatformDependencies,
  canonicalPath:
    "DKL-9:6 → DKL-9:5 Manifest → DKL-9:4 Validation → DKL-9:3 Model → DKL-9:2 Registry → DKL-9:1 Foundation → DKL-1..DKL-8 Public Indexes",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Data Knowledge Suite Platform.
 * Upstream sections preserved by Manifest-chain reference.
 */
export const DataKnowledgeSuitePlatform = Object.freeze({
  identity,
  metadata,
  dependency,
  foundation: upstream.foundation,
  registry: upstream.registry,
  model: upstream.model,
  validation: upstream.validation,
  manifest,
  capabilityCatalog: upstream.capabilityCatalog,
  ownership: upstream.ownership,
  boundaries: upstream.boundaries,
  contracts: upstream.contracts,
  integrationContracts: upstream.integrationContracts,
  inventory,
  counts: Object.freeze({
    ...counts,
    guaranteeCount: DataKnowledgeSuitePlatformGuarantees.length,
    compatibilityCount: DataKnowledgeSuitePlatformCompatibility.length,
    publicApiCount: DataKnowledgeSuitePlatformPublicApis.length,
    totalEntryCount,
  }),
  compatibility: DataKnowledgeSuitePlatformCompatibility,
  guarantees: DataKnowledgeSuitePlatformGuarantees,
  readiness: DataKnowledgeSuitePlatformReadiness,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: DataKnowledgeSuitePlatformStatus,
  nextPhase: "DKL-9:7 — Data Knowledge Suite Certification",
  apiRegistry: DataKnowledgeSuitePlatformPublicApis,
  lifecycle: upstream.lifecycle,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  policyExecution: false as const,
  authenticationBehavior: false as const,
  authorizationBehavior: false as const,
  repositoryAccess: false as const,
  searchExecution: false as const,
  graphTraversal: false as const,
  aiBehavior: false as const,
  transportBehavior: false as const,
  engineReasoning: false as const,
  advisorBehavior: false as const,
  sceneBehavior: false as const,
  uiBehavior: false as const,
  reconstructsUpstream: false as const,
  duplicatesInventories: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Data Knowledge Suite Platform summary. */
export function getDataKnowledgeSuitePlatformSummary(): DataKnowledgeSuitePlatformSummary {
  return Object.freeze({
    platformId: DataKnowledgeSuitePlatformId,
    version: DataKnowledgeSuitePlatformVersion,
    name: DataKnowledgeSuitePlatformName,
    namespace: DataKnowledgeSuitePlatformNamespace,
    status: DataKnowledgeSuitePlatformStatus,
    readiness: DataKnowledgeSuitePlatformReadiness,
    manifestId: manifest.identity.manifestId,
    capabilityCount: counts.capabilityCount,
    publicApiInventoryTotal: counts.publicApiInventoryTotal,
    validationRuleCount: counts.validationRuleCount,
    validationGateCount: counts.validationGateCount,
    guaranteeCount: DataKnowledgeSuitePlatformGuarantees.length,
    compatibilityCount: DataKnowledgeSuitePlatformCompatibility.length,
    manifestTotalEntryCount: counts.manifestTotalEntryCount,
    totalEntryCount,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "DKL-9:7 — Data Knowledge Suite Certification",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
