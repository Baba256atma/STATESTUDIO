import { isValidDomainId, isValidDomainVersion, type DomainRegistry } from "./domainFoundationIndex.ts";
import type { DomainVocabularyRegistry } from "./domainVocabularyIndex.ts";
import type { DomainOntologyRegistry } from "./domainOntologyIndex.ts";
import type { DomainKpiRegistry } from "./domainKpiIndex.ts";
import type { DomainRegulationRegistry } from "./domainRegulationIndex.ts";
import {
  MAX_REASONING_CONTRACT_ID_LENGTH,
  MAX_REASONING_PACKAGE_ID_LENGTH,
  SUPPORTED_REASONING_SCOPES,
  SUPPORTED_REASONING_STATUSES,
} from "./domainReasoningConstants.ts";
import {
  DOMAIN_REASONING_CONTRACT_VERSION,
  type DomainReasoningAssumption,
  type DomainReasoningContract,
  type DomainReasoningContractId,
  type DomainReasoningEvidenceRequirement,
  type DomainReasoningInput,
  type DomainReasoningOutput,
  type DomainReasoningPackage,
  type DomainReasoningPackageId,
  type DomainReasoningReference,
  type DomainReasoningRegistry,
  type DomainReasoningScope,
  type DomainReasoningStatus,
  type DomainReasoningValidationIssue,
  type DomainReasoningValidationResult,
} from "./domainReasoningTypes.ts";

function issue(code: string, field: string, message: string): DomainReasoningValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" });
}

export function domainReasoningValidationResult(
  issues: readonly DomainReasoningValidationIssue[]
): DomainReasoningValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze([...issues]),
  });
}

function isLowerIdentifier(value: string, maxLength: number): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength && /^[a-z][a-z0-9._:-]*$/.test(trimmed);
}

export function isValidDomainReasoningPackageId(reasoningPackageId: DomainReasoningPackageId): boolean {
  return isLowerIdentifier(reasoningPackageId, MAX_REASONING_PACKAGE_ID_LENGTH);
}

export function isValidDomainReasoningContractId(contractId: DomainReasoningContractId): boolean {
  return isLowerIdentifier(contractId, MAX_REASONING_CONTRACT_ID_LENGTH);
}

export function isValidDomainReasoningScope(scope: DomainReasoningScope): boolean {
  return SUPPORTED_REASONING_SCOPES.includes(scope);
}

export function isValidDomainReasoningStatus(status: DomainReasoningStatus): boolean {
  return SUPPORTED_REASONING_STATUSES.includes(status);
}

function duplicateIssues(values: readonly string[], code: string, field: string, message: string) {
  return new Set(values).size === values.length ? [] : [issue(code, field, message)];
}

function validateText(value: string, code: string, field: string, message: string) {
  return typeof value === "string" && value.trim().length > 0 ? [] : [issue(code, field, message)];
}

