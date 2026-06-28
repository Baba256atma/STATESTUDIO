import assert from "node:assert/strict";
import test from "node:test";

import { runBusinessKnowledgeLayerAnalysis } from "../businessKnowledge/businessKnowledgeLayerCertification.ts";
import { runExecutiveBusinessDataSourceAnalysis } from "../datasource/executiveBusinessDataSourceCertification.ts";
import { runWorkspaceRegistryAdapterAnalysis } from "../datasource/workspaceDataSourceRegistryAdapterCertification.ts";
import {
  INPUT_CENTER_CONNECTOR_INTAKE_MODES,
  INPUT_CENTER_CONNECTOR_TYPES,
  INPUT_CENTER_FORBIDDEN_PATTERNS,
  INPUT_CENTER_MUST_NOT_OWN,
  INPUT_CENTER_REQUEST_EXAMPLES,
  INPUT_CENTER_REQUEST_TYPES,
  INPUT_DATA_SOURCE_CENTER_FREEZE_TAGS,
  INPUT_DATA_SOURCE_CENTER_SELF_MANIFEST,
  INPUT_DATA_SOURCE_CENTER_TAGS,
  INPUT_DATA_SOURCE_CENTER_VERSION,
  buildInputCenterOwnershipContract,
  computeInputDataSourceCenterOverallScore,
  meetsInputDataSourceCenterMinimumScore,
  resolveConnectionRequestExample,
  resolveImportRequestExample,
  resolveSourceRegistrationRequestExample,
  resolveUploadRequestExample,
  resolveValidationRequestExample,
  validateInputCenterOwnership,
  validateInputCenterSourceDescriptor,
  validateInputDataSourceRequest,
} from "./inputDataSourceCenterContract.ts";
import {
  isInputDataSourceCenterFrozen,
  resetInputDataSourceCenterFreezeForTests,
  runInputDataSourceCenterAnalysis,
  runInputDataSourceCenterCertification,
} from "./inputDataSourceCenterCertification.ts";
import {
  getInputCenterDiagnosticsLog,
  getInputCenterEvents,
  recordInputCenterEvent,
  resetInputCenterDiagnosticsForTests,
} from "./inputDataSourceCenterDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { STAGE_MINIMUM_OVERALL_SCORE } from "../stage/stageArchitectureContract.ts";

test.beforeEach(() => {
  resetInputCenterDiagnosticsForTests();
  resetInputDataSourceCenterFreezeForTests();
  runExecutiveBusinessDataSourceAnalysis();
  runWorkspaceRegistryAdapterAnalysis();
  runBusinessKnowledgeLayerAnalysis();
});

test("exports input data source center version, connectors, and tags", () => {
  assert.equal(INPUT_DATA_SOURCE_CENTER_VERSION, "PHASE-2/DS1:4");
  assert.equal(INPUT_CENTER_CONNECTOR_TYPES.length, 10);
  assert.equal(INPUT_CENTER_REQUEST_TYPES.length, 5);
  assert.ok(INPUT_DATA_SOURCE_CENTER_TAGS.includes("[DS14_INPUT_CENTER]"));
});

