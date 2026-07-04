import type { DomainId } from "./domainFoundationIndex.ts";
import type {
  DomainRecommendationAssumption,
  DomainRecommendationConfidenceMetadata,
  DomainRecommendationConstraint,
  DomainRecommendationContract,
  DomainRecommendationContractId,
  DomainRecommendationInput,
  DomainRecommendationOutput,
  DomainRecommendationPackageId,
  DomainRecommendationRationaleMetadata,
  DomainRecommendationRegistry,
  DomainRecommendationScope,
  DomainRecommendationStatus,
  DomainRecommendationTraceMetadata,
  DomainRecommendationUncertaintyMetadata,
  RegisteredDomainRecommendationPackage,
} from "./domainRecommendationIndex.ts";

export type DomainRecommendationSortKey = "recommendationPackageId" | "domainId" | "registrationOrder";
export type DomainRecommendationSortDirection = "asc" | "desc";

export type DomainRecommendationFilter = Readonly<{
  domainId?: DomainId;
  scope?: DomainRecommendationScope;
  status?: DomainRecommendationStatus;
  contractId?: DomainRecommendationContractId;
}>;

export type DomainRecommendationQuery = Readonly<{
  filter?: DomainRecommendationFilter;
  sortKey?: DomainRecommendationSortKey;
  direction?: DomainRecommendationSortDirection;
}>;

export type DomainRecommendationLookupResult = Readonly<{
  found: boolean;
  recommendationPackage: RegisteredDomainRecommendationPackage | null;
  contract: DomainRecommendationContract | null;
}>;

export type DomainRecommendationReferenceLookupResult = Readonly<{
  referenceId: string;
  matches: readonly DomainRecommendationLookupResult[];
}>;

export type DomainRecommendationInputLookupResult = Readonly<{
  found: boolean;
  recommendationPackage: RegisteredDomainRecommendationPackage | null;
  contract: DomainRecommendationContract | null;
  inputs: readonly DomainRecommendationInput[];
}>;

export type DomainRecommendationOutputLookupResult = Readonly<{
  found: boolean;
  recommendationPackage: RegisteredDomainRecommendationPackage | null;
  contract: DomainRecommendationContract | null;
  outputs: readonly DomainRecommendationOutput[];
}>;

export type DomainRecommendationRationaleLookupResult = Readonly<{
  found: boolean;
  recommendationPackage: RegisteredDomainRecommendationPackage | null;
  contract: DomainRecommendationContract | null;
  rationale: DomainRecommendationRationaleMetadata | null;
}>;

export type DomainRecommendationConstraintLookupResult = Readonly<{
  found: boolean;
  recommendationPackage: RegisteredDomainRecommendationPackage | null;
  contract: DomainRecommendationContract | null;
  constraints: readonly DomainRecommendationConstraint[];
}>;

export type DomainRecommendationAssumptionLookupResult = Readonly<{
  found: boolean;
  recommendationPackage: RegisteredDomainRecommendationPackage | null;
  contract: DomainRecommendationContract | null;
  assumptions: readonly DomainRecommendationAssumption[];
}>;

export type DomainRecommendationMetadataLookup = Readonly<{
  found: boolean;
  recommendationPackage: RegisteredDomainRecommendationPackage | null;
  contract: DomainRecommendationContract | null;
  confidence: DomainRecommendationConfidenceMetadata | null;
  uncertainty: DomainRecommendationUncertaintyMetadata | null;
  trace: DomainRecommendationTraceMetadata | null;
}>;

export type DomainRecommendationSnapshotEntry = Readonly<{
  recommendationPackageId: DomainRecommendationPackageId;
  domainId: DomainId;
  registrationOrder: number;
  scope: DomainRecommendationScope;
  status: DomainRecommendationStatus;
  contractIds: readonly DomainRecommendationContractId[];
  inputIds: readonly string[];
  outputIds: readonly string[];
  constraintIds: readonly string[];
  assumptionIds: readonly string[];
  rationaleRequired: boolean;
  confidenceRequired: boolean;
  uncertaintyRequired: boolean;
  traceRequired: boolean;
  fingerprint: string;
}>;

export type DomainRecommendationSnapshot = Readonly<{
  contractVersion: DomainRecommendationRegistry["contractVersion"];
  registryId: string;
  frozen: boolean;
  packageCount: number;
  entries: readonly DomainRecommendationSnapshotEntry[];
  fingerprint: string;
}>;

export type DomainRecommendationDiffType = "added" | "removed" | "modified";

export type DomainRecommendationDiffEntry = Readonly<{
  type: DomainRecommendationDiffType;
  recommendationPackageId: DomainRecommendationPackageId;
  left: DomainRecommendationSnapshotEntry | null;
  right: DomainRecommendationSnapshotEntry | null;
}>;

export type DomainRecommendationDiff = Readonly<{
  equal: boolean;
  leftFingerprint: string;
  rightFingerprint: string;
  entries: readonly DomainRecommendationDiffEntry[];
}>;
