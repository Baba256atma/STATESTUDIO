import type { DomainRegulationRegistry } from "./domainRegulationIndex.ts";
import { findDomainRegulation } from "./domainRegulationLookup.ts";
import type {
  DomainRegulationLookupResult,
  DomainRegulationReferenceLookupResult,
} from "./domainRegulationQueryTypes.ts";

function lookupResult(
  regulationPackage: DomainRegulationLookupResult["regulationPackage"],
  regulation: DomainRegulationLookupResult["regulation"]
): DomainRegulationLookupResult {
  return Object.freeze({ found: Boolean(regulationPackage && regulation), regulationPackage, regulation });
}

function findByReference(
  registry: DomainRegulationRegistry,
  predicate: (regulation: NonNullable<DomainRegulationLookupResult["regulation"]>) => boolean
): readonly DomainRegulationLookupResult[] {
  const results: DomainRegulationLookupResult[] = [];
  for (const regulationPackage of registry.packages) {
    for (const regulation of regulationPackage.package.regulations) {
      if (predicate(regulation)) results.push(lookupResult(regulationPackage, regulation));
    }
  }
  return Object.freeze(results);
}

export function findRegulationsReferencingVocabularyTerm(
  registry: DomainRegulationRegistry,
  termId: string
): readonly DomainRegulationLookupResult[] {
  return findByReference(registry, (regulation) => regulation.reference?.termId === termId);
}

export function findRegulationsReferencingOntologyEntity(
  registry: DomainRegulationRegistry,
  entityTypeId: string
): readonly DomainRegulationLookupResult[] {
  return findByReference(registry, (regulation) => regulation.reference?.entityTypeId === entityTypeId);
}

export function findRegulationsReferencingOntologyAttribute(
  registry: DomainRegulationRegistry,
  attributeId: string
): readonly DomainRegulationLookupResult[] {
  return findByReference(registry, (regulation) => regulation.reference?.attributeId === attributeId);
}

export function findRegulationsReferencingKpi(
  registry: DomainRegulationRegistry,
  kpiId: string
): readonly DomainRegulationLookupResult[] {
  return findByReference(registry, (regulation) => regulation.reference?.kpiId === kpiId);
}

export function buildDomainRegulationReferenceLookup(
  registry: DomainRegulationRegistry,
  referenceId: string
): DomainRegulationReferenceLookupResult {
  const byRegulation = findDomainRegulation(registry, referenceId);
  const matches = [
    ...(byRegulation.found ? [byRegulation] : []),
    ...findRegulationsReferencingVocabularyTerm(registry, referenceId),
    ...findRegulationsReferencingOntologyEntity(registry, referenceId),
    ...findRegulationsReferencingOntologyAttribute(registry, referenceId),
    ...findRegulationsReferencingKpi(registry, referenceId),
  ];
  const seen = new Set<string>();
  const unique = matches.filter((entry) => {
    const key = `${entry.regulationPackage?.package.regulationPackageId ?? ""}:${entry.regulation?.regulationId ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return Object.freeze({
    referenceId,
    matches: Object.freeze(unique),
  });
}
