import type { SceneCanvasProps } from "../../components/SceneCanvas";

function refEqual<T>(a: T, b: T): boolean {
  return a === b;
}

/** Stable comparator — allow SceneCanvas re-render only when meaningful scene inputs change. */
export function areSceneCanvasPropsEqual(
  prev: SceneCanvasProps,
  next: SceneCanvasProps
): boolean {
  if (prev.selectedObjectId !== next.selectedObjectId) return false;
  if (prev.selectedRelationshipId !== next.selectedRelationshipId) return false;
  if (prev.selectedPropagationPathId !== next.selectedPropagationPathId) return false;
  if (prev.sceneJson !== next.sceneJson) return false;
  if (prev.loops !== next.loops) return false;
  if (prev.objectSelection !== next.objectSelection) return false;
  if (prev.propagationPayload !== next.propagationPayload) return false;
  if (prev.scenarioTrigger !== next.scenarioTrigger) return false;
  if (prev.focusedId !== next.focusedId) return false;
  if (prev.focusMode !== next.focusMode) return false;
  if (prev.focusPinned !== next.focusPinned) return false;
  if (prev.effectiveActiveLoopId !== next.effectiveActiveLoopId) return false;
  if (prev.cameraLockedByUser !== next.cameraLockedByUser) return false;
  if (prev.isOrbiting !== next.isOrbiting) return false;
  if (prev.showLoops !== next.showLoops) return false;
  if (prev.showLoopLabels !== next.showLoopLabels) return false;
  if (prev.showAxes !== next.showAxes) return false;
  if (prev.showGrid !== next.showGrid) return false;
  if (prev.showObjectDebugLabels !== next.showObjectDebugLabels) return false;
  if (prev.showCameraHelper !== next.showCameraHelper) return false;
  if (prev.motionCalm !== next.motionCalm) return false;
  if (prev.resolvedUiTheme !== next.resolvedUiTheme) return false;
  if (prev.hudThemeMode !== next.hudThemeMode) return false;
  if (prev.sceneNavigationToolbar !== next.sceneNavigationToolbar) return false;
  if (prev.cameraToolbar !== next.cameraToolbar) return false;
  if (prev.isDraggingHUD !== next.isDraggingHUD) return false;
  if (prev.hudDockSide !== next.hudDockSide) return false;
  if (prev.starCount !== next.starCount) return false;
  if (prev.objectUxById !== next.objectUxById) return false;
  if (prev.scenarioSimulation !== next.scenarioSimulation) return false;
  if (prev.sceneInfoHud !== next.sceneInfoHud) return false;
  if (prev.objectInfoHud !== next.objectInfoHud) return false;
  if (prev.timelineHud !== next.timelineHud) return false;
  if (prev.quickActionsDock !== next.quickActionsDock) return false;
  if (prev.executiveStatusHud !== next.executiveStatusHud) return false;
  if (prev.storyAccent !== next.storyAccent) return false;
  if (prev.layoutDockInsets !== next.layoutDockInsets) return false;
  if (prev.prefs !== next.prefs) return false;
  if (prev.camPos[0] !== next.camPos[0] || prev.camPos[1] !== next.camPos[1] || prev.camPos[2] !== next.camPos[2]) {
    return false;
  }

  if (
    !refEqual(prev.selectedSetterRef, next.selectedSetterRef) ||
    !refEqual(prev.selectedIdRef, next.selectedIdRef) ||
    !refEqual(prev.overridesRef, next.overridesRef) ||
    !refEqual(prev.setOverrideRef, next.setOverrideRef) ||
    !refEqual(prev.clearAllOverridesRef, next.clearAllOverridesRef) ||
    !refEqual(prev.pruneOverridesRef, next.pruneOverridesRef)
  ) {
    return false;
  }

  if (
    prev.onPointerMissed !== next.onPointerMissed ||
    prev.onOrbitStart !== next.onOrbitStart ||
    prev.onOrbitEnd !== next.onOrbitEnd ||
    prev.onSelectedChange !== next.onSelectedChange ||
    prev.onObjectPositionChange !== next.onObjectPositionChange ||
    prev.onRelationshipSelect !== next.onRelationshipSelect ||
    prev.onPropagationPathSelect !== next.onPropagationPathSelect ||
    prev.onCreateImpactPath !== next.onCreateImpactPath ||
    prev.onScenarioOverlayChange !== next.onScenarioOverlayChange ||
    prev.onScenarioLayerSelect !== next.onScenarioLayerSelect ||
    prev.onWarRoomCommand !== next.onWarRoomCommand ||
    prev.getUxForObject !== next.getUxForObject
  ) {
    return false;
  }

  return true;
}
