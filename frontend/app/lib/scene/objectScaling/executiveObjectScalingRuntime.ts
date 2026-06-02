import type { ExecutiveCameraPresetId } from "../camera/executiveCameraPresetRegistry";
import type {
  ExecutiveObjectImportanceTier,
  ExecutiveObjectScaleInput,
  ExecutiveObjectScaleResult,
  ExecutivePresentationScaleTier,
} from "./executiveObjectScalingTypes";
import { logExecutiveObjectScaleDiagnostic } from "./executiveScalingDiagnostics";

const PRESENTATION_TIER_SCALE: Readonly<Record<ExecutivePresentationScaleTier, number>> = Object.freeze({
  tiny: 0.76,
  small: 0.86,
  medium: 0.96,
  large: 1.08,
  critical: 1.18,
});

const IMPORTANCE_MULTIPLIERS: Readonly<Record<ExecutiveObjectImportanceTier, number>> = Object.freeze({
  critical: 1.16,
  important: 1.08,
  supporting: 1,
  minor: 0.94,
});

const MIN_READABLE_SCALE_BY_COUNT: ReadonlyArray<{ maxCount: number; minScale: number }> = [
  { maxCount: 5, minScale: 0.82 },
  { maxCount: 10, minScale: 0.76 },
  { maxCount: 25, minScale: 0.68 },
  { maxCount: 50, minScale: 0.6 },
  { maxCount: Number.POSITIVE_INFINITY, minScale: 0.52 },
];

const MAX_EXECUTIVE_OBJECT_SCALE = 1.35;
const MIN_EXECUTIVE_OBJECT_SCALE = 0.25;
const FOCUS_SCALE_BOOST = 1.06;
const SELECTED_SCALE_BOOST = 1.04;
const HOVER_SCALE_BOOST = 1.025;
const DIMMED_SCALE_MULTIPLIER = 0.94;

const scaleResultCache = new Map<string, ExecutiveObjectScaleResult>();

function clampScale(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.max(MIN_EXECUTIVE_OBJECT_SCALE, Math.min(MAX_EXECUTIVE_OBJECT_SCALE, value));
}

function roundScaleBucket(value: number): number {
  return Math.round(value * 100) / 100;
}

function clampCount(value: number | undefined): number {
  return Math.max(1, Math.floor(Number(value ?? 1)));
}

export function resolveExecutivePresentationTier(objectCount: number): ExecutivePresentationScaleTier {
  if (objectCount <= 5) return "critical";
  if (objectCount <= 10) return "large";
  if (objectCount <= 25) return "medium";
  if (objectCount <= 50) return "small";
  return "tiny";
}

export function resolveExecutiveDensityScaleMultiplier(objectCount: number): number {
  if (objectCount <= 1) return 1.08;
  if (objectCount <= 5) return 1.04;
  if (objectCount <= 10) return 1;
  if (objectCount <= 25) return 0.96;
  if (objectCount <= 50) return 0.92;
  if (objectCount <= 100) return 0.88;
  return 0.85;
}

export function resolveExecutiveViewportScaleMultiplier(
  viewportWidth?: number,
  viewportHeight?: number
): number {
  if (!viewportWidth || !viewportHeight) return 1.04;
  const minDim = Math.min(viewportWidth, viewportHeight);
  if (minDim < 640) return 1.12;
  if (minDim < 900) return 1.08;
  if (minDim < 1200) return 1.04;
  return 1;
}

export function resolveExecutiveCameraPresetScaleMultiplier(
  preset?: ExecutiveCameraPresetId | null
): number {
  switch (preset) {
    case "FOCUS":
    case "FIT_SCENE":
      return 1;
    case "GLOBAL":
    case "GLOBAL_VIEW":
      return 1.06;
    case "RISK":
      return 1.08;
    case "OPERATIONS":
      return 1.05;
    case "SCENARIO":
      return 1.04;
    case "VIEW_2D":
      return 1.02;
    case "VIEW_3D":
    case "EXECUTIVE":
    default:
      return 1.1;
  }
}

