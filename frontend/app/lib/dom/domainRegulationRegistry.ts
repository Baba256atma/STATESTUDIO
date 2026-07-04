import type { DomainId, DomainRegistry } from "./domainFoundationIndex.ts";
import type { DomainVocabularyRegistry } from "./domainVocabularyIndex.ts";
import type { DomainOntologyRegistry } from "./domainOntologyIndex.ts";
import type { DomainKpiRegistry } from "./domainKpiIndex.ts";
import { DOMAIN_REGULATION_CONTRACT_VERSION } from "./domainRegulationTypes.ts";
import {
  domainRegulationValidationResult,
  validateDomainRegulationPackage,
  validateDomainRegulationRegistration,
} from "./domainRegulationValidation.ts";
import type {
  DomainRegulationPackage,
  DomainRegulationPackageId,
  DomainRegulationRegistry,
  DomainRegulationRegistryIndexes,
  DomainRegulationRegistryMutationResult,
  RegisteredDomainRegulationPackage,
} from "./domainRegulationTypes.ts";

function sortPackagesForRegistry(
  packages: readonly RegisteredDomainRegulationPackage[]
): readonly RegisteredDomainRegulationPackage[] {
  return Object.freeze(
    [...packages].sort((left, right) => {
      if (left.registrationOrder !== right.registrationOrder) {
        return left.registrationOrder - right.registrationOrder;
      }
      return left.package.regulationPackageId.localeCompare(right.package.regulationPackageId);
    })
  );
}

function buildRegulationRegistryIndexes(
  packages: readonly RegisteredDomainRegulationPackage[]
): DomainRegulationRegistryIndexes {
  const byId: Record<DomainRegulationPackageId, RegisteredDomainRegulationPackage> = {};
  const byDomainIdMap: Record<DomainId, RegisteredDomainRegulationPackage[]> = {};

  for (const entry of packages) {
    byId[entry.package.regulationPackageId] = entry;
    if (!byDomainIdMap[entry.package.domainId]) byDomainIdMap[entry.package.domainId] = [];
    byDomainIdMap[entry.package.domainId].push(entry);
  }

  return Object.freeze({
    byId: Object.freeze(byId),
    byDomainId: Object.freeze(
      Object.fromEntries(
        Object.entries(byDomainIdMap).map(([domainId, entries]) => [
          domainId,
          Object.freeze(
            [...entries].sort((left, right) =>
              left.package.regulationPackageId.localeCompare(right.package.regulationPackageId)
            )
          ),
        ])
      )
    ),
  });
}

function cloneRegulationPackage(regulationPackage: DomainRegulationPackage): DomainRegulationPackage {
  return Object.freeze({
    contractVersion: DOMAIN_REGULATION_CONTRACT_VERSION,
    regulationPackageId: regulationPackage.regulationPackageId.trim(),
    domainId: regulationPackage.domainId.trim(),
    name: regulationPackage.name.trim(),
    description: regulationPackage.description.trim(),
    version: Object.freeze({
      major: regulationPackage.version.major,
      minor: regulationPackage.version.minor,
      patch: regulationPackage.version.patch,
      ...(regulationPackage.version.label !== undefined ? { label: regulationPackage.version.label.trim() } : {}),
    }),
    scope: regulationPackage.scope,
    jurisdictionScope: regulationPackage.jurisdictionScope,
    status: regulationPackage.status,
    regulations: Object.freeze(
      [...regulationPackage.regulations]
        .map((regulation) =>
          Object.freeze({
            regulationId: regulation.regulationId.trim(),
            label: regulation.label.trim(),
            description: regulation.description.trim(),
            ...(regulation.reference
              ? {
                  reference: Object.freeze({
                    ...(regulation.reference.domainId ? { domainId: regulation.reference.domainId.trim() } : {}),
                    ...(regulation.reference.vocabularyId
                      ? { vocabularyId: regulation.reference.vocabularyId.trim() }
                      : {}),
                    ...(regulation.reference.termId ? { termId: regulation.reference.termId.trim() } : {}),
                    ...(regulation.reference.ontologyId ? { ontologyId: regulation.reference.ontologyId.trim() } : {}),
                    ...(regulation.reference.entityTypeId
                      ? { entityTypeId: regulation.reference.entityTypeId.trim() }
                      : {}),
                    ...(regulation.reference.relationshipTypeId
                      ? { relationshipTypeId: regulation.reference.relationshipTypeId.trim() }
                      : {}),
                    ...(regulation.reference.attributeId
                      ? { attributeId: regulation.reference.attributeId.trim() }
                      : {}),
                    ...(regulation.reference.kpiPackageId
                      ? { kpiPackageId: regulation.reference.kpiPackageId.trim() }
                      : {}),
                    ...(regulation.reference.kpiId ? { kpiId: regulation.reference.kpiId.trim() } : {}),
                  }),
                }
              : {}),
            scope: regulation.scope,
            jurisdictionScope: regulation.jurisdictionScope,
            status: regulation.status,
          })
        )
        .sort((left, right) => left.regulationId.localeCompare(right.regulationId))
    ),
    obligations: Object.freeze(
      [...regulationPackage.obligations]
        .map((obligation) =>
          Object.freeze({
            obligationId: obligation.obligationId.trim(),
            regulationId: obligation.regulationId.trim(),
            label: obligation.label.trim(),
            description: obligation.description.trim(),
            controlIds: Object.freeze([...obligation.controlIds].map((controlId) => controlId.trim()).sort()),
            scope: obligation.scope,
            status: obligation.status,
          })
        )
        .sort((left, right) => left.obligationId.localeCompare(right.obligationId))
    ),
    controls: Object.freeze(
      [...regulationPackage.controls]
        .map((control) =>
          Object.freeze({
            controlId: control.controlId.trim(),
            label: control.label.trim(),
            description: control.description.trim(),
            evidenceIds: Object.freeze([...control.evidenceIds].map((evidenceId) => evidenceId.trim()).sort()),
            scope: control.scope,
            status: control.status,
          })
        )
        .sort((left, right) => left.controlId.localeCompare(right.controlId))
    ),
    evidence: Object.freeze(
      [...regulationPackage.evidence]
        .map((evidence) =>
          Object.freeze({
            evidenceId: evidence.evidenceId.trim(),
            label: evidence.label.trim(),
            description: evidence.description.trim(),
            sourceDescription: evidence.sourceDescription.trim(),
            scope: evidence.scope,
            status: evidence.status,
          })
        )
        .sort((left, right) => left.evidenceId.localeCompare(right.evidenceId))
    ),
  });
}

