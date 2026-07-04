import {
  isValidDomainId,
  isValidDomainVersion,
  type DomainRegistry,
} from "./domainFoundationIndex.ts";
import type { DomainVocabularyRegistry } from "./domainVocabularyIndex.ts";
import type { DomainOntologyRegistry } from "./domainOntologyIndex.ts";
import type { DomainKpiRegistry } from "./domainKpiIndex.ts";
import {
  MAX_DOMAIN_CONTROL_ID_LENGTH,
  MAX_DOMAIN_EVIDENCE_ID_LENGTH,
  MAX_DOMAIN_OBLIGATION_ID_LENGTH,
  MAX_DOMAIN_REGULATION_ID_LENGTH,
  MAX_DOMAIN_REGULATION_PACKAGE_ID_LENGTH,
  SUPPORTED_DOMAIN_JURISDICTION_SCOPES,
  SUPPORTED_DOMAIN_REGULATION_SCOPES,
  SUPPORTED_DOMAIN_REGULATION_STATUSES,
} from "./domainRegulationConstants.ts";
import {
  DOMAIN_REGULATION_CONTRACT_VERSION,
  type DomainControlId,
  type DomainControlMetadata,
  type DomainEvidenceId,
  type DomainEvidenceMetadata,
  type DomainJurisdictionScope,
  type DomainObligationId,
  type DomainObligationMetadata,
  type DomainRegulationDefinition,
  type DomainRegulationId,
  type DomainRegulationPackage,
  type DomainRegulationPackageId,
  type DomainRegulationRegistry,
  type DomainRegulationScope,
  type DomainRegulationStatus,
  type DomainRegulationValidationIssue,
  type DomainRegulationValidationResult,
} from "./domainRegulationTypes.ts";

function issue(code: string, field: string, message: string): DomainRegulationValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" });
}

export function domainRegulationValidationResult(
  issues: readonly DomainRegulationValidationIssue[]
): DomainRegulationValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze([...issues]),
  });
}

function isLowerIdentifier(value: string, maxLength: number): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength && /^[a-z][a-z0-9._:-]*$/.test(trimmed);
}

export function isValidDomainRegulationPackageId(regulationPackageId: DomainRegulationPackageId): boolean {
  return isLowerIdentifier(regulationPackageId, MAX_DOMAIN_REGULATION_PACKAGE_ID_LENGTH);
}

export function isValidDomainRegulationId(regulationId: DomainRegulationId): boolean {
  return isLowerIdentifier(regulationId, MAX_DOMAIN_REGULATION_ID_LENGTH);
}

export function isValidDomainObligationId(obligationId: DomainObligationId): boolean {
  return isLowerIdentifier(obligationId, MAX_DOMAIN_OBLIGATION_ID_LENGTH);
}

export function isValidDomainControlId(controlId: DomainControlId): boolean {
  return isLowerIdentifier(controlId, MAX_DOMAIN_CONTROL_ID_LENGTH);
}

export function isValidDomainEvidenceId(evidenceId: DomainEvidenceId): boolean {
  return isLowerIdentifier(evidenceId, MAX_DOMAIN_EVIDENCE_ID_LENGTH);
}

export function isValidDomainRegulationStatus(status: DomainRegulationStatus): boolean {
  return SUPPORTED_DOMAIN_REGULATION_STATUSES.includes(status);
}

export function isValidDomainRegulationScope(scope: DomainRegulationScope): boolean {
  return SUPPORTED_DOMAIN_REGULATION_SCOPES.includes(scope);
}

export function isValidDomainJurisdictionScope(scope: DomainJurisdictionScope): boolean {
  return SUPPORTED_DOMAIN_JURISDICTION_SCOPES.includes(scope);
}

function duplicateIssues(values: readonly string[], code: string, field: string, message: string) {
  return new Set(values).size === values.length ? [] : [issue(code, field, message)];
}

