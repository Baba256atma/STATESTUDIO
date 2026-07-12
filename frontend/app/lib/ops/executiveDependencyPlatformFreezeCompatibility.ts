import type { ExecutiveDependencyFreezeCompatibilityEntry } from "./executiveDependencyPlatformFreezeTypes.ts";

const createCompatibilityEntry = (
  target: string,
) =>
  Object.freeze({
    target,
    compatibilityStatus: "Compatible",
    certificationDependency: "PASS",
    manifestDependency: "Complete",
    publicApiCompatibility: "Stable",
    freezeCompatibility: "Frozen",
    metadataOnly: true,
  } as const satisfies ExecutiveDependencyFreezeCompatibilityEntry);

export const ExecutiveDependencyPlatformFreezeCompatibility = Object.freeze({
  internal: Object.freeze([
    createCompatibilityEntry("OPS-7:1"),
    createCompatibilityEntry("OPS-7:2"),
    createCompatibilityEntry("OPS-7:3"),
    createCompatibilityEntry("OPS-7:4"),
    createCompatibilityEntry("OPS-7:5"),
    createCompatibilityEntry("OPS-7:6"),
    createCompatibilityEntry("OPS-7:7"),
  ] as const),
  crossPlatform: Object.freeze([
    createCompatibilityEntry("OPS-2 Task Intelligence"),
    createCompatibilityEntry("OPS-3 Workflow Intelligence"),
    createCompatibilityEntry("OPS-4 Project Execution"),
    createCompatibilityEntry("OPS-5 Resource Intelligence"),
    createCompatibilityEntry("OPS-6 Scheduling Intelligence"),
  ] as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
