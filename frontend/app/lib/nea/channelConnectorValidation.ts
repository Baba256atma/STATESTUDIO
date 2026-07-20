/**
 * NEA-2:4 — Channel Connectors Validation.
 *
 * Canonical immutable declarative validation architecture for Channel Connectors.
 * Consumes only NEA-2:3 Channel Connectors Model public surface.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by NEA-2:4.
 *
 * Public exports (exactly 8):
 *   ChannelConnectorValidationId
 *   ChannelConnectorValidationVersion
 *   ChannelConnectorValidationName
 *   ChannelConnectorValidationNamespace
 *   ChannelConnectorValidationStatus
 *   ChannelConnectorValidationReadiness
 *   ChannelConnectorValidationPlatform
 *   getChannelConnectorValidationSummary()
 */

import {
  ChannelConnectorModelId,
  ChannelConnectorModelPlatform,
  ChannelConnectorModelVersion,
} from "./channelConnectorModel.ts";
import { ChannelConnectorValidationMetadata } from "./channelConnectorValidationMetadata.ts";
import {
  ChannelConnectorValidationBoundaries,
  ChannelConnectorValidationOwnership,
} from "./channelConnectorValidationOwnership.ts";
import { ChannelConnectorValidationPolicyCatalog } from "./channelConnectorValidationPolicies.ts";
import { ChannelConnectorValidationRelationshipCatalog } from "./channelConnectorValidationRelationships.ts";
import { ChannelConnectorValidationRuleCatalog } from "./channelConnectorValidationRules.ts";
import type {
  ChannelConnectorValidationIdentity,
  ChannelConnectorValidationSummary,
} from "./channelConnectorValidationTypes.ts";

/** Canonical validation identity. */
export const ChannelConnectorValidationId =
  "NEA-2:4/ChannelConnectorValidation" as const;

/** Human-readable validation name. */
export const ChannelConnectorValidationName =
  "Channel Connectors Validation" as const;

/** Semantic version. */
export const ChannelConnectorValidationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ChannelConnectorValidationNamespace =
  "nexora.nea.channel-connectors.validation" as const;

/** Validation status. */
export const ChannelConnectorValidationStatus = "Validation" as const;

/** Immediate next-phase readiness. */
export const ChannelConnectorValidationReadiness =
  "ReadyForManifest" as const;

const identity: ChannelConnectorValidationIdentity = Object.freeze({
  validationId: ChannelConnectorValidationId,
  validationName: ChannelConnectorValidationName,
  validationVersion: ChannelConnectorValidationVersion,
  validationNamespace: ChannelConnectorValidationNamespace,
  layer: "NEA" as const,
  phase: "NEA-2:4" as const,
  stage: "Validation" as const,
  sourcePhase: "NEA-2:4" as const,
  owner: "NEA-2 Channel Connectors",
  status: ChannelConnectorValidationStatus,
  readiness: ChannelConnectorValidationReadiness,
  modelId: ChannelConnectorModelId,
  modelVersion: ChannelConnectorModelVersion,
  description:
    "Immutable declarative validation architecture for Channel Connector domain models. Metadata only; no validation engine.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-2:4/Dependency/NEA23Model",
  directPreviousPhaseModule: "channelConnectorModel.ts" as const,
  modelOnly: true as const,
  modelId: ChannelConnectorModelId,
  modelVersion: ChannelConnectorModelVersion,
  modelPublicSurfaceOnly: true as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  publicIndexDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsModel: false as const,
  duplicatesModelValues: false as const,
  canonicalPath:
    "NEA-2:4 → NEA-2:3 ChannelConnectorModelPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "categories",
  "rules",
  "relationships",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const validationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-2:4/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-2:4" as const,
    section: "Validation" as const,
    kind,
    version: ChannelConnectorValidationVersion,
    status: ChannelConnectorValidationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "channelConnectorValidation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ChannelConnectorValidationApiRegistry = Object.freeze([
  validationApi("ChannelConnectorValidationId", "IdentityConstant"),
  validationApi("ChannelConnectorValidationVersion", "IdentityConstant"),
  validationApi("ChannelConnectorValidationName", "IdentityConstant"),
  validationApi("ChannelConnectorValidationNamespace", "IdentityConstant"),
  validationApi("ChannelConnectorValidationStatus", "MetadataConstant"),
  validationApi("ChannelConnectorValidationReadiness", "MetadataConstant"),
  validationApi("ChannelConnectorValidationPlatform", "Aggregate"),
  validationApi("getChannelConnectorValidationSummary", "Helper"),
]);

/**
 * Canonical immutable Channel Connectors Validation platform.
 * Ten ordered sections. Metadata only.
 */
export const ChannelConnectorValidationPlatform = Object.freeze({
  identity,
  dependency,
  categories: ChannelConnectorValidationRuleCatalog.categories,
  rules: ChannelConnectorValidationRuleCatalog,
  relationships: ChannelConnectorValidationRelationshipCatalog,
  policies: ChannelConnectorValidationPolicyCatalog,
  metadata: ChannelConnectorValidationMetadata,
  ownership: ChannelConnectorValidationOwnership,
  boundaries: ChannelConnectorValidationBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-2:4/ValidationReadiness",
    readiness: ChannelConnectorValidationReadiness,
    nextPhase: ChannelConnectorValidationMetadata.nextPhase,
    claimsReadyForManifest: true as const,
    claimsReadyForRuntime: false as const,
    claimsValidationEngine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: ChannelConnectorValidationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ChannelConnectorValidationStatus,
  nextPhase: ChannelConnectorValidationMetadata.nextPhase,
  downstreamReadiness: ChannelConnectorValidationReadiness,
  modelPlatform: ChannelConnectorModelPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationEngine: false as const,
  runtimeValidation: false as const,
  implementsConnectors: false as const,
  networkingBehavior: false as const,
  oauthFlow: false as const,
  messageProcessing: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Channel Connectors Validation summary.
 * Counts are derived exclusively from canonical validation collections.
 */
export function getChannelConnectorValidationSummary(): ChannelConnectorValidationSummary {
  const meta = ChannelConnectorValidationMetadata;
  return Object.freeze({
    validationId: ChannelConnectorValidationId,
    version: ChannelConnectorValidationVersion,
    name: ChannelConnectorValidationName,
    namespace: ChannelConnectorValidationNamespace,
    layer: "NEA" as const,
    phase: "NEA-2:4" as const,
    status: ChannelConnectorValidationStatus,
    readiness: ChannelConnectorValidationReadiness,
    modelId: ChannelConnectorModelId,
    categoryCount: meta.categoryCount,
    ruleCount: meta.ruleCount,
    relationshipCount: meta.relationshipCount,
    policyCount: meta.policyCount,
    ownershipCount: meta.ownershipCount,
    nonOwnershipCount: meta.nonOwnershipCount,
    prohibitedSurfaceCount: meta.prohibitedSurfaceCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
