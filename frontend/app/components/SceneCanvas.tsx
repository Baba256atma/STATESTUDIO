"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { ExecutiveOrbitControls } from "./scene/navigation/ExecutiveOrbitControls";
import { ExecutiveViewportCamera } from "./scene/navigation/ExecutiveViewportCamera";
import { ExecutiveViewportFramer } from "./scene/navigation/ExecutiveViewportFramer";
import { ExecutiveSceneGuides } from "./scene/ExecutiveSceneGuides";
import { handleExecutiveKeyboardNavigation } from "../lib/scene/interaction/executiveKeyboardNavigationRuntime";
import { patchExecutiveInteractionState } from "../lib/scene/interaction/executiveInteractionStateRuntime";

import { smoothValue } from "../lib/smooth";
import { traceHighlightFlow } from "../lib/debug/highlightDebugTrace";
import type { ScenarioActionPropagationIntent } from "../lib/simulation/propagationTriggerTypes";
import type { WarRoomOverlayDetail, WarRoomOverlaySummary } from "../lib/warroom/warRoomTypes";
import { useSceneOverlayRuntime } from "../lib/overlay/useSceneOverlayRuntime";
import { bindWindowListener, logDomListenerStable } from "../lib/dom/domListenerLifecycle";
import { SceneOverlayRenderer } from "./scene/overlay/SceneOverlayRenderer";
import {
  isProjectedPointWithinSafeRegion,
  measureFrameDrift,
  resolveLayoutAwareFrameSpec,
} from "../lib/scene/layoutAwareFraming";
import {
  CALM_FRAMING,
  clampLookAtDeltaToRadius,
  sceneRadiusFromBoundsSize,
} from "../lib/scene/calmCameraFraming";
import {
  calculateExecutiveCameraDistance,
  countSceneRelationships,
  normalizeExecutiveObjectScale,
} from "../lib/scene/executiveSceneComposition";
import {
  computeWorkspaceScaleMetrics,
  evaluateCameraStability,
  registerAutoFrameSignature,
} from "../lib/scene/density";
import { normalizeExecutiveObjectLayout } from "../lib/scene/composition/normalizeExecutiveObjectLayout";
import { runSceneOccupancyAudit } from "../lib/scene/sceneOccupancyAudit";
import { runExecutiveLayoutAudit } from "../lib/scene/executiveLayoutAuditRuntime";
import { buildExecutiveLayoutAuditInputSignature } from "../lib/scene/executiveLayoutAuditSignature";
import { resolveWorkspaceLayoutContract } from "../lib/ui/workspaceLayoutController";
import { detectHudDrift, markHudDriftBaseline } from "../lib/hud/hudAnchoringRuntime";
import {
  markSceneHudDriftBaseline,
  scheduleSceneHudDriftBaseline,
  scheduleSceneHudDriftDetect,
} from "../lib/scene/sceneHudDriftGuard";
import { buildSceneActivityDriftSignature } from "../lib/runtime/sceneParityRuntime";
import { devLogOnSignatureChange } from "../lib/runtime/diagnosticIdleGate";
import { updateIdleRuntimeSemanticSignature } from "../lib/runtime/idleRuntimeStabilityGuard";
import {
  buildSceneObjectsRegistrySignature,
  syncSceneObjectRegistry,
} from "../lib/scene/objectRegistryRuntime";
import { buildSceneObjectSelectionSignature } from "../lib/scene/sceneObjectSelectionStable";
import {
  SCENE_SHELL_CLASS,
  SCENE_WORLD_LAYER_CLASS,
} from "../lib/scene/sceneLayerContract";
import {
  useClearAllOverrides,
  useOverrides,
  usePruneOverridesTo,
  useSelectedId,
  useSetOverride,
  useSetSelectedId,
} from "./SceneContext";
import {
  resolveNexoraSceneEnvironment,
  sceneRendererThemeFromUi,
  type SceneAtmosphereMode,
} from "../lib/scene/nexoraSceneEnvironment";
import type { ResolvedUiTheme } from "../lib/ui/nexoraUiTheme";
import { SceneInfoHudOverlay } from "./scene/SceneInfoHudOverlay";
import type { SceneInfoHudProps } from "./scene/SceneInfoHud";
import { ObjectInfoHudOverlay } from "./scene/ObjectInfoHudOverlay";
import type { ObjectInfoHudModel } from "../lib/scene/objectInfoHudTypes";
import type { EditableObjectPatch } from "../lib/modeling/objectEditingRuntime";
import type { PropagationPath, PropagationPathPatch } from "../lib/propagation/propagationAuthoringRuntime";
import type { ExecutiveTimelineHudModel } from "../lib/scene/executiveTimelineHudTypes";
import { ExecutiveQuickActionsDockOverlay } from "./scene/ExecutiveQuickActionsDockOverlay";
import type { ExecutiveQuickActionsDockOverlayProps } from "./scene/ExecutiveQuickActionsDockOverlay";
import { ExecutiveBottomWorkspaceOverlay } from "./scene/ExecutiveBottomWorkspaceOverlay";
import { ExecutiveStatusHudOverlay } from "./scene/status/ExecutiveStatusHudOverlay";
import type { ExecutiveStatusHudModel } from "./scene/status/ExecutiveStatusHud.types";
import { ExecutiveSceneToolbarOverlay } from "./scene/navigation/ExecutiveSceneToolbarOverlay";
import { ExecutiveFocusModeDocumentBridge } from "./scene/navigation/ExecutiveFocusModeDocumentBridge";
import { SceneHudLayer } from "./scene/SceneHudLayer";
import { SceneNavigationController } from "./scene/navigation/SceneNavigationController";
import { SCENE_NAVIGATION_ACTION_EVENT } from "../lib/scene/sceneNavigationContract";
import {
  resolveExecutiveCameraFrameForMode,
  resolveExecutiveDefaultCameraForMode,
} from "../lib/workspace/workspaceModeTransitionRuntime";
import {
  buildExecutiveSceneObjectSignature,
  isValidExecutiveCameraFrame,
  readExecutiveSceneObjects,
  resolveExecutiveCameraPresetFrame,
} from "../lib/scene/executiveCameraPresets";
import {
  buildExecutiveCameraTransitionSignature,
  createExecutiveCameraTransitionState,
  shouldApplyExecutiveCameraTransition,
  stepExecutiveCameraTransition,
} from "../lib/scene/camera/executiveCameraTransitionRuntime";
import {
  buildObjectVisualExtentsSignature,
  resolveObjectVisualExtents,
  type ObjectVisualExtents,
} from "../lib/scene/camera/objectVisualExtents";
import { logExecutiveCameraTransition } from "../lib/scene/camera/executiveCameraDiagnostics";
import { armExecutiveCameraMemory } from "../lib/scene/camera/executiveCameraMemoryRuntime";
import type { ExecutiveCameraContextInput } from "../lib/scene/camera/executiveCameraContextRuntime";
import {
  buildSpatialTimeIntelligenceState,
  enterTimelineSpatialFocusMode,
  getTimelineSpatialInteractionServerSnapshot,
  getTimelineSpatialInteractionState,
  hoverTimelineSpatialEvent,
  mergeTimelineSpatialObjectSelection,
  resolveTimelineSpatialObjectSelection,
  selectTimelineSpatialEvent,
  subscribeTimelineSpatialInteraction,
} from "../lib/scene/timeline";
import {
  buildExecutiveScenarioPlaybackSequence,
  buildPlaybackPropagationOverlay,
  getExecutiveScenarioPlaybackServerSnapshot,
  getExecutiveScenarioPlaybackState,
  loadExecutiveScenarioPlaybackSequence,
  mapTimelineEventsForPlayback,
  nextExecutiveScenarioPlaybackStep,
  pauseExecutiveScenarioPlayback,
  playExecutiveScenarioPlayback,
  previousExecutiveScenarioPlaybackStep,
  resolveScenarioPlaybackObjectSelection,
  restartExecutiveScenarioPlayback,
  setExecutiveScenarioPlaybackCameraOverride,
  setExecutiveScenarioPlaybackSpeed,
  subscribeExecutiveScenarioPlayback,
  syncExecutiveScenarioPlaybackToTimelineStep,
  buildScenarioComparisonDashboard,
  getExecutiveScenarioUniverseServerSnapshot,
  getExecutiveScenarioUniverseState,
  isolateScenarioLayer,
  resolveActiveUniverseSimulation,
  resolveGhostUniverseLayers,
  resolveUniverseObjectSelection,
  setActiveScenarioLayer,
  setScenarioComparisonMode,
  setScenarioLayerVisibility,
  setScenarioUniverseLayoutMode,
  subscribeExecutiveScenarioUniverse,
} from "../lib/scene/scenario";
import {
  dispatchExecutiveWarRoomCommand,
  getExecutiveWarRoomServerSnapshot,
  getExecutiveWarRoomState,
  setExecutiveWarRoomFocusMode,
  subscribeExecutiveWarRoom,
} from "../lib/scene/warroom";
import {
  getExecutiveCognitiveTwinServerSnapshot,
  getExecutiveCognitiveTwinState,
  resolveTwinLivingEntities,
  resolveTwinObjectSelection,
  resolveTwinStressedRelationshipIds,
  subscribeExecutiveCognitiveTwin,
} from "../lib/scene/twin";
import {
  getExecutiveAdvisorServerSnapshot,
  getExecutiveAdvisorState,
  subscribeExecutiveAdvisor,
} from "../lib/scene/advisor";
import {
  getExecutiveIntelligenceServerSnapshot,
  getExecutiveIntelligenceState,
  subscribeExecutiveIntelligence,
} from "../lib/scene/integration";
import type { ExecutiveWarRoomCommandId, ExecutiveWarRoomFocusMode } from "../lib/scene/warroom";
import { ExecutiveWarRoomCommandRibbonOverlay } from "./scene/ExecutiveWarRoomCommandRibbonOverlay";
import type { TypeCScenarioSimulation } from "../lib/typec/typeCScenarioSimulation";
import {
  getExecutiveFocusModeSnapshot,
  getExecutiveFocusModeServerSnapshot,
  hydrateExecutiveFocusMode,
  subscribeExecutiveFocusMode,
} from "../lib/workspace/executiveFocusModeRuntime";
import {
  detectSceneObjectPipelineFilters,
  extractSceneObjectIds,
  resolveExecutiveRenderFocusMode,
  resolveSceneRenderObjects,
  sanitizeExecutiveObjectSelectionForRender,
  shouldRenderAllSceneObjects,
  shouldRestrictVisibilityToFocus,
  traceSceneObjectPipeline,
} from "../lib/scene/visibility";
import {
  getWorkspaceViewMode,
  getWorkspaceViewModeServerSnapshot,
  hydrateWorkspaceViewMode,
  subscribeWorkspaceViewMode,
} from "../lib/workspace/workspaceViewModeRuntime";
import {
  WORKSPACE_VIEW_MODE_EVENT,
  type WorkspaceViewMode,
} from "../lib/workspace/workspaceViewModeTypes";
import { logCameraProfileForMode, validateWorkspaceModeActivation } from "../lib/workspace/workspaceModeValidation";
import { resolveWorkspaceDensityProfile } from "../lib/scene/density/workspaceDensityModeProfiles";
import type { NexoraRelationship } from "../lib/relationships/relationshipTypes";
import {
  resolveNexoraHudThemeMode,
  type NexoraHudThemeMode,
} from "../lib/scene/nexoraHudTheme";
import { logHudThemeModeResolved } from "../lib/ui/cameraToolbarInstrumentation";
import { logWorkspaceSceneThemeUpdated } from "../lib/ui/workspaceAppearanceInstrumentation";
import { nx } from "./ui/nexoraTheme";

const CANVAS_STATIC_MODE = true;

function roundExecutiveScaleInput(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.round(value * 100) / 100;
}

function holdStableScaleInput(
  ref: React.MutableRefObject<{ signature: string; value: number } | null>,
  signature: string,
  next: number,
  threshold = 0.02
): number {
  const rounded = roundExecutiveScaleInput(next);
  const previous = ref.current;
  if (!previous || previous.signature !== signature || Math.abs(rounded - previous.value) >= threshold) {
    ref.current = { signature, value: rounded };
    return rounded;
  }
  return previous.value;
}

type SceneCanvasProps = {
  prefs: any;
  /** Resolved app chrome theme; drives scene clear color / fog / lights with atmosphere prefs. */
  resolvedUiTheme?: ResolvedUiTheme;
  /** Softer hover / drift on the 3D scene (from Settings → Motion low). */
  motionCalm?: boolean;
  camPos: [number, number, number];
  starCount: number;
  isDraggingHUD: boolean;

  focusPinned: boolean;
  focusMode: "all" | "selected";
  focusedId: string | null;

  effectiveActiveLoopId: string | null;
  cameraLockedByUser: boolean;
  isOrbiting: boolean;
  hudDockSide?: "left" | "right";
  /** E2:2 executive dock-aware camera framing (optional). */
  layoutDockInsets?: {
    leftDockInsetRatio?: number;
    rightDockInsetRatio?: number;
  };

  sceneJson: any | null;
  storyAccent?: {
    label?: string;
    tint?: string;
    glow?: string;
  } | null;
  propagationPayload?: unknown;
  scenarioTrigger?: ScenarioActionPropagationIntent | null;
  manualPropagationSourceId?: string | null;
  onScenarioOverlayChange?: (summary: WarRoomOverlaySummary | null, detail?: WarRoomOverlayDetail | null) => void;
  objectSelection?: {
    highlighted_objects?: string[];
    risk_sources?: string[];
    risk_targets?: string[];
    dim_unrelated_objects?: boolean;
  } | null;
  getUxForObject: (id: string) => { shape?: string; base_color?: string; opacity?: number; scale?: number } | null;
  objectUxById?: Record<string, { opacity?: number; scale?: number }>;
  selectedObjectId?: string | null;

  loops: any[];
  showLoops: boolean;
  showLoopLabels: boolean;
  showAxes?: boolean;
  showGrid?: boolean;
  showObjectDebugLabels?: boolean;
  showCameraHelper?: boolean;

  selectedSetterRef: React.MutableRefObject<(id: string | null) => void>;
  selectedIdRef: React.MutableRefObject<string | null>;
  overridesRef: React.MutableRefObject<Record<string, any>>;
  setOverrideRef: React.MutableRefObject<(id: string, patch: any) => void>;
  clearAllOverridesRef: React.MutableRefObject<() => void>;
  pruneOverridesRef: React.MutableRefObject<(ids: string[]) => void>;

  onPointerMissed: () => void;
  onOrbitStart: () => void;
  onOrbitEnd: () => void;
  onSelectedChange: (id: string | null) => void;
  onObjectPositionChange?: (
    objectId: string,
    position: { x: number; y: number; z: number },
    phase: "drag" | "move"
  ) => void;
  selectedRelationshipId?: string | null;
  onRelationshipSelect?: (relationship: NexoraRelationship) => void;
  selectedPropagationPathId?: string | null;
  onPropagationPathSelect?: (path: PropagationPath) => void;
  onCreateImpactPath?: (sourceObjectId?: string | null) => void;
  onSelectedScreenX?: (sx: number | null) => void;
  /** E2:8 embedded executive scene HUD (Type-C). */
  sceneInfoHud?: SceneInfoHudProps | null;
  /** E2:9 embedded executive object intelligence HUD (Type-C). */
  objectInfoHud?: {
    model: ObjectInfoHudModel;
    sceneJson: unknown;
    onCreateRelationship?: () => void;
    onDeleteRelationship?: (relationshipId: string) => void;
    onCreateImpactPath?: (sourceObjectId?: string | null) => void;
    onEditPropagationPath?: (pathId: string, patch: PropagationPathPatch) => void;
    onDeletePropagationPath?: (pathId: string) => void;
    onEditObject?: (objectId: string, patch: EditableObjectPatch) => void;
    onDuplicateObject?: (objectId: string) => void;
    onDeleteObject?: (objectId: string) => void;
  } | null;
  /** E2:10 embedded executive timeline HUD (Type-C). */
  timelineHud?: ExecutiveTimelineHudModel | null;
  /** E2:95 Type-C scenario simulation for spatial playback propagation. */
  scenarioSimulation?: TypeCScenarioSimulation | null;
  /** E2:96 active scenario layer changed during multi-scenario comparison. */
  onScenarioLayerSelect?: (scenarioId: string) => void;
  /** E2:97 war room command dispatch from scene-native command ribbon. */
  onWarRoomCommand?: (commandId: ExecutiveWarRoomCommandId) => void;
  /** E2:16 executive quick actions dock (Type-C). */
  quickActionsDock?: Omit<ExecutiveQuickActionsDockOverlayProps, "stackAboveTimeline"> | null;
  /** E2:22 executive status intelligence HUD (Type-C). */
  executiveStatusHud?: ExecutiveStatusHudModel | null;
  /** E2:21 scene-native executive navigation toolbar + shared HUD theme mode. */
  hudThemeMode?: NexoraHudThemeMode;
  sceneNavigationToolbar?: boolean;
  /** @deprecated Use sceneNavigationToolbar */
  cameraToolbar?: boolean;
};

function SceneFogSync({ color, near, far }: { color: string; near: number; far: number }) {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog(new THREE.Color(color), near, far);
    return () => {
      scene.fog = null;
    };
  }, [scene, color, near, far]);
  return null;
}

/** Demand frameloop: keep drawing while stable; pause invalidation briefly during shell column width animation. */
function SceneDemandInvalidateDriver({
  layoutPauseRef,
  invalidateOutRef,
  sceneJson,
  isOrbiting,
  localIsOrbitingRef,
  viewMode,
}: {
  layoutPauseRef: React.MutableRefObject<boolean>;
  invalidateOutRef: React.MutableRefObject<(() => void) | null>;
  sceneJson: unknown;
  isOrbiting: boolean;
  localIsOrbitingRef: React.MutableRefObject<boolean>;
  viewMode: WorkspaceViewMode;
}) {
  const { invalidate } = useThree();
  const lastFrameTickSignatureRef = useRef<string | null>(null);
  useLayoutEffect(() => {
    invalidateOutRef.current = invalidate;
    if (process.env.NODE_ENV !== "production") {
      const signature = "initial_layout_invalidate";
      if (lastFrameTickSignatureRef.current !== signature) {
        lastFrameTickSignatureRef.current = signature;
        console.debug("[Nexora][CanvasFrameTick]", { reason: "initial_layout_invalidate" });
      }
    }
    invalidate();
  }, [invalidate, invalidateOutRef]);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const signature = "scene_payload_changed";
      if (lastFrameTickSignatureRef.current !== signature) {
        lastFrameTickSignatureRef.current = signature;
        console.debug("[Nexora][CanvasFrameTick]", { reason: "scene_payload_changed" });
      }
    }
    invalidate();
  }, [sceneJson, invalidate]);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const signature = `view_mode_${viewMode}`;
      if (lastFrameTickSignatureRef.current !== signature) {
        lastFrameTickSignatureRef.current = signature;
        console.debug("[Nexora][CanvasFrameTick]", { reason: "view_mode_changed", viewMode });
      }
    }
    invalidate();
  }, [invalidate, viewMode]);
  useEffect(() => {
    if (!isOrbiting && !localIsOrbitingRef.current) return;
    if (layoutPauseRef.current) return;
    if (process.env.NODE_ENV !== "production") {
      const signature = "orbit_interaction";
      if (lastFrameTickSignatureRef.current !== signature) {
        lastFrameTickSignatureRef.current = signature;
        console.debug("[Nexora][CanvasFrameTick]", { reason: "orbit_interaction" });
      }
    }
    invalidate();
  }, [invalidate, isOrbiting, layoutPauseRef, localIsOrbitingRef]);
  return null;
}

function AnimatedScaleGroup({
  target,
  staticMode = false,
  children,
}: {
  target: number;
  staticMode?: boolean;
  children: React.ReactNode;
}) {
  if (staticMode) {
    return <group scale={target}>{children}</group>;
  }
  const g = useRef<THREE.Group>(null);
  const v = useRef<number>(target);
  useEffect(() => {
    v.current = target;
  }, [target]);
  useLayoutEffect(() => {
    if (!g.current) return;
    const s = v.current;
    g.current.scale.set(s, s, s);
  }, []);
  useFrame((_, delta) => {
    const current = g.current?.scale.x ?? 1;
    const next = smoothValue(current, v.current, delta, 10);
    if (g.current) g.current.scale.set(next, next, next);
  });
  return <group ref={g}>{children}</group>;
}

