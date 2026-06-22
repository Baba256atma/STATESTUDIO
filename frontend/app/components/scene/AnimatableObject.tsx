"use client";

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { Html, Line, useCursor } from "@react-three/drei";

import type { SceneObject } from "../../lib/sceneTypes";
import { useStateVector, useSetSelectedId, useOverrides } from "../SceneContext";
import { clamp } from "../../lib/sizeCommands";
import { normalizeExecutiveObjectScale } from "../../lib/scene/executiveSceneComposition";
import { isZoneLikeExecutiveObject } from "../../lib/scene/objectScaling/executiveTypeCScaleClamp";
import {
  geometryArgsFromBounds,
  resolveExecutiveNormalizedGeometry,
  type ExecutiveGeometryBounds,
} from "../../lib/scene/geometry/executiveRawGeometryClamp";
import {
  deriveExecutiveObjectImportanceTier,
  resolveExecutiveLabelScale,
} from "../../lib/scene/objectScaling";
import {
  resolveExecutiveFocusWorkspaceState,
} from "../../lib/scene/density";
import { resolveWorkspaceLabelState } from "../../lib/scene/workspaceLabelRenderingRuntime";
import { ObjectCaption } from "./ObjectCaption";
import { ObjectLabelBillboard } from "./ObjectLabelBillboard";
import {
  getWorkspaceViewMode,
  getWorkspaceViewModeServerSnapshot,
  subscribeWorkspaceViewMode,
} from "../../lib/workspace/workspaceViewModeRuntime";
import { classifyExecutiveObjectLayoutRole } from "../../lib/scene/composition/normalizeExecutiveObjectLayout";
import {
  deriveExecutiveObjectVisualCategory,
  resolveExecutiveGraphicsViewProfile,
  resolveExecutiveObjectMaterialPreset,
  resolveExecutiveVisualHierarchyTier,
} from "../../lib/scene/graphics/executiveGraphicsProfile";
import {
  clampExecutiveObjectFootprintScale,
  flattenExecutive2DGroupScale,
  resolveExecutiveViewModeScaleLimits,
} from "../../lib/scene/objectScaling/executiveObjectScaleGovernance";
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
  geometryForExecutiveNormalized,
  hashIdToUnit,
  normalizeScannerLabelSeverity,
  severityToScannerColor,
  toPosTuple,
  type InteractionRole,
  type NarrativeNodeRole,
  type ScannerStoryReveal,
} from "./sceneRenderUtils";
import { deriveAnimatableVisualState } from "./animatableObject/deriveAnimatableVisualState";
import { buildAnimatableMotionState } from "./animatableObject/buildAnimatableMotionState";
import { SvieRiskHotspotOverlay } from "./SvieRiskHotspotOverlay";
import { SvieCauseChainNodeHighlight } from "./SvieCauseChainNodeHighlight";
import { SvieRecommendationNodeHighlight } from "./SvieRecommendationNodeHighlight";
import { SvieConfidenceNodeHighlight } from "./SvieConfidenceNodeHighlight";
import { SvieExecutiveStoryNodeHighlight } from "./SvieExecutiveStoryNodeHighlight";
import { SvieFutureStateNodeHighlight } from "./SvieFutureStateNodeHighlight";
import { SvieScenarioDeltaNodeHighlight } from "./SvieScenarioDeltaNodeHighlight";
import { SvieScenarioImpactNodeHighlight } from "./SvieScenarioImpactNodeHighlight";
import { SvieScenarioComparisonNodeHighlight } from "./SvieScenarioComparisonNodeHighlight";
import { SvieScenarioConfidenceNodeHighlight } from "./SvieScenarioConfidenceNodeHighlight";
import { SvieExecutiveFutureStoryNodeHighlight } from "./SvieExecutiveFutureStoryNodeHighlight";
import { getCalmSeverityVisual } from "../../lib/scene/calmSeverityVisuals";
import { resolveSceneObjectIcon } from "../../lib/scene/objectIconMapping";
import { resolveExecutiveObjectName } from "../../lib/scene/executiveObjectNamingRuntime";
import {
  executiveObjectNameLabelStyle,
  resolveObjectNameRenderingProfile,
} from "../../lib/scene/objectNameRenderingProfile";
import { resolveExecutiveObjectSelectionHighlight } from "../../lib/scene/executiveObjectSelectionHighlight";
import { sanitizeThreeColor } from "../../lib/scene/threeColorSanitizer";
import { resolveExecutiveHoverAffordance } from "../../lib/scene/interaction/executiveRelationshipExplorationRuntime";
import {
  focusExecutiveObjectFromInteraction,
} from "../../lib/scene/interaction/executiveKeyboardNavigationRuntime";
import {
  logExecutiveInteractionSelection,
} from "../../lib/scene/interaction/executiveInteractionDiagnostics";
import { patchExecutiveInteractionState } from "../../lib/scene/interaction/executiveInteractionStateRuntime";
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
  buildObjectClickEventId,
  isNearestSelectableObjectHit,
  logObjectClickDiagnostic,
  resolveObjectSelectionHitProxyScale,
  tryAcceptPointerObjectSelection,
} from "../../lib/selection/nexoraObjectClickTransaction";
import {
  reportDuplicateSelectionOwner,
  reportObjectSelection,
  reportSelectionMiss,
} from "../../lib/selection/objectSelectionRuntimeContract";
import {
  logVisualSelectionAuthorityRejected,
  CANONICAL_VISUAL_SELECTION_SOURCE,
  logVisualSelectionLayerAudit,
} from "../../lib/selection/selectionStateGuard";
import {
  resolveObjectNameDensityProfile,
  resolveObjectNameOpacity,
  shouldRenderExecutiveObjectName,
} from "../../lib/scene/objectNameDensityProfile";

const disableMeshRaycast = () => null;

const DEFAULT_SCANNER_STORY_REVEAL = Object.freeze({
  primary: 1,
  edge: 1,
  affected: 1,
  context: 1,
});
const CALM_MODE = true;
const MAX_EXECUTIVE_RENDER_WIDTH = 1.8;
const MAX_EXECUTIVE_RENDER_HEIGHT = 0.9;
const MAX_EXECUTIVE_RENDER_DEPTH = 1.0;
const MAX_EXECUTIVE_OVERVIEW_RENDER_WIDTH = 1.35;
const MAX_EXECUTIVE_OVERVIEW_RENDER_HEIGHT = 0.65;
const MAX_EXECUTIVE_OVERVIEW_RENDER_DEPTH = 0.75;
const WIDE_EXECUTIVE_RENDER_SHAPES = new Set([
  "area",
  "bar",
  "capsule",
  "card",
  "flow",
  "panel",
  "plane",
  "rectangle",
  "region",
]);

function isWideExecutiveRenderShape(shape?: string | null): boolean {
  const key = String(shape ?? "").toLowerCase();
  return WIDE_EXECUTIVE_RENDER_SHAPES.has(key);
}

