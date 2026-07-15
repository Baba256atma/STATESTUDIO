import { ExecutiveDecisionPlatformComponentTotals } from "./executiveDecisionPlatformComponentRegistry.ts";
import type { ExecutiveDecisionPlatformMetadata as ExecutiveDecisionPlatformMetadataDescriptor } from "./executiveDecisionPlatformTypes.ts";

/**
 * Canonical ENG-7:6 platform metadata.
 * Inventory values are declared architectural constants.
 */
export const ExecutiveDecisionPlatformMetadata = Object.freeze({
  id: "ENG-7:6",
  name: "Executive Decision Platform",
  namespace: "Nexora.Engine.ExecutiveDecision.Platform",
  version: "1.0.0",
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  runtimeBehavior: "None",
  owner: "ENG-7",
  previousPhase: "ENG-7:5",
  nextPhase: "ENG-7:7",
  validationStatus: "ValidationCertified",
  manifestStatus: "ManifestComplete",
  readiness: "ReadyForDecisionCertification",
  description:
    "Canonical immutable metadata-only platform aggregation for the Executive Decision Engine across ENG-7:1 through ENG-7:5.",
  architecturalPurpose:
    "Assemble approved decision-engine public surfaces into one stable platform namespace for certification preparation.",
  completedPhaseReferences: Object.freeze([
    "ENG-7:1",
    "ENG-7:2",
    "ENG-7:3",
    "ENG-7:4",
    "ENG-7:5",
  ] as const),
  componentCount: 5,
  representedArtifactCount: ExecutiveDecisionPlatformComponentTotals.representedFiles,
  approvedPublicExportCount: ExecutiveDecisionPlatformComponentTotals.approvedPublicExports,
  canonicalModelCount: 10,
  validationRuleCount: 32,
  passingValidationRuleCount: 32,
  compatibilityCount: 8,
  guaranteeCount: 12,
  supportedConsumers: Object.freeze([
    "ENG-7:7 Certification",
    "ENG-7:8 Freeze",
    "ENG-7:9 Public Index",
    "ENG-8 Executive Orchestration",
    "Advisor",
  ] as const),
  prohibitedConsumers: Object.freeze([
    "BUS internals",
    "OPS internals",
    "Director runtime",
    "Scene runtime",
    "EVE runtime",
    "UI modules",
    "persistence services",
    "database clients",
  ] as const),
  platformBoundaries: Object.freeze({
    publicApiOnly: true,
    forwardOnly: true,
    noRuntimeIntegration: true,
  } as const),
  publicApiPolicy: "ApprovedPhaseSurfacesOnly",
  replacementPolicy: "VersionedAdditiveOnly",
  versioningPolicy: "SemanticStable",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionPlatformMetadataDescriptor & {
  readonly description: string;
  readonly architecturalPurpose: string;
  readonly completedPhaseReferences: readonly string[];
  readonly componentCount: 5;
  readonly representedArtifactCount: number;
  readonly approvedPublicExportCount: number;
  readonly canonicalModelCount: 10;
  readonly validationRuleCount: 32;
  readonly passingValidationRuleCount: 32;
  readonly compatibilityCount: 8;
  readonly guaranteeCount: 12;
  readonly supportedConsumers: readonly string[];
  readonly prohibitedConsumers: readonly string[];
  readonly platformBoundaries: Readonly<{
    publicApiOnly: true;
    forwardOnly: true;
    noRuntimeIntegration: true;
  }>;
  readonly publicApiPolicy: string;
  readonly replacementPolicy: string;
  readonly versioningPolicy: string;
});
