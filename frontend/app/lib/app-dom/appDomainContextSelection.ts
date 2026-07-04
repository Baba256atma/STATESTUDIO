import { AppDomainMappingLayer } from "./appDomainMappingIndex.ts";
import type {
  AppDomainContext,
  AppDomainContextSelection,
  AppDomainContextSnapshot,
  AppDomainContextValidation,
  AppDomainSelectionCriteria,
  AppDomainSelectionMode,
  AppDomainSelectionScope,
} from "./appDomainContextTypes.ts";

function validationResult(issues: AppDomainContextValidation["issues"]): AppDomainContextValidation {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)]);
}

function defaultCriteria(): AppDomainSelectionCriteria {
  return Object.freeze({
    scope: "workspace",
    mode: "multiple",
    requestedDomainIds: Object.freeze([]),
    consumerId: "app-domain-context-consumer",
    contextLabel: "Default Domain Context",
  });
}

function contextIdFromCriteria(criteria: AppDomainSelectionCriteria): string {
  const requested = criteria.requestedDomainIds.length > 0 ? criteria.requestedDomainIds.join("-") : "none";
  return `app-domain-context.${criteria.scope}.${criteria.mode}.${requested}`;
}

function snapshotFor(
  contextId: string,
  criteria: AppDomainSelectionCriteria,
  selectedDomainIds: readonly string[]
): AppDomainContextSnapshot {
  const snapshot = AppDomainMappingLayer.buildAppDomainConsumerSnapshot();
  return Object.freeze({
    contextId,
    scope: criteria.scope,
    mode: criteria.mode,
    selectedDomainIds,
    mappedPlatformVersion: snapshot.platformMap.platformInfo.version,
    mappedPackageCount: snapshot.packageMap.totalPackages,
    immutable: true,
    metadataOnly: true,
  });
}

export function selectDomains(criteria: AppDomainSelectionCriteria): AppDomainContextSelection {
  const availableDomainIds = AppDomainMappingLayer.buildDomainPackageMap().packages.map((entry) => entry.packageId);
  const requestedDomainIds = unique(criteria.requestedDomainIds);
  const selected = requestedDomainIds.filter((domainId) => availableDomainIds.includes(domainId));
  const selectedDomainIds = criteria.mode === "single" ? Object.freeze(selected.slice(0, 1)) : Object.freeze(selected);
  const rejectedDomainIds = Object.freeze(requestedDomainIds.filter((domainId) => !selectedDomainIds.includes(domainId)));

  return Object.freeze({
    criteria,
    selectedDomainIds,
    rejectedDomainIds,
    availableDomainIds: Object.freeze(availableDomainIds),
    metadataOnly: true,
  });
}

export function createDomainContext(criteria: AppDomainSelectionCriteria = defaultCriteria()): AppDomainContext {
  const selection = selectDomains(criteria);
  const contextId = contextIdFromCriteria(criteria);
  const context = Object.freeze({
    contextId,
    selection,
    snapshot: snapshotFor(contextId, criteria, selection.selectedDomainIds),
    validation: validationResult(Object.freeze([])),
    immutable: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({
    ...context,
    validation: validateDomainContext(context),
  });
}

export function selectDomainContext(
  domainId: string,
  scope: AppDomainSelectionScope = "workspace",
  consumerId = "app-domain-context-consumer"
): AppDomainContext {
  return createDomainContext(
    Object.freeze({
      scope,
      mode: "single",
      requestedDomainIds: Object.freeze([domainId]),
      consumerId,
      contextLabel: `${scope} domain context`,
    })
  );
}

export function getActiveDomainContext(context: AppDomainContext = createDomainContext()): AppDomainContext {
  return context;
}

export function listSelectedDomains(context: AppDomainContext): readonly string[] {
  return context.selection.selectedDomainIds;
}

export function clearDomainSelection(
  scope: AppDomainSelectionScope = "workspace",
  mode: AppDomainSelectionMode = "multiple"
): AppDomainContext {
  return createDomainContext(
    Object.freeze({
      scope,
      mode,
      requestedDomainIds: Object.freeze([]),
      consumerId: "app-domain-context-consumer",
      contextLabel: "Cleared Domain Context",
    })
  );
}

export function validateDomainContext(context: AppDomainContext): AppDomainContextValidation {
  const issues: AppDomainContextValidation["issues"][number][] = [];
  const availableDomainIds = AppDomainMappingLayer.buildDomainPackageMap().packages.map((entry) => entry.packageId);
  if (context.contextId.trim().length === 0) {
    issues.push(Object.freeze({ code: "missing_context_id", message: "Domain context id is required." }));
  }
  if (context.selection.criteria.mode === "single" && context.selection.selectedDomainIds.length > 1) {
    issues.push(Object.freeze({ code: "invalid_single_selection", message: "Single selection mode may select at most one domain." }));
  }
  for (const domainId of context.selection.selectedDomainIds) {
    if (!availableDomainIds.includes(domainId)) {
      issues.push(Object.freeze({ code: "unknown_domain", message: `Selected domain ${domainId} is not available.` }));
    }
  }
  if (!context.metadataOnly || !context.immutable) {
    issues.push(Object.freeze({ code: "invalid_context_boundary", message: "Domain context must remain immutable metadata only." }));
  }
  return validationResult(issues);
}
