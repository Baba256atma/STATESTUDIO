/**
 * MRP:4:9 — Operational workspace object context contract.
 *
 * Read-only structural integration — no business calculations or AI.
 */

import { DEFAULT_MRP_SELECTED_OBJECT } from "../../mrpContext/mrpContextStoreContract.ts";

export const OPERATIONAL_OBJECT_CONTEXT_TAG = "[OPERATIONAL_OBJECT_CONTEXT]" as const;

export const OPERATIONAL_OBJECT_CONTEXT_VERSION = "4.9.0";

export type OperationalObjectContext = Readonly<{
  selectedObjectId: string | null;
  selectedObject: string;
  objectOperationalStatus: string;
  objectActivityLevel: string;
  objectAttentionPriority: string;
  hasSelection: boolean;
}>;

export type OperationalObjectContextInput = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
}>;

export const DEFAULT_OPERATIONAL_OBJECT_CONTEXT: OperationalObjectContext = Object.freeze({
  selectedObjectId: null,
  selectedObject: DEFAULT_MRP_SELECTED_OBJECT,
  objectOperationalStatus: "Awaiting selection",
  objectActivityLevel: "None",
  objectAttentionPriority: "None",
  hasSelection: false,
});

export const OPERATIONAL_OBJECT_CONTEXT_FIELD_LABELS = Object.freeze({
  selectedObject: "Selected Object",
  objectOperationalStatus: "Object Operational Status",
  objectActivityLevel: "Object Activity Level",
  objectAttentionPriority: "Object Attention Priority",
});

/** Structural fixtures for known demo object labels — not business intelligence. */
export const OPERATIONAL_KNOWN_OBJECT_FIXTURES: Readonly<
  Record<
    string,
    Readonly<{
      objectOperationalStatus: string;
      objectActivityLevel: string;
      objectAttentionPriority: string;
    }>
  >
> = Object.freeze({
  "factory a": Object.freeze({
    objectOperationalStatus: "Running",
    objectActivityLevel: "High",
    objectAttentionPriority: "Elevated",
  }),
  "supplier network": Object.freeze({
    objectOperationalStatus: "Monitoring",
    objectActivityLevel: "Medium",
    objectAttentionPriority: "Watch",
  }),
  "production line": Object.freeze({
    objectOperationalStatus: "Active",
    objectActivityLevel: "High",
    objectAttentionPriority: "Focused",
  }),
  "project alpha": Object.freeze({
    objectOperationalStatus: "In Progress",
    objectActivityLevel: "Medium",
    objectAttentionPriority: "Priority",
  }),
});
