/**
 * NEA-1:2 — Executive Gateway Registry Collections.
 *
 * Canonical immutable registry collections derived from NEA-1:1 Foundation
 * public platform, plus Registry-owned declaration vocabularies.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-1:2.
 */

import {
  ExecutiveGatewayFoundationId,
  ExecutiveGatewayFoundationPlatform,
} from "./executiveGatewayFoundation.ts";
import type { ExecutiveGatewayRegistryEntry } from "./executiveGatewayRegistryTypes.ts";

const foundation = ExecutiveGatewayFoundationPlatform;

const entry = (
  id: string,
  label: string,
  description: string,
  sourcePhase: "NEA-1:1" | "NEA-1:2",
  foundationReference: string | null,
  order: number,
): ExecutiveGatewayRegistryEntry =>
  Object.freeze({
    id,
    label,
    description,
    sourcePhase,
    foundationReference,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Source-family registry — Foundation canonical references preserved. */
export const ExecutiveGatewaySourceFamilyRegistry: readonly ExecutiveGatewayRegistryEntry[] =
  Object.freeze(
    foundation.sources.map((item) =>
      entry(
        item.id,
        item.label,
        item.description,
        "NEA-1:1",
        `${ExecutiveGatewayFoundationId}/sources/${item.id}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Channel-type registry — Foundation canonical references preserved. */
export const ExecutiveGatewayChannelRegistry: readonly ExecutiveGatewayRegistryEntry[] =
  Object.freeze(
    foundation.channels.map((item) =>
      entry(
        item.id,
        item.label,
        item.description,
        "NEA-1:1",
        `${ExecutiveGatewayFoundationId}/channels/${item.id}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Interaction-modality registry — Foundation canonical references preserved. */
export const ExecutiveGatewayModalityRegistry: readonly ExecutiveGatewayRegistryEntry[] =
  Object.freeze(
    foundation.modalities.map((item) =>
      entry(
        item.id,
        item.label,
        item.description,
        "NEA-1:1",
        `${ExecutiveGatewayFoundationId}/modalities/${item.id}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Sender-kind registry — Foundation canonical references preserved. */
export const ExecutiveGatewaySenderRegistry: readonly ExecutiveGatewayRegistryEntry[] =
  Object.freeze(
    foundation.senderKinds.map((item) =>
      entry(
        item.id,
        item.label,
        item.description,
        "NEA-1:1",
        `${ExecutiveGatewayFoundationId}/senderKinds/${item.id}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Routing-destination registry — Foundation canonical references preserved. */
export const ExecutiveGatewayRoutingRegistry: readonly ExecutiveGatewayRegistryEntry[] =
  Object.freeze(
    foundation.routingDestinations.map((item) =>
      entry(
        item.id,
        item.label,
        item.description,
        "NEA-1:1",
        `${ExecutiveGatewayFoundationId}/routingDestinations/${item.id}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Lifecycle-state registry — Foundation canonical references preserved. */
export const ExecutiveGatewayLifecycleRegistry: readonly ExecutiveGatewayRegistryEntry[] =
  Object.freeze(
    foundation.lifecycle.states.map((state, index) =>
      entry(
        state,
        state,
        `Gateway lifecycle state ${state}.`,
        "NEA-1:1",
        `${ExecutiveGatewayFoundationId}/lifecycle/states/${state}`,
        index + 1,
      ),
    ),
  );

/**
 * Authentication-method registry — Registry-owned declarations only.
 * No authentication engine.
 */
export const ExecutiveGatewayAuthenticationMethodRegistry: readonly ExecutiveGatewayRegistryEntry[] =
  Object.freeze([
    entry(
      "None",
      "None",
      "No authentication method declared.",
      "NEA-1:2",
      null,
      1,
    ),
    entry(
      "ApiKeyReference",
      "API Key Reference",
      "API key reference declaration without validation.",
      "NEA-1:2",
      null,
      2,
    ),
    entry(
      "BearerTokenReference",
      "Bearer Token Reference",
      "Bearer token reference declaration without validation.",
      "NEA-1:2",
      null,
      3,
    ),
    entry(
      "OAuthReference",
      "OAuth Reference",
      "OAuth reference declaration without OAuth flows.",
      "NEA-1:2",
      null,
      4,
    ),
    entry(
      "MutualTlsReference",
      "Mutual TLS Reference",
      "Mutual TLS reference declaration without certificate handling.",
      "NEA-1:2",
      null,
      5,
    ),
    entry(
      "SessionReference",
      "Session Reference",
      "Session reference declaration without session stores.",
      "NEA-1:2",
      null,
      6,
    ),
    entry(
      "SignedRequestReference",
      "Signed Request Reference",
      "Signed request reference declaration without signature verification.",
      "NEA-1:2",
      null,
      7,
    ),
    entry(
      "UnknownMethod",
      "Unknown Method",
      "Unknown authentication method classification.",
      "NEA-1:2",
      null,
      8,
    ),
  ]);

/**
 * Authorization-status registry — declaration values only.
 * Aligns with Foundation authorization status vocabulary.
 */
export const ExecutiveGatewayAuthorizationStatusRegistry: readonly ExecutiveGatewayRegistryEntry[] =
  Object.freeze([
    entry(
      "Authorized",
      "Authorized",
      "Authorization status: authorized.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/AuthorizationContext`,
      1,
    ),
    entry(
      "Unauthorized",
      "Unauthorized",
      "Authorization status: unauthorized.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/AuthorizationContext`,
      2,
    ),
    entry(
      "Partial",
      "Partial",
      "Authorization status: partial.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/AuthorizationContext`,
      3,
    ),
    entry(
      "Unknown",
      "Unknown",
      "Authorization status: unknown.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/AuthorizationContext`,
      4,
    ),
    entry(
      "NotApplicable",
      "Not Applicable",
      "Authorization status: not applicable.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/AuthorizationContext`,
      5,
    ),
  ]);

/** Trust-level registry — classification declarations only. */
export const ExecutiveGatewayTrustLevelRegistry: readonly ExecutiveGatewayRegistryEntry[] =
  Object.freeze([
    entry(
      "Trusted",
      "Trusted",
      "Trust classification: trusted.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/TrustContext`,
      1,
    ),
    entry(
      "Conditional",
      "Conditional",
      "Trust classification: conditional.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/TrustContext`,
      2,
    ),
    entry(
      "Untrusted",
      "Untrusted",
      "Trust classification: untrusted.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/TrustContext`,
      3,
    ),
    entry(
      "Unknown",
      "Unknown",
      "Trust classification: unknown.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/TrustContext`,
      4,
    ),
  ]);

/** Consent-status registry — classification declarations only. */
export const ExecutiveGatewayConsentStatusRegistry: readonly ExecutiveGatewayRegistryEntry[] =
  Object.freeze([
    entry(
      "Granted",
      "Granted",
      "Consent status: granted.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/ConsentContext`,
      1,
    ),
    entry(
      "Denied",
      "Denied",
      "Consent status: denied.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/ConsentContext`,
      2,
    ),
    entry(
      "Expired",
      "Expired",
      "Consent status: expired.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/ConsentContext`,
      3,
    ),
    entry(
      "Revoked",
      "Revoked",
      "Consent status: revoked.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/ConsentContext`,
      4,
    ),
    entry(
      "Unknown",
      "Unknown",
      "Consent status: unknown.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/ConsentContext`,
      5,
    ),
    entry(
      "NotRequired",
      "Not Required",
      "Consent status: not required.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/ConsentContext`,
      6,
    ),
  ]);

/** Validation-status registry — result categories only. */
export const ExecutiveGatewayValidationStatusRegistry: readonly ExecutiveGatewayRegistryEntry[] =
  Object.freeze([
    entry(
      "Valid",
      "Valid",
      "Validation result category: valid.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/ValidationResult`,
      1,
    ),
    entry(
      "Invalid",
      "Invalid",
      "Validation result category: invalid.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/ValidationResult`,
      2,
    ),
    entry(
      "ConditionallyAccepted",
      "Conditionally Accepted",
      "Validation result category: conditionally accepted.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/ValidationResult`,
      3,
    ),
    entry(
      "Rejected",
      "Rejected",
      "Validation result category: rejected.",
      "NEA-1:2",
      `${ExecutiveGatewayFoundationId}/contracts/ValidationResult`,
      4,
    ),
  ]);

/** Diagnostic-category registry — Registry-owned declarations only. */
export const ExecutiveGatewayDiagnosticCategoryRegistry: readonly ExecutiveGatewayRegistryEntry[] =
  Object.freeze([
    entry(
      "Intake",
      "Intake",
      "Diagnostic category for intake processing.",
      "NEA-1:2",
      null,
      1,
    ),
    entry(
      "Identification",
      "Identification",
      "Diagnostic category for source identification.",
      "NEA-1:2",
      null,
      2,
    ),
    entry(
      "Context",
      "Context",
      "Diagnostic category for context capture.",
      "NEA-1:2",
      null,
      3,
    ),
    entry(
      "Authentication",
      "Authentication",
      "Diagnostic category for authentication context.",
      "NEA-1:2",
      null,
      4,
    ),
    entry(
      "Authorization",
      "Authorization",
      "Diagnostic category for authorization context.",
      "NEA-1:2",
      null,
      5,
    ),
    entry(
      "Trust",
      "Trust",
      "Diagnostic category for trust context.",
      "NEA-1:2",
      null,
      6,
    ),
    entry(
      "Consent",
      "Consent",
      "Diagnostic category for consent context.",
      "NEA-1:2",
      null,
      7,
    ),
    entry(
      "Normalization",
      "Normalization",
      "Diagnostic category for normalization.",
      "NEA-1:2",
      null,
      8,
    ),
    entry(
      "Validation",
      "Validation",
      "Diagnostic category for validation declarations.",
      "NEA-1:2",
      null,
      9,
    ),
    entry(
      "Routing",
      "Routing",
      "Diagnostic category for routing preparation.",
      "NEA-1:2",
      null,
      10,
    ),
    entry(
      "Response",
      "Response",
      "Diagnostic category for gateway response.",
      "NEA-1:2",
      null,
      11,
    ),
    entry(
      "System",
      "System",
      "Diagnostic category for system-level gateway diagnostics.",
      "NEA-1:2",
      null,
      12,
    ),
  ]);

/** Aggregate of all vocabulary collections for derived inventory counting. */
export const ExecutiveGatewayRegistryCollections = Object.freeze({
  sourceFamilies: ExecutiveGatewaySourceFamilyRegistry,
  channels: ExecutiveGatewayChannelRegistry,
  modalities: ExecutiveGatewayModalityRegistry,
  senders: ExecutiveGatewaySenderRegistry,
  authenticationMethods: ExecutiveGatewayAuthenticationMethodRegistry,
  authorizationStatuses: ExecutiveGatewayAuthorizationStatusRegistry,
  trustLevels: ExecutiveGatewayTrustLevelRegistry,
  consentStatuses: ExecutiveGatewayConsentStatusRegistry,
  validationStatuses: ExecutiveGatewayValidationStatusRegistry,
  routingDestinations: ExecutiveGatewayRoutingRegistry,
  lifecycleStates: ExecutiveGatewayLifecycleRegistry,
  diagnosticCategories: ExecutiveGatewayDiagnosticCategoryRegistry,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
