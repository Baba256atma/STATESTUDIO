/**
 * PHASE-2 / DS1:1 — Executive Business Data Source types.
 * Semantic identity shapes only — no runtime, parsing, or registry logic.
 */

/** Opaque workspace reference — enforced at bridge stages, not via registry store. */
export type ExecutiveBusinessDataSourceWorkspaceId = string;

export type ExecutiveBusinessDataSourceCategory =
  | "financial"
  | "operational"
  | "sales"
  | "marketing"
  | "manufacturing"
  | "human_resources"
  | "supply_chain"
  | "custom";

export type ExecutiveBusinessDataSourceLifecycleState =
  | "defined"
  | "registered"
  | "connected"
  | "validated"
  | "active"
  | "suspended"
  | "archived"
  | "removed";

export type ExecutiveBusinessDataSourceSecurityClassification =
  | "public"
  | "internal"
  | "confidential"
  | "restricted";

export type ExecutiveBusinessDataSourceSecurityProfile = Readonly<{
  classification: ExecutiveBusinessDataSourceSecurityClassification;
  crossWorkspaceAccess: false;
}>;

export type ExecutiveBusinessDataSourceExtensionPoint = Readonly<{
  connectorProfileId?: string | null;
  registrySourceId?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveBusinessDataSourceMetadata = Readonly<{
  businessDomain?: string | null;
  tags?: readonly string[];
  recordCountEstimate?: number | null;
  columnCountEstimate?: number | null;
  extension?: ExecutiveBusinessDataSourceExtensionPoint;
}>;

export type ExecutiveBusinessDataSourceRecord = Readonly<{
  contractVersion: string;
  businessDataSourceId: string;
  workspaceId: ExecutiveBusinessDataSourceWorkspaceId;
  displayName: string;
  description: string | null;
  category: ExecutiveBusinessDataSourceCategory;
  lifecycleState: ExecutiveBusinessDataSourceLifecycleState;
  metadata: ExecutiveBusinessDataSourceMetadata;
  securityProfile: ExecutiveBusinessDataSourceSecurityProfile;
  createdAt: string;
  updatedAt: string;
  source: "phase-2-business-data-source";
}>;

export type ExecutiveBusinessDataSourceOwnershipContract = Readonly<{
  businessDataSourceId: string;
  workspaceId: ExecutiveBusinessDataSourceWorkspaceId;
  isolationPolicy: "workspace-exclusive";
}>;

export type ExecutiveBusinessDataSourceValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveBusinessDataSourceValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveBusinessDataSourceValidationIssue[];
}>;

export type ExecutiveBusinessDataSourceDependencyClass = "internal" | "external" | "future";

export type ExecutiveBusinessDataSourceDependencyBoundary = Readonly<{
  name: string;
  dependencyClass: ExecutiveBusinessDataSourceDependencyClass;
  description: string;
}>;

export type ExecutiveBusinessDataSourceScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type ExecutiveBusinessDataSourceScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveBusinessDataSourceScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveBusinessDataSourceCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveBusinessDataSourceCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly ExecutiveBusinessDataSourceCertificationCheck[];
  scoreReport: ExecutiveBusinessDataSourceScoreReport;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type ExecutiveBusinessDataSourceEventType =
  | "BusinessDataSourceCreated"
  | "BusinessDataSourceUpdated"
  | "BusinessDataSourceArchived"
  | "BusinessDataSourceActivated"
  | "BusinessDataSourceSuspended"
  | "BusinessDataSourceRegistered"
  | "BusinessDataSourceRemoved"
  | "BusinessDataSourceCertificationStarted"
  | "BusinessDataSourceCertificationPassed"
  | "BusinessDataSourceCertificationFailed";

export type ExecutiveBusinessDataSourceEvent = Readonly<{
  type: ExecutiveBusinessDataSourceEventType;
  businessDataSourceId: string | null;
  workspaceId: ExecutiveBusinessDataSourceWorkspaceId | null;
  timestamp: string;
}>;

export type ExecutiveBusinessDataSourceDiagnosticEntry = Readonly<{
  businessDataSourceId: string | null;
  workspaceId: ExecutiveBusinessDataSourceWorkspaceId | null;
  event: ExecutiveBusinessDataSourceEventType;
  message: string;
  generatedAt: string;
}>;
