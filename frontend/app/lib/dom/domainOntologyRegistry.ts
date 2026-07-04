import type { DomainId, DomainRegistry } from "./domainFoundationIndex.ts";
import type { DomainVocabularyRegistry } from "./domainVocabularyIndex.ts";
import { DOMAIN_ONTOLOGY_CONTRACT_VERSION } from "./domainOntologyTypes.ts";
import {
  domainOntologyValidationResult,
  validateDomainOntologyPackage,
  validateDomainOntologyRegistration,
} from "./domainOntologyValidation.ts";
import type {
  DomainOntologyId,
  DomainOntologyPackage,
  DomainOntologyRegistry,
  DomainOntologyRegistryIndexes,
  DomainOntologyRegistryMutationResult,
  RegisteredDomainOntology,
} from "./domainOntologyTypes.ts";

function sortOntologiesForRegistry(
  ontologies: readonly RegisteredDomainOntology[]
): readonly RegisteredDomainOntology[] {
  return Object.freeze(
    [...ontologies].sort((left, right) => {
      if (left.registrationOrder !== right.registrationOrder) {
        return left.registrationOrder - right.registrationOrder;
      }
      return left.package.ontologyId.localeCompare(right.package.ontologyId);
    })
  );
}

function buildOntologyRegistryIndexes(
  ontologies: readonly RegisteredDomainOntology[]
): DomainOntologyRegistryIndexes {
  const byId: Record<DomainOntologyId, RegisteredDomainOntology> = {};
  const byDomainIdMap: Record<DomainId, RegisteredDomainOntology[]> = {};

  for (const entry of ontologies) {
    byId[entry.package.ontologyId] = entry;
    if (!byDomainIdMap[entry.package.domainId]) byDomainIdMap[entry.package.domainId] = [];
    byDomainIdMap[entry.package.domainId].push(entry);
  }

  return Object.freeze({
    byId: Object.freeze(byId),
    byDomainId: Object.freeze(
      Object.fromEntries(
        Object.entries(byDomainIdMap).map(([domainId, entries]) => [
          domainId,
          Object.freeze([...entries].sort((left, right) => left.package.ontologyId.localeCompare(right.package.ontologyId))),
        ])
      )
    ),
  });
}

function cloneOntologyPackage(ontologyPackage: DomainOntologyPackage): DomainOntologyPackage {
  return Object.freeze({
    contractVersion: DOMAIN_ONTOLOGY_CONTRACT_VERSION,
    ontologyId: ontologyPackage.ontologyId.trim(),
    domainId: ontologyPackage.domainId.trim(),
    ...(ontologyPackage.vocabularyId ? { vocabularyId: ontologyPackage.vocabularyId.trim() } : {}),
    name: ontologyPackage.name.trim(),
    description: ontologyPackage.description.trim(),
    version: Object.freeze({
      major: ontologyPackage.version.major,
      minor: ontologyPackage.version.minor,
      patch: ontologyPackage.version.patch,
      ...(ontologyPackage.version.label !== undefined ? { label: ontologyPackage.version.label.trim() } : {}),
    }),
    scope: ontologyPackage.scope,
    status: ontologyPackage.status,
    entityTypes: Object.freeze(
      [...ontologyPackage.entityTypes]
        .map((entry) =>
          Object.freeze({
            entityTypeId: entry.entityTypeId.trim(),
            label: entry.label.trim(),
            description: entry.description.trim(),
            scope: entry.scope,
            status: entry.status,
          })
        )
        .sort((left, right) => left.entityTypeId.localeCompare(right.entityTypeId))
    ),
    relationshipTypes: Object.freeze(
      [...ontologyPackage.relationshipTypes]
        .map((entry) =>
          Object.freeze({
            relationshipTypeId: entry.relationshipTypeId.trim(),
            label: entry.label.trim(),
            description: entry.description.trim(),
            sourceEntityTypeId: entry.sourceEntityTypeId.trim(),
            targetEntityTypeId: entry.targetEntityTypeId.trim(),
            scope: entry.scope,
            status: entry.status,
          })
        )
        .sort((left, right) => left.relationshipTypeId.localeCompare(right.relationshipTypeId))
    ),
    attributes: Object.freeze(
      [...ontologyPackage.attributes]
        .map((entry) =>
          Object.freeze({
            attributeId: entry.attributeId.trim(),
            ownerEntityTypeId: entry.ownerEntityTypeId.trim(),
            label: entry.label.trim(),
            description: entry.description.trim(),
            valueType: entry.valueType,
            required: entry.required,
            scope: entry.scope,
            status: entry.status,
          })
        )
        .sort((left, right) => left.attributeId.localeCompare(right.attributeId))
    ),
    constraints: Object.freeze(
      [...ontologyPackage.constraints]
        .map((entry) =>
          Object.freeze({
            constraintId: entry.constraintId.trim(),
            targetType: entry.targetType,
            targetId: entry.targetId.trim(),
            label: entry.label.trim(),
            description: entry.description.trim(),
            severity: entry.severity,
            scope: entry.scope,
            status: entry.status,
          })
        )
        .sort((left, right) => left.constraintId.localeCompare(right.constraintId))
    ),
  });
}

