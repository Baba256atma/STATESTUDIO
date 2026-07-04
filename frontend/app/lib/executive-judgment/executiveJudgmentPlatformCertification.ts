import { validateExecutiveJudgmentPlatform, runExecutiveJudgmentPlatform } from "./executiveJudgmentPlatformIndex.ts";
import { buildExecutiveJudgmentPlatformFreezeManifest } from "./executiveJudgmentPlatformFreezeManifest.ts";
import { getExecutiveJudgmentPlatformCompatibilityMatrix } from "./executiveJudgmentPlatformCompatibility.ts";
import { listExecutiveJudgmentPlatformPhases, listExecutiveJudgmentPlatformPublicApis } from "./executiveJudgmentPlatformFreezeRegistry.ts";
import type { ExecutiveJudgmentPlatformCertificationGate, ExecutiveJudgmentPlatformCertificationResult } from "./executiveJudgmentPlatformFreezeTypes.ts";

function gate(gateId: string, description: string, passed: boolean): ExecutiveJudgmentPlatformCertificationGate {
  return Object.freeze({ gateId, description, passed });
}

export function runExecutiveJudgmentPlatformCertification(): ExecutiveJudgmentPlatformCertificationResult {
  const result = runExecutiveJudgmentPlatform();
  const validation = validateExecutiveJudgmentPlatform(result);
  const manifest = buildExecutiveJudgmentPlatformFreezeManifest();
  const phaseIds = listExecutiveJudgmentPlatformPhases().map((phase) => phase.phaseId);
  const apiKeys = listExecutiveJudgmentPlatformPublicApis().map((api) => `${api.phaseId}:${api.apiName}`);
  const gates = Object.freeze([
    gate("app-judge-1", "APP-JUDGE-1 is certified.", phaseIds.includes("APP-JUDGE-1")),
    gate("app-judge-2", "APP-JUDGE-2 is certified.", phaseIds.includes("APP-JUDGE-2")),
    gate("app-judge-3", "APP-JUDGE-3 is certified.", phaseIds.includes("APP-JUDGE-3")),
    gate("app-judge-4", "APP-JUDGE-4 is certified.", phaseIds.includes("APP-JUDGE-4")),
    gate("app-judge-5", "APP-JUDGE-5 is certified.", phaseIds.includes("APP-JUDGE-5")),
    gate("app-judge-6", "APP-JUDGE-6 is certified.", phaseIds.includes("APP-JUDGE-6")),
    gate("app-judge-7", "APP-JUDGE-7 is certified.", phaseIds.includes("APP-JUDGE-7")),
    gate("app-judge-8", "APP-JUDGE-8 is certified.", phaseIds.includes("APP-JUDGE-8")),
    gate("app-judge-9", "APP-JUDGE-9 is certified.", phaseIds.includes("APP-JUDGE-9")),
    gate("platform-validation", "Platform validation passes.", validation.valid),
    gate("manifest-valid", "Freeze manifest is complete.", manifest.certifiedComponents.length === 10 && manifest.manifestFingerprint.length > 0),
    gate("api-registry-valid", "Public API registry is unique.", new Set(apiKeys).size === apiKeys.length),
    gate("compatibility-valid", "Compatibility matrix is complete.", getExecutiveJudgmentPlatformCompatibilityMatrix().length === 9),
    gate("immutable-output", "Platform result and manifest are immutable.", Object.isFrozen(result) && Object.isFrozen(manifest)),
    gate("metadata-only", "Freeze output is metadata-only.", manifest.releaseMetadata.metadataOnly && result.platformMetadata.metadataOnly),
  ]);

  return Object.freeze({
    status: gates.every((item) => item.passed) ? "PASS" : "FAIL",
    gates,
    diagnostics: Object.freeze(gates.map((item) => `${item.gateId}:${item.passed ? "PASS" : "FAIL"}`)),
    metadataOnly: true,
  });
}
