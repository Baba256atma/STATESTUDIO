import type { ExecutiveNarrativeTone } from "./narrativeSynthesisTypes.ts";

export function normalizeExecutiveNarrativeText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

export function toneRank(tone: ExecutiveNarrativeTone): number {
  if (tone === "urgent") return 5;
  if (tone === "cautionary") return 4;
  if (tone === "strategic") return 3;
  if (tone === "stabilizing") return 2;
  return 1;
}

export function toneFromSeverity(value: unknown): ExecutiveNarrativeTone {
  if (value === "critical") return "urgent";
  if (value === "high") return "cautionary";
  if (value === "medium" || value === "attention" || value === "elevated") return "strategic";
  return "informational";
}

export function strongerTone(
  left: ExecutiveNarrativeTone,
  right: ExecutiveNarrativeTone,
): ExecutiveNarrativeTone {
  return toneRank(right) > toneRank(left) ? right : left;
}

export function buildExecutiveNarrativeHeadline(params: {
  focus: string;
  tone: ExecutiveNarrativeTone;
}): string {
  const focus = normalizeExecutiveNarrativeText(params.focus) || "Operational intelligence";
  if (params.tone === "urgent") return `${focus} requires executive attention.`;
  if (params.tone === "cautionary") return `${focus} remains an elevated strategic pressure.`;
  if (params.tone === "stabilizing") return `${focus} is showing signs of stabilization.`;
  if (params.tone === "strategic") return `${focus} is shaping the current executive posture.`;
  return `${focus} is visible in the current operating picture.`;
}

export function buildExecutiveNarrativeSummary(params: {
  focus: string;
  tone: ExecutiveNarrativeTone;
  objectCount: number;
  signalCount: number;
}): string {
  const focus = normalizeExecutiveNarrativeText(params.focus) || "Operational pressure";
  const scope = params.objectCount > 1 ? "connected operating paths" : "a focused operating path";
  if (params.tone === "urgent") {
    return `${focus} is consolidating across ${scope} and should remain the primary executive storyline.`;
  }
  if (params.tone === "cautionary") {
    return `${focus} is creating sustained pressure across ${scope} and warrants continued strategic review.`;
  }
  if (params.tone === "stabilizing") {
    return `${focus} is moving toward a more controlled state, but continuity should still be monitored.`;
  }
  if (params.tone === "strategic") {
    return `${focus} connects ${params.signalCount} intelligence signals into a single executive operating theme.`;
  }
  return `${focus} provides useful context for the current executive view.`;
}
