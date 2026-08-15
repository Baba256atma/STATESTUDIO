/**
 * NEX-MVP bridge — STAGE-LABEL:1 object-owned label territory.
 * Runs after final object XY (readability/containment). Does not move objects.
 */

import type { NexoraMVPStageInteractionPresentation } from "./nexoraMVPObjectInteraction";
import {
  buildExecutiveThreadGatewayLabelObstacle,
  getExecutiveStageObjectLabelObservability,
  resolveExecutiveStageOwnedLabelPlacement,
  type ExecutiveStageLabelLayoutResult,
} from "@/app/lib/spatial-presentation/executiveStageObjectLabelTerritory";
import { EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT } from "@/app/lib/spatial-presentation/executiveStage2DHardSeparation";

export const nexoraMVPExecutiveStageObjectLabelTerritoryIdentity =
  "NEX-MVP/STAGE-LABEL:1/ObjectOwnedLabelTerritoryBridge" as const;

function halfForObject(object: {
  readonly role?: string;
  readonly focused?: boolean;
}): number {
  if (object.focused || object.role === "focused") {
    return EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.anchor;
  }
  if (object.role === "related") {
    return EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.related;
  }
  if (object.role === "peripheral") {
    return EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.secondary;
  }
  return EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.background;
}

export function applyExecutiveStageObjectLabelTerritoryToStagePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
  options?: {
    readonly presentationLevel?: "minimum" | "report" | "operation";
  },
): NexoraMVPStageInteractionPresentation {
  const level =
    options?.presentationLevel ??
    presentation.presentationState ??
    "minimum";

  const readability = (
    presentation.scene as {
      readonly stage2dReadability?: {
        readonly classifications?: Readonly<Record<string, string>>;
        readonly anchorObjectId?: string;
      };
    }
  ).stage2dReadability;

  const gateway = presentation.contextNodes.find(
    (node) => node.role === "collapsed-thread",
  );
  const obstacles =
    gateway != null
      ? [
          buildExecutiveThreadGatewayLabelObstacle({
            x: gateway.targetPosition[0],
            y: gateway.targetPosition[1],
            mode: gateway.gatewayMode,
          }),
        ]
      : [];

  const layout = resolveExecutiveStageOwnedLabelPlacement({
    objects: presentation.scene.objects.map((object) => {
      const classification =
        readability?.classifications?.[object.id] ??
        (object.focused
          ? "anchor"
          : object.role === "related"
            ? "related"
            : object.role === "peripheral"
              ? "peripheral"
              : "background");
      const half =
        classification === "anchor"
          ? EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.anchor
          : classification === "related"
            ? EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.related
            : classification === "peripheral"
              ? EXECUTIVE_STAGE_2D_VISUAL_FOOTPRINT.minimum.secondary
              : halfForObject(object);
      return Object.freeze({
        id: object.id,
        label: object.labelPrimaryLine?.trim() || object.label,
        kind: object.kind,
        status: object.status,
        attention: object.attention,
        x: object.targetPosition[0],
        y: object.targetPosition[1],
        halfExtent: half,
        role: object.role,
        focused: object.focused,
        selected: object.selected,
        labelVisible: object.labelVisible,
        disclosureState: object.disclosureState,
        opacity: object.opacity,
      });
    }),
    obstacles,
    presentationLevel: level,
    anchorObjectId:
      readability?.anchorObjectId ?? presentation.scene.focusedObjectId,
  });

  const objects = Object.freeze(
    presentation.scene.objects.map((object) => {
      const ownership = layout.byId.get(object.id);
      if (ownership == null) return object;
      const visible = ownership.visibility !== "hidden";
      return Object.freeze({
        ...object,
        labelPrimaryLine: ownership.primaryLine || object.labelPrimaryLine,
        labelSecondaryLine: ownership.secondaryLine,
        labelVisible: object.labelVisible === false ? false : visible,
        labelProminence:
          ownership.visibility === "full"
            ? ("full" as const)
            : ownership.visibility === "compact"
              ? ("reduced" as const)
              : ("minimal" as const),
        // Zero legacy boost — STAGE-LABEL:1 owns clearance via side offset.
        labelAnchorBoost: 0,
        labelSide: ownership.resolvedSide,
        labelWorldOffsetX: ownership.worldOffsetX,
        labelWorldOffsetY: ownership.worldOffsetY,
        labelOwnerDistance: ownership.ownerDistance,
        labelVisibilityMode: ownership.visibility,
        labelTerritoryStatus:
          ownership.visibility === "hidden" ? "hidden" : "owned",
        stageLabelContract: "stage-label-1" as const,
      });
    }),
  );

  return Object.freeze({
    ...presentation,
    scene: Object.freeze({
      ...presentation.scene,
      objects,
      stageLabelLayout: layout,
      stageLabelObservability: getExecutiveStageObjectLabelObservability({
        visibleCount: layout.visibleCount,
        hiddenCount: layout.hiddenCount,
        collisionCount: layout.collisionCount,
        bodyOverlapCount: layout.bodyOverlapCount,
        ownerViolationCount: layout.ownerViolationCount,
        reservedCollisionCount: layout.reservedCollisionCount,
        clippedCount: layout.clippedCount,
      }),
    }),
  });
}

export function readExecutiveStageLabelLayout(
  presentation: NexoraMVPStageInteractionPresentation,
): ExecutiveStageLabelLayoutResult | null {
  const scene = presentation.scene as {
    readonly stageLabelLayout?: ExecutiveStageLabelLayoutResult;
  };
  return scene.stageLabelLayout ?? null;
}