function createRegistryFromOntologies(
  registryId: string,
  ontologies: readonly RegisteredDomainOntology[],
  frozen: boolean
): DomainOntologyRegistry {
  const sortedOntologies = sortOntologiesForRegistry(ontologies);
  return Object.freeze({
    contractVersion: DOMAIN_ONTOLOGY_CONTRACT_VERSION,
    registryId,
    frozen,
    ontologies: sortedOntologies,
    indexes: buildOntologyRegistryIndexes(sortedOntologies),
  });
}

function mutationResult(
  success: boolean,
  registry: DomainOntologyRegistry,
  ontology: RegisteredDomainOntology | null,
  issues: Parameters<typeof domainOntologyValidationResult>[0]
): DomainOntologyRegistryMutationResult {
  return Object.freeze({
    success,
    registry,
    ontology,
    validation: domainOntologyValidationResult(issues),
  });
}

export function createDomainOntologyRegistry(registryId = "nexora.domain.ontology.registry"): DomainOntologyRegistry {
  return createRegistryFromOntologies(registryId, [], false);
}

export function registerDomainOntology(
  registry: DomainOntologyRegistry,
  ontologyPackage: DomainOntologyPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry
): DomainOntologyRegistryMutationResult {
  const packageValidation = validateDomainOntologyPackage(ontologyPackage, domainRegistry, vocabularyRegistry);
  if (!packageValidation.valid) {
    return mutationResult(false, registry, null, packageValidation.issues);
  }

  const registrationValidation = validateDomainOntologyRegistration(
    registry,
    ontologyPackage,
    domainRegistry,
    vocabularyRegistry
  );
  if (!registrationValidation.valid) {
    return mutationResult(false, registry, null, registrationValidation.issues);
  }

  const registeredOntology = Object.freeze({
    package: cloneOntologyPackage(ontologyPackage),
    registrationOrder: registry.ontologies.length,
  });

  return mutationResult(
    true,
    createRegistryFromOntologies(registry.registryId, [...registry.ontologies, registeredOntology], registry.frozen),
    registeredOntology,
    []
  );
}

export function unregisterDomainOntology(
  registry: DomainOntologyRegistry,
  ontologyId: DomainOntologyId
): DomainOntologyRegistryMutationResult {
  if (registry.frozen) {
    return mutationResult(false, registry, null, [
      Object.freeze({
        code: "registry_frozen",
        field: "registry",
        message: "Ontology registry is frozen and cannot accept mutations.",
        severity: "error" as const,
      }),
    ]);
  }

  const existing = registry.indexes.byId[ontologyId] ?? null;
  if (!existing) {
    return mutationResult(false, registry, null, [
      Object.freeze({
        code: "missing_ontology",
        field: "ontologyId",
        message: `Ontology not found: ${ontologyId}.`,
        severity: "error" as const,
      }),
    ]);
  }

  const remaining = registry.ontologies
    .filter((entry) => entry.package.ontologyId !== ontologyId)
    .map((entry, index) => Object.freeze({ ...entry, registrationOrder: index }));

  return mutationResult(
    true,
    createRegistryFromOntologies(registry.registryId, remaining, registry.frozen),
    existing,
    []
  );
}

export function getDomainOntology(
  registry: DomainOntologyRegistry,
  ontologyId: DomainOntologyId
): RegisteredDomainOntology | null {
  return registry.indexes.byId[ontologyId] ?? null;
}

export function listDomainOntologies(registry: DomainOntologyRegistry): readonly RegisteredDomainOntology[] {
  return registry.ontologies;
}

export function listOntologiesByDomain(
  registry: DomainOntologyRegistry,
  domainId: DomainId
): readonly RegisteredDomainOntology[] {
  return registry.indexes.byDomainId[domainId] ?? Object.freeze([]);
}

export function hasDomainOntology(registry: DomainOntologyRegistry, ontologyId: DomainOntologyId): boolean {
  return registry.indexes.byId[ontologyId] !== undefined;
}

export function freezeDomainOntologyRegistry(registry: DomainOntologyRegistry): DomainOntologyRegistry {
  return createRegistryFromOntologies(registry.registryId, registry.ontologies, true);
}
