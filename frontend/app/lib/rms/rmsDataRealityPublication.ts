/**
 * NPA-T RMS:3 — publish Observable Data through existing RDI → Data Reality.
 * RMS is an external operational source. It does not confirm field meaning.
 */

import {
  adaptNexoraDataSource,
  createNexoraDataRealityHandoff,
  REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY,
  type NexoraDataRealityHandoffResult,
  type NexoraDataSource,
  type NexoraDataSourceAdapter,
  type NexoraDataRealityMapper,
  type NexoraDataSourceProvenance,
  type NexoraSourceRecord,
} from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import { resolveSemanticCandidates } from "@/app/lib/data-reality/semanticCandidateIntelligence.ts";
import type { RmsObservableRecord } from "./rmsOperatorContract.ts";
import { RMS_3_BOUNDARY } from "./rmsOperatorContract.ts";
import { RMS_DEFAULT_OBSERVATION_POLICY } from "./rmsObservationPolicy.ts";

export const RMS_OPERATOR_ADAPTER_ID = "rdi-adapter:rms-operator" as const;
export const RMS_OPERATOR_PROVIDER = "RMS Operator Agent" as const;
export const RMS_OPERATOR_SOURCE_TYPE = "api" as const;

export function createRmsOperatorDataSource(input: {
  readonly workspaceId: string;
  readonly runId: string;
  readonly observedAt: string;
}): NexoraDataSource {
  return Object.freeze({
    identity: Object.freeze({
      sourceId: `source:rms-operator:${input.runId}`,
      sourceType: RMS_OPERATOR_SOURCE_TYPE,
      workspaceId: input.workspaceId,
      providerName: RMS_OPERATOR_PROVIDER,
      connectionId: `import:${input.runId}`,
      observedAt: input.observedAt,
      schemaVersion: "1.0",
    }),
    metadata: Object.freeze({
      displayName: "Simulated operational source",
      description: "RMS Operator Agent observable records",
      configurationRef: null,
      tags: Object.freeze(["rms-operator", "observable-data"]),
    }),
    adapterId: RMS_OPERATOR_ADAPTER_ID,
  });
}

export function createRmsOperatorSourceAdapter(): NexoraDataSourceAdapter {
  return Object.freeze({
    adapterId: RMS_OPERATOR_ADAPTER_ID,
    adapterVersion: "1.0.0",
    sourceType: RMS_OPERATOR_SOURCE_TYPE,
    providerName: RMS_OPERATOR_PROVIDER,
    adapt(input) {
      const records = (input.payload as { records: readonly RmsObservableRecord[] }).records
        .filter((item) => item.status === "AVAILABLE" && typeof item.value === "number")
        .map((item) => toSourceRecord(input.source, item, input.importedAt));
      return { records };
    },
  });
}

