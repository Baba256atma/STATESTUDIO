import type React from "react";

import { logExecutiveMotionGovernance } from "./executiveHarmonizationInstrumentation";

export type ExecutiveMotionProfile =
  | "panel"
  | "hover"
  | "focus"
  | "collapse"
  | "camera"
  | "status";

export type ExecutiveMotionSnapshot = {
  profile: ExecutiveMotionProfile;
  durationMs: number;
  easing: string;
  transform?: string;
  opacity?: number;
};

const MOTION_PROFILES: Record<ExecutiveMotionProfile, ExecutiveMotionSnapshot> = {
  panel: { profile: "panel", durationMs: 180, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  hover: { profile: "hover", durationMs: 120, easing: "ease", transform: "translateY(-1px)" },
  focus: { profile: "focus", durationMs: 140, easing: "ease" },
  collapse: { profile: "collapse", durationMs: 200, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  camera: { profile: "camera", durationMs: 260, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  status: { profile: "status", durationMs: 160, easing: "ease" },
};

/** E2:49 Part 8 — subtle, predictable executive motion standards. */
export function resolveExecutiveMotion(profile: ExecutiveMotionProfile): ExecutiveMotionSnapshot {
  const snapshot = { ...MOTION_PROFILES[profile] };
  logExecutiveMotionGovernance("resolved", snapshot);
  return snapshot;
}

export function executiveMotionTransition(
  profile: ExecutiveMotionProfile,
  properties: string[] = ["opacity", "transform"]
): string {
  const motion = resolveExecutiveMotion(profile);
  return properties.map((prop) => `${prop} ${motion.durationMs}ms ${motion.easing}`).join(", ");
}

export function executiveMotionStyle(
  profile: ExecutiveMotionProfile,
  overrides?: React.CSSProperties
): React.CSSProperties {
  const motion = resolveExecutiveMotion(profile);
  return {
    transition: executiveMotionTransition(profile),
    ...(motion.transform ? { transform: motion.transform } : {}),
    ...(motion.opacity != null ? { opacity: motion.opacity } : {}),
    ...overrides,
  };
}

export function auditExecutiveMotionSurprise(durationMs: number): boolean {
  return durationMs <= 320;
}
