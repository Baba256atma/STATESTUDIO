/**
 * Read-only helpers for backend / chat / panel / scanner payload shapes used by HomeScreen.
 * Side-effect free; no React state; does not implement canonical scene apply (see sceneApplyContract).
 */

import type { KPIState } from "../lib/api";
import type { CanonicalRecommendation } from "../lib/decision/recommendation/recommendationTypes";
import type { RightPanelView } from "../lib/ui/right-panel/rightPanelTypes";
import { resolveUnifiedReactionPolicy } from "../lib/reactions/reactionPolicy";
import { hasForcedSceneUpdate, normalizeUnifiedSceneReaction, type UnifiedSceneReaction } from "../lib/scene/unifiedReaction";
import type { SceneJson } from "../lib/sceneTypes";
import { normalizeSceneJson } from "./homeScreenUtils";

export function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

/** Backend / persistence `scene_json` blob: normalize only when a real object is present. */
export function sceneJsonFromUnknown(raw: unknown): SceneJson | null {
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) return null;
  return normalizeSceneJson(raw);
}

export function readSceneJsonMetaField(sceneLike: unknown, key: string): unknown {
  return asRecord(asRecord(sceneLike)?.["meta"])?.[key];
}

export function readSceneJsonMetaString(sceneLike: unknown, key: string): string {
  const v = readSceneJsonMetaField(sceneLike, key);
  return typeof v === "string" ? v : String(v ?? "").trim();
}

export function readSceneJsonActiveLoop(sceneLike: unknown): string {
  const sceneInner = asRecord(asRecord(sceneLike)?.["scene"]);
  const v = sceneInner?.["active_loop"];
  return typeof v === "string" ? v : String(v ?? "").trim();
}

export function isCanonicalRecommendationLike(value: unknown): value is CanonicalRecommendation {
  const r = asRecord(value);
  if (!r || typeof r.id !== "string" || !r.id.trim()) return false;
  const primary = asRecord(r.primary);
  const reasoning = asRecord(r.reasoning);
  const confidence = asRecord(r.confidence);
  if (!primary || typeof primary.action !== "string") return false;
  if (!reasoning || typeof reasoning.why !== "string") return false;
  if (!confidence || typeof confidence.score !== "number") return false;
  if (!Array.isArray(r.alternatives)) return false;
  return true;
}

export function readCanonicalRecommendation(responseLike: unknown, sceneLike: SceneJson | null): CanonicalRecommendation | null {
  const fromResponse = asRecord(responseLike)?.["canonical_recommendation"];
  if (isCanonicalRecommendationLike(fromResponse)) return fromResponse;
  const fromScene = sceneLike != null ? asRecord(sceneLike)?.["canonical_recommendation"] : null;
  if (isCanonicalRecommendationLike(fromScene)) return fromScene;
  return null;
}

/** Narrow loose KPI payloads (payload / scene_json / scene) to the small KPIState contract. */
export function normalizeKpiStateFromUnknown(raw: unknown): KPIState | null {
  const rec = asRecord(raw);
  if (!rec) return null;
  const out: KPIState = {};
  for (const key of ["inventory", "delivery", "risk"] as const) {
    const v = rec[key];
    if (typeof v === "number" && Number.isFinite(v)) {
      out[key] = v;
    }
  }
  return Object.keys(out).length > 0 ? out : null;
}

export function getHighlightedObjectIdsFromSelection(value: unknown): string[] {
  const record = asRecord(value);
  const highlighted = record?.highlighted_objects;
  return Array.isArray(highlighted) ? highlighted.map(String).filter(Boolean) : [];
}

export function hasRenderableSceneForVisibleState(value: unknown): value is SceneJson {
  const record = asRecord(value);
  const scene = asRecord(record?.scene);
  const objects = scene?.objects;
  return Array.isArray(objects) && objects.length > 0;
}

