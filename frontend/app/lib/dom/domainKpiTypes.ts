import type { DomainId, DomainVersion } from "./domainFoundationIndex.ts";
import type { DomainVocabularyId } from "./domainVocabularyIndex.ts";
import type { DomainOntologyId } from "./domainOntologyIndex.ts";

export const DOMAIN_KPI_CONTRACT_VERSION = "DOM-4:1" as const;

export type DomainKpiId = string;
export type DomainKpiPackageId = string;

export type DomainKpiStatus = "draft" | "active" | "deprecated" | "archived";

export type DomainKpiScope = "domain" | "module" | "feature" | "context" | "global";

export type DomainKpiUnitType = "count" | "currency" | "percentage" | "ratio" | "duration" | "score" | "index";

export type DomainKpiAggregationType = "sum" | "average" | "minimum" | "maximum" | "count" | "latest" | "none";

export type DomainKpiDirection = "increase_is_good" | "decrease_is_good" | "target_band" | "neutral";

export type DomainKpiMeasurementIntent = Readonly<{
  label: string;
  description: string;
  direction: DomainKpiDirection;
}>;

export type DomainKpiUnitMetadata = Readonly<{
  unitType: DomainKpiUnitType;
  unitLabel: string;
  precision: number;
}>;

export type DomainKpiAggregationMetadata = Readonly<{
  aggregationType: DomainKpiAggregationType;
  window: "instant" | "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "custom";
  description: string;
}>;

export type DomainKpiReference = Readonly<{
  vocabularyId?: DomainVocabularyId;
  ontologyId?: DomainOntologyId;
  entityTypeId?: string;
  attributeId?: string;
}>;

export type DomainKpiDefinition = Readonly<{
  kpiId: DomainKpiId;
  label: string;
  description: string;
  intent: DomainKpiMeasurementIntent;
  unit: DomainKpiUnitMetadata;
  aggregation: DomainKpiAggregationMetadata;
  reference?: DomainKpiReference;
  scope: DomainKpiScope;
  status: DomainKpiStatus;
}>;

export type DomainKpiPackage = Readonly<{
  contractVersion: typeof DOMAIN_KPI_CONTRACT_VERSION;
  kpiPackageId: DomainKpiPackageId;
  domainId: DomainId;
  name: string;
  description: string;
  version: DomainVersion;
  scope: DomainKpiScope;
  status: DomainKpiStatus;
  kpis: readonly DomainKpiDefinition[];
}>;

export type RegisteredDomainKpiPackage = Readonly<{
  package: DomainKpiPackage;
  registrationOrder: number;
}>;

export type DomainKpiRegistryIndexes = Readonly<{
  byId: Readonly<Record<DomainKpiPackageId, RegisteredDomainKpiPackage>>;
  byDomainId: Readonly<Record<DomainId, readonly RegisteredDomainKpiPackage[]>>;
}>;

export type DomainKpiRegistry = Readonly<{
  contractVersion: typeof DOMAIN_KPI_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  packages: readonly RegisteredDomainKpiPackage[];
  indexes: DomainKpiRegistryIndexes;
}>;

export type DomainKpiValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type DomainKpiValidationResult = Readonly<{
  valid: boolean;
  issues: readonly DomainKpiValidationIssue[];
}>;

export type DomainKpiRegistryMutationResult = Readonly<{
  success: boolean;
  registry: DomainKpiRegistry;
  kpiPackage: RegisteredDomainKpiPackage | null;
  validation: DomainKpiValidationResult;
}>;

export type DomainKpiFoundationManifest = Readonly<{
  contractVersion: typeof DOMAIN_KPI_CONTRACT_VERSION;
  version: typeof import("./domainKpiConstants.ts").DOMAIN_KPI_VERSION;
  defaultStatus: DomainKpiStatus;
  maxKpiIdLength: number;
  maxKpiPackageIdLength: number;
  supportedScopes: readonly DomainKpiScope[];
  supportedUnitTypes: readonly DomainKpiUnitType[];
  supportedAggregationTypes: readonly DomainKpiAggregationType[];
  supportedDirections: readonly DomainKpiDirection[];
  publicApis: readonly string[];
  validation: DomainKpiValidationResult;
  metadataOnly: true;
  runtimeBehavior: false;
  readyFor: "DOM-4:2 Domain KPI Query Layer";
}>;
