"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import type { WorkspaceViewMode } from "../../../lib/workspace/workspaceViewModeTypes";
import {
  buildExecutiveCameraTransitionSignature,
  createExecutiveCameraTransitionState,
  shouldApplyExecutiveCameraTransition,
  stepExecutiveCameraTransition,
} from "../../../lib/scene/camera/executiveCameraTransitionRuntime";
import { logExecutiveCameraTransition } from "../../../lib/scene/camera/executiveCameraDiagnostics";
import { validateWorkspaceModeActivation } from "../../../lib/workspace/workspaceModeValidation";
import { logCameraProfileForMode } from "../../../lib/workspace/workspaceModeValidation";
import { devLogOnSignatureChange } from "../../../lib/runtime/diagnosticIdleGate";
import {
  blendOperationalCenter,
  resolveExecutiveViewportCameraFrame,
  resolveExecutiveViewportOperationalCenter,
} from "../../../lib/scene/viewport/executiveViewportCameraRuntime";
import { shouldUseExecutiveOperationalLayout } from "../../../lib/scene/composition/normalizeExecutiveObjectLayout";
import {
  logExecutiveViewportModeSwitch,
  mapWorkspaceViewModeToFramingPreset,
  resolveExecutiveViewportModeConfig,
} from "../../../lib/scene/viewport/executiveViewportModeRuntime";
import { logE92FitScene, logE92GlobalView } from "../../../lib/scene/viewport/executiveViewportDiagnostics";
import {
  buildObjectVisualExtentsSignature,
  resolveObjectVisualExtents,
} from "../../../lib/scene/camera/objectVisualExtents";

export type ExecutiveViewportFramerProps = {
  sceneJson: any | null;
  layoutPositions?: Record<string, [number, number, number]>;
  layoutBoundsSignature?: string;
  settledLayoutBoundsSignature?: string | null;
  initialLayoutFrameAppliedRef?: React.MutableRefObject<string | null>;
  cameraAuthorityRef?: React.MutableRefObject<{
    activeWriter: string | null;
    signature: string | null;
    cooldownUntil: number;
    appliedAt: number;
  }>;
  controlsRef: React.MutableRefObject<any | null>;
  localIsOrbitingRef: React.MutableRefObject<boolean>;
  isOrbiting: boolean;
  enabled: boolean;
  reframeNonce?: number;
  viewMode: WorkspaceViewMode;
  presetOverride?: "GLOBAL" | "FIT_SCENE" | null;
  programmaticCameraUpdateRef?: React.MutableRefObject<boolean>;
  mountedAtMs?: number;
};

const loggedLayoutAwareCameraBounds = new Set<string>();
const loggedSettledLayoutFrames = new Set<string>();
const loggedVisualBoundsSignatures = new Set<string>();
const CAMERA_AUTHORITY_COOLDOWN_MS = 800;
const loggedCameraAuthorityBlocks = new Set<string>();
const loggedCameraWriteSignatures = new Set<string>();
const loggedLateCameraWriteSignatures = new Set<string>();

function markProgrammaticCameraUpdate(ref?: React.MutableRefObject<boolean>) {
  if (!ref) return;
  ref.current = true;
  queueMicrotask(() => {
    ref.current = false;
  });
}

function claimCameraAuthority(input: {
  authorityRef?: ExecutiveViewportFramerProps["cameraAuthorityRef"];
  writer: string;
  signature: string;
  reason: string;
  override?: boolean;
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
  authority.cooldownUntil = now + CAMERA_AUTHORITY_COOLDOWN_MS;
  return true;
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
  layoutSignature?: string | null;
  authorityWriter?: string | null;
  position: [number, number, number];
  target: [number, number, number];
  blocked?: boolean;
  mountedAtMs?: number;
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
    layoutSignature: input.layoutSignature ?? null,
    authorityWriter: input.authorityWriter ?? null,
    blocked: input.blocked === true,
  });
}