export function hasRenderableResponseForVisibleState(value: unknown) {
  const record = asRecord(value);
  if (!record) return false;
  return Boolean(
    asRecord(record.decision_analysis) ??
      record.canonical_recommendation ??
      record.executive_summary_surface ??
      record.decision_cockpit ??
      record.strategic_advice ??
      record.decision_simulation ??
      record.timeline_impact ??
      record.risk_propagation ??
      record.multi_agent_decision ??
      record.conflict ??
      (Array.isArray(record.conflicts) && record.conflicts.length > 0)
  );
}

export function hasMeaningfulSelectionForVisibleState(value: unknown) {
  const record = asRecord(value);
  if (!record) return false;
  const highlighted = Array.isArray(record.highlighted_objects) ? record.highlighted_objects : [];
  const riskSources = Array.isArray(record.risk_sources) ? record.risk_sources : [];
  const riskTargets = Array.isArray(record.risk_targets) ? record.risk_targets : [];
  return highlighted.length > 0 || riskSources.length > 0 || riskTargets.length > 0 || record.dim_unrelated_objects === true;
}

export function getSceneScopedObjectSelection(value: unknown, validObjectIds: Set<string>) {
  const record = asRecord(value);
  if (!record) return null;

  const highlighted = Array.isArray(record.highlighted_objects)
    ? record.highlighted_objects.map(String).filter((id) => validObjectIds.has(id))
    : [];
  const riskSources = Array.isArray(record.risk_sources)
    ? record.risk_sources.map(String).filter((id) => validObjectIds.has(id))
    : [];
  const riskTargets = Array.isArray(record.risk_targets)
    ? record.risk_targets.map(String).filter((id) => validObjectIds.has(id))
    : [];

  if (!highlighted.length && !riskSources.length && !riskTargets.length) {
    return null;
  }

  return {
    ...record,
    highlighted_objects: highlighted,
    risk_sources: riskSources,
    risk_targets: riskTargets,
    dim_unrelated_objects: record.dim_unrelated_objects === true,
  };
}

export function shouldAcceptMeaningfulArrayReplacement(nextValue: unknown, currentValue: unknown) {
  if (Array.isArray(nextValue) && nextValue.length > 0) return true;
  return !Array.isArray(currentValue) || currentValue.length === 0;
}

export function shouldAcceptMeaningfulRecordReplacement(nextValue: unknown, currentValue: unknown) {
  const nextRecord = asRecord(nextValue);
  if (nextRecord && Object.keys(nextRecord).length > 0) return true;
  return !asRecord(currentValue);
}

export function hasMeaningfulObjectPanelContext(detail: {
  contextId?: string | null;
  selectedObjectId?: string | null;
  highlightedObjectIds?: string[] | null;
}) {
  if (typeof detail.contextId === "string" && detail.contextId.trim().length > 0) return true;
  if (typeof detail.selectedObjectId === "string" && detail.selectedObjectId.trim().length > 0) return true;
  return Array.isArray(detail.highlightedObjectIds) && detail.highlightedObjectIds.length > 0;
}

export function hasRenderableGuidedPromptPanelValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  const rec = asRecord(value);
  if (rec) return Object.keys(rec).length > 0;
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

export function getGuidedPromptPanelPayloadValue(
  panel: RightPanelView | null,
  data: Record<string, unknown> | null | undefined
): unknown {
  if (!panel || !data) return null;
  switch (panel) {
    case "advice":
      return data.advice ?? data.strategicAdvice ?? data.canonicalRecommendation ?? null;
    case "risk":
    case "fragility":
      return data.risk ?? data.fragility ?? null;
    case "conflict":
      return data.conflict ?? data.conflicts ?? null;
    case "timeline":
      return data.timeline ?? data.decisionTimeline ?? null;
    case "simulate":
      return data.simulation ?? data.decisionSimulation ?? null;
    case "war_room":
      return data.warRoom ?? data.strategicCouncil ?? data.dashboard ?? null;
    case "dashboard":
      return data.dashboard ?? data.executiveSummary ?? data.decisionCockpit ?? null;
    default:
      return data[panel] ?? null;
  }
}