function SetterRegistrar({
  refSetter,
}: {
  refSetter: React.MutableRefObject<(id: string | null) => void>;
}) {
  const setSelectedId = useSetSelectedId();
  useEffect(() => {
    refSetter.current = (id: string | null) => setSelectedId(id);
  }, [refSetter, setSelectedId]);
  return null;
}

function FullRegistrar({
  selectedIdRefLocal,
  overridesRefLocal,
  setOverrideRefLocal,
  clearAllOverridesRefLocal,
  pruneOverridesRefLocal,
  onSelectedChange,
}: {
  selectedIdRefLocal: React.MutableRefObject<string | null>;
  overridesRefLocal: React.MutableRefObject<Record<string, any>>;
  setOverrideRefLocal: React.MutableRefObject<(id: string, patch: any) => void>;
  clearAllOverridesRefLocal: React.MutableRefObject<() => void>;
  pruneOverridesRefLocal: React.MutableRefObject<(ids: string[]) => void>;
  onSelectedChange: (id: string | null) => void;
}) {
  const selectedId = useSelectedId();
  const overrides = useOverrides();
  const setOverride = useSetOverride();
  const clearAll = useClearAllOverrides();
  const pruneTo = usePruneOverridesTo();
  const lastSelectedIdRef = useRef<string | null>(selectedId);

  useEffect(() => {
    selectedIdRefLocal.current = selectedId;
    if (lastSelectedIdRef.current === selectedId) return;
    lastSelectedIdRef.current = selectedId;
    onSelectedChange(selectedId);
  }, [selectedId, onSelectedChange, selectedIdRefLocal]);

  useEffect(() => {
    overridesRefLocal.current = overrides;
  }, [overrides, overridesRefLocal]);

  useEffect(() => {
    setOverrideRefLocal.current = (id: string, patch: any) => setOverride(id, patch);
  }, [setOverride, setOverrideRefLocal]);

  useEffect(() => {
    clearAllOverridesRefLocal.current = () => clearAll();
  }, [clearAll, clearAllOverridesRefLocal]);

  useEffect(() => {
    pruneOverridesRefLocal.current = (ids: string[]) => pruneTo(ids);
  }, [pruneTo, pruneOverridesRefLocal]);

  return null;
}

type Bounds3 = {
  min: [number, number, number];
  max: [number, number, number];
  center: [number, number, number];
  size: [number, number, number];
};

type CameraAuthorityState = {
  activeWriter: string | null;
  signature: string | null;
  cooldownUntil: number;
  appliedAt: number;
};

type CameraAuthorityRef = React.MutableRefObject<CameraAuthorityState>;

const CAMERA_AUTHORITY_COOLDOWN_MS = 800;
const SINGLE_OBJECT_OVERVIEW_MIN_DISTANCE = 8;
const loggedCameraAuthorityBlocks = new Set<string>();
const loggedVisualBoundsSignatures = new Set<string>();
const loggedCameraFrameSourceSignatures = new Set<string>();
const loggedSingleObjectCameraGuardSignatures = new Set<string>();
const loggedCameraWriteSignatures = new Set<string>();
const loggedCameraIntelligenceFinalWriterSignatures = new Set<string>();
const loggedOrbitGuardSignatures = new Set<string>();
const loggedLateCameraWriteSignatures = new Set<string>();

type SceneBoundsOptions = {
  layoutPositions?: Record<string, [number, number, number]>;
  globalScale?: number;
  objectUxById?: Record<string, { opacity?: number; scale?: number }>;
  getUxForObject?: (id: string) => { shape?: string; base_color?: string; opacity?: number; scale?: number } | null;
};

function markProgrammaticCameraUpdate(ref?: React.MutableRefObject<boolean>) {
  if (!ref) return;
  ref.current = true;
  queueMicrotask(() => {
    ref.current = false;
  });
}

function logOrbitGuardOnce(input: {
  blocked: true;
  kind: "orbit_start" | "orbit_end";
  reason: "programmatic_camera_update";
}) {
  if (process.env.NODE_ENV === "production") return;
  const signature = `${input.kind}:${input.reason}`;
  if (loggedOrbitGuardSignatures.has(signature)) return;
  loggedOrbitGuardSignatures.add(signature);
  console.log("[Nexora][OrbitGuard]", input);
}

