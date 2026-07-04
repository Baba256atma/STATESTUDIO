import type { DomainReasoningScope, DomainReasoningStatus } from "./domainReasoningTypes.ts";

export const DOMAIN_REASONING_VERSION = "6.1.0" as const;
export const DEFAULT_REASONING_STATUS: DomainReasoningStatus = "draft";

export const MAX_REASONING_PACKAGE_ID_LENGTH = 96 as const;
export const MAX_REASONING_CONTRACT_ID_LENGTH = 96 as const;

export const SUPPORTED_REASONING_SCOPES: readonly DomainReasoningScope[] = Object.freeze([
  "domain",
  "module",
  "feature",
  "context",
  "global",
]);

export const SUPPORTED_REASONING_STATUSES: readonly DomainReasoningStatus[] = Object.freeze([
  "draft",
  "active",
  "deprecated",
  "archived",
]);
