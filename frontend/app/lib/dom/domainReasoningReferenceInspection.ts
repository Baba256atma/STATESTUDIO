import type { DomainReasoningContract, DomainReasoningRegistry } from "./domainReasoningIndex.ts";
import { findDomainReasoningContract } from "./domainReasoningLookup.ts";
import type {
  DomainReasoningLookupResult,
  DomainReasoningReferenceLookupResult,
} from "./domainReasoningQueryTypes.ts";

function lookupResult(
  reasoningPackage: DomainReasoningLookupResult["reasoningPackage"],
  contract: DomainReasoningLookupResult["contract"]
): DomainReasoningLookupResult {
  return Object.freeze({ found: Boolean(reasoningPackage && contract), reasoningPackage, contract });
}

function contractReferences(
  contract: DomainReasoningContract,
  predicate: (reference: NonNullable<DomainReasoningContract["inputs"][number]["reference"]>) => boolean
): boolean {
  const references = [
    ...contract.inputs.map((entry) => entry.reference),
    ...contract.outputs.map((entry) => entry.reference),
    ...contract.evidenceRequirements.map((entry) => entry.reference),
    ...contract.assumptions.map((entry) => entry.reference),
  ].filter((reference): reference is NonNullable<typeof reference> => reference !== undefined);

  return references.some(predicate);
}

function findByReference(
  registry: DomainReasoningRegistry,
  predicate: (reference: NonNullable<DomainReasoningContract["inputs"][number]["reference"]>) => boolean
): readonly DomainReasoningLookupResult[] {
  const results: DomainReasoningLookupResult[] = [];
  for (const reasoningPackage of registry.packages) {
    for (const contract of reasoningPackage.package.contracts) {
      if (contractReferences(contract, predicate)) results.push(lookupResult(reasoningPackage, contract));
    }
  }
  return Object.freeze(results);
}

export function findReasoningReferencingVocabularyTerm(
  registry: DomainReasoningRegistry,
  termId: string
): readonly DomainReasoningLookupResult[] {
  return findByReference(registry, (reference) => reference.termId === termId);
}

export function findReasoningReferencingOntologyEntity(
  registry: DomainReasoningRegistry,
  entityTypeId: string
): readonly DomainReasoningLookupResult[] {
  return findByReference(registry, (reference) => reference.entityTypeId === entityTypeId);
}

export function findReasoningReferencingOntologyAttribute(
  registry: DomainReasoningRegistry,
  attributeId: string
): readonly DomainReasoningLookupResult[] {
  return findByReference(registry, (reference) => reference.attributeId === attributeId);
}

export function findReasoningReferencingKpi(
  registry: DomainReasoningRegistry,
  kpiId: string
): readonly DomainReasoningLookupResult[] {
  return findByReference(registry, (reference) => reference.kpiId === kpiId);
}

export function findReasoningReferencingRegulation(
  registry: DomainReasoningRegistry,
  regulationId: string
): readonly DomainReasoningLookupResult[] {
  return findByReference(registry, (reference) => reference.regulationId === regulationId);
}

export function buildDomainReasoningReferenceLookup(
  registry: DomainReasoningRegistry,
  referenceId: string
): DomainReasoningReferenceLookupResult {
  const byContract = findDomainReasoningContract(registry, referenceId);
  const matches = [
    ...(byContract.found ? [byContract] : []),
    ...findReasoningReferencingVocabularyTerm(registry, referenceId),
    ...findReasoningReferencingOntologyEntity(registry, referenceId),
    ...findReasoningReferencingOntologyAttribute(registry, referenceId),
    ...findReasoningReferencingKpi(registry, referenceId),
    ...findReasoningReferencingRegulation(registry, referenceId),
  ];
  const seen = new Set<string>();
  const unique = matches.filter((entry) => {
    const key = `${entry.reasoningPackage?.package.reasoningPackageId ?? ""}:${entry.contract?.contractId ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return Object.freeze({
    referenceId,
    matches: Object.freeze(unique),
  });
}
