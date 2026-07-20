/**
 * NEA-3:6 — Session & Conversation Platform.
 *
 * Canonical immutable composition surface for the complete Session & Conversation architecture.
 * Consumes only NEA-3:5 Session & Conversation Manifest public surface.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by NEA-3:6.
 *
 * Public exports (exactly 8):
 *   SessionConversationPlatformId
 *   SessionConversationPlatformVersion
 *   SessionConversationPlatformName
 *   SessionConversationPlatformNamespace
 *   SessionConversationPlatformStatus
 *   SessionConversationPlatformReadiness
 *   SessionConversationPlatform
 *   getSessionConversationPlatformSummary()
 */

import {
  SessionConversationManifestId,
  SessionConversationManifestPlatform,
  SessionConversationManifestVersion,
} from "./sessionConversationManifest.ts";
import { SessionConversationPlatformMetadata } from "./sessionConversationPlatformMetadata.ts";
import { SessionConversationPlatformNamespaceObject } from "./sessionConversationPlatformNamespace.ts";
import {
  SessionConversationPlatformBoundaries,
  SessionConversationPlatformOwnership,
} from "./sessionConversationPlatformOwnership.ts";
import {
  SessionConversationPlatformReadinessDeclaration,
  SessionConversationPlatformReadinessValue,
} from "./sessionConversationPlatformReadiness.ts";
import { buildSessionConversationPlatformSummary } from "./sessionConversationPlatformSummary.ts";
import type {
  SessionConversationPlatformIdentity,
  SessionConversationPlatformSummary,
} from "./sessionConversationPlatformTypes.ts";

/** Canonical platform identity. */
export const SessionConversationPlatformId =
  "NEA-3:6/SessionConversationPlatform" as const;

/** Human-readable platform name. */
export const SessionConversationPlatformName =
  "Session & Conversation Platform" as const;

/** Semantic version. */
export const SessionConversationPlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SessionConversationPlatformNamespace =
  "nexora.nea.session-conversation.platform" as const;

/** Platform status. */
export const SessionConversationPlatformStatus = "Platform" as const;

/** Immediate next-phase readiness. */
export const SessionConversationPlatformReadiness =
  SessionConversationPlatformReadinessValue;

const identity: SessionConversationPlatformIdentity = Object.freeze({
  platformId: SessionConversationPlatformId,
  platformName: SessionConversationPlatformName,
  platformVersion: SessionConversationPlatformVersion,
  platformNamespace: SessionConversationPlatformNamespace,
  layer: "NEA" as const,
  phase: "NEA-3:6" as const,
  stage: "Platform" as const,
  sourcePhase: "NEA-3:6" as const,
  owner: "NEA-3 Session & Conversation",
  status: SessionConversationPlatformStatus,
  readiness: SessionConversationPlatformReadiness,
  manifestId: SessionConversationManifestId,
  manifestVersion: SessionConversationManifestVersion,
  description:
    "Immutable canonical composition surface aggregating Foundation, Registry, Model, Validation, and Manifest exclusively through canonical references.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-3:6/Dependency/NEA35Manifest",
  directPreviousPhaseModule: "sessionConversationManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: SessionConversationManifestId,
  manifestVersion: SessionConversationManifestVersion,
  manifestPublicSurfaceOnly: true as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-3:6 → NEA-3:5 ManifestPlatform → Validation → Model → Registry → Foundation",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "namespace",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
  "summary",
  "consumer",
] as const);

const platformApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-3:6/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-3:6" as const,
    section: "Platform" as const,
    kind,
    version: SessionConversationPlatformVersion,
    status: SessionConversationPlatformStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "sessionConversationPlatform.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SessionConversationPlatformApiRegistry = Object.freeze([
  platformApi("SessionConversationPlatformId", "IdentityConstant"),
  platformApi("SessionConversationPlatformVersion", "IdentityConstant"),
  platformApi("SessionConversationPlatformName", "IdentityConstant"),
  platformApi("SessionConversationPlatformNamespace", "IdentityConstant"),
  platformApi("SessionConversationPlatformStatus", "MetadataConstant"),
  platformApi("SessionConversationPlatformReadiness", "MetadataConstant"),
  platformApi("SessionConversationPlatform", "Aggregate"),
  platformApi("getSessionConversationPlatformSummary", "Helper"),
]);

const summarySnapshot = buildSessionConversationPlatformSummary();

/**
 * Canonical immutable Session & Conversation Platform.
 * Consumer surface for the complete NEA-3 architecture.
 * Nine ordered sections. Metadata only.
 */
export const SessionConversationPlatform = Object.freeze({
  identity,
  dependency,
  namespace: SessionConversationPlatformNamespaceObject,
  metadata: SessionConversationPlatformMetadata,
  ownership: SessionConversationPlatformOwnership,
  boundaries: SessionConversationPlatformBoundaries,
  readiness: SessionConversationPlatformReadinessDeclaration,
  summary: summarySnapshot,
  consumer: Object.freeze({
    consumerSurfaceId: "NEA-3:6/ConsumerPlatformSurface",
    soleSupportedEntryPoint: "sessionConversationPlatform.ts" as const,
    accessRule:
      "Consumers shall access NEA-3 through SessionConversationPlatform only.",
    composedSections: SessionConversationPlatformNamespaceObject.sectionOrder,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: SessionConversationPlatformApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SessionConversationPlatformStatus,
  nextPhase: SessionConversationPlatformReadinessDeclaration.nextPhase,
  downstreamReadiness: SessionConversationPlatformReadiness,
  manifestPlatform: SessionConversationManifestPlatform,
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
 * Deterministic frozen Session & Conversation Platform summary.
 * Counts are derived exclusively from canonical upstream collections.
 */
export function getSessionConversationPlatformSummary(): SessionConversationPlatformSummary {
  return buildSessionConversationPlatformSummary();
}
