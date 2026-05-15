import { buildD2ProductionReadinessReport } from "../architecture/d2ProductionReadinessReport.ts";
import { buildD2ToD3BridgeReport } from "../connectors/d2ToD3BridgeReport.ts";
import { buildIntelligenceHarmonizationDiagnostics } from "../harmonization/intelligenceHarmonizationDiagnostics.ts";
import { validateRuntimeLayerMap } from "../architecture/runtimeLayerMap.ts";
import { validateD2RegistryCoverage } from "./d2ValidationRegistry.ts";
import { validateTypeCIntegrity } from "./typeCIntegrityValidation.ts";

export type D2CertificationStatus =
  | "READY"
  | "PARTIALLY_READY"
  | "NOT_READY";

export type FinalD2CertificationReport = {
  status: D2CertificationStatus;
  architectureMaturity: "production_foundation" | "needs_attention";
  orchestrationQuality: "stable" | "watch" | "needs_attention";
  runtimeStability: "stable" | "watch" | "needs_attention";
  uxMaturity: "stable" | "mature" | "developing";
  connectorReadiness: "ready" | "watch" | "blocked";
  typeCIntegrity: "preserved" | "watch" | "failed";
  productionConfidence: number;
  unresolvedRisks: string[];
  d3LaunchReadiness: boolean;
};

function confidenceFromStatus(params: {
  productionReady: boolean;
  bridgeReady: boolean;
  typeCReady: boolean;
  registryReady: boolean;
  runtimeReady: boolean;
}): number {
  const values = [
    params.productionReady,
    params.bridgeReady,
    params.typeCReady,
    params.registryReady,
    params.runtimeReady,
  ];
  return Math.round((values.filter(Boolean).length / values.length) * 100);
}

export function buildFinalD2CertificationReport(): FinalD2CertificationReport {
  const production = buildD2ProductionReadinessReport();
  const bridge = buildD2ToD3BridgeReport();
  const harmonization = buildIntelligenceHarmonizationDiagnostics();
  const typeC = validateTypeCIntegrity();
  const registry = validateD2RegistryCoverage();
  const runtime = validateRuntimeLayerMap();

  const productionReady = production.readyForD3;
  const bridgeReady = bridge.readyForD3;
  const typeCReady = typeC.valid && harmonization.warnings.length === 0;
  const registryReady = registry.valid;
  const runtimeReady = runtime.valid;
  const productionConfidence = confidenceFromStatus({
    productionReady,
    bridgeReady,
    typeCReady,
    registryReady,
    runtimeReady,
  });
  const hardBlockers = [productionReady, bridgeReady, registryReady, runtimeReady].filter((ready) => !ready).length;
  const status: D2CertificationStatus = hardBlockers > 0
    ? "NOT_READY"
    : typeCReady
      ? "READY"
      : "PARTIALLY_READY";

  return {
    status,
    architectureMaturity: production.architectureMaturity === "needs_attention" ? "needs_attention" : "production_foundation",
    orchestrationQuality: production.orchestrationQuality,
    runtimeStability: production.runtimeStability,
    uxMaturity: production.uxMaturity,
    connectorReadiness: bridge.connectorReadiness,
    typeCIntegrity: typeCReady ? "preserved" : typeC.valid ? "watch" : "failed",
    productionConfidence,
    unresolvedRisks: [
      ...production.remainingRisks,
      ...bridge.unresolvedIngestionRisks,
      ...typeC.warnings,
      ...registry.missingCategories.map((category) => `Missing D2 validation category: ${category}`),
      ...runtime.warnings,
    ],
    d3LaunchReadiness: status === "READY",
  };
}