export function getPanelFamilyPayloadValue(
  panel: RightPanelView | null,
  data: Record<string, unknown> | null | undefined
): unknown {
  return getGuidedPromptPanelPayloadValue(panel, data);
}

export function describePanelAuditShape(value: unknown) {
  if (Array.isArray(value)) return { shape: "array" as const, size: value.length };
  const rec = asRecord(value);
  if (rec) return { shape: "object" as const, size: Object.keys(rec).length };
  return { shape: value == null ? ("null" as const) : typeof value, size: 0 };
}

export type PanelFamilySliceDiagnostics = {
  payload: unknown;
  /** True when the extracted family slice is non-empty for guided / host rendering. */
  familyPresent: boolean;
  payloadShape: ReturnType<typeof describePanelAuditShape>;
};

/** Single read of panel-family slice + audit shape (avoids repeated walks in HomeScreen). */
export function readPanelFamilySliceDiagnostics(
  expectedFamily: RightPanelView | null,
  data: Record<string, unknown> | null | undefined
): PanelFamilySliceDiagnostics {
  const payload = getPanelFamilyPayloadValue(expectedFamily, data);
  return {
    payload,
    familyPresent: hasRenderableGuidedPromptPanelValue(payload),
    payloadShape: describePanelAuditShape(payload),
  };
}

export type PanelFamilyContractDiagnostics = {
  canonical: PanelFamilySliceDiagnostics;
  validated: PanelFamilySliceDiagnostics;
  /** True when canonical had content but the contract pass changed the slice reference (salvage signal). */
  payloadsLikelySalvaged: boolean;
  contractRenderable: boolean;
};

/** Pre/post contract validation reads for the same expected panel family. */
export function readPanelFamilyContractDiagnostics(
  expectedFamily: RightPanelView | null,
  preContractData: Record<string, unknown>,
  postContractData: Record<string, unknown>
): PanelFamilyContractDiagnostics {
  const canonical = readPanelFamilySliceDiagnostics(expectedFamily, preContractData);
  const validated = readPanelFamilySliceDiagnostics(expectedFamily, postContractData);
  const payloadsLikelySalvaged =
    canonical.familyPresent && canonical.payload !== validated.payload;
  return {
    canonical,
    validated,
    payloadsLikelySalvaged,
    contractRenderable: validated.familyPresent,
  };
}

export function hasMeaningfulSceneMutation(payload: unknown, currentScene: SceneJson | null): boolean {
  const p = asRecord(payload);
  if (!p || p["scene_json"] == null) return false;

  if (!currentScene) return true;

  const sceneJsonBlob = p["scene_json"];
  const sceneJsonRec = asRecord(sceneJsonBlob);
  const sceneJsonMeta = sceneJsonRec ? asRecord(sceneJsonRec["meta"]) : null;

  const explicitForce =
    p["force_scene_update"] === true ||
    p["scene_update"] === true ||
    sceneJsonMeta?.["force_scene_update"] === true ||
    sceneJsonMeta?.["scene_update"] === true;

  if (explicitForce) return true;

  const hasActions = Array.isArray(p["actions"]) && p["actions"].length > 0;

  const objectSelection = asRecord(p["object_selection"]);
  const highlightedCount = Array.isArray(objectSelection?.["highlighted_objects"])
    ? objectSelection["highlighted_objects"].length
    : 0;

  const riskProp = asRecord(p["risk_propagation"]);
  const riskSourcesCount = Array.isArray(riskProp?.["sources"]) ? riskProp["sources"].length : 0;

  const scanner = asRecord(p["scanner"]);
  const scannerTargetsCount = Array.isArray(scanner?.["focus_object_ids"]) ? scanner["focus_object_ids"].length : 0;

  const ext = asRecord(p["external_integration"]);
  const externalTargetsCount = Array.isArray(ext?.["focus_object_ids"]) ? ext["focus_object_ids"].length : 0;

  const scenePatch = asRecord(p["scene_patch"]);
  const hasScenePatch =
    Array.isArray(scenePatch?.["objects"]) ||
    Array.isArray(scenePatch?.["relations"]) ||
    Array.isArray(scenePatch?.["loops"]);

  return (
    hasActions ||
    highlightedCount > 0 ||
    riskSourcesCount > 0 ||
    scannerTargetsCount > 0 ||
    externalTargetsCount > 0 ||
    hasScenePatch
  );
}

