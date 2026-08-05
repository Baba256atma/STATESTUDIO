/**
 * NOL-2:2 — NexoraObject Material State & Resolution Model
 *
 * Transforms a NexoraObjectRepresentation into a complete, deterministic,
 * renderer-independent visual-material description.
 *
 * Upstream: NOL-2:1 Material & Representation Foundation only.
 * Identity: NOL-2:2/NexoraObjectMaterialStateResolutionModel
 */

import {
  materialRepresentationFoundationIdentity,
  materialRepresentationSchemaVersion,
  type NexoraObjectGeometryDescriptor,
  type NexoraObjectMaterial,
  type NexoraObjectRepresentation,
  type NexoraObjectRepresentationProfile,
  type NexoraObjectRepresentationState,
  type NexoraObjectSeedColor,
} from "./nexoraObjectMaterialRepresentationFoundation.ts";

// ─── Identity & versions ────────────────────────────────────────────────────

export const materialStateResolutionModelIdentity =
  "NOL-2:2/NexoraObjectMaterialStateResolutionModel" as const;

export const materialStateResolutionModelVersion = "1.0.0" as const;

export const materialStateResolutionSchemaVersion = "1.0.0" as const;

export const NOL_MATERIAL_RESOLUTION_IDENTITY =
  materialStateResolutionModelIdentity;
export const NOL_MATERIAL_RESOLUTION_VERSION =
  materialStateResolutionModelVersion;
export const NOL_MATERIAL_RESOLUTION_SCHEMA_VERSION =
  materialStateResolutionSchemaVersion;

export const NOL_MATERIAL_RESOLUTION_UPSTREAM =
  materialRepresentationFoundationIdentity;

// ─── Theme / emphasis / layer models ────────────────────────────────────────

export type NexoraObjectMaterialTheme = "Light" | "Dark" | "Auto";

export type NexoraObjectResolvedEmphasis =
  | "None"
  | "Soft"
  | "Medium"
  | "Strong"
  | "Critical";

export type NexoraObjectMaterialLayer =
  | "Background"
  | "Normal"
  | "Selected"
  | "Focused"
  | "Attention"
  | "Overlay"
  | "Historical";

export const NEXORA_OBJECT_MATERIAL_LAYER_PRIORITY = Object.freeze({
  Historical: 10,
  Background: 20,
  Normal: 30,
  Selected: 40,
  Attention: 50,
  Focused: 60,
  Overlay: 70,
} as const satisfies Record<NexoraObjectMaterialLayer, number>);

export type NexoraObjectOutlineLevel = "None" | "Thin" | "Normal" | "Bold";

export type NexoraObjectGlowLevel = "None" | "Soft" | "Normal" | "Strong";

export type NexoraObjectShadowLevel = "None" | "Small" | "Medium" | "Large";

export type NexoraObjectDepthLevel =
  | "Flat"
  | "Shallow"
  | "Medium"
  | "Deep"
  | "Elevated";

/** Theme tokens only — no RGB/HEX/HSL values. */
export interface NexoraObjectThemeTokens {
  readonly theme: NexoraObjectMaterialTheme;
  readonly surfaceToken: string;
  readonly contrastToken: string;
  readonly edgeToken: string;
  readonly glowToken: string;
  readonly shadowToken: string;
  readonly densityToken: string;
}

export interface NexoraObjectAnimationHints {
  readonly appear: "Fade" | "Scale" | "None";
  readonly disappear: "Fade" | "Scale" | "None";
  readonly focus: "Pulse" | "Elevate" | "None";
  readonly selection: "Outline" | "Glow" | "None";
  readonly attention: "Pulse" | "Flash" | "None";
  readonly transitionDuration: "Instant" | "Short" | "Medium" | "Long";
  readonly easingHint: "Linear" | "EaseOut" | "EaseInOut";
}

export interface NexoraObjectMaterialResolutionContext {
  readonly theme: NexoraObjectMaterialTheme;
  readonly zoomLevel?: "Far" | "Medium" | "Near";
  readonly stageDensity?: "Sparse" | "Balanced" | "Dense";
  readonly interactionMode?: "Browse" | "Inspect" | "Operate";
  readonly historicalMode?: boolean;
}

