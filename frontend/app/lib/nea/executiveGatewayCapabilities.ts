/**
 * NEA-1:1 — Executive Gateway Capabilities.
 *
 * Metadata capability declarations for the Executive Gateway Foundation.
 * No runtime execution.
 *
 * Ownership: owned exclusively by NEA-1:1.
 */

import type {
  ExecutiveGatewayCapabilityDeclaration,
  ExecutiveGatewayCapabilityId,
} from "./executiveGatewayFoundationTypes.ts";

const capability = (
  capabilityId: ExecutiveGatewayCapabilityId,
  capabilityName: string,
  description: string,
  order: number,
): ExecutiveGatewayCapabilityDeclaration =>
  Object.freeze({
    capabilityId,
    capabilityName,
    description,
    ownedByNea: true as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly sixteen Executive Gateway capability declarations.
 * Canonical collection for derived inventory counts.
 */
export const ExecutiveGatewayCapabilities: readonly ExecutiveGatewayCapabilityDeclaration[] =
  Object.freeze([
    capability(
      "ExternalInteractionIntake",
      "External Interaction Intake",
      "Declare intake of external interaction envelopes at the gateway boundary.",
      1,
    ),
    capability(
      "SourceIdentification",
      "Source Identification",
      "Declare identification of external source families.",
      2,
    ),
    capability(
      "ChannelClassification",
      "Channel Classification",
      "Declare classification of external channel types.",
      3,
    ),
    capability(
      "SenderReferenceCapture",
      "Sender Reference Capture",
      "Declare capture of sender identity references without resolution.",
      4,
    ),
    capability(
      "TenantContextCapture",
      "Tenant Context Capture",
      "Declare capture of tenant context references without discovery.",
      5,
    ),
    capability(
      "WorkspaceContextCapture",
      "Workspace Context Capture",
      "Declare capture of workspace context references without lookup.",
      6,
    ),
    capability(
      "AuthenticationContextCapture",
      "Authentication Context Capture",
      "Declare authentication context capture without auth execution.",
      7,
    ),
    capability(
      "AuthorizationContextCapture",
      "Authorization Context Capture",
      "Declare authorization context capture without permission evaluation.",
      8,
    ),
    capability(
      "TrustContextCapture",
      "Trust Context Capture",
      "Declare trust context capture without legal decision engines.",
      9,
    ),
    capability(
      "ConsentContextCapture",
      "Consent Context Capture",
      "Declare consent context capture without compliance workflows.",
      10,
    ),
    capability(
      "InteractionNormalization",
      "Interaction Normalization",
      "Declare normalization of external interactions into canonical envelopes.",
      11,
    ),
    capability(
      "GatewayValidationDeclaration",
      "Gateway Validation Declaration",
      "Declare gateway validation outcomes; engine deferred to later phases.",
      12,
    ),
    capability(
      "RoutingPreparation",
      "Routing Preparation",
      "Declare routing destination preparation without invoking consumers.",
      13,
    ),
    capability(
      "CorrelationAndTracing",
      "Correlation and Tracing",
      "Declare correlation and trace identity for gateway envelopes.",
      14,
    ),
    capability(
      "DiagnosticGeneration",
      "Diagnostic Generation",
      "Declare gateway diagnostic structures without runtime telemetry.",
      15,
    ),
    capability(
      "GatewayResponseDeclaration",
      "Gateway Response Declaration",
      "Declare gateway response envelopes without Engine or DKL results.",
      16,
    ),
  ]);

/** Canonical immutable capabilities catalog. */
export const ExecutiveGatewayCapabilityCatalog = Object.freeze({
  catalogId: "NEA-1:1/ExecutiveGatewayCapabilities",
  sourcePhase: "NEA-1:1" as const,
  capabilities: ExecutiveGatewayCapabilities,
  capabilityCount: ExecutiveGatewayCapabilities.length,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
