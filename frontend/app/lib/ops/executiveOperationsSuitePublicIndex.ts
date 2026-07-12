import { ExecutiveOperationsSuiteFreeze, ExecutiveOperationsSuiteFreezeMetadata, getExecutiveOperationsSuiteFreezeEntryById, getExecutiveOperationsSuiteFreezeSummary } from "./executiveOperationsSuiteFreezeIndex.ts";

export const ExecutiveOperationsSuitePublicIndexId = "OPS-10:9" as const;
export const ExecutiveOperationsSuitePublicIndexName = "Executive Operations Suite Public Index" as const;
export const ExecutiveOperationsSuitePublicIndexDescription = "Final canonical metadata-only public release surface for the Executive Operations Suite." as const;
export const ExecutiveOperationsSuitePublicIndexVersion = "1.0.0" as const;
export const ExecutiveOperationsSuitePublicIndexNamespace = "nexora.ops.public" as const;
export const ExecutiveOperationsSuitePublicIndexStatus = Object.freeze({
  releaseStatus: "Released", freezeStatus: "Frozen", metadataOnly: true,
  immutable: true, deterministic: true, publicApiStable: true,
} as const);

const releaseReference = (section: string, lockId: string) => Object.freeze({
  section,
  lock: getExecutiveOperationsSuiteFreezeEntryById(lockId),
  releaseStatus: ExecutiveOperationsSuitePublicIndexStatus.releaseStatus,
  publicApiStable: true,
  metadataOnly: true,
} as const);

const publicMetadata = Object.freeze({
  id: ExecutiveOperationsSuitePublicIndexId,
  name: ExecutiveOperationsSuitePublicIndexName,
  description: ExecutiveOperationsSuitePublicIndexDescription,
  version: ExecutiveOperationsSuitePublicIndexVersion,
  namespace: ExecutiveOperationsSuitePublicIndexNamespace,
  status: ExecutiveOperationsSuitePublicIndexStatus,
  sourceFreezeId: ExecutiveOperationsSuiteFreezeMetadata.id,
  sourceFreezeNamespace: ExecutiveOperationsSuiteFreezeMetadata.namespace,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

const publicApiEntry = (exportName: string, category: "Namespace" | "Registry" | "Metadata" | "Helper") => Object.freeze({
  exportName, sourcePhase: "OPS-10:9", category,
  status: "Released", publicStability: "Stable", metadataOnly: true,
} as const);

export const ExecutiveOperationsSuitePublicApiRegistry = Object.freeze([
  publicApiEntry("ExecutiveOperationsSuitePublicFoundation", "Namespace"),
  publicApiEntry("ExecutiveOperationsSuitePublicApiRegistry", "Registry"),
  publicApiEntry("ExecutiveOperationsSuitePublicIndexId", "Metadata"),
  publicApiEntry("ExecutiveOperationsSuitePublicIndexName", "Metadata"),
  publicApiEntry("ExecutiveOperationsSuitePublicIndexDescription", "Metadata"),
  publicApiEntry("ExecutiveOperationsSuitePublicIndexVersion", "Metadata"),
  publicApiEntry("ExecutiveOperationsSuitePublicIndexNamespace", "Metadata"),
  publicApiEntry("ExecutiveOperationsSuitePublicIndexStatus", "Metadata"),
  publicApiEntry("getExecutiveOperationsSuitePublicFoundation", "Helper"),
  publicApiEntry("getExecutiveOperationsSuitePublicMetadata", "Helper"),
  publicApiEntry("getExecutiveOperationsSuitePublicApiRegistry", "Helper"),
  publicApiEntry("getExecutiveOperationsSuiteReleaseSummary", "Helper"),
] as const);

const freezeSummary = getExecutiveOperationsSuiteFreezeSummary();
const releaseSummary = Object.freeze({
  suiteName: "Executive Operations Suite",
  version: freezeSummary.suiteVersion,
  releaseState: "Released",
  certificationState: getExecutiveOperationsSuiteFreezeEntryById("suite-freeze-certification")?.status,
  compatibilityState: ExecutiveOperationsSuiteFreeze.manifest.compatibilitySnapshot.status,
  freezeState: freezeSummary.freezeStatus,
  platformCount: 9,
  phaseCount: 9,
  publicApiCount: ExecutiveOperationsSuitePublicApiRegistry.length,
  namespace: ExecutiveOperationsSuitePublicIndexNamespace,
  releaseReadiness: freezeSummary.readiness,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

const publicIndex = Object.freeze({
  metadata: publicMetadata,
  registry: ExecutiveOperationsSuitePublicApiRegistry,
  releaseSummary,
  status: ExecutiveOperationsSuitePublicIndexStatus,
} as const);

export const ExecutiveOperationsSuitePublicFoundation = Object.freeze({
  foundation: releaseReference("foundation", "suite-freeze-foundation"),
  registry: releaseReference("registry", "suite-freeze-registry"),
  validation: releaseReference("validation", "suite-freeze-validation"),
  manifest: releaseReference("manifest", "suite-freeze-manifest"),
  platform: releaseReference("platform", "suite-freeze-platform"),
  certification: releaseReference("certification", "suite-freeze-certification"),
  compatibility: releaseReference("compatibility", "suite-freeze-compatibility"),
  freeze: ExecutiveOperationsSuiteFreeze,
  publicIndex,
} as const);

export const getExecutiveOperationsSuitePublicFoundation = () => ExecutiveOperationsSuitePublicFoundation;
export const getExecutiveOperationsSuitePublicMetadata = () => publicMetadata;
export const getExecutiveOperationsSuitePublicApiRegistry = () => ExecutiveOperationsSuitePublicApiRegistry;
export const getExecutiveOperationsSuiteReleaseSummary = () => releaseSummary;
