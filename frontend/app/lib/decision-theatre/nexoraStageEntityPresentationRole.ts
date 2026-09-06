/**
 * NEX-STAGE-CARD:1 — read-only Stage entity presentation-role resolver.
 * Derives card capabilities from existing family/catalog/educational contracts.
 * Does not write business, lesson, or Data state.
 */

import { isNexoraEducationalObjectId } from "@/app/lib/nexora-entrance/nexoraObjectEducationExperience.ts";
import {
  classifyNexoraDecisionTheatreVisualFamily,
  type NexoraDecisionTheatreVisualFamily,
} from "./nexoraDecisionTheatreVisualFamily.ts";

export const nexoraStageEntityPresentationRoleIdentity =
  "NEX-STAGE-CARD:1/PresentationRoleResolver" as const;

export const NEXORA_STAGE_ENTITY_PRESENTATION_ROLES = Object.freeze([
  "EXECUTIVE_OBJECT",
  "DATA_OBJECT",
  "EDUCATIONAL_ACTOR",
  "ICONIC_ENTITY",
] as const);

export type NexoraStageEntityPresentationRole =
  (typeof NEXORA_STAGE_ENTITY_PRESENTATION_ROLES)[number];

export const NEXORA_STAGE_CATALOG_PROVENANCES = Object.freeze([
  "entrance-education",
  "object-education",
] as const);

export type NexoraStageCatalogProvenance =
  (typeof NEXORA_STAGE_CATALOG_PROVENANCES)[number];

export const NEXORA_STAGE_CARD_SECTIONS = Object.freeze([
  "identity",
  "purpose",
  "lessonRole",
  "educationalProvenance",
  "businessStatus",
  "businessEvidence",
  "businessRelationships",
  "dataSource",
] as const);

export type NexoraStageCardSection = (typeof NEXORA_STAGE_CARD_SECTIONS)[number];

export type NexoraStageCardApplicability = "APPLICABLE" | "NOT_APPLICABLE";

export type NexoraStageEntityPresentationRoleResolution = {
  readonly identity: typeof nexoraStageEntityPresentationRoleIdentity;
  readonly entityId: string;
  readonly visualFamily: NexoraDecisionTheatreVisualFamily;
  readonly presentationRole: NexoraStageEntityPresentationRole;
  readonly catalogProvenance: NexoraStageCatalogProvenance | null;
  readonly educationalExample: boolean;
  readonly applicableSections: readonly NexoraStageCardSection[];
  readonly suppressedSections: readonly {
    readonly section: NexoraStageCardSection;
    readonly applicability: "NOT_APPLICABLE";
    readonly reason: string;
  }[];
  readonly inferredFromLabel: false;
  readonly inferredFromDom: false;
};

const EDUCATIONAL_ACTOR_SECTIONS = Object.freeze([
  "identity",
  "purpose",
  "lessonRole",
] as const satisfies readonly NexoraStageCardSection[]);

const EDUCATIONAL_EXAMPLE_SECTIONS = Object.freeze([
  "identity",
  "purpose",
  "lessonRole",
  "educationalProvenance",
] as const satisfies readonly NexoraStageCardSection[]);

const EXECUTIVE_SECTIONS = Object.freeze([
  "identity",
  "businessStatus",
  "businessEvidence",
  "businessRelationships",
] as const satisfies readonly NexoraStageCardSection[]);

const DATA_SECTIONS = Object.freeze([
  "identity",
  "dataSource",
] as const satisfies readonly NexoraStageCardSection[]);

const ICONIC_SECTIONS = Object.freeze(["identity", "purpose"] as const satisfies readonly NexoraStageCardSection[]);

function suppress(
  applicable: readonly NexoraStageCardSection[],
): NexoraStageEntityPresentationRoleResolution["suppressedSections"] {
  return Object.freeze(
    NEXORA_STAGE_CARD_SECTIONS.filter((section) => !applicable.includes(section)).map(
      (section) =>
        Object.freeze({
          section,
          applicability: "NOT_APPLICABLE" as const,
          reason: `${section} is not part of this presentation role`,
        }),
    ),
  );
}

export function resolveStageEntityPresentationRole(input: {
  readonly entityId: string;
  readonly catalogProvenance?: NexoraStageCatalogProvenance | null;
  readonly visualFamily?: NexoraDecisionTheatreVisualFamily | null;
  readonly kind?: string;
}): NexoraStageEntityPresentationRoleResolution {
  const visualFamily =
    input.visualFamily ??
    classifyNexoraDecisionTheatreVisualFamily({
      id: input.entityId,
      kind: input.kind,
    });
  const catalogProvenance = input.catalogProvenance ?? null;
  const educationalExample =
    catalogProvenance === "object-education" || isNexoraEducationalObjectId(input.entityId);

  let presentationRole: NexoraStageEntityPresentationRole = "EXECUTIVE_OBJECT";
  let applicableSections: readonly NexoraStageCardSection[] = EXECUTIVE_SECTIONS;
  if (visualFamily === "DATA_OBJECT") {
    presentationRole = "DATA_OBJECT";
    applicableSections = DATA_SECTIONS;
  } else if (visualFamily === "ICONIC_OBJECT") {
    presentationRole = "ICONIC_ENTITY";
    applicableSections = ICONIC_SECTIONS;
  } else if (catalogProvenance === "entrance-education") {
    presentationRole = "EDUCATIONAL_ACTOR";
    applicableSections = EDUCATIONAL_ACTOR_SECTIONS;
  } else if (educationalExample) {
    presentationRole = "EXECUTIVE_OBJECT";
    applicableSections = EDUCATIONAL_EXAMPLE_SECTIONS;
  }

  return Object.freeze({
    identity: nexoraStageEntityPresentationRoleIdentity,
    entityId: input.entityId,
    visualFamily,
    presentationRole,
    catalogProvenance,
    educationalExample,
    applicableSections,
    suppressedSections: suppress(applicableSections),
    inferredFromLabel: false,
    inferredFromDom: false,
  });
}

export function stageCardSectionIsApplicable(
  resolution: NexoraStageEntityPresentationRoleResolution,
  section: NexoraStageCardSection,
): boolean {
  return resolution.applicableSections.includes(section);
}
