/**
 * EIL-6:1 — Integration Observability Metric Categories.
 *
 * Immutable metric-category declarations only.
 * No metrics collection. No exporters. No runtime sampling.
 *
 * Ownership: owned exclusively by EIL-6:1.
 */

/** Closed metric-category vocabulary. */
export type ObservabilityMetricCategoryKey =
  | "Availability"
  | "Latency"
  | "Throughput"
  | "ErrorRate"
  | "SuccessRate"
  | "ResourceUsage"
  | "QueueDepth"
  | "ProcessingTime";

/** Immutable metric-category descriptor. */
export interface IntegrationObservabilityMetricCategory {
  readonly categoryId: `EIL-6:1/MetricCategory/${ObservabilityMetricCategoryKey}`;
  readonly categoryKey: ObservabilityMetricCategoryKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly runtimeCollected: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const metricCategory = (
  categoryKey: ObservabilityMetricCategoryKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationObservabilityMetricCategory =>
  Object.freeze({
    categoryId: `EIL-6:1/MetricCategory/${categoryKey}` as const,
    categoryKey,
    canonicalName,
    description,
    runtimeCollected: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly eight declarative metric categories.
 */
export const IntegrationObservabilityMetricCategories: readonly IntegrationObservabilityMetricCategory[] =
  Object.freeze([
    metricCategory(
      "Availability",
      "Availability",
      "Declarative category for availability-oriented metric definitions.",
      1,
    ),
    metricCategory(
      "Latency",
      "Latency",
      "Declarative category for latency-oriented metric definitions.",
      2,
    ),
    metricCategory(
      "Throughput",
      "Throughput",
      "Declarative category for throughput-oriented metric definitions.",
      3,
    ),
    metricCategory(
      "ErrorRate",
      "Error Rate",
      "Declarative category for error-rate-oriented metric definitions.",
      4,
    ),
    metricCategory(
      "SuccessRate",
      "Success Rate",
      "Declarative category for success-rate-oriented metric definitions.",
      5,
    ),
    metricCategory(
      "ResourceUsage",
      "Resource Usage",
      "Declarative category for resource-usage-oriented metric definitions.",
      6,
    ),
    metricCategory(
      "QueueDepth",
      "Queue Depth",
      "Declarative category for queue-depth-oriented metric definitions.",
      7,
    ),
    metricCategory(
      "ProcessingTime",
      "Processing Time",
      "Declarative category for processing-time-oriented metric definitions.",
      8,
    ),
  ]);
