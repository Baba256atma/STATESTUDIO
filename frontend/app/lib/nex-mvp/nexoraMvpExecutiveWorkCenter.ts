/**
 * NPA-T EXECUTIVE-WORK-CENTER:1 — focused executive-work CENTER vs Primary Body.
 *
 * Representation role answers why a body is physically present right now.
 * It does not admit Primary Bodies, own OVS form, or replace canonical focus.
 *
 * Persistent Primary Bodies remain catalog.objects + admission policy.
 * Focused executive-work may occupy Stage CENTER through STAGE-PROD:1
 * without entering catalog.objects.
 */

import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraMVPStageObjectPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage.ts";
import {
  isNexoraMvpExecutiveWorkKind,
  resolveNexoraMvpCatalogMembershipForSubject,
  resolveNexoraMvpPrimaryStageBodyAdmission,
  resolveNexoraMvpSubjectPrimaryStageBodyAdmission,
} from "@/app/lib/nex-mvp/nexoraMvpPrimaryStageBodyAdmission.ts";

export const nexoraMvpExecutiveWorkCenterIdentity =
  "NPA-T EXECUTIVE-WORK-CENTER:1/FocusedExecutiveWorkCenter" as const;

export const NEXORA_MVP_EXECUTIVE_WORK_CENTER_BOUNDARY = Object.freeze({
  ownsPrimaryAdmission: false as const,
  ownsOvsForm: false as const,
  ownsGeometry: false as const,
  ownsMaterial: false as const,
  ownsDth: false as const,
  ownsMlevel: false as const,
  mutatesCatalogObjects: false as const,
  secondSelectionAuthority: false as const,
  secondSceneStore: false as const,
  visibilityIsNotAdmission: true as const,
  ovsReuseAllowedWithoutAdmission: true as const,
  canonicalFocusOwner: "NexoraMVPObjectInteractionState.focusedSubject" as const,
  compositionOwner: "deriveNexoraMVPStageInteractionPresentation" as const,
});

export const NEXORA_MVP_STAGE_REPRESENTATION_ROLE = Object.freeze({
  PRIMARY_BODY: "primary-body",
  EXECUTIVE_WORK_CENTER: "executive-work-center",
} as const);

export type NexoraMvpStageRepresentationRole =
  (typeof NEXORA_MVP_STAGE_REPRESENTATION_ROLE)[keyof typeof NEXORA_MVP_STAGE_REPRESENTATION_ROLE];

export type NexoraMvpStageRepresentationRoleInput = {
  readonly catalogMembership: "objects" | "contextSubjects" | "none";
  readonly stageKind?: string | null;
  readonly objectKind?: string | null;
  readonly subjectId?: string | null;
  readonly focusedExecutiveWorkId?: string | null;
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
 * Why this body is physically present. Ignores OVS, DTH, MLEVEL, theme, state.
 */
export function resolveNexoraMvpStageRepresentationRole(
  input: NexoraMvpStageRepresentationRoleInput,
): NexoraMvpStageRepresentationRole | null {
  void input.ovsFamily;
  void input.ovsPrimitive;
  void input.dthCanonicalType;
  void input.managementLevel;
  void input.status;
  void input.theme;

  const subjectId = cue(input.subjectId);
  const focusedId = cue(input.focusedExecutiveWorkId);
  const managementKind = cue(input.objectKind) || cue(input.stageKind);
  if (
    subjectId.length > 0 &&
    focusedId.length > 0 &&
    subjectId === focusedId &&
    isNexoraMvpExecutiveWorkKind(managementKind)
  ) {
    return NEXORA_MVP_STAGE_REPRESENTATION_ROLE.EXECUTIVE_WORK_CENTER;
  }

  const admission = resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: input.catalogMembership,
    stageKind: input.stageKind,
    objectKind: input.objectKind,
  });
  if (admission.admittedPrimaryBody) {
    return NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY;
  }
  return null;
}

export function isNexoraMvpExecutiveWorkCenterEligibleKind(
  kind: string | null | undefined,
): boolean {
  return isNexoraMvpExecutiveWorkKind(kind);
}

export function stampNexoraMvpStageRepresentationRoles(input: {
  readonly objects: readonly NexoraMVPStageObjectPresentation[];
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly focusedExecutiveWorkId: string | null;
}): readonly NexoraMVPStageObjectPresentation[] {
  return Object.freeze(
    input.objects.map((object) => {
      const membership = resolveNexoraMvpCatalogMembershipForSubject(
        input.catalog,
        object.id,
      );
      const role = resolveNexoraMvpStageRepresentationRole({
        catalogMembership: membership,
        stageKind: object.kind,
        objectKind: object.objectKind ?? object.kind,
        subjectId: object.id,
        focusedExecutiveWorkId: input.focusedExecutiveWorkId,
      });
      if (object.stageRepresentationRole === role) return object;
      return Object.freeze({
        ...object,
        ...(role != null ? { stageRepresentationRole: role } : {}),
      });
    }),
  );
}

export function countNexoraMvpPrimaryStageBodies(
  objects: readonly Pick<
    NexoraMVPStageObjectPresentation,
    "stageRepresentationRole"
  >[],
): number {
  return objects.filter(
    (object) =>
      object.stageRepresentationRole ===
      NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
  ).length;
}

export function countNexoraMvpRenderedStageBodies(
  objects: readonly unknown[],
): number {
  return objects.length;
}

export function findNexoraMvpExecutiveWorkCenterId(
  objects: readonly Pick<
    NexoraMVPStageObjectPresentation,
    "id" | "stageRepresentationRole"
  >[],
): string | null {
  return (
    objects.find(
      (object) =>
        object.stageRepresentationRole ===
        NEXORA_MVP_STAGE_REPRESENTATION_ROLE.EXECUTIVE_WORK_CENTER,
    )?.id ?? null
  );
}

export function assertNexoraMvpExecutiveWorkDidNotEnterCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  subjectId: string,
): boolean {
  return !catalog.objects.some((entry) => entry.id === subjectId);
}

export function resolveNexoraMvpRenderedBodyAdmission(
  catalog: NexoraMVPObjectInteractionCatalog,
  object: Pick<NexoraMVPStageObjectPresentation, "id" | "stageRepresentationRole">,
) {
  const admission = resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
    catalog,
    object.id,
  );
  return Object.freeze({
    ...admission,
    stageRepresentationRole: object.stageRepresentationRole ?? null,
    admittedPrimaryBody:
      object.stageRepresentationRole ===
      NEXORA_MVP_STAGE_REPRESENTATION_ROLE.EXECUTIVE_WORK_CENTER
        ? false
        : admission.admittedPrimaryBody,
  });
}
