/**
 * APP-7:4 — Business milestone extraction rules.
 */

import type { BusinessEngineEvent } from "./businessEventEngineTypes.ts";
import {
  BUSINESS_MILESTONE_CATEGORY_KEYS,
  BUSINESS_MILESTONE_TYPE_KEYS,
  BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION,
  clampLifecycleConfidence,
  type BusinessMilestone,
} from "./businessTimelineLifecycleTypes.ts";

const MANUAL_MILESTONE_KEYS = Object.freeze(["milestone", "manualMilestone", "manual_milestone"] as const);

function isManualMilestoneFlag(event: BusinessEngineEvent): boolean {
  for (const key of MANUAL_MILESTONE_KEYS) {
    const value = event.metadata.extensions[key];
    if (value === "true" || value === "1" || value === "yes") {
      return true;
    }
  }
  return false;
}

function milestoneReason(event: BusinessEngineEvent): { reason: string; confidence: number } {
  if (isManualMilestoneFlag(event)) {
    return Object.freeze({
      reason: "Manual milestone flag in event metadata.",
      confidence: 0.98,
    });
  }
  if (event.importance === "critical") {
    return Object.freeze({
      reason: "Critical importance event.",
      confidence: 0.94,
    });
  }
  if (event.importance === "high") {
    return Object.freeze({
      reason: "High importance event.",
      confidence: 0.88,
    });
  }
  if ((BUSINESS_MILESTONE_CATEGORY_KEYS as readonly string[]).includes(event.category)) {
    return Object.freeze({
      reason: `Milestone category match: ${event.category}.`,
      confidence: 0.76,
    });
  }
  if ((BUSINESS_MILESTONE_TYPE_KEYS as readonly string[]).includes(event.type)) {
    return Object.freeze({
      reason: `Milestone type match: ${event.type}.`,
      confidence: 0.74,
    });
  }
  return Object.freeze({ reason: "Not a milestone.", confidence: 0 });
}

export function isBusinessMilestoneCandidate(event: BusinessEngineEvent): boolean {
  if (event.archived && event.status === "archived") {
    return false;
  }
  const evaluation = milestoneReason(event);
  return evaluation.confidence > 0;
}

export function extractBusinessMilestoneFromEvent(event: BusinessEngineEvent): BusinessMilestone | null {
  const evaluation = milestoneReason(event);
  if (evaluation.confidence <= 0) {
    return null;
  }

  return Object.freeze({
    id: `business-milestone-${event.id}`,
    workspaceId: event.workspaceId,
    eventId: event.id,
    title: event.title,
    occurredAt: event.occurredAt,
    category: event.category,
    type: event.type,
    importance: event.importance,
    reason: evaluation.reason,
    confidence: clampLifecycleConfidence(evaluation.confidence),
    metadata: Object.freeze({
      metadataVersion: BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION,
      manual: isManualMilestoneFlag(event),
      extensions: Object.freeze({ ...event.metadata.extensions }),
      readOnly: true as const,
    }),
    readOnly: true as const,
  });
}

export function extractBusinessMilestones(
  events: readonly BusinessEngineEvent[]
): readonly BusinessMilestone[] {
  return Object.freeze(
    events
      .filter(isBusinessMilestoneCandidate)
      .map(extractBusinessMilestoneFromEvent)
      .filter((milestone): milestone is BusinessMilestone => milestone !== null)
      .sort((left, right) => left.occurredAt.localeCompare(right.occurredAt) || left.id.localeCompare(right.id))
  );
}

export const BusinessTimelineMilestones = Object.freeze({
  isBusinessMilestoneCandidate,
  extractBusinessMilestoneFromEvent,
  extractBusinessMilestones,
});
