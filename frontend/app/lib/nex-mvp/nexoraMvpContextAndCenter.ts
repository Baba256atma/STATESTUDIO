/**
 * NPA-T CONTEXT-AND-CENTER:1 — unfocused Context vs focused Executive-Work CENTER.
 *
 * Presentation mode of one canonical executive-work subject.
 * Does not own identity, Primary admission, OVS, or catalog membership.
 *
 * Owner: canonical focusedSubject + deriveNexoraMVPStageInteractionPresentation.
 */

import { isNexoraMvpExecutiveWorkKind } from "@/app/lib/nex-mvp/nexoraMvpPrimaryStageBodyAdmission.ts";
import { NEXORA_MVP_STAGE_REPRESENTATION_ROLE } from "@/app/lib/nex-mvp/nexoraMvpExecutiveWorkCenter.ts";

export const nexoraMvpContextAndCenterIdentity =
  "NPA-T CONTEXT-AND-CENTER:1/ContextAndExecutiveWorkCenter" as const;

export const NEXORA_MVP_CONTEXT_AND_CENTER_BOUNDARY = Object.freeze({
  ownsIdentity: false as const,
  ownsPrimaryAdmission: false as const,
  ownsOvsForm: false as const,
  ownsGeometry: false as const,
  ownsMaterial: false as const,
  ownsDth: false as const,
  ownsMlevel: false as const,
  mutatesCatalog: false as const,
  secondCanonicalEntity: false as const,
  secondSelectionAuthority: false as const,
  suppressesByLabel: false as const,
  suppressesUnrelatedContext: false as const,
  canonicalFocusOwner: "NexoraMVPObjectInteractionState.focusedSubject" as const,
  modeOwner: "resolveNexoraMvpExecutiveWorkPresentationMode" as const,
  compositionOwner: "deriveNexoraMVPStageInteractionPresentation" as const,
});

export const NEXORA_MVP_EXECUTIVE_WORK_PRESENTATION_MODE = Object.freeze({
  CONTEXT: "context",
  EXECUTIVE_WORK_CENTER: "executive-work-center",
} as const);

export type NexoraMvpExecutiveWorkPresentationMode =
  (typeof NEXORA_MVP_EXECUTIVE_WORK_PRESENTATION_MODE)[keyof typeof NEXORA_MVP_EXECUTIVE_WORK_PRESENTATION_MODE];

export type NexoraMvpExecutiveWorkPresentationModeInput = {
  readonly catalogMembership: "objects" | "contextSubjects" | "none";
  readonly subjectId?: string | null;
  readonly focusedExecutiveWorkId?: string | null;
  readonly stageKind?: string | null;
  readonly objectKind?: string | null;
  readonly ovsFamily?: string | null;
  readonly ovsPrimitive?: string | null;
  readonly dthCanonicalType?: string | null;
  readonly managementLevel?: "L1" | "L2" | "L3" | null;
  readonly status?: string | null;
  readonly theme?: "day" | "night" | null;
};

function cue(value?: string | null): string {
  return `${value ?? ""}`.trim();
}

/**
 * How this canonical executive-work subject is presented right now.
 * Catalog eligibility remains CONTEXT even while CENTER is the active Stage mode.
 */
export function resolveNexoraMvpExecutiveWorkPresentationMode(
  input: NexoraMvpExecutiveWorkPresentationModeInput,
): NexoraMvpExecutiveWorkPresentationMode | null {
  void input.ovsFamily;
  void input.ovsPrimitive;
  void input.dthCanonicalType;
  void input.managementLevel;
  void input.status;
  void input.theme;

  const managementKind = cue(input.objectKind) || cue(input.stageKind);
  if (!isNexoraMvpExecutiveWorkKind(managementKind)) {
    return null;
  }
  if (input.catalogMembership !== "contextSubjects") {
    return null;
  }

  const subjectId = cue(input.subjectId);
  const focusedId = cue(input.focusedExecutiveWorkId);
  if (subjectId.length > 0 && focusedId.length > 0 && subjectId === focusedId) {
    return NEXORA_MVP_EXECUTIVE_WORK_PRESENTATION_MODE.EXECUTIVE_WORK_CENTER;
  }
  return NEXORA_MVP_EXECUTIVE_WORK_PRESENTATION_MODE.CONTEXT;
}

type ContextNodeLike = {
  readonly id: string;
  readonly subjectId: string;
};

/**
 * Presentation suppression only. Canonical context records stay in the catalog.
 * Match is canonical subjectId, never label or render-key.
 */
export function suppressSameCanonicalContextPresentation<
  T extends ContextNodeLike,
>(
  nodes: readonly T[],
  focusedExecutiveWorkId: string | null,
): readonly T[] {
  const focusedId = cue(focusedExecutiveWorkId);
  if (focusedId.length === 0) return nodes;
  return Object.freeze(
    nodes.filter((node) => node.subjectId !== focusedId),
  );
}

export function isSameCanonicalExecutiveWorkPresentation(
  contextSubjectId: string,
  centerSubjectId: string | null,
): boolean {
  return cue(contextSubjectId) === cue(centerSubjectId) && cue(contextSubjectId).length > 0;
}

export { NEXORA_MVP_STAGE_REPRESENTATION_ROLE };
