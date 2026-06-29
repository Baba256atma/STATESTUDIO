/**
 * APP-7:5 — Business timeline context model builder.
 */

import type { BusinessEngineEvent } from "./businessEventEngineTypes.ts";
import type { BusinessLifecycleModel } from "./businessTimelineLifecycleTypes.ts";
import { buildBusinessContextClusters } from "./businessTimelineClusters.ts";
import { buildBusinessEventRelationships } from "./businessTimelineRelationships.ts";
import {
  BUSINESS_CONTEXT_DEFAULT_PROXIMITY_DAYS,
  BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION,
  clampContextConfidence,
  type BusinessContextCluster,
  type BusinessEventContext,
  type BusinessEventRelationship,
  type BusinessTimelineContextModel,
  type BusinessTimelineContextSummary,
} from "./businessTimelineContextTypes.ts";

function buildEmptyContextModel(workspaceId: string, generatedAt: string): BusinessTimelineContextModel {
  const summary: BusinessTimelineContextSummary = Object.freeze({
    eventCount: 0,
    relationshipCount: 0,
    clusterCount: 0,
    contextCount: 0,
    relationshipTypeCounts: Object.freeze({}),
    readOnly: true as const,
  });
  return Object.freeze({
    workspaceId,
    events: Object.freeze([]),
    relationships: Object.freeze([]),
    clusters: Object.freeze([]),
    eventContexts: Object.freeze([]),
    summary,
    generatedAt,
    contractVersion: BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

function buildSummary(
  events: readonly BusinessEngineEvent[],
  relationships: readonly BusinessEventRelationship[],
  clusters: readonly BusinessContextCluster[],
  contexts: readonly BusinessEventContext[]
): BusinessTimelineContextSummary {
  const relationshipTypeCounts: Record<string, number> = {};
  for (const relationship of relationships) {
    relationshipTypeCounts[relationship.relationshipType] =
      (relationshipTypeCounts[relationship.relationshipType] ?? 0) + 1;
  }
  return Object.freeze({
    eventCount: events.length,
    relationshipCount: relationships.length,
    clusterCount: clusters.length,
    contextCount: contexts.length,
    relationshipTypeCounts: Object.freeze({ ...relationshipTypeCounts }),
    readOnly: true as const,
  });
}

export function buildBusinessEventContexts(
  events: readonly BusinessEngineEvent[],
  relationships: readonly BusinessEventRelationship[],
  clusters: readonly BusinessContextCluster[],
  lifecycle: BusinessLifecycleModel
): readonly BusinessEventContext[] {
  const segmentByEvent = new Map<string, string>();
  for (const segment of lifecycle.segments) {
    for (const eventId of segment.eventIds) {
      segmentByEvent.set(eventId, segment.id);
    }
  }

  const clusterIdsByEvent = new Map<string, string[]>();
  for (const cluster of clusters) {
    for (const eventId of cluster.eventIds) {
      const ids = clusterIdsByEvent.get(eventId) ?? [];
      ids.push(cluster.id);
      clusterIdsByEvent.set(eventId, ids);
    }
  }

  const milestoneIdsByEvent = new Map<string, string[]>();
  for (const milestone of lifecycle.milestones) {
    const ids = milestoneIdsByEvent.get(milestone.eventId) ?? [];
    ids.push(milestone.id);
    milestoneIdsByEvent.set(milestone.eventId, ids);
  }

  return Object.freeze(
    events.map((event, index) => {
      const previousEventId = index > 0 ? events[index - 1]!.id : null;
      const nextEventId = index < events.length - 1 ? events[index + 1]!.id : null;
      const relationshipIds = relationships
        .filter((relationship) => relationship.fromEventId === event.id || relationship.toEventId === event.id)
        .map((relationship) => relationship.id);
      const relatedEventIds = Object.freeze(
        [
          ...new Set(
            relationships
              .filter((relationship) => relationship.fromEventId === event.id || relationship.toEventId === event.id)
              .flatMap((relationship) =>
                relationship.fromEventId === event.id ? relationship.toEventId : relationship.fromEventId
              )
              .filter((eventId) => eventId !== event.id && eventId !== previousEventId && eventId !== nextEventId)
          ),
        ].sort()
      );
      const confidences = relationships
        .filter((relationship) => relationship.fromEventId === event.id || relationship.toEventId === event.id)
        .map((relationship) => relationship.confidence);
      const confidence =
        confidences.length === 0
          ? 0.35
          : clampContextConfidence(confidences.reduce((sum, value) => sum + value, 0) / confidences.length);

      return Object.freeze({
        eventId: event.id,
        workspaceId: event.workspaceId,
        previousEventId,
        nextEventId,
        relatedEventIds,
        relationshipIds: Object.freeze(relationshipIds),
        clusterIds: Object.freeze(clusterIdsByEvent.get(event.id) ?? []),
        lifecycleSegmentIds: Object.freeze(
          segmentByEvent.has(event.id) ? [segmentByEvent.get(event.id)!] : []
        ),
        milestoneIds: Object.freeze(milestoneIdsByEvent.get(event.id) ?? []),
        confidence,
        metadata: Object.freeze({
          metadataVersion: BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION,
          extensions: Object.freeze({}),
          readOnly: true as const,
        }),
        readOnly: true as const,
      });
    })
  );
}

export function buildBusinessTimelineContextModelFromSources(
  events: readonly BusinessEngineEvent[],
  lifecycle: BusinessLifecycleModel,
  workspaceId: string,
  generatedAt: string,
  proximityDays: number = BUSINESS_CONTEXT_DEFAULT_PROXIMITY_DAYS
): BusinessTimelineContextModel {
  const workspaceEvents = Object.freeze(
    events.filter((event) => event.workspaceId === workspaceId)
  );

  if (workspaceEvents.length === 0) {
    return buildEmptyContextModel(workspaceId, generatedAt);
  }

  const relationships = buildBusinessEventRelationships(workspaceEvents, lifecycle, proximityDays);
  const clusters = buildBusinessContextClusters(workspaceEvents, lifecycle, relationships);
  const eventContexts = buildBusinessEventContexts(workspaceEvents, relationships, clusters, lifecycle);
  const summary = buildSummary(workspaceEvents, relationships, clusters, eventContexts);

  return Object.freeze({
    workspaceId,
    events: workspaceEvents,
    relationships,
    clusters,
    eventContexts,
    summary,
    generatedAt,
    contractVersion: BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const BusinessTimelineContextBuilder = Object.freeze({
  buildBusinessEventContexts,
  buildBusinessTimelineContextModelFromSources,
});
