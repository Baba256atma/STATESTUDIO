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

export const DOMAIN_REASONING_CONTRACT_VERSION = "DOM-6:1" as const;

export type DomainReasoningContractId = string;
export type DomainReasoningPackageId = string;
export type DomainReasoningInputId = string;
export type DomainReasoningOutputId = string;
export type DomainReasoningEvidenceRequirementId = string;
export type DomainReasoningAssumptionId = string;

export type DomainReasoningStatus = "draft" | "active" | "deprecated" | "archived";
export type DomainReasoningScope = "domain" | "module" | "feature" | "context" | "global";

export type DomainReasoningReference = Readonly<{
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
}>;

export type DomainReasoningInput = Readonly<{
  inputId: DomainReasoningInputId;
  label: string;
  description: string;
  required: boolean;
  reference?: DomainReasoningReference;
}>;

export type DomainReasoningOutput = Readonly<{
  outputId: DomainReasoningOutputId;
  label: string;
  description: string;
  reference?: DomainReasoningReference;
}>;

export type DomainReasoningEvidenceRequirement = Readonly<{
  evidenceRequirementId: DomainReasoningEvidenceRequirementId;
  label: string;
  description: string;
  required: boolean;
  reference?: DomainReasoningReference;
}>;

export type DomainReasoningAssumption = Readonly<{
  assumptionId: DomainReasoningAssumptionId;
  label: string;
  description: string;
  required: boolean;
  uncertaintyImpact: "low" | "medium" | "high";
  reference?: DomainReasoningReference;
}>;

export type DomainReasoningConfidenceMetadata = Readonly<{
  required: boolean;
  evidenceCoverageRequired: boolean;
  assumptionCoverageRequired: boolean;
  explanation: string;
}>;

export type DomainReasoningUncertaintyMetadata = Readonly<{
  required: boolean;
  sources: readonly string[];
  explanation: string;
}>;

export type DomainReasoningTraceMetadata = Readonly<{
  required: boolean;
  traceInputIds: readonly DomainReasoningInputId[];
  traceOutputIds: readonly DomainReasoningOutputId[];
  traceEvidenceRequirementIds: readonly DomainReasoningEvidenceRequirementId[];
  traceAssumptionIds: readonly DomainReasoningAssumptionId[];
}>;

export type DomainReasoningContract = Readonly<{
  contractId: DomainReasoningContractId;
  label: string;
  description: string;
  scope: DomainReasoningScope;
  status: DomainReasoningStatus;
  inputs: readonly DomainReasoningInput[];
  outputs: readonly DomainReasoningOutput[];
  evidenceRequirements: readonly DomainReasoningEvidenceRequirement[];
  assumptions: readonly DomainReasoningAssumption[];
  confidence: DomainReasoningConfidenceMetadata;
  uncertainty: DomainReasoningUncertaintyMetadata;
  trace: DomainReasoningTraceMetadata;
}>;

export type DomainReasoningPackage = Readonly<{
  contractVersion: typeof DOMAIN_REASONING_CONTRACT_VERSION;
  reasoningPackageId: DomainReasoningPackageId;
  domainId: DomainId;
  name: string;
  description: string;
  version: DomainVersion;
  scope: DomainReasoningScope;
  status: DomainReasoningStatus;
  contracts: readonly DomainReasoningContract[];
}>;

export type RegisteredDomainReasoningPackage = Readonly<{
  package: DomainReasoningPackage;
  registrationOrder: number;
}>;

export type DomainReasoningRegistryIndexes = Readonly<{
  byId: Readonly<Record<DomainReasoningPackageId, RegisteredDomainReasoningPackage>>;
  byDomainId: Readonly<Record<DomainId, readonly RegisteredDomainReasoningPackage[]>>;
  byContractId: Readonly<Record<DomainReasoningContractId, RegisteredDomainReasoningPackage>>;
}>;

export type DomainReasoningRegistry = Readonly<{
  contractVersion: typeof DOMAIN_REASONING_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  packages: readonly RegisteredDomainReasoningPackage[];
  indexes: DomainReasoningRegistryIndexes;
}>;

export type DomainReasoningValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type DomainReasoningValidationResult = Readonly<{
  valid: boolean;
  issues: readonly DomainReasoningValidationIssue[];
}>;

export type DomainReasoningRegistryMutationResult = Readonly<{
  success: boolean;
  registry: DomainReasoningRegistry;
  reasoningPackage: RegisteredDomainReasoningPackage | null;
  validation: DomainReasoningValidationResult;
}>;

export type DomainReasoningFoundationManifest = Readonly<{
  contractVersion: typeof DOMAIN_REASONING_CONTRACT_VERSION;
  version: typeof import("./domainReasoningConstants.ts").DOMAIN_REASONING_VERSION;
  defaultStatus: DomainReasoningStatus;
  maxReasoningPackageIdLength: number;
  maxReasoningContractIdLength: number;
  supportedScopes: readonly DomainReasoningScope[];
  supportedStatuses: readonly DomainReasoningStatus[];
  publicApis: readonly string[];
  validation: DomainReasoningValidationResult;
  metadataOnly: true;
  runtimeBehavior: false;
  reasoningEngine: false;
  readyFor: "DOM-6:2 Domain Reasoning Query Layer";
}>;
