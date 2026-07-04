import type { DomainId } from "./domainFoundationIndex.ts";
import type {
  DomainKpiAggregationType,
  DomainKpiDirection,
  DomainKpiId,
  DomainKpiRegistry,
  DomainKpiScope,
  DomainKpiStatus,
  DomainKpiUnitType,
  RegisteredDomainKpiPackage,
} from "./domainKpiIndex.ts";
import type { DomainKpiLookupResult } from "./domainKpiQueryTypes.ts";

function lookupResult(
  kpiPackage: RegisteredDomainKpiPackage | null,
  kpi: DomainKpiLookupResult["kpi"]
): DomainKpiLookupResult {
  return Object.freeze({ found: Boolean(kpiPackage && kpi), kpiPackage, kpi });
}

function findKpisWhere(
  registry: DomainKpiRegistry,
  predicate: (kpi: NonNullable<DomainKpiLookupResult["kpi"]>, kpiPackage: RegisteredDomainKpiPackage) => boolean
): readonly DomainKpiLookupResult[] {
  const results: DomainKpiLookupResult[] = [];
  for (const kpiPackage of registry.packages) {
    for (const kpi of kpiPackage.package.kpis) {
      if (predicate(kpi, kpiPackage)) results.push(lookupResult(kpiPackage, kpi));
    }
  }
  return Object.freeze(results);
}

export function findDomainKpi(registry: DomainKpiRegistry, kpiId: DomainKpiId): DomainKpiLookupResult {
  for (const kpiPackage of registry.packages) {
    const kpi = kpiPackage.package.kpis.find((entry) => entry.kpiId === kpiId) ?? null;
    if (kpi) return lookupResult(kpiPackage, kpi);
  }
  return lookupResult(null, null);
}

export function findKpisByDomain(registry: DomainKpiRegistry, domainId: DomainId): readonly DomainKpiLookupResult[] {
  return findKpisWhere(registry, (_kpi, kpiPackage) => kpiPackage.package.domainId === domainId);
}

export function findKpisByScope(registry: DomainKpiRegistry, scope: DomainKpiScope): readonly DomainKpiLookupResult[] {
  return findKpisWhere(registry, (kpi) => kpi.scope === scope);
}

export function findKpisByStatus(registry: DomainKpiRegistry, status: DomainKpiStatus): readonly DomainKpiLookupResult[] {
  return findKpisWhere(registry, (kpi) => kpi.status === status);
}

export function findKpisByUnitType(
  registry: DomainKpiRegistry,
  unitType: DomainKpiUnitType
): readonly DomainKpiLookupResult[] {
  return findKpisWhere(registry, (kpi) => kpi.unit.unitType === unitType);
}

export function findKpisByAggregationType(
  registry: DomainKpiRegistry,
  aggregationType: DomainKpiAggregationType
): readonly DomainKpiLookupResult[] {
  return findKpisWhere(registry, (kpi) => kpi.aggregation.aggregationType === aggregationType);
}

export function findKpisByDirection(
  registry: DomainKpiRegistry,
  direction: DomainKpiDirection
): readonly DomainKpiLookupResult[] {
  return findKpisWhere(registry, (kpi) => kpi.intent.direction === direction);
}
