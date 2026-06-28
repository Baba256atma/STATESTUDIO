import assert from "node:assert/strict";
import test from "node:test";

import { runBusinessKnowledgeLayerAnalysis } from "../businessKnowledge/businessKnowledgeLayerCertification.ts";
import { runExecutiveBusinessDataSourceAnalysis } from "../datasource/executiveBusinessDataSourceCertification.ts";
import { runWorkspaceRegistryAdapterAnalysis } from "../datasource/workspaceDataSourceRegistryAdapterCertification.ts";
import { runInputDataSourceCenterAnalysis } from "../inputCenter/inputDataSourceCenterCertification.ts";
import {
  MANAGE_WIZARD_FORBIDDEN_PATTERNS,
  MANAGE_WIZARD_INTEGRATION_FREEZE_TAGS,
  MANAGE_WIZARD_INTEGRATION_SELF_MANIFEST,
  MANAGE_WIZARD_INTEGRATION_TAGS,
  MANAGE_WIZARD_INTEGRATION_VERSION,
  MANAGE_WIZARD_MUST_NOT_OWN,
  MANAGE_WIZARD_STEP_IDS,
  WIZARD_CONNECTOR_INTAKE_MODES,
  WIZARD_IDSC_ALIGNMENT_SOURCE,
  WIZARD_IDSC_CONNECTOR_TYPES,
  buildManageWizardOwnershipContract,
  buildManageWizardRequestBundle,
  computeManageWizardIntegrationOverallScore,
  meetsManageWizardIntegrationMinimumScore,
  resolveManageWizardDraftExample,
  resolveManageWizardRequestBundleExample,
  resolveManageWizardSessionExample,
  resolveManageWizardUserSelectionsExample,
  validateManageWizardDraftRecord,
  validateManageWizardRequestBundle,
  validateManageWizardSessionRecord,
  validateManageWizardUserSelections,
  validateWizardIdscAlignedRequest,
} from "./manageWizardIntegrationContract.ts";
import {
  isManageWizardIntegrationFrozen,
  resetManageWizardIntegrationFreezeForTests,
  runManageWizardIntegrationAnalysis,
  runManageWizardIntegrationCertification,
} from "./manageWizardIntegrationCertification.ts";
import {
  getManageWizardDiagnosticsLog,
  getManageWizardEvents,
  recordManageWizardEvent,
  resetManageWizardDiagnosticsForTests,
} from "./manageWizardIntegrationDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { STAGE_MINIMUM_OVERALL_SCORE } from "../stage/stageArchitectureContract.ts";

test.beforeEach(() => {
  resetManageWizardDiagnosticsForTests();
  resetManageWizardIntegrationFreezeForTests();
  runExecutiveBusinessDataSourceAnalysis();
  runWorkspaceRegistryAdapterAnalysis();
  runBusinessKnowledgeLayerAnalysis();
  runInputDataSourceCenterAnalysis();
});

