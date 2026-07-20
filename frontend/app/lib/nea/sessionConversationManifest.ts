/**
 * NEA-3:5 — Session & Conversation Manifest.
 *
 * Canonical immutable architectural publication of NEA-3 through Validation.
 * Consumes only NEA-3:4 Session & Conversation Validation public surface.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by NEA-3:5.
 *
 * Public exports (exactly 8):
 *   SessionConversationManifestId
 *   SessionConversationManifestVersion
 *   SessionConversationManifestName
 *   SessionConversationManifestNamespace
 *   SessionConversationManifestStatus
 *   SessionConversationManifestReadiness
 *   SessionConversationManifestPlatform
 *   getSessionConversationManifestSummary()
 */

import {
  SessionConversationValidationId,
  SessionConversationValidationPlatform,
  SessionConversationValidationVersion,
} from "./sessionConversationValidation.ts";
import { SessionConversationManifestInventoryCatalog } from "./sessionConversationManifestInventory.ts";
import { SessionConversationManifestMetadata } from "./sessionConversationManifestMetadata.ts";
import {
  SessionConversationManifestBoundaries,
  SessionConversationManifestOwnership,
} from "./sessionConversationManifestOwnership.ts";
import {
  SessionConversationManifestReadinessDeclaration,
  SessionConversationManifestReadinessValue,
} from "./sessionConversationManifestReadiness.ts";
import { buildSessionConversationManifestSummary } from "./sessionConversationManifestSummary.ts";
import type {
  SessionConversationManifestIdentity,
  SessionConversationManifestSummary,
} from "./sessionConversationManifestTypes.ts";

/** Canonical manifest identity. */
export const SessionConversationManifestId =
  "NEA-3:5/SessionConversationManifest" as const;

/** Human-readable manifest name. */
export const SessionConversationManifestName =
  "Session & Conversation Manifest" as const;

/** Semantic version. */
export const SessionConversationManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SessionConversationManifestNamespace =
  "nexora.nea.session-conversation.manifest" as const;

/** Manifest status. */
export const SessionConversationManifestStatus = "Manifest" as const;

/** Immediate next-phase readiness. */
export const SessionConversationManifestReadiness =
  SessionConversationManifestReadinessValue;

const identity: SessionConversationManifestIdentity = Object.freeze({
  manifestId: SessionConversationManifestId,
  manifestName: SessionConversationManifestName,
  manifestVersion: SessionConversationManifestVersion,
  manifestNamespace: SessionConversationManifestNamespace,
  layer: "NEA" as const,
  phase: "NEA-3:5" as const,
  stage: "Manifest" as const,
  sourcePhase: "NEA-3:5" as const,
  owner: "NEA-3 Session & Conversation",
  status: SessionConversationManifestStatus,
  readiness: SessionConversationManifestReadiness,
  validationId: SessionConversationValidationId,
  validationVersion: SessionConversationValidationVersion,
  description:
    "Immutable architectural publication of Session & Conversation aggregating Foundation, Registry, Model, and Validation through canonical references only.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-3:5/Dependency/NEA34Validation",
  directPreviousPhaseModule: "sessionConversationValidation.ts" as const,
  validationOnly: true as const,
  validationId: SessionConversationValidationId,
  validationVersion: SessionConversationValidationVersion,
  validationPublicSurfaceOnly: true as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesUpstreamCollections: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-3:5 → NEA-3:4 ValidationPlatform → Model → Registry → Foundation",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "phaseReferences",
  "inventory",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
  "summary",
] as const);

const manifestApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-3:5/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-3:5" as const,
    section: "Manifest" as const,
    kind,
    version: SessionConversationManifestVersion,
    status: SessionConversationManifestStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "sessionConversationManifest.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SessionConversationManifestApiRegistry = Object.freeze([
  manifestApi("SessionConversationManifestId", "IdentityConstant"),
  manifestApi("SessionConversationManifestVersion", "IdentityConstant"),
  manifestApi("SessionConversationManifestName", "IdentityConstant"),
  manifestApi("SessionConversationManifestNamespace", "IdentityConstant"),
  manifestApi("SessionConversationManifestStatus", "MetadataConstant"),
  manifestApi("SessionConversationManifestReadiness", "MetadataConstant"),
  manifestApi("SessionConversationManifestPlatform", "Aggregate"),
  manifestApi("getSessionConversationManifestSummary", "Helper"),
]);

/**
 * Canonical immutable Session & Conversation Manifest platform.
 * Nine ordered sections. Metadata only.
 */
export const SessionConversationManifestPlatform = Object.freeze({
  identity,
  dependency,
  phaseReferences: SessionConversationManifestInventoryCatalog.phaseReferences,
  inventory: SessionConversationManifestInventoryCatalog,
  metadata: SessionConversationManifestMetadata,
  ownership: SessionConversationManifestOwnership,
  boundaries: SessionConversationManifestBoundaries,
  readiness: SessionConversationManifestReadinessDeclaration,
  summary: buildSessionConversationManifestSummary(),
  apiRegistry: SessionConversationManifestApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SessionConversationManifestStatus,
  nextPhase: SessionConversationManifestReadinessDeclaration.nextPhase,
  downstreamReadiness: SessionConversationManifestReadiness,
  validationPlatform: SessionConversationValidationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationExecution: false as const,
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
 * Deterministic frozen Session & Conversation Manifest summary.
 * Counts are derived exclusively from canonical inventory collections.
 */
export function getSessionConversationManifestSummary(): SessionConversationManifestSummary {
  return buildSessionConversationManifestSummary();
}
