import { isValidDomainId, isValidDomainVersion, type DomainRegistry } from "./domainFoundationIndex.ts";
import type { DomainVocabularyRegistry } from "./domainVocabularyIndex.ts";
import type { DomainOntologyRegistry } from "./domainOntologyIndex.ts";
import type { DomainKpiRegistry } from "./domainKpiIndex.ts";
import type { DomainRegulationRegistry } from "./domainRegulationIndex.ts";
import type { DomainReasoningRegistry } from "./domainReasoningIndex.ts";
import {
  MAX_RECOMMENDATION_CONTRACT_ID_LENGTH,
  MAX_RECOMMENDATION_PACKAGE_ID_LENGTH,
  SUPPORTED_RECOMMENDATION_SCOPES,
  SUPPORTED_RECOMMENDATION_STATUSES,
} from "./domainRecommendationConstants.ts";
import {
  DOMAIN_RECOMMENDATION_CONTRACT_VERSION,
  type DomainRecommendationAssumption,
  type DomainRecommendationContract,
  type DomainRecommendationContractId,
  type DomainRecommendationConstraint,
  type DomainRecommendationInput,
  type DomainRecommendationOutput,
  type DomainRecommendationPackage,
  type DomainRecommendationPackageId,
  type DomainRecommendationReference,
  type DomainRecommendationRegistry,
  type DomainRecommendationScope,
  type DomainRecommendationStatus,
  type DomainRecommendationValidationIssue,
  type DomainRecommendationValidationResult,
} from "./domainRecommendationTypes.ts";

type RegistrySet = Readonly<{
  vocabularyRegistry?: DomainVocabularyRegistry;
  ontologyRegistry?: DomainOntologyRegistry;
  kpiRegistry?: DomainKpiRegistry;
  regulationRegistry?: DomainRegulationRegistry;
  reasoningRegistry?: DomainReasoningRegistry;
}>;

function issue(code: string, field: string, message: string): DomainRecommendationValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" });
}

export function domainRecommendationValidationResult(
  issues: readonly DomainRecommendationValidationIssue[]
): DomainRecommendationValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function isLowerIdentifier(value: string, maxLength: number): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength && /^[a-z][a-z0-9._:-]*$/.test(trimmed);
}

export function isValidDomainRecommendationPackageId(packageId: DomainRecommendationPackageId): boolean {
  return isLowerIdentifier(packageId, MAX_RECOMMENDATION_PACKAGE_ID_LENGTH);
}

export function isValidDomainRecommendationContractId(contractId: DomainRecommendationContractId): boolean {
  return isLowerIdentifier(contractId, MAX_RECOMMENDATION_CONTRACT_ID_LENGTH);
}

export function isValidDomainRecommendationScope(scope: DomainRecommendationScope): boolean {
  return SUPPORTED_RECOMMENDATION_SCOPES.includes(scope);
}

export function isValidDomainRecommendationStatus(status: DomainRecommendationStatus): boolean {
  return SUPPORTED_RECOMMENDATION_STATUSES.includes(status);
}

function duplicateIssues(values: readonly string[], code: string, field: string, message: string) {
  return new Set(values).size === values.length ? [] : [issue(code, field, message)];
}

function validateText(value: string, code: string, field: string, message: string) {
  return typeof value === "string" && value.trim().length > 0 ? [] : [issue(code, field, message)];
}

function validateReference(
  reference: DomainRecommendationReference | undefined,
  packageDomainId: string,
  field: string,
  registries: RegistrySet
): readonly DomainRecommendationValidationIssue[] {
  if (!reference) return [];
  const issues: DomainRecommendationValidationIssue[] = [];
  if (reference.domainId && reference.domainId !== packageDomainId) {
    issues.push(issue("incompatible_domain_reference", `${field}.domainId`, "Recommendation reference domain must match the package domain."));
  }
  if (reference.vocabularyId && registries.vocabularyRegistry) {
    const vocabulary = registries.vocabularyRegistry.indexes.byId[reference.vocabularyId] ?? null;
    if (!vocabulary) issues.push(issue("missing_vocabulary_reference", `${field}.vocabularyId`, "Vocabulary reference must exist."));
    else if (vocabulary.package.domainId !== packageDomainId) issues.push(issue("incompatible_vocabulary_reference", `${field}.vocabularyId`, "Vocabulary reference must belong to the package domain."));
    else if (reference.termId && !vocabulary.package.terms.some((term) => term.termId === reference.termId)) issues.push(issue("missing_term_reference", `${field}.termId`, "Vocabulary term reference must exist."));
  }
  if (reference.ontologyId && registries.ontologyRegistry) {
    const ontology = registries.ontologyRegistry.indexes.byId[reference.ontologyId] ?? null;
    if (!ontology) issues.push(issue("missing_ontology_reference", `${field}.ontologyId`, "Ontology reference must exist."));
    else if (ontology.package.domainId !== packageDomainId) issues.push(issue("incompatible_ontology_reference", `${field}.ontologyId`, "Ontology reference must belong to the package domain."));
    else {
      if (reference.entityTypeId && !ontology.package.entityTypes.some((entity) => entity.entityTypeId === reference.entityTypeId)) issues.push(issue("missing_ontology_entity_reference", `${field}.entityTypeId`, "Ontology entity reference must exist."));
      if (reference.relationshipTypeId && !ontology.package.relationshipTypes.some((relationship) => relationship.relationshipTypeId === reference.relationshipTypeId)) issues.push(issue("missing_ontology_relationship_reference", `${field}.relationshipTypeId`, "Ontology relationship reference must exist."));
      if (reference.attributeId && !ontology.package.attributes.some((attribute) => attribute.attributeId === reference.attributeId)) issues.push(issue("missing_ontology_attribute_reference", `${field}.attributeId`, "Ontology attribute reference must exist."));
    }
  }
  if (reference.kpiPackageId && registries.kpiRegistry) {
    const kpiPackage = registries.kpiRegistry.indexes.byId[reference.kpiPackageId] ?? null;
    if (!kpiPackage) issues.push(issue("missing_kpi_reference", `${field}.kpiPackageId`, "KPI package reference must exist."));
    else if (kpiPackage.package.domainId !== packageDomainId) issues.push(issue("incompatible_kpi_reference", `${field}.kpiPackageId`, "KPI reference must belong to the package domain."));
    else if (reference.kpiId && !kpiPackage.package.kpis.some((kpi) => kpi.kpiId === reference.kpiId)) issues.push(issue("missing_kpi_id_reference", `${field}.kpiId`, "KPI reference must exist."));
  }
  if (reference.regulationPackageId && registries.regulationRegistry) {
    const regulationPackage = registries.regulationRegistry.indexes.byId[reference.regulationPackageId] ?? null;
    if (!regulationPackage) issues.push(issue("missing_regulation_reference", `${field}.regulationPackageId`, "Regulation package reference must exist."));
    else if (regulationPackage.package.domainId !== packageDomainId) issues.push(issue("incompatible_regulation_reference", `${field}.regulationPackageId`, "Regulation reference must belong to the package domain."));
    else if (reference.regulationId && !regulationPackage.package.regulations.some((regulation) => regulation.regulationId === reference.regulationId)) issues.push(issue("missing_regulation_id_reference", `${field}.regulationId`, "Regulation reference must exist."));
  }
  if (reference.reasoningPackageId && registries.reasoningRegistry) {
    const reasoningPackage = registries.reasoningRegistry.indexes.byId[reference.reasoningPackageId] ?? null;
    if (!reasoningPackage) issues.push(issue("missing_reasoning_reference", `${field}.reasoningPackageId`, "Reasoning package reference must exist."));
    else if (reasoningPackage.package.domainId !== packageDomainId) issues.push(issue("incompatible_reasoning_reference", `${field}.reasoningPackageId`, "Reasoning reference must belong to the package domain."));
    else if (reference.reasoningContractId && !reasoningPackage.package.contracts.some((contract) => contract.contractId === reference.reasoningContractId)) issues.push(issue("missing_reasoning_contract_reference", `${field}.reasoningContractId`, "Reasoning contract reference must exist."));
  }
  return issues;
}

