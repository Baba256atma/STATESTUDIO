import type { DomainId, DomainRegistry } from "./domainFoundationIndex.ts";
import type { DomainVocabularyRegistry } from "./domainVocabularyIndex.ts";
import type { DomainOntologyRegistry } from "./domainOntologyIndex.ts";
import type { DomainKpiRegistry } from "./domainKpiIndex.ts";
import type { DomainRegulationRegistry } from "./domainRegulationIndex.ts";
import {
  domainReasoningValidationResult,
  validateDomainReasoningPackage,
  validateDomainReasoningRegistration,
} from "./domainReasoningValidation.ts";
import {
  DOMAIN_REASONING_CONTRACT_VERSION,
  type DomainReasoningContract,
  type DomainReasoningPackage,
  type DomainReasoningPackageId,
  type DomainReasoningRegistry,
  type DomainReasoningRegistryIndexes,
  type DomainReasoningRegistryMutationResult,
  type RegisteredDomainReasoningPackage,
} from "./domainReasoningTypes.ts";

function sortPackagesForRegistry(
  packages: readonly RegisteredDomainReasoningPackage[]
): readonly RegisteredDomainReasoningPackage[] {
  return Object.freeze(
    [...packages].sort((left, right) => {
      if (left.registrationOrder !== right.registrationOrder) {
        return left.registrationOrder - right.registrationOrder;
      }
      return left.package.reasoningPackageId.localeCompare(right.package.reasoningPackageId);
    })
  );
}

function buildReasoningRegistryIndexes(
  packages: readonly RegisteredDomainReasoningPackage[]
): DomainReasoningRegistryIndexes {
  const byId: Record<DomainReasoningPackageId, RegisteredDomainReasoningPackage> = {};
  const byDomainIdMap: Record<DomainId, RegisteredDomainReasoningPackage[]> = {};
  const byContractId: Record<string, RegisteredDomainReasoningPackage> = {};

  for (const entry of packages) {
    byId[entry.package.reasoningPackageId] = entry;
    if (!byDomainIdMap[entry.package.domainId]) byDomainIdMap[entry.package.domainId] = [];
    byDomainIdMap[entry.package.domainId].push(entry);
    for (const contract of entry.package.contracts) {
      byContractId[contract.contractId] = entry;
    }
  }

  return Object.freeze({
    byId: Object.freeze(byId),
    byDomainId: Object.freeze(
      Object.fromEntries(
        Object.entries(byDomainIdMap).map(([domainId, entries]) => [
          domainId,
          Object.freeze(
            [...entries].sort((left, right) =>
              left.package.reasoningPackageId.localeCompare(right.package.reasoningPackageId)
            )
          ),
        ])
      )
    ),
    byContractId: Object.freeze(byContractId),
  });
}

function cloneReference<T extends { reference?: object }>(entry: T): T {
  return Object.freeze({
    ...entry,
    ...(entry.reference ? { reference: Object.freeze({ ...entry.reference }) } : {}),
  });
}

function cloneContract(contract: DomainReasoningContract): DomainReasoningContract {
  return Object.freeze({
    contractId: contract.contractId.trim(),
    label: contract.label.trim(),
    description: contract.description.trim(),
    scope: contract.scope,
    status: contract.status,
    inputs: Object.freeze(
      [...contract.inputs]
        .map((entry) =>
          cloneReference({
            ...entry,
            inputId: entry.inputId.trim(),
            label: entry.label.trim(),
            description: entry.description.trim(),
          })
        )
        .sort((left, right) => left.inputId.localeCompare(right.inputId))
    ),
    outputs: Object.freeze(
      [...contract.outputs]
        .map((entry) =>
          cloneReference({
            ...entry,
            outputId: entry.outputId.trim(),
            label: entry.label.trim(),
            description: entry.description.trim(),
          })
        )
        .sort((left, right) => left.outputId.localeCompare(right.outputId))
    ),
    evidenceRequirements: Object.freeze(
      [...contract.evidenceRequirements]
        .map((entry) =>
          cloneReference({
            ...entry,
            evidenceRequirementId: entry.evidenceRequirementId.trim(),
            label: entry.label.trim(),
            description: entry.description.trim(),
          })
        )
        .sort((left, right) => left.evidenceRequirementId.localeCompare(right.evidenceRequirementId))
    ),
    assumptions: Object.freeze(
      [...contract.assumptions]
        .map((entry) =>
          cloneReference({
            ...entry,
            assumptionId: entry.assumptionId.trim(),
            label: entry.label.trim(),
            description: entry.description.trim(),
          })
        )
        .sort((left, right) => left.assumptionId.localeCompare(right.assumptionId))
    ),
    confidence: Object.freeze({
      required: contract.confidence.required,
      evidenceCoverageRequired: contract.confidence.evidenceCoverageRequired,
      assumptionCoverageRequired: contract.confidence.assumptionCoverageRequired,
      explanation: contract.confidence.explanation.trim(),
    }),
    uncertainty: Object.freeze({
      required: contract.uncertainty.required,
      sources: Object.freeze([...contract.uncertainty.sources].map((source) => source.trim()).sort()),
      explanation: contract.uncertainty.explanation.trim(),
    }),
    trace: Object.freeze({
      required: contract.trace.required,
      traceInputIds: Object.freeze([...contract.trace.traceInputIds].map((inputId) => inputId.trim()).sort()),
      traceOutputIds: Object.freeze([...contract.trace.traceOutputIds].map((outputId) => outputId.trim()).sort()),
      traceEvidenceRequirementIds: Object.freeze(
        [...contract.trace.traceEvidenceRequirementIds].map((evidenceId) => evidenceId.trim()).sort()
      ),
      traceAssumptionIds: Object.freeze(
        [...contract.trace.traceAssumptionIds].map((assumptionId) => assumptionId.trim()).sort()
      ),
    }),
  });
}

