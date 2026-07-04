import type { DomainKpiRegistry } from "./domainKpiIndex.ts";
import type { DomainKpiLookupResult, DomainKpiReferenceLookupResult } from "./domainKpiQueryTypes.ts";
import { findDomainKpi } from "./domainKpiLookup.ts";

function lookupResult(
  kpiPackage: DomainKpiLookupResult["kpiPackage"],
  kpi: DomainKpiLookupResult["kpi"]
): DomainKpiLookupResult {
  return Object.freeze({ found: Boolean(kpiPackage && kpi), kpiPackage, kpi });
}

function findByReference(
  registry: DomainKpiRegistry,
  predicate: (kpi: NonNullable<DomainKpiLookupResult["kpi"]>) => boolean
): readonly DomainKpiLookupResult[] {
  const results: DomainKpiLookupResult[] = [];
  for (const kpiPackage of registry.packages) {
    for (const kpi of kpiPackage.package.kpis) {
      if (predicate(kpi)) results.push(lookupResult(kpiPackage, kpi));
    }
  }
  return Object.freeze(results);
}

export function findKpisReferencingVocabularyTerm(
  registry: DomainKpiRegistry,
  termId: string
): readonly DomainKpiLookupResult[] {
  return findByReference(registry, (kpi) => kpi.reference?.vocabularyId === termId);
}

export function findKpisReferencingOntologyEntity(
  registry: DomainKpiRegistry,
  entityTypeId: string
): readonly DomainKpiLookupResult[] {
  return findByReference(registry, (kpi) => kpi.reference?.entityTypeId === entityTypeId);
}

export function findKpisReferencingOntologyAttribute(
  registry: DomainKpiRegistry,
  attributeId: string
): readonly DomainKpiLookupResult[] {
  return findByReference(registry, (kpi) => kpi.reference?.attributeId === attributeId);
}

export function findKpisReferencingOntologyRelationship(
  registry: DomainKpiRegistry,
  relationshipTypeId: string
): readonly DomainKpiLookupResult[] {
  return findByReference(registry, (kpi) => kpi.reference?.ontologyId === relationshipTypeId);
}

export function buildDomainKpiReferenceLookup(
  registry: DomainKpiRegistry,
  referenceId: string
): DomainKpiReferenceLookupResult {
  const byKpi = findDomainKpi(registry, referenceId);
  const matches = [
    ...(byKpi.found ? [byKpi] : []),
    ...findKpisReferencingVocabularyTerm(registry, referenceId),
    ...findKpisReferencingOntologyEntity(registry, referenceId),
    ...findKpisReferencingOntologyAttribute(registry, referenceId),
    ...findKpisReferencingOntologyRelationship(registry, referenceId),
  ];
  const seen = new Set<string>();
  const unique = matches.filter((entry) => {
    const key = `${entry.kpiPackage?.package.kpiPackageId ?? ""}:${entry.kpi?.kpiId ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return Object.freeze({
    referenceId,
    matches: Object.freeze(unique),
  });
}