function validateInput(input: DomainRecommendationInput, packageDomainId: string, index: number, registries: RegistrySet) {
  const field = `contracts.inputs.${index}`;
  return [
    ...validateText(input.inputId, "invalid_input_id", `${field}.inputId`, "Recommendation input id must be non-empty."),
    ...validateText(input.label, "invalid_input_label", `${field}.label`, "Recommendation input label must be non-empty."),
    ...validateText(input.description, "invalid_input_description", `${field}.description`, "Recommendation input description must be non-empty."),
    ...validateReference(input.reference, packageDomainId, `${field}.reference`, registries),
  ];
}

function validateOutput(output: DomainRecommendationOutput, packageDomainId: string, index: number, registries: RegistrySet) {
  const field = `contracts.outputs.${index}`;
  return [
    ...validateText(output.outputId, "invalid_output_id", `${field}.outputId`, "Recommendation output id must be non-empty."),
    ...validateText(output.label, "invalid_output_label", `${field}.label`, "Recommendation output label must be non-empty."),
    ...validateText(output.description, "invalid_output_description", `${field}.description`, "Recommendation output description must be non-empty."),
    ...validateReference(output.reference, packageDomainId, `${field}.reference`, registries),
  ];
}

function validateConstraint(constraint: DomainRecommendationConstraint, packageDomainId: string, index: number, registries: RegistrySet) {
  const field = `contracts.constraints.${index}`;
  const issues = [
    ...validateText(constraint.constraintId, "invalid_constraint_id", `${field}.constraintId`, "Recommendation constraint id must be non-empty."),
    ...validateText(constraint.label, "invalid_constraint_label", `${field}.label`, "Recommendation constraint label must be non-empty."),
    ...validateText(constraint.description, "invalid_constraint_description", `${field}.description`, "Recommendation constraint description must be non-empty."),
    ...validateReference(constraint.reference, packageDomainId, `${field}.reference`, registries),
  ];
  if (!["info", "warning", "blocking"].includes(constraint.severity)) issues.push(issue("invalid_constraint_severity", `${field}.severity`, "Recommendation constraint severity is not supported."));
  return issues;
}

function validateAssumption(assumption: DomainRecommendationAssumption, packageDomainId: string, index: number, registries: RegistrySet) {
  const field = `contracts.assumptions.${index}`;
  const issues = [
    ...validateText(assumption.assumptionId, "invalid_assumption_id", `${field}.assumptionId`, "Recommendation assumption id must be non-empty."),
    ...validateText(assumption.label, "invalid_assumption_label", `${field}.label`, "Recommendation assumption label must be non-empty."),
    ...validateText(assumption.description, "invalid_assumption_description", `${field}.description`, "Recommendation assumption description must be non-empty."),
    ...validateReference(assumption.reference, packageDomainId, `${field}.reference`, registries),
  ];
  if (!["low", "medium", "high"].includes(assumption.uncertaintyImpact)) issues.push(issue("invalid_assumption_uncertainty_impact", `${field}.uncertaintyImpact`, "Assumption uncertainty impact is not supported."));
  return issues;
}

