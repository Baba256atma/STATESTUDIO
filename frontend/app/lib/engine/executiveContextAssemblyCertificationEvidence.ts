import { ExecutiveContextAssemblyFoundation } from "./executiveContextAssemblyFoundation.ts";
import { ExecutiveContextAssemblyManifest } from "./executiveContextAssemblyManifest.ts";
import { ExecutiveContextAssemblyModel } from "./executiveContextAssemblyModel.ts";
import { ExecutiveContextAssemblyPlatform } from "./executiveContextAssemblyPlatform.ts";
import { ExecutiveContextAssemblyRegistry } from "./executiveContextAssemblyRegistry.ts";
import { ExecutiveContextAssemblyValidation } from "./executiveContextAssemblyValidation.ts";
import type { ExecutiveContextCertificationEvidence } from "./executiveContextAssemblyCertificationTypes.ts";

const evidence = (
  evidenceId: string,
  category: string,
  description: string,
  publicSurface: string,
  declaredCount?: number,
  artifactReference?: object,
) => Object.freeze({
  evidenceId, category, description, publicSurface,
  ...(declaredCount === undefined ? {} : { declaredCount }),
  ...(artifactReference === undefined ? {} : { artifactReference }),
  metadataOnly: true, immutable: true, inspectionProhibited: true,
} as const satisfies ExecutiveContextCertificationEvidence);

export const ExecutiveContextAssemblyCertificationEvidence = Object.freeze([
  evidence("eng-4-cert-evidence-foundation", "Foundation Evidence", "Approved Foundation public metadata.", "executiveContextAssemblyFoundation.ts", ExecutiveContextAssemblyFoundation.contracts.length, ExecutiveContextAssemblyFoundation),
  evidence("eng-4-cert-evidence-registry", "Registry Evidence", "Approved Registry public metadata and inventory counts.", "executiveContextAssemblyRegistry.ts", ExecutiveContextAssemblyRegistry.domains.entries.length, ExecutiveContextAssemblyRegistry),
  evidence("eng-4-cert-evidence-model", "Model Evidence", "Approved Model public metadata and model registry.", "executiveContextAssemblyModel.ts", ExecutiveContextAssemblyModel.modelRegistry.length, ExecutiveContextAssemblyModel),
  evidence("eng-4-cert-evidence-validation", "Validation Evidence", "Approved Validation groups, rules, and gates.", "executiveContextAssemblyValidation.ts", ExecutiveContextAssemblyValidation.validationRules.length, ExecutiveContextAssemblyValidation),
  evidence("eng-4-cert-evidence-manifest", "Manifest Evidence", "Approved Manifest inventories and readiness.", "executiveContextAssemblyManifest.ts", ExecutiveContextAssemblyManifest.inventories.contextDomains, ExecutiveContextAssemblyManifest),
  evidence("eng-4-cert-evidence-platform", "Platform Evidence", "Approved Platform aggregate with six sections and five components.", "executiveContextAssemblyPlatform.ts", ExecutiveContextAssemblyPlatform.platform.components.length, ExecutiveContextAssemblyPlatform),
  evidence("eng-4-cert-evidence-ownership", "Ownership Evidence", "Approved ownership metadata declaring ENG-4 specialized ownership.", "executiveContextAssemblyPlatform.ts", ExecutiveContextAssemblyPlatform.platform.ownership.length, ExecutiveContextAssemblyPlatform.platform.ownership),
  evidence("eng-4-cert-evidence-dependency", "Dependency Evidence", "Approved forward-only public-index dependency metadata.", "executiveContextAssemblyManifest.ts", ExecutiveContextAssemblyManifest.dependencies.length, ExecutiveContextAssemblyManifest.dependencies),
  evidence("eng-4-cert-evidence-compatibility", "Compatibility Evidence", "Approved compatibility classifications including ENG-1 relocation.", "executiveContextAssemblyPlatform.ts", ExecutiveContextAssemblyPlatform.platform.compatibility.length, ExecutiveContextAssemblyPlatform.platform.compatibility),
  evidence("eng-4-cert-evidence-regression", "Regression Evidence", "Approved regression declarations for ENG-4:1–6 and ENG-1 surfaces.", "executiveContextAssemblyCertificationRegression.ts"),
  evidence("eng-4-cert-evidence-public-api", "Public API Evidence", "Approved public helper inventories from prior phases.", "executiveContextAssemblyManifest.ts", ExecutiveContextAssemblyManifest.publicApis.length, ExecutiveContextAssemblyManifest.publicApis),
  evidence("eng-4-cert-evidence-runtime-boundary", "Runtime Boundary Evidence", "Approved metadata-only and runtime-free boundary declarations.", "executiveContextAssemblyPlatform.ts", undefined, ExecutiveContextAssemblyPlatform.platform.guarantees),
] as const);
