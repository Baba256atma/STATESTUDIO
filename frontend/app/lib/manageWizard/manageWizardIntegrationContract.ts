/**
 * PHASE-2 / DS1:5 — Manage Wizard Integration contract.
 * Wizard session and IDSC-aligned bundle authoring — no UI, upload, or runtime logic.
 */

import {
  STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  STAGE_MINIMUM_OVERALL_SCORE,
  STAGE_SCORE_WEIGHTS,
} from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import type {
  ManageWizardConnectionMethod,
  ManageWizardDraftRecord,
  ManageWizardHandoffTarget,
  ManageWizardOwnershipContract,
  ManageWizardRequestBundle,
  ManageWizardScoreDimensions,
  ManageWizardSessionMetadata,
  ManageWizardSessionRecord,
  ManageWizardStepId,
  ManageWizardUserSelections,
  ManageWizardValidationIssue,
  ManageWizardValidationResult,
  ManageWizardWorkspaceId,
  WizardIdscAlignedRequest,
  WizardIdscConnectionProfile,
  WizardIdscConnectorType,
  WizardIdscFileDescriptor,
  WizardIdscRegistrationRequest,
  WizardIdscRequestBase,
  WizardIdscRequestMetadata,
  WizardIdscSourceDescriptor,
} from "./manageWizardIntegrationTypes.ts";

export const MANAGE_WIZARD_INTEGRATION_VERSION = "PHASE-2/DS1:5" as const;
export const MANAGE_WIZARD_INTEGRATION_SOURCE = "phase-2-manage-wizard-integration" as const;
export const WIZARD_IDSC_ALIGNMENT_SOURCE = "phase-2-input-data-source-center" as const;
export const WIZARD_IDSC_ALIGNMENT_VERSION = "PHASE-2/DS1:4" as const;
export const NEXORA_MANAGE_WIZARD_LOG_PREFIX = "[NexoraManageWizardIntegration]" as const;

export const MANAGE_WIZARD_INTEGRATION_TAGS = Object.freeze([
  "[DS15_MANAGE_WIZARD]",
  "[WIZARD_IDSC_INTEGRATION]",
  "[WORKSPACE_WIZARD_OWNED]",
  "[DS16_READY]",
] as const);

export const MANAGE_WIZARD_INTEGRATION_FREEZE_TAGS = Object.freeze([
  "[DS1_5_CERTIFIED]",
  "[MANAGE_WIZARD_INTEGRATION_FROZEN]",
  "[PHASE2_DS1_5_COMPLETE]",
] as const);

export const MANAGE_WIZARD_STEP_IDS = Object.freeze([
  "choose_source_type",
  "choose_connection_method",
  "enter_source_information",
  "review_configuration",
  "generate_request",
] as const satisfies readonly ManageWizardStepId[]);

export const MANAGE_WIZARD_LIFECYCLE_STATES = Object.freeze([
  "initiated",
  "in_progress",
  "draft_saved",
  "review_ready",
  "requests_generated",
  "handed_off",
  "cancelled",
] as const);

export const WIZARD_IDSC_CONNECTOR_TYPES = Object.freeze([
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
] as const satisfies readonly WizardIdscConnectorType[]);

export const WIZARD_CONNECTOR_INTAKE_MODES = Object.freeze({
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
} as const satisfies Readonly<Record<(typeof WIZARD_IDSC_CONNECTOR_TYPES)[number], ManageWizardConnectionMethod>>);

export const MANAGE_WIZARD_MUST_NOT_OWN = Object.freeze([
  "file_parsing",
  "upload_execution",
  "import_execution",
  "validation_execution",
  "synchronization",
  "registry_runtime",
  "business_knowledge",
  "ai_reasoning",
  "intelligence",
  "dashboard_rendering",
  "assistant_logic",
  "wizard_ui_rendering",
] as const);

export const MANAGE_WIZARD_FORBIDDEN_PATTERNS = Object.freeze([
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
  "inputDataSourceCenterContract.ts",
  "ParserEngine",
  "ImportEngine",
  "ValidationEngine",
  "SynchronizationEngine",
  ".tsx",
] as const);

