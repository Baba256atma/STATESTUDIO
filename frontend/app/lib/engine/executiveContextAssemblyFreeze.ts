import { ExecutiveContextAssemblyCertification } from "./executiveContextAssemblyCertification.ts";
import { ExecutiveContextAssemblyFreezeCompatibility } from "./executiveContextAssemblyFreezeCompatibility.ts";
import { ExecutiveContextAssemblyFreezeDependencies } from "./executiveContextAssemblyFreezeDependencies.ts";
import { ExecutiveContextAssemblyFreezeExtensions } from "./executiveContextAssemblyFreezeExtensions.ts";
import { ExecutiveContextAssemblyFreezeMetadata } from "./executiveContextAssemblyFreezeMetadata.ts";
import { ExecutiveContextAssemblyFreezeRegistry } from "./executiveContextAssemblyFreezeRegistry.ts";
import type {
  ExecutiveContextAssemblyFreezeAggregate,
  ExecutiveContextFreezeCompatibilityEntry,
  ExecutiveContextFreezeEntry,
  ExecutiveContextFreezeExtensionPoint,
  ExecutiveContextFreezeGuarantee,
  ExecutiveContextFreezeLock,
  ExecutiveContextFreezeResult,
  ExecutiveContextFreezeSummary,
} from "./executiveContextAssemblyFreezeTypes.ts";

