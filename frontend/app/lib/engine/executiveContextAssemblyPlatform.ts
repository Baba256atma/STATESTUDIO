import { ExecutiveContextAssemblyFoundation } from "./executiveContextAssemblyFoundation.ts";
import {
  ExecutiveContextAssemblyDependencyManifest,
  ExecutiveContextAssemblyManifest,
} from "./executiveContextAssemblyManifest.ts";
import { ExecutiveContextAssemblyModel } from "./executiveContextAssemblyModel.ts";
import {
  ExecutiveContextAssemblyPlatformCompatibility,
  ExecutiveContextAssemblyPlatformOwnership,
} from "./executiveContextAssemblyPlatformCompatibility.ts";
import { ExecutiveContextAssemblyPlatformComponents } from "./executiveContextAssemblyPlatformComponents.ts";
import { ExecutiveContextAssemblyPlatformMetadata } from "./executiveContextAssemblyPlatformMetadata.ts";
import {
  ExecutiveContextAssemblyPlatformGuarantees,
  ExecutiveContextAssemblyPlatformReadiness,
} from "./executiveContextAssemblyPlatformReadiness.ts";
import { ExecutiveContextAssemblyRegistry } from "./executiveContextAssemblyRegistry.ts";
import { ExecutiveContextAssemblyValidation } from "./executiveContextAssemblyValidation.ts";
import type {
  ExecutiveContextAssemblyPlatformAggregate,
  ExecutiveContextPlatformCompatibilityEntry,
  ExecutiveContextPlatformComponent,
  ExecutiveContextPlatformInner,
  ExecutiveContextPlatformReadinessGate,
  ExecutiveContextPlatformSummary,
} from "./executiveContextAssemblyPlatformTypes.ts";

const platformSummary = Object.freeze({
  platformId: "ENG-4:6",
  phase: "ENG-4:6",
  namespace: "nexora.engine.executive.context-assembly.platform",
  owner: "ENG-4",
  sectionCount: 6,
  componentCount: 5,
  dependencyCount: ExecutiveContextAssemblyDependencyManifest.length,
  compatibilityCount: ExecutiveContextAssemblyPlatformCompatibility.length,
  guaranteeCount: ExecutiveContextAssemblyPlatformGuarantees.length,
  readinessGateCount: ExecutiveContextAssemblyPlatformReadiness.length,
  status: "ReadyForCertification",
  nextPhase: "ENG-4:7",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextPlatformSummary);

const platformSection = Object.freeze({
  metadata: ExecutiveContextAssemblyPlatformMetadata,
  components: ExecutiveContextAssemblyPlatformComponents,
  dependencies: ExecutiveContextAssemblyDependencyManifest,
  ownership: ExecutiveContextAssemblyPlatformOwnership,
  compatibility: ExecutiveContextAssemblyPlatformCompatibility,
  guarantees: ExecutiveContextAssemblyPlatformGuarantees,
  readiness: ExecutiveContextAssemblyPlatformReadiness,
  summary: platformSummary,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextPlatformInner);

export const ExecutiveContextAssemblyPlatform = Object.freeze({
  foundation: ExecutiveContextAssemblyFoundation,
  registry: ExecutiveContextAssemblyRegistry,
  model: ExecutiveContextAssemblyModel,
  validation: ExecutiveContextAssemblyValidation,
  manifest: ExecutiveContextAssemblyManifest,
  platform: platformSection,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextAssemblyPlatformAggregate);

const componentIndex = Object.freeze(
  Object.fromEntries(ExecutiveContextAssemblyPlatformComponents.map((component) => [component.componentId, component])) as Readonly<
    Record<string, ExecutiveContextPlatformComponent | undefined>
  >,
);
const readinessIndex = Object.freeze(
  Object.fromEntries(ExecutiveContextAssemblyPlatformReadiness.map((gate) => [gate.id, gate])) as Readonly<
    Record<string, ExecutiveContextPlatformReadinessGate | undefined>
  >,
);
const compatibilityIndex = Object.freeze(
  Object.fromEntries(ExecutiveContextAssemblyPlatformCompatibility.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutiveContextPlatformCompatibilityEntry | undefined>
  >,
);

export { ExecutiveContextAssemblyPlatformCompatibility } from "./executiveContextAssemblyPlatformCompatibility.ts";
export { ExecutiveContextAssemblyPlatformComponents } from "./executiveContextAssemblyPlatformComponents.ts";
export { ExecutiveContextAssemblyPlatformMetadata } from "./executiveContextAssemblyPlatformMetadata.ts";
export {
  ExecutiveContextAssemblyPlatformGuarantees,
  ExecutiveContextAssemblyPlatformReadiness,
} from "./executiveContextAssemblyPlatformReadiness.ts";

export const getExecutiveContextAssemblyPlatform = () => ExecutiveContextAssemblyPlatform;
export const getExecutiveContextAssemblyPlatformMetadata = () => ExecutiveContextAssemblyPlatformMetadata;
export const getExecutiveContextAssemblyPlatformComponents = () => ExecutiveContextAssemblyPlatformComponents;
export const getExecutiveContextAssemblyPlatformCompatibility = () => ExecutiveContextAssemblyPlatformCompatibility;
export const getExecutiveContextAssemblyPlatformReadiness = () => ExecutiveContextAssemblyPlatformReadiness;
export const getExecutiveContextAssemblyPlatformSummary = () => platformSummary;

export const getExecutiveContextAssemblyPlatformComponentById = (
  id: string,
): ExecutiveContextPlatformComponent | undefined => componentIndex[id];
export const getExecutiveContextAssemblyPlatformReadinessGateById = (
  id: string,
): ExecutiveContextPlatformReadinessGate | undefined => readinessIndex[id];
export const getExecutiveContextAssemblyPlatformCompatibilityById = (
  id: string,
): ExecutiveContextPlatformCompatibilityEntry | undefined => compatibilityIndex[id];