test("exports manage wizard integration version, steps, and tags", () => {
  assert.equal(MANAGE_WIZARD_INTEGRATION_VERSION, "PHASE-2/DS1:5");
  assert.equal(MANAGE_WIZARD_STEP_IDS.length, 5);
  assert.equal(WIZARD_IDSC_CONNECTOR_TYPES.length, 10);
  assert.ok(MANAGE_WIZARD_INTEGRATION_TAGS.includes("[DS15_MANAGE_WIZARD]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(MANAGE_WIZARD_INTEGRATION_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/inputCenter/inputDataSourceCenterContract.ts",
    "frontend/app/lib/parser/ParserEngine.ts",
    "frontend/app/components/panels/SourceControlPanel.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: MANAGE_WIZARD_INTEGRATION_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: MANAGE_WIZARD_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates wizard session with mandatory fields", () => {
  const session = resolveManageWizardSessionExample();
  assert.equal(validateManageWizardSessionRecord(session).valid, true);
  assert.ok(session.wizardSessionId.length > 0);
  assert.ok(session.inputCenterSessionId.length > 0);
  assert.ok(session.requestedBy.length > 0);
  const ownership = buildManageWizardOwnershipContract(session);
  assert.equal(ownership.isolationPolicy, "workspace-exclusive");
});

test("maps connector types to connection methods", () => {
  assert.equal(WIZARD_CONNECTOR_INTAKE_MODES.csv, "upload");
  assert.equal(WIZARD_CONNECTOR_INTAKE_MODES.rest_api, "connection");
  assert.equal(WIZARD_CONNECTOR_INTAKE_MODES.manual_entry, "manual");
});

test("builds IDSC-aligned request bundle for upload path", () => {
  const bundle = buildManageWizardRequestBundle({
    bundleId: "mwi-test-bundle",
    wizardSessionId: "mwi-session-001",
    workspaceId: "workspace-001",
    inputCenterSessionId: "idsc-session-001",
    requestedBy: "manager-001",
    selections: resolveManageWizardUserSelectionsExample("csv"),
  });
  assert.equal(validateManageWizardRequestBundle(bundle).valid, true);
  assert.equal(bundle.registrationRequest.source, WIZARD_IDSC_ALIGNMENT_SOURCE);
  assert.ok(bundle.uploadRequest !== null);
  assert.equal(bundle.connectionRequest, null);
  assert.ok(bundle.importRequest !== null);
  assert.ok(bundle.validationRequest !== null);
  assert.ok(bundle.handoffTargets.length >= 2);
});

test("builds bundle for manual entry without upload or connection", () => {
  const bundle = buildManageWizardRequestBundle({
    bundleId: "mwi-manual-bundle",
    wizardSessionId: "mwi-session-002",
    workspaceId: "workspace-001",
    inputCenterSessionId: "idsc-session-002",
    requestedBy: "manager-001",
    selections: resolveManageWizardUserSelectionsExample("manual_entry"),
  });
  assert.equal(bundle.uploadRequest, null);
  assert.equal(bundle.connectionRequest, null);
  assert.equal(validateWizardIdscAlignedRequest(bundle.registrationRequest).valid, true);
});

test("rejects draft with embedded file content in selections", () => {
  const draft = resolveManageWizardDraftExample();
  const invalidDraft = Object.freeze({
    ...draft,
    selections: Object.freeze({
      ...draft.selections,
      fileDescriptor: Object.freeze({
        fileName: "data.csv",
        mimeType: "text/csv",
        byteSizeEstimate: 100,
        checksumHint: null,
        fileContent: "a,b,c",
      }),
    }),
  });
  assert.equal(validateManageWizardUserSelections(invalidDraft.selections).valid, false);
});

test("validates draft example without embedded content", () => {
  assert.equal(validateManageWizardDraftRecord(resolveManageWizardDraftExample()).valid, true);
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(MANAGE_WIZARD_MUST_NOT_OWN.includes("upload_execution"));
  assert.ok(MANAGE_WIZARD_MUST_NOT_OWN.includes("wizard_ui_rendering"));
  assert.ok(MANAGE_WIZARD_MUST_NOT_OWN.includes("file_parsing"));
});

test("records manage wizard diagnostic lifecycle events", () => {
  recordManageWizardEvent({
    type: "WizardSessionCreated",
    wizardSessionId: "mwi-session-001",
    workspaceId: "workspace-001",
  });
  recordManageWizardEvent({ type: "WizardStepChanged", wizardSessionId: "mwi-session-001" });
  assert.equal(getManageWizardEvents().length, 2);
});

test("computeManageWizardIntegrationOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeManageWizardIntegrationOverallScore({
    architecture: 97,
    maintainability: 97,
    regressionSafety: 98,
    scalability: 95,
    certificationReadiness: 98,
  });
  assert.ok(overall >= STAGE_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsManageWizardIntegrationMinimumScore(overall), true);
});

test("manage wizard integration certification passes all gates", () => {
  const result = runManageWizardIntegrationCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= STAGE_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.ok(getManageWizardDiagnosticsLog().length > 0);
  assert.equal(resolveManageWizardRequestBundleExample().registrationRequest.requestType, "register");
});

test("manage wizard integration analysis freezes contract on pass", () => {
  const result = runManageWizardIntegrationAnalysis();
  assert.equal(result.certified, true);
  assert.equal(isManageWizardIntegrationFrozen(), true);
  assert.ok(result.scoreReport.overall >= STAGE_MINIMUM_OVERALL_SCORE);
  for (const tag of MANAGE_WIZARD_INTEGRATION_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag));
  }
});