function logCameraAuthorityBlock(input: {
  activeWriter: string | null;
  blockedWriter: string;
  reason: string;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  const logSignature = JSON.stringify(input);
  if (loggedCameraAuthorityBlocks.has(logSignature)) return;
  loggedCameraAuthorityBlocks.add(logSignature);
  console.log("[Nexora][CameraAuthority]", input);
}

function claimCameraAuthority(input: {
  authorityRef?: CameraAuthorityRef;
  writer: string;
  signature: string;
  reason: string;
  override?: boolean;
  cooldownMs?: number;
}): boolean {
  const authority = input.authorityRef?.current;
  if (!authority) return true;
  const now = performance.now();
  const sameSignature = authority.signature === input.signature;
  const competingWriter = Boolean(authority.activeWriter && authority.activeWriter !== input.writer);
  if (!input.override && authority.activeWriter === "visual_bounds_frame" && input.writer !== "visual_bounds_frame") {
    logCameraAuthorityBlock({
      activeWriter: authority.activeWriter,
      blockedWriter: input.writer,
      reason: input.reason,
      signature: input.signature,
    });
    return false;
  }
  if (!input.override && sameSignature && competingWriter) {
    logCameraAuthorityBlock({
      activeWriter: authority.activeWriter,
      blockedWriter: input.writer,
      reason: input.reason,
      signature: input.signature,
    });
    return false;
  }
  if (!input.override && competingWriter && now < authority.cooldownUntil) {
    logCameraAuthorityBlock({
      activeWriter: authority.activeWriter,
      blockedWriter: input.writer,
      reason: `${input.reason}:cooldown`,
      signature: input.signature,
    });
    return false;
  }
  authority.activeWriter = input.writer;
  authority.signature = input.signature;
  authority.appliedAt = now;
  authority.cooldownUntil = now + (input.cooldownMs ?? CAMERA_AUTHORITY_COOLDOWN_MS);
  return true;
}

function readCameraObjectPos(
  obj: any,
  layoutPositions?: Record<string, [number, number, number]>,
  index?: number
): [number, number, number] | null {
  const id = obj?.id != null ? String(obj.id) : "";
  const name = obj?.name != null ? String(obj.name) : "";
  const fromLayout =
    (id ? layoutPositions?.[id] : undefined) ??
    (name ? layoutPositions?.[name] : undefined);
  if (fromLayout) return fromLayout;

  const fromTransform = obj?.transform?.pos;
  const fromPosition = obj?.position;
  const src = Array.isArray(fromTransform) && fromTransform.length >= 3
    ? fromTransform
    : Array.isArray(fromPosition) && fromPosition.length >= 3
    ? fromPosition
    : null;
  if (!src && typeof index === "number") return [index * 1.8 - 1.8, 0, 0];
  if (!src) return null;
  const x = Number(src[0]);
  const y = Number(src[1]);
  const z = Number(src[2]);
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return null;
  return [x, y, z];
}

function readObjectPos(obj: any): [number, number, number] | null {
  return readCameraObjectPos(obj);
}

function readCameraObjectId(obj: any, index: number): string {
  return String(obj?.id ?? obj?.name ?? `obj_${index}`);
}

function resolveCameraObjectExtents(
  obj: any,
  index: number,
  objects: any[],
  options?: SceneBoundsOptions
): ObjectVisualExtents {
  const id = readCameraObjectId(obj, index);
  const ux = options?.getUxForObject?.(id) ?? null;
  const uxOverride = options?.objectUxById?.[id] ?? {};
  return resolveObjectVisualExtents(obj, {
    globalScale: options?.globalScale,
    uxScale: typeof uxOverride.scale === "number" ? uxOverride.scale : undefined,
    objectCount: objects.length,
    shape: (obj as { shape?: string })?.shape ?? ux?.shape ?? null,
  });
}

function computeSceneBounds(
  objects: any[],
  layoutPositionsOrOptions?: Record<string, [number, number, number]> | SceneBoundsOptions
): Bounds3 | null {
  const options: SceneBoundsOptions | undefined =
    layoutPositionsOrOptions && "layoutPositions" in layoutPositionsOrOptions
      ? layoutPositionsOrOptions
      : { layoutPositions: layoutPositionsOrOptions as Record<string, [number, number, number]> | undefined };
  const boxes: Array<{
    min: [number, number, number];
    max: [number, number, number];
  }> = [];
  for (let index = 0; index < objects.length; index += 1) {
    const obj = objects[index];
    const p = readCameraObjectPos(obj, options?.layoutPositions, index);
    if (!p) continue;
    const extents = resolveCameraObjectExtents(obj, index, objects, options);
    boxes.push({
      min: [p[0] - extents.width / 2, p[1] - extents.height / 2, p[2] - extents.depth / 2],
      max: [p[0] + extents.width / 2, p[1] + extents.height / 2, p[2] + extents.depth / 2],
    });
  }
  if (!boxes.length) return null;

  let minX = boxes[0].min[0];
  let minY = boxes[0].min[1];
  let minZ = boxes[0].min[2];
  let maxX = boxes[0].max[0];
  let maxY = boxes[0].max[1];
  let maxZ = boxes[0].max[2];

  for (const box of boxes) {
    minX = Math.min(minX, box.min[0]);
    minY = Math.min(minY, box.min[1]);
    minZ = Math.min(minZ, box.min[2]);
    maxX = Math.max(maxX, box.max[0]);
    maxY = Math.max(maxY, box.max[1]);
    maxZ = Math.max(maxZ, box.max[2]);
  }

  const center: [number, number, number] = [
    (minX + maxX) / 2,
    (minY + maxY) / 2,
    (minZ + maxZ) / 2,
  ];
  const size: [number, number, number] = [
    Math.max(0.1, maxX - minX),
    Math.max(0.1, maxY - minY),
    Math.max(0.1, maxZ - minZ),
  ];

  return {
    min: [minX, minY, minZ],
    max: [maxX, maxY, maxZ],
    center,
    size,
  };
}

function computeCameraFrameFromBounds(
  bounds: Bounds3,
  opts?: {
    horizontalBias?: number;
    verticalBias?: number;
    pullback?: number;
    objectCount?: number;
    relationshipCount?: number;
    viewportWidth?: number;
    viewportHeight?: number;
    viewMode?: WorkspaceViewMode;
  }
): { position: [number, number, number]; lookAt: [number, number, number]; fov: number } {
  const executiveDistance = calculateExecutiveCameraDistance({
    objectCount: opts?.objectCount ?? 1,
    relationshipCount: opts?.relationshipCount ?? 0,
    boundsSize: bounds.size,
    viewportWidth: opts?.viewportWidth,
    viewportHeight: opts?.viewportHeight,
  });
  const radius = executiveDistance.distance;
  const viewMode = opts?.viewMode ?? "2D";
  return resolveExecutiveCameraFrameForMode(
    viewMode,
    { center: bounds.center, size: bounds.size },
    radius,
    {
      horizontalBias: opts?.horizontalBias,
      verticalBias: opts?.verticalBias,
      pullback: opts?.pullback,
    }
  );
}

function sceneObjectsSignature(
  objects: any[],
  layoutPositionsOrOptions?: Record<string, [number, number, number]> | SceneBoundsOptions
): string {
  const options: SceneBoundsOptions | undefined =
    layoutPositionsOrOptions && "layoutPositions" in layoutPositionsOrOptions
      ? layoutPositionsOrOptions
      : { layoutPositions: layoutPositionsOrOptions as Record<string, [number, number, number]> | undefined };
  if (!Array.isArray(objects) || !objects.length) return "empty";
  return objects
    .map((obj, idx) => {
      const id = readCameraObjectId(obj, idx);
      const p = readCameraObjectPos(obj, options?.layoutPositions, idx);
      const extents = resolveCameraObjectExtents(obj, idx, objects, options);
      if (!p) return `${id}:na`;
      return `${id}:${p[0].toFixed(2)},${p[1].toFixed(2)},${p[2].toFixed(2)}:${buildObjectVisualExtentsSignature(extents)}`;
    })
    .join("|");
}

function logVisualBoundsOnce(input: {
  objects: any[];
  bounds: Bounds3;
  options?: SceneBoundsOptions;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  if (loggedVisualBoundsSignatures.has(input.signature)) return;
  loggedVisualBoundsSignatures.add(input.signature);
  let largestObjectId: string | null = null;
  let largestObjectExtent = 0;
  input.objects.forEach((object, index) => {
    const extents = resolveCameraObjectExtents(object, index, input.objects, input.options);
    const maxExtent = Math.max(extents.width, extents.height, extents.depth);
    if (maxExtent > largestObjectExtent) {
      largestObjectExtent = maxExtent;
      largestObjectId = readCameraObjectId(object, index);
    }
  });
  console.log("[Nexora][VisualBounds]", {
    objectCount: input.objects.length,
    boundsSize: input.bounds.size,
    largestObjectId,
    largestObjectExtent: Number(largestObjectExtent.toFixed(3)),
    source: "visual_extents",
  });
}

function logCameraFrameSourceOnce(input: {
  source: "visual_bounds";
  writer: string;
  objectCount: number;
  boundsSize: [number, number, number];
  position: [number, number, number];
  lookAt: [number, number, number];
  viewMode: WorkspaceViewMode;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  if (loggedCameraFrameSourceSignatures.has(input.signature)) return;
  loggedCameraFrameSourceSignatures.add(input.signature);
  console.log("[Nexora][CameraFrameSource]", {
    source: input.source,
    writer: input.writer,
    objectCount: input.objectCount,
    boundsSize: input.boundsSize,
    position: input.position,
    lookAt: input.lookAt,
    viewMode: input.viewMode,
  });
}

function getSingleSceneObjectId(objects: any[]): string | null {
  if (objects.length !== 1) return null;
  const object = objects[0];
  return String(object?.id ?? object?.name ?? "object");
}

function cameraFrameDistance(frame: { position: [number, number, number]; lookAt: [number, number, number] }): number {
  const dx = frame.position[0] - frame.lookAt[0];
  const dy = frame.position[1] - frame.lookAt[1];
  const dz = frame.position[2] - frame.lookAt[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function enforceSingleObjectOverviewFrame<T extends { position: [number, number, number]; lookAt: [number, number, number] }>(
  frame: T,
  minDistance = SINGLE_OBJECT_OVERVIEW_MIN_DISTANCE
): T {
  const distance = cameraFrameDistance(frame);
  if (distance >= minDistance) return frame;
  const [px, py, pz] = frame.position;
  const [tx, ty, tz] = frame.lookAt;
  const dx = px - tx;
  const dy = py - ty;
  const dz = pz - tz;
  const length = Math.max(1e-6, Math.sqrt(dx * dx + dy * dy + dz * dz));
  const scale = minDistance / length;
  return {
    ...frame,
    position: [tx + dx * scale, ty + dy * scale, tz + dz * scale],
  };
}

function logSingleObjectCameraGuardOnce(input: {
  objectCount: number;
  objectId: string | null;
  blockedWriter: string;
  reason: string;
  finalCameraDistance: number;
  finalTarget: [number, number, number];
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  if (loggedSingleObjectCameraGuardSignatures.has(input.signature)) return;
  loggedSingleObjectCameraGuardSignatures.add(input.signature);
  console.log("[Nexora][SingleObjectCameraGuard]", {
    objectCount: input.objectCount,
    objectId: input.objectId,
    blockedWriter: input.blockedWriter,
    reason: input.reason,
    finalCameraDistance: Number(input.finalCameraDistance.toFixed(3)),
    finalTarget: input.finalTarget,
  });
}

function logCameraWriteOnce(input: {
  writer: string;
  objectCount: number;
  preset?: string | null;
  focusObjectId?: string | null;
  position: [number, number, number];
  target: [number, number, number];
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  if (loggedCameraWriteSignatures.has(input.signature)) return;
  loggedCameraWriteSignatures.add(input.signature);
  console.log("[Nexora][CameraWrite]", {
    writer: input.writer,
    objectCount: input.objectCount,
    preset: input.preset ?? null,
    focusObjectId: input.focusObjectId ?? null,
    position: input.position,
    target: input.target,
    signature: input.signature,
  });
}

function logLateCameraWriteOnce(input: {
  writer: string;
  reason: string;
  objectCount: number;
  layoutSignature: string | null;
  authorityWriter: string | null;
  position: [number, number, number];
  target: [number, number, number];
  mountedAtMs?: number;
  blocked?: boolean;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  if (loggedLateCameraWriteSignatures.has(input.signature)) return;
  loggedLateCameraWriteSignatures.add(input.signature);
  const now = performance.now();
  console.log("[Nexora][LateCameraWrite]", {
    writer: input.writer,
    timeSinceMountMs: input.mountedAtMs != null ? Number((now - input.mountedAtMs).toFixed(1)) : null,
    position: input.position,
    target: input.target,
    reason: input.reason,
    objectCount: input.objectCount,
    layoutSignature: input.layoutSignature,
    authorityWriter: input.authorityWriter,
    blocked: input.blocked === true,
  });
}

function isLateVisualBoundsOverrideBlocked(input: {
  authorityRef?: CameraAuthorityRef;
  writer: string;
  explicitUserAction?: boolean;
  windowMs?: number;
}): boolean {
  const authority = input.authorityRef?.current;
  if (!authority || input.explicitUserAction === true) return false;
  if (authority.activeWriter !== "visual_bounds_frame") return false;
  if (input.writer === "visual_bounds_frame") return false;
  return performance.now() - authority.appliedAt < (input.windowMs ?? 2000);
}

function logCameraIntelligenceFinalWriterOnce(input: {
  desiredWriter: string;
  authorityWriter: string | null;
  visualBoundsActive: boolean;
  position: [number, number, number];
  target: [number, number, number];
  baselinePosition: [number, number, number];
  baselineTarget: [number, number, number];
  reason: string;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  if (loggedCameraIntelligenceFinalWriterSignatures.has(input.signature)) return;
  loggedCameraIntelligenceFinalWriterSignatures.add(input.signature);
  console.log("[Nexora][CameraIntelligence][FinalWriter]", {
    desiredWriter: input.desiredWriter,
    authorityWriter: input.authorityWriter,
    visualBoundsActive: input.visualBoundsActive,
    position: input.position,
    target: input.target,
    baselinePosition: input.baselinePosition,
    baselineTarget: input.baselineTarget,
    reason: input.reason,
  });
}

const loggedLayoutAwareCameraBounds = new Set<string>();

function logLayoutAwareCameraBoundsOnce(input: {
  objectCount: number;
  layoutPositionCount: number;
  bounds: Bounds3;
  cameraPosition: [number, number, number];
  lookAt: [number, number, number];
  viewMode: WorkspaceViewMode;
}) {
  if (process.env.NODE_ENV === "production") return;
  const signature = JSON.stringify({
    objectCount: input.objectCount,
    layoutPositionCount: input.layoutPositionCount,
    bounds: input.bounds,
    cameraPosition: input.cameraPosition.map((value) => Number(value.toFixed(3))),
    lookAt: input.lookAt.map((value) => Number(value.toFixed(3))),
    viewMode: input.viewMode,
  });
  if (loggedLayoutAwareCameraBounds.has(signature)) return;
  loggedLayoutAwareCameraBounds.add(signature);
  console.log("[Nexora][CameraBounds][LayoutAware]", {
    objectCount: input.objectCount,
    layoutPositionCount: input.layoutPositionCount,
    bounds: input.bounds,
    cameraPosition: input.cameraPosition,
    lookAt: input.lookAt,
    viewMode: input.viewMode,
    source: "layout_positions",
  });
}

function CameraIntelligence({
  selectedObjectId,
  focusPinned,
  focusMode,
  focusedId,
  sceneJson,
  camPos,
  overridesRef,
  cameraLockedByUser,
  isOrbiting,
  hudDockSide,
  layoutDockInsets,
  controlsRef,
  localIsOrbitingRef,
  preserveCameraOnClearRef,
  orbitControlsEnabled,
  layoutPauseRef,
  layoutPositions,
  cameraAuthorityRef,
  visualBoundsOptions,
  layoutBoundsSignature,
  settledLayoutBoundsSignature,
  initialLayoutFrameAppliedRef,
  programmaticCameraUpdateRef,
  mountedAtMs,
  userExplicitlySelected2D = false,
  layoutResumeNonce: _layoutResumeNonce,
}: {
  selectedObjectId: string | null;
  focusPinned: boolean;
  focusMode: "all" | "selected";
  focusedId: string | null;
  sceneJson: any | null;
  camPos: [number, number, number];
  overridesRef: React.MutableRefObject<Record<string, any>>;
  cameraLockedByUser: boolean;
  isOrbiting: boolean;
  hudDockSide?: "left" | "right";
  layoutDockInsets?: {
    leftDockInsetRatio?: number;
    rightDockInsetRatio?: number;
  };
  controlsRef?: React.MutableRefObject<any | null>;
  localIsOrbitingRef?: React.MutableRefObject<boolean>;
  preserveCameraOnClearRef?: React.MutableRefObject<boolean>;
  orbitControlsEnabled: boolean;
  layoutPauseRef?: React.MutableRefObject<boolean>;
  layoutPositions?: Record<string, [number, number, number]>;
  cameraAuthorityRef?: CameraAuthorityRef;
  visualBoundsOptions?: SceneBoundsOptions;
  layoutBoundsSignature?: string;
  settledLayoutBoundsSignature?: string | null;
  initialLayoutFrameAppliedRef?: React.MutableRefObject<string | null>;
  programmaticCameraUpdateRef?: React.MutableRefObject<boolean>;
  mountedAtMs?: number;
  userExplicitlySelected2D?: boolean;
  /** Bumped when left command column finishes width transition so layout-aware framing can re-run. */
  layoutResumeNonce?: number;
}) {
  const { camera, size } = useThree();
  const focusTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const desiredCamPosRef = useRef<THREE.Vector3>(
    new THREE.Vector3(camPos[0], camPos[1], camPos[2])
  );
  const desiredLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const defaultCamPosRef = useRef<THREE.Vector3>(
    new THREE.Vector3(camPos[0], camPos[1], camPos[2])
  );
  const defaultLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const tmpLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const tmpCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const lastFocusIdRef = useRef<string | null>(null);
  const lastAutoFrameSigRef = useRef<string>("");
  const lastSceneJsonRef = useRef<any>(null);
  const hasSeededCameraRef = useRef<boolean>(false);
  const suspendAutoCameraUntilRef = useRef<number>(0);
  const lastCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(camPos[0], camPos[1], camPos[2]));
  const lastControlTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const lastCameraAssistKeyRef = useRef<string>("");
  const lastCameraFocusSignatureRef = useRef<string | null>(null);
  const baselineCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(camPos[0], camPos[1], camPos[2]));
  const baselineLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const lastBaselineSignatureRef = useRef<string>("");
  const lastDriftRecoveryAtRef = useRef<number>(0);
  const lastDriftLogSigRef = useRef<string>("");
  const lastRecoveryLogSigRef = useRef<string>("");
  const lastCameraOverrideBlockedSigRef = useRef<string>("");
  const lastLayoutFrameAppliedAtRef = useRef<number>(0);
  const lastLayoutFrameKeyRef = useRef<string>("");
  const lastViewportRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const desiredCameraWriterRef = useRef<string>("CameraIntelligence");
  const visualBoundsFrameActiveRef = useRef(false);
  const lastVisualBoundsFrameSignatureRef = useRef<string | null>(null);
  const viewportModeResolvedLogRef = useRef<string>("");
  /** Stops micro-jitter when camera is already essentially at the framing target. */
  const lastCamToTargetDistRef = useRef<number | null>(null);

  /** World-units: desired already matches baseline (avoid pointless recovery writes). */
  const FRAMING_DESIRED_BASELINE_EPS = 0.00025;

  const captureBaselineFrame = (
    position: [number, number, number],
    lookAt: [number, number, number],
    signature: string
  ) => {
    baselineCamPosRef.current.set(position[0], position[1], position[2]);
    baselineLookAtRef.current.set(lookAt[0], lookAt[1], lookAt[2]);
    defaultCamPosRef.current.set(position[0], position[1], position[2]);
    defaultLookAtRef.current.set(lookAt[0], lookAt[1], lookAt[2]);
    lastBaselineSignatureRef.current = signature;
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][Framing] baseline captured", { signature, position, lookAt });
    }
  };

  useLayoutEffect(() => {
    defaultCamPosRef.current.set(camPos[0], camPos[1], camPos[2]);
    if (!hasSeededCameraRef.current) {
      hasSeededCameraRef.current = true;
      desiredCamPosRef.current.set(camPos[0], camPos[1], camPos[2]);
      markProgrammaticCameraUpdate(programmaticCameraUpdateRef);
      camera.position.set(camPos[0], camPos[1], camPos[2]);
      logCameraWriteOnce({
        writer: "CameraIntelligence",
        objectCount: Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects.length : 0,
        preset: "initial_seed",
        focusObjectId: null,
        position: [camPos[0], camPos[1], camPos[2]],
        target: [0, 0, 0],
        signature: `initial_seed:${camPos.map((value) => Number(value).toFixed(3)).join(",")}`,
      });
    }
  }, [camPos, camera, sceneJson]);

  useEffect(() => {
    if (orbitControlsEnabled) return;
    suspendAutoCameraUntilRef.current = performance.now() + 420;
  }, [orbitControlsEnabled]);

  useEffect(() => {
    const lookAt = sceneJson?.scene?.camera?.lookAt;
    if (!Array.isArray(lookAt) || lookAt.length < 3) {
      defaultLookAtRef.current.set(0, 0, 0);
      return;
    }
    const x = Number(lookAt[0]);
    const y = Number(lookAt[1]);
    const z = Number(lookAt[2]);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      defaultLookAtRef.current.set(0, 0, 0);
      return;
    }
    defaultLookAtRef.current.set(x, y, z);
    if (
      visualBoundsFrameActiveRef.current &&
      cameraAuthorityRef?.current.activeWriter === "visual_bounds_frame"
    ) {
      return;
    }
    desiredLookAtRef.current.set(x, y, z);
    currentLookAtRef.current.set(x, y, z);
  }, [cameraAuthorityRef, sceneJson?.scene?.camera?.lookAt]);

  useLayoutEffect(() => {
    const sceneCamera = sceneJson?.scene?.camera ?? {};
    const hasExplicitPos = Array.isArray(sceneCamera?.pos) && sceneCamera.pos.length >= 3;
    const shouldAutoFrame = sceneCamera?.autoFrame === true || !hasExplicitPos;
    if (!shouldAutoFrame) return;

    if (lastSceneJsonRef.current !== sceneJson) {
      lastSceneJsonRef.current = sceneJson;
      lastAutoFrameSigRef.current = "";
    }

    const objects = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
    const boundsOptions: SceneBoundsOptions = {
      ...(visualBoundsOptions ?? {}),
      layoutPositions,
    };
    const signature = sceneObjectsSignature(objects, boundsOptions);
    const layoutPositionCount = layoutPositions ? Object.keys(layoutPositions).length : 0;
    const hasSettledLayout =
      Boolean(layoutBoundsSignature) &&
      settledLayoutBoundsSignature === layoutBoundsSignature &&
      layoutPositionCount === objects.length;
    const viewportDelta = Math.abs(size.width - lastViewportRef.current.width) + Math.abs(size.height - lastViewportRef.current.height);
    lastViewportRef.current = { width: size.width, height: size.height };
    if (layoutPauseRef?.current) return;
    if (!signature || signature === "empty") return;
    if (layoutBoundsSignature && !hasSettledLayout) return;
    if (layoutBoundsSignature && initialLayoutFrameAppliedRef?.current === layoutBoundsSignature) {
      return;
    }
    const previousSignature = lastAutoFrameSigRef.current;
    const stability = evaluateCameraStability({
      trigger: "auto_frame",
      nextObjectCount: objects.length,
      signatureChanged: previousSignature !== signature,
    });
    if (!stability.allowFullReframe) {
      lastAutoFrameSigRef.current = signature;
      registerAutoFrameSignature(signature, objects.length);
      return;
    }
    if (lastAutoFrameSigRef.current === signature) return;

    const bounds = computeSceneBounds(objects, boundsOptions);
    if (!bounds) return;

    const frameSpec = resolveLayoutAwareFrameSpec({
      viewportWidth: size.width,
      viewportHeight: size.height,
      hudDockSide,
      leftDockInsetRatio: layoutDockInsets?.leftDockInsetRatio,
      rightDockInsetRatio: layoutDockInsets?.rightDockInsetRatio,
    });
    const rawViewMode = getWorkspaceViewMode();
    const objectCount = objects.length;
    const resolvedFramingViewMode: WorkspaceViewMode =
      rawViewMode === "2D" && objectCount >= 4 && !userExplicitlySelected2D ? "3D" : rawViewMode;
    const viewportModeReason =
      rawViewMode === "2D" && objectCount >= 4 && !userExplicitlySelected2D
        ? "type_c_multi_object_default_3d_overview"
        : "preserve_workspace_view_mode";
    const viewportModeSignature = `${rawViewMode}:${resolvedFramingViewMode}:${objectCount}:${viewportModeReason}:CameraIntelligence`;
    if (process.env.NODE_ENV !== "production" && viewportModeResolvedLogRef.current !== viewportModeSignature) {
      viewportModeResolvedLogRef.current = viewportModeSignature;
      console.debug("[Nexora][ViewportModeResolved]", {
        rawViewMode,
        resolvedFramingViewMode,
        objectCount,
        source: "CameraIntelligence",
        reason: viewportModeReason,
      });
    }

    const rawFrame = computeCameraFrameFromBounds(bounds, {
      horizontalBias: frameSpec.horizontalBias,
      verticalBias: frameSpec.verticalBias,
      pullback: objects.length <= 1 ? Math.max(frameSpec.pullback, 1.45) : frameSpec.pullback,
      objectCount: objects.length,
      relationshipCount: countSceneRelationships(sceneJson),
      viewportWidth: size.width,
      viewportHeight: size.height,
      viewMode: resolvedFramingViewMode,
    });
    const frame =
      objects.length <= 1
        ? enforceSingleObjectOverviewFrame(rawFrame, SINGLE_OBJECT_OVERVIEW_MIN_DISTANCE)
        : rawFrame;
    if (objects.length <= 1) {
      logSingleObjectCameraGuardOnce({
        objectCount: objects.length,
        objectId: getSingleSceneObjectId(objects),
        blockedWriter: "CameraIntelligence",
        reason: "startup_single_object_overview_frame",
        finalCameraDistance: cameraFrameDistance(frame),
        finalTarget: frame.lookAt,
        signature: `auto_frame:${signature}:${resolvedFramingViewMode}`,
      });
    }
    logLayoutAwareCameraBoundsOnce({
      objectCount: objects.length,
      layoutPositionCount: layoutPositions ? Object.keys(layoutPositions).length : 0,
      bounds,
      cameraPosition: frame.position,
      lookAt: frame.lookAt,
      viewMode: resolvedFramingViewMode,
    });
    logVisualBoundsOnce({
      objects,
      bounds,
      options: boundsOptions,
      signature,
    });

    const frameKey = [
      signature,
      hudDockSide ?? "none",
      size.width.toFixed(1),
      size.height.toFixed(1),
      frame.position.map((n) => n.toFixed(3)).join(","),
      frame.lookAt.map((n) => n.toFixed(3)).join(","),
    ].join("|");
    if (
      !claimCameraAuthority({
        authorityRef: cameraAuthorityRef,
        writer: "visual_bounds_frame",
        signature: layoutBoundsSignature ? `visual_bounds_frame:${layoutBoundsSignature}` : frameKey,
        reason: "layout_auto_frame",
      })
    ) {
      lastAutoFrameSigRef.current = signature;
      registerAutoFrameSignature(signature, objects.length);
      return;
    }

    const now = performance.now();
    const frameAlreadyApplied = lastLayoutFrameKeyRef.current === frameKey;
    const tinyViewportChange = viewportDelta < 2;
    const recentlyApplied = now - lastLayoutFrameAppliedAtRef.current < 250;

    if (frameAlreadyApplied || (tinyViewportChange && recentlyApplied)) {
      return;
    }

    const visualBoundsFrameSignature = layoutBoundsSignature ?? frameKey;
    captureBaselineFrame(frame.position, frame.lookAt, visualBoundsFrameSignature);
    desiredCamPosRef.current.set(frame.position[0], frame.position[1], frame.position[2]);
    desiredLookAtRef.current.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
    currentLookAtRef.current.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
    desiredCameraWriterRef.current = "visual_bounds_frame";
    visualBoundsFrameActiveRef.current = true;
    lastVisualBoundsFrameSignatureRef.current = visualBoundsFrameSignature;

    // Apply the fresh frame immediately so first visible frame is stable.
    const applyNow = performance.now();
    const autoCameraSuspended = applyNow < suspendAutoCameraUntilRef.current;
    if (!cameraLockedByUser && !(localIsOrbitingRef?.current || isOrbiting) && !autoCameraSuspended) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][SceneInteraction] layout-aware frame region updated", frameSpec);
      }
      markProgrammaticCameraUpdate(programmaticCameraUpdateRef);
      camera.position.set(frame.position[0], frame.position[1], frame.position[2]);
      lastCameraPosRef.current.set(frame.position[0], frame.position[1], frame.position[2]);
      const controls = controlsRef?.current;
      if (controls?.target) {
        controls.target.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
        lastControlTargetRef.current.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
        controls.update();
      } else {
        currentLookAtRef.current.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
        camera.lookAt(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
      }
      logCameraWriteOnce({
        writer: "CameraIntelligence",
        objectCount: objects.length,
        preset: "visual_bounds_frame",
        focusObjectId: null,
        position: frame.position,
        target: frame.lookAt,
        signature: `CameraIntelligence:${frameKey}`,
      });
      logLateCameraWriteOnce({
        writer: "visual_bounds_frame",
        reason: "initial_visual_bounds_frame",
        objectCount: objects.length,
        layoutSignature: visualBoundsFrameSignature,
        authorityWriter: cameraAuthorityRef?.current.activeWriter ?? null,
        position: frame.position,
        target: frame.lookAt,
        mountedAtMs,
        blocked: false,
        signature: `visual_bounds_frame:${visualBoundsFrameSignature}:${frameKey}`,
      });
    }
    lastLayoutFrameAppliedAtRef.current = applyNow;
    lastLayoutFrameKeyRef.current = frameKey;
    if (layoutBoundsSignature && initialLayoutFrameAppliedRef) {
      initialLayoutFrameAppliedRef.current = layoutBoundsSignature;
    }

    lastAutoFrameSigRef.current = signature;
    registerAutoFrameSignature(signature, objects.length);
  }, [
    sceneJson,
    layoutPositions,
    layoutBoundsSignature,
    settledLayoutBoundsSignature,
    initialLayoutFrameAppliedRef,
    hudDockSide,
    camera,
    cameraAuthorityRef,
    cameraLockedByUser,
    controlsRef,
    isOrbiting,
    localIsOrbitingRef,
    size.height,
    size.width,
    programmaticCameraUpdateRef,
    mountedAtMs,
    _layoutResumeNonce,
    userExplicitlySelected2D,
  ]);

  useEffect(() => {
    const stableSelectedId =
      typeof selectedObjectId === "string" && selectedObjectId.trim().length > 0
        ? selectedObjectId.trim()
        : null;
    const cameraFocusSignature = stableSelectedId ? `selected:${stableSelectedId}` : "none";
    if (lastCameraFocusSignatureRef.current === cameraFocusSignature) {
      return;
    }
    lastCameraFocusSignatureRef.current = cameraFocusSignature;

    if (!stableSelectedId) {
      return;
    }

    const sceneObjects = Array.isArray(sceneJson?.scene?.objects) ? (sceneJson.scene.objects as any[]) : [];
    const isFocusActive = focusPinned || focusMode === "selected";
    if (sceneObjects.length <= 1 && !isFocusActive) {
      const layoutCameraActive =
        Boolean(layoutBoundsSignature) ||
        visualBoundsFrameActiveRef.current ||
        desiredCameraWriterRef.current === "visual_bounds_frame" ||
        cameraAuthorityRef?.current.activeWriter === "visual_bounds_frame";
      if (layoutCameraActive) {
        lastFocusIdRef.current = null;
        return;
      }
      desiredCamPosRef.current.copy(baselineCamPosRef.current);
      desiredLookAtRef.current.copy(baselineLookAtRef.current);
      const controls = controlsRef?.current;
      if (controls?.target) {
        currentLookAtRef.current.copy(controls.target);
        lastControlTargetRef.current.copy(controls.target);
      }
      lastFocusIdRef.current = null;
      logSingleObjectCameraGuardOnce({
        objectCount: sceneObjects.length,
        objectId: getSingleSceneObjectId(sceneObjects) ?? stableSelectedId,
        blockedWriter: "CameraIntelligence",
        reason: "blocked_implicit_single_object_focus",
        finalCameraDistance: baselineCamPosRef.current.distanceTo(baselineLookAtRef.current),
        finalTarget: [
          baselineLookAtRef.current.x,
          baselineLookAtRef.current.y,
          baselineLookAtRef.current.z,
        ],
        signature: `implicit_focus:${stableSelectedId}:${lastBaselineSignatureRef.current}`,
      });
      return;
    }
    if (!isFocusActive || !focusedId) {
      // Empty-scene deselection should not force camera reframe/reset.
      // Freeze the current camera + target as the desired state so no visible slide happens.
      if (preserveCameraOnClearRef?.current) {
        preserveCameraOnClearRef.current = false;

        desiredCamPosRef.current.copy(camera.position);

        const controls = controlsRef?.current;
        if (controls?.target) {
          desiredLookAtRef.current.copy(controls.target);
          currentLookAtRef.current.copy(controls.target);
          lastControlTargetRef.current.copy(controls.target);
        } else {
          desiredLookAtRef.current.copy(currentLookAtRef.current);
          lastControlTargetRef.current.copy(currentLookAtRef.current);
        }

        lastFocusIdRef.current = null;
        return;
      }
      if (cameraLockedByUser || !orbitControlsEnabled) {
        desiredCamPosRef.current.copy(camera.position);
        const controls = controlsRef?.current;
        if (controls?.target) {
          desiredLookAtRef.current.copy(controls.target);
          currentLookAtRef.current.copy(controls.target);
          lastControlTargetRef.current.copy(controls.target);
        } else {
          desiredLookAtRef.current.copy(currentLookAtRef.current);
          lastControlTargetRef.current.copy(currentLookAtRef.current);
        }
      } else {
        if (
          visualBoundsFrameActiveRef.current &&
          cameraAuthorityRef?.current.activeWriter === "visual_bounds_frame"
        ) {
          return;
        }
        desiredCamPosRef.current.copy(defaultCamPosRef.current);
        desiredLookAtRef.current.copy(defaultLookAtRef.current);
        desiredCameraWriterRef.current = "CameraIntelligence";
      }
      lastFocusIdRef.current = null;
      return;
    }

    // Selection/focus is visual/UI state only; do not move/reframe camera on object click.
    // Keep desired camera target stable unless an explicit framing system changes it.
    lastCameraPosRef.current.copy(camera.position);
    const controls = controlsRef?.current;
    if (controls?.target) {
      lastControlTargetRef.current.copy(controls.target);
    }
    // Keep desired camera target stable unless an explicit framing system changes it.
    lastFocusIdRef.current = stableSelectedId;
    const targetObject =
      sceneObjects.find((item) => {
        const stableId = String(item?.id ?? item?.name ?? "");
        return stableId === stableSelectedId;
      }) ?? null;
    const targetIndex = sceneObjects.findIndex((item) => item === targetObject);
    const targetPos = targetObject ? readCameraObjectPos(targetObject, layoutPositions, targetIndex) : null;
    if (!targetPos) return;
    const frameSpec = resolveLayoutAwareFrameSpec({
      viewportWidth: size.width,
      viewportHeight: size.height,
      hudDockSide,
      leftDockInsetRatio: layoutDockInsets?.leftDockInsetRatio,
      rightDockInsetRatio: layoutDockInsets?.rightDockInsetRatio,
    });
    const baselineCamPos = baselineCamPosRef.current;
    const baselineLookAt = baselineLookAtRef.current;
    desiredCamPosRef.current.copy(baselineCamPos);
    desiredLookAtRef.current.copy(baselineLookAt);
    const projected = new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2]).project(camera);
    const assistKey = `${stableSelectedId}:${projected.x.toFixed(1)}:${projected.y.toFixed(1)}`;
    if (lastCameraAssistKeyRef.current === assistKey) return;
    const isVisible = isProjectedPointWithinSafeRegion(projected, frameSpec.safeRegion);
    if (isVisible) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][Framing] assist skipped (already safe)", { focusedId, projected, safeRegion: frameSpec.safeRegion });
      }
      lastCameraAssistKeyRef.current = assistKey;
      return;
    }
    const bounds = computeSceneBounds(
      Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [],
      {
        ...(visualBoundsOptions ?? {}),
        layoutPositions,
      }
    );
    const sceneR = bounds ? sceneRadiusFromBoundsSize(bounds.size) : 4;
    const focusVector = new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2]);
    const rawNext = baselineLookAt.clone().lerp(focusVector, CALM_FRAMING.maxFocusAssistLookLerp);
    const clamped = clampLookAtDeltaToRadius(
      baselineLookAt,
      rawNext,
      sceneR,
      CALM_FRAMING.maxLookShiftVsRadius
    );
    const nextLookAt = new THREE.Vector3(clamped.x, clamped.y, clamped.z);
    const delta = nextLookAt.clone().sub(baselineLookAt);
    desiredLookAtRef.current.copy(nextLookAt);
    desiredCamPosRef.current.copy(baselineCamPos);
    desiredCamPosRef.current.x += delta.x * CALM_FRAMING.focusAssistCamPosAlongDelta;
    desiredCamPosRef.current.y += delta.y * CALM_FRAMING.focusAssistCamPosVerticalScale;
    desiredCameraWriterRef.current = "FocusMode";
    suspendAutoCameraUntilRef.current = performance.now() + 380;
    lastCameraAssistKeyRef.current = assistKey;
    globalThis.console?.debug?.("[Nexora][CalmCameraMove]", {
      selectedObjectId: stableSelectedId,
      signature: cameraFocusSignature,
    });
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][Framing] assist applied", { focusedId, projected, safeRegion: frameSpec.safeRegion });
    }
  }, [camera, cameraAuthorityRef, cameraLockedByUser, controlsRef, focusMode, focusPinned, focusedId, hudDockSide, layoutBoundsSignature, layoutDockInsets, layoutPositions, orbitControlsEnabled, overridesRef, preserveCameraOnClearRef, sceneJson, selectedObjectId, size.height, size.width, visualBoundsOptions]);

  const applyHudShift = (lookAt: THREE.Vector3, camPosV: THREE.Vector3) => {
    const frameSpec = resolveLayoutAwareFrameSpec({
      viewportWidth: size.width,
      viewportHeight: size.height,
      hudDockSide,
      leftDockInsetRatio: layoutDockInsets?.leftDockInsetRatio,
      rightDockInsetRatio: layoutDockInsets?.rightDockInsetRatio,
    });
    if (!hudDockSide) return;
    const shiftSign = hudDockSide === "left" ? 1 : -1;
    const shift = frameSpec.worldShift;
    lookAt.x += shiftSign * shift;
    camPosV.x += shiftSign * (shift * 0.42);
  };

  useFrame(() => {
    const now = performance.now();
    const userOrbiting = !!localIsOrbitingRef?.current || isOrbiting;
    const controls = controlsRef?.current;

    if (userOrbiting) {
      suspendAutoCameraUntilRef.current = now + CALM_FRAMING.userSettleAfterOrbitMs;
      lastCameraPosRef.current.copy(camera.position);
      lastCamToTargetDistRef.current = null;
      if (controls?.target) {
        lastControlTargetRef.current.copy(controls.target);
      }
      return;
    }

    if (layoutPauseRef?.current) {
      lastCameraPosRef.current.copy(camera.position);
      if (controls?.target) {
        lastControlTargetRef.current.copy(controls.target);
      }
      return;
    }

    if (cameraLockedByUser || !orbitControlsEnabled) {
      lastCameraPosRef.current.copy(camera.position);
      if (controls?.target) {
        lastControlTargetRef.current.copy(controls.target);
      }
      return;
    }

    if (now < suspendAutoCameraUntilRef.current) {
      lastCameraPosRef.current.copy(camera.position);
      if (controls?.target) {
        lastControlTargetRef.current.copy(controls.target);
      }
      return;
    }

    const hasExplicitFocus = (focusPinned || focusMode === "selected") && !!focusedId;
    if (!hasExplicitFocus) {
      const currentLookAt = controls?.target ?? currentLookAtRef.current;
      const visualBoundsOwnsCamera =
        visualBoundsFrameActiveRef.current &&
        (desiredCameraWriterRef.current === "visual_bounds_frame" ||
          cameraAuthorityRef?.current.activeWriter === "visual_bounds_frame");
      // Steady-state lerp uses HUD-shifted targets; drift must compare the same composition
      // or we falsely exceed threshold forever and spam baseline recovery.
      const shiftedBasePos = tmpCamPosRef.current.copy(baselineCamPosRef.current);
      const shiftedBaseLook = tmpLookAtRef.current.copy(baselineLookAtRef.current);
      applyHudShift(shiftedBaseLook, shiftedBasePos);

      const drift = measureFrameDrift({
        currentPosition: camera.position,
        currentLookAt,
        baselinePosition: [shiftedBasePos.x, shiftedBasePos.y, shiftedBasePos.z],
        baselineLookAt: [shiftedBaseLook.x, shiftedBaseLook.y, shiftedBaseLook.z],
      });

      const driftExceeded = drift.positionDistance > 0.85 || drift.lookAtDistance > 0.55;

      if (driftExceeded) {
        if (visualBoundsOwnsCamera) {
          const blockSignature = `baseline_recovery_visual_bounds_owner:${
            lastVisualBoundsFrameSignatureRef.current ?? lastBaselineSignatureRef.current
          }:${desiredCameraWriterRef.current}:${cameraAuthorityRef?.current.activeWriter ?? "none"}`;
          if (process.env.NODE_ENV !== "production" && lastCameraOverrideBlockedSigRef.current.length === 0) {
            lastCameraOverrideBlockedSigRef.current = blockSignature;
            logLateCameraWriteOnce({
              writer: "BaselineRecovery",
              reason: "visual_bounds_frame_owns_camera",
              objectCount: Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects.length : 0,
              layoutSignature: lastVisualBoundsFrameSignatureRef.current ?? lastBaselineSignatureRef.current,
              authorityWriter: cameraAuthorityRef?.current.activeWriter ?? null,
              position: [
                baselineCamPosRef.current.x,
                baselineCamPosRef.current.y,
                baselineCamPosRef.current.z,
              ],
              target: [
                baselineLookAtRef.current.x,
                baselineLookAtRef.current.y,
                baselineLookAtRef.current.z,
              ],
              mountedAtMs,
              blocked: true,
              signature: blockSignature,
            });
            console.debug("[Nexora][CameraOverrideBlocked]", {
              writer: "BaselineRecovery",
              reason: "visual_bounds_frame_owns_camera",
              desiredWriter: desiredCameraWriterRef.current,
              authorityWriter: cameraAuthorityRef?.current.activeWriter ?? null,
            });
          }
          return;
        }

        const blockLateBaselineRecovery = isLateVisualBoundsOverrideBlocked({
          authorityRef: cameraAuthorityRef,
          writer: "BaselineRecovery",
        });
        if (blockLateBaselineRecovery) {
          logLateCameraWriteOnce({
            writer: "BaselineRecovery",
            reason: "blocked_late_baseline_recovery_visual_bounds_window",
            objectCount: Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects.length : 0,
            layoutSignature: lastVisualBoundsFrameSignatureRef.current ?? lastBaselineSignatureRef.current,
            authorityWriter: cameraAuthorityRef?.current.activeWriter ?? null,
            position: [
              baselineCamPosRef.current.x,
              baselineCamPosRef.current.y,
              baselineCamPosRef.current.z,
            ],
            target: [
              baselineLookAtRef.current.x,
              baselineLookAtRef.current.y,
              baselineLookAtRef.current.z,
            ],
            mountedAtMs,
            blocked: true,
            signature: `blocked_baseline_recovery:${lastVisualBoundsFrameSignatureRef.current ?? lastBaselineSignatureRef.current}`,
          });
        }
        let appliedRecovery = false;
        if (!blockLateBaselineRecovery) {
          const desiredPosDelta = desiredCamPosRef.current.distanceTo(baselineCamPosRef.current);
          const desiredLookDelta = desiredLookAtRef.current.distanceTo(baselineLookAtRef.current);
          const desiredAlreadyBaseline =
            desiredPosDelta < FRAMING_DESIRED_BASELINE_EPS && desiredLookDelta < FRAMING_DESIRED_BASELINE_EPS;
          const recoveryCoolingDown =
            now - lastLayoutFrameAppliedAtRef.current < 420 ||
            (cameraAuthorityRef?.current.activeWriter != null &&
              cameraAuthorityRef.current.activeWriter !== "CameraIntelligence" &&
              now < cameraAuthorityRef.current.cooldownUntil);
          if (recoveryCoolingDown && desiredAlreadyBaseline) {
            return;
          }

          if (!desiredAlreadyBaseline) {
            const layoutCameraActive =
              Boolean(layoutBoundsSignature) ||
              visualBoundsFrameActiveRef.current ||
              desiredCameraWriterRef.current === "visual_bounds_frame" ||
              cameraAuthorityRef?.current.activeWriter === "visual_bounds_frame";
            if (layoutCameraActive) {
              const blockSignature = `blocked_baseline_recovery_layout_camera:${
                lastVisualBoundsFrameSignatureRef.current ?? lastBaselineSignatureRef.current
              }`;
              if (process.env.NODE_ENV !== "production") {
                if (lastCameraOverrideBlockedSigRef.current.length === 0) {
                  lastCameraOverrideBlockedSigRef.current = blockSignature;
                  console.debug("[Nexora][CameraOverrideBlocked]", {
                    writer: "BaselineRecovery",
                    reason: "blocked_layout_camera_active",
                    desiredWriter: desiredCameraWriterRef.current,
                    authorityWriter: cameraAuthorityRef?.current.activeWriter ?? null,
                  });
                }
                lastCameraOverrideBlockedSigRef.current = blockSignature;
                logLateCameraWriteOnce({
                  writer: "BaselineRecovery",
                  reason: "blocked_layout_camera_active",
                  objectCount: Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects.length : 0,
                  layoutSignature: lastVisualBoundsFrameSignatureRef.current ?? lastBaselineSignatureRef.current,
                  authorityWriter: cameraAuthorityRef?.current.activeWriter ?? null,
                  position: [
                    baselineCamPosRef.current.x,
                    baselineCamPosRef.current.y,
                    baselineCamPosRef.current.z,
                  ],
                  target: [
                    baselineLookAtRef.current.x,
                    baselineLookAtRef.current.y,
                    baselineLookAtRef.current.z,
                  ],
                  mountedAtMs,
                  blocked: true,
                  signature: `blocked_baseline_recovery_layout_camera:${
                    lastVisualBoundsFrameSignatureRef.current ?? lastBaselineSignatureRef.current
                  }`,
                });
              }
              return;
            }
            if (
              !claimCameraAuthority({
                authorityRef: cameraAuthorityRef,
                writer: "CameraIntelligence",
                signature: `baseline_recovery:${lastBaselineSignatureRef.current}`,
                reason: "baseline_recovery",
              })
            ) {
              return;
            }
            desiredCamPosRef.current.copy(baselineCamPosRef.current);
            desiredLookAtRef.current.copy(baselineLookAtRef.current);
            desiredCameraWriterRef.current = "BaselineRecovery";
            appliedRecovery = true;
          }
        }

        if (process.env.NODE_ENV !== "production" && now - lastDriftRecoveryAtRef.current > 1200) {
          lastDriftRecoveryAtRef.current = now;
          const driftSig = [
            drift.positionDistance.toFixed(3),
            drift.lookAtDistance.toFixed(3),
            lastBaselineSignatureRef.current,
          ].join("|");
          if (lastDriftLogSigRef.current !== driftSig) {
            lastDriftLogSigRef.current = driftSig;
            console.log("[Nexora][Framing] drift threshold exceeded", drift);
          }
          if (appliedRecovery) {
            const recSig = `${driftSig}|rec`;
            if (lastRecoveryLogSigRef.current !== recSig) {
              lastRecoveryLogSigRef.current = recSig;
              console.log("[Nexora][Framing] baseline recovery applied", {
                signature: lastBaselineSignatureRef.current,
              });
            }
          }
        }
      } else {
        lastDriftLogSigRef.current = "";
        lastRecoveryLogSigRef.current = "";
      }
    }

    // Copy desired targets into reusable temps (no allocations)
    const lookAt = tmpLookAtRef.current.copy(desiredLookAtRef.current);
    const camPosV = tmpCamPosRef.current.copy(desiredCamPosRef.current);

    // Apply HUD composition shift (no drift)
    applyHudShift(lookAt, camPosV);
    const authorityWriter = cameraAuthorityRef?.current.activeWriter ?? null;
    const finalWriterReason =
      visualBoundsFrameActiveRef.current &&
      desiredCameraWriterRef.current === "visual_bounds_frame" &&
      authorityWriter === "visual_bounds_frame"
        ? "visual_bounds_authority_active"
        : desiredCameraWriterRef.current === "BaselineRecovery"
        ? "baseline_recovery_desired"
        : desiredCameraWriterRef.current === "FocusMode"
        ? "explicit_focus_desired"
        : "camera_intelligence_desired";
    logCameraIntelligenceFinalWriterOnce({
      desiredWriter: desiredCameraWriterRef.current,
      authorityWriter,
      visualBoundsActive: visualBoundsFrameActiveRef.current,
      position: [camPosV.x, camPosV.y, camPosV.z],
      target: [lookAt.x, lookAt.y, lookAt.z],
      baselinePosition: [
        baselineCamPosRef.current.x,
        baselineCamPosRef.current.y,
        baselineCamPosRef.current.z,
      ],
      baselineTarget: [
        baselineLookAtRef.current.x,
        baselineLookAtRef.current.y,
        baselineLookAtRef.current.z,
      ],
      reason: finalWriterReason,
      signature: [
        desiredCameraWriterRef.current,
        authorityWriter ?? "none",
        visualBoundsFrameActiveRef.current ? 1 : 0,
        lastVisualBoundsFrameSignatureRef.current ?? lastBaselineSignatureRef.current,
        camPosV.x.toFixed(3),
        camPosV.y.toFixed(3),
        camPosV.z.toFixed(3),
        lookAt.x.toFixed(3),
        lookAt.y.toFixed(3),
        lookAt.z.toFixed(3),
      ].join("|"),
    });
    logCameraWriteOnce({
      writer: desiredCameraWriterRef.current,
      objectCount: Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects.length : 0,
      preset: desiredCameraWriterRef.current === "visual_bounds_frame" ? "visual_bounds_frame" : null,
      focusObjectId: desiredCameraWriterRef.current === "FocusMode" ? focusedId ?? selectedObjectId ?? null : null,
      position: [camPosV.x, camPosV.y, camPosV.z],
      target: [lookAt.x, lookAt.y, lookAt.z],
      signature: `frame_loop:${desiredCameraWriterRef.current}:${[
        camPosV.x,
        camPosV.y,
        camPosV.z,
        lookAt.x,
        lookAt.y,
        lookAt.z,
      ]
        .map((value) => value.toFixed(3))
        .join(",")}`,
    });
    if (visualBoundsFrameActiveRef.current) {
      logLateCameraWriteOnce({
        writer: desiredCameraWriterRef.current,
        reason: finalWriterReason,
        objectCount: Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects.length : 0,
        layoutSignature: lastVisualBoundsFrameSignatureRef.current ?? lastBaselineSignatureRef.current,
        authorityWriter,
        position: [camPosV.x, camPosV.y, camPosV.z],
        target: [lookAt.x, lookAt.y, lookAt.z],
        mountedAtMs,
        blocked: false,
        signature: `frame_loop_late:${desiredCameraWriterRef.current}:${authorityWriter ?? "none"}:${lastVisualBoundsFrameSignatureRef.current ?? lastBaselineSignatureRef.current}:${[
          camPosV.x,
          camPosV.y,
          camPosV.z,
          lookAt.x,
          lookAt.y,
          lookAt.z,
        ]
          .map((value) => value.toFixed(3))
          .join(",")}`,
      });
    }

    markProgrammaticCameraUpdate(programmaticCameraUpdateRef);
    const lerpA = CALM_FRAMING.shellCameraLerp;
    const prevCam = lastCameraPosRef.current;
    const distToTarget = camera.position.distanceTo(camPosV);
    const CAM_SNAP_EPS = 0.015;
    if (distToTarget < CAM_SNAP_EPS) {
      camera.position.copy(camPosV);
      lastCamToTargetDistRef.current = 0;
    } else {
      const prevDist = lastCamToTargetDistRef.current;
      lastCamToTargetDistRef.current = distToTarget;
      if (
        prevDist != null &&
        Math.abs(distToTarget - prevDist) < 0.0001 &&
        distToTarget < 0.06
      ) {
        camera.position.copy(camPosV);
      } else {
        camera.position.lerp(camPosV, lerpA);
        const dcx = camera.position.x - prevCam.x;
        const dcy = camera.position.y - prevCam.y;
        const dcz = camera.position.z - prevCam.z;
        const cd = Math.sqrt(dcx * dcx + dcy * dcy + dcz * dcz);
        if (cd > CALM_FRAMING.maxCamPosStep && cd > 1e-6) {
          const s = CALM_FRAMING.maxCamPosStep / cd;
          camera.position.set(prevCam.x + dcx * s, prevCam.y + dcy * s, prevCam.z + dcz * s);
        }
      }
    }
    if (camera.position.distanceTo(camPosV) < CAM_SNAP_EPS) {
      camera.position.copy(camPosV);
      lastCamToTargetDistRef.current = 0;
    }
    lastCameraPosRef.current.copy(camera.position);

    // Drive look direction through OrbitControls when present
    if (controls?.target) {
      const pt = controls.target;
      const TARGET_SNAP = 0.015;
      if (pt.distanceTo(lookAt) < TARGET_SNAP) {
        pt.copy(lookAt);
      } else {
        const ptx = pt.x;
        const pty = pt.y;
        const ptz = pt.z;
        pt.lerp(lookAt, lerpA);
        const dtx = pt.x - ptx;
        const dty = pt.y - pty;
        const dtz = pt.z - ptz;
        const td = Math.sqrt(dtx * dtx + dty * dty + dtz * dtz);
        if (td > CALM_FRAMING.maxTargetStep && td > 1e-6) {
          const s = CALM_FRAMING.maxTargetStep / td;
          pt.set(ptx + dtx * s, pty + dty * s, ptz + dtz * s);
        }
        if (pt.distanceTo(lookAt) < TARGET_SNAP) {
          pt.copy(lookAt);
        }
      }
      lastControlTargetRef.current.copy(controls.target);
      controls.update();
      return;
    }

    const cl = currentLookAtRef.current;
    const TARGET_SNAP_FALLBACK = 0.015;
    if (cl.distanceTo(lookAt) < TARGET_SNAP_FALLBACK) {
      cl.copy(lookAt);
    } else {
      const clx = cl.x;
      const cly = cl.y;
      const clz = cl.z;
      cl.lerp(lookAt, lerpA);
      const dlx = cl.x - clx;
      const dly = cl.y - cly;
      const dlz = cl.z - clz;
      const ld = Math.sqrt(dlx * dlx + dly * dly + dlz * dlz);
      if (ld > CALM_FRAMING.maxTargetStep && ld > 1e-6) {
        const s = CALM_FRAMING.maxTargetStep / ld;
        cl.set(clx + dlx * s, cly + dly * s, clz + dlz * s);
      }
      if (cl.distanceTo(lookAt) < TARGET_SNAP_FALLBACK) {
        cl.copy(lookAt);
      }
    }
    lastControlTargetRef.current.copy(currentLookAtRef.current);
    camera.lookAt(currentLookAtRef.current);
  });

  return null;
}

