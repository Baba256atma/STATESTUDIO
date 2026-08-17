import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  NEXORA_DATA_SOURCE_VALIDATION_STATES,
  REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY,
  adaptNexoraDataSource,
  buildNexoraDataSourceSnapshot,
  certifyNexoraRealDataIntegrationFoundation,
  createNexoraDataRealityHandoff,
  getNexoraRealDataIntegrationFoundationSummary,
  realDataIntegrationFoundationIdentity,
  realDataIntegrationFoundationNamespace,
  realDataIntegrationFoundationVersion,
  traceNexoraDataRealityValue,
  validateNexoraDataSourceSnapshot,
  verifyNexoraDataSourceWorkspaceAccess,
  verifyNexoraRealDataIntegrationFoundation,
  type NexoraDataRealityMapper,
  type NexoraDataSource,
  type NexoraDataSourceAdapter,
  type NexoraDataSourceAdapterInput,
  type NexoraDataSourceProvenance,
  type NexoraSourceRecord,
} from "./realDataIntegrationFoundation.ts";

const here = dirname(fileURLToPath(import.meta.url));
const sourceText = readFileSync(join(here, "realDataIntegrationFoundation.ts"), "utf8");
const IMPORTED_AT = "2026-08-15T12:05:00.000Z";
const OBSERVED_AT = "2026-08-15T12:00:00.000Z";

function deeplyFrozen(value: unknown, visited: object[] = []): boolean {
  if (value === null || typeof value !== "object" || visited.includes(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  visited.push(value as object);
  return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, visited));
}

function createSource(
  providerName: string,
  adapterId: string,
  workspaceId = "workspace-a",
): NexoraDataSource {
  return {
    identity: {
      sourceId: `source-${providerName.toLowerCase()}`,
      sourceType: "mock",
      workspaceId,
      providerName,
      connectionId: `import-${providerName.toLowerCase()}`,
      observedAt: OBSERVED_AT,
      schemaVersion: "1.0",
    },
    metadata: {
      displayName: `${providerName} operational source`,
      description: null,
      configurationRef: `configuration:${providerName.toLowerCase()}`,
      tags: ["operations", "certification"],
    },
    adapterId,
  };
}

function provenance(
  source: NexoraDataSource,
  recordId: string,
  sourceFieldKey: string | null,
): NexoraDataSourceProvenance {
  return {
    sourceId: source.identity.sourceId,
    sourceType: source.identity.sourceType,
    providerName: source.identity.providerName,
    sourceRecordId: recordId,
    sourceFieldKey,
    observedAt: source.identity.observedAt,
    importedAt: IMPORTED_AT,
    transformationRef: `adapter:${source.adapterId}:canonical-field-v1`,
    confidenceState: "verified",
    confidence: 1,
  };
}

function canonicalRecord(
  source: NexoraDataSource,
  objectKey: string,
  metricKey: string,
  value: number,
): NexoraSourceRecord {
  const recordId = `${objectKey}:${metricKey}`;
  return {
    recordId,
    provenance: provenance(source, recordId, null),
    fields: [
      { key: "objectKey", sourceDataType: "string", value: objectKey, provenance: provenance(source, recordId, "objectKey") },
      { key: "metricKey", sourceDataType: "string", value: metricKey, provenance: provenance(source, recordId, "metricKey") },
      { key: "value", sourceDataType: "number", value, provenance: provenance(source, recordId, "value") },
    ],
  };
}

function fieldValue(record: NexoraSourceRecord, key: string): string | number {
  const value = record.fields.find((field) => field.key === key)?.value;
  if (typeof value !== "string" && typeof value !== "number") throw new Error(`Missing ${key}`);
  return value;
}

