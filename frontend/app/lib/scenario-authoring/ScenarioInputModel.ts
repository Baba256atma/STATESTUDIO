import {
  EMPTY_SCENARIO_INPUT_MODEL,
  SCENARIO_INPUT_MODEL_DIAGNOSTICS,
  SCENARIO_INPUT_MODEL_VERSION,
  type ScenarioInputChangeKind,
  type ScenarioInputModel,
  type ScenarioInputModelBuildInput,
  type ScenarioKpiChange,
  type ScenarioObjectChange,
  type ScenarioProposedChange,
  type ScenarioProposedChangeInput,
  type ScenarioRelationshipChange,
  type ScenarioRiskChange,
} from "./scenarioInputModelContract.ts";

let latestScenarioInputModel: ScenarioInputModel = EMPTY_SCENARIO_INPUT_MODEL;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function nowIso(): string {
  return new Date().toISOString();
}

function createInputModelId(): string {
  return `scenario-input:${Date.now().toString(36)}`;
}

function createChangeId(kind: ScenarioInputChangeKind): string {
  return `${kind}-change:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 6)}`;
}

function freezeProposedChange<K extends ScenarioInputChangeKind>(
  kind: K,
  input: ScenarioProposedChangeInput
): ScenarioProposedChange & Readonly<{ kind: K }> {
  const targetId = readString(input.targetId);
  const field = readString(input.field);
  const proposedValue = readString(input.proposedValue);
  return Object.freeze({
    changeId: readString(input.changeId) || createChangeId(kind),
    kind,
    targetId,
    label: readString(input.label) || targetId,
    field,
    proposedValue,
    rationale: readString(input.rationale) || "Proposed scenario input change.",
    recordedAt: input.recordedAt ?? nowIso(),
  }) as ScenarioProposedChange & Readonly<{ kind: K }>;
}

function freezeChanges<K extends ScenarioInputChangeKind>(
  kind: K,
  entries: readonly ScenarioProposedChangeInput[] | undefined
): readonly (ScenarioProposedChange & Readonly<{ kind: K }>)[] {
  if (!entries || entries.length === 0) return Object.freeze([]);
  return Object.freeze(
    entries
      .map((entry) => freezeProposedChange(kind, entry))
      .filter((entry) => entry.targetId && entry.field)
  );
}

export function buildScenarioInputModel(
  input: ScenarioInputModelBuildInput = {}
): ScenarioInputModel {
  const objectChanges = freezeChanges("object", input.objectChanges) as readonly ScenarioObjectChange[];
  const relationshipChanges = freezeChanges(
    "relationship",
    input.relationshipChanges
  ) as readonly ScenarioRelationshipChange[];
  const kpiChanges = freezeChanges("kpi", input.kpiChanges) as readonly ScenarioKpiChange[];
  const riskChanges = freezeChanges("risk", input.riskChanges) as readonly ScenarioRiskChange[];
  const proposedChanges = Object.freeze([
    ...objectChanges,
    ...relationshipChanges,
    ...kpiChanges,
    ...riskChanges,
  ]);

  if (proposedChanges.length === 0 && !readString(input.draftId)) {
    latestScenarioInputModel = EMPTY_SCENARIO_INPUT_MODEL;
    return latestScenarioInputModel;
  }

  const model = Object.freeze({
    version: SCENARIO_INPUT_MODEL_VERSION,
    inputModelId: readString(input.inputModelId) || createInputModelId(),
    draftId: readString(input.draftId),
    objectChanges,
    relationshipChanges,
    kpiChanges,
    riskChanges,
    proposedChanges,
    changeCount: proposedChanges.length,
    draftOnly: true as const,
    executionActive: false as const,
    simulationActive: false as const,
    dsMutation: false as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    diagnostics: SCENARIO_INPUT_MODEL_DIAGNOSTICS,
  });

  latestScenarioInputModel = model;
  return model;
}

