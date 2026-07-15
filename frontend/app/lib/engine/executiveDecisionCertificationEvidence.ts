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
  ExecutiveDecisionCertificationEvidence as ExecutiveDecisionCertificationPhaseEvidenceEntry,
  ExecutiveDecisionCertificationInventory as ExecutiveDecisionCertificationInventoryDescriptor,
} from "./executiveDecisionCertificationTypes.ts";

const phaseEvidence = (
  phaseId: ExecutiveDecisionCertificationPhaseEvidenceEntry["phaseId"],
  name: string,
  publicSourceModule: string,
  fileCount: number,
  approvedPublicExportCount: number,
) => Object.freeze({
  phaseId,
  name,
  publicSourceModule,
  fileCount,
  approvedPublicExportCount,
  status: "Certified",
  metadataOnly: true,
  immutable: true,
  inspectionProhibited: true,
} as const satisfies ExecutiveDecisionCertificationPhaseEvidenceEntry);

/**
 * Immutable certification evidence for ENG-7:1 through ENG-7:6.
 * Counts are declared architectural constants, not discovered values.
 */
export const ExecutiveDecisionCertificationPhaseEvidence = Object.freeze([
  phaseEvidence("ENG-7:1", "Foundation", "executiveDecisionPublicApi.ts", 7, 6),
  phaseEvidence("ENG-7:2", "Registry", "executiveDecisionRegistryPlatform.ts", 8, 7),
  phaseEvidence("ENG-7:3", "Model", "executiveDecisionModelPlatform.ts", 9, 8),
  phaseEvidence("ENG-7:4", "Validation", "executiveDecisionValidationPlatform.ts", 8, 6),
  phaseEvidence("ENG-7:5", "Manifest", "executiveDecisionManifestPlatform.ts", 8, 7),
  phaseEvidence("ENG-7:6", "Platform", "executiveDecisionPlatform.ts", 7, 6),
] as const);

export const ExecutiveDecisionCertificationInventory = Object.freeze({
  certifiedPhases: 6,
  representedFiles: 47,
  approvedPublicExports: 40,
  foundationCapabilities: 8,
  decisionDomains: 12,
  decisionTypes: 16,
  decisionCapabilities: 8,
  decisionOutputs: 8,
  lifecycleStates: 8,
  canonicalModels: 10,
  validationCategories: 8,
  validationSeverities: 4,
  validationRules: 32,
  passingValidationRules: 32,
  failingValidationRules: 0,
  compatibilityDeclarations: 8,
  architecturalGuarantees: 12,
  platformComponents: 5,
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveDecisionCertificationInventoryDescriptor);

/**
 * Evidence aggregate referencing approved public surfaces only.
 */
export const ExecutiveDecisionCertificationEvidence = Object.freeze({
  phases: ExecutiveDecisionCertificationPhaseEvidence,
  inventory: ExecutiveDecisionCertificationInventory,
  publicSurfaceReferences: Object.freeze({
    foundation: getExecutiveDecisionFoundation(),
    registry: getExecutiveDecisionRegistryPlatform(),
    model: getExecutiveDecisionModelPlatform(),
    validation: getExecutiveDecisionValidationPlatform(),
    manifest: getExecutiveDecisionManifestPlatform(),
    platform: getExecutiveDecisionPlatform(),
  } as const),
  certifiedPhaseCount: 6,
  representedFileCount: 47,
  approvedPublicExportCount: 40,
  metadataOnly: true,
  immutable: true,
  inspectionProhibited: true,
} as const);
