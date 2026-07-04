import { DOMAIN_FOUNDATION_CONTRACT_VERSION } from "./domainFoundationTypes.ts";
import {
  domainValidationResult,
  validateDomainPackage,
  validateDomainRegistration,
} from "./domainFoundationValidation.ts";
import type {
  DomainId,
  DomainPackage,
  DomainRegistry,
  DomainRegistryIndexes,
  DomainRegistryMutationResult,
  RegisteredDomain,
} from "./domainFoundationTypes.ts";

function sortDomainsForRegistry(domains: readonly RegisteredDomain[]): readonly RegisteredDomain[] {
  return Object.freeze(
    [...domains].sort((left, right) => {
      if (left.registrationOrder !== right.registrationOrder) {
        return left.registrationOrder - right.registrationOrder;
      }
      return left.package.manifest.domainId.localeCompare(right.package.manifest.domainId);
    })
  );
}

function buildDomainRegistryIndexes(domains: readonly RegisteredDomain[]): DomainRegistryIndexes {
  const byId: Record<DomainId, RegisteredDomain> = {};
  const byName: Record<string, RegisteredDomain> = {};

  for (const entry of domains) {
    byId[entry.package.manifest.domainId] = entry;
    byName[entry.package.manifest.name.trim().toLowerCase()] = entry;
  }

  return Object.freeze({
    byId: Object.freeze(byId),
    byName: Object.freeze(byName),
  });
}

function cloneDomainPackage(domainPackage: DomainPackage): DomainPackage {
  const manifest = domainPackage.manifest;
  return Object.freeze({
    contractVersion: DOMAIN_FOUNDATION_CONTRACT_VERSION,
    manifest: Object.freeze({
      domainId: manifest.domainId.trim(),
      name: manifest.name.trim(),
      version: Object.freeze({
        major: manifest.version.major,
        minor: manifest.version.minor,
        patch: manifest.version.patch,
        ...(manifest.version.label !== undefined ? { label: manifest.version.label.trim() } : {}),
      }),
      metadata: Object.freeze({
        displayName: manifest.metadata.displayName.trim(),
        description: manifest.metadata.description.trim(),
        category: manifest.metadata.category,
        tags: Object.freeze([...manifest.metadata.tags].map((tag) => tag.trim()).filter(Boolean).sort()),
      }),
      capabilities: Object.freeze(
        [...manifest.capabilities]
          .map((capability) =>
            Object.freeze({
              id: capability.id.trim(),
              name: capability.name.trim(),
              description: capability.description.trim(),
              enabled: capability.enabled,
            })
          )
          .sort((left, right) => left.id.localeCompare(right.id))
      ),
      dependencies: Object.freeze(
        [...manifest.dependencies]
          .map((dependency) =>
            Object.freeze({
              domainId: dependency.domainId.trim(),
              minVersion: Object.freeze({
                major: dependency.minVersion.major,
                minor: dependency.minVersion.minor,
                patch: dependency.minVersion.patch,
                ...(dependency.minVersion.label !== undefined ? { label: dependency.minVersion.label.trim() } : {}),
              }),
              optional: dependency.optional,
            })
          )
          .sort((left, right) => left.domainId.localeCompare(right.domainId))
      ),
      status: manifest.status,
    }),
  });
}

function createRegistryFromDomains(
  registryId: string,
  domains: readonly RegisteredDomain[],
  frozen: boolean
): DomainRegistry {
  const sortedDomains = sortDomainsForRegistry(domains);
  return Object.freeze({
    contractVersion: DOMAIN_FOUNDATION_CONTRACT_VERSION,
    registryId,
    frozen,
    domains: sortedDomains,
    indexes: buildDomainRegistryIndexes(sortedDomains),
  });
}

function mutationResult(
  success: boolean,
  registry: DomainRegistry,
  domain: RegisteredDomain | null,
  issues: Parameters<typeof domainValidationResult>[0]
): DomainRegistryMutationResult {
  return Object.freeze({
    success,
    registry,
    domain,
    validation: domainValidationResult(issues),
  });
}

export function createDomainRegistry(registryId = "nexora.domain.registry"): DomainRegistry {
  return createRegistryFromDomains(registryId, [], false);
}

export function registerDomain(registry: DomainRegistry, domainPackage: DomainPackage): DomainRegistryMutationResult {
  const packageValidation = validateDomainPackage(domainPackage);
  if (!packageValidation.valid) {
    return mutationResult(false, registry, null, packageValidation.issues);
  }

  const registrationValidation = validateDomainRegistration(registry, domainPackage);
  if (!registrationValidation.valid) {
    return mutationResult(false, registry, null, registrationValidation.issues);
  }

  const clonedPackage = cloneDomainPackage(domainPackage);
  const registeredDomain = Object.freeze({
    package: clonedPackage,
    registrationOrder: registry.domains.length,
  });

  return mutationResult(
    true,
    createRegistryFromDomains(registry.registryId, [...registry.domains, registeredDomain], registry.frozen),
    registeredDomain,
    []
  );
}

export function unregisterDomain(registry: DomainRegistry, domainId: DomainId): DomainRegistryMutationResult {
  if (registry.frozen) {
    return mutationResult(false, registry, null, [
      Object.freeze({
        code: "registry_frozen",
        field: "registry",
        message: "Domain registry is frozen and cannot accept mutations.",
        severity: "error" as const,
      }),
    ]);
  }

  const existing = registry.indexes.byId[domainId] ?? null;
  if (!existing) {
    return mutationResult(false, registry, null, [
      Object.freeze({
        code: "missing_domain",
        field: "domainId",
        message: `Domain not found: ${domainId}.`,
        severity: "error" as const,
      }),
    ]);
  }

  const remaining = registry.domains
    .filter((entry) => entry.package.manifest.domainId !== domainId)
    .map((entry, index) => Object.freeze({ ...entry, registrationOrder: index }));

  const dependents = remaining.filter((entry) =>
    entry.package.manifest.dependencies.some((dependency) => dependency.domainId === domainId && !dependency.optional)
  );
  if (dependents.length > 0) {
    return mutationResult(false, registry, null, [
      Object.freeze({
        code: "dependency_blocked",
        field: "domainId",
        message: `Cannot unregister ${domainId} because required dependents remain registered.`,
        severity: "error" as const,
      }),
    ]);
  }

  return mutationResult(
    true,
    createRegistryFromDomains(registry.registryId, remaining, registry.frozen),
    existing,
    []
  );
}

export function getDomain(registry: DomainRegistry, domainId: DomainId): RegisteredDomain | null {
  return registry.indexes.byId[domainId] ?? null;
}

export function listDomains(registry: DomainRegistry): readonly RegisteredDomain[] {
  return registry.domains;
}

export function hasDomain(registry: DomainRegistry, domainId: DomainId): boolean {
  return registry.indexes.byId[domainId] !== undefined;
}

export function freezeDomainRegistry(registry: DomainRegistry): DomainRegistry {
  return createRegistryFromDomains(registry.registryId, registry.domains, true);
}
