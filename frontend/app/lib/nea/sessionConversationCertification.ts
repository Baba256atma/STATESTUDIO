/**
 * NEA-3:7 — Session & Conversation Certification.
 *
 * Canonical immutable certification surface for the Session & Conversation Platform.
 * Consumes only NEA-3:6 Session & Conversation Platform public surface.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by NEA-3:7.
 *
 * Public exports (exactly 8):
 *   SessionConversationCertificationId
 *   SessionConversationCertificationVersion
 *   SessionConversationCertificationName
 *   SessionConversationCertificationNamespace
 *   SessionConversationCertificationStatus
 *   SessionConversationCertificationReadiness
 *   SessionConversationCertificationPlatform
 *   getSessionConversationCertificationSummary()
 */

import {
  SessionConversationPlatform,
  SessionConversationPlatformId,
  SessionConversationPlatformVersion,
} from "./sessionConversationPlatform.ts";
import { SessionConversationCertificationComplianceCatalog } from "./sessionConversationCertificationCompliance.ts";
import { SessionConversationCertificationGateCatalog } from "./sessionConversationCertificationGates.ts";
import {
  SessionConversationCertificationMetadata,
  SessionConversationCertificationReadinessValue,
} from "./sessionConversationCertificationMetadata.ts";
import {
  SessionConversationCertificationBoundaries,
  SessionConversationCertificationOwnership,
} from "./sessionConversationCertificationOwnership.ts";
import { buildSessionConversationCertificationSummary } from "./sessionConversationCertificationSummary.ts";
import type {
  SessionConversationCertificationIdentity,
  SessionConversationCertificationSummary,
} from "./sessionConversationCertificationTypes.ts";

/** Canonical certification identity. */
export const SessionConversationCertificationId =
  "NEA-3:7/SessionConversationCertification" as const;

/** Human-readable certification name. */
export const SessionConversationCertificationName =
  "Session & Conversation Certification" as const;

/** Semantic version. */
export const SessionConversationCertificationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SessionConversationCertificationNamespace =
  "nexora.nea.session-conversation.certification" as const;

/** Certification status. */
export const SessionConversationCertificationStatus = "Certification" as const;

/** Immediate next-phase readiness. */
export const SessionConversationCertificationReadiness =
  SessionConversationCertificationReadinessValue;

const identity: SessionConversationCertificationIdentity = Object.freeze({
  certificationId: SessionConversationCertificationId,
  certificationName: SessionConversationCertificationName,
  certificationVersion: SessionConversationCertificationVersion,
  certificationNamespace: SessionConversationCertificationNamespace,
  layer: "NEA" as const,
  phase: "NEA-3:7" as const,
  stage: "Certification" as const,
  sourcePhase: "NEA-3:7" as const,
  owner: "NEA-3 Session & Conversation",
  status: SessionConversationCertificationStatus,
  readiness: SessionConversationCertificationReadiness,
  platformId: SessionConversationPlatformId,
  platformVersion: SessionConversationPlatformVersion,
  description:
    "Immutable certification architecture declaring Session & Conversation Platform compliance across Foundation through Platform.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-3:7/Dependency/NEA36Platform",
  directPreviousPhaseModule: "sessionConversationPlatform.ts" as const,
  platformOnly: true as const,
  platformId: SessionConversationPlatformId,
  platformVersion: SessionConversationPlatformVersion,
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
    "NEA-3:7 → NEA-3:6 SessionConversationPlatform (exclusive)",
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
    id: `NEA-3:7/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-3:7" as const,
    section: "Certification" as const,
    kind,
    version: SessionConversationCertificationVersion,
    status: SessionConversationCertificationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "sessionConversationCertification.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SessionConversationCertificationApiRegistry = Object.freeze([
  certificationApi("SessionConversationCertificationId", "IdentityConstant"),
  certificationApi(
    "SessionConversationCertificationVersion",
    "IdentityConstant",
  ),
  certificationApi("SessionConversationCertificationName", "IdentityConstant"),
  certificationApi(
    "SessionConversationCertificationNamespace",
    "IdentityConstant",
  ),
  certificationApi(
    "SessionConversationCertificationStatus",
    "MetadataConstant",
  ),
  certificationApi(
    "SessionConversationCertificationReadiness",
    "MetadataConstant",
  ),
  certificationApi("SessionConversationCertificationPlatform", "Aggregate"),
  certificationApi("getSessionConversationCertificationSummary", "Helper"),
]);

/**
 * Canonical immutable Session & Conversation Certification platform.
 * Nine ordered sections. Metadata only.
 */
export const SessionConversationCertificationPlatform = Object.freeze({
  identity,
  dependency,
  gates: SessionConversationCertificationGateCatalog,
  compliance: SessionConversationCertificationComplianceCatalog,
  metadata: SessionConversationCertificationMetadata,
  ownership: SessionConversationCertificationOwnership,
  boundaries: SessionConversationCertificationBoundaries,
  summary: buildSessionConversationCertificationSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-3:7/CertificationReadiness",
    readiness: SessionConversationCertificationReadiness,
    nextPhase: SessionConversationCertificationMetadata.nextPhase,
    certificationOutcome:
      SessionConversationCertificationMetadata.certificationOutcome,
    claimsReadyForPublicIndex: false as const,
    claimsReadyForProduction: false as const,
    claimsRuntimeReady: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: SessionConversationCertificationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SessionConversationCertificationStatus,
  nextPhase: SessionConversationCertificationMetadata.nextPhase,
  downstreamReadiness: SessionConversationCertificationReadiness,
  platform: SessionConversationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeCertification: false as const,
  runtimeValidation: false as const,
  managesRuntimeSessions: false as const,
  managesRuntimeConversations: false as const,
  processesMessages: false as const,
  executesConnectors: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Session & Conversation Certification summary.
 * Counts are derived exclusively from canonical certification collections.
 */
export function getSessionConversationCertificationSummary(): SessionConversationCertificationSummary {
  return buildSessionConversationCertificationSummary();
}
