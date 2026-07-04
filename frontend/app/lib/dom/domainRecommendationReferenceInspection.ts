import type { DomainRecommendationContract, DomainRecommendationRegistry } from "./domainRecommendationIndex.ts";
import { findDomainRecommendationContract } from "./domainRecommendationLookup.ts";
import type {
  DomainRecommendationLookupResult,
  DomainRecommendationReferenceLookupResult,
} from "./domainRecommendationQueryTypes.ts";

function lookupResult(
  recommendationPackage: DomainRecommendationLookupResult["recommendationPackage"],
  contract: DomainRecommendationLookupResult["contract"]
): DomainRecommendationLookupResult {
  return Object.freeze({ found: Boolean(recommendationPackage && contract), recommendationPackage, contract });
}

function contractReferences(
  contract: DomainRecommendationContract,
  predicate: (reference: NonNullable<DomainRecommendationContract["inputs"][number]["reference"]>) => boolean
): boolean {
  const references = [
    ...contract.inputs.map((entry) => entry.reference),
    ...contract.outputs.map((entry) => entry.reference),
    ...contract.constraints.map((entry) => entry.reference),
    ...contract.assumptions.map((entry) => entry.reference),
  ].filter((reference): reference is NonNullable<typeof reference> => reference !== undefined);
  return references.some(predicate);
}

function findByReference(
  registry: DomainRecommendationRegistry,
  predicate: (reference: NonNullable<DomainRecommendationContract["inputs"][number]["reference"]>) => boolean
): readonly DomainRecommendationLookupResult[] {
  const results: DomainRecommendationLookupResult[] = [];
  for (const recommendationPackage of registry.packages) {
    for (const contract of recommendationPackage.package.contracts) {
      if (contractReferences(contract, predicate)) results.push(lookupResult(recommendationPackage, contract));
    }
  }
  return Object.freeze(results);
}

export function findRecommendationsReferencingVocabularyTerm(
  registry: DomainRecommendationRegistry,
  termId: string
): readonly DomainRecommendationLookupResult[] {
  return findByReference(registry, (reference) => reference.termId === termId);
}

export function findRecommendationsReferencingOntologyEntity(
  registry: DomainRecommendationRegistry,
  entityTypeId: string
): readonly DomainRecommendationLookupResult[] {
  return findByReference(registry, (reference) => reference.entityTypeId === entityTypeId);
}

export function findRecommendationsReferencingOntologyAttribute(
  registry: DomainRecommendationRegistry,
  attributeId: string
): readonly DomainRecommendationLookupResult[] {
  return findByReference(registry, (reference) => reference.attributeId === attributeId);
}

export function findRecommendationsReferencingKpi(
  registry: DomainRecommendationRegistry,
  kpiId: string
): readonly DomainRecommendationLookupResult[] {
  return findByReference(registry, (reference) => reference.kpiId === kpiId);
}

export function findRecommendationsReferencingRegulation(
  registry: DomainRecommendationRegistry,
  regulationId: string
): readonly DomainRecommendationLookupResult[] {
  return findByReference(registry, (reference) => reference.regulationId === regulationId);
}

export function findRecommendationsReferencingReasoning(
  registry: DomainRecommendationRegistry,
  reasoningContractId: string
): readonly DomainRecommendationLookupResult[] {
  return findByReference(registry, (reference) => reference.reasoningContractId === reasoningContractId);
}

export function buildDomainRecommendationReferenceLookup(
  registry: DomainRecommendationRegistry,
  referenceId: string
): DomainRecommendationReferenceLookupResult {
  const byContract = findDomainRecommendationContract(registry, referenceId);
  const matches = [
    ...(byContract.found ? [byContract] : []),
    ...findRecommendationsReferencingVocabularyTerm(registry, referenceId),
    ...findRecommendationsReferencingOntologyEntity(registry, referenceId),
    ...findRecommendationsReferencingOntologyAttribute(registry, referenceId),
    ...findRecommendationsReferencingKpi(registry, referenceId),
    ...findRecommendationsReferencingRegulation(registry, referenceId),
    ...findRecommendationsReferencingReasoning(registry, referenceId),
  ];
  const seen = new Set<string>();
  const unique = matches.filter((entry) => {
    const key = `${entry.recommendationPackage?.package.recommendationPackageId ?? ""}:${entry.contract?.contractId ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return Object.freeze({ referenceId, matches: Object.freeze(unique) });
}
