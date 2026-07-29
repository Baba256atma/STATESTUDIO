/**
 * RTC-1:6 — Executive Context Platform Services.
 *
 * Eight canonical Platform services. Each service exposes contracts only.
 *
 * Ownership: owned exclusively by RTC-1:6.
 */

/** Canonical platform service name. */
export type ExecutiveContextPlatformServiceName =
  | "ExecutiveContextService"
  | "ExecutiveContextRegistryService"
  | "ExecutiveContextLifecycleService"
  | "ExecutiveContextSnapshotService"
  | "ExecutiveContextEventService"
  | "ExecutiveContextMetadataService"
  | "ExecutiveContextInspectionService"
  | "ExecutiveContextPlatformService";

/** Platform service contract declaration. */
export interface ExecutiveContextPlatformServiceDeclaration {
  readonly serviceId: `RTC-1:6/Service/${ExecutiveContextPlatformServiceName}`;
  readonly serviceName: ExecutiveContextPlatformServiceName;
  readonly description: string;
  readonly contractsOnly: true;
  readonly consumerMayMutateContext: false;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const service = (
  serviceName: ExecutiveContextPlatformServiceName,
  description: string,
  order: number,
): ExecutiveContextPlatformServiceDeclaration =>
  Object.freeze({
    serviceId: `RTC-1:6/Service/${serviceName}` as const,
    serviceName,
    description,
    contractsOnly: true as const,
    consumerMayMutateContext: false as const,
    order,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly eight canonical Platform services. */
export const ExecutiveContextPlatformServices = Object.freeze([
  service(
    "ExecutiveContextService",
    "Controlled access to the active Executive Context.",
    1,
  ),
  service(
    "ExecutiveContextRegistryService",
    "Contract access to Runtime Registry identities.",
    2,
  ),
  service(
    "ExecutiveContextLifecycleService",
    "Lifecycle operation contracts for Initialize through Inspect.",
    3,
  ),
  service(
    "ExecutiveContextSnapshotService",
    "Snapshot identity and registration contracts.",
    4,
  ),
  service(
    "ExecutiveContextEventService",
    "Runtime event publication contracts.",
    5,
  ),
  service(
    "ExecutiveContextMetadataService",
    "Immutable Runtime metadata publication contracts.",
    6,
  ),
  service(
    "ExecutiveContextInspectionService",
    "Read-only Runtime diagnostics contracts.",
    7,
  ),
  service(
    "ExecutiveContextPlatformService",
    "Platform entry-point and orchestration contracts.",
    8,
  ),
] as const);

export const ExecutiveContextPlatformServiceNames = Object.freeze([
  "ExecutiveContextService",
  "ExecutiveContextRegistryService",
  "ExecutiveContextLifecycleService",
  "ExecutiveContextSnapshotService",
  "ExecutiveContextEventService",
  "ExecutiveContextMetadataService",
  "ExecutiveContextInspectionService",
  "ExecutiveContextPlatformService",
] as const satisfies readonly ExecutiveContextPlatformServiceName[]);

/** Context access model — consumers never mutate Context directly. */
export const ExecutiveContextPlatformAccessModel = Object.freeze({
  accessModelId: "RTC-1:6/ContextAccessModel",
  operations: Object.freeze([
    "Read",
    "Snapshot",
    "Inspect",
    "Replace",
  ] as const),
  consumersMutateContextDirectly: false as const,
  platformOwnsReplacement: true as const,
  metadataOnly: true as const,
  immutable: true as const,
} as const);
