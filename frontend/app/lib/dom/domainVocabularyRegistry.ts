import { DOMAIN_VOCABULARY_CONTRACT_VERSION } from "./domainVocabularyTypes.ts";
import {
  domainVocabularyValidationResult,
  validateDomainVocabularyPackage,
  validateDomainVocabularyRegistration,
} from "./domainVocabularyValidation.ts";
import type { DomainRegistry } from "./domainFoundationIndex.ts";
import type {
  DomainVocabularyId,
  DomainVocabularyPackage,
  DomainVocabularyRegistry,
  DomainVocabularyRegistryIndexes,
  DomainVocabularyRegistryMutationResult,
  RegisteredDomainVocabulary,
} from "./domainVocabularyTypes.ts";
import type { DomainId } from "./domainFoundationIndex.ts";

function sortVocabulariesForRegistry(
  vocabularies: readonly RegisteredDomainVocabulary[]
): readonly RegisteredDomainVocabulary[] {
  return Object.freeze(
    [...vocabularies].sort((left, right) => {
      if (left.registrationOrder !== right.registrationOrder) {
        return left.registrationOrder - right.registrationOrder;
      }
      return left.package.vocabularyId.localeCompare(right.package.vocabularyId);
    })
  );
}

function buildVocabularyRegistryIndexes(
  vocabularies: readonly RegisteredDomainVocabulary[]
): DomainVocabularyRegistryIndexes {
  const byId: Record<DomainVocabularyId, RegisteredDomainVocabulary> = {};
  const byDomainIdMap: Record<DomainId, RegisteredDomainVocabulary[]> = {};

  for (const entry of vocabularies) {
    byId[entry.package.vocabularyId] = entry;
    const domainId = entry.package.domainId;
    if (!byDomainIdMap[domainId]) {
      byDomainIdMap[domainId] = [];
    }
    byDomainIdMap[domainId].push(entry);
  }

  const byDomainId = Object.fromEntries(
    Object.entries(byDomainIdMap).map(([domainId, entries]) => [
      domainId,
      Object.freeze(
        [...entries].sort((left, right) => left.package.vocabularyId.localeCompare(right.package.vocabularyId))
      ),
    ])
  );

  return Object.freeze({
    byId: Object.freeze(byId),
    byDomainId: Object.freeze(byDomainId),
  });
}

function normalizeSynonymLabel(label: string): string {
  return label.trim().toLowerCase();
}

function cloneVocabularyPackage(vocabularyPackage: DomainVocabularyPackage): DomainVocabularyPackage {
  return Object.freeze({
    contractVersion: DOMAIN_VOCABULARY_CONTRACT_VERSION,
    vocabularyId: vocabularyPackage.vocabularyId.trim(),
    domainId: vocabularyPackage.domainId.trim(),
    name: vocabularyPackage.name.trim(),
    description: vocabularyPackage.description.trim(),
    version: Object.freeze({
      major: vocabularyPackage.version.major,
      minor: vocabularyPackage.version.minor,
      patch: vocabularyPackage.version.patch,
      ...(vocabularyPackage.version.label !== undefined ? { label: vocabularyPackage.version.label.trim() } : {}),
    }),
    status: vocabularyPackage.status,
    terms: Object.freeze(
      [...vocabularyPackage.terms]
        .map((term) =>
          Object.freeze({
            termId: term.termId.trim(),
            label: term.label.trim(),
            definition: Object.freeze({
              text: term.definition.text.trim(),
              language: term.definition.language.trim(),
            }),
            synonyms: Object.freeze(
              [...term.synonyms]
                .map((synonym) =>
                  Object.freeze({
                    label: synonym.label.trim(),
                    normalizedLabel: normalizeSynonymLabel(synonym.label),
                  })
                )
                .sort((left, right) => left.normalizedLabel.localeCompare(right.normalizedLabel))
            ),
            scope: term.scope,
            status: term.status,
          })
        )
        .sort((left, right) => left.termId.localeCompare(right.termId))
    ),
  });
}

