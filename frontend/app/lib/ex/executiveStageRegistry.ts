/**
 * EX-1:2 — Executive Stage Registry.
 *
 * Canonical catalogue of every visual identity that may participate in the
 * Executive Stage. Consumes EX-1:1 Foundation types surface only.
 * Identities only — no rendering, animation, or Runtime behaviour.
 *
 * Ownership: owned exclusively by EX-1:2.
 *
 * Public exports:
 *   ExecutiveStageRegistryId
 *   ExecutiveStageRegistryVersion
 *   ExecutiveStageRegistryName
 *   ExecutiveStageRegistryNamespace
 *   ExecutiveStageRegistryStatus
 *   ExecutiveStageRegistryReadiness
 *   ExecutiveStageRegistry
 *   getExecutiveStageRegistrySummary()
 */

import { ExecutiveStageFoundationIdentity } from "./executiveStageTypes.ts";
import { ExecutiveStageInteractionRegistry } from "./executiveStageInteractionRegistry.ts";
import {
  ExecutiveStageCanonicalLayerOrder,
  ExecutiveStageLayerRegistry,
} from "./executiveStageLayerRegistry.ts";
import { ExecutiveStageLayoutRegistry } from "./executiveStageLayoutRegistry.ts";
import { ExecutiveStageObjectRegistry } from "./executiveStageObjectRegistry.ts";
import { ExecutiveStageOverlayRegistry } from "./executiveStageOverlayRegistry.ts";
import {
  ExecutiveStageFocusRegistry,
  ExecutiveStageIdentityRegistry,
  ExecutiveStageMetadataRegistry,
  ExecutiveStageRegistryDomains,
  ExecutiveStageRegistryGuarantees,
  ExecutiveStageRegistryId,
  ExecutiveStageRegistryIdentity,
  ExecutiveStageRegistryMetadata,
  ExecutiveStageRegistryName,
  ExecutiveStageRegistryNamespace,
  ExecutiveStageRegistryNextPhase,
  ExecutiveStageRegistryPrinciples,
  ExecutiveStageRegistryProhibitedSurfaces,
  ExecutiveStageRegistryReadiness,
  ExecutiveStageRegistryRelationships,
  ExecutiveStageRegistryStatus,
  ExecutiveStageRegistryVersion,
  ExecutiveStageRelationshipRegistry,
  ExecutiveStageVisualStateRegistry,
} from "./executiveStageRegistryMetadata.ts";

export {
  ExecutiveStageRegistryId,
  ExecutiveStageRegistryName,
  ExecutiveStageRegistryNamespace,
  ExecutiveStageRegistryReadiness,
  ExecutiveStageRegistryStatus,
  ExecutiveStageRegistryVersion,
};

const collections = Object.freeze({
  stages: ExecutiveStageIdentityRegistry,
  layers: ExecutiveStageLayerRegistry,
  objects: ExecutiveStageObjectRegistry,
  focuses: ExecutiveStageFocusRegistry,
  relationships: ExecutiveStageRelationshipRegistry,
  interactions: ExecutiveStageInteractionRegistry,
  layouts: ExecutiveStageLayoutRegistry,
  overlays: ExecutiveStageOverlayRegistry,
  visualStates: ExecutiveStageVisualStateRegistry,
  metadataCategories: ExecutiveStageMetadataRegistry,
});

const allEntries = Object.freeze([
  ...collections.stages,
  ...collections.layers,
  ...collections.objects,
  ...collections.focuses,
  ...collections.relationships,
  ...collections.interactions,
  ...collections.layouts,
  ...collections.overlays,
  ...collections.visualStates,
  ...collections.metadataCategories,
]);

/**
 * Canonical immutable Executive Stage Registry aggregate.
 */
export const ExecutiveStageRegistry = Object.freeze({
  identity: ExecutiveStageRegistryIdentity,
  foundation: ExecutiveStageFoundationIdentity,
  metadata: ExecutiveStageRegistryMetadata,
  domains: ExecutiveStageRegistryDomains,
  stages: ExecutiveStageIdentityRegistry,
  layers: ExecutiveStageLayerRegistry,
  layerOrder: ExecutiveStageCanonicalLayerOrder,
  objects: ExecutiveStageObjectRegistry,
  focuses: ExecutiveStageFocusRegistry,
  relationships: ExecutiveStageRelationshipRegistry,
  interactions: ExecutiveStageInteractionRegistry,
  layouts: ExecutiveStageLayoutRegistry,
  overlays: ExecutiveStageOverlayRegistry,
  visualStates: ExecutiveStageVisualStateRegistry,
  metadataCategories: ExecutiveStageMetadataRegistry,
  principles: ExecutiveStageRegistryPrinciples,
  guarantees: ExecutiveStageRegistryGuarantees,
  identityRelationships: ExecutiveStageRegistryRelationships,
  prohibitedSurfaces: ExecutiveStageRegistryProhibitedSurfaces,
  entries: allEntries,
  collections,
  baselines: Object.freeze({
    registryDomains: ExecutiveStageRegistryDomains.length,
    stageIdentities: collections.stages.length,
    layerIdentities: collections.layers.length,
    objectCategories: collections.objects.length,
    focusCategories: collections.focuses.length,
    interactionTypes: collections.interactions.length,
    visualStates: collections.visualStates.length,
  }),
  statistics: Object.freeze({
    domainCount: ExecutiveStageRegistryDomains.length,
    collectionCount: Object.keys(collections).length,
    entryCount: allEntries.length,
    stageCount: collections.stages.length,
    layerCount: collections.layers.length,
    objectCount: collections.objects.length,
    focusCount: collections.focuses.length,
    relationshipCount: collections.relationships.length,
    interactionCount: collections.interactions.length,
    layoutCount: collections.layouts.length,
    overlayCount: collections.overlays.length,
    visualStateCount: collections.visualStates.length,
    metadataCategoryCount: collections.metadataCategories.length,
  }),
  nextPhase: ExecutiveStageRegistryNextPhase,
  ownsRuntimeState: false as const,
  rendersUi: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

/** Registry summary for inspection. */
export const getExecutiveStageRegistrySummary = () =>
  Object.freeze({
    id: ExecutiveStageRegistryId,
    name: ExecutiveStageRegistryName,
    version: ExecutiveStageRegistryVersion,
    namespace: ExecutiveStageRegistryNamespace,
    status: ExecutiveStageRegistryStatus,
    readiness: ExecutiveStageRegistryReadiness,
    domainCount: ExecutiveStageRegistryDomains.length,
    entryCount: allEntries.length,
    baselines: ExecutiveStageRegistry.baselines,
    layerOrder: ExecutiveStageCanonicalLayerOrder,
    nextPhase: ExecutiveStageRegistryNextPhase,
    ownsRuntimeState: false as const,
    rendersUi: false as const,
  });

/** Resolve the canonical registry aggregate. */
export const getExecutiveStageRegistry = () => ExecutiveStageRegistry;
