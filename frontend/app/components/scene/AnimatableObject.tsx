"use client";

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { Html, Line, useCursor } from "@react-three/drei";

import type { SceneObject } from "../../lib/sceneTypes";
import { useStateVector, useSetSelectedId, useOverrides, useSelectedId } from "../SceneContext";
import { clamp } from "../../lib/sizeCommands";
import { normalizeExecutiveObjectScale } from "../../lib/scene/executiveSceneComposition";
import {
  resolveExecutiveFocusWorkspaceState,
} from "../../lib/scene/density";
import { resolveWorkspaceLabelState } from "../../lib/scene/workspaceLabelRenderingRuntime";
import {
  getWorkspaceViewMode,
  getWorkspaceViewModeServerSnapshot,
  subscribeWorkspaceViewMode,
} from "../../lib/workspace/workspaceViewModeRuntime";
import { resolveExecutiveLabelReduction } from "../../lib/workspace/minimalism";
import {
  buildObjectVisualProfile,
  deriveObjectVisualRole,
  resolveGeometryKindForObject,
  roleToHierarchyStyle,
  type ObjectVisualRole,
  type VisualLanguageContext,
} from "../../lib/visual/objectVisualLanguage";
import {
  resolveScannerCausalityRole,
  traceScannerCausalityRole,
} from "../../lib/visual/scannerCausalityPolicy";
import {
  resolveScannerVisualPriority,
  traceScannerVisualPriorityPolicy,
} from "../../lib/visual/scannerVisualPriorityPolicy";
import { getThemeTokens } from "../../lib/design/designTokens";
import { traceHighlightFlow } from "../../lib/debug/highlightDebugTrace";
import type {
  DecisionPathNarrativeNodeRole,
  DecisionPathNodeVisualHints,
} from "../overlays/DecisionPathOverlayLayer";
import {
  compactScannerReason,
  computeAutoColor,
  geometryFor,
  hashIdToUnit,
  normalizeScannerLabelSeverity,
  severityToScannerColor,
  toPosTuple,
  type GeometryKind,
  type InteractionRole,
  type NarrativeNodeRole,
  type ScannerStoryReveal,
} from "./sceneRenderUtils";
import { deriveAnimatableVisualState } from "./animatableObject/deriveAnimatableVisualState";
import { buildAnimatableMotionState } from "./animatableObject/buildAnimatableMotionState";
import { getCalmSeverityVisual } from "../../lib/scene/calmSeverityVisuals";
import { resolveSceneObjectIcon } from "../../lib/scene/objectIconMapping";
import { resolveExecutiveObjectName } from "../../lib/scene/executiveObjectNamingRuntime";
import {
  executiveObjectNameLabelStyle,
  resolveObjectNameRenderingProfile,
} from "../../lib/scene/objectNameRenderingProfile";
import { resolveExecutiveObjectSelectionHighlight } from "../../lib/scene/executiveObjectSelectionHighlight";
import { shouldSuppressIdleDebugLog } from "../../lib/runtime/idleRuntimeStabilityGuard";
import {
  resolveStableObjectId,
} from "../../lib/scene/objectRegistryRuntime";
import {
  traceObjectIdentityChanged,
  traceObjectMount,
  traceObjectUnmount,
} from "../../lib/scene/objectMountDiagnostics";
import { resolveObjectLabelPlacement } from "../../lib/scene/objectLabelPlacementRuntime";
import { areAnimatableObjectPropsEqual } from "../../lib/scene/animatableObjectPropsEqual";
import {
  resolveObjectNameDensityProfile,
  resolveObjectNameOpacity,
  shouldRenderExecutiveObjectName,
} from "../../lib/scene/objectNameDensityProfile";

const DEFAULT_SCANNER_STORY_REVEAL = Object.freeze({
  primary: 1,
  edge: 1,
  affected: 1,
  context: 1,
});
const CALM_MODE = true;
const STATIC_OBJECT_TRANSFORMS = true;

