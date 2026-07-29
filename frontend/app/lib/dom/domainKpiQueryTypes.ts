import type { DomainId } from "./domainFoundationIndex.ts";
import type { DomainKpiDefinition, DomainKpiId, DomainKpiPackageId, DomainKpiRegistry, DomainKpiScope, DomainKpiStatus, RegisteredDomainKpiPackage } from "./domainKpiIndex.ts";

export type DomainKpiSortKey = "kpiPackageId" | "domainId" | "registrationOrder";

export type DomainKpiSortDirection = "asc" | "desc";

export type DomainKpiFilter = Readonly<{
  domainId?: DomainId;
  scope?: DomainKpiScope;
  status?: DomainKpiStatus;
  kpiId?: DomainKpiId;
}>;

export type DomainKpiQuery = Readonly<{
  filter?: DomainKpiFilter;
  sortKey?: DomainKpiSortKey;
  direction?: DomainKpiSortDirection;
}>;

export type DomainKpiLookupResult = Readonly<{
  found: boolean;
  kpiPackage: RegisteredDomainKpiPackage | null;
  kpi: DomainKpiDefinition | null;
}>;

export type DomainKpiReferenceLookupResult = Readonly<{
  referenceId: string;
  matches: readonly DomainKpiLookupResult[];
}>;

export type DomainKpiSnapshotEntry = Readonly<{
  kpiPackageId: DomainKpiPackageId;
  domainId: DomainId;
  registrationOrder: number;
  scope: DomainKpiScope;
  status: DomainKpiStatus;
  kpiIds: readonly DomainKpiId[];
  fingerprint: string;
}>;

export type DomainKpiSnapshot = Readonly<{
  contractVersion: DomainKpiRegistry["contractVersion"];
  registryId: string;
  frozen: boolean;
  packageCount: number;
  entries: readonly DomainKpiSnapshotEntry[];
  fingerprint: string;
}>;

export type DomainKpiDiffType = "added" | "removed" | "modified";

export type DomainKpiDiffEntry = Readonly<{
  type: DomainKpiDiffType;
  kpiPackageId: DomainKpiPackageId;
  left: DomainKpiSnapshotEntry | null;
  right: DomainKpiSnapshotEntry | null;
}>;

export type DomainKpiDiff = Readonly<{
  equal: boolean;
  leftFingerprint: string;
  rightFingerprint: string;
  entries: readonly DomainKpiDiffEntry[];
}>;

export type DomainKpiReferenceField =
  | "vocabularyTerm"
  | "ontologyEntity"
  | "ontologyAttribute"
  | "ontologyRelationship";

export type DomainKpiReferencePredicate = Readonly<{
  field: DomainKpiReferenceField;
  referenceId: string;
}>;