function validateContract(contract: DomainRecommendationContract, packageDomainId: string, registries: RegistrySet) {
  const issues: DomainRecommendationValidationIssue[] = [];
  if (!isValidDomainRecommendationContractId(contract.contractId)) issues.push(issue("invalid_recommendation_contract_id", "contracts.contractId", "Recommendation contract id must be a valid lowercase identifier."));
  issues.push(...validateText(contract.label, "invalid_contract_label", "contracts.label", "Recommendation contract label must be non-empty."));
  issues.push(...validateText(contract.description, "invalid_contract_description", "contracts.description", "Recommendation contract description must be non-empty."));
  if (!isValidDomainRecommendationScope(contract.scope)) issues.push(issue("invalid_contract_scope", "contracts.scope", "Recommendation contract scope is not supported."));
  if (!isValidDomainRecommendationStatus(contract.status)) issues.push(issue("invalid_contract_status", "contracts.status", "Recommendation contract status is not supported."));
  issues.push(...duplicateIssues(contract.inputs.map((entry) => entry.inputId), "duplicate_input_id", "contracts.inputs", "Recommendation input ids must be unique."));
  issues.push(...duplicateIssues(contract.outputs.map((entry) => entry.outputId), "duplicate_output_id", "contracts.outputs", "Recommendation output ids must be unique."));
  issues.push(...duplicateIssues(contract.constraints.map((entry) => entry.constraintId), "duplicate_constraint_id", "contracts.constraints", "Recommendation constraint ids must be unique."));
  issues.push(...duplicateIssues(contract.assumptions.map((entry) => entry.assumptionId), "duplicate_assumption_id", "contracts.assumptions", "Recommendation assumption ids must be unique."));
  contract.inputs.forEach((entry, index) => issues.push(...validateInput(entry, packageDomainId, index, registries)));
  contract.outputs.forEach((entry, index) => issues.push(...validateOutput(entry, packageDomainId, index, registries)));
  contract.constraints.forEach((entry, index) => issues.push(...validateConstraint(entry, packageDomainId, index, registries)));
  contract.assumptions.forEach((entry, index) => issues.push(...validateAssumption(entry, packageDomainId, index, registries)));
  issues.push(...validateText(contract.rationale.explanation, "invalid_rationale_explanation", "contracts.rationale.explanation", "Rationale explanation must be non-empty."));
  issues.push(...validateText(contract.confidence.explanation, "invalid_confidence_explanation", "contracts.confidence.explanation", "Confidence metadata explanation must be non-empty."));
  issues.push(...validateText(contract.uncertainty.explanation, "invalid_uncertainty_explanation", "contracts.uncertainty.explanation", "Uncertainty metadata explanation must be non-empty."));
  if (contract.uncertainty.sources.some((source) => source.trim().length === 0)) issues.push(issue("invalid_uncertainty_source", "contracts.uncertainty.sources", "Uncertainty source labels must be non-empty."));
  const inputIds = new Set(contract.inputs.map((entry) => entry.inputId));
  const outputIds = new Set(contract.outputs.map((entry) => entry.outputId));
  const constraintIds = new Set(contract.constraints.map((entry) => entry.constraintId));
  const assumptionIds = new Set(contract.assumptions.map((entry) => entry.assumptionId));
  for (const inputId of contract.rationale.rationaleInputs) if (!inputIds.has(inputId)) issues.push(issue("missing_rationale_input", "contracts.rationale.rationaleInputs", "Rationale input ids must reference inputs."));
  for (const assumptionId of contract.rationale.rationaleAssumptions) if (!assumptionIds.has(assumptionId)) issues.push(issue("missing_rationale_assumption", "contracts.rationale.rationaleAssumptions", "Rationale assumption ids must reference assumptions."));
  for (const inputId of contract.trace.traceInputIds) if (!inputIds.has(inputId)) issues.push(issue("missing_trace_input", "contracts.trace.traceInputIds", "Trace input ids must reference inputs."));
  for (const outputId of contract.trace.traceOutputIds) if (!outputIds.has(outputId)) issues.push(issue("missing_trace_output", "contracts.trace.traceOutputIds", "Trace output ids must reference outputs."));
  for (const constraintId of contract.trace.traceConstraintIds) if (!constraintIds.has(constraintId)) issues.push(issue("missing_trace_constraint", "contracts.trace.traceConstraintIds", "Trace constraint ids must reference constraints."));
  for (const assumptionId of contract.trace.traceAssumptionIds) if (!assumptionIds.has(assumptionId)) issues.push(issue("missing_trace_assumption", "contracts.trace.traceAssumptionIds", "Trace assumption ids must reference assumptions."));
  return issues;
}

