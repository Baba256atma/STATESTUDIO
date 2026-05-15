import type { DomainTimelineFrame, DomainPropagationEvent } from "./domainTimelinePropagation.ts";
import { summarizePropagationTimeline } from "./domainTimelineSummary.ts";

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function attentionLevel(event: DomainPropagationEvent): "low" | "medium" | "high" | "critical" {
  if (event.severity === "critical") return "critical";
  if (event.severity === "high") return "high";
  if (event.propagationStrength >= 0.42) return "medium";
  return "low";
}

export function buildPropagationVisualizationState(params: {
  frames: DomainTimelineFrame[];
}): {
  objectHighlights: Record<string, unknown>;
  edgeHighlights: Record<string, unknown>;
  timelineSummary: string;
} {
  const objectHighlights: Record<string, unknown> = {};
  const edgeHighlights: Record<string, unknown> = {};

  for (const frame of Array.isArray(params.frames) ? params.frames : []) {
    for (const event of frame.activePropagationEvents ?? []) {
      const source = event.sourceObjectId;
      const target = event.targetObjectId;
      const intensity = clamp01(event.propagationStrength);
      objectHighlights[source] = {
        role: "propagation_source",
        propagationType: event.propagationType,
        intensity,
        severity: event.severity,
        timelineStage: event.metadata?.stage ?? null,
        executiveAttention: attentionLevel(event),
      };
      objectHighlights[target] = {
        role: "propagation_target",
        propagationType: event.propagationType,
        intensity,
        severity: event.severity,
        timelineStage: event.metadata?.stage ?? null,
        executiveAttention: attentionLevel(event),
      };

      for (const edgeId of frame.highlightedEdgeIds ?? []) {
        edgeHighlights[edgeId] = {
          from: source,
          to: target,
          propagationDirection: `${source}->${target}`,
          propagationType: event.propagationType,
          intensity,
          severity: event.severity,
          timelineStage: event.metadata?.stage ?? null,
        };
      }
    }
  }

  return {
    objectHighlights,
    edgeHighlights,
    timelineSummary: summarizePropagationTimeline({ frames: params.frames }),
  };
}
