/**
 * Phase A — Executive Field Metadata for imported enterprise columns.
 */

import type { Exs1ObjectId } from "../exs1Types";
import type { ExecutiveDomainId } from "./ExecutiveDomainRegistry";
import type { ExecutiveUnitId } from "./ExecutiveObjectMetadata";

export type ExecutiveFieldDataType =
  | "Number"
  | "Text"
  | "Date"
  | "Percent"
  | "Currency";

export type ExecutiveFieldMetadata = {
  readonly fieldId: string;
  readonly technicalName: string;
  readonly displayName: string;
  readonly dataType: ExecutiveFieldDataType;
  readonly businessMeaning: string;
  readonly mappedObjectId: Exs1ObjectId | null;
  readonly domainId: ExecutiveDomainId | null;
  readonly unitId: ExecutiveUnitId | null;
  readonly sourceHint: string;
  readonly synonyms: readonly string[];
};

export const INITIAL_FIELD_METADATA: readonly ExecutiveFieldMetadata[] =
  Object.freeze([
    {
      fieldId: "field-mat-qty",
      technicalName: "MAT_QTY",
      displayName: "Available Inventory",
      dataType: "Number",
      businessMeaning: "Current available stock quantity.",
      mappedObjectId: "inventory",
      domainId: "supply-chain",
      unitId: "pieces",
      sourceHint: "SAP / Inventory Qty",
      synonyms: ["Inventory Qty", "QTY_AVL", "Stock Qty"],
    },
    {
      fieldId: "field-revenue",
      technicalName: "Revenue",
      displayName: "Revenue",
      dataType: "Currency",
      businessMeaning: "Recognized commercial revenue.",
      mappedObjectId: "revenue",
      domainId: "finance",
      unitId: "usd",
      sourceHint: "sales.csv",
      synonyms: ["Sales", "Top Line"],
    },
    {
      fieldId: "field-customer",
      technicalName: "Customer",
      displayName: "Customer",
      dataType: "Text",
      businessMeaning: "Buying account identity.",
      mappedObjectId: "customer",
      domainId: "sales",
      unitId: null,
      sourceHint: "sales.csv",
      synonyms: ["Account", "Buyer"],
    },
    {
      fieldId: "field-region",
      technicalName: "Region",
      displayName: "Region",
      dataType: "Text",
      businessMeaning: "Commercial geography.",
      mappedObjectId: null,
      domainId: "sales",
      unitId: null,
      sourceHint: "sales.csv",
      synonyms: ["Territory", "Geo"],
    },
    {
      fieldId: "field-supplier-rating",
      technicalName: "Supplier Rating",
      displayName: "Supplier Rating",
      dataType: "Number",
      businessMeaning: "Inbound reliability score.",
      mappedObjectId: "supplier",
      domainId: "supply-chain",
      unitId: null,
      sourceHint: "Supplier Reliability API",
      synonyms: ["Vendor Score", "Reliability"],
    },
    {
      fieldId: "field-warehouse",
      technicalName: "Warehouse",
      displayName: "Warehouse",
      dataType: "Text",
      businessMeaning: "Storage node feeding production.",
      mappedObjectId: "inventory",
      domainId: "supply-chain",
      unitId: null,
      sourceHint: "Warehouse PostgreSQL",
      synonyms: ["DC", "Distribution Center"],
    },
  ]);
