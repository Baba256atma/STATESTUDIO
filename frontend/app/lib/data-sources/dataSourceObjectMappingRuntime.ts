import type { DataSourceRegistryEntry } from "./dataSourceRegistryContract.ts";
import {
  type DataSourceMappedObjectType,
  type DataSourceObjectTypeDetection,
  type ObjectCreationPreview,
  type ObjectCreationPreviewItem,
} from "./dataSourceObjectMappingContract.ts";

const OBJECT_TYPE_LABELS: Readonly<Record<DataSourceMappedObjectType, string>> = Object.freeze({
  supplier: "Supplier",
  project: "Project",
  customer: "Customer",
  inventory: "Inventory",
  production: "Production",
  revenue: "Revenue",
  warehouse: "Warehouse",
  risk: "Risk",
  generic_business_object: "Business Object",
});

const OBJECT_TYPE_SIGNALS: ReadonlyArray<Readonly<{
  objectType: DataSourceMappedObjectType;
  signals: readonly string[];
}>> = Object.freeze([
  Object.freeze({ objectType: "supplier", signals: Object.freeze(["supplier", "vendor", "procurement", "purchase"]) }),
  Object.freeze({ objectType: "project", signals: Object.freeze(["project", "program", "initiative", "milestone"]) }),
  Object.freeze({ objectType: "customer", signals: Object.freeze(["customer", "client", "account", "buyer"]) }),
  Object.freeze({ objectType: "inventory", signals: Object.freeze(["inventory", "stock", "sku", "item"]) }),
  Object.freeze({ objectType: "production", signals: Object.freeze(["production", "manufacturing", "line", "plant"]) }),
  Object.freeze({ objectType: "revenue", signals: Object.freeze(["revenue", "sales", "booking", "pipeline"]) }),
  Object.freeze({ objectType: "warehouse", signals: Object.freeze(["warehouse", "facility", "fulfillment", "distribution"]) }),
  Object.freeze({ objectType: "risk", signals: Object.freeze(["risk", "incident", "issue", "threat"]) }),
]);

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

function normalizeIdPart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "object";
}

function resolveDetectionConfidence(input: {
  sourceName: string;
  matchedSignal: string | null;
}): "high" | "medium" | "low" {
  if (!input.matchedSignal) return "low";
  const normalizedName = normalizeText(input.sourceName);
  if (normalizedName.split(/\s+/).includes(input.matchedSignal)) return "high";
  return "medium";
}

function coerceSourceLike(input: DataSourceRegistryEntry | string): {
  sourceId: string | null;
  sourceName: string;
} {
  if (typeof input === "string") {
    return { sourceId: null, sourceName: input.trim() };
  }
  return {
    sourceId: input.sourceId,
    sourceName: input.sourceName,
  };
}

export function mapSourceToObjectType(
  sourceInput: DataSourceRegistryEntry | string
): DataSourceObjectTypeDetection {
  const source = coerceSourceLike(sourceInput);
  const normalizedName = normalizeText(source.sourceName);

  for (const candidate of OBJECT_TYPE_SIGNALS) {
    const matchedSignal =
      candidate.signals.find((signal) => normalizedName.includes(signal)) ?? null;
    if (matchedSignal) {
      return Object.freeze({
        objectType: candidate.objectType,
        objectTypeLabel: OBJECT_TYPE_LABELS[candidate.objectType],
        confidence: resolveDetectionConfidence({
          sourceName: source.sourceName,
          matchedSignal,
        }),
        matchedSignal,
        sourceId: source.sourceId,
        sourceName: source.sourceName,
      });
    }
  }

  return Object.freeze({
    objectType: "generic_business_object",
    objectTypeLabel: OBJECT_TYPE_LABELS.generic_business_object,
    confidence: "low",
    matchedSignal: null,
    sourceId: source.sourceId,
    sourceName: source.sourceName,
  });
}

function buildPreviewObjects(
  source: DataSourceRegistryEntry,
  mapping: DataSourceObjectTypeDetection
): readonly ObjectCreationPreviewItem[] {
  const previewCount = Math.min(3, Math.max(0, source.recordCount));
  return Object.freeze(
    Array.from({ length: previewCount }, (_, index): ObjectCreationPreviewItem => {
      const ordinal = index + 1;
      return Object.freeze({
        previewObjectId: `preview:${source.sourceId}:${mapping.objectType}:${ordinal}`,
        label: `${mapping.objectTypeLabel} ${ordinal}`,
        objectType: mapping.objectType,
        objectTypeLabel: mapping.objectTypeLabel,
        sourceId: source.sourceId,
      });
    })
  );
}

export function previewObjectCreation(source: DataSourceRegistryEntry): ObjectCreationPreview {
  const mapping = mapSourceToObjectType(source);
  const estimatedObjectCount = Math.max(0, source.recordCount);
  const previewObjects = buildPreviewObjects(source, mapping);
  const sourceSlug = normalizeIdPart(source.sourceName);

  return Object.freeze({
    source,
    mapping,
    estimatedObjectCount,
    previewObjects,
    previewOnly: true,
    createsObjects: false,
    reason:
      estimatedObjectCount > 0
        ? `preview_${sourceSlug}_to_${mapping.objectType}`
        : "preview_empty_source",
  });
}

