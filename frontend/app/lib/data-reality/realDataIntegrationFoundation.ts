/**
 * RDI:1 — canonical external-observation boundary for Data Reality.
 *
 * Provider payload → adapter → validated source snapshot → mapping boundary
 * → existing NexoraDataset/Data Reality authority.
 */
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import type { NexoraDataset } from "./dataRealityContracts.ts";
import { validateNexoraDataset } from "./dataRealityValidation.ts";

export const realDataIntegrationFoundationIdentity =
  "RDI:1/NexoraRealDataIntegrationFoundation" as const;
export const realDataIntegrationFoundationVersion = "1.0.0" as const;
export const realDataIntegrationFoundationNamespace =
  "nexora.real-data-integration.foundation" as const;

export const NEXORA_DATA_SOURCE_VALIDATION_STATES = Object.freeze([
  "valid",
  "partial",
  "invalid",
  "unsupported",
  "stale",
] as const);

export type NexoraDataSourceValidationState =
  (typeof NEXORA_DATA_SOURCE_VALIDATION_STATES)[number];

export const REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY = Object.freeze({
  ownsExternalObservation: true as const,
  ownsSourceValidation: true as const,
  ownsSourceProvenance: true as const,
  ownsDataRealityInterpretation: false as const,
  ownsCanonicalRuntimeTruth: false as const,
  ownsConversationContext: false as const,
  ownsExecutiveMemory: false as const,
  ownsAdvisorConclusions: false as const,
  ownsStagePresentation: false as const,
  dataRealityHandoffType: "NexoraDataset" as const,
  dataRealityAuthority: "P0:1/NexoraDataRealityFoundation" as const,
  nextPhase: "RDI:2" as const,
});

export type NexoraSourceScalar = string | number | boolean | null;
export interface NexoraSourceObject {
  readonly [key: string]: NexoraSourceValue;
}
export type NexoraSourceValue =
  | NexoraSourceScalar
  | readonly NexoraSourceValue[]
  | NexoraSourceObject;

export type NexoraDataSourceIdentity = Readonly<{
  sourceId: string;
  sourceType: string;
  workspaceId: WorkspaceId;
  providerName: string;
  connectionId: string;
  observedAt: string;
  schemaVersion: string | null;
}>;

export type NexoraDataSourceMetadata = Readonly<{
  displayName: string;
  description: string | null;
  configurationRef: string | null;
  tags: readonly string[];
}>;

export type NexoraDataSource = Readonly<{
  identity: NexoraDataSourceIdentity;
  metadata: NexoraDataSourceMetadata;
  adapterId: string;
}>;

export type NexoraSourceConfidenceState =
  | "unverified"
  | "verified"
  | "uncertain"
  | "rejected";

export type NexoraDataSourceProvenance = Readonly<{
  sourceId: string;
  sourceType: string;
  providerName: string;
  sourceRecordId: string | null;
  sourceFieldKey: string | null;
  observedAt: string;
  importedAt: string;
  transformationRef: string | null;
  confidenceState: NexoraSourceConfidenceState;
  confidence: number | null;
}>;

export type NexoraSourceField = Readonly<{
  key: string;
  sourceDataType: string;
  value: NexoraSourceValue;
  provenance: NexoraDataSourceProvenance;
}>;

export type NexoraSourceRecord = Readonly<{
  recordId: string | null;
  fields: readonly NexoraSourceField[];
  provenance: NexoraDataSourceProvenance;
}>;

