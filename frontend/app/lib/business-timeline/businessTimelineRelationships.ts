/**
 * APP-7:5 — Business event relationship builder.
 */

import type { BusinessEngineEvent } from "./businessEventEngineTypes.ts";
import type { BusinessLifecycleModel } from "./businessTimelineLifecycleTypes.ts";
import {
  BUSINESS_CONTEXT_RELATIONSHIP_CONFIDENCE,
  isPossibleCausalPair,
  isWithinProximity,
  sharesAnyTag,
  temporalProximityConfidence,
} from "./businessTimelineContextRules.ts";
import {
  BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION,
  clampContextConfidence,
  relationshipId,
  type BusinessEventRelationship,
  type BusinessEventRelationshipType,
} from "./businessTimelineContextTypes.ts";

function relationshipMetadata(directional: boolean): BusinessEventRelationship["metadata"] {
  return Object.freeze({
    metadataVersion: BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION,
    directional,
    extensions: Object.freeze({}),
    readOnly: true as const,
  });
}

function createRelationship(
  from: BusinessEngineEvent,
  to: BusinessEngineEvent,
  relationshipType: BusinessEventRelationshipType,
  reason: string,
  confidence: number,
  directional: boolean
): BusinessEventRelationship {
  return Object.freeze({
    id: relationshipId(from.id, to.id, relationshipType),
    workspaceId: from.workspaceId,
    fromEventId: from.id,
    toEventId: to.id,
    relationshipType,
    confidence: clampContextConfidence(confidence),
    reason,
    metadata: relationshipMetadata(directional),
    readOnly: true as const,
  });
}

function addRelationship(
  relationships: Map<string, BusinessEventRelationship>,
  relationship: BusinessEventRelationship
): void {
  if (!relationships.has(relationship.id)) {
    relationships.set(relationship.id, relationship);
  }
}

function segmentIdForEvent(lifecycle: BusinessLifecycleModel, eventId: string): string | null {
  for (const segment of lifecycle.segments) {
    if (segment.eventIds.includes(eventId)) {
      return segment.id;
    }
  }
  return null;
}

export function buildBusinessEventRelationships(
  events: readonly BusinessEngineEvent[],
  lifecycle: BusinessLifecycleModel,
  proximityDays: number
): readonly BusinessEventRelationship[] {
  const relationships = new Map<string, BusinessEventRelationship>();
  const milestoneEventIds = new Set(lifecycle.milestones.map((milestone) => milestone.eventId));

  for (let index = 0; index < events.length; index += 1) {
    const current = events[index]!;
    const previous = index > 0 ? events[index - 1]! : null;
    const next = index < events.length - 1 ? events[index + 1]! : null;

    if (previous) {
      addRelationship(
        relationships,
        createRelationship(
          current,
          previous,
          "previous",
          "Previous event in ordered timeline.",
          BUSINESS_CONTEXT_RELATIONSHIP_CONFIDENCE.previous,
          true
        )
      );
    }

    if (next) {
      addRelationship(
        relationships,
        createRelationship(
          current,
          next,
          "next",
          "Next event in ordered timeline.",
          BUSINESS_CONTEXT_RELATIONSHIP_CONFIDENCE.next,
          true
        )
      );
    }

    for (let otherIndex = 0; otherIndex < events.length; otherIndex += 1) {
      if (otherIndex === index) {
        continue;
      }
      const other = events[otherIndex]!;

      if (other.category === current.category) {
        addRelationship(
          relationships,
          createRelationship(
            current,
            other,
            "same-category",
            `Shared category: ${current.category}.`,
            BUSINESS_CONTEXT_RELATIONSHIP_CONFIDENCE["same-category"],
            false
          )
        );
      }

      if (other.type === current.type) {
        addRelationship(
          relationships,
          createRelationship(
            current,
            other,
            "same-type",
            `Shared type: ${current.type}.`,
            BUSINESS_CONTEXT_RELATIONSHIP_CONFIDENCE["same-type"],
            false
          )
        );
      }

      if (sharesAnyTag(current.tags, other.tags)) {
        addRelationship(
          relationships,
          createRelationship(
            current,
            other,
            "same-tag",
            "Shared tag context.",
            BUSINESS_CONTEXT_RELATIONSHIP_CONFIDENCE["same-tag"],
            false
          )
        );
      }

      const currentSegmentId = segmentIdForEvent(lifecycle, current.id);
      const otherSegmentId = segmentIdForEvent(lifecycle, other.id);
      if (currentSegmentId && currentSegmentId === otherSegmentId) {
        addRelationship(
          relationships,
          createRelationship(
            current,
            other,
            "same-lifecycle-phase",
            "Events belong to the same lifecycle segment.",
            BUSINESS_CONTEXT_RELATIONSHIP_CONFIDENCE["same-lifecycle-phase"],
            false
          )
        );
      }

      if (milestoneEventIds.has(other.id) || milestoneEventIds.has(current.id)) {
        addRelationship(
          relationships,
          createRelationship(
            current,
            other,
            "milestone-related",
            "Event related to a business milestone.",
            BUSINESS_CONTEXT_RELATIONSHIP_CONFIDENCE["milestone-related"],
            false
          )
        );
      }

      if (isWithinProximity(current.occurredAt, other.occurredAt, proximityDays)) {
        const confidence = temporalProximityConfidence(current.occurredAt, other.occurredAt, proximityDays);
        if (confidence > 0) {
          addRelationship(
            relationships,
            createRelationship(
              current,
              other,
              "temporal-proximity",
              "Events occurred within temporal proximity window.",
              confidence,
              false
            )
          );
        }
      }

      const earlier = Date.parse(current.occurredAt) <= Date.parse(other.occurredAt) ? current : other;
      const later = earlier.id === current.id ? other : current;
      if (
        earlier.id !== later.id &&
        isWithinProximity(earlier.occurredAt, later.occurredAt, proximityDays) &&
        isPossibleCausalPair(earlier.category, earlier.type, later.category, later.type)
      ) {
        addRelationship(
          relationships,
          createRelationship(
            earlier,
            later,
            "possible-cause",
            "Possible historical causal link (not proof).",
            BUSINESS_CONTEXT_RELATIONSHIP_CONFIDENCE["possible-cause"],
            true
          )
        );
        addRelationship(
          relationships,
          createRelationship(
            later,
            earlier,
            "possible-effect",
            "Possible historical effect link (not proof).",
            BUSINESS_CONTEXT_RELATIONSHIP_CONFIDENCE["possible-effect"],
            true
          )
        );
      }
    }
  }

  return Object.freeze(
    [...relationships.values()].sort(
      (left, right) =>
        left.fromEventId.localeCompare(right.fromEventId) ||
        left.toEventId.localeCompare(right.toEventId) ||
        left.relationshipType.localeCompare(right.relationshipType)
    )
  );
}

export const BusinessTimelineRelationships = Object.freeze({
  buildBusinessEventRelationships,
});
