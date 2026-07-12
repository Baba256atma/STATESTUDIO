import { ExecutiveOperationsSuiteFoundation } from "./executiveOperationsSuiteFoundationIndex.ts";
import type { ExecutiveOperationsSuitePhaseId, ExecutiveOperationsSuitePhaseRegistryEntry, ExecutiveOperationsSuitePlatformId } from "./executiveOperationsSuiteRegistryTypes.ts";

const phase = (phaseId: ExecutiveOperationsSuitePhaseId, platformId: ExecutiveOperationsSuitePlatformId, order: number, consumes: readonly ExecutiveOperationsSuitePhaseId[], owns: string, provides: string, suiteRole: string) => Object.freeze({
  phaseId, platformId, order, owns: Object.freeze([owns]), consumes: Object.freeze(consumes),
  provides: Object.freeze([provides]), suiteRole, releaseState: "Public", metadataOnly: true,
} as const satisfies ExecutiveOperationsSuitePhaseRegistryEntry);

export const ExecutiveOperationsSuitePhaseRegistry = Object.freeze([
  phase("OPS-1", "execution", 1, [], "execution", "Execution public foundation", "Execution foundation"),
  phase("OPS-2", "task", 2, ["OPS-1"], "task", "Task intelligence metadata", "Task intelligence"),
  phase("OPS-3", "workflow", 3, ["OPS-1", "OPS-2"], "workflow", "Workflow intelligence metadata", "Workflow intelligence"),
  phase("OPS-4", "project", 4, ["OPS-1", "OPS-2", "OPS-3"], "project", "Project execution metadata", "Project execution"),
  phase("OPS-5", "resource", 5, ["OPS-1", "OPS-4"], "resource", "Resource intelligence metadata", "Resource intelligence"),
  phase("OPS-6", "scheduling", 6, ["OPS-1", "OPS-4", "OPS-5"], "scheduling", "Scheduling intelligence metadata", "Scheduling intelligence"),
  phase("OPS-7", "dependency", 7, ["OPS-1", "OPS-2", "OPS-3", "OPS-4", "OPS-5", "OPS-6"], "monitoring", "Dependency intelligence metadata", "Dependency intelligence"),
  phase("OPS-8", "automation", 8, ["OPS-1", "OPS-2", "OPS-3", "OPS-4", "OPS-5", "OPS-6", "OPS-7"], "automation", "Automation platform metadata", "Automation platform"),
  phase("OPS-9", "monitoring", 9, ["OPS-1", "OPS-2", "OPS-3", "OPS-4", "OPS-5", "OPS-6", "OPS-7", "OPS-8"], "dashboard", "Execution monitoring metadata", "Executive execution monitoring"),
] as const);

const foundationSections = Object.freeze(Object.keys(ExecutiveOperationsSuiteFoundation));
export const ExecutiveOperationsSuitePhaseRegistryMetadata = Object.freeze({
  phaseCount: 9, canonicalOrder: Object.freeze(ExecutiveOperationsSuitePhaseRegistry.map((entry) => entry.phaseId)),
  foundationSections, metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const getExecutiveOperationsSuitePhaseRegistry = () => ExecutiveOperationsSuitePhaseRegistry;
export const getExecutiveOperationsSuitePhaseById = (phaseId: string) => ExecutiveOperationsSuitePhaseRegistry.find((entry) => entry.phaseId === phaseId);
