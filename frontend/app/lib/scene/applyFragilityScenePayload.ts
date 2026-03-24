import type {
  FragilitySceneHighlight,
  FragilitySceneObject,
  FragilityScenePayload,
} from "../../types/fragilityScanner";
import type { SceneJson, SceneObject } from "../sceneTypes";

export type ApplyFragilityScenePayloadResult = {
  sceneJson: SceneJson | null;
  matchedObjectIds: string[];
  suggestedFocusIds: string[];
  highlights: FragilitySceneHighlight[];
  overlaySummary?: string;
};

function normalizeId(value: unknown): string {
  return String(value ?? "").trim();
}

function canonicalId(value: unknown): string {
  return normalizeId(value)
    .toLowerCase()
    .replace(/^obj_/, "")
    .replace(/[_\s-]+\d+$/, "")
    .replace(/[\s-]+/g, "_");
}

function clampUnit(value: number | undefined): number | undefined {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined;
  return Math.max(0, Math.min(1, value));
}

function severityWeight(severity: string | undefined): number {
  const normalized = normalizeId(severity).toLowerCase();
  if (normalized === "critical") return 1;
  if (normalized === "high") return 0.88;
  if (normalized === "medium" || normalized === "moderate") return 0.72;
  if (normalized === "low") return 0.56;
  return 0.62;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function buildSceneObjectIndex(objects: SceneObject[]): Map<string, string> {
  const index = new Map<string, string>();

  for (const object of objects) {
    const id = normalizeId(object.id);
    if (!id) continue;

    const keys = [
      id,
      normalizeId((object as any).name),
      normalizeId((object as any).canonical_name),
      normalizeId((object as any).display_label),
      normalizeId((object as any).semantic?.canonical_name),
      normalizeId((object as any).semantic?.display_label),
      canonicalId(id),
      canonicalId((object as any).name),
      canonicalId((object as any).canonical_name),
      canonicalId((object as any).display_label),
      canonicalId((object as any).semantic?.canonical_name),
      canonicalId((object as any).semantic?.display_label),
      ...readSemanticTokens(object),
    ].filter(Boolean);

    for (const key of keys) {
      if (!index.has(key)) {
        index.set(key, id);
      }
    }
  }

  return index;
}

function readSemanticTokens(object: SceneObject): string[] {
  const semantic = object.semantic ?? {};
  const rawValues: unknown[] = [
    object.label,
    object.name,
    object.role,
    object.category,
    object.risk_kind,
    object.business_meaning,
    semantic.role,
    semantic.category,
    semantic.risk_kind,
    ...(Array.isArray(object.tags) ? object.tags : []),
    ...(Array.isArray(object.keywords) ? object.keywords : []),
    ...(Array.isArray(object.related_terms) ? object.related_terms : []),
    ...(Array.isArray(semantic.tags) ? semantic.tags : []),
    ...(Array.isArray(semantic.keywords) ? semantic.keywords : []),
    ...(Array.isArray(semantic.related_terms) ? semantic.related_terms : []),
  ];

  return Array.from(
    new Set(
      rawValues
        .flatMap((value) =>
          String(value ?? "")
            .split(/[^a-zA-Z0-9]+/g)
            .map((part) => canonicalId(part))
            .filter(Boolean)
        )
    )
  );
}

function payloadAliasTokens(rawId: unknown): string[] {
  const key = canonicalId(rawId);
  const aliases: Record<string, string[]> = {
    bottleneck: ["bottleneck", "delay", "disruption", "constraint", "fulfillment", "flow", "operations"],
    delivery: ["delivery", "flow", "fulfillment", "throughput", "logistics", "execution"],
    supplier: ["supplier", "vendor", "dependency", "upstream", "source"],
    inventory: ["inventory", "buffer", "capacity", "reserve", "coverage"],
    risk_zone: ["risk", "volatility", "credit", "disruption", "exposure", "fragility"],
    buffer: ["buffer", "inventory", "liquidity", "capacity", "reserve"],
  };
  return [key, ...(aliases[key] ?? [])];
}

function resolveSemanticObjectId(objects: SceneObject[], rawId: unknown): string | null {
  const aliases = payloadAliasTokens(rawId);
  if (!aliases.length) return null;

  let bestMatch: { id: string; score: number } | null = null;
  for (const object of objects) {
    const objectId = normalizeId(object.id);
    if (!objectId) continue;

    const tokens = new Set([
      canonicalId(object.id),
      canonicalId(object.label),
      canonicalId(object.name),
      ...readSemanticTokens(object),
    ]);
    const score = aliases.reduce((sum, token) => (tokens.has(token) ? sum + 1 : sum), 0);
    if (score <= 0) continue;
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { id: objectId, score };
    }
  }

  return bestMatch?.score ? bestMatch.id : null;
}