function createRegistryFromPackages(
  registryId: string,
  packages: readonly RegisteredDomainRegulationPackage[],
  frozen: boolean
): DomainRegulationRegistry {
  const sortedPackages = sortPackagesForRegistry(packages);
  return Object.freeze({
    contractVersion: DOMAIN_REGULATION_CONTRACT_VERSION,
    registryId,
    frozen,
    packages: sortedPackages,
    indexes: buildRegulationRegistryIndexes(sortedPackages),
  });
}

function mutationResult(
  success: boolean,
  registry: DomainRegulationRegistry,
  regulationPackage: RegisteredDomainRegulationPackage | null,
  issues: Parameters<typeof domainRegulationValidationResult>[0]
): DomainRegulationRegistryMutationResult {
  return Object.freeze({
    success,
    registry,
    regulationPackage,
    validation: domainRegulationValidationResult(issues),
  });
}

export function createDomainRegulationRegistry(
  registryId = "nexora.domain.regulation.registry"
): DomainRegulationRegistry {
  return createRegistryFromPackages(registryId, [], false);
}

export function registerDomainRegulationPackage(
  registry: DomainRegulationRegistry,
  regulationPackage: DomainRegulationPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry,
  kpiRegistry?: DomainKpiRegistry
): DomainRegulationRegistryMutationResult {
  const packageValidation = validateDomainRegulationPackage(
    regulationPackage,
    domainRegistry,
    vocabularyRegistry,
    ontologyRegistry,
    kpiRegistry
  );
  if (!packageValidation.valid) {
    return mutationResult(false, registry, null, packageValidation.issues);
  }
  const registrationValidation = validateDomainRegulationRegistration(
    registry,
    regulationPackage,
    domainRegistry,
    vocabularyRegistry,
    ontologyRegistry,
    kpiRegistry
  );
  if (!registrationValidation.valid) {
    return mutationResult(false, registry, null, registrationValidation.issues);
  }
  const registeredPackage = Object.freeze({
    package: cloneRegulationPackage(regulationPackage),
    registrationOrder: registry.packages.length,
  });

  return mutationResult(
    true,
    createRegistryFromPackages(registry.registryId, [...registry.packages, registeredPackage], registry.frozen),
    registeredPackage,
    []
  );
}

export function unregisterDomainRegulationPackage(
  registry: DomainRegulationRegistry,
  regulationPackageId: DomainRegulationPackageId
): DomainRegulationRegistryMutationResult {
  if (registry.frozen) {
    return mutationResult(false, registry, null, [
      Object.freeze({
        code: "registry_frozen",
        field: "registry",
        message: "Regulation registry is frozen and cannot accept mutations.",
        severity: "error" as const,
      }),
    ]);
  }
  const existing = registry.indexes.byId[regulationPackageId] ?? null;
  if (!existing) {
    return mutationResult(false, registry, null, [
      Object.freeze({
        code: "missing_regulation_package",
        field: "regulationPackageId",
        message: `Regulation package not found: ${regulationPackageId}.`,
        severity: "error" as const,
      }),
    ]);
  }
  const remaining = registry.packages
    .filter((entry) => entry.package.regulationPackageId !== regulationPackageId)
    .map((entry, index) => Object.freeze({ ...entry, registrationOrder: index }));

  return mutationResult(
    true,
    createRegistryFromPackages(registry.registryId, remaining, registry.frozen),
    existing,
    []
  );
}

export function getDomainRegulationPackage(
  registry: DomainRegulationRegistry,
  regulationPackageId: DomainRegulationPackageId
): RegisteredDomainRegulationPackage | null {
  return registry.indexes.byId[regulationPackageId] ?? null;
}

export function listDomainRegulationPackages(
  registry: DomainRegulationRegistry
): readonly RegisteredDomainRegulationPackage[] {
  return registry.packages;
}

export function listRegulationPackagesByDomain(
  registry: DomainRegulationRegistry,
  domainId: DomainId
): readonly RegisteredDomainRegulationPackage[] {
  return registry.indexes.byDomainId[domainId] ?? Object.freeze([]);
}

export function hasDomainRegulationPackage(
  registry: DomainRegulationRegistry,
  regulationPackageId: DomainRegulationPackageId
): boolean {
  return registry.indexes.byId[regulationPackageId] !== undefined;
}

export function freezeDomainRegulationRegistry(registry: DomainRegulationRegistry): DomainRegulationRegistry {
  return createRegistryFromPackages(registry.registryId, registry.packages, true);
}
