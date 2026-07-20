/**
 * NEA-3:2 — Session & Conversation Registry Capabilities.
 *
 * Capability registry derived from every NEA-3:1 Foundation capability.
 * Declarations only. No runtime execution.
 *
 * Ownership: owned exclusively by NEA-3:2.
 */

import {
  SessionConversationFoundationId,
  SessionConversationFoundationPlatform,
} from "./sessionConversationFoundation.ts";
import type { SessionConversationRegistryEntry } from "./sessionConversationRegistryTypes.ts";

const foundation = SessionConversationFoundationPlatform;

/** Capability registry — Foundation capability references preserved. */
export const SessionConversationCapabilityRegistry: readonly SessionConversationRegistryEntry[] =
  Object.freeze(
    foundation.capabilities.capabilities.map((item) =>
      Object.freeze({
        id: item.capabilityId,
        label: item.capabilityName,
        description: item.description,
        sourcePhase: "NEA-3:1" as const,
        foundationReference: `${SessionConversationFoundationId}/capabilities/${item.capabilityId}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Canonical immutable capability registry catalog. */
export const SessionConversationCapabilityRegistryCatalog = Object.freeze({
  catalogId: "NEA-3:2/CapabilityRegistry",
  sourcePhase: "NEA-3:2" as const,
  capabilities: SessionConversationCapabilityRegistry,
  capabilityCount: SessionConversationCapabilityRegistry.length,
  executesRuntime: false as const,
  duplicatesFoundationValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
