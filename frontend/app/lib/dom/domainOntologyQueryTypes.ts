import type { DomainId } from "./domainFoundationIndex.ts";
import type {
  DomainAttributeDefinition,
  DomainAttributeId,
  DomainConstraintDefinition,
  DomainConstraintId,
  DomainEntityType,
  DomainEntityTypeId,
  DomainOntologyId,
  DomainOntologyRegistry,
  DomainOntologyScope,
  DomainOntologyStatus,
  DomainRelationshipType,
  DomainRelationshipTypeId,
  RegisteredDomainOntology,
} from "./domainOntologyIndex.ts";

export type DomainOntologySortKey = "ontologyId" | "domainId" | "registrationOrder";

export type DomainOntologySortDirection = "asc" | "desc";

export type DomainOntologyFilter = Readonly<{
  domainId?: DomainId;
  scope?: DomainOntologyScope;
  status?: DomainOntologyStatus;
  entityTypeId?: DomainEntityTypeId;
  relationshipTypeId?: DomainRelationshipTypeId;
}>;

export type DomainOntologyQuery = Readonly<{
  filter?: DomainOntologyFilter;
  sortKey?: DomainOntologySortKey;
  direction?: DomainOntologySortDirection;
}>;

export type DomainEntityLookupResult = Readonly<{
  found: boolean;
  ontology: RegisteredDomainOntology | null;
  entityType: DomainEntityType | null;
}>;

export type DomainRelationshipLookupResult = Readonly<{
  found: boolean;
  ontology: RegisteredDomainOntology | null;
  relationshipType: DomainRelationshipType | null;
}>;

export type DomainAttributeLookupResult = Readonly<{
  found: boolean;
  ontology: RegisteredDomainOntology | null;
  attribute: DomainAttributeDefinition | null;
}>;

export type DomainConstraintLookupResult = Readonly<{
  found: boolean;
  ontology: RegisteredDomainOntology | null;
  constraint: DomainConstraintDefinition | null;
}>;

export type DomainOntologyTraversalResult = Readonly<{
  entityTypeId: DomainEntityTypeId;
  entity: DomainEntityLookupResult;
  outgoingRelationships: readonly DomainRelationshipLookupResult[];
  incomingRelationships: readonly DomainRelationshipLookupResult[];
  connectedEntities: readonly DomainEntityLookupResult[];
}>;

export type DomainOntologySnapshotEntry = Readonly<{
  ontologyId: DomainOntologyId;
  domainId: DomainId;
  registrationOrder: number;
  scope: DomainOntologyScope;
  status: DomainOntologyStatus;
  entityTypeIds: readonly DomainEntityTypeId[];
  relationshipTypeIds: readonly DomainRelationshipTypeId[];
  attributeIds: readonly DomainAttributeId[];
  constraintIds: readonly DomainConstraintId[];
  fingerprint: string;
}>;

export type DomainOntologySnapshot = Readonly<{
  contractVersion: DomainOntologyRegistry["contractVersion"];
  registryId: string;
  frozen: boolean;
  ontologyCount: number;
  entries: readonly DomainOntologySnapshotEntry[];
  fingerprint: string;
}>;

export type DomainOntologyDiffType = "added" | "removed" | "modified";

export type DomainOntologyDiffEntry = Readonly<{
  type: DomainOntologyDiffType;
  ontologyId: DomainOntologyId;
  left: DomainOntologySnapshotEntry | null;
  right: DomainOntologySnapshotEntry | null;
}>;

export type DomainOntologyDiff = Readonly<{
  equal: boolean;
  leftFingerprint: string;
  rightFingerprint: string;
  entries: readonly DomainOntologyDiffEntry[];
}>;
