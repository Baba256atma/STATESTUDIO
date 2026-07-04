import type { DomainId, DomainVersion } from "./domainFoundationIndex.ts";
import type { DomainTermId, DomainVocabularyId } from "./domainVocabularyIndex.ts";
import type {
  DomainAttributeId,
  DomainEntityTypeId,
  DomainOntologyId,
  DomainRelationshipTypeId,
} from "./domainOntologyIndex.ts";
import type { DomainKpiId, DomainKpiPackageId } from "./domainKpiIndex.ts";
import type { DomainRegulationId, DomainRegulationPackageId } from "./domainRegulationIndex.ts";
import type { DomainReasoningContractId, DomainReasoningPackageId } from "./domainReasoningIndex.ts";

export const DOMAIN_RECOMMENDATION_CONTRACT_VERSION = "DOM-7:1" as const;

export type DomainRecommendationContractId = string;
export type DomainRecommendationPackageId = string;
export type DomainRecommendationInputId = string;
export type DomainRecommendationOutputId = string;
export type DomainRecommendationConstraintId = string;
export type DomainRecommendationAssumptionId = string;

export type DomainRecommendationStatus = "draft" | "active" | "deprecated" | "archived";
export type DomainRecommendationScope = "domain" | "module" | "feature" | "context" | "global";

export type DomainRecommendationReference = Readonly<{
  domainId?: DomainId;
  vocabularyId?: DomainVocabularyId;
  termId?: DomainTermId;
  ontologyId?: DomainOntologyId;
  entityTypeId?: DomainEntityTypeId;
  relationshipTypeId?: DomainRelationshipTypeId;
  attributeId?: DomainAttributeId;
  kpiPackageId?: DomainKpiPackageId;
  kpiId?: DomainKpiId;
  regulationPackageId?: DomainRegulationPackageId;
  regulationId?: DomainRegulationId;
  reasoningPackageId?: DomainReasoningPackageId;
  reasoningContractId?: DomainReasoningContractId;
}>;

export type DomainRecommendationInput = Readonly<{
  inputId: DomainRecommendationInputId;
  label: string;
  description: string;
  required: boolean;
  reference?: DomainRecommendationReference;
}>;

export type DomainRecommendationOutput = Readonly<{
  outputId: DomainRecommendationOutputId;
  label: string;
  description: string;
  reference?: DomainRecommendationReference;
}>;

export type DomainRecommendationRationaleMetadata = Readonly<{
  required: boolean;
  rationaleInputs: readonly DomainRecommendationInputId[];
  rationaleAssumptions: readonly DomainRecommendationAssumptionId[];
  explanation: string;
}>;

export type DomainRecommendationConstraint = Readonly<{
  constraintId: DomainRecommendationConstraintId;
  label: string;
  description: string;
  required: boolean;
  severity: "info" | "warning" | "blocking";
  reference?: DomainRecommendationReference;
}>;

export type DomainRecommendationAssumption = Readonly<{
  assumptionId: DomainRecommendationAssumptionId;
  label: string;
  description: string;
  required: boolean;
  uncertaintyImpact: "low" | "medium" | "high";
  reference?: DomainRecommendationReference;
}>;

export type DomainRecommendationConfidenceMetadata = Readonly<{
  required: boolean;
  evidenceCoverageRequired: boolean;
  rationaleCoverageRequired: boolean;
  explanation: string;
}>;

export type DomainRecommendationUncertaintyMetadata = Readonly<{
  required: boolean;
  sources: readonly string[];
  explanation: string;
}>;

export type DomainRecommendationTraceMetadata = Readonly<{
  required: boolean;
  traceInputIds: readonly DomainRecommendationInputId[];
  traceOutputIds: readonly DomainRecommendationOutputId[];
  traceConstraintIds: readonly DomainRecommendationConstraintId[];
  traceAssumptionIds: readonly DomainRecommendationAssumptionId[];
}>;

export type DomainRecommendationContract = Readonly<{
  contractId: DomainRecommendationContractId;
  label: string;
  description: string;
  scope: DomainRecommendationScope;
  status: DomainRecommendationStatus;
  inputs: readonly DomainRecommendationInput[];
  outputs: readonly DomainRecommendationOutput[];
  rationale: DomainRecommendationRationaleMetadata;
  constraints: readonly DomainRecommendationConstraint[];
  assumptions: readonly DomainRecommendationAssumption[];
  confidence: DomainRecommendationConfidenceMetadata;
  uncertainty: DomainRecommendationUncertaintyMetadata;
  trace: DomainRecommendationTraceMetadata;
}>;

export type DomainRecommendationPackage = Readonly<{
  contractVersion: typeof DOMAIN_RECOMMENDATION_CONTRACT_VERSION;
  recommendationPackageId: DomainRecommendationPackageId;
  domainId: DomainId;
  name: string;
  description: string;
  version: DomainVersion;
  scope: DomainRecommendationScope;
  status: DomainRecommendationStatus;
  contracts: readonly DomainRecommendationContract[];
}>;

export type RegisteredDomainRecommendationPackage = Readonly<{
  package: DomainRecommendationPackage;
  registrationOrder: number;
}>;

export type DomainRecommendationRegistryIndexes = Readonly<{
  byId: Readonly<Record<DomainRecommendationPackageId, RegisteredDomainRecommendationPackage>>;
  byDomainId: Readonly<Record<DomainId, readonly RegisteredDomainRecommendationPackage[]>>;
  byContractId: Readonly<Record<DomainRecommendationContractId, RegisteredDomainRecommendationPackage>>;
}>;

export type DomainRecommendationRegistry = Readonly<{
  contractVersion: typeof DOMAIN_RECOMMENDATION_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  packages: readonly RegisteredDomainRecommendationPackage[];
  indexes: DomainRecommendationRegistryIndexes;
}>;

export type DomainRecommendationValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type DomainRecommendationValidationResult = Readonly<{
  valid: boolean;
  issues: readonly DomainRecommendationValidationIssue[];
}>;

export type DomainRecommendationRegistryMutationResult = Readonly<{
  success: boolean;
  registry: DomainRecommendationRegistry;
  recommendationPackage: RegisteredDomainRecommendationPackage | null;
  validation: DomainRecommendationValidationResult;
}>;

export type DomainRecommendationFoundationManifest = Readonly<{
  contractVersion: typeof DOMAIN_RECOMMENDATION_CONTRACT_VERSION;
  version: typeof import("./domainRecommendationConstants.ts").DOMAIN_RECOMMENDATION_VERSION;
  defaultStatus: DomainRecommendationStatus;
  maxRecommendationPackageIdLength: number;
  maxRecommendationContractIdLength: number;
  supportedScopes: readonly DomainRecommendationScope[];
  supportedStatuses: readonly DomainRecommendationStatus[];
  publicApis: readonly string[];
  validation: DomainRecommendationValidationResult;
  metadataOnly: true;
  runtimeBehavior: false;
  recommendationEngine: false;
  readyFor: "DOM-7:2 Domain Recommendation Query Layer";
}>;
