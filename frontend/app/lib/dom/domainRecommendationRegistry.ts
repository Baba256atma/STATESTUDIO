import type { DomainId, DomainRegistry } from "./domainFoundationIndex.ts";
import type { DomainVocabularyRegistry } from "./domainVocabularyIndex.ts";
import type { DomainOntologyRegistry } from "./domainOntologyIndex.ts";
import type { DomainKpiRegistry } from "./domainKpiIndex.ts";
import type { DomainRegulationRegistry } from "./domainRegulationIndex.ts";
import type { DomainReasoningRegistry } from "./domainReasoningIndex.ts";
import {
  domainRecommendationValidationResult,
  validateDomainRecommendationPackage,
  validateDomainRecommendationRegistration,
} from "./domainRecommendationValidation.ts";
import {
  DOMAIN_RECOMMENDATION_CONTRACT_VERSION,
  type DomainRecommendationContract,
  type DomainRecommendationPackage,
  type DomainRecommendationPackageId,
  type DomainRecommendationRegistry,
  type DomainRecommendationRegistryIndexes,
  type DomainRecommendationRegistryMutationResult,
  type RegisteredDomainRecommendationPackage,
} from "./domainRecommendationTypes.ts";

function buildIndexes(packages: readonly RegisteredDomainRecommendationPackage[]): DomainRecommendationRegistryIndexes {
  const byId: Record<DomainRecommendationPackageId, RegisteredDomainRecommendationPackage> = {};
  const byDomainIdMap: Record<DomainId, RegisteredDomainRecommendationPackage[]> = {};
  const byContractId: Record<string, RegisteredDomainRecommendationPackage> = {};
  for (const entry of packages) {
    byId[entry.package.recommendationPackageId] = entry;
    if (!byDomainIdMap[entry.package.domainId]) byDomainIdMap[entry.package.domainId] = [];
    byDomainIdMap[entry.package.domainId].push(entry);
    for (const contract of entry.package.contracts) byContractId[contract.contractId] = entry;
  }
  return Object.freeze({
    byId: Object.freeze(byId),
    byDomainId: Object.freeze(
      Object.fromEntries(
        Object.entries(byDomainIdMap).map(([domainId, entries]) => [
          domainId,
          Object.freeze([...entries].sort((left, right) => left.package.recommendationPackageId.localeCompare(right.package.recommendationPackageId))),
        ])
      )
    ),
    byContractId: Object.freeze(byContractId),
  });
}

function cloneReference<T extends { reference?: object }>(entry: T): T {
  return Object.freeze({ ...entry, ...(entry.reference ? { reference: Object.freeze({ ...entry.reference }) } : {}) });
}

function cloneContract(contract: DomainRecommendationContract): DomainRecommendationContract {
  return Object.freeze({
    contractId: contract.contractId.trim(),
    label: contract.label.trim(),
    description: contract.description.trim(),
    scope: contract.scope,
    status: contract.status,
    inputs: Object.freeze([...contract.inputs].map((entry) => cloneReference({ ...entry, inputId: entry.inputId.trim(), label: entry.label.trim(), description: entry.description.trim() })).sort((a, b) => a.inputId.localeCompare(b.inputId))),
    outputs: Object.freeze([...contract.outputs].map((entry) => cloneReference({ ...entry, outputId: entry.outputId.trim(), label: entry.label.trim(), description: entry.description.trim() })).sort((a, b) => a.outputId.localeCompare(b.outputId))),
    rationale: Object.freeze({
      required: contract.rationale.required,
      rationaleInputs: Object.freeze([...contract.rationale.rationaleInputs].map((entry) => entry.trim()).sort()),
      rationaleAssumptions: Object.freeze([...contract.rationale.rationaleAssumptions].map((entry) => entry.trim()).sort()),
      explanation: contract.rationale.explanation.trim(),
    }),
    constraints: Object.freeze([...contract.constraints].map((entry) => cloneReference({ ...entry, constraintId: entry.constraintId.trim(), label: entry.label.trim(), description: entry.description.trim() })).sort((a, b) => a.constraintId.localeCompare(b.constraintId))),
    assumptions: Object.freeze([...contract.assumptions].map((entry) => cloneReference({ ...entry, assumptionId: entry.assumptionId.trim(), label: entry.label.trim(), description: entry.description.trim() })).sort((a, b) => a.assumptionId.localeCompare(b.assumptionId))),
    confidence: Object.freeze({
      required: contract.confidence.required,
      evidenceCoverageRequired: contract.confidence.evidenceCoverageRequired,
      rationaleCoverageRequired: contract.confidence.rationaleCoverageRequired,
      explanation: contract.confidence.explanation.trim(),
    }),
    uncertainty: Object.freeze({
      required: contract.uncertainty.required,
      sources: Object.freeze([...contract.uncertainty.sources].map((source) => source.trim()).sort()),
      explanation: contract.uncertainty.explanation.trim(),
    }),
    trace: Object.freeze({
      required: contract.trace.required,
      traceInputIds: Object.freeze([...contract.trace.traceInputIds].map((entry) => entry.trim()).sort()),
      traceOutputIds: Object.freeze([...contract.trace.traceOutputIds].map((entry) => entry.trim()).sort()),
      traceConstraintIds: Object.freeze([...contract.trace.traceConstraintIds].map((entry) => entry.trim()).sort()),
      traceAssumptionIds: Object.freeze([...contract.trace.traceAssumptionIds].map((entry) => entry.trim()).sort()),
    }),
  });
}

