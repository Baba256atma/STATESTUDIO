import type { ResourceCostDescriptor } from "./resourceModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-5:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-5:1", "OPS-5:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ResourceCostModel = Object.freeze([
  Object.freeze({
    id: "resource-cost-operating",
    name: "Operating Cost",
    description: "Metadata for recurring operational cost descriptors.",
    costCategories: Object.freeze(["Labor", "Subscription", "Service", "Facility"]),
    budgetingMetadata: Object.freeze([
      "cost-center",
      "budget-owner",
      "recurrence-band",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "resource-cost-capital",
    name: "Capital Cost",
    description: "Metadata for non-recurring and capitalized cost descriptors.",
    costCategories: Object.freeze(["Hardware", "Equipment", "Infrastructure"]),
    budgetingMetadata: Object.freeze([
      "capital-allocation",
      "depreciation-class",
      "renewal-window",
    ]),
    metadata,
  }),
] as const satisfies readonly ResourceCostDescriptor[]);