function clampExecutiveRenderedScale(input: {
  objectId: string;
  shape?: string | null;
  finalScale: number;
  viewMode?: ReturnType<typeof getWorkspaceViewMode>;
  selected?: boolean;
  focused?: boolean;
}): number {
  const rawScale = Number.isFinite(input.finalScale) ? input.finalScale : 1;
  const limits = resolveExecutiveViewModeScaleLimits(input.viewMode ?? "3D");
  const selectedOrFocused = input.selected === true || input.focused === true;
  const maxScale = selectedOrFocused ? limits.selectedMaxScale : limits.maxScale;
  let capped = Math.max(limits.minScale, Math.min(rawScale, maxScale));
  if (isWideExecutiveRenderShape(input.shape)) {
    capped = Math.min(capped, maxScale * (input.viewMode === "2D" ? 0.72 : 0.85));
  }
  return capped;
}

function shouldUseStaticObjectTransforms(input: {
  executiveLayoutActive: boolean;
  objectCount: number;
  layoutPositionsAvailable: boolean;
}): boolean {
  if (input.executiveLayoutActive && input.layoutPositionsAvailable && input.objectCount >= 1) {
    return false;
  }
  return true;
}

function readFiniteDimension(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function readExplicitExecutiveDimensions(object: unknown): Partial<ExecutiveGeometryBounds> | null {
  const record = object as Record<string, any> | null;
  if (!record) return null;
  const candidates = [record.dimensions, record.size, record.geometry, record];
  const dimensions: Partial<ExecutiveGeometryBounds> = {};
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;
    const width = readFiniteDimension(candidate.width ?? candidate.w);
    const height = readFiniteDimension(candidate.height ?? candidate.h);
    const depth = readFiniteDimension(candidate.depth ?? candidate.d);
    if (dimensions.width == null && width != null) dimensions.width = width;
    if (dimensions.height == null && height != null) dimensions.height = height;
    if (dimensions.depth == null && depth != null) dimensions.depth = depth;
  }
  return dimensions.width || dimensions.height || dimensions.depth ? dimensions : null;
}

function clampExecutiveRenderDimensions(
  bounds: ExecutiveGeometryBounds,
  objectCount?: number
): ExecutiveGeometryBounds {
  const overview = (objectCount ?? 1) >= 10;
  const maxWidth = overview ? MAX_EXECUTIVE_OVERVIEW_RENDER_WIDTH : MAX_EXECUTIVE_RENDER_WIDTH;
  const maxHeight = overview ? MAX_EXECUTIVE_OVERVIEW_RENDER_HEIGHT : MAX_EXECUTIVE_RENDER_HEIGHT;
  const maxDepth = overview ? MAX_EXECUTIVE_OVERVIEW_RENDER_DEPTH : MAX_EXECUTIVE_RENDER_DEPTH;
  return {
    width: Math.max(0.08, Math.min(bounds.width, maxWidth)),
    height: Math.max(0.08, Math.min(bounds.height, maxHeight)),
    depth: Math.max(0.08, Math.min(bounds.depth, maxDepth)),
  };
}

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

