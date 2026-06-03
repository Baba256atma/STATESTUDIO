import type { SceneCanvasProps } from "../../components/SceneCanvas";
import { devLogThrottled } from "../runtime/diagnosticThrottle";

const SCENE_RENDER_SOURCE_INTERVAL_MS = 1000;

function changedPropKeys(prev: SceneCanvasProps, next: SceneCanvasProps): string[] {
  const keys: string[] = [];
  const entries: Array<[string, unknown, unknown]> = [
    ["selectedObjectId", prev.selectedObjectId, next.selectedObjectId],
    ["selectedRelationshipId", prev.selectedRelationshipId, next.selectedRelationshipId],
    ["selectedPropagationPathId", prev.selectedPropagationPathId, next.selectedPropagationPathId],
    ["sceneJson", prev.sceneJson, next.sceneJson],
    ["loops", prev.loops, next.loops],
    ["objectSelection", prev.objectSelection, next.objectSelection],
    ["propagationPayload", prev.propagationPayload, next.propagationPayload],
    ["scenarioTrigger", prev.scenarioTrigger, next.scenarioTrigger],
    ["focusedId", prev.focusedId, next.focusedId],
    ["focusMode", prev.focusMode, next.focusMode],
    ["focusPinned", prev.focusPinned, next.focusPinned],
    ["effectiveActiveLoopId", prev.effectiveActiveLoopId, next.effectiveActiveLoopId],
    ["objectInfoHud", prev.objectInfoHud, next.objectInfoHud],
    ["sceneInfoHud", prev.sceneInfoHud, next.sceneInfoHud],
    ["timelineHud", prev.timelineHud, next.timelineHud],
    ["quickActionsDock", prev.quickActionsDock, next.quickActionsDock],
    ["executiveStatusHud", prev.executiveStatusHud, next.executiveStatusHud],
    ["objectUxById", prev.objectUxById, next.objectUxById],
    ["layoutDockInsets", prev.layoutDockInsets, next.layoutDockInsets],
    ["prefs", prev.prefs, next.prefs],
    ["onPointerMissed", prev.onPointerMissed, next.onPointerMissed],
    ["onOrbitStart", prev.onOrbitStart, next.onOrbitStart],
    ["onOrbitEnd", prev.onOrbitEnd, next.onOrbitEnd],
    ["onSelectedChange", prev.onSelectedChange, next.onSelectedChange],
    ["onObjectPositionChange", prev.onObjectPositionChange, next.onObjectPositionChange],
    ["onRelationshipSelect", prev.onRelationshipSelect, next.onRelationshipSelect],
    ["onPropagationPathSelect", prev.onPropagationPathSelect, next.onPropagationPathSelect],
    ["onCreateImpactPath", prev.onCreateImpactPath, next.onCreateImpactPath],
    ["onScenarioOverlayChange", prev.onScenarioOverlayChange, next.onScenarioOverlayChange],
    ["onScenarioLayerSelect", prev.onScenarioLayerSelect, next.onScenarioLayerSelect],
    ["onWarRoomCommand", prev.onWarRoomCommand, next.onWarRoomCommand],
    ["getUxForObject", prev.getUxForObject, next.getUxForObject],
  ];
  for (const [key, a, b] of entries) {
    if (a !== b) keys.push(key);
  }
  if (prev.camPos[0] !== next.camPos[0] || prev.camPos[1] !== next.camPos[1] || prev.camPos[2] !== next.camPos[2]) {
    keys.push("camPos");
  }
  return keys;
}

export function logSceneCanvasRenderSource(prev: SceneCanvasProps, next: SceneCanvasProps): void {
  const changedProps = changedPropKeys(prev, next);
  if (changedProps.length === 0) return;

  const payload = {
    changedProps,
    selectedObjectChanged: prev.selectedObjectId !== next.selectedObjectId,
    rightPanelChanged: false,
    sceneObjectsChanged: prev.sceneJson !== next.sceneJson,
    layoutPositionsChanged: false,
    callbacksChanged: changedProps.some((key) => key.startsWith("on") || key.startsWith("get")),
  };

  devLogThrottled({
    key: changedProps.join("|"),
    label: "[NEXORA_SCENE_RENDER_SOURCE]",
    payload,
    intervalMs: SCENE_RENDER_SOURCE_INTERVAL_MS,
  });
}
