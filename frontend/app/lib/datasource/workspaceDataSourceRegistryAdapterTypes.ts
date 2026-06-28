/**
 * PHASE-2 / DS1:2 — Workspace Data Source Registry Adapter types.
 * Mapping and link shapes only — no runtime, sync engine, or registry mutation.
 */

import type {
  ExecutiveBusinessDataSourceCategory,
  ExecutiveBusinessDataSourceLifecycleState,
} from "./executiveBusinessDataSourceTypes.ts";

export type WorkspaceRegistryAdapterWorkspaceId = string;

export type WorkspaceRegistryAdapterState =
  | "unlinked"
  | "linking"
  | "linked"
  | "sync_pending"
  | "synced"
  | "drift_detected"
  | "relinking";

export type WorkspaceRegistryRuntimeStatusHint = "empty" | "connected" | "processing" | "error";

export type GlobalRegistryRuntimeStatusHint = "registered" | "active" | "inactive" | "error";

export type WorkspaceRegistryAdapterSyncProfile = Readonly<{
  allowLabelSync: boolean;
  allowEstimateSync: boolean;
  allowStatusMirror: false;
  allowGlobalRegistryMirror: boolean;
}>;

export type WorkspaceRegistryAdapterSecurityProfile = Readonly<{
  workspaceExclusive: true;
  globalRegistryRequiresAdapterContext: true;
  crossWorkspaceLinking: false;
}>;

export type WorkspaceRegistryAdapterExtensionPoint = Readonly<{
  syncProfileId?: string | null;
  connectorProfileId?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type WorkspaceRegistryAdapterMetadataOverlay = Readonly<{
  lastLinkedAt?: string | null;
  lastSyncedAt?: string | null;
  driftReason?: string | null;
  connectorHint?: string | null;
  extension?: WorkspaceRegistryAdapterExtensionPoint;
}>;

export type WorkspaceRegistryAdapterLinkRecord = Readonly<{
  contractVersion: string;
  adapterLinkId: string;
  workspaceId: WorkspaceRegistryAdapterWorkspaceId;
  businessDataSourceId: string;
  workspaceDataSourceId: string | null;
  registrySourceId: string | null;
  adapterState: WorkspaceRegistryAdapterState;
  syncProfile: WorkspaceRegistryAdapterSyncProfile;
  securityProfile: WorkspaceRegistryAdapterSecurityProfile;
  metadata: WorkspaceRegistryAdapterMetadataOverlay;
  createdAt: string;
  updatedAt: string;
  source: "phase-2-workspace-registry-adapter";
}>;

export type WorkspaceRegistryAdapterOwnershipContract = Readonly<{
  adapterLinkId: string;
  workspaceId: WorkspaceRegistryAdapterWorkspaceId;
  businessDataSourceId: string;
  isolationPolicy: "workspace-exclusive";
}>;

export type WorkspaceRegistryReferenceContract = Readonly<{
  workspaceId: WorkspaceRegistryAdapterWorkspaceId;
  workspaceDataSourceId: string | null;
  registrySourceId: string | null;
  globalRegistryWorkspaceContext: "adapter-link-only";
}>;

export type ExecutiveToWorkspaceMappingPlan = Readonly<{
  category: ExecutiveBusinessDataSourceCategory;
  lifecycleState: ExecutiveBusinessDataSourceLifecycleState;
  workspaceStatusHint: WorkspaceRegistryRuntimeStatusHint | null;
  workspaceTypeHint: string;
}>;

export type ExecutiveToGlobalMappingPlan = Readonly<{
  category: ExecutiveBusinessDataSourceCategory;
  lifecycleState: ExecutiveBusinessDataSourceLifecycleState;
  globalStatusHint: GlobalRegistryRuntimeStatusHint | null;
  globalTypeHint: string;
}>;

export type WorkspaceRegistryAdapterValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type WorkspaceRegistryAdapterValidationResult = Readonly<{
  valid: boolean;
  issues: readonly WorkspaceRegistryAdapterValidationIssue[];
}>;

export type WorkspaceRegistryAdapterScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type WorkspaceRegistryAdapterScoreReport = Readonly<{
  contractVersion: string;
  dimensions: WorkspaceRegistryAdapterScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type WorkspaceRegistryAdapterCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type WorkspaceRegistryAdapterCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly WorkspaceRegistryAdapterCertificationCheck[];
  scoreReport: WorkspaceRegistryAdapterScoreReport;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type WorkspaceRegistryAdapterEventType =
  | "LinkCreated"
  | "LinkUpdated"
  | "LinkRemoved"
  | "LinkValidated"
  | "SyncPending"
  | "SyncCompleted"
  | "DriftDetected"
  | "RelinkingStarted"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type WorkspaceRegistryAdapterEvent = Readonly<{
  type: WorkspaceRegistryAdapterEventType;
  adapterLinkId: string | null;
  workspaceId: WorkspaceRegistryAdapterWorkspaceId | null;
  timestamp: string;
}>;

export type WorkspaceRegistryAdapterDiagnosticEntry = Readonly<{
  adapterLinkId: string | null;
  workspaceId: WorkspaceRegistryAdapterWorkspaceId | null;
  event: WorkspaceRegistryAdapterEventType;
  message: string;
  generatedAt: string;
}>;
