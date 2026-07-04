import { ExecutiveContextBuilder, type ExecutiveContext } from "./executiveContextIndex.ts";
import type {
  ExecutiveContextFilter,
  ExecutiveContextLookupResult,
  ExecutiveContextQuery,
  ExecutiveContextSection,
  ExecutiveContextSnapshotEntry,
  ExecutiveContextSortKey,
} from "./executiveContextQueryTypes.ts";

const SECTION_ORDER: readonly ExecutiveContextSection[] = Object.freeze([
  "identity",
  "metadata",
  "workspace",
  "domain",
  "objects",
  "kpis",
  "risks",
  "scenario",
  "timeline",
  "simulation",
  "intent",
  "goal",
  "constraints",
]);

function stableValue(value: unknown): string {
  return JSON.stringify(value);
}

function sectionValue(context: ExecutiveContext, section: ExecutiveContextSection): unknown {
  return context[section];
}

function entry(context: ExecutiveContext, section: ExecutiveContextSection): ExecutiveContextSnapshotEntry {
  const value = stableValue(sectionValue(context, section));
  return Object.freeze({ section, value, valueSize: value.length });
}

export function queryExecutiveContext(
  context: ExecutiveContext,
  query: ExecutiveContextQuery = Object.freeze({})
): readonly ExecutiveContextSnapshotEntry[] {
  const requestedSections = query.sections ?? SECTION_ORDER;
  const entries = requestedSections.map((section) => entry(context, section));
  return Object.freeze(query.includeEmpty === false ? entries.filter((item) => item.valueSize > 2) : entries);
}

export function filterExecutiveContext(
  context: ExecutiveContext,
  filter: ExecutiveContextFilter
): readonly ExecutiveContextSnapshotEntry[] {
  return Object.freeze(
    queryExecutiveContext(context).filter((item) => {
      const sectionMatches = filter.section ? item.section === filter.section : true;
      const valueMatches = filter.contains ? item.value.includes(filter.contains) : true;
      return sectionMatches && valueMatches;
    })
  );
}

export function sortExecutiveContextEntries(
  entries: readonly ExecutiveContextSnapshotEntry[],
  sortKey: ExecutiveContextSortKey = "section"
): readonly ExecutiveContextSnapshotEntry[] {
  const sorted = [...entries].sort((left, right) => {
    if (sortKey === "valueSize") {
      return left.valueSize - right.valueSize || left.section.localeCompare(right.section);
    }
    return left.section.localeCompare(right.section);
  });
  return Object.freeze(sorted);
}

function lookup<T>(context: ExecutiveContext, section: ExecutiveContextSection, value: T): ExecutiveContextLookupResult<T> {
  return Object.freeze({ found: ExecutiveContextBuilder.isExecutiveContextValid(context), section, value });
}

export function findWorkspaceContext(context: ExecutiveContext) {
  return lookup(context, "workspace", context.workspace);
}

export function findDomainContext(context: ExecutiveContext) {
  return lookup(context, "domain", context.domain);
}

export function findObjectContext(context: ExecutiveContext) {
  return lookup(context, "objects", context.objects);
}

export function findKpiContext(context: ExecutiveContext) {
  return lookup(context, "kpis", context.kpis);
}

export function findRiskContext(context: ExecutiveContext) {
  return lookup(context, "risks", context.risks);
}

export function findScenarioContext(context: ExecutiveContext) {
  return lookup(context, "scenario", context.scenario);
}

export function findTimelineContext(context: ExecutiveContext) {
  return lookup(context, "timeline", context.timeline);
}

export function findSimulationContext(context: ExecutiveContext) {
  return lookup(context, "simulation", context.simulation);
}

export function findIntentContext(context: ExecutiveContext) {
  return lookup(context, "intent", context.intent);
}

export function findGoalContext(context: ExecutiveContext) {
  return lookup(context, "goal", context.goal);
}

export function findConstraintContext(context: ExecutiveContext) {
  return lookup(context, "constraints", context.constraints);
}

export { SECTION_ORDER as EXECUTIVE_CONTEXT_SECTIONS };
