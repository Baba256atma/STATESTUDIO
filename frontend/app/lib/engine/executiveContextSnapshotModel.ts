import type { ExecutiveContextSnapshotModelDescriptor } from "./executiveContextAssemblyModelTypes.ts";

export const ExecutiveContextSnapshotModel = Object.freeze({
  id: "eng-4-model-context-snapshot",
  name: "Context Snapshot Model",
  description: "Architectural model describing an immutable context snapshot without stored runtime data.",
  fields: Object.freeze([
    "snapshotId", "timestampMetadata", "includedDomains", "includedSources",
    "snapshotVersion", "snapshotStatus",
  ]),
  snapshotFields: Object.freeze({
    snapshotId: "snapshotId",
    timestampMetadata: "timestampMetadata",
    includedDomains: "includedDomains",
    includedSources: "includedSources",
    snapshotVersion: "snapshotVersion",
    snapshotStatus: "snapshotStatus",
  } as const),
  storesData: false,
  owner: "ENG-4",
  phase: "ENG-4:3",
  namespace: "nexora.engine.executive.context-assembly.model",
  version: "1.0.0",
  status: Object.freeze({
    model: "Model",
    metadataOnly: "MetadataOnly",
    immutable: "Immutable",
    runtimeFree: "RuntimeFree",
    deterministic: "Deterministic",
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveContextSnapshotModelDescriptor);
