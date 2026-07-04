import {
  isValidDomainId,
  isValidDomainVersion,
  type DomainRegistry,
} from "./domainFoundationIndex.ts";
import type { DomainVocabularyRegistry } from "./domainVocabularyIndex.ts";
import type { DomainOntologyRegistry } from "./domainOntologyIndex.ts";
import {
  MAX_DOMAIN_KPI_ID_LENGTH,
  MAX_DOMAIN_KPI_PACKAGE_ID_LENGTH,
  SUPPORTED_DOMAIN_KPI_AGGREGATION_TYPES,
  SUPPORTED_DOMAIN_KPI_DIRECTIONS,
  SUPPORTED_DOMAIN_KPI_SCOPES,
  SUPPORTED_DOMAIN_KPI_UNIT_TYPES,
} from "./domainKpiConstants.ts";
import {
  DOMAIN_KPI_CONTRACT_VERSION,
  type DomainKpiAggregationType,
  type DomainKpiDefinition,
  type DomainKpiDirection,
  type DomainKpiId,
  type DomainKpiPackage,
  type DomainKpiPackageId,
  type DomainKpiRegistry,
  type DomainKpiScope,
  type DomainKpiStatus,
  type DomainKpiUnitType,
  type DomainKpiValidationIssue,
  type DomainKpiValidationResult,
} from "./domainKpiTypes.ts";

function issue(code: string, field: string, message: string): DomainKpiValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" });
}

export function domainKpiValidationResult(issues: readonly DomainKpiValidationIssue[]): DomainKpiValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze([...issues]),
  });
}

const KPI_STATUSES: readonly DomainKpiStatus[] = Object.freeze(["draft", "active", "deprecated", "archived"]);

function isLowerIdentifier(value: string, maxLength: number): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength && /^[a-z][a-z0-9._:-]*$/.test(trimmed);
}

export function isValidDomainKpiId(kpiId: DomainKpiId): boolean {
  return isLowerIdentifier(kpiId, MAX_DOMAIN_KPI_ID_LENGTH);
}

export function isValidDomainKpiPackageId(kpiPackageId: DomainKpiPackageId): boolean {
  return isLowerIdentifier(kpiPackageId, MAX_DOMAIN_KPI_PACKAGE_ID_LENGTH);
}

export function isValidDomainKpiStatus(status: DomainKpiStatus): boolean {
  return KPI_STATUSES.includes(status);
}

export function isValidDomainKpiScope(scope: DomainKpiScope): boolean {
  return SUPPORTED_DOMAIN_KPI_SCOPES.includes(scope);
}

export function isValidDomainKpiUnitType(unitType: DomainKpiUnitType): boolean {
  return SUPPORTED_DOMAIN_KPI_UNIT_TYPES.includes(unitType);
}

export function isValidDomainKpiAggregationType(aggregationType: DomainKpiAggregationType): boolean {
  return SUPPORTED_DOMAIN_KPI_AGGREGATION_TYPES.includes(aggregationType);
}

export function isValidDomainKpiDirection(direction: DomainKpiDirection): boolean {
  return SUPPORTED_DOMAIN_KPI_DIRECTIONS.includes(direction);
}

function duplicateIssues(values: readonly string[], code: string, field: string, message: string) {
  return new Set(values).size === values.length ? [] : [issue(code, field, message)];
}

function validateDomainReference(kpiPackage: DomainKpiPackage, domainRegistry?: DomainRegistry) {
  const issues: DomainKpiValidationIssue[] = [];
  if (!isValidDomainId(kpiPackage.domainId)) {
    issues.push(issue("invalid_domain_reference", "domainId", "Domain reference must be a valid domain id."));
  }
  if (domainRegistry && !domainRegistry.indexes.byId[kpiPackage.domainId]) {
    issues.push(issue("missing_domain_reference", "domainId", `Domain reference is not registered: ${kpiPackage.domainId}.`));
  }
  return issues;
}

