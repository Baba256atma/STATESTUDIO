import { FinanceIdentity } from "./financeIndex.ts";
import { FinanceApiRegistry } from "./financeRegistryIndex.ts";
import { FinanceAggregationRegistry } from "./financeAggregationRegistry.ts";
import { FinanceDependencyRegistry } from "./financeDependencyRegistry.ts";
import { FinanceModelRegistry } from "./financeModelRegistry.ts";
import { FinanceOwnershipRegistry } from "./financeOwnershipRegistry.ts";
import { FinanceRelationshipRegistry } from "./financeRelationshipRegistry.ts";
import type { FinanceModelManifest } from "./financeModelTypes.ts";

export function getFinanceModelManifest(): FinanceModelManifest {
  return Object.freeze({
    phaseId: "BUS-28:3",
    platformId: FinanceIdentity.platformId,
    consumedPhases: Object.freeze(["BUS-28:1", "BUS-28:2"] as const),
    entityCount: FinanceModelRegistry.entities.length,
    relationshipCount: FinanceRelationshipRegistry.relationships.length,
    ownershipCount: FinanceOwnershipRegistry.ownership.length,
    aggregationCount: FinanceAggregationRegistry.aggregations.length,
    dependencyCount: FinanceDependencyRegistry.dependencies.length,
    publicApiCount: FinanceApiRegistry.apis.length + 6,
    version: "1.0.0",
    certificationStatus: "BUS-28:3 Model Foundation",
    metadataOnly: true,
    immutable: true,
  });
}