function validateReference(
  reference: DomainReasoningReference | undefined,
  packageDomainId: string,
  field: string,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry,
  kpiRegistry?: DomainKpiRegistry,
  regulationRegistry?: DomainRegulationRegistry
): readonly DomainReasoningValidationIssue[] {
  if (!reference) return [];
  const issues: DomainReasoningValidationIssue[] = [];

  if (reference.domainId && reference.domainId !== packageDomainId) {
    issues.push(issue("incompatible_domain_reference", `${field}.domainId`, "Reasoning reference domain must match the package domain."));
  }
  if (reference.vocabularyId && vocabularyRegistry) {
    const vocabulary = vocabularyRegistry.indexes.byId[reference.vocabularyId] ?? null;
    if (!vocabulary) {
      issues.push(issue("missing_vocabulary_reference", `${field}.vocabularyId`, "Vocabulary reference must exist."));
    } else if (vocabulary.package.domainId !== packageDomainId) {
      issues.push(issue("incompatible_vocabulary_reference", `${field}.vocabularyId`, "Vocabulary reference must belong to the package domain."));
    } else if (reference.termId && !vocabulary.package.terms.some((term) => term.termId === reference.termId)) {
      issues.push(issue("missing_term_reference", `${field}.termId`, "Vocabulary term reference must exist."));
    }
  }
  if (reference.ontologyId && ontologyRegistry) {
    const ontology = ontologyRegistry.indexes.byId[reference.ontologyId] ?? null;
    if (!ontology) {
      issues.push(issue("missing_ontology_reference", `${field}.ontologyId`, "Ontology reference must exist."));
    } else if (ontology.package.domainId !== packageDomainId) {
      issues.push(issue("incompatible_ontology_reference", `${field}.ontologyId`, "Ontology reference must belong to the package domain."));
    } else {
      if (reference.entityTypeId && !ontology.package.entityTypes.some((entity) => entity.entityTypeId === reference.entityTypeId)) {
        issues.push(issue("missing_ontology_entity_reference", `${field}.entityTypeId`, "Ontology entity reference must exist."));
      }
      if (
        reference.relationshipTypeId &&
        !ontology.package.relationshipTypes.some((relationship) => relationship.relationshipTypeId === reference.relationshipTypeId)
      ) {
        issues.push(issue("missing_ontology_relationship_reference", `${field}.relationshipTypeId`, "Ontology relationship reference must exist."));
      }
      if (reference.attributeId && !ontology.package.attributes.some((attribute) => attribute.attributeId === reference.attributeId)) {
        issues.push(issue("missing_ontology_attribute_reference", `${field}.attributeId`, "Ontology attribute reference must exist."));
      }
    }
  }
  if (reference.kpiPackageId && kpiRegistry) {
    const kpiPackage = kpiRegistry.indexes.byId[reference.kpiPackageId] ?? null;
    if (!kpiPackage) {
      issues.push(issue("missing_kpi_reference", `${field}.kpiPackageId`, "KPI package reference must exist."));
    } else if (kpiPackage.package.domainId !== packageDomainId) {
      issues.push(issue("incompatible_kpi_reference", `${field}.kpiPackageId`, "KPI reference must belong to the package domain."));
    } else if (reference.kpiId && !kpiPackage.package.kpis.some((kpi) => kpi.kpiId === reference.kpiId)) {
      issues.push(issue("missing_kpi_id_reference", `${field}.kpiId`, "KPI reference must exist."));
    }
  }
  if (reference.regulationPackageId && regulationRegistry) {
    const regulationPackage = regulationRegistry.indexes.byId[reference.regulationPackageId] ?? null;
    if (!regulationPackage) {
      issues.push(issue("missing_regulation_reference", `${field}.regulationPackageId`, "Regulation package reference must exist."));
    } else if (regulationPackage.package.domainId !== packageDomainId) {
      issues.push(issue("incompatible_regulation_reference", `${field}.regulationPackageId`, "Regulation reference must belong to the package domain."));
    } else if (
      reference.regulationId &&
      !regulationPackage.package.regulations.some((regulation) => regulation.regulationId === reference.regulationId)
    ) {
      issues.push(issue("missing_regulation_id_reference", `${field}.regulationId`, "Regulation reference must exist."));
    }
  }
  return issues;
}

function validateInput(input: DomainReasoningInput, packageDomainId: string, index: number, registries: RegistrySet) {
  const field = `contracts.inputs.${index}`;
  return [
    ...validateText(input.inputId, "invalid_input_id", `${field}.inputId`, "Reasoning input id must be non-empty."),
    ...validateText(input.label, "invalid_input_label", `${field}.label`, "Reasoning input label must be non-empty."),
    ...validateText(input.description, "invalid_input_description", `${field}.description`, "Reasoning input description must be non-empty."),
    ...validateReference(input.reference, packageDomainId, `${field}.reference`, registries.vocabularyRegistry, registries.ontologyRegistry, registries.kpiRegistry, registries.regulationRegistry),
  ];
}

