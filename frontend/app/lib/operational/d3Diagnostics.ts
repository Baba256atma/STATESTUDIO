import type { OperationalAlertEvaluationResult } from "./alertRuleTypes.ts";
import type { OperationalChangeSummary } from "./changeDetectionTypes.ts";
import type { OperationalMonitoringSnapshot } from "./monitoringTypes.ts";
import type { OperationalPropagationPreview } from "./propagationPreviewTypes.ts";
import type { OperationalRiskImpactMap } from "./riskImpactTypes.ts";
import { stableSignature } from "../intelligence/shared/dedupe.ts";
import {
  buildD3MonitoringSignature,
  buildOperationalAlertSignature,
  buildOperationalChangeSignature,
  buildOperationalRiskSignature,
  buildPropagationSignature,
} from "./d3SignatureDeduplication.ts";
import { devLogOnSignatureChange } from "../runtime/diagnosticIdleGate";

export type OperationalStateSummary = Readonly<{
  monitoringSignature: string;
  changeSignature: string;
  propagationSignature: string;
  riskSignature: string;
  alertsSignature: string;
  compositeSignature: string;
}>;

export function summarizeOperationalState(input: Readonly<{
  monitoringSnapshot: OperationalMonitoringSnapshot | null;
  operationalChangeSummary: OperationalChangeSummary | null;
  propagationPreview: OperationalPropagationPreview | null;
  operationalRiskImpactMap: OperationalRiskImpactMap | null;
  alertEvaluation: OperationalAlertEvaluationResult | null;
}>): OperationalStateSummary {
  const monitoringSignature = buildD3MonitoringSignature(input.monitoringSnapshot);
  const changeSignature = buildOperationalChangeSignature(input.operationalChangeSummary);
  const propagationSignature = buildPropagationSignature(input.propagationPreview);
  const riskSignature = buildOperationalRiskSignature(input.operationalRiskImpactMap);
  const alertsSignature = buildOperationalAlertSignature(input.alertEvaluation);
  const compositeSignature = stableSignature({
    monitoringSignature,
    changeSignature,
    propagationSignature,
    riskSignature,
    alertsSignature,
  });
  return {
    monitoringSignature,
    changeSignature,
    propagationSignature,
    riskSignature,
    alertsSignature,
    compositeSignature,
  };
}

export type OperationalInstabilitySummary = Readonly<{
  flags: readonly string[];
}>;

export function summarizeOperationalInstability(input: Readonly<{
  propagationPreview: OperationalPropagationPreview | null;
  alertEvaluation: OperationalAlertEvaluationResult | null;
}>): OperationalInstabilitySummary {
  const flags: string[] = [];
  const pn = input.propagationPreview?.propagationNodes?.length ?? 0;
  if (pn >= 32) flags.push("large_propagation_surface");
  const ac = input.alertEvaluation?.alerts?.length ?? 0;
  if (ac >= 10) flags.push("high_alert_cardinality");
  if ((input.alertEvaluation?.criticalAlertCount ?? 0) >= 4) flags.push("critical_alert_cluster");
  return { flags: flags.sort((a, b) => a.localeCompare(b)) };
}

export function detectOperationalLoopRisk(input: Readonly<{
  propagationPreview: OperationalPropagationPreview | null;
  /** Upper bound of graph edges considered when building preview (implementation-specific). */
  maxPreviewNodes: number;
}>): boolean {
  const n = input.propagationPreview?.propagationNodes?.length ?? 0;
  return n >= Math.max(1, Math.floor(input.maxPreviewNodes * 0.92));
}

export function detectOperationalAlertSpam(
  result: OperationalAlertEvaluationResult | null,
  maxAlerts: number = 14
): boolean {
  const c = result?.alerts?.length ?? 0;
  return c > maxAlerts;
}

let lastDiagnosticsComposite = "";

/**
 * Dev-only, deduped `[Nexora][D3]` line. Safe to call from render-adjacent effects; identical composite signatures no-op.
 */
export function logD3OperationalDiagnosticsDeduped(input: Readonly<{
  monitoringSnapshot: OperationalMonitoringSnapshot | null;
  operationalChangeSummary: OperationalChangeSummary | null;
  propagationPreview: OperationalPropagationPreview | null;
  operationalRiskImpactMap: OperationalRiskImpactMap | null;
  alertEvaluation: OperationalAlertEvaluationResult | null;
}>): void {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") return;
  const summary = summarizeOperationalState(input);
  if (summary.compositeSignature === lastDiagnosticsComposite) return;
  lastDiagnosticsComposite = summary.compositeSignature;
  const inst = summarizeOperationalInstability({
    propagationPreview: input.propagationPreview,
    alertEvaluation: input.alertEvaluation,
  });
  devLogOnSignatureChange("[Nexora][D3]", summary.compositeSignature, {
    composite: summary.compositeSignature.slice(0, 120),
    instability: inst.flags,
    counts: {
      signals: input.monitoringSnapshot?.signals?.length ?? 0,
      propagationNodes: input.propagationPreview?.propagationNodes?.length ?? 0,
      riskNodes: input.operationalRiskImpactMap?.nodes?.length ?? 0,
      alerts: input.alertEvaluation?.alerts?.length ?? 0,
    },
  });
}
