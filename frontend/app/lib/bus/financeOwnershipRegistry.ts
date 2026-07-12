import type {
  FinanceOwnershipEntry,
  FinanceOwnershipRegistry as FinanceOwnershipRegistryContract,
} from "./financeModelTypes.ts";

const FINANCE_OWNERSHIP_ENTRIES: readonly FinanceOwnershipEntry[] = Object.freeze([
  Object.freeze({
    ownershipId: "finance-ownership-financialstatement",
    owner: "FinancialStatement",
    owns: Object.freeze(["Revenue", "Expense", "Profit"] as const),
    ownershipMode: "metadata-reference-only",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    ownershipId: "finance-ownership-financialperiod",
    owner: "FinancialPeriod",
    owns: Object.freeze(["Statements"] as const),
    ownershipMode: "metadata-reference-only",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    ownershipId: "finance-ownership-account",
    owner: "Account",
    owns: Object.freeze(["Transactions"] as const),
    ownershipMode: "metadata-reference-only",
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const FinanceOwnershipRegistry: FinanceOwnershipRegistryContract = Object.freeze({
  registryId: "finance-ownership-registry",
  version: "1.0.0",
  ownership: FINANCE_OWNERSHIP_ENTRIES,
  metadataOnly: true,
  immutable: true,
});

export function getFinanceOwnership(): FinanceOwnershipRegistryContract {
  return FinanceOwnershipRegistry;
}
