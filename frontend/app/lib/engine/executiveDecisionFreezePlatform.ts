import { ExecutiveDecisionFreezeBaseline } from "./executiveDecisionFreezeBaseline.ts";
import { ExecutiveDecisionFreezeCompatibility } from "./executiveDecisionFreezeCompatibility.ts";
import {
  ExecutiveDecisionDependencyLocks,
  ExecutiveDecisionExtensionLocks,
  ExecutiveDecisionOwnershipLocks,
} from "./executiveDecisionFreezeLocks.ts";
import {
  ExecutiveDecisionFreezeManifest,
  ExecutiveDecisionFreezeMetadata,
  ExecutiveDecisionFreezeReadiness,
} from "./executiveDecisionFreezeManifest.ts";
import {
  ExecutiveDecisionFreezeRegistry,
  getExecutiveDecisionFreezeEntryById,
} from "./executiveDecisionFreezeRegistry.ts";
import {
  getExecutiveDecisionCertificationPlatform,
} from "./executiveDecisionCertificationPlatform.ts";
import {
  getExecutiveDecisionManifestPlatform,
} from "./executiveDecisionManifestPlatform.ts";
import {
  getExecutiveDecisionModelPlatform,
} from "./executiveDecisionModelPlatform.ts";
import {
  getExecutiveDecisionPlatform,
} from "./executiveDecisionPlatform.ts";
import {
  getExecutiveDecisionFoundation,
} from "./executiveDecisionPublicApi.ts";
import {
  getExecutiveDecisionRegistryPlatform,
} from "./executiveDecisionRegistryPlatform.ts";
import {
  getExecutiveDecisionValidationPlatform,
} from "./executiveDecisionValidationPlatform.ts";
import type {
  ExecutiveDecisionFreezeSummary as ExecutiveDecisionFreezeSummaryDescriptor,
} from "./executiveDecisionFreezeTypes.ts";

