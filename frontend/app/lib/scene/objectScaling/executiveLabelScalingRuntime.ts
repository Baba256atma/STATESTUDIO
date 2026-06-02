import {
  deriveExecutiveObjectImportanceTier,
  resolveExecutiveCameraPresetScaleMultiplier,
  resolveExecutiveDensityScaleMultiplier,
  resolveExecutiveViewportScaleMultiplier,
} from "./executiveObjectScalingRuntime";
import type {
  ExecutiveLabelScaleInput,
  ExecutiveLabelScaleResult,
  ExecutiveObjectImportanceTier,
} from "./executiveObjectScalingTypes";
import { logExecutiveLabelScaleDiagnostic } from "./executiveScalingDiagnostics";

const MIN_LABEL_FONT_PX = 11;
const MAX_LABEL_FONT_PX = 16;

const IMPORTANCE_FONT_BOOST: Readonly<Record<ExecutiveObjectImportanceTier, number>> = Object.freeze({
  critical: 1.14,
  important: 1.08,
  supporting: 1,
  minor: 0.96,
});

const IMPORTANCE_PRIORITY: Readonly<Record<ExecutiveObjectImportanceTier, number>> = Object.freeze({
  critical: 100,
  important: 80,
  supporting: 50,
  minor: 30,
});

const labelScaleCache = new Map<string, ExecutiveLabelScaleResult>();

function clampCount(value: number | undefined): number {
  return Math.max(0, Math.floor(Number(value ?? 0)));
}

function buildLabelScaleSignature(input: ExecutiveLabelScaleInput): string {
  const importance = input.importance ?? "supporting";
  return [
    clampCount(input.objectCount),
    importance,
    input.selected ? 1 : 0,
    input.focused ? 1 : 0,
    input.hovered ? 1 : 0,
    input.dimmed ? 1 : 0,
    input.cameraPreset ?? "EXECUTIVE",
    Math.round(Number(input.viewportWidth ?? 0)),
    Math.round(Number(input.viewportHeight ?? 0)),
    Math.round(Number(input.baseFontSizePx ?? 0)),
    clampCount(input.index),
  ].join("|");
}

/** Distance-aware executive label sizing with collision-friendly prioritization. */
export function resolveExecutiveLabelScale(input: ExecutiveLabelScaleInput): ExecutiveLabelScaleResult {
  const signature = buildLabelScaleSignature(input);
  const cached = labelScaleCache.get(signature);
  if (cached) return cached;

  const objectCount = clampCount(input.objectCount);
  const importance =
    input.importance ??
    deriveExecutiveObjectImportanceTier({
      selected: input.selected,
      focused: input.focused,
    });
  const baseFontSizePx = input.baseFontSizePx ?? 12;

  const densityBoost = Math.min(1.28, resolveExecutiveDensityScaleMultiplier(Math.max(1, objectCount)) * 0.82);
  const viewportBoost = resolveExecutiveViewportScaleMultiplier(input.viewportWidth, input.viewportHeight);
  const presetBoost = Math.min(1.12, resolveExecutiveCameraPresetScaleMultiplier(input.cameraPreset) * 0.94);

  let fontSizePx =
    baseFontSizePx * densityBoost * viewportBoost * presetBoost * IMPORTANCE_FONT_BOOST[importance];

  if (input.selected || input.focused) fontSizePx *= 1.08;
  if (input.hovered) fontSizePx *= 1.04;

  fontSizePx = Math.max(MIN_LABEL_FONT_PX, Math.min(MAX_LABEL_FONT_PX, Math.round(fontSizePx)));

  let opacity = input.selected || input.focused ? 1 : objectCount <= 10 ? 0.92 : objectCount <= 25 ? 0.86 : 0.78;
  if (input.hovered) opacity = Math.min(1, opacity + 0.06);
  if (input.dimmed) opacity *= 0.72;

  const fadeWhenCrowded = objectCount > 50 && importance === "minor" && !input.selected && !input.focused;
  if (fadeWhenCrowded) opacity *= 0.82;

  let priority = IMPORTANCE_PRIORITY[importance];
  if (input.selected) priority += 40;
  if (input.focused) priority += 30;
  if (input.hovered) priority += 10;
  priority -= (input.index ?? 0) % 7;

  const result: ExecutiveLabelScaleResult = {
    fontSizePx,
    opacity: Number(opacity.toFixed(3)),
    priority,
    fadeWhenCrowded,
    signature,
  };

  labelScaleCache.set(signature, result);
  logExecutiveLabelScaleDiagnostic(signature, {
    objectCount,
    importance,
    fontSizePx,
    opacity: result.opacity,
    priority,
    fadeWhenCrowded,
    selected: input.selected === true,
    focused: input.focused === true,
    hovered: input.hovered === true,
  });

  return result;
}

export function resetExecutiveLabelScalingForTests(): void {
  labelScaleCache.clear();
}
