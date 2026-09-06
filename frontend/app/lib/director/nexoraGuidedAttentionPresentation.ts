/**
 * DIR:GA — reusable Guided Attention presentation.
 * Conversation may request attention. This authority owns temporary visual cue
 * state. It does not write focus, selection, priority, evidence, or business
 * truth. It does not query the DOM.
 */

export const nexoraGuidedAttentionIdentity =
  "DIR:GA/NexoraGuidedAttentionPresentation" as const;
export const nexoraGuidedAttentionVersion = "1.0.0" as const;
export const nexoraGuidedAttentionNamespace =
  "nexora.director.guided-attention-presentation" as const;

export const NEXORA_GUIDED_ATTENTION_DURATION_MS = 3000 as const;

export const NEXORA_GUIDED_ATTENTION_TARGETS = Object.freeze([
  "DATA_ENTRY",
  "BACK_CONTROL",
  "STAGE",
] as const);

export type NexoraGuidedAttentionTarget =
  (typeof NEXORA_GUIDED_ATTENTION_TARGETS)[number];

export const NEXORA_GUIDED_ATTENTION_CUES = Object.freeze([
  "SOFT_HALO",
  "EMPHASIS",
] as const);

export type NexoraGuidedAttentionCue =
  (typeof NEXORA_GUIDED_ATTENTION_CUES)[number];

export const NEXORA_GUIDED_ATTENTION_AVAILABILITY = Object.freeze([
  "AVAILABLE",
  "UNAVAILABLE",
] as const);

export type NexoraGuidedAttentionAvailability =
  (typeof NEXORA_GUIDED_ATTENTION_AVAILABILITY)[number];

export const NEXORA_GUIDED_ATTENTION_BOUNDARY = Object.freeze({
  identity: nexoraGuidedAttentionIdentity,
  advisorOwnsDom: false as const,
  autoClicks: false as const,
  equalsFocus: false as const,
  equalsSelection: false as const,
  equalsPriority: false as const,
  equalsEvidence: false as const,
  writesBusinessTruth: false as const,
  requiresNexEnt: false as const,
  durableStore: false as const,
});

export type NexoraGuidedAttentionPresentation = {
  readonly requestId: string;
  readonly target: NexoraGuidedAttentionTarget;
  readonly availability: NexoraGuidedAttentionAvailability;
  readonly cue: NexoraGuidedAttentionCue | null;
  readonly reason: string;
  readonly startedAtMs: number;
  readonly expiresAtMs: number;
  readonly presentationOwner: "director-stage";
  readonly mutatesFocus: false;
  readonly mutatesSelection: false;
  readonly mutatesPriority: false;
};

export type NexoraGuidedAttentionRuntime = {
  readonly presentation: NexoraGuidedAttentionPresentation | null;
  readonly pendingOfferTarget: NexoraGuidedAttentionTarget | null;
};

export function emptyNexoraGuidedAttentionRuntime(): NexoraGuidedAttentionRuntime {
  return Object.freeze({
    presentation: null,
    pendingOfferTarget: null,
  });
}

export function getNexoraGuidedAttentionIdentity() {
  return Object.freeze({
    id: nexoraGuidedAttentionIdentity,
    version: nexoraGuidedAttentionVersion,
    namespace: nexoraGuidedAttentionNamespace,
  });
}

export function verifyNexoraGuidedAttention(): { readonly ok: true } {
  if (getNexoraGuidedAttentionIdentity().id !== nexoraGuidedAttentionIdentity) {
    throw new Error("DIR:GA identity mismatch");
  }
  if (NEXORA_GUIDED_ATTENTION_BOUNDARY.advisorOwnsDom) {
    throw new Error("DIR:GA must not let Advisor own DOM");
  }
  if (NEXORA_GUIDED_ATTENTION_BOUNDARY.equalsFocus) {
    throw new Error("DIR:GA must not equate attention with focus");
  }
  if (NEXORA_GUIDED_ATTENTION_BOUNDARY.requiresNexEnt) {
    throw new Error("DIR:GA must be reusable outside NEX-ENT");
  }
  return Object.freeze({ ok: true as const });
}

export function isNexoraGuidedAttentionTarget(
  value: string,
): value is NexoraGuidedAttentionTarget {
  return (NEXORA_GUIDED_ATTENTION_TARGETS as readonly string[]).includes(value);
}