function validateDomainReference(regulationPackage: DomainRegulationPackage, domainRegistry?: DomainRegistry) {
  const issues: DomainRegulationValidationIssue[] = [];
  if (!isValidDomainId(regulationPackage.domainId)) {
    issues.push(issue("invalid_domain_reference", "domainId", "Domain reference must be a valid domain id."));
  }
  if (domainRegistry && !domainRegistry.indexes.byId[regulationPackage.domainId]) {
    issues.push(
      issue("missing_domain_reference", "domainId", `Domain reference is not registered: ${regulationPackage.domainId}.`)
    );
  }
  return issues;
}

function validateOptionalReferences(
  regulationPackage: DomainRegulationPackage,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry,
  kpiRegistry?: DomainKpiRegistry
) {
  const issues: DomainRegulationValidationIssue[] = [];
  for (const regulation of regulationPackage.regulations) {
    const reference = regulation.reference;
    if (!reference) continue;

    if (reference.domainId && reference.domainId !== regulationPackage.domainId) {
      issues.push(issue("incompatible_domain_reference", "regulations.reference.domainId", "Regulation reference domain must match the package domain."));
    }
    if (reference.vocabularyId && vocabularyRegistry) {
      const vocabulary = vocabularyRegistry.indexes.byId[reference.vocabularyId] ?? null;
      if (!vocabulary) {
        issues.push(issue("missing_vocabulary_reference", "regulations.reference.vocabularyId", "Regulation vocabulary reference must exist."));
      } else if (vocabulary.package.domainId !== regulationPackage.domainId) {
        issues.push(issue("incompatible_vocabulary_reference", "regulations.reference.vocabularyId", "Regulation vocabulary reference must belong to the package domain."));
      } else if (
        reference.termId &&
        !vocabulary.package.terms.some((term) => term.termId === reference.termId)
      ) {
        issues.push(issue("missing_term_reference", "regulations.reference.termId", "Regulation vocabulary term reference must exist."));
      }
    }
    if (reference.ontologyId && ontologyRegistry) {
      const ontology = ontologyRegistry.indexes.byId[reference.ontologyId] ?? null;
      if (!ontology) {
        issues.push(issue("missing_ontology_reference", "regulations.reference.ontologyId", "Regulation ontology reference must exist."));
      } else if (ontology.package.domainId !== regulationPackage.domainId) {
        issues.push(issue("incompatible_ontology_reference", "regulations.reference.ontologyId", "Regulation ontology reference must belong to the package domain."));
      } else {
        if (
          reference.entityTypeId &&
          !ontology.package.entityTypes.some((entity) => entity.entityTypeId === reference.entityTypeId)
        ) {
          issues.push(issue("missing_ontology_entity_reference", "regulations.reference.entityTypeId", "Regulation ontology entity reference must exist."));
        }
        if (
          reference.relationshipTypeId &&
          !ontology.package.relationshipTypes.some((relationship) => relationship.relationshipTypeId === reference.relationshipTypeId)
        ) {
          issues.push(issue("missing_ontology_relationship_reference", "regulations.reference.relationshipTypeId", "Regulation ontology relationship reference must exist."));
        }
        if (
          reference.attributeId &&
          !ontology.package.attributes.some((attribute) => attribute.attributeId === reference.attributeId)
        ) {
          issues.push(issue("missing_ontology_attribute_reference", "regulations.reference.attributeId", "Regulation ontology attribute reference must exist."));
        }
      }
    }
    if (reference.kpiPackageId && kpiRegistry) {
      const kpiPackage = kpiRegistry.indexes.byId[reference.kpiPackageId] ?? null;
      if (!kpiPackage) {
        issues.push(issue("missing_kpi_reference", "regulations.reference.kpiPackageId", "Regulation KPI package reference must exist."));
      } else if (kpiPackage.package.domainId !== regulationPackage.domainId) {
        issues.push(issue("incompatible_kpi_reference", "regulations.reference.kpiPackageId", "Regulation KPI reference must belong to the package domain."));
      } else if (reference.kpiId && !kpiPackage.package.kpis.some((kpi) => kpi.kpiId === reference.kpiId)) {
        issues.push(issue("missing_kpi_id_reference", "regulations.reference.kpiId", "Regulation KPI reference must exist."));
      }
    }
  }
  return issues;
}

