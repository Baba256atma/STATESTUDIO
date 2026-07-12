import { TaskIdentityModel } from "./taskIdentityModel.ts";
import type { TaskPriorityDescriptor } from "./taskModelTypes.ts";

const metadata = TaskIdentityModel.metadata;

export const TaskPriorityModel = Object.freeze([
  Object.freeze({
    priorityLevel: "Critical",
    urgency: "Immediate",
    importance: "High",
    executiveImpact: "PlatformWide",
    escalationSensitivity: "Maximum",
    metadata,
  } as const satisfies TaskPriorityDescriptor),
  Object.freeze({
    priorityLevel: "High",
    urgency: "NearTerm",
    importance: "High",
    executiveImpact: "CrossFunctional",
    escalationSensitivity: "Elevated",
    metadata,
  } as const satisfies TaskPriorityDescriptor),
  Object.freeze({
    priorityLevel: "Normal",
    urgency: "Planned",
    importance: "Moderate",
    executiveImpact: "Scoped",
    escalationSensitivity: "Standard",
    metadata,
  } as const satisfies TaskPriorityDescriptor),
  Object.freeze({
    priorityLevel: "Low",
    urgency: "Deferred",
    importance: "Limited",
    executiveImpact: "Localized",
    escalationSensitivity: "Minimal",
    metadata,
  } as const satisfies TaskPriorityDescriptor),
] as const);
