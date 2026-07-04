import { ExecutiveContextPlatformFreeze } from "../app-context/executiveContextPlatformFreezeIndex.ts";
import { EXECUTIVE_REASONING_CONTRACT_VERSION, type ExecutiveReasoningManifest, type ExecutiveReasoningRegistry } from "./executiveReasoningTypes.ts";
import { validateExecutiveReasoningFoundation, validateExecutiveReasoningRegistry } from "./executiveReasoningValidation.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function fingerprint(manifest: Omit<ExecutiveReasoningManifest, "fingerprint">): string {
  return stableHash(
    [
      manifest.platformVersion,
      manifest.consumedExecutiveContextPlatform,
      manifest.packageCount,
      manifest.contractCount,
      manifest.supportedContractVersion,
      manifest.registryFrozen,
      manifest.registryMetadata.registryId,
      manifest.immutable,
      manifest.deterministic,
      manifest.metadataOnly,
    ].join("||")
  );
}

export function buildExecutiveReasoningManifest(registry: ExecutiveReasoningRegistry): ExecutiveReasoningManifest {
  const contextManifest = ExecutiveContextPlatformFreeze.buildExecutiveContextPlatformFreezeManifest();
  const registryValidation = validateExecutiveReasoningRegistry(registry);
  const foundationValidation = validateExecutiveReasoningFoundation();
  const contractCount = registry.packages.reduce((sum, entry) => sum + entry.package.contracts.length, 0);
  const base = Object.freeze({
    platformVersion: "APP-REASON-1" as const,
    consumedExecutiveContextPlatform: contextManifest.platformIdentity.version,
    packageCount: registryValidation.valid && foundationValidation.valid ? registry.packages.length : 0,
    contractCount: registryValidation.valid && foundationValidation.valid ? contractCount : 0,
    supportedContractVersion: EXECUTIVE_REASONING_CONTRACT_VERSION,
    registryFrozen: registry.frozen,
    registryMetadata: Object.freeze({
      registryId: registry.registryId,
      metadataOnly: true as const,
    }),
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({ ...base, fingerprint: fingerprint(base) });
}

export function validateExecutiveReasoningManifest(manifest: ExecutiveReasoningManifest) {
  const expected = fingerprint({
    platformVersion: manifest.platformVersion,
    consumedExecutiveContextPlatform: manifest.consumedExecutiveContextPlatform,
    packageCount: manifest.packageCount,
    contractCount: manifest.contractCount,
    supportedContractVersion: manifest.supportedContractVersion,
    registryFrozen: manifest.registryFrozen,
    registryMetadata: manifest.registryMetadata,
    immutable: manifest.immutable,
    deterministic: manifest.deterministic,
    metadataOnly: manifest.metadataOnly,
  });
  const valid =
    manifest.platformVersion === "APP-REASON-1" &&
    manifest.consumedExecutiveContextPlatform === "APP-CTX-4" &&
    manifest.supportedContractVersion === EXECUTIVE_REASONING_CONTRACT_VERSION &&
    manifest.registryMetadata.metadataOnly &&
    manifest.fingerprint === expected &&
    manifest.metadataOnly;

  return Object.freeze({
    valid,
    issues: Object.freeze(valid ? [] : [Object.freeze({ code: "invalid_reasoning_manifest", field: "manifest", message: "Executive reasoning manifest is invalid." })]),
  });
}