function validateRegulation(regulation: DomainRegulationDefinition): readonly DomainRegulationValidationIssue[] {
  const issues: DomainRegulationValidationIssue[] = [];
  if (!isValidDomainRegulationId(regulation.regulationId)) {
    issues.push(issue("invalid_regulation_id", "regulations.regulationId", "Regulation id must be a valid lowercase identifier."));
  }
  if (typeof regulation.label !== "string" || regulation.label.trim().length === 0) {
    issues.push(issue("invalid_regulation_label", "regulations.label", "Regulation label must be non-empty."));
  }
  if (typeof regulation.description !== "string" || regulation.description.trim().length === 0) {
    issues.push(issue("invalid_regulation_description", "regulations.description", "Regulation description must be non-empty."));
  }
  if (!isValidDomainRegulationScope(regulation.scope)) {
    issues.push(issue("invalid_regulation_scope", "regulations.scope", "Regulation scope is not supported."));
  }
  if (!isValidDomainJurisdictionScope(regulation.jurisdictionScope)) {
    issues.push(issue("invalid_jurisdiction_scope", "regulations.jurisdictionScope", "Regulation jurisdiction scope is not supported."));
  }
  if (!isValidDomainRegulationStatus(regulation.status)) {
    issues.push(issue("invalid_regulation_status", "regulations.status", "Regulation status is not supported."));
  }
  return issues;
}

function validateObligation(
  obligation: DomainObligationMetadata,
  regulationIds: ReadonlySet<DomainRegulationId>,
  controlIds: ReadonlySet<DomainControlId>
): readonly DomainRegulationValidationIssue[] {
  const issues: DomainRegulationValidationIssue[] = [];
  if (!isValidDomainObligationId(obligation.obligationId)) {
    issues.push(issue("invalid_obligation_id", "obligations.obligationId", "Obligation id must be a valid lowercase identifier."));
  }
  if (!regulationIds.has(obligation.regulationId)) {
    issues.push(issue("missing_obligation_regulation_reference", "obligations.regulationId", "Obligation regulation reference must exist."));
  }
  if (typeof obligation.label !== "string" || obligation.label.trim().length === 0) {
    issues.push(issue("invalid_obligation_label", "obligations.label", "Obligation label must be non-empty."));
  }
  if (typeof obligation.description !== "string" || obligation.description.trim().length === 0) {
    issues.push(issue("invalid_obligation_description", "obligations.description", "Obligation description must be non-empty."));
  }
  for (const controlId of obligation.controlIds) {
    if (!controlIds.has(controlId)) {
      issues.push(issue("missing_obligation_control_reference", "obligations.controlIds", "Obligation control reference must exist."));
    }
  }
  if (!isValidDomainRegulationScope(obligation.scope)) {
    issues.push(issue("invalid_obligation_scope", "obligations.scope", "Obligation scope is not supported."));
  }
  if (!isValidDomainRegulationStatus(obligation.status)) {
    issues.push(issue("invalid_obligation_status", "obligations.status", "Obligation status is not supported."));
  }
  return issues;
}

function validateControl(
  control: DomainControlMetadata,
  evidenceIds: ReadonlySet<DomainEvidenceId>
): readonly DomainRegulationValidationIssue[] {
  const issues: DomainRegulationValidationIssue[] = [];
  if (!isValidDomainControlId(control.controlId)) {
    issues.push(issue("invalid_control_id", "controls.controlId", "Control id must be a valid lowercase identifier."));
  }
  if (typeof control.label !== "string" || control.label.trim().length === 0) {
    issues.push(issue("invalid_control_label", "controls.label", "Control label must be non-empty."));
  }
  if (typeof control.description !== "string" || control.description.trim().length === 0) {
    issues.push(issue("invalid_control_description", "controls.description", "Control description must be non-empty."));
  }
  for (const evidenceId of control.evidenceIds) {
    if (!evidenceIds.has(evidenceId)) {
      issues.push(issue("missing_control_evidence_reference", "controls.evidenceIds", "Control evidence reference must exist."));
    }
  }
  if (!isValidDomainRegulationScope(control.scope)) {
    issues.push(issue("invalid_control_scope", "controls.scope", "Control scope is not supported."));
  }
  if (!isValidDomainRegulationStatus(control.status)) {
    issues.push(issue("invalid_control_status", "controls.status", "Control status is not supported."));
  }
  return issues;
}

