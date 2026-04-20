"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, Line, useCursor } from "@react-three/drei";

import { smoothValue } from "../../lib/smooth";
import type { SceneObject } from "../../lib/sceneTypes";
import { useStateVector, useSetSelectedId, useOverrides, useSelectedId } from "../SceneContext";
import { clamp } from "../../lib/sizeCommands";
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
  buildProfessionalObjectLabelName,
  compactScannerReason,
  computeAutoColor,
  computeAutoIntensity,
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
import { buildAnimatableLabelState } from "./animatableObject/buildAnimatableLabelState";
import { buildAnimatableMotionState } from "./animatableObject/buildAnimatableMotionState";

export type AnimatableObjectProps = {
  obj: SceneObject;
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
};

export const AnimatableObject = React.memo(function AnimatableObject({
  obj,
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
  scannerStoryReveal = { primary: 1, edge: 1, affected: 1, context: 1 },
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
}: AnimatableObjectProps) {
  const ref = useRef<THREE.Object3D>(null);
  const stateVector = useStateVector();
  const setSelectedId = useSetSelectedId();
  const tags = obj.tags ?? [];
  const stableId = obj.id ?? `${obj.type ?? "obj"}:${index}`;
  const objectLabelName = buildProfessionalObjectLabelName(obj, index, modeId);
  const stableIdWithName = (obj as any).id ?? (obj as any).name ?? `${obj.type ?? "obj"}:${index}`;
  const overrides = useOverrides();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const visualContext = useMemo<VisualLanguageContext>(
    () => ({ theme: theme ?? "night", mode_id: modeId }),
    [theme, modeId]
  );
  const tokens = useMemo(() => getThemeTokens(theme ?? "night", modeId), [theme, modeId]);
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
  const finalUniform = clamp(originalUniform * (overrideScale ?? 1) * uxScale * (globalScale ?? 1), 0.15, 2.0);
  const ambientPhase = useMemo(() => hashIdToUnit(String(stableIdWithName)) * Math.PI * 2, [stableIdWithName]);
  const focusScaleMul = isFocused ? 1.03 : dimOthers ? 0.97 : 1.0;
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
  const isSelected = selectedIdCtx === stableIdWithName || selectedIdCtx === stableId;

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
    scannerLabelTone,
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
    setSelectedId(stableIdWithName);
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
        return theme === "day" ? Math.min(adjusted, 0.28) : Math.min(adjusted, 0.18);
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
    isHovered && !isFocused && !isSelected
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
      ? baseOpacity
      : scannerOpacity;
  const storyAdjustedOpacity =
    scannerSceneActive && scannerHierarchyRole !== "neutral"
      ? Math.min(1, finalOpacity * (0.9 + nodeStoryReveal * 0.1))
      : finalOpacity;
  const interactionAdjustedOpacity = clamp(storyAdjustedOpacity * neighborDimFactor, 0.08, 1);
  const narrativeAdjustedOpacity = clamp(
    interactionAdjustedOpacity * narrativeNodeStyle.opacityMul + narrativeNodeStyle.opacityBoost,
    0.08,
    1
  );
  const simulationAdjustedOpacity = clamp(narrativeAdjustedOpacity + simulationNodeStyle.opacityBoost, 0.08, 1);
  const memoryAdjustedOpacity = clamp(simulationAdjustedOpacity + passiveAttentionMemoryStrength * 0.05, 0.08, 1);

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

  const labelState = useMemo(
    () =>
      buildAnimatableLabelState({
        scannerSceneActive,
        isScannerPrimaryTarget,
        isScannerLabelOwner,
        scannerPrimaryLabelTitle,
        scannerPrimaryLabelBody,
        scannerPolicyLabelTitle: scannerPolicy.labelTitle,
        scannerCausalityRole: scannerCausality.role,
        scannerReason,
        scannerFocused,
        objectLabelName,
        scannerFragilityScore,
        scannerSeverity: obj.scanner_severity,
        affectedCount: affectedTargetIds.length,
        contextCount: contextTargetIds.length,
        activeDomainId: modeId,
      }),
    [
      affectedTargetIds.length,
      contextTargetIds.length,
      isScannerLabelOwner,
      isScannerPrimaryTarget,
      modeId,
      objectLabelName,
      obj.scanner_severity,
      scannerCausality.role,
      scannerFocused,
      scannerFragilityScore,
      scannerPolicy.labelTitle,
      scannerPrimaryLabelBody,
      scannerPrimaryLabelTitle,
      scannerReason,
      scannerSceneActive,
    ]
  );
  const { scannerLabelTitle, effectiveScannerReason, shouldShowPrimaryLabel } = labelState;
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
    hovered && !isSelected && !isFocused
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
      ? effectiveEmissiveIntensity * (0.74 + nodeStoryReveal * 0.26)
      : effectiveEmissiveIntensity;
  const interactionAdjustedEmissiveIntensity = Math.max(
    0,
    (isHovered ? storyAdjustedEmissiveIntensity + interactionProfile.emissiveBoost : storyAdjustedEmissiveIntensity) *
      neighborDimFactor
  );
  const narrativeAdjustedEmissiveIntensity = interactionAdjustedEmissiveIntensity + narrativeNodeStyle.emissiveBoost;
  const simulationAdjustedEmissiveIntensity = narrativeAdjustedEmissiveIntensity + simulationNodeStyle.emissiveBoost;
  const memoryAdjustedEmissiveIntensity = simulationAdjustedEmissiveIntensity + passiveAttentionMemoryStrength * 0.12;
  const warRoomSeverity = normalizeScannerLabelSeverity(obj.scanner_severity, scannerFragilityScore);
  const warRoomEmissiveMul =
    warRoomSeverity === "critical" || warRoomSeverity === "high"
      ? 1.14
      : warRoomSeverity === "low"
        ? 0.9
        : 1;
  const warRoomAdjustedEmissiveIntensity = memoryAdjustedEmissiveIntensity * warRoomEmissiveMul;

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
      finalOpacity,
      finalEmissiveIntensity: effectiveEmissiveIntensity,
    });
  }, [
    effectiveEmissiveIntensity,
    finalOpacity,
    scannerBackgroundDimmed,
    scannerCausality.role,
    scannerDimRequested,
    scannerPolicy.rank,
    stableIdWithName,
    visualState,
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

  const smoothUniform = useRef<number>(finalUniform);
  const speed = tokens.motion.objectEmphasisLerp;
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
        motionCalm,
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

  useEffect(() => {
    const mesh = ref.current;
    if (mesh) {
      const value = smoothUniform.current;
      const scale = value * focusScaleMul * scannerScaleMul;
      mesh.scale.set((baseScale[0] ?? 1) * scale, (baseScale[1] ?? 1) * scale, (baseScale[2] ?? 1) * scale);
    }
  }, [baseScale, focusScaleMul, scannerScaleMul]);

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;

    smoothUniform.current = smoothValue(smoothUniform.current, finalUniform, speed, delta);

    const elapsed = state.clock.getElapsedTime();
    const intensity = computeAutoIntensity(tags, anim?.intensity ?? 0.3, stateVector);

    let pulseFactor = 1;
    if (anim?.type === "pulse") {
      pulseFactor = 1 + Math.sin(elapsed * 2) * motionState.animPulseBase * intensity;
    }

    try {
      mesh.rotation.set(finalRotation[0] ?? 0, finalRotation[1] ?? 0, finalRotation[2] ?? 0);
    } catch {}

    if (anim?.type === "spin") {
      mesh.rotation.y += 0.01 * intensity;
    }

    if (anim?.type === "wobble") {
      mesh.rotation.x += Math.sin(elapsed * 2) * motionState.wobbleBase * intensity;
      mesh.rotation.z += Math.cos(elapsed * 2) * motionState.wobbleBase * intensity;
    }

    const driftX =
      Math.cos(elapsed * 0.31 * motionState.driftSpeed + ambientPhase) * motionState.driftAmplitude[0];
    const driftY =
      Math.sin(elapsed * 0.45 * motionState.driftSpeed + ambientPhase) * motionState.driftAmplitude[1];
    const driftZ =
      Math.sin(elapsed * 0.27 * motionState.driftSpeed + ambientPhase * 0.7) * motionState.driftAmplitude[2];
    const targetX = motionState.spatialBase[0] + driftX;
    const targetY = motionState.spatialBase[1] + driftY;
    const targetZ = motionState.spatialBase[2] + driftZ;
    const nextX = smoothValue(mesh.position.x, targetX, 6, delta);
    const nextY = smoothValue(mesh.position.y, targetY, 6, delta);
    const nextZ = smoothValue(mesh.position.z, targetZ, 6, delta);
    mesh.position.set(nextX, nextY, nextZ);

    const scannerPulse =
      motionState.scannerPulseAmplitude > 0
        ? 1 + Math.sin(elapsed * motionState.scannerPulseSpeed + ambientPhase) * motionState.scannerPulseAmplitude
        : 1;
    const simulationPulse =
      motionState.simulationPulseAmplitude > 0
        ? 1 +
          Math.sin(elapsed * motionState.simulationPulseSpeed + ambientPhase * 0.7) *
            motionState.simulationPulseAmplitude
        : 1;
    const applied =
      smoothUniform.current *
      pulseFactor *
      scannerPulse *
      simulationPulse *
      motionState.staticScaleMul *
      tokens.interaction.sceneObjectEmphasis;
    mesh.scale.set((baseScale[0] ?? 1) * applied, (baseScale[1] ?? 1) * applied, (baseScale[2] ?? 1) * applied);
  });

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
    const meshScale = Array.isArray(baseScale) ? (baseScale as any) : [baseScale ?? 1, baseScale ?? 1, baseScale ?? 1];

    const meshProps = {
      castShadow: !!shadowsEnabled,
      receiveShadow: !!shadowsEnabled,
      onPointerDown: stopPointerOnly,
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

        <mesh {...(meshProps as any)}>
          {geometryNode}
          <meshStandardMaterial
            {...materialProps}
            color={appliedColor}
            emissive={isFocused ? "#ffffff" : isSelected ? "#ffffff" : scannerHighlighted ? scannerColor : materialProps.emissive}
            emissiveIntensity={
              isFocused
                ? Math.max(0.85, (materialProps.emissiveIntensity ?? 0) + (theme === "day" ? 0.35 : 0.55))
                : isSelected
                ? Math.max(0.6, materialProps.emissiveIntensity ?? 0)
                : warRoomAdjustedEmissiveIntensity
            }
            transparent
            opacity={memoryAdjustedOpacity}
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
  const labelY = ((baseScale[1] ?? 1) * finalUniform) * scannerScaleMul * 0.6 + 0.24;
  const scannerLabelYOffset = isScannerLabelOwner ? 0.56 : 0.45;

  return (
    <group ref={ref} position={finalPosition} visible={finalVisible}>
      {node}
      {showCaption && captionText.length > 0 && (
        <Html position={[0, labelY, 0]} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              fontSize: tokens.design.typography.sm,
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
      )}
      {shouldShowPrimaryLabel ? (
        <Html position={[0, labelY + scannerLabelYOffset, 0]} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              display: "grid",
              gap: 5,
              minWidth: 140,
              maxWidth: 200,
              padding: "9px 11px",
              borderRadius: tokens.design.radius.md,
              border: `1px solid ${scannerLabelTone.borderColor}`,
              background: scannerLabelTone.background,
              boxShadow: scannerLabelTone.boxShadow,
              color: tokens.design.colors.textPrimary,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.1,
                textTransform: "none",
                color: scannerLabelTone.titleColor,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: scannerLabelTone.dotColor,
                  boxShadow: scannerLabelTone.dotGlow,
                }}
              />
              {scannerLabelTitle}
            </div>
            {effectiveScannerReason ? (
              <div
                style={{
                  fontSize: 10.5,
                  lineHeight: 1.35,
                  color: scannerLabelTone.bodyColor,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {effectiveScannerReason}
              </div>
            ) : null}
          </div>
        </Html>
      ) : null}
    </group>
  );
});
