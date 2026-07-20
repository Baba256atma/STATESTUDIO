/**
 * NEA-6:1 — Message Normalization Capabilities.
 *
 * Immutable capability declarations for Message Normalization Foundation.
 * Capabilities are declarative only — no runtime execution.
 *
 * Ownership: owned exclusively by NEA-6:1.
 */

import type {
  MessageNormalizationCapabilityDeclaration,
  MessageNormalizationCapabilityId,
} from "./messageNormalizationFoundationTypes.ts";

const capability = (
  capabilityId: MessageNormalizationCapabilityId,
  capabilityName: string,
  description: string,
  order: number,
): MessageNormalizationCapabilityDeclaration =>
  Object.freeze({
    capabilityId,
    capabilityName,
    description,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical message normalization capability catalog — exactly eight. */
export const MessageNormalizationCapabilities: readonly MessageNormalizationCapabilityDeclaration[] =
  Object.freeze([
    capability(
      "ChannelMapping",
      "Channel Mapping",
      "Declarative ability to declare channel mapping vocabulary.",
      1,
    ),
    capability(
      "ContextMapping",
      "Context Mapping",
      "Declarative ability to declare context mapping vocabulary.",
      2,
    ),
    capability(
      "IdentityMapping",
      "Identity Mapping",
      "Declarative ability to declare identity mapping vocabulary.",
      3,
    ),
    capability(
      "MetadataMapping",
      "Metadata Mapping",
      "Declarative ability to declare metadata mapping vocabulary.",
      4,
    ),
    capability(
      "AttachmentMapping",
      "Attachment Mapping",
      "Declarative ability to declare attachment mapping vocabulary.",
      5,
    ),
    capability(
      "CorrelationMapping",
      "Correlation Mapping",
      "Declarative ability to declare correlation mapping vocabulary.",
      6,
    ),
    capability(
      "TraceMapping",
      "Trace Mapping",
      "Declarative ability to declare trace mapping vocabulary.",
      7,
    ),
    capability(
      "CanonicalMessageDeclaration",
      "Canonical Message Declaration",
      "Declarative ability to declare the canonical Executive Message contract.",
      8,
    ),
  ]);

/** Canonical immutable capability catalog. */
export const MessageNormalizationCapabilityCatalog = Object.freeze({
  catalogId: "NEA-6:1/CapabilityCatalog",
  sourcePhase: "NEA-6:1" as const,
  capabilities: MessageNormalizationCapabilities,
  capabilityCount: MessageNormalizationCapabilities.length,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