function validateKpiReferences(
  kpiPackage: DomainKpiPackage,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry
) {
  const issues: DomainKpiValidationIssue[] = [];
  for (const kpi of kpiPackage.kpis) {
    if (kpi.reference?.vocabularyId && vocabularyRegistry) {
      const vocabulary = vocabularyRegistry.indexes.byId[kpi.reference.vocabularyId] ?? null;
      if (!vocabulary) {
        issues.push(issue("missing_vocabulary_reference", "kpis.reference.vocabularyId", "KPI vocabulary reference must exist."));
      } else if (vocabulary.package.domainId !== kpiPackage.domainId) {
        issues.push(issue("incompatible_vocabulary_reference", "kpis.reference.vocabularyId", "KPI vocabulary reference must belong to the KPI package domain."));
      }
    }
    if (kpi.reference?.ontologyId && ontologyRegistry) {
      const ontology = ontologyRegistry.indexes.byId[kpi.reference.ontologyId] ?? null;
      if (!ontology) {
        issues.push(issue("missing_ontology_reference", "kpis.reference.ontologyId", "KPI ontology reference must exist."));
      } else if (ontology.package.domainId !== kpiPackage.domainId) {
        issues.push(issue("incompatible_ontology_reference", "kpis.reference.ontologyId", "KPI ontology reference must belong to the KPI package domain."));
      } else {
        if (
          kpi.reference.entityTypeId &&
          !ontology.package.entityTypes.some((entity) => entity.entityTypeId === kpi.reference?.entityTypeId)
        ) {
          issues.push(issue("missing_ontology_entity_reference", "kpis.reference.entityTypeId", "KPI ontology entity reference must exist."));
        }
        if (
          kpi.reference.attributeId &&
          !ontology.package.attributes.some((attribute) => attribute.attributeId === kpi.reference?.attributeId)
        ) {
          issues.push(issue("missing_ontology_attribute_reference", "kpis.reference.attributeId", "KPI ontology attribute reference must exist."));
        }
      }
    }
  }
  return issues;
}

function validateKpiDefinition(kpi: DomainKpiDefinition): readonly DomainKpiValidationIssue[] {
  const issues: DomainKpiValidationIssue[] = [];
  if (!isValidDomainKpiId(kpi.kpiId)) {
    issues.push(issue("invalid_kpi_id", "kpis.kpiId", "KPI id must be a valid lowercase identifier."));
  }
  if (typeof kpi.label !== "string" || kpi.label.trim().length === 0) {
    issues.push(issue("invalid_kpi_label", "kpis.label", "KPI label must be non-empty."));
  }
  if (typeof kpi.description !== "string" || kpi.description.trim().length === 0) {
    issues.push(issue("invalid_kpi_description", "kpis.description", "KPI description must be non-empty."));
  }
  if (typeof kpi.intent.label !== "string" || kpi.intent.label.trim().length === 0) {
    issues.push(issue("invalid_measurement_intent", "kpis.intent.label", "KPI measurement intent label must be non-empty."));
  }
  if (!isValidDomainKpiDirection(kpi.intent.direction)) {
    issues.push(issue("invalid_kpi_direction", "kpis.intent.direction", "KPI direction is not supported."));
  }
  if (!isValidDomainKpiUnitType(kpi.unit.unitType)) {
    issues.push(issue("invalid_unit_type", "kpis.unit.unitType", "KPI unit type is not supported."));
  }
  if (typeof kpi.unit.unitLabel !== "string" || kpi.unit.unitLabel.trim().length === 0) {
    issues.push(issue("invalid_unit_label", "kpis.unit.unitLabel", "KPI unit label must be non-empty."));
  }
  if (!Number.isInteger(kpi.unit.precision) || kpi.unit.precision < 0 || kpi.unit.precision > 12) {
    issues.push(issue("invalid_unit_precision", "kpis.unit.precision", "KPI unit precision must be an integer from 0 to 12."));
  }
  if (!isValidDomainKpiAggregationType(kpi.aggregation.aggregationType)) {
    issues.push(issue("invalid_aggregation_type", "kpis.aggregation.aggregationType", "KPI aggregation type is not supported."));
  }
  if (typeof kpi.aggregation.description !== "string" || kpi.aggregation.description.trim().length === 0) {
    issues.push(issue("invalid_aggregation_description", "kpis.aggregation.description", "KPI aggregation description must be non-empty."));
  }
  if (!isValidDomainKpiScope(kpi.scope)) {
    issues.push(issue("invalid_kpi_scope", "kpis.scope", "KPI scope is not supported."));
  }
  if (!isValidDomainKpiStatus(kpi.status)) {
    issues.push(issue("invalid_kpi_status", "kpis.status", "KPI status is not supported."));
  }
  return issues;
}

