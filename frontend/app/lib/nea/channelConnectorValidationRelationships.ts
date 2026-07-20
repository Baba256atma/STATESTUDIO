/**
 * NEA-2:4 — Channel Connectors Validation Relationships.
 *
 * Immutable declarative relationships between validation categories.
 * No runtime validation execution.
 *
 * Ownership: owned exclusively by NEA-2:4.
 */

import type {
  ChannelConnectorValidationCategoryId,
  ChannelConnectorValidationRelationship,
} from "./channelConnectorValidationTypes.ts";

const relationship = (
  key: string,
  relationshipName: string,
  sourceCategoryId: ChannelConnectorValidationCategoryId,
  targetCategoryId: ChannelConnectorValidationCategoryId,
  description: string,
  order: number,
): ChannelConnectorValidationRelationship =>
  Object.freeze({
    relationshipId: `NEA-2:4/ValidationRelationship/${key}`,
    relationshipName,
    sourceCategoryId,
    targetCategoryId,
    description,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical validation category relationships. */
export const ChannelConnectorValidationRelationships: readonly ChannelConnectorValidationRelationship[] =
  Object.freeze([
    relationship("Definition-Identity", "Definition depends on Identity", "Definition", "Identity", "Definition validation requires identity validation.", 1),
    relationship("Definition-Family", "Definition depends on Family", "Definition", "Family", "Definition validation requires family validation.", 2),
    relationship("Definition-Type", "Definition depends on Type", "Definition", "Type", "Definition validation requires type validation.", 3),
    relationship("Definition-Capability", "Definition depends on Capability", "Definition", "Capability", "Definition validation requires capability validation.", 4),
    relationship("Type-Family", "Type depends on Family", "Type", "Family", "Type validation requires family validation.", 5),
    relationship("Identity-Protocol", "Identity depends on Protocol", "Identity", "Protocol", "Identity validation requires protocol validation.", 6),
    relationship("Identity-Direction", "Identity depends on Direction", "Identity", "Direction", "Identity validation requires direction validation.", 7),
    relationship("Identity-Status", "Identity depends on Status", "Identity", "Status", "Identity validation requires status validation.", 8),
    relationship("Endpoint-Protocol", "Endpoint depends on Protocol", "Endpoint", "Protocol", "Endpoint validation requires protocol validation.", 9),
    relationship("Endpoint-Direction", "Endpoint depends on Direction", "Endpoint", "Direction", "Endpoint validation requires direction validation.", 10),
    relationship("Configuration-Endpoint", "Configuration depends on Endpoint", "Configuration", "Endpoint", "Configuration validation requires endpoint validation.", 11),
    relationship("Configuration-Authentication", "Configuration depends on Authentication", "Configuration", "Authentication", "Configuration validation requires authentication validation.", 12),
    relationship("Session-Identity", "Session depends on Identity", "Session", "Identity", "Session validation requires identity validation.", 13),
    relationship("Diagnostics-Health", "Diagnostics depends on Health", "Diagnostics", "Health", "Diagnostics validation requires health validation.", 14),
    relationship("Diagnostics-Event", "Diagnostics depends on Event", "Diagnostics", "Event", "Diagnostics validation may require event validation.", 15),
    relationship("Result-Status", "Result depends on Status", "Result", "Status", "Result validation requires status validation.", 16),
    relationship("Result-Diagnostics", "Result depends on Diagnostics", "Result", "Diagnostics", "Result validation may require diagnostics validation.", 17),
    relationship("Summary-Identity", "Summary depends on Identity", "Summary", "Identity", "Summary validation requires identity validation.", 18),
    relationship("Summary-Definition", "Summary depends on Definition", "Summary", "Definition", "Summary validation requires definition validation.", 19),
    relationship("Summary-Result", "Summary depends on Result", "Summary", "Result", "Summary validation may require result validation.", 20),
    relationship("CrossModel-Definition", "Cross-Model covers Definition", "CrossModel", "Definition", "Cross-model validation includes definition relationships.", 21),
    relationship("CrossModel-Summary", "Cross-Model covers Summary", "CrossModel", "Summary", "Cross-model validation includes summary relationships.", 22),
    relationship("Platform-CrossModel", "Platform Integrity covers Cross-Model", "PlatformIntegrity", "CrossModel", "Platform integrity includes cross-model consistency.", 23),
    relationship("Platform-Definition", "Platform Integrity covers Definition", "PlatformIntegrity", "Definition", "Platform integrity includes definition composition integrity.", 24),
    relationship("Platform-Summary", "Platform Integrity covers Summary", "PlatformIntegrity", "Summary", "Platform integrity includes summary composition integrity.", 25),
  ]);

/** Canonical immutable validation relationship catalog. */
export const ChannelConnectorValidationRelationshipCatalog = Object.freeze({
  catalogId: "NEA-2:4/ValidationRelationshipCatalog",
  sourcePhase: "NEA-2:4" as const,
  relationships: ChannelConnectorValidationRelationships,
  relationshipCount: ChannelConnectorValidationRelationships.length,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
