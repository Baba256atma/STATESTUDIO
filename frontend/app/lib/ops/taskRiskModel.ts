import { TaskIdentityModel } from "./taskIdentityModel.ts";
import type { TaskRiskDescriptor } from "./taskModelTypes.ts";

const metadata = TaskIdentityModel.metadata;

export const TaskRiskModel = Object.freeze({
  riskLevel: "Moderate",
  riskCategory: "ExecutionReadiness",
  failureImpact: "CrossFunctionalDelay",
  delaySensitivity: "Elevated",
  mitigationReferenceMetadata: Object.freeze([
    "MitigationOwnerReference",
    "EscalationReference",
  ]),
  metadata,
} as const satisfies TaskRiskDescriptor);
