/**
 * NEA-3:8 — Session & Conversation Freeze Metadata.
 *
 * Immutable freeze metadata and summary helpers.
 * Counts and certification outcome are derived exclusively from Certification.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-3:8.
 */

import {
  SessionConversationCertificationId,
  SessionConversationCertificationPlatform,
  getSessionConversationCertificationSummary,
} from "./sessionConversationCertification.ts";
import { SessionConversationFreezeCompatibilityCatalog } from "./sessionConversationFreezeCompatibility.ts";
import { SessionConversationFreezeExtensionPolicy } from "./sessionConversationFreezeExtensions.ts";
import {
  SessionConversationFreezeAllLocksActive,
  SessionConversationFreezeLockCatalog,
} from "./sessionConversationFreezeLocks.ts";
import { SessionConversationFreezeRegistryCatalog } from "./sessionConversationFreezeRegistry.ts";
import type { SessionConversationFreezeSummary } from "./sessionConversationFreezeTypes.ts";

/** Canonical readiness value. */
export const SessionConversationFreezeReadinessValue =
  "ReadyForPublicIndex" as const;

/** Ownership surfaces owned by Freeze. */
export const SESSION_CONVERSATION_FREEZE_OWNS = Object.freeze([
  "Freeze State",
  "Freeze Metadata",
  "Compatibility Metadata",
  "Extension Metadata",
  "Certified Platform Reference",
  "Freeze Locks",
  "Freeze Summary",
] as const);

/** Surfaces Freeze does not own. */
export const SESSION_CONVERSATION_FREEZE_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
  "Manifest Inventory",
  "Platform Composition",
  "Certification Gates",
  "Runtime Sessions",
  "Runtime Conversations",
  "Message Processing",
  "Connector Execution",
  "Persistence",
  "Executive Gateway Routing",
  "DKL",
  "Executive Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
] as const);

/** Prohibited Freeze surfaces. */
export const SESSION_CONVERSATION_FREEZE_PROHIBITED_SURFACES = Object.freeze([
  "Runtime freeze logic",
  "Runtime certification",
  "Runtime validation",
  "Runtime Sessions",
  "Runtime Conversations",
  "Message Processing",
  "Connector Execution",
  "HTTP",
  "REST",
  "WebSockets",
  "Database",
  "Queue",
  "Event Bus",
  "Authentication",
  "Authorization",
  "AI",
  "LLM",
  "Executive Gateway Routing",
  "DKL invocation",
  "Executive Engine invocation",
  "Assistant invocation",
  "React",
  "Next.js",
] as const);

