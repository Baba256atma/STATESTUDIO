import { getExecutiveJudgmentPlatformRegistry, type ExecutiveJudgmentPlatformPhaseId } from "./executiveJudgmentPlatformRegistry.ts";

export type ExecutiveJudgmentPlatformManifest = Readonly<{
  platformName: "Executive Judgment Platform";
  platformVersion: "APP-JUDGE-9";
  pipelineVersion: "executive-judgment-pipeline.v1";
  certifiedComponents: readonly ExecutiveJudgmentPlatformPhaseId[];
  executionOrder: readonly ExecutiveJudgmentPlatformPhaseId[];
  compatibility: readonly string[];
  manifestMetadata: Readonly<{
    deterministic: true;
    immutable: true;
    metadataOnly: true;
  }>;
  manifestFingerprint: string;
}>;

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function buildExecutiveJudgmentPlatformManifest(): ExecutiveJudgmentPlatformManifest {
  const registry = getExecutiveJudgmentPlatformRegistry();
  const base = Object.freeze({
    platformName: registry.platformName,
    platformVersion: registry.platformVersion,
    pipelineVersion: "executive-judgment-pipeline.v1" as const,
    certifiedComponents: registry.certifiedPhases,
    executionOrder: registry.certifiedPhases,
    compatibility: registry.compatibilityMatrix,
    manifestMetadata: Object.freeze({
      deterministic: true as const,
      immutable: true as const,
      metadataOnly: true as const,
    }),
  });
  const manifestFingerprint = stableHash([
    base.platformName,
    base.platformVersion,
    base.pipelineVersion,
    base.certifiedComponents.join(","),
    base.executionOrder.join(","),
    base.compatibility.join(","),
    base.manifestMetadata.deterministic,
    base.manifestMetadata.immutable,
    base.manifestMetadata.metadataOnly,
  ].join("||"));

  return Object.freeze({ ...base, manifestFingerprint });
}