test("validates self manifest and rejects forbidden engine paths", () => {
  const validation = validateStageManifest(INPUT_DATA_SOURCE_CENTER_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/parser/ParserEngine.ts",
    "frontend/app/lib/import/ImportEngine.ts",
    "frontend/app/lib/validation/ValidationEngine.ts",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: INPUT_DATA_SOURCE_CENTER_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: INPUT_CENTER_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("rejects registry runtime, frozen contracts, and scene paths", () => {
  for (const filePath of [
    "frontend/app/lib/data-sources/dataSourceRegistryRuntime.ts",
    "frontend/app/lib/workspace/workspaceDataSourceRegistry.ts",
    "frontend/app/lib/datasource/executiveBusinessDataSourceContract.ts",
    "frontend/app/lib/businessKnowledge/businessKnowledgeLayerContract.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: INPUT_DATA_SOURCE_CENTER_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: INPUT_CENTER_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates all five request examples with mandatory fields", () => {
  const examples = [
    resolveSourceRegistrationRequestExample(),
    resolveUploadRequestExample(),
    resolveConnectionRequestExample(),
    resolveImportRequestExample(),
    resolveValidationRequestExample(),
  ];

  for (const example of examples) {
    assert.equal(validateInputDataSourceRequest(example).valid, true, example.requestType);
    assert.ok(example.requestId.length > 0);
    assert.ok(example.workspaceId.length > 0);
    assert.ok(example.requestedBy.length > 0);
    assert.ok(example.createdAt.length > 0);
    assert.ok(example.sourceDescriptor.displayName.length > 0);
    assert.ok(example.status.length > 0);
    assert.ok(example.metadata !== undefined);
    const ownership = buildInputCenterOwnershipContract(example);
    assert.equal(ownership.isolationPolicy, "workspace-exclusive");
  }
});

test("maps connector types to intake modes", () => {
  assert.equal(INPUT_CENTER_CONNECTOR_INTAKE_MODES.csv, "upload");
  assert.equal(INPUT_CENTER_CONNECTOR_INTAKE_MODES.database, "connection");
  assert.equal(INPUT_CENTER_CONNECTOR_INTAKE_MODES.manual_entry, "manual");
  assert.equal(INPUT_CENTER_CONNECTOR_INTAKE_MODES.future_connector, "extension");
});

test("rejects upload descriptors with embedded file content", () => {
  const validation = validateInputCenterSourceDescriptor({
    connectorType: "csv",
    displayName: "Test",
    description: null,
    businessDataSourceId: null,
    adapterLinkId: null,
    fileDescriptor: Object.freeze({
      fileName: "data.csv",
      mimeType: "text/csv",
      byteSizeEstimate: 100,
      checksumHint: null,
      fileContent: "a,b,c",
    } as never),
    connectionProfile: null,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((entry) => entry.code === "embedded_file_content"));
});

test("rejects connection profiles with embedded secrets", () => {
  const validation = validateInputCenterSourceDescriptor({
    connectorType: "rest_api",
    displayName: "API",
    description: null,
    businessDataSourceId: null,
    adapterLinkId: null,
    fileDescriptor: null,
    connectionProfile: Object.freeze({
      connectorProfileId: "profile-001",
      endpointHint: "https://api.example.com",
      authMethod: "api_key",
      apiKey: "secret-key",
    } as never),
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((entry) => entry.code === "embedded_secret"));
});

test("rejects requests without workspace ownership", () => {
  const validation = validateInputCenterOwnership({
    record: { requestId: "idsc-001", workspaceId: "" },
    expectedWorkspaceId: "workspace-001",
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((entry) => entry.code === "missing_workspace_id"));
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(INPUT_CENTER_MUST_NOT_OWN.includes("file_parsing"));
  assert.ok(INPUT_CENTER_MUST_NOT_OWN.includes("import_execution"));
  assert.ok(INPUT_CENTER_MUST_NOT_OWN.includes("data_validation"));
  assert.ok(INPUT_CENTER_MUST_NOT_OWN.includes("synchronization"));
});

test("records input center diagnostic lifecycle events", () => {
  recordInputCenterEvent({
    type: "RequestCreated",
    requestId: "idsc-req-001",
    workspaceId: "workspace-001",
  });
  recordInputCenterEvent({ type: "RequestQueued", requestId: "idsc-req-001" });
  assert.equal(getInputCenterEvents().length, 2);
});

test("computeInputDataSourceCenterOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeInputDataSourceCenterOverallScore({
    architecture: 97,
    maintainability: 97,
    regressionSafety: 98,
    scalability: 95,
    certificationReadiness: 98,
  });
  assert.ok(overall >= STAGE_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsInputDataSourceCenterMinimumScore(overall), true);
});

test("input data source center certification passes all gates", () => {
  const result = runInputDataSourceCenterCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= STAGE_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.ok(getInputCenterDiagnosticsLog().length > 0);
  assert.equal(INPUT_CENTER_REQUEST_EXAMPLES.register.requestType, "register");
});

test("input data source center analysis freezes contract on pass", () => {
  const result = runInputDataSourceCenterAnalysis();
  assert.equal(result.certified, true);
  assert.equal(isInputDataSourceCenterFrozen(), true);
  assert.ok(result.scoreReport.overall >= STAGE_MINIMUM_OVERALL_SCORE);
  for (const tag of INPUT_DATA_SOURCE_CENTER_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag));
  }
});
