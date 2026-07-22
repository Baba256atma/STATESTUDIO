import { DirectorBoundaries } from "./directorBoundaries.ts";
import { DirectorCapabilities } from "./directorCapabilities.ts";
import { DirectorContractNames, DirectorContracts } from "./directorContracts.ts";
import { DirectorLifecycle } from "./directorLifecycle.ts";
import { DirectorOwnership } from "./directorOwnership.ts";

export const DirectorFoundationId = "DIRECTOR-1:1/DirectorFoundation" as const;
export const DirectorFoundationVersion = "1.0.0" as const;
export const DirectorFoundationNamespace = "nexora.director.foundation" as const;
export const DirectorFoundationLayer = "Director" as const;
export const DirectorFoundationStatus = "Foundation" as const;
export const DirectorFoundationReadiness = "ReadyForRegistry" as const;

/** The complete public Director-1:1 surface. It is descriptive and has no executor. */
export const DirectorFoundation = Object.freeze({
  identity: Object.freeze({
    id: DirectorFoundationId,
    version: DirectorFoundationVersion,
    namespace: DirectorFoundationNamespace,
    layer: DirectorFoundationLayer,
    status: DirectorFoundationStatus,
    readiness: DirectorFoundationReadiness,
  }),
  contracts: DirectorContracts,
  contractNames: DirectorContractNames,
  lifecycle: DirectorLifecycle,
  ownership: DirectorOwnership,
  boundaries: DirectorBoundaries,
  capabilities: DirectorCapabilities,
  runtimeServices: false,
  factories: false,
  execution: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

