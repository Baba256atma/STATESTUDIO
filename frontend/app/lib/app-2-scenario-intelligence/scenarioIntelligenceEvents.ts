/**
 * APP-2:1 — Scenario Intelligence event contract.
 * Architecture events only — no event bus, replay, or mutation authority.
 */

import type {
  ScenarioArchitectureEvent,
  ScenarioArchitectureEventType,
} from "./scenarioIntelligenceTypes.ts";

export const SCENARIO_INTELLIGENCE_EVENTS_VERSION = "APP-2/1" as const;

export const SCENARIO_ARCHITECTURE_EVENT_TYPES = Object.freeze([
  "scenario_created",
  "scenario_updated",
  "scenario_archived",
  "scenario_activated",
  "scenario_completed",
  "scenario_deleted",
] as const satisfies readonly ScenarioArchitectureEventType[]);

export const SCENARIO_ARCHITECTURE_EVENT_DEFINITIONS = Object.freeze([
  Object.freeze({
    eventType: "scenario_created" as const,
    label: "ScenarioCreated",
    description: "Scenario identity registered in APP-2 contract boundary.",
  }),
  Object.freeze({
    eventType: "scenario_updated" as const,
    label: "ScenarioUpdated",
    description: "Scenario metadata or references changed within contract rules.",
  }),
  Object.freeze({
    eventType: "scenario_archived" as const,
    label: "ScenarioArchived",
    description: "Scenario moved to archived lifecycle stage.",
  }),
  Object.freeze({
    eventType: "scenario_activated" as const,
    label: "ScenarioActivated",
    description: "Scenario became the active executive intelligence focus.",
  }),
  Object.freeze({
    eventType: "scenario_completed" as const,
    label: "ScenarioCompleted",
    description: "Scenario reached completed lifecycle stage.",
  }),
  Object.freeze({
    eventType: "scenario_deleted" as const,
    label: "ScenarioDeleted",
    description: "Scenario identity removed from active contract scope.",
  }),
]);

export const SCENARIO_EVENT_MANDATORY_FIELDS = Object.freeze([
  "eventType",
  "scenarioId",
  "workspaceId",
  "timestamp",
  "actor",
  "metadata",
] as const);

export function isScenarioArchitectureEventType(
  value: string
): value is ScenarioArchitectureEventType {
  return (SCENARIO_ARCHITECTURE_EVENT_TYPES as readonly string[]).includes(value);
}

export function createScenarioArchitectureEvent(
  input: ScenarioArchitectureEvent
): ScenarioArchitectureEvent {
  return Object.freeze({ ...input });
}

export function validateScenarioArchitectureEventShape(
  input: Partial<ScenarioArchitectureEvent>
): Readonly<{ valid: boolean; missing: readonly string[] }> {
  const missing = SCENARIO_EVENT_MANDATORY_FIELDS.filter(
    (field) => !(field in input) || input[field as keyof ScenarioArchitectureEvent] === undefined
  );
  if (input.eventType && !isScenarioArchitectureEventType(input.eventType)) {
    return Object.freeze({ valid: false, missing: Object.freeze(["eventType"]) });
  }
  return Object.freeze({ valid: missing.length === 0, missing: Object.freeze(missing) });
}
