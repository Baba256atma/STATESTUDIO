import { getExecutiveOperationsSuitePlatformMetadata, getExecutiveOperationsSuitePlatformSummary } from "./executiveOperationsSuitePlatformIndex.ts";
import { ExecutiveOperationsSuiteCertificationManifest } from "./executiveOperationsSuiteCertificationManifest.ts";
import { ExecutiveOperationsSuiteCertificationMetadata, ExecutiveOperationsSuiteCertificationRegistry } from "./executiveOperationsSuiteCertificationRegistry.ts";
import type { ExecutiveOperationsSuiteCertification as CertificationShape, ExecutiveOperationsSuiteCertificationSummary } from "./executiveOperationsSuiteCertificationTypes.ts";

const summary = Object.freeze({
  certificationStatus: "Ready",
  gateCount: ExecutiveOperationsSuiteCertificationRegistry.length,
  passedGateCount: ExecutiveOperationsSuiteCertificationRegistry.filter((gate) => gate.status === "Satisfied").length,
  readiness: "ReadyForCompatibilityAndRegression", releaseStage: "Draft",
  platformVersion: getExecutiveOperationsSuitePlatformMetadata().version,
  suiteVersion: getExecutiveOperationsSuitePlatformSummary().version,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveOperationsSuiteCertificationSummary);

export const ExecutiveOperationsSuiteCertification = Object.freeze({
  metadata: ExecutiveOperationsSuiteCertificationMetadata,
  registry: ExecutiveOperationsSuiteCertificationRegistry,
  manifest: ExecutiveOperationsSuiteCertificationManifest,
  summary,
} as const satisfies CertificationShape);

export const getExecutiveOperationsSuiteCertification = () => ExecutiveOperationsSuiteCertification;
export const getExecutiveOperationsSuiteCertificationRegistry = () => ExecutiveOperationsSuiteCertificationRegistry;
export const getExecutiveOperationsSuiteCertificationManifest = () => ExecutiveOperationsSuiteCertificationManifest;
export const getExecutiveOperationsSuiteCertificationSummary = () => summary;
export const getExecutiveOperationsSuiteCertificationMetadata = () => ExecutiveOperationsSuiteCertificationMetadata;
export const getExecutiveOperationsSuiteCertificationGateById = (id: string) => ExecutiveOperationsSuiteCertificationRegistry.find((gate) => gate.id === id);
