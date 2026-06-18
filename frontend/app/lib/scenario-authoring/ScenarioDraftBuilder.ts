import {
  freezeScenarioDraftChange,
  type ScenarioAuthoringType,
  type ScenarioDraft,
  type ScenarioDraftChange,
} from "./scenarioAuthoringContract.ts";
import {
  EMPTY_SCENARIO_DRAFT_BUILDER_RESULT,
  SCENARIO_DRAFT_BASELINE_DRAFT_ID,
  SCENARIO_DRAFT_BASELINE_LABEL,
  SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
  SCENARIO_DRAFT_BUILDER_DIAGNOSTICS,
  SCENARIO_DRAFT_BUILDER_VERSION,
  type ScenarioDraftBaselineReference,
  type ScenarioDraftBuilderBuildInput,
  type ScenarioDraftBuilderResult,
} from "./scenarioDraftBuilderContract.ts";
import type { ScenarioInputModel, ScenarioProposedChange } from "./scenarioInputModelContract.ts";
import { SCENARIO_TYPE_LABELS } from "../scenario-intelligence/scenarioGenerationContract.ts";

let latestScenarioDraftBuilderResult: ScenarioDraftBuilderResult =
  EMPTY_SCENARIO_DRAFT_BUILDER_RESULT;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function nowIso(): string {
  return new Date().toISOString();
}

function createDraftId(): string {
  return `scenario-draft:${Date.now().toString(36)}`;
}

function inferScenarioType(inputModel: ScenarioInputModel): ScenarioAuthoringType {
  if (inputModel.riskChanges.length > 0 && inputModel.riskChanges.length >= inputModel.kpiChanges.length) {
    return "risk";
  }
  if (inputModel.kpiChanges.length > 0 && inputModel.objectChanges.length === 0) {
    return "opportunity";
  }
  if (inputModel.changeCount === 0) {
    return "baseline";
  }
  if (inputModel.objectChanges.length > 0 || inputModel.relationshipChanges.length > 0) {
    return "alternative";
  }
  return "alternative";
}

function deriveDraftName(
  input: ScenarioDraftBuilderBuildInput,
  inputModel: ScenarioInputModel,
  scenarioType: ScenarioAuthoringType
): string {
  const explicit = readString(input.name);
  if (explicit) return explicit;

  const primary =
    inputModel.objectChanges[0]?.label ??
    inputModel.relationshipChanges[0]?.label ??
    inputModel.kpiChanges[0]?.label ??
    inputModel.riskChanges[0]?.label;

  const typeLabel = SCENARIO_TYPE_LABELS[scenarioType];
  return primary ? `${typeLabel}: ${primary}` : typeLabel;
}

function deriveDraftSummary(
  input: ScenarioDraftBuilderBuildInput,
  inputModel: ScenarioInputModel,
  scenarioType: ScenarioAuthoringType
): string {
  const explicit = readString(input.summary);
  if (explicit) return explicit;

  if (inputModel.changeCount === 0) {
    return `${SCENARIO_DRAFT_BASELINE_LABEL} draft preserves current-state references without proposed changes.`;
  }

  return [
    `${SCENARIO_TYPE_LABELS[scenarioType]} draft proposes ${inputModel.changeCount} input change(s).`,
    `${inputModel.objectChanges.length} object, ${inputModel.relationshipChanges.length} relationship, ${inputModel.kpiChanges.length} KPI, and ${inputModel.riskChanges.length} risk change(s).`,
    `Baseline reference preserved: ${SCENARIO_DRAFT_BASELINE_SCENARIO_ID}.`,
  ].join(" ");
}

function deriveDescription(
  input: ScenarioDraftBuilderBuildInput,
  inputModel: ScenarioInputModel
): string {
  const explicit = readString(input.description);
  if (explicit) return explicit;

  if (inputModel.proposedChanges.length === 0) {
    return `Draft anchored to ${SCENARIO_DRAFT_BASELINE_LABEL} (${SCENARIO_DRAFT_BASELINE_SCENARIO_ID}).`;
  }

  return inputModel.proposedChanges
    .slice(0, 4)
    .map((change) => `${change.label}: ${change.field} -> ${change.proposedValue}`)
    .join(" ");
}

function collectFocusObjectIds(inputModel: ScenarioInputModel): readonly string[] {
  const ids = new Set<string>();
  for (const change of inputModel.objectChanges) {
    ids.add(change.targetId);
  }
  return Object.freeze([...ids]);
}

function collectAssumptions(inputModel: ScenarioInputModel): readonly string[] {
  const assumptions = new Set<string>([
    `Baseline reference preserved: ${SCENARIO_DRAFT_BASELINE_SCENARIO_ID} (${SCENARIO_DRAFT_BASELINE_DRAFT_ID}).`,
  ]);
  for (const change of inputModel.proposedChanges) {
    if (change.rationale) assumptions.add(change.rationale);
  }
  return Object.freeze([...assumptions]);
}

