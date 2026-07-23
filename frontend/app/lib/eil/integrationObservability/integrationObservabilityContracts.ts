/**
 * EIL-6:1 — Integration Observability Foundation Contracts.
 *
 * Immutable contract declarations for Integration Observability Foundation surfaces.
 * Declarations only. No runtime enforcement. No monitoring engines.
 *
 * Ownership: owned exclusively by EIL-6:1.
 */

/** Closed contract-name vocabulary. */
export type ObservabilityContractName =
  | "ObservabilityContract"
  | "MetricsContract"
  | "LoggingContract"
  | "TracingContract"
  | "HealthMonitoringContract"
  | "AlertContract"
  | "DiagnosticsContract"
  | "VisibilityContract"
  | "MonitoringPolicyContract"
  | "IntegrationStatusContract";

/** Immutable observability contract descriptor. */
export interface IntegrationObservabilityContract {
  readonly contractId: `EIL-6:1/Contract/${ObservabilityContractName}`;
  readonly contractName: ObservabilityContractName;
  readonly canonicalName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const contract = (
  contractName: ObservabilityContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): IntegrationObservabilityContract =>
  Object.freeze({
    contractId: `EIL-6:1/Contract/${contractName}` as const,
    contractName,
    canonicalName,
    description,
    fields: Object.freeze([...fields]),
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten public observability contracts.
 * Order is deterministic and immutable.
 */
export const IntegrationObservabilityFoundationContracts: readonly IntegrationObservabilityContract[] =
  Object.freeze([
    contract(
      "ObservabilityContract",
      "Observability Contract",
      "Canonical metadata contract binding observability identity to domain and policy references.",
      Object.freeze([
        "observabilityId",
        "domainRefs",
        "policyRefs",
        "compatibilityRef",
        "metadataOnly",
      ]),
      1,
    ),
    contract(
      "MetricsContract",
      "Metrics Contract",
      "Declarative metrics metadata without metrics collection or exporters.",
      Object.freeze([
        "metricId",
        "metricCategoryRef",
        "unit",
        "description",
        "runtimeCollected",
      ]),
      2,
    ),
    contract(
      "LoggingContract",
      "Logging Contract",
      "Declarative logging metadata without logging frameworks or sinks.",
      Object.freeze([
        "logId",
        "logCategoryRef",
        "severity",
        "description",
        "runtimeLogged",
      ]),
      3,
    ),
    contract(
      "TracingContract",
      "Tracing Contract",
      "Declarative tracing metadata without tracing runtimes or spans.",
      Object.freeze([
        "traceId",
        "traceCategoryRef",
        "spanRefs",
        "description",
        "runtimeTraced",
      ]),
      4,
    ),
    contract(
      "HealthMonitoringContract",
      "Health Monitoring Contract",
      "Declarative health metadata without health-check execution.",
      Object.freeze([
        "healthId",
        "healthCategoryRef",
        "statusRef",
        "description",
        "runtimeChecked",
      ]),
      5,
    ),
    contract(
      "AlertContract",
      "Alert Contract",
      "Declarative alert metadata without alert engines or notification delivery.",
      Object.freeze([
        "alertId",
        "alertCategoryRef",
        "severity",
        "description",
        "runtimeFired",
      ]),
      6,
    ),
    contract(
      "DiagnosticsContract",
      "Diagnostics Contract",
      "Declarative diagnostics metadata without diagnostic execution pipelines.",
      Object.freeze([
        "diagnosticId",
        "domainRef",
        "signalRefs",
        "description",
        "runtimeExecuted",
      ]),
      7,
    ),
    contract(
      "VisibilityContract",
      "Visibility Contract",
      "Declarative visibility metadata without dashboards or UI surfaces.",
      Object.freeze([
        "visibilityId",
        "surfaceRefs",
        "audience",
        "description",
        "runtimeRendered",
      ]),
      8,
    ),
    contract(
      "MonitoringPolicyContract",
      "Monitoring Policy Contract",
      "Declarative monitoring-policy metadata without policy enforcement.",
      Object.freeze([
        "policyId",
        "policyName",
        "scopeRefs",
        "description",
        "runtimeEnforced",
      ]),
      9,
    ),
    contract(
      "IntegrationStatusContract",
      "Integration Status Contract",
      "Declarative integration-status metadata without status polling runtimes.",
      Object.freeze([
        "statusId",
        "integrationRef",
        "state",
        "description",
        "runtimePolled",
      ]),
      10,
    ),
  ]);

/** Deterministic contract name list derived from the contracts collection. */
export const IntegrationObservabilityFoundationContractNames = Object.freeze(
  IntegrationObservabilityFoundationContracts.map((item) => item.contractName),
);
