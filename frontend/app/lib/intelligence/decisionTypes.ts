/**
 * Decision Intelligence — foundational literals and narrow reference types.
 *
 * Purpose: shared discriminants and source/evidence references for D4+ engines.
 * Future role: imported by recommendation builders, scenario engines, and persistence mappers.
 * Boundaries: no I/O, no scene/orchestration mutation, no panel coupling.
 */

/** Executive / system priority for ordering and escalation (explicit, not numeric magic). */
export type DecisionPriority = "p0" | "p1" | "p2" | "p3" | "deferred";

/** Ternary confidence band for human-readable surfaces (aligned with decisionConfidence.ts). */
export type DecisionConfidenceBand = "low" | "medium" | "high";

/** Typed provenance for audit and future persistence adapters. */
export type DecisionProvenanceRef = Readonly<
  | { readonly kind: "scenario"; readonly scenarioId: string }
  | { readonly kind: "ingestion"; readonly connectorId: string }
  | { readonly kind: "panel"; readonly panelKey: string }
  | { readonly kind: "memory"; readonly memoryEntryId: string }
  | { readonly kind: "manual"; readonly actorId: string }
  | { readonly kind: "system"; readonly subsystem: string }
  | { readonly kind: "adapter"; readonly adapterId: string; readonly adapterVersion: string }
>;

/** Where a signal or evidence slice originated (discriminated for explainability). */
export type DecisionSourceRef = DecisionProvenanceRef;

/** Structured metadata entries (preferred over open string maps on contracts). */
export type DecisionMetadataEntry = Readonly<{
  readonly key: string;
  readonly value: string | number | boolean;
}>;

export type DecisionSignalKind =
  | "metric"
  | "qualitative"
  | "risk"
  | "opportunity"
  | "constraint"
  | "external";

export type DecisionRecommendationLifecycleStatus =
  | "draft"
  | "candidate"
  | "selected"
  | "superseded"
  | "archived";

export type DecisionTimeHorizon = "tactical" | "operational" | "strategic";

export type DecisionRiskSeverityLabel = "low" | "medium" | "high" | "critical";

export type DecisionActionKind =
  | "investigate"
  | "approve"
  | "defer"
  | "escalate"
  | "simulate"
  | "custom";
