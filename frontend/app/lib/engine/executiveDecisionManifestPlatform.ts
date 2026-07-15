import {
  ExecutiveDecisionCompatibilityManifest,
  ExecutiveDecisionGuaranteeManifest,
} from "./executiveDecisionCompatibilityGuaranteeManifest.ts";
import { ExecutiveDecisionDependencyOwnershipManifest } from "./executiveDecisionDependencyOwnershipManifest.ts";
import { ExecutiveDecisionInventoryManifest } from "./executiveDecisionInventoryManifest.ts";
import {
  ExecutiveDecisionPhaseManifest,
  ExecutiveDecisionPhaseManifestTotals,
} from "./executiveDecisionPhaseManifest.ts";
import { ExecutiveDecisionPublicSurfaceManifest } from "./executiveDecisionPublicSurfaceManifest.ts";
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
import type {
  ExecutiveDecisionManifestMetadata as ExecutiveDecisionManifestMetadataDescriptor,
  ExecutiveDecisionManifestSection,
  ExecutiveDecisionManifestSectionId,
  ExecutiveDecisionManifestSummary,
} from "./executiveDecisionManifestTypes.ts";

const validationSummary = getExecutiveDecisionValidationSummary();

export const ExecutiveDecisionManifestMetadata = Object.freeze({
  id: "ENG-7:5",
  name: "Executive Decision Manifest Platform",
  namespace: "Nexora.Engine.ExecutiveDecision.Manifest",
  version: "1.0.0",
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  runtimeBehavior: "None",
  owner: "ENG-7",
  previousPhase: "ENG-7:4",
  nextPhase: "ENG-7:6",
  validationStatus: "ValidationCertified",
  readiness: "ReadyForDecisionPlatform",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionManifestMetadataDescriptor);

export const ExecutiveDecisionManifestReadiness = Object.freeze({
  foundationReady: true,
  registryReady: true,
  modelReady: true,
  validationReady: true,
  ownershipProtected: true,
  dependencySafe: true,
  publicApiStable: true,
  antiDuplicationCompliant: true,
  manifestComplete: true,
  readyForPlatform: true,
  readyForCertification: false,
  readyForFreeze: false,
  readyForPublicIndex: false,
  metadataOnly: true,
  immutable: true,
} as const);

const section = (
  id: ExecutiveDecisionManifestSectionId,
  name: string,
  description: string,
  order: number,
) => Object.freeze({
  id,
  name,
  description,
  order,
  status: "Complete",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionManifestSection);

export const ExecutiveDecisionManifestSections = Object.freeze([
  section("foundation", "Foundation", "Approved ENG-7:1 foundation public surface.", 1),
  section("registry", "Registry", "Approved ENG-7:2 registry public surface.", 2),
  section("model", "Model", "Approved ENG-7:3 model public surface.", 3),
  section("validation", "Validation", "Approved ENG-7:4 validation public surface.", 4),
  section("phaseManifest", "Phase Manifest", "Completed ENG-7:1 through ENG-7:4 phase inventory.", 5),
  section("inventory", "Inventory", "Declared ENG-7 architectural inventory totals.", 6),
  section("dependencyOwnership", "Dependency Ownership", "Dependency and ownership declarations.", 7),
  section("publicSurface", "Public Surface", "Approved public phase surfaces.", 8),
  section("compatibilityGuarantees", "Compatibility Guarantees", "Compatibility declarations and architectural guarantees.", 9),
] as const);

const summary = Object.freeze({
  manifestId: "ENG-7:5",
  phase: "ENG-7:5",
  namespace: "Nexora.Engine.ExecutiveDecision.Manifest",
  owner: "ENG-7",
  sectionCount: 9,
  completedPhaseCount: 4,
  filesRepresented: 32,
  approvedPublicExports: 27,
  compatibilityCount: ExecutiveDecisionCompatibilityManifest.length,
  guaranteeCount: ExecutiveDecisionGuaranteeManifest.length,
  validationPassingRules: 32,
  validationFailingRules: 0,
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  validationStatus: "ValidationCertified",
  ownershipStatus: "OwnershipProtected",
  dependencyStatus: "DependencySafe",
  publicApiStatus: "PublicApiStable",
  antiDuplicationStatus: "AntiDuplicationCompliant",
  manifestStatus: "ManifestComplete",
  readiness: "ReadyForDecisionPlatform",
  nextPhase: "ENG-7:6",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionManifestSummary);

const compatibilityGuarantees = Object.freeze({
  compatibility: ExecutiveDecisionCompatibilityManifest,
  guarantees: ExecutiveDecisionGuaranteeManifest,
  readiness: ExecutiveDecisionManifestReadiness,
  metadata: ExecutiveDecisionManifestMetadata,
  sections: ExecutiveDecisionManifestSections,
  summary,
  phaseTotals: ExecutiveDecisionPhaseManifestTotals,
  validationState: Object.freeze({
    validationId: "ENG-7:4",
    totalRules: 32,
    passingRules: 32,
    failingRules: 0,
    status: "ValidationCertified",
    summaryStatus: validationSummary.validationStatus,
    metadataOnly: true,
    immutable: true,
  } as const),
  platformGuarantees: Object.freeze({
    status: "Stable",
    architectureMode: "MetadataOnly",
    immutability: "DeeplyFrozen",
    validationStatus: "ValidationCertified",
    ownershipStatus: "OwnershipProtected",
    dependencyStatus: "DependencySafe",
    publicApiStatus: "PublicApiStable",
    antiDuplicationStatus: "AntiDuplicationCompliant",
    manifestStatus: "ManifestComplete",
    readiness: "ReadyForDecisionPlatform",
  } as const),
  ownership: Object.freeze({
    owner: "ENG-7",
    owns: Object.freeze([
      "aggregation of approved ENG-7 architectural metadata",
      "phase inventory metadata",
      "dependency and ownership declarations",
      "public-surface declarations",
      "compatibility declarations",
      "architectural guarantees",
      "readiness declarations",
      "manifest summaries",
    ] as const),
    neverOwns: Object.freeze([
      "new foundation contracts",
      "new registries",
      "new decision models",
      "new validation rules",
      "decision behavior",
      "decision generation",
      "alternative ranking",
      "confidence or risk calculation",
      "reasoning",
      "planning",
      "orchestration",
      "execution",
      "communication",
      "visualization",
      "persistence",
    ] as const),
  } as const),
  consumedSurfaces: Object.freeze({
    foundation: "executiveDecisionPublicApi.ts",
    registry: "executiveDecisionRegistryPlatform.ts",
    model: "executiveDecisionModelPlatform.ts",
    validation: "executiveDecisionValidationPlatform.ts",
  } as const),
  metadataOnly: true,
  immutable: true,
} as const);

/**
 * Canonical ENG-7:5 Manifest Platform with exactly nine ordered sections.
 */
export const ExecutiveDecisionManifestPlatform = Object.freeze({
  foundation: getExecutiveDecisionFoundation(),
  registry: getExecutiveDecisionRegistryPlatform(),
  model: getExecutiveDecisionModelPlatform(),
  validation: getExecutiveDecisionValidationPlatform(),
  phaseManifest: ExecutiveDecisionPhaseManifest,
  inventory: ExecutiveDecisionInventoryManifest,
  dependencyOwnership: ExecutiveDecisionDependencyOwnershipManifest,
  publicSurface: ExecutiveDecisionPublicSurfaceManifest,
  compatibilityGuarantees,
} as const);

const sectionIndex = Object.freeze(
  Object.fromEntries(ExecutiveDecisionManifestSections.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, (typeof ExecutiveDecisionManifestSections)[number] | undefined>
  >,
);

export const getExecutiveDecisionManifestPlatform = () => ExecutiveDecisionManifestPlatform;
export const getExecutiveDecisionManifestMetadata = () => ExecutiveDecisionManifestMetadata;
export const getExecutiveDecisionManifestSections = () => ExecutiveDecisionManifestSections;
export const getExecutiveDecisionManifestSectionById = (
  id: string,
): (typeof ExecutiveDecisionManifestSections)[number] | undefined => sectionIndex[id];
export const getExecutiveDecisionPhaseManifest = () => ExecutiveDecisionPhaseManifest;
export const getExecutiveDecisionInventoryManifest = () => ExecutiveDecisionInventoryManifest;
export const getExecutiveDecisionDependencyManifest = () => ExecutiveDecisionDependencyOwnershipManifest.dependencies;
export const getExecutiveDecisionOwnershipManifest = () => ExecutiveDecisionDependencyOwnershipManifest.ownership;
export const getExecutiveDecisionPublicSurfaceManifest = () => ExecutiveDecisionPublicSurfaceManifest;
export const getExecutiveDecisionCompatibilityManifest = () => ExecutiveDecisionCompatibilityManifest;
export const getExecutiveDecisionGuaranteeManifest = () => ExecutiveDecisionGuaranteeManifest;
export const getExecutiveDecisionManifestSummary = () => summary;

export {
  ExecutiveDecisionCompatibilityManifest,
  ExecutiveDecisionDependencyOwnershipManifest,
  ExecutiveDecisionGuaranteeManifest,
  ExecutiveDecisionInventoryManifest,
  ExecutiveDecisionPhaseManifest,
  ExecutiveDecisionPublicSurfaceManifest,
};
