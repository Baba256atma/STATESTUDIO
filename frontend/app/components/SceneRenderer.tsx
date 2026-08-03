"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import type { SceneJson, SceneObject, SceneLoop, SceneLoopEdge } from "../lib/sceneTypes";
import { clamp01 } from "../lib/colorUtils";
import { useChatOffset } from "./SceneContext";
import { resolveScannerPrimaryTarget } from "../lib/visual/scannerPrimaryTargetResolver";
import { dedupeNexoraDevLog } from "../lib/debug/panelConsoleTraceDedupe";
import {
  auditExecutiveSceneReadability,
} from "../lib/scene/executiveSceneReadabilityAudit";
import {
  buildSceneObjectScaleAuditSignature,
  logSceneObjectScaleAuditOnce,
} from "../lib/scene/sceneObjectScaleAudit";
import {
  logRawGeometryAuditOnce,
} from "../lib/scene/geometry/rawGeometryAudit";
import {
  resolveObjectNameDensityTier,
  resolveObjectNameDensityProfile,
  shouldRenderExecutiveObjectName,
} from "../lib/scene/objectNameDensityProfile";
import type { PropagationOverlayState } from "../lib/simulation/propagationTypes";
import type { DecisionPathRendererState } from "./overlays/DecisionPathOverlayLayer";
import { traceHighlightFlow } from "../lib/debug/highlightDebugTrace";
import { CALM_FRAMING } from "../lib/scene/calmCameraFraming";
import {
  buildSceneObjectsRegistrySignature,
  resolveStableObjectId,
} from "../lib/scene/objectRegistryRuntime";
import { setSceneRemountContext } from "../lib/scene/sceneRemountContext";
import {
  getWorkspaceViewMode,
  getWorkspaceViewModeServerSnapshot,
  subscribeWorkspaceViewMode,
} from "../lib/workspace/workspaceViewModeRuntime";
import { SceneObjectInstances, type SceneObjectInstancePlan } from "./scene/SceneObjectInstances";
import type { AnimatableObjectProps } from "./scene/AnimatableObject";
import { TopologyConnectionLines } from "./scene/topology/TopologyConnectionLines";
import type { SceneConnectionLine } from "../lib/scene/topology/topologyConnectionTypes";
import {
  buildExecutiveRelationshipExploration,
  readSceneRelationshipEdges,
} from "../lib/scene/interaction/executiveRelationshipExplorationRuntime";
import { LoopLinesAnimated } from "./scene/LoopLinesAnimated";
import { logVisualSelectionAuthorityRejected, normalizeSelectedObjectId } from "../lib/selection/selectionStateGuard";
import { logPayloadReferenceStability } from "../lib/runtime/payloadStabilityAudit";
import { syncSvieHealthVisualization } from "../lib/scene/svie/svieHealthVisualizationRuntime.ts";
import { syncSvieRiskHotspotVisualization } from "../lib/scene/svie/svieRiskHotspotVisualizationRuntime.ts";
import { syncSvieExecutiveRiskAttention } from "../lib/scene/svie/svieExecutiveRiskAttentionRuntime.ts";
import { applyExecutiveAttentionVisualGuidance } from "../lib/scene/svie/svieExecutiveRiskAttentionVisualizationResolver.ts";
import { syncSvieCauseChainVisualization } from "../lib/scene/svie/svieCauseChainVisualizationRuntime.ts";
import { syncSvieRecommendationVisualization } from "../lib/scene/svie/svieRecommendationVisualizationRuntime.ts";
import { syncSvieConfidenceVisualization } from "../lib/scene/svie/svieConfidenceVisualizationRuntime.ts";
import { syncSvieExecutiveStoryLayer } from "../lib/scene/svie/svieExecutiveStoryLayerRuntime.ts";
import { syncFutureStateOverlay } from "../lib/scene/svie/svieFutureStateVisualizationRuntime.ts";
import { syncScenarioDeltaOverlay } from "../lib/scene/svie/svieScenarioDeltaVisualizationRuntime.ts";
import { syncScenarioImpactVisualization } from "../lib/scene/svie/svieScenarioImpactVisualizationRuntime.ts";
import { syncScenarioComparisonLayer } from "../lib/scene/svie/svieScenarioComparisonLayerRuntime.ts";
import { syncScenarioConfidenceLayer } from "../lib/scene/svie/svieScenarioConfidenceLayerRuntime.ts";
import { syncExecutiveFutureStoryLayer } from "../lib/scene/svie/svieExecutiveFutureStoryLayerRuntime.ts";
import { SvieCauseChainOverlay } from "./scene/SvieCauseChainOverlay";
import { SvieExecutiveStoryOverlay } from "./scene/SvieExecutiveStoryOverlay";
import { SvieScenarioImpactChainOverlay } from "./scene/SvieScenarioImpactChainOverlay";
import { SvieExecutiveFutureStoryOverlay } from "./scene/SvieExecutiveFutureStoryOverlay";
const EMPTY_STRING_ARRAY: string[] = [];
const EMPTY_SCENE_ANIMS: unknown[] = [];
const EMPTY_SCENE_LOOPS: SceneLoop[] = [];
const STATIC_VISUAL_FREEZE = true;
const loggedRendererPositionAuditSignatures = new Set<string>();

type SceneObjectTransform = { pos?: unknown; scale?: unknown; rot?: unknown };

function readSceneObjectTransform(object: SceneObject): SceneObjectTransform {
  const transform = object.transform;
  return transform && typeof transform === "object" && !Array.isArray(transform)
    ? (transform as SceneObjectTransform)
    : {};
}

function readSceneObjectPosition(object: SceneObject, fallback: [number, number, number]): [number, number, number] {
  const transform = readSceneObjectTransform(object);
  return toPosTuple(transform.pos ?? object.position ?? object.pos, fallback);
}

type SceneLightConfig = {
  type?: string;
  intensity?: number;
  pos?: [number, number, number] | number[];
};

function readVec3Components(position: unknown): { x: number; y: number; z: number } | null {
  if (!position || typeof position !== "object") return null;
  const record = position as Record<string, unknown>;
  const x = Number(record.x);
  const y = Number(record.y);
  const z = Number(record.z);
  return Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z) ? { x, y, z } : null;
}

function readNestedRecord(source: unknown, ...path: string[]): Record<string, unknown> | null {
  let current: unknown = source;
  for (const key of path) {
    if (!current || typeof current !== "object") return null;
    current = (current as Record<string, unknown>)[key];
  }
  return current && typeof current === "object" && !Array.isArray(current)
    ? (current as Record<string, unknown>)
    : null;
}

function readProductModeId(sceneJson: SceneJson): string {
  const productMode = sceneJson.product_mode;
  if (productMode && typeof productMode === "object") {
    const modeId = (productMode as Record<string, unknown>).mode_id;
    if (typeof modeId === "string" && modeId.trim()) return modeId.trim();
  }
  const metaModeId = sceneJson.meta?.product_mode_id;
  return typeof metaModeId === "string" ? metaModeId.trim() : "";
}

function readSceneFragilityScore(sceneJson: SceneJson): number {
  const sceneRecord = sceneJson.scene as Record<string, unknown>;
  const scannerState = sceneRecord.scanner_state_vector;
  if (scannerState && typeof scannerState === "object") {
    const score = (scannerState as Record<string, unknown>).fragility_score;
    if (typeof score === "number") return score;
  }
  const topScore = sceneJson.state_vector?.fragility_score;
  if (typeof topScore === "number") return topScore;
  return 0;
}

function buildSceneObjectRenderSignature(object: SceneObject, index: number): string {
  return JSON.stringify({
    stableId: resolveStableObjectId(object, index),
    id: object?.id ?? null,
    name: object?.name ?? null,
    label: object?.label ?? null,
    type: object?.type ?? null,
    position: object?.position ?? null,
    pos: object?.pos ?? null,
    transform: readSceneObjectTransform(object),
    color: object?.color ?? null,
    scale: object?.scale ?? null,
    emphasis: object?.emphasis ?? null,
    material: object?.material ?? null,
    tags: object?.tags ?? null,
    role: object?.role ?? null,
    canonical_name: object?.canonical_name ?? null,
    display_label: object?.display_label ?? null,
    category: object?.category ?? null,
    domain: object?.domain ?? null,
    risk_kind: object?.risk_kind ?? null,
    scanner_highlighted: object?.scanner_highlighted ?? null,
    scanner_severity: object?.scanner_severity ?? null,
    scanner_emphasis: object?.scanner_emphasis ?? null,
    scanner_focus: object?.scanner_focus ?? null,
    ux: object?.ux ?? null,
  });
}

function buildSceneObjectsRenderSignature(objects: SceneObject[]): string {
  if (!Array.isArray(objects) || objects.length === 0) return "empty";
  return objects.map((object, index) => buildSceneObjectRenderSignature(object, index)).join("|");
}

function readRendererAuditPosition(
  object: SceneObject,
  stableId: string,
  layoutPositions?: Record<string, [number, number, number]>
): [number, number, number] | null {
  const raw =
    layoutPositions?.[stableId] ??
    (object.id ? layoutPositions?.[String(object.id)] : undefined) ??
    (object.name ? layoutPositions?.[String(object.name)] : undefined) ??
    readSceneObjectTransform(object).pos ??
    object.position;
  if (!Array.isArray(raw) || raw.length < 3) return null;
  return [Number(raw[0]) || 0, Number(raw[1]) || 0, Number(raw[2]) || 0];
}

// --------------------
// Auto color / intensity helpers
// --------------------

function resolveDecisionCenter(objects: SceneObject[], primaryId: string | null): [number, number, number] {
  if (!primaryId) return [0, 0, 0];
  const primaryIndex = objects.findIndex((object, idx) => {
    const stableId = String(object?.id ?? `${object?.type ?? "obj"}:${idx}`);
    const stableIdWithName = String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`);
    return primaryId === stableId || primaryId === stableIdWithName;
  });
  if (primaryIndex < 0) return [0, 0, 0];
  const primaryObject = objects[primaryIndex];
  const defaultPos = fallbackPos(primaryIndex, objects.length);
  return readSceneObjectPosition(primaryObject, defaultPos);
}

function resolveStableObjectPosition(objects: SceneObject[], objectId: string | null): [number, number, number] | null {
  if (!objectId) return null;
  const objectIndex = objects.findIndex((object, idx) => {
    const stableId = String(object?.id ?? `${object?.type ?? "obj"}:${idx}`);
    const stableIdWithName = String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`);
    return objectId === stableId || objectId === stableIdWithName;
  });
  if (objectIndex < 0) return null;
  const object = objects[objectIndex];
  const defaultPos = fallbackPos(objectIndex, objects.length);
  return readSceneObjectPosition(object, defaultPos);
}

