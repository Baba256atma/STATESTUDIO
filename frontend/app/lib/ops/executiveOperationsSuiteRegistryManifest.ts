import { ExecutiveOperationsSuiteFoundation } from "./executiveOperationsSuiteFoundationIndex.ts";
import { ExecutiveOperationsSuitePhaseRegistry } from "./executiveOperationsSuitePhaseRegistry.ts";
import { ExecutiveOperationsSuitePlatformRegistry, ExecutiveOperationsSuiteRegistryMetadata } from "./executiveOperationsSuitePlatformRegistry.ts";
import type { ExecutiveOperationsSuiteFoundationSection, ExecutiveOperationsSuitePhaseId, ExecutiveOperationsSuitePlatformId, ExecutiveOperationsSuiteRegistryManifest as ManifestShape } from "./executiveOperationsSuiteRegistryTypes.ts";

const platformToPhaseOwnershipMap = Object.freeze(Object.fromEntries(ExecutiveOperationsSuitePlatformRegistry.map((entry) => [entry.platformId, entry.phaseId])) as Record<ExecutiveOperationsSuitePlatformId, ExecutiveOperationsSuitePhaseId>);
const foundationSectionMap = Object.freeze(Object.fromEntries(ExecutiveOperationsSuitePlatformRegistry.map((entry) => [entry.platformId, entry.foundationSection])) as Record<ExecutiveOperationsSuitePlatformId, ExecutiveOperationsSuiteFoundationSection>);

export const ExecutiveOperationsSuiteRegistryManifest = Object.freeze({
  registryMetadata: ExecutiveOperationsSuiteRegistryMetadata,
  platformRegistryInventory: ExecutiveOperationsSuitePlatformRegistry,
  phaseRegistryInventory: ExecutiveOperationsSuitePhaseRegistry,
  platformCount: 9, phaseCount: 9,
  canonicalPlatformOrder: Object.freeze(ExecutiveOperationsSuitePlatformRegistry.map((entry) => entry.platformId)),
  canonicalPhaseOrder: Object.freeze(ExecutiveOperationsSuitePhaseRegistry.map((entry) => entry.phaseId)),
  platformToPhaseOwnershipMap, foundationSectionMap,
  publicApiPolicy: Object.freeze({ foundationPublicIndexOnly: true, stableExportsOnly: true, mutationApisAllowed: false, metadataOnly: true }),
  architecturalBoundaries: Object.freeze(["Descriptive metadata only", "No registry mutation", "No operational runtime", "No persistence, networking, or user interface"]),
  duplicateRegistrationPolicy: "RejectDuplicates", registryStabilityState: "Stable",
  registeredFoundationSections: Object.freeze(Object.keys(ExecutiveOperationsSuiteFoundation)),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ManifestShape & Readonly<{ registeredFoundationSections: readonly string[] }>);

export const getExecutiveOperationsSuiteRegistryManifest = () => ExecutiveOperationsSuiteRegistryManifest;
