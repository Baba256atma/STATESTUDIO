export type HighlightTraceStage =
  | "router"
  | "execution"
  | "ui_state"
  | "homescreen_before_scene"
  | "homescreen_after_apply"
  | "scene_canvas"
  | "scene_object_state";

declare global {
  interface Window {
    __NEXORA_HIGHLIGHT_TRACE__?: boolean;
  }
}

const TRACE_SIG_TTL_MS = 1500;
const traceSigSeenAt = new Map<string, number>();
const sceneObjectStageSigByObject = new Map<string, string>();

function sortIdList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map((v) => String(v ?? "").trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}

/** Stable key for high-churn stages so identical semantics do not re-log every frame. */
function canonicalHighlightTraceKey(stage: HighlightTraceStage, payload: Record<string, unknown>): string {
  if (stage === "scene_canvas") {
    return JSON.stringify({
      stage,
      highlightedIds: sortIdList(payload.highlightedIds),
      visualCandidateIds: sortIdList(payload.visualCandidateIds),
      resolvedScannerTargetIds: sortIdList(payload.resolvedScannerTargetIds),
      resolvedRiskSourceIds: sortIdList(payload.resolvedRiskSourceIds),
      resolvedRiskTargetIds: sortIdList(payload.resolvedRiskTargetIds),
      focusedId: typeof payload.focusedId === "string" ? payload.focusedId : null,
      primaryTargetId: typeof payload.primaryTargetId === "string" ? payload.primaryTargetId : null,
      primaryReason: typeof payload.primaryReason === "string" ? payload.primaryReason : null,
      scannerSceneActive: payload.scannerSceneActive === true,
      usedFallbackResolution: payload.usedFallbackResolution === true,
    });
  }
  if (stage === "scene_object_state") {
    return buildSceneObjectStageSignature(payload);
  }
  return "";
}

function roundTraceMaterial(n: unknown): number | null {
  if (typeof n !== "number" || !Number.isFinite(n)) return null;
  return Math.round(n * 1000) / 1000;
}

function buildSceneObjectStageSignature(payload: Record<string, unknown>): string {
  const objectId = String(payload.objectId ?? "");
  const semantic = {
    objectId,
    isSelected: payload.isSelected === true,
    isFocused: payload.isFocused === true,
    isHighlighted: payload.isHighlighted === true,
    isPinned: payload.isPinned === true,
    causalRole: typeof payload.causalRole === "string" ? payload.causalRole : null,
    rank: typeof payload.rank === "string" ? payload.rank : null,
    scannerRank: typeof payload.scannerRank === "string" ? payload.scannerRank : null,
    opacityMode: typeof payload.opacityMode === "string" ? payload.opacityMode : null,
    colorMode: typeof payload.colorMode === "string" ? payload.colorMode : null,
    isRiskSource: payload.isRiskSource === true,
    isRiskTarget: payload.isRiskTarget === true,
    isAffectedTarget: payload.isAffectedTarget === true,
    isContextTarget: payload.isContextTarget === true,
    scannerSceneActive: payload.scannerSceneActive === true,
    scannerPrimaryTargetId:
      typeof payload.scannerPrimaryTargetId === "string" ? payload.scannerPrimaryTargetId : null,
    isProtectedFromDim: payload.isProtectedFromDim === true,
    dimUnrelatedObjects: payload.dimUnrelatedObjects === true,
    scannerBackgroundDimmed: payload.scannerBackgroundDimmed === true,
    /** Quantized material snapshot — stops trace spam when only sub-mille noise changes. */
    opacity: roundTraceMaterial(payload.opacity),
    emissiveIntensity: roundTraceMaterial(payload.emissiveIntensity),
    severity: typeof payload.severity === "string" ? payload.severity : null,
  };
  return JSON.stringify(semantic);
}

function sanitizeValue(value: unknown, depth = 0): unknown {
  if (depth > 2) return "[MaxDepth]";
  if (Array.isArray(value)) {
    const sliced = value.slice(0, 8).map((item) => sanitizeValue(item, depth + 1));
    return value.length > 8 ? [...sliced, `...(+${value.length - 8} more)`] : sliced;
  }
  if (!value || typeof value !== "object") return value;
  const entries = Object.entries(value as Record<string, unknown>).slice(0, 20);
  const next: Record<string, unknown> = {};
  for (const [key, entryValue] of entries) {
    next[key] = sanitizeValue(entryValue, depth + 1);
  }
  return next;
}

export function shouldTraceHighlightFlow(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  if (typeof window === "undefined") return true;
  return window.__NEXORA_HIGHLIGHT_TRACE__ !== false;
}

export function traceHighlightFlow(
  stage: HighlightTraceStage,
  payload: Record<string, unknown>
): void {
  if (!shouldTraceHighlightFlow()) return;
  try {
    const safePayload = sanitizeValue(payload) as Record<string, unknown>;
    if (stage === "scene_object_state") {
      const objectId = String(safePayload.objectId ?? "");
      if (objectId.length > 0) {
        const stageSig = buildSceneObjectStageSignature(safePayload);
        const previousSig = sceneObjectStageSigByObject.get(objectId);
        if (previousSig === stageSig) {
          return;
        }
        sceneObjectStageSigByObject.set(objectId, stageSig);
      }
    }
    const canonicalKey = canonicalHighlightTraceKey(stage, payload);
    const key =
      canonicalKey.length > 0
        ? canonicalKey
        : JSON.stringify({ stage, payload: safePayload });
    const now = Date.now();
    const previous = traceSigSeenAt.get(key);
    if (typeof previous === "number" && now - previous < TRACE_SIG_TTL_MS) {
      return;
    }
    traceSigSeenAt.set(key, now);
    console.groupCollapsed(`[Nexora][HighlightTrace][${stage}]`);
    console.log(safePayload);
    console.groupEnd();
  } catch (error) {
    console.warn("[Nexora][HighlightTrace] failed", stage, error);
  }
}
