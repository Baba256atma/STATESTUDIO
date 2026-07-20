/**
 * NEA-3:8 — Session & Conversation Freeze.
 *
 * Canonical immutable freeze surface for certified Session & Conversation.
 * Consumes only NEA-3:7 Session & Conversation Certification public surface.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by NEA-3:8.
 *
 * Public exports (exactly 8):
 *   SessionConversationFreezeId
 *   SessionConversationFreezeVersion
 *   SessionConversationFreezeName
 *   SessionConversationFreezeNamespace
 *   SessionConversationFreezeStatus
 *   SessionConversationFreezeReadiness
 *   SessionConversationFreezePlatform
 *   getSessionConversationFreezeSummary()
 */

import {
  SessionConversationCertificationId,
  SessionConversationCertificationPlatform,
  SessionConversationCertificationVersion,
} from "./sessionConversationCertification.ts";
import { SessionConversationFreezeCompatibilityCatalog } from "./sessionConversationFreezeCompatibility.ts";
import { SessionConversationFreezeExtensionPolicy } from "./sessionConversationFreezeExtensions.ts";
import { SessionConversationFreezeLockCatalog } from "./sessionConversationFreezeLocks.ts";
import {
  buildSessionConversationFreezeSummary,
  SessionConversationFreezeBoundaries,
  SessionConversationFreezeMetadata,
  SessionConversationFreezeOwnership,
  SessionConversationFreezeReadinessValue,
} from "./sessionConversationFreezeMetadata.ts";
import { SessionConversationFreezeRegistryCatalog } from "./sessionConversationFreezeRegistry.ts";
import type {
  SessionConversationFreezeIdentity,
  SessionConversationFreezeSummary,
} from "./sessionConversationFreezeTypes.ts";

/** Canonical freeze identity. */
export const SessionConversationFreezeId =
  "NEA-3:8/SessionConversationFreeze" as const;

/** Human-readable freeze name. */
export const SessionConversationFreezeName =
  "Session & Conversation Freeze" as const;

/** Semantic version. */
export const SessionConversationFreezeVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SessionConversationFreezeNamespace =
  "nexora.nea.session-conversation.freeze" as const;

/** Freeze status. */
export const SessionConversationFreezeStatus = "Freeze" as const;

/** Immediate next-phase readiness. */
export const SessionConversationFreezeReadiness =
  SessionConversationFreezeReadinessValue;

const identity: SessionConversationFreezeIdentity = Object.freeze({
  freezeId: SessionConversationFreezeId,
  freezeName: SessionConversationFreezeName,
  freezeVersion: SessionConversationFreezeVersion,
  freezeNamespace: SessionConversationFreezeNamespace,
  layer: "NEA" as const,
  phase: "NEA-3:8" as const,
  stage: "Freeze" as const,
  sourcePhase: "NEA-3:8" as const,
  owner: "NEA-3 Session & Conversation",
  status: SessionConversationFreezeStatus,
  readiness: SessionConversationFreezeReadiness,
  certificationId: SessionConversationCertificationId,
  certificationVersion: SessionConversationCertificationVersion,
  description:
    "Immutable freeze layer permanently locking the certified Session & Conversation architecture as the sole frozen baseline for Public Index consumers.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-3:8/Dependency/NEA37Certification",
  directPreviousPhaseModule: "sessionConversationCertification.ts" as const,
  certificationOnly: true as const,
  certificationId: SessionConversationCertificationId,
  certificationVersion: SessionConversationCertificationVersion,
  certificationPublicSurfaceOnly: true as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  reconstructsCertification: false as const,
  reconstructsPlatform: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-3:8 → NEA-3:7 SessionConversationCertificationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "registry",
  "locks",
  "compatibility",
  "extensions",
  "metadata",
  "ownership",
  "boundaries",
  "summary",
  "readiness",
] as const);

const freezeApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-3:8/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-3:8" as const,
    section: "Freeze" as const,
    kind,
    version: SessionConversationFreezeVersion,
    status: SessionConversationFreezeStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "sessionConversationFreeze.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SessionConversationFreezeApiRegistry = Object.freeze([
  freezeApi("SessionConversationFreezeId", "IdentityConstant"),
  freezeApi("SessionConversationFreezeVersion", "IdentityConstant"),
  freezeApi("SessionConversationFreezeName", "IdentityConstant"),
  freezeApi("SessionConversationFreezeNamespace", "IdentityConstant"),
  freezeApi("SessionConversationFreezeStatus", "MetadataConstant"),
  freezeApi("SessionConversationFreezeReadiness", "MetadataConstant"),
  freezeApi("SessionConversationFreezePlatform", "Aggregate"),
  freezeApi("getSessionConversationFreezeSummary", "Helper"),
]);

/**
 * Canonical immutable Session & Conversation Freeze platform.
 * Metadata only. Certified architecture preserved by reference.
 */
export const SessionConversationFreezePlatform = Object.freeze({
  identity,
  dependency,
  registry: SessionConversationFreezeRegistryCatalog,
  locks: SessionConversationFreezeLockCatalog,
  compatibility: SessionConversationFreezeCompatibilityCatalog,
  extensions: SessionConversationFreezeExtensionPolicy,
  metadata: SessionConversationFreezeMetadata,
  ownership: SessionConversationFreezeOwnership,
  boundaries: SessionConversationFreezeBoundaries,
  summary: buildSessionConversationFreezeSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-3:8/FreezeReadiness",
    readiness: SessionConversationFreezeReadiness,
    nextPhase: SessionConversationFreezeMetadata.nextPhase,
    allLocksActive: SessionConversationFreezeLockCatalog.allLocksActive,
    allCompatible:
      SessionConversationFreezeCompatibilityCatalog.allCompatible,
    certificationOutcome:
      SessionConversationCertificationPlatform.metadata.certificationOutcome,
    claimsReadyForPublicIndex: true as const,
    claimsPublicIndexPublished: false as const,
    claimsReadyForProduction: false as const,
    claimsRuntimeReady: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: SessionConversationFreezeApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SessionConversationFreezeStatus,
  nextPhase: SessionConversationFreezeMetadata.nextPhase,
  downstreamReadiness: SessionConversationFreezeReadiness,
  certification: SessionConversationCertificationPlatform,
  certifiedPlatformReference:
    SessionConversationFreezeRegistryCatalog.certifiedPlatformReference,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeFreezeLogic: false as const,
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
 * Deterministic frozen Session & Conversation Freeze summary.
 * Counts are derived exclusively from Certification and Freeze catalogs.
 */
export function getSessionConversationFreezeSummary(): SessionConversationFreezeSummary {
  return buildSessionConversationFreezeSummary();
}
