/**
 * DS:1:4 — Object Mapping Foundation contract.
 *
 * Preview only: no Nexora object creation or scene mutation.
 */

import type { DataSourceRegistryEntry } from "./dataSourceRegistryContract.ts";

export const DS_1_4_OBJECT_MAPPING_FOUNDATION_TAG =
  "[DS:1:4_OBJECT_MAPPING_FOUNDATION]" as const;

export type DataSourceMappedObjectType =
  | "supplier"
  | "project"
  | "customer"
  | "inventory"
  | "production"
  | "revenue"
  | "warehouse"
  | "risk"
  | "generic_business_object";

export type DataSourceObjectTypeDetection = Readonly<{
  objectType: DataSourceMappedObjectType;
  objectTypeLabel: string;
  confidence: "high" | "medium" | "low";
  matchedSignal: string | null;
  sourceId: string | null;
  sourceName: string;
}>;

export type ObjectCreationPreviewItem = Readonly<{
  previewObjectId: string;
  label: string;
  objectType: DataSourceMappedObjectType;
  objectTypeLabel: string;
  sourceId: string;
}>;

export type ObjectCreationPreview = Readonly<{
  source: DataSourceRegistryEntry;
  mapping: DataSourceObjectTypeDetection;
  estimatedObjectCount: number;
  previewObjects: readonly ObjectCreationPreviewItem[];
  previewOnly: true;
  createsObjects: false;
  reason: string;
}>;

