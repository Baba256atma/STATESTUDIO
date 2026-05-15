import { validateCanonicalFlow } from "./canonicalIntelligenceFlow.ts";
import { listIntelligenceLayers } from "./intelligenceLayerRegistry.ts";

export type D2ArchitectureRisk = {
  id: string;
  severity: "low" | "medium" | "high";
  summary: string;
  recommendedAction: string;
};

export type D2ArchitectureReadinessReport = {
  readyForD3: boolean;
  layerCount: number;
  overlayLayerCount: number;
  orchestrationQuality: "stable" | "watch" | "needs_attention";
  executiveUxMaturity: "developing" | "stable" | "mature";
  connectorReadiness: "blocked" | "partial" | "ready";
  stabilizedSystems: string[];
  unresolvedOverlap: string[];
  risks: D2ArchitectureRisk[];
};

function duplicateProducerWarnings(): string[] {
  const producerMap = new Map<string, string[]>();
  for (const layer of listIntelligenceLayers()) {
    for (const produced of layer.produces) {
      producerMap.set(produced, [...(producerMap.get(produced) ?? []), layer.id]);
    }
  }
  return Array.from(producerMap.entries())
    .filter(([, layers]) => layers.length > 1)
    .map(([signal, layers]) => `${signal}: ${layers.join(", ")}`);
}

export function buildD2ArchitectureReadinessReport(): D2ArchitectureReadinessReport {
  const layers = listIntelligenceLayers();
  const flow = validateCanonicalFlow();
  const duplicateWarnings = duplicateProducerWarnings();
  const risks: D2ArchitectureRisk[] = [];

  if (!flow.valid) {
    risks.push({
      id: "canonical_flow_warnings",
      severity: "high",
      summary: "Canonical intelligence flow has unresolved registry warnings.",
      recommendedAction: "Fix layer ids and stage ownership before adding live connectors.",
    });
  }

  if (duplicateWarnings.length > 0) {
    risks.push({
      id: "duplicate_signal_producers",
      severity: "medium",
      summary: "Some produced signal names are owned by multiple layers.",
      recommendedAction: "Keep shared names only where one layer is explicitly a synthesis layer.",
    });
  }

  risks.push({
    id: "panel_consumption_not_fully_centralized",
    severity: "low",
    summary: "Panel ownership is documented in the registry but not yet enforced by a single UI adapter.",
    recommendedAction: "Use the registry as the D2 to D3 source of truth before wiring live connector outputs.",
  });

  const highRisks = risks.filter((risk) => risk.severity === "high");
  return {
    readyForD3: highRisks.length === 0,
    layerCount: layers.length,
    overlayLayerCount: layers.filter((layer) => layer.overlayConsumers.length > 0).length,
    orchestrationQuality: highRisks.length ? "needs_attention" : duplicateWarnings.length ? "watch" : "stable",
    executiveUxMaturity: layers.some((layer) => layer.id === "compression") && layers.some((layer) => layer.id === "readiness") ? "mature" : "stable",
    connectorReadiness: highRisks.length ? "blocked" : "ready",
    stabilizedSystems: layers.map((layer) => layer.id),
    unresolvedOverlap: [
      "monitoring vs alerts: monitoring owns ongoing state; alerts own attention escalation",
      "resilience vs adaptation: resilience owns recovery capacity; adaptation owns flexibility and rigidity",
      "confidence vs readiness: confidence owns evidence reliability; readiness owns executive timing",
      "timeline vs drift: timeline owns temporal movement; drift owns deviation from baseline",
      ...duplicateWarnings,
    ],
    risks,
  };
}
