import type {
  FinancePlatformCode,
  FinancialObjectType,
  FinancialStatus,
  FinancialVisibility,
} from "./financeIndex.ts";

export type FinanceRegistryCategory =
  | "Income"
  | "ExpenseManagement"
  | "Planning"
  | "Liquidity"
  | "Transaction"
  | "AccountingStructure"
  | "FinancialPosition"
  | "ReportingPeriod"
  | "Statement";

export type FinanceRegistryObjectEntry = Readonly<{
  readonly id: `finance-object-${Lowercase<string>}`;
  readonly code: `FIN-${Uppercase<string>}`;
  readonly name: string;
  readonly type: FinancialObjectType;
  readonly category: FinanceRegistryCategory;
  readonly description: string;
  readonly status: FinancialStatus;
  readonly visibility: FinancialVisibility;
  readonly sourcePhase: "BUS-28:1";
  readonly contractVersion: "1.0.0";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceCategoryEntry = Readonly<{
  readonly id: `finance-category-${Lowercase<string>}`;
  readonly code: `FCAT-${Uppercase<string>}`;
  readonly name: FinanceRegistryCategory;
  readonly description: string;
  readonly sourcePhase: "BUS-28:2";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceApiRegistryEntry = Readonly<{
  readonly apiName: string;
  readonly stable: true;
  readonly runtimeBehavior: false;
  readonly sourcePhase: "BUS-28:1" | "BUS-28:2";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceObjectRegistry = Readonly<{
  readonly registryId: "finance-object-registry";
  readonly registryVersion: "1.0.0";
  readonly objects: readonly FinanceRegistryObjectEntry[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceCategoryRegistry = Readonly<{
  readonly registryId: "finance-category-registry";
  readonly registryVersion: "1.0.0";
  readonly categories: readonly FinanceCategoryEntry[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceApiRegistry = Readonly<{
  readonly registryId: "finance-api-registry";
  readonly registryVersion: "1.0.0";
  readonly apis: readonly FinanceApiRegistryEntry[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type FinanceRegistryManifest = Readonly<{
  readonly phaseId: "BUS-28:2";
  readonly phaseName: "Financial Registry";
  readonly platformCode: FinancePlatformCode;
  readonly consumedPhase: "BUS-28:1";
  readonly registryVersion: "1.0.0";
  readonly objectCount: number;
  readonly categoryCount: number;
  readonly publicApiCount: number;
  readonly certificationState: "BUS-28:2 Registry Foundation";
  readonly boundaries: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;
