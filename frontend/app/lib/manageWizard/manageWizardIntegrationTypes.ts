/**
 * PHASE-2 / DS1:5 — Manage Wizard Integration types.
 * Wizard session and IDSC-aligned bundle shapes only — no UI or runtime logic.
 */

export type ManageWizardWorkspaceId = string;

/** DS1:4-aligned connector enum — parallel definition, not a replacement. */
export type WizardIdscConnectorType =
  | "csv"
  | "excel"
  | "pdf"
  | "json"
  | "xml"
  | "database"
  | "rest_api"
  | "graphql_api"
  | "manual_entry"
  | "future_connector";

export type ManageWizardConnectionMethod = "upload" | "connection" | "manual" | "extension";

export type ManageWizardStepId =
  | "choose_source_type"
  | "choose_connection_method"
  | "enter_source_information"
  | "review_configuration"
  | "generate_request";

export type ManageWizardLifecycleState =
  | "initiated"
  | "in_progress"
  | "draft_saved"
  | "review_ready"
  | "requests_generated"
  | "handed_off"
  | "cancelled";

export type WizardIdscRequestType = "register" | "upload" | "connect" | "import" | "validate";

export type WizardIdscRequestStatus =
  | "draft"
  | "pending"
  | "queued"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "failed";

export type WizardIdscAuthMethod = "none" | "api_key" | "oauth" | "basic" | "custom";

