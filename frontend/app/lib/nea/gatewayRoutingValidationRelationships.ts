/**
 * NEA-5:4 — Gateway Routing Validation Relationships.
 *
 * Immutable declarative relationships between validation categories.
 * No runtime validation execution.
 *
 * Ownership: owned exclusively by NEA-5:4.
 */

import type {
  GatewayRoutingValidationCategoryId,
  GatewayRoutingValidationRelationship,
} from "./gatewayRoutingValidationTypes.ts";

const relationship = (
  key: string,
  relationshipName: string,
  sourceCategoryId: GatewayRoutingValidationCategoryId,
  targetCategoryId: GatewayRoutingValidationCategoryId,
  description: string,
  order: number,
): GatewayRoutingValidationRelationship =>
  Object.freeze({
    relationshipId: `NEA-5:4/ValidationRelationship/${key}`,
    relationshipName,
    sourceCategoryId,
    targetCategoryId,
    description,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Exactly twenty-six validation category relationships. */
export const GatewayRoutingValidationRelationships: readonly GatewayRoutingValidationRelationship[] =
  Object.freeze([
    relationship("Identity-Definition", "Identity depends on Definition", "RouteIdentity", "RouteDefinition", "Route identity validation requires definition validation.", 1),
    relationship("Identity-Metadata", "Identity depends on Metadata", "RouteIdentity", "RouteMetadata", "Route identity validation requires metadata validation.", 2),
    relationship("Definition-Destination", "Definition depends on Destination", "RouteDefinition", "RouteDestination", "Route definition validation requires destination validation.", 3),
    relationship("Definition-Strategy", "Definition depends on Strategy", "RouteDefinition", "RouteStrategy", "Route definition validation requires strategy validation.", 4),
    relationship("Definition-Priority", "Definition depends on Priority", "RouteDefinition", "RoutePriority", "Route definition validation requires priority validation.", 5),
    relationship("Definition-Policy", "Definition depends on Policy", "RouteDefinition", "RoutePolicy", "Route definition validation requires policy validation.", 6),
    relationship("Definition-Capability", "Definition depends on Capability", "RouteDefinition", "RouteCapability", "Route definition validation requires capability validation.", 7),
    relationship("Definition-Lifecycle", "Definition depends on Lifecycle", "RouteDefinition", "RouteLifecycle", "Route definition validation requires lifecycle validation.", 8),
    relationship("Definition-Status", "Definition depends on Status", "RouteDefinition", "RouteStatus", "Route definition validation may require status validation.", 9),
    relationship("Request-Context", "Request depends on Context", "RouteRequest", "RouteContext", "Route request validation requires context validation.", 10),
    relationship("Request-Identity", "Request depends on Identity", "RouteRequest", "RouteIdentity", "Route request validation requires identity validation.", 11),
    relationship("Request-Resolution", "Request depends on Resolution", "RouteRequest", "RouteResolution", "Route request validation requires resolution validation.", 12),
    relationship("Request-Status", "Request depends on Status", "RouteRequest", "RouteStatus", "Route request validation may require status validation.", 13),
    relationship("Resolution-Destination", "Resolution depends on Destination", "RouteResolution", "RouteDestination", "Route resolution validation requires destination validation.", 14),
    relationship("Resolution-Decision", "Resolution depends on Decision", "RouteResolution", "RouteDecision", "Route resolution validation requires decision validation.", 15),
    relationship("Response-Result", "Response depends on Result", "RouteResponse", "RouteResult", "Route response validation requires result validation.", 16),
    relationship("Response-Diagnostics", "Response depends on Diagnostics", "RouteResponse", "RouteDiagnostics", "Route response validation may require diagnostics validation.", 17),
    relationship("Response-Status", "Response depends on Status", "RouteResponse", "RouteStatus", "Route response validation may require status validation.", 18),
    relationship("Summary-Response", "Summary depends on Response", "RouteSummary", "RouteResponse", "Route summary validation requires response validation.", 19),
    relationship("Summary-Definition", "Summary depends on Definition", "RouteSummary", "RouteDefinition", "Route summary validation requires definition validation.", 20),
    relationship("Configuration-Strategy", "Configuration depends on Strategy", "RouteConfiguration", "RouteStrategy", "Route configuration validation requires strategy validation.", 21),
    relationship("Reference-Identity", "Reference depends on Identity", "RouteReference", "RouteIdentity", "Route reference validation requires identity validation.", 22),
    relationship("Metadata-Definition", "Metadata depends on Definition", "RouteMetadata", "RouteDefinition", "Route metadata validation requires definition validation.", 23),
    relationship("Diagnostics-Result", "Diagnostics depends on Result", "RouteDiagnostics", "RouteResult", "Route diagnostics validation requires result validation.", 24),
    relationship("CrossModel-Definition", "Cross-Model covers Definition", "CrossModel", "RouteDefinition", "Cross-model validation includes route definition relationships.", 25),
    relationship("Platform-CrossModel", "Platform Integrity covers Cross-Model", "PlatformIntegrity", "CrossModel", "Platform integrity includes cross-model consistency.", 26),
  ]);

/** Canonical immutable validation relationship catalog. */
export const GatewayRoutingValidationRelationshipCatalog = Object.freeze({
  catalogId: "NEA-5:4/ValidationRelationshipCatalog",
  sourcePhase: "NEA-5:4" as const,
  relationships: GatewayRoutingValidationRelationships,
  relationshipCount: GatewayRoutingValidationRelationships.length,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
