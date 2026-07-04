import { ExecutiveContextBuilder, type ExecutiveContext, type ExecutiveContextMetadata } from "./executiveContextIndex.ts";
import { EXECUTIVE_CONTEXT_SECTIONS } from "./executiveContextQuery.ts";
import type { ExecutiveContextInspectionResult, ExecutiveContextSection } from "./executiveContextQueryTypes.ts";

export function listExecutiveContextSections(): readonly ExecutiveContextSection[] {
  return EXECUTIVE_CONTEXT_SECTIONS;
}

export function listExecutiveContextCapabilities(): readonly string[] {
  return Object.freeze([
    "context-query",
    "section-lookup",
    "metadata-inspection",
    "summary-generation",
    "snapshot-generation",
    "snapshot-diff",
  ]);
}

export function hasExecutiveContextSection(section: ExecutiveContextSection): boolean {
  return EXECUTIVE_CONTEXT_SECTIONS.includes(section);
}

export function getExecutiveContextMetadata(context: ExecutiveContext): ExecutiveContextMetadata {
  return context.metadata;
}

export function buildExecutiveContextSummary(context: ExecutiveContext): string {
  return [
    context.identity.contextId,
    context.workspace.workspaceId,
    context.domain.selectedDomainIds.join(",") || "no-domains",
    context.goal.goalId,
  ].join("|");
}

export function inspectExecutiveContext(context: ExecutiveContext): ExecutiveContextInspectionResult {
  return Object.freeze({
    valid: ExecutiveContextBuilder.isExecutiveContextValid(context),
    contextId: context.identity.contextId,
    sections: listExecutiveContextSections(),
    capabilities: listExecutiveContextCapabilities(),
    summary: buildExecutiveContextSummary(context),
    context,
    metadataOnly: true,
  });
}