function validateOutput(output: DomainReasoningOutput, packageDomainId: string, index: number, registries: RegistrySet) {
  const field = `contracts.outputs.${index}`;
  return [
    ...validateText(output.outputId, "invalid_output_id", `${field}.outputId`, "Reasoning output id must be non-empty."),
    ...validateText(output.label, "invalid_output_label", `${field}.label`, "Reasoning output label must be non-empty."),
    ...validateText(output.description, "invalid_output_description", `${field}.description`, "Reasoning output description must be non-empty."),
    ...validateReference(output.reference, packageDomainId, `${field}.reference`, registries.vocabularyRegistry, registries.ontologyRegistry, registries.kpiRegistry, registries.regulationRegistry),
  ];
}

function validateEvidenceRequirement(
  evidence: DomainReasoningEvidenceRequirement,
  packageDomainId: string,
  index: number,
  registries: RegistrySet
) {
  const field = `contracts.evidenceRequirements.${index}`;
  return [
    ...validateText(evidence.evidenceRequirementId, "invalid_evidence_requirement_id", `${field}.evidenceRequirementId`, "Evidence requirement id must be non-empty."),
    ...validateText(evidence.label, "invalid_evidence_requirement_label", `${field}.label`, "Evidence requirement label must be non-empty."),
    ...validateText(evidence.description, "invalid_evidence_requirement_description", `${field}.description`, "Evidence requirement description must be non-empty."),
    ...validateReference(evidence.reference, packageDomainId, `${field}.reference`, registries.vocabularyRegistry, registries.ontologyRegistry, registries.kpiRegistry, registries.regulationRegistry),
  ];
}

function validateAssumption(assumption: DomainReasoningAssumption, packageDomainId: string, index: number, registries: RegistrySet) {
  const field = `contracts.assumptions.${index}`;
  const issues: DomainReasoningValidationIssue[] = [
    ...validateText(assumption.assumptionId, "invalid_assumption_id", `${field}.assumptionId`, "Assumption id must be non-empty."),
    ...validateText(assumption.label, "invalid_assumption_label", `${field}.label`, "Assumption label must be non-empty."),
    ...validateText(assumption.description, "invalid_assumption_description", `${field}.description`, "Assumption description must be non-empty."),
    ...validateReference(assumption.reference, packageDomainId, `${field}.reference`, registries.vocabularyRegistry, registries.ontologyRegistry, registries.kpiRegistry, registries.regulationRegistry),
  ];
  if (!["low", "medium", "high"].includes(assumption.uncertaintyImpact)) {
    issues.push(issue("invalid_assumption_uncertainty_impact", `${field}.uncertaintyImpact`, "Assumption uncertainty impact is not supported."));
  }
  return issues;
}

type RegistrySet = Readonly<{
  vocabularyRegistry?: DomainVocabularyRegistry;
  ontologyRegistry?: DomainOntologyRegistry;
  kpiRegistry?: DomainKpiRegistry;
  regulationRegistry?: DomainRegulationRegistry;
}>;

