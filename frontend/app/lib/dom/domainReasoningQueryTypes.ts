import type { DomainId } from "./domainFoundationIndex.ts";
import type {
  DomainReasoningAssumption,
  DomainReasoningConfidenceMetadata,
  DomainReasoningContract,
  DomainReasoningContractId,
  DomainReasoningEvidenceRequirement,
  DomainReasoningInput,
  DomainReasoningOutput,
  DomainReasoningPackageId,
  DomainReasoningRegistry,
  DomainReasoningScope,
  DomainReasoningStatus,
  DomainReasoningTraceMetadata,
  DomainReasoningUncertaintyMetadata,
  RegisteredDomainReasoningPackage,
} from "./domainReasoningIndex.ts";

export type DomainReasoningSortKey = "reasoningPackageId" | "domainId" | "registrationOrder";
export type DomainReasoningSortDirection = "asc" | "desc";

export type DomainReasoningFilter = Readonly<{
  domainId?: DomainId;
  scope?: DomainReasoningScope;
  status?: DomainReasoningStatus;
  contractId?: DomainReasoningContractId;
}>;

export type DomainReasoningQuery = Readonly<{
  filter?: DomainReasoningFilter;
  sortKey?: DomainReasoningSortKey;
  direction?: DomainReasoningSortDirection;
}>;

export type DomainReasoningLookupResult = Readonly<{
  found: boolean;
  reasoningPackage: RegisteredDomainReasoningPackage | null;
  contract: DomainReasoningContract | null;
}>;

export type DomainReasoningReferenceLookupResult = Readonly<{
  referenceId: string;
  matches: readonly DomainReasoningLookupResult[];
}>;

export type DomainReasoningInputLookupResult = Readonly<{
  found: boolean;
  reasoningPackage: RegisteredDomainReasoningPackage | null;
  contract: DomainReasoningContract | null;
  inputs: readonly DomainReasoningInput[];
}>;

export type DomainReasoningOutputLookupResult = Readonly<{
  found: boolean;
  reasoningPackage: RegisteredDomainReasoningPackage | null;
  contract: DomainReasoningContract | null;
  outputs: readonly DomainReasoningOutput[];
}>;

export type DomainReasoningAssumptionLookupResult = Readonly<{
  found: boolean;
  reasoningPackage: RegisteredDomainReasoningPackage | null;
  contract: DomainReasoningContract | null;
  assumptions: readonly DomainReasoningAssumption[];
}>;

export type DomainReasoningEvidenceRequirementLookupResult = Readonly<{
  found: boolean;
  reasoningPackage: RegisteredDomainReasoningPackage | null;
  contract: DomainReasoningContract | null;
  evidenceRequirements: readonly DomainReasoningEvidenceRequirement[];
}>;

export type DomainReasoningSnapshotEntry = Readonly<{
  reasoningPackageId: DomainReasoningPackageId;
  domainId: DomainId;
  registrationOrder: number;
  scope: DomainReasoningScope;
  status: DomainReasoningStatus;
  contractIds: readonly DomainReasoningContractId[];
  inputIds: readonly string[];
  outputIds: readonly string[];
  assumptionIds: readonly string[];
  evidenceRequirementIds: readonly string[];
  confidenceRequired: boolean;
  uncertaintyRequired: boolean;
  traceRequired: boolean;
  fingerprint: string;
}>;

export type DomainReasoningSnapshot = Readonly<{
  contractVersion: DomainReasoningRegistry["contractVersion"];
  registryId: string;
  frozen: boolean;
  packageCount: number;
  entries: readonly DomainReasoningSnapshotEntry[];
  fingerprint: string;
}>;

export type DomainReasoningDiffType = "added" | "removed" | "modified";

export type DomainReasoningDiffEntry = Readonly<{
  type: DomainReasoningDiffType;
  reasoningPackageId: DomainReasoningPackageId;
  left: DomainReasoningSnapshotEntry | null;
  right: DomainReasoningSnapshotEntry | null;
}>;

export type DomainReasoningDiff = Readonly<{
  equal: boolean;
  leftFingerprint: string;
  rightFingerprint: string;
  entries: readonly DomainReasoningDiffEntry[];
}>;

export type DomainReasoningMetadataLookup = Readonly<{
  found: boolean;
  reasoningPackage: RegisteredDomainReasoningPackage | null;
  contract: DomainReasoningContract | null;
  confidence: DomainReasoningConfidenceMetadata | null;
  uncertainty: DomainReasoningUncertaintyMetadata | null;
  trace: DomainReasoningTraceMetadata | null;
}>;