function resolveSceneCenter(objects: SceneObject[]): [number, number, number] {
  if (objects.length === 0) return [0, 0, 0];
  const total = objects.reduce<[number, number, number]>((acc, object, idx) => {
    const defaultPos = fallbackPos(idx, objects.length);
    const pos = readSceneObjectPosition(object, defaultPos);
    return [acc[0] + pos[0], acc[1] + pos[1], acc[2] + pos[2]];
  }, [0, 0, 0]);
  return [total[0] / objects.length, total[1] / objects.length, total[2] / objects.length];
}

type ScannerStoryReveal = {
  primary: number;
  edge: number;
  affected: number;
  context: number;
};

type InteractionRole = "primary" | "affected" | "context" | "neutral";
type NarrativeNodeRole = "primary" | "affected" | "context" | "outside";

type AttentionMemorySource = "hover" | "selected" | "scanner_primary";
type AttentionMemoryEntry = {
  id: string;
  role: InteractionRole;
  timestamp: number;
  source: AttentionMemorySource;
};

function resolveInteractionRole(params: {
  isScannerPrimary: boolean;
  causalityRole: string;
}): InteractionRole {
  if (params.isScannerPrimary) return "primary";
  if (params.causalityRole === "affected") return "affected";
  if (params.causalityRole === "related_context") return "context";
  return "neutral";
}

function getAttentionMemoryLifetime(source: AttentionMemorySource): number {
  if (source === "selected") return 2400;
  if (source === "scanner_primary") return 2800;
  return 1400;
}

function writeAttentionMemory(
  store: Map<string, AttentionMemoryEntry>,
  entry: AttentionMemoryEntry
) {
  if (!entry.id || entry.role === "neutral") return;
  const existing = store.get(entry.id);
  const sourcePriority = entry.source === "selected" ? 3 : entry.source === "scanner_primary" ? 2 : 1;
  const existingPriority =
    existing?.source === "selected" ? 3 : existing?.source === "scanner_primary" ? 2 : existing?.source === "hover" ? 1 : 0;
  if (existing && existingPriority > sourcePriority && existing.timestamp >= entry.timestamp - 400) {
    store.set(entry.id, { ...existing, timestamp: entry.timestamp });
    return;
  }
  store.set(entry.id, entry);
}

function pruneAttentionMemory(store: Map<string, AttentionMemoryEntry>, now: number) {
  let changed = false;
  store.forEach((entry, key) => {
    if (now - entry.timestamp > getAttentionMemoryLifetime(entry.source)) {
      store.delete(key);
      changed = true;
    }
  });
  return changed;
}

function getAttentionMemoryStrength(entry: AttentionMemoryEntry | undefined, now: number): number {
  if (!entry) return 0;
  const lifetime = getAttentionMemoryLifetime(entry.source);
  const age = Math.max(0, now - entry.timestamp);
  if (age >= lifetime) return 0;
  const roleWeight =
    entry.role === "primary"
      ? 1
      : entry.role === "affected"
      ? 0.72
      : entry.role === "context"
      ? 0.5
      : 0.28;
  const sourceWeight =
    entry.source === "selected"
      ? 0.9
      : entry.source === "scanner_primary"
      ? 0.74
      : 0.56;
  const decay = 1 - age / lifetime;
  const easedDecay = decay * decay * (3 - 2 * decay);
  return clamp01(roleWeight * sourceWeight * easedDecay);
}

function getCameraMicroFocusProfile(role: InteractionRole) {
  const biasStrength =
    role === "primary"
      ? CALM_FRAMING.biasStrength.primary
      : role === "affected"
      ? CALM_FRAMING.biasStrength.affected
      : role === "context"
      ? CALM_FRAMING.biasStrength.context
      : CALM_FRAMING.biasStrength.neutral;
  return {
    biasStrength,
    distanceBias: role === "primary" ? -0.01 : role === "affected" ? -0.004 : 0,
    verticalBias: role === "primary" ? 0.02 : role === "affected" ? 0.01 : role === "context" ? 0.004 : 0,
  };
}

function resolveNarrativeFocusPath(params: {
  selectedId: string | null;
  hoveredId: string | null;
  scannerPrimaryId: string | null;
  scannerAffectedIds: string[];
  scannerContextIds: string[];
  edges: Array<{ from: string; to: string }>;
  attentionMemory: Map<string, AttentionMemoryEntry>;
  attentionMemoryStrengthById: Map<string, number>;
}): {
  primaryId: string | null;
  affectedIds: string[];
  contextIds: string[];
  pathEdges: Array<{ from: string; to: string }>;
} {
  const {
    selectedId,
    hoveredId,
    scannerPrimaryId,
    scannerAffectedIds,
    scannerContextIds,
    edges,
    attentionMemory,
    attentionMemoryStrengthById,
  } = params;

  const primaryId =
    selectedId ??
    hoveredId ??
    scannerPrimaryId ??
    Array.from(attentionMemory.entries())
      .map(([id, entry]) => ({
        id,
        score:
          (attentionMemoryStrengthById.get(id) ?? 0) *
          (entry.role === "primary" ? 1 : entry.role === "affected" ? 0.72 : entry.role === "context" ? 0.46 : 0.18),
      }))
      .sort((a, b) => b.score - a.score)[0]?.id ??
    null;

  if (!primaryId) {
    return { primaryId: null, affectedIds: [], contextIds: [], pathEdges: [] };
  }

  const neighborMap = new Map<string, Set<string>>();
  edges.forEach((edge) => {
    if (!neighborMap.has(edge.from)) neighborMap.set(edge.from, new Set<string>());
    if (!neighborMap.has(edge.to)) neighborMap.set(edge.to, new Set<string>());
    neighborMap.get(edge.from)?.add(edge.to);
    neighborMap.get(edge.to)?.add(edge.from);
  });

  const affectedIds = Array.from(
    new Set(
      (scannerAffectedIds.length > 0 ? scannerAffectedIds : Array.from(neighborMap.get(primaryId) ?? [])).filter(
        (id) => id && id !== primaryId
      )
    )
  );
  const contextIds = Array.from(
    new Set(
      (
        scannerContextIds.length > 0
          ? scannerContextIds
          : affectedIds.flatMap((affectedId) =>
              Array.from(neighborMap.get(affectedId) ?? []).filter(
                (id) => id && id !== primaryId && !affectedIds.includes(id)
              )
            )
      ).filter((id) => id && id !== primaryId && !affectedIds.includes(id))
    )
  );

  const narrativeIdSet = new Set<string>([primaryId, ...affectedIds, ...contextIds]);
  const pathEdges = edges.filter((edge) => narrativeIdSet.has(edge.from) && narrativeIdSet.has(edge.to));

  return { primaryId, affectedIds, contextIds, pathEdges };
}

function resolveNarrativeFocusStrength(params: {
  isSelected: boolean;
  isHovered: boolean;
  attentionMemoryStrength: number;
  scannerActive: boolean;
  timeSinceInteraction: number;
}): number {
  const idleFade = 1 - clamp01(params.timeSinceInteraction / 2.8);
  if (params.isSelected) return 1;
  if (params.isHovered) return 0.62 + idleFade * 0.18;
  if (params.attentionMemoryStrength > 0) {
    return clamp01(0.14 + params.attentionMemoryStrength * 0.34 + (params.scannerActive ? 0.08 : 0));
  }
  return params.scannerActive ? 0.18 : 0;
}

function traceNarrativeFocus(payload: {
  primaryId: string | null;
  affectedCount: number;
  contextCount: number;
  strength: number;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  const { signature, ...rest } = payload;
  dedupeNexoraDevLog("[Nexora][NarrativeFocus]", signature, rest);
}

function buildNarrativeFocusSignature(input: {
  focusedId: string | null;
  highlightedIds: string[];
  sceneVersion?: number | null;
  strength: number;
}) {
  return JSON.stringify({
    f: input.focusedId ?? null,
    h: input.highlightedIds.slice(0, 5),
    v: input.sceneVersion ?? null,
    s: Number(input.strength.toFixed(3)),
  });
}

function resolveCameraIntelligenceTarget(params: {
  hoveredId: string | null;
  selectedId: string | null;
  resolvedPrimaryRenderId: string | null;
  decisionCenter: [number, number, number];
  sceneCenter: [number, number, number];
  objects: SceneObject[];
  roleById: (id: string | null) => InteractionRole;
}): {
  target: [number, number, number];
  role: InteractionRole;
  kind: "hover" | "selected" | "primary" | "decision_center" | "scene_center";
} {
  const {
        selectedId,
    resolvedPrimaryRenderId,
    decisionCenter,
    sceneCenter,
    objects,
    roleById,
  } = params;

  // Calm camera policy: hover never drives camera target.

  const selectedRole = roleById(selectedId);
  if (selectedId && selectedRole !== "neutral") {
    const selectedPosition = resolveStableObjectPosition(objects, selectedId);
    if (selectedPosition) {
      return { target: selectedPosition, role: selectedRole, kind: "selected" };
    }
  }

  if (resolvedPrimaryRenderId) {
    const primaryPosition = resolveStableObjectPosition(objects, resolvedPrimaryRenderId);
    if (primaryPosition) {
      return { target: primaryPosition, role: "primary", kind: "primary" };
    }
  }

  if (decisionCenter[0] !== 0 || decisionCenter[1] !== 0 || decisionCenter[2] !== 0) {
    return { target: decisionCenter, role: "affected", kind: "decision_center" };
  }

  return { target: sceneCenter, role: "neutral", kind: "scene_center" };
}

function smoothRamp(elapsed: number, start: number, end: number): number {
  if (elapsed <= start) return 0;
  if (elapsed >= end) return 1;
  const t = clamp01((elapsed - start) / Math.max(0.0001, end - start));
  return t * t * (3 - 2 * t);
}

function normalizeSemanticKey(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^obj_+/, "")
    .replace(/_\d+$/, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function buildSceneIdentityMap(objects: SceneObject[]): Map<string, string> {
  const identityMap = new Map<string, string>();
  objects.forEach((object, idx) => {
    const stableId = String(object?.id ?? `${object?.type ?? "obj"}:${idx}`);
    const stableIdWithName = String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`);
    const candidates = [object?.id, object?.name, stableId, stableIdWithName];
    candidates.forEach((candidate) => {
      if (typeof candidate !== "string" || candidate.trim().length === 0) return;
      const normalized = normalizeSemanticKey(candidate);
      if (!normalized || identityMap.has(normalized)) return;
      identityMap.set(normalized, stableId);
    });
  });
  return identityMap;
}

function resolveIdsAgainstScene(candidateIds: string[], objects: SceneObject[]): string[] {
  const exactIds = new Set(
    objects
      .map((object, idx) => String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`))
      .filter(Boolean)
  );
  const identityMap = buildSceneIdentityMap(objects);
  const resolved = new Set<string>();

  candidateIds.forEach((candidateId) => {
    if (typeof candidateId !== "string" || candidateId.length === 0) return;
    if (exactIds.has(candidateId)) {
      resolved.add(candidateId);
      return;
    }
    const normalized = normalizeSemanticKey(candidateId);
    if (!normalized) return;
    const mapped = identityMap.get(normalized);
    if (mapped) resolved.add(mapped);
  });

  return Array.from(resolved);
}

function readStringArrayField(source: Record<string, unknown> | null | undefined, field: string): string[] {
  if (!source || !Array.isArray(source[field])) return EMPTY_STRING_ARRAY;
  const values = source[field]
    .map((value: unknown) => String(value ?? "").trim())
    .filter(Boolean);
  return values.length > 0 ? values : EMPTY_STRING_ARRAY;
}

function fallbackPos(index: number, total: number): [number, number, number] {
  const n = Math.max(1, total);
  const radius = Math.max(2.5, n * 0.12);
  const angle = (index / n) * Math.PI * 2;
  return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
}

function toPosTuple(
  raw: unknown,
  fallback: [number, number, number]
): [number, number, number] {
  if (Array.isArray(raw) && raw.length >= 3) {
    const x = Number(raw[0]);
    const y = Number(raw[1]);
    const z = Number(raw[2]);
    if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) {
      return [x, y, z];
    }
  }
  if (raw && typeof raw === "object") {
    const vec = readVec3Components(raw);
    if (vec) return [vec.x, vec.y, vec.z];
  }
  return fallback;
}