function validateContract(contract: DomainReasoningContract, packageDomainId: string, registries: RegistrySet) {
  const issues: DomainReasoningValidationIssue[] = [];
  if (!isValidDomainReasoningContractId(contract.contractId)) {
    issues.push(issue("invalid_reasoning_contract_id", "contracts.contractId", "Reasoning contract id must be a valid lowercase identifier."));
  }
  issues.push(...validateText(contract.label, "invalid_contract_label", "contracts.label", "Reasoning contract label must be non-empty."));
  issues.push(...validateText(contract.description, "invalid_contract_description", "contracts.description", "Reasoning contract description must be non-empty."));
  if (!isValidDomainReasoningScope(contract.scope)) {
    issues.push(issue("invalid_contract_scope", "contracts.scope", "Reasoning contract scope is not supported."));
  }
  if (!isValidDomainReasoningStatus(contract.status)) {
    issues.push(issue("invalid_contract_status", "contracts.status", "Reasoning contract status is not supported."));
  }
  issues.push(...duplicateIssues(contract.inputs.map((entry) => entry.inputId), "duplicate_input_id", "contracts.inputs", "Reasoning input ids must be unique within a contract."));
  issues.push(...duplicateIssues(contract.outputs.map((entry) => entry.outputId), "duplicate_output_id", "contracts.outputs", "Reasoning output ids must be unique within a contract."));
  issues.push(...duplicateIssues(contract.evidenceRequirements.map((entry) => entry.evidenceRequirementId), "duplicate_evidence_requirement_id", "contracts.evidenceRequirements", "Evidence requirement ids must be unique within a contract."));
  issues.push(...duplicateIssues(contract.assumptions.map((entry) => entry.assumptionId), "duplicate_assumption_id", "contracts.assumptions", "Assumption ids must be unique within a contract."));
  contract.inputs.forEach((entry, index) => issues.push(...validateInput(entry, packageDomainId, index, registries)));
  contract.outputs.forEach((entry, index) => issues.push(...validateOutput(entry, packageDomainId, index, registries)));
  contract.evidenceRequirements.forEach((entry, index) => issues.push(...validateEvidenceRequirement(entry, packageDomainId, index, registries)));
  contract.assumptions.forEach((entry, index) => issues.push(...validateAssumption(entry, packageDomainId, index, registries)));
  issues.push(...validateText(contract.confidence.explanation, "invalid_confidence_explanation", "contracts.confidence.explanation", "Confidence metadata explanation must be non-empty."));
  issues.push(...validateText(contract.uncertainty.explanation, "invalid_uncertainty_explanation", "contracts.uncertainty.explanation", "Uncertainty metadata explanation must be non-empty."));
  if (contract.uncertainty.sources.some((source) => source.trim().length === 0)) {
    issues.push(issue("invalid_uncertainty_source", "contracts.uncertainty.sources", "Uncertainty source labels must be non-empty."));
  }
  const inputIds = new Set(contract.inputs.map((entry) => entry.inputId));
  const outputIds = new Set(contract.outputs.map((entry) => entry.outputId));
  const evidenceIds = new Set(contract.evidenceRequirements.map((entry) => entry.evidenceRequirementId));
  const assumptionIds = new Set(contract.assumptions.map((entry) => entry.assumptionId));
  for (const inputId of contract.trace.traceInputIds) {
    if (!inputIds.has(inputId)) issues.push(issue("missing_trace_input", "contracts.trace.traceInputIds", "Trace input ids must reference contract inputs."));
  }
  for (const outputId of contract.trace.traceOutputIds) {
    if (!outputIds.has(outputId)) issues.push(issue("missing_trace_output", "contracts.trace.traceOutputIds", "Trace output ids must reference contract outputs."));
  }
  for (const evidenceId of contract.trace.traceEvidenceRequirementIds) {
    if (!evidenceIds.has(evidenceId)) issues.push(issue("missing_trace_evidence", "contracts.trace.traceEvidenceRequirementIds", "Trace evidence ids must reference evidence requirements."));
  }
  for (const assumptionId of contract.trace.traceAssumptionIds) {
    if (!assumptionIds.has(assumptionId)) issues.push(issue("missing_trace_assumption", "contracts.trace.traceAssumptionIds", "Trace assumption ids must reference assumptions."));
  }
  return issues;
}

