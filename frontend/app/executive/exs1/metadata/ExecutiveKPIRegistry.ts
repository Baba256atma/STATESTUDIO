/**
 * Phase A — KPI Registry (metadata only, no calculations).
 */

import type { Exs1ObjectId } from "../exs1Types";
import type { ExecutiveDomainId } from "./ExecutiveDomainRegistry";

export type ExecutiveKPIMetadata = {
  readonly kpiId: string;
  readonly name: string;
  readonly description: string;
  readonly domainId: ExecutiveDomainId;
  readonly relatedObjectIds: readonly Exs1ObjectId[];
  readonly relatedFieldIds: readonly string[];
};

export const INITIAL_KPI_METADATA: readonly ExecutiveKPIMetadata[] =
  Object.freeze([
    {
      kpiId: "kpi-inventory-health",
      name: "Inventory Health",
      description: "Inventory availability relative to executive cover targets.",
      domainId: "supply-chain",
      relatedObjectIds: ["inventory", "factory", "supplier"],
      relatedFieldIds: ["field-mat-qty", "field-warehouse"],
    },
    {
      kpiId: "kpi-revenue-performance",
      name: "Revenue Performance",
      description: "Commercial outcome versus expected recovery band.",
      domainId: "finance",
      relatedObjectIds: ["revenue", "customer"],
      relatedFieldIds: ["field-revenue", "field-customer"],
    },
    {
      kpiId: "kpi-supplier-reliability",
      name: "Supplier Reliability",
      description: "Inbound partner reliability for capacity expansion.",
      domainId: "supply-chain",
      relatedObjectIds: ["supplier", "factory"],
      relatedFieldIds: ["field-supplier-rating"],
    },
  ]);
