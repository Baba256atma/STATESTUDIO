/**
 * INT-1.1 — Direct access protection contract.
 * Architecture lock preventing presentation layers from importing DS engines directly.
 */

export const DIRECT_ACCESS_PROTECTION_VERSION = "INT-1.1" as const;

export type ForbiddenPresentationConsumer =
  | "dashboard"
  | "assistant"
  | "object_panel"
  | "executive_summary";

export const FORBIDDEN_PRESENTATION_CONSUMERS = Object.freeze([
  "dashboard",
  "assistant",
  "object_panel",
  "executive_summary",
] as const satisfies readonly ForbiddenPresentationConsumer[]);

/**
 * Module specifiers presentation layers must never import for intelligence.
 * Only Dashboard Intelligence Runtime may reach certified DS engines.
 */
export const FORBIDDEN_DIRECT_DS_IMPORT_PREFIXES = Object.freeze([
  "../kpi/workspaceKpi",
  "../kpi/kpiDashboardIntegrationRuntime",
  "../okr/workspaceOkr",
  "../okr/okrDashboardIntegrationRuntime",
  "../risk/workspaceRisk",
  "../risk/riskDashboardIntegrationRuntime",
  "../risk/workspaceRiskDetectionEngine",
  "../risk/workspaceRiskSeverityEngine",
  "../scenario/workspaceScenario",
  "../scenario/scenarioWorkspaceIntegrationRuntime",
  "../scenario/workspaceScenarioInsightEngine",
  "../scenario/workspaceScenarioSimulationEngine",
  "../scenario/workspaceScenarioComparisonEngine",
  "../scenario/scenarioExecutiveAdvisorRuntime",
  "../executive/executiveIntelligenceRegistry",
  "../workspace/workspaceObjectIntelligenceContract",
  "../workspace/workspaceRelationshipCreationContract",
] as const);

export type DirectAccessViolation = Readonly<{
  consumer: ForbiddenPresentationConsumer | null;
  importSpecifier: string;
  reason: string;
  rejectedAt: string;
}>;

const violationLog: DirectAccessViolation[] = [];

export function isForbiddenDirectDsImport(importSpecifier: string): boolean {
  const normalized = importSpecifier.trim().toLowerCase();
  if (!normalized) return false;
  return FORBIDDEN_DIRECT_DS_IMPORT_PREFIXES.some((prefix) => normalized.includes(prefix.toLowerCase()));
}

export function assertPresentationMayNotImportDsEngine(input: {
  consumer: ForbiddenPresentationConsumer;
  importSpecifier: string;
}): DirectAccessViolation | null {
  if (!isForbiddenDirectDsImport(input.importSpecifier)) return null;

  const violation = Object.freeze({
    consumer: input.consumer,
    importSpecifier: input.importSpecifier,
    reason: "Presentation layers must request intelligence through the Single Intelligence Source gateway.",
    rejectedAt: new Date().toISOString(),
  });
  violationLog.push(violation);
  return violation;
}

export function getDirectAccessViolations(): readonly DirectAccessViolation[] {
  return Object.freeze([...violationLog]);
}

export function resetDirectAccessProtectionForTests(): void {
  violationLog.length = 0;
}
