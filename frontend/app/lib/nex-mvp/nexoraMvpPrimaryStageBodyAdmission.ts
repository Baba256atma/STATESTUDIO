/**
 * NPA-T OVS-BODY-ADMISSION:1 — Primary Stage Body admission.
 *
 * Decides whether a canonical identity may occupy physical space as a
 * Primary OVS Body. Does not own OVS form, geometry, material, MLEVEL,
 * DTH, or visibility/disclosure.
 *
 * Instance membership stays on NexoraMVPObjectInteractionCatalog:
 *   catalog.objects        → business-object family
 *   catalog.contextSubjects → executive-work family
 *
 * This module is the kind/family policy that catalog membership must obey.
 */

import type { ManagerObjectKind } from "@/app/lib/manager-object/managerObjectInteractionFoundation.ts";
import { EXECUTIVE_WORK_KIND_ORDER } from "@/app/lib/spatial-presentation/executiveFocusSceneDisclosure.ts";
import type { ExecutiveWorkKind } from "@/app/lib/spatial-presentation/executiveFocusSceneDisclosure.ts";
import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { findManagerObjectCatalogRecord } from "@/app/lib/manager-object/managerObjectCatalog.ts";

export const nexoraMvpPrimaryStageBodyAdmissionIdentity =
  "NPA-T OVS-BODY-ADMISSION:1/PrimaryStageBodyAdmission" as const;

export const NEXORA_MVP_PRIMARY_STAGE_BODY_ADMISSION_BOUNDARY = Object.freeze({
  ownsOvsForm: false as const,
  ownsGeometry: false as const,
  ownsMaterial: false as const,
  ownsDth: false as const,
  ownsMlevel: false as const,
  infersFromId: false as const,
  infersFromLabel: false as const,
  infersFromTheme: false as const,
  infersFromState: false as const,
  infersFromFixturePosition: false as const,
  geometryExistenceAdmitsBody: false as const,
  ovsFamilyAdmitsBody: false as const,
  visibilityIsNotAdmission: true as const,
  /**
   * STAGE-PROD:1 may temporarily place a focused executive-work subject at
   * CENTER in scene.objects. That is focus visibility, not catalog admission.
   */
  stageProdFocusCenterProjectsExecutiveWork: true as const,
  parallelCatalog: false as const,
  parallelSceneStore: false as const,
  instanceMembershipOwner: "NexoraMVPObjectInteractionCatalog" as const,
  kindPolicyOwner: "resolveNexoraMvpPrimaryStageBodyAdmission" as const,
});

/**
 * Catalog family already used by Stage disclosure / interaction.
 * Reused here so admission does not invent a second ontology.
 */
export const NEXORA_MVP_STAGE_CATALOG_FAMILY = Object.freeze({
  BUSINESS_OBJECT: "business-object",
  EXECUTIVE_WORK: "executive-work",
  NONE: "none",
} as const);

export type NexoraMvpStageCatalogFamily =
  (typeof NEXORA_MVP_STAGE_CATALOG_FAMILY)[keyof typeof NEXORA_MVP_STAGE_CATALOG_FAMILY];

export const NEXORA_MVP_STAGE_CATALOG_MEMBERSHIP = Object.freeze({
  OBJECTS: "objects",
  CONTEXT_SUBJECTS: "contextSubjects",
  NONE: "none",
} as const);

export type NexoraMvpStageCatalogMembership =
  (typeof NEXORA_MVP_STAGE_CATALOG_MEMBERSHIP)[keyof typeof NEXORA_MVP_STAGE_CATALOG_MEMBERSHIP];

export const NEXORA_MVP_STAGE_REPRESENTATION_CLASS = Object.freeze({
  PRIMARY_BODY: "PRIMARY_BODY",
  CONTEXT_NODE: "CONTEXT_NODE",
  PACKAGE_WORKFLOW: "PACKAGE / WORKFLOW",
  THEATRE: "THEATRE",
  DEFERRED_AUTHORITY_MISSING: "DEFERRED — AUTHORITY MISSING",
  NOT_ADMITTED: "NOT ADMITTED",
} as const);

export type NexoraMvpStageRepresentationClass =
  (typeof NEXORA_MVP_STAGE_REPRESENTATION_CLASS)[keyof typeof NEXORA_MVP_STAGE_REPRESENTATION_CLASS];

export const NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS = Object.freeze({
  LIVE_PRIMARY: "LIVE PRIMARY",
  APPROVED_PRIMARY: "APPROVED PRIMARY",
  CONDITIONAL_PRIMARY: "CONDITIONAL PRIMARY",
  CONTEXT_NODE: "CONTEXT NODE",
  PACKAGE_WORKFLOW: "PACKAGE / WORKFLOW",
  THEATRE: "THEATRE",
  DEFERRED_AUTHORITY_MISSING: "DEFERRED — AUTHORITY MISSING",
  NOT_ADMITTED: "NOT ADMITTED",
} as const);