export interface NexoraObjectMaterialState {
  readonly materialStateId: string;
  readonly materialStateVersion: string;
  readonly schemaVersion: typeof materialStateResolutionSchemaVersion;
  readonly representationState: NexoraObjectRepresentationState;
  readonly profile: NexoraObjectRepresentationProfile;
  readonly material: NexoraObjectMaterial;
  readonly geometry: NexoraObjectGeometryDescriptor;
  readonly seedColor: NexoraObjectSeedColor;
  readonly emphasis: NexoraObjectResolvedEmphasis;
  readonly visibility: boolean;
  readonly depth: NexoraObjectDepthLevel;
  readonly opacity: number;
  readonly outline: NexoraObjectOutlineLevel;
  readonly glow: NexoraObjectGlowLevel;
  readonly shadow: NexoraObjectShadowLevel;
  readonly layer: NexoraObjectMaterialLayer;
  readonly theme: NexoraObjectMaterialTheme;
  readonly themeTokens: NexoraObjectThemeTokens;
  readonly animationHints: NexoraObjectAnimationHints;
  readonly cacheKey: string;
}

export type NexoraObjectMaterialStateErrorCode =
  | "MATERIAL_STATE_INVALID_REPRESENTATION"
  | "MATERIAL_STATE_INVALID_OPACITY"
  | "MATERIAL_STATE_INVALID_LAYER"
  | "MATERIAL_STATE_INVALID_EMPHASIS"
  | "MATERIAL_STATE_INVALID_CACHE_KEY"
  | "MATERIAL_STATE_SEED_COLOR_MUTATION"
  | "MATERIAL_STATE_INVARIANT_VIOLATION"
  | "MATERIAL_STATE_UNSUPPORTED_VERSION";

export interface NexoraObjectMaterialStateError {
  readonly code: NexoraObjectMaterialStateErrorCode;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export class NexoraObjectMaterialStateResolutionException extends Error {
  readonly code: NexoraObjectMaterialStateErrorCode;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(error: NexoraObjectMaterialStateError) {
    super(error.message);
    this.name = "NexoraObjectMaterialStateResolutionException";
    this.code = error.code;
    this.details = error.details;
  }
}

export type NexoraObjectMaterialStateValidationResult = {
  readonly ok: boolean;
  readonly errors: readonly NexoraObjectMaterialStateError[];
  readonly warnings: readonly NexoraObjectMaterialStateError[];
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item);
    return Object.isFrozen(value) ? value : Object.freeze(value);
  }
  for (const key of Object.keys(value as object)) {
    deepFreeze((value as Record<string, unknown>)[key]);
  }
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

function err(
  code: NexoraObjectMaterialStateErrorCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): NexoraObjectMaterialStateError {
  return Object.freeze({ code, message, details });
}

function isRepresentation(
  value: unknown,
): value is NexoraObjectRepresentation {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<NexoraObjectRepresentation>;
  return Boolean(
    typeof candidate.objectId === "string" &&
      candidate.material &&
      candidate.geometry &&
      typeof candidate.state === "string" &&
      typeof candidate.profile === "string",
  );
}

function densityFactor(
  context: NexoraObjectMaterialResolutionContext,
): number {
  switch (context.stageDensity ?? "Balanced") {
    case "Sparse":
      return 1;
    case "Dense":
      return 0.85;
    default:
      return 0.95;
  }
}

function zoomDepthBias(
  context: NexoraObjectMaterialResolutionContext,
): NexoraObjectDepthLevel | null {
  if (context.zoomLevel === "Far") return "Flat";
  if (context.zoomLevel === "Near") return "Elevated";
  return null;
}

// ─── Theme tokens ───────────────────────────────────────────────────────────

export function resolveThemeTokens(
  theme: NexoraObjectMaterialTheme,
  profile: NexoraObjectRepresentationProfile,
  context: NexoraObjectMaterialResolutionContext,
): NexoraObjectThemeTokens {
  const resolvedTheme =
    theme === "Auto"
      ? context.interactionMode === "Operate"
        ? "Dark"
        : "Light"
      : theme;

  const density =
    context.stageDensity === "Dense"
      ? "dense"
      : context.stageDensity === "Sparse"
        ? "sparse"
        : "balanced";

  return deepFreeze({
    theme: resolvedTheme,
    surfaceToken: `theme.${resolvedTheme.toLowerCase()}.surface.${profile.toLowerCase()}`,
    contrastToken: `theme.${resolvedTheme.toLowerCase()}.contrast`,
    edgeToken: `theme.${resolvedTheme.toLowerCase()}.edge`,
    glowToken: `theme.${resolvedTheme.toLowerCase()}.glow`,
    shadowToken: `theme.${resolvedTheme.toLowerCase()}.shadow`,
    densityToken: `density.${density}`,
  });
}

