import { ExecutiveDecisionFreezeBaseline } from "./executiveDecisionFreezeBaseline.ts";
import { ExecutiveDecisionFreezeCompatibility } from "./executiveDecisionFreezeCompatibility.ts";
import {
  ExecutiveDecisionDependencyLocks,
  ExecutiveDecisionExtensionLocks,
  ExecutiveDecisionOwnershipLocks,
} from "./executiveDecisionFreezeLocks.ts";
import { ExecutiveDecisionFreezeRegistry } from "./executiveDecisionFreezeRegistry.ts";
import type {
  ExecutiveDecisionFreezeMetadata as ExecutiveDecisionFreezeMetadataDescriptor,
  ExecutiveDecisionFreezeReadiness as ExecutiveDecisionFreezeReadinessDescriptor,
} from "./executiveDecisionFreezeTypes.ts";

export const ExecutiveDecisionFreezeMetadata = Object.freeze({
  id: "ENG-7:8",
  name: "Executive Decision Freeze Platform",
  namespace: "Nexora.Engine.ExecutiveDecision.Freeze",
  version: "1.0.0",
  status: "Frozen",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  runtimeBehavior: "None",
  owner: "ENG-7",
  previousPhase: "ENG-7:7",
  nextPhase: "ENG-7:9",
  validationStatus: "ValidationCertified",
  manifestStatus: "ManifestComplete",
  platformStatus: "PlatformAssembled",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  publicApiStatus: "StableAndFrozen",
  readiness: "ReadyForDecisionPublicIndex",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionFreezeMetadataDescriptor);

export const ExecutiveDecisionFreezeReadiness = Object.freeze({
  foundationFrozen: true,
  registryFrozen: true,
  modelFrozen: true,
  validationFrozen: true,
  manifestFrozen: true,
  platformFrozen: true,
  certificationFrozen: true,
  ownershipLocked: true,
  dependenciesLocked: true,
  compatibilityLocked: true,
  extensionsControlled: true,
  baselineRecorded: true,
  validationCertified: true,
  certificationComplete: true,
  allCertificationGatesPassing: true,
  allRegressionDeclarationsPassing: true,
  publicApiStable: true,
  publicApiFrozen: true,
  antiDuplicationProtected: true,
  runtimeFree: true,
  metadataOnly: true,
  deeplyFrozen: true,
  freezeComplete: true,
  readyForPublicIndex: true,
  released: false,
  immutable: true,
} as const satisfies ExecutiveDecisionFreezeReadinessDescriptor);

export const ExecutiveDecisionFreezeProhibitedChanges = Object.freeze([
  "Existing public identifier removal",
  "Existing public identifier replacement",
  "Existing public contract mutation",
  "Ownership reassignment",
  "Dependency-direction reversal",
  "Internal API exposure",
  "Runtime behavior introduction",
  "Decision logic introduction",
  "Existing registry-entry semantic replacement",
  "Breaking namespace or version mutation",
] as const);

export const ExecutiveDecisionFreezePermittedChanges = Object.freeze([
  "Additive metadata extension",
  "Additive compatibility extension",
  "Additive consumer declaration",
  "Documentation correction",
  "Non-breaking test expansion",
  "New versioned successor platform",
] as const);

const section = (
  id: string,
  name: string,
  description: string,
  order: number,
  payload: object,
) => Object.freeze({
  id,
  name,
  description,
  order,
  payload,
  metadataOnly: true,
  immutable: true,
} as const);

/**
 * Canonical freeze manifest with 12 ordered sections.
 */
export const ExecutiveDecisionFreezeManifest = Object.freeze({
  metadata: ExecutiveDecisionFreezeMetadata,
  sections: Object.freeze([
    section(
      "foundation",
      "Foundation",
      "Frozen ENG-7:1 foundation component.",
      1,
      ExecutiveDecisionFreezeRegistry[0],
    ),
    section(
      "registry",
      "Registry",
      "Frozen ENG-7:2 registry component.",
      2,
      ExecutiveDecisionFreezeRegistry[1],
    ),
    section(
      "model",
      "Model",
      "Frozen ENG-7:3 model component.",
      3,
      ExecutiveDecisionFreezeRegistry[2],
    ),
    section(
      "validation",
      "Validation",
      "Frozen ENG-7:4 validation component.",
      4,
      ExecutiveDecisionFreezeRegistry[3],
    ),
    section(
      "manifest",
      "Manifest",
      "Frozen ENG-7:5 manifest component.",
      5,
      ExecutiveDecisionFreezeRegistry[4],
    ),
    section(
      "platform",
      "Platform",
      "Frozen ENG-7:6 platform component.",
      6,
      ExecutiveDecisionFreezeRegistry[5],
    ),
    section(
      "certification",
      "Certification",
      "Frozen ENG-7:7 certification component.",
      7,
      ExecutiveDecisionFreezeRegistry[6],
    ),
    section(
      "compatibility",
      "Compatibility",
      "Frozen compatibility declarations.",
      8,
      ExecutiveDecisionFreezeCompatibility,
    ),
    section(
      "ownershipLocks",
      "Ownership Locks",
      "Locked ENG-7 ownership and non-ownership boundaries.",
      9,
      ExecutiveDecisionOwnershipLocks,
    ),
    section(
      "dependencyLocks",
      "Dependency Locks",
      "Locked incoming, outgoing, and prohibited dependencies.",
      10,
      ExecutiveDecisionDependencyLocks,
    ),
    section(
      "extensionLocks",
      "Extension Locks",
      "Controlled additive extension points.",
      11,
      ExecutiveDecisionExtensionLocks,
    ),
    section(
      "freeze",
      "Freeze",
      "Final freeze baseline, change policy, and readiness.",
      12,
      Object.freeze({
        baseline: ExecutiveDecisionFreezeBaseline,
        prohibitedChanges: ExecutiveDecisionFreezeProhibitedChanges,
        permittedChanges: ExecutiveDecisionFreezePermittedChanges,
        readiness: ExecutiveDecisionFreezeReadiness,
        finalFreezeState: "Frozen",
      } as const),
    ),
  ] as const),
  frozenComponentRegistry: ExecutiveDecisionFreezeRegistry,
  compatibilityDeclarations: ExecutiveDecisionFreezeCompatibility,
  ownershipLocks: ExecutiveDecisionOwnershipLocks,
  dependencyLocks: ExecutiveDecisionDependencyLocks,
  extensionLocks: ExecutiveDecisionExtensionLocks,
  freezeBaseline: ExecutiveDecisionFreezeBaseline,
  prohibitedChanges: ExecutiveDecisionFreezeProhibitedChanges,
  permittedChanges: ExecutiveDecisionFreezePermittedChanges,
  freezeReadiness: ExecutiveDecisionFreezeReadiness,
  finalFreezeState: "Frozen",
  sectionCount: 12,
  metadataOnly: true,
  immutable: true,
  deeplyFrozen: true,
} as const);
