import { ExecutiveReasoningFoundation, type ExecutiveReasoningRegistry } from "./executiveReasoningIndex.ts";
import { ExecutiveReasoningQueryLayer } from "./executiveReasoningQueryIndex.ts";
import {
  buildExecutiveReasoningExportBundle,
  compareExecutiveReasoningExportBundles,
  validateExecutiveReasoningExportBundle,
} from "./executiveReasoningExport.ts";
import {
  listExecutiveReasoningRegressionApiCoverage,
  runExecutiveReasoningRegression,
} from "./executiveReasoningRegression.ts";
import type {
  ExecutiveReasoningCertificationDiagnostic,
  ExecutiveReasoningCertificationGate,
  ExecutiveReasoningCertificationResult,
} from "./executiveReasoningExportTypes.ts";

function gate(gateId: string, description: string, passed: boolean): ExecutiveReasoningCertificationGate {
  return Object.freeze({ gateId, description, passed });
}

function diagnosticFromGate(gateResult: ExecutiveReasoningCertificationGate): ExecutiveReasoningCertificationDiagnostic {
  return Object.freeze({
    code: gateResult.passed ? "certification_gate_passed" : "certification_gate_failed",
    message: gateResult.description,
    gateId: gateResult.gateId,
    severity: gateResult.passed ? "info" : "error",
  });
}

function publicApiCoverageValid(): boolean {
  const coverage = listExecutiveReasoningRegressionApiCoverage();
  return coverage.length > 0 && new Set(coverage).size === coverage.length;
}

export function runExecutiveReasoningCertification(
  registry: ExecutiveReasoningRegistry = ExecutiveReasoningFoundation.createExecutiveReasoningRegistry()
): ExecutiveReasoningCertificationResult {
  const bundle = buildExecutiveReasoningExportBundle(registry);
  const secondBundle = buildExecutiveReasoningExportBundle(registry);
  const snapshot = ExecutiveReasoningQueryLayer.buildExecutiveReasoningSnapshot(registry);
  const regression = runExecutiveReasoningRegression();
  const gates = Object.freeze([
    gate("app-reason-1-pass", "APP-REASON-1 foundation validates.", ExecutiveReasoningFoundation.validateExecutiveReasoningFoundation().valid),
    gate("app-reason-2-pass", "APP-REASON-2 query snapshot validates.", ExecutiveReasoningQueryLayer.validateExecutiveReasoningSnapshot(snapshot).valid),
    gate("manifest-valid", "Executive reasoning manifest validates.", ExecutiveReasoningFoundation.validateExecutiveReasoningManifest(bundle.reasoningManifest).valid),
    gate("snapshot-valid", "Executive reasoning snapshot validates.", bundle.validationMetadata.snapshotValidation.valid),
    gate("export-bundle-valid", "Executive reasoning export bundle validates.", validateExecutiveReasoningExportBundle(bundle).valid),
    gate("query-surface-valid", "Executive reasoning query surface is available.", ExecutiveReasoningQueryLayer.listExecutiveReasoningCapabilities().length > 0),
    gate("public-api-coverage-valid", "Executive reasoning public API coverage is unique.", publicApiCoverageValid()),
    gate("deterministic-reproducibility", "Executive reasoning export is deterministic.", compareExecutiveReasoningExportBundles(bundle, secondBundle).equal),
    gate("metadata-only-boundary", "Executive reasoning export remains metadata-only.", bundle.metadataOnly && !bundle.exportMetadata.runtimeBehavior && regression.metadataOnly),
    gate("immutable-registry", "Executive reasoning registry and export bundle are immutable.", Object.isFrozen(registry) && Object.isFrozen(bundle)),
  ]);
  const status = gates.every((entry) => entry.passed) ? "PASS" : "FAIL";

  return Object.freeze({
    status,
    gates,
    diagnostics: Object.freeze(gates.map(diagnosticFromGate)),
    exportBundle: bundle,
  });
}
