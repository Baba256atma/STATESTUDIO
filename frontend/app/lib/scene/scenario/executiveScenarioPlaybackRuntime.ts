/**
 * E2:95 — Executive scenario playback runtime: step sequences, cursor, summaries.
 */

import type { TimelineEvent } from "../executiveTimelineHudTypes";
import { resolveScenarioPropagationView } from "./executiveScenarioPropagationRuntime";
import {
  impactFromIntensity,
  inferStepKind,
  inferStepSeverity,
} from "./executiveScenarioPropagationRuntime";
import type {
  BuildExecutiveScenarioPlaybackSequenceInput,
  ExecutiveScenarioCompletionSummary,
  ExecutiveScenarioPlaybackSequence,
  ExecutiveScenarioPlaybackState,
  ExecutiveScenarioStep,
  ScenarioPlaybackSpeed,
  ScenarioStepKind,
} from "./executiveScenarioPlaybackTypes";

function labelFor(labels: Readonly<Record<string, string>> | undefined, id: string): string {
  return labels?.[id] ?? id;
}

function buildStep(input: {
  index: number;
  stepId: string;
  title: string;
  summary: string;
  kind: ScenarioStepKind;
  sourceObjects: string[];
  targetObjects: string[];
  hops?: Array<{ from: string; to: string; strength: number }>;
  timelineEventId?: string | null;
  timestamp?: string;
  severity?: ExecutiveScenarioStep["severity"];
  narration?: ExecutiveScenarioStep["narration"];
  decisionOptions?: ExecutiveScenarioStep["decisionOptions"];
}): ExecutiveScenarioStep {
  const impactStrength = impactFromIntensity(input.hops?.[0]?.strength ?? 0.6);
  return {
    stepId: input.stepId,
    index: input.index,
    timestamp: input.timestamp,
    title: input.title,
    summary: input.summary,
    severity: inferStepSeverity({ title: input.title, severity: input.severity, impactStrength }),
    kind: input.kind,
    sourceObjects: input.sourceObjects,
    targetObjects: input.targetObjects,
    affectedRelationships: (input.hops ?? []).map((hop) => ({
      sourceId: hop.from,
      targetId: hop.to,
    })),
    impactStrength,
    timelineEventId: input.timelineEventId ?? null,
    propagationHops: input.hops,
    narration: input.narration,
    decisionOptions: input.decisionOptions,
  };
}

function buildStepsFromSimulation(input: BuildExecutiveScenarioPlaybackSequenceInput): ExecutiveScenarioStep[] {
  const simulation = input.simulation;
  if (!simulation || simulation.propagationPaths.length === 0) return [];
  const labels = input.sceneObjectLabels ?? {};
  const steps: ExecutiveScenarioStep[] = [];
  const paths = simulation.propagationPaths;

  const origin = paths[0]?.from;
  if (origin) {
    steps.push(
      buildStep({
        index: steps.length,
        stepId: `${simulation.scenarioId}:origin`,
        title: "Operational Disruption",
        summary: `${labelFor(labels, origin)} becomes the initial pressure source.`,
        kind: "disruption",
        sourceObjects: [origin],
        targetObjects: [],
        severity: inferStepSeverity({ title: "disruption", riskLevel: simulation.riskLevel }),
        narration: {
          what: `${labelFor(labels, origin)} reports operational pressure.`,
          why: "Upstream disruption enters the network.",
          consequence: "Downstream nodes may be affected.",
          recommendation: "Trace propagation path and assess exposure.",
        },
      })
    );
  }

  paths.forEach((path, pathIndex) => {
    steps.push(
      buildStep({
        index: steps.length,
        stepId: `${simulation.scenarioId}:hop:${pathIndex}`,
        title: `${labelFor(labels, path.from)} → ${labelFor(labels, path.to)}`,
        summary: `Impact propagates from ${labelFor(labels, path.from)} to ${labelFor(labels, path.to)}.`,
        kind: pathIndex === paths.length - 1 && simulation.riskLevel === "high" ? "risk" : "operational",
        sourceObjects: [path.from],
        targetObjects: [path.to],
        hops: [{ from: path.from, to: path.to, strength: path.intensity }],
        severity: inferStepSeverity({ title: "propagation", riskLevel: simulation.riskLevel, impactStrength: impactFromIntensity(path.intensity) }),
        narration: {
          what: `${labelFor(labels, path.to)} receives propagated pressure.`,
          why: `Linked dependency from ${labelFor(labels, path.from)}.`,
          consequence: "Operational load shifts downstream.",
        },
      })
    );
  });

  if (simulation.riskLevel === "high") {
    const last = paths[paths.length - 1];
    steps.push(
      buildStep({
        index: steps.length,
        stepId: `${simulation.scenarioId}:risk`,
        title: "System Risk Elevated",
        summary: simulation.summary,
        kind: "risk",
        sourceObjects: last ? [last.from] : [],
        targetObjects: last ? [last.to] : simulation.affectedObjectIds.slice(-1),
        hops: last ? [{ from: last.from, to: last.to, strength: 0.92 }] : [],
        severity: "critical",
        narration: {
          what: "Risk posture increases across affected systems.",
          why: "Multi-hop propagation reached critical exposure.",
          consequence: "Executive intervention may be required.",
          recommendation: "Review mitigation and decision alternatives.",
        },
      })
    );
  }

  return steps;
}

function buildStepsFromTimeline(
  events: NonNullable<BuildExecutiveScenarioPlaybackSequenceInput["timelineEvents"]>,
  labels: Readonly<Record<string, string>>
): ExecutiveScenarioStep[] {
  return events.map((event, index) => {
    const related = [...(event.relatedObjectIds ?? [])];
    const source = related[0] ?? null;
    const target = related[1] ?? related[0] ?? null;
    const kind = inferStepKind(event.title, event.markerType);
    return buildStep({
      index,
      stepId: event.id,
      title: event.title,
      summary: event.narrativeSummary ?? event.summary ?? event.title,
      kind,
      sourceObjects: source ? [source] : [],
      targetObjects: target ? [target] : [],
      hops:
        source && target && source !== target
          ? [{ from: source, to: target, strength: kind === "risk" ? 0.82 : 0.58 }]
          : [],
      timelineEventId: event.id,
      timestamp: event.timestamp ?? event.timestampIso,
      severity: event.severity,
      narration: {
        what: event.title,
        why: event.summary ?? "Timeline signal changed.",
        consequence: kind === "opportunity" ? "Positive operational movement." : "Operational context shifts.",
      },
      decisionOptions:
        kind === "decision"
          ? [
              { id: `${event.id}:a`, label: "Approve path", selected: index % 2 === 0 },
              { id: `${event.id}:b`, label: "Defer action" },
              { id: `${event.id}:c`, label: "Escalate review" },
            ]
          : undefined,
    });
  });
}

function mergeTimelineSteps(
  simulationSteps: ExecutiveScenarioStep[],
  timelineSteps: ExecutiveScenarioStep[]
): ExecutiveScenarioStep[] {
  if (simulationSteps.length === 0) return timelineSteps.map((step, index) => ({ ...step, index }));
  if (timelineSteps.length === 0) return simulationSteps.map((step, index) => ({ ...step, index }));

  const merged = [...simulationSteps];
  timelineSteps.forEach((timelineStep) => {
    const existing = merged.find((step) => step.timelineEventId === timelineStep.timelineEventId);
    if (existing) {
      existing.narration = timelineStep.narration ?? existing.narration;
      existing.timelineEventId = timelineStep.timelineEventId;
      return;
    }
    merged.push({ ...timelineStep, index: merged.length });
  });
  return merged.map((step, index) => ({ ...step, index }));
}

