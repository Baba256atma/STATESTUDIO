import { listScenarioDraftRegistryEntries } from "../../../scenario-authoring/ScenarioDraftRegistry.ts";
import type { ScenarioDraftRegistryEntry } from "../../../scenario-authoring/scenarioDraftRegistryContract.ts";
import { validateScenarioDraft } from "../../../scenario-authoring/ScenarioValidationEngine.ts";
import { SCENARIO_TYPE_LABELS } from "../../../scenario-intelligence/scenarioGenerationContract.ts";
import type { ScenarioDraftValidationState } from "../../../scenario-authoring/scenarioAuthoringContract.ts";
import {
  EMPTY_SCENARIO_AUTHORING_DRAFT_VIEW,
  EMPTY_SCENARIO_AUTHORING_UI_VIEW,
  SCENARIO_AUTHORING_UI_DIAGNOSTICS,
  SCENARIO_AUTHORING_UI_VERSION,
  type ScenarioAuthoringDraftView,
  type ScenarioAuthoringUiPhase,
  type ScenarioAuthoringUiSyncInput,
  type ScenarioAuthoringUiView,
} from "./scenarioAuthoringUiContract.ts";

const listeners = new Set<() => void>();
const loggedBindingKeys = new Set<string>();

let revision = 0;
let view: ScenarioAuthoringUiView = EMPTY_SCENARIO_AUTHORING_UI_VIEW;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validationLabel(state: ScenarioDraftValidationState): string {
  if (state === "valid") return "Valid";
  if (state === "invalid") return "Invalid";
  return "Incomplete";
}

function resolvePhase(hasDraft: boolean): ScenarioAuthoringUiPhase {
  return hasDraft ? "ready" : "empty";
}

function pickDraftEntry(
  entries: readonly ScenarioDraftRegistryEntry[],
  selectedObjectId: string | null
): ScenarioDraftRegistryEntry | null {
  if (entries.length === 0) return null;

  if (selectedObjectId) {
    const matched = entries.filter((entry) =>
      entry.draft.focusObjectIds.includes(selectedObjectId)
    );
    if (matched.length > 0) {
      return [...matched].sort((left, right) =>
        right.draft.metadata.updatedAt.localeCompare(left.draft.metadata.updatedAt)
      )[0]!;
    }
  }

  return [...entries].sort((left, right) =>
    right.draft.metadata.updatedAt.localeCompare(left.draft.metadata.updatedAt)
  )[0]!;
}

function buildDraftView(
  entry: ScenarioDraftRegistryEntry | null,
  activeDraftCount: number,
  selectedObjectId: string | null
): ScenarioAuthoringDraftView {
  if (!entry) {
    return Object.freeze({
      ...EMPTY_SCENARIO_AUTHORING_DRAFT_VIEW,
      activeDraftCount,
    });
  }

  const validation = validateScenarioDraft({
    draft: entry.draft,
    referenceCatalog: selectedObjectId
      ? { objectIds: [selectedObjectId] }
      : undefined,
  });
  const validationState = validation.validationState;

  return Object.freeze({
    draftId: entry.draft.draftId,
    draftName: entry.draft.name,
    draftType: SCENARIO_TYPE_LABELS[entry.draft.scenarioType],
    draftSummary: entry.draft.summary,
    validationState,
    validationLabel: validationLabel(validationState),
    hasDraft: true,
    activeDraftCount,
  });
}

function buildBindingSummary(draft: ScenarioAuthoringDraftView): string {
  if (!draft.hasDraft) {
    return "Scenario authoring UI bound to Scenario workspace — no active draft persisted.";
  }
  return [
    `Scenario authoring UI displaying draft ${draft.draftId}.`,
    `Validation state: ${draft.validationLabel}.`,
    `${draft.activeDraftCount} active draft(s) in registry.`,
  ].join(" ");
}

function publish(next: Omit<ScenarioAuthoringUiView, "revision">): void {
  revision += 1;
  view = Object.freeze({ ...next, revision });
  for (const listener of listeners) listener();
}

export function syncScenarioAuthoringUi(input: ScenarioAuthoringUiSyncInput = {}): ScenarioAuthoringUiView {
  const selectedObjectId = readString(input.selectedObjectId) || null;
  const entries = listScenarioDraftRegistryEntries({ includeArchived: false });
  const entry = pickDraftEntry(entries, selectedObjectId);
  const draft = buildDraftView(entry, entries.length, selectedObjectId);
  const phase = resolvePhase(draft.hasDraft);

  publish(
    Object.freeze({
      version: SCENARIO_AUTHORING_UI_VERSION,
      phase,
      draft,
      bindingSummary: buildBindingSummary(draft),
      draftsOnly: true as const,
      simulationActive: false as const,
      simulationResultsStored: false as const,
      dsMutation: false as const,
      intelligenceMutation: false as const,
      sceneMutation: false as const,
      routingMutation: false as const,
      topologyMutation: false as const,
      diagnostics: SCENARIO_AUTHORING_UI_DIAGNOSTICS,
    })
  );
  return view;
}

export function hydrateScenarioAuthoringUiOnMount(mountKey?: string | null): ScenarioAuthoringUiView {
  traceScenarioAuthoringUiOnce(mountKey);
  return syncScenarioAuthoringUi({});
}

export function getScenarioAuthoringUiView(): ScenarioAuthoringUiView {
  return view;
}

export function getScenarioAuthoringUiRevision(): number {
  return revision;
}

export function getScenarioAuthoringUiServerSnapshot(): ScenarioAuthoringUiView {
  return EMPTY_SCENARIO_AUTHORING_UI_VIEW;
}

export function subscribeScenarioAuthoringUi(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function traceScenarioAuthoringUiOnce(mountKey?: string | null): void {
  const key = mountKey ?? "default";
  if (loggedBindingKeys.has(key)) return;
  loggedBindingKeys.add(key);
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.(SCENARIO_AUTHORING_UI_DIAGNOSTICS[0], {
    action: "ui_binding_ready",
    version: SCENARIO_AUTHORING_UI_VERSION,
    mountKey,
    tag: SCENARIO_AUTHORING_UI_DIAGNOSTICS[1],
  });
}

export function resetScenarioAuthoringUiRuntimeForTests(): void {
  listeners.clear();
  loggedBindingKeys.clear();
  revision = 0;
  view = EMPTY_SCENARIO_AUTHORING_UI_VIEW;
}