/** Canonical immutable freeze ownership. */
export const SessionConversationFreezeOwnership = Object.freeze({
  ownershipId: "NEA-3:8/SessionConversationFreezeOwnership",
  sourcePhase: "NEA-3:8" as const,
  owns: SESSION_CONVERSATION_FREEZE_OWNS,
  doesNotOwn: SESSION_CONVERSATION_FREEZE_DOES_NOT_OWN,
  ownsCount: SESSION_CONVERSATION_FREEZE_OWNS.length,
  doesNotOwnCount: SESSION_CONVERSATION_FREEZE_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsManifestInventory: false as const,
  ownsPlatformComposition: false as const,
  ownsCertificationGates: false as const,
  ownsRuntimeSessions: false as const,
  ownsRuntimeConversations: false as const,
  ownsMessageProcessing: false as const,
  ownsConnectorExecution: false as const,
  ownsPersistence: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable freeze boundaries. */
export const SessionConversationFreezeBoundaries = Object.freeze({
  boundariesId: "NEA-3:8/SessionConversationFreezeBoundaries",
  sourcePhase: "NEA-3:8" as const,
  consumes: Object.freeze([
    "NEA-3:7 Session & Conversation Certification",
  ] as const),
  provides: Object.freeze(["Session & Conversation Freeze"] as const),
  prohibitedSurfaces: SESSION_CONVERSATION_FREEZE_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    SESSION_CONVERSATION_FREEZE_PROHIBITED_SURFACES.length,
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
  invokesExecutiveGateway: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  invokesAssistant: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  redefinesPriorPhases: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable freeze metadata. */
export const SessionConversationFreezeMetadata = Object.freeze({
  metadataId: "NEA-3:8/SessionConversationFreezeMetadata",
  sourcePhase: "NEA-3:8" as const,
  freezeStatus: "Freeze" as const,
  freezeVersion: "1.0.0" as const,
  certifiedPlatformReference:
    SessionConversationFreezeRegistryCatalog.certifiedPlatformReference
      .referenceId,
  certificationId: SessionConversationCertificationId,
  certificationOutcome:
    SessionConversationCertificationPlatform.metadata.certificationOutcome,
  readiness: SessionConversationFreezeReadinessValue,
  nextPhase: "NEA-3:9 — Session & Conversation Public Index",
  lockSummary: Object.freeze({
    lockCount: SessionConversationFreezeLockCatalog.lockCount,
    lockedLockCount: SessionConversationFreezeLockCatalog.lockedLockCount,
    allLocksActive: SessionConversationFreezeAllLocksActive,
  }),
  compatibilitySummary: Object.freeze({
    compatibilityCount:
      SessionConversationFreezeCompatibilityCatalog.compatibilityCount,
    allCompatible: SessionConversationFreezeCompatibilityCatalog.allCompatible,
  }),
  componentCount: SessionConversationFreezeRegistryCatalog.componentCount,
  sessionIdentityCount:
    SessionConversationFreezeRegistryCatalog.sessionIdentityCount,
  conversationIdentityCount:
    SessionConversationFreezeRegistryCatalog.conversationIdentityCount,
  allowedExtensionCount:
    SessionConversationFreezeExtensionPolicy.allowedExtensionCount,
  forbiddenExtensionCount:
    SessionConversationFreezeExtensionPolicy.forbiddenExtensionCount,
  ownershipCount: SessionConversationFreezeOwnership.ownsCount,
  nonOwnershipCount: SessionConversationFreezeOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    SessionConversationFreezeBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  derivedFromCertification: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Freeze identity constants used by summary composition. */
export const SESSION_CONVERSATION_FREEZE_SUMMARY_IDENTITY = Object.freeze({
  freezeId: "NEA-3:8/SessionConversationFreeze" as const,
  name: "Session & Conversation Freeze" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.session-conversation.freeze" as const,
  publicExportCount: 8 as const,
  sectionCount: 11 as const,
});

/**
 * Build deterministic frozen Freeze summary.
 * Derived exclusively from Certification and Freeze catalogs.
 */
export function buildSessionConversationFreezeSummary(): SessionConversationFreezeSummary {
  const identity = SESSION_CONVERSATION_FREEZE_SUMMARY_IDENTITY;
  const meta = SessionConversationFreezeMetadata;
  const certificationSummary = getSessionConversationCertificationSummary();
  return Object.freeze({
    freezeId: identity.freezeId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-3:8" as const,
    status: "Freeze" as const,
    readiness: meta.readiness,
    certificationId: certificationSummary.certificationId,
    certificationOutcome: certificationSummary.certificationOutcome,
    lockCount: meta.lockSummary.lockCount,
    lockedLockCount: meta.lockSummary.lockedLockCount,
    compatibilityCount: meta.compatibilitySummary.compatibilityCount,
    componentCount: meta.componentCount,
    sessionIdentityCount: meta.sessionIdentityCount,
    conversationIdentityCount: meta.conversationIdentityCount,
    allowedExtensionCount: meta.allowedExtensionCount,
    forbiddenExtensionCount: meta.forbiddenExtensionCount,
    ownershipCount: meta.ownershipCount,
    nonOwnershipCount: meta.nonOwnershipCount,
    prohibitedSurfaceCount: meta.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