export function validateDomainReasoningPackage(
  reasoningPackage: DomainReasoningPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry,
  kpiRegistry?: DomainKpiRegistry,
  regulationRegistry?: DomainRegulationRegistry
): DomainReasoningValidationResult {
  const issues: DomainReasoningValidationIssue[] = [];
  const registries = Object.freeze({ vocabularyRegistry, ontologyRegistry, kpiRegistry, regulationRegistry });
  if (reasoningPackage.contractVersion !== DOMAIN_REASONING_CONTRACT_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion", "Reasoning package contract version must be DOM-6:1."));
  }
  if (!isValidDomainReasoningPackageId(reasoningPackage.reasoningPackageId)) {
    issues.push(issue("invalid_reasoning_package_id", "reasoningPackageId", "Reasoning package id must be a valid lowercase identifier."));
  }
  if (!isValidDomainId(reasoningPackage.domainId)) {
    issues.push(issue("invalid_domain_reference", "domainId", "Domain reference must be a valid domain id."));
  }
  if (domainRegistry && !domainRegistry.indexes.byId[reasoningPackage.domainId]) {
    issues.push(issue("missing_domain_reference", "domainId", `Domain reference is not registered: ${reasoningPackage.domainId}.`));
  }
  issues.push(...validateText(reasoningPackage.name, "invalid_reasoning_package_name", "name", "Reasoning package name must be non-empty."));
  issues.push(...validateText(reasoningPackage.description, "invalid_reasoning_package_description", "description", "Reasoning package description must be non-empty."));
  if (!isValidDomainVersion(reasoningPackage.version)) {
    issues.push(issue("invalid_reasoning_version", "version", "Reasoning package version must use non-negative integer values."));
  }
  if (!isValidDomainReasoningScope(reasoningPackage.scope)) {
    issues.push(issue("invalid_reasoning_package_scope", "scope", "Reasoning package scope is not supported."));
  }
  if (!isValidDomainReasoningStatus(reasoningPackage.status)) {
    issues.push(issue("invalid_reasoning_package_status", "status", "Reasoning package status is not supported."));
  }
  issues.push(...duplicateIssues(reasoningPackage.contracts.map((entry) => entry.contractId), "duplicate_reasoning_contract_id", "contracts", "Reasoning contract ids must be unique within a package."));
  reasoningPackage.contracts.forEach((contract) => issues.push(...validateContract(contract, reasoningPackage.domainId, registries)));
  return domainReasoningValidationResult(issues);
}

export function validateDomainReasoningRegistration(
  registry: DomainReasoningRegistry,
  reasoningPackage: DomainReasoningPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry,
  kpiRegistry?: DomainKpiRegistry,
  regulationRegistry?: DomainRegulationRegistry
): DomainReasoningValidationResult {
  const issues = [...validateDomainReasoningPackage(reasoningPackage, domainRegistry, vocabularyRegistry, ontologyRegistry, kpiRegistry, regulationRegistry).issues];
  if (registry.frozen) {
    issues.push(issue("registry_frozen", "registry", "Reasoning registry is frozen and cannot accept mutations."));
  }
  if (registry.indexes.byId[reasoningPackage.reasoningPackageId]) {
    issues.push(issue("duplicate_reasoning_package_id", "reasoningPackageId", "Reasoning package id is already registered."));
  }
  for (const contract of reasoningPackage.contracts) {
    if (registry.indexes.byContractId[contract.contractId]) {
      issues.push(issue("duplicate_reasoning_contract_id", "contracts.contractId", `Reasoning contract id is already registered: ${contract.contractId}.`));
    }
  }
  return domainReasoningValidationResult(issues);
}

export function validateDomainReasoningRegistry(registry: DomainReasoningRegistry): DomainReasoningValidationResult {
  const issues: DomainReasoningValidationIssue[] = [];
  if (registry.contractVersion !== DOMAIN_REASONING_CONTRACT_VERSION) {
    issues.push(issue("invalid_registry_contract_version", "contractVersion", "Reasoning registry contract version must be DOM-6:1."));
  }
  const packageIds = registry.packages.map((entry) => entry.package.reasoningPackageId);
  const contractIds = registry.packages.flatMap((entry) => entry.package.contracts.map((contract) => contract.contractId));
  issues.push(...duplicateIssues(packageIds, "duplicate_registry_package_id", "packages", "Registry package ids must be unique."));
  issues.push(...duplicateIssues(contractIds, "duplicate_registry_contract_id", "packages.contracts", "Registry contract ids must be unique."));
  for (const entry of registry.packages) {
    if (registry.indexes.byId[entry.package.reasoningPackageId] !== entry) {
      issues.push(issue("registry_index_package_mismatch", "indexes.byId", "Package id index must reference the registered package."));
    }
    for (const contract of entry.package.contracts) {
      if (registry.indexes.byContractId[contract.contractId] !== entry) {
        issues.push(issue("registry_index_contract_mismatch", "indexes.byContractId", "Contract id index must reference the registered package."));
      }
    }
  }
  return domainReasoningValidationResult(issues);
}

export function validateDomainReasoningFoundation(): DomainReasoningValidationResult {
  return domainReasoningValidationResult([]);
}