function roundMaterialScalar(value: number, decimals = 3): number {
  if (!Number.isFinite(value)) return 0;
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

function roundScaleInput(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.round(value * 100) / 100;
}

function roundTransformValue(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}

function roundTransformTuple(value: readonly number[] | undefined): [number, number, number] {
  return [
    roundTransformValue(value?.[0] ?? 0),
    roundTransformValue(value?.[1] ?? 0),
    roundTransformValue(value?.[2] ?? 0),
  ];
}

function holdStableScaleInput(
  ref: React.MutableRefObject<{ signature: string; value: number } | null>,
  signature: string,
  next: number,
  threshold = 0.02
): number {
  const rounded = roundScaleInput(next);
  const previous = ref.current;
  if (!previous || previous.signature !== signature || Math.abs(rounded - previous.value) >= threshold) {
    ref.current = { signature, value: rounded };
    return rounded;
  }
  return previous.value;
}

const NEXORA_OBJECT_BASE_SCALE = 0.52;
const NEXORA_OBJECT_FOCUSED_SCALE = 0.56;
const NEXORA_OBJECT_SELECTED_SCALE = 0.58;
const loggedFinalObjectScaleBuckets = new Map<string, number>();
const loggedObjectMaterialSignatures = new Map<string, string>();
const loggedObjectTransformSignatures = new Map<string, string>();

export type AnimatableObjectProps = {
  obj: SceneObject;
  renderId?: string;
  anim?: { type: "pulse" | "wobble" | "spin"; intensity: number };
  index: number;
  shadowsEnabled?: boolean;
  focusMode?: "all" | "selected" | "pinned";
  focusedId?: string | null;
  hasValidFocusedTarget?: boolean;
  theme?: "day" | "night" | "stars";
  getUxForObject?: (id: string) => {
    shape?: string;
    base_color?: string;
    opacity?: number;
    scale?: number;
  } | null;
  objectUxById?: Record<string, { opacity?: number; scale?: number }>;
  globalScale?: number;
  modeId?: string;
  scannerSceneActive?: boolean;
  scannerFragilityScore?: number;
  scannerPrimaryTargetId?: string | null;
  resolvedPrimaryRenderId?: string | null;
  labelOwnerId?: string | null;
  decisionCenter?: [number, number, number];
  scannerPrimaryRole?: "primary_cause" | "affected" | "related_context" | "neutral";
  scannerPrimaryLabelTitle?: string | null;
  scannerPrimaryLabelBody?: string | null;
  scannerTargetIds?: string[];
  affectedTargetIds?: string[];
  contextTargetIds?: string[];
  riskSourceIds?: string[];
  riskTargetIds?: string[];
  scannerStoryReveal?: ScannerStoryReveal;
  hoveredId?: string | null;
  hoveredInteractionRole?: InteractionRole;
  setHoveredId?: React.Dispatch<React.SetStateAction<string | null>> | ((id: string | null) => void);
  motionCalm?: boolean;
  neighborIds?: string[];
  attentionMemoryStrength?: number;
  narrativeFocusStrength?: number;
  narrativeFocusRole?: NarrativeNodeRole;
  simulationStrength?: number;
  isSimulationSource?: boolean;
  decisionPathStrength?: number;
  decisionPathRole?: DecisionPathNarrativeNodeRole;
  decisionPathVisualHints?: DecisionPathNodeVisualHints;
  isDecisionPathSource?: boolean;
  sceneScale?: number;
  sceneObjectCount?: number;
  onObjectPositionChange?: (
    objectId: string,
    position: { x: number; y: number; z: number },
    phase: "drag" | "move"
  ) => void;
};

export const AnimatableObject = React.memo(function AnimatableObject({
  obj,
  renderId,
  anim,
  index,
  shadowsEnabled = false,
  focusMode,
  focusedId,
  hasValidFocusedTarget = false,
  theme = "night",
  getUxForObject,
  objectUxById,
  globalScale = 1,
  modeId,
  scannerSceneActive = false,
  scannerFragilityScore = 0,
  scannerPrimaryTargetId = null,
  resolvedPrimaryRenderId = null,
  labelOwnerId = null,
  decisionCenter = [0, 0, 0],
  scannerPrimaryRole = "neutral",
  scannerPrimaryLabelTitle = null,
  scannerPrimaryLabelBody = null,
  scannerTargetIds = [],
  affectedTargetIds = [],
  contextTargetIds = [],
  riskSourceIds = [],
  riskTargetIds = [],
  scannerStoryReveal = DEFAULT_SCANNER_STORY_REVEAL,
  hoveredId = null,
  hoveredInteractionRole = "neutral",
  setHoveredId,
  motionCalm = false,
  neighborIds = [],
  attentionMemoryStrength = 0,
  narrativeFocusStrength = 0,
  narrativeFocusRole = "outside",
  simulationStrength = 0,
  isSimulationSource = false,
  decisionPathStrength = 0,
  decisionPathRole = "outside",
  decisionPathVisualHints,
  isDecisionPathSource = false,
  sceneScale = 1,
  sceneObjectCount = 1,
  onObjectPositionChange,
}: AnimatableObjectProps) {
  const ref = useRef<THREE.Object3D>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    y: number;
    hasMoved: boolean;
  } | null>(null);
  const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const dragPointRef = useRef(new THREE.Vector3());
  const stableExecutiveScaleInputRef = useRef<{ signature: string; value: number } | null>(null);
  const stateVector = useStateVector();
  const setSelectedId = useSetSelectedId();
  const tags = obj.tags ?? [];
  const stableId = renderId ?? resolveStableObjectId(obj, index);
  const stableIdWithName = stableId;
  const stableObjectIdRef = useRef(stableId);
  const executiveObjectName = useMemo(
    () => resolveExecutiveObjectName({ object: obj, index, domainId: modeId }),
    [index, modeId, obj]
  );
  const overrides = useOverrides();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  useEffect(() => {
    const mountId = stableObjectIdRef.current;
    traceObjectMount({
      objectId: mountId,
      reactKey: mountId,
      source: "AnimatableObject",
    });
    return () => {
      traceObjectUnmount({
        objectId: mountId,
        reactKey: mountId,
        source: "AnimatableObject",
      });
    };
  }, []);
  useEffect(() => {
    const nextId = renderId ?? resolveStableObjectId(obj, index);
    const previousId = stableObjectIdRef.current;
    if (nextId === previousId) return;
    traceObjectIdentityChanged({
      objectId: nextId,
      previousId,
      nextId,
      source: "AnimatableObject",
    });
    stableObjectIdRef.current = nextId;
  }, [index, obj, renderId]);

  const visualContext = useMemo<VisualLanguageContext>(
    () => ({ theme: theme ?? "night", mode_id: modeId }),
    [theme, modeId]
  );
  const tokens = useMemo(() => getThemeTokens(theme ?? "night", modeId), [theme, modeId]);
  const objectIcon = useMemo(() => resolveSceneObjectIcon(obj), [obj]);
  const visualRole = useMemo<ObjectVisualRole>(() => deriveObjectVisualRole(obj, tags, visualContext), [obj, tags, visualContext]);
  const visualProfile = useMemo(() => buildObjectVisualProfile(obj, tags, visualContext), [obj, tags, visualContext]);
  const hierarchyStyle = useMemo(() => roleToHierarchyStyle(visualRole, visualContext), [visualRole, visualContext]);

  type MaterialLike = {
    color?: string;
    opacity?: number;
    emissive?: string;
    emissiveIntensity?: number;
    size?: number;
  };

  const material = useMemo<MaterialLike>(() => {
    const resolved = (obj as any)?.material;
    if (resolved && typeof resolved === "object") return resolved as MaterialLike;
    return { color: "#cccccc", opacity: 0.9 };
  }, [(obj as any)?.material]);

  const isFocusActive =
    hasValidFocusedTarget &&
    focusMode !== "all" &&
    typeof focusedId === "string" &&
    focusedId.length > 0;
  const isFocused = isFocusActive && (focusedId === stableIdWithName || focusedId === stableId);
  const dimOthers = isFocusActive && !isFocused;
  const genericFocusDimmed = dimOthers;
  const defaultPos: [number, number, number] = [index * 1.8 - 1.8, 0, 0];
  const transformPos = toPosTuple((obj.transform as any)?.pos ?? (obj as any).position, defaultPos);

  const rawTransform = (obj as any).transform ?? {};
  const rawScale = rawTransform?.scale;
  const rawPos = rawTransform?.pos;

  const transform = {
    pos: toPosTuple(rawPos, transformPos),
    scale: (Array.isArray(rawScale) && rawScale.length >= 3 ? rawScale : [1, 1, 1]) as [number, number, number],
    rot: rawTransform?.rot,
  };

  const baseScale = useMemo(() => transform.scale, [transform.scale]);
  const safeType = obj.type ?? "box";
  const overrideEntry = overrides[stableIdWithName] ?? overrides[stableId] ?? {};
  const ux = getUxForObject?.(stableIdWithName) ?? getUxForObject?.(stableId) ?? null;
  const uxOverrides = objectUxById?.[stableIdWithName] ?? objectUxById?.[stableId] ?? {};
  const overrideScale = overrideEntry.scale;
  const originalUniform =
    Array.isArray(transform.scale) && transform.scale.length > 0 ? Number(transform.scale[0]) || 1 : 1;
  const uxScale = typeof uxOverrides.scale === "number" ? clamp(uxOverrides.scale, 0.5, 2.0) : 1;
  const preExecutiveUniform = clamp(originalUniform * (overrideScale ?? 1) * uxScale * (globalScale ?? 1), 0.15, 2.0);
  const ambientPhase = useMemo(() => hashIdToUnit(String(stableIdWithName)) * Math.PI * 2, [stableIdWithName]);
  const shape = resolveGeometryKindForObject({
    obj,
    explicitShape: (obj as any).shape ?? ux?.shape,
    fallbackType: safeType,
    profile: visualProfile,
  });

  const finalPosition = overrideEntry.position ?? transformPos ?? [0, 0, 0];
  const finalRotation = overrideEntry.rotation ?? (transform as any).rot ?? [0, 0, 0];
  const finalColorOverride = overrideEntry.color;
  const finalVisible = overrideEntry.visible ?? true;
  const selectedIdCtx = useSelectedId();
  const workspaceViewMode = useSyncExternalStore(
    subscribeWorkspaceViewMode,
    getWorkspaceViewMode,
    getWorkspaceViewModeServerSnapshot
  );
  const isSelected = selectedIdCtx === stableIdWithName || selectedIdCtx === stableId;
  const executiveFocus = useMemo(
    () =>
      resolveExecutiveFocusWorkspaceState({
        objectId: stableIdWithName,
        selectedObjectId: selectedIdCtx,
        focusedObjectId: focusedId,
        relatedObjectIds: neighborIds,
      }),
    [focusedId, neighborIds, selectedIdCtx, stableIdWithName]
  );
  const adaptiveLabel = useMemo(
    () =>
      resolveWorkspaceLabelState(workspaceViewMode, {
        objectCount: sceneObjectCount,
        selected: isSelected,
        focused: isFocused,
        forceMode: executiveFocus.labelModeOverride,
      }),
    [executiveFocus.labelModeOverride, isFocused, isSelected, sceneObjectCount, workspaceViewMode]
  );
  const labelReduction = useMemo(
    () =>
      resolveExecutiveLabelReduction({
        objectCount: sceneObjectCount,
        selected: isSelected,
        focused: isFocused,
        isCritical: isSelected || isFocused,
        isHighRisk: Boolean(obj.scanner_severity && obj.scanner_severity !== "low"),
        isConnected: neighborIds.length > 0,
      }),
    [isFocused, isSelected, neighborIds.length, obj.scanner_severity, sceneObjectCount]
  );
  const effectiveLabel = useMemo(
    () => ({
      showPrimary: adaptiveLabel.showPrimary && labelReduction.visible,
      showSecondary: adaptiveLabel.showSecondary && labelReduction.showSecondary,
      showIcon: adaptiveLabel.showIcon && labelReduction.showIcon,
      opacity: adaptiveLabel.opacity * labelReduction.opacity,
      fontSizePx: adaptiveLabel.fontSizePx,
      maxLines: adaptiveLabel.maxLines,
      billboard: adaptiveLabel.billboard,
    }),
    [adaptiveLabel, labelReduction]
  );
  const executiveScaleSignature = [
    stableIdWithName,
    isSelected ? 1 : 0,
    sceneObjectCount,
    roundScaleInput(globalScale ?? 1),
    roundScaleInput(executiveFocus.scaleMultiplier),
    roundScaleInput(typeof overrideScale === "number" ? overrideScale : 1),
    roundScaleInput(uxScale),
  ].join(":");
  const executiveScaleInput = holdStableScaleInput(
    stableExecutiveScaleInputRef,
    executiveScaleSignature,
    preExecutiveUniform * executiveFocus.scaleMultiplier,
    Number.POSITIVE_INFINITY
  );
  const finalUniform = useMemo(
    () =>
      normalizeExecutiveObjectScale({
        objectId: stableIdWithName,
        scale: executiveScaleInput,
        selected: isSelected,
        objectCount: sceneObjectCount,
      }),
    [executiveScaleInput, isSelected, sceneObjectCount, stableIdWithName]
  );
  const focusScaleMul = isFocused
    ? 1.08 * executiveFocus.scaleMultiplier
    : dimOthers
      ? 0.92 * executiveFocus.scaleMultiplier
      : executiveFocus.scaleMultiplier;

  const scannerTargetIdSet = useMemo(
    () => new Set((Array.isArray(scannerTargetIds) ? scannerTargetIds : []).map((id) => String(id))),
    [scannerTargetIds]
  );
  const scannerDimRequested = scannerSceneActive && scannerTargetIdSet.size > 0;
  const scannerReason = compactScannerReason(obj.scanner_reason);
  const isLowFragilityScan = scannerSceneActive && scannerFragilityScore <= 0.1;
  const isPinned = focusMode === "pinned" && isFocused;
  const scannerTargetMatch =
    scannerSceneActive &&
    (scannerTargetIdSet.has(stableIdWithName) || scannerTargetIdSet.has(stableId));
  const scannerPrimaryTargetMatch =
    scannerSceneActive &&
    !!resolvedPrimaryRenderId &&
    (resolvedPrimaryRenderId === stableIdWithName || resolvedPrimaryRenderId === stableId);

  const scannerCausality = useMemo(
    () =>
      resolveScannerCausalityRole({
        scannerSceneActive,
        scannerPrimaryTargetId,
        scannerTargetIds: Array.from(scannerTargetIdSet),
        affectedTargetIds,
        contextTargetIds,
        riskSourceIds,
        riskTargetIds,
        currentObjectIds: [stableIdWithName, stableId],
      }),
    [
      affectedTargetIds,
      contextTargetIds,
      riskSourceIds,
      riskTargetIds,
      scannerPrimaryTargetId,
      scannerSceneActive,
      scannerTargetIdSet,
      stableId,
      stableIdWithName,
    ]
  );

  const scannerPolicy = useMemo(
    () =>
      resolveScannerVisualPriority({
        scannerSceneActive,
        causalRole: scannerCausality.role,
        isFocused,
        isSelected,
        isPinned,
        dimUnrelatedObjects: scannerDimRequested,
        scannerFragilityScore,
        scannerHighlighted: scannerTargetMatch,
        scannerFocused: scannerPrimaryTargetMatch,
      }),
    [
      isFocused,
      isPinned,
      isSelected,
      scannerCausality.role,
      scannerDimRequested,
      scannerFragilityScore,
      scannerSceneActive,
      scannerPrimaryTargetMatch,
      scannerTargetMatch,
    ]
  );
  const scannerEmphasis = Math.min(1, Math.max(0, typeof obj.scanner_emphasis === "number" ? obj.scanner_emphasis : 0));
  const calmSeverityVisual = useMemo(
    () => getCalmSeverityVisual(obj.scanner_severity),
    [obj.scanner_severity]
  );
  const derivedVisualState = useMemo(
    () =>
      deriveAnimatableVisualState({
        stableId,
        stableIdWithName,
        hoveredId,
        hoveredInteractionRole,
        neighborIds,
        attentionMemoryStrength,
        narrativeFocusStrength,
        narrativeFocusRole,
        simulationStrength,
        isSimulationSource,
        decisionPathStrength,
        decisionPathRole,
        decisionPathVisualHints,
        isDecisionPathSource,
        scannerSceneActive,
        scannerFragilityScore,
        scannerTargetIdSet,
        resolvedPrimaryRenderId,
        labelOwnerId,
        scannerPolicy,
        scannerCausalityRole: scannerCausality.role,
        isFocused,
        isSelected,
        isPinned,
        isLowFragilityScan,
        scannerEmphasis,
        scannerSeverity: obj.scanner_severity,
        theme: theme ?? "night",
        scannerStoryReveal,
        objType: obj.type,
        motionCalm,
      }),
    [
      attentionMemoryStrength,
      motionCalm,
      decisionPathRole,
      decisionPathStrength,
      decisionPathVisualHints,
      hoveredId,
      hoveredInteractionRole,
      isDecisionPathSource,
      isFocused,
      isLowFragilityScan,
      isPinned,
      isSelected,
      isSimulationSource,
      labelOwnerId,
      narrativeFocusRole,
      narrativeFocusStrength,
      neighborIds,
      obj.scanner_severity,
      obj.type,
      resolvedPrimaryRenderId,
      scannerCausality.role,
      scannerEmphasis,
      scannerFragilityScore,
      scannerPolicy,
      scannerSceneActive,
      scannerStoryReveal,
      scannerTargetIdSet,
      simulationStrength,
      stableId,
      stableIdWithName,
      theme,
    ]
  );
  const {
    isScannerTarget,
    isScannerPrimaryTarget,
    isScannerLabelOwner,
    scannerHighlighted,
    scannerFocused,
    visualState,
    scannerBackgroundDimmed,
    showCalmScannerConfirmation,
    scannerColor,
    scannerHierarchyRole,
    interactionRole,
    interactionProfile,
    isHovered,
    neighborDimFactor,
    passiveAttentionMemoryStrength,
    decisionSimulationStrength,
    narrativeNodeStyle,
    simulationNodeStyle,
    roleMotionProfile,
    roleLayoutProfile,
    nodeStoryReveal,
    nodeStoryEmphasis,
    scannerHaloVisible,
  } = derivedVisualState;

  /** Freeze story/hover/attention/neighbor ramps for material math so opacity/emissive don't oscillate every frame. */
  const materialStoryReveal = CALM_MODE ? 1 : nodeStoryReveal;
  const materialNeighborDim = CALM_MODE ? 1 : neighborDimFactor;
  const materialPassiveAttention = CALM_MODE ? 0 : passiveAttentionMemoryStrength;

  const color = useMemo(() => {
    const materialColor = material.color ?? ux?.base_color ?? "#cccccc";
    if (materialColor !== "auto") return materialColor;
    return computeAutoColor(tags, stateVector);
  }, [material.color, tags, stateVector, ux?.base_color]);

  const appliedColor = useMemo(() => {
    const base = finalColorOverride ?? color;
    const resolved = new THREE.Color(base);
    if (visualRole === "risk") {
      resolved.lerp(new THREE.Color(tokens.design.colors.pressure), 0.16);
    } else if (visualRole === "core") {
      resolved.multiplyScalar(theme === "day" ? 1.05 : 1.08);
    } else if (visualRole === "background") {
      resolved.multiplyScalar(theme === "day" ? 0.82 : 0.72);
    } else if (visualRole === "strategic") {
      resolved.lerp(new THREE.Color(tokens.design.colors.strategic), 0.1);
    }
    if (
      scannerPolicy.colorMode === "scanner_primary" ||
      scannerPolicy.colorMode === "scanner_affected" ||
      scannerPolicy.colorMode === "scanner_related"
    ) {
      const resolvedScannerColor = severityToScannerColor(obj.scanner_severity, theme ?? "night");
      const blend =
        scannerPolicy.colorMode === "scanner_primary"
          ? 0.52
          : scannerPolicy.colorMode === "scanner_affected"
          ? 0.28
          : scannerPolicy.colorMode === "scanner_related"
          ? 0.18
          : isLowFragilityScan
          ? 0.08
          : 0.26;
      const brightMul =
        scannerPolicy.colorMode === "scanner_primary"
          ? 1.18
          : scannerPolicy.colorMode === "scanner_affected"
          ? 1.06
          : scannerPolicy.colorMode === "scanner_related"
          ? 1.03
          : isLowFragilityScan
          ? 1.02
          : 1.05;
      resolved.lerp(new THREE.Color(resolvedScannerColor), blend);
      resolved.multiplyScalar(brightMul);
    }
    if (!genericFocusDimmed && !scannerBackgroundDimmed) return `#${resolved.getHexString()}`;
    if (scannerPolicy.colorMode === "shadowed") {
      resolved.lerp(new THREE.Color(theme === "day" ? "#6b7280" : "#64748b"), theme === "day" ? 0.58 : 0.52);
    }
    const multiplier = scannerBackgroundDimmed ? (theme === "day" ? 0.8 : 0.66) : theme === "day" ? 0.35 : 0.55;
    resolved.multiplyScalar(multiplier);
    return `#${resolved.getHexString()}`;
  }, [
    color,
    finalColorOverride,
    genericFocusDimmed,
    isLowFragilityScan,
    obj.scanner_severity,
    scannerBackgroundDimmed,
    scannerPolicy.colorMode,
    theme,
    tokens.design.colors.pressure,
    tokens.design.colors.strategic,
    visualRole,
  ]);

  const handleSelect = (event: any) => {
    setHovered(false);
    setHoveredId?.(null);
    event.stopPropagation();
    event.nativeEvent?.stopImmediatePropagation?.();
    if (selectedIdCtx === stableIdWithName || selectedIdCtx === stableId) {
      return;
    }
    setSelectedId(stableIdWithName);
  };

  const resolveDragPosition = (event: any): { x: number; y: number; z: number } | null => {
    const dragState = dragStateRef.current;
    if (!dragState || !event.ray) return null;
    const point = event.ray.intersectPlane(dragPlaneRef.current, dragPointRef.current);
    if (!point) return null;
    const parentScale = Number.isFinite(sceneScale) && sceneScale > 0 ? sceneScale : 1;
    return {
      x: point.x / parentScale,
      y: dragState.y,
      z: point.z / parentScale,
    };
  };

  const handleObjectPointerDown = (event: any) => {
    event.stopPropagation();
    event.nativeEvent?.stopImmediatePropagation?.();
    if (event.button != null && event.button !== 0) return;
    setHovered(false);
    setHoveredId?.(null);
    if (selectedIdCtx !== stableIdWithName && selectedIdCtx !== stableId) {
      setSelectedId(stableIdWithName);
    }
    const y = finalPosition[1] ?? 0;
    dragStateRef.current = {
      pointerId: event.pointerId ?? 0,
      y,
      hasMoved: false,
    };
    dragPlaneRef.current.set(new THREE.Vector3(0, 1, 0), -y * (Number.isFinite(sceneScale) && sceneScale > 0 ? sceneScale : 1));
    event.target?.setPointerCapture?.(event.pointerId);
  };

  const handleObjectPointerMove = (event: any) => {
    if (!dragStateRef.current) return;
    event.stopPropagation();
    event.nativeEvent?.stopImmediatePropagation?.();
    const next = resolveDragPosition(event);
    if (!next) return;
    dragStateRef.current.hasMoved = true;
    onObjectPositionChange?.(stableIdWithName, next, "drag");
  };

  const handleObjectPointerUp = (event: any) => {
    const dragState = dragStateRef.current;
    if (!dragState) return;
    event.stopPropagation();
    event.nativeEvent?.stopImmediatePropagation?.();
    const next = resolveDragPosition(event);
    dragStateRef.current = null;
    event.target?.releasePointerCapture?.(event.pointerId);
    if (next && dragState.hasMoved) {
      onObjectPositionChange?.(stableIdWithName, next, "move");
    }
  };

  const stopPointerOnly = (event: any) => {
    event.stopPropagation();
    event.nativeEvent?.stopImmediatePropagation?.();
  };

  const materialProps = useMemo(
    () => ({
      color: appliedColor,
      transparent: true,
      opacity: (() => {
        const uxOpacity = typeof uxOverrides.opacity === "number" ? clamp(uxOverrides.opacity, 0.1, 1) : 1;
        const baseOpacity = material.opacity ?? 0.9;
        const adjusted = baseOpacity * uxOpacity * hierarchyStyle.opacityMul;
        if (scannerBackgroundDimmed) {
          const softShadowFloor = theme === "day" ? 0.58 : 0.5;
          return Math.max(Math.min(adjusted, softShadowFloor), theme === "day" ? 0.5 : 0.4);
        }
        if (!isFocusActive || !genericFocusDimmed) return adjusted;
        return theme === "day" ? Math.min(adjusted, 0.3) : Math.min(adjusted, 0.24);
      })(),
      emissive: material.emissive,
      emissiveIntensity: material.emissiveIntensity,
    }),
    [
      appliedColor,
      genericFocusDimmed,
      hierarchyStyle.opacityMul,
      isFocusActive,
      material.emissive,
      material.emissiveIntensity,
      material.opacity,
      scannerBackgroundDimmed,
      theme,
      uxOverrides.opacity,
    ]
  );

  const baseOpacity = materialProps.opacity ?? 0.9;
  const focusedOpacity = typeof uxOverrides.opacity === "number" ? clamp(uxOverrides.opacity, 0.1, 1) : 1.0;
  const hoveredOpacity =
    !CALM_MODE && isHovered && !isFocused && !isSelected
      ? Math.min(1, baseOpacity + tokens.interaction.hoverOpacityBoost + interactionProfile.opacityBoost)
      : baseOpacity;
  const scannerOpacity = showCalmScannerConfirmation
    ? Math.max(baseOpacity, 0.96)
    : scannerPolicy.colorMode === "shadowed"
    ? Math.max(baseOpacity, theme === "day" ? 0.48 : 0.4)
    : hoveredOpacity;
  const finalOpacity =
    scannerPolicy.rank === "primary"
      ? Math.max(scannerOpacity, 0.98)
      : scannerPolicy.rank === "secondary"
      ? Math.max(baseOpacity * Math.min(scannerPolicy.opacityMultiplier, 0.88), theme === "day" ? 0.56 : 0.5)
      : visualState.isHighlighted
      ? Math.max(scannerOpacity, 0.72)
      : visualState.isFocused || visualState.isSelected || visualState.isPinned
      ? Math.max(focusedOpacity, 0.92)
      : scannerBackgroundDimmed
      ? baseOpacity
      : genericFocusDimmed
      ? Math.min(baseOpacity, calmSeverityVisual.dimOpacity)
      : scannerOpacity;
  const storyAdjustedOpacity =
    scannerSceneActive && scannerHierarchyRole !== "neutral"
      ? Math.min(1, finalOpacity * (0.9 + materialStoryReveal * 0.1))
      : finalOpacity;
  const interactionAdjustedOpacity = clamp(storyAdjustedOpacity * materialNeighborDim, 0.08, 1);
  const narrativeAdjustedOpacity = clamp(
    interactionAdjustedOpacity * narrativeNodeStyle.opacityMul + narrativeNodeStyle.opacityBoost,
    0.08,
    1
  );
  const simulationAdjustedOpacity = clamp(narrativeAdjustedOpacity + simulationNodeStyle.opacityBoost, 0.08, 1);
  const memoryAdjustedOpacity = clamp(simulationAdjustedOpacity + materialPassiveAttention * 0.05, 0.08, 1);
  const executiveAdjustedOpacity = clamp(memoryAdjustedOpacity * executiveFocus.opacity, 0.08, 1);

  const baseEmissiveIntensity = materialProps.emissiveIntensity ?? 0;
  const focusEmissiveBoost = isFocused
    ? Math.max(0.85, baseEmissiveIntensity + tokens.interaction.focusGlow)
    : Math.max(0, baseEmissiveIntensity + hierarchyStyle.emissiveBoost);
  const scannerGlowBoost =
    scannerPolicy.rank === "primary"
      ? scannerPolicy.emissiveBoost + scannerEmphasis * 2.35
      : scannerPolicy.rank === "secondary"
      ? scannerPolicy.emissiveBoost + scannerEmphasis * 0.62
      : scannerHighlighted
      ? Math.max(0.12, scannerEmphasis * 0.18)
      : 0;

  const selectionHighlight = useMemo(
    () =>
      resolveExecutiveObjectSelectionHighlight({
        selected: isSelected,
        focused: isFocused,
        theme: theme === "day" ? "day" : "night",
      }),
    [isFocused, isSelected, theme]
  );
  const nameDensityProfile = useMemo(
    () => resolveObjectNameDensityProfile(sceneObjectCount),
    [sceneObjectCount]
  );

  const finalEmissiveIntensity =
    scannerPolicy.colorMode === "shadowed"
      ? 0
      : visualState.isProtectedFromDim
      ? Math.max(focusEmissiveBoost, scannerGlowBoost)
      : scannerBackgroundDimmed
      ? 0
      : genericFocusDimmed
      ? 0
      : Math.max(focusEmissiveBoost, scannerGlowBoost);
  const selectedBoost = isSelected ? Math.max(tokens.interaction.selectionGlow, baseEmissiveIntensity) : baseEmissiveIntensity;
  const hoveredBoost =
    !CALM_MODE && hovered && !isSelected && !isFocused
      ? Math.max(baseEmissiveIntensity + tokens.interaction.hoverIntensity, baseEmissiveIntensity)
      : baseEmissiveIntensity;
  const effectiveEmissiveIntensity =
    visualState.isProtectedFromDim
      ? scannerPolicy.rank === "primary"
        ? Math.max(finalEmissiveIntensity, selectedBoost, hoveredBoost)
        : Math.max(finalEmissiveIntensity, selectedBoost * 0.55, hoveredBoost * 0.55)
      : scannerBackgroundDimmed
      ? 0
      : Math.max(finalEmissiveIntensity, selectedBoost, hoveredBoost);
  const storyAdjustedEmissiveIntensity =
    scannerSceneActive && scannerHierarchyRole !== "neutral"
      ? effectiveEmissiveIntensity * (0.74 + materialStoryReveal * 0.26)
      : effectiveEmissiveIntensity;
  const storyPlusHoverEmissive = CALM_MODE
    ? storyAdjustedEmissiveIntensity
    : isHovered
      ? storyAdjustedEmissiveIntensity + interactionProfile.emissiveBoost
      : storyAdjustedEmissiveIntensity;
  const interactionAdjustedEmissiveIntensity = Math.max(0, storyPlusHoverEmissive * materialNeighborDim);
  const narrativeAdjustedEmissiveIntensity = interactionAdjustedEmissiveIntensity + narrativeNodeStyle.emissiveBoost;
  const simulationAdjustedEmissiveIntensity = narrativeAdjustedEmissiveIntensity + simulationNodeStyle.emissiveBoost;
  const memoryAdjustedEmissiveIntensity = simulationAdjustedEmissiveIntensity + materialPassiveAttention * 0.12;
  const warRoomSeverity = normalizeScannerLabelSeverity(obj.scanner_severity, scannerFragilityScore);
  const warRoomEmissiveMul =
    warRoomSeverity === "critical" || warRoomSeverity === "high"
      ? 1.14
      : warRoomSeverity === "low"
        ? 0.9
        : 1;
  const warRoomAdjustedEmissiveIntensity = memoryAdjustedEmissiveIntensity * warRoomEmissiveMul;

  const rawMeshEmissiveIntensity = isFocused
    ? Math.max(
        calmSeverityVisual.glowStrength,
        (materialProps.emissiveIntensity ?? 0) +
          calmSeverityVisual.outlineStrength * (theme === "day" ? 0.35 : 0.55)
      )
    : isSelected
      ? Math.max(calmSeverityVisual.glowStrength, materialProps.emissiveIntensity ?? 0)
      : Math.max(warRoomAdjustedEmissiveIntensity, calmSeverityVisual.glowStrength);

  const committedMeshOpacity = roundMaterialScalar(executiveAdjustedOpacity);
  const committedMeshEmissiveIntensity = roundMaterialScalar(rawMeshEmissiveIntensity);
  const committedMeshEmissiveHex = isFocused
    ? "#ffffff"
    : isSelected
      ? "#ffffff"
      : scannerHighlighted
        ? scannerColor
        : (materialProps.emissive as string | undefined) ?? "#000000";

  const materialSignature = useMemo(
    () =>
      JSON.stringify({
        id: stableIdWithName,
        opacity: committedMeshOpacity,
        emissiveIntensity: committedMeshEmissiveIntensity,
        color: appliedColor,
        emissive: committedMeshEmissiveHex,
        severity: warRoomSeverity ?? "none",
      }),
    [
      appliedColor,
      committedMeshEmissiveHex,
      committedMeshEmissiveIntensity,
      committedMeshOpacity,
      stableIdWithName,
      warRoomSeverity,
    ]
  );

  // Visual-only effect. Must not emit semantic propagation or scene state changes.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (typeof window !== "undefined" && (window as any).__NEXORA_ALLOW_MATERIAL_WRITE__) {
      console.error("[Nexora][VIOLATION] Material attempted state write");
    }
    if (loggedObjectMaterialSignatures.get(stableIdWithName) === materialSignature) return;
    if (shouldSuppressIdleDebugLog(`[Nexora][ObjectMaterialChanged]:${stableIdWithName}:${materialSignature}`)) return;
    loggedObjectMaterialSignatures.set(stableIdWithName, materialSignature);
    console.debug("[Nexora][ObjectMaterialChanged]", {
      objectId: stableIdWithName,
      materialSig: materialSignature,
    });
  }, [appliedColor, committedMeshEmissiveHex, committedMeshEmissiveIntensity, committedMeshOpacity, materialSignature, stableIdWithName, warRoomSeverity]);

  useEffect(() => {
    traceScannerCausalityRole(
      stableIdWithName,
      {
        scannerSceneActive,
        scannerPrimaryTargetId,
        scannerTargetIds: Array.from(scannerTargetIdSet),
        affectedTargetIds,
        contextTargetIds,
        riskSourceIds,
        riskTargetIds,
        currentObjectIds: [stableIdWithName, stableId],
      },
      scannerCausality
    );
  }, [
    affectedTargetIds,
    contextTargetIds,
    riskSourceIds,
    riskTargetIds,
    scannerCausality,
    scannerPrimaryTargetId,
    scannerSceneActive,
    scannerTargetIdSet,
    stableId,
    stableIdWithName,
  ]);

  useEffect(() => {
    traceScannerVisualPriorityPolicy(
      stableIdWithName,
      {
        scannerSceneActive,
        causalRole: scannerCausality.role,
        isFocused,
        isSelected,
        isPinned,
        dimUnrelatedObjects: scannerDimRequested,
        scannerFragilityScore,
        scannerHighlighted,
        scannerFocused,
      },
      scannerPolicy
    );
  }, [
    isFocused,
    isPinned,
    isSelected,
    scannerCausality.role,
    scannerDimRequested,
    scannerFocused,
    scannerFragilityScore,
    scannerPolicy,
    scannerSceneActive,
    stableIdWithName,
  ]);

  useEffect(() => {
    if (
      !visualState.isHighlighted &&
      !visualState.isFocused &&
      !visualState.isSelected &&
      !visualState.isPinned &&
      !scannerBackgroundDimmed
    ) {
      return;
    }

    traceHighlightFlow("scene_object_state", {
      objectId: stableIdWithName,
      isHighlighted: visualState.isHighlighted,
      isFocused: visualState.isFocused,
      isSelected: visualState.isSelected,
      isPinned: visualState.isPinned,
      causalRole: scannerCausality.role,
      scannerRank: scannerPolicy.rank,
      isProtectedFromDim: visualState.isProtectedFromDim,
      dimUnrelatedObjects: scannerDimRequested,
      scannerBackgroundDimmed,
      opacity: committedMeshOpacity,
      emissiveIntensity: committedMeshEmissiveIntensity,
      severity: warRoomSeverity ?? "none",
    });
  }, [
    committedMeshEmissiveIntensity,
    committedMeshOpacity,
    scannerBackgroundDimmed,
    scannerCausality.role,
    scannerDimRequested,
    scannerPolicy.rank,
    stableIdWithName,
    visualState.isFocused,
    visualState.isHighlighted,
    visualState.isPinned,
    visualState.isProtectedFromDim,
    visualState.isSelected,
    warRoomSeverity,
  ]);

  const pointsData = ((obj as any).data?.points ?? null) as number[][] | null;
  const pointsCount = Array.isArray(pointsData) ? pointsData.length : 0;
  const pathData = ((obj as any).data?.path ?? null) as number[][] | null;
  const pathCount = Array.isArray(pathData) ? pathData.length : 0;

  const pointPositions = useMemo(() => {
    if (obj.type !== "points_cloud") return null;
    const points = (pointsData ?? []) as number[][];
    const flat = new Float32Array(points.length * 3);
    points.forEach((point, index) => {
      const offset = index * 3;
      flat[offset] = point?.[0] ?? 0;
      flat[offset + 1] = point?.[1] ?? 0;
      flat[offset + 2] = point?.[2] ?? 0;
    });
    return flat;
  }, [obj.type, pointsCount, pointsData]);

  const pathCurvePoints = useMemo(() => {
    if (obj.type !== "line_path") return null;
    const points = (pathData ?? []) as number[][];
    return points.map((point) => new THREE.Vector3(point?.[0] ?? 0, point?.[1] ?? 0, point?.[2] ?? 0));
  }, [obj.type, pathCount, pathData]);

  const pointsGeometry = useMemo(() => {
    if (obj.type !== "points_cloud") return null;
    const geometry = new THREE.BufferGeometry();
    if (pointPositions) {
      geometry.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
    }
    return geometry;
  }, [obj.type, pointPositions]);

  const lineGeometry = useMemo(() => {
    if (obj.type !== "line_path") return null;
    const flat = new Float32Array((pathCurvePoints ?? []).length * 3);
    pathCurvePoints?.forEach((point, index) => {
      const offset = index * 3;
      flat[offset] = point.x;
      flat[offset + 1] = point.y;
      flat[offset + 2] = point.z;
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(flat, 3));
    return geometry;
  }, [obj.type, pathCurvePoints]);

  const tubeGeometry = useMemo(() => {
    if (obj.type !== "line_path") return null;
    if (!pathCurvePoints || pathCurvePoints.length < 2) return null;
    const curve = new THREE.CatmullRomCurve3(pathCurvePoints);
    return new THREE.TubeGeometry(curve, Math.min(200, Math.max(20, pathCurvePoints.length * 4)), 0.12, 8, false);
  }, [obj.type, pathCurvePoints]);

  useEffect(() => {
    return () => {
      pointsGeometry?.dispose();
      lineGeometry?.dispose();
      tubeGeometry?.dispose();
    };
  }, [lineGeometry, pointsGeometry, tubeGeometry]);

  const calmScale = isSelected
    ? NEXORA_OBJECT_SELECTED_SCALE
    : isFocused
    ? NEXORA_OBJECT_FOCUSED_SCALE
    : NEXORA_OBJECT_BASE_SCALE;
  const calmSelectionScale = calmScale;
  const staticPosition = useMemo<[number, number, number]>(
    () => [finalPosition[0] ?? 0, finalPosition[1] ?? 0, finalPosition[2] ?? 0],
    [finalPosition]
  );
  const staticRotation = useMemo<[number, number, number]>(() => [0, 0, 0], []);
  const staticScale = useMemo(() => calmScale, [calmScale]);
  const motionState = useMemo(
    () =>
      buildAnimatableMotionState({
        objType: obj.type,
        hierarchyAmbientMul: hierarchyStyle.ambientMul,
        hierarchyScaleMul: isFocused || isSelected ? 1 : hierarchyStyle.scaleMul,
        roleMotionProfile,
        roleLayoutProfile,
        scannerBackgroundDimmed,
        showCalmScannerConfirmation,
        scannerEmphasis,
        scannerRank: scannerPolicy.rank,
        scannerScaleMultiplier: scannerPolicy.scaleMultiplier,
        visualState,
        scannerSceneActive,
        nodeStoryReveal,
        nodeStoryEmphasis,
        interactionProfile,
        narrativeNodeStyle,
        simulationNodeStyle,
        passiveAttentionMemoryStrength,
        interactionRole,
        isSelected,
        isHovered,
        isSimulationSource,
        isDecisionPathSource,
        decisionSimulationStrength,
        ambientPhase,
        decisionCenter,
        finalPosition,
        focusScaleMul,
        isFocused,
        scannerHighlighted,
        scannerFocused,
        isLowFragilityScan,
        sceneIdleSway: tokens.motion.sceneIdleSway,
        motionCalm: CALM_MODE ? true : motionCalm,
      }),
    [
      ambientPhase,
      motionCalm,
      decisionCenter,
      decisionSimulationStrength,
      finalPosition,
      focusScaleMul,
      hierarchyStyle.ambientMul,
      hierarchyStyle.scaleMul,
      interactionProfile,
      interactionRole,
      isDecisionPathSource,
      isFocused,
      isHovered,
      isLowFragilityScan,
      isSelected,
      isSimulationSource,
      narrativeNodeStyle,
      nodeStoryEmphasis,
      nodeStoryReveal,
      obj.type,
      passiveAttentionMemoryStrength,
      roleLayoutProfile,
      roleMotionProfile,
      scannerBackgroundDimmed,
      scannerEmphasis,
      scannerFocused,
      scannerHighlighted,
      scannerPolicy.rank,
      scannerPolicy.scaleMultiplier,
      scannerSceneActive,
      showCalmScannerConfirmation,
      simulationNodeStyle,
      tokens.motion.sceneIdleSway,
      visualState,
    ]
  );
  const { scannerScaleMul } = motionState;
  const effectiveScannerScaleMul = CALM_MODE ? 1 : scannerScaleMul;
  const transformSignature = useMemo(
    () =>
      JSON.stringify({
        id: stableIdWithName,
        position: roundTransformTuple(STATIC_OBJECT_TRANSFORMS ? staticPosition : finalPosition),
        rotation: roundTransformTuple(STATIC_OBJECT_TRANSFORMS ? staticRotation : finalRotation),
        scale: roundTransformValue(
          STATIC_OBJECT_TRANSFORMS ? staticScale : finalUniform * effectiveScannerScaleMul * calmSelectionScale
        ),
      }),
    [
      calmScale,
      effectiveScannerScaleMul,
      finalPosition,
      finalRotation,
      finalUniform,
      stableIdWithName,
      staticPosition,
      staticRotation,
      staticScale,
    ]
  );
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (loggedObjectTransformSignatures.get(stableIdWithName) === transformSignature) return;
    if (shouldSuppressIdleDebugLog(`[Nexora][ObjectTransformChanged]:${stableIdWithName}:${transformSignature}`)) return;
    loggedObjectTransformSignatures.set(stableIdWithName, transformSignature);
    console.debug("[Nexora][ObjectTransformChanged]", {
      id: stableIdWithName,
      transformSignature,
    });
  }, [stableIdWithName, transformSignature]);

  useEffect(() => {
    const mesh = ref.current;
    if (mesh) {
      const appliedPosition = STATIC_OBJECT_TRANSFORMS ? staticPosition : finalPosition;
      const appliedRotation = STATIC_OBJECT_TRANSFORMS ? staticRotation : finalRotation;
      mesh.position.set(appliedPosition[0] ?? 0, appliedPosition[1] ?? 0, appliedPosition[2] ?? 0);
      mesh.rotation.set(appliedRotation[0] ?? 0, appliedRotation[1] ?? 0, appliedRotation[2] ?? 0);
      const resolvedScale = STATIC_OBJECT_TRANSFORMS
        ? staticScale
        : CALM_MODE
        ? finalUniform * calmScale
        : finalUniform * effectiveScannerScaleMul * calmSelectionScale * tokens.interaction.sceneObjectEmphasis;
      if (STATIC_OBJECT_TRANSFORMS) {
        mesh.scale.set(resolvedScale, resolvedScale, resolvedScale);
      } else {
        mesh.scale.set(
          (baseScale[0] ?? 1) * resolvedScale,
          (baseScale[1] ?? 1) * resolvedScale,
          (baseScale[2] ?? 1) * resolvedScale
        );
      }
    }
  }, [
    baseScale,
    calmScale,
    finalPosition,
    finalRotation,
    finalUniform,
    effectiveScannerScaleMul,
    staticPosition,
    staticRotation,
    staticScale,
    tokens.interaction.sceneObjectEmphasis,
  ]);
  const finalObjectScale = STATIC_OBJECT_TRANSFORMS ? staticScale : finalUniform * calmScale;
  const roundedFinalObjectScale = Math.round(finalObjectScale * 100) / 100;
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (loggedFinalObjectScaleBuckets.get(stableIdWithName) === roundedFinalObjectScale) return;
    if (shouldSuppressIdleDebugLog(`[Nexora][FinalObjectScale]:${stableIdWithName}:${roundedFinalObjectScale}`)) return;
    loggedFinalObjectScaleBuckets.set(stableIdWithName, roundedFinalObjectScale);
    console.debug("[Nexora][FinalObjectScale]", {
      id: stableIdWithName,
      scale: roundedFinalObjectScale,
    });
  }, [roundedFinalObjectScale, stableIdWithName]);

  let node: React.ReactNode = null;
  if (obj.type === "points_cloud" && pointsGeometry) {
    node = (
      <group>
        <mesh
          onPointerDown={stopPointerOnly}
          onClick={handleSelect}
          onPointerOver={(event) => {
            event.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => {
            setHovered(false);
          }}
        >
          <sphereGeometry args={[1.25, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <points
          geometry={pointsGeometry}
          onPointerDown={stopPointerOnly}
          onClick={handleSelect}
          onPointerOver={(event) => {
            event.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => {
            setHovered(false);
          }}
        >
          <pointsMaterial
            color={appliedColor}
            size={((obj as any).material?.size as number | undefined) ?? 0.03}
            sizeAttenuation
            transparent
            opacity={materialProps.opacity ?? 0.85}
          />
        </points>
      </group>
    );
  } else if (obj.type === "line_path" && lineGeometry) {
    node = (
      <group>
        {tubeGeometry && (
          <mesh
            geometry={tubeGeometry}
            onPointerDown={stopPointerOnly}
            onClick={handleSelect}
            onPointerOver={(event: any) => {
              event.stopPropagation();
              setHovered(true);
            }}
            onPointerOut={() => {
              setHovered(false);
            }}
          >
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}

        <Line
          points={(pathData ?? []) as any}
          transparent
          opacity={materialProps.opacity ?? 0.9}
          color={appliedColor}
          onPointerDown={stopPointerOnly}
          onClick={handleSelect}
          onPointerOver={(event: any) => {
            event.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => {
            setHovered(false);
          }}
        />
      </group>
    );
  } else {
    const geometryNode = geometryFor(shape as GeometryKind);
    // Static mode: scale is owned by AnimatableObject group transform only.
    const meshScale = STATIC_OBJECT_TRANSFORMS
      ? [1, 1, 1]
      : Array.isArray(baseScale)
      ? (baseScale as any)
      : [baseScale ?? 1, baseScale ?? 1, baseScale ?? 1];

    const meshProps = {
      castShadow: !!shadowsEnabled,
      receiveShadow: !!shadowsEnabled,
      onPointerDown: handleObjectPointerDown,
      onPointerMove: handleObjectPointerMove,
      onPointerUp: handleObjectPointerUp,
      onPointerCancel: handleObjectPointerUp,
      onClick: handleSelect,
      onPointerOver: (event: any) => {
        event.stopPropagation();
        setHovered(true);
        setHoveredId?.(stableIdWithName);
      },
      onPointerOut: () => {
        setHovered(false);
        setHoveredId?.(null);
      },
      scale: meshScale,
    };

    node = (
      <>
        {scannerHaloVisible ? (
          <mesh
            rotation={[Math.PI / 2, 0, 0]}
            scale={[
              (meshScale?.[0] ?? 1) * (scannerFocused ? 1.72 : 1.58),
              (meshScale?.[1] ?? 1) * (scannerFocused ? 1.72 : 1.58),
              (meshScale?.[2] ?? 1) * (scannerFocused ? 1.72 : 1.58),
            ]}
          >
            <torusGeometry args={[0.88, 0.05, 14, 40]} />
            <meshStandardMaterial
              color={scannerColor}
              emissive={scannerColor}
              emissiveIntensity={scannerFocused ? 1.14 : 0.8}
              transparent
              opacity={scannerFocused ? 0.38 : 0.24}
            />
          </mesh>
        ) : null}
        {isFocused ? (
          <mesh
            {...(meshProps as any)}
            scale={[
              (meshScale?.[0] ?? 1) * 1.03,
              (meshScale?.[1] ?? 1) * 1.03,
              (meshScale?.[2] ?? 1) * 1.03,
            ]}
          >
            {geometryNode}
            <meshBasicMaterial
              color={theme === "day" ? "#111827" : "#ffffff"}
              transparent
              opacity={theme === "day" ? 0.1 : 0.06}
              wireframe
            />
          </mesh>
        ) : null}
        {selectionHighlight.showRing ? (
          <mesh
            rotation={[Math.PI / 2, 0, 0]}
            scale={[
              (meshScale?.[0] ?? 1) * selectionHighlight.ringScale,
              (meshScale?.[1] ?? 1) * selectionHighlight.ringScale,
              (meshScale?.[2] ?? 1) * selectionHighlight.ringScale,
            ]}
          >
            <torusGeometry args={[0.86, 0.035, 14, 48]} />
            <meshStandardMaterial
              color={tokens.design.colors.accent}
              emissive={tokens.design.colors.accent}
              emissiveIntensity={tokens.interaction.selectionGlow * selectionHighlight.outlineStrength}
              transparent
              opacity={selectionHighlight.ringOpacity}
            />
          </mesh>
        ) : null}

        <mesh {...(meshProps as any)}>
          {geometryNode}
          <meshStandardMaterial
            {...materialProps}
            color={appliedColor}
            emissive={committedMeshEmissiveHex}
            emissiveIntensity={committedMeshEmissiveIntensity}
            transparent
            opacity={committedMeshOpacity}
          />
        </mesh>
        <mesh
          {...(meshProps as any)}
          scale={[
            (meshScale?.[0] ?? 1) * 1.25,
            (meshScale?.[1] ?? 1) * 1.25,
            (meshScale?.[2] ?? 1) * 1.25,
          ]}
        >
          {geometryFor(shape as GeometryKind)}
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </>
    );
  }

  const captionText = ((overrideEntry.caption ?? "") as string).trim();
  const showCaption = overrideEntry.showCaption === true;
  const objectScaleY =
    (baseScale[1] ?? 1) * (STATIC_OBJECT_TRANSFORMS ? staticScale : finalUniform) * effectiveScannerScaleMul;
  const labelY = objectScaleY * 0.6 + 0.24;
  const iconY = Math.max(0.1, labelY * 0.24);
  const showExecutiveObjectName = shouldRenderExecutiveObjectName({
    profile: nameDensityProfile,
    selected: isSelected,
    focused: isFocused,
    index,
  });
  const executiveNameOpacity =
    resolveObjectNameOpacity({
      profile: nameDensityProfile,
      selected: isSelected,
      focused: isFocused,
    }) * executiveFocus.opacity;
  const executiveNameProfile = useMemo(
    () =>
      resolveObjectNameRenderingProfile({
        selected: isSelected || isFocused,
        fontSizePx: nameDensityProfile.fontSizePx,
      }),
    [isFocused, isSelected, nameDensityProfile.fontSizePx]
  );
  const executiveNamePlacement = useMemo(
    () =>
      resolveObjectLabelPlacement({
        baseScaleY: objectScaleY,
        objectScale: 1,
        profile: executiveNameProfile,
        index,
        objectCount: sceneObjectCount,
        relationshipDensity: neighborIds.length,
      }),
    [
      executiveNameProfile,
      index,
      neighborIds.length,
      objectScaleY,
      sceneObjectCount,
    ]
  );
  const executiveNameTheme = theme === "day" ? "day" : "night";
  const executiveNameStyle = executiveObjectNameLabelStyle({
    profile: executiveNameProfile,
    theme: executiveNameTheme,
    opacity: executiveNameOpacity,
    selected: selectionHighlight.labelEmphasis,
  });

  return (
    <group ref={ref} position={STATIC_OBJECT_TRANSFORMS ? staticPosition : finalPosition} visible={finalVisible}>
      {node}
      {objectIcon && effectiveLabel.showIcon ? (
        <Html position={[0, iconY, 0]} center transform={effectiveLabel.billboard} style={{ pointerEvents: "none" }}>
          <div
            aria-hidden="true"
            style={{
              width: 28,
              height: 28,
              display: "grid",
              placeItems: "center",
              borderRadius: "999px",
              background:
                theme === "day"
                  ? "radial-gradient(circle, rgba(255,255,255,0.88), rgba(255,255,255,0.22) 62%, rgba(255,255,255,0) 74%)"
                  : "radial-gradient(circle, rgba(15,23,42,0.52), rgba(15,23,42,0.18) 62%, rgba(15,23,42,0) 74%)",
              opacity: (dimOthers ? 0.36 : 0.82) * executiveFocus.opacity * effectiveLabel.opacity,
              filter:
                theme === "day"
                  ? "drop-shadow(0 0 5px rgba(15,23,42,0.28))"
                  : "drop-shadow(0 0 7px rgba(125,211,252,0.34))",
              transform: isFocused || isSelected ? "scale(1.08)" : "scale(1)",
              transition: "opacity 180ms ease, transform 180ms ease",
              userSelect: "none",
            }}
          >
            <img
              src={objectIcon.src}
              alt=""
              draggable={false}
              style={{
                width: 18,
                height: 18,
                display: "block",
                objectFit: "contain",
              }}
            />
          </div>
        </Html>
      ) : null}
      {showCaption && captionText.length > 0 && effectiveLabel.showSecondary ? (
        <Html position={[0, labelY, 0]} center transform={effectiveLabel.billboard} style={{ pointerEvents: "none" }}>
          <div
            style={{
              fontSize: effectiveLabel.fontSizePx || tokens.design.typography.sm,
              opacity: effectiveLabel.opacity,
              padding: `${tokens.design.spacing.xs}px ${tokens.design.spacing.sm}px`,
              background: tokens.theme === "day" ? "rgba(15,23,42,0.68)" : "rgba(0,0,0,0.55)",
              color: tokens.design.colors.textPrimary,
              borderRadius: tokens.design.radius.sm,
              whiteSpace: "nowrap",
            }}
          >
            {captionText}
          </div>
        </Html>
      ) : null}
      {showExecutiveObjectName ? (
        <Html
          position={[executiveNamePlacement.x, executiveNamePlacement.y, executiveNamePlacement.z]}
          center
          transform={effectiveLabel.billboard}
          style={{ pointerEvents: "none" }}
        >
          <div aria-hidden="true" style={executiveNameStyle}>
            {executiveObjectName}
          </div>
        </Html>
      ) : null}
    </group>
  );
}, areAnimatableObjectPropsEqual);
