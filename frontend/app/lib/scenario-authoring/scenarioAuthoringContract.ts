/**
 * S:1 — Scenario Authoring contract.
 *
 * Immutable draft structures for scenario authoring. Read-only relative to DS
 * intelligence. No simulation execution, routing, or scene mutation authority.
 */

import type { ScenarioType } from "../scenario-intelligence/scenarioGenerationContract.ts";
import { SCENARIO_SUPPORTED_TYPES, SCENARIO_TYPE_LABELS } from "../scenario-intelligence/scenarioGenerationContract.ts";

export const SCENARIO_AUTHORING_CONTRACT_DIAGNOSTIC = "[SCENARIO_AUTHORING_CONTRACT]" as const;

export const SCENARIO_AUTHORING_READY_DIAGNOSTIC = "[SCENARIO_AUTHORING_READY]" as const;

export const S1_AUTHORING_CONTRACT_COMPLETE_TAG = "[S1_AUTHORING_CONTRACT_COMPLETE]" as const;

export const SCENARIO_AUTHORING_CONTRACT_VERSION = "1.0.0" as const;

export type ScenarioAuthoringType = ScenarioType;

export type ScenarioDraftValidationState = "valid" | "incomplete" | "invalid";

export type ScenarioDraftMetadata = Readonly<{
  draftId: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  source: "assistant" | "user" | "system";
  intelligenceReadOnly: true;
}>;

export type ScenarioDraftChange = Readonly<{
  changeId: string;
  field: string;
  priorValue: string | null;
  nextValue: string | null;
  changeReason: string;
  recordedAt: string;
}>;

export type ScenarioDraft = Readonly<{
  draftId: string;
  name: string;
  scenarioType: ScenarioAuthoringType;
  summary: string;
  description: string;
  assumptions: readonly string[];
  focusObjectIds: readonly string[];
  validationState: ScenarioDraftValidationState;
  validationMessages: readonly string[];
  metadata: ScenarioDraftMetadata;
  changes: readonly ScenarioDraftChange[];
  readOnlyIntelligence: true;
  simulationActive: false;
  sceneMutation: false;
  routingMutation: false;
  topologyMutation: false;
}>;

export type ScenarioAuthoringRequiredField =
  | "name"
  | "scenarioType"
  | "summary"
  | "description"
  | "assumptions"
  | "focusObjectIds";

export type ScenarioAuthoringContract = Readonly<{
  version: typeof SCENARIO_AUTHORING_CONTRACT_VERSION;
  supportedScenarioTypes: typeof SCENARIO_SUPPORTED_TYPES;
  scenarioTypeLabels: typeof SCENARIO_TYPE_LABELS;
  requiredFields: readonly ScenarioAuthoringRequiredField[];
  readOnlyIntelligence: true;
  simulationActive: false;
  sceneMutation: false;
  routingMutation: false;
  topologyMutation: false;
  diagnostics: readonly [
    typeof SCENARIO_AUTHORING_CONTRACT_DIAGNOSTIC,
    typeof SCENARIO_AUTHORING_READY_DIAGNOSTIC,
  ];
}>;

export const SCENARIO_AUTHORING_DIAGNOSTICS = Object.freeze([
  SCENARIO_AUTHORING_CONTRACT_DIAGNOSTIC,
  SCENARIO_AUTHORING_READY_DIAGNOSTIC,
] as const);

export const SCENARIO_AUTHORING_REQUIRED_FIELDS = Object.freeze([
  "name",
  "scenarioType",
  "summary",
  "description",
  "assumptions",
  "focusObjectIds",
] as const);

export const SCENARIO_AUTHORING_CONTRACT: ScenarioAuthoringContract = Object.freeze({
  version: SCENARIO_AUTHORING_CONTRACT_VERSION,
  supportedScenarioTypes: SCENARIO_SUPPORTED_TYPES,
  scenarioTypeLabels: SCENARIO_TYPE_LABELS,
  requiredFields: SCENARIO_AUTHORING_REQUIRED_FIELDS,
  readOnlyIntelligence: true,
  simulationActive: false,
  sceneMutation: false,
  routingMutation: false,
  topologyMutation: false,
  diagnostics: SCENARIO_AUTHORING_DIAGNOSTICS,
});

export type ScenarioDraftBuildInput = Readonly<{
  draftId?: string;
  name?: string;
  scenarioType?: ScenarioAuthoringType;
  summary?: string;
  description?: string;
  assumptions?: readonly string[];
  focusObjectIds?: readonly string[];
  author?: string;
  source?: ScenarioDraftMetadata["source"];
}>;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function nowIso(): string {
  return new Date().toISOString();
}

function createDraftId(): string {
  return `scenario-draft:${Date.now().toString(36)}`;
}

function resolveValidationState(input: {
  name: string;
  scenarioType: ScenarioAuthoringType | null;
  summary: string;
  focusObjectIds: readonly string[];
}): { state: ScenarioDraftValidationState; messages: readonly string[] } {
  const messages: string[] = [];
  if (!input.name) messages.push("Draft name is required.");
  if (!input.scenarioType) messages.push("Draft type is required.");
  if (!input.summary) messages.push("Draft summary is required.");
  if (input.scenarioType && input.scenarioType !== "baseline" && input.focusObjectIds.length === 0) {
    messages.push("At least one focus object is required for non-baseline drafts.");
  }
  if (messages.length === 0) return { state: "valid", messages: Object.freeze([]) };
  if (!input.name || !input.scenarioType) return { state: "invalid", messages: Object.freeze(messages) };
  return { state: "incomplete", messages: Object.freeze(messages) };
}

export function buildScenarioDraft(input: ScenarioDraftBuildInput = {}): ScenarioDraft {
  const timestamp = nowIso();
  const draftId = readString(input.draftId) || createDraftId();
  const name = readString(input.name);
  const scenarioType = input.scenarioType ?? null;
  const summary = readString(input.summary);
  const description = readString(input.description);
  const assumptions = Object.freeze(
    (input.assumptions ?? []).map((entry) => readString(entry)).filter(Boolean)
  );
  const focusObjectIds = Object.freeze(
    (input.focusObjectIds ?? []).map((entry) => readString(entry)).filter(Boolean)
  );
  const validation = resolveValidationState({
    name,
    scenarioType,
    summary,
    focusObjectIds,
  });

  return Object.freeze({
    draftId,
    name,
    scenarioType: scenarioType ?? "baseline",
    summary,
    description,
    assumptions,
    focusObjectIds,
    validationState: validation.state,
    validationMessages: validation.messages,
    metadata: Object.freeze({
      draftId,
      createdAt: timestamp,
      updatedAt: timestamp,
      author: readString(input.author) || "user",
      source: input.source ?? "user",
      intelligenceReadOnly: true as const,
    }),
    changes: Object.freeze([]),
    readOnlyIntelligence: true as const,
    simulationActive: false as const,
    sceneMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
  });
}

export function freezeScenarioDraftChange(
  input: Omit<ScenarioDraftChange, "changeId" | "recordedAt"> & {
    changeId?: string;
    recordedAt?: string;
  }
): ScenarioDraftChange {
  return Object.freeze({
    changeId: readString(input.changeId) || `change:${Date.now().toString(36)}`,
    field: input.field,
    priorValue: input.priorValue,
    nextValue: input.nextValue,
    changeReason: input.changeReason,
    recordedAt: input.recordedAt ?? nowIso(),
  });
}