export type NexoraDataSourceValidationIssueCode =
  | "SOURCE_REQUIRED"
  | "SOURCE_ID_REQUIRED"
  | "SOURCE_TYPE_REQUIRED"
  | "WORKSPACE_ID_REQUIRED"
  | "WORKSPACE_SCOPE_MISMATCH"
  | "PROVIDER_NAME_REQUIRED"
  | "CONNECTION_ID_REQUIRED"
  | "OBSERVED_AT_INVALID"
  | "IMPORTED_AT_INVALID"
  | "SOURCE_TYPE_UNSUPPORTED"
  | "SOURCE_STALE"
  | "SNAPSHOT_ID_REQUIRED"
  | "SNAPSHOT_EMPTY"
  | "RECORD_DUPLICATE"
  | "FIELD_KEY_REQUIRED"
  | "FIELD_DUPLICATE"
  | "FIELD_VALUE_UNSUPPORTED"
  | "PROVENANCE_MISSING"
  | "PROVENANCE_MISMATCH"
  | "CONFIDENCE_INVALID"
  | "ADAPTER_IDENTITY_MISMATCH"
  | "ADAPTER_FAILURE"
  | "DATA_REALITY_MAPPING_FAILED"
  | "DATA_REALITY_DATASET_INVALID"
  | "DATA_REALITY_PROVENANCE_INCOMPLETE";

export type NexoraDataSourceValidationIssue = Readonly<{
  code: NexoraDataSourceValidationIssueCode;
  message: string;
  path: string | null;
}>;

export type NexoraDataSourceValidationResult = Readonly<{
  state: NexoraDataSourceValidationState;
  accepted: boolean;
  issues: readonly NexoraDataSourceValidationIssue[];
}>;

export type NexoraDataSourceSnapshot = Readonly<{
  snapshotId: string;
  source: NexoraDataSource;
  importedAt: string;
  records: readonly NexoraSourceRecord[];
  validation: NexoraDataSourceValidationResult;
  deterministic: true;
}>;

export type NexoraDataSourceSnapshotInput = Readonly<{
  snapshotId: string;
  source: NexoraDataSource;
  importedAt: string;
  records: readonly NexoraSourceRecord[];
}>;

export type NexoraDataSourceValidationOptions = Readonly<{
  expectedWorkspaceId?: WorkspaceId;
  evaluatedAt?: string;
  staleAfterMs?: number;
  supportedSourceTypes?: readonly string[];
}>;

export type NexoraDataSourceAdapterInput = Readonly<{
  source: NexoraDataSource;
  snapshotId: string;
  importedAt: string;
  payload: unknown;
}>;

export type NexoraDataSourceAdapterOutput = Readonly<{
  records: readonly NexoraSourceRecord[];
}>;

export type NexoraDataSourceAdapter = Readonly<{
  adapterId: string;
  adapterVersion: string;
  sourceType: string;
  providerName: string;
  adapt: (input: NexoraDataSourceAdapterInput) => NexoraDataSourceAdapterOutput;
}>;

export type NexoraDataSourceAdapterResult = Readonly<{
  ok: boolean;
  adapterId: string;
  snapshot: NexoraDataSourceSnapshot | null;
  validation: NexoraDataSourceValidationResult;
}>;

export type NexoraDataRealityFactProvenance = Readonly<{
  objectKey: string;
  metricKey: string;
  provenance: NexoraDataSourceProvenance;
}>;

export type NexoraDataRealityMappingResult = Readonly<{
  dataset: NexoraDataset;
  factProvenance: readonly NexoraDataRealityFactProvenance[];
}>;

export type NexoraDataRealityMapper = Readonly<{
  mappingId: string;
  mappingVersion: string;
  map: (snapshot: NexoraDataSourceSnapshot) => NexoraDataRealityMappingResult;
}>;

export type NexoraDataRealityHandoff = Readonly<{
  workspaceId: WorkspaceId;
  sourceId: string;
  sourceSnapshotId: string;
  mappingId: string;
  dataset: NexoraDataset;
  factProvenance: readonly NexoraDataRealityFactProvenance[];
  destinationAuthority: "P0:1/NexoraDataRealityFoundation";
}>;

export type NexoraDataRealityHandoffResult =
  | Readonly<{
      ready: true;
      handoff: NexoraDataRealityHandoff;
      validation: NexoraDataSourceValidationResult;
    }>
  | Readonly<{
      ready: false;
      handoff: null;
      validation: NexoraDataSourceValidationResult;
    }>;

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && Number.isFinite(Date.parse(value));
}

function isSourceValue(value: unknown, visited: object[] = []): value is NexoraSourceValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object" || visited.includes(value)) return false;
  visited.push(value);
  if (Array.isArray(value)) return value.every((entry) => isSourceValue(entry, visited));
  return isRecord(value) && Object.values(value).every((entry) => isSourceValue(entry, visited));
}

