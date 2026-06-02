/**
 * E2:95 — Scene propagation engine for scenario playback steps.
 */

import { logE295Propagation } from "./executiveScenarioPlaybackDiagnostics";
import type {
  ExecutiveScenarioPlaybackSequence,
  ExecutiveScenarioPropagationView,
  ExecutiveScenarioStep,
  ScenarioImpactStrength,
  ScenarioObjectState,
  ScenarioStepKind,
  ScenarioStepSeverity,
} from "./executiveScenarioPlaybackTypes";

function uniqueIds(values: readonly (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const id = String(value ?? "").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result;
}

function severityFromImpact(strength: ScenarioImpactStrength): ScenarioStepSeverity {
  if (strength === "critical") return "critical";
  if (strength === "high") return "warning";
  if (strength === "medium") return "watch";
  return "info";
}

function impactFromIntensity(intensity: number): ScenarioImpactStrength {
  if (intensity >= 0.85) return "critical";
  if (intensity >= 0.65) return "high";
  if (intensity >= 0.45) return "medium";
  return "low";
}

function resolveObjectState(input: {
  objectId: string;
  step: ExecutiveScenarioStep;
  stepIndex: number;
  totalSteps: number;
  isSource: boolean;
  isTarget: boolean;
}): ScenarioObjectState {
  if (input.step.kind === "recovery") {
    return input.isTarget ? "recovering" : input.isSource ? "resolved" : "normal";
  }
  if (input.step.kind === "opportunity") {
    if (input.isTarget || input.isSource) return input.stepIndex === input.totalSteps - 1 ? "resolved" : "active";
    return "normal";
  }
  if (input.isSource && input.stepIndex === 0) return "active";
  if (input.isTarget) return input.step.kind === "decision" ? "active" : "impacted";
  if (input.isSource) return "impacted";
  return "normal";
}

function buildClusterIds(objectIds: readonly string[]): string[] {
  if (objectIds.length < 2) return [];
  return [`cluster:${objectIds.slice(0, 4).join("+")}`];
}

function accumulatePropagationEdges(
  steps: readonly ExecutiveScenarioStep[],
  stepIndex: number
): ExecutiveScenarioPropagationView["propagationEdges"] {
  const edges: Array<{ from: string; to: string; strength: number; depth: number }> = [];
  for (let index = 0; index <= stepIndex; index += 1) {
    const step = steps[index];
    if (!step) continue;
    const hops = step.propagationHops ?? step.affectedRelationships.map((rel) => ({
      from: rel.sourceId,
      to: rel.targetId,
      strength: step.impactStrength === "critical" ? 0.92 : step.impactStrength === "high" ? 0.78 : 0.62,
    }));
    hops.forEach((hop, hopIndex) => {
      edges.push({
        from: hop.from,
        to: hop.to,
        strength: hop.strength,
        depth: index + hopIndex + 1,
      });
    });
  }
  return edges;
}

export function resolveScenarioPropagationView(input: {
  sequence: ExecutiveScenarioPlaybackSequence;
  stepIndex: number;
}): ExecutiveScenarioPropagationView {
  const steps = input.sequence.steps;
  const clampedIndex = Math.max(0, Math.min(steps.length - 1, input.stepIndex));
  const step = steps[clampedIndex]!;
  const priorSteps = steps.slice(0, clampedIndex + 1);

  const activeObjectIds = uniqueIds([
    ...step.sourceObjects,
    ...step.targetObjects,
  ]);
  const impactedObjectIds = uniqueIds(
    priorSteps.flatMap((entry) => [...entry.sourceObjects, ...entry.targetObjects])
  );

  const propagationEdges = accumulatePropagationEdges(steps, clampedIndex);
  const highlightedRelationships = propagationEdges.map((edge) => ({
    sourceId: edge.from,
    targetId: edge.to,
    strength: edge.strength,
  }));

  const objectStates: Record<string, ScenarioObjectState> = {};
  for (const objectId of impactedObjectIds) {
    objectStates[objectId] = resolveObjectState({
      objectId,
      step,
      stepIndex: clampedIndex,
      totalSteps: steps.length,
      isSource: step.sourceObjects.includes(objectId),
      isTarget: step.targetObjects.includes(objectId),
    });
  }

  const riskSources =
    step.kind === "risk" || step.kind === "disruption"
      ? uniqueIds(step.sourceObjects.length ? step.sourceObjects : [propagationEdges[0]?.from])
      : [];
  const riskTargets =
    step.kind === "risk" || step.kind === "disruption" || step.kind === "recovery"
      ? uniqueIds(step.targetObjects.length ? step.targetObjects : propagationEdges.map((edge) => edge.to))
      : [];

  const activeClusterIds = buildClusterIds(impactedObjectIds);
  const focusObjectId = step.targetObjects[0] ?? step.sourceObjects[0] ?? impactedObjectIds[impactedObjectIds.length - 1] ?? null;
  const completionPercent =
    steps.length <= 1 ? 100 : Math.round((clampedIndex / Math.max(1, steps.length - 1)) * 100);

  const view: ExecutiveScenarioPropagationView = {
    signature: [
      input.sequence.signature,
      step.stepId,
      clampedIndex,
      impactedObjectIds.join(","),
      propagationEdges.map((edge) => `${edge.from}->${edge.to}`).join("|"),
    ].join("::"),
    stepIndex: clampedIndex,
    stepId: step.stepId,
    objectStates,
    activeObjectIds,
    impactedObjectIds,
    highlightedRelationships,
    activeClusterIds,
    riskSources,
    riskTargets,
    propagationEdges,
    dimUnrelated: step.kind !== "operational",
    focusObjectId,
    activeSummary: step.summary,
    stepTitle: step.title,
    progressLabel: `Step ${clampedIndex + 1} / ${steps.length}`,
    completionPercent,
    kind: step.kind,
    severity: step.severity,
  };

  logE295Propagation(view.signature, {
    stepId: step.stepId,
    stepIndex: clampedIndex,
    kind: step.kind,
    impactedCount: impactedObjectIds.length,
    edgeCount: propagationEdges.length,
  });

  return view;
}

export function resolveScenarioPlaybackObjectSelection(
  view: ExecutiveScenarioPropagationView | null
): import("./executiveScenarioPlaybackTypes").ScenarioPlaybackObjectSelection | null {
  if (!view) return null;
  return {
    highlighted_objects: [...view.impactedObjectIds],
    risk_sources: [...view.riskSources],
    risk_targets: [...view.riskTargets],
    dim_unrelated_objects: view.dimUnrelated,
  };
}

export function buildPlaybackPropagationOverlay(
  view: ExecutiveScenarioPropagationView | null
): import("../../simulation/propagationTypes").PropagationOverlayState | null {
  if (!view || view.propagationEdges.length === 0) return null;
  const sourceId = view.riskSources[0] ?? view.propagationEdges[0]?.from ?? null;
  return {
    active: true,
    source_object_id: sourceId,
    mode: "preview",
    impacted_nodes: view.impactedObjectIds.map((objectId, index) => ({
      object_id: objectId,
      depth: index,
      strength:
        view.objectStates[objectId] === "active"
          ? 0.95
          : view.objectStates[objectId] === "impacted"
            ? 0.78
            : 0.55,
      role:
        view.riskSources.includes(objectId)
          ? "source"
          : view.riskTargets.includes(objectId)
            ? "impacted"
            : "context",
    })),
    impacted_edges: view.propagationEdges.map((edge) => ({
      from: edge.from,
      to: edge.to,
      depth: edge.depth,
      strength: edge.strength,
    })),
    meta: {
      label: view.stepTitle,
      timestamp: Date.now(),
      source_kind: "scenario_action",
    },
  };
}

export function inferStepKind(title: string, markerType?: string): ScenarioStepKind {
  const lower = title.toLowerCase();
  if (markerType === "scenario" || lower.includes("scenario") || lower.includes("simulated")) return "disruption";
  if (markerType === "risk" || lower.includes("risk") || lower.includes("delay")) return "risk";
  if (markerType === "decision" || lower.includes("decision") || lower.includes("accepted")) return "decision";
  if (markerType === "recovery" || lower.includes("recovery") || lower.includes("stabiliz")) return "recovery";
  if (lower.includes("growth") || lower.includes("opportunity") || lower.includes("contract")) return "opportunity";
  return "operational";
}

export function inferStepSeverity(input: {
  title: string;
  severity?: ScenarioStepSeverity;
  riskLevel?: "low" | "medium" | "high";
  impactStrength?: ScenarioImpactStrength;
}): ScenarioStepSeverity {
  if (input.severity) return input.severity;
  if (input.impactStrength) return severityFromImpact(input.impactStrength);
  if (input.riskLevel === "high") return "critical";
  if (input.riskLevel === "medium") return "warning";
  const lower = input.title.toLowerCase();
  if (lower.includes("critical") || lower.includes("inventory risk")) return "critical";
  if (lower.includes("delay") || lower.includes("risk")) return "warning";
  return "watch";
}

export { impactFromIntensity, severityFromImpact };
