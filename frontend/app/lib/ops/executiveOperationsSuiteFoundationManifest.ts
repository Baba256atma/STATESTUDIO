import { ExecutiveOperationsSuiteFoundation, getExecutiveOperationsSuiteMetadata } from "./executiveOperationsSuiteFoundation.ts";
import type { ExecutiveOperationsSuiteFoundationManifestDescriptor, ExecutiveOperationsSuitePlatformEntry, ExecutiveOperationsSuiteSection } from "./executiveOperationsSuiteFoundationTypes.ts";

const definitions = Object.freeze([
  ["OPS-1", "execution", "Executive Execution Platform", "ExecutiveOperationsPlatformPublicFoundation"],
  ["OPS-2", "task", "Executive Task Intelligence", "ExecutiveTaskIntelligencePlatformPublicFoundation"],
  ["OPS-3", "workflow", "Executive Workflow Intelligence", "ExecutiveWorkflowIntelligencePlatformPublicFoundation"],
  ["OPS-4", "project", "Executive Project Execution", "ExecutiveProjectExecutionPlatformPublicFoundation"],
  ["OPS-5", "resource", "Executive Resource Intelligence", "ExecutiveResourceIntelligencePlatformPublicFoundation"],
  ["OPS-6", "scheduling", "Executive Scheduling Intelligence", "ExecutiveSchedulingIntelligencePlatformPublicFoundation"],
  ["OPS-7", "monitoring", "Executive Monitoring Intelligence", "ExecutiveDependencyIntelligencePlatformPublicFoundation"],
  ["OPS-8", "automation", "Executive Automation Platform", "ExecutiveAutomationPlatformPublicFoundation"],
  ["OPS-9", "dashboard", "Executive Operations Dashboard", "ExecutiveExecutionMonitoringPlatformPublicFoundation"],
] as const);

const consumedPlatforms = Object.freeze(definitions.map(([phaseId, section, platformName, publicFoundationExport], dependencyOrder) => Object.freeze({
  phaseId, section, platformName, publicFoundationExport, dependencyOrder: dependencyOrder + 1, metadataOnly: true,
} as const satisfies ExecutiveOperationsSuitePlatformEntry)));

export const ExecutiveOperationsSuiteFoundationManifest = Object.freeze({
  manifestId: "ops-10-1-executive-operations-suite-foundation-manifest",
  manifestVersion: "1.0.0",
  consumedPlatforms,
  suiteComposition: Object.freeze(definitions.map(([, section]) => section) as ExecutiveOperationsSuiteSection[]),
  dependencyOrder: Object.freeze(definitions.map(([phaseId]) => phaseId)),
  publicFoundationInventory: Object.freeze(definitions.map(([, , , exportName]) => exportName)),
  platformCount: 9,
  architecturalBoundaries: Object.freeze([
    "Metadata-only aggregation", "Public APIs only", "No runtime execution",
    "No persistence or networking", "No framework or user-interface dependencies",
  ]),
  publicApiPolicy: Object.freeze({ publicIndicesOnly: true, stableExportsOnly: true, internalImportsAllowed: false, metadataOnly: true }),
  foundationNamespace: getExecutiveOperationsSuiteMetadata().namespace,
  foundationSections: Object.freeze(Object.keys(ExecutiveOperationsSuiteFoundation)),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveOperationsSuiteFoundationManifestDescriptor & Readonly<{ foundationNamespace: string; foundationSections: readonly string[] }>);

export const getExecutiveOperationsSuiteManifest = () => ExecutiveOperationsSuiteFoundationManifest;
