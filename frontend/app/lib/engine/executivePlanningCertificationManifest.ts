import {
  ExecutivePlanningFoundation,
  ExecutivePlanningOwnership,
} from "./executivePlanningIndex.ts";
import { ExecutivePlanningManifestPlatformId } from "./executivePlanningManifestIndex.ts";
import { ExecutivePlanningModelPlatformId } from "./executivePlanningModelIndex.ts";
import { ExecutivePlanningPlatformId } from "./executivePlanningPlatformIndex.ts";
import { ExecutivePlanningRegistryPlatformId } from "./executivePlanningRegistryIndex.ts";
import { ExecutivePlanningValidationPlatformId } from "./executivePlanningValidationIndex.ts";

export const ExecutivePlanningCertificationManifest = Object.freeze({
  id: "eng-5-certification-manifest",
  name: "Executive Planning Certification Manifest",
  description:
    "Immutable certification manifest describing certified ENG-5:1 through ENG-5:6 architectural surfaces.",
  certifiedComponents: Object.freeze([
    Object.freeze({
      phase: "ENG-5:1",
      component: "Foundation",
      reference: ExecutivePlanningFoundation.platformId,
      status: "Certified",
    } as const),
    Object.freeze({
      phase: "ENG-5:2",
      component: "Registry",
      reference: ExecutivePlanningRegistryPlatformId,
      status: "Certified",
    } as const),
    Object.freeze({
      phase: "ENG-5:3",
      component: "Model",
      reference: ExecutivePlanningModelPlatformId,
      status: "Certified",
    } as const),
    Object.freeze({
      phase: "ENG-5:4",
      component: "Validation",
      reference: ExecutivePlanningValidationPlatformId,
      status: "Certified",
    } as const),
    Object.freeze({
      phase: "ENG-5:5",
      component: "Manifest",
      reference: ExecutivePlanningManifestPlatformId,
      status: "Certified",
    } as const),
    Object.freeze({
      phase: "ENG-5:6",
      component: "Platform",
      reference: ExecutivePlanningPlatformId,
      status: "Certified",
    } as const),
  ] as const),
  certifiedRegistries: Object.freeze({
    platformId: ExecutivePlanningRegistryPlatformId,
    entryCount: 56,
    status: "Certified",
  } as const),
  certifiedModels: Object.freeze({
    platformId: ExecutivePlanningModelPlatformId,
    definitionCount: 38,
    status: "Certified",
  } as const),
  certifiedValidations: Object.freeze({
    platformId: ExecutivePlanningValidationPlatformId,
    ruleCount: 44,
    status: "Certified",
  } as const),
  certifiedManifests: Object.freeze({
    platformId: ExecutivePlanningManifestPlatformId,
    componentSectionCount: 4,
    status: "Certified",
  } as const),
  certifiedPlatform: Object.freeze({
    platformId: ExecutivePlanningPlatformId,
    sectionCount: 5,
    status: "Certified",
  } as const),
  ownershipVerification: Object.freeze({
    owner: ExecutivePlanningOwnership.owner,
    executionOwner: ExecutivePlanningOwnership.executionOwner,
    plansExecutionOnly: ExecutivePlanningOwnership.boundary.plansExecutionOnly,
    performsExecution: ExecutivePlanningOwnership.boundary.performsExecution,
    status: "Certified",
  } as const),
  dependencyVerification: Object.freeze({
    consumption: "PublicIndexOnly",
    direction: "ForwardOnly",
    futurePhaseImports: "Prohibited",
    status: "Certified",
  } as const),
  compatibilityVerification: Object.freeze({
    eng1: "PublicIndexCompatible",
    eng2: "PublicIndexCompatible",
    eng3: "PublicIndexCompatible",
    eng4: "PublicIndexCompatible",
    ops: "BoundaryDeclared",
    status: "Certified",
  } as const),
  owner: "ENG-5",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);
