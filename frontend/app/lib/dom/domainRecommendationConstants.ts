import type { DomainRecommendationScope, DomainRecommendationStatus } from "./domainRecommendationTypes.ts";

export const DOMAIN_RECOMMENDATION_VERSION = "7.1.0" as const;
export const DEFAULT_RECOMMENDATION_STATUS: DomainRecommendationStatus = "draft";

export const MAX_RECOMMENDATION_PACKAGE_ID_LENGTH = 96 as const;
export const MAX_RECOMMENDATION_CONTRACT_ID_LENGTH = 96 as const;

export const SUPPORTED_RECOMMENDATION_SCOPES: readonly DomainRecommendationScope[] = Object.freeze([
  "domain",
  "module",
  "feature",
  "context",
  "global",
]);

export const SUPPORTED_RECOMMENDATION_STATUSES: readonly DomainRecommendationStatus[] = Object.freeze([
  "draft",
  "active",
  "deprecated",
  "archived",
]);