function cloneSourceValue(value: NexoraSourceValue): NexoraSourceValue {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    return Object.freeze(value.map((entry) => cloneSourceValue(entry)));
  }
  const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right));
  return Object.freeze(
    Object.fromEntries(entries.map(([key, entry]) => [key, cloneSourceValue(entry)])),
  );
}

function freezeProvenance(provenance: NexoraDataSourceProvenance): NexoraDataSourceProvenance {
  return Object.freeze({ ...provenance });
}

function freezeSource(source: NexoraDataSource): NexoraDataSource {
  return Object.freeze({
    identity: Object.freeze({ ...source.identity }),
    metadata: Object.freeze({
      ...source.metadata,
      tags: Object.freeze([...source.metadata.tags]),
    }),
    adapterId: source.adapterId,
  });
}

function freezeRecord(record: NexoraSourceRecord): NexoraSourceRecord {
  const fields = record.fields
    .map((field) =>
      Object.freeze({
        key: field.key,
        sourceDataType: field.sourceDataType,
        value: cloneSourceValue(field.value),
        provenance: freezeProvenance(field.provenance),
      }),
    )
    .sort((left, right) => left.key.localeCompare(right.key));
  return Object.freeze({
    recordId: record.recordId,
    fields: Object.freeze(fields),
    provenance: freezeProvenance(record.provenance),
  });
}

function freezeValidation(
  state: NexoraDataSourceValidationState,
  issues: readonly NexoraDataSourceValidationIssue[],
): NexoraDataSourceValidationResult {
  return Object.freeze({
    state,
    accepted: state === "valid",
    issues: Object.freeze(issues.map((entry) => Object.freeze({ ...entry }))),
  });
}

function issue(
  code: NexoraDataSourceValidationIssueCode,
  message: string,
  path: string | null = null,
): NexoraDataSourceValidationIssue {
  return Object.freeze({ code, message, path });
}

function validateProvenance(
  provenance: NexoraDataSourceProvenance | null | undefined,
  source: NexoraDataSourceIdentity,
  importedAt: string,
  path: string,
  expectedRecordId: string | null,
  expectedFieldKey: string | null,
  issues: NexoraDataSourceValidationIssue[],
): void {
  if (!provenance || typeof provenance !== "object") {
    issues.push(issue("PROVENANCE_MISSING", "Source provenance is required.", path));
    return;
  }
  const matches = provenance.sourceId === source.sourceId
    && provenance.sourceType === source.sourceType
    && provenance.providerName === source.providerName
    && provenance.observedAt === source.observedAt
    && provenance.importedAt === importedAt
    && (expectedRecordId === null || provenance.sourceRecordId === expectedRecordId)
    && (expectedFieldKey === null || provenance.sourceFieldKey === expectedFieldKey);
  if (!matches) {
    issues.push(issue("PROVENANCE_MISMATCH", "Provenance does not match its source, record, field, or observation.", path));
  }
  if (provenance.confidence !== null && (!Number.isFinite(provenance.confidence) || provenance.confidence < 0 || provenance.confidence > 1)) {
    issues.push(issue("CONFIDENCE_INVALID", "Confidence must be null or a finite value from zero through one.", `${path}.confidence`));
  }
}

function classifyValidation(
  issues: readonly NexoraDataSourceValidationIssue[],
): NexoraDataSourceValidationState {
  if (issues.some((entry) => entry.code === "SOURCE_TYPE_UNSUPPORTED")) return "unsupported";
  if (issues.some((entry) => entry.code === "SOURCE_STALE")) return "stale";
  if (issues.some((entry) => entry.code === "SNAPSHOT_EMPTY")) return "partial";
  return issues.length === 0 ? "valid" : "invalid";
}

