export {
  DEFAULT_ONTOLOGY_STATUS,
  DOMAIN_ONTOLOGY_VERSION,
  MAX_ATTRIBUTE_ID_LENGTH,
  MAX_CONSTRAINT_ID_LENGTH,
  MAX_ENTITY_TYPE_ID_LENGTH,
  MAX_ONTOLOGY_ID_LENGTH,
  MAX_RELATIONSHIP_TYPE_ID_LENGTH,
  SUPPORTED_ONTOLOGY_SCOPES,
} from "./domainOntologyConstants.ts";
export type {
  DomainAttributeDefinition,
  DomainAttributeId,
  DomainConstraintDefinition,
  DomainConstraintId,
  DomainEntityType,
  DomainEntityTypeId,
  DomainOntologyFoundationManifest,
  DomainOntologyId,
  DomainOntologyPackage,
  DomainOntologyRegistry,
  DomainOntologyRegistryIndexes,
  DomainOntologyRegistryMutationResult,
  DomainOntologyScope,
  DomainOntologyStatus,
  DomainOntologyValidationIssue,
  DomainOntologyValidationResult,
  DomainRelationshipType,
  DomainRelationshipTypeId,
  RegisteredDomainOntology,
} from "./domainOntologyTypes.ts";
export { DOMAIN_ONTOLOGY_CONTRACT_VERSION } from "./domainOntologyTypes.ts";
export {
  createDomainOntologyRegistry,
  freezeDomainOntologyRegistry,
  getDomainOntology,
  hasDomainOntology,
  listDomainOntologies,
  listOntologiesByDomain,
  registerDomainOntology,
  unregisterDomainOntology,
} from "./domainOntologyRegistry.ts";
export {
  domainOntologyValidationResult,
  isValidAttributeId,
  isValidConstraintId,
  isValidEntityTypeId,
  isValidOntologyId,
  isValidOntologyScope,
  isValidOntologyStatus,
  isValidRelationshipTypeId,
  validateDomainOntologyFoundation,
  validateDomainOntologyPackage,
  validateDomainOntologyRegistration,
  validateDomainOntologyRegistry,
} from "./domainOntologyValidation.ts";
export { DOMAIN_ONTOLOGY_PUBLIC_APIS, buildDomainOntologyManifest } from "./domainOntologyManifest.ts";

import { buildDomainOntologyManifest } from "./domainOntologyManifest.ts";
import {
  createDomainOntologyRegistry,
  freezeDomainOntologyRegistry,
  getDomainOntology,
  hasDomainOntology,
  listDomainOntologies,
  listOntologiesByDomain,
  registerDomainOntology,
  unregisterDomainOntology,
} from "./domainOntologyRegistry.ts";
import {
  validateDomainOntologyFoundation,
  validateDomainOntologyPackage,
  validateDomainOntologyRegistry,
} from "./domainOntologyValidation.ts";

export const DomainOntologyFoundation = Object.freeze({
  createDomainOntologyRegistry,
  registerDomainOntology,
  unregisterDomainOntology,
  getDomainOntology,
  listDomainOntologies,
  listOntologiesByDomain,
  hasDomainOntology,
  freezeDomainOntologyRegistry,
  buildDomainOntologyManifest,
  validateDomainOntologyFoundation,
  validateDomainOntologyPackage,
  validateDomainOntologyRegistry,
});
