/**
 * APP-7:4 — Business lifecycle model builder.
 */

import type { BusinessEngineEvent } from "./businessEventEngineTypes.ts";
import {
  BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION,
  clampLifecycleConfidence,
  type BusinessEventLifecycleMapping,
  type BusinessLifecycleModel,
  type BusinessLifecycleSegment,
  type BusinessLifecycleSummary,
} from "./businessTimelineLifecycleTypes.ts";
import {
  BUSINESS_LIFECYCLE_PHASE_DESCRIPTIONS,
  BUSINESS_LIFECYCLE_PHASE_LABELS,
  classifyEventLifecyclePhase,
  maxImportance,
} from "./businessTimelineLifecycleRules.ts";
import { extractBusinessMilestones } from "./businessTimelineMilestones.ts";

function buildSegmentMetadata(eventCount: number): BusinessLifecycleSegment["metadata"] {
  return Object.freeze({
    metadataVersion: BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION,
    eventCount,
    extensions: Object.freeze({}),
    readOnly: true as const,
  });
}

export function mapEventsToLifecycle(
  events: readonly BusinessEngineEvent[]
): readonly BusinessEventLifecycleMapping[] {
  return Object.freeze(
    events.map((event) => {
      const classification = classifyEventLifecyclePhase(event);
      return Object.freeze({
        eventId: event.id,
        workspaceId: event.workspaceId,
        phase: classification.phase,
        confidence: classification.confidence,
        readOnly: true as const,
      });
    })
  );
}

export function classifyBusinessLifecycleSegments(
  events: readonly BusinessEngineEvent[]
): readonly BusinessLifecycleSegment[] {
  if (events.length === 0) {
    return Object.freeze([]);
  }

  const segments: BusinessLifecycleSegment[] = [];
  let currentPhase = classifyEventLifecyclePhase(events[0]!).phase;
  let currentEvents: BusinessEngineEvent[] = [events[0]!];
  let segmentIndex = 0;

  const flushSegment = () => {
    if (currentEvents.length === 0) {
      return;
    }
    const workspaceId = currentEvents[0]!.workspaceId;
    const importance = currentEvents.reduce(
      (acc, event) => maxImportance(acc, event.importance),
      currentEvents[0]!.importance
    );
    const confidence =
      currentEvents.reduce((sum, event) => sum + classifyEventLifecyclePhase(event).confidence, 0) /
      currentEvents.length;

    segmentIndex += 1;
    segments.push(
      Object.freeze({
        id: `lifecycle-segment-${workspaceId}-${String(segmentIndex).padStart(4, "0")}`,
        workspaceId,
        phase: currentPhase,
        title: BUSINESS_LIFECYCLE_PHASE_LABELS[currentPhase],
        description: BUSINESS_LIFECYCLE_PHASE_DESCRIPTIONS[currentPhase],
        startAt: currentEvents[0]!.occurredAt,
        endAt: currentEvents[currentEvents.length - 1]!.occurredAt,
        eventIds: Object.freeze(currentEvents.map((event) => event.id)),
        importance,
        confidence: clampLifecycleConfidence(confidence),
        metadata: buildSegmentMetadata(currentEvents.length),
        readOnly: true as const,
      })
    );
    currentEvents = [];
  };

  for (let index = 1; index < events.length; index += 1) {
    const event = events[index]!;
    const phase = classifyEventLifecyclePhase(event).phase;
    if (phase !== currentPhase) {
      flushSegment();
      currentPhase = phase;
    }
    currentEvents.push(event);
  }
  flushSegment();

  return Object.freeze(segments);
}

export function buildBusinessLifecycleSummary(
  events: readonly BusinessEngineEvent[],
  segments: readonly BusinessLifecycleSegment[],
  milestones: readonly BusinessLifecycleModel["milestones"]
): BusinessLifecycleSummary {
  const phaseCounts: Record<string, number> = {};
  for (const segment of segments) {
    phaseCounts[segment.phase] = (phaseCounts[segment.phase] ?? 0) + 1;
  }

  const segmentTimes = segments
    .flatMap((segment) => [segment.startAt, segment.endAt])
    .sort((left, right) => left.localeCompare(right));

  return Object.freeze({
    segmentCount: segments.length,
    milestoneCount: milestones.length,
    eventCount: events.length,
    phaseCounts: Object.freeze({ ...phaseCounts }),
    firstSegmentAt: segmentTimes[0] ?? null,
    lastSegmentAt: segmentTimes[segmentTimes.length - 1] ?? null,
    criticalMilestoneCount: milestones.filter((entry) => entry.importance === "critical").length,
    highMilestoneCount: milestones.filter((entry) => entry.importance === "high").length,
    readOnly: true as const,
  });
}

export function buildBusinessLifecycleModelFromEvents(
  events: readonly BusinessEngineEvent[],
  workspaceId: string,
  generatedAt: string
): BusinessLifecycleModel {
  const workspaceEvents = Object.freeze(
    [...events]
      .filter((event) => event.workspaceId === workspaceId)
      .sort(
        (left, right) =>
          left.occurredAt.localeCompare(right.occurredAt) ||
          left.createdAt.localeCompare(right.createdAt) ||
          left.id.localeCompare(right.id)
      )
  );

  const segments = classifyBusinessLifecycleSegments(workspaceEvents);
  const milestones = extractBusinessMilestones(workspaceEvents);
  const eventMappings = mapEventsToLifecycle(workspaceEvents);
  const summary = buildBusinessLifecycleSummary(workspaceEvents, segments, milestones);

  return Object.freeze({
    workspaceId,
    segments,
    milestones,
    eventMappings,
    summary,
    generatedAt,
    contractVersion: BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const BusinessTimelineLifecycleBuilder = Object.freeze({
  mapEventsToLifecycle,
  classifyBusinessLifecycleSegments,
  buildBusinessLifecycleSummary,
  buildBusinessLifecycleModelFromEvents,
});
