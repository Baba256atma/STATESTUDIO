import type { SceneCanvasProps } from "../../components/SceneCanvas";
import {
  dockInsetsSignature,
  recordLayoutThrottleAudit,
} from "../layout/layoutThrottleAuditRuntime.ts";
import { devLogThrottled } from "../runtime/diagnosticThrottle.ts";
import {
  buildHudPayloadSignature,
  buildPropagationPayloadSignature,
} from "../runtime/payloadStabilityAudit.ts";

const SCENE_RENDER_SOURCE_INTERVAL_MS = 1000;
const SCENE_RENDER_SOURCE_SCOPE = "sceneRenderSource";

const sceneCanvasRenderImpactTotals = {
  layoutDockInsets: 0,
  objectInfoHud: 0,
  selection: 0,
  other: 0,
};

function isVerboseSceneAuditEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_NEXORA_VERBOSE_SCENE_AUDIT === "true") return true;
  const record = globalThis as unknown as Record<string, unknown>;
  return record.NEXORA_VERBOSE_SCENE_AUDIT === true;
}

export type SceneCanvasPropClassification =
  | "A.scene-critical"
  | "B.selection-visual"
  | "C.ui-only"
  | "D.heavy-stabilized";

export type SceneCanvasPropChangeType =
  | "primitive-change"
  | "function-identity-change"
  | "object-identity-change"
  | "array-identity-change"
  | "signature-change";

export type SceneCanvasPropChange = {
  propName: keyof SceneCanvasProps | "camPos";
  classification: SceneCanvasPropClassification;
  changeType: SceneCanvasPropChangeType;
  prevSignature: string;
  nextSignature: string;
  shouldCauseSceneRender: boolean;
};

type PropEntry = {
  propName: keyof SceneCanvasProps | "camPos";
  prevValue: unknown;
  nextValue: unknown;
  classification: SceneCanvasPropClassification;
  shouldCauseSceneRender: boolean;
};

const SCENE_CANVAS_PROP_CONTRACT: Record<string, {
  classification: SceneCanvasPropClassification;
  shouldCauseSceneRender: boolean;
}> = {
  prefs: { classification: "D.heavy-stabilized", shouldCauseSceneRender: true },
  resolvedUiTheme: { classification: "C.ui-only", shouldCauseSceneRender: false },
  motionCalm: { classification: "C.ui-only", shouldCauseSceneRender: false },
  camPos: { classification: "A.scene-critical", shouldCauseSceneRender: true },
  starCount: { classification: "C.ui-only", shouldCauseSceneRender: false },
  isDraggingHUD: { classification: "C.ui-only", shouldCauseSceneRender: false },
  hudDockSide: { classification: "C.ui-only", shouldCauseSceneRender: false },
  layoutDockInsets: { classification: "D.heavy-stabilized", shouldCauseSceneRender: true },
  storyAccent: { classification: "C.ui-only", shouldCauseSceneRender: false },
  showAxes: { classification: "C.ui-only", shouldCauseSceneRender: false },
  showGrid: { classification: "C.ui-only", shouldCauseSceneRender: false },
  showObjectDebugLabels: { classification: "C.ui-only", shouldCauseSceneRender: false },
  showCameraHelper: { classification: "C.ui-only", shouldCauseSceneRender: false },
  focusPinned: { classification: "B.selection-visual", shouldCauseSceneRender: true },
  focusMode: { classification: "B.selection-visual", shouldCauseSceneRender: true },
  focusedId: { classification: "B.selection-visual", shouldCauseSceneRender: true },
  effectiveActiveLoopId: { classification: "B.selection-visual", shouldCauseSceneRender: true },
  cameraLockedByUser: { classification: "A.scene-critical", shouldCauseSceneRender: true },
  isOrbiting: { classification: "C.ui-only", shouldCauseSceneRender: false },
  sceneJson: { classification: "A.scene-critical", shouldCauseSceneRender: true },
  propagationPayload: { classification: "C.ui-only", shouldCauseSceneRender: false },
  scenarioTrigger: { classification: "A.scene-critical", shouldCauseSceneRender: true },
  onScenarioOverlayChange: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  objectSelection: { classification: "B.selection-visual", shouldCauseSceneRender: true },
  getUxForObject: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  objectUxById: { classification: "B.selection-visual", shouldCauseSceneRender: true },
  selectedObjectId: { classification: "B.selection-visual", shouldCauseSceneRender: true },
  loops: { classification: "A.scene-critical", shouldCauseSceneRender: true },
  showLoops: { classification: "A.scene-critical", shouldCauseSceneRender: true },
  showLoopLabels: { classification: "C.ui-only", shouldCauseSceneRender: false },
  selectedSetterRef: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  selectedIdRef: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  overridesRef: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  setOverrideRef: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  clearAllOverridesRef: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  pruneOverridesRef: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  onPointerMissed: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  onOrbitStart: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  onOrbitEnd: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  onSelectedChange: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  onObjectPositionChange: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  selectedRelationshipId: { classification: "B.selection-visual", shouldCauseSceneRender: true },
  onRelationshipSelect: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  selectedPropagationPathId: { classification: "B.selection-visual", shouldCauseSceneRender: true },
  onPropagationPathSelect: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  onCreateImpactPath: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  sceneInfoHud: { classification: "C.ui-only", shouldCauseSceneRender: false },
  objectInfoHud: { classification: "C.ui-only", shouldCauseSceneRender: false },
  timelineHud: { classification: "C.ui-only", shouldCauseSceneRender: false },
  scenarioSimulation: { classification: "A.scene-critical", shouldCauseSceneRender: true },
  onScenarioLayerSelect: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  onWarRoomCommand: { classification: "D.heavy-stabilized", shouldCauseSceneRender: false },
  quickActionsDock: { classification: "C.ui-only", shouldCauseSceneRender: false },
  executiveStatusHud: { classification: "C.ui-only", shouldCauseSceneRender: false },
  hudThemeMode: { classification: "C.ui-only", shouldCauseSceneRender: false },
  sceneNavigationToolbar: { classification: "C.ui-only", shouldCauseSceneRender: false },
  cameraToolbar: { classification: "C.ui-only", shouldCauseSceneRender: false },
};

