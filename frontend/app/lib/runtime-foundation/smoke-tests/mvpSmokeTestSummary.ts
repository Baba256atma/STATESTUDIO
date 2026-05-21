import { stableSignature } from "../../intelligence/shared/dedupe";
import type {
  ExecutiveRuntimeValidationSummary,
  MVPSmokeTestResult,
  MVPSmokeTestStatus,
  MVPSmokeTestSuiteResult,
  SmokeTestFinding,
} from "./mvpSmokeTestTypes";

export const MVP_SMOKE_TEST_MAX_FINDINGS = 12;
export const MVP_SMOKE_TEST_MAX_RECOMMENDATIONS = 6;

export function deriveMVPValidationStatus(
  passed: number,
  warned: number,
  failed: number,
  skipped: number
): MVPSmokeTestStatus {
  if (failed > 0) return "fail";
  if (passed === 0 && skipped > 0 && warned === 0) return "skipped";
  if (warned > 0) return "warn";
  if (passed > 0) return "pass";
  return "skipped";
}

export function getCriticalSmokeFindings(
  results: readonly MVPSmokeTestResult[]
): SmokeTestFinding[] {
  const findings: SmokeTestFinding[] = [];
  for (const result of results) {
    for (const finding of result.findings) {
      if (finding.severity === "critical") findings.push(finding);
    }
  }
  const byId = new Map<string, SmokeTestFinding>();
  for (const f of findings) byId.set(f.findingId, f);
  return Array.from(byId.values())
    .sort((a, b) => b.generatedAt - a.generatedAt)
    .slice(0, MVP_SMOKE_TEST_MAX_FINDINGS);
}

export function summarizeMVPSmokeTestResults(
  organizationId: string,
  results: readonly MVPSmokeTestResult[]
): Pick<
  MVPSmokeTestSuiteResult,
  | "passed"
  | "warned"
  | "failed"
  | "skipped"
  | "status"
  | "validationSummary"
  | "criticalFindings"
  | "recommendations"
  | "signature"
> {
  const passed = results.filter((r) => r.status === "pass").length;
  const warned = results.filter((r) => r.status === "warn").length;
  const failed = results.filter((r) => r.status === "fail").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const status = deriveMVPValidationStatus(passed, warned, failed, skipped);
  const criticalFindings = getCriticalSmokeFindings(results);
  const evaluated = passed + warned + failed;
  const passRate = evaluated > 0 ? Number((passed / evaluated).toFixed(2)) : 0;

  const validationSummary: ExecutiveRuntimeValidationSummary = {
    validationStatus: status,
    headline:
      status === "pass"
        ? "Executive runtime validation passed for MVP smoke test."
        : status === "warn"
          ? "Executive runtime validation passed with warnings — review before MVP demo."
          : status === "fail"
            ? "Executive runtime validation failed — stabilize before MVP demo."
            : "Executive runtime validation skipped — insufficient runtime depth.",
    passRate,
    scenarioCount: results.length,
    criticalCount: criticalFindings.length,
  };

  const recommendations = formatSmokeTestRecommendation(results, status, criticalFindings);

  const signature = stableSignature([
    "mvp-runtime-smoke-suite",
    organizationId,
    status,
    passed,
    warned,
    failed,
    skipped,
    results.map((r) => `${r.scenarioId}:${r.status}`).join(","),
  ]);

  return {
    passed,
    warned,
    failed,
    skipped,
    status,
    validationSummary,
    criticalFindings: Object.freeze(criticalFindings),
    recommendations: Object.freeze(recommendations),
    signature,
  };
}

export function formatSmokeTestRecommendation(
  results: readonly MVPSmokeTestResult[],
  suiteStatus: MVPSmokeTestStatus,
  criticalFindings: readonly SmokeTestFinding[]
): string[] {
  const recommendations: string[] = [];

  if (suiteStatus === "pass") {
    recommendations.push("MVP smoke validation passed — safe to proceed with controlled executive demo.");
  }

  const failed = results.filter((r) => r.status === "fail");
  const warned = results.filter((r) => r.status === "warn");

  if (failed.some((r) => r.scenarioId === "rapid_panel_switch")) {
    recommendations.push("Stabilize panel transitions before MVP demo — verify no disappearing right rail.");
  }
  if (failed.some((r) => r.scenarioId === "repeat_analyze_same_object")) {
    recommendations.push("Run repeat analyze flow after next UI change and verify no panel flash.");
  }
  if (warned.some((r) => r.scenarioId === "chat_to_panel_to_scene")) {
    recommendations.push("Monitor chat → panel → scene pathway for feedback loops during MVP testing.");
  }
  if (warned.some((r) => r.scenarioId === "runtime_trust_stability")) {
    recommendations.push("Monitor panel transition latency and trust signals before MVP publish.");
  }
  if (criticalFindings.length > 0) {
    recommendations.push(
      `Address ${criticalFindings.length} critical finding(s) before executive MVP validation.`
    );
  }
  if (recommendations.length === 0 && suiteStatus === "warn") {
    recommendations.push("Review warned scenarios and re-run smoke suite after stabilization.");
  }
  if (recommendations.length === 0 && suiteStatus === "skipped") {
    recommendations.push("Allow governance cognition to complete before running MVP smoke validation.");
  }

  return Array.from(new Set(recommendations)).slice(0, MVP_SMOKE_TEST_MAX_RECOMMENDATIONS);
}