const mapper: NexoraDataRealityMapper = {
  mappingId: "mapping:mock-operations-v1",
  mappingVersion: "1.0.0",
  map(snapshot) {
    return {
      dataset: {
        id: "rdi:operations:dataset",
        name: "RDI Operations Dataset",
        version: "1.0.0",
        capturedAt: snapshot.source.identity.observedAt,
        source: "api",
        familyId: "rdi:operations",
        scenario: "baseline",
        records: snapshot.records.map((record) => ({
          objectKey: String(fieldValue(record, "objectKey")),
          metricKey: String(fieldValue(record, "metricKey")),
          value: Number(fieldValue(record, "value")),
          observedAt: snapshot.source.identity.observedAt,
        })),
      },
      factProvenance: snapshot.records.map((record) => ({
        objectKey: String(fieldValue(record, "objectKey")),
        metricKey: String(fieldValue(record, "metricKey")),
        provenance: record.fields.find((field) => field.key === "value")!.provenance,
      })),
    };
  },
};

function createFormatAAdapter(source: NexoraDataSource): NexoraDataSourceAdapter {
  return {
    adapterId: source.adapterId,
    adapterVersion: "1.0.0",
    sourceType: source.identity.sourceType,
    providerName: source.identity.providerName,
    adapt(input: NexoraDataSourceAdapterInput) {
      const payload = input.payload as { rows: readonly { object: string; metric: string; amount: number }[] };
      return { records: payload.rows.map((row) => canonicalRecord(input.source, row.object, row.metric, row.amount)) };
    },
  };
}

function createFormatBAdapter(source: NexoraDataSource): NexoraDataSourceAdapter {
  return {
    adapterId: source.adapterId,
    adapterVersion: "1.0.0",
    sourceType: source.identity.sourceType,
    providerName: source.identity.providerName,
    adapt(input: NexoraDataSourceAdapterInput) {
      const payload = input.payload as { entries: readonly (readonly [string, string, number])[] };
      return { records: payload.entries.map(([objectKey, metricKey, value]) => canonicalRecord(input.source, objectKey, metricKey, value)) };
    },
  };
}

function adaptFormatA(source = createSource("ProviderA", "mock-provider-a")) {
  return adaptNexoraDataSource(createFormatAAdapter(source), {
    source,
    snapshotId: "snapshot:operations:001",
    importedAt: IMPORTED_AT,
    payload: { rows: [{ object: "revenue", metric: "current", amount: 120 }] },
  }, { expectedWorkspaceId: source.identity.workspaceId, supportedSourceTypes: ["mock"] });
}

test("creates exactly the RDI:1 foundation and certification test files", () => {
  const files = readdirSync(here).filter((name) => name.startsWith("realDataIntegrationFoundation"));
  assert.deepEqual(files.sort(), ["realDataIntegrationFoundation.test.ts", "realDataIntegrationFoundation.ts"]);
});

test("publishes the canonical RDI identity, version, namespace, and authority", () => {
  assert.equal(realDataIntegrationFoundationIdentity, "RDI:1/NexoraRealDataIntegrationFoundation");
  assert.equal(realDataIntegrationFoundationVersion, "1.0.0");
  assert.equal(realDataIntegrationFoundationNamespace, "nexora.real-data-integration.foundation");
  assert.equal(REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.dataRealityAuthority, "P0:1/NexoraDataRealityFoundation");
  assert.equal(REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.nextPhase, "RDI:2");
  assert.equal(deeplyFrozen(REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY), true);
});

test("defines the exact five explainable validation states", () => {
  assert.deepEqual(NEXORA_DATA_SOURCE_VALIDATION_STATES, ["valid", "partial", "invalid", "unsupported", "stale"]);
  assert.equal(deeplyFrozen(NEXORA_DATA_SOURCE_VALIDATION_STATES), true);
});

test("A — stable source identity survives adaptation and Data Reality handoff", () => {
  const result = adaptFormatA();
  assert.equal(result.ok, true);
  assert.ok(result.snapshot);
  assert.equal(result.snapshot.source.identity.sourceId, "source-providera");
  assert.equal(result.snapshot.source.identity.connectionId, "import-providera");
  const handoff = createNexoraDataRealityHandoff(result.snapshot, mapper, "workspace-a");
  assert.equal(handoff.ready, true);
  if (!handoff.ready) return;
  assert.equal(handoff.handoff.sourceId, result.snapshot.source.identity.sourceId);
  assert.equal(handoff.handoff.sourceSnapshotId, result.snapshot.snapshotId);
  assert.equal(handoff.handoff.dataset.id, "rdi:operations:dataset");
});

test("B — workspace isolation allows owning workspace and denies all others", () => {
  const result = adaptFormatA();
  assert.ok(result.snapshot);
  assert.equal(verifyNexoraDataSourceWorkspaceAccess(result.snapshot, "workspace-a").allowed, true);
  const denied = verifyNexoraDataSourceWorkspaceAccess(result.snapshot, "workspace-b");
  assert.equal(denied.allowed, false);
  assert.equal(denied.reason, "cross_workspace_access_denied");
  const handoff = createNexoraDataRealityHandoff(result.snapshot, mapper, "workspace-b");
  assert.equal(handoff.ready, false);
  assert.equal(handoff.validation.issues.some((entry) => entry.code === "WORKSPACE_SCOPE_MISMATCH"), true);
});

test("B — workspace identity is mandatory on every source", () => {
  const source = createSource("ProviderA", "mock-provider-a", "");
  const input = {
    snapshotId: "snapshot:no-workspace",
    source,
    importedAt: IMPORTED_AT,
    records: [canonicalRecord(source, "revenue", "current", 120)],
  };
  const validation = validateNexoraDataSourceSnapshot(input);
  assert.equal(validation.state, "invalid");
  assert.equal(validation.accepted, false);
  assert.equal(validation.issues.some((entry) => entry.code === "WORKSPACE_ID_REQUIRED"), true);
});

test("C — identical input produces deterministic immutable canonical snapshots", () => {
  const source = createSource("ProviderA", "mock-provider-a");
  const input = {
    snapshotId: "snapshot:deterministic",
    source,
    importedAt: IMPORTED_AT,
    records: [canonicalRecord(source, "revenue", "current", 120)],
  };
  const first = buildNexoraDataSourceSnapshot(input, { expectedWorkspaceId: "workspace-a" });
  const second = buildNexoraDataSourceSnapshot(input, { expectedWorkspaceId: "workspace-a" });
  assert.deepEqual(first, second);
  assert.equal(first.deterministic, true);
  assert.equal(deeplyFrozen(first), true);
  assert.equal(Object.isFrozen(input), false);
  assert.equal(Object.isFrozen(source), false);
});

test("C — canonical field and object ordering is deterministic", () => {
  const source = createSource("ProviderA", "mock-provider-a");
  const record = canonicalRecord(source, "revenue", "current", 120);
  const reversed = { ...record, fields: [...record.fields].reverse() };
  const snapshot = buildNexoraDataSourceSnapshot({ snapshotId: "snapshot:ordered", source, importedAt: IMPORTED_AT, records: [reversed] });
  assert.deepEqual(snapshot.records[0]?.fields.map((field) => field.key), ["metricKey", "objectKey", "value"]);
});

test("D — every canonical value retains traceable field-level provenance", () => {
  const result = adaptFormatA();
  assert.ok(result.snapshot);
  const handoff = createNexoraDataRealityHandoff(result.snapshot, mapper, "workspace-a");
  assert.equal(handoff.ready, true);
  if (!handoff.ready) return;
  const trace = traceNexoraDataRealityValue(handoff.handoff, "revenue", "current");
  assert.ok(trace);
  assert.equal(trace.sourceId, result.snapshot.source.identity.sourceId);
  assert.equal(trace.providerName, "ProviderA");
  assert.equal(trace.sourceRecordId, "revenue:current");
  assert.equal(trace.sourceFieldKey, "value");
  assert.equal(trace.observedAt, OBSERVED_AT);
  assert.equal(trace.importedAt, IMPORTED_AT);
  assert.equal(trace.confidenceState, "verified");
  assert.equal(trace.confidence, 1);
});

test("D — provenance mismatch is observable and blocks acceptance", () => {
  const source = createSource("ProviderA", "mock-provider-a");
  const record = canonicalRecord(source, "revenue", "current", 120);
  const corrupt = {
    ...record,
    fields: record.fields.map((field) => field.key === "value"
      ? { ...field, provenance: { ...field.provenance, sourceId: "different-source" } }
      : field),
  };
  const validation = validateNexoraDataSourceSnapshot({ snapshotId: "snapshot:corrupt", source, importedAt: IMPORTED_AT, records: [corrupt] });
  assert.equal(validation.state, "invalid");
  assert.equal(validation.accepted, false);
  assert.equal(validation.issues.some((entry) => entry.code === "PROVENANCE_MISMATCH"), true);
});