function clonePackage(recommendationPackage: DomainRecommendationPackage): DomainRecommendationPackage {
  return Object.freeze({
    contractVersion: DOMAIN_RECOMMENDATION_CONTRACT_VERSION,
    recommendationPackageId: recommendationPackage.recommendationPackageId.trim(),
    domainId: recommendationPackage.domainId.trim(),
    name: recommendationPackage.name.trim(),
    description: recommendationPackage.description.trim(),
    version: Object.freeze({
      major: recommendationPackage.version.major,
      minor: recommendationPackage.version.minor,
      patch: recommendationPackage.version.patch,
      ...(recommendationPackage.version.label !== undefined ? { label: recommendationPackage.version.label.trim() } : {}),
    }),
    scope: recommendationPackage.scope,
    status: recommendationPackage.status,
    contracts: Object.freeze([...recommendationPackage.contracts].map(cloneContract).sort((a, b) => a.contractId.localeCompare(b.contractId))),
  });
}

function createRegistryFromPackages(registryId: string, packages: readonly RegisteredDomainRecommendationPackage[], frozen: boolean): DomainRecommendationRegistry {
  const sorted = Object.freeze([...packages].sort((a, b) => a.registrationOrder - b.registrationOrder || a.package.recommendationPackageId.localeCompare(b.package.recommendationPackageId)));
  return Object.freeze({ contractVersion: DOMAIN_RECOMMENDATION_CONTRACT_VERSION, registryId, frozen, packages: sorted, indexes: buildIndexes(sorted) });
}

function mutationResult(success: boolean, registry: DomainRecommendationRegistry, recommendationPackage: RegisteredDomainRecommendationPackage | null, issues: Parameters<typeof domainRecommendationValidationResult>[0]): DomainRecommendationRegistryMutationResult {
  return Object.freeze({ success, registry, recommendationPackage, validation: domainRecommendationValidationResult(issues) });
}

export function createDomainRecommendationRegistry(registryId = "nexora.domain.recommendation.registry"): DomainRecommendationRegistry {
  return createRegistryFromPackages(registryId, [], false);
}

export function registerDomainRecommendationPackage(
  registry: DomainRecommendationRegistry,
  recommendationPackage: DomainRecommendationPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry,
  kpiRegistry?: DomainKpiRegistry,
  regulationRegistry?: DomainRegulationRegistry,
  reasoningRegistry?: DomainReasoningRegistry
): DomainRecommendationRegistryMutationResult {
  const packageValidation = validateDomainRecommendationPackage(recommendationPackage, domainRegistry, vocabularyRegistry, ontologyRegistry, kpiRegistry, regulationRegistry, reasoningRegistry);
  if (!packageValidation.valid) return mutationResult(false, registry, null, packageValidation.issues);
  const registrationValidation = validateDomainRecommendationRegistration(registry, recommendationPackage, domainRegistry, vocabularyRegistry, ontologyRegistry, kpiRegistry, regulationRegistry, reasoningRegistry);
  if (!registrationValidation.valid) return mutationResult(false, registry, null, registrationValidation.issues);
  const registeredPackage = Object.freeze({ package: clonePackage(recommendationPackage), registrationOrder: registry.packages.length });
  return mutationResult(true, createRegistryFromPackages(registry.registryId, [...registry.packages, registeredPackage], registry.frozen), registeredPackage, []);
}

export function unregisterDomainRecommendationPackage(registry: DomainRecommendationRegistry, recommendationPackageId: DomainRecommendationPackageId): DomainRecommendationRegistryMutationResult {
  if (registry.frozen) return mutationResult(false, registry, null, [Object.freeze({ code: "registry_frozen", field: "registry", message: "Recommendation registry is frozen and cannot accept mutations.", severity: "error" as const })]);
  const existing = registry.indexes.byId[recommendationPackageId] ?? null;
  if (!existing) return mutationResult(false, registry, null, [Object.freeze({ code: "missing_recommendation_package", field: "recommendationPackageId", message: `Recommendation package not found: ${recommendationPackageId}.`, severity: "error" as const })]);
  const remaining = registry.packages.filter((entry) => entry.package.recommendationPackageId !== recommendationPackageId).map((entry, index) => Object.freeze({ ...entry, registrationOrder: index }));
  return mutationResult(true, createRegistryFromPackages(registry.registryId, remaining, registry.frozen), existing, []);
}

export function getDomainRecommendationPackage(registry: DomainRecommendationRegistry, recommendationPackageId: DomainRecommendationPackageId): RegisteredDomainRecommendationPackage | null {
  return registry.indexes.byId[recommendationPackageId] ?? null;
}

export function listDomainRecommendationPackages(registry: DomainRecommendationRegistry): readonly RegisteredDomainRecommendationPackage[] {
  return registry.packages;
}

export function listRecommendationPackagesByDomain(registry: DomainRecommendationRegistry, domainId: DomainId): readonly RegisteredDomainRecommendationPackage[] {
  return registry.indexes.byDomainId[domainId] ?? Object.freeze([]);
}

export function hasDomainRecommendationPackage(registry: DomainRecommendationRegistry, recommendationPackageId: DomainRecommendationPackageId): boolean {
  return registry.indexes.byId[recommendationPackageId] !== undefined;
}

export function freezeDomainRecommendationRegistry(registry: DomainRecommendationRegistry): DomainRecommendationRegistry {
  return createRegistryFromPackages(registry.registryId, registry.packages, true);
}
