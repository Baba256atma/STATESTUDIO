/**
 * BUSINESS-DEMO-STAGE-AND-SELECTOR:1 — Stage catalog for business_demo_workspace.
 *
 * Objects are derived from the committed Business Demo CSV package.
 * This is not a demo profile and does not read Manufacturing or Project imports.
 */
import { listCsvRealDataImports } from "../data-reality/csvRealDataImportStore.ts";
import type { NexoraDataset, NexoraDatasetRecord } from "../data-reality/dataRealityContracts.ts";
import {
  createEmptyNexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraMVPStageObjectFixture } from "../nex-mvp/nexoraMVPStageFixtures.ts";
import { readLiveExecutiveDataWorkspaceId } from "../workspace/managerWorkspaceIdentity.ts";
import { BUSINESS_DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { BUSINESS_DEMO_IMPORT_PREFIX } from "./businessDemoPackage.ts";

export const BUSINESS_DEMO_STAGE_OBJECTS = Object.freeze([
  Object.freeze({
    objectKey: "revenue",
    id: `business-demo:${BUSINESS_DEMO_WORKSPACE_ID}:revenue`,
    label: "Revenue",
    position: [-2.4, 0.35, -0.6] as const,
  }),
  Object.freeze({
    objectKey: "inventory",
    id: `business-demo:${BUSINESS_DEMO_WORKSPACE_ID}:inventory`,
    label: "Inventory",
    position: [-0.9, 0.2, 1.1] as const,
  }),
  Object.freeze({
    objectKey: "cost",
    id: `business-demo:${BUSINESS_DEMO_WORKSPACE_ID}:cost`,
    label: "Operating Cost",
    position: [1.8, 0.25, -1.0] as const,
  }),
]);

export function resolveBusinessDemoStageMaterials(): Readonly<{
  catalog: NexoraMVPObjectInteractionCatalog;
  dataset: NexoraDataset;
}> | null {
  if (readLiveExecutiveDataWorkspaceId() !== BUSINESS_DEMO_WORKSPACE_ID) return null;
  const imports = listCsvRealDataImports(BUSINESS_DEMO_WORKSPACE_ID).filter((entry) =>
    entry.workspaceId === BUSINESS_DEMO_WORKSPACE_ID &&
    entry.importId.startsWith(`${BUSINESS_DEMO_IMPORT_PREFIX}${BUSINESS_DEMO_WORKSPACE_ID}:`),
  );
  const records: NexoraDatasetRecord[] = [];
  const objectKeys = new Set<string>();
  for (const entry of imports) {
    const dataset = entry.prepared.handoff?.dataset;
    if (!dataset || dataset.records.some((record) => record.objectKey && !ownedByBusinessDemo(record.objectKey))) continue;
    for (const record of dataset.records) {
      if (!record.objectKey || !ownedByBusinessDemo(record.objectKey)) continue;
      objectKeys.add(record.objectKey);
      records.push(record);
    }
  }
  const objects = BUSINESS_DEMO_STAGE_OBJECTS.filter((entry) => objectKeys.has(entry.objectKey));
  if (objects.length === 0) return null;
  return Object.freeze({
    catalog: Object.freeze({
      ...createEmptyNexoraMVPObjectInteractionCatalog(),
      objects: Object.freeze(objects.map((entry): NexoraMVPStageObjectFixture => {
        const primaryValue = resolveBusinessDemoStageLabelValue(records, entry.objectKey);
        return Object.freeze({
          id: entry.id,
          label: entry.label,
          kind: "object" as const,
          managerWorkspaceId: BUSINESS_DEMO_WORKSPACE_ID,
          position: entry.position,
          status: "stable" as const,
          attention: "normal" as const,
          ...(primaryValue != null ? { primaryValue } : {}),
        });
      })),
    }),
    dataset: Object.freeze({
      id: `business-demo:${BUSINESS_DEMO_WORKSPACE_ID}`,
      name: "Business Demo",
      version: "1",
      capturedAt: records[0]?.observedAt ?? "1970-01-01T00:00:00.000Z",
      source: "csv" as const,
      familyId: `business-demo:${BUSINESS_DEMO_WORKSPACE_ID}`,
      scenario: "baseline" as const,
      records: Object.freeze(records),
    }),
  });
}

const BUSINESS_DEMO_LABEL_METRICS = Object.freeze({
  revenue: "currentRevenue",
  inventory: "onHand",
  cost: "operatingCost",
} as const);

/**
 * Display text for one Business Demo object.
 * Uses the single committed aggregate for that object's primary metric.
 * Previous revenue stays in the dataset and is not rendered as a trend.
 */
export function resolveBusinessDemoStageLabelValue(
  records: readonly NexoraDatasetRecord[],
  objectKey: keyof typeof BUSINESS_DEMO_LABEL_METRICS,
): string | null {
  const metricKey = BUSINESS_DEMO_LABEL_METRICS[objectKey];
  const matches = records.filter(
    (record) =>
      record.objectKey === objectKey &&
      record.metricKey === metricKey &&
      Number.isFinite(record.value),
  );
  if (matches.length !== 1) return null;
  const record = matches[0]!;
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 6,
    useGrouping: true,
  }).format(record.value);
  const unit = typeof record.unit === "string" ? record.unit.trim() : "";
  return unit.length > 0 ? `${formatted} ${unit}` : formatted;
}

export function readBusinessDemoOwnedLabelValue(
  objectId: string,
  primaryValue: string | null | undefined,
): string | null {
  if (!objectId.startsWith(`business-demo:${BUSINESS_DEMO_WORKSPACE_ID}:`)) return null;
  const value = primaryValue?.trim() ?? "";
  return value.length > 0 ? value : null;
}

function ownedByBusinessDemo(objectKey: string): boolean {
  return BUSINESS_DEMO_STAGE_OBJECTS.some((entry) => entry.objectKey === objectKey);
}