function createRegistryFromVocabularies(
  registryId: string,
  vocabularies: readonly RegisteredDomainVocabulary[],
  frozen: boolean
): DomainVocabularyRegistry {
  const sortedVocabularies = sortVocabulariesForRegistry(vocabularies);
  return Object.freeze({
    contractVersion: DOMAIN_VOCABULARY_CONTRACT_VERSION,
    registryId,
    frozen,
    vocabularies: sortedVocabularies,
    indexes: buildVocabularyRegistryIndexes(sortedVocabularies),
  });
}

function mutationResult(
  success: boolean,
  registry: DomainVocabularyRegistry,
  vocabulary: RegisteredDomainVocabulary | null,
  issues: Parameters<typeof domainVocabularyValidationResult>[0]
): DomainVocabularyRegistryMutationResult {
  return Object.freeze({
    success,
    registry,
    vocabulary,
    validation: domainVocabularyValidationResult(issues),
  });
}

export function createDomainVocabularyRegistry(registryId = "nexora.domain.vocabulary.registry"): DomainVocabularyRegistry {
  return createRegistryFromVocabularies(registryId, [], false);
}

export function registerDomainVocabulary(
  registry: DomainVocabularyRegistry,
  vocabularyPackage: DomainVocabularyPackage,
  domainRegistry?: DomainRegistry
): DomainVocabularyRegistryMutationResult {
  const packageValidation = validateDomainVocabularyPackage(vocabularyPackage, domainRegistry);
  if (!packageValidation.valid) {
    return mutationResult(false, registry, null, packageValidation.issues);
  }

  const registrationValidation = validateDomainVocabularyRegistration(registry, vocabularyPackage, domainRegistry);
  if (!registrationValidation.valid) {
    return mutationResult(false, registry, null, registrationValidation.issues);
  }

  const registeredVocabulary = Object.freeze({
    package: cloneVocabularyPackage(vocabularyPackage),
    registrationOrder: registry.vocabularies.length,
  });

  return mutationResult(
    true,
    createRegistryFromVocabularies(registry.registryId, [...registry.vocabularies, registeredVocabulary], registry.frozen),
    registeredVocabulary,
    []
  );
}

export function unregisterDomainVocabulary(
  registry: DomainVocabularyRegistry,
  vocabularyId: DomainVocabularyId
): DomainVocabularyRegistryMutationResult {
  if (registry.frozen) {
    return mutationResult(false, registry, null, [
      Object.freeze({
        code: "registry_frozen",
        field: "registry",
        message: "Vocabulary registry is frozen and cannot accept mutations.",
        severity: "error" as const,
      }),
    ]);
  }

  const existing = registry.indexes.byId[vocabularyId] ?? null;
  if (!existing) {
    return mutationResult(false, registry, null, [
      Object.freeze({
        code: "missing_vocabulary",
        field: "vocabularyId",
        message: `Vocabulary not found: ${vocabularyId}.`,
        severity: "error" as const,
      }),
    ]);
  }

  const remaining = registry.vocabularies
    .filter((entry) => entry.package.vocabularyId !== vocabularyId)
    .map((entry, index) => Object.freeze({ ...entry, registrationOrder: index }));

  return mutationResult(
    true,
    createRegistryFromVocabularies(registry.registryId, remaining, registry.frozen),
    existing,
    []
  );
}

export function getDomainVocabulary(
  registry: DomainVocabularyRegistry,
  vocabularyId: DomainVocabularyId
): RegisteredDomainVocabulary | null {
  return registry.indexes.byId[vocabularyId] ?? null;
}

export function listDomainVocabularies(registry: DomainVocabularyRegistry): readonly RegisteredDomainVocabulary[] {
  return registry.vocabularies;
}

export function listVocabulariesByDomain(
  registry: DomainVocabularyRegistry,
  domainId: DomainId
): readonly RegisteredDomainVocabulary[] {
  return registry.indexes.byDomainId[domainId] ?? Object.freeze([]);
}

export function hasDomainVocabulary(registry: DomainVocabularyRegistry, vocabularyId: DomainVocabularyId): boolean {
  return registry.indexes.byId[vocabularyId] !== undefined;
}

export function freezeDomainVocabularyRegistry(registry: DomainVocabularyRegistry): DomainVocabularyRegistry {
  return createRegistryFromVocabularies(registry.registryId, registry.vocabularies, true);
}
