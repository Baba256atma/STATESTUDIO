/**
 * APP-1:7 — Executive Event Classification.
 * Metadata-only event classification — no business execution.
 */

import type { ExecutiveEventCategory, ExecutiveEventType } from "./executiveEventAuthorityTypes.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";

export const EXECUTIVE_EVENT_CLASSIFICATION_VERSION = "APP-1/7" as const;

export type ExecutiveEventClassificationKey =
  | "scenario"
  | "decision"
  | "kpi"
  | "risk"
  | "object"
  | "relationship"
  | "data_source"
  | "dashboard"
  | "assistant"
  | "timeline"
  | "audit"
  | "recommendation"
  | "custom";

export type ExecutiveEventClassification = Readonly<{
  key: ExecutiveEventClassificationKey;
  label: string;
  category: ExecutiveEventCategory;
  entityTypes: readonly ExecutiveTimeEntityType[];
  eventTypes: readonly ExecutiveEventType[];
}>;

const CLASSIFICATIONS: readonly ExecutiveEventClassification[] = Object.freeze([
  Object.freeze({ key: "scenario", label: "Scenario Event", category: "scenario", entityTypes: Object.freeze(["scenario"]), eventTypes: Object.freeze(["transition", "state_change", "lifecycle"]) }),
  Object.freeze({ key: "decision", label: "Decision Event", category: "decision", entityTypes: Object.freeze(["decision"]), eventTypes: Object.freeze(["transition", "state_change", "lifecycle"]) }),
  Object.freeze({ key: "kpi", label: "KPI Event", category: "kpi", entityTypes: Object.freeze(["kpi"]), eventTypes: Object.freeze(["state_change", "priority_change", "lifecycle"]) }),
  Object.freeze({ key: "risk", label: "Risk Event", category: "risk", entityTypes: Object.freeze(["risk"]), eventTypes: Object.freeze(["state_change", "priority_change", "lifecycle"]) }),
  Object.freeze({ key: "object", label: "Object Event", category: "object", entityTypes: Object.freeze(["object"]), eventTypes: Object.freeze(["state_change", "lifecycle"]) }),
  Object.freeze({ key: "relationship", label: "Relationship Event", category: "relationship", entityTypes: Object.freeze(["relationship"]), eventTypes: Object.freeze(["state_change", "lifecycle"]) }),
  Object.freeze({ key: "data_source", label: "Data Source Event", category: "data_source", entityTypes: Object.freeze(["data_source"]), eventTypes: Object.freeze(["state_change", "lifecycle"]) }),
  Object.freeze({ key: "dashboard", label: "Dashboard Event", category: "dashboard", entityTypes: Object.freeze(["dashboard"]), eventTypes: Object.freeze(["state_change", "manual"]) }),
  Object.freeze({ key: "assistant", label: "Assistant Event", category: "assistant", entityTypes: Object.freeze(["assistant"]), eventTypes: Object.freeze(["manual", "system"]) }),
  Object.freeze({ key: "timeline", label: "Timeline Event", category: "temporal", entityTypes: Object.freeze(["custom"]), eventTypes: Object.freeze(["context_shift", "camera_move", "system"]) }),
  Object.freeze({ key: "audit", label: "Audit Event", category: "platform", entityTypes: Object.freeze(["custom"]), eventTypes: Object.freeze(["audit", "system"]) }),
  Object.freeze({ key: "recommendation", label: "Recommendation Event", category: "platform", entityTypes: Object.freeze(["custom"]), eventTypes: Object.freeze(["system", "manual"]) }),
  Object.freeze({ key: "custom", label: "Custom Event", category: "platform", entityTypes: Object.freeze(["custom"]), eventTypes: Object.freeze(["manual", "system"]) }),
]);

const BY_ENTITY = Object.freeze(
  Object.fromEntries(CLASSIFICATIONS.flatMap((entry) => entry.entityTypes.map((entityType) => [entityType, entry])))
) as Partial<Record<ExecutiveTimeEntityType, ExecutiveEventClassification>>;

export function classifyExecutiveEvent(input: {
  entityType: ExecutiveTimeEntityType;
  category: ExecutiveEventCategory;
  eventType: ExecutiveEventType;
}): ExecutiveEventClassification {
  const byEntity = BY_ENTITY[input.entityType];
  if (byEntity) return byEntity;
  const byCategory = CLASSIFICATIONS.find((entry) => entry.category === input.category);
  if (byCategory) return byCategory;
  return CLASSIFICATIONS.find((entry) => entry.key === "custom")!;
}

export function listExecutiveEventClassifications(): readonly ExecutiveEventClassification[] {
  return CLASSIFICATIONS;
}