export type NexoraMvpPrimaryBodyAdmissionStatus =
  (typeof NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS)[keyof typeof NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS];

/**
 * Management identities allowed to occupy catalog.objects as Primary Bodies.
 * Executive-work kinds are excluded even if misplaced in that collection.
 */
export const NEXORA_MVP_PRIMARY_BODY_ELIGIBLE_OBJECT_KINDS = Object.freeze([
  "object",
  "unknown",
  "risk",
] as const satisfies readonly ManagerObjectKind[]);

export type NexoraMvpPrimaryBodyEligibleObjectKind =
  (typeof NEXORA_MVP_PRIMARY_BODY_ELIGIBLE_OBJECT_KINDS)[number];

export const NEXORA_MVP_EXECUTIVE_WORK_KINDS = EXECUTIVE_WORK_KIND_ORDER;

export type NexoraMvpPrimaryStageBodyAdmissionInput = {
  readonly catalogMembership: NexoraMvpStageCatalogMembership;
  readonly stageKind?: string | null;
  readonly objectKind?: string | null;
  /** Ignored. Geometry does not admit bodies. */
  readonly ovsFamily?: string | null;
  readonly ovsPrimitive?: string | null;
  /** Ignored. Presentation metadata does not admit bodies. */
  readonly id?: string | null;
  readonly label?: string | null;
  readonly status?: string | null;
  readonly theme?: "day" | "night" | null;
  readonly managementLevel?: "L1" | "L2" | "L3" | null;
  readonly dthCanonicalType?: string | null;
};

export type NexoraMvpPrimaryStageBodyAdmission = {
  readonly catalogFamily: NexoraMvpStageCatalogFamily;
  readonly representationClass: NexoraMvpStageRepresentationClass;
  readonly status: NexoraMvpPrimaryBodyAdmissionStatus;
  readonly admittedPrimaryBody: boolean;
  readonly managementKind: string;
};

export function isNexoraMvpExecutiveWorkKind(
  kind: string | null | undefined,
): kind is ExecutiveWorkKind {
  return (
    kind === "problem" ||
    kind === "scenario" ||
    kind === "decision" ||
    kind === "execution"
  );
}

export function isNexoraMvpPrimaryBodyEligibleObjectKind(
  kind: string | null | undefined,
): kind is NexoraMvpPrimaryBodyEligibleObjectKind {
  return (
    kind === "object" || kind === "unknown" || kind === "risk"
  );
}

export function resolveNexoraMvpStageCatalogFamily(
  membership: NexoraMvpStageCatalogMembership,
): NexoraMvpStageCatalogFamily {
  if (membership === "objects") {
    return NEXORA_MVP_STAGE_CATALOG_FAMILY.BUSINESS_OBJECT;
  }
  if (membership === "contextSubjects") {
    return NEXORA_MVP_STAGE_CATALOG_FAMILY.EXECUTIVE_WORK;
  }
  return NEXORA_MVP_STAGE_CATALOG_FAMILY.NONE;
}

function cue(value?: string | null): string {
  return `${value ?? ""}`.trim();
}

function resolveManagementKind(input: NexoraMvpPrimaryStageBodyAdmissionInput): string {
  const objectKind = cue(input.objectKind);
  if (objectKind.length > 0) return objectKind;
  const stageKind = cue(input.stageKind);
  if (stageKind.length > 0) return stageKind;
  return "unknown";
}

/**
 * Kind/family policy. Ignores id, label, OVS, DTH, theme, MLEVEL, and state.
 */
