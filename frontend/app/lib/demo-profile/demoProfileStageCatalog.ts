/**
 * DEMO-STAGE-EMPTY-FIX:1 — active demo package → Stage catalog.
 *
 * Objects come from the committed package datasets and the existing CSV
 * object-key / Stage identity maps. Product fixtures are not copied in.
 */
import { CSV_MAPPING_TARGETS } from "../data-reality/csvRealDataVerticalSlice.ts";
import type { NexoraDataset, NexoraDatasetRecord } from "../data-reality/dataRealityContracts.ts";
import { NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS } from "../data-reality/dataRealityStageProjection.ts";
import { EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP } from "../data-reality/demo/executiveOperationsObjectBindings.ts";
import { listCsvRealDataImports } from "../data-reality/csvRealDataImportStore.ts";
import {
  createEmptyNexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraMVPStageObjectFixture } from "../nex-mvp/nexoraMVPStageFixtures.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { demoProfileImportPrefix, type DemoProfileId } from "./demoProfileContract.ts";
import { readActiveDemoProfile } from "./demoProfileStore.ts";

export function resolveActiveDemoProfileStageMaterials(): Readonly<{
  profileId: DemoProfileId;
  catalog: NexoraMVPObjectInteractionCatalog;
  dataset: NexoraDataset;
}> | null {
  const profileId = readActiveDemoProfile();
  if (!profileId) return null;
  const prefix = demoProfileImportPrefix(profileId);
  const imports = listCsvRealDataImports(DEMO_WORKSPACE_ID).filter((entry) =>
    entry.importId.startsWith(prefix) && entry.workspaceId === DEMO_WORKSPACE_ID,
  );
  const records: NexoraDatasetRecord[] = [];
  const objectKeys = new Set<string>();
  for (const entry of imports) {
    const dataset = entry.prepared.handoff?.dataset;
    if (!dataset) continue;
    for (const record of dataset.records) {
      if (!record.objectKey) continue;
      objectKeys.add(record.objectKey);
      records.push(record);
    }
  }
  const objects = [...objectKeys].sort().map((objectKey, index): NexoraMVPStageObjectFixture => {
    const binding = NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS.find(
      (entry) => entry.objectKey === objectKey,
    );
    const identity = EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP.find(
      (entry) => entry.objectKey === objectKey,
    );
    const targets = CSV_MAPPING_TARGETS.filter((entry) => entry.objectKey === objectKey);
    const label = identity?.caption
      ?? (targets.length === 1 ? targets[0]!.label : titleFromObjectKey(objectKey));
    return Object.freeze({
      id: binding?.mvpStageObjectId ?? `demo-subject:${profileId}:${objectKey}`,
      label,
      kind: "object" as const,
      managerWorkspaceId: DEMO_WORKSPACE_ID,
      position: [index * 1.4, 0, 0] as const,
      status: "stable" as const,
      attention: "normal" as const,
    });
  });
  return Object.freeze({
    profileId,
    catalog: Object.freeze({
      ...createEmptyNexoraMVPObjectInteractionCatalog(),
      objects: Object.freeze(objects),
    }),
    dataset: Object.freeze({
      id: `demo-profile:${profileId}:${DEMO_WORKSPACE_ID}`,
      name: profileId,
      version: "1",
      capturedAt: records[0]?.observedAt ?? "1970-01-01T00:00:00.000Z",
      source: "csv" as const,
      familyId: `demo-profile:${profileId}`,
      scenario: "baseline" as const,
      records: Object.freeze(records),
    }),
  });
}

function titleFromObjectKey(objectKey: string): string {
  return objectKey
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}