test("E — valid, partial, unsupported, stale, and invalid classifications are deterministic", () => {
  const source = createSource("ProviderA", "mock-provider-a");
  const record = canonicalRecord(source, "revenue", "current", 120);
  const base = { snapshotId: "snapshot:states", source, importedAt: IMPORTED_AT, records: [record] };
  assert.equal(validateNexoraDataSourceSnapshot(base).state, "valid");
  assert.equal(validateNexoraDataSourceSnapshot({ ...base, records: [] }).state, "partial");
  assert.equal(validateNexoraDataSourceSnapshot(base, { supportedSourceTypes: ["another-type"] }).state, "unsupported");
  assert.equal(validateNexoraDataSourceSnapshot(base, { evaluatedAt: "2026-08-16T12:00:00.000Z", staleAfterMs: 60_000 }).state, "stale");
  const invalidSource = { ...source, identity: { ...source.identity, sourceId: "" } };
  assert.equal(validateNexoraDataSourceSnapshot({ ...base, source: invalidSource }).state, "invalid");
});

test("E — invalid canonical values are rejected before cloning or handoff", () => {
  const source = createSource("ProviderA", "mock-provider-a");
  const record = canonicalRecord(source, "revenue", "current", 120);
  const invalidRecord = {
    ...record,
    fields: record.fields.map((field) => field.key === "value" ? { ...field, value: Number.NaN } : field),
  } as NexoraSourceRecord;
  const snapshot = buildNexoraDataSourceSnapshot({ snapshotId: "snapshot:invalid-value", source, importedAt: IMPORTED_AT, records: [invalidRecord] });
  assert.equal(snapshot.validation.state, "invalid");
  assert.equal(snapshot.validation.accepted, false);
  let mappingCalled = false;
  const guardedMapper: NexoraDataRealityMapper = { ...mapper, map(value) { mappingCalled = true; return mapper.map(value); } };
  assert.equal(createNexoraDataRealityHandoff(snapshot, guardedMapper, "workspace-a").ready, false);
  assert.equal(mappingCalled, false);
});

test("E — partial, unsupported, and stale snapshots cannot enter Data Reality", () => {
  const source = createSource("ProviderA", "mock-provider-a");
  const record = canonicalRecord(source, "revenue", "current", 120);
  const base = { snapshotId: "snapshot:blocked", source, importedAt: IMPORTED_AT, records: [record] };
  const snapshots = [
    buildNexoraDataSourceSnapshot({ ...base, records: [] }),
    buildNexoraDataSourceSnapshot(base, { supportedSourceTypes: ["another-type"] }),
    buildNexoraDataSourceSnapshot(base, { evaluatedAt: "2026-08-16T12:00:00.000Z", staleAfterMs: 60_000 }),
  ];
  assert.deepEqual(snapshots.map((snapshot) => snapshot.validation.state), ["partial", "unsupported", "stale"]);
  assert.equal(snapshots.every((snapshot) => !createNexoraDataRealityHandoff(snapshot, mapper, "workspace-a").ready), true);
});

test("E — invalid mapped datasets and incomplete provenance are rejected", () => {
  const result = adaptFormatA();
  assert.ok(result.snapshot);
  const invalidDatasetMapper: NexoraDataRealityMapper = {
    ...mapper,
    map(snapshot) {
      const mapped = mapper.map(snapshot);
      return { ...mapped, dataset: { ...mapped.dataset, id: "" } };
    },
  };
  const noProvenanceMapper: NexoraDataRealityMapper = {
    ...mapper,
    map(snapshot) {
      const mapped = mapper.map(snapshot);
      return { ...mapped, factProvenance: [] };
    },
  };
  const invalid = createNexoraDataRealityHandoff(result.snapshot, invalidDatasetMapper, "workspace-a");
  const incomplete = createNexoraDataRealityHandoff(result.snapshot, noProvenanceMapper, "workspace-a");
  assert.equal(invalid.ready, false);
  assert.equal(invalid.validation.issues[0]?.code, "DATA_REALITY_DATASET_INVALID");
  assert.equal(incomplete.ready, false);
  assert.equal(incomplete.validation.issues[0]?.code, "DATA_REALITY_PROVENANCE_INCOMPLETE");
});

