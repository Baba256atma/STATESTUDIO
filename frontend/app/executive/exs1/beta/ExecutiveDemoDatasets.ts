/**
 * Phase E — Official demo datasets (one executive story each).
 */

export type DemoDatasetId =
  | "manufacturing"
  | "supply-chain"
  | "finance"
  | "pmo"
  | "retail";

export type DemoDataset = {
  readonly id: DemoDatasetId;
  readonly name: string;
  readonly company: string;
  readonly model: string;
  readonly pack: string;
  readonly story: string;
  readonly csvHint: string;
  readonly focusObjects: readonly string[];
};

export const OFFICIAL_DEMO_DATASETS: readonly DemoDataset[] = Object.freeze([
  {
    id: "manufacturing",
    name: "Manufacturing Demo",
    company: "Nova Manufacturing",
    model: "Supply Chain",
    pack: "Production Delay",
    story: "Recover OTIF after a production delay by raising safety stock.",
    csvHint: "inventory.csv",
    focusObjects: ["Inventory", "Factory", "Supplier"],
  },
  {
    id: "supply-chain",
    name: "Supply Chain Demo",
    company: "Nova Manufacturing",
    model: "Supply Chain",
    pack: "Inbound Risk",
    story: "Stabilize inbound reliability while protecting cover days.",
    csvHint: "supplier-reliability.csv",
    focusObjects: ["Supplier", "Inventory", "Customer"],
  },
  {
    id: "finance",
    name: "Finance Demo",
    company: "Nova Manufacturing",
    model: "Finance",
    pack: "Cash Flexibility",
    story: "Balance working cash against service recovery investments.",
    csvHint: "cash-flexibility.csv",
    focusObjects: ["Revenue", "Decision", "Inventory"],
  },
  {
    id: "pmo",
    name: "PMO Demo",
    company: "Nova Manufacturing",
    model: "PMO",
    pack: "Capacity Program",
    story: "Track execution of a capacity expansion program.",
    csvHint: "program-milestones.csv",
    focusObjects: ["Factory", "Decision", "Customer"],
  },
  {
    id: "retail",
    name: "Retail Demo",
    company: "Harbor Retail",
    model: "Retail Ops",
    pack: "Demand Spike",
    story: "Respond to a regional demand spike without stockouts.",
    csvHint: "store-demand.csv",
    focusObjects: ["Customer", "Inventory", "Revenue"],
  },
]);

export function getDemoDataset(id: DemoDatasetId): DemoDataset | undefined {
  return OFFICIAL_DEMO_DATASETS.find((d) => d.id === id);
}
