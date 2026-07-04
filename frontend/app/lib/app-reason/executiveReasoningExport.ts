import { ExecutiveReasoningFoundation, type ExecutiveReasoningRegistry } from "./executiveReasoningIndex.ts";
import { ExecutiveReasoningQueryLayer } from "./executiveReasoningQueryIndex.ts";
import type {
  ExecutiveReasoningExportBundle,
  ExecutiveReasoningExportComparison,
  ExecutiveReasoningExportManifest,
  ExecutiveReasoningExportValidation,
} from "./executiveReasoningExportTypes.ts";

const EXPORT_MANIFEST: ExecutiveReasoningExportManifest = Object.freeze({
  exportVersion: "APP-REASON-3",
  platformName: "Executive Reasoning Certification & Export Layer",
  foundationPhase: "APP-REASON-1",
  queryPhase: "APP-REASON-2",
  certificationPhase: "APP-REASON-3",
  metadataOnly: true,
});

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function bundleFingerprint(bundle: Omit<ExecutiveReasoningExportBundle, "fingerprint">): string {
  return stableHash(
    [
      bundle.exportManifest.exportVersion,
      bundle.reasoningManifest.fingerprint,
      bundle.reasoningSnapshot.fingerprint,
      bundle.reasoningSummary,
      bundle.queryMetadata.capabilities.join(","),
      bundle.validationMetadata.foundationValidation.valid,
      bundle.validationMetadata.registryValidation.valid,
      bundle.validationMetadata.snapshotValidation.valid,
      bundle.validationMetadata.manifestValidation.valid,
      bundle.exportMetadata.registryId,
      bundle.exportMetadata.packageCount,
      bundle.exportMetadata.contractCount,
      bundle.exportMetadata.snapshotEntryCount,
      bundle.exportMetadata.queryCapabilityCount,
      bundle.immutable,
      bundle.deterministic,
      bundle.metadataOnly,
    ].join("||")
  );
}

function validationResult(valid: boolean, code: string, message: string): ExecutiveReasoningExportValidation {
  return Object.freeze({
    valid,
    issues: Object.freeze(valid ? [] : [Object.freeze({ code, message })]),
  });
}

function buildRegistrySummary(registry: ExecutiveReasoningRegistry): string {
  const packageIds = ExecutiveReasoningFoundation.listExecutiveReasoningPackages(registry)
    .map((entry) => entry.package.packageId)
    .sort();
  return `Executive reasoning registry ${registry.registryId} contains ${packageIds.length} metadata packages: ${packageIds.join(",")}.`;
}

export function buildExecutiveReasoningExportBundle(
  registry: ExecutiveReasoningRegistry = ExecutiveReasoningFoundation.createExecutiveReasoningRegistry()
): ExecutiveReasoningExportBundle {
  const reasoningManifest = ExecutiveReasoningFoundation.buildExecutiveReasoningManifest(registry);
  const reasoningSnapshot = ExecutiveReasoningQueryLayer.buildExecutiveReasoningSnapshot(registry);
  const reasoningSummary = buildRegistrySummary(registry);
  const capabilities = ExecutiveReasoningQueryLayer.listExecutiveReasoningCapabilities();
  const foundationValidation = ExecutiveReasoningFoundation.validateExecutiveReasoningFoundation();
  const registryValidation = ExecutiveReasoningFoundation.validateExecutiveReasoningRegistry(registry);
  const snapshotValidation = ExecutiveReasoningQueryLayer.validateExecutiveReasoningSnapshot(reasoningSnapshot);
  const manifestValidation = ExecutiveReasoningFoundation.validateExecutiveReasoningManifest(reasoningManifest);
  const base = Object.freeze({
    exportManifest: EXPORT_MANIFEST,
    reasoningManifest,
    reasoningSnapshot,
    reasoningSummary,
    queryMetadata: Object.freeze({
      capabilities,
      metadataOnly: true as const,
    }),
    validationMetadata: Object.freeze({
      foundationValidation,
      registryValidation,
      snapshotValidation,
      manifestValidation,
      metadataOnly: true as const,
    }),
    exportMetadata: Object.freeze({
      registryId: registry.registryId,
      exportVersion: "APP-REASON-3" as const,
      packageCount: reasoningManifest.packageCount,
      contractCount: reasoningManifest.contractCount,
      snapshotEntryCount: reasoningSnapshot.entries.length,
      queryCapabilityCount: capabilities.length,
      metadataOnly: true as const,
      runtimeBehavior: false as const,
    }),
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({ ...base, fingerprint: bundleFingerprint(base) });
}

export function validateExecutiveReasoningExportBundle(bundle: ExecutiveReasoningExportBundle): ExecutiveReasoningExportValidation {
  const expected = bundleFingerprint({
    exportManifest: bundle.exportManifest,
    reasoningManifest: bundle.reasoningManifest,
    reasoningSnapshot: bundle.reasoningSnapshot,
    reasoningSummary: bundle.reasoningSummary,
    queryMetadata: bundle.queryMetadata,
    validationMetadata: bundle.validationMetadata,
    exportMetadata: bundle.exportMetadata,
    immutable: bundle.immutable,
    deterministic: bundle.deterministic,
    metadataOnly: bundle.metadataOnly,
  });
  const valid =
    bundle.exportManifest.exportVersion === "APP-REASON-3" &&
    bundle.reasoningManifest.platformVersion === "APP-REASON-1" &&
    bundle.reasoningSnapshot.packageCount === bundle.exportMetadata.packageCount &&
    bundle.reasoningSnapshot.contractCount === bundle.exportMetadata.contractCount &&
    bundle.reasoningSnapshot.entries.length === bundle.exportMetadata.snapshotEntryCount &&
    bundle.queryMetadata.capabilities.length === bundle.exportMetadata.queryCapabilityCount &&
    bundle.validationMetadata.foundationValidation.valid &&
    bundle.validationMetadata.registryValidation.valid &&
    bundle.validationMetadata.snapshotValidation.valid &&
    bundle.validationMetadata.manifestValidation.valid &&
    !bundle.exportMetadata.runtimeBehavior &&
    bundle.fingerprint === expected &&
    bundle.metadataOnly;

  return validationResult(valid, "invalid_reasoning_export_bundle", "Executive reasoning export bundle is invalid.");
}

export function compareExecutiveReasoningExportBundles(
  left: ExecutiveReasoningExportBundle,
  right: ExecutiveReasoningExportBundle
): ExecutiveReasoningExportComparison {
  const equal = left.fingerprint === right.fingerprint;
  return Object.freeze({
    equal,
    leftFingerprint: left.fingerprint,
    rightFingerprint: right.fingerprint,
    diagnostics: Object.freeze(equal ? [] : ["Executive reasoning export bundle fingerprints differ."]),
  });
}
