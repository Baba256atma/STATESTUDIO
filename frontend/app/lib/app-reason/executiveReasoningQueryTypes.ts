import type {
  ExecutiveReasoningAssumption,
  ExecutiveReasoningConfidence,
  ExecutiveReasoningConstraint,
  ExecutiveReasoningContract,
  ExecutiveReasoningEvidence,
  ExecutiveReasoningInput,
  ExecutiveReasoningOutput,
  ExecutiveReasoningPackage,
  ExecutiveReasoningRegistry,
  ExecutiveReasoningTrace,
  RegisteredExecutiveReasoningPackage,
} from "./executiveReasoningIndex.ts";

export type ExecutiveReasoningQuery = Readonly<{
  packageIds?: readonly string[];
  contractIds?: readonly string[];
  includeFrozen?: boolean;
}>;

export type ExecutiveReasoningFilter = Readonly<{
  domain?: string;
  scope?: string;
  status?: string;
  tag?: string;
  source?: string;
}>;

export type ExecutiveReasoningSortKey = "packageId" | "packageName" | "registrationOrder" | "contractCount";
export type ExecutiveReasoningSortDirection = "asc" | "desc";

export type ExecutiveReasoningLookupResult<T> = Readonly<{
  found: boolean;
  value: T | null;
  packageId: string | null;
  contractId: string | null;
}>;

export type ExecutiveReasoningInspectionResult = Readonly<{
  valid: boolean;
  packageId: string;
  contractCount: number;
  capabilities: readonly string[];
  summary: string;
  reasoningPackage: ExecutiveReasoningPackage;
  metadataOnly: true;
}>;

export type ExecutiveReasoningSnapshotEntry = Readonly<{
  packageId: string;
  contractIds: readonly string[];
  value: string;
  valueSize: number;
}>;

export type ExecutiveReasoningSnapshot = Readonly<{
  registryId: string;
  packageCount: number;
  contractCount: number;
  entries: readonly ExecutiveReasoningSnapshotEntry[];
  fingerprint: string;
  metadataOnly: true;
  deterministic: true;
}>;

export type ExecutiveReasoningDiffType = "added" | "removed" | "modified" | "unchanged";

export type ExecutiveReasoningDiffEntry = Readonly<{
  packageId: string;
  type: ExecutiveReasoningDiffType;
  leftValue: string | null;
  rightValue: string | null;
}>;

export type ExecutiveReasoningDiff = Readonly<{
  equal: boolean;
  entries: readonly ExecutiveReasoningDiffEntry[];
  metadataOnly: true;
}>;

export type ExecutiveReasoningContractLookup = ExecutiveReasoningLookupResult<ExecutiveReasoningContract>;
export type ExecutiveReasoningInputsLookup = ExecutiveReasoningLookupResult<readonly ExecutiveReasoningInput[]>;
export type ExecutiveReasoningOutputsLookup = ExecutiveReasoningLookupResult<readonly ExecutiveReasoningOutput[]>;
export type ExecutiveReasoningEvidenceLookup = ExecutiveReasoningLookupResult<readonly ExecutiveReasoningEvidence[]>;
export type ExecutiveReasoningAssumptionsLookup = ExecutiveReasoningLookupResult<readonly ExecutiveReasoningAssumption[]>;
export type ExecutiveReasoningConstraintsLookup = ExecutiveReasoningLookupResult<readonly ExecutiveReasoningConstraint[]>;
export type ExecutiveReasoningConfidenceLookup = ExecutiveReasoningLookupResult<ExecutiveReasoningConfidence>;
export type ExecutiveReasoningTraceLookup = ExecutiveReasoningLookupResult<ExecutiveReasoningTrace>;

export type ExecutiveReasoningRegistryQueryInput = ExecutiveReasoningRegistry | readonly RegisteredExecutiveReasoningPackage[];