const loggedFinalObjectScaleBuckets = new Map<string, number>();
const loggedObjectMaterialSignatures = new Map<string, string>();
const loggedObjectTransformSignatures = new Map<string, string>();
const loggedObjectTransformModeSignatures = new Set<string>();
const loggedObjectTransformAuditSignatures = new Set<string>();
const loggedStaleRingVisualBlocks = new Set<string>();

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
  dimUnrelatedObjects?: boolean;
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
  showObjectDebugLabels?: boolean;
  showExecutiveLayoutLabels?: boolean;
  layoutPositions?: Record<string, [number, number, number]>;
  layoutLabelOffsets?: Record<string, { y: number; opacity: number }>;
  connectedToSelected?: boolean;
  isSelected?: boolean;
  canonicalSelectedId?: string | null;
  /** @deprecated use canonicalSelectedId */
  canonicalSelectedObjectId?: string | null;
  relationshipExplorationActive?: boolean;
  onObjectPositionChange?: (
    objectId: string,
    position: { x: number; y: number; z: number },
    phase: "drag" | "move"
  ) => void;
  onObjectUserClick?: (objectId: string, eventId: string) => void;
  svieHealthVisual?: import("../../lib/scene/svie/svieHealthVisualizationContract.ts").SvieObjectHealthVisualStyle | null;
  svieRiskHotspotVisual?: import("../../lib/scene/svie/svieRiskHotspotVisualizationContract.ts").SvieObjectRiskHotspotVisualStyle | null;
  svieCauseChainNodeVisual?: import("../../lib/scene/svie/svieCauseChainVisualizationContract.ts").SvieCauseChainNodeVisualStyle | null;
  svieRecommendationNodeVisual?: import("../../lib/scene/svie/svieRecommendationVisualizationContract.ts").SvieRecommendationNodeVisualStyle | null;
  svieConfidenceNodeVisual?: import("../../lib/scene/svie/svieConfidenceVisualizationContract.ts").SvieConfidenceNodeVisualStyle | null;
  svieExecutiveStoryNodeVisual?: import("../../lib/scene/svie/svieExecutiveStoryLayerContract.ts").SvieExecutiveStoryNodeVisualStyle | null;
  svieFutureStateNodeVisual?: import("../../lib/scene/svie/svieFutureStateVisualizationContract.ts").SvieFutureStateNodeVisualStyle | null;
  svieScenarioDeltaNodeVisual?: import("../../lib/scene/svie/svieScenarioDeltaVisualizationContract.ts").SvieScenarioDeltaNodeVisualStyle | null;
  svieScenarioImpactNodeVisual?: import("../../lib/scene/svie/svieScenarioImpactChainContract.ts").SvieScenarioImpactChainNodeVisualStyle | null;
  svieScenarioComparisonNodeVisual?: import("../../lib/scene/svie/svieScenarioComparisonLayerContract.ts").SvieScenarioComparisonNodeVisualStyle | null;
  svieScenarioConfidenceNodeVisual?: import("../../lib/scene/svie/svieScenarioConfidenceLayerContract.ts").SvieScenarioConfidenceNodeVisualStyle | null;
  svieExecutiveFutureStoryNodeVisual?: import("../../lib/scene/svie/svieExecutiveFutureStoryLayerContract.ts").SvieExecutiveFutureStoryNodeVisualStyle | null;
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
  dimUnrelatedObjects = false,
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
  showObjectDebugLabels = false,
  showExecutiveLayoutLabels = false,
  layoutPositions,
  layoutLabelOffsets,
  connectedToSelected = false,
  isSelected = false,
  canonicalSelectedId = null,
  canonicalSelectedObjectId = null,
  relationshipExplorationActive = false,
  onObjectPositionChange,
  onObjectUserClick,
  svieHealthVisual = null,
  svieRiskHotspotVisual = null,
  svieCauseChainNodeVisual = null,
  svieRecommendationNodeVisual = null,
  svieConfidenceNodeVisual = null,
  svieExecutiveStoryNodeVisual = null,
  svieFutureStateNodeVisual = null,
  svieScenarioDeltaNodeVisual = null,
  svieScenarioImpactNodeVisual = null,
  svieScenarioComparisonNodeVisual = null,
  svieScenarioConfidenceNodeVisual = null,
  svieExecutiveFutureStoryNodeVisual = null,
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
    if (ref.current) {
      ref.current.userData.objectId = stableIdWithName;
    }
  }, [stableIdWithName]);
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
  const selectedVisual = isSelected === true;
  const selectedVisualActive = selectedVisual;
  const resolvedCanonicalSelectedId =
    typeof canonicalSelectedId === "string" && canonicalSelectedId.trim().length > 0
      ? canonicalSelectedId.trim()
      : typeof canonicalSelectedObjectId === "string" && canonicalSelectedObjectId.trim().length > 0
        ? canonicalSelectedObjectId.trim()
        : null;
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!isFocused || selectedVisual) return;
    if (resolvedCanonicalSelectedId === stableIdWithName) return;
    const key = `${focusedId ?? "none"}:${stableIdWithName}`;
    if (loggedStaleRingVisualBlocks.has(key)) return;
    loggedStaleRingVisualBlocks.add(key);
    logVisualSelectionAuthorityRejected({
      attemptedObjectId: stableIdWithName,
      canonicalSelectedId: resolvedCanonicalSelectedId,
      source: "focusedId",
    });
  }, [focusedId, isFocused, resolvedCanonicalSelectedId, stableIdWithName, selectedVisual]);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    logVisualSelectionLayerAudit({
      objectId: stableIdWithName,
      selectedVisual,
      selectedId: resolvedCanonicalSelectedId,
      ringSource: selectedVisual ? CANONICAL_VISUAL_SELECTION_SOURCE : "none",
      labelSource: selectedVisual ? CANONICAL_VISUAL_SELECTION_SOURCE : "none",
      boldSource: selectedVisual ? CANONICAL_VISUAL_SELECTION_SOURCE : "none",
      glowSource: selectedVisual ? CANONICAL_VISUAL_SELECTION_SOURCE : "none",
    });
  }, [resolvedCanonicalSelectedId, selectedVisual, stableIdWithName]);
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
  const preExecutiveUniform = clamp(
    originalUniform * (overrideScale ?? 1) * uxScale * (globalScale ?? 1),
    0.25,
    1.35
  );
  const ambientPhase = useMemo(() => hashIdToUnit(String(stableIdWithName)) * Math.PI * 2, [stableIdWithName]);
  const shape = resolveGeometryKindForObject({
    obj,
    explicitShape: (obj as any).shape ?? ux?.shape,
    fallbackType: safeType,
    profile: visualProfile,
  });

  const layoutPosition =
    layoutPositions?.[stableIdWithName] ??
    layoutPositions?.[stableId] ??
    (obj.id ? layoutPositions?.[String(obj.id)] : undefined) ??
    (obj.name ? layoutPositions?.[String(obj.name)] : undefined);

  const finalPosition = overrideEntry.position ?? layoutPosition ?? transformPos ?? [0, 0, 0];
  const finalRotation = overrideEntry.rotation ?? (transform as any).rot ?? [0, 0, 0];
  const finalColorOverride = overrideEntry.color;
  const finalVisible = overrideEntry.visible ?? true;
  const workspaceViewMode = useSyncExternalStore(
    subscribeWorkspaceViewMode,
    getWorkspaceViewMode,
    getWorkspaceViewModeServerSnapshot
  );
  const selectionHitProxyScale = useMemo(
    () =>
      resolveObjectSelectionHitProxyScale({
        sceneObjectCount,
        workspaceViewMode,
      }),
    [sceneObjectCount, workspaceViewMode]
  );
  const executiveFocus = useMemo(
    () =>
      resolveExecutiveFocusWorkspaceState({
        objectId: stableIdWithName,
        selectedObjectId: selectedVisual ? stableIdWithName : null,
        focusedObjectId: focusedId,
        relatedObjectIds: neighborIds,
      }),
    [focusedId, neighborIds, stableIdWithName, selectedVisual]
  );
  const adaptiveLabel = useMemo(
    () =>
      resolveWorkspaceLabelState(workspaceViewMode, {
        objectCount: sceneObjectCount,
        selected: selectedVisualActive,
        focused: false,
        forceMode: executiveFocus.labelModeOverride,
      }),
    [executiveFocus.labelModeOverride, sceneObjectCount, selectedVisualActive, workspaceViewMode]
  );
  const labelReduction = useMemo(
    () =>
      resolveExecutiveLabelReduction({
        objectCount: sceneObjectCount,
        selected: selectedVisualActive,
        focused: false,
        isCritical: selectedVisualActive,
        isHighRisk: Boolean(obj.scanner_severity && obj.scanner_severity !== "low"),
        isConnected: neighborIds.length > 0,
        viewMode: workspaceViewMode,
      }),
    [neighborIds.length, obj.scanner_severity, sceneObjectCount, selectedVisualActive, workspaceViewMode]
  );
  const layoutLabelOffset =
    layoutLabelOffsets?.[stableIdWithName] ??
    layoutLabelOffsets?.[stableId] ??
    (obj.id ? layoutLabelOffsets?.[String(obj.id)] : undefined) ??
    { y: 0, opacity: 1 };
  const forceExecutiveLayoutLabels =
    showExecutiveLayoutLabels && sceneObjectCount >= 6 && sceneObjectCount <= 12;
  const effectiveLabel = useMemo(
    () => ({
      showPrimary: forceExecutiveLayoutLabels || (adaptiveLabel.showPrimary && labelReduction.visible),
      showSecondary: adaptiveLabel.showSecondary && labelReduction.showSecondary,
      showIcon: adaptiveLabel.showIcon && labelReduction.showIcon,
      opacity:
        adaptiveLabel.opacity *
        labelReduction.opacity *
        (forceExecutiveLayoutLabels ? layoutLabelOffset.opacity : 1),
      fontSizePx: adaptiveLabel.fontSizePx,
      maxLines: adaptiveLabel.maxLines,
      billboard: adaptiveLabel.billboard,
    }),
    [adaptiveLabel, forceExecutiveLayoutLabels, labelReduction, layoutLabelOffset.opacity]
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
  const scannerDimRequested =
    dimUnrelatedObjects === true && scannerSceneActive && scannerTargetIdSet.size > 0;
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
        isSelected: selectedVisual,
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
        isSelected: selectedVisual,
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

  const objectImportance = useMemo(
    () =>
      deriveExecutiveObjectImportanceTier({
        scannerSeverity: obj.scanner_severity,
        scannerHighlighted,
        connectedToSelected: false,
        isDecisionPathSource,
        isSimulationSource,
        role: visualRole,
        selected: selectedVisualActive,
        focused: false,
      }),
    [
      isDecisionPathSource,
      isSimulationSource,
      obj.scanner_severity,
      scannerHighlighted,
      selectedVisualActive,
      visualRole,
    ]
  );
  const executiveScaleSignature = [
    stableIdWithName,
    selectedVisual ? 1 : 0,
    isFocused ? 1 : 0,
    hovered || isHovered ? 1 : 0,
    dimOthers ? 1 : 0,
    objectImportance,
    sceneObjectCount,
    workspaceViewMode,
    roundScaleInput(globalScale ?? 1),
    roundScaleInput(typeof overrideScale === "number" ? overrideScale : 1),
    roundScaleInput(uxScale),
  ].join(":");
  const executiveScaleInput = holdStableScaleInput(
    stableExecutiveScaleInputRef,
    executiveScaleSignature,
    preExecutiveUniform,
    Number.POSITIVE_INFINITY
  );
  const layoutRole = useMemo(() => classifyExecutiveObjectLayoutRole(obj), [obj]);
  const zoneLikeObject = useMemo(() => isZoneLikeExecutiveObject(obj), [obj]);
  const finalUniform = useMemo(() => {
    const normalized = normalizeExecutiveObjectScale({
      objectId: stableIdWithName,
      scale: executiveScaleInput,
      selected: selectedVisualActive,
      focused: false,
      hovered: hovered || isHovered,
      dimmed: dimOthers,
      importance: objectImportance,
      objectCount: sceneObjectCount,
      viewMode: workspaceViewMode,
      role: layoutRole,
      zoneLike: zoneLikeObject,
    });
    return clampExecutiveObjectFootprintScale({
      transformScale: normalized,
      viewMode: workspaceViewMode,
    });
  }, [
    dimOthers,
    executiveScaleInput,
    hovered,
    isHovered,
    layoutRole,
    objectImportance,
    sceneObjectCount,
    selectedVisualActive,
    stableIdWithName,
    workspaceViewMode,
    zoneLikeObject,
  ]);
  const nameDensityProfile = useMemo(
    () => resolveObjectNameDensityProfile(sceneObjectCount),
    [sceneObjectCount]
  );
  const executiveLabelScale = useMemo(
    () =>
      resolveExecutiveLabelScale({
        objectCount: sceneObjectCount,
        importance: objectImportance,
        selected: selectedVisualActive,
        focused: false,
        hovered: hovered || isHovered,
        dimmed: dimOthers,
        baseFontSizePx: nameDensityProfile.fontSizePx,
        index,
      }),
    [
      dimOthers,
      hovered,
      index,
      isHovered,
      nameDensityProfile.fontSizePx,
      objectImportance,
      sceneObjectCount,
      selectedVisualActive,
    ]
  );
  const executiveGraphicsPreset = useMemo(() => {
    const category =
      visualProfile.category ??
      deriveExecutiveObjectVisualCategory({
        label: obj.label ?? obj.name,
        role: (obj as any)?.role,
        tags,
        semanticRole: (obj as any)?.semantic?.role,
        semanticCategory: (obj as any)?.semantic?.category,
        visualRole,
      });
    const hierarchyTier = resolveExecutiveVisualHierarchyTier({
      selected: selectedVisualActive,
      focused: false,
      scenarioActive: isSimulationSource || isDecisionPathSource,
      visualRole,
      category,
    });
    return resolveExecutiveObjectMaterialPreset({
      category,
      viewMode: workspaceViewMode,
      hierarchyTier,
    });
  }, [
    isDecisionPathSource,
    isSimulationSource,
    obj,
    selectedVisualActive,
    tags,
    visualProfile.category,
    visualRole,
    workspaceViewMode,
  ]);
  const executiveViewGraphics = useMemo(
    () => resolveExecutiveGraphicsViewProfile(workspaceViewMode),
    [workspaceViewMode]
  );
  const executiveNameProfile = useMemo(
    () => {
      const base = resolveObjectNameRenderingProfile({
        selected: selectedVisualActive,
        fontSizePx: executiveLabelScale.fontSizePx,
      });
      return {
        ...base,
        fontWeight: Math.round(Math.min(900, base.fontWeight * executiveGraphicsPreset.labelWeight)),
        fontSizePx: Math.round(
          base.fontSizePx *
            executiveViewGraphics.labelContrast *
            (workspaceViewMode === "2D" ? 0.98 : 1)
        ),
      };
    },
    [
      executiveGraphicsPreset.labelWeight,
      executiveLabelScale.fontSizePx,
      executiveViewGraphics.labelContrast,
      selectedVisualActive,
      workspaceViewMode,
    ]
  );

  /** Freeze story/hover/attention/neighbor ramps for material math so opacity/emissive don't oscillate every frame. */
  const materialStoryReveal = CALM_MODE ? 1 : nodeStoryReveal;
  const materialNeighborDim = CALM_MODE ? 1 : neighborDimFactor;
  const materialPassiveAttention = CALM_MODE ? 0 : passiveAttentionMemoryStrength;

  const color = useMemo(() => {
    const materialColor = material.color ?? ux?.base_color ?? "#cccccc";
    if (materialColor !== "auto") return sanitizeThreeColor(materialColor, "#cccccc");
    return computeAutoColor(tags, stateVector);
  }, [material.color, tags, stateVector, ux?.base_color]);

  const appliedColor = useMemo(() => {
    const base = sanitizeThreeColor(finalColorOverride ?? color, "#cccccc");
    const resolved = new THREE.Color(base);
    if (visualRole === "risk") {
      resolved.lerp(new THREE.Color(sanitizeThreeColor(tokens.design.colors.pressure, "#ef4444")), 0.16);
    } else if (visualRole === "core") {
      resolved.multiplyScalar(theme === "day" ? 1.05 : 1.08);
    } else if (visualRole === "background") {
      resolved.multiplyScalar(theme === "day" ? 0.82 : 0.72);
    } else if (visualRole === "strategic") {
      resolved.lerp(new THREE.Color(sanitizeThreeColor(tokens.design.colors.strategic, "#8b5cf6")), 0.1);
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

  const commitUserObjectClick = (event: any, source: "click" | "double_click") => {
    if (!isNearestSelectableObjectHit(event, stableIdWithName)) {
      reportSelectionMiss({
        objectId: stableIdWithName,
        source: "AnimatableObject",
        phase: "hit_detection",
        eventId: buildObjectClickEventId(event),
        reason: "not_nearest_selectable_object_hit",
        intersectionCount: event.intersections?.length ?? 0,
      });
      logObjectClickDiagnostic("[NEXORA_OBJECT_CLICK_REJECTED_SECOND_HIT]", {
        objectId: stableIdWithName,
        reason: "not_nearest_selectable_object_hit",
        source,
      });
      return false;
    }
    const gateResult = tryAcceptPointerObjectSelection(stableIdWithName, event);
    if (!gateResult.accepted) {
      if (gateResult.reason !== "duplicate_same_object") {
        logObjectClickDiagnostic("[NEXORA_OBJECT_CLICK_REJECTED_SECOND_HIT]", {
          objectId: stableIdWithName,
          reason: gateResult.reason,
          source,
          clickEventId: gateResult.clickEventId,
        });
      }
      return false;
    }
    const eventId =
      source === "double_click"
        ? `${gateResult.clickEventId}:dbl`
        : gateResult.clickEventId;
    reportObjectSelection({
      objectId: stableIdWithName,
      source: "AnimatableObject",
      phase: "hit_detection",
      eventId,
      intersectionCount: event.intersections?.length ?? 0,
      hitProxyScale: selectionHitProxyScale,
      sceneObjectCount,
    });
    if (onObjectUserClick) {
      logObjectClickDiagnostic("[Nexora][ObjectPointerAccepted]", {
        objectId: stableIdWithName,
        clickEventId: eventId,
        source,
        intersectionCount: event.intersections?.length ?? 0,
      });
      onObjectUserClick(stableIdWithName, eventId);
      return true;
    }
    if (selectedVisual) {
      return false;
    }
    reportDuplicateSelectionOwner({
      objectId: stableIdWithName,
      source: "AnimatableObject.setSelectedId_fallback",
      competingOwner: "SceneContext.selectedId",
      phase: "selection_commit",
      eventId,
    });
    setSelectedId(stableIdWithName);
    return true;
  };

  const handleSelect = (event: any) => {
    setHovered(false);
    setHoveredId?.(null);
    event.stopPropagation();
    event.nativeEvent?.stopImmediatePropagation?.();
    if (!commitUserObjectClick(event, "click")) {
      return;
    }
    patchExecutiveInteractionState({ selectedObjectId: stableIdWithName });
    logExecutiveInteractionSelection(`select:${stableIdWithName}`, {
      objectId: stableIdWithName,
      source: "click",
    });
  };

  const handleDoubleClickFocus = (event: any) => {
    event.stopPropagation();
    event.nativeEvent?.stopImmediatePropagation?.();
    if (!commitUserObjectClick(event, "double_click")) {
      return;
    }
    focusExecutiveObjectFromInteraction(stableIdWithName, "scene");
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

  const materialProps = useMemo(
    () => ({
      color: appliedColor,
      metalness: executiveGraphicsPreset.metalness,
      roughness: executiveGraphicsPreset.roughness,
      transparent: true,
      opacity: (() => {
        const uxOpacity = typeof uxOverrides.opacity === "number" ? clamp(uxOverrides.opacity, 0.1, 1) : 1;
        const baseOpacity = (material.opacity ?? 0.9) * executiveGraphicsPreset.opacityMul;
        const adjusted = baseOpacity * uxOpacity * hierarchyStyle.opacityMul;
        if (scannerBackgroundDimmed) {
          const softShadowFloor = theme === "day" ? 0.58 : 0.5;
          return Math.max(Math.min(adjusted, softShadowFloor), theme === "day" ? 0.5 : 0.4);
        }
        if (!isFocusActive || !genericFocusDimmed) return adjusted;
        return theme === "day" ? Math.min(adjusted, 0.3) : Math.min(adjusted, 0.24);
      })(),
      emissive: material.emissive,
      emissiveIntensity: (material.emissiveIntensity ?? 0) + executiveGraphicsPreset.emissiveBoost,
    }),
    [
      appliedColor,
      executiveGraphicsPreset.emissiveBoost,
      executiveGraphicsPreset.metalness,
      executiveGraphicsPreset.opacityMul,
      executiveGraphicsPreset.roughness,
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
    !CALM_MODE && isHovered && !isFocused && !selectedVisual
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
      : visualState.isSelected || visualState.isPinned
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
        selected: selectedVisual,
        focused: false,
        theme: theme === "day" ? "day" : "night",
      }),
    [theme, selectedVisual]
  );
  const showFocusWireframe = false;
  const hoverAffordance = useMemo(
    () =>
      resolveExecutiveHoverAffordance({
        hovered: hovered || isHovered,
        selected: selectedVisual,
        focused: false,
        connectedToSelected: false,
        relationshipExplorationActive: false,
      }),
    [hovered, isHovered, selectedVisual]
  );
  useCursor(hovered || hoverAffordance.showGlow || selectedVisual);

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
  const selectedBoost = selectedVisual
    ? Math.max(tokens.interaction.selectionGlow, baseEmissiveIntensity)
    : baseEmissiveIntensity;
  const hoveredBoost =
    !CALM_MODE && hovered && !selectedVisual && !isFocused
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
    ? storyAdjustedEmissiveIntensity + hoverAffordance.emissiveBoost
    : isHovered
      ? storyAdjustedEmissiveIntensity + interactionProfile.emissiveBoost
      : storyAdjustedEmissiveIntensity + hoverAffordance.emissiveBoost;
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

  const rawMeshEmissiveIntensity = selectedVisual
    ? Math.max(calmSeverityVisual.glowStrength, materialProps.emissiveIntensity ?? 0)
    : Math.max(warRoomAdjustedEmissiveIntensity, calmSeverityVisual.glowStrength);

  const committedMeshOpacity = roundMaterialScalar(executiveAdjustedOpacity);
  const svieEmissiveIntensity =
    svieHealthVisual && !selectedVisual && !scannerHighlighted
      ? svieHealthVisual.emissiveIntensity
      : 0;
  const committedMeshEmissiveIntensity = roundMaterialScalar(
    Math.max(rawMeshEmissiveIntensity, svieEmissiveIntensity)
  );
  const committedMeshEmissiveHex = selectedVisual
      ? "#ffffff"
      : scannerHighlighted
        ? scannerColor
        : svieHealthVisual && !scannerHighlighted
          ? svieHealthVisual.emissiveColor
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
        isSelected: selectedVisual,
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

  const calmScale = 1;
  const calmSelectionScale = 1;
  const staticPosition = useMemo<[number, number, number]>(
    () => [finalPosition[0] ?? 0, finalPosition[1] ?? 0, finalPosition[2] ?? 0],
    [finalPosition]
  );
  const staticRotation = useMemo<[number, number, number]>(() => [0, 0, 0], []);
  const executiveGeometry = useMemo(() => {
    const normalized = resolveExecutiveNormalizedGeometry({
      type: shape,
      zoneLike: zoneLikeObject,
      transformScale: finalUniform,
      selected: selectedVisual,
    });
    const explicitDimensions = readExplicitExecutiveDimensions(obj);
    const unclampedDimensions: ExecutiveGeometryBounds = {
      width: explicitDimensions?.width ?? normalized.dimensions.width,
      height: explicitDimensions?.height ?? normalized.dimensions.height,
      depth: explicitDimensions?.depth ?? normalized.dimensions.depth,
    };
    const dimensions = clampExecutiveRenderDimensions(unclampedDimensions, sceneObjectCount);
    const { renderKind, args } = geometryArgsFromBounds(normalized.renderKind, dimensions);
    const maxDimension = Math.max(dimensions.width, dimensions.height, dimensions.depth);
    const finalWorldSize = Math.round(maxDimension * normalized.transformScale * 1000) / 1000;
    return {
      ...normalized,
      renderKind,
      args,
      dimensions,
      finalWorldSize,
    };
  }, [finalUniform, obj, sceneObjectCount, shape, selectedVisual, zoneLikeObject]);
  const staticScale = useMemo(
    () =>
      clampExecutiveRenderedScale({
        objectId: stableIdWithName,
        shape,
        finalScale: executiveGeometry.transformScale,
        viewMode: workspaceViewMode,
        selected: selectedVisualActive,
        focused: false,
      }),
    [
      executiveGeometry.transformScale,
      selectedVisualActive,
      shape,
      stableIdWithName,
      workspaceViewMode,
    ]
  );
  const motionState = useMemo(
    () =>
      buildAnimatableMotionState({
        objType: obj.type,
        hierarchyAmbientMul: hierarchyStyle.ambientMul,
        hierarchyScaleMul: selectedVisualActive ? 1 : hierarchyStyle.scaleMul,
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
        isSelected: selectedVisual,
        isHovered,
        isSimulationSource,
        isDecisionPathSource,
        decisionSimulationStrength,
        ambientPhase,
        decisionCenter,
        finalPosition,
        focusScaleMul,
        isFocused: false,
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
  const dynamicScale = useMemo(
    () =>
      clampExecutiveRenderedScale({
        objectId: stableIdWithName,
        shape,
        finalScale: CALM_MODE
          ? finalUniform * calmScale
          : finalUniform * effectiveScannerScaleMul * calmSelectionScale * tokens.interaction.sceneObjectEmphasis,
        viewMode: workspaceViewMode,
        selected: selectedVisualActive,
        focused: false,
      }),
    [
      calmScale,
      calmSelectionScale,
      effectiveScannerScaleMul,
      finalUniform,
      selectedVisualActive,
      shape,
      stableIdWithName,
      tokens.interaction.sceneObjectEmphasis,
      workspaceViewMode,
    ]
  );
  const layoutPositionCount = useMemo(() => Object.keys(layoutPositions ?? {}).length, [layoutPositions]);
  const layoutPositionsAvailable = Array.isArray(layoutPosition);
  const executiveLayoutActive = layoutPositionCount > 0;
  const useStaticObjectTransforms = useMemo(
    () =>
      shouldUseStaticObjectTransforms({
        executiveLayoutActive,
        objectCount: sceneObjectCount,
        layoutPositionsAvailable,
      }),
    [executiveLayoutActive, layoutPositionsAvailable, sceneObjectCount]
  );
  const resolvedAppliedPosition = useMemo<[number, number, number]>(
    () =>
      useStaticObjectTransforms
        ? staticPosition
        : [finalPosition[0] ?? 0, finalPosition[1] ?? 0, finalPosition[2] ?? 0],
    [finalPosition, staticPosition, useStaticObjectTransforms]
  );
  const resolvedAppliedRotation = useMemo<[number, number, number]>(
    () =>
      useStaticObjectTransforms
        ? staticRotation
        : [finalRotation?.[0] ?? 0, finalRotation?.[1] ?? 0, finalRotation?.[2] ?? 0],
    [finalRotation, staticRotation, useStaticObjectTransforms]
  );
  const resolvedAppliedScale = useMemo(
    () => (useStaticObjectTransforms ? staticScale : dynamicScale),
    [dynamicScale, staticScale, useStaticObjectTransforms]
  );
  const resolvedAppliedGroupScale = useMemo<[number, number, number]>(() => {
    if (workspaceViewMode === "2D" && useStaticObjectTransforms) {
      return flattenExecutive2DGroupScale(resolvedAppliedScale);
    }
    if (useStaticObjectTransforms) {
      return [resolvedAppliedScale, resolvedAppliedScale, resolvedAppliedScale];
    }
    return [
      (baseScale[0] ?? 1) * resolvedAppliedScale,
      (baseScale[1] ?? 1) * resolvedAppliedScale,
      (baseScale[2] ?? 1) * resolvedAppliedScale,
    ];
  }, [baseScale, resolvedAppliedScale, useStaticObjectTransforms, workspaceViewMode]);
  const objectTransformModeSignature = `${stableIdWithName}:${sceneObjectCount}:${
    layoutPositionsAvailable ? "layout" : "raw"
  }:${useStaticObjectTransforms ? "static" : "dynamic"}`;
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (useStaticObjectTransforms) return;
    if (loggedObjectTransformModeSignatures.has(objectTransformModeSignature)) return;
    loggedObjectTransformModeSignatures.add(objectTransformModeSignature);
    console.debug("[Nexora][ObjectTransformMode]", {
      mode: "dynamic_executive_layout",
      objectCount: sceneObjectCount,
      hasLayoutPosition: layoutPositionsAvailable,
    });
  }, [layoutPositionsAvailable, objectTransformModeSignature, sceneObjectCount, useStaticObjectTransforms]);
  const objectTransformAuditSignature = useMemo(
    () =>
      JSON.stringify({
        id: stableIdWithName,
        layoutPosition: roundTransformTuple(layoutPosition),
        finalPosition: roundTransformTuple(finalPosition),
        staticPosition: roundTransformTuple(staticPosition),
        appliedPosition: roundTransformTuple(resolvedAppliedPosition),
      }),
    [finalPosition, layoutPosition, resolvedAppliedPosition, stableIdWithName, staticPosition]
  );
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (loggedObjectTransformAuditSignatures.has(objectTransformAuditSignature)) return;
    loggedObjectTransformAuditSignatures.add(objectTransformAuditSignature);
    console.debug("[Nexora][ObjectTransformAudit]", {
      id: stableIdWithName,
      layoutPosition: Array.isArray(layoutPosition) ? layoutPosition : null,
      finalPosition,
      staticPosition,
      appliedPosition: resolvedAppliedPosition,
    });
  }, [
    finalPosition,
    layoutPosition,
    objectTransformAuditSignature,
    resolvedAppliedPosition,
    stableIdWithName,
    staticPosition,
  ]);
  const transformSignature = useMemo(
    () =>
      JSON.stringify({
        id: stableIdWithName,
        position: roundTransformTuple(resolvedAppliedPosition),
        rotation: roundTransformTuple(resolvedAppliedRotation),
        scale: roundTransformValue(resolvedAppliedScale),
        mode: useStaticObjectTransforms ? "static" : "dynamic_executive_layout",
      }),
    [
      resolvedAppliedPosition,
      resolvedAppliedRotation,
      resolvedAppliedScale,
      stableIdWithName,
      useStaticObjectTransforms,
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
      mesh.position.set(resolvedAppliedPosition[0] ?? 0, resolvedAppliedPosition[1] ?? 0, resolvedAppliedPosition[2] ?? 0);
      mesh.rotation.set(resolvedAppliedRotation[0] ?? 0, resolvedAppliedRotation[1] ?? 0, resolvedAppliedRotation[2] ?? 0);
      mesh.scale.set(
        resolvedAppliedGroupScale[0] ?? 1,
        resolvedAppliedGroupScale[1] ?? 1,
        resolvedAppliedGroupScale[2] ?? 1
      );
    }
  }, [
    resolvedAppliedGroupScale,
    resolvedAppliedPosition,
    resolvedAppliedRotation,
  ]);
  const finalObjectScale = resolvedAppliedScale;
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

  const selectionHitProps = {
    onPointerDown: handleObjectPointerDown,
    onPointerMove: handleObjectPointerMove,
    onPointerUp: handleObjectPointerUp,
    onPointerCancel: handleObjectPointerUp,
    onClick: handleSelect,
    onDoubleClick: handleDoubleClickFocus,
    onPointerOver: (event: any) => {
      event.stopPropagation();
      event.nativeEvent?.stopImmediatePropagation?.();
      setHovered(true);
      setHoveredId?.(stableIdWithName);
      patchExecutiveInteractionState({ hoveredObjectId: stableIdWithName });
    },
    onPointerOut: () => {
      setHovered(false);
      setHoveredId?.(null);
      patchExecutiveInteractionState({ hoveredObjectId: null });
    },
  };

  let node: React.ReactNode = null;
  if (obj.type === "points_cloud" && pointsGeometry) {
    node = (
      <group>
        <mesh
          userData={{ objectId: stableIdWithName, selectableHit: true }}
          {...selectionHitProps}
        >
          <sphereGeometry
            args={[
              (executiveGeometry.args[0] ?? 0.8) * selectionHitProxyScale,
              executiveGeometry.args[1] ?? 16,
              executiveGeometry.args[2] ?? 16,
            ]}
          />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <points geometry={pointsGeometry} raycast={disableMeshRaycast}>
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
        {tubeGeometry ? (
          <>
            <mesh geometry={tubeGeometry} raycast={disableMeshRaycast}>
              <meshStandardMaterial
                color={appliedColor}
                transparent
                opacity={materialProps.opacity ?? 0.9}
              />
            </mesh>
            <mesh
              geometry={tubeGeometry}
              userData={{ objectId: stableIdWithName, selectableHit: true }}
              {...selectionHitProps}
            >
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </>
        ) : null}

        <Line
          points={(pathData ?? []) as any}
          transparent
          opacity={materialProps.opacity ?? 0.9}
          color={appliedColor}
          raycast={disableMeshRaycast}
        />
      </group>
    );
  } else {
    const geometryNode = geometryForExecutiveNormalized(executiveGeometry);
    // Static mode: scale is owned by AnimatableObject group transform only.
    const meshScale = useStaticObjectTransforms
      ? [1, 1, 1]
      : Array.isArray(baseScale)
      ? (baseScale as any)
      : [baseScale ?? 1, baseScale ?? 1, baseScale ?? 1];

    node = (
      <>
        {scannerHaloVisible ? (
          <mesh
            raycast={disableMeshRaycast}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[
              (meshScale?.[0] ?? 1) * (scannerFocused ? 1.72 : 1.58),
              (meshScale?.[1] ?? 1) * (scannerFocused ? 1.72 : 1.58),
              (meshScale?.[2] ?? 1) * (scannerFocused ? 1.72 : 1.58),
            ]}
          >
            <torusGeometry args={[0.88, 0.05, 14, 40]} />
            <meshStandardMaterial
              color={sanitizeThreeColor(scannerColor)}
              emissive={sanitizeThreeColor(scannerColor)}
              emissiveIntensity={scannerFocused ? 1.14 : 0.8}
              transparent
              opacity={scannerFocused ? 0.38 : 0.24}
            />
          </mesh>
        ) : null}
        {svieHealthVisual?.showGlowLayer && !selectedVisual && !scannerHaloVisible ? (
          <mesh
            raycast={disableMeshRaycast}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[
              (meshScale?.[0] ?? 1) * 1.54,
              (meshScale?.[1] ?? 1) * 1.54,
              (meshScale?.[2] ?? 1) * 1.54,
            ]}
          >
            <torusGeometry args={[0.9, 0.038, 12, 36]} />
            <meshStandardMaterial
              color={sanitizeThreeColor(svieHealthVisual.glowColor)}
              emissive={sanitizeThreeColor(svieHealthVisual.glowColor)}
              emissiveIntensity={svieHealthVisual.glowIntensity}
              transparent
              opacity={svieHealthVisual.glowOpacity}
            />
          </mesh>
        ) : null}
        {svieHealthVisual?.badgeVisible && !selectedVisual ? (
          <mesh raycast={disableMeshRaycast} position={[0, 1.05, 0]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial
              color={sanitizeThreeColor(svieHealthVisual.outlineColor)}
              emissive={sanitizeThreeColor(svieHealthVisual.outlineColor)}
              emissiveIntensity={svieHealthVisual.outlineOpacity}
              transparent
              opacity={Math.min(0.9, svieHealthVisual.outlineOpacity + 0.35)}
            />
          </mesh>
        ) : null}
        {svieRiskHotspotVisual ? (
          <SvieRiskHotspotOverlay
            visual={svieRiskHotspotVisual}
            meshScale={[
              meshScale?.[0] ?? 1,
              meshScale?.[1] ?? 1,
              meshScale?.[2] ?? 1,
            ]}
            selectedVisual={!!selectedVisual}
            scannerHaloVisible={scannerHaloVisible}
          />
        ) : null}
        {svieCauseChainNodeVisual ? (
          <SvieCauseChainNodeHighlight
            visual={svieCauseChainNodeVisual}
            meshScale={[
              meshScale?.[0] ?? 1,
              meshScale?.[1] ?? 1,
              meshScale?.[2] ?? 1,
            ]}
            selectedVisual={!!selectedVisual}
            scannerHaloVisible={scannerHaloVisible}
          />
        ) : null}
        {svieRecommendationNodeVisual ? (
          <SvieRecommendationNodeHighlight
            visual={svieRecommendationNodeVisual}
            meshScale={[
              meshScale?.[0] ?? 1,
              meshScale?.[1] ?? 1,
              meshScale?.[2] ?? 1,
            ]}
            selectedVisual={!!selectedVisual}
            scannerHaloVisible={scannerHaloVisible}
          />
        ) : null}
        {svieConfidenceNodeVisual ? (
          <SvieConfidenceNodeHighlight
            visual={svieConfidenceNodeVisual}
            meshScale={[
              meshScale?.[0] ?? 1,
              meshScale?.[1] ?? 1,
              meshScale?.[2] ?? 1,
            ]}
            selectedVisual={!!selectedVisual}
            scannerHaloVisible={scannerHaloVisible}
          />
        ) : null}
        {svieExecutiveStoryNodeVisual ? (
          <SvieExecutiveStoryNodeHighlight
            visual={svieExecutiveStoryNodeVisual}
            meshScale={[
              meshScale?.[0] ?? 1,
              meshScale?.[1] ?? 1,
              meshScale?.[2] ?? 1,
            ]}
            selectedVisual={!!selectedVisual}
            scannerHaloVisible={scannerHaloVisible}
          />
        ) : null}
        {svieFutureStateNodeVisual ? (
          <SvieFutureStateNodeHighlight
            visual={svieFutureStateNodeVisual}
            meshScale={[
              meshScale?.[0] ?? 1,
              meshScale?.[1] ?? 1,
              meshScale?.[2] ?? 1,
            ]}
            selectedVisual={!!selectedVisual}
            scannerHaloVisible={scannerHaloVisible}
          />
        ) : null}
        {svieScenarioDeltaNodeVisual ? (
          <SvieScenarioDeltaNodeHighlight
            visual={svieScenarioDeltaNodeVisual}
            meshScale={[
              meshScale?.[0] ?? 1,
              meshScale?.[1] ?? 1,
              meshScale?.[2] ?? 1,
            ]}
            selectedVisual={!!selectedVisual}
            scannerHaloVisible={scannerHaloVisible}
          />
        ) : null}
        {svieScenarioImpactNodeVisual ? (
          <SvieScenarioImpactNodeHighlight
            visual={svieScenarioImpactNodeVisual}
            meshScale={[
              meshScale?.[0] ?? 1,
              meshScale?.[1] ?? 1,
              meshScale?.[2] ?? 1,
            ]}
            selectedVisual={!!selectedVisual}
            scannerHaloVisible={scannerHaloVisible}
          />
        ) : null}
        {svieScenarioComparisonNodeVisual ? (
          <SvieScenarioComparisonNodeHighlight
            visual={svieScenarioComparisonNodeVisual}
            meshScale={[
              meshScale?.[0] ?? 1,
              meshScale?.[1] ?? 1,
              meshScale?.[2] ?? 1,
            ]}
            selectedVisual={!!selectedVisual}
            scannerHaloVisible={scannerHaloVisible}
          />
        ) : null}
        {svieScenarioConfidenceNodeVisual ? (
          <SvieScenarioConfidenceNodeHighlight
            visual={svieScenarioConfidenceNodeVisual}
            meshScale={[
              meshScale?.[0] ?? 1,
              meshScale?.[1] ?? 1,
              meshScale?.[2] ?? 1,
            ]}
            selectedVisual={!!selectedVisual}
            scannerHaloVisible={scannerHaloVisible}
          />
        ) : null}
        {svieExecutiveFutureStoryNodeVisual ? (
          <SvieExecutiveFutureStoryNodeHighlight
            visual={svieExecutiveFutureStoryNodeVisual}
            meshScale={[
              meshScale?.[0] ?? 1,
              meshScale?.[1] ?? 1,
              meshScale?.[2] ?? 1,
            ]}
            selectedVisual={!!selectedVisual}
            scannerHaloVisible={scannerHaloVisible}
          />
        ) : null}
        {showFocusWireframe ? (
          <mesh
            raycast={disableMeshRaycast}
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
            raycast={disableMeshRaycast}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[
              (meshScale?.[0] ?? 1) * selectionHighlight.ringScale,
              (meshScale?.[1] ?? 1) * selectionHighlight.ringScale,
              (meshScale?.[2] ?? 1) * selectionHighlight.ringScale,
            ]}
          >
            <torusGeometry args={[0.86, 0.035, 14, 48]} />
            <meshStandardMaterial
              color={sanitizeThreeColor(tokens.design.colors.accent)}
              emissive={sanitizeThreeColor(tokens.design.colors.accent)}
              emissiveIntensity={tokens.interaction.selectionGlow * selectionHighlight.outlineStrength}
              transparent
              opacity={selectionHighlight.ringOpacity}
            />
          </mesh>
        ) : null}
        {!selectionHighlight.showRing && executiveGraphicsPreset.borderOpacity > 0.06 ? (
          <mesh
            raycast={disableMeshRaycast}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[
              (meshScale?.[0] ?? 1) * 1.02,
              (meshScale?.[1] ?? 1) * 1.02,
              (meshScale?.[2] ?? 1) * 1.02,
            ]}
          >
            <torusGeometry args={[0.9, 0.016, 12, 36]} />
            <meshStandardMaterial
              color={executiveGraphicsPreset.accentHex}
              emissive={executiveGraphicsPreset.accentHex}
              emissiveIntensity={workspaceViewMode === "3D" ? 0.28 : 0.18}
              metalness={0.35}
              roughness={0.45}
              transparent
              opacity={executiveGraphicsPreset.borderOpacity}
            />
          </mesh>
        ) : null}

        <mesh raycast={disableMeshRaycast} castShadow={!!shadowsEnabled} receiveShadow={!!shadowsEnabled} scale={meshScale}>
          {geometryNode}
          <meshStandardMaterial
            {...materialProps}
            color={appliedColor}
            emissive={committedMeshEmissiveHex}
            emissiveIntensity={committedMeshEmissiveIntensity}
            metalness={executiveGraphicsPreset.metalness}
            roughness={executiveGraphicsPreset.roughness}
            transparent
            opacity={committedMeshOpacity}
          />
        </mesh>
        <mesh
          {...selectionHitProps}
          userData={{ objectId: stableIdWithName, selectableHit: true }}
          scale={[
            (meshScale?.[0] ?? 1) * selectionHitProxyScale,
            (meshScale?.[1] ?? 1) * selectionHitProxyScale,
            (meshScale?.[2] ?? 1) * selectionHitProxyScale,
          ]}
        >
          {geometryForExecutiveNormalized(executiveGeometry)}
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </>
    );
  }

  const captionText = ((overrideEntry.caption ?? "") as string).trim();
  const showCaption = overrideEntry.showCaption === true;
  const objectScaleY = (baseScale[1] ?? 1) * resolvedAppliedScale * effectiveScannerScaleMul;
  const labelY = objectScaleY * 0.6 + 0.24;
  const iconY = Math.max(0.1, labelY * 0.24);
  const showExecutiveObjectName =
    forceExecutiveLayoutLabels ||
    shouldRenderExecutiveObjectName({
      profile: nameDensityProfile,
      objectCount: sceneObjectCount,
      selected: selectedVisualActive,
      focused: false,
      index,
    });
  const executiveNameOpacity =
    resolveObjectNameOpacity({
      profile: nameDensityProfile,
      objectCount: sceneObjectCount,
      selected: selectedVisualActive,
      focused: false,
    }) *
    executiveFocus.opacity *
    executiveLabelScale.opacity *
    (forceExecutiveLayoutLabels ? layoutLabelOffset.opacity : labelReduction.opacity);
  const executiveNamePlacement = useMemo(
    () => {
      const placement = resolveObjectLabelPlacement({
        baseScaleY: objectScaleY,
        objectScale: 1,
        profile: executiveNameProfile,
        index,
        objectCount: sceneObjectCount,
        relationshipDensity: neighborIds.length,
      });
      return {
        ...placement,
        y: placement.y + layoutLabelOffset.y,
      };
    },
    [
      executiveNameProfile,
      index,
      layoutLabelOffset.y,
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
    <group
      ref={ref}
      position={resolvedAppliedPosition}
      rotation={resolvedAppliedRotation}
      scale={resolvedAppliedGroupScale}
      visible={finalVisible}
    >
      {node}
      {objectIcon && effectiveLabel.showIcon ? (
        <ObjectLabelBillboard
          objectId={stableIdWithName}
          viewMode={workspaceViewMode}
          position={[0, iconY, 0]}
        >
          <Html center transform={effectiveLabel.billboard} style={{ pointerEvents: "none" }}>
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
              transform: selectedVisualActive ? "scale(1.08)" : "scale(1)",
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
        </ObjectLabelBillboard>
      ) : null}
      {showCaption && captionText.length > 0 && effectiveLabel.showSecondary ? (
        <ObjectCaption
          objectId={stableIdWithName}
          viewMode={workspaceViewMode}
          position={[0, labelY, 0]}
          captionText={captionText}
          fontSizePx={effectiveLabel.fontSizePx}
          opacity={effectiveLabel.opacity}
          tokens={tokens}
        />
      ) : null}
      {showExecutiveObjectName ? (
        <ObjectLabelBillboard
          objectId={stableIdWithName}
          viewMode={workspaceViewMode}
          position={[executiveNamePlacement.x, executiveNamePlacement.y, executiveNamePlacement.z]}
        >
          <Html center transform={effectiveLabel.billboard} style={{ pointerEvents: "none" }}>
            <div aria-hidden="true" style={executiveNameStyle}>
              {executiveObjectName}
            </div>
          </Html>
        </ObjectLabelBillboard>
      ) : null}
      {showObjectDebugLabels && process.env.NODE_ENV !== "production" ? (
        <ObjectLabelBillboard
          objectId={stableIdWithName}
          viewMode={workspaceViewMode}
          position={[0, executiveNamePlacement.y - 0.45, 0]}
        >
          <Html center transform={effectiveLabel.billboard} style={{ pointerEvents: "none" }}>
          <div
            aria-hidden="true"
            style={{
              fontSize: 10,
              lineHeight: 1.35,
              padding: "4px 6px",
              borderRadius: 4,
              background: "rgba(15,23,42,0.82)",
              color: "#e2e8f0",
              whiteSpace: "nowrap",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            <div>{executiveObjectName}</div>
            <div>s:{staticScale.toFixed(2)}</div>
            <div>
              x:{staticPosition[0].toFixed(1)} y:{staticPosition[1].toFixed(0)} z:
              {staticPosition[2].toFixed(1)}
            </div>
          </div>
          </Html>
        </ObjectLabelBillboard>
      ) : null}
    </group>
  );
}, areAnimatableObjectPropsEqual);