export function validateNexoraDataSourceSnapshot(
  snapshot: NexoraDataSourceSnapshotInput,
  options: NexoraDataSourceValidationOptions = {},
): NexoraDataSourceValidationResult {
  const issues: NexoraDataSourceValidationIssue[] = [];
  const source = snapshot?.source;
  const identity = source?.identity;
  if (!source || typeof source !== "object" || !identity || typeof identity !== "object") {
    return freezeValidation("invalid", [issue("SOURCE_REQUIRED", "A source and source identity are required.", "source")]);
  }
  if (!isNonEmpty(snapshot.snapshotId)) issues.push(issue("SNAPSHOT_ID_REQUIRED", "Snapshot identity is required.", "snapshotId"));
  if (!isNonEmpty(identity.sourceId)) issues.push(issue("SOURCE_ID_REQUIRED", "Source identity is required.", "source.identity.sourceId"));
  if (!isNonEmpty(identity.sourceType)) issues.push(issue("SOURCE_TYPE_REQUIRED", "Source type is required.", "source.identity.sourceType"));
  if (!isNonEmpty(identity.workspaceId)) issues.push(issue("WORKSPACE_ID_REQUIRED", "Workspace scope is required.", "source.identity.workspaceId"));
  if (options.expectedWorkspaceId !== undefined && identity.workspaceId !== options.expectedWorkspaceId) {
    issues.push(issue("WORKSPACE_SCOPE_MISMATCH", "Source snapshot belongs to a different workspace.", "source.identity.workspaceId"));
  }
  if (!isNonEmpty(identity.providerName)) issues.push(issue("PROVIDER_NAME_REQUIRED", "Provider name is required.", "source.identity.providerName"));
  if (!isNonEmpty(identity.connectionId)) issues.push(issue("CONNECTION_ID_REQUIRED", "Connection or import identity is required.", "source.identity.connectionId"));
  if (!isIsoTimestamp(identity.observedAt)) issues.push(issue("OBSERVED_AT_INVALID", "Observed timestamp must be valid.", "source.identity.observedAt"));
  if (!isIsoTimestamp(snapshot.importedAt)) issues.push(issue("IMPORTED_AT_INVALID", "Imported timestamp must be valid.", "importedAt"));
  if (options.supportedSourceTypes && !options.supportedSourceTypes.includes(identity.sourceType)) {
    issues.push(issue("SOURCE_TYPE_UNSUPPORTED", "Source type is not supported by the selected adapter boundary.", "source.identity.sourceType"));
  }
  if (options.evaluatedAt && options.staleAfterMs !== undefined && isIsoTimestamp(identity.observedAt) && isIsoTimestamp(options.evaluatedAt)) {
    const age = Date.parse(options.evaluatedAt) - Date.parse(identity.observedAt);
    if (Number.isFinite(options.staleAfterMs) && options.staleAfterMs >= 0 && age > options.staleAfterMs) {
      issues.push(issue("SOURCE_STALE", "Source observation is older than the accepted freshness boundary.", "source.identity.observedAt"));
    }
  }
  if (!Array.isArray(snapshot.records) || snapshot.records.length === 0) {
    issues.push(issue("SNAPSHOT_EMPTY", "Snapshot contains no source records.", "records"));
  }
  const recordIds: string[] = [];
  for (let recordIndex = 0; recordIndex < (snapshot.records?.length ?? 0); recordIndex += 1) {
    const record = snapshot.records[recordIndex];
    if (!record || typeof record !== "object") {
      issues.push(issue("PROVENANCE_MISSING", "Source record must be a structured record.", `records[${recordIndex}]`));
      continue;
    }
    if (record.recordId !== null) {
      if (recordIds.includes(record.recordId)) issues.push(issue("RECORD_DUPLICATE", "Source record identity must be unique within a snapshot.", `records[${recordIndex}].recordId`));
      recordIds.push(record.recordId);
    }
    validateProvenance(record.provenance, identity, snapshot.importedAt, `records[${recordIndex}].provenance`, record.recordId, null, issues);
    const fieldKeys: string[] = [];
    for (let fieldIndex = 0; fieldIndex < record.fields.length; fieldIndex += 1) {
      const field = record.fields[fieldIndex];
      const path = `records[${recordIndex}].fields[${fieldIndex}]`;
      if (!isNonEmpty(field.key)) issues.push(issue("FIELD_KEY_REQUIRED", "Source field key is required.", `${path}.key`));
      if (fieldKeys.includes(field.key)) issues.push(issue("FIELD_DUPLICATE", "Source field key must be unique within its record.", `${path}.key`));
      fieldKeys.push(field.key);
      if (!isSourceValue(field.value)) issues.push(issue("FIELD_VALUE_UNSUPPORTED", "Source field value must be canonical plain data.", `${path}.value`));
      validateProvenance(field.provenance, identity, snapshot.importedAt, `${path}.provenance`, record.recordId, field.key, issues);
    }
  }
  return freezeValidation(classifyValidation(issues), issues);
}