function StaticSceneFramer({
  sceneJson,
  layoutPositions,
  controlsRef,
  localIsOrbitingRef,
  isOrbiting,
  enabled,
  reframeNonce = 0,
  viewMode = "2D",
  cameraAuthorityRef,
  visualBoundsOptions,
  layoutBoundsSignature,
  settledLayoutBoundsSignature,
  initialLayoutFrameAppliedRef,
  programmaticCameraUpdateRef,
  mountedAtMs,
}: {
  sceneJson: any | null;
  layoutPositions?: Record<string, [number, number, number]>;
  controlsRef: React.MutableRefObject<any | null>;
  localIsOrbitingRef: React.MutableRefObject<boolean>;
  isOrbiting: boolean;
  enabled: boolean;
  reframeNonce?: number;
  viewMode?: WorkspaceViewMode;
  cameraAuthorityRef?: CameraAuthorityRef;
  visualBoundsOptions?: SceneBoundsOptions;
  layoutBoundsSignature?: string;
  settledLayoutBoundsSignature?: string | null;
  initialLayoutFrameAppliedRef?: React.MutableRefObject<string | null>;
  programmaticCameraUpdateRef?: React.MutableRefObject<boolean>;
  mountedAtMs?: number;
}) {
  const { camera, invalidate, size } = useThree();
  const lastAppliedSignatureRef = useRef<string | null>(null);
  const transitionRef = useRef<ReturnType<typeof createExecutiveCameraTransitionState> | null>(null);

  useEffect(() => {
    if (reframeNonce > 0) {
      lastAppliedSignatureRef.current = null;
    }
  }, [reframeNonce]);

  useEffect(() => {
    lastAppliedSignatureRef.current = null;
  }, [viewMode]);

  useFrame((_, delta) => {
    const transition = transitionRef.current;
    if (!transition) return;
    markProgrammaticCameraUpdate(programmaticCameraUpdateRef);
    const finished = stepExecutiveCameraTransition(camera, controlsRef.current, transition, delta * 1000);
    invalidate();
    if (finished) transitionRef.current = null;
  });

  useEffect(() => {
    if (!enabled) {
      devLogOnSignatureChange("[E2:87][Camera]", `static-disabled:${viewMode}`, {
        activeMode: viewMode,
        skipped: true,
        reason: "static_framer_disabled",
      });
      return;
    }
    if (!sceneJson?.scene?.objects || !Array.isArray(sceneJson.scene.objects)) {
      devLogOnSignatureChange("[E2:87][Camera]", `missing-objects:${viewMode}`, {
        activeMode: viewMode,
        skipped: true,
        reason: "missing_scene_objects",
      });
      return;
    }
    if (isOrbiting || localIsOrbitingRef.current) {
      devLogOnSignatureChange("[E2:87][Camera]", `orbit-active:${viewMode}`, {
        activeMode: viewMode,
        skipped: true,
        reason: "orbit_active",
      });
      return;
    }
    const objects = sceneJson.scene.objects as any[];
    const boundsOptions: SceneBoundsOptions = {
      ...(visualBoundsOptions ?? {}),
      layoutPositions,
    };
    const sceneSignature = sceneObjectsSignature(objects, boundsOptions);
    const layoutPositionCount = layoutPositions ? Object.keys(layoutPositions).length : 0;
    const hasSettledLayout =
      Boolean(layoutBoundsSignature) &&
      settledLayoutBoundsSignature === layoutBoundsSignature &&
      layoutPositionCount === objects.length;
    if (layoutBoundsSignature && !hasSettledLayout) return;
    if (layoutBoundsSignature && initialLayoutFrameAppliedRef?.current === layoutBoundsSignature) {
      logCameraAuthorityBlock({
        activeWriter: cameraAuthorityRef?.current.activeWriter ?? null,
        blockedWriter: "StaticSceneFramer",
        reason: "initial_layout_frame_already_applied",
        signature: layoutBoundsSignature,
      });
      return;
    }
    const framingSignature = `${sceneSignature}|${viewMode}|${reframeNonce}`;
    if (lastAppliedSignatureRef.current === framingSignature) {
      devLogOnSignatureChange("[E2:87][Camera]", `unchanged:${viewMode}:${sceneSignature}`, {
        activeMode: viewMode,
        skipped: true,
        reason: "unchanged_framing_signature",
        framingSignature,
      });
      return;
    }
    const bounds = computeSceneBounds(objects, boundsOptions);
    if (!bounds) {
      devLogOnSignatureChange("[E2:87][Camera]", `missing-bounds:${viewMode}:${sceneSignature}`, {
        activeMode: viewMode,
        skipped: false,
        reason: "missing_scene_bounds",
      });
    }

    let frame = bounds
      ? computeCameraFrameFromBounds(bounds, {
          horizontalBias: 0,
          verticalBias: 0,
          pullback:
            objects.length <= 1
              ? viewMode === "2D"
                ? 1.45
                : 1.65
              : viewMode === "2D"
              ? 1.35
              : 1.55,
          objectCount: objects.length,
          relationshipCount: countSceneRelationships(sceneJson),
          viewportWidth: size.width,
          viewportHeight: size.height,
          viewMode,
        })
      : null;
    let frameSource: "visual_bounds" | "preset_fallback" = "visual_bounds";
    if (!frame || !isValidExecutiveCameraFrame(frame)) {
      frame = resolveExecutiveCameraPresetFrame({
        preset: "EXECUTIVE",
        mode: viewMode,
        sceneJson,
        viewportWidth: size.width,
        viewportHeight: size.height,
        layoutPositions,
      });
      frameSource = "preset_fallback";
    }
    if (!frame || !isValidExecutiveCameraFrame(frame)) return;
    if (objects.length <= 1) {
      frame = enforceSingleObjectOverviewFrame(frame, SINGLE_OBJECT_OVERVIEW_MIN_DISTANCE);
    }
    const position = frame.position;
    const lookAt = frame.lookAt;
    if (bounds) {
      logLayoutAwareCameraBoundsOnce({
        objectCount: objects.length,
        layoutPositionCount,
        bounds,
        cameraPosition: position,
        lookAt,
        viewMode,
      });
      logVisualBoundsOnce({
        objects,
        bounds,
        options: boundsOptions,
        signature: sceneSignature,
      });
    }
    if (bounds && frameSource === "visual_bounds") {
      logCameraFrameSourceOnce({
        source: "visual_bounds",
        writer: "StaticSceneFramer",
        objectCount: objects.length,
        boundsSize: bounds.size,
        position,
        lookAt,
        viewMode,
        signature: `${sceneSignature}|${viewMode}|${size.width.toFixed(1)}x${size.height.toFixed(1)}|${position
          .map((value) => value.toFixed(3))
          .join(",")}|${lookAt.map((value) => value.toFixed(3)).join(",")}`,
      });
    }
    if (objects.length <= 1) {
      logSingleObjectCameraGuardOnce({
        objectCount: objects.length,
        objectId: getSingleSceneObjectId(objects),
        blockedWriter: "StaticSceneFramer",
        reason:
          frameSource === "visual_bounds"
            ? "single_object_visual_bounds_overview"
            : "single_object_preset_fallback_overview",
        finalCameraDistance: cameraFrameDistance(frame),
        finalTarget: lookAt,
        signature: `static:${frameSource}:${sceneSignature}:${viewMode}`,
      });
    }
    const transitionSignature = buildExecutiveCameraTransitionSignature({
      preset: "EXECUTIVE",
      source: "static_scene_framer",
      sceneSignature,
      position,
      lookAt,
      fov: frame.fov,
    });
    if (
      isLateVisualBoundsOverrideBlocked({
        authorityRef: cameraAuthorityRef,
        writer: "StaticSceneFramer",
      })
    ) {
      logLateCameraWriteOnce({
        writer: "StaticSceneFramer",
        reason: "blocked_late_static_scene_framer_visual_bounds_window",
        objectCount: objects.length,
        layoutSignature: layoutBoundsSignature ?? sceneSignature,
        authorityWriter: cameraAuthorityRef?.current.activeWriter ?? null,
        position,
        target: lookAt,
        mountedAtMs,
        blocked: true,
        signature: `blocked_static_scene_framer:${transitionSignature}`,
      });
      lastAppliedSignatureRef.current = framingSignature;
      return;
    }
    if (
      !claimCameraAuthority({
        authorityRef: cameraAuthorityRef,
        writer: "StaticSceneFramer",
        signature: transitionSignature,
        reason: "static_scene_framer",
      })
    ) {
      lastAppliedSignatureRef.current = framingSignature;
      return;
    }
    if (!shouldApplyExecutiveCameraTransition("static-framer", transitionSignature)) {
      lastAppliedSignatureRef.current = framingSignature;
      return;
    }

    transitionRef.current = createExecutiveCameraTransitionState(
      camera,
      controlsRef.current,
      {
        position: new THREE.Vector3(position[0], position[1], position[2]),
        lookAt: new THREE.Vector3(lookAt[0], lookAt[1], lookAt[2]),
        fov: frame.fov,
      },
      560
    );
    logCameraWriteOnce({
      writer: "StaticSceneFramer",
      objectCount: objects.length,
      preset: frameSource === "visual_bounds" ? "visual_bounds_frame" : "EXECUTIVE",
      focusObjectId: null,
      position,
      target: lookAt,
      signature: `StaticSceneFramer:${transitionSignature}`,
    });
    logLateCameraWriteOnce({
      writer: "StaticSceneFramer",
      reason: frameSource === "visual_bounds" ? "static_visual_bounds_frame" : "static_preset_fallback_frame",
      objectCount: objects.length,
      layoutSignature: layoutBoundsSignature ?? sceneSignature,
      authorityWriter: cameraAuthorityRef?.current.activeWriter ?? null,
      position,
      target: lookAt,
      mountedAtMs,
      blocked: false,
      signature: `late_static_scene_framer:${transitionSignature}`,
    });
    if (layoutBoundsSignature && initialLayoutFrameAppliedRef) {
      initialLayoutFrameAppliedRef.current = layoutBoundsSignature;
    }
    lastAppliedSignatureRef.current = framingSignature;
    devLogOnSignatureChange("[E2:88][CameraPreset]", transitionSignature, {
      preset: "EXECUTIVE",
      activeMode: viewMode,
      source: "static_scene_framer",
      cameraProfile: viewMode === "2D" ? "executive_2d_strategic" : "executive_3d_strategic",
      position,
      target: lookAt,
      fov: frame.fov,
    }, "info");
    logExecutiveCameraTransition(transitionSignature, {
      preset: "EXECUTIVE",
      source: "static_scene_framer",
      position,
      target: lookAt,
      fov: frame.fov,
    });
    logCameraProfileForMode(viewMode);
    validateWorkspaceModeActivation({
      requestedMode: viewMode,
      source: "static_scene_framer",
      sceneSubscribed: true,
      cameraApplied: true,
    });
    invalidate();

    devLogOnSignatureChange("[E2:87][Camera]", framingSignature, {
      signature: framingSignature,
      viewMode,
      position,
      lookAt,
      fov: frame.fov,
      size: bounds ? Math.max(bounds.size[0], bounds.size[1], bounds.size[2], 1) : 1,
    });
  }, [camera, cameraAuthorityRef, controlsRef, enabled, initialLayoutFrameAppliedRef, invalidate, isOrbiting, layoutBoundsSignature, layoutPositions, localIsOrbitingRef, mountedAtMs, programmaticCameraUpdateRef, reframeNonce, sceneJson, settledLayoutBoundsSignature, size.height, size.width, viewMode, visualBoundsOptions]);

  return null;
}

