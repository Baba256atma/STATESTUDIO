/**
 * NEA-6:2 — Message Normalization Registry Capabilities.
 *
 * Capability registry derived from every NEA-6:1 Foundation capability.
 * Declarations only. No runtime execution. No duplication of Foundation values.
 *
 * Ownership: owned exclusively by NEA-6:2.
 */

import {
  MessageNormalizationFoundationId,
  MessageNormalizationFoundationPlatform,
} from "./messageNormalizationFoundation.ts";
import type { MessageNormalizationRegistryEntry } from "./messageNormalizationRegistryTypes.ts";

const foundation = MessageNormalizationFoundationPlatform;

/** Capability registry — Foundation capability references preserved. */
export const MessageNormalizationCapabilityRegistry: readonly MessageNormalizationRegistryEntry[] =
  Object.freeze(
    foundation.capabilities.capabilities.map((item) =>
      Object.freeze({
        id: item.capabilityId,
        label: item.capabilityName,
        description: item.description,
        sourcePhase: "NEA-6:1" as const,
        foundationReference: `${MessageNormalizationFoundationId}/capabilities/${item.capabilityId}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Canonical immutable capability registry catalog. */
export const MessageNormalizationCapabilityRegistryCatalog = Object.freeze({
  catalogId: "NEA-6:2/CapabilityRegistry",
  sourcePhase: "NEA-6:2" as const,
  capabilities: MessageNormalizationCapabilityRegistry,
  capabilityCount: MessageNormalizationCapabilityRegistry.length,
  executesRuntime: false as const,
  duplicatesFoundationValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