export function buildNexoraDataSourceSnapshot(
  input: NexoraDataSourceSnapshotInput,
  options: NexoraDataSourceValidationOptions = {},
): NexoraDataSourceSnapshot {
  const validation = validateNexoraDataSourceSnapshot(input, options);
  const frozenInput: NexoraDataSourceSnapshotInput = Object.freeze({
    snapshotId: input.snapshotId,
    source: freezeSource(input.source),
    importedAt: input.importedAt,
    records: Object.freeze(input.records.map(freezeRecord)),
  });
  return Object.freeze({ ...frozenInput, validation, deterministic: true });
}

export function adaptNexoraDataSource(
  adapter: NexoraDataSourceAdapter,
  input: NexoraDataSourceAdapterInput,
  options: NexoraDataSourceValidationOptions = {},
): NexoraDataSourceAdapterResult {
  if (adapter.adapterId !== input.source.adapterId || adapter.sourceType !== input.source.identity.sourceType || adapter.providerName !== input.source.identity.providerName) {
    const validation = freezeValidation("invalid", [issue("ADAPTER_IDENTITY_MISMATCH", "Adapter identity does not match the declared data source.", "adapter")]);
    return Object.freeze({ ok: false, adapterId: adapter.adapterId, snapshot: null, validation });
  }
  try {
    const output = adapter.adapt(input);
    const snapshot = buildNexoraDataSourceSnapshot({
      snapshotId: input.snapshotId,
      source: input.source,
      importedAt: input.importedAt,
      records: output.records,
    }, options);
    return Object.freeze({ ok: snapshot.validation.accepted, adapterId: adapter.adapterId, snapshot, validation: snapshot.validation });
  } catch {
    const validation = freezeValidation("invalid", [issue("ADAPTER_FAILURE", "Source adapter could not produce a canonical source snapshot.", "adapter")]);
    return Object.freeze({ ok: false, adapterId: adapter.adapterId, snapshot: null, validation });
  }
}

export type NexoraDataSourceWorkspaceAccessResult = Readonly<{
  allowed: boolean;
  expectedWorkspaceId: WorkspaceId;
  actualWorkspaceId: WorkspaceId;
  sourceId: string;
  reason: "workspace_scope_verified" | "cross_workspace_access_denied";
}>;

export function verifyNexoraDataSourceWorkspaceAccess(
  snapshot: NexoraDataSourceSnapshot,
  expectedWorkspaceId: WorkspaceId,
): NexoraDataSourceWorkspaceAccessResult {
  const allowed = snapshot.source.identity.workspaceId === expectedWorkspaceId;
  return Object.freeze({
    allowed,
    expectedWorkspaceId,
    actualWorkspaceId: snapshot.source.identity.workspaceId,
    sourceId: snapshot.source.identity.sourceId,
    reason: allowed ? "workspace_scope_verified" : "cross_workspace_access_denied",
  });
}

function cloneDataset(dataset: NexoraDataset): NexoraDataset {
  return Object.freeze({
    ...dataset,
    records: Object.freeze(dataset.records.map((record) => Object.freeze({ ...record }))),
  });
}

function cloneFactProvenance(
  entries: readonly NexoraDataRealityFactProvenance[],
): readonly NexoraDataRealityFactProvenance[] {
  return Object.freeze(entries.map((entry) => Object.freeze({
    objectKey: entry.objectKey,
    metricKey: entry.metricKey,
    provenance: freezeProvenance(entry.provenance),
  })));
}