export function buildExecutiveScenarioPlaybackSequence(
  input: BuildExecutiveScenarioPlaybackSequenceInput
): ExecutiveScenarioPlaybackSequence | null {
  const simulationSteps = buildStepsFromSimulation(input);
  const timelineSteps = buildStepsFromTimeline(input.timelineEvents ?? [], input.sceneObjectLabels ?? {});
  const steps = mergeTimelineSteps(simulationSteps, timelineSteps);
  if (steps.length === 0) return null;

  const scenarioId = input.simulation?.scenarioId ?? input.scenarioId ?? "executive_scenario";
  const scenarioName = input.scenarioName ?? "Operational Scenario";
  const signature = [
    scenarioId,
    steps.map((step) => step.stepId).join("|"),
    input.simulation?.summary ?? "",
  ].join("::");

  return { scenarioId, scenarioName, steps, signature };
}

export function buildExecutiveScenarioPlaybackState(input: {
  sequence: ExecutiveScenarioPlaybackSequence | null;
  stepIndex?: number;
  status?: ExecutiveScenarioPlaybackState["status"];
  speed?: ScenarioPlaybackSpeed;
  cameraFollowEnabled?: boolean;
  userCameraOverride?: boolean;
}): ExecutiveScenarioPlaybackState {
  const sequence = input.sequence;
  const stepIndex = Math.max(0, Math.min((sequence?.steps.length ?? 1) - 1, input.stepIndex ?? 0));
  const propagationView = sequence ? resolveScenarioPropagationView({ sequence, stepIndex }) : null;
  return {
    status: input.status ?? "idle",
    speed: input.speed ?? "normal",
    currentStepIndex: stepIndex,
    sequence,
    propagationView,
    completionSummary: null,
    cameraFollowEnabled: input.cameraFollowEnabled ?? true,
    userCameraOverride: input.userCameraOverride ?? false,
    signature: [
      sequence?.signature ?? "none",
      stepIndex,
      input.status ?? "idle",
      input.speed ?? "normal",
      propagationView?.signature ?? "",
    ].join("::"),
  };
}

export function buildScenarioCompletionSummary(
  sequence: ExecutiveScenarioPlaybackSequence
): ExecutiveScenarioCompletionSummary {
  const lastStep = sequence.steps[sequence.steps.length - 1];
  const affectedObjectIds = [
    ...new Set(sequence.steps.flatMap((step) => [...step.sourceObjects, ...step.targetObjects])),
  ];
  const riskLevel = lastStep?.severity ?? "watch";
  return {
    scenarioId: sequence.scenarioId,
    scenarioName: sequence.scenarioName,
    affectedSystems: sequence.steps.map((step) => step.title).slice(-4),
    affectedObjectIds,
    riskLevel,
    confidenceScore: riskLevel === "critical" ? 0.62 : riskLevel === "warning" ? 0.74 : 0.86,
    impactSummary: lastStep?.summary ?? "Scenario playback completed.",
  };
}

export function resolvePlaybackStepDuration(speed: ScenarioPlaybackSpeed): number {
  if (speed === "slow") return 2800;
  if (speed === "fast") return 900;
  return 1600;
}

export function resolveTimelineEventIdForStep(
  sequence: ExecutiveScenarioPlaybackSequence,
  stepIndex: number
): string | null {
  return sequence.steps[stepIndex]?.timelineEventId ?? sequence.steps[stepIndex]?.stepId ?? null;
}

export function mapTimelineEventsForPlayback(events: readonly TimelineEvent[]): BuildExecutiveScenarioPlaybackSequenceInput["timelineEvents"] {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    timestamp: event.timestamp,
    timestampIso: event.timestampIso,
    summary: event.summary,
    narrativeSummary: event.narrativeSummary,
    severity: event.severity,
    markerType: event.markerType,
    relatedObjectIds: event.relatedObjectIds,
  }));
}
