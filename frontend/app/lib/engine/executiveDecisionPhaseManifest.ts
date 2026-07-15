import type { ExecutiveDecisionManifestPhaseEntry } from "./executiveDecisionManifestTypes.ts";

const phase = (
  phaseId: ExecutiveDecisionManifestPhaseEntry["phaseId"],
  name: string,
  namespace: string,
  responsibility: string,
  publicSourceModule: string,
  fileCount: number,
  approvedPublicExportCount: number,
  artifactCount: number,
  validationStatus: ExecutiveDecisionManifestPhaseEntry["validationStatus"],
  readinessContribution: string,
) => Object.freeze({
  phaseId,
  name,
  namespace,
  version: "1.0.0",
  responsibility,
  publicSourceModule,
  fileCount,
  approvedPublicExportCount,
  artifactCount,
  architecturalStatus: "Complete",
  metadataOnly: true,
  immutable: true,
  dependencyMode: "PublicIndexOnly",
  validationStatus,
  readinessContribution,
} as const satisfies ExecutiveDecisionManifestPhaseEntry);

/**
 * Canonical phase manifest for ENG-7:1 through ENG-7:4.
 * Counts are declared metadata — not derived from filesystem inspection.
 */
export const ExecutiveDecisionPhaseManifest = Object.freeze([
  phase(
    "ENG-7:1",
    "Executive Decision Foundation",
    "nexora.engine.executive.decision.foundation",
    "Defines decision foundation contracts, capabilities, ownership, and dependencies.",
    "executiveDecisionPublicApi.ts",
    7,
    6,
    6,
    "PASS",
    "FoundationComplete",
  ),
  phase(
    "ENG-7:2",
    "Executive Decision Registry Platform",
    "Nexora.Engine.ExecutiveDecision.Registry",
    "Registers domains, types, capabilities, outputs, lifecycle, ownership, and dependencies.",
    "executiveDecisionRegistryPlatform.ts",
    8,
    7,
    7,
    "PASS",
    "RegistryComplete",
  ),
  phase(
    "ENG-7:3",
    "Executive Decision Model Platform",
    "Nexora.Engine.ExecutiveDecision.Model",
    "Defines canonical decision, alternative, confidence, risk, trade-off, impact, trace, and publication models.",
    "executiveDecisionModelPlatform.ts",
    9,
    8,
    10,
    "PASS",
    "ModelComplete",
  ),
  phase(
    "ENG-7:4",
    "Executive Decision Validation Platform",
    "Nexora.Engine.ExecutiveDecision.Validation",
    "Validates ENG-7:1 through ENG-7:3 architectural integrity as metadata only.",
    "executiveDecisionValidationPlatform.ts",
    8,
    6,
    32,
    "ValidationCertified",
    "ValidationCertified",
  ),
] as const);

export const ExecutiveDecisionPhaseManifestTotals = Object.freeze({
  completedPhaseCount: 4,
  totalFilesRepresented: 32,
  totalApprovedPublicExports: 27,
  architectureChain: Object.freeze([
    "ENG-7:1 Foundation",
    "ENG-7:2 Registry",
    "ENG-7:3 Model",
    "ENG-7:4 Validation",
    "ENG-7:5 Manifest",
    "ENG-7:6 Platform",
  ] as const),
  metadataOnly: true,
  immutable: true,
} as const);
