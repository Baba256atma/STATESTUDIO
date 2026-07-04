import { ExecutiveContextBuilder } from "./executiveContextIndex.ts";
import { ExecutiveContextQueryLayer } from "./executiveContextQueryIndex.ts";
import {
  buildExecutiveContextExportBundle,
  compareExecutiveContextExportBundles,
  validateExecutiveContextExportBundle,
} from "./executiveContextExport.ts";
import {
  listExecutiveContextRegressionApiCoverage,
  runExecutiveContextRegression,
} from "./executiveContextRegression.ts";
import type {
  ExecutiveContextCertificationDiagnostic,
  ExecutiveContextCertificationGate,
  ExecutiveContextCertificationResult,
} from "./executiveContextExportTypes.ts";

function gate(gateId: string, description: string, passed: boolean): ExecutiveContextCertificationGate {
  return Object.freeze({ gateId, description, passed });
}

function diagnosticFromGate(gateResult: ExecutiveContextCertificationGate): ExecutiveContextCertificationDiagnostic {
  return Object.freeze({
    code: gateResult.passed ? "certification_gate_passed" : "certification_gate_failed",
    message: gateResult.description,
    gateId: gateResult.gateId,
    severity: gateResult.passed ? "info" : "error",
  });
}

function publicApiRegistryValid(): boolean {
  const coverage = listExecutiveContextRegressionApiCoverage();
  return coverage.length > 0 && new Set(coverage).size === coverage.length;
}

export function runExecutiveContextCertification(): ExecutiveContextCertificationResult {
  const context = ExecutiveContextBuilder.createExecutiveContext();
  const bundle = buildExecutiveContextExportBundle(context);
  const secondBundle = buildExecutiveContextExportBundle(context);
  const snapshot = ExecutiveContextQueryLayer.buildExecutiveContextSnapshot(context);
  const regression = runExecutiveContextRegression();
  const gates = Object.freeze([
    gate("app-ctx-1-pass", "APP-CTX-1 builder context validates.", ExecutiveContextBuilder.isExecutiveContextValid(context)),
    gate("app-ctx-2-pass", "APP-CTX-2 query snapshot validates.", ExecutiveContextQueryLayer.validateExecutiveContextSnapshot(snapshot).valid),
    gate("manifest-valid", "Executive context manifest validates.", ExecutiveContextBuilder.validateExecutiveContextManifest(bundle.contextManifest).valid),
    gate("snapshot-valid", "Executive context snapshot validates.", bundle.validationMetadata.snapshotValidation.valid),
    gate("export-bundle-valid", "Executive context export bundle validates.", validateExecutiveContextExportBundle(bundle).valid),
    gate("query-surface-valid", "Executive context query surface is available.", ExecutiveContextQueryLayer.listExecutiveContextSections().length > 0),
    gate("public-api-registry-valid", "Executive context public API registry is unique.", publicApiRegistryValid()),
    gate("deterministic-reproducibility", "Executive context export is deterministic.", compareExecutiveContextExportBundles(bundle, secondBundle).equal),
    gate("metadata-only-boundary", "Executive context export remains metadata-only.", bundle.metadataOnly && !bundle.exportMetadata.runtimeBehavior && regression.metadataOnly),
    gate("immutable-context", "Executive context and export bundle are immutable.", Object.isFrozen(context) && Object.isFrozen(bundle)),
  ]);
  const status = gates.every((entry) => entry.passed) ? "PASS" : "FAIL";

  return Object.freeze({
    status,
    gates,
    diagnostics: Object.freeze(gates.map(diagnosticFromGate)),
    exportBundle: bundle,
  });
}
