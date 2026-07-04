import type {
  DomainJurisdictionScope,
  DomainRegulationScope,
  DomainRegulationStatus,
} from "./domainRegulationTypes.ts";

export const DOMAIN_REGULATION_VERSION = "5.1.0" as const;
export const DEFAULT_DOMAIN_REGULATION_STATUS: DomainRegulationStatus = "draft";

export const MAX_DOMAIN_REGULATION_PACKAGE_ID_LENGTH = 96 as const;
export const MAX_DOMAIN_REGULATION_ID_LENGTH = 96 as const;
export const MAX_DOMAIN_OBLIGATION_ID_LENGTH = 96 as const;
export const MAX_DOMAIN_CONTROL_ID_LENGTH = 96 as const;
export const MAX_DOMAIN_EVIDENCE_ID_LENGTH = 96 as const;

export const SUPPORTED_DOMAIN_REGULATION_SCOPES: readonly DomainRegulationScope[] = Object.freeze([
  "domain",
  "module",
  "feature",
  "context",
  "global",
]);

export const SUPPORTED_DOMAIN_JURISDICTION_SCOPES: readonly DomainJurisdictionScope[] = Object.freeze([
  "unspecified",
  "global",
  "regional",
  "national",
  "subnational",
  "local",
  "cross_border",
]);

export const SUPPORTED_DOMAIN_REGULATION_STATUSES: readonly DomainRegulationStatus[] = Object.freeze([
  "draft",
  "active",
  "deprecated",
  "archived",
]);
