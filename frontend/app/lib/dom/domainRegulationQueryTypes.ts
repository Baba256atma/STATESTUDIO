import type { DomainId } from "./domainFoundationIndex.ts";
import type {
  DomainControlId,
  DomainControlMetadata,
  DomainEvidenceId,
  DomainEvidenceMetadata,
  DomainJurisdictionScope,
  DomainObligationId,
  DomainObligationMetadata,
  DomainRegulationDefinition,
  DomainRegulationId,
  DomainRegulationPackageId,
  DomainRegulationRegistry,
  DomainRegulationScope,
  DomainRegulationStatus,
  RegisteredDomainRegulationPackage,
} from "./domainRegulationIndex.ts";

export type DomainRegulationSortKey = "regulationPackageId" | "domainId" | "registrationOrder";

export type DomainRegulationSortDirection = "asc" | "desc";

export type DomainRegulationFilter = Readonly<{
  domainId?: DomainId;
  scope?: DomainRegulationScope;
  status?: DomainRegulationStatus;
  jurisdictionScope?: DomainJurisdictionScope;
  regulationId?: DomainRegulationId;
}>;

export type DomainRegulationQuery = Readonly<{
  filter?: DomainRegulationFilter;
  sortKey?: DomainRegulationSortKey;
  direction?: DomainRegulationSortDirection;
}>;

export type DomainRegulationLookupResult = Readonly<{
  found: boolean;
  regulationPackage: RegisteredDomainRegulationPackage | null;
  regulation: DomainRegulationDefinition | null;
}>;

export type DomainObligationLookupResult = Readonly<{
  found: boolean;
  regulationPackage: RegisteredDomainRegulationPackage | null;
  obligation: DomainObligationMetadata | null;
}>;

export type DomainControlLookupResult = Readonly<{
  found: boolean;
  regulationPackage: RegisteredDomainRegulationPackage | null;
  control: DomainControlMetadata | null;
}>;

export type DomainEvidenceLookupResult = Readonly<{
  found: boolean;
  regulationPackage: RegisteredDomainRegulationPackage | null;
  evidence: DomainEvidenceMetadata | null;
}>;

export type DomainRegulationReferenceLookupResult = Readonly<{
  referenceId: string;
  matches: readonly DomainRegulationLookupResult[];
}>;

export type DomainRegulationSnapshotEntry = Readonly<{
  regulationPackageId: DomainRegulationPackageId;
  domainId: DomainId;
  registrationOrder: number;
  scope: DomainRegulationScope;
  status: DomainRegulationStatus;
  jurisdictionScope: DomainJurisdictionScope;
  regulationIds: readonly DomainRegulationId[];
  obligationIds: readonly DomainObligationId[];
  controlIds: readonly DomainControlId[];
  evidenceIds: readonly DomainEvidenceId[];
  fingerprint: string;
}>;

export type DomainRegulationSnapshot = Readonly<{
  contractVersion: DomainRegulationRegistry["contractVersion"];
  registryId: string;
  frozen: boolean;
  packageCount: number;
  entries: readonly DomainRegulationSnapshotEntry[];
  fingerprint: string;
}>;

export type DomainRegulationDiffType = "added" | "removed" | "modified";

export type DomainRegulationDiffEntry = Readonly<{
  type: DomainRegulationDiffType;
  regulationPackageId: DomainRegulationPackageId;
  left: DomainRegulationSnapshotEntry | null;
  right: DomainRegulationSnapshotEntry | null;
}>;

export type DomainRegulationDiff = Readonly<{
  equal: boolean;
  leftFingerprint: string;
  rightFingerprint: string;
  entries: readonly DomainRegulationDiffEntry[];
}>;
