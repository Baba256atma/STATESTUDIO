/**
 * B.25 — Pilot scenario pack (structured validation inputs; no persistence).
 */

import type { ConnectorRunInputOut } from "../api/ingestionApi";

export type NexoraPilotScenarioDomain = "retail" | "supply_chain" | "finance" | "mixed";

export type NexoraPilotScenarioInput =
  | {
      type: "text";
      payload: string;
    }
  | {
      type: "multi_source";
      payload: ConnectorRunInputOut[];
    };

export type NexoraPilotScenario = {
  id: string;
  name: string;
  domain: NexoraPilotScenarioDomain;
  description: string;
  input: NexoraPilotScenarioInput;
  expected: {
    minSignals: number;
    expectedFragility: Array<"low" | "medium" | "high" | "critical">;
    mustHaveDrivers?: string[];
  };
};

export const NEXORA_PILOT_SCENARIOS: readonly NexoraPilotScenario[] = [
  {
    id: "retail_delay_inventory",
    name: "Retail disruption",
    domain: "retail",
    description: "Inventory and delivery stress visible in signals and scanner drivers.",
    input: {
      type: "text",
      payload: "Inventory shortage and delivery delays affecting customer satisfaction",
    },
    expected: {
      minSignals: 2,
      expectedFragility: ["medium", "high"],
      mustHaveDrivers: ["delay", "inventory"],
    },
  },
  {
    id: "supply_chain_supplier_risk",
    name: "Supply chain stress",
    domain: "supply_chain",
    description: "Merged web + manual sources; expects elevated fragility when connectors succeed.",
    input: {
      type: "multi_source",
      payload: [
        { connector_id: "web_source", config: { url: "https://www.reuters.com/world/" } },
        { connector_id: "manual_text", config: { text: "supplier delays increasing lead time" } },
      ],
    },
    expected: {
      minSignals: 3,
      expectedFragility: ["high", "critical"],
    },
  },
  {
    id: "finance_margin_pressure",
    name: "Finance pressure",
    domain: "finance",
    description: "Margin and liquidity language should produce multiple signals and mid–high fragility.",
    input: {
      type: "text",
      payload: "Margin compression and cash flow pressure increasing financial risk",
    },
    expected: {
      minSignals: 2,
      expectedFragility: ["medium", "high"],
    },
  },
  {
    id: "mixed_conflict_case",
    name: "Mixed signals (conflict)",
    domain: "mixed",
    description: "Conflicting KPI story: growth vs operational drag.",
    input: {
      type: "text",
      payload: "Strong revenue growth but increasing operational delays and cost pressure",
    },
    expected: {
      minSignals: 3,
      expectedFragility: ["medium", "high"],
    },
  },
];
