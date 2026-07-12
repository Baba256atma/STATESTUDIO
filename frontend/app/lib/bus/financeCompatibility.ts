import type {
  FinanceCompatibilityEntry,
  FinanceCompatibilityMatrix,
} from "./financeManifestTypes.ts";

const FINANCE_COMPATIBILITY_ENTRIES: readonly FinanceCompatibilityEntry[] = Object.freeze([
  Object.freeze({
    source: "BUS-28:1",
    target: "BUS-28:2",
    status: "Compatible",
    description: "Finance Contracts are compatible with the Financial Registry through public APIs.",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    source: "BUS-28:1",
    target: "BUS-28:3",
    status: "Compatible",
    description: "Finance Contracts are compatible with the Executive Financial Model through public APIs.",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    source: "BUS-28:1",
    target: "BUS-28:4",
    status: "Compatible",
    description: "Finance Contracts are compatible with the Executive Financial Validation layer.",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    source: "BUS-28:2",
    target: "BUS-28:3",
    status: "Compatible",
    description: "Financial Registry is compatible with the Executive Financial Model.",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    source: "BUS-28:2",
    target: "BUS-28:4",
    status: "Compatible",
    description: "Financial Registry is compatible with the Executive Financial Validation layer.",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    source: "BUS-28:3",
    target: "BUS-28:4",
    status: "Compatible",
    description: "Executive Financial Model is compatible with the Executive Financial Validation layer.",
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const FinanceCompatibility: FinanceCompatibilityMatrix = Object.freeze({
  matrixId: "finance-compatibility-matrix",
  entries: FINANCE_COMPATIBILITY_ENTRIES,
  metadataOnly: true,
  immutable: true,
});

export function getFinanceCompatibility(): FinanceCompatibilityMatrix {
  return FinanceCompatibility;
}
