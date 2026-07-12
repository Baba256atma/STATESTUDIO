import type { FinanceExtensionPolicy as FinanceExtensionPolicyContract } from "./financeManifestTypes.ts";

export const FinanceExtensionPolicy: FinanceExtensionPolicyContract = Object.freeze({
  policyId: "finance-extension-policy",
  allowedExtensions: Object.freeze([
    "Financial Platform",
    "Financial Certification",
    "Financial Freeze",
    "Financial Public Index",
  ] as const),
  prohibitedModifications: Object.freeze([
    "no-contract-mutation",
    "no-registry-mutation",
    "no-model-mutation",
    "no-validation-mutation",
    "no-private-imports",
  ]),
  publicApiStability: "stable",
  backwardCompatibilityPolicy: "required",
  semanticVersionExpectations: "semantic-versioning",
  metadataOnly: true,
  immutable: true,
});

export function getFinanceExtensionPolicy(): FinanceExtensionPolicyContract {
  return FinanceExtensionPolicy;
}