export function resolveMinimumReadableObjectScale(objectCount: number): number {
  for (const tier of MIN_READABLE_SCALE_BY_COUNT) {
    if (objectCount <= tier.maxCount) return tier.minScale;
  }
  return 0.52;
}

export function deriveExecutiveObjectImportanceTier(input: {
  scannerSeverity?: string | null;
  scannerHighlighted?: boolean;
  connectedToSelected?: boolean;
  isDecisionPathSource?: boolean;
  isSimulationSource?: boolean;
  role?: string | null;
  selected?: boolean;
  focused?: boolean;
}): ExecutiveObjectImportanceTier {
  if (input.selected || input.focused) return "critical";
  const severity = String(input.scannerSeverity ?? "").toLowerCase();
  if (severity === "critical" || severity === "high") return "critical";
  if (input.isDecisionPathSource || input.isSimulationSource) return "important";
  if (input.scannerHighlighted || input.connectedToSelected) return "important";
  const role = String(input.role ?? "").toLowerCase();
  if (role === "core" || role === "decision" || role === "hub") return "important";
  if (role === "peripheral" || role === "context") return "minor";
  return "supporting";
}

function buildExecutiveObjectScaleSignature(input: ExecutiveObjectScaleInput): string {
  const objectCount = clampCount(input.objectCount);
  const importance = input.importance ?? "supporting";
  return [
    roundScaleBucket(Number(input.rawScale ?? 1)),
    objectCount,
    importance,
    input.selected ? 1 : 0,
    input.focused ? 1 : 0,
    input.hovered ? 1 : 0,
    input.dimmed ? 1 : 0,
    input.cameraPreset ?? "EXECUTIVE",
    Math.round(Number(input.viewportWidth ?? 0)),
    Math.round(Number(input.viewportHeight ?? 0)),
  ].join("|");
}

/** Central executive object scaling layer — density, hierarchy, focus, and hover aware. */
export function resolveExecutiveObjectScale(input: ExecutiveObjectScaleInput): ExecutiveObjectScaleResult {
  const signature = buildExecutiveObjectScaleSignature(input);
  const cached = scaleResultCache.get(signature);
  if (cached) return cached;

  const rawScale = roundScaleBucket(clampScale(Number(input.rawScale ?? 1)));
  const objectCount = clampCount(input.objectCount);
  const importance = input.importance ?? "supporting";
  const presentationTier = resolveExecutivePresentationTier(objectCount);

  let scale =
    rawScale *
    PRESENTATION_TIER_SCALE[presentationTier] *
    resolveExecutiveDensityScaleMultiplier(objectCount) *
    resolveExecutiveViewportScaleMultiplier(input.viewportWidth, input.viewportHeight) *
    resolveExecutiveCameraPresetScaleMultiplier(input.cameraPreset) *
    IMPORTANCE_MULTIPLIERS[importance];

  if (input.focused) scale *= FOCUS_SCALE_BOOST;
  else if (input.selected) scale *= SELECTED_SCALE_BOOST;
  if (input.hovered) scale *= HOVER_SCALE_BOOST;
  if (input.dimmed) scale *= DIMMED_SCALE_MULTIPLIER;

  scale = Math.max(resolveMinimumReadableObjectScale(objectCount), clampScale(scale));
  const roundedScale = roundScaleBucket(scale);

  const result: ExecutiveObjectScaleResult = {
    scale: roundedScale,
    presentationTier,
    importance,
    signature,
  };

  scaleResultCache.set(signature, result);
  logExecutiveObjectScaleDiagnostic(signature, {
    objectId: input.objectId ?? null,
    objectCount,
    presentationTier,
    importance,
    rawScale,
    resolvedScale: roundedScale,
    selected: input.selected === true,
    focused: input.focused === true,
    hovered: input.hovered === true,
    dimmed: input.dimmed === true,
    cameraPreset: input.cameraPreset ?? "EXECUTIVE",
  });

  return result;
}

export function resetExecutiveObjectScalingForTests(): void {
  scaleResultCache.clear();
}
