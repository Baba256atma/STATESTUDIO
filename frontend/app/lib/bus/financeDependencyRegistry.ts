import type {
  FinanceDependencyEntry,
  FinanceDependencyRegistry as FinanceDependencyRegistryContract,
} from "./financeModelTypes.ts";

const FINANCE_DEPENDENCY_ENTRIES: readonly FinanceDependencyEntry[] = Object.freeze([
  Object.freeze({
    dependencyId: "finance-dependency-profit",
    dependent: "Profit",
    dependsOn: Object.freeze(["Revenue", "Expense"] as const),
    dependencyMode: "architectural-metadata",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    dependencyId: "finance-dependency-forecast",
    dependent: "Forecast",
    dependsOn: Object.freeze(["Historical Revenue"] as const),
    dependencyMode: "architectural-metadata",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    dependencyId: "finance-dependency-budget",
    dependent: "Budget",
    dependsOn: Object.freeze(["Planning"] as const),
    dependencyMode: "architectural-metadata",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    dependencyId: "finance-dependency-cashflow",
    dependent: "CashFlow",
    dependsOn: Object.freeze(["Payments"] as const),
    dependencyMode: "architectural-metadata",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    dependencyId: "finance-dependency-financialstatement",
    dependent: "FinancialStatement",
    dependsOn: Object.freeze(["FinancialPeriod"] as const),
    dependencyMode: "architectural-metadata",
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const FinanceDependencyRegistry: FinanceDependencyRegistryContract = Object.freeze({
  registryId: "finance-dependency-registry",
  version: "1.0.0",
  dependencies: FINANCE_DEPENDENCY_ENTRIES,
  metadataOnly: true,
  immutable: true,
});

export function getFinanceDependencies(): FinanceDependencyRegistryContract {
  return FinanceDependencyRegistry;
}
