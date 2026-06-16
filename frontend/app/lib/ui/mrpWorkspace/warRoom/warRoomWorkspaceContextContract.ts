/**
 * MRP:4F:1 — War Room workspace context contract.
 *
 * Read-only structural integration — commitment surfaces under Rule #13.
 */

export const WAR_ROOM_WORKSPACE_CONTEXT_TAG = "[MRP_WARROOM_CONTEXT]" as const;

export const WAR_ROOM_WORKSPACE_CONTEXT_VERSION = "4F.1.0";

export const WAR_ROOM_NO_OBJECT_SELECTED_LABEL = "No object selected." as const;

export type WarRoomWorkspaceContext = Readonly<{
  selectedObjectId: string | null;
  selectedObject: string;
  strategyFocus: string;
  activeDecision: string;
  commitmentStatus: string;
  hasSelection: boolean;
}>;

export type WarRoomWorkspaceContextInput = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
}>;

export const DEFAULT_WAR_ROOM_WORKSPACE_CONTEXT: WarRoomWorkspaceContext = Object.freeze({
  selectedObjectId: null,
  selectedObject: WAR_ROOM_NO_OBJECT_SELECTED_LABEL,
  strategyFocus: "Awaiting selection",
  activeDecision: "None",
  commitmentStatus: "Idle",
  hasSelection: false,
});

export const WAR_ROOM_WORKSPACE_CONTEXT_FIELD_LABELS = Object.freeze({
  selectedObject: "Selected Object",
  strategyFocus: "Strategy Focus",
  activeDecision: "Active Decision",
  commitmentStatus: "Commitment Status",
});

/** Structural fixtures for known demo object labels — not business intelligence. */
export const WAR_ROOM_KNOWN_OBJECT_FIXTURES: Readonly<
  Record<
    string,
    Readonly<{
      strategyFocus: string;
      activeDecision: string;
      commitmentStatus: string;
    }>
  >
> = Object.freeze({
  "factory a": Object.freeze({
    strategyFocus: "Operational resilience",
    activeDecision: "Capacity stabilization",
    commitmentStatus: "Planning",
  }),
  "supplier network": Object.freeze({
    strategyFocus: "Supply continuity",
    activeDecision: "Dual-source activation",
    commitmentStatus: "Monitoring",
  }),
  "production line": Object.freeze({
    strategyFocus: "Throughput recovery",
    activeDecision: "Shift reallocation",
    commitmentStatus: "In progress",
  }),
  "project alpha": Object.freeze({
    strategyFocus: "Delivery assurance",
    activeDecision: "Scope tradeoff review",
    commitmentStatus: "Awaiting approval",
  }),
});
