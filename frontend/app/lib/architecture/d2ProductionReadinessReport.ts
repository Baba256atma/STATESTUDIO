import { buildD2ArchitectureReadinessReport } from "../intelligence/d2ArchitectureReadiness.ts";
import { auditArchitectureBoundaries, type ArchitectureBoundaryWarning } from "./architectureBoundaryAudit.ts";
import { buildProductionReadinessChecklist } from "./productionReadinessChecklist.ts";
import { listRuntimeLayers } from "./runtimeLayerMap.ts";

export type D2ProductionReadinessReport = {
  readyForD3: boolean;
  architectureMaturity: "developing" | "production_foundation" | "needs_attention";
  orchestrationQuality: "stable" | "watch" | "needs_attention";
  runtimeStability: "stable" | "watch" | "needs_attention";
  uxMaturity: "developing" | "stable" | "mature";
  connectorReadiness: "blocked" | "partial" | "ready";
  boundaryWarningCount: number;
  highRiskWarnings: ArchitectureBoundaryWarning[];
  remainingRisks: string[];
  scalingRisks: string[];
  d3ReadinessNotes: string[];
};

export function buildD2ProductionReadinessReport(): D2ProductionReadinessReport {
  const d2 = buildD2ArchitectureReadinessReport();
  const checklist = buildProductionReadinessChecklist();
  const boundaryWarnings = auditArchitectureBoundaries();
  const highRiskWarnings = boundaryWarnings.filter((warning) => warning.severity === "high");
  const runtimeLayerCount = listRuntimeLayers().length;
  const watchItems = checklist.items.filter((item) => item.status === "watch");

  return {
    readyForD3: d2.readyForD3 && checklist.ready && highRiskWarnings.length === 0,
    architectureMaturity: highRiskWarnings.length > 0 ? "needs_attention" : "production_foundation",
    orchestrationQuality: d2.orchestrationQuality,
    runtimeStability: checklist.failCount > 0 ? "needs_attention" : checklist.watchCount > 0 ? "watch" : "stable",
    uxMaturity: d2.executiveUxMaturity,
    connectorReadiness: d2.connectorReadiness,
    boundaryWarningCount: boundaryWarnings.length,
    highRiskWarnings,
    remainingRisks: [
      ...d2.risks.map((risk) => risk.summary),
      ...watchItems.map((item) => item.evidence),
    ],
    scalingRisks: [
      "Live connector payloads may amplify panel overlap unless routed through focus summaries.",
      "Connector ingestion must normalize before scene, overlay, or executive intelligence derivation.",
      "Overlay count should remain derived-only and independently recomputable as D3 sources grow.",
    ],
    d3ReadinessNotes: [
      `Runtime layer map defines ${runtimeLayerCount} production layers with explicit dependency boundaries.`,
      "Connector ingress envelopes are available as the first D3 normalization contract.",
      "Fault isolation rules cover connector, scene, overlay, panel, executive intelligence, and logging domains.",
    ],
  };
}