// --------------------
// Lights
// --------------------
function JsonLights({ sceneJson, shadowsEnabled }: { sceneJson: SceneJson; shadowsEnabled: boolean }) {
  const workspaceViewMode = useSyncExternalStore(
    subscribeWorkspaceViewMode,
    getWorkspaceViewMode,
    getWorkspaceViewModeServerSnapshot
  );
  // If lights are missing in JSON, fallback
  const lights = sceneJson.scene?.lights ?? [];
  if (lights.length === 0) {
    if (workspaceViewMode === "2D") {
      return (
        <>
          <ambientLight intensity={0.58} color="#eef2ff" />
          <directionalLight position={[3, 9, 5]} intensity={0.52} color="#f8fafc" />
        </>
      );
    }
    return (
      <>
        <ambientLight intensity={0.36} color="#cbd5e1" />
        <directionalLight
          position={[5, 8, 6]}
          intensity={0.68}
          color="#f1f5f9"
          castShadow={shadowsEnabled}
        />
        <directionalLight position={[-4, 5, -3]} intensity={0.18} color="#94a3b8" />
        <pointLight position={[0, 3.5, 2.5]} intensity={0.22} color="#e2e8f0" />
      </>
    );
  }

  return (
    <>
      {(sceneJson.scene?.lights ?? []).map((light, i) => {
        const l = (light && typeof light === "object" ? light : {}) as SceneLightConfig;
        if (l.type === "ambient") return <ambientLight key={i} intensity={l.intensity ?? 0.6} />;
        if (l.type === "directional")
          return (
            <directionalLight
              key={i}
              position={(Array.isArray(l.pos) ? l.pos : [5, 8, 3]) as [number, number, number]}
              intensity={l.intensity ?? 0.9}
              castShadow={shadowsEnabled}
            />
          );
        if (l.type === "point")
          return (
            <pointLight
              key={i}
              position={(Array.isArray(l.pos) ? l.pos : [0, 5, 0]) as [number, number, number]}
              intensity={l.intensity ?? 1.0}
            />
          );
        return null;
      })}
    </>
  );
}

// --------------------
// Camera helper
// --------------------
function CameraLerper({
  target,
  lookAtTarget = [0, 0, 0],
  enabled = true,
  motionCalm = false,
}: {
  target: [number, number, number];
  lookAtTarget?: [number, number, number];
  enabled?: boolean;
  motionCalm?: boolean;
}) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(...target));
  const lookAtRef = useRef(new THREE.Vector3(...lookAtTarget));
  const lastCameraSignatureRef = useRef<string | null>(null);
  const alpha = motionCalm ? CALM_FRAMING.lerperAlphaMotionCalm : CALM_FRAMING.lerperAlpha;
  useEffect(() => {
    targetRef.current.set(...target);
  }, [target]);
  useEffect(() => {
    lookAtRef.current.set(...lookAtTarget);
  }, [lookAtTarget]);
  useFrame(() => {
    if (!enabled) return;
    camera.position.lerp(targetRef.current, alpha);
    camera.lookAt(lookAtRef.current);
    if (process.env.NODE_ENV !== "production") {
      const position = camera.position.toArray().map((v) => Number(v.toFixed(4))) as [number, number, number];
      const targetArr = [lookAtRef.current.x, lookAtRef.current.y, lookAtRef.current.z].map((v) => Number(v.toFixed(4))) as [
        number,
        number,
        number
      ];
      const signature = JSON.stringify({
        position,
        target: targetArr,
        reason: "camera_lerper_enabled",
      });
      if (lastCameraSignatureRef.current !== signature) {
        lastCameraSignatureRef.current = signature;
        console.debug("[Nexora][CameraChanged]", {
          position,
          target: targetArr,
          reason: "camera_lerper_enabled",
        });
      }
    }
  });
  return null;
}

export type SceneRendererProps = {
  sceneJson: SceneJson | null;
  objectSelection?: {
    highlighted_objects?: string[];
    risk_sources?: string[];
    risk_targets?: string[];
    dim_unrelated_objects?: boolean;
  } | null;
  selectedObjectId?: string | null;
  shadowsEnabled?: boolean;
  focusMode?: "all" | "selected" | "pinned";
  focusedId?: string | null;
  theme?: "day" | "night" | "stars";
  getUxForObject?: (id: string) => { shape?: string; base_color?: string } | null;
  objectUxById?: Record<string, { opacity?: number; scale?: number }>;
  loops?: SceneLoop[];
  showLoops?: boolean;
  showLoopLabels?: boolean;
  activeLoopId?: string | null;
  globalScale?: number;
  showObjectDebugLabels?: boolean;
  showExecutiveLayoutLabels?: boolean;
  layoutPositions?: Record<string, [number, number, number]>;
  layoutLabelOffsets?: Record<string, { y: number; opacity: number }>;
  propagationOverlay?: PropagationOverlayState | null;
  decisionPathOverlay?: DecisionPathRendererState | null;
  /** Softer hover emphasis + throttled pointer updates (Settings → Motion low). */
  motionCalm?: boolean;
  onObjectPositionChange?: (
    objectId: string,
    position: { x: number; y: number; z: number },
    phase: "drag" | "move"
  ) => void;
  onObjectUserClick?: (objectId: string, eventId: string) => void;
  topologyConnectionLines?: SceneConnectionLine[];
  topologyConnectionLinesVisible?: boolean;
  topologyConnectionSelectedObjectId?: string | null;
  runtimeObjectPositionContext?: import("./scene/sceneRenderUtils").RuntimeObjectPositionContext;
};

// --------------------
// Main renderer
// --------------------
type SceneRendererBodyProps = Omit<SceneRendererProps, "sceneJson"> & {
  sceneJson: SceneJson;
};

function SceneRendererComponent(props: SceneRendererProps) {
  if (!props.sceneJson) return null;
  return <SceneRendererBody {...props} sceneJson={props.sceneJson} />;
}

