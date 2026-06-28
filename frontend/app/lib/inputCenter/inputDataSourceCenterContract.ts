/**
 * PHASE-2 / DS1:4 — Input / Data Source Center contract.
 * Request coordination only — no parsing, import, validation, sync, or registry logic.
 */

import {
  STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  STAGE_MINIMUM_OVERALL_SCORE,
  STAGE_SCORE_WEIGHTS,
} from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import type {
  ConnectionRequest,
  ImportRequest,
  InputCenterConnectionProfile,
  InputCenterFileDescriptor,
  InputCenterIntakeMode,
  InputCenterOwnershipContract,
  InputCenterRequestMetadata,
  InputCenterScoreDimensions,
  InputCenterSecurityProfile,
  InputCenterSourceDescriptor,
  InputCenterValidationIssue,
  InputCenterValidationResult,
  InputCenterWorkspaceId,
  InputDataSourceRequest,
  InputDataSourceRequestBase,
  InputDataSourceRequestStatus,
  InputDataSourceRequestType,
  SourceRegistrationRequest,
  UploadRequest,
  ValidationRequest,
} from "./inputDataSourceCenterTypes.ts";

export const INPUT_DATA_SOURCE_CENTER_VERSION = "PHASE-2/DS1:4" as const;
export const INPUT_DATA_SOURCE_CENTER_SOURCE = "phase-2-input-data-source-center" as const;
export const NEXORA_INPUT_DATA_SOURCE_CENTER_LOG_PREFIX = "[NexoraInputDataSourceCenter]" as const;

export const INPUT_DATA_SOURCE_CENTER_TAGS = Object.freeze([
  "[DS14_INPUT_CENTER]",
  "[EXECUTIVE_DATA_INTAKE]",
  "[WORKSPACE_SOURCE_COORDINATION]",
  "[DS15_READY]",
] as const);

export const INPUT_DATA_SOURCE_CENTER_FREEZE_TAGS = Object.freeze([
  "[DS1_4_CERTIFIED]",
  "[INPUT_DATASOURCE_CENTER_FROZEN]",
  "[PHASE2_DS1_4_COMPLETE]",
] as const);

export const INPUT_CENTER_CONNECTOR_TYPES = Object.freeze([
  "csv",
  "excel",
  "pdf",
  "json",
  "xml",
  "database",
  "rest_api",
  "graphql_api",
  "manual_entry",
  "future_connector",
] as const);

export const INPUT_CENTER_REQUEST_TYPES = Object.freeze([
  "register",
  "upload",
  "connect",
  "import",
  "validate",
] as const satisfies readonly InputDataSourceRequestType[]);

export const INPUT_CENTER_REQUEST_STATUSES = Object.freeze([
  "draft",
  "pending",
  "queued",
  "in_progress",
  "completed",
  "cancelled",
  "failed",
] as const satisfies readonly InputDataSourceRequestStatus[]);

export const INPUT_CENTER_CONNECTOR_INTAKE_MODES = Object.freeze({
  csv: "upload",
  excel: "upload",
  pdf: "upload",
  json: "upload",
  xml: "upload",
  database: "connection",
  rest_api: "connection",
  graphql_api: "connection",
  manual_entry: "manual",
  future_connector: "extension",
} as const satisfies Readonly<Record<(typeof INPUT_CENTER_CONNECTOR_TYPES)[number], InputCenterIntakeMode>>);

export const INPUT_CENTER_EBDS_CATEGORY_HINTS = Object.freeze({
  csv: "operational",
  excel: "operational",
  pdf: "document",
  json: "operational",
  xml: "operational",
  database: "operational",
  rest_api: "external_api",
  graphql_api: "external_api",
  manual_entry: "manual",
  future_connector: "custom",
} as const);

export const INPUT_CENTER_MUST_NOT_OWN = Object.freeze([
  "file_parsing",
  "database_drivers",
  "synchronization",
  "data_validation",
  "business_knowledge",
  "ai_reasoning",
  "intelligence",
  "dashboard_rendering",
  "assistant_logic",
  "registry_runtime",
  "import_execution",
  "wizard_ui",
] as const);

export const INPUT_CENTER_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "data-sources/",
  "dataSourceRegistryRuntime",
  "workspace/workspaceDataSourceRegistry.ts",
  "workspaceRegistryStore",
  "dashboardIntelligence/",
  "executiveIntelligencePlatform/",
  "workspaceKpiCalculationEngine",
  "workspaceRiskDetectionEngine",
  "workspaceScenarioSimulationEngine",
  "assistantRuntime",
  "RelationshipRenderer",
  "executiveBusinessDataSourceContract.ts",
  "workspaceDataSourceRegistryAdapterContract.ts",
  "businessKnowledgeLayerContract.ts",
  "ParserEngine",
  "ImportEngine",
  "ValidationEngine",
  "SynchronizationEngine",
] as const);

