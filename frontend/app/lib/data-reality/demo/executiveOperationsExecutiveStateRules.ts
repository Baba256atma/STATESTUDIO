/**
 * P0:4 — Executive Operations canonical executive-state rule registry.
 *
 * Demo business thresholds for proving Data Reality — not industry standards.
 * Dataset A and Dataset B share this exact registry.
 *
 * KPI → Executive State Rule (never Stage object → threshold).
 */

import type { NexoraExecutiveStateRule } from "../dataRealityContracts.ts";

export const EXECUTIVE_OPERATIONS_EXECUTIVE_STATE_RULES: readonly NexoraExecutiveStateRule[] =
  Object.freeze([
    Object.freeze({
      id: "revenue-growth-state-rule",
      kpiId: "kpi.revenue.growth",
      objectKey: "revenue",
      kpiName: "Revenue Growth",
      worseWhen: "lower" as const,
      bands: Object.freeze([
        Object.freeze({ state: "critical" as const, maxExclusive: 0 }),
        Object.freeze({
          state: "attention" as const,
          minInclusive: 0,
          maxExclusive: 3,
        }),
        Object.freeze({ state: "normal" as const, minInclusive: 3 }),
      ]),
    }),
    Object.freeze({
      id: "production-capacity-state-rule",
      kpiId: "kpi.production.capacity-utilization",
      objectKey: "production",
      kpiName: "Capacity Utilization",
      worseWhen: "higher" as const,
      bands: Object.freeze([
        Object.freeze({ state: "normal" as const, maxExclusive: 85 }),
        Object.freeze({
          state: "attention" as const,
          minInclusive: 85,
          maxExclusive: 95,
        }),
        Object.freeze({ state: "critical" as const, minInclusive: 95 }),
      ]),
    }),
    Object.freeze({
      id: "warehouse-utilization-state-rule",
      kpiId: "kpi.warehouse.capacity-utilization",
      objectKey: "warehouse",
      kpiName: "Warehouse Capacity Utilization",
      worseWhen: "higher" as const,
      bands: Object.freeze([
        Object.freeze({ state: "normal" as const, maxExclusive: 85 }),
        Object.freeze({
          state: "attention" as const,
          minInclusive: 85,
          maxExclusive: 95,
        }),
        Object.freeze({ state: "critical" as const, minInclusive: 95 }),
      ]),
    }),
    Object.freeze({
      id: "shipping-ontime-state-rule",
      kpiId: "kpi.shipping.on-time-rate",
      objectKey: "shipping",
      kpiName: "On-Time Delivery Rate",
      worseWhen: "lower" as const,
      bands: Object.freeze([
        Object.freeze({ state: "critical" as const, maxExclusive: 85 }),
        Object.freeze({
          state: "attention" as const,
          minInclusive: 85,
          maxExclusive: 95,
        }),
        Object.freeze({ state: "normal" as const, minInclusive: 95 }),
      ]),
    }),
    Object.freeze({
      id: "customer-satisfaction-state-rule",
      kpiId: "kpi.customer.satisfaction-index",
      objectKey: "customer",
      kpiName: "Customer Satisfaction Index",
      worseWhen: "lower" as const,
      bands: Object.freeze([
        Object.freeze({ state: "critical" as const, maxExclusive: 75 }),
        Object.freeze({
          state: "attention" as const,
          minInclusive: 75,
          maxExclusive: 85,
        }),
        Object.freeze({ state: "normal" as const, minInclusive: 85 }),
      ]),
    }),
  ]);

export function getExecutiveOperationsExecutiveStateRules(): readonly NexoraExecutiveStateRule[] {
  return EXECUTIVE_OPERATIONS_EXECUTIVE_STATE_RULES;
}

export function countExecutiveOperationsExecutiveStateRules(): number {
  return EXECUTIVE_OPERATIONS_EXECUTIVE_STATE_RULES.length;
}
