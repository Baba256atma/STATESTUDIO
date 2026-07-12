import type {
  ExecutiveFinancePlatformCompatibility as ExecutiveFinancePlatformCompatibilityContract,
  ExecutiveFinancePlatformCompatibilityEntry,
} from "./executiveFinancePlatformFreezeTypes.ts";

const EXECUTIVE_FINANCE_PLATFORM_COMPATIBILITY_ENTRIES: readonly ExecutiveFinancePlatformCompatibilityEntry[] =
  Object.freeze([
    "Contracts",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
    "Certification",
    "Freeze",
  ].map((component) =>
    Object.freeze({
      component: component as ExecutiveFinancePlatformCompatibilityEntry["component"],
      compatibilityStatus: "Compatible",
      consumerCompatibility: "Supported",
      backwardCompatibility: "Preserved",
      semanticVersionCompatibility: "Compatible",
      metadataOnly: true,
      immutable: true,
    }),
  ));

export const ExecutiveFinancePlatformCompatibility: ExecutiveFinancePlatformCompatibilityContract = Object.freeze({
  matrixId: "executive-finance-platform-compatibility",
  entries: EXECUTIVE_FINANCE_PLATFORM_COMPATIBILITY_ENTRIES,
  metadataOnly: true,
  immutable: true,
});
