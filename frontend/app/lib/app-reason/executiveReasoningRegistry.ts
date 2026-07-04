import {
  EXECUTIVE_REASONING_CONTRACT_VERSION,
  type ExecutiveReasoningPackage,
  type ExecutiveReasoningRegistry,
  type ExecutiveReasoningRegistryMutationResult,
  type RegisteredExecutiveReasoningPackage,
} from "./executiveReasoningTypes.ts";
import {
  validateExecutiveReasoningRegistration,
  validateExecutiveReasoningRegistry,
} from "./executiveReasoningValidation.ts";

function indexes(packages: readonly RegisteredExecutiveReasoningPackage[]) {
  const byPackageId: Record<string, RegisteredExecutiveReasoningPackage> = {};
  const byContractId: Record<string, RegisteredExecutiveReasoningPackage> = {};
  for (const registered of packages) {
    byPackageId[registered.package.packageId] = registered;
    for (const contract of registered.package.contracts) {
      byContractId[contract.contractId] = registered;
    }
  }
  return Object.freeze({ byPackageId: Object.freeze(byPackageId), byContractId: Object.freeze(byContractId) });
}

function createRegistry(packages: readonly RegisteredExecutiveReasoningPackage[], frozen: boolean): ExecutiveReasoningRegistry {
  const builtIndexes = indexes(packages);
  return Object.freeze({
    registryId: "executive-reasoning-registry",
    contractVersion: EXECUTIVE_REASONING_CONTRACT_VERSION,
    frozen,
    packages: Object.freeze([...packages]),
    byPackageId: builtIndexes.byPackageId,
    byContractId: builtIndexes.byContractId,
  });
}

export function createExecutiveReasoningRegistry(): ExecutiveReasoningRegistry {
  return createRegistry(Object.freeze([]), false);
}

export function registerExecutiveReasoningPackage(
  registry: ExecutiveReasoningRegistry,
  reasoningPackage: ExecutiveReasoningPackage
): ExecutiveReasoningRegistryMutationResult {
  const validation = validateExecutiveReasoningRegistration(registry, reasoningPackage);
  if (!validation.valid) {
    return Object.freeze({ success: false, registry, reasoningPackage: null, validation });
  }
  const registered = Object.freeze({ package: reasoningPackage, registrationOrder: registry.packages.length });
  const nextRegistry = createRegistry(Object.freeze([...registry.packages, registered]), registry.frozen);
  return Object.freeze({ success: true, registry: nextRegistry, reasoningPackage: registered, validation: validateExecutiveReasoningRegistry(nextRegistry) });
}

export function unregisterExecutiveReasoningPackage(
  registry: ExecutiveReasoningRegistry,
  packageId: string
): ExecutiveReasoningRegistryMutationResult {
  if (registry.frozen) {
    return Object.freeze({
      success: false,
      registry,
      reasoningPackage: null,
      validation: Object.freeze({ valid: false, issues: Object.freeze([Object.freeze({ code: "registry_frozen", field: "registry.frozen", message: "Frozen registry cannot be modified." })]) }),
    });
  }
  const registered = registry.byPackageId[packageId] ?? null;
  const nextRegistry = createRegistry(registry.packages.filter((entry) => entry.package.packageId !== packageId), registry.frozen);
  return Object.freeze({ success: registered !== null, registry: nextRegistry, reasoningPackage: registered, validation: validateExecutiveReasoningRegistry(nextRegistry) });
}

export function getExecutiveReasoningPackage(
  registry: ExecutiveReasoningRegistry,
  packageId: string
): RegisteredExecutiveReasoningPackage | null {
  return registry.byPackageId[packageId] ?? null;
}

export function listExecutiveReasoningPackages(
  registry: ExecutiveReasoningRegistry
): readonly RegisteredExecutiveReasoningPackage[] {
  return registry.packages;
}

export function hasExecutiveReasoningPackage(registry: ExecutiveReasoningRegistry, packageId: string): boolean {
  return Boolean(registry.byPackageId[packageId]);
}

export function freezeExecutiveReasoningRegistry(registry: ExecutiveReasoningRegistry): ExecutiveReasoningRegistry {
  return createRegistry(registry.packages, true);
}