function cloneReasoningPackage(reasoningPackage: DomainReasoningPackage): DomainReasoningPackage {
  return Object.freeze({
    contractVersion: DOMAIN_REASONING_CONTRACT_VERSION,
    reasoningPackageId: reasoningPackage.reasoningPackageId.trim(),
    domainId: reasoningPackage.domainId.trim(),
    name: reasoningPackage.name.trim(),
    description: reasoningPackage.description.trim(),
    version: Object.freeze({
      major: reasoningPackage.version.major,
      minor: reasoningPackage.version.minor,
      patch: reasoningPackage.version.patch,
      ...(reasoningPackage.version.label !== undefined ? { label: reasoningPackage.version.label.trim() } : {}),
    }),
    scope: reasoningPackage.scope,
    status: reasoningPackage.status,
    contracts: Object.freeze(
      [...reasoningPackage.contracts]
        .map(cloneContract)
        .sort((left, right) => left.contractId.localeCompare(right.contractId))
    ),
  });
}

function createRegistryFromPackages(
  registryId: string,
  packages: readonly RegisteredDomainReasoningPackage[],
  frozen: boolean
): DomainReasoningRegistry {
  const sortedPackages = sortPackagesForRegistry(packages);
  return Object.freeze({
    contractVersion: DOMAIN_REASONING_CONTRACT_VERSION,
    registryId,
    frozen,
    packages: sortedPackages,
    indexes: buildReasoningRegistryIndexes(sortedPackages),
  });
}

function mutationResult(
  success: boolean,
  registry: DomainReasoningRegistry,
  reasoningPackage: RegisteredDomainReasoningPackage | null,
  issues: Parameters<typeof domainReasoningValidationResult>[0]
): DomainReasoningRegistryMutationResult {
  return Object.freeze({
    success,
    registry,
    reasoningPackage,
    validation: domainReasoningValidationResult(issues),
  });
}

export function createDomainReasoningRegistry(registryId = "nexora.domain.reasoning.registry"): DomainReasoningRegistry {
  return createRegistryFromPackages(registryId, [], false);
}

export function registerDomainReasoningPackage(
  registry: DomainReasoningRegistry,
  reasoningPackage: DomainReasoningPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry,
  kpiRegistry?: DomainKpiRegistry,
  regulationRegistry?: DomainRegulationRegistry
): DomainReasoningRegistryMutationResult {
  const packageValidation = validateDomainReasoningPackage(
    reasoningPackage,
    domainRegistry,
    vocabularyRegistry,
    ontologyRegistry,
    kpiRegistry,
    regulationRegistry
  );
  if (!packageValidation.valid) {
    return mutationResult(false, registry, null, packageValidation.issues);
  }
  const registrationValidation = validateDomainReasoningRegistration(
    registry,
    reasoningPackage,
    domainRegistry,
    vocabularyRegistry,
    ontologyRegistry,
    kpiRegistry,
    regulationRegistry
  );
  if (!registrationValidation.valid) {
    return mutationResult(false, registry, null, registrationValidation.issues);
  }
  const registeredPackage = Object.freeze({
    package: cloneReasoningPackage(reasoningPackage),
    registrationOrder: registry.packages.length,
  });

  return mutationResult(
    true,
    createRegistryFromPackages(registry.registryId, [...registry.packages, registeredPackage], registry.frozen),
    registeredPackage,
    []
  );
}

export function unregisterDomainReasoningPackage(
  registry: DomainReasoningRegistry,
  reasoningPackageId: DomainReasoningPackageId
): DomainReasoningRegistryMutationResult {
  if (registry.frozen) {
    return mutationResult(false, registry, null, [
      Object.freeze({
        code: "registry_frozen",
        field: "registry",
        message: "Reasoning registry is frozen and cannot accept mutations.",
        severity: "error" as const,
      }),
    ]);
  }
  const existing = registry.indexes.byId[reasoningPackageId] ?? null;
  if (!existing) {
    return mutationResult(false, registry, null, [
      Object.freeze({
        code: "missing_reasoning_package",
        field: "reasoningPackageId",
        message: `Reasoning package not found: ${reasoningPackageId}.`,
        severity: "error" as const,
      }),
    ]);
  }
  const remaining = registry.packages
    .filter((entry) => entry.package.reasoningPackageId !== reasoningPackageId)
    .map((entry, index) => Object.freeze({ ...entry, registrationOrder: index }));

  return mutationResult(true, createRegistryFromPackages(registry.registryId, remaining, registry.frozen), existing, []);
}

export function getDomainReasoningPackage(
  registry: DomainReasoningRegistry,
  reasoningPackageId: DomainReasoningPackageId
): RegisteredDomainReasoningPackage | null {
  return registry.indexes.byId[reasoningPackageId] ?? null;
}

export function listDomainReasoningPackages(
  registry: DomainReasoningRegistry
): readonly RegisteredDomainReasoningPackage[] {
  return registry.packages;
}

export function listReasoningPackagesByDomain(
  registry: DomainReasoningRegistry,
  domainId: DomainId
): readonly RegisteredDomainReasoningPackage[] {
  return registry.indexes.byDomainId[domainId] ?? Object.freeze([]);
}

export function hasDomainReasoningPackage(
  registry: DomainReasoningRegistry,
  reasoningPackageId: DomainReasoningPackageId
): boolean {
  return registry.indexes.byId[reasoningPackageId] !== undefined;
}

export function freezeDomainReasoningRegistry(registry: DomainReasoningRegistry): DomainReasoningRegistry {
  return createRegistryFromPackages(registry.registryId, registry.packages, true);
}
