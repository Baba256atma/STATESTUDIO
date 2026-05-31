import type { CameraStabilityTrigger } from "./executiveDensityTypes";
import { logExecutiveCameraStability } from "./executiveDensityInstrumentation";

export type CameraStabilityDecision = {
  allowFullReframe: boolean;
  allowFocusTransition: boolean;
  maxDistanceDelta: number;
  gentleOnly: boolean;
  transitionDurationMs: number;
  reason: string;
};

let lastKnownObjectCount = 0;
let lastAutoFrameSignature = "";

export function evaluateCameraStability(input: {
  trigger: CameraStabilityTrigger;
  previousObjectCount?: number;
  nextObjectCount?: number;
  signatureChanged?: boolean;
  userRequestedFit?: boolean;
}): CameraStabilityDecision {
  const previous = Math.max(0, Math.floor(input.previousObjectCount ?? lastKnownObjectCount));
  const next = Math.max(0, Math.floor(input.nextObjectCount ?? previous));
  const addedObjects = Math.max(0, next - previous);
  const trigger = input.trigger;

  let decision: CameraStabilityDecision = {
    allowFullReframe: false,
    allowFocusTransition: true,
    maxDistanceDelta: 2.4,
    gentleOnly: true,
    transitionDurationMs: 420,
    reason: "default_gentle",
  };

  if (trigger === "fit_scene" || input.userRequestedFit) {
    decision = {
      allowFullReframe: true,
      allowFocusTransition: true,
      maxDistanceDelta: 12,
      gentleOnly: false,
      transitionDurationMs: 520,
      reason: "explicit_fit_scene",
    };
  } else if (trigger === "object_created") {
    decision = {
      allowFullReframe: addedObjects >= 8,
      allowFocusTransition: addedObjects <= 3,
      maxDistanceDelta: addedObjects >= 4 ? 1.2 : 0.65,
      gentleOnly: true,
      transitionDurationMs: addedObjects >= 4 ? 360 : 280,
      reason: addedObjects >= 8 ? "large_batch_insert" : "preserve_executive_context",
    };
  } else if (trigger === "auto_frame") {
    const incrementalChange = addedObjects > 0 && addedObjects <= 5;
    decision = {
      allowFullReframe: !incrementalChange && input.signatureChanged === true,
      allowFocusTransition: false,
      maxDistanceDelta: incrementalChange ? 0.85 : 2.2,
      gentleOnly: incrementalChange || next <= 12,
      transitionDurationMs: incrementalChange ? 320 : 480,
      reason: incrementalChange ? "suppress_disruptive_auto_frame" : "scene_signature_changed",
    };
  } else if (trigger === "focus_object" || trigger === "selection") {
    decision = {
      allowFullReframe: false,
      allowFocusTransition: true,
      maxDistanceDelta: 0.55,
      gentleOnly: true,
      transitionDurationMs: 320,
      reason: "selection_focus_assist",
    };
  } else if (trigger === "object_moved") {
    decision = {
      allowFullReframe: false,
      allowFocusTransition: false,
      maxDistanceDelta: 0.35,
      gentleOnly: true,
      transitionDurationMs: 260,
      reason: "object_reposition_only",
    };
  }

  logExecutiveCameraStability({
    trigger,
    previousObjectCount: previous,
    nextObjectCount: next,
    addedObjects,
    ...decision,
  });

  lastKnownObjectCount = next;
  return decision;
}

export function registerAutoFrameSignature(signature: string, objectCount: number): void {
  lastAutoFrameSignature = signature;
  lastKnownObjectCount = Math.max(0, objectCount);
}

export function getLastAutoFrameSignature(): string {
  return lastAutoFrameSignature;
}

export function resetExecutiveCameraStabilityForTests(): void {
  lastKnownObjectCount = 0;
  lastAutoFrameSignature = "";
}
