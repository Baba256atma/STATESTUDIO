/**
 * MRP:4:3 — Executive Summary object context contract.
 *
 * Read-only structural integration — no business calculations or AI.
 */

import { DEFAULT_MRP_SELECTED_OBJECT } from "../../mrpContext/mrpContextStoreContract.ts";

export const EXEC_SUMMARY_OBJECT_CONTEXT_TAG = "[EXEC_SUMMARY_OBJECT_CONTEXT]" as const;

export const EXECUTIVE_SUMMARY_OBJECT_CONTEXT_VERSION = "4.3.0";

export type ExecutiveSummaryObjectContext = Readonly<{
  selectedObjectId: string | null;
  selectedObject: string;
  objectStatus: string;
  objectPriority: string;
  objectAttentionLevel: string;
  hasSelection: boolean;
}>;

export type ExecutiveSummaryObjectContextInput = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
}>;

export const DEFAULT_EXECUTIVE_SUMMARY_OBJECT_CONTEXT: ExecutiveSummaryObjectContext =
  Object.freeze({
    selectedObjectId: null,
    selectedObject: DEFAULT_MRP_SELECTED_OBJECT,
    objectStatus: "Awaiting selection",
    objectPriority: "None",
    objectAttentionLevel: "None",
    hasSelection: false,
  });

export const EXECUTIVE_SUMMARY_OBJECT_CONTEXT_FIELD_LABELS = Object.freeze({
  selectedObject: "Selected Object",
  objectStatus: "Object Status",
  objectPriority: "Object Priority",
  objectAttentionLevel: "Object Attention Level",
});

/** Structural fixtures for known demo object labels — not business intelligence. */
export const EXECUTIVE_SUMMARY_KNOWN_OBJECT_FIXTURES: Readonly<
  Record<
    string,
    Readonly<{
      objectStatus: string;
      objectPriority: string;
      objectAttentionLevel: string;
    }>
  >
> = Object.freeze({
  "factory a": Object.freeze({
    objectStatus: "Operational",
    objectPriority: "High",
    objectAttentionLevel: "Elevated",
  }),
  "supplier network": Object.freeze({
    objectStatus: "Monitoring",
    objectPriority: "Medium",
    objectAttentionLevel: "Watch",
  }),
  "production line": Object.freeze({
    objectStatus: "Active",
    objectPriority: "High",
    objectAttentionLevel: "Focused",
  }),
});