// ─── Profile / layer / opacity / emphasis ───────────────────────────────────

export function resolveMaterialProfile(
  representation: NexoraObjectRepresentation,
): NexoraObjectRepresentationProfile {
  return representation.profile;
}

export function resolveMaterialLayer(
  representation: NexoraObjectRepresentation,
  context: NexoraObjectMaterialResolutionContext,
): NexoraObjectMaterialLayer {
  const historical =
    context.historicalMode === true ||
    representation.profile === "Historical" ||
    representation.material.emphasis === "Historical";

  if (historical) return "Historical";
  if (!representation.visible) return "Background";

  const emphasis = representation.material.emphasis;
  if (emphasis === "Focused") return "Focused";
  if (emphasis === "Attention" || emphasis === "Critical") return "Attention";
  if (emphasis === "Selected") return "Selected";
  if (emphasis === "Background") return "Background";
  if (representation.state === "Operation") return "Overlay";
  return "Normal";
}

export function resolveOpacity(
  representation: NexoraObjectRepresentation,
  context: NexoraObjectMaterialResolutionContext,
): number {
  if (!representation.visible) return 0;

  let opacity = representation.material.opacity;
  const historical =
    context.historicalMode === true ||
    representation.profile === "Historical" ||
    representation.material.emphasis === "Historical";

  if (historical) opacity = Math.min(opacity, 0.55);
  if (representation.material.emphasis === "Background") {
    opacity = Math.min(opacity, 0.7);
  }
  if (representation.material.emphasis === "Focused") {
    opacity = Math.max(opacity, 1);
  }
  if (representation.material.emphasis === "Selected") {
    // unchanged unless density requires a slight lift toward full visibility
    opacity = Math.max(opacity, Math.min(1, opacity));
  }

  opacity *= densityFactor(context);
  if (representation.material.emphasis === "Focused") {
    opacity = Math.min(1, Math.max(opacity, 0.98));
  }

  // Clamp
  if (opacity < 0) return 0;
  if (opacity > 1) return 1;
  return Number(opacity.toFixed(4));
}

export function resolveEmphasis(
  representation: NexoraObjectRepresentation,
): NexoraObjectResolvedEmphasis {
  if (!representation.visible) return "None";
  if (representation.material.color.seed === "Red") return "Critical";
  if (representation.material.emphasis === "Critical") return "Critical";
  if (representation.material.emphasis === "Focused") return "Strong";
  if (representation.material.emphasis === "Attention") return "Strong";
  if (representation.material.emphasis === "Selected") return "Medium";
  if (representation.material.emphasis === "Background") return "Soft";
  if (representation.material.emphasis === "Historical") return "Soft";
  if (representation.material.emphasis === "Disabled") return "None";
  return "Soft";
}

export function resolveOutline(
  representation: NexoraObjectRepresentation,
  emphasis: NexoraObjectResolvedEmphasis,
): NexoraObjectOutlineLevel {
  if (!representation.visible) return "None";
  if (emphasis === "Critical" || emphasis === "Strong") return "Bold";
  if (emphasis === "Medium") return "Normal";
  if (representation.material.border.visible) {
    switch (representation.material.border.weight) {
      case "Thick":
        return "Bold";
      case "Medium":
        return "Normal";
      case "Thin":
        return "Thin";
      default:
        return "None";
    }
  }
  if (emphasis === "Soft") return "Thin";
  return "None";
}

export function resolveGlow(
  representation: NexoraObjectRepresentation,
  emphasis: NexoraObjectResolvedEmphasis,
): NexoraObjectGlowLevel {
  if (!representation.visible) return "None";
  if (emphasis === "Critical") return "Strong";
  if (emphasis === "Strong") return "Normal";
  if (emphasis === "Medium") return "Soft";
  if (representation.material.light.glow) return "Soft";
  return "None";
}

export function resolveShadow(
  representation: NexoraObjectRepresentation,
  layer: NexoraObjectMaterialLayer,
): NexoraObjectShadowLevel {
  if (!representation.visible) return "None";
  if (layer === "Historical" || layer === "Background") return "None";
  if (layer === "Focused" || layer === "Overlay") return "Large";
  if (layer === "Attention" || layer === "Selected") return "Medium";
  if (representation.material.shadow.visible) {
    return representation.material.shadow.softness === "Hard"
      ? "Medium"
      : "Small";
  }
  return "Small";
}

