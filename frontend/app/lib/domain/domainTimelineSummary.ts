import type { DomainTimelineFrame } from "./domainTimelinePropagation.ts";

function labelize(value: string): string {
  return value
    .replace(/^domain_/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function summarizePropagationTimeline(params: {
  frames: DomainTimelineFrame[];
}): string {
  const frames = Array.isArray(params.frames) ? params.frames : [];
  const events = frames.flatMap((frame) => frame.activePropagationEvents ?? []);
  if (events.length === 0) return "No propagation timeline is available yet.";

  const first = events[0];
  const last = events[events.length - 1] ?? first;
  const strongest = events.reduce((best, event) =>
    event.propagationStrength > best.propagationStrength ? event : best
  , first);

  if (events.length === 1) {
    return `${labelize(first.sourceObjectId)} pressure is expected to affect ${labelize(first.targetObjectId)} through ${first.propagationType} flow.`;
  }

  return `${labelize(first.sourceObjectId)} pressure is expected to move through ${events.length} propagation steps before affecting ${labelize(last.targetObjectId)}; strongest attention is around ${labelize(strongest.targetObjectId)}.`;
}
