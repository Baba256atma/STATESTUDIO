/**
 * NPA-T STAGE-PROD:6A — semantic Object emphasis over STAGE-MOTION:1.
 * Presentation only: it reads existing focus/selection and owns no animation loop.
 */

export const stageProdObjectMotionIdentity =
  "NPA-T STAGE-PROD:6A/ObjectMotionFoundation" as const;

export const STAGE_PROD_OBJECT_MOTION_STATES = Object.freeze([
  "REST",
  "EMPHASIZED",
] as const);

export type StageProdObjectMotionState =
  (typeof STAGE_PROD_OBJECT_MOTION_STATES)[number];

export type StageProdObjectMotionPresentation = Readonly<{
  identity: typeof stageProdObjectMotionIdentity;
  canonicalObjectId: string;
  state: StageProdObjectMotionState;
  reason: "focus" | "selection" | "none";
  treatment: "stable" | "subtle-emphasis" | "stable-emphasis";
  durationMs: 180 | 0;
  transform: "translateY(0) scale(1)" | "translateY(-1px) scale(1.015)" | "none";
  reducedMotion: boolean;
  continuousAnimation: false;
  writesCanonicalManagementState: false;
}>;

export function projectStageProdObjectMotion(input: Readonly<{
  canonicalObjectId: string;
  focused: boolean;
  selected: boolean;
  reducedMotion?: boolean;
}>): StageProdObjectMotionPresentation {
  const state: StageProdObjectMotionState =
    input.focused || input.selected ? "EMPHASIZED" : "REST";
  const reducedMotion = input.reducedMotion === true;
  return Object.freeze({
    identity: stageProdObjectMotionIdentity,
    canonicalObjectId: input.canonicalObjectId,
    state,
    reason: input.focused ? "focus" : input.selected ? "selection" : "none",
    treatment:
      state === "REST"
        ? "stable"
        : reducedMotion
          ? "stable-emphasis"
          : "subtle-emphasis",
    durationMs: reducedMotion ? 0 : 180,
    transform:
      state === "REST"
        ? "translateY(0) scale(1)"
        : reducedMotion
          ? "none"
          : "translateY(-1px) scale(1.015)",
    reducedMotion,
    continuousAnimation: false,
    writesCanonicalManagementState: false,
  });
}
