export type KpiId =
  | "delivery_on_time"
  | "cost_efficiency"
  | "quality_defects"
  | "risk_exposure"
  | "growth_conversion";

// up = higher is better, down = lower is better
export type KpiDirection = "up" | "down";

export type KpiDefinition = {
  id: KpiId;
  label: string;
  unit: string;
  target: number;
  direction: KpiDirection;
  description: string;
};

import { getActiveKpiDefs } from "../config/customerConfig";

const isKnown = (id: string): id is KpiId =>
  ([
    "delivery_on_time",
    "cost_efficiency",
    "quality_defects",
    "risk_exposure",
    "growth_conversion",
  ] as const).includes(id as KpiId);

const defs = getActiveKpiDefs();

export const KPI_REGISTRY: Record<KpiId, KpiDefinition> = Object.fromEntries(
  defs
    .filter((d) => isKnown(d.id))
    .map((d) => [
      d.id,
      {
        id: d.id,
        label: d.label,
        unit: d.unit,
        target: d.target,
        direction: d.direction,
        description: d.description,
      },
    ])
) as Record<KpiId, KpiDefinition>;
