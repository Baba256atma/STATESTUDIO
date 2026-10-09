/**
 * NPA-T COMPOSED-POPULATION:1 — Primary membership vs composed Stage population.
 *
 * Three derived counts. No store. Admission, Context/CENTER, and OVS stay sealed.
 *
 * Catalog Primary Membership — admitted catalog.objects (focus-independent).
 * Composed Primary Population — currently staged Primary Bodies (disclosure may change).
 * Rendered Stage Body Population — physical Stage bodies currently present, including CENTER.
 *
 * Operator-facing Stage indicator consumes composed Primary only.
 */

import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraMVPStageObjectPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage.ts";
import { resolveNexoraMvpSubjectPrimaryStageBodyAdmission } from "@/app/lib/nex-mvp/nexoraMvpPrimaryStageBodyAdmission.ts";
import {
  NEXORA_MVP_STAGE_REPRESENTATION_ROLE,
  findNexoraMvpExecutiveWorkCenterId,
} from "@/app/lib/nex-mvp/nexoraMvpExecutiveWorkCenter.ts";

export const nexoraMvpComposedPopulationIdentity =
  "NPA-T COMPOSED-POPULATION:1/PrimaryMembershipVsComposedPopulation" as const;

export const NEXORA_MVP_COMPOSED_POPULATION_BOUNDARY = Object.freeze({
  ownsPrimaryAdmission: false as const,
  ownsContextCenterLifecycle: false as const,
  ownsOvsForm: false as const,
  ownsGeometry: false as const,
  ownsMaterial: false as const,
  ownsDth: false as const,
  ownsMlevel: false as const,
  mutatesCatalog: false as const,
  secondCountStore: false as const,
  catalogCountFromScene: false as const,
  centerCountsAsPrimary: false as const,
  contextCountsAsPrimary: false as const,
  unspecifiedCountsAsPrimary: false as const,
  operatorFacingSource: "composedPrimaryCount" as const,
  catalogOwner: "resolveNexoraMvpSubjectPrimaryStageBodyAdmission" as const,
  composedOwner: "stageRepresentationRole === primary-body" as const,
  renderedOwner: "composed physical Stage-body collection" as const,
});

export const NEXORA_MVP_STAGE_POPULATION_OPERATOR_FACING_SOURCE =
  "composedPrimaryCount" as const;

type StageBodyLike = Pick<
  NexoraMVPStageObjectPresentation,
  "id" | "stageRepresentationRole"
> & {
  readonly disclosureState?: NexoraMVPStageObjectPresentation["disclosureState"];
  readonly spatialRole?: NexoraMVPStageObjectPresentation["spatialRole"];
};

function isHiddenFromComposition(object: StageBodyLike): boolean {
  return (
    object.disclosureState === "hidden" || object.spatialRole === "hidden"
  );
}

/** Physical Stage-body presence. Hidden disclosure is not composed/rendered. */
export function isNexoraMvpStageBodyPhysicallyPresent(
  object: StageBodyLike,
): boolean {
  return !isHiddenFromComposition(object);
}

/**
 * Admitted Primary membership. Catalog + admission policy. Never scene.length.
 */
export function countNexoraMvpCatalogPrimaryMembership(
  catalog: NexoraMVPObjectInteractionCatalog,
): number {
  return catalog.objects.filter(
    (entry) =>
      resolveNexoraMvpSubjectPrimaryStageBodyAdmission(catalog, entry.id)
        .admittedPrimaryBody,
  ).length;
}

/**
 * Primary Bodies currently included in this Stage composition.
 * Unspecified roles fail closed. CENTER and Context are excluded.
 */
export function countNexoraMvpComposedPrimaryPopulation(
  objects: readonly StageBodyLike[],
): number {
  return objects.filter(
    (object) =>
      !isHiddenFromComposition(object) &&
      object.stageRepresentationRole ===
        NEXORA_MVP_STAGE_REPRESENTATION_ROLE.PRIMARY_BODY,
  ).length;
}

/**
 * Physical Stage bodies currently present (non-hidden), including CENTER.
 */
export function countNexoraMvpRenderedStageBodyPopulation(
  objects: readonly StageBodyLike[],
): number {
  return objects.filter((object) => !isHiddenFromComposition(object)).length;
}

export function formatNexoraMvpStagePopulationBadge(
  composedPrimaryCount: number,
): string {
  return `On Stage · ${composedPrimaryCount}`;
}

export function resolveNexoraMvpStagePopulationSnapshot(input: {
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly composedObjects: readonly StageBodyLike[];
  readonly contextNodeCount?: number;
}): Readonly<{
  readonly catalogPrimaryCount: number;
  readonly composedPrimaryCount: number;
  readonly renderedStageBodyCount: number;
  readonly executiveWorkCenterId: string | null;
  readonly contextNodeCount: number;
  readonly operatorFacingCount: number;
  readonly operatorFacingBadge: string;
  readonly operatorFacingSource: typeof NEXORA_MVP_STAGE_POPULATION_OPERATOR_FACING_SOURCE;
}> {
  const catalogPrimaryCount = countNexoraMvpCatalogPrimaryMembership(
    input.catalog,
  );
  const composedPrimaryCount = countNexoraMvpComposedPrimaryPopulation(
    input.composedObjects,
  );
  const renderedStageBodyCount = countNexoraMvpRenderedStageBodyPopulation(
    input.composedObjects,
  );
  return Object.freeze({
    catalogPrimaryCount,
    composedPrimaryCount,
    renderedStageBodyCount,
    executiveWorkCenterId: findNexoraMvpExecutiveWorkCenterId(
      input.composedObjects,
    ),
    contextNodeCount: input.contextNodeCount ?? 0,
    operatorFacingCount: composedPrimaryCount,
    operatorFacingBadge: formatNexoraMvpStagePopulationBadge(
      composedPrimaryCount,
    ),
    operatorFacingSource: NEXORA_MVP_STAGE_POPULATION_OPERATOR_FACING_SOURCE,
  });
}