function logCameraAuthorityBlock(input: {
  activeWriter: string | null;
  blockedWriter: string;
  reason: string;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  const signature = JSON.stringify(input);
  if (loggedCameraAuthorityBlocks.has(signature)) return;
  loggedCameraAuthorityBlocks.add(signature);
  console.log("[Nexora][CameraAuthority]", input);
}

function buildLayoutAwareSceneSignature(
  sceneJson: unknown,
  layoutPositions?: Record<string, [number, number, number]>
): string {
  const objects = Array.isArray((sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects)
    ? ((sceneJson as { scene: { objects: unknown[] } }).scene.objects as unknown[])
    : [];
  if (!objects.length) return "empty";
  return objects
    .map((object, index) => {
      const record = object as { id?: unknown; name?: unknown; type?: unknown; transform?: { pos?: unknown }; position?: unknown };
      const id = String(record?.id ?? record?.name ?? `${record?.type ?? "obj"}:${index}`);
      const layoutPosition =
        (record?.id != null ? layoutPositions?.[String(record.id)] : undefined) ??
        (record?.name != null ? layoutPositions?.[String(record.name)] : undefined);
      const rawPosition =
        Array.isArray(record?.transform?.pos) && record.transform.pos.length >= 3
          ? record.transform.pos
          : Array.isArray(record?.position) && record.position.length >= 3
            ? record.position
            : null;
      const position = layoutPosition ?? rawPosition;
      const extents = resolveObjectVisualExtents(object, { objectCount: objects.length });
      if (!position) return `${id}:na`;
      return `${id}:${[0, 1, 2].map((axis) => Number(position[axis]).toFixed(2)).join(",")}:${buildObjectVisualExtentsSignature(extents)}`;
    })
    .sort()
    .join("|");
}

function logVisualBoundsOnce(input: {
  objects: unknown[];
  bounds: unknown;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  if (loggedVisualBoundsSignatures.has(input.signature)) return;
  loggedVisualBoundsSignatures.add(input.signature);
  const boundsSize = (input.bounds as { size?: unknown } | null)?.size ?? null;
  let largestObjectId: string | null = null;
  let largestObjectExtent = 0;
  input.objects.forEach((object, index) => {
    const record = object as { id?: unknown; name?: unknown } | null;
    const id = String(record?.id ?? record?.name ?? `obj:${index}`);
    const extents = resolveObjectVisualExtents(object, { objectCount: input.objects.length });
    const maxExtent = Math.max(extents.width, extents.height, extents.depth);
    if (maxExtent > largestObjectExtent) {
      largestObjectExtent = maxExtent;
      largestObjectId = id;
    }
  });
  console.log("[Nexora][VisualBounds]", {
    objectCount: input.objects.length,
    boundsSize,
    largestObjectId,
    largestObjectExtent: Number(largestObjectExtent.toFixed(3)),
    source: "visual_extents",
  });
}

function logLayoutAwareCameraBoundsOnce(input: {
  objectCount: number;
  layoutPositionCount: number;
  bounds: unknown;
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

function logSettledLayoutFrameOnce(input: {
  objectCount: number;
  layoutPositionCount: number;
  bounds: unknown;
  cameraPosition: [number, number, number];
  lookAt: [number, number, number];
  viewMode: WorkspaceViewMode;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  if (loggedSettledLayoutFrames.has(input.signature)) return;
  loggedSettledLayoutFrames.add(input.signature);
  console.log("[Nexora][CameraBounds][SettledLayoutFrame]", input);
}

export function ExecutiveViewportFramer(props: ExecutiveViewportFramerProps): null {
  const { camera, invalidate, size } = useThree();
  const lastAppliedSignatureRef = useRef<string | null>(null);
  const lastViewModeRef = useRef<WorkspaceViewMode>(props.viewMode);
  const lastExplicitOverrideNonceRef = useRef<number | null>(null);
  const lastInitialLayoutFrameModeRef = useRef<WorkspaceViewMode | null>(null);
  const transitionRef = useRef<ReturnType<typeof createExecutiveCameraTransitionState> | null>(null);

  useEffect(() => {
    if (props.reframeNonce && props.reframeNonce > 0) {
      lastAppliedSignatureRef.current = null;
    }
  }, [props.reframeNonce]);

  useEffect(() => {
    if (lastViewModeRef.current === props.viewMode) return;
    const previousMode = lastViewModeRef.current;
    const controlsTarget = props.controlsRef.current?.target;
    const preserveCenter =
      controlsTarget instanceof THREE.Vector3
        ? ([controlsTarget.x, controlsTarget.y, controlsTarget.z] as [number, number, number])
        : null;
    logExecutiveViewportModeSwitch({
      from: previousMode,
      to: props.viewMode,
      source: "viewport_framer",
      operationalCenter: preserveCenter,
    });
    lastViewModeRef.current = props.viewMode;
    lastAppliedSignatureRef.current = null;
  }, [props.controlsRef, props.viewMode]);

  useFrame((_, delta) => {
    const transition = transitionRef.current;
    if (!transition) return;
    markProgrammaticCameraUpdate(props.programmaticCameraUpdateRef);
    const finished = stepExecutiveCameraTransition(camera, props.controlsRef.current, transition, delta * 1000);
    invalidate();
    if (finished) transitionRef.current = null;
  });

  useEffect(() => {
    if (!props.enabled) {
      devLogOnSignatureChange("[E2:87][Camera]", `static-disabled:${props.viewMode}`, {
        activeMode: props.viewMode,
        skipped: true,
        reason: "viewport_framer_disabled",
      });
      return;
    }
    if (!props.sceneJson?.scene?.objects || !Array.isArray(props.sceneJson.scene.objects)) return;
    if (props.isOrbiting || props.localIsOrbitingRef.current) return;

    const objects = Array.isArray(props.sceneJson.scene.objects) ? props.sceneJson.scene.objects : [];
    const sceneSignature = buildLayoutAwareSceneSignature(props.sceneJson, props.layoutPositions);
    const useOperationalLayout = shouldUseExecutiveOperationalLayout(objects.length);
    const layoutPositionCount = props.layoutPositions ? Object.keys(props.layoutPositions).length : 0;
    const explicitOverrideNonce = props.reframeNonce ?? 0;
    const explicitOverride =
      (props.presetOverride === "FIT_SCENE" || props.presetOverride === "GLOBAL") &&
      explicitOverrideNonce > 0 &&
      lastExplicitOverrideNonceRef.current !== explicitOverrideNonce;
    const hasSettledLayout =
      Boolean(props.layoutBoundsSignature) &&
      props.settledLayoutBoundsSignature === props.layoutBoundsSignature &&
      layoutPositionCount === objects.length;
    if (!explicitOverride && props.layoutBoundsSignature && !hasSettledLayout) return;
    if (
      !explicitOverride &&
      props.layoutBoundsSignature &&
      props.initialLayoutFrameAppliedRef?.current === props.layoutBoundsSignature &&
      lastInitialLayoutFrameModeRef.current === props.viewMode
    ) {
      logCameraAuthorityBlock({
        activeWriter: props.cameraAuthorityRef?.current.activeWriter ?? null,
        blockedWriter: "StaticSceneFramer",
        reason: "initial_layout_frame_already_applied",
        signature: props.layoutBoundsSignature,
      });
      return;
    }
    const framingSignature = `${sceneSignature}|layout:${layoutPositionCount}|${props.viewMode}|${props.reframeNonce ?? 0}|${props.presetOverride ?? "mode"}`;
    if (lastAppliedSignatureRef.current === framingSignature) return;

    const isFitScene = props.presetOverride === "FIT_SCENE";
    const controlsTarget = props.controlsRef.current?.target;
    const preserveCenterFromControls =
      !isFitScene &&
      !useOperationalLayout &&
      controlsTarget instanceof THREE.Vector3
        ? ([controlsTarget.x, controlsTarget.y, controlsTarget.z] as [number, number, number])
        : null;

    const proposedCenter = resolveExecutiveViewportOperationalCenter({
      sceneJson: props.sceneJson,
      viewMode: props.viewMode,
      layoutPositions: props.layoutPositions,
    });
    const blendedCenter = blendOperationalCenter(
      preserveCenterFromControls,
      proposedCenter,
      preserveCenterFromControls ? 0.35 : 0
    );

    const frame = resolveExecutiveViewportCameraFrame({
      sceneJson: props.sceneJson,
      viewMode: props.viewMode,
      viewportWidth: size.width,
      viewportHeight: size.height,
      preserveCenter: isFitScene || useOperationalLayout ? null : blendedCenter,
      presetOverride: props.presetOverride ?? null,
      layoutPositions: props.layoutPositions,
    });
    if (!frame) return;
    logLayoutAwareCameraBoundsOnce({
      objectCount: objects.length,
      layoutPositionCount,
      bounds: frame.bounds ?? null,
      cameraPosition: frame.position,
      lookAt: frame.lookAt,
      viewMode: props.viewMode,
    });
    logVisualBoundsOnce({
      objects,
      bounds: frame.bounds ?? null,
      signature: sceneSignature,
    });

    const modeConfig = resolveExecutiveViewportModeConfig(props.viewMode);
    const preset = props.presetOverride ?? mapWorkspaceViewModeToFramingPreset(props.viewMode);
    const authorityWriter = explicitOverride ? "ExecutiveViewportFramer" : "visual_bounds_frame";
    const transitionSignature = buildExecutiveCameraTransitionSignature({
      preset,
      source: "executive_viewport_framer",
      sceneSignature,
      position: frame.position,
      lookAt: frame.lookAt,
      fov: frame.fov,
    });
    if (
      !claimCameraAuthority({
        authorityRef: props.cameraAuthorityRef,
        writer: authorityWriter,
        signature: transitionSignature,
        reason: explicitOverride ? "clicked_camera_preset" : "viewport_framer",
        override: explicitOverride,
      })
    ) {
      lastAppliedSignatureRef.current = framingSignature;
      return;
    }
    if (explicitOverride) {
      lastExplicitOverrideNonceRef.current = explicitOverrideNonce;
    }

    if (!shouldApplyExecutiveCameraTransition("viewport-framer", transitionSignature)) {
      lastAppliedSignatureRef.current = framingSignature;
      return;
    }
    if (!explicitOverride && props.layoutBoundsSignature) {
      props.initialLayoutFrameAppliedRef!.current = props.layoutBoundsSignature;
      lastInitialLayoutFrameModeRef.current = props.viewMode;
      logSettledLayoutFrameOnce({
        objectCount: objects.length,
        layoutPositionCount,
        bounds: frame.bounds ?? null,
        cameraPosition: frame.position,
        lookAt: frame.lookAt,
        viewMode: props.viewMode,
        signature: props.layoutBoundsSignature,
      });
    }

    transitionRef.current = createExecutiveCameraTransitionState(
      camera,
      props.controlsRef.current,
      {
        position: new THREE.Vector3(...frame.position),
        lookAt: new THREE.Vector3(...frame.lookAt),
        fov: frame.projection === "perspective" ? frame.fov : undefined,
        zoom: frame.projection === "orthographic" ? frame.zoom : undefined,
      },
      modeConfig.transitionDurationMs
    );

    const controls = props.controlsRef.current;
    if (controls?.target instanceof THREE.Vector3) {
      markProgrammaticCameraUpdate(props.programmaticCameraUpdateRef);
      controls.target.set(frame.operationalCenter[0], frame.operationalCenter[1], frame.operationalCenter[2]);
      controls.update?.();
    }
    logCameraWriteOnce({
      writer: authorityWriter,
      objectCount: objects.length,
      preset: explicitOverride ? preset : "visual_bounds_frame",
      focusObjectId: null,
      position: frame.position,
      target: frame.lookAt,
      signature: `${authorityWriter}:${transitionSignature}`,
    });
    logLateCameraWriteOnce({
      writer: authorityWriter,
      reason: explicitOverride ? "explicit_viewport_framer_override" : "settled_visual_bounds_frame",
      objectCount: objects.length,
      layoutSignature: props.layoutBoundsSignature ?? sceneSignature,
      authorityWriter: props.cameraAuthorityRef?.current.activeWriter ?? null,
      position: frame.position,
      target: frame.lookAt,
      blocked: false,
      mountedAtMs: props.mountedAtMs,
      signature: `late_viewport_framer:${authorityWriter}:${transitionSignature}`,
    });

    lastAppliedSignatureRef.current = framingSignature;
    logExecutiveCameraTransition(transitionSignature, {
      preset,
      source: "executive_viewport_framer",
      position: frame.position,
      target: frame.lookAt,
      fov: frame.fov,
      zoom: frame.zoom,
      projection: frame.projection,
    });
    logCameraProfileForMode(props.viewMode);
    validateWorkspaceModeActivation({
      requestedMode: props.viewMode,
      source: "executive_viewport_framer",
      sceneSubscribed: true,
      cameraApplied: true,
    });
    if (props.presetOverride === "FIT_SCENE") {
      logE92FitScene(transitionSignature, {
        viewMode: props.viewMode,
        position: frame.position,
        zoom: frame.zoom,
      });
    }
    if (props.presetOverride === "GLOBAL") {
      logE92GlobalView(transitionSignature, {
        viewMode: props.viewMode,
        position: frame.position,
        zoom: frame.zoom,
      });
    }
    invalidate();
  }, [
    camera,
    invalidate,
    props.controlsRef,
    props.enabled,
    props.initialLayoutFrameAppliedRef,
    props.isOrbiting,
    props.layoutBoundsSignature,
    props.layoutPositions,
    props.cameraAuthorityRef,
    props.localIsOrbitingRef,
    props.presetOverride,
    props.programmaticCameraUpdateRef,
    props.reframeNonce,
    props.sceneJson,
    props.settledLayoutBoundsSignature,
    props.viewMode,
    size.height,
    size.width,
  ]);

  return null;
}

export default ExecutiveViewportFramer;