export type ManageWizardExtensionPoint = Readonly<{
  wizardProfileId?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type ManageWizardSessionMetadata = Readonly<{
  tags?: readonly string[];
  knowledgeArtifactIds?: readonly string[];
  extension?: ManageWizardExtensionPoint;
}>;

export type ManageWizardSessionRecord = Readonly<{
  contractVersion: string;
  wizardSessionId: string;
  workspaceId: ManageWizardWorkspaceId;
  inputCenterSessionId: string;
  currentStep: ManageWizardStepId;
  lifecycleState: ManageWizardLifecycleState;
  createdAt: string;
  updatedAt: string;
  requestedBy: string;
  metadata: ManageWizardSessionMetadata;
  source: "phase-2-manage-wizard-integration";
}>;

export type WizardIdscFileDescriptor = Readonly<{
  fileName: string;
  mimeType: string | null;
  byteSizeEstimate: number | null;
  checksumHint: string | null;
}>;

export type WizardIdscConnectionProfile = Readonly<{
  connectorProfileId: string;
  endpointHint: string | null;
  authMethod: WizardIdscAuthMethod;
}>;

export type WizardIdscSourceDescriptor = Readonly<{
  connectorType: WizardIdscConnectorType;
  displayName: string;
  description: string | null;
  businessDataSourceId: string | null;
  adapterLinkId: string | null;
  fileDescriptor: WizardIdscFileDescriptor | null;
  connectionProfile: WizardIdscConnectionProfile | null;
}>;

export type WizardIdscRequestMetadata = Readonly<{
  executiveCategoryHint?: string | null;
  knowledgeArtifactIds?: readonly string[];
  tags?: readonly string[];
  inputCenterSessionId?: string | null;
  wizardSessionId?: string | null;
  extension?: Readonly<{ connectorProfileId?: string | null; futureExtension?: Readonly<Record<string, unknown>> }>;
}>;

/** Structurally aligned with DS1:4 InputDataSourceRequestBase — consumed by orchestrator, not a replacement. */
export type WizardIdscRequestBase = Readonly<{
  contractVersion: string;
  requestId: string;
  workspaceId: ManageWizardWorkspaceId;
  requestedBy: string;
  createdAt: string;
  requestType: WizardIdscRequestType;
  sourceDescriptor: WizardIdscSourceDescriptor;
  status: WizardIdscRequestStatus;
  metadata: WizardIdscRequestMetadata;
  source: "phase-2-input-data-source-center";
}>;

export type WizardIdscRegistrationRequest = WizardIdscRequestBase &
  Readonly<{ requestType: "register"; registrationIntent: "initial" | "update" }>;

export type WizardIdscUploadRequest = WizardIdscRequestBase &
  Readonly<{ requestType: "upload"; uploadIntent: "initial" | "replace" | "append" }>;

export type WizardIdscConnectionRequest = WizardIdscRequestBase &
  Readonly<{ requestType: "connect"; connectionIntent: "initial" | "reconnect" | "test_only" }>;

export type WizardIdscImportRequest = WizardIdscRequestBase &
  Readonly<{
    requestType: "import";
    importMode: "full" | "incremental" | "preview";
    targetScope: "records" | "schema_only" | "metadata_only";
    priority: "normal" | "high";
  }>;

export type WizardIdscValidationRequest = WizardIdscRequestBase &
  Readonly<{
    requestType: "validate";
    validationScope: "schema" | "connectivity" | "sample_records" | "full";
    validationIntent: "pre_import" | "post_import" | "health_check";
  }>;

export type WizardIdscAlignedRequest =
  | WizardIdscRegistrationRequest
  | WizardIdscUploadRequest
  | WizardIdscConnectionRequest
  | WizardIdscImportRequest
  | WizardIdscValidationRequest;

export type ManageWizardUserSelections = Readonly<{
  connectorType: WizardIdscConnectorType;
  connectionMethod: ManageWizardConnectionMethod;
  displayName: string;
  description: string | null;
  executiveCategoryHint: string | null;
  knowledgeArtifactIds: readonly string[];
  fileDescriptor: WizardIdscFileDescriptor | null;
  connectionProfile: WizardIdscConnectionProfile | null;
  includeImportRequest: boolean;
  includeValidationRequest: boolean;
}>;

export type ManageWizardDraftRecord = Readonly<{
  draftId: string;
  wizardSessionId: string;
  workspaceId: ManageWizardWorkspaceId;
  lifecycleState: "draft_saved";
  currentStep: ManageWizardStepId;
  selections: ManageWizardUserSelections;
  savedAt: string;
  savedBy: string;
  source: "phase-2-manage-wizard-integration";
}>;

export type ManageWizardHandoffTarget = Readonly<{
  target: "import_engine" | "validation_engine" | "orchestrator";
  requestType: WizardIdscRequestType;
  requestId: string;
  wizardSessionId: string;
  inputCenterSessionId: string;
  handoffIntent: string;
}>;

export type ManageWizardRequestBundle = Readonly<{
  bundleId: string;
  wizardSessionId: string;
  workspaceId: ManageWizardWorkspaceId;
  inputCenterSessionId: string;
  generatedAt: string;
  registrationRequest: WizardIdscRegistrationRequest;
  uploadRequest: WizardIdscUploadRequest | null;
  connectionRequest: WizardIdscConnectionRequest | null;
  importRequest: WizardIdscImportRequest | null;
  validationRequest: WizardIdscValidationRequest | null;
  handoffTargets: readonly ManageWizardHandoffTarget[];
  source: "phase-2-manage-wizard-integration";
}>;

export type ManageWizardOwnershipContract = Readonly<{
  wizardSessionId: string;
  workspaceId: ManageWizardWorkspaceId;
  isolationPolicy: "workspace-exclusive";
}>;

export type ManageWizardValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ManageWizardValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ManageWizardValidationIssue[];
}>;

export type ManageWizardScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type ManageWizardScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ManageWizardScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ManageWizardCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ManageWizardCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly ManageWizardCertificationCheck[];
  scoreReport: ManageWizardScoreReport;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type ManageWizardEventType =
  | "WizardSessionCreated"
  | "WizardStepChanged"
  | "WizardDraftUpdated"
  | "WizardBundleGenerated"
  | "WizardCancelled"
  | "WizardCompleted"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type ManageWizardEvent = Readonly<{
  type: ManageWizardEventType;
  wizardSessionId: string | null;
  workspaceId: ManageWizardWorkspaceId | null;
  timestamp: string;
}>;

export type ManageWizardDiagnosticEntry = Readonly<{
  wizardSessionId: string | null;
  workspaceId: ManageWizardWorkspaceId | null;
  event: ManageWizardEventType;
  message: string;
  generatedAt: string;
}>;
