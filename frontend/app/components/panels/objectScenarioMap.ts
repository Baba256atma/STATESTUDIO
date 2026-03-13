export type ObjectScenarioImpact = {
  key: string;
  objectId: string;
  label: string;
  reason: string;
};

export function mapScenarioDeltaToObjects(delta: Record<string, number>): ObjectScenarioImpact[] {
  const out: ObjectScenarioImpact[] = [];

  for (const [key, value] of Object.entries(delta || {})) {
    if (key === "inventory") {
      out.push({
        key,
        objectId: "obj_inventory",
        label: "Inventory",
        reason: value >= 0 ? "Inventory buffer increases." : "Inventory pressure increases.",
      });
    } else if (key === "delivery") {
      out.push({
        key,
        objectId: "obj_delivery",
        label: "Delivery",
        reason: value >= 0 ? "Delivery capability improves." : "Delivery pressure increases.",
      });
    } else if (key === "risk") {
      out.push({
        key,
        objectId: "obj_risk_zone",
        label: "Risk Zone",
        reason: value <= 0 ? "Risk exposure decreases." : "Risk exposure increases.",
      });
    } else if (key === "quality") {
      out.push({
        key,
        objectId: "obj_quality",
        label: "Quality",
        reason: value >= 0 ? "Quality resilience improves." : "Quality risk increases.",
      });
    } else if (key === "throughput") {
      out.push({
        key,
        objectId: "obj_throughput",
        label: "Throughput",
        reason: value >= 0 ? "System flow improves." : "System flow weakens.",
      });
    } else if (key === "cashflow") {
      out.push({
        key,
        objectId: "obj_cashflow",
        label: "Cashflow",
        reason: value >= 0 ? "Financial resilience improves." : "Financial stress increases.",
      });
    }
  }

  return out;
}
