import type { DomainScenarioSeverity, DomainScenarioType } from "./domainScenarioTypes.ts";

function cleanLabel(value: unknown, fallback: string): string {
  const label = String(value ?? "").replace(/[_-]+/g, " ").trim();
  return label.length > 0 ? label : fallback;
}

export function buildDomainScenarioTitle(params: {
  type: DomainScenarioType;
  primaryLabel?: unknown;
  secondaryLabel?: unknown;
}): string {
  const primary = cleanLabel(params.primaryLabel, "Operating system");
  const secondary = cleanLabel(params.secondaryLabel, "downstream operations");

  switch (params.type) {
    case "delay":
      return `${primary} Delay Scenario`;
    case "bottleneck":
      return `${primary} Flow Bottleneck`;
    case "instability":
      return `${primary} Stability Risk`;
    case "overload":
      return `${primary} Capacity Overload`;
    case "dependency_failure":
      return `${secondary} Dependency Failure`;
    case "resource_constraint":
      return `${primary} Resource Constraint`;
    case "financial_pressure":
      return `${primary} Financial Pressure`;
    case "communication_breakdown":
      return `${primary} Communication Breakdown`;
  }
}

export function buildDomainScenarioExecutiveSummary(params: {
  type: DomainScenarioType;
  primaryLabel?: unknown;
  secondaryLabel?: unknown;
  severity: DomainScenarioSeverity;
}): string {
  const primary = cleanLabel(params.primaryLabel, "The current system");
  const secondary = cleanLabel(params.secondaryLabel, "downstream operations");

  switch (params.type) {
    case "delay":
      return `${secondary} may slow if ${primary} continues to carry fragile upstream flow.`;
    case "bottleneck":
      return `${secondary} continuity is increasingly dependent on a constrained ${primary} pathway.`;
    case "instability":
      return `${primary} instability may spread through connected operating paths.`;
    case "overload":
      return `${primary} may become overloaded as connected demand and dependency pressure increase.`;
    case "dependency_failure":
      return `${secondary} may degrade if ${primary} availability weakens further.`;
    case "resource_constraint":
      return `${secondary} may slip if ${primary} remains the limiting resource.`;
    case "financial_pressure":
      return `${secondary} may lose flexibility if ${primary} pressure continues.`;
    case "communication_breakdown":
      return `${secondary} coordination may weaken if ${primary} signals remain unclear.`;
  }
}

export function buildDomainScenarioProbableImpact(params: {
  type: DomainScenarioType;
  primaryLabel?: unknown;
  secondaryLabel?: unknown;
}): string {
  const primary = cleanLabel(params.primaryLabel, "the source node");
  const secondary = cleanLabel(params.secondaryLabel, "the target node");

  switch (params.type) {
    case "delay":
      return `Delay can propagate from ${primary} into ${secondary}.`;
    case "bottleneck":
      return `${primary} can constrain the pace of ${secondary}.`;
    case "instability":
      return `${primary} volatility can reduce operating confidence around ${secondary}.`;
    case "overload":
      return `${primary} pressure can increase capacity strain around ${secondary}.`;
    case "dependency_failure":
      return `${secondary} can become exposed if ${primary} weakens.`;
    case "resource_constraint":
      return `${secondary} can be blocked by limited capacity around ${primary}.`;
    case "financial_pressure":
      return `${primary} can reduce financial flexibility for ${secondary}.`;
    case "communication_breakdown":
      return `${secondary} can lose coordination quality if ${primary} signals degrade.`;
  }
}

export function buildDomainScenarioRecommendedFocus(params: {
  type: DomainScenarioType;
  primaryLabel?: unknown;
}): string {
  const primary = cleanLabel(params.primaryLabel, "the highest-pressure pathway");

  switch (params.type) {
    case "delay":
      return `Reduce delay exposure around ${primary}.`;
    case "bottleneck":
      return `Reduce dependency concentration around ${primary}.`;
    case "instability":
      return `Stabilize ${primary} before expanding activity.`;
    case "overload":
      return `Relieve capacity pressure around ${primary}.`;
    case "dependency_failure":
      return `Add resilience around ${primary}.`;
    case "resource_constraint":
      return `Rebalance constrained capacity around ${primary}.`;
    case "financial_pressure":
      return `Protect financial flexibility around ${primary}.`;
    case "communication_breakdown":
      return `Clarify ownership and monitoring around ${primary}.`;
  }
}
