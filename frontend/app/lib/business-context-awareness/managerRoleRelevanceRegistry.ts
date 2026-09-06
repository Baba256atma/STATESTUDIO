import type { ManagerRoleFamily } from "./managerDecisionContextContract.ts";

export type ManagerRoleRelevanceDefinition = Readonly<{
  family: ManagerRoleFamily;
  exactTitles: readonly string[];
  conceptFamilies: readonly string[];
  processAreas: readonly string[];
  responsibilityAreas: readonly string[];
  decisionContextAreas: readonly string[];
}>;

function definition(input: ManagerRoleRelevanceDefinition): ManagerRoleRelevanceDefinition {
  return Object.freeze({
    ...input,
    exactTitles: Object.freeze([...input.exactTitles]),
    conceptFamilies: Object.freeze([...input.conceptFamilies]),
    processAreas: Object.freeze([...input.processAreas]),
    responsibilityAreas: Object.freeze([...input.responsibilityAreas]),
    decisionContextAreas: Object.freeze([...input.decisionContextAreas]),
  });
}

export const MANAGER_ROLE_RELEVANCE_REGISTRY: readonly ManagerRoleRelevanceDefinition[] = Object.freeze([
  definition({ family: "OPERATIONS", exactTitles: ["operations manager", "coo", "plant operations manager"], conceptFamilies: ["OPERATIONS", "PRODUCTION", "QUALITY", "SUPPLY_CHAIN", "SERVICE"], processAreas: ["PRODUCTION", "FULFILLMENT", "DELIVERY", "QUALITY"], responsibilityAreas: ["Operations", "Delivery", "Capacity", "Quality", "Throughput"], decisionContextAreas: ["DELIVERY", "CAPACITY", "FULFILLMENT"] }),
  definition({ family: "FINANCE", exactTitles: ["cfo", "finance manager", "finance director"], conceptFamilies: ["FINANCE", "COST"], processAreas: ["FINANCE"], responsibilityAreas: ["Cost", "Margin", "Budget", "Financial Exposure"], decisionContextAreas: ["FINANCE", "COST"] }),
  definition({ family: "EXECUTIVE", exactTitles: ["ceo", "chief executive officer"], conceptFamilies: ["STRATEGY", "FINANCE", "OPERATIONS", "RISK"], processAreas: ["STRATEGY", "FINANCE"], responsibilityAreas: ["Goal Impact", "Strategic Consequence", "Major Risk", "Cross-Functional Trade-Off"], decisionContextAreas: ["GOAL", "RISK", "TRADE_OFF"] }),
  definition({ family: "GENERAL_MANAGEMENT", exactTitles: ["general manager"], conceptFamilies: ["STRATEGY", "OPERATIONS", "FINANCE"], processAreas: ["PLANNING"], responsibilityAreas: ["Goal Alignment", "Operations", "Trade-Offs"], decisionContextAreas: ["GOAL", "TRADE_OFF"] }),
  definition({ family: "PROJECT", exactTitles: ["project manager", "project sponsor"], conceptFamilies: ["SCHEDULE", "COST", "RESOURCE", "RISK", "MILESTONE", "DEPENDENCY", "DELIVERABLE"], processAreas: ["PLANNING"], responsibilityAreas: ["Schedule", "Milestones", "Resources", "Dependencies", "Cost", "Project Risks"], decisionContextAreas: ["SCHEDULE", "COST", "RESOURCE"] }),
  definition({ family: "SUPPLY_CHAIN", exactTitles: ["supply chain manager"], conceptFamilies: ["SUPPLY_CHAIN"], processAreas: ["SUPPLY", "PROCUREMENT"], responsibilityAreas: ["Supplier", "Lead Time", "Inventory", "Supply Risk"], decisionContextAreas: ["SUPPLY", "PROCUREMENT"] }),
  definition({ family: "PROCUREMENT", exactTitles: ["procurement manager"], conceptFamilies: ["PROCUREMENT"], processAreas: ["PROCUREMENT"], responsibilityAreas: ["Procurement", "Supplier", "Cost"], decisionContextAreas: ["PROCUREMENT"] }),
  definition({ family: "QUALITY", exactTitles: ["quality manager"], conceptFamilies: ["QUALITY"], processAreas: ["QUALITY"], responsibilityAreas: ["Quality"], decisionContextAreas: ["QUALITY"] }),
]);

export const AMBIGUOUS_RAW_TITLES = Object.freeze(["delivery manager"]);

export function normalizeRoleTitle(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

export function findRoleRelevance(family: ManagerRoleFamily): ManagerRoleRelevanceDefinition | null {
  return MANAGER_ROLE_RELEVANCE_REGISTRY.find((entry) => entry.family === family) ?? null;
}

export function findRoleFamilyByExactTitle(rawTitle: string): ManagerRoleFamily | "AMBIGUOUS" | null {
  const normalized = normalizeRoleTitle(rawTitle);
  if (AMBIGUOUS_RAW_TITLES.includes(normalized)) return "AMBIGUOUS";
  const match = MANAGER_ROLE_RELEVANCE_REGISTRY.find((entry) => entry.exactTitles.includes(normalized));
  return match?.family ?? null;
}