function resolveSceneObjectId(index: Map<string, string>, objects: SceneObject[], rawId: unknown): string | null {
  const id = normalizeId(rawId);
  if (!id) return null;
  return index.get(id) ?? index.get(canonicalId(id)) ?? resolveSemanticObjectId(objects, rawId) ?? null;
}

function clearScannerState(current: SceneObject): SceneObject {
  const {
    scanner_reason: _scannerReason,
    scanner_highlighted: _scannerHighlighted,
    scanner_severity: _scannerSeverity,
    scanner_emphasis: _scannerEmphasis,
    scanner_focus: _scannerFocus,
    scanner_overlay_summary: _scannerOverlaySummary,
    ...rest
  } = current;

  return rest;
}

function mergeSceneObject(
  current: SceneObject,
  incoming: FragilitySceneObject,
  options: {
    severity?: string;
    isSuggestedFocus: boolean;
    overlaySummary?: string;
  }
): SceneObject {
  const nextEmphasis = clampUnit(incoming.emphasis);
  const currentEmphasis =
    typeof current.emphasis === "number" && Number.isFinite(current.emphasis) ? current.emphasis : undefined;
  const severityEmphasis = severityWeight(options.severity);
  const scannerEmphasis = Math.max(
    options.isSuggestedFocus ? 0.98 : 0.84,
    nextEmphasis ?? 0,
    severityEmphasis
  );

  return {
    ...current,
    emphasis:
      typeof currentEmphasis === "number" && typeof nextEmphasis === "number"
        ? Math.max(currentEmphasis, nextEmphasis)
        : nextEmphasis ?? currentEmphasis,
    scanner_reason:
      incoming.reason ??
      options.overlaySummary ??
      "Highlighted by fragility analysis.",
    scanner_highlighted: true,
    scanner_severity: options.severity,
    scanner_emphasis: scannerEmphasis,
    scanner_focus: options.isSuggestedFocus,
    scanner_overlay_summary: options.overlaySummary,
  };
}

function mergeHighlights(
  currentHighlights: unknown,
  nextHighlights: FragilitySceneHighlight[]
): FragilitySceneHighlight[] {
  const existing = Array.isArray(currentHighlights)
    ? currentHighlights.filter(isRecord).map((item) => ({
        type: normalizeId(item.type),
        target: normalizeId(item.target),
        severity: typeof item.severity === "string" ? item.severity : undefined,
      }))
    : [];

  const merged = [...existing, ...nextHighlights].filter((item) => item.type && item.target);
  const deduped = new Map<string, FragilitySceneHighlight>();
  for (const highlight of merged) {
    deduped.set(`${highlight.type}:${highlight.target}`, highlight);
  }
  return Array.from(deduped.values());
}

function uniqueIds(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.map((value) => normalizeId(value)).filter(Boolean)));
}