export function resolveNexoraMvpPrimaryStageBodyAdmission(
  input: NexoraMvpPrimaryStageBodyAdmissionInput,
): NexoraMvpPrimaryStageBodyAdmission {
  void input.id;
  void input.label;
  void input.status;
  void input.theme;
  void input.managementLevel;
  void input.dthCanonicalType;
  void input.ovsFamily;
  void input.ovsPrimitive;

  const managementKind = resolveManagementKind(input);
  const catalogFamily = resolveNexoraMvpStageCatalogFamily(
    input.catalogMembership,
  );
  const stageKind = cue(input.stageKind);

  if (isNexoraMvpExecutiveWorkKind(managementKind) || isNexoraMvpExecutiveWorkKind(stageKind)) {
    return Object.freeze({
      catalogFamily:
        input.catalogMembership === "objects"
          ? NEXORA_MVP_STAGE_CATALOG_FAMILY.BUSINESS_OBJECT
          : catalogFamily === NEXORA_MVP_STAGE_CATALOG_FAMILY.NONE
            ? NEXORA_MVP_STAGE_CATALOG_FAMILY.EXECUTIVE_WORK
            : catalogFamily,
      representationClass: NEXORA_MVP_STAGE_REPRESENTATION_CLASS.CONTEXT_NODE,
      status: NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.CONTEXT_NODE,
      admittedPrimaryBody: false,
      managementKind,
    });
  }

  if (managementKind === "goal") {
    return Object.freeze({
      catalogFamily,
      representationClass: NEXORA_MVP_STAGE_REPRESENTATION_CLASS.PACKAGE_WORKFLOW,
      status: NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.PACKAGE_WORKFLOW,
      admittedPrimaryBody: false,
      managementKind,
    });
  }

  if (managementKind === "outcome") {
    return Object.freeze({
      catalogFamily,
      representationClass: NEXORA_MVP_STAGE_REPRESENTATION_CLASS.PACKAGE_WORKFLOW,
      status: NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.PACKAGE_WORKFLOW,
      admittedPrimaryBody: false,
      managementKind,
    });
  }

  if (managementKind === "kpi" || managementKind === "koi" || managementKind === "measure") {
    return Object.freeze({
      catalogFamily,
      representationClass: NEXORA_MVP_STAGE_REPRESENTATION_CLASS.THEATRE,
      status: NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.THEATRE,
      admittedPrimaryBody: false,
      managementKind,
    });
  }

  if (
    managementKind === "learning" ||
    managementKind === "process" ||
    managementKind === "opportunity"
  ) {
    return Object.freeze({
      catalogFamily,
      representationClass:
        NEXORA_MVP_STAGE_REPRESENTATION_CLASS.DEFERRED_AUTHORITY_MISSING,
      status:
        NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.DEFERRED_AUTHORITY_MISSING,
      admittedPrimaryBody: false,
      managementKind,
    });
  }

  const eligibleKind = isNexoraMvpPrimaryBodyEligibleObjectKind(managementKind);
  const businessObjectMember =
    input.catalogMembership === "objects" &&
    (stageKind.length === 0 || stageKind === "object") &&
    eligibleKind;

  if (businessObjectMember) {
    return Object.freeze({
      catalogFamily: NEXORA_MVP_STAGE_CATALOG_FAMILY.BUSINESS_OBJECT,
      representationClass: NEXORA_MVP_STAGE_REPRESENTATION_CLASS.PRIMARY_BODY,
      status: NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.LIVE_PRIMARY,
      admittedPrimaryBody: true,
      managementKind,
    });
  }

  if (eligibleKind && input.catalogMembership === "none") {
    return Object.freeze({
      catalogFamily: NEXORA_MVP_STAGE_CATALOG_FAMILY.NONE,
      representationClass: NEXORA_MVP_STAGE_REPRESENTATION_CLASS.NOT_ADMITTED,
      status: NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.NOT_ADMITTED,
      admittedPrimaryBody: false,
      managementKind,
    });
  }

  return Object.freeze({
    catalogFamily,
    representationClass: NEXORA_MVP_STAGE_REPRESENTATION_CLASS.NOT_ADMITTED,
    status: NEXORA_MVP_PRIMARY_BODY_ADMISSION_STATUS.NOT_ADMITTED,
    admittedPrimaryBody: false,
    managementKind,
  });
}

export function resolveNexoraMvpCatalogMembershipForSubject(
  catalog: NexoraMVPObjectInteractionCatalog,
  subjectId: string,
): NexoraMvpStageCatalogMembership {
  if (catalog.objects.some((entry) => entry.id === subjectId)) {
    return NEXORA_MVP_STAGE_CATALOG_MEMBERSHIP.OBJECTS;
  }
  if (catalog.contextSubjects.some((entry) => entry.id === subjectId)) {
    return NEXORA_MVP_STAGE_CATALOG_MEMBERSHIP.CONTEXT_SUBJECTS;
  }
  return NEXORA_MVP_STAGE_CATALOG_MEMBERSHIP.NONE;
}

/**
 * Instance admission: look up catalog membership, then apply kind policy.
 * Subject id is a catalog key, not an inference heuristic.
 */
export function resolveNexoraMvpSubjectPrimaryStageBodyAdmission(
  catalog: NexoraMVPObjectInteractionCatalog,
  subjectId: string,
): NexoraMvpPrimaryStageBodyAdmission {
  const membership = resolveNexoraMvpCatalogMembershipForSubject(
    catalog,
    subjectId,
  );
  const object = catalog.objects.find((entry) => entry.id === subjectId);
  if (object) {
    return resolveNexoraMvpPrimaryStageBodyAdmission({
      catalogMembership: membership,
      stageKind: object.kind,
      objectKind: object.objectKind ?? object.kind,
    });
  }
  const context = catalog.contextSubjects.find((entry) => entry.id === subjectId);
  if (context) {
    return resolveNexoraMvpPrimaryStageBodyAdmission({
      catalogMembership: membership,
      stageKind: context.kind,
      objectKind: context.kind,
    });
  }
  const registered = findManagerObjectCatalogRecord(subjectId);
  if (registered) {
    return resolveNexoraMvpPrimaryStageBodyAdmission({
      catalogMembership: membership,
      stageKind: registered.objectKind,
      objectKind: registered.objectKind,
    });
  }
  return resolveNexoraMvpPrimaryStageBodyAdmission({
    catalogMembership: membership,
  });
}
