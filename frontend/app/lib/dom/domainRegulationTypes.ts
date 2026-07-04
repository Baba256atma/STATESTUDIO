import type { DomainId, DomainVersion } from "./domainFoundationIndex.ts";
import type { DomainTermId, DomainVocabularyId } from "./domainVocabularyIndex.ts";
import type {
  DomainAttributeId,
  DomainEntityTypeId,
  DomainOntologyId,
  DomainRelationshipTypeId,
} from "./domainOntologyIndex.ts";
import type { DomainKpiId, DomainKpiPackageId } from "./domainKpiIndex.ts";

export const DOMAIN_REGULATION_CONTRACT_VERSION = "DOM-5:1" as const;

export type DomainRegulationPackageId = string;
export type DomainRegulationId = string;
export type DomainObligationId = string;
export type DomainControlId = string;
export type DomainEvidenceId = string;

export type DomainRegulationStatus = "draft" | "active" | "deprecated" | "archived";

export type DomainRegulationScope = "domain" | "module" | "feature" | "context" | "global";

export type DomainJurisdictionScope =
  | "unspecified"
  | "global"
  | "regional"
  | "national"
  | "subnational"
  | "local"
  | "cross_border";

export type DomainRegulationReference = Readonly<{
  domainId?: DomainId;
  vocabularyId?: DomainVocabularyId;
  termId?: DomainTermId;
  ontologyId?: DomainOntologyId;
  entityTypeId?: DomainEntityTypeId;
  relationshipTypeId?: DomainRelationshipTypeId;
  attributeId?: DomainAttributeId;
  kpiPackageId?: DomainKpiPackageId;
  kpiId?: DomainKpiId;
}>;

export type DomainRegulationDefinition = Readonly<{
  regulationId: DomainRegulationId;
  label: string;
  description: string;
  reference?: DomainRegulationReference;
  scope: DomainRegulationScope;
  jurisdictionScope: DomainJurisdictionScope;
  status: DomainRegulationStatus;
}>;

export type DomainObligationMetadata = Readonly<{
  obligationId: DomainObligationId;
  regulationId: DomainRegulationId;
  label: string;
  description: string;
  controlIds: readonly DomainControlId[];
  scope: DomainRegulationScope;
  status: DomainRegulationStatus;
}>;

export type DomainControlMetadata = Readonly<{
  controlId: DomainControlId;
  label: string;
  description: string;
  evidenceIds: readonly DomainEvidenceId[];
  scope: DomainRegulationScope;
  status: DomainRegulationStatus;
}>;

export type DomainEvidenceMetadata = Readonly<{
  evidenceId: DomainEvidenceId;
  label: string;
  description: string;
  sourceDescription: string;
  scope: DomainRegulationScope;
  status: DomainRegulationStatus;
}>;

export type DomainRegulationPackage = Readonly<{
  contractVersion: typeof DOMAIN_REGULATION_CONTRACT_VERSION;
  regulationPackageId: DomainRegulationPackageId;
  domainId: DomainId;
  name: string;
  description: string;
  version: DomainVersion;
  scope: DomainRegulationScope;
  jurisdictionScope: DomainJurisdictionScope;
  status: DomainRegulationStatus;
  regulations: readonly DomainRegulationDefinition[];
  obligations: readonly DomainObligationMetadata[];
  controls: readonly DomainControlMetadata[];
  evidence: readonly DomainEvidenceMetadata[];
}>;

export type RegisteredDomainRegulationPackage = Readonly<{
  package: DomainRegulationPackage;
  registrationOrder: number;
}>;

export type DomainRegulationRegistryIndexes = Readonly<{
  byId: Readonly<Record<DomainRegulationPackageId, RegisteredDomainRegulationPackage>>;
  byDomainId: Readonly<Record<DomainId, readonly RegisteredDomainRegulationPackage[]>>;
}>;

export type DomainRegulationRegistry = Readonly<{
  contractVersion: typeof DOMAIN_REGULATION_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  packages: readonly RegisteredDomainRegulationPackage[];
  indexes: DomainRegulationRegistryIndexes;
}>;

export type DomainRegulationValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type DomainRegulationValidationResult = Readonly<{
  valid: boolean;
  issues: readonly DomainRegulationValidationIssue[];
}>;

export type DomainRegulationRegistryMutationResult = Readonly<{
  success: boolean;
  registry: DomainRegulationRegistry;
  regulationPackage: RegisteredDomainRegulationPackage | null;
  validation: DomainRegulationValidationResult;
}>;

export type DomainRegulationFoundationManifest = Readonly<{
  contractVersion: typeof DOMAIN_REGULATION_CONTRACT_VERSION;
  version: typeof import("./domainRegulationConstants.ts").DOMAIN_REGULATION_VERSION;
  defaultStatus: DomainRegulationStatus;
  maxRegulationPackageIdLength: number;
  maxRegulationIdLength: number;
  maxObligationIdLength: number;
  maxControlIdLength: number;
  maxEvidenceIdLength: number;
  supportedScopes: readonly DomainRegulationScope[];
  supportedJurisdictionScopes: readonly DomainJurisdictionScope[];
  supportedStatuses: readonly DomainRegulationStatus[];
  publicApis: readonly string[];
  validation: DomainRegulationValidationResult;
  metadataOnly: true;
  runtimeBehavior: false;
  readyFor: "DOM-5:2 Domain Regulation Query Layer";
}>;
