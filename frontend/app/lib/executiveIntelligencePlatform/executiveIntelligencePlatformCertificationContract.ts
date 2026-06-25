/**
 * INT-5 — Executive Intelligence Platform certification contract.
 */

export const EXECUTIVE_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION = "INT-5" as const;

export const EXECUTIVE_INTELLIGENCE_PLATFORM_TAGS = Object.freeze([
  "[INT5_PLATFORM_CERTIFIED]",
  "[EXECUTIVE_INTELLIGENCE_CERTIFIED]",
  "[PIPELINE_CERTIFIED]",
  "[CONSUMER_CERTIFIED]",
  "[END_TO_END_CERTIFIED]",
  "[NO_DIRECT_DS_ACCESS]",
  "[ARCHITECTURE_FROZEN]",
  "[INT5_COMPLETE]",
] as const);

export const NEXORA_EXECUTIVE_INTELLIGENCE_PLATFORM_LOG_PREFIX =
  "[NexoraExecutiveIntelligencePlatform]" as const;

export const EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE = "int-5-executive-intelligence-platform" as const;

export type ExecutiveIntelligenceCertificationGroupId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L";

export const EXECUTIVE_INTELLIGENCE_CERTIFICATION_GROUP_TITLES: Readonly<
  Record<ExecutiveIntelligenceCertificationGroupId, string>
> = Object.freeze({
  A: "Architecture",
  B: "Consumer Isolation",
  C: "Pipeline Integrity",
  D: "Executive Time",
  E: "Unified Context",
  F: "Selection Synchronization",
  G: "Normalized Intelligence",
  H: "Mutation Protection",
  I: "Diagnostics",
  J: "Regression",
  K: "Performance",
  L: "Build",
});

export type ExecutiveIntelligencePlatformCheck = Readonly<{
  id: string;
  group: ExecutiveIntelligenceCertificationGroupId;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveIntelligenceEndToEndScenarioId =
  | "scenario_1_workspace_open"
  | "scenario_2_object_selection"
  | "scenario_3_now_delivery"
  | "scenario_4_future_delivery"
  | "scenario_5_past_delivery";

export type ExecutiveIntelligenceEndToEndScenarioResult = Readonly<{
  id: ExecutiveIntelligenceEndToEndScenarioId;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveIntelligenceRegressionSuiteResult = Readonly<{
  passed: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testFiles: readonly string[];
  failures: readonly string[];
}>;

export type ExecutiveIntelligencePlatformDiagnosticsReport = Readonly<{
  gatewayDiagnostics: number;
  runtimeDiagnostics: number;
  assistantDiagnostics: number;
  executiveSummaryDiagnostics: number;
  objectPanelDiagnostics: number;
  contextDiagnostics: number;
  timeDiagnostics: number;
  generatedAt: string;
}>;

export type ExecutiveIntelligenceArchitectureFreezeReport = Readonly<{
  frozen: boolean;
  frozenAt: string | null;
  contractVersion: typeof EXECUTIVE_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION;
  reason: string;
  tags: typeof EXECUTIVE_INTELLIGENCE_PLATFORM_TAGS;
}>;

export type ExecutiveIntelligencePlatformCertificationResult = Readonly<{
  contractVersion: typeof EXECUTIVE_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION;
  certified: boolean;
  passed: boolean;
  architectureFrozen: boolean;
  checks: readonly ExecutiveIntelligencePlatformCheck[];
  scenarios: readonly ExecutiveIntelligenceEndToEndScenarioResult[];
  regression: ExecutiveIntelligenceRegressionSuiteResult;
  diagnosticsReport: ExecutiveIntelligencePlatformDiagnosticsReport;
  freezeReport: ExecutiveIntelligenceArchitectureFreezeReport;
  summary: string;
  generatedAt: string;
  tags: typeof EXECUTIVE_INTELLIGENCE_PLATFORM_TAGS;
}>;

export const EXECUTIVE_INTELLIGENCE_PLATFORM_CONSUMERS = Object.freeze([
  "assistant",
  "executive_summary",
  "object_panel",
] as const);

export const EXECUTIVE_INTELLIGENCE_REGRESSION_TEST_FILES = Object.freeze([
  "app/lib/dashboardIntelligence/dashboardIntelligenceFoundation.test.ts",
  "app/lib/dashboardIntelligence/singleIntelligenceSource.test.ts",
  "app/lib/dashboardIntelligence/intelligenceContext.test.ts",
  "app/lib/dashboardIntelligence/executiveTimeContext.test.ts",
  "app/lib/assistantIntelligence/assistantIntelligence.test.ts",
  "app/lib/executiveSummaryIntelligence/executiveSummaryIntelligence.test.ts",
  "app/lib/objectPanelIntelligence/objectPanelIntelligence.test.ts",
] as const);
