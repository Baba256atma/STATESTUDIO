import type { DomainId, DomainRegistry } from "./domainFoundationIndex.ts";
import type { DomainVocabularyRegistry } from "./domainVocabularyIndex.ts";
import type { DomainOntologyRegistry } from "./domainOntologyIndex.ts";
import { DOMAIN_KPI_CONTRACT_VERSION } from "./domainKpiTypes.ts";
import {
  domainKpiValidationResult,
  validateDomainKpiPackage,
  validateDomainKpiRegistration,
} from "./domainKpiValidation.ts";
import type {
  DomainKpiPackage,
  DomainKpiPackageId,
  DomainKpiRegistry,
  DomainKpiRegistryIndexes,
  DomainKpiRegistryMutationResult,
  RegisteredDomainKpiPackage,
} from "./domainKpiTypes.ts";

function sortPackagesForRegistry(
  packages: readonly RegisteredDomainKpiPackage[]
): readonly RegisteredDomainKpiPackage[] {
  return Object.freeze(
    [...packages].sort((left, right) => {
      if (left.registrationOrder !== right.registrationOrder) {
        return left.registrationOrder - right.registrationOrder;
      }
      return left.package.kpiPackageId.localeCompare(right.package.kpiPackageId);
    })
  );
}

function buildKpiRegistryIndexes(packages: readonly RegisteredDomainKpiPackage[]): DomainKpiRegistryIndexes {
  const byId: Record<DomainKpiPackageId, RegisteredDomainKpiPackage> = {};
  const byDomainIdMap: Record<DomainId, RegisteredDomainKpiPackage[]> = {};

  for (const entry of packages) {
    byId[entry.package.kpiPackageId] = entry;
    if (!byDomainIdMap[entry.package.domainId]) byDomainIdMap[entry.package.domainId] = [];
    byDomainIdMap[entry.package.domainId].push(entry);
  }

  return Object.freeze({
    byId: Object.freeze(byId),
    byDomainId: Object.freeze(
      Object.fromEntries(
        Object.entries(byDomainIdMap).map(([domainId, entries]) => [
          domainId,
          Object.freeze([...entries].sort((left, right) => left.package.kpiPackageId.localeCompare(right.package.kpiPackageId))),
        ])
      )
    ),
  });
}

function cloneKpiPackage(kpiPackage: DomainKpiPackage): DomainKpiPackage {
  return Object.freeze({
    contractVersion: DOMAIN_KPI_CONTRACT_VERSION,
    kpiPackageId: kpiPackage.kpiPackageId.trim(),
    domainId: kpiPackage.domainId.trim(),
    name: kpiPackage.name.trim(),
    description: kpiPackage.description.trim(),
    version: Object.freeze({
      major: kpiPackage.version.major,
      minor: kpiPackage.version.minor,
      patch: kpiPackage.version.patch,
      ...(kpiPackage.version.label !== undefined ? { label: kpiPackage.version.label.trim() } : {}),
    }),
    scope: kpiPackage.scope,
    status: kpiPackage.status,
    kpis: Object.freeze(
      [...kpiPackage.kpis]
        .map((kpi) =>
          Object.freeze({
            kpiId: kpi.kpiId.trim(),
            label: kpi.label.trim(),
            description: kpi.description.trim(),
            intent: Object.freeze({
              label: kpi.intent.label.trim(),
              description: kpi.intent.description.trim(),
              direction: kpi.intent.direction,
            }),
            unit: Object.freeze({
              unitType: kpi.unit.unitType,
              unitLabel: kpi.unit.unitLabel.trim(),
              precision: kpi.unit.precision,
            }),
            aggregation: Object.freeze({
              aggregationType: kpi.aggregation.aggregationType,
              window: kpi.aggregation.window,
              description: kpi.aggregation.description.trim(),
            }),
            ...(kpi.reference
              ? {
                  reference: Object.freeze({
                    ...(kpi.reference.vocabularyId ? { vocabularyId: kpi.reference.vocabularyId.trim() } : {}),
                    ...(kpi.reference.ontologyId ? { ontologyId: kpi.reference.ontologyId.trim() } : {}),
                    ...(kpi.reference.entityTypeId ? { entityTypeId: kpi.reference.entityTypeId.trim() } : {}),
                    ...(kpi.reference.attributeId ? { attributeId: kpi.reference.attributeId.trim() } : {}),
                  }),
                }
              : {}),
            scope: kpi.scope,
            status: kpi.status,
          })
        )
        .sort((left, right) => left.kpiId.localeCompare(right.kpiId))
    ),
  });
}

