import type { DecisionPathOverlayState } from "../simulation/decisionPathOverlayTypes";
import type { PropagationOverlayState } from "../simulation/propagationTypes";
import type { SceneOverlay } from "./overlayContracts";
import {
  decisionPathOverlayToEdges,
  propagationOverlayToEdges,
} from "./mergePropagationOverlay";
import { collectDependencyOverlayEdges } from "../relationships/relationshipRuntime";

function uniqueIds(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export function resolvePropagationSceneOverlay(
  overlay: PropagationOverlayState | null | undefined
): SceneOverlay | null {
  if (!overlay?.active) return null;
  const edges = propagationOverlayToEdges(overlay);
  if (edges.length === 0 && (overlay.impacted_nodes?.length ?? 0) === 0) return null;
  const sourceIds = uniqueIds([
    overlay.source_object_id ?? "",
    ...(overlay.impacted_nodes ?? [])
      .filter((node) => node.role === "source")
      .map((node) => node.object_id),
  ]);
  const targetIds = uniqueIds([
    ...(overlay.impacted_nodes ?? [])
      .filter((node) => node.role !== "source")
      .map((node) => node.object_id),
    ...edges.map((edge) => edge.to),
  ]);
  const maxStrength = Math.max(
    0,
    ...(overlay.impacted_nodes ?? []).map((node) => Number(node.strength ?? 0)),
    ...edges.map((edge) => edge.strength)
  );
  return {
    id: `propagation:${overlay.source_object_id ?? "scene"}`,
    type: "propagation",
    sourceIds,
    targetIds,
    severity: maxStrength,
    visible: true,
    metadata: {
      edgeCount: edges.length,
      mode: overlay.mode,
      label: overlay.meta?.label,
    },
  };
}

export function resolveRiskFlowSceneOverlay(input: {
  riskSources?: string[] | null;
  riskTargets?: string[] | null;
  propagation?: PropagationOverlayState | null;
  fragilityLevel?: string | null;
}): SceneOverlay | null {
  const sources = uniqueIds(input.riskSources ?? []);
  const targets = uniqueIds(input.riskTargets ?? []);
  if (sources.length === 0 && targets.length === 0 && !input.propagation?.active) return null;

  const propagationEdges = propagationOverlayToEdges(input.propagation);
  const highRiskEdges = propagationEdges.filter((edge) => edge.strength >= 0.55);
  const derivedTargets =
    targets.length > 0 ? targets : uniqueIds(highRiskEdges.map((edge) => edge.to));
  const derivedSources =
    sources.length > 0 ? sources : uniqueIds(highRiskEdges.map((edge) => edge.from));

  if (derivedSources.length === 0 && derivedTargets.length === 0) return null;

  const severity =
    input.fragilityLevel === "critical"
      ? 0.95
      : input.fragilityLevel === "high"
        ? 0.8
        : input.fragilityLevel === "medium"
          ? 0.55
          : 0.35;

  return {
    id: "risk_flow:scene",
    type: "risk_flow",
    sourceIds: derivedSources,
    targetIds: derivedTargets,
    severity,
    visible: true,
    metadata: {
      edgeCount: highRiskEdges.length,
      fragilityLevel: input.fragilityLevel ?? null,
    },
  };
}

export function resolveScenarioSceneOverlay(
  overlay: DecisionPathOverlayState | null | undefined
): SceneOverlay | null {
  if (!overlay?.active) return null;
  const edges = decisionPathOverlayToEdges(overlay);
  const sourceIds = uniqueIds([
    overlay.sourceId ?? "",
    ...(overlay.nodes ?? []).filter((node) => node.role === "source").map((node) => node.id),
  ]);
  const targetIds = uniqueIds([
    ...(overlay.nodes ?? [])
      .filter((node) => node.role === "destination" || node.role === "impacted")
      .map((node) => node.id),
    ...edges.map((edge) => edge.to),
  ]);
  if (sourceIds.length === 0 && targetIds.length === 0 && edges.length === 0) return null;
  return {
    id: `scenario:${overlay.sourceId ?? overlay.meta?.actionId ?? "active"}`,
    type: "scenario",
    sourceIds,
    targetIds,
    severity: Math.max(0, ...(overlay.nodes ?? []).map((node) => node.strength ?? 0)),
    visible: true,
    metadata: {
      edgeCount: edges.length,
      actionId: overlay.meta?.actionId,
      mode: overlay.meta?.mode,
    },
  };
}

export function resolveDependencySceneOverlay(sceneJson: unknown): SceneOverlay | null {
  const edges = collectDependencyOverlayEdges(sceneJson);
  if (edges.length === 0) return null;

  const sourceIds = uniqueIds(edges.map((edge) => edge.from));
  const targetIds = uniqueIds(edges.map((edge) => edge.to));
  if (sourceIds.length === 0) return null;

  return {
    id: "dependency:scene-graph",
    type: "dependency",
    sourceIds,
    targetIds,
    severity: 0.25,
    visible: true,
    metadata: {
      edgeCount: edges.length,
      includesRelationships: edges.some((edge) => Boolean(edge.relationshipId)),
    },
  };
}

export function resolveSceneOverlays(input: {
  propagation: PropagationOverlayState | null | undefined;
  decisionPath: DecisionPathOverlayState | null | undefined;
  riskSources?: string[] | null;
  riskTargets?: string[] | null;
  fragilityLevel?: string | null;
  sceneJson: unknown;
}): SceneOverlay[] {
  const overlays: SceneOverlay[] = [];
  const propagation = resolvePropagationSceneOverlay(input.propagation);
  if (propagation) overlays.push(propagation);
  const riskFlow = resolveRiskFlowSceneOverlay({
    riskSources: input.riskSources,
    riskTargets: input.riskTargets,
    propagation: input.propagation,
    fragilityLevel: input.fragilityLevel,
  });
  if (riskFlow) overlays.push(riskFlow);
  const scenario = resolveScenarioSceneOverlay(input.decisionPath);
  if (scenario) overlays.push(scenario);
  const dependency = resolveDependencySceneOverlay(input.sceneJson);
  if (dependency) overlays.push(dependency);
  return overlays;
}
