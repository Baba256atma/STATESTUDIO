import type {
  FinanceDependencyMatrix as FinanceDependencyMatrixContract,
  FinanceDependencyMatrixEntry,
} from "./financeManifestTypes.ts";

const FINANCE_DEPENDENCY_ENTRIES: readonly FinanceDependencyMatrixEntry[] = Object.freeze([
  Object.freeze({
    consumedPhase: "BUS-28:1",
    provider: "Executive Finance Platform Foundation",
    dependencyType: "public-api",
    publicApiBoundary: "financeIndex.ts",
    compatibilityStatus: "Compatible",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    consumedPhase: "BUS-28:2",
    provider: "Executive Finance Registry Foundation",
    dependencyType: "public-api",
    publicApiBoundary: "financeRegistryIndex.ts",
    compatibilityStatus: "Compatible",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    consumedPhase: "BUS-28:3",
    provider: "Executive Finance Model Foundation",
    dependencyType: "public-api",
    publicApiBoundary: "financeModelIndex.ts",
    compatibilityStatus: "Compatible",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    consumedPhase: "BUS-28:4",
    provider: "Executive Finance Validation Foundation",
    dependencyType: "public-api",
    publicApiBoundary: "financeValidationIndex.ts",
    compatibilityStatus: "Compatible",
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const FinanceDependencyMatrix: FinanceDependencyMatrixContract = Object.freeze({
  matrixId: "finance-dependency-matrix",
  entries: FINANCE_DEPENDENCY_ENTRIES,
  metadataOnly: true,
  immutable: true,
});

export function getFinanceDependencyMatrix(): FinanceDependencyMatrixContract {
  return FinanceDependencyMatrix;
}
