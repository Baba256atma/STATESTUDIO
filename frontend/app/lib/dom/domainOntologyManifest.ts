import {
  DEFAULT_ONTOLOGY_STATUS,
  DOMAIN_ONTOLOGY_VERSION,
  MAX_ATTRIBUTE_ID_LENGTH,
  MAX_CONSTRAINT_ID_LENGTH,
  MAX_ENTITY_TYPE_ID_LENGTH,
  MAX_ONTOLOGY_ID_LENGTH,
  MAX_RELATIONSHIP_TYPE_ID_LENGTH,
  SUPPORTED_ONTOLOGY_SCOPES,
} from "./domainOntologyConstants.ts";
import { DOMAIN_ONTOLOGY_CONTRACT_VERSION, type DomainOntologyFoundationManifest } from "./domainOntologyTypes.ts";
import { validateDomainOntologyFoundation } from "./domainOntologyValidation.ts";

export const DOMAIN_ONTOLOGY_PUBLIC_APIS = Object.freeze([
  "DomainOntologyFoundation",
  "createDomainOntologyRegistry",
  "registerDomainOntology",
  "unregisterDomainOntology",
  "getDomainOntology",
  "listDomainOntologies",
  "listOntologiesByDomain",
  "hasDomainOntology",
  "freezeDomainOntologyRegistry",
  "buildDomainOntologyManifest",
  "validateDomainOntologyFoundation",
  "validateDomainOntologyPackage",
  "validateDomainOntologyRegistration",
  "validateDomainOntologyRegistry",
] as const);

export function buildDomainOntologyManifest(
  validation = validateDomainOntologyFoundation()
): DomainOntologyFoundationManifest {
  return Object.freeze({
    contractVersion: DOMAIN_ONTOLOGY_CONTRACT_VERSION,
    version: DOMAIN_ONTOLOGY_VERSION,
    defaultStatus: DEFAULT_ONTOLOGY_STATUS,
    maxOntologyIdLength: MAX_ONTOLOGY_ID_LENGTH,
    maxEntityTypeIdLength: MAX_ENTITY_TYPE_ID_LENGTH,
    maxRelationshipTypeIdLength: MAX_RELATIONSHIP_TYPE_ID_LENGTH,
    maxAttributeIdLength: MAX_ATTRIBUTE_ID_LENGTH,
    maxConstraintIdLength: MAX_CONSTRAINT_ID_LENGTH,
    supportedScopes: SUPPORTED_ONTOLOGY_SCOPES,
    publicApis: DOMAIN_ONTOLOGY_PUBLIC_APIS,
    validation,
    metadataOnly: true,
    runtimeBehavior: false,
    readyFor: "DOM-3:2 Domain Ontology Query Layer",
  });
}
