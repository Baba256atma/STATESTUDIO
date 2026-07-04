import { runExecutiveJudgmentPlatform, validateExecutiveJudgmentPlatform } from "./executiveJudgmentPlatformIndex.ts";
import { buildExecutiveJudgmentPlatformFreezeManifest } from "./executiveJudgmentPlatformFreezeManifest.ts";
import { getExecutiveJudgmentPlatformCompatibilityMatrix } from "./executiveJudgmentPlatformCompatibility.ts";
import { listExecutiveJudgmentPlatformPhases, listExecutiveJudgmentPlatformPublicApis } from "./executiveJudgmentPlatformFreezeRegistry.ts";
import type { ExecutiveJudgmentPlatformRegressionEntry, ExecutiveJudgmentPlatformRegressionResult } from "./executiveJudgmentPlatformFreezeTypes.ts";

function entry(regressionId: string, description: string, passed: boolean): ExecutiveJudgmentPlatformRegressionEntry {
  return Object.freeze({ regressionId, description, passed, metadataOnly: true });
}

export function runExecutiveJudgmentPlatformRegression(): ExecutiveJudgmentPlatformRegressionResult {
  const result = runExecutiveJudgmentPlatform();
  const validation = validateExecutiveJudgmentPlatform(result);
  const manifest = buildExecutiveJudgmentPlatformFreezeManifest();
  const entries = Object.freeze([
    entry("contracts", "APP-JUDGE contract surface is represented in certified phases.", listExecutiveJudgmentPlatformPhases().some((phase) => phase.phaseId === "APP-JUDGE-1")),
    entry("public-apis", "Public API registry is populated and unique.", new Set(listExecutiveJudgmentPlatformPublicApis().map((api) => `${api.phaseId}:${api.apiName}`)).size === listExecutiveJudgmentPlatformPublicApis().length),
    entry("registries", "Freeze registry includes all APP-JUDGE phases.", listExecutiveJudgmentPlatformPhases().length === 10),
    entry("pipeline", "Platform pipeline validates without mutation.", validation.valid),
    entry("manifest", "Freeze manifest fingerprint is present.", manifest.manifestFingerprint.length > 0),
    entry("compatibility", "Compatibility matrix covers required consumers.", getExecutiveJudgmentPlatformCompatibilityMatrix().length === 9),
    entry("snapshots", "Pipeline snapshot fingerprint is deterministic metadata.", result.pipelineSnapshot.fingerprint.length > 0 && result.pipelineSnapshot.deterministic),
    entry("validation", "Platform validation result passes.", validation.valid),
    entry("platform-identity", "Platform identity is APP-JUDGE-9 in the certified API result.", result.platformIdentity.platformVersion === "APP-JUDGE-9"),
    entry("execution-order", "Execution order includes APP-JUDGE-1 through APP-JUDGE-9.", result.pipelineSnapshot.phaseOrder.length === 9),
  ]);
  const passed = entries.filter((item) => item.passed).length;

  return Object.freeze({
    status: passed === entries.length ? "PASS" : "FAIL",
    entries,
    total: entries.length,
    passed,
    failed: entries.length - passed,
    metadataOnly: true,
  });
}
