/**
 * DKL-9:2 — Data Knowledge Suite Ownership Registry.
 *
 * Registers suite ownership and boundary declarations by Foundation reference.
 *
 * Ownership: owned exclusively by DKL-9:2.
 */

import { DataKnowledgeSuiteFoundationPlatform } from "./dataKnowledgeSuiteFoundation.ts";
import type { DataKnowledgeSuiteRegistryEntryBase } from "./dataKnowledgeSuiteRegistryTypes.ts";

const foundation = DataKnowledgeSuiteFoundationPlatform;
const ownership = foundation.ownership;
const boundaries = foundation.boundaries;

export interface DataKnowledgeSuiteOwnershipEntry
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly ownershipKind: "Owns" | "DoesNotOwn";
  readonly declaration: string;
  readonly ownershipReference: typeof ownership;
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuiteBoundaryEntry
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly surface: string;
  readonly boundaryReference: typeof boundaries;
  readonly preservesCanonicalReference: true;
}

/** Ownership declarations registered from Foundation ownership.owns / doesNotOwn. */
export const DataKnowledgeSuiteOwnershipRegistry: readonly DataKnowledgeSuiteOwnershipEntry[] =
  Object.freeze([
    ...ownership.owns.map((declaration, index) =>
      Object.freeze({
        id: `DKL-9:2/Ownership/Owns/${index + 1}`,
        name: declaration,
        ownershipKind: "Owns" as const,
        declaration,
        ownershipReference: ownership,
        preservesCanonicalReference: true as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
    ...ownership.doesNotOwn.map((declaration, index) =>
      Object.freeze({
        id: `DKL-9:2/Ownership/DoesNotOwn/${index + 1}`,
        name: declaration,
        ownershipKind: "DoesNotOwn" as const,
        declaration,
        ownershipReference: ownership,
        preservesCanonicalReference: true as const,
        deterministicOrder: ownership.owns.length + index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  ]);

/** Boundary prohibited surfaces registered from Foundation boundaries. */
export const DataKnowledgeSuiteBoundaryRegistry: readonly DataKnowledgeSuiteBoundaryEntry[] =
  Object.freeze(
    boundaries.prohibitedSurfaces.map((surface, index) =>
      Object.freeze({
        id: `DKL-9:2/Boundary/${index + 1}`,
        name: surface,
        surface,
        boundaryReference: boundaries,
        preservesCanonicalReference: true as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Canonical ownership aggregate preserved by Foundation reference. */
export const DataKnowledgeSuiteOwnershipAggregate = Object.freeze({
  ownership,
  ownsCount: ownership.ownsCount,
  doesNotOwnCount: ownership.doesNotOwnCount,
  preservedByReference: true as const,
});

/** Canonical boundaries aggregate preserved by Foundation reference. */
export const DataKnowledgeSuiteBoundariesAggregate = Object.freeze({
  boundaries,
  prohibitedSurfaceCount: boundaries.prohibitedSurfaceCount,
  preservedByReference: true as const,
});
