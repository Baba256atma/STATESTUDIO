/**
 * EIL-6:1 — Integration Observability Event Categories.
 *
 * Immutable event-category declarations only.
 * No event streaming. No brokers. No runtime emission.
 *
 * Ownership: owned exclusively by EIL-6:1.
 */

/** Closed event-category vocabulary. */
export type ObservabilityEventCategoryKey =
  | "IntegrationStarted"
  | "IntegrationCompleted"
  | "IntegrationFailed"
  | "ValidationEvent"
  | "RetryEvent"
  | "TimeoutEvent"
  | "HealthEvent"
  | "DiagnosticEvent";

/** Immutable event-category descriptor. */
export interface IntegrationObservabilityEventCategory {
  readonly categoryId: `EIL-6:1/EventCategory/${ObservabilityEventCategoryKey}`;
  readonly categoryKey: ObservabilityEventCategoryKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly runtimeEmitted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const eventCategory = (
  categoryKey: ObservabilityEventCategoryKey,
  canonicalName: string,
  description: string,
  order: number,
): IntegrationObservabilityEventCategory =>
  Object.freeze({
    categoryId: `EIL-6:1/EventCategory/${categoryKey}` as const,
    categoryKey,
    canonicalName,
    description,
    runtimeEmitted: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly eight declarative event categories.
 */
export const IntegrationObservabilityEventCategories: readonly IntegrationObservabilityEventCategory[] =
  Object.freeze([
    eventCategory(
      "IntegrationStarted",
      "Integration Started",
      "Declarative category for integration-started event definitions.",
      1,
    ),
    eventCategory(
      "IntegrationCompleted",
      "Integration Completed",
      "Declarative category for integration-completed event definitions.",
      2,
    ),
    eventCategory(
      "IntegrationFailed",
      "Integration Failed",
      "Declarative category for integration-failed event definitions.",
      3,
    ),
    eventCategory(
      "ValidationEvent",
      "Validation Event",
      "Declarative category for validation-oriented event definitions.",
      4,
    ),
    eventCategory(
      "RetryEvent",
      "Retry Event",
      "Declarative category for retry-oriented event definitions.",
      5,
    ),
    eventCategory(
      "TimeoutEvent",
      "Timeout Event",
      "Declarative category for timeout-oriented event definitions.",
      6,
    ),
    eventCategory(
      "HealthEvent",
      "Health Event",
      "Declarative category for health-oriented event definitions.",
      7,
    ),
    eventCategory(
      "DiagnosticEvent",
      "Diagnostic Event",
      "Declarative category for diagnostic-oriented event definitions.",
      8,
    ),
  ]);
