import { ExecutiveReasoningFoundation, type ExecutiveReasoningContract, type ExecutiveReasoningPackage, type ExecutiveReasoningRegistry } from "./executiveReasoningIndex.ts";
import type { ExecutiveReasoningInspectionResult, ExecutiveReasoningLookupResult } from "./executiveReasoningQueryTypes.ts";

function lookup<T>(value: T | null, packageId: string | null, contractId: string | null): ExecutiveReasoningLookupResult<T> {
  return Object.freeze({ found: value !== null, value, packageId, contractId });
}

function findContract(registry: ExecutiveReasoningRegistry, contractId: string): { pkg: ExecutiveReasoningPackage; contract: ExecutiveReasoningContract } | null {
  for (const registered of ExecutiveReasoningFoundation.listExecutiveReasoningPackages(registry)) {
    const contract = registered.package.contracts.find((entry) => entry.contractId === contractId);
    if (contract) {
      return { pkg: registered.package, contract };
    }
  }
  return null;
}

export function findExecutiveReasoningContract(registry: ExecutiveReasoningRegistry, contractId: string) {
  const found = findContract(registry, contractId);
  return lookup(found?.contract ?? null, found?.pkg.packageId ?? null, contractId);
}

export function findReasoningInputs(registry: ExecutiveReasoningRegistry, contractId: string) {
  const found = findContract(registry, contractId);
  return lookup(found?.contract.inputs ?? null, found?.pkg.packageId ?? null, contractId);
}

export function findReasoningOutputs(registry: ExecutiveReasoningRegistry, contractId: string) {
  const found = findContract(registry, contractId);
  return lookup(found?.contract.outputs ?? null, found?.pkg.packageId ?? null, contractId);
}

export function findReasoningEvidence(registry: ExecutiveReasoningRegistry, contractId: string) {
  const found = findContract(registry, contractId);
  return lookup(found?.contract.evidence ?? null, found?.pkg.packageId ?? null, contractId);
}

export function findReasoningAssumptions(registry: ExecutiveReasoningRegistry, contractId: string) {
  const found = findContract(registry, contractId);
  return lookup(found?.contract.assumptions ?? null, found?.pkg.packageId ?? null, contractId);
}

export function findReasoningConstraints(registry: ExecutiveReasoningRegistry, contractId: string) {
  const found = findContract(registry, contractId);
  return lookup(found?.contract.constraints ?? null, found?.pkg.packageId ?? null, contractId);
}

export function findReasoningConfidenceMetadata(registry: ExecutiveReasoningRegistry, contractId: string) {
  const found = findContract(registry, contractId);
  return lookup(found?.contract.confidence ?? null, found?.pkg.packageId ?? null, contractId);
}

export function findReasoningTraceMetadata(registry: ExecutiveReasoningRegistry, contractId: string) {
  const found = findContract(registry, contractId);
  return lookup(found?.contract.trace ?? null, found?.pkg.packageId ?? null, contractId);
}

export function listExecutiveReasoningCapabilities(): readonly string[] {
  return Object.freeze([
    "package-query",
    "contract-lookup",
    "metadata-inspection",
    "snapshot-generation",
    "snapshot-diff",
  ]);
}

export function buildExecutiveReasoningSummary(reasoningPackage: ExecutiveReasoningPackage): string {
  return [
    reasoningPackage.packageId,
    reasoningPackage.contractVersion,
    reasoningPackage.contracts.map((contract) => contract.contractId).join(","),
    reasoningPackage.metadata.tags.join(","),
  ].join("|");
}

export function inspectExecutiveReasoningPackage(reasoningPackage: ExecutiveReasoningPackage): ExecutiveReasoningInspectionResult {
  return Object.freeze({
    valid: ExecutiveReasoningFoundation.validateExecutiveReasoningPackage(reasoningPackage).valid,
    packageId: reasoningPackage.packageId,
    contractCount: reasoningPackage.contracts.length,
    capabilities: listExecutiveReasoningCapabilities(),
    summary: buildExecutiveReasoningSummary(reasoningPackage),
    reasoningPackage,
    metadataOnly: true,
  });
}