export function serializeScenarioInputModel(model: ScenarioInputModel): string {
  return JSON.stringify({
    version: model.version,
    inputModelId: model.inputModelId,
    draftId: model.draftId,
    objectChanges: model.objectChanges,
    relationshipChanges: model.relationshipChanges,
    kpiChanges: model.kpiChanges,
    riskChanges: model.riskChanges,
    proposedChanges: model.proposedChanges,
    changeCount: model.changeCount,
    draftOnly: model.draftOnly,
    executionActive: model.executionActive,
    simulationActive: model.simulationActive,
    dsMutation: model.dsMutation,
    sceneMutation: model.sceneMutation,
    objectMutation: model.objectMutation,
    routingMutation: model.routingMutation,
    topologyMutation: model.topologyMutation,
    diagnostics: model.diagnostics,
  });
}

function isProposedChange(value: unknown): value is ScenarioProposedChange {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const kind = record.kind;
  return (
    (kind === "object" ||
      kind === "relationship" ||
      kind === "kpi" ||
      kind === "risk") &&
    typeof record.changeId === "string" &&
    typeof record.targetId === "string" &&
    typeof record.field === "string" &&
    typeof record.proposedValue === "string"
  );
}

function partitionChanges(changes: readonly ScenarioProposedChange[]): {
  objectChanges: readonly ScenarioObjectChange[];
  relationshipChanges: readonly ScenarioRelationshipChange[];
  kpiChanges: readonly ScenarioKpiChange[];
  riskChanges: readonly ScenarioRiskChange[];
} {
  const objectChanges: ScenarioObjectChange[] = [];
  const relationshipChanges: ScenarioRelationshipChange[] = [];
  const kpiChanges: ScenarioKpiChange[] = [];
  const riskChanges: ScenarioRiskChange[] = [];

  for (const change of changes) {
    if (change.kind === "object") objectChanges.push(change);
    if (change.kind === "relationship") relationshipChanges.push(change);
    if (change.kind === "kpi") kpiChanges.push(change);
    if (change.kind === "risk") riskChanges.push(change);
  }

  return {
    objectChanges: Object.freeze(objectChanges),
    relationshipChanges: Object.freeze(relationshipChanges),
    kpiChanges: Object.freeze(kpiChanges),
    riskChanges: Object.freeze(riskChanges),
  };
}

export function deserializeScenarioInputModel(payload: string): ScenarioInputModel {
  const parsed = JSON.parse(payload) as Record<string, unknown>;
  const proposed = Array.isArray(parsed.proposedChanges)
    ? parsed.proposedChanges.filter(isProposedChange)
    : [];
  const partitioned = partitionChanges(Object.freeze(proposed));

  return Object.freeze({
    version: SCENARIO_INPUT_MODEL_VERSION,
    inputModelId: readString(parsed.inputModelId) || createInputModelId(),
    draftId: readString(parsed.draftId),
    objectChanges: partitioned.objectChanges,
    relationshipChanges: partitioned.relationshipChanges,
    kpiChanges: partitioned.kpiChanges,
    riskChanges: partitioned.riskChanges,
    proposedChanges: Object.freeze(proposed),
    changeCount: proposed.length,
    draftOnly: true as const,
    executionActive: false as const,
    simulationActive: false as const,
    dsMutation: false as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    diagnostics: SCENARIO_INPUT_MODEL_DIAGNOSTICS,
  });
}

export function getScenarioInputModel(): ScenarioInputModel {
  return latestScenarioInputModel;
}

export function resetScenarioInputModelForTests(): void {
  latestScenarioInputModel = EMPTY_SCENARIO_INPUT_MODEL;
}

export const ScenarioInputModelRuntime = Object.freeze({
  buildScenarioInputModel,
  serializeScenarioInputModel,
  deserializeScenarioInputModel,
  getScenarioInputModel,
  resetScenarioInputModelForTests,
});
