import type { PanelPayloadSourceFlags } from "./builders/panelPayloadBuilderTypes";

// Policy helpers choose source priority only. They do not shape payloads or control navigation.

type PolicyResult<T> = {
  payload: T | null;
  sourceKind: "resolved" | "canonical" | "raw" | "legacy" | null;
  sourceFlags: PanelPayloadSourceFlags & {
    usedResponseConflict?: boolean;
    usedResponseConflicts?: boolean;
    usedLegacy?: boolean;
  };
};

function isSelected<T>(selected: T | null, candidate: T | null) {
  return selected != null && selected === candidate;
}

function pickFirst<T>(candidates: Array<{ kind: PolicyResult<T>["sourceKind"]; value: T | null }>): {
  payload: T | null;
  sourceKind: PolicyResult<T>["sourceKind"];
} {
  for (const candidate of candidates) {
    if (candidate.value != null) {
      return {
        payload: candidate.value,
        sourceKind: candidate.kind,
      };
    }
  }

  return {
    payload: null,
    sourceKind: null,
  };
}

// Centralizes canonical-first source priority. Builders shape payloads; policy chooses source order.
export function resolveAdvicePayloadPolicy<T>(args: {
  resolved: T | null;
  canonicalAdvice: T | null;
  canonicalStrategicAdvice: T | null;
  raw: T | null;
}): PolicyResult<T> {
  const selected = pickFirst<T>([
    { kind: "resolved", value: args.resolved },
    { kind: "canonical", value: args.canonicalAdvice },
    { kind: "canonical", value: args.canonicalStrategicAdvice },
    { kind: "raw", value: args.raw },
  ]);

  return {
    payload: selected.payload,
    sourceKind: selected.sourceKind,
    sourceFlags: {
      usedResolved: selected.sourceKind === "resolved",
      usedCanonical: selected.sourceKind === "canonical",
      usedRaw: selected.sourceKind === "raw",
    },
  };
}

export function resolveConflictPayloadPolicy<T>(args: {
  resolved: T | null;
  canonical: T | null;
  responseConflict: T | null;
  responseConflicts: T | null;
  legacy: T | null;
}): PolicyResult<T> {
  const selected = pickFirst<T>([
    { kind: "resolved", value: args.resolved },
    { kind: "canonical", value: args.canonical },
    { kind: "raw", value: args.responseConflict },
    { kind: "raw", value: args.responseConflicts },
    { kind: "legacy", value: args.legacy },
  ]);

  return {
    payload: selected.payload,
    sourceKind: selected.sourceKind,
    sourceFlags: {
      usedResolved: isSelected(selected.payload, args.resolved),
      usedCanonical: isSelected(selected.payload, args.canonical),
      usedRaw:
        isSelected(selected.payload, args.responseConflict) ||
        isSelected(selected.payload, args.responseConflicts),
      usedResponseConflict: isSelected(selected.payload, args.responseConflict),
      usedResponseConflicts: isSelected(selected.payload, args.responseConflicts),
      usedLegacy: isSelected(selected.payload, args.legacy),
    },
  };
}

export function resolveTimelinePayloadPolicy<T>(args: {
  resolved: T | null;
  canonical: T | null;
  rawTimelineImpact: T | null;
  rawSimulationTimeline: T | null;
}): PolicyResult<T> {
  const selected = pickFirst<T>([
    { kind: "resolved", value: args.resolved },
    { kind: "canonical", value: args.canonical },
    { kind: "raw", value: args.rawTimelineImpact },
    { kind: "raw", value: args.rawSimulationTimeline },
  ]);

  return {
    payload: selected.payload,
    sourceKind: selected.sourceKind,
    sourceFlags: {
      usedResolved: isSelected(selected.payload, args.resolved),
      usedCanonical: isSelected(selected.payload, args.canonical),
      usedRaw:
        isSelected(selected.payload, args.rawTimelineImpact) ||
        isSelected(selected.payload, args.rawSimulationTimeline),
    },
  };
}

export function resolveDashboardPayloadPolicy<T>(args: {
  resolved: T | null;
  canonicalDashboard: T | null;
  canonicalDecisionCockpit: T | null;
  canonicalExecutiveSummary: T | null;
  rawExecutiveSummary: T | null;
  rawDecisionCockpit: T | null;
}): PolicyResult<T> {
  const selected = pickFirst<T>([
    { kind: "resolved", value: args.resolved },
    { kind: "canonical", value: args.canonicalDashboard },
    { kind: "canonical", value: args.canonicalDecisionCockpit },
    { kind: "canonical", value: args.canonicalExecutiveSummary },
    { kind: "raw", value: args.rawExecutiveSummary },
    { kind: "raw", value: args.rawDecisionCockpit },
  ]);

  return {
    payload: selected.payload,
    sourceKind: selected.sourceKind,
    sourceFlags: {
      usedResolved: isSelected(selected.payload, args.resolved),
      usedCanonical:
        isSelected(selected.payload, args.canonicalDashboard) ||
        isSelected(selected.payload, args.canonicalDecisionCockpit) ||
        isSelected(selected.payload, args.canonicalExecutiveSummary),
      usedRaw:
        isSelected(selected.payload, args.rawExecutiveSummary) ||
        isSelected(selected.payload, args.rawDecisionCockpit),
    },
  };
}

export function resolveWarRoomPayloadPolicy<T>(args: {
  resolved: T | null;
  canonicalWarRoom: T | null;
  canonicalStrategicCouncil: T | null;
  rawWarRoom: T | null;
}): PolicyResult<T> {
  const selected = pickFirst<T>([
    { kind: "resolved", value: args.resolved },
    { kind: "canonical", value: args.canonicalWarRoom },
    { kind: "canonical", value: args.canonicalStrategicCouncil },
    { kind: "raw", value: args.rawWarRoom },
  ]);

  return {
    payload: selected.payload,
    sourceKind: selected.sourceKind,
    sourceFlags: {
      usedResolved: isSelected(selected.payload, args.resolved),
      usedCanonical:
        isSelected(selected.payload, args.canonicalWarRoom) ||
        isSelected(selected.payload, args.canonicalStrategicCouncil),
      usedRaw: isSelected(selected.payload, args.rawWarRoom),
    },
  };
}
