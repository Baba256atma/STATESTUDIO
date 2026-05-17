/**
 * D7:1:9 — Executive replay narratives.
 */

import type {
  DecisionReplayMarker,
  ExecutiveReplayNarrative,
  TimelineReconstructionBundle,
} from "./replayTypes.ts";
import { detectOperationalTransitions } from "./timelineReconstruction.ts";

export function buildExecutiveReplayNarrative(input: {
  sourceTimelineId: string;
  reconstruction: TimelineReconstructionBundle;
  decisionMarkers: readonly DecisionReplayMarker[];
  sessionTitle?: string;
}): ExecutiveReplayNarrative {
  const { escalationTick, recoveryTick } = detectOperationalTransitions(
    input.reconstruction.orderedSnapshots
  );

  const firstDecision = input.decisionMarkers[0];
  const propagationCount = input.reconstruction.propagationMarkers.length;
  const divergenceCount = input.reconstruction.divergencePoints.length;

  const headlineParts: string[] = [];
  if (input.sessionTitle) {
    headlineParts.push(`Replay of "${input.sessionTitle}"`);
  } else {
    headlineParts.push(`Replay of timeline ${input.sourceTimelineId}`);
  }

  if (escalationTick != null) {
    headlineParts.push(`shows operational instability emerging at tick ${escalationTick}.`);
  } else {
    headlineParts.push("traces operational evolution across the simulation horizon.");
  }

  const summaryParts: string[] = [];
  if (firstDecision) {
    summaryParts.push(
      `Decision ${firstDecision.decisionId} at tick ${firstDecision.appliedAtTick} materially shaped subsequent conditions.`
    );
  }
  if (propagationCount > 0) {
    summaryParts.push(
      `${propagationCount} propagation cascade(s) contributed to downstream operational stress.`
    );
  }
  if (divergenceCount > 0) {
    summaryParts.push(`${divergenceCount} divergence point(s) mark where strategic futures split.`);
  }
  if (recoveryTick != null) {
    summaryParts.push(`Recovery signals appear by tick ${recoveryTick}.`);
  }

  const bullets: string[] = [];
  for (const marker of input.decisionMarkers.slice(0, 4)) {
    bullets.push(
      `Tick ${marker.appliedAtTick}: ${marker.decisionId} affected ${(marker.resultingScenarioChanges ?? []).join(", ") || "core operations"}.`
    );
  }
  for (const point of input.reconstruction.divergencePoints.slice(0, 2)) {
    bullets.push(
      `Tick ${point.tick}: divergence ${point.branchId ?? "branch"} shifted ${point.changedObjectIds.slice(0, 3).join(", ")}.`
    );
  }

  return {
    headline: headlineParts.join(" "),
    summary:
      summaryParts.join(" ") ||
      "The replay preserves causal ordering for executive audit and boardroom review.",
    bullets,
    escalationTick,
    recoveryTick,
  };
}