export const rmsOperatorDataRealityMapper: NexoraDataRealityMapper = Object.freeze({
  mappingId: "mapping:rms-operator-v1",
  mappingVersion: "1.0.0",
  map(snapshot) {
    return {
      dataset: {
        id: `rdi:rms-operator:${snapshot.snapshotId}`,
        name: "RMS Operator Observable Dataset",
        version: "1.0.0",
        capturedAt: snapshot.source.identity.observedAt,
        source: "api",
        familyId: "rdi:rms-operator",
        scenario: "baseline",
        records: snapshot.records.map((record) => ({
          objectKey: String(fieldValue(record, "objectKey")),
          metricKey: String(fieldValue(record, "metricKey")),
          value: Number(fieldValue(record, "value")),
          unit: optionalString(record, "unit") ?? undefined,
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
});

export function publishRmsObservableToDataReality(input: {
  readonly records: readonly RmsObservableRecord[];
  readonly runId: string;
  readonly workspaceId?: string;
}): {
  readonly adapterOk: boolean;
  readonly handoff: NexoraDataRealityHandoffResult;
  readonly semanticCapAv: ReturnType<typeof resolveSemanticCandidates>;
  readonly destinationAuthority: typeof REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.dataRealityAuthority;
} {
  if (RMS_3_BOUNDARY.parallelDataReality) throw new Error("RMS:3 must not create Data Reality");
  if (RMS_3_BOUNDARY.simulationConfirmsSemantics) throw new Error("RMS:3 must not confirm semantics");
  const available = input.records.filter((item) => item.status === "AVAILABLE" && typeof item.value === "number");
  const observedAt = available[0]?.simulatedAt ?? input.records[0]?.simulatedAt ?? "2026-09-16T00:00:00.000Z";
  const source = createRmsOperatorDataSource({
    workspaceId: input.workspaceId ?? "workspace-a",
    runId: input.runId,
    observedAt,
  });
  const adapted = adaptNexoraDataSource(createRmsOperatorSourceAdapter(), {
    source,
    snapshotId: `snapshot:rms-operator:${input.runId}:${observedAt}`,
    importedAt: observedAt,
    payload: { records: available },
  });
  const handoff = adapted.snapshot
    ? createNexoraDataRealityHandoff(adapted.snapshot, rmsOperatorDataRealityMapper, source.identity.workspaceId)
    : { ready: false as const, handoff: null, validation: adapted.validation };
  return Object.freeze({
    adapterOk: adapted.ok,
    handoff,
    semanticCapAv: resolveSemanticCandidates({
      term: "CAP_AV",
      sourceLabel: "rms-operator",
      confirmationSource: "none",
    }),
    destinationAuthority: REAL_DATA_INTEGRATION_AUTHORITY_BOUNDARY.dataRealityAuthority,
  });
}

export function objectKeyForField(field: string): string {
  return RMS_DEFAULT_OBSERVATION_POLICY.find((rule) => rule.field === field)?.objectKey ?? "operations";
}

function toSourceRecord(source: NexoraDataSource, item: RmsObservableRecord, importedAt: string): NexoraSourceRecord {
  const recordId = item.recordId;
  const objectKey = objectKeyForField(item.field);
  return Object.freeze({
    recordId,
    provenance: provenance(source, recordId, null, importedAt),
    fields: Object.freeze([
      field(source, recordId, "objectKey", "string", objectKey, importedAt),
      field(source, recordId, "metricKey", "string", item.field, importedAt),
      field(source, recordId, "value", "number", item.value as number, importedAt),
      field(source, recordId, "unit", "string", item.unit ?? "", importedAt),
    ]),
  });
}

function provenance(
  source: NexoraDataSource,
  recordId: string,
  sourceFieldKey: string | null,
  importedAt: string,
): NexoraDataSourceProvenance {
  return Object.freeze({
    sourceId: source.identity.sourceId,
    sourceType: source.identity.sourceType,
    providerName: source.identity.providerName,
    sourceRecordId: recordId,
    sourceFieldKey,
    observedAt: source.identity.observedAt,
    importedAt,
    transformationRef: "adapter:rdi-adapter:rms-operator:observable-v1",
    confidenceState: "unverified",
    confidence: null,
  });
}

function field(
  source: NexoraDataSource,
  recordId: string,
  key: string,
  sourceDataType: string,
  value: string | number,
  importedAt: string,
) {
  return Object.freeze({
    key,
    sourceDataType,
    value,
    provenance: provenance(source, recordId, key, importedAt),
  });
}

function fieldValue(record: NexoraSourceRecord, key: string): string | number {
  const value = record.fields.find((item) => item.key === key)?.value;
  if (typeof value !== "string" && typeof value !== "number") throw new Error(`Missing ${key}`);
  return value;
}

function optionalString(record: NexoraSourceRecord, key: string): string | null {
  const value = record.fields.find((item) => item.key === key)?.value;
  return typeof value === "string" && value.length > 0 ? value : null;
}