const guarantee = (key: string, name: string) => Object.freeze({
  id: `eng-4-freeze-guarantee-${key}`,
  guarantee: name,
  status: "Locked",
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextFreezeGuarantee);

const guarantees = Object.freeze([
  guarantee("foundation-frozen", "Foundation Frozen"),
  guarantee("registry-frozen", "Registry Frozen"),
  guarantee("model-frozen", "Model Frozen"),
  guarantee("validation-frozen", "Validation Frozen"),
  guarantee("manifest-frozen", "Manifest Frozen"),
  guarantee("platform-frozen", "Platform Frozen"),
  guarantee("certification-frozen", "Certification Frozen"),
  guarantee("metadata-only", "Metadata Only"),
  guarantee("runtime-free", "Runtime Free"),
  guarantee("immutable", "Immutable"),
  guarantee("deterministic", "Deterministic"),
  guarantee("ownership-protected", "Ownership Protected"),
  guarantee("anti-duplication-protected", "Anti-Duplication Protected"),
  guarantee("public-api-stable", "Public API Stable"),
  guarantee("namespace-stable", "Namespace Stable"),
  guarantee("dependency-boundaries-locked", "Dependency Boundaries Locked"),
  guarantee("eng-1-compatibility-preserved", "ENG-1 Compatibility Preserved"),
  guarantee("regression-safety-preserved", "Regression Safety Preserved"),
  guarantee("no-internal-surface-leakage", "No Internal Surface Leakage"),
  guarantee("no-future-phase-implementation", "No Future-Phase Implementation"),
  guarantee("extension-boundaries-protected", "Extension Boundaries Protected"),
  guarantee("ready-for-public-index", "Ready for Public Index"),
] as const);

const lock = Object.freeze({
  lockIdentifier: "ENG-4-LOCKED",
  certificationState: "Certified",
  freezeState: "Frozen",
  ownershipProtectionState: "Protected",
  antiDuplicationState: "Protected",
  publicApiStabilityState: "Stable",
  namespaceStabilityState: "Stable",
  dependencyBoundaryState: "Locked",
  releaseReadiness: "ReadyForPublicIndex",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextFreezeLock);

const result = Object.freeze({
  status: "Frozen",
  description: "ENG-4:1 through ENG-4:7 are frozen under ENG-4-LOCKED and ready for the public index.",
  lockIdentifier: "ENG-4-LOCKED",
  certificationState: "Certified",
  releaseReadiness: "ReadyForPublicIndex",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextFreezeResult);

const summary = Object.freeze({
  freezeId: "ENG-4:8",
  phase: "ENG-4:8",
  namespace: "nexora.engine.executive.context-assembly.freeze",
  owner: "ENG-4",
  lockIdentifier: "ENG-4-LOCKED",
  frozenComponentCount: 7,
  compatibilityCount: ExecutiveContextAssemblyFreezeCompatibility.length,
  dependencyCount: ExecutiveContextAssemblyFreezeDependencies.length,
  extensionCount: ExecutiveContextAssemblyFreezeExtensions.length,
  guaranteeCount: guarantees.length,
  freezeResult: "Frozen",
  certificationResult: "Certified",
  releaseReadiness: "ReadyForPublicIndex",
  nextPhase: "ENG-4:9",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextFreezeSummary);

export const ExecutiveContextAssemblyFreeze = Object.freeze({
  metadata: ExecutiveContextAssemblyFreezeMetadata,
  certification: ExecutiveContextAssemblyCertification,
  registry: ExecutiveContextAssemblyFreezeRegistry,
  dependencies: ExecutiveContextAssemblyFreezeDependencies,
  compatibility: ExecutiveContextAssemblyFreezeCompatibility,
  extensions: ExecutiveContextAssemblyFreezeExtensions,
  guarantees,
  lock,
  result,
  summary,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextAssemblyFreezeAggregate);

const entryIndex = Object.freeze(
  Object.fromEntries(ExecutiveContextAssemblyFreezeRegistry.map((entry) => [entry.freezeEntryId, entry])) as Readonly<
    Record<string, ExecutiveContextFreezeEntry | undefined>
  >,
);
const compatibilityIndex = Object.freeze(
  Object.fromEntries(ExecutiveContextAssemblyFreezeCompatibility.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutiveContextFreezeCompatibilityEntry | undefined>
  >,
);
const extensionIndex = Object.freeze(
  Object.fromEntries(ExecutiveContextAssemblyFreezeExtensions.map((entry) => [entry.extensionId, entry])) as Readonly<
    Record<string, ExecutiveContextFreezeExtensionPoint | undefined>
  >,
);

export { ExecutiveContextAssemblyFreezeCompatibility } from "./executiveContextAssemblyFreezeCompatibility.ts";
export {
  ExecutiveContextAssemblyFreezeDependencies,
  ExecutiveContextAssemblyFreezeDependencyLock,
} from "./executiveContextAssemblyFreezeDependencies.ts";
export { ExecutiveContextAssemblyFreezeExtensions } from "./executiveContextAssemblyFreezeExtensions.ts";
export { ExecutiveContextAssemblyFreezeMetadata } from "./executiveContextAssemblyFreezeMetadata.ts";
export { ExecutiveContextAssemblyFreezeRegistry } from "./executiveContextAssemblyFreezeRegistry.ts";

export const getExecutiveContextAssemblyFreeze = () => ExecutiveContextAssemblyFreeze;
export const getExecutiveContextAssemblyFreezeMetadata = () => ExecutiveContextAssemblyFreezeMetadata;
export const getExecutiveContextAssemblyFreezeRegistry = () => ExecutiveContextAssemblyFreezeRegistry;
export const getExecutiveContextAssemblyFreezeDependencies = () => ExecutiveContextAssemblyFreezeDependencies;
export const getExecutiveContextAssemblyFreezeCompatibility = () => ExecutiveContextAssemblyFreezeCompatibility;
export const getExecutiveContextAssemblyFreezeExtensions = () => ExecutiveContextAssemblyFreezeExtensions;
export const getExecutiveContextAssemblyFreezeSummary = () => summary;

export const getExecutiveContextAssemblyFreezeEntryById = (
  id: string,
): ExecutiveContextFreezeEntry | undefined => entryIndex[id];
export const getExecutiveContextAssemblyFreezeCompatibilityById = (
  id: string,
): ExecutiveContextFreezeCompatibilityEntry | undefined => compatibilityIndex[id];
export const getExecutiveContextAssemblyFreezeExtensionById = (
  id: string,
): ExecutiveContextFreezeExtensionPoint | undefined => extensionIndex[id];
