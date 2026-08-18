/**
 * UX:5-FIX1 — final collection presentation integrity bridge.
 *
 * Collection membership decides which subjects are peers. Existing Stage-2D
 * hard separation decides their final XY targets together with any restrained
 * watch context. This projection never creates semantic focus or uses Z.
 */

import {
  measureExecutiveStage2DBoundsGap,
  resolveExecutiveStage2DHardSeparatedLayout,
  resolveExecutiveStage2DMinVisualGap,
  resolveExecutiveStage2DVisibleBounds,
  resolveExecutiveStage2DVisualFootprint,
} from "@/app/lib/spatial-presentation/executiveStage2DHardSeparation";
import { resolveExecutiveCollectionLayout } from "@/app/lib/spatial-presentation/executiveStageQueueFoundation";
import type {
  NexoraMVPStageInteractionPresentation,
} from "./nexoraMVPObjectInteraction";

export const NEXORA_MVP_COLLECTION_INTEGRITY_CONTRACT =
  "ux5-fix1-collection-object-integrity" as const;

type CollectionObject = NexoraMVPStageInteractionPresentation["scene"]["objects"][number];

function uniqueIds(ids: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(ids)]);
}

function presentationLevel(
  presentation: NexoraMVPStageInteractionPresentation,
): "minimum" | "report" | "operation" {
  return presentation.scene.presentationState === "report" ||
    presentation.scene.presentationState === "operation"
    ? presentation.scene.presentationState
    : "minimum";
}

function footprintHalf(
  object: CollectionObject,
  member: boolean,
  level: "minimum" | "report" | "operation",
): number {
  const role = member ? "related" : "background";
  const base = resolveExecutiveStage2DVisualFootprint(role, level).halfExtent;
  // Presentation scales below 1 may shrink a body, but never shrink the
  // certified footprint below 82%; labels and state cues still need territory.
  const scale = Math.max(0.82, Math.min(1.15, object.scale));
  return Math.round(base * scale * 1e6) / 1e6;
}