export function resolveDepth(
  representation: NexoraObjectRepresentation,
  layer: NexoraObjectMaterialLayer,
  context: NexoraObjectMaterialResolutionContext,
): NexoraObjectDepthLevel {
  const zoomBias = zoomDepthBias(context);
  if (zoomBias === "Flat" && layer !== "Focused" && layer !== "Overlay") {
    return "Flat";
  }
  if (layer === "Focused" || layer === "Overlay") return "Elevated";
  if (layer === "Attention") return "Deep";
  if (layer === "Selected") return "Medium";
  if (layer === "Historical" || layer === "Background") return "Flat";

  switch (representation.material.depth.level) {
    case "Flat":
      return zoomBias === "Elevated" ? "Shallow" : "Flat";
    case "Shallow":
      return "Shallow";
    case "Medium":
      return "Medium";
    case "Deep":
      return "Deep";
  }
}

export function resolveAnimationHints(
  representation: NexoraObjectRepresentation,
  emphasis: NexoraObjectResolvedEmphasis,
  context: NexoraObjectMaterialResolutionContext,
): NexoraObjectAnimationHints {
  const operate = context.interactionMode === "Operate";
  return deepFreeze({
    appear: representation.state === "Minimum" ? "Fade" : "Scale",
    disappear: "Fade",
    focus: emphasis === "Strong" || emphasis === "Critical" ? "Elevate" : "Pulse",
    selection: emphasis === "Medium" || emphasis === "Strong" ? "Outline" : "Glow",
    attention:
      emphasis === "Critical"
        ? "Flash"
        : emphasis === "Strong"
          ? "Pulse"
          : "None",
    transitionDuration: operate
      ? "Short"
      : representation.state === "Minimum"
        ? "Medium"
        : "Short",
    easingHint: operate ? "EaseOut" : "EaseInOut",
  });
}

// ─── Cache key ──────────────────────────────────────────────────────────────

export function createMaterialCacheKey(input: {
  readonly representationVersion: string;
  readonly state: NexoraObjectRepresentationState;
  readonly theme: NexoraObjectMaterialTheme;
  readonly emphasis: NexoraObjectResolvedEmphasis;
  readonly status: NexoraObjectSeedColor;
  readonly profile: NexoraObjectRepresentationProfile;
  readonly layer?: NexoraObjectMaterialLayer;
  readonly opacity?: number;
}): string {
  const parts = [
    materialStateResolutionSchemaVersion,
    input.representationVersion,
    input.state,
    input.theme,
    input.emphasis,
    input.status,
    input.profile,
    input.layer ?? "",
    input.opacity === undefined ? "" : input.opacity.toFixed(4),
  ];
  return parts.join("|");
}

// ─── Primary resolution ─────────────────────────────────────────────────────

