import { buildD2ProductionReadinessReport } from "../architecture/d2ProductionReadinessReport.ts";
import { buildD3ConnectorReadinessChecklist } from "./d3ConnectorReadinessChecklist.ts";
import { listNexoraConnectors } from "./connectorRegistry.ts";

export type D2ToD3BridgeReport = {
  readyForD3: boolean;
  connectorReadiness: "ready" | "watch" | "blocked";
  asyncOrchestrationMaturity: "prepared" | "watch";
  runtimeSafety: "stable" | "watch";
  overlayScalability: "protected" | "watch";
  domainReadiness: "ready" | "watch";
  productionStability: "ready" | "watch" | "blocked";
  unresolvedIngestionRisks: string[];
  d3ExpansionRisks: string[];
  connectorCount: number;
};

export function buildD2ToD3BridgeReport(): D2ToD3BridgeReport {
  const production = buildD2ProductionReadinessReport();
  const checklist = buildD3ConnectorReadinessChecklist();
  const connectors = listNexoraConnectors();

  return {
    readyForD3: production.readyForD3 && checklist.readyForD3,
    connectorReadiness: checklist.failCount > 0 ? "blocked" : checklist.watchCount > 0 ? "watch" : "ready",
    asyncOrchestrationMaturity: checklist.items.some((item) => item.category === "async_safety" && item.status === "pass") ? "prepared" : "watch",
    runtimeSafety: production.runtimeStability === "needs_attention" ? "watch" : "stable",
    overlayScalability: checklist.items.some((item) => item.category === "overlay_protection" && item.status === "pass") ? "protected" : "watch",
    domainReadiness: checklist.items.some((item) => item.category === "domain_mapping_readiness" && item.status === "pass") ? "ready" : "watch",
    productionStability: production.readyForD3 ? "ready" : production.highRiskWarnings.length ? "blocked" : "watch",
    unresolvedIngestionRisks: [
      "Live connector authentication, scheduling, and retry policies are intentionally not implemented in D2.",
      "Streaming connectors still need runtime backpressure once D3 begins.",
    ],
    d3ExpansionRisks: [
      "High-frequency connector bursts may require stricter batching and TTL policy.",
      "Domain mappings should be reviewed as new enterprise connectors are added.",
      "Panel consumers should continue using executive focus summaries to prevent live-data noise.",
    ],
    connectorCount: connectors.length,
  };
}