export const INPUT_CENTER_DEFAULT_SECURITY_PROFILE = Object.freeze({
  classification: "internal",
  crossWorkspaceAccess: false,
} satisfies InputCenterSecurityProfile);

export const INPUT_DATA_SOURCE_CENTER_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-2/DS1:4",
  title: "Input / Data Source Center",
  goal: "Library-only coordination contract for executive data source intake requests.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/inputCenter/inputDataSourceCenterTypes.ts",
    "frontend/app/lib/inputCenter/inputDataSourceCenterContract.ts",
    "frontend/app/lib/inputCenter/inputDataSourceCenterDiagnostics.ts",
    "frontend/app/lib/inputCenter/inputDataSourceCenterCertification.ts",
    "frontend/app/lib/inputCenter/inputDataSourceCenterCertification.test.ts",
    "docs/ds1-4-build-report.md",
    "docs/ds1-4-analysis-report.md",
    "docs/ds1-4-freeze-report.md",
  ]),
  forbiddenPatterns: INPUT_CENTER_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["DS1:1", "DS1:2", "DS1:3", "STAGE-ARCH-3", "INT-5"]),
  runtimePath: "library-only" as const,
  tags: INPUT_DATA_SOURCE_CENTER_TAGS,
} satisfies StageManifest);

export const INPUT_DATA_SOURCE_CENTER_MODULE_PATHS = Object.freeze(
  INPUT_DATA_SOURCE_CENTER_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

const CONNECTOR_SET = new Set<string>(INPUT_CENTER_CONNECTOR_TYPES);
const REQUEST_TYPE_SET = new Set<string>(INPUT_CENTER_REQUEST_TYPES);
const REQUEST_STATUS_SET = new Set<string>(INPUT_CENTER_REQUEST_STATUSES);
const EXAMPLE_TS = "2026-06-22T00:00:00.000Z";
const EXAMPLE_WORKSPACE = "workspace-example-001";
const EXAMPLE_REQUESTER = "executive-manager-001";
const EXAMPLE_SESSION = "idsc-session-example-001";
const EXAMPLE_BUSINESS_SOURCE = "ebds-example-operational";
const EXAMPLE_ADAPTER_LINK = "wra-example-operational";

function issue(code: string, message: string): InputCenterValidationIssue {
  return Object.freeze({ code, message });
}

export function computeInputDataSourceCenterOverallScore(dimensions: InputCenterScoreDimensions): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsInputDataSourceCenterMinimumScore(overall: number): boolean {
  return overall >= STAGE_MINIMUM_OVERALL_SCORE;
}

export function resolveInputCenterIntakeModeForConnector(
  connectorType: (typeof INPUT_CENTER_CONNECTOR_TYPES)[number]
): InputCenterIntakeMode {
  return INPUT_CENTER_CONNECTOR_INTAKE_MODES[connectorType];
}

export function buildInputCenterOwnershipContract(
  record: Pick<InputDataSourceRequestBase, "requestId" | "workspaceId">
): InputCenterOwnershipContract {
  return Object.freeze({
    requestId: record.requestId.trim(),
    workspaceId: record.workspaceId.trim(),
    isolationPolicy: "workspace-exclusive",
  });
}

function validateFileDescriptor(input: InputCenterFileDescriptor | null | undefined): InputCenterValidationIssue[] {
  const issues: InputCenterValidationIssue[] = [];
  if (!input) return issues;
  if (!input.fileName?.trim()) issues.push(issue("missing_file_name", "fileDescriptor.fileName is required."));
  if ("fileContent" in (input as Record<string, unknown>)) {
    issues.push(issue("embedded_file_content", "fileDescriptor must not embed file content."));
  }
  if ("base64Payload" in (input as Record<string, unknown>)) {
    issues.push(issue("embedded_file_content", "fileDescriptor must not embed base64 payload."));
  }
  return issues;
}

function validateConnectionProfile(
  input: InputCenterConnectionProfile | null | undefined
): InputCenterValidationIssue[] {
  const issues: InputCenterValidationIssue[] = [];
  if (!input) return issues;
  if (!input.connectorProfileId?.trim()) {
    issues.push(issue("missing_connector_profile", "connectionProfile.connectorProfileId is required."));
  }
  const forbiddenSecretKeys = ["password", "apiKey", "secret", "token", "credentials"];
  for (const key of forbiddenSecretKeys) {
    if (key in (input as Record<string, unknown>)) {
      issues.push(issue("embedded_secret", `connectionProfile must not contain "${key}".`));
    }
  }
  return issues;
}

export function validateInputCenterSourceDescriptor(
  input: Partial<InputCenterSourceDescriptor>
): InputCenterValidationResult {
  const issues: InputCenterValidationIssue[] = [];
  if (!input.displayName?.trim()) issues.push(issue("missing_display_name", "sourceDescriptor.displayName is required."));
  if (input.connectorType && !CONNECTOR_SET.has(input.connectorType)) {
    issues.push(issue("invalid_connector_type", `Unsupported connector "${input.connectorType}".`));
  }
  issues.push(...validateFileDescriptor(input.fileDescriptor));
  issues.push(...validateConnectionProfile(input.connectionProfile));
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateInputCenterOwnership(input: {
  record: Pick<InputDataSourceRequestBase, "requestId" | "workspaceId">;
  expectedWorkspaceId?: InputCenterWorkspaceId | null;
}): InputCenterValidationResult {
  const issues: InputCenterValidationIssue[] = [];
  const workspaceId = input.record.workspaceId?.trim() ?? "";
  const requestId = input.record.requestId?.trim() ?? "";
  if (!workspaceId) issues.push(issue("missing_workspace_id", "Request requires workspaceId."));
  if (!requestId) issues.push(issue("missing_request_id", "Request requires requestId."));
  if (input.expectedWorkspaceId?.trim() && workspaceId && input.expectedWorkspaceId.trim() !== workspaceId) {
    issues.push(issue("workspace_mismatch", "Request workspaceId does not match expected workspace."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateInputDataSourceRequestBase(
  input: Partial<InputDataSourceRequestBase>
): InputCenterValidationResult {
  const issues = [
    ...validateInputCenterOwnership({
      record: { requestId: input.requestId ?? "", workspaceId: input.workspaceId ?? "" },
    }).issues,
  ];
  if (!input.requestedBy?.trim()) issues.push(issue("missing_requested_by", "requestedBy is required."));
  if (!input.createdAt?.trim()) issues.push(issue("missing_created_at", "createdAt is required."));
  if (input.requestType && !REQUEST_TYPE_SET.has(input.requestType)) {
    issues.push(issue("invalid_request_type", `Unsupported requestType "${input.requestType}".`));
  }
  if (input.status && !REQUEST_STATUS_SET.has(input.status)) {
    issues.push(issue("invalid_status", `Unsupported status "${input.status}".`));
  }
  if (!input.sourceDescriptor) {
    issues.push(issue("missing_source_descriptor", "sourceDescriptor is required."));
  } else {
    issues.push(...validateInputCenterSourceDescriptor(input.sourceDescriptor).issues);
  }
  if (!input.metadata) {
    issues.push(issue("missing_metadata", "metadata is required."));
  }
  if (input.source && input.source !== INPUT_DATA_SOURCE_CENTER_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-2-input-data-source-center."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateInputDataSourceRequest(input: Partial<InputDataSourceRequest>): InputCenterValidationResult {
  const issues = [...validateInputDataSourceRequestBase(input).issues];
  if (input.requestType === "register" && !input.registrationIntent) {
    issues.push(issue("missing_registration_intent", "registrationIntent is required for register requests."));
  }
  if (input.requestType === "upload" && !input.uploadIntent) {
    issues.push(issue("missing_upload_intent", "uploadIntent is required for upload requests."));
  }
  if (input.requestType === "connect" && !input.connectionIntent) {
    issues.push(issue("missing_connection_intent", "connectionIntent is required for connect requests."));
  }
  if (input.requestType === "import") {
    if (!input.importMode) issues.push(issue("missing_import_mode", "importMode is required for import requests."));
    if (!input.targetScope) issues.push(issue("missing_target_scope", "targetScope is required for import requests."));
    if (!input.priority) issues.push(issue("missing_priority", "priority is required for import requests."));
  }
  if (input.requestType === "validate") {
    if (!input.validationScope) {
      issues.push(issue("missing_validation_scope", "validationScope is required for validate requests."));
    }
    if (!input.validationIntent) {
      issues.push(issue("missing_validation_intent", "validationIntent is required for validate requests."));
    }
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function exampleMetadata(sessionId: string = EXAMPLE_SESSION): InputCenterRequestMetadata {
  return Object.freeze({
    executiveCategoryHint: "operational",
    knowledgeArtifactIds: Object.freeze(["bkl-example-process"]),
    tags: Object.freeze(["example", "ds1-4"]),
    inputCenterSessionId: sessionId,
    extension: Object.freeze({ connectorProfileId: "connector-profile-example-001" }),
  });
}

function exampleSourceDescriptor(
  connectorType: (typeof INPUT_CENTER_CONNECTOR_TYPES)[number],
  overrides: Partial<InputCenterSourceDescriptor> = {}
): InputCenterSourceDescriptor {
  const intakeMode = INPUT_CENTER_CONNECTOR_INTAKE_MODES[connectorType];
  const fileDescriptor: InputCenterFileDescriptor | null =
    intakeMode === "upload"
      ? Object.freeze({
          fileName: `example.${connectorType === "excel" ? "xlsx" : connectorType}`,
          mimeType: null,
          byteSizeEstimate: 1024,
          checksumHint: null,
        })
      : null;
  const connectionProfile: InputCenterConnectionProfile | null =
    intakeMode === "connection"
      ? Object.freeze({
          connectorProfileId: "connector-profile-example-001",
          endpointHint: "https://api.example.com/v1",
          authMethod: "api_key",
        })
      : null;

  return Object.freeze({
    connectorType,
    displayName: `Example ${connectorType} source`,
    description: `DS1:4 example source descriptor for ${connectorType}.`,
    businessDataSourceId: EXAMPLE_BUSINESS_SOURCE,
    adapterLinkId: EXAMPLE_ADAPTER_LINK,
    fileDescriptor,
    connectionProfile,
    ...overrides,
  });
}

function buildExampleBase(
  requestId: string,
  requestType: InputDataSourceRequestType,
  connectorType: (typeof INPUT_CENTER_CONNECTOR_TYPES)[number],
  status: InputDataSourceRequestStatus = "pending"
): InputDataSourceRequestBase {
  return Object.freeze({
    contractVersion: INPUT_DATA_SOURCE_CENTER_VERSION,
    requestId,
    workspaceId: EXAMPLE_WORKSPACE,
    requestedBy: EXAMPLE_REQUESTER,
    createdAt: EXAMPLE_TS,
    requestType,
    sourceDescriptor: exampleSourceDescriptor(connectorType),
    status,
    metadata: exampleMetadata(),
    source: INPUT_DATA_SOURCE_CENTER_SOURCE,
  });
}

export function resolveSourceRegistrationRequestExample(
  connectorType: (typeof INPUT_CENTER_CONNECTOR_TYPES)[number] = "csv"
): SourceRegistrationRequest {
  return Object.freeze({
    ...buildExampleBase(`idsc-req-register-${connectorType}`, "register", connectorType),
    requestType: "register",
    registrationIntent: "initial",
  });
}

export function resolveUploadRequestExample(
  connectorType: "csv" | "excel" | "pdf" | "json" | "xml" = "csv"
): UploadRequest {
  return Object.freeze({
    ...buildExampleBase(`idsc-req-upload-${connectorType}`, "upload", connectorType),
    requestType: "upload",
    uploadIntent: "initial",
  });
}

export function resolveConnectionRequestExample(
  connectorType: "database" | "rest_api" | "graphql_api" | "future_connector" = "rest_api"
): ConnectionRequest {
  return Object.freeze({
    ...buildExampleBase(`idsc-req-connect-${connectorType}`, "connect", connectorType),
    requestType: "connect",
    connectionIntent: "initial",
  });
}

export function resolveImportRequestExample(): ImportRequest {
  return Object.freeze({
    ...buildExampleBase("idsc-req-import-001", "import", "csv"),
    requestType: "import",
    importMode: "full",
    targetScope: "records",
    priority: "normal",
  });
}

export function resolveValidationRequestExample(): ValidationRequest {
  return Object.freeze({
    ...buildExampleBase("idsc-req-validate-001", "validate", "csv"),
    requestType: "validate",
    validationScope: "schema",
    validationIntent: "pre_import",
  });
}

export const INPUT_CENTER_REQUEST_EXAMPLES = Object.freeze({
  register: resolveSourceRegistrationRequestExample("csv"),
  upload: resolveUploadRequestExample("csv"),
  connect: resolveConnectionRequestExample("rest_api"),
  import: resolveImportRequestExample(),
  validate: resolveValidationRequestExample(),
} as const);

export function resolveInputCenterRequestExample(
  requestType: InputDataSourceRequestType
): InputDataSourceRequest {
  switch (requestType) {
    case "register":
      return resolveSourceRegistrationRequestExample();
    case "upload":
      return resolveUploadRequestExample();
    case "connect":
      return resolveConnectionRequestExample();
    case "import":
      return resolveImportRequestExample();
    case "validate":
      return resolveValidationRequestExample();
  }
}
