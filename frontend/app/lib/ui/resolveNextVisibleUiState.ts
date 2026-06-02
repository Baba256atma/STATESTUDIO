import type { SceneJson } from "../sceneTypes";
import {
  asRecord,
  hasMeaningfulSelectionForVisibleState,
  hasRenderableResponseForVisibleState,
  hasRenderableSceneForVisibleState,
} from "../../screens/homeScreenResponseReaders";
import type { VisibleUiStateLike } from "./visibleUiStateSignature";

export type ResolveNextVisibleUiStateInput = {
  prev: VisibleUiStateLike;
  sceneJson: SceneJson | null;
  guardedResponseData: unknown;
  objectSelection: unknown;
  selectedObjectIdState: string | null;
  focusedId: string | null;
  conflicts: unknown[];
  memoryInsights: unknown;
  riskPropagation: unknown;
  strategicAdvice: unknown;
  decisionCockpit: unknown;
  opponentModel: unknown;
  strategicPatterns: unknown;
  submitActive: boolean;
};

function countSceneObjects(sceneJson: SceneJson | null | unknown): number {
  return Array.isArray((sceneJson as SceneJson | null)?.scene?.objects)
    ? ((sceneJson as SceneJson).scene.objects as unknown[]).length
    : 0;
}

export function preserveFullSceneObjects(
  incomingScene: SceneJson | null,
  previousVisibleScene: SceneJson | null
): SceneJson | null {
  const incomingCount = countSceneObjects(incomingScene);
  const previousCount = countSceneObjects(previousVisibleScene);

  if (incomingCount >= 2) return incomingScene;
  if (incomingCount === 1 && previousCount > incomingCount) return previousVisibleScene;
  return incomingScene;
}

export function resolveNextVisibleUiState(input: ResolveNextVisibleUiStateInput): VisibleUiStateLike {
  const { prev, submitActive } = input;
  const candidateSceneJson = hasRenderableSceneForVisibleState(input.sceneJson)
    ? input.sceneJson
    : submitActive
      ? (prev.sceneJson as SceneJson | null)
      : input.sceneJson;
  const nextSceneJson = preserveFullSceneObjects(
    (candidateSceneJson ?? null) as SceneJson | null,
    (prev.sceneJson ?? null) as SceneJson | null
  );
  const nextResponseData = hasRenderableResponseForVisibleState(input.guardedResponseData)
    ? input.guardedResponseData
    : submitActive
      ? prev.responseData
      : input.guardedResponseData;
  const nextObjectSelection = hasMeaningfulSelectionForVisibleState(input.objectSelection)
    ? input.objectSelection
    : submitActive
      ? prev.objectSelection
      : !hasMeaningfulSelectionForVisibleState(prev.objectSelection) &&
          !hasMeaningfulSelectionForVisibleState(input.objectSelection)
        ? prev.objectSelection
        : input.objectSelection;
  const nextSelectedObjectId =
    typeof input.selectedObjectIdState === "string" && input.selectedObjectIdState.trim().length > 0
      ? input.selectedObjectIdState
      : submitActive
        ? prev.selectedObjectId
        : input.selectedObjectIdState ?? null;
  const nextFocusedId =
    typeof input.focusedId === "string" && input.focusedId.trim().length > 0
      ? input.focusedId
      : submitActive
        ? prev.focusedId
        : input.focusedId ?? null;
  const rawConflicts = Array.isArray(input.conflicts) ? input.conflicts : [];
  const nextConflicts =
    rawConflicts.length > 0
      ? input.conflicts
      : submitActive
        ? prev.conflicts
        : prev.conflicts.length === 0
          ? prev.conflicts
          : rawConflicts;

  return {
    sceneJson: nextSceneJson as SceneJson | null,
    responseData: nextResponseData,
    objectSelection: nextObjectSelection,
    selectedObjectId: nextSelectedObjectId,
    focusedId: nextFocusedId,
    conflicts: nextConflicts as unknown[],
    memoryInsights: asRecord(input.memoryInsights)
      ? input.memoryInsights
      : submitActive
        ? prev.memoryInsights
        : input.memoryInsights,
    riskPropagation: asRecord(input.riskPropagation)
      ? input.riskPropagation
      : submitActive
        ? prev.riskPropagation
        : input.riskPropagation,
    strategicAdvice: asRecord(input.strategicAdvice)
      ? input.strategicAdvice
      : submitActive
        ? prev.strategicAdvice
        : input.strategicAdvice,
    decisionCockpit: asRecord(input.decisionCockpit)
      ? input.decisionCockpit
      : submitActive
        ? prev.decisionCockpit
        : input.decisionCockpit,
    opponentModel: asRecord(input.opponentModel)
      ? input.opponentModel
      : submitActive
        ? prev.opponentModel
        : input.opponentModel,
    strategicPatterns: asRecord(input.strategicPatterns)
      ? input.strategicPatterns
      : submitActive
        ? prev.strategicPatterns
        : input.strategicPatterns,
  };
}
