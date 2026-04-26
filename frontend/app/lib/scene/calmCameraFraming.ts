/**
 * Default Nexora camera policy: group-first framing, soft focus bias, capped motion.
 * Centralized so SceneCanvas (orbit + auto-frame) and SceneRenderer (look bias) stay aligned.
 */
export const CALM_FRAMING = {
  /** Multiplier on computed scene radius — pulls camera back for edge margins. */
  groupRadiusPadding: 1.14,
  /** OrbitControls / auto-frame lerp per frame (lower = calmer). */
  shellCameraLerp: 0.06,
  /** Max world-units camera may move toward desired position in one frame. */
  maxCamPosStep: 0.32,
  /** Max world-units OrbitControls target may move toward desired in one frame. */
  maxTargetStep: 0.2,
  /** After user orbits, suppress aggressive auto-framing (ms). */
  userSettleAfterOrbitMs: 2200,
  /** Focus assist: max lerp factor from baseline lookAt toward focus (never full isolate). */
  maxFocusAssistLookLerp: 0.1,
  /** Focus assist: position nudge scales vs lookAt delta (keep small). */
  focusAssistCamPosAlongDelta: 0.28,
  focusAssistCamPosVerticalScale: 0.12,
  /** Max shift of lookAt from baseline as fraction of scene radius (visibility guard). */
  maxLookShiftVsRadius: 0.32,
  /** Micro-focus profile strengths (applied as lerp from scene center toward target). */
  biasStrength: {
    primary: 0.2,
    affected: 0.09,
    context: 0.045,
    neutral: 0.012,
  },
  /** Extra narrative / propagation layers (capped). */
  narrativeBiasPrimary: 0.12,
  narrativeBiasOther: 0.07,
  simulationBiasScale: 0.05,
  /** SceneRenderer CameraLerper lerp (rotation/position feel). */
  lerperAlpha: 0.06,
  lerperAlphaMotionCalm: 0.04,
} as const;

export function sceneRadiusFromBoundsSize(size: [number, number, number]): number {
  const [sx, sy, sz] = size;
  return Math.max(0.1, Math.max(sx, sy, sz) * 0.5);
}

/** Clamp lookAt delta so auto-assist does not throw the group out of frame. */
export function clampLookAtDeltaToRadius(
  baseline: { x: number; y: number; z: number },
  proposed: { x: number; y: number; z: number },
  radius: number,
  maxShiftVsRadius: number
): { x: number; y: number; z: number } {
  const maxShift = Math.max(0.35, radius * maxShiftVsRadius);
  const dx = proposed.x - baseline.x;
  const dy = proposed.y - baseline.y;
  const dz = proposed.z - baseline.z;
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (len <= maxShift || len < 1e-6) return { x: proposed.x, y: proposed.y, z: proposed.z };
  const s = maxShift / len;
  return {
    x: baseline.x + dx * s,
    y: baseline.y + dy * s,
    z: baseline.z + dz * s,
  };
}
