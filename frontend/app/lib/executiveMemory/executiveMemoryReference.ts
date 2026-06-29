/**
 * APP-4:2 — Executive Memory reference contracts.
 * Identifier-only references to future Nexora modules — no object loading.
 */

import type { ExecutiveMemoryId, ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";

export type ExecutiveMemoryReferenceType =
  | "goal"
  | "intent"
  | "scenario"
  | "decision"
  | "object"
  | "relationship"
  | "kpi"
  | "risk"
  | "timeline"
  | "data_source"
  | "workspace"
  | "report"
  | "assistant_session"
  | "evidence"
  | "custom";

export type ExecutiveMemoryReference = Readonly<{
  referenceId: string;
  referenceType: ExecutiveMemoryReferenceType;
  targetId: string;
  label: string;
  module: string | null;
  workspaceId: ExecutiveMemoryWorkspaceId | null;
  readOnly: true;
}>;

export type ExecutiveMemoryObjectReference = Readonly<{
  objectReferenceId: string;
  objectId: string;
  objectType: string;
  label: string;
  workspaceId: ExecutiveMemoryWorkspaceId;
  readOnly: true;
}>;

export type ExecutiveMemoryTimelineReference = Readonly<{
  timelineReferenceId: string;
  timelineEventId: string;
  anchorLabel: string;
  timestamp: string | null;
  readOnly: true;
}>;

export type ExecutiveMemoryRelationship = Readonly<{
  relationshipId: string;
  sourceMemoryId: ExecutiveMemoryId;
  targetMemoryId: ExecutiveMemoryId;
  relationType: string;
  label: string;
  readOnly: true;
}>;

export function createExecutiveMemoryReference(
  input: Omit<ExecutiveMemoryReference, "readOnly">
): ExecutiveMemoryReference {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMemoryObjectReference(
  input: Omit<ExecutiveMemoryObjectReference, "readOnly">
): ExecutiveMemoryObjectReference {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMemoryTimelineReference(
  input: Omit<ExecutiveMemoryTimelineReference, "readOnly">
): ExecutiveMemoryTimelineReference {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMemoryRelationship(
  input: Omit<ExecutiveMemoryRelationship, "readOnly">
): ExecutiveMemoryRelationship {
  return Object.freeze({ ...input, readOnly: true as const });
}