export function applyNexoraMVPExecutiveCollectionIntegrity(
  presentation: NexoraMVPStageInteractionPresentation,
): NexoraMVPStageInteractionPresentation {
  if (
    presentation.presentationMode !== "collection" ||
    presentation.collectionContext == null
  ) {
    return presentation;
  }

  const level = presentationLevel(presentation);
  const declaredMemberIds = uniqueIds(
    presentation.collectionContext.objectIds,
  );
  const declaredMemberSet = new Set(declaredMemberIds);

  // The collection projection is the authority that introduces executive-work
  // members. Keep one presentation record per canonical id before rendering.
  const seen = new Set<string>();
  const duplicateObjectIds: string[] = [];
  const uniqueObjects = presentation.scene.objects.filter((object) => {
    if (seen.has(object.id)) {
      duplicateObjectIds.push(object.id);
      return false;
    }
    seen.add(object.id);
    return true;
  });

  const memberIds = declaredMemberIds.filter((id) =>
    uniqueObjects.some((object) => object.id === id),
  );
  const memberSet = new Set(memberIds);
  const watchIds = uniqueObjects
    .filter(
      (object) =>
        !declaredMemberSet.has(object.id) &&
        object.spatialRole === "watch" &&
        object.disclosureState !== "hidden",
    )
    .map((object) => object.id)
    .sort();
  // Collection mode is a peer presentation, not focused-subject context.
  // Watch subjects remain auditable but do not become unlabeled bodies among
  // collection members; focus mode will recompose their real relationships.
  const participatingIds = [...memberIds];
  const memberLayout = resolveExecutiveCollectionLayout({
    objectIds: memberIds,
  });

  const positions: Record<string, { x: number; y: number; z: 0 }> = {};
  const classifications: Record<
    string,
    "related" | "background"
  > = {};
  const priority: Record<string, number> = {};
  const footprints: Record<string, number> = {};

  for (const objectId of participatingIds) {
    const object = uniqueObjects.find((entry) => entry.id === objectId);
    if (object == null) continue;
    const member = memberSet.has(objectId);
    const memberPosition = memberLayout.positions[objectId];
    positions[objectId] = member && memberPosition != null
      ? { x: memberPosition.x, y: memberPosition.y, z: 0 }
      : {
          x: object.targetPosition[0],
          y: object.targetPosition[1],
          z: 0,
        };
    classifications[objectId] = member ? "related" : "background";
    priority[objectId] = member ? 1000 : 0;
    footprints[objectId] = footprintHalf(object, member, level);
  }

  const hard =
    participatingIds.length > 0
      ? resolveExecutiveStage2DHardSeparatedLayout({
          anchorObjectId: null,
          positions,
          classifications,
          priority,
          footprintHalfExtents: footprints,
          presentationState: level,
          orderedIds: participatingIds,
        })
      : null;
  const hiddenWatchIds = new Set(watchIds);

  const objects = Object.freeze(
    uniqueObjects.map((object) => {
      if (memberSet.has(object.id)) {
        const target = hard?.positions[object.id] ?? positions[object.id]!;
        return Object.freeze({
          ...object,
          role: "related" as const,
          spatialRole: "collection" as const,
          targetPosition: Object.freeze([target.x, target.y, 0] as const),
          overviewPosition: Object.freeze([target.x, target.y, 0] as const),
          disclosureState: "visible-related" as const,
          focused: false,
          selected: false,
          interactive: true,
          labelVisible: true,
          opacity: Math.max(0.9, object.opacity),
        });
      }

      return Object.freeze({
        ...object,
        role: "unrelated" as const,
        spatialRole: "hidden" as const,
        disclosureState: "hidden" as const,
        focused: false,
        selected: false,
        interactive: false,
        labelVisible: false,
        labelProminence: "minimal" as const,
        opacity: 0,
      });
    }),
  );

  const snapshots = Object.freeze(
    participatingIds
      .filter((id) => !hiddenWatchIds.has(id))
      .map((objectId) => {
        const object = objects.find((entry) => entry.id === objectId)!;
        const halfExtent = footprints[objectId]!;
        return Object.freeze({
          subjectId: objectId,
          kind: object.kind,
          collection: presentation.collectionContext!.category,
          collectionMember: memberSet.has(objectId),
          presentationRole: memberSet.has(objectId)
            ? ("collection-member" as const)
            : ("watch-context" as const),
          targetPosition: object.targetPosition,
          bodyBounds: resolveExecutiveStage2DVisibleBounds(
            object.targetPosition[0],
            object.targetPosition[1],
            halfExtent,
          ),
          primaryBodyCount: 1 as const,
          interactive: object.interactive !== false,
          decorative: false as const,
        });
      }),
  );

  let overlapCount = 0;
  let minObservedGap = Number.POSITIVE_INFINITY;
  for (let left = 0; left < snapshots.length; left += 1) {
    for (let right = left + 1; right < snapshots.length; right += 1) {
      const gap = measureExecutiveStage2DBoundsGap(
        snapshots[left]!.bodyBounds,
        snapshots[right]!.bodyBounds,
      );
      if (gap < 0) overlapCount += 1;
      minObservedGap = Math.min(minObservedGap, gap);
    }
  }
  if (!Number.isFinite(minObservedGap)) {
    minObservedGap = resolveExecutiveStage2DMinVisualGap();
  }

  return Object.freeze({
    ...presentation,
    scene: Object.freeze({
      ...presentation.scene,
      objects,
      collectionIntegrity: Object.freeze({
        contract: NEXORA_MVP_COLLECTION_INTEGRITY_CONTRACT,
        membershipAuthority: "ExecutiveStageCollectionContext.objectIds",
        positionAuthority:
          "ExecutiveCollectionLayout+ExecutiveStage2DHardSeparation",
        finalXyWriter: NEXORA_MVP_COLLECTION_INTEGRITY_CONTRACT,
        topologyZ: 0 as const,
        semanticAnchorId: null,
        memberIds: Object.freeze(memberIds),
        watchContextIds: Object.freeze(watchIds),
        duplicateObjectIds: Object.freeze([...new Set(duplicateObjectIds)]),
        hiddenWatchIds: Object.freeze([...hiddenWatchIds]),
        primaryBodyCountById: Object.freeze(
          Object.fromEntries(snapshots.map((entry) => [entry.subjectId, 1])),
        ),
        overlapCount,
        minObservedGap,
        requiredGap: resolveExecutiveStage2DMinVisualGap(),
        layoutStatus:
          overlapCount === 0 &&
          minObservedGap >= resolveExecutiveStage2DMinVisualGap()
            ? ("valid" as const)
            : ("failed" as const),
        snapshots,
      }),
    }),
  });
}
