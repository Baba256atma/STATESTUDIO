/**
 * P0:3 — Executive Operations canonical KPI definition registry.
 *
 * Definitions + computation metadata only — never hard-coded KPI results.
 * Cost remains data-bound without a fabricated KPI.
 *
 * Dataset A and Dataset B share this exact registry.
 */

import type { NexoraKPIDefinition } from "../dataRealityContracts.ts";

export const EXECUTIVE_OPERATIONS_KPI_DEFINITIONS: readonly NexoraKPIDefinition[] =
  Object.freeze([
    Object.freeze({
      id: "kpi.revenue.growth",
      objectKey: "revenue",
      name: "Revenue Growth",
      requiredMetrics: Object.freeze(["currentRevenue", "previousRevenue"]),
      unit: "%",
      computationKind: "growth-rate" as const,
    }),
    Object.freeze({
      id: "kpi.production.capacity-utilization",
      objectKey: "production",
      name: "Capacity Utilization",
      requiredMetrics: Object.freeze(["usedCapacity", "totalCapacity"]),
      unit: "%",
      computationKind: "ratio-percent" as const,
    }),
    Object.freeze({
      id: "kpi.warehouse.capacity-utilization",
      objectKey: "warehouse",
      name: "Warehouse Capacity Utilization",
      requiredMetrics: Object.freeze(["usedCapacity", "totalCapacity"]),
      unit: "%",
      computationKind: "ratio-percent" as const,
    }),
    Object.freeze({
      id: "kpi.shipping.on-time-rate",
      objectKey: "shipping",
      name: "On-Time Delivery Rate",
      requiredMetrics: Object.freeze([
        "onTimeDeliveries",
        "totalDeliveries",
      ]),
      unit: "%",
      computationKind: "ratio-percent" as const,
    }),
    Object.freeze({
      id: "kpi.customer.satisfaction-index",
      objectKey: "customer",
      name: "Customer Satisfaction Index",
      requiredMetrics: Object.freeze([
        "satisfactionScore",
        "maximumSatisfactionScore",
      ]),
      unit: "%",
      computationKind: "score-percent" as const,
    }),
  ]);

export function getExecutiveOperationsKpiDefinitions(): readonly NexoraKPIDefinition[] {
  return EXECUTIVE_OPERATIONS_KPI_DEFINITIONS;
}

export function countExecutiveOperationsKpiDefinitions(): number {
  return EXECUTIVE_OPERATIONS_KPI_DEFINITIONS.length;
}
