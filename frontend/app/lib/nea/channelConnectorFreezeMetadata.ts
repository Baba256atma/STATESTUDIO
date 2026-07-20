/**
 * NEA-2:8 — Channel Connectors Freeze Metadata.
 *
 * Immutable freeze metadata and summary helpers.
 * Counts and certification outcome are derived exclusively from Certification.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-2:8.
 */

import {
  ChannelConnectorCertificationId,
  ChannelConnectorCertificationPlatform,
  getChannelConnectorCertificationSummary,
} from "./channelConnectorCertification.ts";
import { ChannelConnectorFreezeCompatibilityCatalog } from "./channelConnectorFreezeCompatibility.ts";
import { ChannelConnectorFreezeExtensionPolicy } from "./channelConnectorFreezeExtensions.ts";
import {
  ChannelConnectorFreezeAllLocksActive,
  ChannelConnectorFreezeLockCatalog,
} from "./channelConnectorFreezeLocks.ts";
import { ChannelConnectorFreezeRegistryCatalog } from "./channelConnectorFreezeRegistry.ts";
import type { ChannelConnectorFreezeSummary } from "./channelConnectorFreezeTypes.ts";

/** Canonical readiness value. */
export const ChannelConnectorFreezeReadinessValue =
  "ReadyForPublicIndex" as const;

/** Ownership surfaces owned by Freeze. */
export const CHANNEL_CONNECTOR_FREEZE_OWNS = Object.freeze([
  "Freeze State",
  "Freeze Metadata",
  "Compatibility Metadata",
  "Extension Metadata",
  "Certified Platform Reference",
  "Freeze Locks",
  "Freeze Summary",
] as const);

/** Surfaces Freeze does not own. */
export const CHANNEL_CONNECTOR_FREEZE_DOES_NOT_OWN = Object.freeze([
  "Foundation Contracts",
  "Registry Collections",
  "Domain Models",
  "Validation Rules",
  "Manifest Inventory",
  "Platform Composition",
  "Certification Gates",
  "Runtime Connectors",
  "Network Communication",
  "Authentication Execution",
  "Executive Gateway",
  "DKL",
  "Executive Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
] as const);

/** Prohibited Freeze surfaces. */
export const CHANNEL_CONNECTOR_FREEZE_PROHIBITED_SURFACES = Object.freeze([
  "Runtime freeze logic",
  "Runtime certification",
  "Runtime validation",
  "Runtime connectors",
  "HTTP Requests",
  "REST Clients",
  "WebSocket Connections",
  "Telegram Bot",
  "WhatsApp API",
  "Slack API",
  "Microsoft Teams API",
  "Email Client",
  "Voice Engine",
  "MCP Runtime",
  "SDK Runtime",
  "OAuth Flow",
  "Token Validation",
  "Message Processing",
  "Event Processing",
  "Connector Routing",
  "Database",
  "Queue",
  "AI",
  "LLM",
  "Executive Gateway invocation",
  "DKL invocation",
  "Executive Engine invocation",
  "Assistant invocation",
  "React",
  "Next.js",
] as const);

