/**
 * PHASE-2 / DS1:4 — Input / Data Source Center types.
 * Request coordination shapes only — no parsing, import, sync, or runtime logic.
 */

export type InputCenterWorkspaceId = string;

export type InputCenterConnectorType =
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

export type InputCenterIntakeMode = "upload" | "connection" | "manual" | "extension";

export type InputDataSourceRequestType =
  | "register"
  | "upload"
  | "connect"
  | "import"
  | "validate";

export type InputDataSourceRequestStatus =
  | "draft"
  | "pending"
  | "queued"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "failed";

export type InputCenterAuthMethod = "none" | "api_key" | "oauth" | "basic" | "custom";

export type InputCenterSecurityClassification =
  | "public"
  | "internal"
  | "confidential"
  | "restricted";

export type InputCenterSecurityProfile = Readonly<{
  classification: InputCenterSecurityClassification;
  crossWorkspaceAccess: false;
}>;

export type InputCenterExtensionPoint = Readonly<{
  connectorProfileId?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type InputCenterFileDescriptor = Readonly<{
  fileName: string;
  mimeType: string | null;
  byteSizeEstimate: number | null;
  checksumHint: string | null;
}>;

export type InputCenterConnectionProfile = Readonly<{
  connectorProfileId: string;
  endpointHint: string | null;
  authMethod: InputCenterAuthMethod;
}>;

export type InputCenterSourceDescriptor = Readonly<{
  connectorType: InputCenterConnectorType;
  displayName: string;
  description: string | null;
  businessDataSourceId: string | null;
  adapterLinkId: string | null;
  fileDescriptor: InputCenterFileDescriptor | null;
  connectionProfile: InputCenterConnectionProfile | null;
}>;

export type InputCenterRequestMetadata = Readonly<{
  executiveCategoryHint?: string | null;
  knowledgeArtifactIds?: readonly string[];
  tags?: readonly string[];
  inputCenterSessionId?: string | null;
  extension?: InputCenterExtensionPoint;
}>;

export type InputDataSourceRequestBase = Readonly<{
  contractVersion: string;
  requestId: string;
  workspaceId: InputCenterWorkspaceId;
  requestedBy: string;
  createdAt: string;
  requestType: InputDataSourceRequestType;
  sourceDescriptor: InputCenterSourceDescriptor;
  status: InputDataSourceRequestStatus;
  metadata: InputCenterRequestMetadata;
  source: "phase-2-input-data-source-center";
}>;

export type SourceRegistrationRequest = InputDataSourceRequestBase &
  Readonly<{
    requestType: "register";
    registrationIntent: "initial" | "update";
  }>;

export type UploadRequest = InputDataSourceRequestBase &
  Readonly<{
    requestType: "upload";
    uploadIntent: "initial" | "replace" | "append";
  }>;

export type ConnectionRequest = InputDataSourceRequestBase &
  Readonly<{
    requestType: "connect";
    connectionIntent: "initial" | "reconnect" | "test_only";
  }>;

export type ImportRequest = InputDataSourceRequestBase &
  Readonly<{
    requestType: "import";
    importMode: "full" | "incremental" | "preview";
    targetScope: "records" | "schema_only" | "metadata_only";
    priority: "normal" | "high";
  }>;

export type ValidationRequest = InputDataSourceRequestBase &
  Readonly<{
    requestType: "validate";
    validationScope: "schema" | "connectivity" | "sample_records" | "full";
    validationIntent: "pre_import" | "post_import" | "health_check";
  }>;

export type InputDataSourceRequest =
  | SourceRegistrationRequest
  | UploadRequest
  | ConnectionRequest
  | ImportRequest
  | ValidationRequest;

export type InputCenterOwnershipContract = Readonly<{
  requestId: string;
  workspaceId: InputCenterWorkspaceId;
  isolationPolicy: "workspace-exclusive";
}>;

export type InputCenterValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type InputCenterValidationResult = Readonly<{
  valid: boolean;
  issues: readonly InputCenterValidationIssue[];
}>;

export type InputCenterScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type InputCenterScoreReport = Readonly<{
  contractVersion: string;
  dimensions: InputCenterScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type InputCenterCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type InputCenterCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly InputCenterCertificationCheck[];
  scoreReport: InputCenterScoreReport;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type InputCenterEventType =
  | "RequestCreated"
  | "RequestQueued"
  | "RequestUpdated"
  | "RequestCancelled"
  | "RequestCompleted"
  | "ConnectorSelected"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type InputCenterEvent = Readonly<{
  type: InputCenterEventType;
  requestId: string | null;
  workspaceId: InputCenterWorkspaceId | null;
  timestamp: string;
}>;

export type InputCenterDiagnosticEntry = Readonly<{
  requestId: string | null;
  workspaceId: InputCenterWorkspaceId | null;
  event: InputCenterEventType;
  message: string;
  generatedAt: string;
}>;