export function applyFragilityScenePayload(
  currentSceneState: SceneJson | null,
  payload: FragilityScenePayload | null | undefined
): ApplyFragilityScenePayloadResult {
  if (!payload || !currentSceneState) {
    return {
      sceneJson: currentSceneState,
      matchedObjectIds: [],
      suggestedFocusIds: [],
      highlights: [],
      overlaySummary: undefined,
    };
  }

  const baseScene = currentSceneState;
  const existingObjects = Array.isArray(baseScene.scene.objects) ? baseScene.scene.objects : [];
  const objectIndex = buildSceneObjectIndex(existingObjects);
  const highlightSeverityById = new Map<string, string>();
  if (process.env.NODE_ENV !== "production" && payload.objects?.length) {
    console.debug("[fragility] scene objects", existingObjects.map((object) => normalizeId(object.id)));
    console.debug("[fragility] payload objects", payload.objects.map((object) => normalizeId(object.id)));
  }
  const suggestedFocusIds = uniqueIds(
    (Array.isArray(payload.suggested_focus) ? payload.suggested_focus : []).map((id) =>
      resolveSceneObjectId(objectIndex, existingObjects, id)
    )
  );
  const suggestedFocusSet = new Set(suggestedFocusIds);
  const resolvedHighlights = (Array.isArray(payload.highlights) ? payload.highlights : [])
    .map((highlight) => {
      const resolvedTarget = resolveSceneObjectId(objectIndex, existingObjects, highlight?.target);
      if (!resolvedTarget) return null;
      const normalized: FragilitySceneHighlight = {
        type: normalizeId(highlight?.type),
        target: resolvedTarget,
        severity: typeof highlight?.severity === "string" ? highlight.severity : undefined,
      };
      if (normalized.severity) {
        highlightSeverityById.set(resolvedTarget, normalized.severity);
      }
      return normalized.type && normalized.target ? normalized : null;
    })
    .filter(Boolean) as FragilitySceneHighlight[];

  const matchedObjectIds: string[] = [];
  const nextObjects = existingObjects.map((object) => {
    const objectId = normalizeId(object.id);
    const nextBaseObject = clearScannerState(object);
    const incoming = (Array.isArray(payload.objects) ? payload.objects : []).find((item) => {
      return resolveSceneObjectId(objectIndex, existingObjects, item?.id) === objectId;
    });
    if (!incoming) return nextBaseObject;
    matchedObjectIds.push(objectId);
    return mergeSceneObject(nextBaseObject, incoming, {
      severity: highlightSeverityById.get(objectId),
      isSuggestedFocus: suggestedFocusSet.has(objectId),
      overlaySummary:
        typeof payload.scanner_overlay?.summary === "string" ? payload.scanner_overlay.summary : undefined,
    });
  });
  if (process.env.NODE_ENV !== "production" && payload.objects?.length) {
    console.debug("[fragility] matched objects", matchedObjectIds);
    const unmatchedPayloadIds = payload.objects
      .map((object) => normalizeId(object.id))
      .filter((id) => !matchedObjectIds.includes(resolveSceneObjectId(objectIndex, existingObjects, id) ?? ""));
    if (unmatchedPayloadIds.length) {
      console.warn("[fragility] unmatched payload objects", unmatchedPayloadIds);
    }
  }

  const nextStateVector = {
    ...(baseScene.state_vector ?? {}),
    ...(typeof payload.state_vector?.fragility_score === "number"
      ? { fragility_score: payload.state_vector.fragility_score }
      : {}),
  };

  const previousScannerState =
    baseScene.scene.scanner_state_vector && isRecord(baseScene.scene.scanner_state_vector)
      ? (baseScene.scene.scanner_state_vector as Record<string, unknown>)
      : {};
  const previousScannerOverlay =
    baseScene.scene.scanner_overlay && isRecord(baseScene.scene.scanner_overlay)
      ? (baseScene.scene.scanner_overlay as Record<string, unknown>)
      : {};

  return {
    sceneJson: {
      ...baseScene,
      meta: {
        ...(baseScene.meta ?? {}),
        scanner_active: true,
      },
      state_vector: nextStateVector,
      scene: {
        ...baseScene.scene,
        objects: nextObjects,
        scanner_highlights: mergeHighlights(baseScene.scene.scanner_highlights, resolvedHighlights),
        scanner_focus: uniqueIds([
          ...(Array.isArray(baseScene.scene.scanner_focus)
            ? (baseScene.scene.scanner_focus as unknown[]).map((value) =>
                typeof value === "string" ? value : undefined
              )
            : []),
          ...suggestedFocusIds,
        ]),
        scanner_overlay: {
          ...previousScannerOverlay,
          ...(payload.scanner_overlay ?? {}),
        },
        scanner_state_vector: {
          ...previousScannerState,
          ...(payload.state_vector ?? {}),
        },
      },
    },
    matchedObjectIds: uniqueIds(matchedObjectIds),
    suggestedFocusIds,
    highlights: resolvedHighlights,
    overlaySummary:
      typeof payload.scanner_overlay?.summary === "string" ? payload.scanner_overlay.summary : undefined,
  };
}
