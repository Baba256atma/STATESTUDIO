/**
 * Phase D — Deterministic executive simulation rules (no ML / forecasting).
 */

import type { Exs1ObjectId } from "../exs1Types";

export type SimulationStatus =
  | "Draft"
  | "Ready"
  | "Running"
  | "Completed"
  | "Cancelled"
  | "Archived";

export type SimulationAssumptionId =
  | "increase-safety-stock"
  | "supplier-delay"
  | "demand-growth"
  | "budget-reduction"
  | "production-expansion"
  | "price-increase"
  | "new-warehouse";

export type SimulationAssumption = {
  readonly id: SimulationAssumptionId;
  readonly label: string;
  readonly description: string;
  readonly explicit: true;
};

export type SimulationRiskLevel = "Low" | "Medium" | "High" | "Critical";

export type ImpactDirection = "Up" | "Down" | "Neutral" | "Mixed";

export type ImpactLevel = "Low" | "Medium" | "High";

export type ObjectMetricSnapshot = {
  readonly objectId: Exs1ObjectId;
  readonly label: string;
  readonly metric: string;
  readonly current: number;
  readonly unit: string;
};

export type BaselineSnapshot = {
  readonly capturedAt: number;
  readonly mode: string;
  readonly packId: string | null;
  readonly packTitle: string;
  readonly selectedObjectId: Exs1ObjectId | null;
  readonly scenarioId: string | null;
  readonly objects: readonly ObjectMetricSnapshot[];
  readonly kpis: readonly {
    readonly kpiId: string;
    readonly name: string;
    readonly current: number;
    readonly unit: string;
  }[];
};

export const SIMULATION_ASSUMPTIONS: readonly SimulationAssumption[] =
  Object.freeze([
    {
      id: "increase-safety-stock",
      label: "Increase Safety Stock",
      description: "Raise buffer inventory to absorb inbound variance.",
      explicit: true,
    },
    {
      id: "supplier-delay",
      label: "Supplier Delay",
      description: "Extend inbound lead time for critical suppliers.",
      explicit: true,
    },
    {
      id: "demand-growth",
      label: "Demand Growth",
      description: "Increase expected demand across commercial channels.",
      explicit: true,
    },
    {
      id: "budget-reduction",
      label: "Budget Reduction",
      description: "Reduce discretionary operating budget.",
      explicit: true,
    },
    {
      id: "production-expansion",
      label: "Production Expansion",
      description: "Expand factory throughput capacity.",
      explicit: true,
    },
    {
      id: "price-increase",
      label: "Price Increase",
      description: "Raise list price on constrained SKUs.",
      explicit: true,
    },
    {
      id: "new-warehouse",
      label: "New Warehouse",
      description: "Add regional warehouse capacity.",
      explicit: true,
    },
  ]);

/** Vertical-slice baseline metrics for Inventory Shortage reference. */
export const INVENTORY_SHORTAGE_BASELINE: BaselineSnapshot = Object.freeze({
  capturedAt: 0,
  mode: "Scenario",
  packId: "production-delay",
  packTitle: "Production Delay",
  selectedObjectId: "inventory" as Exs1ObjectId,
  scenarioId: null,
  objects: [
    {
      objectId: "inventory" as Exs1ObjectId,
      label: "Inventory",
      metric: "Available Units",
      current: 820,
      unit: "units",
    },
    {
      objectId: "revenue" as Exs1ObjectId,
      label: "Cash / Revenue",
      metric: "Working Cash",
      current: 2400,
      unit: "kUSD",
    },
    {
      objectId: "customer" as Exs1ObjectId,
      label: "Delivery",
      metric: "OTIF",
      current: 86,
      unit: "%",
    },
    {
      objectId: "factory" as Exs1ObjectId,
      label: "Factory",
      metric: "Throughput",
      current: 100,
      unit: "index",
    },
    {
      objectId: "supplier" as Exs1ObjectId,
      label: "Supplier",
      metric: "Reliability",
      current: 78,
      unit: "%",
    },
  ],
  kpis: [
    {
      kpiId: "kpi-inventory-health",
      name: "Inventory Health",
      current: 82,
      unit: "%",
    },
    {
      kpiId: "kpi-service-level",
      name: "Service Level",
      current: 86,
      unit: "%",
    },
    {
      kpiId: "kpi-cash-flexibility",
      name: "Cash Flexibility",
      current: 70,
      unit: "%",
    },
  ],
});

