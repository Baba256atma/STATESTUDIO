/**
 * EX-1:6 — Executive Stage Platform Services.
 *
 * Eight canonical Platform services. Each service exposes contracts only.
 *
 * Ownership: owned exclusively by EX-1:6.
 */

/** Canonical platform service name. */
export type ExecutiveStagePlatformServiceName =
  | "ExecutiveStagePlatformService"
  | "StageLifecycleService"
  | "RuntimeBridgeService"
  | "StageRenderingService"
  | "StageInteractionService"
  | "StageInspectionService"
  | "PlatformMetadataService"
  | "PlatformHealthService";

/** Platform service contract declaration. */
export interface ExecutiveStagePlatformServiceDeclaration {
  readonly serviceId: `EX-1:6/Service/${ExecutiveStagePlatformServiceName}`;
  readonly serviceName: ExecutiveStagePlatformServiceName;
  readonly description: string;
  readonly contractsOnly: true;
  readonly ownsRuntimeState: false;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const service = (
  serviceName: ExecutiveStagePlatformServiceName,
  description: string,
  order: number,
): ExecutiveStagePlatformServiceDeclaration =>
  Object.freeze({
    serviceId: `EX-1:6/Service/${serviceName}` as const,
    serviceName,
    description,
    contractsOnly: true as const,
    ownsRuntimeState: false as const,
    order,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly eight canonical Platform services. */
export const ExecutiveStagePlatformServices = Object.freeze([
  service(
    "ExecutiveStagePlatformService",
    "Platform entry-point and Stage orchestration contracts.",
    1,
  ),
  service(
    "StageLifecycleService",
    "Stage lifecycle operation contracts.",
    2,
  ),
  service(
    "RuntimeBridgeService",
    "Runtime Bridge synchronisation contracts.",
    3,
  ),
  service(
    "StageRenderingService",
    "Stage rendering coordinator contracts.",
    4,
  ),
  service(
    "StageInteractionService",
    "Stage interaction coordinator contracts.",
    5,
  ),
  service(
    "StageInspectionService",
    "Read-only Stage diagnostics contracts.",
    6,
  ),
  service(
    "PlatformMetadataService",
    "Immutable Platform metadata publication contracts.",
    7,
  ),
  service(
    "PlatformHealthService",
    "Platform health evaluation contracts.",
    8,
  ),
] as const);

export const ExecutiveStagePlatformServiceNames = Object.freeze([
  "ExecutiveStagePlatformService",
  "StageLifecycleService",
  "RuntimeBridgeService",
  "StageRenderingService",
  "StageInteractionService",
  "StageInspectionService",
  "PlatformMetadataService",
  "PlatformHealthService",
] as const satisfies readonly ExecutiveStagePlatformServiceName[]);

/** Platform service catalogue. */
export const ExecutiveStagePlatformServiceCatalog = Object.freeze({
  catalogId: "EX-1:6/ServiceCatalog",
  services: ExecutiveStagePlatformServices,
  serviceCount: ExecutiveStagePlatformServices.length,
  contractsOnly: true as const,
  ownsRuntimeState: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