function SceneCanvasComponent(props: SceneCanvasProps) {
  const resolvedUi: ResolvedUiTheme = props.resolvedUiTheme ?? "night";
  const atmosphere: SceneAtmosphereMode = (props.prefs?.theme ?? "night") as SceneAtmosphereMode;
  const sceneEnv = useMemo(
    () => resolveNexoraSceneEnvironment(resolvedUi, atmosphere),
    [resolvedUi, atmosphere]
  );
  useEffect(() => {
    logWorkspaceSceneThemeUpdated(resolvedUi);
  }, [resolvedUi]);
  const rendererTheme = useMemo(
    () => sceneRendererThemeFromUi(resolvedUi, atmosphere),
    [resolvedUi, atmosphere]
  );
  const orbitMode = props.prefs?.orbitMode ?? "auto";
  const selectedIdCtx = useSelectedId();
  const lastHighlightedRef = useRef<string | null>(null);
  useEffect(() => {
    const nextSelectedId = typeof props.selectedObjectId === "string" ? props.selectedObjectId.trim() : "";
    if (!nextSelectedId) {
      lastHighlightedRef.current = null;
      return;
    }
    if (selectedIdCtx === nextSelectedId) return;
    if (lastHighlightedRef.current === nextSelectedId) return;
    lastHighlightedRef.current = nextSelectedId;
    const id = requestAnimationFrame(() => {
      props.selectedSetterRef.current?.(nextSelectedId);
    });
    return () => cancelAnimationFrame(id);
  }, [props.selectedObjectId, props.selectedSetterRef, selectedIdCtx]);
  const sceneFragilityLevel = useMemo(() => {
    const level =
      props.sceneJson?.scene?.scanner_state_vector?.fragility_level ??
      props.sceneJson?.state_vector?.fragility_level ??
      props.sceneJson?.fragility_level;
    return typeof level === "string" ? level : null;
  }, [props.sceneJson]);

  const overlayRuntime = useSceneOverlayRuntime({
    sceneJson: props.sceneJson,
    loops: props.loops,
    selectedObjectId: selectedIdCtx,
    scenarioTrigger: props.scenarioTrigger,
    manualPropagationSourceId: props.manualPropagationSourceId,
    propagationPayload: props.propagationPayload,
    objectSelection: props.objectSelection,
    fragilityLevel: sceneFragilityLevel,
    previewEnabled: true,
  });

  const {
    mergedPropagationOverlay,
    decisionPathOverlay,
    combinedObjectSelection,
    scenarioOverlayPackage,
    propagationLoading,
    propagationError,
    propagationMode,
    simulationOverlay,
  } = overlayRuntime;

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (simulationOverlay.highlightedIds.length === 0 && simulationOverlay.links.length === 0) return;
    console.log("[Nexora][SimulationFlow]", {
      triggered: true,
      impacted: simulationOverlay.highlightedIds.length,
      links: simulationOverlay.links.length,
    });
  }, [simulationOverlay.highlightedIds.length, simulationOverlay.links.length]);

  useEffect(() => {
    if (!props.onScenarioOverlayChange) return;
    const sourceAction = scenarioOverlayPackage.sourceAction ?? props.scenarioTrigger ?? null;
    if (sourceAction?.metadata?.origin !== "war_room") {
      if (lastOverlayDispatchKeyRef.current !== "empty:not_war_room") {
        lastOverlayDispatchKeyRef.current = "empty:not_war_room";
        props.onScenarioOverlayChange(null, null);
      }
      return;
    }
    const sourceId = sourceAction.intent.source_object_id ?? null;
    const sceneContainsSource =
      !sourceId ||
      (Array.isArray(props.sceneJson?.scene?.objects) &&
        props.sceneJson.scene.objects.some((object: any, index: number) => {
          const objectId = String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${index}`).trim();
          return objectId === sourceId;
        }));
    if (!sceneContainsSource) {
      if (lastOverlayDispatchKeyRef.current !== "empty:missing_source") {
        lastOverlayDispatchKeyRef.current = "empty:missing_source";
        props.onScenarioOverlayChange(null, null);
      }
      return;
    }
    const summary: WarRoomOverlaySummary = {
      active:
        mergedPropagationOverlay?.active === true ||
        decisionPathOverlay?.active === true ||
        propagationLoading,
      actionId: sourceAction.intent.action_id ?? null,
      sourceObjectId: sourceId,
      overlayMode: scenarioOverlayPackage.mode,
      resultMode:
        scenarioOverlayPackage.decisionPath?.active || decisionPathOverlay?.active
          ? "backend"
          : propagationMode,
      loading: propagationLoading,
      error: propagationError,
      propagationNodeCount: mergedPropagationOverlay?.impacted_nodes.length ?? 0,
      propagationEdgeCount: mergedPropagationOverlay?.impacted_edges.length ?? 0,
      decisionNodeCount: decisionPathOverlay?.nodes.length ?? 0,
      decisionEdgeCount: decisionPathOverlay?.edges.length ?? 0,
    };
    const detail: WarRoomOverlayDetail = {
      propagation: mergedPropagationOverlay ?? null,
      decisionPath: scenarioOverlayPackage.decisionPath ?? null,
      scenarioAction: sourceAction,
      overlayPackage: scenarioOverlayPackage,
    };
    const dispatchKey = JSON.stringify(summary);
    if (lastOverlayDispatchKeyRef.current === dispatchKey) return;
    lastOverlayDispatchKeyRef.current = dispatchKey;
    props.onScenarioOverlayChange(summary, detail);
  }, [
    decisionPathOverlay,
    props.onScenarioOverlayChange,
    props.scenarioTrigger,
    propagationError,
    propagationLoading,
    propagationMode,
    mergedPropagationOverlay,
    scenarioOverlayPackage,
  ]);

  const controlsRef = useRef<any>(null);
  const programmaticCameraUpdateRef = useRef(false);
  const cameraMountedAtMsRef = useRef(typeof performance !== "undefined" ? performance.now() : 0);
  const cameraAuthorityRef = useRef<CameraAuthorityState>({
    activeWriter: null,
    signature: null,
    cooldownUntil: 0,
    appliedAt: 0,
  });
  const sceneShellRef = useRef<HTMLDivElement | null>(null);
  const workspaceViewMode = useSyncExternalStore(
    subscribeWorkspaceViewMode,
    getWorkspaceViewMode,
    getWorkspaceViewModeServerSnapshot
  );
  const [cameraReframeNonce, setCameraReframeNonce] = useState(0);
  const [cameraPresetOverride, setCameraPresetOverride] = useState<"GLOBAL" | "FIT_SCENE" | null>(null);
  const hudThemeMode = props.hudThemeMode ?? resolveNexoraHudThemeMode(resolvedUi);
  const explicitWorkspaceViewModeRef = useRef<WorkspaceViewMode | null>(null);
  const requestStaticCameraReframe = useCallback(() => {
    markSceneHudDriftBaseline("camera-fit-scene", sceneShellRef.current);
    setCameraPresetOverride("FIT_SCENE");
    setCameraReframeNonce((value) => value + 1);
    scheduleSceneHudDriftDetect("camera-fit-scene", sceneShellRef.current);
  }, []);

  useEffect(() => {
    hydrateWorkspaceViewMode();
    hydrateExecutiveFocusMode();
  }, []);

  useEffect(() => {
    setCameraPresetOverride(null);
    setCameraReframeNonce((value) => value + 1);
    if (cameraMountedAtMsRef.current > 0 && performance.now() - cameraMountedAtMsRef.current > 1200) {
      explicitWorkspaceViewModeRef.current = workspaceViewMode;
    }
  }, [workspaceViewMode]);

  useEffect(() => {
    const handleWorkspaceViewModeEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: WorkspaceViewMode; source?: string }>).detail;
      if (detail?.source !== "toolbar") return;
      if (detail.mode !== "2D" && detail.mode !== "3D") return;
      explicitWorkspaceViewModeRef.current = detail.mode;
      setCameraPresetOverride(null);
      setCameraReframeNonce((value) => value + 1);
    };
    window.addEventListener(WORKSPACE_VIEW_MODE_EVENT, handleWorkspaceViewModeEvent);
    return () => window.removeEventListener(WORKSPACE_VIEW_MODE_EVENT, handleWorkspaceViewModeEvent);
  }, []);

  useEffect(() => {
    logHudThemeModeResolved({ mode: hudThemeMode });
  }, [hudThemeMode]);

  useEffect(() => {
    runSceneOccupancyAudit([
      {
        panelId: "sceneInfo",
        owner: "Scene Info",
        visible: Boolean(props.sceneInfoHud),
        coverageEstimate: 8,
      },
      {
        panelId: "objectInfo",
        owner: "Object Info",
        visible: Boolean(props.objectInfoHud),
        coverageEstimate: 9,
      },
      {
        panelId: "timeline",
        owner: "Executive Bottom Workspace",
        visible: Boolean(props.timelineHud),
        coverageEstimate: 11,
      },
      {
        panelId: "quickActions",
        owner: "Executive Quick Actions",
        visible: !props.timelineHud && Boolean(props.quickActionsDock),
        coverageEstimate: 4,
      },
      {
        panelId: "executiveStatus",
        owner: "Executive Status HUD",
        visible: Boolean(props.executiveStatusHud),
        coverageEstimate: 5,
      },
      {
        panelId: "sceneToolbar",
        owner: "Scene Toolbar",
        visible: Boolean(props.sceneNavigationToolbar ?? props.cameraToolbar),
        coverageEstimate: 4,
      },
    ]);
  }, [
    props.cameraToolbar,
    props.executiveStatusHud,
    props.objectInfoHud,
    props.quickActionsDock,
    props.sceneInfoHud,
    props.sceneNavigationToolbar,
    props.timelineHud,
  ]);

  const layoutAuditSignature = useMemo(() => {
    if (process.env.NODE_ENV === "production") return null;
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1440;
    const contract = resolveWorkspaceLayoutContract("executive", viewportWidth);
    return buildExecutiveLayoutAuditInputSignature({
      contract,
      selectedObjectId: props.objectInfoHud?.model.selectedObjectId?.trim() || null,
      pipelineStatus: "ready",
      visiblePanels: {
        sceneInfoHud: Boolean(props.sceneInfoHud),
        objectInfoHud: Boolean(props.objectInfoHud),
        executiveStatusHud: Boolean(props.executiveStatusHud),
        timelineHud: Boolean(props.timelineHud),
        quickActionsDock: !props.timelineHud && Boolean(props.quickActionsDock),
        executiveSceneToolbar: Boolean(props.sceneNavigationToolbar ?? props.cameraToolbar),
      },
    });
  }, [
    props.cameraToolbar,
    props.executiveStatusHud,
    props.objectInfoHud,
    props.objectInfoHud?.model.selectedObjectId,
    props.quickActionsDock,
    props.sceneInfoHud,
    props.sceneNavigationToolbar,
    props.timelineHud,
  ]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !layoutAuditSignature) return;
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1440;
    const contract = resolveWorkspaceLayoutContract("executive", viewportWidth);
    runExecutiveLayoutAudit({
      contract,
      selectedObjectId: props.objectInfoHud?.model.selectedObjectId?.trim() || null,
      pipelineStatus: "ready",
      visiblePanels: {
        sceneInfoHud: Boolean(props.sceneInfoHud),
        objectInfoHud: Boolean(props.objectInfoHud),
        executiveStatusHud: Boolean(props.executiveStatusHud),
        timelineHud: Boolean(props.timelineHud),
        quickActionsDock: !props.timelineHud && Boolean(props.quickActionsDock),
        executiveSceneToolbar: Boolean(props.sceneNavigationToolbar ?? props.cameraToolbar),
      },
      root: sceneShellRef.current,
    });
  }, [layoutAuditSignature, props.objectInfoHud?.model.selectedObjectId]);

  const localIsOrbitingRef = useRef<boolean>(false);
  const preserveCameraOnClearRef = useRef<boolean>(false);
  const leftColumnLayoutPauseRef = useRef(false);
  const sceneInvalidateRef = useRef<(() => void) | null>(null);
  const leftColumnLayoutTimerRef = useRef<number | null>(null);
  const lastLeftCommandOpenForLayoutRef = useRef<boolean | null>(null);
  const [leftColumnLayoutResumeNonce, setLeftColumnLayoutResumeNonce] = useState(0);
  const tmpWorld = useMemo(() => new THREE.Vector3(), []);
  const [isHudInteracting, setIsHudInteracting] = useState(false);
  const isHudInteractingRef = useRef(false);
  const lastOverlayDispatchKeyRef = useRef<string>("");
  const lastHighlightTraceSigRef = useRef<string>("");
  const stableGlobalScaleInputRef = useRef<{ signature: string; value: number } | null>(null);

  // Camera mode values may come from UI as: "orbit" | "fixed" (new)
  // or legacy values: "auto" | "manual".
  const cameraMode = String(orbitMode);
  const isFixedCamera = cameraMode === "fixed";
  const orbitControlsEnabled = !isFixedCamera && !props.isDraggingHUD && !isHudInteracting;

  // Global scale can easily make objects feel too large for an executive overview.
  const sceneObjectCountForScale = Array.isArray(props.sceneJson?.scene?.objects)
    ? props.sceneJson.scene.objects.length
    : 1;
  const requestedGlobalScale = typeof props.prefs?.globalScale === "number" ? props.prefs.globalScale : 0.72;
  const rawGlobalScale = holdStableScaleInput(
    stableGlobalScaleInputRef,
    `scene:${sceneObjectCountForScale}`,
    requestedGlobalScale
  );
  const globalScale = useMemo(
    () =>
      normalizeExecutiveObjectScale({
        objectId: "scene",
        scale: rawGlobalScale,
        objectCount: sceneObjectCountForScale,
      }),
    [rawGlobalScale, sceneObjectCountForScale]
  );
  const densityProfile = useMemo(
    () => resolveWorkspaceDensityProfile(workspaceViewMode),
    [workspaceViewMode]
  );
  const resolvedGlobalScale = Math.min(
    CANVAS_STATIC_MODE ? globalScale * densityProfile.scaleMultiplier : globalScale,
    0.85
  );
  const devSceneGuidesEnabled = process.env.NODE_ENV !== "production";
  const showGrid =
    devSceneGuidesEnabled &&
    (typeof props.showGrid === "boolean" ? props.showGrid : props.prefs?.showGrid === true);
  const showObjectDebugLabels =
    typeof props.showObjectDebugLabels === "boolean"
      ? props.showObjectDebugLabels
      : props.prefs?.showObjectDebugLabels === true;
  const showAxes =
    devSceneGuidesEnabled &&
    (typeof props.showAxes === "boolean" ? props.showAxes : props.prefs?.showAxes === true);
  const shadowsEnabled = !!props.prefs?.shadowsEnabled;

  const sceneObjectIds = useMemo(
    () =>
      Array.isArray(props.sceneJson?.scene?.objects)
        ? (props.sceneJson.scene.objects as any[])
            .map((obj: any, idx: number) => String(obj?.id ?? obj?.name ?? `${obj?.type ?? "obj"}:${idx}`))
            .filter(Boolean)
        : [],
    [props.sceneJson]
  );
  const idleRuntimeSemanticSignature = useMemo(
    () =>
      JSON.stringify({
        objectCount: sceneObjectIds.length,
        objectIds: [...sceneObjectIds].sort(),
        selectedObjectId: selectedIdCtx ?? props.selectedObjectId ?? null,
      }),
    [props.selectedObjectId, sceneObjectIds, selectedIdCtx]
  );
  useEffect(() => {
    updateIdleRuntimeSemanticSignature(idleRuntimeSemanticSignature);
  }, [idleRuntimeSemanticSignature]);
  const rawHighlightedObjectIds = Array.isArray(combinedObjectSelection?.highlighted_objects)
    ? combinedObjectSelection.highlighted_objects.map(String)
    : [];
  const rawHighlightedObjectIdsSig = useMemo(
    () => JSON.stringify(rawHighlightedObjectIds),
    [rawHighlightedObjectIds]
  );
  const highlightedObjectIds = useMemo(
    () => Array.from(new Set(rawHighlightedObjectIds)).sort(),
    [rawHighlightedObjectIdsSig]
  );
  const sceneJsonObjectsSignature = useMemo(
    () =>
      buildSceneObjectsRegistrySignature(
        Array.isArray(props.sceneJson?.scene?.objects) ? (props.sceneJson.scene.objects as any[]) : []
      ),
    [props.sceneJson]
  );
  const objectSelectionSignature = buildSceneObjectSelectionSignature(combinedObjectSelection ?? null);
  const stableObjectSelection = useMemo(
    () => combinedObjectSelection ?? null,
    [objectSelectionSignature]
  );

  const timelineSpatialInteraction = useSyncExternalStore(
    subscribeTimelineSpatialInteraction,
    getTimelineSpatialInteractionState,
    getTimelineSpatialInteractionServerSnapshot
  );

  const timelineSpatialState = useMemo(() => {
    if (!props.timelineHud) return null;
    const sceneObjects = readExecutiveSceneObjects(props.sceneJson).map((raw, index) => {
      const object = raw as {
        id?: string;
        name?: string;
        label?: string;
        position?: unknown;
        transform?: { pos?: unknown };
      };
      const id = String(object.id ?? object.name ?? `obj:${index}`).trim();
      return {
        id,
        label: object.label ?? object.name ?? id,
        position: object.position ?? object.transform?.pos,
      };
    });
    return buildSpatialTimeIntelligenceState({
      events: props.timelineHud.events,
      sceneObjects,
      interaction: timelineSpatialInteraction,
      viewMode: workspaceViewMode,
    });
  }, [props.timelineHud, props.sceneJson, timelineSpatialInteraction, workspaceViewMode]);

  const timelineSpatialSelection = useMemo(() => {
    if (!timelineSpatialState) return null;
    return resolveTimelineSpatialObjectSelection({ state: timelineSpatialState });
  }, [timelineSpatialState]);

  const mergedObjectSelection = useMemo(() => {
    if (!timelineSpatialSelection) return stableObjectSelection;
    return mergeTimelineSpatialObjectSelection(stableObjectSelection, timelineSpatialSelection);
  }, [stableObjectSelection, timelineSpatialSelection]);

  const mergedObjectSelectionSignature = buildSceneObjectSelectionSignature(mergedObjectSelection ?? null);
  const stableMergedObjectSelection = useMemo(
    () => mergedObjectSelection ?? null,
    [mergedObjectSelectionSignature]
  );

  const handleTimelineEventSelect = useCallback(
    (eventId: string, item: { relatedObjectIds?: readonly string[] }) => {
      const anchor = timelineSpatialState?.anchors.find((entry) => entry.eventId === eventId);
      selectTimelineSpatialEvent(eventId, {
        focusObjectId: anchor?.objectId ?? item.relatedObjectIds?.[0] ?? null,
        source: "timeline_click",
      });
      const sequence = getExecutiveScenarioPlaybackState().sequence;
      if (sequence) {
        const stepIndex = sequence.steps.findIndex(
          (step) => step.timelineEventId === eventId || step.stepId === eventId
        );
        if (stepIndex >= 0) syncExecutiveScenarioPlaybackToTimelineStep(stepIndex);
      }
    },
    [timelineSpatialState?.anchors]
  );

  const handleTimelineEventHover = useCallback((eventId: string | null) => {
    hoverTimelineSpatialEvent(eventId);
  }, []);

  const handleTimelineEventFocusMode = useCallback(
    (eventId: string, item: { relatedObjectIds?: readonly string[] }) => {
      enterTimelineSpatialFocusMode(eventId);
      const anchor = timelineSpatialState?.anchors.find((entry) => entry.eventId === eventId);
      selectTimelineSpatialEvent(eventId, {
        focusObjectId: anchor?.objectId ?? item.relatedObjectIds?.[0] ?? null,
        source: "timeline_focus_mode",
      });
      const sequence = getExecutiveScenarioPlaybackState().sequence;
      if (sequence) {
        const stepIndex = sequence.steps.findIndex(
          (step) => step.timelineEventId === eventId || step.stepId === eventId
        );
        if (stepIndex >= 0) syncExecutiveScenarioPlaybackToTimelineStep(stepIndex);
      }
    },
    [timelineSpatialState?.anchors]
  );

  const scenarioUniverseState = useSyncExternalStore(
    subscribeExecutiveScenarioUniverse,
    getExecutiveScenarioUniverseState,
    getExecutiveScenarioUniverseServerSnapshot
  );

  const effectiveScenarioSimulation = useMemo(() => {
    const universeSimulation = resolveActiveUniverseSimulation(scenarioUniverseState);
    if (universeSimulation && scenarioUniverseState?.comparisonActive) return universeSimulation;
    return props.scenarioSimulation ?? null;
  }, [
    props.scenarioSimulation?.scenarioId,
    scenarioUniverseState?.activeScenarioId,
    scenarioUniverseState?.comparisonActive,
    scenarioUniverseState?.signature,
  ]);

  const activeUniverseLayerTitle = useMemo(() => {
    if (!scenarioUniverseState?.comparisonActive) return null;
    return (
      scenarioUniverseState.layers.find((layer) => layer.metadata.id === scenarioUniverseState.activeScenarioId)
        ?.metadata.title ?? null
    );
  }, [scenarioUniverseState?.activeScenarioId, scenarioUniverseState?.comparisonActive, scenarioUniverseState?.layers]);

  const playbackSequence = useMemo(() => {
    if (!props.timelineHud && !effectiveScenarioSimulation) return null;
    const sceneObjects = readExecutiveSceneObjects(props.sceneJson);
    const labels = Object.fromEntries(
      sceneObjects.map((raw, index) => {
        const object = raw as { id?: string; name?: string; label?: string };
        const id = String(object.id ?? object.name ?? `obj:${index}`).trim();
        return [id, String(object.label ?? object.name ?? id)];
      })
    );
    return buildExecutiveScenarioPlaybackSequence({
      scenarioId: effectiveScenarioSimulation?.scenarioId ?? "executive_timeline_scenario",
      scenarioName:
        activeUniverseLayerTitle ??
        (effectiveScenarioSimulation ? "Operational Scenario" : "Decision Story Playback"),
      simulation: effectiveScenarioSimulation ?? null,
      timelineEvents: mapTimelineEventsForPlayback(props.timelineHud?.events ?? []),
      sceneObjectLabels: labels,
    });
  }, [activeUniverseLayerTitle, effectiveScenarioSimulation, props.timelineHud, props.sceneJson]);

  useEffect(() => {
    loadExecutiveScenarioPlaybackSequence(playbackSequence);
  }, [playbackSequence?.signature]);

  const scenarioPlaybackState = useSyncExternalStore(
    subscribeExecutiveScenarioPlayback,
    getExecutiveScenarioPlaybackState,
    getExecutiveScenarioPlaybackServerSnapshot
  );

  const playbackObjectSelection = useMemo(
    () => resolveScenarioPlaybackObjectSelection(scenarioPlaybackState.propagationView),
    [scenarioPlaybackState.propagationView?.signature]
  );

  const playbackMergedObjectSelection = useMemo(() => {
    if (!playbackObjectSelection) return stableMergedObjectSelection;
    return mergeTimelineSpatialObjectSelection(stableMergedObjectSelection, playbackObjectSelection);
  }, [playbackObjectSelection, stableMergedObjectSelection]);

  const playbackMergedSelectionSignature = buildSceneObjectSelectionSignature(
    playbackMergedObjectSelection ?? null
  );
  const stablePlaybackMergedObjectSelection = useMemo(
    () => playbackMergedObjectSelection ?? null,
    [playbackMergedSelectionSignature]
  );

  const universeObjectSelection = useMemo(() => {
    if (!scenarioUniverseState?.comparisonActive) return null;
    return resolveUniverseObjectSelection({
      state: scenarioUniverseState,
      layoutMode: scenarioUniverseState.layoutMode,
    });
  }, [scenarioUniverseState?.comparisonActive, scenarioUniverseState?.layoutMode, scenarioUniverseState?.signature]);

  const universeMergedObjectSelection = useMemo(() => {
    if (!universeObjectSelection) return stablePlaybackMergedObjectSelection;
    return mergeTimelineSpatialObjectSelection(stablePlaybackMergedObjectSelection, universeObjectSelection);
  }, [stablePlaybackMergedObjectSelection, universeObjectSelection]);

  const universeMergedSelectionSignature = buildSceneObjectSelectionSignature(
    universeMergedObjectSelection ?? null
  );
  const stableUniverseMergedObjectSelection = useMemo(
    () => universeMergedObjectSelection ?? null,
    [universeMergedSelectionSignature]
  );

  const ghostScenarioLayers = useMemo(
    () => resolveGhostUniverseLayers(scenarioUniverseState),
    [scenarioUniverseState?.activeScenarioId, scenarioUniverseState?.layoutMode, scenarioUniverseState?.signature, scenarioUniverseState?.visibleLayerIds]
  );

  const scenarioComparisonDashboard = useMemo(
    () => (scenarioUniverseState?.comparisonActive ? buildScenarioComparisonDashboard(scenarioUniverseState) : []),
    [scenarioUniverseState?.comparisonActive, scenarioUniverseState?.signature]
  );

  const handleScenarioLayerSelect = useCallback(
    (scenarioId: string) => {
      setActiveScenarioLayer(scenarioId);
      props.onScenarioLayerSelect?.(scenarioId);
    },
    [props.onScenarioLayerSelect]
  );

  const executiveWarRoomState = useSyncExternalStore(
    subscribeExecutiveWarRoom,
    getExecutiveWarRoomState,
    getExecutiveWarRoomServerSnapshot
  );

  const handleWarRoomCommand = useCallback(
    (commandId: ExecutiveWarRoomCommandId) => {
      dispatchExecutiveWarRoomCommand(commandId);
      props.onWarRoomCommand?.(commandId);
    },
    [props.onWarRoomCommand]
  );

  const handleWarRoomFocusMode = useCallback((mode: ExecutiveWarRoomFocusMode) => {
    setExecutiveWarRoomFocusMode(mode);
  }, []);

  const cognitiveTwinState = useSyncExternalStore(
    subscribeExecutiveCognitiveTwin,
    getExecutiveCognitiveTwinState,
    getExecutiveCognitiveTwinServerSnapshot
  );

  const executiveAdvisorState = useSyncExternalStore(
    subscribeExecutiveAdvisor,
    getExecutiveAdvisorState,
    getExecutiveAdvisorServerSnapshot
  );

  const executiveIntelligenceState = useSyncExternalStore(
    subscribeExecutiveIntelligence,
    getExecutiveIntelligenceState,
    getExecutiveIntelligenceServerSnapshot
  );

  const twinObjectSelection = useMemo(
    () => resolveTwinObjectSelection(cognitiveTwinState),
    [cognitiveTwinState?.livingObjectIds, cognitiveTwinState?.signature]
  );

  const twinMergedObjectSelection = useMemo(() => {
    if (!twinObjectSelection) return stableUniverseMergedObjectSelection;
    return mergeTimelineSpatialObjectSelection(stableUniverseMergedObjectSelection, twinObjectSelection);
  }, [stableUniverseMergedObjectSelection, twinObjectSelection]);

  const twinMergedSelectionSignature = buildSceneObjectSelectionSignature(twinMergedObjectSelection ?? null);
  const stableTwinMergedObjectSelection = useMemo(
    () => twinMergedObjectSelection ?? null,
    [twinMergedSelectionSignature]
  );

  const executiveFocusSnapshot = useSyncExternalStore(
    subscribeExecutiveFocusMode,
    getExecutiveFocusModeSnapshot,
    getExecutiveFocusModeServerSnapshot
  );

  const sceneObjectCountForVisibility = sceneObjectIds.length;
  const restrictVisibilityToFocus = shouldRestrictVisibilityToFocus({
    focusMode: props.focusMode,
    focusPinned: props.focusPinned,
    executiveFocusModeEnabled: executiveFocusSnapshot.enabled,
  });
  const renderFocusMode = resolveExecutiveRenderFocusMode({
    focusMode: props.focusMode,
    focusPinned: props.focusPinned,
    executiveFocusModeEnabled: executiveFocusSnapshot.enabled,
  });
  const forceDimUnrelated =
    Boolean(props.scenarioSimulation) ||
    scenarioPlaybackState.status !== "idle" ||
    Boolean(mergedPropagationOverlay?.active);
  const renderObjectSelection = useMemo(
    () =>
      sanitizeExecutiveObjectSelectionForRender(stableTwinMergedObjectSelection, {
        objectCount: sceneObjectCountForVisibility,
        focusMode: props.focusMode,
        focusPinned: props.focusPinned,
        executiveFocusModeEnabled: executiveFocusSnapshot.enabled,
        forceDimUnrelated,
      }),
    [
      executiveFocusSnapshot.enabled,
      forceDimUnrelated,
      props.focusMode,
      props.focusPinned,
      sceneObjectCountForVisibility,
      twinMergedSelectionSignature,
    ]
  );
  const renderObjectSelectionSignature = buildSceneObjectSelectionSignature(renderObjectSelection ?? null);
  const stableRenderObjectSelection = useMemo(
    () => renderObjectSelection ?? null,
    [renderObjectSelectionSignature]
  );

  const twinLivingEntities = useMemo(
    () => resolveTwinLivingEntities(cognitiveTwinState),
    [cognitiveTwinState?.livingObjectIds, cognitiveTwinState?.signature]
  );

  const twinStressedRelationshipIds = useMemo(
    () => resolveTwinStressedRelationshipIds(cognitiveTwinState),
    [cognitiveTwinState?.stressedRelationshipIds, cognitiveTwinState?.signature]
  );

  const playbackPropagationOverlay = useMemo(() => {
    if (
      scenarioPlaybackState.status === "idle" ||
      !scenarioPlaybackState.propagationView
    ) {
      return null;
    }
    return buildPlaybackPropagationOverlay(scenarioPlaybackState.propagationView);
  }, [scenarioPlaybackState.propagationView?.signature, scenarioPlaybackState.status]);

  const effectivePropagationOverlay = playbackPropagationOverlay ?? mergedPropagationOverlay;

  const renderVisibilityInput = useMemo(
    () => ({
      focusMode: props.focusMode,
      selectedObjectId: selectedIdCtx ?? props.selectedObjectId ?? null,
      executiveFocusModeEnabled: executiveFocusSnapshot.enabled,
      focusPinned: props.focusPinned,
    }),
    [
      executiveFocusSnapshot.enabled,
      props.focusMode,
      props.focusPinned,
      props.selectedObjectId,
      selectedIdCtx,
    ]
  );

  const renderObjects = useMemo(
    () => resolveSceneRenderObjects(props.sceneJson, renderVisibilityInput),
    [props.sceneJson, renderVisibilityInput, sceneJsonObjectsSignature]
  );

  const sceneJsonForRenderer = useMemo(() => {
    if (!props.sceneJson) return null;
    return {
      ...props.sceneJson,
      scene: {
        ...(props.sceneJson.scene ?? {}),
        objects: renderObjects,
      },
    };
  }, [props.sceneJson, renderObjects, sceneJsonObjectsSignature]);

  const overlayObjectsRegistrySignature = useMemo(
    () => buildSceneObjectsRegistrySignature(renderObjects),
    [renderObjects]
  );
  const overlaySceneObjects = useMemo(
    () => syncSceneObjectRegistry(renderObjects),
    [overlayObjectsRegistrySignature, renderObjects]
  );

  const scenePipelineTraceRef = useRef<string | null>(null);
  const scenePipelineTraceSnapshot = useMemo(() => {
    const sceneJsonObjectIds = extractSceneObjectIds(props.sceneJson);
    const renderedObjectIds = renderObjects
      .map((obj, index) => String(obj?.id ?? obj?.name ?? `obj:${index}`).trim())
      .filter(Boolean);
    const renderAll = shouldRenderAllSceneObjects(renderVisibilityInput);
    const visibleSceneObjectIds = renderAll
      ? sceneJsonObjectIds
      : sceneJsonObjectIds.filter(
          (id) =>
            id === props.focusedId ||
            id === renderVisibilityInput.selectedObjectId ||
            (Array.isArray(stableRenderObjectSelection?.highlighted_objects) &&
              stableRenderObjectSelection.highlighted_objects.map(String).includes(id))
        );
    const activeFilters = detectSceneObjectPipelineFilters({
      sceneJsonCount: sceneJsonObjectIds.length,
      visibleCount: visibleSceneObjectIds.length,
      renderedCount: renderedObjectIds.length,
      staleSceneJsonCache: false,
      restrictToFocus: restrictVisibilityToFocus,
      dimUnrelatedObjects: stableRenderObjectSelection?.dim_unrelated_objects === true,
      focusMode: props.focusMode,
      selectedObjectId: renderVisibilityInput.selectedObjectId,
      scenarioId: props.scenarioSimulation?.scenarioId ?? null,
      objectSelectionHighlightCount: Array.isArray(stableRenderObjectSelection?.highlighted_objects)
        ? stableRenderObjectSelection.highlighted_objects.length
        : 0,
    });
    const snapshot = {
      sceneJsonObjectIds,
      visibleSceneObjectIds,
      renderedObjectIds,
      activeFilters,
      focusMode: props.focusMode,
      selectedObjectId: renderVisibilityInput.selectedObjectId,
      scenarioId: props.scenarioSimulation?.scenarioId ?? null,
      executiveFocusModeEnabled: executiveFocusSnapshot.enabled,
      restrictToFocus: restrictVisibilityToFocus,
      dimUnrelatedObjects: stableRenderObjectSelection?.dim_unrelated_objects === true,
    };
    return {
      snapshot,
      signature: JSON.stringify({
        scene: sceneJsonObjectIds.slice().sort(),
        visible: visibleSceneObjectIds.slice().sort(),
        rendered: renderedObjectIds.slice().sort(),
        filters: activeFilters.slice().sort(),
        focusMode: props.focusMode,
        selectedObjectId: renderVisibilityInput.selectedObjectId,
        scenarioId: props.scenarioSimulation?.scenarioId ?? null,
      }),
    };
  }, [
    executiveFocusSnapshot.enabled,
    props.focusMode,
    props.focusedId,
    props.sceneJson,
    props.scenarioSimulation?.scenarioId,
    renderObjects,
    renderVisibilityInput,
    restrictVisibilityToFocus,
    stableRenderObjectSelection,
  ]);

  if (
    process.env.NODE_ENV !== "production" &&
    scenePipelineTraceSnapshot.signature !== scenePipelineTraceRef.current
  ) {
    scenePipelineTraceRef.current = scenePipelineTraceSnapshot.signature;
    traceSceneObjectPipeline(scenePipelineTraceSnapshot.snapshot);
  }

  const executiveCameraContext = useMemo<ExecutiveCameraContextInput>(
    () => ({
      selectedObjectId: selectedIdCtx ?? props.selectedObjectId ?? null,
      focusedObjectId: props.focusedId ?? null,
      objectPanelOpen: Boolean(props.objectInfoHud?.model.selectedObjectId),
      simulationRunning:
        simulationOverlay.highlightedIds.length > 0 ||
        simulationOverlay.links.length > 0 ||
        Boolean(props.scenarioTrigger),
      riskViewActive:
        Boolean(combinedObjectSelection?.risk_sources?.length) ||
        Boolean(combinedObjectSelection?.risk_targets?.length) ||
        mergedPropagationOverlay?.active === true,
      operationalAnalysisActive:
        decisionPathOverlay?.active === true ||
        propagationMode === "backend" ||
        propagationMode === "preview",
      workspaceViewMode,
    }),
    [
      combinedObjectSelection?.risk_sources?.length,
      combinedObjectSelection?.risk_targets?.length,
      decisionPathOverlay?.active,
      mergedPropagationOverlay?.active,
      props.focusedId,
      props.objectInfoHud?.model.selectedObjectId,
      props.scenarioTrigger,
      props.selectedObjectId,
      propagationMode,
      selectedIdCtx,
      simulationOverlay.highlightedIds.length,
      simulationOverlay.links.length,
      workspaceViewMode,
    ]
  );

  const executiveObjectLayout = useMemo(() => {
    if (renderObjects.length < 6) return null;
    return normalizeExecutiveObjectLayout(renderObjects, {
      viewportMode: workspaceViewMode,
    });
  }, [overlayObjectsRegistrySignature, renderObjects, selectedIdCtx, props.selectedObjectId, workspaceViewMode]);
  const layoutPositions = executiveObjectLayout?.positions;
  const layoutBoundsSignature = useMemo(() => {
    const entries = Object.entries(layoutPositions ?? {})
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, pos]) => `${id}:${pos.map((value) => Number(value).toFixed(2)).join(",")}`);
    return entries.join("|");
  }, [layoutPositions]);
  const viewportModeResolvedLogRef = useRef<string>("");
  const executiveSceneActive = Boolean(
    props.timelineHud ||
      props.quickActionsDock ||
      props.executiveStatusHud ||
      props.sceneNavigationToolbar ||
      props.cameraToolbar
  );
  const shouldUseExecutive3DOverview =
    renderObjects.length >= 4 &&
    executiveSceneActive &&
    workspaceViewMode === "2D" &&
    explicitWorkspaceViewModeRef.current !== "2D";
  const effectiveViewportFrameMode: WorkspaceViewMode = shouldUseExecutive3DOverview ? "3D" : workspaceViewMode;
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const reason = shouldUseExecutive3DOverview
      ? "type_c_multi_object_default_3d_overview"
      : explicitWorkspaceViewModeRef.current === workspaceViewMode
        ? "explicit_workspace_view_mode"
        : "workspace_view_mode";
    const signature = `${workspaceViewMode}:${effectiveViewportFrameMode}:${renderObjects.length}:${reason}`;
    if (viewportModeResolvedLogRef.current === signature) return;
    viewportModeResolvedLogRef.current = signature;
    console.debug("[Nexora][ViewportModeResolved]", {
      rawViewMode: workspaceViewMode,
      resolvedFramingViewMode: effectiveViewportFrameMode,
      objectCount: renderObjects.length,
      source: "SceneCanvas",
      reason,
    });
  }, [effectiveViewportFrameMode, renderObjects.length, shouldUseExecutive3DOverview, workspaceViewMode]);
  const [settledLayoutBoundsSignature, setSettledLayoutBoundsSignature] = useState<string | null>(null);
  const layoutSettledFrameRef = useRef<{
    signature: string | null;
    timer: number | null;
  }>({ signature: null, timer: null });
  const initialLayoutFrameAppliedRef = useRef<string | null>(null);
  useEffect(() => {
    if (layoutSettledFrameRef.current.timer != null) {
      window.clearTimeout(layoutSettledFrameRef.current.timer);
      layoutSettledFrameRef.current.timer = null;
    }
    layoutSettledFrameRef.current.signature = layoutBoundsSignature || null;
    setSettledLayoutBoundsSignature((current) => (current === layoutBoundsSignature ? current : null));
    if (!layoutBoundsSignature) {
      return;
    }
    const timer = window.setTimeout(() => {
      if (layoutSettledFrameRef.current.signature !== layoutBoundsSignature) return;
      layoutSettledFrameRef.current.timer = null;
      setSettledLayoutBoundsSignature((current) =>
        current === layoutBoundsSignature ? current : layoutBoundsSignature
      );
    }, 120);
    layoutSettledFrameRef.current.timer = timer;
    return () => {
      window.clearTimeout(timer);
      if (layoutSettledFrameRef.current.timer === timer) {
        layoutSettledFrameRef.current.timer = null;
      }
    };
  }, [layoutBoundsSignature]);
  const visualBoundsOptions = useMemo<SceneBoundsOptions>(
    () => ({
      layoutPositions,
      globalScale,
      objectUxById: props.objectUxById,
      getUxForObject: props.getUxForObject,
    }),
    [globalScale, layoutPositions, props.getUxForObject, props.objectUxById]
  );

  const sceneRendererProps = useMemo(
    () => ({
      shadowsEnabled,
      focusMode: renderFocusMode,
      focusedId: props.focusedId,
      activeLoopId: props.effectiveActiveLoopId,
      theme: rendererTheme,
      motionCalm: props.motionCalm === true,
      getUxForObject: props.getUxForObject,
      objectUxById: props.objectUxById,
      globalScale,
      showObjectDebugLabels,
      showExecutiveLayoutLabels: Boolean(executiveObjectLayout),
      layoutPositions,
      layoutLabelOffsets: executiveObjectLayout?.labelOffsets,
      loops: props.loops,
      showLoops: props.showLoops,
      showLoopLabels: props.showLoopLabels,
      onObjectPositionChange: props.onObjectPositionChange,
    }),
    [
      shadowsEnabled,
      globalScale,
      props.effectiveActiveLoopId,
      props.focusMode,
      props.focusedId,
      renderFocusMode,
      props.getUxForObject,
      props.loops,
      props.motionCalm,
      props.objectUxById,
      props.onObjectPositionChange,
      props.showLoopLabels,
      props.showLoops,
      rendererTheme,
      showObjectDebugLabels,
      executiveObjectLayout,
      layoutPositions,
    ]
  );

  const gridSpan = useMemo(() => {
    if (!renderObjects.length) return 20;
    const bounds = executiveObjectLayout?.bounds;
    if (bounds) {
      return Math.max(20, Math.ceil(Math.max(bounds.size[0], bounds.size[2]) * 1.8));
    }
    return 20;
  }, [executiveObjectLayout, renderObjects.length]);

  useEffect(() => {
    computeWorkspaceScaleMetrics({
      totalObjects: renderObjects.length,
      visibleObjects: renderObjects.length,
      relationships: countSceneRelationships(props.sceneJson),
    });
  }, [props.sceneJson, renderObjects.length]);

  useEffect(() => {
    const highlightedSet = new Set(highlightedObjectIds);
    const protectedIds = Array.from(
      new Set([
        ...highlightedObjectIds,
        ...(props.focusedId ? [String(props.focusedId)] : []),
        ...(selectedIdCtx ? [String(selectedIdCtx)] : []),
      ])
    );
    const dimmedIds =
      combinedObjectSelection?.dim_unrelated_objects === true
        ? sceneObjectIds.filter((id) => !highlightedSet.has(id) && id !== props.focusedId && id !== selectedIdCtx).slice(0, 6)
        : [];

    const traceSig = JSON.stringify({
      highlightedObjectIds,
      dimUnrelatedObjects: combinedObjectSelection?.dim_unrelated_objects === true,
      focusedId: props.focusedId ?? null,
      selectedObjectId: selectedIdCtx ?? null,
      pinnedId: props.focusPinned ? props.focusedId ?? null : null,
      focusMode: props.focusMode,
      protectedIds,
      dimmedIds,
    });
    if (lastHighlightTraceSigRef.current === traceSig) return;
    lastHighlightTraceSigRef.current = traceSig;

    traceHighlightFlow("scene_canvas", {
      highlightedObjectIds,
      dimUnrelatedObjects: combinedObjectSelection?.dim_unrelated_objects === true,
      focusedId: props.focusedId ?? null,
      selectedObjectId: selectedIdCtx ?? null,
      pinnedId: props.focusPinned ? props.focusedId ?? null : null,
      focusMode: props.focusMode,
      sceneObjectIds: sceneObjectIds.slice(0, 12),
      protectedIds,
      dimmedIds,
    });
  }, [
    highlightedObjectIds,
    props.focusMode,
    props.focusPinned,
    props.focusedId,
    combinedObjectSelection,
    sceneObjectIds,
    selectedIdCtx,
  ]);

  useEffect(() => {
    isHudInteractingRef.current = isHudInteracting;
  }, [isHudInteracting]);

  const sceneObjectCount = Array.isArray(props.sceneJson?.scene?.objects)
    ? props.sceneJson.scene.objects.length
    : 0;
  const sceneActivitySignature = useMemo(
    () =>
      buildSceneActivityDriftSignature({
        objectCount: sceneObjectCount,
        selectedObjectId: props.selectedObjectId,
        selectedRelationshipId: props.selectedRelationshipId,
        selectedPropagationPathId: props.selectedPropagationPathId,
      }),
    [
      sceneObjectCount,
      props.selectedObjectId,
      props.selectedRelationshipId,
      props.selectedPropagationPathId,
    ]
  );
  const lastSceneActivityDriftSigRef = useRef<string | null>(null);
  const lastSceneActivityDriftAtRef = useRef(0);

  useEffect(() => {
    markHudDriftBaseline("scene-activity");
    scheduleSceneHudDriftBaseline("scene-activity", sceneShellRef.current);
  }, []);

  useEffect(() => {
    if (lastSceneActivityDriftSigRef.current === sceneActivitySignature) return;
    lastSceneActivityDriftSigRef.current = sceneActivitySignature;
    const now = Date.now();
    if (now - lastSceneActivityDriftAtRef.current < 20_000) return;
    lastSceneActivityDriftAtRef.current = now;
    detectHudDrift("scene-activity");
    scheduleSceneHudDriftDetect("scene-activity", sceneShellRef.current);
  }, [sceneActivitySignature]);

  useEffect(() => {
    const onNavigationAction = (event: Event) => {
      const detail = (event as CustomEvent<{ action?: string }>).detail;
      const action = detail?.action?.trim() || "unknown";
      const reason = `camera-${action}`;
      markSceneHudDriftBaseline(reason, sceneShellRef.current);
      scheduleSceneHudDriftDetect(reason, sceneShellRef.current);
    };
    return bindWindowListener(SCENE_NAVIGATION_ACTION_EVENT, onNavigationAction as EventListener, undefined, {
      component: "SceneCanvas",
      eventType: SCENE_NAVIGATION_ACTION_EVENT,
    });
  }, []);

  useEffect(() => {
    if (isFixedCamera) {
      localIsOrbitingRef.current = false;
    }
  }, [isFixedCamera]);

  useEffect(() => {
    const onLeftCommandOpenChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      if (typeof detail?.open !== "boolean") return;
      if (lastLeftCommandOpenForLayoutRef.current === null) {
        lastLeftCommandOpenForLayoutRef.current = detail.open;
        return;
      }
      if (lastLeftCommandOpenForLayoutRef.current === detail.open) return;
      lastLeftCommandOpenForLayoutRef.current = detail.open;
      leftColumnLayoutPauseRef.current = true;
      if (leftColumnLayoutTimerRef.current != null) {
        window.clearTimeout(leftColumnLayoutTimerRef.current);
      }
      leftColumnLayoutTimerRef.current = window.setTimeout(() => {
        leftColumnLayoutTimerRef.current = null;
        leftColumnLayoutPauseRef.current = false;
        setLeftColumnLayoutResumeNonce((n) => n + 1);
        sceneInvalidateRef.current?.();
      }, 180);
    };
    const detach = bindWindowListener(
      "nexora:left-command-open-changed",
      onLeftCommandOpenChanged as EventListener,
      undefined,
      {
        component: "SceneCanvas",
        eventType: "nexora:left-command-open-changed",
      }
    );
    return () => {
      detach();
      if (leftColumnLayoutTimerRef.current != null) {
        window.clearTimeout(leftColumnLayoutTimerRef.current);
        leftColumnLayoutTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        sceneInvalidateRef.current?.();
      });
    };
    const detach = bindWindowListener("resize", onResize, { passive: true }, {
      component: "SceneCanvas",
      eventType: "resize",
    });
    return () => {
      detach();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const selectedIdRefForKeydown = useRef(props.selectedIdRef);
  const selectedSetterRefForKeydown = useRef(props.selectedSetterRef);
  const onSelectedChangeForKeydownRef = useRef(props.onSelectedChange);
  useLayoutEffect(() => {
    selectedIdRefForKeydown.current = props.selectedIdRef;
    selectedSetterRefForKeydown.current = props.selectedSetterRef;
    onSelectedChangeForKeydownRef.current = props.onSelectedChange;
  }, [props.onSelectedChange, props.selectedIdRef, props.selectedSetterRef]);

  const onSceneCanvasKeyDown = useCallback((event: Event) => {
    const handled = handleExecutiveKeyboardNavigation(event as KeyboardEvent, {
      clearSelection: () => {
        if (selectedIdRefForKeydown.current.current == null) return;
        selectedSetterRefForKeydown.current?.current?.(null);
        onSelectedChangeForKeydownRef.current?.(null);
        preserveCameraOnClearRef.current = true;
      },
    });
    if (handled) {
      event.preventDefault();
      return;
    }
    const ev = event as KeyboardEvent;
    if (ev.key !== "Escape") return;
    if (selectedIdRefForKeydown.current.current == null) return;
    selectedSetterRefForKeydown.current?.current?.(null);
    onSelectedChangeForKeydownRef.current?.(null);
    patchExecutiveInteractionState({
      selectedObjectId: null,
      focusedObjectId: null,
    });
  }, []);

  useEffect(() => {
    const meta = {
      component: "SceneCanvas",
      eventType: "keydown",
    };
    const detach = bindWindowListener("keydown", onSceneCanvasKeyDown, undefined, meta);
    logDomListenerStable(meta);
    return detach;
  }, [onSceneCanvasKeyDown]);

  useEffect(() => {
    const isInsideHud = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return !!(el && typeof (el as any).closest === "function" && el.closest('.scene-hud-layer, [data-hud="chat"], [data-hud="scene-info"], [data-hud="object-info"], [data-hud="timeline"], [data-hud="camera-toolbar"], [data-hud="scene-navigation"], [data-hud="executive-status"], [data-hud="quick-actions"], [data-nx="scene-info-hud"], [data-nx="object-info-hud"], [data-nx="executive-timeline-hud"], [data-nx="executive-camera-toolbar"], [data-nx="executive-scene-toolbar"], [data-nx="executive-status-hud"], [data-nx="executive-quick-actions-dock"]'));
    };

    // Track pointer hover inside HUD so we can disable OrbitControls reliably.
    // Use capture so we see events even if something else stops propagation.
    const onPointerOverCapture = (e: PointerEvent) => {
      if (isInsideHud(e.target)) {
        if (!isHudInteractingRef.current) setIsHudInteracting(true);
      }
    };

    const onPointerOutCapture = (e: PointerEvent) => {
      const fromHud = isInsideHud(e.target);
      const goingToHud = isInsideHud((e as any).relatedTarget ?? null);
      if (fromHud && !goingToHud) {
        if (isHudInteractingRef.current) setIsHudInteracting(false);
      }
    };

    // Stop wheel/touchmove from reaching scene/global handlers when originating from HUD.
    // Do NOT preventDefault so native scrolling still works.
    const stopIfHudCapture = (e: Event) => {
      if (!isInsideHud(e.target)) return;
      (e as any).stopImmediatePropagation?.();
      e.stopPropagation();
    };

    const meta = { component: "SceneCanvas", eventType: "hud-capture" } as const;
    const detachOver = bindWindowListener("pointerover", onPointerOverCapture as EventListener, { capture: true }, {
      ...meta,
      eventType: "pointerover",
    });
    const detachOut = bindWindowListener("pointerout", onPointerOutCapture as EventListener, { capture: true }, {
      ...meta,
      eventType: "pointerout",
    });
    const detachWheel = bindWindowListener("wheel", stopIfHudCapture, { passive: true, capture: true }, {
      ...meta,
      eventType: "wheel",
    });
    const detachTouchMove = bindWindowListener("touchmove", stopIfHudCapture, { passive: true, capture: true }, {
      ...meta,
      eventType: "touchmove",
    });

    return () => {
      detachOver();
      detachOut();
      detachWheel();
      detachTouchMove();
    };
  }, []);

  useEffect(() => {
    const isInsideHud = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return !!(el && typeof (el as any).closest === "function" && el.closest('.scene-hud-layer, [data-hud="chat"], [data-hud="scene-info"], [data-hud="object-info"], [data-hud="timeline"], [data-hud="camera-toolbar"], [data-hud="scene-navigation"], [data-hud="executive-status"], [data-hud="quick-actions"], [data-nx="scene-info-hud"], [data-nx="object-info-hud"], [data-nx="executive-timeline-hud"], [data-nx="executive-camera-toolbar"], [data-nx="executive-scene-toolbar"], [data-nx="executive-status-hud"], [data-nx="executive-quick-actions-dock"]'));
    };

    const onTouchStartCapture = (e: TouchEvent) => {
      if (isInsideHud(e.target)) setIsHudInteracting(true);
    };

    const clear = () => setIsHudInteracting(false);

    const meta = { component: "SceneCanvas", eventType: "hud-touch-capture" } as const;
    const detachStart = bindWindowListener("touchstart", onTouchStartCapture as EventListener, { passive: true, capture: true }, {
      ...meta,
      eventType: "touchstart",
    });
    const detachEnd = bindWindowListener("touchend", clear, { passive: true, capture: true }, {
      ...meta,
      eventType: "touchend",
    });
    const detachCancel = bindWindowListener("touchcancel", clear, { passive: true, capture: true }, {
      ...meta,
      eventType: "touchcancel",
    });

    return () => {
      detachStart();
      detachEnd();
      detachCancel();
    };
  }, []);

  const handleCanvasPointerDown = useCallback(
    (e: any) => {
      if (e.button !== 0) return;
      const intersections = (e as any).intersections as Array<{ object: THREE.Object3D }> | undefined;
      const camera = (e as any).camera as THREE.Camera | undefined;
      if (!camera || !intersections || intersections.length === 0) return;
      const obj = intersections[0]?.object;
      if (!obj) return;
      obj.getWorldPosition(tmpWorld);
      tmpWorld.project(camera);
      const raw = (tmpWorld.x + 1) / 2;
      const sx = Math.max(0, Math.min(1, raw));
      props.onSelectedScreenX?.(sx);
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][SceneCanvas][SelectionUpdate]", {
          kind: "pointer_down",
          screenX: Number(sx.toFixed(3)),
        });
      }
    },
    [props.onSelectedScreenX, tmpWorld]
  );

  const handleCanvasContextMenu = useCallback((e: any) => {
    e.preventDefault();
  }, []);

  const handlePointerMissed = useCallback(
    (e: any) => {
      if ((e as any)?.button !== 0) return;
      if (localIsOrbitingRef.current || isHudInteractingRef.current) {
        if (process.env.NODE_ENV !== "production") {
          console.log("[Nexora][SceneInteraction] empty click ignored", {
            orbiting: localIsOrbitingRef.current,
            hudInteracting: isHudInteractingRef.current,
          });
        }
        return;
      }
      if (props.selectedIdRef.current == null && !props.selectedRelationshipId && !props.selectedPropagationPathId) {
        props.onSelectedScreenX?.(null);
        return;
      }
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][SceneInteraction] empty click ignored", {
          action: "soft_deselect_without_reframe",
        });
      }
      preserveCameraOnClearRef.current = true;
      props.selectedSetterRef?.current?.(null);
      props.onSelectedChange?.(null);
      props.onSelectedScreenX?.(null);
      props.onPointerMissed();
    },
    [
      props.onPointerMissed,
      props.onSelectedChange,
      props.onSelectedScreenX,
      props.selectedIdRef,
      props.selectedPropagationPathId,
      props.selectedRelationshipId,
      props.selectedSetterRef,
    ]
  );

  const handleOrbitStart = useCallback(() => {
    if (programmaticCameraUpdateRef.current) {
      logOrbitGuardOnce({
        blocked: true,
        kind: "orbit_start",
        reason: "programmatic_camera_update",
      });
      return;
    }
    if (isFixedCamera || localIsOrbitingRef.current) return;
    markHudDriftBaseline("camera-orbit");
    markSceneHudDriftBaseline("camera-orbit", sceneShellRef.current);
    localIsOrbitingRef.current = true;
    preserveCameraOnClearRef.current = true;
    armExecutiveCameraMemory("user_orbit");
    setExecutiveScenarioPlaybackCameraOverride(true);
    props.onOrbitStart();
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][SceneCanvas][FocusUpdate]", {
        kind: "orbit_start",
        fixedCamera: isFixedCamera,
      });
    }
  }, [isFixedCamera, props.onOrbitStart]);

  const handleOrbitEnd = useCallback(() => {
    if (programmaticCameraUpdateRef.current) {
      logOrbitGuardOnce({
        blocked: true,
        kind: "orbit_end",
        reason: "programmatic_camera_update",
      });
      return;
    }
    if (isFixedCamera || !localIsOrbitingRef.current) return;
    localIsOrbitingRef.current = false;
    preserveCameraOnClearRef.current = true;
    props.onOrbitEnd();
    detectHudDrift("camera-orbit");
    scheduleSceneHudDriftDetect("camera-orbit", sceneShellRef.current);
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][SceneCanvas][FocusUpdate]", {
        kind: "orbit_end",
        fixedCamera: isFixedCamera,
      });
    }
  }, [isFixedCamera, props.onOrbitEnd]);

  const clearTemporaryCameraFocus = useCallback(() => {
    preserveCameraOnClearRef.current = true;
    props.selectedSetterRef?.current?.(null);
    props.onSelectedChange?.(null);
    props.onSelectedScreenX?.(null);
  }, [props.onSelectedChange, props.onSelectedScreenX, props.selectedSetterRef]);

  return (
    <div
      ref={sceneShellRef}
      className={SCENE_SHELL_CLASS}
      data-nx-view-mode={workspaceViewMode}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        flex: "1 1 0%",
        zIndex: 0,
        contain: "layout size style",
      }}
    >
      {props.storyAccent ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            border: `1px solid ${props.storyAccent.tint ?? "rgba(148,163,184,0.14)"}`,
            boxShadow: `inset 0 0 0 1px ${props.storyAccent.tint ?? "rgba(148,163,184,0.12)"}, inset 0 0 52px ${
              props.storyAccent.glow ?? "rgba(56,189,248,0.12)"
            }`,
            background: `radial-gradient(circle at 18% 16%, ${props.storyAccent.glow ?? "rgba(56,189,248,0.08)"} 0%, transparent 42%)`,
            transition: "box-shadow 260ms ease, border-color 260ms ease, background 260ms ease",
          }}
        >
          {props.storyAccent.label ? (
            <div
              style={{
                position: "absolute",
                right: 16,
                top: 16,
                padding: "5px 10px",
                borderRadius: 999,
                border: `1px solid ${props.storyAccent.tint ?? nx.border}`,
                background: nx.bgElevated,
                color: nx.textSoft,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {props.storyAccent.label}
            </div>
          ) : null}
        </div>
      ) : null}
      <Canvas
        className={SCENE_WORLD_LAYER_CLASS}
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        shadows={shadowsEnabled}
        camera={{
          position: props.camPos ?? [6, 9, 14],
          fov: 42,
          near: 0.1,
          far: 250,
        }}
        style={{ width: "100%", height: "100%", display: "block" }}
        onPointerDown={handleCanvasPointerDown}
        onContextMenu={handleCanvasContextMenu}
        onPointerMissed={handlePointerMissed}
      >
        <SceneDemandInvalidateDriver
          layoutPauseRef={leftColumnLayoutPauseRef}
          invalidateOutRef={sceneInvalidateRef}
          sceneJson={props.sceneJson}
          isOrbiting={props.isOrbiting}
          localIsOrbitingRef={localIsOrbitingRef}
          viewMode={workspaceViewMode}
        />
        <color attach="background" args={[sceneEnv.clearColor]} />
        <SceneFogSync color={sceneEnv.fogColor} near={sceneEnv.fogNear} far={sceneEnv.fogFar} />

        {!CANVAS_STATIC_MODE && (
          <CameraIntelligence
            selectedObjectId={selectedIdCtx ?? null}
            focusPinned={props.focusPinned}
            focusMode={props.focusMode}
            focusedId={props.focusedId}
            sceneJson={props.sceneJson}
            camPos={props.camPos}
            overridesRef={props.overridesRef}
            cameraLockedByUser={props.cameraLockedByUser || isFixedCamera}
            isOrbiting={props.isOrbiting}
            hudDockSide={props.hudDockSide}
            layoutDockInsets={props.layoutDockInsets}
            controlsRef={controlsRef}
            localIsOrbitingRef={localIsOrbitingRef}
            preserveCameraOnClearRef={preserveCameraOnClearRef}
            orbitControlsEnabled={orbitControlsEnabled}
            layoutPauseRef={leftColumnLayoutPauseRef}
            layoutPositions={layoutPositions}
            cameraAuthorityRef={cameraAuthorityRef}
            visualBoundsOptions={visualBoundsOptions}
            layoutBoundsSignature={layoutBoundsSignature}
            settledLayoutBoundsSignature={settledLayoutBoundsSignature}
            initialLayoutFrameAppliedRef={initialLayoutFrameAppliedRef}
            programmaticCameraUpdateRef={programmaticCameraUpdateRef}
            mountedAtMs={cameraMountedAtMsRef.current}
            userExplicitlySelected2D={explicitWorkspaceViewModeRef.current === "2D"}
            layoutResumeNonce={leftColumnLayoutResumeNonce}
          />
        )}
        <ExecutiveViewportCamera
          viewMode={effectiveViewportFrameMode}
          sceneJson={sceneJsonForRenderer}
          layoutPositions={settledLayoutBoundsSignature === layoutBoundsSignature ? layoutPositions : undefined}
          objectCount={sceneObjectCount}
          layoutSignature={layoutBoundsSignature}
          cameraAuthorityRef={cameraAuthorityRef}
          mountedAtMs={cameraMountedAtMsRef.current}
        />
        <ExecutiveViewportFramer
          sceneJson={sceneJsonForRenderer}
          layoutPositions={layoutPositions}
          layoutBoundsSignature={layoutBoundsSignature}
          settledLayoutBoundsSignature={settledLayoutBoundsSignature}
          initialLayoutFrameAppliedRef={initialLayoutFrameAppliedRef}
          controlsRef={controlsRef}
          localIsOrbitingRef={localIsOrbitingRef}
          isOrbiting={props.isOrbiting}
          enabled={CANVAS_STATIC_MODE}
          reframeNonce={cameraReframeNonce}
          viewMode={effectiveViewportFrameMode}
          presetOverride={cameraPresetOverride}
          cameraAuthorityRef={cameraAuthorityRef}
          programmaticCameraUpdateRef={programmaticCameraUpdateRef}
          mountedAtMs={cameraMountedAtMsRef.current}
        />

        {sceneEnv.showStars ? (
          <Stars
            radius={80}
            depth={50}
            count={Math.max(120, Math.round((props.starCount ?? 1500) * sceneEnv.starCountFactor))}
            factor={sceneEnv.starsSpreadFactor}
            saturation={0}
            fade
            speed={1}
          />
        ) : null}

        <ambientLight intensity={sceneEnv.ambientLight} />
        <directionalLight position={[5, 8, 5]} intensity={sceneEnv.directionalLight} />

        <ExecutiveOrbitControls
          controlsRef={controlsRef}
          sceneJson={sceneJsonForRenderer}
          viewMode={workspaceViewMode}
          enabled={orbitControlsEnabled}
          isInteracting={props.isOrbiting || localIsOrbitingRef.current}
          programmaticCameraUpdateRef={programmaticCameraUpdateRef}
          cameraAuthorityRef={cameraAuthorityRef}
          layoutSignature={layoutBoundsSignature}
          mountedAtMs={cameraMountedAtMsRef.current}
          onStart={handleOrbitStart}
          onEnd={handleOrbitEnd}
        />

        <AnimatedScaleGroup target={resolvedGlobalScale} staticMode={CANVAS_STATIC_MODE}>
          {showGrid || showAxes ? (
            <ExecutiveSceneGuides gridSpan={gridSpan} showGrid={showGrid} showAxes={showAxes} />
          ) : null}
          {props.showCameraHelper ? (
            <group>
              <mesh position={[0, 1.2, 0]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            </group>
          ) : null}

          {sceneJsonForRenderer ? (
            <>
              <SceneOverlayRenderer
                sceneJson={sceneJsonForRenderer}
                objects={overlaySceneObjects}
                themeId={hudThemeMode}
                visibility={overlayRuntime.visibility}
                propagationOverlay={effectivePropagationOverlay}
                decisionPathOverlay={decisionPathOverlay}
                decisionPathRenderInput={decisionPathOverlay}
                objectSelection={stableRenderObjectSelection}
                selectedObjectId={selectedIdCtx ?? props.selectedObjectId ?? null}
                selectedRelationshipId={props.selectedRelationshipId ?? null}
                selectedPropagationPathId={props.selectedPropagationPathId ?? null}
                onRelationshipSelect={props.onRelationshipSelect}
                onPropagationPathSelect={props.onPropagationPathSelect}
                timelineSpatialState={timelineSpatialState}
                scenarioPropagationView={scenarioPlaybackState.propagationView}
                ghostScenarioLayers={ghostScenarioLayers}
                activeComparisonScenarioId={scenarioUniverseState?.activeScenarioId ?? null}
                comparisonLayoutMode={scenarioUniverseState?.layoutMode ?? "ghost"}
                twinLivingEntities={twinLivingEntities}
                twinStressedRelationshipIds={twinStressedRelationshipIds}
                viewMode={workspaceViewMode}
                sceneRendererProps={sceneRendererProps}
              />

              <SetterRegistrar refSetter={props.selectedSetterRef} />
              <FullRegistrar
                selectedIdRefLocal={props.selectedIdRef}
                overridesRefLocal={props.overridesRef}
                setOverrideRefLocal={props.setOverrideRef}
                clearAllOverridesRefLocal={props.clearAllOverridesRef}
                pruneOverridesRefLocal={props.pruneOverridesRef}
                onSelectedChange={props.onSelectedChange}
              />
            </>
          ) : null}
        </AnimatedScaleGroup>

        {(props.sceneNavigationToolbar ?? props.cameraToolbar) ? (
          <SceneNavigationController
            controlsRef={controlsRef}
            sceneJson={sceneJsonForRenderer}
            layoutPositions={layoutPositions}
            selectedObjectId={selectedIdCtx ?? props.selectedObjectId ?? null}
            cameraContext={executiveCameraContext}
            cameraAuthorityRef={cameraAuthorityRef}
            programmaticCameraUpdateRef={programmaticCameraUpdateRef}
            layoutSignature={layoutBoundsSignature}
            mountedAtMs={cameraMountedAtMsRef.current}
            onRequestStaticReframe={requestStaticCameraReframe}
            onClearTemporaryFocus={clearTemporaryCameraFocus}
          />
        ) : null}
      </Canvas>
      <ExecutiveFocusModeDocumentBridge />
      <SceneHudLayer>
        {props.sceneInfoHud ? <SceneInfoHudOverlay {...props.sceneInfoHud} themeMode={hudThemeMode} /> : null}
        {props.objectInfoHud ? (
          <ObjectInfoHudOverlay
            model={props.objectInfoHud.model}
            sceneJson={props.objectInfoHud.sceneJson}
            themeMode={hudThemeMode}
            onCreateRelationship={props.objectInfoHud.onCreateRelationship}
            onDeleteRelationship={props.objectInfoHud.onDeleteRelationship}
            onCreateImpactPath={props.objectInfoHud.onCreateImpactPath}
            onEditPropagationPath={props.objectInfoHud.onEditPropagationPath}
            onDeletePropagationPath={props.objectInfoHud.onDeletePropagationPath}
            onEditObject={props.objectInfoHud.onEditObject}
            onDuplicateObject={props.objectInfoHud.onDuplicateObject}
            onDeleteObject={props.objectInfoHud.onDeleteObject}
          />
        ) : null}
        {props.timelineHud ? (
          <ExecutiveBottomWorkspaceOverlay
            timeline={props.timelineHud}
            spatialSummary={scenarioPlaybackState.propagationView ? {
              eventId: scenarioPlaybackState.propagationView.stepId,
              title: scenarioPlaybackState.propagationView.stepTitle,
              timestampLabel: scenarioPlaybackState.propagationView.progressLabel,
              affectedObjectLabel: scenarioPlaybackState.propagationView.focusObjectId,
              severity: scenarioPlaybackState.propagationView.severity,
              summary: scenarioPlaybackState.propagationView.activeSummary,
              markerType: scenarioPlaybackState.propagationView.kind === "opportunity"
                ? "operational"
                : scenarioPlaybackState.propagationView.kind === "risk"
                  ? "risk"
                  : scenarioPlaybackState.propagationView.kind === "decision"
                    ? "decision"
                    : "operational",
            } : timelineSpatialState?.activeSummary ?? null}
            onEventSelect={handleTimelineEventSelect}
            onEventHover={handleTimelineEventHover}
            onEventFocusMode={handleTimelineEventFocusMode}
            playback={scenarioPlaybackState}
            playbackCompletion={scenarioPlaybackState.completionSummary}
            onPlaybackPlay={() => playExecutiveScenarioPlayback()}
            onPlaybackPause={() => pauseExecutiveScenarioPlayback()}
            onPlaybackRestart={() => restartExecutiveScenarioPlayback()}
            onPlaybackPrevious={() => previousExecutiveScenarioPlaybackStep()}
            onPlaybackNext={() => nextExecutiveScenarioPlaybackStep()}
            onPlaybackSpeedChange={(speed) => setExecutiveScenarioPlaybackSpeed(speed)}
            scenarioUniverse={scenarioUniverseState?.comparisonActive ? scenarioUniverseState : null}
            comparisonDashboard={scenarioComparisonDashboard}
            onScenarioLayerSelect={handleScenarioLayerSelect}
            onScenarioLayerVisibility={(scenarioId, visible) => setScenarioLayerVisibility(scenarioId, visible)}
            onScenarioLayerIsolate={(scenarioId) => isolateScenarioLayer(scenarioId)}
            onComparisonLayoutMode={(mode) => setScenarioUniverseLayoutMode(mode)}
            onComparisonMode={(mode) => setScenarioComparisonMode(mode)}
            warRoomHud={executiveWarRoomState?.active ? executiveWarRoomState.hud : null}
            advisorHud={executiveAdvisorState?.active ? executiveAdvisorState.hud : null}
            commandCenterHud={executiveIntelligenceState?.active ? executiveIntelligenceState.hud : null}
            quickActions={props.quickActionsDock ? {
              model: props.quickActionsDock.model,
              onAction: props.quickActionsDock.onAction,
            } : null}
            themeMode={hudThemeMode}
          />
        ) : null}
        {!props.timelineHud && props.quickActionsDock ? (
          <ExecutiveQuickActionsDockOverlay
            {...props.quickActionsDock}
            stackAboveTimeline={false}
          />
        ) : null}
        {props.executiveStatusHud ? (
          <ExecutiveStatusHudOverlay model={props.executiveStatusHud} themeMode={hudThemeMode} />
        ) : null}
        {executiveWarRoomState?.active && props.timelineHud ? (
          <ExecutiveWarRoomCommandRibbonOverlay
            model={executiveWarRoomState.hud}
            themeMode={hudThemeMode}
            onCommand={handleWarRoomCommand}
            onFocusModeChange={handleWarRoomFocusMode}
          />
        ) : null}
        {(props.sceneNavigationToolbar ?? props.cameraToolbar) ? (
          <ExecutiveSceneToolbarOverlay themeMode={hudThemeMode} />
        ) : null}
      </SceneHudLayer>
    </div>
  );
}

export const SceneCanvas = React.memo(SceneCanvasComponent);
