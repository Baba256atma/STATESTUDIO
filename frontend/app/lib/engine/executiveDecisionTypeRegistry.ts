import { ExecutiveDecisionDomainRegistry } from "./executiveDecisionDomainRegistry.ts";
import type { ExecutiveDecisionTypeRegistryEntry } from "./executiveDecisionRegistryTypes.ts";

const NAMESPACE = "Nexora.Engine.ExecutiveDecision.Registry.Type";

const domainIds = (...keys: readonly string[]) => Object.freeze(
  keys.map((key) => {
    const match = ExecutiveDecisionDomainRegistry.find(({ domainKey }) => domainKey === key);
    return match?.id ?? `eng-7-domain-missing-${key}`;
  }),
);

const lifecycle = (...states: readonly string[]) => Object.freeze(
  states.map((state) => `eng-7-lifecycle-${state}`),
);

const decisionType = (
  key: string,
  publicName: string,
  description: string,
  applicableDomains: readonly string[],
  lifecycleCompatibility: readonly string[],
) => Object.freeze({
  id: `eng-7-type-${key}`,
  name: publicName,
  publicName,
  description,
  namespace: NAMESPACE,
  applicableDomains: Object.freeze([...applicableDomains]),
  lifecycleCompatibility: Object.freeze([...lifecycleCompatibility]),
  owner: "ENG-7",
  status: "Registered",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionTypeRegistryEntry);

/**
 * Canonical decision-type registry — classification types only.
 */
export const ExecutiveDecisionTypeRegistry = Object.freeze([
  decisionType(
    "select",
    "Select",
    "Classification for selecting among executive alternatives.",
    domainIds("StrategicDecision", "OperationalDecision", "ProjectDecision", "ScenarioDecision"),
    lifecycle("candidate", "evaluated", "selected"),
  ),
  decisionType(
    "approve",
    "Approve",
    "Classification for approving an executive proposal.",
    domainIds("ApprovalDecision", "FinancialDecision", "ProjectDecision"),
    lifecycle("selected", "approved", "published"),
  ),
  decisionType(
    "reject",
    "Reject",
    "Classification for rejecting an executive proposal.",
    domainIds("ApprovalDecision", "RiskDecision", "CorrectiveDecision"),
    lifecycle("evaluated", "selected", "published"),
  ),
  decisionType(
    "prioritize",
    "Prioritize",
    "Classification for prioritizing executive alternatives.",
    domainIds("PriorityDecision", "ProjectDecision", "ResourceDecision"),
    lifecycle("candidate", "evaluated", "selected"),
  ),
  decisionType(
    "defer",
    "Defer",
    "Classification for deferring an executive decision.",
    domainIds("OperationalDecision", "PriorityDecision", "ScenarioDecision"),
    lifecycle("candidate", "evaluated", "archived"),
  ),
  decisionType(
    "escalate",
    "Escalate",
    "Classification for escalating an executive decision.",
    domainIds("EscalationDecision", "RiskDecision", "ApprovalDecision"),
    lifecycle("evaluated", "selected", "published"),
  ),
  decisionType(
    "recommend",
    "Recommend",
    "Classification for recommending an executive course of action.",
    domainIds("RecommendationDecision", "StrategicDecision", "ScenarioDecision"),
    lifecycle("candidate", "evaluated", "published"),
  ),
  decisionType(
    "correct",
    "Correct",
    "Classification for corrective executive decisions.",
    domainIds("CorrectiveDecision", "OperationalDecision", "ProjectDecision"),
    lifecycle("evaluated", "selected", "published"),
  ),
  decisionType(
    "allocate",
    "Allocate",
    "Classification for allocating resources or commitments.",
    domainIds("ResourceDecision", "FinancialDecision", "ProjectDecision"),
    lifecycle("evaluated", "selected", "approved"),
  ),
  decisionType(
    "reallocate",
    "Reallocate",
    "Classification for reallocating resources or commitments.",
    domainIds("ResourceDecision", "FinancialDecision", "PriorityDecision"),
    lifecycle("evaluated", "selected", "approved"),
  ),
  decisionType(
    "continue",
    "Continue",
    "Classification for continuing an executive course of action.",
    domainIds("OperationalDecision", "ProjectDecision", "ScenarioDecision"),
    lifecycle("evaluated", "selected", "published"),
  ),
  decisionType(
    "pause",
    "Pause",
    "Classification for pausing an executive course of action.",
    domainIds("OperationalDecision", "ProjectDecision", "RiskDecision"),
    lifecycle("evaluated", "selected", "published"),
  ),
  decisionType(
    "stop",
    "Stop",
    "Classification for stopping an executive course of action.",
    domainIds("OperationalDecision", "ProjectDecision", "CorrectiveDecision"),
    lifecycle("evaluated", "selected", "published"),
  ),
  decisionType(
    "replace",
    "Replace",
    "Classification for replacing an executive selection.",
    domainIds("StrategicDecision", "ProjectDecision", "RecommendationDecision"),
    lifecycle("selected", "superseded", "published"),
  ),
  decisionType(
    "accept-risk",
    "AcceptRisk",
    "Classification for accepting an executive risk posture.",
    domainIds("RiskDecision", "FinancialDecision", "StrategicDecision"),
    lifecycle("evaluated", "approved", "published"),
  ),
  decisionType(
    "mitigate-risk",
    "MitigateRisk",
    "Classification for mitigating an executive risk posture.",
    domainIds("RiskDecision", "CorrectiveDecision", "OperationalDecision"),
    lifecycle("evaluated", "selected", "published"),
  ),
] as const);