function safePrimitive(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value.length > 120 ? `${value.slice(0, 117)}...` : value);
  if (typeof value === "number" || typeof value === "boolean" || value == null) return JSON.stringify(value);
  if (typeof value === "function") return `[function:${value.name || "anonymous"}]`;
  return String(value);
}

function stableSignature(value: unknown, depth = 0, seen = new WeakSet<object>()): string {
  if (value == null || typeof value !== "object") return safePrimitive(value);
  if (seen.has(value)) return "[Circular]";
  seen.add(value);
  if (Array.isArray(value)) {
    if (depth >= 2) return `[Array len=${value.length}]`;
    return `[${value.slice(0, 8).map((entry) => stableSignature(entry, depth + 1, seen)).join(",")}${
      value.length > 8 ? `,...+${value.length - 8}` : ""
    }]`;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  if (depth >= 2) {
    const id = typeof record.id === "string" ? ` id=${record.id}` : "";
    const signature = typeof record.signature === "string" ? ` signature=${record.signature}` : "";
    return `{Object keys=${keys.length}${id}${signature}}`;
  }
  return `{${keys
    .slice(0, 16)
    .map((key) => `${JSON.stringify(key)}:${stableSignature(record[key], depth + 1, seen)}`)
    .join(",")}${keys.length > 16 ? `,...+${keys.length - 16}` : ""}}`;
}

function sceneCanvasPropSignature(propName: string, value: unknown): string {
  if (propName === "propagationPayload") return buildPropagationPayloadSignature(value);
  if (propName === "timelineHud") return buildHudPayloadSignature(value);
  return stableSignature(value);
}

function getChangeType(prevValue: unknown, nextValue: unknown, prevSignature: string, nextSignature: string): SceneCanvasPropChangeType {
  if (typeof prevValue === "function" || typeof nextValue === "function") return "function-identity-change";
  if (
    prevValue == null ||
    nextValue == null ||
    typeof prevValue !== "object" ||
    typeof nextValue !== "object"
  ) {
    return "primitive-change";
  }
  if (prevSignature !== nextSignature) return "signature-change";
  if (Array.isArray(prevValue) || Array.isArray(nextValue)) return "array-identity-change";
  return "object-identity-change";
}

function changedFields(prevValue: unknown, nextValue: unknown): string[] {
  const prevRecord =
    prevValue && typeof prevValue === "object" && !Array.isArray(prevValue)
      ? (prevValue as Record<string, unknown>)
      : {};
  const nextRecord =
    nextValue && typeof nextValue === "object" && !Array.isArray(nextValue)
      ? (nextValue as Record<string, unknown>)
      : {};
  return Array.from(new Set([...Object.keys(prevRecord), ...Object.keys(nextRecord)]))
    .filter((key) => stableSignature(prevRecord[key]) !== stableSignature(nextRecord[key]))
    .sort();
}

function classifyRenderImpact(changedProps: readonly string[]) {
  const renderTriggeredByLayoutDockInsets = changedProps.includes("layoutDockInsets");
  const renderTriggeredByObjectInfoHud = changedProps.includes("objectInfoHud");
  const renderTriggeredBySelection = changedProps.some((propName) =>
    [
      "focusedId",
      "selectedObjectId",
      "objectSelection",
      "focusPinned",
      "focusMode",
      "selectedRelationshipId",
      "selectedPropagationPathId",
      "effectiveActiveLoopId",
    ].includes(propName)
  );
  const renderTriggeredByOtherProps = changedProps.some(
    (propName) =>
      propName !== "layoutDockInsets" &&
      propName !== "objectInfoHud" &&
      ![
        "focusedId",
        "selectedObjectId",
        "objectSelection",
        "focusPinned",
        "focusMode",
        "selectedRelationshipId",
        "selectedPropagationPathId",
        "effectiveActiveLoopId",
      ].includes(propName)
  );

  if (renderTriggeredByLayoutDockInsets) sceneCanvasRenderImpactTotals.layoutDockInsets += 1;
  if (renderTriggeredByObjectInfoHud) sceneCanvasRenderImpactTotals.objectInfoHud += 1;
  if (renderTriggeredBySelection) sceneCanvasRenderImpactTotals.selection += 1;
  if (renderTriggeredByOtherProps) sceneCanvasRenderImpactTotals.other += 1;

  return {
    renderTriggeredByLayoutDockInsets,
    renderTriggeredByObjectInfoHud,
    renderTriggeredBySelection,
    renderTriggeredByOtherProps,
    totals: { ...sceneCanvasRenderImpactTotals },
  };
}

function classifySceneCanvasRender(prev: SceneCanvasProps, next: SceneCanvasProps, changedProps: readonly string[]) {
  if (prev.sceneJson == null && next.sceneJson != null) return "BOOTSTRAP_RENDER";
  if (
    changedProps.some((propName) =>
      ["selectedObjectId", "focusedId", "objectSelection", "selectedRelationshipId", "selectedPropagationPathId"].includes(
        String(propName)
      )
    )
  ) {
    return "SELECTION_RENDER";
  }
  if (changedProps.some((propName) => ["camPos", "cameraLockedByUser", "isOrbiting"].includes(String(propName)))) {
    return "CAMERA_RENDER";
  }
  if (changedProps.some((propName) => ["sceneJson", "loops", "effectiveActiveLoopId"].includes(String(propName)))) {
    return "SCENE_CHANGE_RENDER";
  }
  if (changedProps.some((propName) => ["layoutDockInsets"].includes(String(propName)))) {
    return "LAYOUT_RENDER";
  }
  if (changedProps.some((propName) => ["onSelectedChange", "onPointerMissed", "onOrbitStart", "onOrbitEnd"].includes(String(propName)))) {
    return "USER_INTERACTION_RENDER";
  }
  return "UNEXPECTED_RENDER";
}

function propEntries(prev: SceneCanvasProps, next: SceneCanvasProps): PropEntry[] {
  return [
    ["prefs", prev.prefs, next.prefs],
    ["resolvedUiTheme", prev.resolvedUiTheme, next.resolvedUiTheme],
    ["motionCalm", prev.motionCalm, next.motionCalm],
    ["camPos", prev.camPos, next.camPos],
    ["starCount", prev.starCount, next.starCount],
    ["isDraggingHUD", prev.isDraggingHUD, next.isDraggingHUD],
    ["hudDockSide", prev.hudDockSide, next.hudDockSide],
    ["layoutDockInsets", prev.layoutDockInsets, next.layoutDockInsets],
    ["storyAccent", prev.storyAccent, next.storyAccent],
    ["showAxes", prev.showAxes, next.showAxes],
    ["showGrid", prev.showGrid, next.showGrid],
    ["showObjectDebugLabels", prev.showObjectDebugLabels, next.showObjectDebugLabels],
    ["showCameraHelper", prev.showCameraHelper, next.showCameraHelper],
    ["focusPinned", prev.focusPinned, next.focusPinned],
    ["focusMode", prev.focusMode, next.focusMode],
    ["focusedId", prev.focusedId, next.focusedId],
    ["effectiveActiveLoopId", prev.effectiveActiveLoopId, next.effectiveActiveLoopId],
    ["cameraLockedByUser", prev.cameraLockedByUser, next.cameraLockedByUser],
    ["isOrbiting", prev.isOrbiting, next.isOrbiting],
    ["sceneJson", prev.sceneJson, next.sceneJson],
    ["propagationPayload", prev.propagationPayload, next.propagationPayload],
    ["scenarioTrigger", prev.scenarioTrigger, next.scenarioTrigger],
    ["onScenarioOverlayChange", prev.onScenarioOverlayChange, next.onScenarioOverlayChange],
    ["objectSelection", prev.objectSelection, next.objectSelection],
    ["getUxForObject", prev.getUxForObject, next.getUxForObject],
    ["objectUxById", prev.objectUxById, next.objectUxById],
    ["selectedObjectId", prev.selectedObjectId, next.selectedObjectId],
    ["loops", prev.loops, next.loops],
    ["showLoops", prev.showLoops, next.showLoops],
    ["showLoopLabels", prev.showLoopLabels, next.showLoopLabels],
    ["selectedSetterRef", prev.selectedSetterRef, next.selectedSetterRef],
    ["selectedIdRef", prev.selectedIdRef, next.selectedIdRef],
    ["overridesRef", prev.overridesRef, next.overridesRef],
    ["setOverrideRef", prev.setOverrideRef, next.setOverrideRef],
    ["clearAllOverridesRef", prev.clearAllOverridesRef, next.clearAllOverridesRef],
    ["pruneOverridesRef", prev.pruneOverridesRef, next.pruneOverridesRef],
    ["onPointerMissed", prev.onPointerMissed, next.onPointerMissed],
    ["onOrbitStart", prev.onOrbitStart, next.onOrbitStart],
    ["onOrbitEnd", prev.onOrbitEnd, next.onOrbitEnd],
    ["onSelectedChange", prev.onSelectedChange, next.onSelectedChange],
    ["onObjectPositionChange", prev.onObjectPositionChange, next.onObjectPositionChange],
    ["selectedRelationshipId", prev.selectedRelationshipId, next.selectedRelationshipId],
    ["onRelationshipSelect", prev.onRelationshipSelect, next.onRelationshipSelect],
    ["selectedPropagationPathId", prev.selectedPropagationPathId, next.selectedPropagationPathId],
    ["onPropagationPathSelect", prev.onPropagationPathSelect, next.onPropagationPathSelect],
    ["onCreateImpactPath", prev.onCreateImpactPath, next.onCreateImpactPath],
    ["sceneInfoHud", prev.sceneInfoHud, next.sceneInfoHud],
    ["objectInfoHud", prev.objectInfoHud, next.objectInfoHud],
    ["timelineHud", prev.timelineHud, next.timelineHud],
    ["scenarioSimulation", prev.scenarioSimulation, next.scenarioSimulation],
    ["onScenarioLayerSelect", prev.onScenarioLayerSelect, next.onScenarioLayerSelect],
    ["onWarRoomCommand", prev.onWarRoomCommand, next.onWarRoomCommand],
    ["quickActionsDock", prev.quickActionsDock, next.quickActionsDock],
    ["executiveStatusHud", prev.executiveStatusHud, next.executiveStatusHud],
    ["hudThemeMode", prev.hudThemeMode, next.hudThemeMode],
    ["sceneNavigationToolbar", prev.sceneNavigationToolbar, next.sceneNavigationToolbar],
    ["cameraToolbar", prev.cameraToolbar, next.cameraToolbar],
  ].map(([propName, prevValue, nextValue]) => {
    const contract = SCENE_CANVAS_PROP_CONTRACT[String(propName)];
    return {
      propName: propName as keyof SceneCanvasProps | "camPos",
      prevValue,
      nextValue,
      classification: contract.classification,
      shouldCauseSceneRender: contract.shouldCauseSceneRender,
    };
  });
}

export function getSceneCanvasPropChanges(prev: SceneCanvasProps, next: SceneCanvasProps): SceneCanvasPropChange[] {
  const changes: SceneCanvasPropChange[] = [];
  for (const entry of propEntries(prev, next)) {
    if (entry.prevValue === entry.nextValue) continue;
    const prevSignature = sceneCanvasPropSignature(String(entry.propName), entry.prevValue);
    const nextSignature = sceneCanvasPropSignature(String(entry.propName), entry.nextValue);
    const changeType = getChangeType(entry.prevValue, entry.nextValue, prevSignature, nextSignature);
    if (changeType === "object-identity-change" || changeType === "array-identity-change") {
      continue;
    }
    changes.push({
      propName: entry.propName,
      classification: entry.classification,
      changeType,
      prevSignature,
      nextSignature,
      shouldCauseSceneRender: entry.shouldCauseSceneRender,
    });
  }
  return changes;
}

function logLayoutDockInsetsAudit(prev: SceneCanvasProps, next: SceneCanvasProps, source: string): void {
  const previousSignature = dockInsetsSignature(prev.layoutDockInsets);
  const nextSignature = dockInsetsSignature(next.layoutDockInsets);
  const layoutDockInsetsReferenceChanged = prev.layoutDockInsets !== next.layoutDockInsets;
  const layoutDockInsetsValueChanged = previousSignature !== nextSignature;
  if (!layoutDockInsetsReferenceChanged && !layoutDockInsetsValueChanged) return;
  if (!layoutDockInsetsValueChanged) {
    recordLayoutThrottleAudit({
      area: "sceneCanvas",
      source,
      previousSignature,
      nextSignature,
      prevented: true,
      detail: {
        reason: "layoutDockInsets reference changed but left/right inset ratios are unchanged",
      },
    });
    devLogThrottled({
      key: `${source}:${previousSignature}:${nextSignature}`,
      label: "[NEXORA_SCENE_RENDER_PREVENTED_BY_LAYOUT_CACHE]",
      payload: {
        source,
        propName: "layoutDockInsets",
        previousSignature,
        nextSignature,
        layoutDockInsetsReferenceChanged,
        layoutDockInsetsValueChanged,
        preventedRender: true,
      },
      intervalMs: 15000,
      scope: SCENE_RENDER_SOURCE_SCOPE,
    });
    if (!isVerboseSceneAuditEnabled()) return;
  }

  devLogThrottled({
    key: [
      source,
      layoutDockInsetsReferenceChanged ? "ref" : "stable-ref",
      previousSignature,
      nextSignature,
    ].join("|"),
    label: "[NEXORA_LAYOUT_DOCK_INSETS_AUDIT]",
    payload: {
      previousSignature,
      nextSignature,
      changed: layoutDockInsetsValueChanged,
      changedFields: changedFields(prev.layoutDockInsets, next.layoutDockInsets),
      source,
      consumerCount: 2,
      layoutDockInsetsReferenceChanged,
      layoutDockInsetsValueChanged,
      layoutDockInsetsSignatureChanged: layoutDockInsetsValueChanged,
    },
    intervalMs: SCENE_RENDER_SOURCE_INTERVAL_MS,
    scope: SCENE_RENDER_SOURCE_SCOPE,
  });
  devLogThrottled({
    key: `${source}:${previousSignature}:${nextSignature}:${layoutDockInsetsValueChanged}`,
    label: "[NEXORA_DOCK_INSETS_STABILITY_REPORT]",
    payload: {
      source,
      previousSignature,
      nextSignature,
      referenceChanged: layoutDockInsetsReferenceChanged,
      valueChanged: layoutDockInsetsValueChanged,
      preventedUpdate: !layoutDockInsetsValueChanged,
    },
    intervalMs: 10000,
    scope: SCENE_RENDER_SOURCE_SCOPE,
  });
}

export function shouldSceneCanvasPropsRender(prev: SceneCanvasProps, next: SceneCanvasProps): boolean {
  logLayoutDockInsetsAudit(prev, next, "SceneCanvas.memoComparator");
  const changes = getSceneCanvasPropChanges(prev, next);
  if (changes.length === 1 && changes[0]?.propName === "isOrbiting") {
    devLogThrottled({
      key: "isOrbiting:ignored",
      label: "[NEXORA_ORBIT_RUNTIME_ISOLATION]",
      scope: SCENE_RENDER_SOURCE_SCOPE,
      intervalMs: 5000,
      payload: {
        propName: "isOrbiting",
        ignoredBySceneCanvasMemoComparator: true,
        reason: "Orbit activity is handled by SceneCanvas local refs/R3F runtime and should not force full SceneCanvas React renders.",
      },
    });
    return false;
  }
  return changes.some((change) => change.shouldCauseSceneRender);
}

export function listSceneCanvasPropContract(): Array<{
  propName: string;
  classification: SceneCanvasPropClassification;
  shouldCauseSceneRender: boolean;
}> {
  return Object.entries(SCENE_CANVAS_PROP_CONTRACT).map(([propName, contract]) => ({
    propName,
    ...contract,
  }));
}

export function logSceneCanvasRenderSource(prev: SceneCanvasProps, next: SceneCanvasProps): void {
  const propChanges = getSceneCanvasPropChanges(prev, next);
  if (propChanges.length === 0) return;

  const changedProps = propChanges.map((change) => change.propName);
  const shouldRenderChanges = propChanges.filter((change) => change.shouldCauseSceneRender);
  if (shouldRenderChanges.length === 0 && !isVerboseSceneAuditEnabled()) return;
  const layoutDockInsetsPrevSignature = stableSignature(prev.layoutDockInsets);
  const layoutDockInsetsNextSignature = stableSignature(next.layoutDockInsets);
  const layoutDockInsetsReferenceChanged = prev.layoutDockInsets !== next.layoutDockInsets;
  const layoutDockInsetsValueChanged = layoutDockInsetsPrevSignature !== layoutDockInsetsNextSignature;
  const impact = classifyRenderImpact(changedProps.map(String));
  const renderClassification = classifySceneCanvasRender(prev, next, changedProps.map(String));
  const payload = {
    changedProps,
    changedPropNames: changedProps.join(", "),
    renderClassification,
    propChanges,
    selectedObjectChanged: prev.selectedObjectId !== next.selectedObjectId,
    sceneObjectsChanged: stableSignature(prev.sceneJson) !== stableSignature(next.sceneJson),
    layoutPositionsChanged: layoutDockInsetsValueChanged,
    layoutDockInsetsReferenceChanged,
    layoutDockInsetsValueChanged,
    layoutDockInsetsSignatureChanged: layoutDockInsetsValueChanged,
    ...impact,
    callbacksChanged: propChanges.some((change) => change.changeType === "function-identity-change"),
    configChanged: propChanges.some((change) =>
      ["prefs", "layoutDockInsets", "storyAccent", "quickActionsDock", "executiveStatusHud"].includes(
        String(change.propName)
      )
    ),
    shouldRenderReason:
      shouldRenderChanges.length > 0
        ? shouldRenderChanges.map((change) => change.propName).join(", ")
        : "diagnostic-only identity churn",
  };

  devLogThrottled({
    key: changedProps.join("|"),
    label: "[NEXORA_SCENE_RENDER_SOURCE]",
    payload,
    intervalMs: SCENE_RENDER_SOURCE_INTERVAL_MS * 5,
    scope: SCENE_RENDER_SOURCE_SCOPE,
  });

  devLogThrottled({
    key: `${renderClassification}:${changedProps.join("|")}`,
    label: "[NEXORA_RENDER_CLASSIFICATION]",
    payload: {
      renderClassification,
      changedPropNames: changedProps.join(", "),
      expected: renderClassification !== "UNEXPECTED_RENDER",
    },
    intervalMs: SCENE_RENDER_SOURCE_INTERVAL_MS * 5,
    scope: SCENE_RENDER_SOURCE_SCOPE,
  });

  logLayoutDockInsetsAudit(prev, next, "SceneCanvas.render");
}
