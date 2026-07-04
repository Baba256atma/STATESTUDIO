import { ExecutiveContextPlatformFreeze } from "../app-context/executiveContextPlatformFreezeIndex.ts";
import {
  EXECUTIVE_REASONING_CONTRACT_VERSION,
  type ExecutiveReasoningPackage,
  type ExecutiveReasoningRegistry,
  type ExecutiveReasoningValidation,
} from "./executiveReasoningTypes.ts";

function issue(code: string, field: string, message: string) {
  return Object.freeze({ code, field, message });
}

function result(issues: readonly ReturnType<typeof issue>[]): ExecutiveReasoningValidation {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function nonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function validateExecutiveReasoningFoundation(): ExecutiveReasoningValidation {
  const issues: ReturnType<typeof issue>[] = [];
  const freeze = ExecutiveContextPlatformFreeze.getExecutiveContextPlatformFreezeState();
  if (freeze.status !== "PASS") {
    issues.push(issue("context_platform_not_frozen", "ExecutiveContextPlatformFreeze", "Executive Context Platform freeze must pass."));
  }
  if (freeze.manifest.platformIdentity.version !== "APP-CTX-4") {
    issues.push(issue("invalid_context_platform_version", "ExecutiveContextPlatformFreeze.version", "Expected APP-CTX-4."));
  }
  return result(issues);
}

export function validateExecutiveReasoningPackage(reasoningPackage: ExecutiveReasoningPackage): ExecutiveReasoningValidation {
  const issues: ReturnType<typeof issue>[] = [];
  if (!nonEmpty(reasoningPackage.packageId)) {
    issues.push(issue("missing_package_id", "packageId", "Package id is required."));
  }
  if (!nonEmpty(reasoningPackage.packageName)) {
    issues.push(issue("missing_package_name", "packageName", "Package name is required."));
  }
  if (reasoningPackage.contractVersion !== EXECUTIVE_REASONING_CONTRACT_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion", "Contract version must be APP-REASON-1."));
  }
  if (reasoningPackage.contracts.length === 0) {
    issues.push(issue("missing_contracts", "contracts", "At least one reasoning contract is required."));
  }
  const contractIds = new Set<string>();
  for (const contract of reasoningPackage.contracts) {
    if (!nonEmpty(contract.contractId)) {
      issues.push(issue("missing_contract_id", "contracts.contractId", "Contract id is required."));
    }
    if (contractIds.has(contract.contractId)) {
      issues.push(issue("duplicate_contract_id", "contracts.contractId", `Duplicate contract id ${contract.contractId}.`));
    }
    contractIds.add(contract.contractId);
    if (contract.inputs.length === 0) {
      issues.push(issue("missing_inputs", "contracts.inputs", "Reasoning contract requires input metadata."));
    }
    if (contract.outputs.length === 0) {
      issues.push(issue("missing_outputs", "contracts.outputs", "Reasoning contract requires output metadata."));
    }
    if (!contract.metadata.metadataOnly) {
      issues.push(issue("non_metadata_contract", "contracts.metadata", "Reasoning contract metadata must be metadata-only."));
    }
  }
  if (!reasoningPackage.metadata.metadataOnly) {
    issues.push(issue("non_metadata_package", "metadata", "Reasoning package metadata must be metadata-only."));
  }
  return result(issues);
}

export function validateExecutiveReasoningRegistration(
  registry: ExecutiveReasoningRegistry,
  reasoningPackage: ExecutiveReasoningPackage
): ExecutiveReasoningValidation {
  const issues: ReturnType<typeof issue>[] = [];
  if (registry.frozen) {
    issues.push(issue("registry_frozen", "registry.frozen", "Frozen registry cannot be modified."));
  }
  if (registry.byPackageId[reasoningPackage.packageId]) {
    issues.push(issue("duplicate_package_id", "packageId", `Package ${reasoningPackage.packageId} is already registered.`));
  }
  for (const contract of reasoningPackage.contracts) {
    if (registry.byContractId[contract.contractId]) {
      issues.push(issue("duplicate_contract_id", "contracts.contractId", `Contract ${contract.contractId} is already registered.`));
    }
  }
  return result([...validateExecutiveReasoningPackage(reasoningPackage).issues, ...issues]);
}

export function validateExecutiveReasoningRegistry(registry: ExecutiveReasoningRegistry): ExecutiveReasoningValidation {
  const issues: ReturnType<typeof issue>[] = [];
  const packageIds = new Set<string>();
  const contractIds = new Set<string>();
  for (const registered of registry.packages) {
    if (packageIds.has(registered.package.packageId)) {
      issues.push(issue("duplicate_package_id", "packages.packageId", `Duplicate package ${registered.package.packageId}.`));
    }
    packageIds.add(registered.package.packageId);
    for (const contract of registered.package.contracts) {
      if (contractIds.has(contract.contractId)) {
        issues.push(issue("duplicate_contract_id", "packages.contracts.contractId", `Duplicate contract ${contract.contractId}.`));
      }
      contractIds.add(contract.contractId);
    }
    issues.push(...validateExecutiveReasoningPackage(registered.package).issues);
  }
  if (Object.keys(registry.byPackageId).length !== registry.packages.length) {
    issues.push(issue("package_index_mismatch", "byPackageId", "Package index must match package count."));
  }
  if (Object.keys(registry.byContractId).length !== contractIds.size) {
    issues.push(issue("contract_index_mismatch", "byContractId", "Contract index must match contract count."));
  }
  return result(issues);
}
