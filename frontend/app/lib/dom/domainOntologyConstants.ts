import type { DomainOntologyScope, DomainOntologyStatus } from "./domainOntologyTypes.ts";

export const DOMAIN_ONTOLOGY_VERSION = "DOM-3:1" as const;

export const DEFAULT_ONTOLOGY_STATUS: DomainOntologyStatus = "draft";

export const MAX_ONTOLOGY_ID_LENGTH = 96;
export const MAX_ENTITY_TYPE_ID_LENGTH = 96;
export const MAX_RELATIONSHIP_TYPE_ID_LENGTH = 96;
export const MAX_ATTRIBUTE_ID_LENGTH = 96;
export const MAX_CONSTRAINT_ID_LENGTH = 96;

export const SUPPORTED_ONTOLOGY_SCOPES: readonly DomainOntologyScope[] = Object.freeze([
  "domain",
  "module",
  "feature",
  "context",
  "global",
]);