function handoffFailure(
  validation: NexoraDataSourceValidationResult,
): NexoraDataRealityHandoffResult {
  return Object.freeze({ ready: false, handoff: null, validation });
}

export function createNexoraDataRealityHandoff(
  snapshot: NexoraDataSourceSnapshot,
  mapper: NexoraDataRealityMapper,
  expectedWorkspaceId: WorkspaceId,
): NexoraDataRealityHandoffResult {
  const validation = validateNexoraDataSourceSnapshot(snapshot, { expectedWorkspaceId });
  if (!snapshot.validation.accepted) {
    return handoffFailure(snapshot.validation);
  }
  if (!validation.accepted || !verifyNexoraDataSourceWorkspaceAccess(snapshot, expectedWorkspaceId).allowed) {
    return handoffFailure(validation);
  }
  let mapped: NexoraDataRealityMappingResult;
  try {
    mapped = mapper.map(snapshot);
  } catch {
    return handoffFailure(freezeValidation("invalid", [issue("DATA_REALITY_MAPPING_FAILED", "Mapping boundary could not produce a Data Reality dataset.", "mapper")]));
  }
  const datasetValidation = validateNexoraDataset(mapped.dataset);
  if (!datasetValidation.ok) {
    return handoffFailure(freezeValidation("invalid", [issue("DATA_REALITY_DATASET_INVALID", "Mapped dataset does not satisfy the existing Data Reality contract.", "dataset")]));
  }
  const provenanceComplete = mapped.dataset.records.every((record) => mapped.factProvenance.some((entry) =>
    entry.objectKey === record.objectKey
    && entry.metricKey === record.metricKey
    && entry.provenance.sourceId === snapshot.source.identity.sourceId,
  ));
  if (!provenanceComplete) {
    return handoffFailure(freezeValidation("invalid", [issue("DATA_REALITY_PROVENANCE_INCOMPLETE", "Every mapped dataset record must retain source provenance.", "factProvenance")]));
  }
  const handoff: NexoraDataRealityHandoff = Object.freeze({
    workspaceId: expectedWorkspaceId,
    sourceId: snapshot.source.identity.sourceId,
    sourceSnapshotId: snapshot.snapshotId,
    mappingId: mapper.mappingId,
    dataset: cloneDataset(mapped.dataset),
    factProvenance: cloneFactProvenance(mapped.factProvenance),
    destinationAuthority: "P0:1/NexoraDataRealityFoundation",
  });
  return Object.freeze({ ready: true, handoff, validation });
}

export function traceNexoraDataRealityValue(
  handoff: NexoraDataRealityHandoff,
  objectKey: string,
  metricKey: string,
): NexoraDataSourceProvenance | null {
  return handoff.factProvenance.find((entry) => entry.objectKey === objectKey && entry.metricKey === metricKey)?.provenance ?? null;
}

export const REAL_DATA_INTEGRATION_CAPABILITIES = Object.freeze([
  "canonical-source-identity",
  "workspace-scoped-snapshots",
  "deterministic-snapshot-building",
  "source-provenance-preservation",
  "explainable-source-validation",
  "provider-adapter-boundary",
  "data-reality-mapping-boundary",
  "authority-separation",
] as const);

export type NexoraRealDataIntegrationVerificationResult = Readonly<{
  valid: boolean;
  identityValid: boolean;
  validationStatesValid: boolean;
  authorityBoundaryValid: boolean;
  capabilityCount: number;
  checks: readonly string[];
}>;

