export type VisibleUiStateLike = {
  sceneJson: unknown;
  responseData: unknown;
  objectSelection: unknown;
  selectedObjectId: string | null;
  focusedId: string | null;
  conflicts: unknown[];
  memoryInsights: unknown;
  riskPropagation: unknown;
  strategicAdvice: unknown;
  decisionCockpit: unknown;
  opponentModel: unknown;
  strategicPatterns: unknown;
};

function sortedSceneObjectIds(sceneJson: unknown): string[] {
  const objects = Array.isArray((sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects)
    ? (sceneJson as { scene: { objects: unknown[] } }).scene.objects
    : [];
  return objects
    .map((obj, idx) => {
      const record = obj as { id?: unknown; name?: unknown; type?: unknown };
      return String(record?.id ?? record?.name ?? `${record?.type ?? "obj"}:${idx}`);
    })
    .filter(Boolean)
    .sort();
}

function selectionHighlightSignature(objectSelection: unknown): string {
  if (objectSelection == null) return "null";
  const record = objectSelection as { highlighted_objects?: unknown; focused_object?: unknown };
  const highlighted = Array.isArray(record.highlighted_objects)
    ? [...record.highlighted_objects].map(String).sort()
    : [];
  return JSON.stringify({
    focused: record.focused_object ?? null,
    highlighted,
  });
}

/** Stable visible-ui signature — ignores object identity churn when semantics match. */
export function buildVisibleUiStateSignature(state: VisibleUiStateLike): string {
  return JSON.stringify({
    sceneObjectIds: sortedSceneObjectIds(state.sceneJson),
    selectedObjectId: state.selectedObjectId ?? null,
    focusedId: state.focusedId ?? null,
    objectSelection: selectionHighlightSignature(state.objectSelection),
    conflictsLength: Array.isArray(state.conflicts) ? state.conflicts.length : 0,
    hasResponseData: Boolean(state.responseData),
    hasMemoryInsights: Boolean(state.memoryInsights),
    hasRiskPropagation: Boolean(state.riskPropagation),
    hasStrategicAdvice: Boolean(state.strategicAdvice),
    hasDecisionCockpit: Boolean(state.decisionCockpit),
    hasOpponentModel: Boolean(state.opponentModel),
    hasStrategicPatterns: Boolean(state.strategicPatterns),
  });
}

export function areVisibleUiStateSignaturesEqual(a: VisibleUiStateLike, b: VisibleUiStateLike): boolean {
  return buildVisibleUiStateSignature(a) === buildVisibleUiStateSignature(b);
}

export function shouldCommitVisibleUiState(prev: VisibleUiStateLike, next: VisibleUiStateLike): boolean {
  return !areVisibleUiStateSignaturesEqual(prev, next);
}