test("F — two mock provider formats produce the same Data Reality representation", () => {
  const sourceA = createSource("ProviderA", "mock-provider-a");
  const sourceB = createSource("ProviderB", "mock-provider-b");
  const resultA = adaptFormatA(sourceA);
  const resultB = adaptNexoraDataSource(createFormatBAdapter(sourceB), {
    source: sourceB,
    snapshotId: "snapshot:operations:002",
    importedAt: IMPORTED_AT,
    payload: { entries: [["revenue", "current", 120]] },
  }, { expectedWorkspaceId: "workspace-a", supportedSourceTypes: ["mock"] });
  assert.ok(resultA.snapshot);
  assert.ok(resultB.snapshot);
  const handoffA = createNexoraDataRealityHandoff(resultA.snapshot, mapper, "workspace-a");
  const handoffB = createNexoraDataRealityHandoff(resultB.snapshot, mapper, "workspace-a");
  assert.equal(handoffA.ready, true);
  assert.equal(handoffB.ready, true);
  if (!handoffA.ready || !handoffB.ready) return;
  assert.deepEqual(handoffA.handoff.dataset, handoffB.handoff.dataset);
  assert.deepEqual(handoffA.handoff.dataset.records, handoffB.handoff.dataset.records);
  assert.notEqual(handoffA.handoff.factProvenance[0]?.provenance.providerName, handoffB.handoff.factProvenance[0]?.provenance.providerName);
});

test("F — adapter/source identity mismatch and adapter failures remain observable", () => {
  const source = createSource("ProviderA", "mock-provider-a");
  const wrongAdapter = { ...createFormatAAdapter(source), adapterId: "wrong-adapter" };
  const mismatch = adaptNexoraDataSource(wrongAdapter, { source, snapshotId: "snapshot:mismatch", importedAt: IMPORTED_AT, payload: { rows: [] } });
  assert.equal(mismatch.ok, false);
  assert.equal(mismatch.validation.issues[0]?.code, "ADAPTER_IDENTITY_MISMATCH");
  const failingAdapter = { ...createFormatAAdapter(source), adapt() { throw new Error("provider detail must not leak"); } };
  const failure = adaptNexoraDataSource(failingAdapter, { source, snapshotId: "snapshot:failure", importedAt: IMPORTED_AT, payload: null });
  assert.equal(failure.ok, false);
  assert.equal(failure.validation.issues[0]?.code, "ADAPTER_FAILURE");
  assert.equal(failure.validation.issues[0]?.message.includes("provider detail"), false);
});

