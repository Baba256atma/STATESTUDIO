/**
 * EIL-6:1 — Integration Observability Foundation Domains.
 *
 * Immutable architectural domain declarations for Integration Observability.
 * Metadata only. No monitoring or telemetry behavior.
 *
 * Ownership: owned exclusively by EIL-6:1.
 */

/** Closed domain-key vocabulary. */
export type ObservabilityDomainKey =
  | "Metrics"
  | "Events"
  | "Logs"
  | "Traces"
  | "Health"
  | "Diagnostics"
  | "Alerts"
  | "Visibility"
  | "Status"
  | "Policies";

/** Immutable observability domain descriptor. */
export interface IntegrationObservabilityDomain {
  readonly domainId: `EIL-6:1/Domain/${ObservabilityDomainKey}`;
  readonly domainKey: ObservabilityDomainKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly runtimeImplemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const domain = (
  domainKey: ObservabilityDomainKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationObservabilityDomain =>
  Object.freeze({
    domainId: `EIL-6:1/Domain/${domainKey}` as const,
    domainKey,
    canonicalName,
    description,
    runtimeImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten architectural observability domains.
 */
export const IntegrationObservabilityFoundationDomains: readonly IntegrationObservabilityDomain[] =
  Object.freeze([
    domain(
      "Metrics",
      "Metrics",
      "Architectural domain for declarative metric definitions and categories.",
      1,
    ),
    domain(
      "Events",
      "Events",
      "Architectural domain for declarative integration event definitions and categories.",
      2,
    ),
    domain(
      "Logs",
      "Logs",
      "Architectural domain for declarative log category and severity metadata.",
      3,
    ),
    domain(
      "Traces",
      "Traces",
      "Architectural domain for declarative trace and span metadata.",
      4,
    ),
    domain(
      "Health",
      "Health",
      "Architectural domain for declarative health and readiness metadata.",
      5,
    ),
    domain(
      "Diagnostics",
      "Diagnostics",
      "Architectural domain for declarative diagnostic signal metadata.",
      6,
    ),
    domain(
      "Alerts",
      "Alerts",
      "Architectural domain for declarative alert category metadata.",
      7,
    ),
    domain(
      "Visibility",
      "Visibility",
      "Architectural domain for declarative observability visibility metadata.",
      8,
    ),
    domain(
      "Status",
      "Status",
      "Architectural domain for declarative integration status metadata.",
      9,
    ),
    domain(
      "Policies",
      "Policies",
      "Architectural domain for declarative observability policy metadata.",
      10,
    ),
  ]);
