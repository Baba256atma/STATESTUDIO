/**
 * MRP:4:8 / MRP:4:9 — Operational workspace runtime state contract.
 *
 * Runtime structure only — no calculations, recommendations, or simulations.
 */

import type {
  OperationalActivityLevel,
  OperationalStatus,
} from "./operationalWorkspaceContract.ts";
import {
  DEFAULT_OPERATIONAL_OBJECT_CONTEXT,
  type OperationalObjectContext,
} from "./operationalObjectContextContract.ts";

export const OPERATIONAL_STATE_TAG = "[OPERATIONAL_STATE]" as const;
export const OPERATIONAL_RUNTIME_TAG = "[OPERATIONAL_RUNTIME]" as const;

export const OPERATIONAL_WORKSPACE_STATE_VERSION = "4.9.0";

export type OperationalWorkspaceStatePhase = "loading" | "ready" | "empty";

export type OperationalFieldSnapshot = Readonly<{
  headline: string;
  detail: string;
}>;

export type OperationalWorkspaceState = Readonly<{
  phase: OperationalWorkspaceStatePhase;
  operationalStatus: OperationalStatus;
  activityLevel: OperationalActivityLevel;
  operationalFocus: OperationalFieldSnapshot;
  operationalNotes: OperationalFieldSnapshot;
  objectContext: OperationalObjectContext;
  revision: number;
  signature: string;
}>;

export type OperationalWorkspaceStatePublishResult = Readonly<{
  changed: boolean;
  state: OperationalWorkspaceState;
  revision: number;
  guarded: boolean;
  guardReason?: string;
}>;

export const DEFAULT_OPERATIONAL_STATUS: OperationalStatus = "healthy";
export const DEFAULT_OPERATIONAL_ACTIVITY_LEVEL: OperationalActivityLevel = "medium";

export const OPERATIONAL_LOADING_HEADLINE = "Loading…";
export const OPERATIONAL_LOADING_DETAIL =
  "Retrieving operational workspace runtime state.";

export const OPERATIONAL_EMPTY_HEADLINE = "No data available";
export const OPERATIONAL_EMPTY_DETAIL =
  "Operational workspace runtime returned an empty state.";

export const DEFAULT_OPERATIONAL_FOCUS: OperationalFieldSnapshot = Object.freeze({
  headline: "No prioritized operational focus signal",
  detail: "Runtime connected — focus intelligence not wired in MRP:4:8.",
});

export const DEFAULT_OPERATIONAL_NOTES: OperationalFieldSnapshot = Object.freeze({
  headline: "No operational summary signal",
  detail: "Runtime connected — notes intelligence not wired in MRP:4:8.",
});

export const DEFAULT_OPERATIONAL_READY_STATE: OperationalWorkspaceState = Object.freeze({
  phase: "ready",
  operationalStatus: DEFAULT_OPERATIONAL_STATUS,
  activityLevel: DEFAULT_OPERATIONAL_ACTIVITY_LEVEL,
  operationalFocus: DEFAULT_OPERATIONAL_FOCUS,
  operationalNotes: DEFAULT_OPERATIONAL_NOTES,
  objectContext: DEFAULT_OPERATIONAL_OBJECT_CONTEXT,
  revision: 0,
  signature: "operational:ready:defaults",
});
