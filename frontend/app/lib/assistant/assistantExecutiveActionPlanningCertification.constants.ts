/** ASSISTANT-7:7 — Immutable Certification constants. */
import { AssistantExecutiveActionPlanningCertificationCriteria } from "./assistantExecutiveActionPlanningCertification.criteria.ts";
import { AssistantExecutiveActionPlanningCertificationGates } from "./assistantExecutiveActionPlanningCertification.gates.ts";

export const AssistantExecutiveActionPlanningCertificationConstants =
  Object.freeze({
    certificationIdentifier:
      "ASSISTANT-7:7/ExecutiveActionPlanningCertification",
    namespace: "nexora.assistant.executive-action-planning.certification",
    version: "1.0.0",
    status: "Certification",
    readiness: "ReadyForFreeze",
    criteriaCount:
      AssistantExecutiveActionPlanningCertificationCriteria.length,
    gateCount: AssistantExecutiveActionPlanningCertificationGates.length,
  } as const);
