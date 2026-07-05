import { buildBusinessSuiteApiPolicyManifest, validateBusinessSuiteApiPolicy } from "./businessSuiteApiPolicyIndex.ts";
import { buildBusinessSuiteArchitectureManifest, validateBusinessSuiteArchitecture } from "./businessSuiteArchitectureIndex.ts";
import { buildBusinessSuiteBoundaryManifest, validateBusinessSuiteBoundary } from "./businessSuiteBoundaryIndex.ts";
import { buildBusinessSuiteDependencyManifest, validateBusinessSuiteDependencyMap } from "./businessSuiteDependencyIndex.ts";
import { buildBusinessSuiteRoadmapManifest, validateBusinessSuiteRoadmap } from "./businessSuiteRoadmapIndex.ts";
import { buildBusinessSuiteArchitectureFreezeManifest } from "./businessSuiteArchitectureFreezeManifest.ts";
import { BusinessSuiteArchitectureFreezeRegistry } from "./businessSuiteArchitectureFreezeRegistry.ts";
import type { BusinessArchitectureCertification } from "./businessSuiteArchitectureFreezeTypes.ts";

export function runBusinessSuiteArchitectureCertification(): BusinessArchitectureCertification {
  const diagnostics: string[] = [];
  const architectureManifest = buildBusinessSuiteArchitectureManifest();
  const boundaryManifest = buildBusinessSuiteBoundaryManifest();
  const dependencyManifest = buildBusinessSuiteDependencyManifest();
  const apiPolicyManifest = buildBusinessSuiteApiPolicyManifest();
  const roadmapManifest = buildBusinessSuiteRoadmapManifest();
  const freezeManifest = buildBusinessSuiteArchitectureFreezeManifest();
  const publicApis = new Set(BusinessSuiteArchitectureFreezeRegistry.publicApiRegistry);

  if (BusinessSuiteArchitectureFreezeRegistry.architectureIdentity.architectureId !== "BUS-ARCH") diagnostics.push("Architecture Identity");
  if (architectureManifest.platforms.length === 0) diagnostics.push("Platform Registry");
  if (boundaryManifest.platformBoundaryCatalog.length === 0) diagnostics.push("Boundary Registry");
  if (dependencyManifest.dependencyCatalog.length === 0) diagnostics.push("Dependency Registry");
  if (apiPolicyManifest.publicApiCatalog.length === 0) diagnostics.push("Public API Registry");
  if (roadmapManifest.milestoneCatalog.length === 0) diagnostics.push("Roadmap Registry");
  if (freezeManifest.compatibilityMatrix.length < 5) diagnostics.push("Compatibility Matrix");
  if (BusinessSuiteArchitectureFreezeRegistry.extensionPolicyRegistry.length === 0) diagnostics.push("Extension Policy");
  if (!validateBusinessSuiteArchitecture().valid) diagnostics.push("Manifest Integrity");
  if (!publicApis.has("buildBusinessSuiteArchitectureFreezeManifest")) diagnostics.push("Public API Integrity");
  if (!freezeManifest.metadata.immutable) diagnostics.push("Metadata Immutability");
  if (freezeManifest.deterministicFingerprint !== buildBusinessSuiteArchitectureFreezeManifest().deterministicFingerprint) {
    diagnostics.push("Deterministic Fingerprint");
  }
  if (!validateBusinessSuiteBoundary().valid || !validateBusinessSuiteDependencyMap().valid || !validateBusinessSuiteApiPolicy().valid || !validateBusinessSuiteRoadmap().valid) {
    diagnostics.push("Architecture Consistency");
  }

  return Object.freeze({
    certificationId: "bus-arch-certification",
    status: diagnostics.length === 0 ? "PASS" : "FAIL",
    gates: BusinessSuiteArchitectureFreezeRegistry.certificationMetadata.gates,
    diagnostics: Object.freeze(diagnostics),
    metadataOnly: true,
    immutable: true,
  });
}