export function verifyNexoraRealDataIntegrationFoundation(): NexoraRealDataIntegrationVerificationResult {
  const identityValid = realDataIntegrationFoundationIdentity === "RDI:1/NexoraRealDataIntegrationFoundation"
    && realDataIntegrationFoundationVersion === "1.0.0"
    && realDataIntegrationFoundationNamespace === "nexora.real-data-integration.foundation";
  const validationStatesValid = JSON.stringify(NEXORA_DATA_SOURCE_VALIDATION_STATES) === JSON.stringify(["valid", "partial", "invalid", "unsupported", "stale"]);
  const authorityBoundaryValid = REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.ownsExternalObservation
    && !REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.ownsDataRealityInterpretation
    && !REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.ownsCanonicalRuntimeTruth
    && !REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.ownsExecutiveMemory
    && !REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.ownsAdvisorConclusions
    && !REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.ownsStagePresentation;
  const capabilityValid = REAL_DATA_INTEGRATION_CAPABILITIES.length === 8
    && REAL_DATA_INTEGRATION_CAPABILITIES.every((entry, index) => REAL_DATA_INTEGRATION_CAPABILITIES.indexOf(entry) === index)
    && Object.isFrozen(REAL_DATA_INTEGRATION_CAPABILITIES);
  const checks = Object.freeze([
    `identity:${identityValid ? "passed" : "failed"}`,
    `validation-states:${validationStatesValid ? "passed" : "failed"}`,
    `authority-boundary:${authorityBoundaryValid ? "passed" : "failed"}`,
    `capabilities:${capabilityValid ? "passed" : "failed"}`,
  ]);
  return Object.freeze({ valid: checks.every((entry) => entry.endsWith(":passed")), identityValid, validationStatesValid, authorityBoundaryValid, capabilityCount: REAL_DATA_INTEGRATION_CAPABILITIES.length, checks });
}

export type NexoraRealDataIntegrationCertificationGate = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
export type NexoraRealDataIntegrationCertificationEvidence = Readonly<{
  sourceIdentityPreserved: boolean;
  workspaceIsolationEnforced: boolean;
  snapshotDeterministic: boolean;
  provenancePreserved: boolean;
  validationProtected: boolean;
  adapterIndependent: boolean;
  authorityProtected: boolean;
  regressionPassed: boolean;
}>;
export type NexoraRealDataIntegrationCertificationResult = Readonly<{
  certified: boolean;
  gates: readonly Readonly<{ gate: NexoraRealDataIntegrationCertificationGate; passed: boolean; name: string }>[];
  passedGateCount: number;
  failedGateCount: number;
}>;

export function certifyNexoraRealDataIntegrationFoundation(
  evidence: NexoraRealDataIntegrationCertificationEvidence,
): NexoraRealDataIntegrationCertificationResult {
  const definitions = [
    ["A", "Source Identity", evidence.sourceIdentityPreserved],
    ["B", "Workspace Isolation", evidence.workspaceIsolationEnforced],
    ["C", "Snapshot Determinism", evidence.snapshotDeterministic],
    ["D", "Provenance", evidence.provenancePreserved],
    ["E", "Validation", evidence.validationProtected],
    ["F", "Adapter Independence", evidence.adapterIndependent],
    ["G", "Authority Protection", evidence.authorityProtected],
    ["H", "Regression", evidence.regressionPassed],
  ] as const;
  const gates = Object.freeze(definitions.map(([gate, name, passed]) => Object.freeze({ gate, name, passed })));
  const passedGateCount = gates.filter((entry) => entry.passed).length;
  const failedGateCount = gates.length - passedGateCount;
  return Object.freeze({ certified: failedGateCount === 0, gates, passedGateCount, failedGateCount });
}

export function getNexoraRealDataIntegrationFoundationSummary(): Readonly<{
  identity: string;
  version: string;
  namespace: string;
  validationStateCount: number;
  capabilityCount: number;
  dataRealityHandoffType: "NexoraDataset";
  dataRealityAuthority: "P0:1/NexoraDataRealityFoundation";
  nextPhase: "RDI:2";
}> {
  return Object.freeze({
    identity: realDataIntegrationFoundationIdentity,
    version: realDataIntegrationFoundationVersion,
    namespace: realDataIntegrationFoundationNamespace,
    validationStateCount: NEXORA_DATA_SOURCE_VALIDATION_STATES.length,
    capabilityCount: REAL_DATA_INTEGRATION_CAPABILITIES.length,
    dataRealityHandoffType: "NexoraDataset",
    dataRealityAuthority: "P0:1/NexoraDataRealityFoundation",
    nextPhase: "RDI:2",
  });
}
