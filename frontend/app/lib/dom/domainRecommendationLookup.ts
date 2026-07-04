import type { DomainRecommendationContractId, DomainRecommendationRegistry } from "./domainRecommendationIndex.ts";
import type {
  DomainRecommendationAssumptionLookupResult,
  DomainRecommendationConstraintLookupResult,
  DomainRecommendationInputLookupResult,
  DomainRecommendationLookupResult,
  DomainRecommendationMetadataLookup,
  DomainRecommendationOutputLookupResult,
  DomainRecommendationRationaleLookupResult,
} from "./domainRecommendationQueryTypes.ts";

function contractLookupResult(
  recommendationPackage: DomainRecommendationLookupResult["recommendationPackage"],
  contract: DomainRecommendationLookupResult["contract"]
): DomainRecommendationLookupResult {
  return Object.freeze({ found: Boolean(recommendationPackage && contract), recommendationPackage, contract });
}

export function findDomainRecommendationContract(
  registry: DomainRecommendationRegistry,
  contractId: DomainRecommendationContractId
): DomainRecommendationLookupResult {
  for (const recommendationPackage of registry.packages) {
    const contract = recommendationPackage.package.contracts.find((entry) => entry.contractId === contractId) ?? null;
    if (contract) return contractLookupResult(recommendationPackage, contract);
  }
  return contractLookupResult(null, null);
}

export function findRecommendationInputs(
  registry: DomainRecommendationRegistry,
  contractId: DomainRecommendationContractId
): DomainRecommendationInputLookupResult {
  const result = findDomainRecommendationContract(registry, contractId);
  return Object.freeze({ ...result, inputs: Object.freeze(result.contract?.inputs ?? []) });
}

export function findRecommendationOutputs(
  registry: DomainRecommendationRegistry,
  contractId: DomainRecommendationContractId
): DomainRecommendationOutputLookupResult {
  const result = findDomainRecommendationContract(registry, contractId);
  return Object.freeze({ ...result, outputs: Object.freeze(result.contract?.outputs ?? []) });
}

export function findRecommendationRationale(
  registry: DomainRecommendationRegistry,
  contractId: DomainRecommendationContractId
): DomainRecommendationRationaleLookupResult {
  const result = findDomainRecommendationContract(registry, contractId);
  return Object.freeze({ ...result, rationale: result.contract?.rationale ?? null });
}

export function findRecommendationConstraints(
  registry: DomainRecommendationRegistry,
  contractId: DomainRecommendationContractId
): DomainRecommendationConstraintLookupResult {
  const result = findDomainRecommendationContract(registry, contractId);
  return Object.freeze({ ...result, constraints: Object.freeze(result.contract?.constraints ?? []) });
}

export function findRecommendationAssumptions(
  registry: DomainRecommendationRegistry,
  contractId: DomainRecommendationContractId
): DomainRecommendationAssumptionLookupResult {
  const result = findDomainRecommendationContract(registry, contractId);
  return Object.freeze({ ...result, assumptions: Object.freeze(result.contract?.assumptions ?? []) });
}

function metadataLookup(registry: DomainRecommendationRegistry, contractId: DomainRecommendationContractId): DomainRecommendationMetadataLookup {
  const result = findDomainRecommendationContract(registry, contractId);
  return Object.freeze({
    ...result,
    confidence: result.contract?.confidence ?? null,
    uncertainty: result.contract?.uncertainty ?? null,
    trace: result.contract?.trace ?? null,
  });
}

export function findRecommendationConfidenceMetadata(
  registry: DomainRecommendationRegistry,
  contractId: DomainRecommendationContractId
): DomainRecommendationMetadataLookup {
  return metadataLookup(registry, contractId);
}

export function findRecommendationUncertaintyMetadata(
  registry: DomainRecommendationRegistry,
  contractId: DomainRecommendationContractId
): DomainRecommendationMetadataLookup {
  return metadataLookup(registry, contractId);
}

export function findRecommendationTraceMetadata(
  registry: DomainRecommendationRegistry,
  contractId: DomainRecommendationContractId
): DomainRecommendationMetadataLookup {
  return metadataLookup(registry, contractId);
}
