/**
 * Read-only Executive Experience Context.
 *
 * Answers: what kind of Nexora experience is currently active?
 * Does not own Entrance, BCA, Stage, Advisor, or business truth.
 * Does not write Education, Business/Project, Decision, or Data state.
 */

import {
  applyEntranceCenterSubject,
  isNexoraEntranceRestrained,
} from "./nexoraEntranceExperience.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import { isNexoraGuidedEntranceScene } from "./nexoraGuidedEntranceExperience.ts";
import {
  resetNexoraMVPObjectInteractionOverview,
  type NexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionState,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

export const EXECUTIVE_EXPERIENCE_CONTEXTS = Object.freeze([
  "GUIDED_ENTRANCE",
  "EXECUTIVE_WORKSPACE",
] as const);

export type ExecutiveExperienceContext =
  (typeof EXECUTIVE_EXPERIENCE_CONTEXTS)[number];

export const NEXORA_EXECUTIVE_EXPERIENCE_CONTEXT_BOUNDARY = Object.freeze({
  ownsExperienceState: false as const,
  writableStore: false as const,
  conflatesBca: false as const,
  conflatesFocusOverview: false as const,
  urlOnlyAuthority: false as const,
  domDetection: false as const,
});

/**
 * Derive the active experience from certified Entrance / ENT:10 handoff state.
 * Stage and Advisor may read this; they must not set it.
 */
export function resolveExecutiveExperienceContext(
  session: NexoraEntranceSession | null | undefined,
): ExecutiveExperienceContext {
  return isNexoraGuidedEntranceScene(session)
    ? "GUIDED_ENTRANCE"
    : "EXECUTIVE_WORKSPACE";
}

export function resolveExperienceAwareAdvisorSubject(input: {
  readonly experience: ExecutiveExperienceContext;
  readonly focused: NexoraMVPInteractionSubject | null;
  readonly selected: NexoraMVPInteractionSubject | null;
  readonly educationalCenter: NexoraMVPInteractionSubject | null;
}): NexoraMVPInteractionSubject | null {
  if (input.experience !== "GUIDED_ENTRANCE") return input.focused;
  return input.focused ?? input.selected ?? input.educationalCenter;
}

/**
 * Overview reset interpreted against the current experience.
 * GUIDED_ENTRANCE restores the educational scene home; it does not open
 * default Executive Business Overview.
 */
export function resetNexoraExperienceAwareStageOverview(input: {
  readonly state: NexoraMVPObjectInteractionState;
  readonly session: NexoraEntranceSession;
}): NexoraMVPObjectInteractionState {
  const cleared = resetNexoraMVPObjectInteractionOverview(input.state);
  if (resolveExecutiveExperienceContext(input.session) !== "GUIDED_ENTRANCE") {
    return cleared;
  }
  if (!isNexoraEntranceRestrained(input.session)) {
    return cleared;
  }
  return applyEntranceCenterSubject(cleared, input.session);
}