/**
 * Explicit deterministic deltas per assumption.
 * No hidden logic — values are configuration only.
 */
export type AssumptionEffect = {
  readonly objectDeltas: Readonly<Partial<Record<Exs1ObjectId, number>>>;
  readonly kpiDeltas: Readonly<Record<string, number>>;
  readonly risk: SimulationRiskLevel;
  readonly notes: string;
};

export const ASSUMPTION_EFFECTS: Readonly<
  Record<SimulationAssumptionId, AssumptionEffect>
> = Object.freeze({
  "increase-safety-stock": {
    objectDeltas: {
      inventory: 140,
      revenue: -120,
      customer: 5,
      factory: 2,
      supplier: 0,
    },
    kpiDeltas: {
      "kpi-inventory-health": 9,
      "kpi-service-level": 4,
      "kpi-cash-flexibility": -6,
    },
    risk: "Medium",
    notes: "Safety stock lifts cover days; working cash tightens temporarily.",
  },
  "supplier-delay": {
    objectDeltas: {
      inventory: -90,
      revenue: -40,
      customer: -8,
      factory: -5,
      supplier: -12,
    },
    kpiDeltas: {
      "kpi-inventory-health": -11,
      "kpi-service-level": -7,
      "kpi-cash-flexibility": -3,
    },
    risk: "High",
    notes: "Inbound delay compresses inventory and service.",
  },
  "demand-growth": {
    objectDeltas: {
      inventory: -60,
      revenue: 180,
      customer: 3,
      factory: 8,
      supplier: -4,
    },
    kpiDeltas: {
      "kpi-inventory-health": -5,
      "kpi-service-level": 2,
      "kpi-cash-flexibility": 4,
    },
    risk: "Medium",
    notes: "Demand growth improves cash but pressures stock.",
  },
  "budget-reduction": {
    objectDeltas: {
      inventory: -30,
      revenue: 80,
      customer: -4,
      factory: -6,
      supplier: 0,
    },
    kpiDeltas: {
      "kpi-inventory-health": -3,
      "kpi-service-level": -4,
      "kpi-cash-flexibility": 8,
    },
    risk: "High",
    notes: "Budget cuts free cash but reduce operational resilience.",
  },
  "production-expansion": {
    objectDeltas: {
      inventory: 80,
      revenue: -200,
      customer: 6,
      factory: 18,
      supplier: 2,
    },
    kpiDeltas: {
      "kpi-inventory-health": 6,
      "kpi-service-level": 5,
      "kpi-cash-flexibility": -10,
    },
    risk: "Medium",
    notes: "Capacity expansion improves delivery with front-loaded cash use.",
  },
  "price-increase": {
    objectDeltas: {
      inventory: 20,
      revenue: 150,
      customer: -5,
      factory: 0,
      supplier: 0,
    },
    kpiDeltas: {
      "kpi-inventory-health": 1,
      "kpi-service-level": -3,
      "kpi-cash-flexibility": 7,
    },
    risk: "Low",
    notes: "Price lift improves cash; service perception softens.",
  },
  "new-warehouse": {
    objectDeltas: {
      inventory: 110,
      revenue: -260,
      customer: 7,
      factory: 1,
      supplier: 3,
    },
    kpiDeltas: {
      "kpi-inventory-health": 8,
      "kpi-service-level": 6,
      "kpi-cash-flexibility": -12,
    },
    risk: "High",
    notes: "New warehouse expands cover with significant cash commitment.",
  },
});

export const STATIC_CONFIDENCE = 78;

export function getAssumption(
  id: SimulationAssumptionId,
): SimulationAssumption | undefined {
  return SIMULATION_ASSUMPTIONS.find((a) => a.id === id);
}
