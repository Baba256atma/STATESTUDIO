import type { IdentityId } from "./identityIndex.ts";
import type { IdentityRegistry } from "./identityRegistryIndex.ts";
import type { IdentityScopeGraph } from "./identityOwnershipContracts.ts";
import type { IdentityOwnershipRecord } from "./identityOwnershipTypes.ts";
import {
  scopeIssue,
  scopeValidationResult,
  validateCrossTenantOwnership,
  validateIdentityScope,
  validateOwnershipRecord,
} from "./identityOwnershipValidation.ts";
import type { IdentityScopeValidationIssue, IdentityScopeValidationResult } from "./identityScopeContracts.ts";
import type { IdentityScope } from "./identityScopeTypes.ts";

function scopeByIdentity(scopes: readonly IdentityScope[]): Readonly<Record<IdentityId, IdentityScope>> {
  const byIdentity: Record<IdentityId, IdentityScope> = {};
  scopes.forEach((scope) => {
    byIdentity[scope.identityId] = scope;
  });
  return Object.freeze(byIdentity);
}

export function getScopeAncestors(
  graph: IdentityScopeGraph,
  identityId: IdentityId
): readonly IdentityScope[] {
  const byIdentity = scopeByIdentity(graph.scopes);
  const scope = byIdentity[identityId] ?? null;
  if (!scope) return Object.freeze([]);
  return Object.freeze(scope.path.slice(0, -1).flatMap((pathId) => byIdentity[pathId] ?? []));
}

export function getScopeDescendants(
  graph: IdentityScopeGraph,
  identityId: IdentityId
): readonly IdentityScope[] {
  return Object.freeze(
    graph.scopes
      .filter((scope) => scope.identityId !== identityId && scope.path.includes(identityId))
      .sort((left, right) => left.identityId.localeCompare(right.identityId))
  );
}

function hasOwnershipCycle(records: readonly IdentityOwnershipRecord[]): boolean {
  const parentByChild = new Map<IdentityId, IdentityId | "Global">();
  records.forEach((record) => parentByChild.set(record.childIdentityId, record.ownerIdentityId));

  return records.some((record) => {
    const visited = new Set<IdentityId | "Global">();
    let current: IdentityId | "Global" | undefined = record.childIdentityId;
    while (current && current !== "Global") {
      if (visited.has(current)) return true;
      visited.add(current);
      current = parentByChild.get(current);
    }
    return false;
  });
}

function duplicateOwnershipIssues(records: readonly IdentityOwnershipRecord[]): readonly IdentityScopeValidationIssue[] {
  const seenChildren = new Set<IdentityId>();
  const seenRecords = new Set<string>();
  const issues: IdentityScopeValidationIssue[] = [];

  records.forEach((record, index) => {
    if (seenRecords.has(record.recordId)) {
      issues.push(scopeIssue("duplicate_ownership", `${index}.recordId`, "Ownership record id is duplicated."));
    }
    if (seenChildren.has(record.childIdentityId)) {
      issues.push(scopeIssue("duplicate_ownership", `${index}.childIdentityId`, "Identity has multiple owners."));
    }
    seenRecords.add(record.recordId);
    seenChildren.add(record.childIdentityId);
  });

  return issues;
}

export function validateOwnershipGraph(
  graph: IdentityScopeGraph,
  registry: IdentityRegistry
): IdentityScopeValidationResult {
  const issues: IdentityScopeValidationIssue[] = [];
  const scopesByIdentity = scopeByIdentity(graph.scopes);

  graph.scopes.forEach((scope, index) => {
    issues.push(
      ...validateIdentityScope(scope).issues.map((entry) =>
        scopeIssue(entry.code, `scopes.${index}.${entry.field}`, entry.message)
      )
    );
  });

  graph.ownershipRecords.forEach((record, index) => {
    issues.push(
      ...validateOwnershipRecord(record, registry).issues.map((entry) =>
        scopeIssue(entry.code, `ownershipRecords.${index}.${entry.field}`, entry.message)
      )
    );
    issues.push(
      ...validateCrossTenantOwnership(
        record,
        record.ownerIdentityId === "Global" ? null : scopesByIdentity[record.ownerIdentityId] ?? null,
        scopesByIdentity[record.childIdentityId] ?? null
      ).issues.map((entry) => scopeIssue(entry.code, `ownershipRecords.${index}.${entry.field}`, entry.message))
    );

    const childScope = scopesByIdentity[record.childIdentityId] ?? null;
    if (!childScope) {
      issues.push(scopeIssue("orphaned_identity", `ownershipRecords.${index}.childIdentityId`, "Child scope is missing."));
    } else if (record.ownerIdentityId !== "Global" && !childScope.path.includes(record.ownerIdentityId)) {
      issues.push(scopeIssue("broken_ancestry", `ownershipRecords.${index}.ownerIdentityId`, "Owner is not in child path."));
    }
  });

  issues.push(...duplicateOwnershipIssues(graph.ownershipRecords));

  if (hasOwnershipCycle(graph.ownershipRecords)) {
    issues.push(scopeIssue("circular_ownership", "ownershipRecords", "Ownership graph contains a cycle."));
  }

  return scopeValidationResult(issues);
}
