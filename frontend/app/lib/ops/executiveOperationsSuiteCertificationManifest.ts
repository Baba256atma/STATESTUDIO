import { getExecutiveOperationsSuitePlatformMetadata, getExecutiveOperationsSuitePlatformSummary } from "./executiveOperationsSuitePlatformIndex.ts";
import { ExecutiveOperationsSuiteCertificationMetadata, ExecutiveOperationsSuiteCertificationRegistry } from "./executiveOperationsSuiteCertificationRegistry.ts";
import type { ExecutiveOperationsSuiteCertificationManifest as ManifestShape } from "./executiveOperationsSuiteCertificationTypes.ts";

const passedGateCount = ExecutiveOperationsSuiteCertificationRegistry.filter((gate) => gate.status === "Satisfied").length;

export const ExecutiveOperationsSuiteCertificationManifest = Object.freeze({
  certificationMetadata: ExecutiveOperationsSuiteCertificationMetadata,
  certificationRegistry: ExecutiveOperationsSuiteCertificationRegistry,
  gateInventory: Object.freeze({ totalGates: ExecutiveOperationsSuiteCertificationRegistry.length,
    requiredGates: ExecutiveOperationsSuiteCertificationRegistry.filter((gate) => gate.required).length,
    satisfiedGates: passedGateCount,
    categories: Object.freeze([...new Set(ExecutiveOperationsSuiteCertificationRegistry.map((gate) => gate.category))]),
    metadataOnly: true }),
  readinessSummary: Object.freeze({ platformReadiness: getExecutiveOperationsSuitePlatformSummary().readiness,
    certificationReadiness: "Ready", allRequiredGatesDescribed: true, metadataOnly: true }),
  releaseSummary: Object.freeze({ releaseStage: "Draft", nextPhase: "OPS-10:7 Compatibility & Regression",
    platformVersion: getExecutiveOperationsSuitePlatformMetadata().version, metadataOnly: true }),
  certificationPolicy: Object.freeze({ descriptiveOnly: true, runtimeCertificationAllowed: false, gateEnforcementAllowed: false }),
  architecturalPolicy: Object.freeze({ metadataOnly: true, runtimeOperationsAllowed: false, certificationExecutionAllowed: false }),
  publicApiPolicy: Object.freeze({ publicPlatformIndexOnly: true, internalImportsAllowed: false, stableExportsOnly: true }),
  immutablePolicy: Object.freeze({ frozenRegistry: true, frozenGates: true, frozenManifest: true, readonlyResults: true }),
  deterministicPolicy: Object.freeze({ deterministicMetadata: true, exactGateLookup: true, aliasesAllowed: false }),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ManifestShape);