function createRegistryFromPackages(
  registryId: string,
  packages: readonly RegisteredDomainKpiPackage[],
  frozen: boolean
): DomainKpiRegistry {
  const sortedPackages = sortPackagesForRegistry(packages);
  return Object.freeze({
    contractVersion: DOMAIN_KPI_CONTRACT_VERSION,
    registryId,
    frozen,
    packages: sortedPackages,
    indexes: buildKpiRegistryIndexes(sortedPackages),
  });
}

function mutationResult(
  success: boolean,
  registry: DomainKpiRegistry,
  kpiPackage: RegisteredDomainKpiPackage | null,
  issues: Parameters<typeof domainKpiValidationResult>[0]
): DomainKpiRegistryMutationResult {
  return Object.freeze({
    success,
    registry,
    kpiPackage,
    validation: domainKpiValidationResult(issues),
  });
}

export function createDomainKpiRegistry(registryId = "nexora.domain.kpi.registry"): DomainKpiRegistry {
  return createRegistryFromPackages(registryId, [], false);
}

export function registerDomainKpiPackage(
  registry: DomainKpiRegistry,
  kpiPackage: DomainKpiPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry
): DomainKpiRegistryMutationResult {
  const packageValidation = validateDomainKpiPackage(kpiPackage, domainRegistry, vocabularyRegistry, ontologyRegistry);
  if (!packageValidation.valid) {
    return mutationResult(false, registry, null, packageValidation.issues);
  }
  const registrationValidation = validateDomainKpiRegistration(
    registry,
    kpiPackage,
    domainRegistry,
    vocabularyRegistry,
    ontologyRegistry
  );
  if (!registrationValidation.valid) {
    return mutationResult(false, registry, null, registrationValidation.issues);
  }
  const registeredPackage = Object.freeze({
    package: cloneKpiPackage(kpiPackage),
    registrationOrder: registry.packages.length,
  });

  return mutationResult(
    true,
    createRegistryFromPackages(registry.registryId, [...registry.packages, registeredPackage], registry.frozen),
    registeredPackage,
    []
  );
}

export function unregisterDomainKpiPackage(
  registry: DomainKpiRegistry,
  kpiPackageId: DomainKpiPackageId
): DomainKpiRegistryMutationResult {
  if (registry.frozen) {
    return mutationResult(false, registry, null, [
      Object.freeze({
        code: "registry_frozen",
        field: "registry",
        message: "KPI registry is frozen and cannot accept mutations.",
        severity: "error" as const,
      }),
    ]);
  }
  const existing = registry.indexes.byId[kpiPackageId] ?? null;
  if (!existing) {
    return mutationResult(false, registry, null, [
      Object.freeze({
        code: "missing_kpi_package",
        field: "kpiPackageId",
        message: `KPI package not found: ${kpiPackageId}.`,
        severity: "error" as const,
      }),
    ]);
  }
  const remaining = registry.packages
    .filter((entry) => entry.package.kpiPackageId !== kpiPackageId)
    .map((entry, index) => Object.freeze({ ...entry, registrationOrder: index }));

  return mutationResult(
    true,
    createRegistryFromPackages(registry.registryId, remaining, registry.frozen),
    existing,
    []
  );
}

export function getDomainKpiPackage(
  registry: DomainKpiRegistry,
  kpiPackageId: DomainKpiPackageId
): RegisteredDomainKpiPackage | null {
  return registry.indexes.byId[kpiPackageId] ?? null;
}

export function listDomainKpiPackages(registry: DomainKpiRegistry): readonly RegisteredDomainKpiPackage[] {
  return registry.packages;
}

export function listKpiPackagesByDomain(
  registry: DomainKpiRegistry,
  domainId: DomainId
): readonly RegisteredDomainKpiPackage[] {
  return registry.indexes.byDomainId[domainId] ?? Object.freeze([]);
}

export function hasDomainKpiPackage(registry: DomainKpiRegistry, kpiPackageId: DomainKpiPackageId): boolean {
  return registry.indexes.byId[kpiPackageId] !== undefined;
}

export function freezeDomainKpiRegistry(registry: DomainKpiRegistry): DomainKpiRegistry {
  return createRegistryFromPackages(registry.registryId, registry.packages, true);
}