export const ExecutiveDecisionFreezeSummary = Object.freeze({
  freezeId: "ENG-7:8",
  phase: "ENG-7:8",
  namespace: "Nexora.Engine.ExecutiveDecision.Freeze",
  owner: "ENG-7",
  freezeStatus: "Frozen",
  certification: "Certified",
  validationResult: "32/32 PASS",
  certificationGateResult: "15/15 PASS",
  regressionProtectionResult: "10/10 PASS",
  frozenComponents: "7/7",
  blockingViolations: 0,
  publicApiStatus: "StableAndFrozen",
  readiness: "ReadyForDecisionPublicIndex",
  frozenComponentCount: 7,
  representedFileCount: 54,
  approvedPublicExportCount: 47,
  compatibilityCount: 10,
  extensionLockCount: 6,
  status: "Frozen",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  ownershipStatus: "OwnershipLocked",
  dependencyStatus: "DependencyLocked",
  compatibilityStatus: "CompatibilityProtected",
  extensionStatus: "ExtensionControlled",
  antiDuplicationStatus: "AntiDuplicationProtected",
  nextPhase: "ENG-7:9",
  readyForPublicIndex: true,
  released: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionFreezeSummaryDescriptor);

/**
 * Canonical ENG-7:8 Executive Decision Freeze Platform.
 * Freezes ENG-7:1 through ENG-7:7 without redefining prior architecture.
 */
export const ExecutiveDecisionFreezePlatform = Object.freeze({
  metadata: ExecutiveDecisionFreezeMetadata,
  registry: ExecutiveDecisionFreezeRegistry,
  compatibility: ExecutiveDecisionFreezeCompatibility,
  ownershipLocks: ExecutiveDecisionOwnershipLocks,
  dependencyLocks: ExecutiveDecisionDependencyLocks,
  extensionLocks: ExecutiveDecisionExtensionLocks,
  baseline: ExecutiveDecisionFreezeBaseline,
  manifest: ExecutiveDecisionFreezeManifest,
  readiness: ExecutiveDecisionFreezeReadiness,
  summary: ExecutiveDecisionFreezeSummary,
  frozenSurfaces: Object.freeze({
    foundation: getExecutiveDecisionFoundation(),
    registry: getExecutiveDecisionRegistryPlatform(),
    model: getExecutiveDecisionModelPlatform(),
    validation: getExecutiveDecisionValidationPlatform(),
    manifest: getExecutiveDecisionManifestPlatform(),
    platform: getExecutiveDecisionPlatform(),
    certification: getExecutiveDecisionCertificationPlatform(),
  } as const),
  finalResult: Object.freeze({
    freezeStatus: "Frozen",
    certification: "Certified",
    validation: "32/32 PASS",
    certificationGates: "15/15 PASS",
    regressionProtection: "10/10 PASS",
    frozenComponents: "7/7",
    blockingViolations: 0,
    publicApi: "StableAndFrozen",
    readiness: "ReadyForDecisionPublicIndex",
  } as const),
  guarantees: Object.freeze({
    status: "Frozen",
    certification: "Certified",
    architectureMode: "MetadataOnly",
    immutability: "DeeplyFrozen",
    publicApiStatus: "StableAndFrozen",
    ownershipStatus: "OwnershipLocked",
    dependencyStatus: "DependencyLocked",
    compatibilityStatus: "CompatibilityProtected",
    extensionStatus: "ExtensionControlled",
    antiDuplicationStatus: "AntiDuplicationProtected",
    readiness: "ReadyForDecisionPublicIndex",
  } as const),
  consumedSurfaces: Object.freeze({
    foundation: "executiveDecisionPublicApi.ts",
    registry: "executiveDecisionRegistryPlatform.ts",
    model: "executiveDecisionModelPlatform.ts",
    validation: "executiveDecisionValidationPlatform.ts",
    manifest: "executiveDecisionManifestPlatform.ts",
    platform: "executiveDecisionPlatform.ts",
    certification: "executiveDecisionCertificationPlatform.ts",
  } as const),
  ownership: Object.freeze({
    owner: "ENG-7",
    owns: Object.freeze([
      "freeze metadata",
      "freeze registry",
      "compatibility locks",
      "ownership locks",
      "dependency locks",
      "extension locks",
      "freeze baseline",
      "freeze manifest",
      "freeze readiness",
      "freeze summaries",
    ] as const),
    neverOwns: Object.freeze([
      "prior architectural components",
      "runtime enforcement",
      "decision selection",
      "alternative ranking",
      "confidence calculation",
      "risk calculation",
      "reasoning",
      "planning",
      "orchestration",
      "execution",
      "communication",
      "visualization",
      "persistence",
    ] as const),
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

export const getExecutiveDecisionFreezePlatform = () => ExecutiveDecisionFreezePlatform;
export const getExecutiveDecisionFreezeMetadata = () => ExecutiveDecisionFreezeMetadata;
export const getExecutiveDecisionFreezeRegistry = () => ExecutiveDecisionFreezeRegistry;
export const getExecutiveDecisionFreezeCompatibility = () => ExecutiveDecisionFreezeCompatibility;
export const getExecutiveDecisionOwnershipLocks = () => ExecutiveDecisionOwnershipLocks;
export const getExecutiveDecisionDependencyLocks = () => ExecutiveDecisionDependencyLocks;
export const getExecutiveDecisionExtensionLocks = () => ExecutiveDecisionExtensionLocks;
export const getExecutiveDecisionFreezeBaseline = () => ExecutiveDecisionFreezeBaseline;
export const getExecutiveDecisionFreezeManifest = () => ExecutiveDecisionFreezeManifest;
export const getExecutiveDecisionFreezeReadiness = () => ExecutiveDecisionFreezeReadiness;
export const getExecutiveDecisionFreezeSummary = () => ExecutiveDecisionFreezeSummary;

export {
  ExecutiveDecisionDependencyLocks,
  ExecutiveDecisionExtensionLocks,
  ExecutiveDecisionFreezeCompatibility,
  ExecutiveDecisionFreezeManifest,
  ExecutiveDecisionFreezeMetadata,
  ExecutiveDecisionFreezeRegistry,
  ExecutiveDecisionOwnershipLocks,
  getExecutiveDecisionFreezeEntryById,
};
