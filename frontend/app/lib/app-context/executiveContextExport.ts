import { ExecutiveContextBuilder, type ExecutiveContext } from "./executiveContextIndex.ts";
import { ExecutiveContextQueryLayer } from "./executiveContextQueryIndex.ts";
import type {
  ExecutiveContextExportBundle,
  ExecutiveContextExportComparison,
  ExecutiveContextExportManifest,
  ExecutiveContextExportValidation,
} from "./executiveContextExportTypes.ts";

const EXPORT_MANIFEST: ExecutiveContextExportManifest = Object.freeze({
  exportVersion: "APP-CTX-3",
  platformName: "Executive Context Certification & Export Layer",
  builderPhase: "APP-CTX-1",
  queryPhase: "APP-CTX-2",
  certificationPhase: "APP-CTX-3",
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

function bundleFingerprint(bundle: Omit<ExecutiveContextExportBundle, "fingerprint">): string {
  return stableHash(
    [
      bundle.exportManifest.exportVersion,
      bundle.contextManifest.fingerprint,
      bundle.contextSnapshot.fingerprint,
      bundle.contextSummary,
      bundle.queryMetadata.sections.join(","),
      bundle.queryMetadata.capabilities.join(","),
      bundle.validationMetadata.contextValidation.valid,
      bundle.validationMetadata.snapshotValidation.valid,
      bundle.validationMetadata.manifestValidation.valid,
      bundle.exportMetadata.contextId,
      bundle.exportMetadata.sectionCount,
      bundle.immutable,
      bundle.deterministic,
      bundle.metadataOnly,
    ].join("||")
  );
}

function validationResult(valid: boolean, code: string, message: string): ExecutiveContextExportValidation {
  return Object.freeze({
    valid,
    issues: Object.freeze(valid ? [] : [Object.freeze({ code, message })]),
  });
}

export function buildExecutiveContextExportBundle(
  context: ExecutiveContext = ExecutiveContextBuilder.createExecutiveContext()
): ExecutiveContextExportBundle {
  const contextManifest = ExecutiveContextBuilder.buildExecutiveContextManifest();
  const contextSnapshot = ExecutiveContextQueryLayer.buildExecutiveContextSnapshot(context);
  const contextSummary = ExecutiveContextQueryLayer.buildExecutiveContextSummary(context);
  const snapshotValidation = ExecutiveContextQueryLayer.validateExecutiveContextSnapshot(contextSnapshot);
  const manifestValidation = ExecutiveContextBuilder.validateExecutiveContextManifest(contextManifest);
  const contextValidation = ExecutiveContextBuilder.validateExecutiveContext(context);
  const sections = ExecutiveContextQueryLayer.listExecutiveContextSections();
  const capabilities = ExecutiveContextQueryLayer.listExecutiveContextCapabilities();
  const base = Object.freeze({
    exportManifest: EXPORT_MANIFEST,
    contextManifest,
    contextSnapshot,
    contextSummary,
    queryMetadata: Object.freeze({
      sections,
      capabilities,
      metadataOnly: true as const,
    }),
    validationMetadata: Object.freeze({
      contextValidation,
      snapshotValidation,
      manifestValidation,
      metadataOnly: true as const,
    }),
    exportMetadata: Object.freeze({
      contextId: context.identity.contextId,
      contextVersion: context.identity.contextVersion,
      exportVersion: "APP-CTX-3" as const,
      sectionCount: sections.length,
      snapshotEntryCount: contextSnapshot.entryCount,
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

export function validateExecutiveContextExportBundle(bundle: ExecutiveContextExportBundle): ExecutiveContextExportValidation {
  const expected = bundleFingerprint({
    exportManifest: bundle.exportManifest,
    contextManifest: bundle.contextManifest,
    contextSnapshot: bundle.contextSnapshot,
    contextSummary: bundle.contextSummary,
    queryMetadata: bundle.queryMetadata,
    validationMetadata: bundle.validationMetadata,
    exportMetadata: bundle.exportMetadata,
    immutable: bundle.immutable,
    deterministic: bundle.deterministic,
    metadataOnly: bundle.metadataOnly,
  });
  const valid =
    bundle.exportManifest.exportVersion === "APP-CTX-3" &&
    bundle.contextManifest.contextVersion === "APP-CTX-1" &&
    bundle.contextSnapshot.entryCount === bundle.exportMetadata.snapshotEntryCount &&
    bundle.queryMetadata.sections.length === bundle.exportMetadata.sectionCount &&
    bundle.validationMetadata.contextValidation.valid &&
    bundle.validationMetadata.snapshotValidation.valid &&
    bundle.validationMetadata.manifestValidation.valid &&
    !bundle.exportMetadata.runtimeBehavior &&
    bundle.fingerprint === expected &&
    bundle.metadataOnly;

  return validationResult(valid, "invalid_context_export_bundle", "Executive context export bundle is invalid.");
}

export function compareExecutiveContextExportBundles(
  left: ExecutiveContextExportBundle,
  right: ExecutiveContextExportBundle
): ExecutiveContextExportComparison {
  const equal = left.fingerprint === right.fingerprint;
  return Object.freeze({
    equal,
    leftFingerprint: left.fingerprint,
    rightFingerprint: right.fingerprint,
    diagnostics: Object.freeze(equal ? [] : ["Executive context export bundle fingerprints differ."]),
  });
}
