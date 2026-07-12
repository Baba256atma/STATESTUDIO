import type { ExecutiveAutomationFreezeCompatibilityEntry } from "./executiveAutomationPlatformFreezeTypes.ts";

const createCompatibilityEntry = (target: string) =>
  Object.freeze({
    target,
    compatibilityStatus: "Compatible",
    certificationDependency: "PASS",
    manifestDependency: "Complete",
    publicApiCompatibility: "Stable",
    freezeCompatibility: "Frozen",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationFreezeCompatibilityEntry);

export const ExecutiveAutomationPlatformFreezeCompatibility = Object.freeze({
  internal: Object.freeze([
    createCompatibilityEntry("OPS-8:1"),
    createCompatibilityEntry("OPS-8:2"),
    createCompatibilityEntry("OPS-8:3"),
    createCompatibilityEntry("OPS-8:4"),
    createCompatibilityEntry("OPS-8:5"),
    createCompatibilityEntry("OPS-8:6"),
    createCompatibilityEntry("OPS-8:7"),
  ] as const),
  crossPlatform: Object.freeze([
    createCompatibilityEntry("OPS-2 Task Intelligence"),
    createCompatibilityEntry("OPS-3 Workflow Intelligence"),
    createCompatibilityEntry("OPS-4 Project Execution"),
    createCompatibilityEntry("OPS-5 Resource Intelligence"),
    createCompatibilityEntry("OPS-6 Scheduling Intelligence"),
    createCompatibilityEntry("OPS-7 Dependency Intelligence"),
  ] as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
