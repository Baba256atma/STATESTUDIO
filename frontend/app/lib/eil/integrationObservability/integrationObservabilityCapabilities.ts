/**
 * EIL-6:1 — Integration Observability Foundation Capabilities.
 *
 * Descriptive capability declarations for the Integration Observability Foundation.
 * No runtime execution. No monitoring, tracing, or telemetry behavior.
 *
 * Ownership: owned exclusively by EIL-6:1.
 */

/** Closed capability-key vocabulary. */
export type ObservabilityCapabilityKey =
  | "MetricDefinition"
  | "EventDefinition"
  | "LogDefinition"
  | "TraceDefinition"
  | "HealthDefinition"
  | "AlertDefinition"
  | "DiagnosticsDefinition"
  | "VisibilityDefinition"
  | "StatusReporting"
  | "ObservabilityPolicy";

/** Immutable observability capability descriptor. */
export interface IntegrationObservabilityCapability {
  readonly capabilityId: `EIL-6:1/Capability/${ObservabilityCapabilityKey}`;
  readonly capabilityKey: ObservabilityCapabilityKey;
  readonly capabilityName: string;
  readonly description: string;
  readonly ownedByEil6: true;
  readonly executesRuntime: false;
  readonly performsMonitoring: false;
  readonly performsTelemetry: false;
  readonly performsNetworking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const capability = (
  capabilityKey: ObservabilityCapabilityKey,
  capabilityName: string,
  description: string,
  order: number,
): IntegrationObservabilityCapability =>
  Object.freeze({
    capabilityId: `EIL-6:1/Capability/${capabilityKey}` as const,
    capabilityKey,
    capabilityName,
    description,
    ownedByEil6: true as const,
    executesRuntime: false as const,
    performsMonitoring: false as const,
    performsTelemetry: false as const,
    performsNetworking: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten descriptive Integration Observability Foundation capabilities.
 */
export const IntegrationObservabilityFoundationCapabilities: readonly IntegrationObservabilityCapability[] =
  Object.freeze([
    capability(
      "MetricDefinition",
      "Metric Definition",
      "Declare metric definition metadata without metrics collection.",
      1,
    ),
    capability(
      "EventDefinition",
      "Event Definition",
      "Declare event definition metadata without event streaming.",
      2,
    ),
    capability(
      "LogDefinition",
      "Log Definition",
      "Declare log definition metadata without logging frameworks.",
      3,
    ),
    capability(
      "TraceDefinition",
      "Trace Definition",
      "Declare trace definition metadata without tracing runtimes.",
      4,
    ),
    capability(
      "HealthDefinition",
      "Health Definition",
      "Declare health definition metadata without health-check execution.",
      5,
    ),
    capability(
      "AlertDefinition",
      "Alert Definition",
      "Declare alert definition metadata without alert engines.",
      6,
    ),
    capability(
      "DiagnosticsDefinition",
      "Diagnostics Definition",
      "Declare diagnostics definition metadata without diagnostic pipelines.",
      7,
    ),
    capability(
      "VisibilityDefinition",
      "Visibility Definition",
      "Declare visibility definition metadata without dashboards or UI.",
      8,
    ),
    capability(
      "StatusReporting",
      "Status Reporting",
      "Declare status-reporting metadata without status polling services.",
      9,
    ),
    capability(
      "ObservabilityPolicy",
      "Observability Policy",
      "Declare observability-policy metadata without policy enforcement.",
      10,
    ),
  ]);

/** Capability catalog envelope. */
export const IntegrationObservabilityFoundationCapabilityCatalog = Object.freeze(
  {
    catalogId: "EIL-6:1/CapabilityCatalog",
    capabilities: IntegrationObservabilityFoundationCapabilities,
    capabilityCount: IntegrationObservabilityFoundationCapabilities.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  },
);
