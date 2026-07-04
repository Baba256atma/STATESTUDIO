import type {
  DomainKpiAggregationType,
  DomainKpiDirection,
  DomainKpiScope,
  DomainKpiStatus,
  DomainKpiUnitType,
} from "./domainKpiTypes.ts";

export const DOMAIN_KPI_VERSION = "DOM-4:1" as const;

export const DEFAULT_DOMAIN_KPI_STATUS: DomainKpiStatus = "draft";

export const MAX_DOMAIN_KPI_ID_LENGTH = 96;
export const MAX_DOMAIN_KPI_PACKAGE_ID_LENGTH = 96;

export const SUPPORTED_DOMAIN_KPI_SCOPES: readonly DomainKpiScope[] = Object.freeze([
  "domain",
  "module",
  "feature",
  "context",
  "global",
]);

export const SUPPORTED_DOMAIN_KPI_UNIT_TYPES: readonly DomainKpiUnitType[] = Object.freeze([
  "count",
  "currency",
  "percentage",
  "ratio",
  "duration",
  "score",
  "index",
]);

export const SUPPORTED_DOMAIN_KPI_AGGREGATION_TYPES: readonly DomainKpiAggregationType[] = Object.freeze([
  "sum",
  "average",
  "minimum",
  "maximum",
  "count",
  "latest",
  "none",
]);

export const SUPPORTED_DOMAIN_KPI_DIRECTIONS: readonly DomainKpiDirection[] = Object.freeze([
  "increase_is_good",
  "decrease_is_good",
  "target_band",
  "neutral",
]);
