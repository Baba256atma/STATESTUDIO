import type { FinanceRegistryObjectEntry } from "./financeRegistryIndex.ts";

export type FinanceModelEntity = Readonly<{
  readonly entityId: `finance-model-${Lowercase<string>}`;
  readonly objectCode: FinanceRegistryObjectEntry["code"];
  readonly objectType: FinanceRegistryObjectEntry["type"];
  readonly objectCategory: FinanceRegistryObjectEntry["category"];
  readonly description: string;
  readonly sourcePhase: "BUS-28:3";
  readonly contractVersion: "1.0.0";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceModelRelationshipType =
  | "contributesTo"
  | "reduces"
  | "belongsTo"
  | "governs"
  | "predicts"
  | "requests"
  | "affects"
  | "summarizes"
  | "scopes";

export type FinanceModelRelationship = Readonly<{
  readonly relationshipId: `finance-relationship-${Lowercase<string>}`;
  readonly source: FinanceRegistryObjectEntry["type"];
  readonly target: FinanceRegistryObjectEntry["type"] | "FinancialPosition";
  readonly relationshipType: FinanceModelRelationshipType;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceOwnershipEntry = Readonly<{
  readonly ownershipId: `finance-ownership-${Lowercase<string>}`;
  readonly owner: FinanceRegistryObjectEntry["type"];
  readonly owns: readonly (FinanceRegistryObjectEntry["type"] | "Transactions" | "Statements")[];
  readonly ownershipMode: "metadata-reference-only";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceAggregationEntry = Readonly<{
  readonly aggregationId: `finance-aggregation-${Lowercase<string>}`;
  readonly aggregate: FinanceRegistryObjectEntry["type"];
  readonly aggregates: readonly (FinanceRegistryObjectEntry["type"] | "Assets" | "Liabilities" | "Equity")[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceDependencyEntry = Readonly<{
  readonly dependencyId: `finance-dependency-${Lowercase<string>}`;
  readonly dependent: FinanceRegistryObjectEntry["type"];
  readonly dependsOn: readonly (
    | FinanceRegistryObjectEntry["type"]
    | "Historical Revenue"
    | "Planning"
    | "Payments"
  )[];
  readonly dependencyMode: "architectural-metadata";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceModelRegistry = Readonly<{
  readonly registryId: "finance-model-registry";
  readonly version: "1.0.0";
  readonly entities: readonly FinanceModelEntity[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceRelationshipRegistry = Readonly<{
  readonly registryId: "finance-relationship-registry";
  readonly version: "1.0.0";
  readonly relationships: readonly FinanceModelRelationship[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceOwnershipRegistry = Readonly<{
  readonly registryId: "finance-ownership-registry";
  readonly version: "1.0.0";
  readonly ownership: readonly FinanceOwnershipEntry[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceAggregationRegistry = Readonly<{
  readonly registryId: "finance-aggregation-registry";
  readonly version: "1.0.0";
  readonly aggregations: readonly FinanceAggregationEntry[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceDependencyRegistry = Readonly<{
  readonly registryId: "finance-dependency-registry";
  readonly version: "1.0.0";
  readonly dependencies: readonly FinanceDependencyEntry[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceModelManifest = Readonly<{
  readonly phaseId: "BUS-28:3";
  readonly platformId: "BUS-28";
  readonly consumedPhases: readonly ["BUS-28:1", "BUS-28:2"];
  readonly entityCount: number;
  readonly relationshipCount: number;
  readonly ownershipCount: number;
  readonly aggregationCount: number;
  readonly dependencyCount: number;
  readonly publicApiCount: number;
  readonly version: "1.0.0";
  readonly certificationStatus: "BUS-28:3 Model Foundation";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveFinanceModel = Readonly<{
  readonly model: FinanceModelRegistry;
  readonly relationships: FinanceRelationshipRegistry;
  readonly ownership: FinanceOwnershipRegistry;
  readonly aggregations: FinanceAggregationRegistry;
  readonly dependencies: FinanceDependencyRegistry;
  readonly manifest: FinanceModelManifest;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;