function validateEvidence(evidence: DomainEvidenceMetadata): readonly DomainRegulationValidationIssue[] {
  const issues: DomainRegulationValidationIssue[] = [];
  if (!isValidDomainEvidenceId(evidence.evidenceId)) {
    issues.push(issue("invalid_evidence_id", "evidence.evidenceId", "Evidence id must be a valid lowercase identifier."));
  }
  if (typeof evidence.label !== "string" || evidence.label.trim().length === 0) {
    issues.push(issue("invalid_evidence_label", "evidence.label", "Evidence label must be non-empty."));
  }
  if (typeof evidence.description !== "string" || evidence.description.trim().length === 0) {
    issues.push(issue("invalid_evidence_description", "evidence.description", "Evidence description must be non-empty."));
  }
  if (typeof evidence.sourceDescription !== "string" || evidence.sourceDescription.trim().length === 0) {
    issues.push(issue("invalid_evidence_source", "evidence.sourceDescription", "Evidence source description must be non-empty."));
  }
  if (!isValidDomainRegulationScope(evidence.scope)) {
    issues.push(issue("invalid_evidence_scope", "evidence.scope", "Evidence scope is not supported."));
  }
  if (!isValidDomainRegulationStatus(evidence.status)) {
    issues.push(issue("invalid_evidence_status", "evidence.status", "Evidence status is not supported."));
  }
  return issues;
}

export function validateDomainRegulationPackage(
  regulationPackage: DomainRegulationPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry,
  kpiRegistry?: DomainKpiRegistry
): DomainRegulationValidationResult {
  const issues: DomainRegulationValidationIssue[] = [];
  if (regulationPackage.contractVersion !== DOMAIN_REGULATION_CONTRACT_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion", "Regulation package contract version must be DOM-5:1."));
  }
  if (!isValidDomainRegulationPackageId(regulationPackage.regulationPackageId)) {
    issues.push(issue("invalid_regulation_package_id", "regulationPackageId", "Regulation package id must be a valid lowercase identifier."));
  }
  issues.push(...validateDomainReference(regulationPackage, domainRegistry));
  if (typeof regulationPackage.name !== "string" || regulationPackage.name.trim().length === 0) {
    issues.push(issue("invalid_regulation_package_name", "name", "Regulation package name must be non-empty."));
  }
  if (typeof regulationPackage.description !== "string" || regulationPackage.description.trim().length === 0) {
    issues.push(issue("invalid_regulation_package_description", "description", "Regulation package description must be non-empty."));
  }
  if (!isValidDomainVersion(regulationPackage.version)) {
    issues.push(issue("invalid_regulation_version", "version", "Regulation package version must use non-negative integer values."));
  }
  if (!isValidDomainRegulationScope(regulationPackage.scope)) {
    issues.push(issue("invalid_regulation_package_scope", "scope", "Regulation package scope is not supported."));
  }
  if (!isValidDomainJurisdictionScope(regulationPackage.jurisdictionScope)) {
    issues.push(issue("invalid_package_jurisdiction_scope", "jurisdictionScope", "Regulation package jurisdiction scope is not supported."));
  }
  if (!isValidDomainRegulationStatus(regulationPackage.status)) {
    issues.push(issue("invalid_regulation_package_status", "status", "Regulation package status is not supported."));
  }

  issues.push(...duplicateIssues(regulationPackage.regulations.map((entry) => entry.regulationId), "duplicate_regulation_id", "regulations", "Regulation ids must be unique within a package."));
  issues.push(...duplicateIssues(regulationPackage.obligations.map((entry) => entry.obligationId), "duplicate_obligation_id", "obligations", "Obligation ids must be unique within a package."));
  issues.push(...duplicateIssues(regulationPackage.controls.map((entry) => entry.controlId), "duplicate_control_id", "controls", "Control ids must be unique within a package."));
  issues.push(...duplicateIssues(regulationPackage.evidence.map((entry) => entry.evidenceId), "duplicate_evidence_id", "evidence", "Evidence ids must be unique within a package."));

  const regulationIds = new Set(regulationPackage.regulations.map((entry) => entry.regulationId));
  const controlIds = new Set(regulationPackage.controls.map((entry) => entry.controlId));
  const evidenceIds = new Set(regulationPackage.evidence.map((entry) => entry.evidenceId));

  for (const regulation of regulationPackage.regulations) issues.push(...validateRegulation(regulation));
  for (const obligation of regulationPackage.obligations) issues.push(...validateObligation(obligation, regulationIds, controlIds));
  for (const control of regulationPackage.controls) issues.push(...validateControl(control, evidenceIds));
  for (const evidence of regulationPackage.evidence) issues.push(...validateEvidence(evidence));
  issues.push(...validateOptionalReferences(regulationPackage, vocabularyRegistry, ontologyRegistry, kpiRegistry));

  return domainRegulationValidationResult(issues);
}

