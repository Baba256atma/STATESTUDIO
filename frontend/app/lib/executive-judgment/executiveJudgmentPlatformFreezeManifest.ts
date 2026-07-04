import { getExecutiveJudgmentPlatformRegistry } from "./executiveJudgmentPlatformIndex.ts";
import { getExecutiveJudgmentPlatformCompatibilityMatrix } from "./executiveJudgmentPlatformCompatibility.ts";
import {
  EXECUTIVE_JUDGMENT_FREEZE_EXTENSION_POLICY,
  EXECUTIVE_JUDGMENT_FREEZE_IDENTITY,
  EXECUTIVE_JUDGMENT_FREEZE_PHASES,
  EXECUTIVE_JUDGMENT_FREEZE_PUBLIC_APIS,
} from "./executiveJudgmentPlatformFreezeRegistry.ts";
import type { ExecutiveJudgmentPlatformFreezeManifest } from "./executiveJudgmentPlatformFreezeTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function fingerprint(manifest: Omit<ExecutiveJudgmentPlatformFreezeManifest, "manifestFingerprint">): string {
  return stableHash([
    manifest.platformIdentity.platformId,
    manifest.platformIdentity.platformVersion,
    manifest.platformIdentity.releaseVersion,
    manifest.certifiedComponents.map((phase) => `${phase.phaseId}:${phase.status}:${phase.order}`).join(","),
    manifest.certifiedApis.map((api) => `${api.phaseId}:${api.apiName}`).join(","),
    manifest.certifiedPipeline.join(","),
    manifest.dependencyMatrix.map((entry) => `${entry.phaseId}:${entry.consumes.join("+")}`).join(","),
    manifest.compatibilityMatrix.map((entry) => `${entry.target}:${entry.compatibility}`).join(","),
    manifest.extensionPolicy.policy,
    manifest.releaseMetadata.declaration,
    manifest.releaseMetadata.nextPhase,
  ].join("||"));
}

export function buildExecutiveJudgmentPlatformFreezeManifest(): ExecutiveJudgmentPlatformFreezeManifest {
  const registry = getExecutiveJudgmentPlatformRegistry();
  const base = Object.freeze({
    platformIdentity: EXECUTIVE_JUDGMENT_FREEZE_IDENTITY,
    certifiedComponents: EXECUTIVE_JUDGMENT_FREEZE_PHASES,
    certifiedApis: EXECUTIVE_JUDGMENT_FREEZE_PUBLIC_APIS,
    certifiedPipeline: registry.certifiedPhases,
    dependencyMatrix: registry.dependencyMatrix,
    compatibilityMatrix: getExecutiveJudgmentPlatformCompatibilityMatrix(),
    extensionPolicy: EXECUTIVE_JUDGMENT_FREEZE_EXTENSION_POLICY,
    releaseMetadata: Object.freeze({
      declaration: "CERTIFIED_FROZEN_RELEASED" as const,
      nextPhase: "Nexora Executive Intelligence Architecture Integration" as const,
      deterministic: true as const,
      immutable: true as const,
      metadataOnly: true as const,
    }),
  });

  return Object.freeze({ ...base, manifestFingerprint: fingerprint(base) });
}