export function validateDomainKpiPackage(
  kpiPackage: DomainKpiPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry
): DomainKpiValidationResult {
  const issues: DomainKpiValidationIssue[] = [];
  if (kpiPackage.contractVersion !== DOMAIN_KPI_CONTRACT_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion", "KPI package contract version must be DOM-4:1."));
  }
  if (!isValidDomainKpiPackageId(kpiPackage.kpiPackageId)) {
    issues.push(issue("invalid_kpi_package_id", "kpiPackageId", "KPI package id must be a valid lowercase identifier."));
  }
  issues.push(...validateDomainReference(kpiPackage, domainRegistry));
  if (typeof kpiPackage.name !== "string" || kpiPackage.name.trim().length === 0) {
    issues.push(issue("invalid_kpi_package_name", "name", "KPI package name must be non-empty."));
  }
  if (typeof kpiPackage.description !== "string" || kpiPackage.description.trim().length === 0) {
    issues.push(issue("invalid_kpi_package_description", "description", "KPI package description must be non-empty."));
  }
  if (!isValidDomainVersion(kpiPackage.version)) {
    issues.push(issue("invalid_kpi_version", "version", "KPI package version must use non-negative integer values."));
  }
  if (!isValidDomainKpiScope(kpiPackage.scope)) {
    issues.push(issue("invalid_kpi_package_scope", "scope", "KPI package scope is not supported."));
  }
  if (!isValidDomainKpiStatus(kpiPackage.status)) {
    issues.push(issue("invalid_kpi_package_status", "status", "KPI package status is not supported."));
  }
  issues.push(...duplicateIssues(kpiPackage.kpis.map((kpi) => kpi.kpiId), "duplicate_kpi_id", "kpis", "KPI ids must be unique within a package."));
  for (const kpi of kpiPackage.kpis) {
    issues.push(...validateKpiDefinition(kpi));
  }
  issues.push(...validateKpiReferences(kpiPackage, vocabularyRegistry, ontologyRegistry));
  return domainKpiValidationResult(issues);
}

export function validateDomainKpiRegistration(
  registry: DomainKpiRegistry,
  kpiPackage: DomainKpiPackage,
  domainRegistry?: DomainRegistry,
  vocabularyRegistry?: DomainVocabularyRegistry,
  ontologyRegistry?: DomainOntologyRegistry
): DomainKpiValidationResult {
  const issues = [...validateDomainKpiPackage(kpiPackage, domainRegistry, vocabularyRegistry, ontologyRegistry).issues];
  if (registry.frozen) {
    issues.push(issue("registry_frozen", "registry", "KPI registry is frozen and cannot accept mutations."));
  }
  if (registry.indexes.byId[kpiPackage.kpiPackageId]) {
    issues.push(issue("duplicate_kpi_package_id", "kpiPackageId", `KPI package id already registered: ${kpiPackage.kpiPackageId}.`));
  }
  return domainKpiValidationResult(issues);
}

export function validateDomainKpiRegistry(registry: DomainKpiRegistry): DomainKpiValidationResult {
  const issues: DomainKpiValidationIssue[] = [];
  const packageIds = registry.packages.map((entry) => entry.package.kpiPackageId);
  if (registry.contractVersion !== DOMAIN_KPI_CONTRACT_VERSION) {
    issues.push(issue("invalid_registry_contract_version", "contractVersion", "Registry contract version must be DOM-4:1."));
  }
  if (new Set(packageIds).size !== packageIds.length) {
    issues.push(issue("duplicate_registry_kpi_package_id", "packages", "Registry contains duplicate KPI package ids."));
  }
  if (registry.packages.some((entry, index) => entry.registrationOrder !== index)) {
    issues.push(issue("invalid_registration_order", "packages", "Registry registration order is inconsistent."));
  }
  for (const entry of registry.packages) {
    issues.push(...validateDomainKpiPackage(entry.package).issues);
    if (!registry.indexes.byId[entry.package.kpiPackageId]) {
      issues.push(issue("invalid_registry_index", "indexes.byId", "KPI registry id index is inconsistent."));
    }
  }
  return domainKpiValidationResult(issues);
}

export function validateDomainKpiFoundation(): DomainKpiValidationResult {
  return domainKpiValidationResult([]);
}
