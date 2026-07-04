import type { DomainReasoningContractId, DomainReasoningRegistry } from "./domainReasoningIndex.ts";
import type {
  DomainReasoningAssumptionLookupResult,
  DomainReasoningEvidenceRequirementLookupResult,
  DomainReasoningInputLookupResult,
  DomainReasoningLookupResult,
  DomainReasoningMetadataLookup,
  DomainReasoningOutputLookupResult,
} from "./domainReasoningQueryTypes.ts";

function contractLookupResult(
  reasoningPackage: DomainReasoningLookupResult["reasoningPackage"],
  contract: DomainReasoningLookupResult["contract"]
): DomainReasoningLookupResult {
  return Object.freeze({ found: Boolean(reasoningPackage && contract), reasoningPackage, contract });
}

export function findDomainReasoningContract(
  registry: DomainReasoningRegistry,
  contractId: DomainReasoningContractId
): DomainReasoningLookupResult {
  for (const reasoningPackage of registry.packages) {
    const contract = reasoningPackage.package.contracts.find((entry) => entry.contractId === contractId) ?? null;
    if (contract) return contractLookupResult(reasoningPackage, contract);
  }
  return contractLookupResult(null, null);
}

export function findReasoningInputs(
  registry: DomainReasoningRegistry,
  contractId: DomainReasoningContractId
): DomainReasoningInputLookupResult {
  const result = findDomainReasoningContract(registry, contractId);
  return Object.freeze({
    ...result,
    inputs: Object.freeze(result.contract?.inputs ?? []),
  });
}

export function findReasoningOutputs(
  registry: DomainReasoningRegistry,
  contractId: DomainReasoningContractId
): DomainReasoningOutputLookupResult {
  const result = findDomainReasoningContract(registry, contractId);
  return Object.freeze({
    ...result,
    outputs: Object.freeze(result.contract?.outputs ?? []),
  });
}

export function findReasoningAssumptions(
  registry: DomainReasoningRegistry,
  contractId: DomainReasoningContractId
): DomainReasoningAssumptionLookupResult {
  const result = findDomainReasoningContract(registry, contractId);
  return Object.freeze({
    ...result,
    assumptions: Object.freeze(result.contract?.assumptions ?? []),
  });
}

export function findReasoningEvidenceRequirements(
  registry: DomainReasoningRegistry,
  contractId: DomainReasoningContractId
): DomainReasoningEvidenceRequirementLookupResult {
  const result = findDomainReasoningContract(registry, contractId);
  return Object.freeze({
    ...result,
    evidenceRequirements: Object.freeze(result.contract?.evidenceRequirements ?? []),
  });
}

function metadataLookup(registry: DomainReasoningRegistry, contractId: DomainReasoningContractId): DomainReasoningMetadataLookup {
  const result = findDomainReasoningContract(registry, contractId);
  return Object.freeze({
    ...result,
    confidence: result.contract?.confidence ?? null,
    uncertainty: result.contract?.uncertainty ?? null,
    trace: result.contract?.trace ?? null,
  });
}

export function findReasoningConfidenceMetadata(
  registry: DomainReasoningRegistry,
  contractId: DomainReasoningContractId
): DomainReasoningMetadataLookup {
  return metadataLookup(registry, contractId);
}

export function findReasoningUncertaintyMetadata(
  registry: DomainReasoningRegistry,
  contractId: DomainReasoningContractId
): DomainReasoningMetadataLookup {
  return metadataLookup(registry, contractId);
}

export function findReasoningTraceMetadata(
  registry: DomainReasoningRegistry,
  contractId: DomainReasoningContractId
): DomainReasoningMetadataLookup {
  return metadataLookup(registry, contractId);
}
