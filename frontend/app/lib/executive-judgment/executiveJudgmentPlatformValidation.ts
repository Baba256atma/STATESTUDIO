import type { ExecutiveJudgmentPlatformResult } from "./executiveJudgmentPlatformRunner.ts";
import { getExecutiveJudgmentPlatformRegistry } from "./executiveJudgmentPlatformRegistry.ts";

export type ExecutiveJudgmentPlatformValidation = Readonly<{
  valid: boolean;
  issues: readonly Readonly<{
    code: string;
    field: string;
    message: string;
  }>[];
}>;

function issue(code: string, field: string, message: string) {
  return Object.freeze({ code, field, message });
}

export function validateExecutiveJudgmentPlatform(result: ExecutiveJudgmentPlatformResult): ExecutiveJudgmentPlatformValidation {
  const registry = getExecutiveJudgmentPlatformRegistry();
  const issues = [];
  if (result.pipelineSnapshot.phaseOrder.join("|") !== registry.certifiedPhases.join("|")) {
    issues.push(issue("invalid_phase_order", "pipelineSnapshot.phaseOrder", "Pipeline phase order must match certified registry order."));
  }
  if (registry.certifiedPhases.length !== 9) issues.push(issue("missing_phases", "registry.certifiedPhases", "Registry must contain APP-JUDGE-1 through APP-JUDGE-9."));
  if (!result.context || !result.evidenceAssessment || !result.constraintAssessment || !result.tradeoffAssessment || !result.riskOpportunityBalance || !result.executiveJudgment || !result.judgmentExplanation) {
    issues.push(issue("missing_output", "platformResult", "Platform result is missing one or more pipeline outputs."));
  }
  if (result.executionManifest.manifestFingerprint.length === 0) {
    issues.push(issue("invalid_manifest", "executionManifest", "Execution manifest fingerprint is required."));
  }
  if (!result.pipelineSnapshot.fingerprint) {
    issues.push(issue("invalid_snapshot", "pipelineSnapshot", "Pipeline snapshot fingerprint is required."));
  }
  if (!Object.isFrozen(result) || !Object.isFrozen(result.pipelineSnapshot)) {
    issues.push(issue("mutable_platform_output", "platformResult", "Platform result must be immutable."));
  }
  if (!result.platformMetadata.deterministic || !result.platformMetadata.metadataOnly) {
    issues.push(issue("invalid_platform_metadata", "platformMetadata", "Platform metadata must be deterministic and metadata-only."));
  }

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}