export function validateDomainRecommendationPackage(
  recommendationPackage: DomainRecommendationPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry,
  kpiRegistry?: DomainKpiRegistry,
  regulationRegistry?: DomainRegulationRegistry,
  reasoningRegistry?: DomainReasoningRegistry
): DomainRecommendationValidationResult {
  const issues: DomainRecommendationValidationIssue[] = [];
  const registries = Object.freeze({ vocabularyRegistry, ontologyRegistry, kpiRegistry, regulationRegistry, reasoningRegistry });
  if (recommendationPackage.contractVersion !== DOMAIN_RECOMMENDATION_CONTRACT_VERSION) issues.push(issue("invalid_contract_version", "contractVersion", "Recommendation package contract version must be DOM-7:1."));
  if (!isValidDomainRecommendationPackageId(recommendationPackage.recommendationPackageId)) issues.push(issue("invalid_recommendation_package_id", "recommendationPackageId", "Recommendation package id must be a valid lowercase identifier."));
  if (!isValidDomainId(recommendationPackage.domainId)) issues.push(issue("invalid_domain_reference", "domainId", "Domain reference must be a valid domain id."));
  if (domainRegistry && !domainRegistry.indexes.byId[recommendationPackage.domainId]) issues.push(issue("missing_domain_reference", "domainId", `Domain reference is not registered: ${recommendationPackage.domainId}.`));
  issues.push(...validateText(recommendationPackage.name, "invalid_recommendation_package_name", "name", "Recommendation package name must be non-empty."));
  issues.push(...validateText(recommendationPackage.description, "invalid_recommendation_package_description", "description", "Recommendation package description must be non-empty."));
  if (!isValidDomainVersion(recommendationPackage.version)) issues.push(issue("invalid_recommendation_version", "version", "Recommendation package version must use non-negative integer values."));
  if (!isValidDomainRecommendationScope(recommendationPackage.scope)) issues.push(issue("invalid_recommendation_package_scope", "scope", "Recommendation package scope is not supported."));
  if (!isValidDomainRecommendationStatus(recommendationPackage.status)) issues.push(issue("invalid_recommendation_package_status", "status", "Recommendation package status is not supported."));
  issues.push(...duplicateIssues(recommendationPackage.contracts.map((entry) => entry.contractId), "duplicate_recommendation_contract_id", "contracts", "Recommendation contract ids must be unique within a package."));
  recommendationPackage.contracts.forEach((contract) => issues.push(...validateContract(contract, recommendationPackage.domainId, registries)));
  return domainRecommendationValidationResult(issues);
}

export function validateDomainRecommendationRegistration(
  registry: DomainRecommendationRegistry,
  recommendationPackage: DomainRecommendationPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry,
  kpiRegistry?: DomainKpiRegistry,
  regulationRegistry?: DomainRegulationRegistry,
  reasoningRegistry?: DomainReasoningRegistry
): DomainRecommendationValidationResult {
  const issues = [...validateDomainRecommendationPackage(recommendationPackage, domainRegistry, vocabularyRegistry, ontologyRegistry, kpiRegistry, regulationRegistry, reasoningRegistry).issues];
  if (registry.frozen) issues.push(issue("registry_frozen", "registry", "Recommendation registry is frozen and cannot accept mutations."));
  if (registry.indexes.byId[recommendationPackage.recommendationPackageId]) issues.push(issue("duplicate_recommendation_package_id", "recommendationPackageId", "Recommendation package id is already registered."));
  for (const contract of recommendationPackage.contracts) {
    if (registry.indexes.byContractId[contract.contractId]) issues.push(issue("duplicate_recommendation_contract_id", "contracts.contractId", `Recommendation contract id is already registered: ${contract.contractId}.`));
  }
  return domainRecommendationValidationResult(issues);
}

export function validateDomainRecommendationRegistry(registry: DomainRecommendationRegistry): DomainRecommendationValidationResult {
  const issues: DomainRecommendationValidationIssue[] = [];
  if (registry.contractVersion !== DOMAIN_RECOMMENDATION_CONTRACT_VERSION) issues.push(issue("invalid_registry_contract_version", "contractVersion", "Recommendation registry contract version must be DOM-7:1."));
  issues.push(...duplicateIssues(registry.packages.map((entry) => entry.package.recommendationPackageId), "duplicate_registry_package_id", "packages", "Registry package ids must be unique."));
  issues.push(...duplicateIssues(registry.packages.flatMap((entry) => entry.package.contracts.map((contract) => contract.contractId)), "duplicate_registry_contract_id", "packages.contracts", "Registry contract ids must be unique."));
  for (const entry of registry.packages) {
    if (registry.indexes.byId[entry.package.recommendationPackageId] !== entry) issues.push(issue("registry_index_package_mismatch", "indexes.byId", "Package id index must reference the registered package."));
    for (const contract of entry.package.contracts) {
      if (registry.indexes.byContractId[contract.contractId] !== entry) issues.push(issue("registry_index_contract_mismatch", "indexes.byContractId", "Contract id index must reference the registered package."));
    }
  }
  return domainRecommendationValidationResult(issues);
}

export function validateDomainRecommendationFoundation(): DomainRecommendationValidationResult {
  return domainRecommendationValidationResult([]);
}
