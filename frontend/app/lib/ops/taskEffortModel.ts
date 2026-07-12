import { TaskIdentityModel } from "./taskIdentityModel.ts";
import type { TaskEffortDescriptor } from "./taskModelTypes.ts";

const metadata = TaskIdentityModel.metadata;

export const TaskEffortModel = Object.freeze({
  estimatedEffort: "Moderate",
  complexity: "Structured",
  requiredCapacity: "SharedOperationalCapacity",
  effortConfidence: "Medium",
  planningNotesMetadata: Object.freeze([
    "CapacityAssumptionCaptured",
    "ComplexityRationaleCaptured",
  ]),
  metadata,
} as const satisfies TaskEffortDescriptor);