export function resolveNexoraGuidedAttentionCue(input: {
  readonly reducedMotion: boolean;
}): NexoraGuidedAttentionCue {
  return input.reducedMotion ? "EMPHASIS" : "SOFT_HALO";
}

export function requestNexoraGuidedAttention(input: {
  readonly target: string;
  readonly mountedTargets: readonly NexoraGuidedAttentionTarget[];
  readonly nowMs: number;
  readonly reducedMotion?: boolean;
  readonly reason?: string;
  readonly requestId?: string;
  readonly previous?: NexoraGuidedAttentionPresentation | null;
}): NexoraGuidedAttentionPresentation {
  verifyNexoraGuidedAttention();
  if (!isNexoraGuidedAttentionTarget(input.target)) {
    return Object.freeze({
      requestId: input.requestId ?? `ga-${input.nowMs}-unknown`,
      target: "DATA_ENTRY" as const,
      availability: "UNAVAILABLE" as const,
      cue: null,
      reason: "unknown-target",
      startedAtMs: input.nowMs,
      expiresAtMs: input.nowMs + NEXORA_GUIDED_ATTENTION_DURATION_MS,
      presentationOwner: "director-stage" as const,
      mutatesFocus: false as const,
      mutatesSelection: false as const,
      mutatesPriority: false as const,
    });
  }
  const target = input.target;
  const available = input.mountedTargets.includes(target)
    ? "AVAILABLE"
    : "UNAVAILABLE";
  const cue =
    available === "AVAILABLE"
      ? resolveNexoraGuidedAttentionCue({
          reducedMotion: input.reducedMotion === true,
        })
      : null;
  return Object.freeze({
    requestId: input.requestId ?? `ga-${input.nowMs}-${target}`,
    target,
    availability: available,
    cue,
    reason: input.reason ?? "manager-guidance",
    startedAtMs: input.nowMs,
    expiresAtMs: input.nowMs + NEXORA_GUIDED_ATTENTION_DURATION_MS,
    presentationOwner: "director-stage" as const,
    mutatesFocus: false as const,
    mutatesSelection: false as const,
    mutatesPriority: false as const,
  });
}

export function expireNexoraGuidedAttention(
  presentation: NexoraGuidedAttentionPresentation | null,
  nowMs: number,
): NexoraGuidedAttentionPresentation | null {
  if (presentation == null) return null;
  if (nowMs >= presentation.expiresAtMs) return null;
  return presentation;
}

export function applyNexoraGuidedAttentionRuntime(input: {
  readonly previous?: NexoraGuidedAttentionRuntime | null;
  readonly request?: NexoraGuidedAttentionPresentation | null;
  readonly pendingOfferTarget?: NexoraGuidedAttentionTarget | null;
  readonly clear?: boolean;
  readonly nowMs: number;
}): NexoraGuidedAttentionRuntime {
  if (input.clear) {
    return emptyNexoraGuidedAttentionRuntime();
  }
  const previous = input.previous ?? emptyNexoraGuidedAttentionRuntime();
  const presentation =
    input.request ??
    expireNexoraGuidedAttention(previous.presentation, input.nowMs);
  return Object.freeze({
    presentation,
    pendingOfferTarget:
      input.pendingOfferTarget === undefined
        ? previous.pendingOfferTarget
        : input.pendingOfferTarget,
  });
}

export function composeNexoraGuidedAttentionCopy(
  presentation: NexoraGuidedAttentionPresentation,
): string {
  if (presentation.reason === "unknown-target") {
    return "That isn’t available in the current view.";
  }
  const highlighted = presentation.availability === "AVAILABLE";
  switch (presentation.target) {
    case "DATA_ENTRY":
      return highlighted
        ? "Use Data. I’ve highlighted it for you."
        : "Data isn’t available in the current view.";
    case "BACK_CONTROL":
      return highlighted
        ? "Use Back. I’ve highlighted it."
        : "Back isn’t available in the current view.";
    case "STAGE":
      return highlighted
        ? "On the Stage — I’ve highlighted the workspace."
        : "The Stage isn’t available in the current view.";
  }
}

export function managerLabelForGuidedAttentionTarget(
  target: NexoraGuidedAttentionTarget,
): string {
  switch (target) {
    case "DATA_ENTRY":
      return "Data";
    case "BACK_CONTROL":
      return "Back";
    case "STAGE":
      return "Stage";
  }
}
