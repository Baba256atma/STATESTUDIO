/**
 * INT-5 — Executive Intelligence Platform diagnostics report.
 */

import { getAssistantIntelligenceDiagnosticsLog } from "../assistantIntelligence/assistantDiagnostics.ts";
import { getIntelligenceConsumerDiagnostics } from "../dashboardIntelligence/consumerDiagnosticsContract.ts";
import { getDashboardIntelligenceEvents } from "../dashboardIntelligence/dashboardIntelligenceDiagnostics.ts";
import { getExecutiveTimeContextDiagnosticsLog } from "../dashboardIntelligence/executiveTimeContextDiagnostics.ts";
import { getIntelligenceContextDiagnosticsLog } from "../dashboardIntelligence/intelligenceContextDiagnostics.ts";
import { getExecutiveSummaryDiagnosticsLog } from "../executiveSummaryIntelligence/executiveSummaryDiagnostics.ts";
import { getObjectPanelDiagnosticsLog } from "../objectPanelIntelligence/objectPanelDiagnostics.ts";
import type { ExecutiveIntelligencePlatformDiagnosticsReport } from "./executiveIntelligencePlatformCertificationContract.ts";

export function buildExecutiveIntelligencePlatformDiagnosticsReport(): ExecutiveIntelligencePlatformDiagnosticsReport {
  return Object.freeze({
    gatewayDiagnostics: getIntelligenceConsumerDiagnostics().length,
    runtimeDiagnostics: getDashboardIntelligenceEvents().length,
    assistantDiagnostics: getAssistantIntelligenceDiagnosticsLog().length,
    executiveSummaryDiagnostics: getExecutiveSummaryDiagnosticsLog().length,
    objectPanelDiagnostics: getObjectPanelDiagnosticsLog().length,
    contextDiagnostics: getIntelligenceContextDiagnosticsLog().length,
    timeDiagnostics: getExecutiveTimeContextDiagnosticsLog().length,
    generatedAt: new Date().toISOString(),
  });
}

export function platformDiagnosticsOperational(
  report: ExecutiveIntelligencePlatformDiagnosticsReport
): boolean {
  return (
    report.gatewayDiagnostics > 0 &&
    report.runtimeDiagnostics > 0 &&
    report.assistantDiagnostics > 0 &&
    report.executiveSummaryDiagnostics > 0 &&
    report.objectPanelDiagnostics > 0 &&
    report.contextDiagnostics > 0 &&
    report.timeDiagnostics > 0
  );
}
