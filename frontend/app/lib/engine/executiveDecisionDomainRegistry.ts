import type { ExecutiveDecisionDomainRegistryEntry } from "./executiveDecisionRegistryTypes.ts";

const NAMESPACE = "Nexora.Engine.ExecutiveDecision.Registry.Domain";

const domain = (
  key: string,
  name: string,
  description: string,
) => Object.freeze({
  id: `eng-7-domain-${key}`,
  domainKey: name,
  name,
  description,
  namespace: NAMESPACE,
  owner: "ENG-7",
  status: "Registered",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionDomainRegistryEntry);

/**
 * Canonical decision-domain registry — classification metadata only.
 */
export const ExecutiveDecisionDomainRegistry = Object.freeze([
  domain("strategic", "StrategicDecision", "Domain for strategic executive decision classification."),
  domain("operational", "OperationalDecision", "Domain for operational executive decision classification."),
  domain("financial", "FinancialDecision", "Domain for financial executive decision classification."),
  domain("resource", "ResourceDecision", "Domain for resource executive decision classification."),
  domain("project", "ProjectDecision", "Domain for project executive decision classification."),
  domain("risk", "RiskDecision", "Domain for risk executive decision classification."),
  domain("priority", "PriorityDecision", "Domain for priority executive decision classification."),
  domain("approval", "ApprovalDecision", "Domain for approval executive decision classification."),
  domain("corrective", "CorrectiveDecision", "Domain for corrective executive decision classification."),
  domain("escalation", "EscalationDecision", "Domain for escalation executive decision classification."),
  domain("scenario", "ScenarioDecision", "Domain for scenario executive decision classification."),
  domain("recommendation", "RecommendationDecision", "Domain for recommendation executive decision classification."),
] as const);