/** Canonical immutable freeze ownership. */
export const ChannelConnectorFreezeOwnership = Object.freeze({
  ownershipId: "NEA-2:8/ChannelConnectorFreezeOwnership",
  sourcePhase: "NEA-2:8" as const,
  owns: CHANNEL_CONNECTOR_FREEZE_OWNS,
  doesNotOwn: CHANNEL_CONNECTOR_FREEZE_DOES_NOT_OWN,
  ownsCount: CHANNEL_CONNECTOR_FREEZE_OWNS.length,
  doesNotOwnCount: CHANNEL_CONNECTOR_FREEZE_DOES_NOT_OWN.length,
  ownsFoundationContracts: false as const,
  ownsRegistryCollections: false as const,
  ownsDomainModels: false as const,
  ownsValidationRules: false as const,
  ownsManifestInventory: false as const,
  ownsPlatformComposition: false as const,
  ownsCertificationGates: false as const,
  ownsRuntimeConnectors: false as const,
  ownsNetworkCommunication: false as const,
  ownsAuthenticationExecution: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable freeze boundaries. */
export const ChannelConnectorFreezeBoundaries = Object.freeze({
  boundariesId: "NEA-2:8/ChannelConnectorFreezeBoundaries",
  sourcePhase: "NEA-2:8" as const,
  consumes: Object.freeze([
    "NEA-2:7 Channel Connectors Certification",
  ] as const),
  provides: Object.freeze(["Channel Connectors Freeze"] as const),
  prohibitedSurfaces: CHANNEL_CONNECTOR_FREEZE_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    CHANNEL_CONNECTOR_FREEZE_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  runtimeFreezeLogic: false as const,
  runtimeCertification: false as const,
  runtimeValidation: false as const,
  implementsConnectors: false as const,
  networkingBehavior: false as const,
  oauthFlow: false as const,
  messageProcessing: false as const,
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
export const ChannelConnectorFreezeMetadata = Object.freeze({
  metadataId: "NEA-2:8/ChannelConnectorFreezeMetadata",
  sourcePhase: "NEA-2:8" as const,
  freezeStatus: "Freeze" as const,
  freezeVersion: "1.0.0" as const,
  certifiedPlatformReference:
    ChannelConnectorFreezeRegistryCatalog.certifiedPlatformReference
      .referenceId,
  certificationId: ChannelConnectorCertificationId,
  certificationOutcome:
    ChannelConnectorCertificationPlatform.metadata.certificationOutcome,
  readiness: ChannelConnectorFreezeReadinessValue,
  nextPhase: "NEA-2:9 — Channel Connectors Public Index",
  lockSummary: Object.freeze({
    lockCount: ChannelConnectorFreezeLockCatalog.lockCount,
    lockedLockCount: ChannelConnectorFreezeLockCatalog.lockedLockCount,
    allLocksActive: ChannelConnectorFreezeAllLocksActive,
  }),
  compatibilitySummary: Object.freeze({
    compatibilityCount:
      ChannelConnectorFreezeCompatibilityCatalog.compatibilityCount,
    allCompatible: ChannelConnectorFreezeCompatibilityCatalog.allCompatible,
  }),
  componentCount: ChannelConnectorFreezeRegistryCatalog.componentCount,
  connectorIdentityCount:
    ChannelConnectorFreezeRegistryCatalog.connectorIdentityCount,
  allowedExtensionCount:
    ChannelConnectorFreezeExtensionPolicy.allowedExtensionCount,
  forbiddenExtensionCount:
    ChannelConnectorFreezeExtensionPolicy.forbiddenExtensionCount,
  ownershipCount: ChannelConnectorFreezeOwnership.ownsCount,
  nonOwnershipCount: ChannelConnectorFreezeOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ChannelConnectorFreezeBoundaries.prohibitedSurfaceCount,
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
export const CHANNEL_CONNECTOR_FREEZE_SUMMARY_IDENTITY = Object.freeze({
  freezeId: "NEA-2:8/ChannelConnectorFreeze" as const,
  name: "Channel Connectors Freeze" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.channel-connectors.freeze" as const,
  publicExportCount: 8 as const,
  sectionCount: 11 as const,
});

/**
 * Build deterministic frozen Freeze summary.
 * Derived exclusively from Certification and Freeze catalogs.
 */
export function buildChannelConnectorFreezeSummary(): ChannelConnectorFreezeSummary {
  const identity = CHANNEL_CONNECTOR_FREEZE_SUMMARY_IDENTITY;
  const meta = ChannelConnectorFreezeMetadata;
  const certificationSummary = getChannelConnectorCertificationSummary();
  return Object.freeze({
    freezeId: identity.freezeId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-2:8" as const,
    status: "Freeze" as const,
    readiness: meta.readiness,
    certificationId: certificationSummary.certificationId,
    certificationOutcome: certificationSummary.certificationOutcome,
    lockCount: meta.lockSummary.lockCount,
    lockedLockCount: meta.lockSummary.lockedLockCount,
    compatibilityCount: meta.compatibilitySummary.compatibilityCount,
    componentCount: meta.componentCount,
    connectorIdentityCount: meta.connectorIdentityCount,
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
