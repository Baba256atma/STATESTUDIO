/**
 * MRP:5A:1 — Advisory workspace context contract.
 *
 * Read-only structural integration — recommendation surfaces under Rule #14.
 */

export const ADVISORY_WORKSPACE_CONTEXT_TAG = "[MRP_ADVISORY_CONTEXT]" as const;

export const ADVISORY_WORKSPACE_CONTEXT_VERSION = "5A.1.0";

export const ADVISORY_NO_OBJECT_SELECTED_LABEL = "No object selected." as const;

export type AdvisoryWorkspaceContext = Readonly<{
  selectedObjectId: string | null;
  selectedObject: string;
  recommendationFocus: string;
  confidenceLevel: string;
  reviewScope: string;
  hasSelection: boolean;
}>;

export type AdvisoryWorkspaceContextInput = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
}>;

export const DEFAULT_ADVISORY_WORKSPACE_CONTEXT: AdvisoryWorkspaceContext = Object.freeze({
  selectedObjectId: null,
  selectedObject: ADVISORY_NO_OBJECT_SELECTED_LABEL,
  recommendationFocus: "Awaiting selection",
  confidenceLevel: "Not evaluated",
  reviewScope: "None",
  hasSelection: false,
});

export const ADVISORY_WORKSPACE_CONTEXT_FIELD_LABELS = Object.freeze({
  selectedObject: "Selected Object",
  recommendationFocus: "Recommendation Focus",
  confidenceLevel: "Confidence Level",
  reviewScope: "Review Scope",
});

/** Structural fixtures for known demo object labels — not business intelligence. */
export const ADVISORY_KNOWN_OBJECT_FIXTURES: Readonly<
  Record<
    string,
    Readonly<{
      recommendationFocus: string;
      confidenceLevel: string;
      reviewScope: string;
    }>
  >
> = Object.freeze({
  "factory a": Object.freeze({
    recommendationFocus: "Capacity stabilization",
    confidenceLevel: "Moderate",
    reviewScope: "Operational recovery",
  }),
  "supplier network": Object.freeze({
    recommendationFocus: "Dual-source activation",
    confidenceLevel: "High",
    reviewScope: "Supply continuity",
  }),
  "production line": Object.freeze({
    recommendationFocus: "Shift reallocation",
    confidenceLevel: "Moderate",
    reviewScope: "Throughput recovery",
  }),
  "project alpha": Object.freeze({
    recommendationFocus: "Scope tradeoff review",
    confidenceLevel: "Low",
    reviewScope: "Delivery assurance",
  }),
});