export function resolveMaterialState(
  representation: NexoraObjectRepresentation,
  context: NexoraObjectMaterialResolutionContext,
): NexoraObjectMaterialState {
  if (!isRepresentation(representation)) {
    throw new NexoraObjectMaterialStateResolutionException(
      err(
        "MATERIAL_STATE_INVALID_REPRESENTATION",
        "Value is not a valid NexoraObjectRepresentation.",
      ),
    );
  }

  // Snapshot seed before resolution — theme must never rewrite it.
  const seedColor = representation.material.color.seed;
  const profile = resolveMaterialProfile(representation);
  const themeTokens = resolveThemeTokens(context.theme, profile, context);
  const layer = resolveMaterialLayer(representation, context);
  const emphasis = resolveEmphasis(representation);
  const opacity = resolveOpacity(representation, context);
  const outline = resolveOutline(representation, emphasis);
  const glow = resolveGlow(representation, emphasis);
  const shadow = resolveShadow(representation, layer);
  const depth = resolveDepth(representation, layer, context);
  const animationHints = resolveAnimationHints(
    representation,
    emphasis,
    context,
  );

  // Preserve original material (including Seed) — theme tokens sit beside it.
  const material = deepFreeze({
    ...representation.material,
    color: deepFreeze({ ...representation.material.color }),
    depth: deepFreeze({ ...representation.material.depth }),
    light: deepFreeze({ ...representation.material.light }),
    border: deepFreeze({ ...representation.material.border }),
    shadow: deepFreeze({ ...representation.material.shadow }),
  });

  if (material.color.seed !== seedColor) {
    throw new NexoraObjectMaterialStateResolutionException(
      err(
        "MATERIAL_STATE_SEED_COLOR_MUTATION",
        "Material resolution attempted to change Seed color.",
        { before: seedColor, after: material.color.seed },
      ),
    );
  }

  const cacheKey = createMaterialCacheKey({
    representationVersion: representation.representationVersion,
    state: representation.state,
    theme: themeTokens.theme,
    emphasis,
    status: seedColor,
    profile,
    layer,
    opacity,
  });

  const state = deepFreeze({
    materialStateId: `ms:${representation.objectId}:${representation.state}:${themeTokens.theme}:${cacheKey}`,
    materialStateVersion: materialStateResolutionModelVersion,
    schemaVersion: materialStateResolutionSchemaVersion,
    representationState: representation.state,
    profile,
    material,
    geometry: deepFreeze({ ...representation.geometry }),
    seedColor,
    emphasis,
    visibility: representation.visible && opacity > 0,
    depth,
    opacity,
    outline,
    glow,
    shadow,
    layer,
    theme: themeTokens.theme,
    themeTokens,
    animationHints,
    cacheKey,
  } satisfies NexoraObjectMaterialState);

  const validation = validateMaterialState(state, representation);
  if (!validation.ok) {
    throw new NexoraObjectMaterialStateResolutionException(
      validation.errors[0]!,
    );
  }

  return state;
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateMaterialState(
  state: NexoraObjectMaterialState,
  representation?: NexoraObjectRepresentation,
): NexoraObjectMaterialStateValidationResult {
  const errors: NexoraObjectMaterialStateError[] = [];
  const warnings: NexoraObjectMaterialStateError[] = [];

  if (state.schemaVersion !== materialStateResolutionSchemaVersion) {
    errors.push(
      err(
        "MATERIAL_STATE_UNSUPPORTED_VERSION",
        `Unsupported material state schema: ${state.schemaVersion}`,
      ),
    );
  }

  if (
    typeof state.opacity !== "number" ||
    Number.isNaN(state.opacity) ||
    state.opacity < 0 ||
    state.opacity > 1
  ) {
    errors.push(
      err(
        "MATERIAL_STATE_INVALID_OPACITY",
        "Opacity must be a finite number between 0 and 1.",
        { opacity: state.opacity },
      ),
    );
  }

  if (!(state.layer in NEXORA_OBJECT_MATERIAL_LAYER_PRIORITY)) {
    errors.push(
      err(
        "MATERIAL_STATE_INVALID_LAYER",
        `Unknown material layer: ${String(state.layer)}`,
      ),
    );
  }

  const emphasisValues: readonly NexoraObjectResolvedEmphasis[] = [
    "None",
    "Soft",
    "Medium",
    "Strong",
    "Critical",
  ];
  if (!emphasisValues.includes(state.emphasis)) {
    errors.push(
      err(
        "MATERIAL_STATE_INVALID_EMPHASIS",
        `Unknown emphasis: ${String(state.emphasis)}`,
      ),
    );
  }

  if (!state.cacheKey || typeof state.cacheKey !== "string") {
    errors.push(
      err(
        "MATERIAL_STATE_INVALID_CACHE_KEY",
        "Material cache key must be a non-empty string.",
      ),
    );
  }

  if (representation) {
    if (state.seedColor !== representation.material.color.seed) {
      errors.push(
        err(
          "MATERIAL_STATE_SEED_COLOR_MUTATION",
          "Resolved Seed color diverged from representation Seed color.",
          {
            representation: representation.material.color.seed,
            resolved: state.seedColor,
          },
        ),
      );
    }
    if (state.material.color.seed !== representation.material.color.seed) {
      errors.push(
        err(
          "MATERIAL_STATE_SEED_COLOR_MUTATION",
          "Material Seed color was rewritten during resolution.",
        ),
      );
    }
  }

  if (!Object.isFrozen(state)) {
    errors.push(
      err(
        "MATERIAL_STATE_INVARIANT_VIOLATION",
        "Material state must be immutable.",
      ),
    );
  }

  // Focused must outrank Selected in priority table.
  if (
    NEXORA_OBJECT_MATERIAL_LAYER_PRIORITY.Focused <=
    NEXORA_OBJECT_MATERIAL_LAYER_PRIORITY.Selected
  ) {
    errors.push(
      err(
        "MATERIAL_STATE_INVALID_LAYER",
        "Focused layer priority must exceed Selected.",
      ),
    );
  }

  if (
    NEXORA_OBJECT_MATERIAL_LAYER_PRIORITY.Historical >=
    NEXORA_OBJECT_MATERIAL_LAYER_PRIORITY.Background
  ) {
    warnings.push(
      err(
        "MATERIAL_STATE_INVALID_LAYER",
        "Historical should render below active overlays.",
      ),
    );
  }

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
  });
}