export const MANAGE_WIZARD_INTEGRATION_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-2/DS1:5",
  title: "Manage Wizard Integration",
  goal: "Library-only contract for guided data source setup producing IDSC-aligned request bundles.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/manageWizard/manageWizardIntegrationTypes.ts",
    "frontend/app/lib/manageWizard/manageWizardIntegrationContract.ts",
    "frontend/app/lib/manageWizard/manageWizardIntegrationDiagnostics.ts",
    "frontend/app/lib/manageWizard/manageWizardIntegrationCertification.ts",
    "frontend/app/lib/manageWizard/manageWizardIntegrationCertification.test.ts",
    "docs/ds1-5-build-report.md",
    "docs/ds1-5-analysis-report.md",
    "docs/ds1-5-freeze-report.md",
  ]),
  forbiddenPatterns: MANAGE_WIZARD_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["DS1:1", "DS1:2", "DS1:3", "DS1:4", "STAGE-ARCH-3", "INT-5"]),
  runtimePath: "library-only" as const,
  tags: MANAGE_WIZARD_INTEGRATION_TAGS,
} satisfies StageManifest);

export const MANAGE_WIZARD_INTEGRATION_MODULE_PATHS = Object.freeze(
  MANAGE_WIZARD_INTEGRATION_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

const CONNECTOR_SET = new Set<string>(WIZARD_IDSC_CONNECTOR_TYPES);
const STEP_SET = new Set<string>(MANAGE_WIZARD_STEP_IDS);
const EXAMPLE_TS = "2026-06-22T00:00:00.000Z";
const EXAMPLE_WORKSPACE = "workspace-example-001";
const EXAMPLE_REQUESTER = "executive-manager-001";
const EXAMPLE_WIZARD_SESSION = "mwi-session-example-001";
const EXAMPLE_IDSC_SESSION = "idsc-session-example-001";

function issue(code: string, message: string): ManageWizardValidationIssue {
  return Object.freeze({ code, message });
}

export function computeManageWizardIntegrationOverallScore(dimensions: ManageWizardScoreDimensions): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsManageWizardIntegrationMinimumScore(overall: number): boolean {
  return overall >= STAGE_MINIMUM_OVERALL_SCORE;
}

export function resolveWizardConnectionMethodForConnector(
  connectorType: (typeof WIZARD_IDSC_CONNECTOR_TYPES)[number]
): ManageWizardConnectionMethod {
  return WIZARD_CONNECTOR_INTAKE_MODES[connectorType];
}

export function buildManageWizardOwnershipContract(
  record: Pick<ManageWizardSessionRecord, "wizardSessionId" | "workspaceId">
): ManageWizardOwnershipContract {
  return Object.freeze({
    wizardSessionId: record.wizardSessionId.trim(),
    workspaceId: record.workspaceId.trim(),
    isolationPolicy: "workspace-exclusive",
  });
}

function validateFileDescriptor(input: WizardIdscFileDescriptor | null | undefined): ManageWizardValidationIssue[] {
  const issues: ManageWizardValidationIssue[] = [];
  if (!input) return issues;
  if (!input.fileName?.trim()) issues.push(issue("missing_file_name", "fileDescriptor.fileName is required."));
  if ("fileContent" in (input as Record<string, unknown>)) {
    issues.push(issue("embedded_file_content", "fileDescriptor must not embed file content."));
  }
  return issues;
}

function validateConnectionProfile(
  input: WizardIdscConnectionProfile | null | undefined
): ManageWizardValidationIssue[] {
  const issues: ManageWizardValidationIssue[] = [];
  if (!input) return issues;
  if (!input.connectorProfileId?.trim()) {
    issues.push(issue("missing_connector_profile", "connectionProfile.connectorProfileId is required."));
  }
  for (const key of ["password", "apiKey", "secret", "token", "credentials"]) {
    if (key in (input as Record<string, unknown>)) {
      issues.push(issue("embedded_secret", `connectionProfile must not contain "${key}".`));
    }
  }
  return issues;
}

export function validateManageWizardSessionRecord(
  input: Partial<ManageWizardSessionRecord>
): ManageWizardValidationResult {
  const issues: ManageWizardValidationIssue[] = [];
  if (!input.wizardSessionId?.trim()) issues.push(issue("missing_session_id", "wizardSessionId is required."));
  if (!input.workspaceId?.trim()) issues.push(issue("missing_workspace_id", "workspaceId is required."));
  if (!input.inputCenterSessionId?.trim()) {
    issues.push(issue("missing_idsc_session", "inputCenterSessionId is required."));
  }
  if (!input.requestedBy?.trim()) issues.push(issue("missing_requested_by", "requestedBy is required."));
  if (!input.createdAt?.trim()) issues.push(issue("missing_created_at", "createdAt is required."));
  if (!input.updatedAt?.trim()) issues.push(issue("missing_updated_at", "updatedAt is required."));
  if (input.currentStep && !STEP_SET.has(input.currentStep)) {
    issues.push(issue("invalid_step", `Unsupported currentStep "${input.currentStep}".`));
  }
  if (!input.metadata) issues.push(issue("missing_metadata", "metadata is required."));
  if (input.source && input.source !== MANAGE_WIZARD_INTEGRATION_SOURCE) {
    issues.push(issue("invalid_source", "source must be phase-2-manage-wizard-integration."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateManageWizardUserSelections(
  input: Partial<ManageWizardUserSelections>
): ManageWizardValidationResult {
  const issues: ManageWizardValidationIssue[] = [];
  if (input.connectorType && !CONNECTOR_SET.has(input.connectorType)) {
    issues.push(issue("invalid_connector", `Unsupported connector "${input.connectorType}".`));
  }
  if (!input.displayName?.trim()) issues.push(issue("missing_display_name", "displayName is required."));
  issues.push(...validateFileDescriptor(input.fileDescriptor));
  issues.push(...validateConnectionProfile(input.connectionProfile));
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateWizardIdscAlignedRequest(
  input: Partial<WizardIdscAlignedRequest>
): ManageWizardValidationResult {
  const issues: ManageWizardValidationIssue[] = [];
  if (!input.requestId?.trim()) issues.push(issue("missing_request_id", "requestId is required."));
  if (!input.workspaceId?.trim()) issues.push(issue("missing_workspace_id", "workspaceId is required."));
  if (!input.requestedBy?.trim()) issues.push(issue("missing_requested_by", "requestedBy is required."));
  if (!input.createdAt?.trim()) issues.push(issue("missing_created_at", "createdAt is required."));
  if (!input.requestType) issues.push(issue("missing_request_type", "requestType is required."));
  if (!input.status) issues.push(issue("missing_status", "status is required."));
  if (!input.sourceDescriptor) issues.push(issue("missing_source_descriptor", "sourceDescriptor is required."));
  if (!input.metadata) issues.push(issue("missing_metadata", "metadata is required."));
  if (input.source !== WIZARD_IDSC_ALIGNMENT_SOURCE) {
    issues.push(issue("invalid_idsc_source", "IDSC-aligned request source must be phase-2-input-data-source-center."));
  }
  if (input.contractVersion !== WIZARD_IDSC_ALIGNMENT_VERSION) {
    issues.push(issue("invalid_idsc_version", "IDSC-aligned request contractVersion must be PHASE-2/DS1:4."));
  }
  if (input.sourceDescriptor) {
    if (!input.sourceDescriptor.displayName?.trim()) {
      issues.push(issue("missing_descriptor_name", "sourceDescriptor.displayName is required."));
    }
    issues.push(...validateFileDescriptor(input.sourceDescriptor.fileDescriptor));
    issues.push(...validateConnectionProfile(input.sourceDescriptor.connectionProfile));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateManageWizardDraftRecord(input: Partial<ManageWizardDraftRecord>): ManageWizardValidationResult {
  const issues = [
    ...validateManageWizardUserSelections(input.selections ?? {}).issues,
  ];
  if (!input.draftId?.trim()) issues.push(issue("missing_draft_id", "draftId is required."));
  if (!input.wizardSessionId?.trim()) issues.push(issue("missing_session_id", "wizardSessionId is required."));
  if (!input.workspaceId?.trim()) issues.push(issue("missing_workspace_id", "workspaceId is required."));
  if (!input.savedBy?.trim()) issues.push(issue("missing_saved_by", "savedBy is required."));
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateManageWizardRequestBundle(
  input: Partial<ManageWizardRequestBundle>
): ManageWizardValidationResult {
  const issues: ManageWizardValidationIssue[] = [];
  if (!input.bundleId?.trim()) issues.push(issue("missing_bundle_id", "bundleId is required."));
  if (!input.wizardSessionId?.trim()) issues.push(issue("missing_session_id", "wizardSessionId is required."));
  if (!input.workspaceId?.trim()) issues.push(issue("missing_workspace_id", "workspaceId is required."));
  if (!input.inputCenterSessionId?.trim()) {
    issues.push(issue("missing_idsc_session", "inputCenterSessionId is required."));
  }
  if (!input.registrationRequest) {
    issues.push(issue("missing_registration", "registrationRequest is required."));
  } else {
    issues.push(...validateWizardIdscAlignedRequest(input.registrationRequest).issues);
  }
  const hasUpload = input.uploadRequest !== null && input.uploadRequest !== undefined;
  const hasConnect = input.connectionRequest !== null && input.connectionRequest !== undefined;
  if (hasUpload && hasConnect) {
    issues.push(issue("dual_secondary", "Bundle cannot contain both upload and connection requests."));
  }
  if (input.uploadRequest) issues.push(...validateWizardIdscAlignedRequest(input.uploadRequest).issues);
  if (input.connectionRequest) issues.push(...validateWizardIdscAlignedRequest(input.connectionRequest).issues);
  if (input.importRequest) issues.push(...validateWizardIdscAlignedRequest(input.importRequest).issues);
  if (input.validationRequest) issues.push(...validateWizardIdscAlignedRequest(input.validationRequest).issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function idscMetadata(
  inputCenterSessionId: string,
  wizardSessionId: string,
  selections: ManageWizardUserSelections
): WizardIdscRequestMetadata {
  return Object.freeze({
    executiveCategoryHint: selections.executiveCategoryHint,
    knowledgeArtifactIds: selections.knowledgeArtifactIds,
    tags: Object.freeze(["wizard-generated", selections.connectorType]),
    inputCenterSessionId,
    wizardSessionId,
  });
}

function idscSourceDescriptor(selections: ManageWizardUserSelections): WizardIdscSourceDescriptor {
  return Object.freeze({
    connectorType: selections.connectorType,
    displayName: selections.displayName,
    description: selections.description,
    businessDataSourceId: null,
    adapterLinkId: null,
    fileDescriptor: selections.fileDescriptor,
    connectionProfile: selections.connectionProfile,
  });
}

function buildIdscRequestBase(input: {
  requestId: string;
  workspaceId: ManageWizardWorkspaceId;
  requestedBy: string;
  requestType: WizardIdscRequestBase["requestType"];
  selections: ManageWizardUserSelections;
  inputCenterSessionId: string;
  wizardSessionId: string;
}): WizardIdscRequestBase {
  return Object.freeze({
    contractVersion: WIZARD_IDSC_ALIGNMENT_VERSION,
    requestId: input.requestId,
    workspaceId: input.workspaceId,
    requestedBy: input.requestedBy,
    createdAt: EXAMPLE_TS,
    requestType: input.requestType,
    sourceDescriptor: idscSourceDescriptor(input.selections),
    status: "pending",
    metadata: idscMetadata(input.inputCenterSessionId, input.wizardSessionId, input.selections),
    source: WIZARD_IDSC_ALIGNMENT_SOURCE,
  });
}

export function buildManageWizardRequestBundle(input: {
  bundleId: string;
  wizardSessionId: string;
  workspaceId: ManageWizardWorkspaceId;
  inputCenterSessionId: string;
  requestedBy: string;
  selections: ManageWizardUserSelections;
}): ManageWizardRequestBundle {
  const { selections } = input;
  const registrationRequest: WizardIdscRegistrationRequest = Object.freeze({
    ...buildIdscRequestBase({
      requestId: `${input.bundleId}-register`,
      workspaceId: input.workspaceId,
      requestedBy: input.requestedBy,
      requestType: "register",
      selections,
      inputCenterSessionId: input.inputCenterSessionId,
      wizardSessionId: input.wizardSessionId,
    }),
    requestType: "register",
    registrationIntent: "initial",
  });

  const uploadRequest =
    selections.connectionMethod === "upload"
      ? Object.freeze({
          ...buildIdscRequestBase({
            requestId: `${input.bundleId}-upload`,
            workspaceId: input.workspaceId,
            requestedBy: input.requestedBy,
            requestType: "upload",
            selections,
            inputCenterSessionId: input.inputCenterSessionId,
            wizardSessionId: input.wizardSessionId,
          }),
          requestType: "upload" as const,
          uploadIntent: "initial" as const,
        })
      : null;

  const connectionRequest =
    selections.connectionMethod === "connection" || selections.connectionMethod === "extension"
      ? Object.freeze({
          ...buildIdscRequestBase({
            requestId: `${input.bundleId}-connect`,
            workspaceId: input.workspaceId,
            requestedBy: input.requestedBy,
            requestType: "connect",
            selections,
            inputCenterSessionId: input.inputCenterSessionId,
            wizardSessionId: input.wizardSessionId,
          }),
          requestType: "connect" as const,
          connectionIntent: "initial" as const,
        })
      : null;

  const importRequest = selections.includeImportRequest
    ? Object.freeze({
        ...buildIdscRequestBase({
          requestId: `${input.bundleId}-import`,
          workspaceId: input.workspaceId,
          requestedBy: input.requestedBy,
          requestType: "import",
          selections,
          inputCenterSessionId: input.inputCenterSessionId,
          wizardSessionId: input.wizardSessionId,
        }),
        requestType: "import" as const,
        importMode: "full" as const,
        targetScope: "records" as const,
        priority: "normal" as const,
      })
    : null;

  const validationRequest = selections.includeValidationRequest
    ? Object.freeze({
        ...buildIdscRequestBase({
          requestId: `${input.bundleId}-validate`,
          workspaceId: input.workspaceId,
          requestedBy: input.requestedBy,
          requestType: "validate",
          selections,
          inputCenterSessionId: input.inputCenterSessionId,
          wizardSessionId: input.wizardSessionId,
        }),
        requestType: "validate" as const,
        validationScope: "schema" as const,
        validationIntent: "pre_import" as const,
      })
    : null;

  const handoffTargets: ManageWizardHandoffTarget[] = [
    Object.freeze({
      target: "orchestrator",
      requestType: "register",
      requestId: registrationRequest.requestId,
      wizardSessionId: input.wizardSessionId,
      inputCenterSessionId: input.inputCenterSessionId,
      handoffIntent: "dispatch_registration",
    }),
  ];

  if (importRequest) {
    handoffTargets.push(
      Object.freeze({
        target: "import_engine",
        requestType: "import",
        requestId: importRequest.requestId,
        wizardSessionId: input.wizardSessionId,
        inputCenterSessionId: input.inputCenterSessionId,
        handoffIntent: importRequest.importMode,
      })
    );
  }
  if (validationRequest) {
    handoffTargets.push(
      Object.freeze({
        target: "validation_engine",
        requestType: "validate",
        requestId: validationRequest.requestId,
        wizardSessionId: input.wizardSessionId,
        inputCenterSessionId: input.inputCenterSessionId,
        handoffIntent: validationRequest.validationIntent,
      })
    );
  }

  return Object.freeze({
    bundleId: input.bundleId,
    wizardSessionId: input.wizardSessionId,
    workspaceId: input.workspaceId,
    inputCenterSessionId: input.inputCenterSessionId,
    generatedAt: EXAMPLE_TS,
    registrationRequest,
    uploadRequest,
    connectionRequest,
    importRequest,
    validationRequest,
    handoffTargets: Object.freeze(handoffTargets),
    source: MANAGE_WIZARD_INTEGRATION_SOURCE,
  });
}

function exampleSessionMetadata(): ManageWizardSessionMetadata {
  return Object.freeze({
    tags: Object.freeze(["example", "ds1-5"]),
    knowledgeArtifactIds: Object.freeze(["bkl-example-process"]),
  });
}

export function resolveManageWizardSessionExample(): ManageWizardSessionRecord {
  return Object.freeze({
    contractVersion: MANAGE_WIZARD_INTEGRATION_VERSION,
    wizardSessionId: EXAMPLE_WIZARD_SESSION,
    workspaceId: EXAMPLE_WORKSPACE,
    inputCenterSessionId: EXAMPLE_IDSC_SESSION,
    currentStep: "choose_source_type",
    lifecycleState: "initiated",
    createdAt: EXAMPLE_TS,
    updatedAt: EXAMPLE_TS,
    requestedBy: EXAMPLE_REQUESTER,
    metadata: exampleSessionMetadata(),
    source: MANAGE_WIZARD_INTEGRATION_SOURCE,
  });
}

export function resolveManageWizardUserSelectionsExample(
  connectorType: (typeof WIZARD_IDSC_CONNECTOR_TYPES)[number] = "csv"
): ManageWizardUserSelections {
  const connectionMethod = WIZARD_CONNECTOR_INTAKE_MODES[connectorType];
  return Object.freeze({
    connectorType,
    connectionMethod,
    displayName: `Example ${connectorType} source`,
    description: `DS1:5 example wizard selection for ${connectorType}.`,
    executiveCategoryHint: "operational",
    knowledgeArtifactIds: Object.freeze(["bkl-example-process"]),
    fileDescriptor:
      connectionMethod === "upload"
        ? Object.freeze({
            fileName: `example.${connectorType === "excel" ? "xlsx" : connectorType}`,
            mimeType: null,
            byteSizeEstimate: 2048,
            checksumHint: null,
          })
        : null,
    connectionProfile:
      connectionMethod === "connection" || connectionMethod === "extension"
        ? Object.freeze({
            connectorProfileId: "connector-profile-example-001",
            endpointHint: "https://api.example.com/v1",
            authMethod: "api_key",
          })
        : null,
    includeImportRequest: connectionMethod !== "manual",
    includeValidationRequest: true,
  });
}

export function resolveManageWizardDraftExample(): ManageWizardDraftRecord {
  return Object.freeze({
    draftId: "mwi-draft-example-001",
    wizardSessionId: EXAMPLE_WIZARD_SESSION,
    workspaceId: EXAMPLE_WORKSPACE,
    lifecycleState: "draft_saved",
    currentStep: "enter_source_information",
    selections: resolveManageWizardUserSelectionsExample("csv"),
    savedAt: EXAMPLE_TS,
    savedBy: EXAMPLE_REQUESTER,
    source: MANAGE_WIZARD_INTEGRATION_SOURCE,
  });
}

export function resolveManageWizardRequestBundleExample(): ManageWizardRequestBundle {
  return buildManageWizardRequestBundle({
    bundleId: "mwi-bundle-example-001",
    wizardSessionId: EXAMPLE_WIZARD_SESSION,
    workspaceId: EXAMPLE_WORKSPACE,
    inputCenterSessionId: EXAMPLE_IDSC_SESSION,
    requestedBy: EXAMPLE_REQUESTER,
    selections: resolveManageWizardUserSelectionsExample("csv"),
  });
}