export function extractSceneObjectIds(scene: SceneJson | null | undefined): string[] {
  const objects = Array.isArray(scene?.scene?.objects) ? scene.scene.objects : [];
  return objects
    .map((obj: unknown, idx: number) => {
      const o = asRecord(obj);
      return String(o?.id ?? o?.name ?? `obj_${idx}`);
    })
    .filter(Boolean);
}

export function buildSceneObjectIdSet(scene: SceneJson | null | undefined): Set<string> {
  return new Set(extractSceneObjectIds(scene));
}

export function getSceneCompatibilityScore(
  currentScene: SceneJson | null | undefined,
  incomingScene: SceneJson | null | undefined
): number {
  const currentIds = extractSceneObjectIds(currentScene);
  const incomingIds = extractSceneObjectIds(incomingScene);

  if (!currentIds.length || !incomingIds.length) return 0;

  const currentSet = buildSceneObjectIdSet(currentScene);
  let overlap = 0;

  for (const id of incomingIds) {
    if (currentSet.has(id)) overlap += 1;
  }

  return overlap / Math.max(incomingIds.length, currentIds.length);
}

export function isSceneCompatibleForReplacement(
  currentScene: SceneJson | null | undefined,
  incomingScene: SceneJson | null | undefined,
  payload?: unknown
): boolean {
  if (!incomingScene) return false;
  if (!currentScene) return true;

  const p = asRecord(payload);
  const sceneJsonBlob = p?.["scene_json"];
  const sceneJsonRec = asRecord(sceneJsonBlob);
  const sceneJsonMeta = sceneJsonRec ? asRecord(sceneJsonRec["meta"]) : null;

  const explicitForce =
    p?.["force_scene_update"] === true ||
    p?.["scene_update"] === true ||
    sceneJsonMeta?.["force_scene_update"] === true ||
    sceneJsonMeta?.["scene_update"] === true ||
    incomingScene?.meta?.force_scene_update === true ||
    incomingScene?.meta?.scene_update === true;

  if (explicitForce) return true;

  const currentIds = extractSceneObjectIds(currentScene);
  const incomingIds = extractSceneObjectIds(incomingScene);

  if (!currentIds.length || !incomingIds.length) return false;

  const compatibility = getSceneCompatibilityScore(currentScene, incomingScene);

  return compatibility >= 0.45;
}

export function shouldAcceptIncomingSceneReplacement(
  payload: unknown,
  currentScene: SceneJson | null,
  incomingScene: SceneJson | null | undefined
): boolean {
  if (!incomingScene) return false;
  if (!hasMeaningfulSceneMutation(payload, currentScene)) return false;
  return hasForcedSceneUpdate(payload, incomingScene);
}

