/**
 * APP-7:5 — Business context cluster builder.
 */

import type { BusinessEngineEvent } from "./businessEventEngineTypes.ts";
import type { BusinessLifecycleModel } from "./businessTimelineLifecycleTypes.ts";
import {
  BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION,
  clampContextConfidence,
  type BusinessContextCluster,
  type BusinessEventRelationship,
} from "./businessTimelineContextTypes.ts";

function dominantValue<T extends string>(values: readonly T[]): T {
  const counts = new Map<T, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))[0]![0];
}

export function buildBusinessContextClusters(
  events: readonly BusinessEngineEvent[],
  lifecycle: BusinessLifecycleModel,
  relationships: readonly BusinessEventRelationship[]
): readonly BusinessContextCluster[] {
  if (lifecycle.segments.length === 0) {
    return Object.freeze([]);
  }

  const eventById = new Map(events.map((event) => [event.id, event]));
  const clusters: BusinessContextCluster[] = [];

  lifecycle.segments.forEach((segment, index) => {
    const segmentEvents = segment.eventIds
      .map((eventId) => eventById.get(eventId))
      .filter((event): event is BusinessEngineEvent => event !== undefined);

    const milestoneIds = Object.freeze(
      lifecycle.milestones
        .filter((milestone) => segment.eventIds.includes(milestone.eventId))
        .map((milestone) => milestone.id)
    );

    const eventIdSet = new Set(segment.eventIds);
    const relationshipIds = Object.freeze(
      relationships
        .filter((relationship) => eventIdSet.has(relationship.fromEventId) && eventIdSet.has(relationship.toEventId))
        .map((relationship) => relationship.id)
    );

    clusters.push(
      Object.freeze({
        id: `context-cluster-${segment.workspaceId}-${String(index + 1).padStart(4, "0")}`,
        workspaceId: segment.workspaceId,
        title: `${segment.title} Episode`,
        description: `Business episode clustered from lifecycle segment ${segment.id}.`,
        eventIds: segment.eventIds,
        startAt: segment.startAt,
        endAt: segment.endAt,
        dominantCategory: dominantValue(segmentEvents.map((event) => event.category)),
        dominantType: dominantValue(segmentEvents.map((event) => event.type)),
        lifecyclePhase: segment.phase,
        milestoneIds,
        relationshipIds,
        confidence: clampContextConfidence(segment.confidence),
        metadata: Object.freeze({
          metadataVersion: BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION,
          eventCount: segmentEvents.length,
          extensions: Object.freeze({ lifecycleSegmentId: segment.id }),
          readOnly: true as const,
        }),
        readOnly: true as const,
      })
    );
  });

  return Object.freeze(clusters);
}

export const BusinessTimelineClusters = Object.freeze({
  buildBusinessContextClusters,
});
