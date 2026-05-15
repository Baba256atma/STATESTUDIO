import { validateCanonicalFlow } from "../intelligence/canonicalIntelligenceFlow.ts";
import { listIntelligenceLayers } from "../intelligence/intelligenceLayerRegistry.ts";
import { validateRuntimeLayerMap } from "./runtimeLayerMap.ts";

export type ArchitectureBoundaryWarningCategory =
  | "coupling"
  | "circular_dependency"
  | "ownership"
  | "overlay_safety"
  | "connector_readiness"
  | "logging"
  | "runtime_layer";

export type ArchitectureBoundaryWarning = {
  id: string;
  category: ArchitectureBoundaryWarningCategory;
  severity: "low" | "medium" | "high";
  message: string;
  recommendedAction: string;
};

function duplicatePanelConsumerWarnings(): ArchitectureBoundaryWarning[] {
  const panelMap = new Map<string, string[]>();
  for (const layer of listIntelligenceLayers()) {
    for (const panel of layer.panelConsumers) {
      panelMap.set(panel, [...(panelMap.get(panel) ?? []), layer.id]);
    }
  }
  return Array.from(panelMap.entries())
    .filter(([, owners]) => owners.length > 4)
    .map(([panel, owners]) => ({
      id: `panel_consumer_overlap:${panel}`,
      category: "ownership" as const,
      severity: "medium" as const,
      message: `${panel} consumes many intelligence layers: ${owners.join(", ")}.`,
      recommendedAction: "Route through executive UX summaries or panel-specific adapters before adding connector outputs.",
    }));
}

function overlaySafetyWarnings(): ArchitectureBoundaryWarning[] {
  return listIntelligenceLayers()
    .filter((layer) => layer.overlayConsumers.length > 0 && layer.lifecycle === "source")
    .map((layer) => ({
      id: `source_overlay_owner:${layer.id}`,
      category: "overlay_safety" as const,
      severity: "low" as const,
      message: `${layer.id} is a source layer with overlay consumers.`,
      recommendedAction: "Keep source-layer overlays passive and derived from immutable scene snapshots.",
    }));
}

export function auditArchitectureBoundaries(): ArchitectureBoundaryWarning[] {
  const warnings: ArchitectureBoundaryWarning[] = [];
  const flow = validateCanonicalFlow();
  const runtime = validateRuntimeLayerMap();

  for (const warning of flow.warnings) {
    warnings.push({
      id: `canonical_flow:${warning}`,
      category: "circular_dependency",
      severity: "high",
      message: warning,
      recommendedAction: "Resolve canonical flow warnings before enabling live connector orchestration.",
    });
  }

  for (const warning of runtime.warnings) {
    warnings.push({
      id: `runtime_layer:${warning}`,
      category: "runtime_layer",
      severity: "high",
      message: warning,
      recommendedAction: "Fix runtime layer ownership before expanding platform boundaries.",
    });
  }

  warnings.push(...duplicatePanelConsumerWarnings());
  warnings.push(...overlaySafetyWarnings());

  warnings.push({
    id: "connector_ingress_not_runtime_wired",
    category: "connector_readiness",
    severity: "low",
    message: "Connector ingress boundaries are architectural contracts and not yet wired into runtime ingestion.",
    recommendedAction: "Use connector ingress helpers as the first D3 normalization boundary before scene or overlay updates.",
  });

  return warnings.sort((left, right) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    if (severityOrder[right.severity] !== severityOrder[left.severity]) {
      return severityOrder[right.severity] - severityOrder[left.severity];
    }
    return left.id.localeCompare(right.id);
  });
}