export function buildUnifiedReactionFromChatResponse(
  rawPayload: unknown,
  options?: {
    acceptedSceneForChatReplacement?: SceneJson | null;
    allowSceneEffects?: boolean;
    fallbackHighlightedObjectIds?: string[];
    fallbackPrimaryObjectId?: string | null;
    reactionModeHint?: "focus" | "risk" | "propagation" | "decision" | null;
  }
): UnifiedSceneReaction {
  const p = asRecord(rawPayload) ?? {};
  const objectSelection = asRecord(p["object_selection"]);
  const highlightedRaw = objectSelection?.["highlighted_objects"];
  const highlightedObjectIds = Array.isArray(highlightedRaw)
    ? highlightedRaw.map(String)
    : Array.isArray(options?.fallbackHighlightedObjectIds)
      ? options.fallbackHighlightedObjectIds.map(String)
      : options?.fallbackPrimaryObjectId
        ? [String(options.fallbackPrimaryObjectId)]
        : [];

  const riskProp = asRecord(p["risk_propagation"]);
  const riskSources = Array.isArray(riskProp?.["sources"])
    ? (riskProp["sources"] as unknown[]).map((x) => String(x))
    : [];

  const riskTargets = Array.isArray(riskProp?.["targets"])
    ? (riskProp["targets"] as unknown[]).map((x) => String(x))
    : [];

  const loopAnalysis = asRecord(p["loop_analysis"]);
  const activeLoopRaw = loopAnalysis?.["active_loop_id"] ?? p["active_loop_id"];
  const activeLoopId =
    activeLoopRaw === null || activeLoopRaw === undefined ? null : String(activeLoopRaw).trim() || null;

  const loopSuggestionsFromAnalysis = loopAnalysis?.["suggestions"];
  const loopSuggestionsFromRoot = p["loop_suggestions"];
  const loopSuggestions = Array.isArray(loopSuggestionsFromAnalysis)
    ? loopSuggestionsFromAnalysis
    : Array.isArray(loopSuggestionsFromRoot)
      ? loopSuggestionsFromRoot
      : [];

  const analysisSummary = p["analysis_summary"];
  const reply = p["reply"];
  const actionsRaw = p["actions"];

  return normalizeUnifiedSceneReaction(
    resolveUnifiedReactionPolicy({
      source: "chat",
      reason: typeof analysisSummary === "string" ? analysisSummary : null,
      fallbackHighlightText:
        typeof reply === "string" && reply.trim().length > 0
          ? reply
          : typeof analysisSummary === "string"
            ? analysisSummary
            : null,
      highlightedObjectIds,
      riskSources,
      riskTargets,
      reactionModeHint: options?.reactionModeHint ?? null,
      activeLoopId,
      loopSuggestions,
      actions: options?.allowSceneEffects ? (Array.isArray(actionsRaw) ? actionsRaw : []) : [],
      allowFocusMutation: options?.allowSceneEffects === true,
      sceneJson: options?.acceptedSceneForChatReplacement ?? null,
    })
  );
}

export function buildUnifiedReactionFromFragilityRun(payload: unknown): UnifiedSceneReaction {
  const rec = asRecord(payload) ?? {};
  const highlightedObjectIds = Array.isArray(rec["highlightedObjectIds"])
    ? (rec["highlightedObjectIds"] as unknown[]).map(String)
    : Array.isArray(rec["objectIds"])
      ? (rec["objectIds"] as unknown[]).map(String)
      : [];

  const riskSources = Array.isArray(rec["riskSources"]) ? (rec["riskSources"] as unknown[]).map(String) : [];

  const riskTargets = Array.isArray(rec["riskTargets"])
    ? (rec["riskTargets"] as unknown[]).map(String)
    : highlightedObjectIds;

  const reasonRaw = rec["reason"];
  const loopSuggestionsRaw = rec["loopSuggestions"];
  const actionsRaw = rec["actions"];
  const activeLoopId = (rec["activeLoopId"] ?? null) as string | null;

  return normalizeUnifiedSceneReaction(
    resolveUnifiedReactionPolicy({
      source: "button",
      reason: typeof reasonRaw === "string" ? reasonRaw : "Fragility scene run",
      highlightedObjectIds,
      riskSources,
      riskTargets,
      reactionModeHint: riskSources.length > 0 || riskTargets.length > 0 ? "risk" : "focus",
      activeLoopId,
      loopSuggestions: Array.isArray(loopSuggestionsRaw) ? loopSuggestionsRaw : [],
      actions: Array.isArray(actionsRaw) ? actionsRaw : [],
      allowFocusMutation: false,
      sceneJson: null,
    })
  );
}
