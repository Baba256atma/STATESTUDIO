/**
 * NEA-6:7 — Message Normalization Certification.
 *
 * Canonical immutable certification surface for the Message Normalization Platform.
 * Consumes only NEA-6:6 Message Normalization Platform public surface.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by NEA-6:7.
 *
 * Public exports (exactly 8):
 *   MessageNormalizationCertificationId
 *   MessageNormalizationCertificationVersion
 *   MessageNormalizationCertificationName
 *   MessageNormalizationCertificationNamespace
 *   MessageNormalizationCertificationStatus
 *   MessageNormalizationCertificationReadiness
 *   MessageNormalizationCertificationPlatform
 *   getMessageNormalizationCertificationSummary()
 */

import {
  MessageNormalizationPlatform,
  MessageNormalizationPlatformId,
  MessageNormalizationPlatformVersion,
} from "./messageNormalizationPlatform.ts";
import { MessageNormalizationCertificationComplianceCatalog } from "./messageNormalizationCertificationCompliance.ts";
import { MessageNormalizationCertificationGateCatalog } from "./messageNormalizationCertificationGates.ts";
import {
  MessageNormalizationCertificationMetadata,
  MessageNormalizationCertificationReadinessValue,
} from "./messageNormalizationCertificationMetadata.ts";
import {
  MessageNormalizationCertificationBoundaries,
  MessageNormalizationCertificationOwnership,
} from "./messageNormalizationCertificationOwnership.ts";
import { buildMessageNormalizationCertificationSummary } from "./messageNormalizationCertificationSummary.ts";
import type {
  MessageNormalizationCertificationIdentity,
  MessageNormalizationCertificationSummary,
} from "./messageNormalizationCertificationTypes.ts";

/** Canonical certification identity. */
export const MessageNormalizationCertificationId =
  "NEA-6:7/MessageNormalizationCertification" as const;

/** Human-readable certification name. */
export const MessageNormalizationCertificationName =
  "Message Normalization Certification" as const;

/** Semantic version. */
export const MessageNormalizationCertificationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const MessageNormalizationCertificationNamespace =
  "nexora.nea.message-normalization.certification" as const;

/** Certification status. */
export const MessageNormalizationCertificationStatus = "Certification" as const;

/** Immediate next-phase readiness. */
export const MessageNormalizationCertificationReadiness =
  MessageNormalizationCertificationReadinessValue;

const identity: MessageNormalizationCertificationIdentity = Object.freeze({
  certificationId: MessageNormalizationCertificationId,
  certificationName: MessageNormalizationCertificationName,
  certificationVersion: MessageNormalizationCertificationVersion,
  certificationNamespace: MessageNormalizationCertificationNamespace,
  layer: "NEA" as const,
  phase: "NEA-6:7" as const,
  stage: "Certification" as const,
  sourcePhase: "NEA-6:7" as const,
  owner: "NEA-6 Message Normalization",
  status: MessageNormalizationCertificationStatus,
  readiness: MessageNormalizationCertificationReadiness,
  platformId: MessageNormalizationPlatformId,
  platformVersion: MessageNormalizationPlatformVersion,
  description:
    "Immutable certification architecture declaring Message Normalization Platform compliance across Foundation through Platform.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-6:7/Dependency/NEA66Platform",
  directPreviousPhaseModule: "messageNormalizationPlatform.ts" as const,
  platformOnly: true as const,
  platformId: MessageNormalizationPlatformId,
  platformVersion: MessageNormalizationPlatformVersion,
  platformPublicSurfaceOnly: true as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesPlatformArchitecture: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-6:7 → NEA-6:6 MessageNormalizationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "gates",
  "compliance",
  "metadata",
  "ownership",
  "boundaries",
  "summary",
  "readiness",
] as const);

const certificationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-6:7/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-6:7" as const,
    section: "Certification" as const,
    kind,
    version: MessageNormalizationCertificationVersion,
    status: MessageNormalizationCertificationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "messageNormalizationCertification.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const MessageNormalizationCertificationApiRegistry = Object.freeze([
  certificationApi("MessageNormalizationCertificationId", "IdentityConstant"),
  certificationApi(
    "MessageNormalizationCertificationVersion",
    "IdentityConstant",
  ),
  certificationApi("MessageNormalizationCertificationName", "IdentityConstant"),
  certificationApi(
    "MessageNormalizationCertificationNamespace",
    "IdentityConstant",
  ),
  certificationApi(
    "MessageNormalizationCertificationStatus",
    "MetadataConstant",
  ),
  certificationApi(
    "MessageNormalizationCertificationReadiness",
    "MetadataConstant",
  ),
  certificationApi("MessageNormalizationCertificationPlatform", "Aggregate"),
  certificationApi("getMessageNormalizationCertificationSummary", "Helper"),
]);

/**
 * Canonical immutable Message Normalization Certification platform.
 * Nine ordered sections. Metadata only.
 */
export const MessageNormalizationCertificationPlatform = Object.freeze({
  identity,
  dependency,
  gates: MessageNormalizationCertificationGateCatalog,
  compliance: MessageNormalizationCertificationComplianceCatalog,
  metadata: MessageNormalizationCertificationMetadata,
  ownership: MessageNormalizationCertificationOwnership,
  boundaries: MessageNormalizationCertificationBoundaries,
  summary: buildMessageNormalizationCertificationSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-6:7/CertificationReadiness",
    readiness: MessageNormalizationCertificationReadiness,
    nextPhase: MessageNormalizationCertificationMetadata.nextPhase,
    certificationOutcome:
      MessageNormalizationCertificationMetadata.certificationOutcome,
    claimsReadyForPublicIndex: false as const,
    claimsReadyForProduction: false as const,
    claimsRuntimeReady: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: MessageNormalizationCertificationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: MessageNormalizationCertificationStatus,
  nextPhase: MessageNormalizationCertificationMetadata.nextPhase,
  downstreamReadiness: MessageNormalizationCertificationReadiness,
  platform: MessageNormalizationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeCertification: false as const,
  runtimeNormalization: false as const,
  runtimeValidation: false as const,
  implementsMessageParsing: false as const,
  implementsRouting: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Message Normalization Certification summary.
 * Counts are derived exclusively from canonical certification collections.
 */
export function getMessageNormalizationCertificationSummary(): MessageNormalizationCertificationSummary {
  return buildMessageNormalizationCertificationSummary();
}
