import type { DomainCategory, DomainFoundationPlatform, DomainStatus } from "./domainFoundationTypes.ts";

export const DOM_PLATFORM_ID = "nexora-domain-expertise-platform" as const;
export const DOM_PLATFORM_NAME = "Nexora Domain Expertise Platform" as const;
export const DOM_VERSION = "DOM-1" as const;
export const DOM_LAYER_IDENTITY = "DOM" as const;
export const DOM_RELEASE_STAGE = "foundation" as const;
export const DOM_ARCHITECTURAL_ROLE =
  "Metadata-only foundation for registering and managing isolated domain knowledge packages." as const;
export const DOM_DESCRIPTION =
  "Canonical architecture, contracts, registry, validation, and public APIs for the Nexora Domain Expertise Layer." as const;

export const SUPPORTED_DOMAIN_CATEGORIES: readonly DomainCategory[] = Object.freeze([
  "manufacturing",
  "healthcare",
  "banking",
  "retail",
  "logistics",
  "construction",
  "energy",
  "education",
  "other",
]);

export const DEFAULT_DOMAIN_STATUS: DomainStatus = "registered";

export const MAX_DOMAIN_ID_LENGTH = 128;

export const DOM_FOUNDATION_PLATFORM: DomainFoundationPlatform = Object.freeze({
  platformId: DOM_PLATFORM_ID,
  platformName: DOM_PLATFORM_NAME,
  version: DOM_VERSION,
  releaseStage: DOM_RELEASE_STAGE,
  description: DOM_DESCRIPTION,
  layerIdentity: DOM_LAYER_IDENTITY,
  architecturalRole: DOM_ARCHITECTURAL_ROLE,
});