function SceneRendererBody({
  sceneJson,
  objectSelection,
  selectedObjectId,
  shadowsEnabled,
  focusMode,
  focusedId,
  theme,
  getUxForObject,
  objectUxById,
  loops,
  showLoops,
  showLoopLabels = false,
  activeLoopId: propActiveLoopId,
  globalScale = 1,
  showObjectDebugLabels = false,
  showExecutiveLayoutLabels = false,
  layoutPositions,
  layoutLabelOffsets,
  propagationOverlay = null,
  decisionPathOverlay = null,
  motionCalm = false,
  onObjectPositionChange,
  onObjectUserClick,
  topologyConnectionLines = [],
  topologyConnectionLinesVisible = false,
  topologyConnectionSelectedObjectId = null,
  runtimeObjectPositionContext,
}: SceneRendererBodyProps) {
  const payloadRenderCountRef = useRef(0);
  useEffect(() => {
    payloadRenderCountRef.current += 1;
    if (process.env.NODE_ENV !== "production") {
      logPayloadReferenceStability({
        owner: "SceneRenderer",
        renderCount: payloadRenderCountRef.current,
        consumer: "SceneRenderer",
        payloads: {
          sceneJson,
          loops,
          effectiveActiveLoopId: propActiveLoopId,
          resolvedUiTheme: theme,
          hudThemeMode: theme,
          propagationPayload: propagationOverlay,
        },
      });
    }
  }, [sceneJson, loops, propActiveLoopId, theme, propagationOverlay]);

  const stableGlobalScale = useMemo(() => globalScale, [globalScale]);
  const chatOffset = useChatOffset();
  const canonicalSelectedObjectId = normalizeSelectedObjectId(selectedObjectId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const rawObjects = sceneJson.scene?.objects ?? [];
  const objectsRegistrySignature = useMemo(
    () => buildSceneObjectsRegistrySignature(rawObjects),
    [rawObjects]
  );
  const objectsRenderSignature = useMemo(
    () => buildSceneObjectsRenderSignature(rawObjects),
    [rawObjects]
  );
  const stableObjects = useMemo(() => {
    if (!Array.isArray(rawObjects) || rawObjects.length === 0) return [];
    return rawObjects.map((object) => object);
  }, [objectsRenderSignature, rawObjects]);
  const stableObjectIds = useMemo(
    () => stableObjects.map((object, index) => resolveStableObjectId(object, index)),
    [objectsRegistrySignature, stableObjects]
  );
  const objects = stableObjects;
  const svieHealthVisualization = useMemo(
    () =>
      syncSvieHealthVisualization({
        sceneJson,
        selectedObjectId: canonicalSelectedObjectId,
      }),
    [sceneJson, objectsRegistrySignature, canonicalSelectedObjectId]
  );
  const svieRiskHotspotVisualization = useMemo(
    () => syncSvieRiskHotspotVisualization({ sceneJson }),
    [sceneJson, objectsRegistrySignature]
  );
  const svieExecutiveRiskAttention = useMemo(
    () => syncSvieExecutiveRiskAttention({ sceneJson }),
    [sceneJson, objectsRegistrySignature]
  );
  const svieRiskHotspotVisualByObjectId = useMemo(
    () => applyExecutiveAttentionVisualGuidance(svieRiskHotspotVisualization, svieExecutiveRiskAttention),
    [svieRiskHotspotVisualization, svieExecutiveRiskAttention]
  );
  const svieCauseChainVisualization = useMemo(
    () => syncSvieCauseChainVisualization({ sceneJson }),
    [sceneJson, objectsRegistrySignature]
  );
  const svieRecommendationVisualization = useMemo(
    () => syncSvieRecommendationVisualization({ sceneJson }),
    [sceneJson, objectsRegistrySignature]
  );
  const svieConfidenceVisualization = useMemo(
    () => syncSvieConfidenceVisualization({ sceneJson }),
    [sceneJson, objectsRegistrySignature]
  );
  const svieExecutiveStoryLayer = useMemo(
    () => syncSvieExecutiveStoryLayer({ sceneJson }),
    [sceneJson, objectsRegistrySignature]
  );
  const svieFutureStateOverlay = useMemo(
    () => syncFutureStateOverlay({ sceneJson }),
    [sceneJson, objectsRegistrySignature]
  );
  const svieScenarioDeltaOverlay = useMemo(
    () => syncScenarioDeltaOverlay({ sceneJson }),
    [sceneJson, objectsRegistrySignature]
  );
  const svieScenarioImpactVisualization = useMemo(
    () => syncScenarioImpactVisualization({ sceneJson }),
    [sceneJson, objectsRegistrySignature]
  );
  const svieScenarioComparisonLayer = useMemo(
    () => syncScenarioComparisonLayer({ sceneJson }),
    [sceneJson, objectsRegistrySignature]
  );
  const svieScenarioConfidenceLayer = useMemo(
    () => syncScenarioConfidenceLayer({ sceneJson }),
    [sceneJson, objectsRegistrySignature]
  );
  const svieExecutiveFutureStoryLayer = useMemo(
    () => syncExecutiveFutureStoryLayer({ sceneJson }),
    [sceneJson, objectsRegistrySignature]
  );
  const payload = sceneJson;
  const hasExplicitObjectSelection = !!objectSelection && typeof objectSelection === "object";
  const highlightedIds = useMemo(
    () => (canonicalSelectedObjectId ? [canonicalSelectedObjectId] : []),
    [canonicalSelectedObjectId]
  );
  const highlightedObjectId = canonicalSelectedObjectId;
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const staleVisualId = highlightedIds.find((id) => id !== canonicalSelectedObjectId);
    if (!staleVisualId) return;
    logVisualSelectionAuthorityRejected({
      attemptedObjectId: staleVisualId,
      canonicalSelectedId: canonicalSelectedObjectId ?? null,
      source: "SceneRenderer.highlightedIds",
    });
  }, [canonicalSelectedObjectId, highlightedIds]);
  const sceneRenderSignature = useMemo(() => {
    const semanticObjects = objects
      .map((object, idx) => {
        const stableId = String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`);
        const semantic = (object as { semantic?: { role?: unknown } })?.semantic;
        return {
          id: stableId,
          severity: String((object as { severity?: unknown; scanner_severity?: unknown })?.severity ?? (object as { scanner_severity?: unknown })?.scanner_severity ?? ""),
          state: String((object as { state?: unknown; status?: unknown })?.state ?? (object as { status?: unknown })?.status ?? ""),
          role: String((object as { role?: unknown })?.role ?? semantic?.role ?? ""),
          selected: stableId === canonicalSelectedObjectId,
        };
      })
      .sort((a, b) => a.id.localeCompare(b.id));
    return JSON.stringify({
      objects: semanticObjects,
      selectedObjectId: canonicalSelectedObjectId,
      highlightedObjectId,
    });
  }, [canonicalSelectedObjectId, highlightedObjectId, objects]);
  const lastSceneRenderSignatureRef = useRef<string | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (lastSceneRenderSignatureRef.current === sceneRenderSignature) return;
    lastSceneRenderSignatureRef.current = sceneRenderSignature;
    console.debug("[Nexora][SceneRenderSignatureChanged]", {
      signature: sceneRenderSignature.slice(0, 240),
    });
  }, [sceneRenderSignature]);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const objectCount = objects.length;
    if (objectCount === 0) return;
    const densityProfile = resolveObjectNameDensityProfile(objectCount);
    let visibleNameCount = 0;
    for (let index = 0; index < objectCount; index += 1) {
      if (
        shouldRenderExecutiveObjectName({
          profile: densityProfile,
          selected: canonicalSelectedObjectId === String(objects[index]?.id ?? objects[index]?.name ?? ""),
          focused: false,
          index,
        })
      ) {
        visibleNameCount += 1;
      }
    }
    auditExecutiveSceneReadability({
      objectCount,
      visibleNameCount,
      legacyTooltipCount: 0,
      selectedObjectId: canonicalSelectedObjectId,
      densityTier: resolveObjectNameDensityTier(objectCount),
    });
  }, [canonicalSelectedObjectId, objects]);

  const sceneScaleAuditSignatureRef = useRef<string | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !sceneJson) return;
    const signature = buildSceneObjectScaleAuditSignature(sceneJson);
    if (sceneScaleAuditSignatureRef.current === signature) return;
    sceneScaleAuditSignatureRef.current = signature;
    logSceneObjectScaleAuditOnce(sceneJson);
    logRawGeometryAuditOnce(sceneJson);
  }, [sceneJson]);
  const objectSelectionRiskSourceIds = useMemo(
    () => readStringArrayField(objectSelection ?? null, "risk_sources"),
    [objectSelection]
  );
  const objectSelectionRiskTargetIds = useMemo(
    () => readStringArrayField(objectSelection ?? null, "risk_targets"),
    [objectSelection]
  );
  const payloadRiskSourceIds = useMemo(
    () => readStringArrayField(readNestedRecord(payload, "object_selection"), "risk_sources"),
    [payload]
  );
  const payloadRiskTargetIds = useMemo(
    () => readStringArrayField(readNestedRecord(payload, "object_selection"), "risk_targets"),
    [payload]
  );
  const payloadSceneRiskSourceIds = useMemo(
    () => readStringArrayField(readNestedRecord(payload, "scene_json", "object_selection"), "risk_sources"),
    [payload]
  );
  const payloadSceneRiskTargetIds = useMemo(
    () => readStringArrayField(readNestedRecord(payload, "scene_json", "object_selection"), "risk_targets"),
    [payload]
  );
  const resolvedRiskSourceIds = useMemo(
    () =>
      resolveIdsAgainstScene(
        hasExplicitObjectSelection
          ? objectSelectionRiskSourceIds
          : Array.from(
              new Set([
                ...objectSelectionRiskSourceIds,
                ...payloadRiskSourceIds,
                ...payloadSceneRiskSourceIds,
              ])
            ),
        objects
      ),
    [hasExplicitObjectSelection, objectSelectionRiskSourceIds, objects, payloadRiskSourceIds, payloadSceneRiskSourceIds]
  );
  const resolvedRiskTargetIds = useMemo(
    () =>
      resolveIdsAgainstScene(
        hasExplicitObjectSelection
          ? objectSelectionRiskTargetIds
          : Array.from(
              new Set([
                ...objectSelectionRiskTargetIds,
                ...payloadRiskTargetIds,
                ...payloadSceneRiskTargetIds,
              ])
            ),
        objects
      ),
    [hasExplicitObjectSelection, objectSelectionRiskTargetIds, objects, payloadRiskTargetIds, payloadSceneRiskTargetIds]
  );
  const objectSelectionDimRequested = Boolean(objectSelection?.dim_unrelated_objects === true);
  const payloadObjectSelectionDim =
    readNestedRecord(payload, "object_selection")?.dim_unrelated_objects === true;
  const payloadSceneObjectSelectionDim =
    readNestedRecord(payload, "scene_json", "object_selection")?.dim_unrelated_objects === true;
  const scannerDimRequested =
    hasExplicitObjectSelection
      ? objectSelectionDimRequested
      : objectSelectionDimRequested || payloadObjectSelectionDim || payloadSceneObjectSelectionDim;
  const sceneObjectIds = useMemo(
    () =>
      stableObjects
        .map((object, idx) => resolveStableObjectId(object, idx))
        .filter(Boolean),
    [stableObjects]
  );
  const sceneObjectIdSet = useMemo(() => new Set(sceneObjectIds), [sceneObjectIds]);
  const sceneIdentityMap = useMemo(() => buildSceneIdentityMap(stableObjects), [stableObjects]);
  const focusIdentitySet = useMemo(() => {
    const identities = new Set<string>();
    stableObjects.forEach((object, idx) => {
      const stableId = resolveStableObjectId(object, idx);
      const objectId = typeof object?.id === "string" && object.id.length > 0 ? object.id : null;
      const objectName = typeof object?.name === "string" && object.name.length > 0 ? object.name : null;
      identities.add(stableId);
      if (objectId) identities.add(objectId);
      if (objectName) identities.add(objectName);
    });
    return identities;
  }, [stableObjects]);
  const hasValidFocusedTarget = useMemo(
    () => typeof focusedId === "string" && focusedId.length > 0 && focusIdentitySet.has(focusedId),
    [focusIdentitySet, focusedId]
  );
  const visualCandidateIds = useMemo(() => {
    const ordered = [
      ...(canonicalSelectedObjectId ? [canonicalSelectedObjectId] : []),
      ...objectSelectionRiskSourceIds,
      ...objectSelectionRiskTargetIds,
      ...payloadRiskSourceIds,
      ...payloadRiskTargetIds,
      ...payloadSceneRiskSourceIds,
      ...payloadSceneRiskTargetIds,
    ];
    return Array.from(new Set(ordered));
  }, [
    canonicalSelectedObjectId,
    objectSelectionRiskSourceIds,
    objectSelectionRiskTargetIds,
    payloadRiskSourceIds,
    payloadRiskTargetIds,
    payloadSceneRiskSourceIds,
    payloadSceneRiskTargetIds,
  ]);
  const scannerTargetResolution = useMemo(() => {
    const flaggedIds = objects
      .map((object, idx) =>
        object?.scanner_highlighted === true
          ? String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`)
          : null
      )
      .filter((id): id is string => !!id);
    const candidateIds = Array.from(new Set([...visualCandidateIds, ...flaggedIds]));
    const resolvedIds = resolveIdsAgainstScene(candidateIds, objects);
    const usedFallback = candidateIds.some((id) => {
      if (sceneObjectIdSet.has(id)) return false;
      const normalized = normalizeSemanticKey(id);
      return !!normalized && sceneIdentityMap.has(normalized);
    });
    return { candidateIds, resolvedIds, usedFallback };
  }, [objects, sceneIdentityMap, sceneObjectIdSet, visualCandidateIds]);
  const scannerTargetIds = scannerTargetResolution.resolvedIds;
  const scannerSceneActive = scannerTargetIds.length > 0;
  const primaryResolverFocusedId = null;
  const scannerFragilityScore = clamp01(readSceneFragilityScore(sceneJson));
  const scannerPrimaryResolution = useMemo(
    () =>
      resolveScannerPrimaryTarget({
        highlightedIds: canonicalSelectedObjectId ? [canonicalSelectedObjectId] : [],
        resolvedRiskSourceIds,
        resolvedRiskTargetIds,
        scannerTargetIds,
        focusedId: primaryResolverFocusedId,
        sceneObjectIds,
      }),
    [
      primaryResolverFocusedId,
      canonicalSelectedObjectId,
      resolvedRiskSourceIds,
      resolvedRiskTargetIds,
      scannerTargetIds,
      sceneObjectIds,
    ]
  );
  const scannerPrimaryTargetId = scannerPrimaryResolution.primaryTargetId;
  const resolvedPrimaryRenderId = useMemo(() => {
    if (!scannerPrimaryTargetId) return null;
    if (sceneObjectIdSet.has(scannerPrimaryTargetId)) return scannerPrimaryTargetId;

    const normalized = normalizeSemanticKey(scannerPrimaryTargetId);
    if (!normalized) return null;

    return sceneIdentityMap.get(normalized) ?? null;
  }, [scannerPrimaryTargetId, sceneObjectIdSet, sceneIdentityMap]);
  const resolvedLabelOwnerId = useMemo(() => {
    if (resolvedPrimaryRenderId) return resolvedPrimaryRenderId;
    if (scannerTargetIds.length > 0) return scannerTargetIds[0] ?? null;
    return null;
  }, [resolvedPrimaryRenderId, scannerTargetIds]);
  const scannerStoryKey = scannerSceneActive
    ? `${resolvedPrimaryRenderId ?? resolvedLabelOwnerId ?? "none"}:${scannerTargetIds.join("|")}`
    : "inactive";
  const STATIC_SCANNER_REVEAL: ScannerStoryReveal = {
    primary: 1,
    edge: 1,
    affected: 1,
    context: 1,
  };
  const HIDDEN_SCANNER_REVEAL: ScannerStoryReveal = {
    primary: 0,
    edge: 0,
    affected: 0,
    context: 0,
  };
  const [scannerStoryRevealState, setScannerStoryRevealState] = useState<{
    key: string;
    reveal: ScannerStoryReveal;
  }>({ key: scannerStoryKey, reveal: HIDDEN_SCANNER_REVEAL });
  const scannerStoryReveal =
    STATIC_VISUAL_FREEZE || !scannerSceneActive
      ? STATIC_SCANNER_REVEAL
      : scannerStoryRevealState.key === scannerStoryKey
        ? scannerStoryRevealState.reveal
        : HIDDEN_SCANNER_REVEAL;
  useEffect(() => {
    if (STATIC_VISUAL_FREEZE || !scannerSceneActive) return;

    let frameId = 0;
    const start = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      const nextReveal = {
        primary: smoothRamp(elapsed, 0.0, 0.22),
        edge: smoothRamp(elapsed, 0.12, 0.42),
        affected: smoothRamp(elapsed, 0.28, 0.62),
        context: smoothRamp(elapsed, 0.46, 0.85),
      };
      setScannerStoryRevealState((prev) => {
        if (
          prev.key === scannerStoryKey &&
          prev.reveal.primary === nextReveal.primary &&
          prev.reveal.edge === nextReveal.edge &&
          prev.reveal.affected === nextReveal.affected &&
          prev.reveal.context === nextReveal.context
        ) {
          return prev;
        }
        return { key: scannerStoryKey, reveal: nextReveal };
      });
      if (
        nextReveal.primary < 1 ||
        nextReveal.edge < 1 ||
        nextReveal.affected < 1 ||
        nextReveal.context < 1
      ) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [scannerSceneActive, scannerStoryKey]);
  const decisionCenter = useMemo(
    () => resolveDecisionCenter(objects, resolvedPrimaryRenderId),
    [objects, resolvedPrimaryRenderId]
  );
  const sceneCenter = useMemo(() => resolveSceneCenter(stableObjects), [stableObjects]);
  const affectedTargetIds = scannerPrimaryResolution.affectedTargetIds;
  const contextTargetIds = scannerPrimaryResolution.contextTargetIds;
  const scannerPrimaryRole = scannerPrimaryResolution.primaryRole;
  const scannerPrimaryLabelTitle = scannerPrimaryResolution.primaryLabelTitle;
  const scannerPrimaryLabelBody = scannerPrimaryResolution.primaryLabelBody;
  const roleById = useMemo(
    () => (id: string | null): InteractionRole => {
      if (!id) return "neutral";
      if (id === resolvedPrimaryRenderId) return "primary";
      if (affectedTargetIds.includes(id)) return "affected";
      if (contextTargetIds.includes(id)) return "context";
      return "neutral";
    },
    [affectedTargetIds, contextTargetIds, resolvedPrimaryRenderId]
  );
  const cameraIntelligence = useMemo(
    () =>
      resolveCameraIntelligenceTarget({
        hoveredId,
        selectedId: canonicalSelectedObjectId,
        resolvedPrimaryRenderId,
        decisionCenter,
        sceneCenter,
        objects,
        roleById,
      }),
    [canonicalSelectedObjectId, decisionCenter, hoveredId, objects, resolvedPrimaryRenderId, roleById, sceneCenter]
  );
  // Strict calm camera rule: renderer-level camera bias only follows explicit selection.
  const cameraBiasTarget = cameraIntelligence.kind === "selected" ? cameraIntelligence.target : null;
  const rawSceneAnims = sceneJson.scene?.animations ?? null;
  const anims = useMemo(
    () => (Array.isArray(rawSceneAnims) ? rawSceneAnims : EMPTY_SCENE_ANIMS),
    [rawSceneAnims]
  );
  const rawSceneLoops = sceneJson.scene?.loops;
  const loopList: SceneLoop[] = useMemo(
    () => (Array.isArray(loops) ? loops : Array.isArray(rawSceneLoops) ? rawSceneLoops : EMPTY_SCENE_LOOPS),
    [loops, rawSceneLoops]
  );
  const activeLoopId: string | null =
    propActiveLoopId ??
    (typeof sceneJson.scene?.active_loop === "string" ? sceneJson.scene.active_loop : null) ??
    (typeof sceneJson.scene?.activeLoopId === "string" ? sceneJson.scene.activeLoopId : null) ??
    null;
  const relationshipEdges = useMemo(() => readSceneRelationshipEdges(sceneJson), [sceneJson]);
  const relationshipExploration = useMemo(
    () =>
      buildExecutiveRelationshipExploration({
        selectedObjectId: canonicalSelectedObjectId,
        relationships: relationshipEdges,
      }),
    [canonicalSelectedObjectId, relationshipEdges]
  );
  const relatedObjectIdsById = useMemo(() => {
    const relationMap = new Map<string, Set<string>>();
    loopList.forEach((loop) => {
      if (!Array.isArray(loop?.edges)) return;
      loop.edges.forEach((edge: SceneLoopEdge) => {
        const from = String(edge?.from ?? "").trim();
        const to = String(edge?.to ?? "").trim();
        if (!from || !to) return;
        if (!relationMap.has(from)) relationMap.set(from, new Set<string>());
        if (!relationMap.has(to)) relationMap.set(to, new Set<string>());
        relationMap.get(from)?.add(to);
        relationMap.get(to)?.add(from);
      });
    });
    relationshipEdges.forEach(({ sourceId, targetId }) => {
      if (!relationMap.has(sourceId)) relationMap.set(sourceId, new Set<string>());
      if (!relationMap.has(targetId)) relationMap.set(targetId, new Set<string>());
      relationMap.get(sourceId)?.add(targetId);
      relationMap.get(targetId)?.add(sourceId);
    });
    return relationMap;
  }, [loopList, relationshipEdges]);
  const neighborIdsByStableId = useMemo(() => {
    const result = new Map<string, string[]>();
    stableObjects.forEach((object, idx) => {
      const stableId = resolveStableObjectId(object, idx);
      const neighbors = Array.from(
        new Set([
          ...Array.from(relatedObjectIdsById.get(stableId) ?? []),
          ...Array.from(relatedObjectIdsById.get(String(object.name ?? "")) ?? []),
        ])
      );
      result.set(stableId, neighbors);
    });
    return result;
  }, [relatedObjectIdsById, stableObjects]);
  const hoveredInteractionRole = resolveInteractionRole({
    isScannerPrimary: !!hoveredId && hoveredId === resolvedPrimaryRenderId,
    causalityRole:
      hoveredId && affectedTargetIds.includes(hoveredId)
        ? "affected"
        : hoveredId && contextTargetIds.includes(hoveredId)
        ? "related_context"
        : "neutral",
  });
  const selectedSemanticId = canonicalSelectedObjectId;
  const attentionMemoryRef = useRef<Map<string, AttentionMemoryEntry>>(new Map());
  const [attentionMemoryNow, setAttentionMemoryNow] = useState(() => Date.now());
  const [attentionMemorySnap, setAttentionMemorySnap] = useState(
    () => new Map<string, AttentionMemoryEntry>()
  );
  const syncAttentionMemorySnap = useCallback((now = Date.now()) => {
    setAttentionMemorySnap(new Map(attentionMemoryRef.current));
    setAttentionMemoryNow(now);
  }, []);
  useEffect(() => {
    if (!hoveredId || hoveredInteractionRole === "neutral") return;
    writeAttentionMemory(attentionMemoryRef.current, {
      id: hoveredId,
      role: hoveredInteractionRole,
      timestamp: Date.now(),
      source: "hover",
    });
    syncAttentionMemorySnap();
  }, [hoveredId, hoveredInteractionRole, syncAttentionMemorySnap]);
  useEffect(() => {
    const selectedId = selectedSemanticId;
    if (!selectedId) return;
    const selectedRole = roleById(selectedId);
    if (selectedRole === "neutral") return;
    writeAttentionMemory(attentionMemoryRef.current, {
      id: selectedId,
      role: selectedRole,
      timestamp: Date.now(),
      source: "selected",
    });
    syncAttentionMemorySnap();
  }, [roleById, selectedSemanticId, syncAttentionMemorySnap]);
  useEffect(() => {
    if (!scannerSceneActive || !resolvedPrimaryRenderId) return;
    writeAttentionMemory(attentionMemoryRef.current, {
      id: resolvedPrimaryRenderId,
      role: "primary",
      timestamp: Date.now(),
      source: "scanner_primary",
    });
    syncAttentionMemorySnap();
  }, [resolvedPrimaryRenderId, scannerSceneActive, syncAttentionMemorySnap]);
  useEffect(() => {
    if (attentionMemoryRef.current.size === 0) return;
    let timerId = 0;
    const tick = () => {
      const now = Date.now();
      const changed = pruneAttentionMemory(attentionMemoryRef.current, now);
      if (changed || attentionMemoryRef.current.size > 0) {
        syncAttentionMemorySnap(now);
      }
      if (attentionMemoryRef.current.size > 0) {
        timerId = window.setTimeout(tick, 120);
      }
    };
    timerId = window.setTimeout(tick, 120);
    return () => window.clearTimeout(timerId);
  }, [attentionMemoryNow, syncAttentionMemorySnap]);
  const attentionMemoryStrengthById = useMemo(() => {
    const strengths = new Map<string, number>();
    attentionMemorySnap.forEach((entry, id) => {
      const strength = getAttentionMemoryStrength(entry, attentionMemoryNow);
      if (strength > 0) strengths.set(id, strength);
    });
    return strengths;
  }, [attentionMemoryNow, attentionMemorySnap]);
  const loopEdges = useMemo(
    () =>
      loopList.flatMap((loop) =>
        Array.isArray(loop?.edges)
          ? loop.edges
              .map((edge: SceneLoopEdge) => ({
                from: String(edge?.from ?? "").trim(),
                to: String(edge?.to ?? "").trim(),
                weight:
                  typeof edge?.weight === "number"
                    ? edge.weight
                    : typeof loop?.strength === "number"
                    ? loop.strength
                    : undefined,
              }))
              .filter((edge) => edge.from && edge.to)
          : []
      ),
    [loopList]
  );
  const strongestAttentionMemory = useMemo(
    () =>
      Array.from(attentionMemoryStrengthById.entries()).reduce(
        (best, [id, strength]) => (strength > best.strength ? { id, strength } : best),
        { id: null as string | null, strength: 0 }
      ),
    [attentionMemoryStrengthById]
  );
  const narrativeFocusPath = useMemo(
    () =>
      resolveNarrativeFocusPath({
        selectedId: selectedSemanticId,
        hoveredId,
        scannerPrimaryId: resolvedPrimaryRenderId,
        scannerAffectedIds: affectedTargetIds,
        scannerContextIds: contextTargetIds,
        edges: loopEdges,
        attentionMemory: attentionMemorySnap,
        attentionMemoryStrengthById,
      }),
    [
      affectedTargetIds,
      attentionMemorySnap,
      attentionMemoryStrengthById,
      contextTargetIds,
      hoveredId,
      loopEdges,
      resolvedPrimaryRenderId,
      selectedSemanticId,
    ]
  );
  const narrativeFocusStrength = useMemo(
    () =>
      resolveNarrativeFocusStrength({
        isSelected: typeof selectedSemanticId === "string" && selectedSemanticId.length > 0,
        isHovered: typeof hoveredId === "string" && hoveredId.length > 0,
        attentionMemoryStrength: strongestAttentionMemory.strength,
        scannerActive: scannerSceneActive,
        timeSinceInteraction: strongestAttentionMemory.strength > 0 ? 0 : 2.8,
      }),
    [hoveredId, scannerSceneActive, selectedSemanticId, strongestAttentionMemory.strength]
  );
  const narrativeFocusRoleById = useMemo(
    () => (id: string | null): NarrativeNodeRole => {
      if (!id) return "outside";
      if (narrativeFocusPath.primaryId && id === narrativeFocusPath.primaryId) return "primary";
      if (narrativeFocusPath.affectedIds.includes(id)) return "affected";
      if (narrativeFocusPath.contextIds.includes(id)) return "context";
      return "outside";
    },
    [narrativeFocusPath]
  );
  const narrativeCentroid = useMemo<[number, number, number]>(() => {
    const ids = [
      narrativeFocusPath.primaryId,
      ...narrativeFocusPath.affectedIds,
      ...narrativeFocusPath.contextIds,
    ].filter((id): id is string => !!id);
    if (ids.length === 0) return sceneCenter;
    const positions = ids
      .map((id) => resolveStableObjectPosition(objects, id))
      .filter((pos): pos is [number, number, number] => !!pos);
    if (positions.length === 0) return sceneCenter;
    const total = positions.reduce<[number, number, number]>(
      (acc, pos) => [acc[0] + pos[0], acc[1] + pos[1], acc[2] + pos[2]],
      [0, 0, 0]
    );
    return [total[0] / positions.length, total[1] / positions.length, total[2] / positions.length];
  }, [narrativeFocusPath, objects, sceneCenter]);
  const normalizedPropagationOverlay = useMemo(() => {
    if (!propagationOverlay?.active) return null;
    const nodeStrengthById = (propagationOverlay.impacted_nodes ?? []).reduce<Record<string, number>>((acc, impact) => {
      const objectId = String(impact?.object_id ?? "").trim();
      if (!objectId) return acc;
      acc[objectId] = Math.max(acc[objectId] ?? 0, clamp01(Number(impact?.strength ?? 0)));
      return acc;
    }, {});
    const pathEdges = (propagationOverlay.impacted_edges ?? [])
      .map((edge) => ({
        from: String(edge?.from ?? "").trim(),
        to: String(edge?.to ?? "").trim(),
        depth: Math.max(1, Number(edge?.depth ?? 1)),
        strength: clamp01(Number(edge?.strength ?? 0)),
      }))
      .filter((edge) => edge.from && edge.to);
    return {
      sourceId: propagationOverlay.source_object_id,
      pathEdges,
      nodeStrengthById,
      mode: propagationOverlay.mode,
    };
  }, [propagationOverlay]);
  const effectivePropagationSourceId = normalizedPropagationOverlay?.sourceId ?? null;
  const effectivePropagationPathEdges = normalizedPropagationOverlay?.pathEdges ?? [];
  const effectivePropagationNodeStrengthById = normalizedPropagationOverlay?.nodeStrengthById ?? {};
  const effectivePropagationMode = normalizedPropagationOverlay?.mode ?? null;
  const lastNarrativeFocusTraceRef = useRef<string | null>(null);
  const lastPropagationOverlayTraceRef = useRef<string | null>(null);
  const effectivePropagationSourceStrength = useMemo(() => {
    if (effectivePropagationSourceId && effectivePropagationNodeStrengthById[effectivePropagationSourceId] != null) {
      return effectivePropagationNodeStrengthById[effectivePropagationSourceId];
    }
    return 0;
  }, [effectivePropagationNodeStrengthById, effectivePropagationSourceId]);
  const decisionPathNodeStrengthById = decisionPathOverlay?.nodeStrengthById ?? {};
  const decisionPathNodeRoleById = decisionPathOverlay?.nodeRoleById ?? {};
  const decisionPathNodeVisualHintsById = decisionPathOverlay?.nodeVisualHintsById ?? {};
  const decisionPathEdges = decisionPathOverlay?.edges ?? [];
  const decisionPathSourceId = decisionPathOverlay?.sourceId ?? null;
  const simulationCentroid = useMemo<[number, number, number]>(() => {
    const ids = Object.keys(effectivePropagationNodeStrengthById);
    if (ids.length === 0) return narrativeCentroid;
    const positions = ids
      .map((id) => resolveStableObjectPosition(objects, id))
      .filter((pos): pos is [number, number, number] => !!pos);
    if (positions.length === 0) return narrativeCentroid;
    const total = positions.reduce<[number, number, number]>(
      (acc, pos) => [acc[0] + pos[0], acc[1] + pos[1], acc[2] + pos[2]],
      [0, 0, 0]
    );
    return [total[0] / positions.length, total[1] / positions.length, total[2] / positions.length];
  }, [effectivePropagationNodeStrengthById, narrativeCentroid, objects]);
  useEffect(() => {
    const signature = buildNarrativeFocusSignature({
      focusedId: narrativeFocusPath.primaryId ?? null,
      highlightedIds: [...narrativeFocusPath.affectedIds, ...narrativeFocusPath.contextIds],
      sceneVersion: typeof sceneJson?.version === "number" ? sceneJson.version : null,
      strength: narrativeFocusStrength,
    });
    if (lastNarrativeFocusTraceRef.current === signature) {
      return;
    }
    lastNarrativeFocusTraceRef.current = signature;
    traceNarrativeFocus({
      primaryId: narrativeFocusPath.primaryId,
      affectedCount: narrativeFocusPath.affectedIds.length,
      contextCount: narrativeFocusPath.contextIds.length,
      strength: narrativeFocusStrength,
      signature,
    });
  }, [
    narrativeFocusPath.primaryId,
    narrativeFocusPath.affectedIds,
    narrativeFocusPath.contextIds,
    narrativeFocusStrength,
    sceneJson?.version,
  ]);
  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !effectivePropagationSourceId) return;
    const signature = JSON.stringify({
      sourceId: effectivePropagationSourceId,
      impactedCount: Object.keys(effectivePropagationNodeStrengthById).length,
      edgeCount: effectivePropagationPathEdges.length,
      mode: effectivePropagationMode,
    });
    if (lastPropagationOverlayTraceRef.current === signature) {
      return;
    }
    lastPropagationOverlayTraceRef.current = signature;
    console.debug("[Nexora][PropagationOverlay]", {
      sourceId: effectivePropagationSourceId,
      impactedCount: Object.keys(effectivePropagationNodeStrengthById).length,
      edgeCount: effectivePropagationPathEdges.length,
      mode: effectivePropagationMode,
    });
  }, [
    effectivePropagationMode,
    effectivePropagationNodeStrengthById,
    effectivePropagationPathEdges.length,
    effectivePropagationSourceId,
  ]);
  const cameraLookAtTarget = useMemo<[number, number, number]>(() => {
    const baseTarget = !cameraBiasTarget
      ? sceneCenter
      : (() => {
          const focusProfile = getCameraMicroFocusProfile(cameraIntelligence.role);
          const storyStrength =
            cameraIntelligence.kind === "primary"
              ? scannerStoryReveal.primary
              : cameraIntelligence.kind === "hover" || cameraIntelligence.kind === "selected"
              ? Math.max(scannerStoryReveal.primary, scannerStoryReveal.affected * 0.85)
              : scannerStoryReveal.context;
          const kindBoost = 0;
          const biasStrength = clamp01(focusProfile.biasStrength * (0.88 + storyStrength * 0.12) + kindBoost);
          return [
            sceneCenter[0] + (cameraBiasTarget[0] - sceneCenter[0]) * biasStrength,
            sceneCenter[1] + (cameraBiasTarget[1] + focusProfile.verticalBias - sceneCenter[1]) * biasStrength,
            sceneCenter[2] + (cameraBiasTarget[2] + focusProfile.distanceBias - sceneCenter[2]) * biasStrength,
          ] as [number, number, number];
        })();
    if (narrativeFocusStrength <= 0 || !narrativeFocusPath.primaryId) return baseTarget;
    const narrativeTarget =
      resolveStableObjectPosition(objects, narrativeFocusPath.primaryId) ?? narrativeCentroid;
    const narrativeBias = clamp01(
      narrativeFocusStrength *
        (narrativeFocusRoleById(narrativeFocusPath.primaryId) === "primary"
          ? CALM_FRAMING.narrativeBiasPrimary
          : CALM_FRAMING.narrativeBiasOther)
    );
    const narrativeTargetLookAt: [number, number, number] = [
      baseTarget[0] + (narrativeTarget[0] - baseTarget[0]) * narrativeBias,
      baseTarget[1] + (narrativeCentroid[1] - baseTarget[1]) * narrativeBias,
      baseTarget[2] + (narrativeCentroid[2] - baseTarget[2]) * narrativeBias,
    ];
    if (!effectivePropagationSourceId) return narrativeTargetLookAt;
    const simulationTarget = resolveStableObjectPosition(objects, effectivePropagationSourceId) ?? simulationCentroid;
    const simulationBias = clamp01((effectivePropagationSourceStrength || 0) * CALM_FRAMING.simulationBiasScale);
    return [
      narrativeTargetLookAt[0] + (simulationTarget[0] - narrativeTargetLookAt[0]) * simulationBias,
      narrativeTargetLookAt[1] + (simulationCentroid[1] - narrativeTargetLookAt[1]) * simulationBias,
      narrativeTargetLookAt[2] + (simulationCentroid[2] - narrativeTargetLookAt[2]) * simulationBias,
    ];
  }, [cameraBiasTarget, cameraIntelligence.kind, cameraIntelligence.role, effectivePropagationSourceId, effectivePropagationSourceStrength, narrativeCentroid, narrativeFocusPath.primaryId, narrativeFocusRoleById, narrativeFocusStrength, objects, scannerStoryReveal.affected, scannerStoryReveal.context, scannerStoryReveal.primary, sceneCenter, simulationCentroid]);
  const visualModeId: string | undefined = readProductModeId(sceneJson) || undefined;

  const animMap = useMemo(() => {
    const m = new Map<string | undefined, AnimatableObjectProps["anim"]>();
    for (const entry of anims) {
      if (!entry || typeof entry !== "object") continue;
      const record = entry as Record<string, unknown>;
      const target = record.target != null ? String(record.target) : "";
      if (!target) continue;
      const type = record.type;
      if (type !== "pulse" && type !== "wobble" && type !== "spin") continue;
      m.set(target, {
        type,
        intensity: Number(record.intensity) || 0,
      });
    }
    return m;
  }, [anims]);

  const cam = sceneJson.scene?.camera;

  const camPos: [number, number, number] =
    Array.isArray(cam?.pos) && cam!.pos.length >= 3
      ? [Number(cam!.pos[0]) || 0, Number(cam!.pos[1]) || 3, Number(cam!.pos[2]) || 8]
      : [0, 3, 8];
  const cameraLocked = !!sceneJson.meta?.cameraLockedByUser;
  const shouldUseCameraBias = STATIC_VISUAL_FREEZE ? false : !cameraLocked && !!cameraBiasTarget;
  const parallaxGroup = useRef<THREE.Group>(null);
  const lastSceneTargetResolutionSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const sortIds = (ids: string[]) => [...ids].sort((a, b) => a.localeCompare(b));
      const normPayload = (v: unknown) =>
        Array.isArray(v) ? sortIds(v.map(String).filter(Boolean)) : null;
      const payloadObjectSelection = readNestedRecord(payload, "object_selection");
      const payloadSceneObjectSelection = readNestedRecord(payload, "scene_json", "object_selection");
      const payloadContextObjectSelection = readNestedRecord(payload, "context", "object_selection");
      const signature = JSON.stringify({
        payloadHighlighted: normPayload(payloadObjectSelection?.highlighted_objects),
        sceneHighlighted: normPayload(payloadSceneObjectSelection?.highlighted_objects),
        contextHighlighted: normPayload(payloadContextObjectSelection?.highlighted_objects),
        highlightedIds: sortIds(highlightedIds.map(String)),
        scannerTargetIds: sortIds(scannerTargetIds.map(String)),
      });
      if (lastSceneTargetResolutionSignatureRef.current === signature) {
        return;
      }
      lastSceneTargetResolutionSignatureRef.current = signature;
      console.groupCollapsed("[Nexora][SceneTargetResolution]");
      console.log("payload.object_selection.highlighted_objects", payloadObjectSelection?.highlighted_objects);
      console.log(
        "payload.scene_json.object_selection.highlighted_objects",
        payloadSceneObjectSelection?.highlighted_objects
      );
      console.log(
        "payload.context.object_selection.highlighted_objects",
        payloadContextObjectSelection?.highlighted_objects
      );
      console.log("highlightedIds", highlightedIds);
      console.log("SCANNER TARGET IDS:", scannerTargetIds);
      console.groupEnd();
    }
  }, [highlightedIds, payload, scannerTargetIds]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (visualCandidateIds.length === 0) return;
    if (scannerTargetIds.length > 0 && !scannerTargetResolution.usedFallback) return;

    traceHighlightFlow("scene_canvas", {
      highlightedIds,
      riskSourceIds: [
        ...objectSelectionRiskSourceIds,
        ...payloadRiskSourceIds,
        ...payloadSceneRiskSourceIds,
      ],
      riskTargetIds: [
        ...objectSelectionRiskTargetIds,
        ...payloadRiskTargetIds,
        ...payloadSceneRiskTargetIds,
      ],
      focusedId: focusedId ?? null,
      visualCandidateIds,
      resolvedScannerTargetIds: scannerTargetIds,
      resolvedRiskSourceIds,
      resolvedRiskTargetIds,
      primaryTargetId: scannerPrimaryTargetId,
      affectedTargetIds,
      contextTargetIds,
      primaryReason: scannerPrimaryResolution.reason,
      scannerSceneActive,
      sceneObjectIds,
      sceneIdentityKeys: Array.from(sceneIdentityMap.keys()).slice(0, 12),
      usedFallbackResolution: scannerTargetResolution.usedFallback,
    });
  }, [
    focusedId,
    highlightedIds,
    objectSelectionRiskSourceIds,
    objectSelectionRiskTargetIds,
    payloadRiskSourceIds,
    payloadRiskTargetIds,
    payloadSceneRiskSourceIds,
    payloadSceneRiskTargetIds,
    scannerPrimaryResolution.reason,
    resolvedRiskSourceIds,
    resolvedRiskTargetIds,
    scannerPrimaryTargetId,
    affectedTargetIds,
    contextTargetIds,
    scannerSceneActive,
    scannerTargetIds,
    scannerTargetResolution.usedFallback,
    sceneIdentityMap,
    sceneObjectIds,
    visualCandidateIds,
  ]);

  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" ||
      typeof focusedId !== "string" ||
      focusedId.length === 0 ||
      hasValidFocusedTarget
    ) {
      return;
    }

    traceHighlightFlow("scene_canvas", {
      focusMode: focusMode ?? null,
      focusedId,
      sceneObjectIds: Array.from(focusIdentitySet),
      hasValidFocusedTarget,
    });
  }, [focusIdentitySet, focusMode, focusedId, hasValidFocusedTarget]);

  useEffect(() => {
    const g = parallaxGroup.current;
    if (!g) return;
    const cx = typeof chatOffset?.x === "number" ? chatOffset.x : 0;
    const cy = typeof chatOffset?.y === "number" ? chatOffset.y : 0;
    // Calm scene: keep parallax static, no frame-by-frame drift.
    g.position.x = -cx * 0.9;
    g.position.y = cy * 0.6;
  }, [chatOffset?.x, chatOffset?.y]);

  const sceneObjectInstancePlanSignature = useMemo(
    () =>
      JSON.stringify({
        objectsRegistrySignature,
        focusedId: focusedId ?? null,
        focusMode: focusMode ?? null,
        hasValidFocusedTarget,
        theme: theme ?? null,
        visualModeId,
        globalScale: stableGlobalScale,
        shadowsEnabled: !!shadowsEnabled,
        motionCalm: !!motionCalm,
        hoveredId,
        hoveredInteractionRole,
        scannerSceneActive,
        scannerFragilityScore,
        scannerPrimaryTargetId,
        resolvedPrimaryRenderId,
        resolvedLabelOwnerId,
        scannerPrimaryRole,
        scannerPrimaryLabelTitle,
        scannerPrimaryLabelBody,
        scannerTargetIds,
        scannerDimRequested,
        affectedTargetIds,
        contextTargetIds,
        resolvedRiskSourceIds,
        resolvedRiskTargetIds,
        scannerStoryReveal,
        narrativeFocusStrength,
        decisionPathSourceId,
        effectivePropagationSourceId,
        sceneObjectCount: stableObjects.length,
        relationshipExplorationActive: relationshipExploration.active,
        showObjectDebugLabels,
        showExecutiveLayoutLabels,
        layoutPositions,
        layoutLabelOffsets,
      }),
    [
      affectedTargetIds,
      contextTargetIds,
      decisionPathSourceId,
      effectivePropagationSourceId,
      focusedId,
      focusMode,
      stableGlobalScale,
      hasValidFocusedTarget,
      hoveredId,
      hoveredInteractionRole,
      motionCalm,
      narrativeFocusStrength,
      objectsRegistrySignature,
      relationshipExploration.active,
      resolvedLabelOwnerId,
      resolvedPrimaryRenderId,
      resolvedRiskSourceIds,
      resolvedRiskTargetIds,
      scannerFragilityScore,
      scannerPrimaryLabelBody,
      scannerPrimaryLabelTitle,
      scannerPrimaryRole,
      scannerPrimaryTargetId,
      scannerSceneActive,
      scannerDimRequested,
      scannerStoryReveal,
      scannerTargetIds,
      shadowsEnabled,
      showExecutiveLayoutLabels,
      showObjectDebugLabels,
      layoutPositions,
      layoutLabelOffsets,
      stableObjects.length,
      theme,
      visualModeId,
    ]
  );

  const sceneObjectInstancePlans = useMemo(() => {
    const plans = new Map<string, SceneObjectInstancePlan>();
    stableObjects.forEach((object, idx) => {
      const stableId = resolveStableObjectId(object, idx);
      const objectKey = String(object.id ?? object.name ?? stableId);
      plans.set(stableId, {
        shadowsEnabled: !!shadowsEnabled,
        focusMode,
        focusedId: focusedId ?? null,
        hasValidFocusedTarget,
        theme: theme ?? "night",
        getUxForObject,
        objectUxById,
        globalScale: stableGlobalScale,
        modeId: visualModeId,
        scannerSceneActive,
        scannerFragilityScore,
        scannerPrimaryTargetId,
        resolvedPrimaryRenderId,
        labelOwnerId: resolvedLabelOwnerId,
        decisionCenter,
        scannerPrimaryRole,
        scannerPrimaryLabelTitle,
        scannerPrimaryLabelBody,
        scannerTargetIds,
        dimUnrelatedObjects: scannerDimRequested,
        affectedTargetIds,
        contextTargetIds,
        riskSourceIds: resolvedRiskSourceIds,
        riskTargetIds: resolvedRiskTargetIds,
        scannerStoryReveal,
        hoveredId,
        hoveredInteractionRole,
        setHoveredId,
        motionCalm,
        neighborIds: neighborIdsByStableId.get(stableId) ?? EMPTY_STRING_ARRAY,
        attentionMemoryStrength: Math.max(
          attentionMemoryStrengthById.get(stableId) ?? 0,
          attentionMemoryStrengthById.get(String(object.id ?? "")) ?? 0,
          attentionMemoryStrengthById.get(String(object.name ?? "")) ?? 0
        ),
        narrativeFocusStrength,
        narrativeFocusRole: narrativeFocusRoleById(objectKey),
        simulationStrength: Math.max(
          effectivePropagationNodeStrengthById[String(object.id ?? "")] ?? 0,
          effectivePropagationNodeStrengthById[String(object.name ?? "")] ?? 0,
          effectivePropagationNodeStrengthById[String(stableId)] ?? 0
        ),
        isSimulationSource:
          !!effectivePropagationSourceId &&
          (effectivePropagationSourceId === String(object.id ?? "") ||
            effectivePropagationSourceId === String(object.name ?? "") ||
            effectivePropagationSourceId === String(stableId)),
        decisionPathStrength: Math.max(
          decisionPathNodeStrengthById[String(object.id ?? "")] ?? 0,
          decisionPathNodeStrengthById[String(object.name ?? "")] ?? 0,
          decisionPathNodeStrengthById[String(stableId)] ?? 0
        ),
        decisionPathRole:
          decisionPathNodeRoleById[String(object.id ?? "")] ??
          decisionPathNodeRoleById[String(object.name ?? "")] ??
          decisionPathNodeRoleById[String(stableId)] ??
          "outside",
        decisionPathVisualHints:
          decisionPathNodeVisualHintsById[String(object.id ?? "")] ??
          decisionPathNodeVisualHintsById[String(object.name ?? "")] ??
          decisionPathNodeVisualHintsById[String(stableId)],
        isDecisionPathSource:
          !!decisionPathSourceId &&
          (decisionPathSourceId === String(object.id ?? "") ||
            decisionPathSourceId === String(object.name ?? "") ||
            decisionPathSourceId === String(stableId)),
        sceneScale: stableGlobalScale,
        sceneObjectCount: stableObjects.length,
        onObjectPositionChange,
        onObjectUserClick,
        showObjectDebugLabels,
        showExecutiveLayoutLabels,
        layoutPositions,
        layoutLabelOffsets,
      });
    });
    return plans;
  }, [sceneObjectInstancePlanSignature, stableObjects]);

  const sceneRemountContext = useMemo(
    () => ({
      parentSignature: `SceneRenderer:${stableObjects.length}`,
      visibleObjectsSignature: objectsRegistrySignature,
      selectedObjectId: canonicalSelectedObjectId,
      viewMode: visualModeId ?? null,
    }),
    [canonicalSelectedObjectId, objectsRegistrySignature, stableObjects.length, visualModeId]
  );
  useEffect(() => {
    setSceneRemountContext(sceneRemountContext);
  }, [sceneRemountContext]);

  const rendererPositionAuditRows = useMemo(
    () =>
      stableObjects.map((object, index) => {
        const stableId = stableObjectIds[index] ?? resolveStableObjectId(object, index);
        return {
          id: stableId,
          position: readRendererAuditPosition(object, stableId, layoutPositions),
        };
      }),
    [layoutPositions, stableObjectIds, stableObjects]
  );
  const rendererPositionAuditSignature = useMemo(
    () =>
      JSON.stringify(
        rendererPositionAuditRows.map((row) => ({
          id: row.id,
          position: row.position?.map((value) => Math.round(value * 1000) / 1000) ?? null,
        }))
      ),
    [rendererPositionAuditRows]
  );
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (loggedRendererPositionAuditSignatures.has(rendererPositionAuditSignature)) return;
    loggedRendererPositionAuditSignatures.add(rendererPositionAuditSignature);
    rendererPositionAuditRows.forEach((row) => {
      console.debug("[Nexora][RendererPositionAudit]", {
        id: row.id,
        position: row.position,
      });
    });
  }, [rendererPositionAuditRows, rendererPositionAuditSignature]);

  return (
    <>
      <CameraLerper
        target={camPos}
        lookAtTarget={cameraLookAtTarget}
        enabled={shouldUseCameraBias}
        motionCalm={motionCalm === true}
      />
      <JsonLights sceneJson={sceneJson} shadowsEnabled={!!shadowsEnabled} />
      <group ref={parallaxGroup}>
        <SceneObjectInstances
          stableObjects={stableObjects}
          stableObjectIds={stableObjectIds}
          instancePlansById={sceneObjectInstancePlans}
          animMap={animMap}
          layoutPositions={layoutPositions}
          layoutLabelOffsets={layoutLabelOffsets}
          showObjectDebugLabels={showObjectDebugLabels}
          showExecutiveLayoutLabels={showExecutiveLayoutLabels}
          selectedObjectId={canonicalSelectedObjectId}
          svieHealthVisualByObjectId={svieHealthVisualization.visualByObjectId}
          svieRiskHotspotVisualByObjectId={svieRiskHotspotVisualByObjectId}
          svieCauseChainNodeVisualByObjectId={svieCauseChainVisualization.nodeVisualByObjectId}
          svieRecommendationNodeVisualByObjectId={svieRecommendationVisualization.nodeVisualByObjectId}
          svieConfidenceNodeVisualByObjectId={svieConfidenceVisualization.nodeVisualByObjectId}
          svieExecutiveStoryNodeVisualByObjectId={svieExecutiveStoryLayer.nodeVisualByObjectId}
          svieFutureStateNodeVisualByObjectId={svieFutureStateOverlay.nodeVisualByObjectId}
          svieScenarioDeltaNodeVisualByObjectId={svieScenarioDeltaOverlay.nodeVisualByObjectId}
          svieScenarioImpactNodeVisualByObjectId={svieScenarioImpactVisualization.nodeVisualByObjectId}
          svieScenarioComparisonNodeVisualByObjectId={svieScenarioComparisonLayer.nodeVisualByObjectId}
          svieScenarioConfidenceNodeVisualByObjectId={svieScenarioConfidenceLayer.nodeVisualByObjectId}
          svieExecutiveFutureStoryNodeVisualByObjectId={svieExecutiveFutureStoryLayer.nodeVisualByObjectId}
        />

        <SvieCauseChainOverlay
          connectionVisuals={svieCauseChainVisualization.connectionVisuals}
          objects={objects}
          runtimeObjectPositionContext={runtimeObjectPositionContext}
        />

        <SvieExecutiveStoryOverlay
          connectionVisuals={svieExecutiveStoryLayer.connectionVisuals}
          objects={objects}
          runtimeObjectPositionContext={runtimeObjectPositionContext}
        />

        <SvieScenarioImpactChainOverlay
          connectionVisuals={svieScenarioImpactVisualization.connectionVisuals}
          objects={objects}
          runtimeObjectPositionContext={runtimeObjectPositionContext}
        />

        <SvieExecutiveFutureStoryOverlay
          connectionVisuals={svieExecutiveFutureStoryLayer.connectionVisuals}
          objects={objects}
          runtimeObjectPositionContext={runtimeObjectPositionContext}
        />

        <TopologyConnectionLines
          lines={topologyConnectionLines}
          visible={topologyConnectionLinesVisible}
          selectedObjectId={
            topologyConnectionSelectedObjectId ??
            canonicalSelectedObjectId
          }
        />

        <LoopLinesAnimated
          objects={objects}
          loops={loopList}
          activeLoopId={activeLoopId}
          showLoops={showLoops}
          showLoopLabels={showLoopLabels}
          modeId={visualModeId}
          theme={theme ?? "night"}
          scannerSceneActive={scannerSceneActive}
          primaryId={resolvedPrimaryRenderId}
          affectedIds={affectedTargetIds}
          contextIds={contextTargetIds}
          scannerFragilityScore={scannerFragilityScore}
          scannerStoryReveal={scannerStoryReveal}
          hoveredId={hoveredId}
          hoveredInteractionRole={hoveredInteractionRole}
          attentionMemoryStrengthById={attentionMemoryStrengthById}
          narrativeFocusStrength={narrativeFocusStrength}
          narrativePathEdges={narrativeFocusPath.pathEdges}
          simulationSourceId={effectivePropagationSourceId}
          simulationPathEdges={effectivePropagationPathEdges}
          decisionPathEdges={decisionPathEdges}
          runtimeObjectPositionContext={runtimeObjectPositionContext}
        />
      </group>
    </>
  );
}

export const SceneRenderer = React.memo(SceneRendererComponent);
