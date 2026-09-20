/**
 * NPA-T STAGE-PROD:6B — canonical composition → existing STAGE-MOTION:1 targets.
 * This projection owns no clock, interpolation, Scene meaning, or business state.
 */

import type { NexoraMVPStageObjectPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage.ts";
import type { NexoraMVPContextNodePresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { ExecutiveStageMotionTargetEntry } from "@/app/lib/spatial-presentation/executiveStageMotion.ts";

export const stageProdSceneMotionIdentity =
  "NPA-T STAGE-PROD:6B/LiveSceneMotionProjection" as const;

export const stageProdRelationshipAnimationStatus = Object.freeze({
  status: "DEFERRED" as const,
  supportedBehavior: "existing endpoints follow live canonical Object positions",
  deferredBehavior: "relationship appearance and disappearance opacity",
  reason:
    "The current relationship renderer has no retained-edge opacity seam; adding one would expand 6B into a second animation lifecycle.",
});

export type StageProdSceneMotionProjection = Readonly<{
  identity: typeof stageProdSceneMotionIdentity;
  authority: "STAGE-MOTION:1";
  canonicalObjectIds: readonly string[];
  targets: ReadonlyMap<string, ExecutiveStageMotionTargetEntry>;
  relationshipAnimation: typeof stageProdRelationshipAnimationStatus;
  matchesByCanonicalId: true;
  continuousAnimation: false;
  writesCanonicalManagementState: false;
}>;

export function projectStageProdSceneMotion(input: Readonly<{
  objects: readonly NexoraMVPStageObjectPresentation[];
  contextNodes?: readonly NexoraMVPContextNodePresentation[];
}>): StageProdSceneMotionProjection {
  const targets = new Map<string, ExecutiveStageMotionTargetEntry>();
  for (const object of input.objects) {
    const visible =
      object.disclosureState !== "hidden" && object.opacity > 0.04;
    targets.set(
      object.id,
      Object.freeze({
        position: Object.freeze([
          object.targetPosition[0],
          object.targetPosition[1],
          object.targetPosition[2],
        ] as const),
        visible,
        opacity: visible ? object.opacity : 0,
        scale: object.scale,
      }),
    );
  }
  for (const node of input.contextNodes ?? []) {
    const visible = node.opacity > 0.04;
    const target = Object.freeze({
      position: Object.freeze([
        node.targetPosition[0],
        node.targetPosition[1],
        node.targetPosition[2],
      ] as const),
      visible,
      opacity: visible ? node.opacity : 0,
      scale: node.scale,
    });
    targets.set(node.id, target);
    if (node.subjectId !== node.id) targets.set(node.subjectId, target);
  }
  return Object.freeze({
    identity: stageProdSceneMotionIdentity,
    authority: "STAGE-MOTION:1" as const,
    canonicalObjectIds: Object.freeze([...targets.keys()]),
    targets,
    relationshipAnimation: stageProdRelationshipAnimationStatus,
    matchesByCanonicalId: true as const,
    continuousAnimation: false as const,
    writesCanonicalManagementState: false as const,
  });
}