export function validateDomainRegulationRegistration(
  registry: DomainRegulationRegistry,
  regulationPackage: DomainRegulationPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry,
  kpiRegistry?: DomainKpiRegistry
): DomainRegulationValidationResult {
  const issues = [
    ...validateDomainRegulationPackage(
      regulationPackage,
      domainRegistry,
      vocabularyRegistry,
      ontologyRegistry,
      kpiRegistry
    ).issues,
  ];
  if (registry.frozen) {
    issues.push(issue("registry_frozen", "registry", "Regulation registry is frozen and cannot accept mutations."));
  }
  if (registry.indexes.byId[regulationPackage.regulationPackageId]) {
    issues.push(
      issue(
        "duplicate_regulation_package_id",
        "regulationPackageId",
        `Regulation package id already registered: ${regulationPackage.regulationPackageId}.`
      )
    );
  }
  return domainRegulationValidationResult(issues);
}

export function validateDomainRegulationRegistry(registry: DomainRegulationRegistry): DomainRegulationValidationResult {
  const issues: DomainRegulationValidationIssue[] = [];
  const packageIds = registry.packages.map((entry) => entry.package.regulationPackageId);
  if (registry.contractVersion !== DOMAIN_REGULATION_CONTRACT_VERSION) {
    issues.push(issue("invalid_registry_contract_version", "contractVersion", "Registry contract version must be DOM-5:1."));
  }
  if (new Set(packageIds).size !== packageIds.length) {
    issues.push(issue("duplicate_registry_regulation_package_id", "packages", "Registry contains duplicate regulation package ids."));
  }
  if (registry.packages.some((entry, index) => entry.registrationOrder !== index)) {
    issues.push(issue("invalid_registration_order", "packages", "Registry registration order is inconsistent."));
  }
  for (const entry of registry.packages) {
    issues.push(...validateDomainRegulationPackage(entry.package).issues);
    if (!registry.indexes.byId[entry.package.regulationPackageId]) {
      issues.push(issue("invalid_registry_index", "indexes.byId", "Regulation registry id index is inconsistent."));
    }
    if (!(registry.indexes.byDomainId[entry.package.domainId] ?? []).some((indexed) => indexed.package.regulationPackageId === entry.package.regulationPackageId)) {
      issues.push(issue("invalid_registry_domain_index", "indexes.byDomainId", "Regulation registry domain index is inconsistent."));
    }
  }
  return domainRegulationValidationResult(issues);
}

export function validateDomainRegulationFoundation(): DomainRegulationValidationResult {
  return domainRegulationValidationResult([]);
}