function mapDraftChanges(changes: readonly ScenarioProposedChange[]): readonly ScenarioDraftChange[] {
  return Object.freeze(
    changes.map((change) =>
      freezeScenarioDraftChange({
        changeId: change.changeId,
        field: `${change.kind}.${change.field}`,
        priorValue: null,
        nextValue: change.proposedValue,
        changeReason: change.rationale,
        recordedAt: change.recordedAt,
      })
    )
  );
}

function resolveValidationState(draft: {
  name: string;
  summary: string;
  scenarioType: ScenarioAuthoringType;
  focusObjectIds: readonly string[];
}): { state: ScenarioDraft["validationState"]; messages: readonly string[] } {
  const messages: string[] = [];
  if (!draft.name) messages.push("Draft name is required.");
  if (!draft.summary) messages.push("Draft summary is required.");
  if (draft.scenarioType !== "baseline" && draft.focusObjectIds.length === 0) {
    messages.push("At least one focus object is required for non-baseline drafts.");
  }
  if (messages.length === 0) return { state: "valid", messages: Object.freeze([]) };
  if (!draft.name || !draft.summary) return { state: "invalid", messages: Object.freeze(messages) };
  return { state: "incomplete", messages: Object.freeze(messages) };
}

function buildBaselineReference(inputModel: ScenarioInputModel): ScenarioDraftBaselineReference {
  return Object.freeze({
    baselineScenarioId: SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
    baselineDraftId: SCENARIO_DRAFT_BASELINE_DRAFT_ID,
    baselineLabel: SCENARIO_DRAFT_BASELINE_LABEL,
    inputModelId: inputModel.inputModelId,
    preserved: true as const,
  });
}

function buildDraftRecord(input: ScenarioDraftBuilderBuildInput): ScenarioDraft {
  const inputModel = input.inputModel;
  const timestamp = nowIso();
  const draftId = readString(input.draftId) || readString(inputModel.draftId) || createDraftId();
  const scenarioType = input.scenarioType ?? inferScenarioType(inputModel);
  const name = deriveDraftName(input, inputModel, scenarioType);
  const summary = deriveDraftSummary(input, inputModel, scenarioType);
  const description = deriveDescription(input, inputModel);
  const focusObjectIds = collectFocusObjectIds(inputModel);
  const assumptions = collectAssumptions(inputModel);
  const changes = mapDraftChanges(inputModel.proposedChanges);
  const validation = resolveValidationState({ name, summary, scenarioType, focusObjectIds });

  return Object.freeze({
    draftId,
    name,
    scenarioType,
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
      author: readString(input.author) || "system",
      source: input.source ?? "system",
      intelligenceReadOnly: true as const,
    }),
    changes,
    readOnlyIntelligence: true as const,
    simulationActive: false as const,
    sceneMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
  });
}

export function buildScenarioDraftFromInput(
  input: ScenarioDraftBuilderBuildInput
): ScenarioDraftBuilderResult {
  if (input.inputModel.changeCount === 0 && !readString(input.draftId) && !readString(input.name)) {
    latestScenarioDraftBuilderResult = EMPTY_SCENARIO_DRAFT_BUILDER_RESULT;
    return latestScenarioDraftBuilderResult;
  }

  const draft = buildDraftRecord(input);
  const baselineReference = buildBaselineReference(input.inputModel);

  const result = Object.freeze({
    version: SCENARIO_DRAFT_BUILDER_VERSION,
    draft,
    draftId: draft.draftId,
    draftName: draft.name,
    draftSummary: draft.summary,
    draftMetadata: draft.metadata,
    baselineReference,
    inputModel: input.inputModel,
    builderSummary: [
      "Scenario draft builder converted input model to draft.",
      `Draft ${draft.draftId} references baseline ${baselineReference.baselineScenarioId}.`,
      `Validation state: ${draft.validationState}.`,
    ].join(" "),
    simulationActive: false as const,
    executionActive: false as const,
    dsMutation: false as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    diagnostics: SCENARIO_DRAFT_BUILDER_DIAGNOSTICS,
  });

  latestScenarioDraftBuilderResult = result;
  return result;
}

export function getScenarioDraftBuilderResult(): ScenarioDraftBuilderResult {
  return latestScenarioDraftBuilderResult;
}

export function resetScenarioDraftBuilderForTests(): void {
  latestScenarioDraftBuilderResult = EMPTY_SCENARIO_DRAFT_BUILDER_RESULT;
}

export const ScenarioDraftBuilder = Object.freeze({
  buildScenarioDraftFromInput,
  getScenarioDraftBuilderResult,
  resetScenarioDraftBuilderForTests,
});
