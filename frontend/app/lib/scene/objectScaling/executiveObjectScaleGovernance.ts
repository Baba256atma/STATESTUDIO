/**
 * P2 — View-mode aware executive object scale governance.
 */

import type { WorkspaceViewMode } from "../../workspace/workspaceViewModeTypes";
import type { ExecutiveObjectLayoutRole } from "../composition/normalizeExecutiveObjectLayout";
import { shouldSuppressIdleDebugLog } from "../../runtime/idleRuntimeStabilityGuard";
import type { ExecutiveObjectImportanceTier } from "./executiveObjectScalingTypes";

export const SELECTED_MAX_EXECUTIVE_SCALE = 1.35;
export const STRATEGIC_2D_Y_FLATTEN = 0.32;
export const MAX_FOOTPRINT_TO_AVERAGE_RATIO = 2.0;

export type ExecutiveViewModeScaleLimits = {
  minScale: number;
  maxScale: number;
  selectedMaxScale: number;
};

export const EXECUTIVE_VIEW_MODE_SCALE_LIMITS: Readonly<
  Record<Extract<WorkspaceViewMode, "2D" | "3D">, ExecutiveViewModeScaleLimits>
> = Object.freeze({
  "2D": Object.freeze({
    minScale: 0.45,
    maxScale: 0.85,
    selectedMaxScale: 0.95,
  }),
  "3D": Object.freeze({
    minScale: 0.65,
    maxScale: 1.25,
    selectedMaxScale: SELECTED_MAX_EXECUTIVE_SCALE,
  }),
});

const ROLE_SCALE_WEIGHT: Readonly<Record<ExecutiveObjectLayoutRole, number>> = Object.freeze({
  center: 1.0,
  flow: 0.85,
  risk: 0.9,
  outcome: 0.85,
  other: 0.75,
});

const loggedGovernanceSignatures = new Set<string>();

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function roundScale(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function resolveExecutiveViewModeScaleLimits(
  viewMode: WorkspaceViewMode
): ExecutiveViewModeScaleLimits {
  return viewMode === "2D" ? EXECUTIVE_VIEW_MODE_SCALE_LIMITS["2D"] : EXECUTIVE_VIEW_MODE_SCALE_LIMITS["3D"];
}

export function resolveExecutiveRoleScaleWeight(role?: ExecutiveObjectLayoutRole | null): number {
  if (!role) return 1;
  return ROLE_SCALE_WEIGHT[role] ?? ROLE_SCALE_WEIGHT.other;
}

export type ExecutiveObjectScaleGovernanceInput = {
  objectId?: string | null;
  rawScale: number;
  baseScale: number;
  objectCount?: number;
  viewMode: WorkspaceViewMode;
  role?: ExecutiveObjectLayoutRole | null;
  importance?: ExecutiveObjectImportanceTier;
  selected?: boolean;
  focused?: boolean;
  zoneLike?: boolean;
};

export type ExecutiveObjectScaleGovernanceResult = {
  scale: number;
  minScale: number;
  maxScale: number;
  reason: string;
};

export function applyExecutiveObjectScaleGovernance(
  input: ExecutiveObjectScaleGovernanceInput
): ExecutiveObjectScaleGovernanceResult {
  const limits = resolveExecutiveViewModeScaleLimits(input.viewMode);
  const selectedOrFocused = input.selected === true || input.focused === true;
  const maxAllowed = selectedOrFocused ? limits.selectedMaxScale : limits.maxScale;

  let scale = input.baseScale * resolveExecutiveRoleScaleWeight(input.role);
  let reason = "role_weight";

  if (input.zoneLike) {
    scale *= 0.92;
    reason = "zone_like_penalty";
  }

  if (selectedOrFocused) {
    scale *= input.viewMode === "2D" ? 1.04 : 1.06;
    reason = "selected_focus_boost";
  }

  scale = clamp(scale, limits.minScale, maxAllowed);

  if (Math.abs(scale - input.baseScale) > 0.001 && reason === "role_weight") {
    reason = "view_mode_clamp";
  }

  const governedScale = roundScale(scale);

  logObjectScaleGovernanceOnce({
    id: input.objectId ?? "unknown",
    viewMode: input.viewMode,
    role: input.role ?? "other",
    rawScale: roundScale(input.rawScale),
    governedScale,
    minScale: limits.minScale,
    maxScale: maxAllowed,
    reason,
  });

  return {
    scale: governedScale,
    minScale: limits.minScale,
    maxScale: maxAllowed,
    reason,
  };
}

export function clampExecutiveObjectFootprintScale(input: {
  transformScale: number;
  viewMode: WorkspaceViewMode;
  averageFootprint?: number;
}): number {
  const limits = resolveExecutiveViewModeScaleLimits(input.viewMode);
  const average =
    input.averageFootprint ??
    (input.viewMode === "2D"
      ? (limits.minScale + limits.maxScale) / 2
      : (limits.minScale + limits.maxScale) / 2);
  const maxFootprint = average * MAX_FOOTPRINT_TO_AVERAGE_RATIO;
  return roundScale(Math.min(input.transformScale, maxFootprint));
}

export function flattenExecutive2DGroupScale(uniform: number): [number, number, number] {
  return [uniform, uniform * STRATEGIC_2D_Y_FLATTEN, uniform];
}

export function logObjectScaleGovernanceOnce(payload: {
  id: string;
  viewMode: WorkspaceViewMode;
  role: ExecutiveObjectLayoutRole | string;
  rawScale: number;
  governedScale: number;
  minScale: number;
  maxScale: number;
  reason: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  const signature = [
    payload.id,
    payload.viewMode,
    payload.role,
    payload.rawScale,
    payload.governedScale,
    payload.minScale,
    payload.maxScale,
    payload.reason,
  ].join("|");
  if (loggedGovernanceSignatures.has(signature)) return;
  if (shouldSuppressIdleDebugLog(`object-scale-governance:${signature}`)) return;
  loggedGovernanceSignatures.add(signature);
  console.info("[Nexora][ObjectScaleGovernance]", payload);
}

export function resetExecutiveObjectScaleGovernanceForTests(): void {
  loggedGovernanceSignatures.clear();
}