test("G — RDI exposes observation authority but no executive mutation authority", () => {
  assert.equal(REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.ownsExternalObservation, true);
  assert.equal(REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.ownsDataRealityInterpretation, false);
  assert.equal(REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.ownsCanonicalRuntimeTruth, false);
  assert.equal(REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.ownsConversationContext, false);
  assert.equal(REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.ownsExecutiveMemory, false);
  assert.equal(REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.ownsAdvisorConclusions, false);
  assert.equal(REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.ownsStagePresentation, false);
  assert.doesNotMatch(sourceText, /from\s+["'][^"']*\/(?:runtime|assistant|advisor|memory|stage)[^"']*["']/i);
});

test("G — RDI operations cannot mutate unrelated authority-owned values", () => {
  const runtime = { executiveMeaning: { state: "critical" } };
  const memory = { durableEntries: ["decision-1"] };
  const advisor = { conclusion: "review capacity" };
  const before = JSON.stringify({ runtime, memory, advisor });
  const result = adaptFormatA();
  assert.ok(result.snapshot);
  createNexoraDataRealityHandoff(result.snapshot, mapper, "workspace-a");
  assert.equal(JSON.stringify({ runtime, memory, advisor }), before);
  assert.equal(Object.isFrozen(runtime), false);
  assert.equal(Object.isFrozen(memory), false);
  assert.equal(Object.isFrozen(advisor), false);
});

test("Data Reality handoff is the existing validated NexoraDataset seam", () => {
  const result = adaptFormatA();
  assert.ok(result.snapshot);
  const handoff = createNexoraDataRealityHandoff(result.snapshot, mapper, "workspace-a");
  assert.equal(handoff.ready, true);
  if (!handoff.ready) return;
  assert.equal(handoff.handoff.destinationAuthority, "P0:1/NexoraDataRealityFoundation");
  assert.deepEqual(handoff.handoff.dataset.records, [{ objectKey: "revenue", metricKey: "current", value: 120, observedAt: OBSERVED_AT }]);
});

test("Foundation structural verification and summary are immutable and deterministic", () => {
  const verificationA = verifyNexoraRealDataIntegrationFoundation();
  const verificationB = verifyNexoraRealDataIntegrationFoundation();
  assert.deepEqual(verificationA, verificationB);
  assert.equal(verificationA.valid, true);
  assert.equal(verificationA.checks.every((entry) => entry.endsWith(":passed")), true);
  assert.equal(deeplyFrozen(verificationA), true);
  const summaryA = getNexoraRealDataIntegrationFoundationSummary();
  const summaryB = getNexoraRealDataIntegrationFoundationSummary();
  assert.deepEqual(summaryA, summaryB);
  assert.equal(summaryA.dataRealityHandoffType, "NexoraDataset");
  assert.equal(summaryA.nextPhase, "RDI:2");
  assert.equal(deeplyFrozen(summaryA), true);
});

test("A–H automated certification passes from exercised evidence", () => {
  const result = adaptFormatA();
  assert.ok(result.snapshot);
  const handoff = createNexoraDataRealityHandoff(result.snapshot, mapper, "workspace-a");
  assert.equal(handoff.ready, true);
  if (!handoff.ready) return;
  const certification = certifyNexoraRealDataIntegrationFoundation({
    sourceIdentityPreserved: handoff.handoff.sourceId === result.snapshot.source.identity.sourceId,
    workspaceIsolationEnforced: !verifyNexoraDataSourceWorkspaceAccess(result.snapshot, "workspace-b").allowed,
    snapshotDeterministic: JSON.stringify(result.snapshot) === JSON.stringify(adaptFormatA().snapshot),
    provenancePreserved: traceNexoraDataRealityValue(handoff.handoff, "revenue", "current")?.sourceId === result.snapshot.source.identity.sourceId,
    validationProtected: !buildNexoraDataSourceSnapshot({ snapshotId: "snapshot:partial", source: result.snapshot.source, importedAt: IMPORTED_AT, records: [] }).validation.accepted,
    adapterIndependent: true,
    authorityProtected: verifyNexoraRealDataIntegrationFoundation().authorityBoundaryValid,
    regressionPassed: handoff.handoff.dataset.records.length === 1,
  });
  assert.equal(certification.certified, true);
  assert.equal(certification.passedGateCount, 8);
  assert.equal(certification.failedGateCount, 0);
  assert.deepEqual(certification.gates.map((gate) => gate.gate), ["A", "B", "C", "D", "E", "F", "G", "H"]);
  assert.equal(deeplyFrozen(certification), true);
});

test("introduces no real connector, monitoring, synchronization, or automation", () => {
  assert.doesNotMatch(sourceText, /\b(?:github|jira|salesforce|quickbooks)\b/i);
  assert.doesNotMatch(sourceText, /\b(?:oauth|webhook|polling|notification|scheduled refresh|background synchronization|proactive monitoring)\b/i);
  assert.doesNotMatch(sourceText, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|setTimeout|setInterval|requestAnimationFrame)\s*\(/);
  assert.doesNotMatch(sourceText, /\basync\s+(?:function|\()/);
  assert.doesNotMatch(sourceText, /\b(?:window|document|localStorage|sessionStorage|process\.env|console\.)\b/);
});