// ─── Serialization ──────────────────────────────────────────────────────────

export function serializeMaterialState(
  state: NexoraObjectMaterialState,
): string {
  const validation = validateMaterialState(state);
  if (!validation.ok) {
    throw new NexoraObjectMaterialStateResolutionException(
      validation.errors[0]!,
    );
  }
  return JSON.stringify({
    engineIdentity: materialStateResolutionModelIdentity,
    schemaVersion: materialStateResolutionSchemaVersion,
    foundationIdentity: NOL_MATERIAL_RESOLUTION_UPSTREAM,
    foundationSchemaVersion: materialRepresentationSchemaVersion,
    state,
  });
}

export function deserializeMaterialState(
  json: string,
): NexoraObjectMaterialState {
  const parsed = JSON.parse(json) as {
    readonly engineIdentity?: string;
    readonly schemaVersion?: string;
    readonly state?: NexoraObjectMaterialState;
  };

  if (parsed.schemaVersion !== materialStateResolutionSchemaVersion) {
    throw new NexoraObjectMaterialStateResolutionException(
      err(
        "MATERIAL_STATE_UNSUPPORTED_VERSION",
        `Unsupported material state schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (
    parsed.engineIdentity &&
    parsed.engineIdentity !== materialStateResolutionModelIdentity
  ) {
    throw new NexoraObjectMaterialStateResolutionException(
      err(
        "MATERIAL_STATE_UNSUPPORTED_VERSION",
        `Unsupported material resolution identity: ${parsed.engineIdentity}`,
      ),
    );
  }
  if (!parsed.state) {
    throw new NexoraObjectMaterialStateResolutionException(
      err(
        "MATERIAL_STATE_INVALID_REPRESENTATION",
        "Serialized payload missing material state.",
      ),
    );
  }

  const restored = deepFreeze({
    ...parsed.state,
    material: deepFreeze({
      ...parsed.state.material,
      color: deepFreeze({ ...parsed.state.material.color }),
      depth: deepFreeze({ ...parsed.state.material.depth }),
      light: deepFreeze({ ...parsed.state.material.light }),
      border: deepFreeze({ ...parsed.state.material.border }),
      shadow: deepFreeze({ ...parsed.state.material.shadow }),
    }),
    geometry: deepFreeze({ ...parsed.state.geometry }),
    themeTokens: deepFreeze({ ...parsed.state.themeTokens }),
    animationHints: deepFreeze({ ...parsed.state.animationHints }),
  });

  const validation = validateMaterialState(restored);
  if (!validation.ok) {
    throw new NexoraObjectMaterialStateResolutionException(
      validation.errors[0]!,
    );
  }
  return restored;
}

export function getNexoraObjectMaterialStateResolutionSummary() {
  return Object.freeze({
    identity: materialStateResolutionModelIdentity,
    version: materialStateResolutionModelVersion,
    schemaVersion: materialStateResolutionSchemaVersion,
    upstream: NOL_MATERIAL_RESOLUTION_UPSTREAM,
    themes: Object.freeze(["Light", "Dark", "Auto"] as const),
    layers: Object.freeze(
      Object.keys(NEXORA_OBJECT_MATERIAL_LAYER_PRIORITY) as NexoraObjectMaterialLayer[],
    ),
    frameworkIndependent: true,
    rendererIndependent: true,
    themeNeverChangesSeed: true,
    deterministic: true,
  });
}

export const NexoraObjectMaterialStateResolutionModel = Object.freeze({
  identity: materialStateResolutionModelIdentity,
  version: materialStateResolutionModelVersion,
  schemaVersion: materialStateResolutionSchemaVersion,
  resolve: resolveMaterialState,
  resolveProfile: resolveMaterialProfile,
  resolveLayer: resolveMaterialLayer,
  resolveOpacity,
  resolveGlow,
  resolveOutline,
  resolveShadow,
  resolveAnimationHints,
  createCacheKey: createMaterialCacheKey,
  validate: validateMaterialState,
  serialize: serializeMaterialState,
  deserialize: deserializeMaterialState,
  summary: getNexoraObjectMaterialStateResolutionSummary,
});
