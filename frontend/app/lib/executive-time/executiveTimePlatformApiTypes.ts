/**
 * APP-1:8.5 — Executive Time Platform API types.
 * Public contract metadata — consumers must use Platform API only.
 */

import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";

export const EXECUTIVE_TIME_PLATFORM_VERSION = "APP-1/8.5" as const;

export const EXECUTIVE_TIME_PLATFORM_COMPATIBILITY_VERSION = "APP-1/8.5-compat" as const;

export const EXECUTIVE_TIME_PLATFORM_OWNER = "executive-time-platform" as const;

export type ExecutiveTimePlatformCapabilityKey =
  | "context"
  | "camera"
  | "state"
  | "transition"
  | "priority"
  | "events"
  | "prediction";

export type ExecutiveTimePlatformCapability = Readonly<{
  key: ExecutiveTimePlatformCapabilityKey;
  label: string;
  available: true;
  operations: readonly string[];
}>;

export type ExecutiveTimePlatformEngineVersions = Readonly<{
  foundation: string;
  context: string;
  camera: string;
  state: string;
  transition: string;
  priority: string;
  event: string;
  prediction: string;
  platform: typeof EXECUTIVE_TIME_PLATFORM_VERSION;
}>;

export type ExecutiveTimePlatformVersionMetadata = Readonly<{
  platformVersion: typeof EXECUTIVE_TIME_PLATFORM_VERSION;
  compatibilityVersion: typeof EXECUTIVE_TIME_PLATFORM_COMPATIBILITY_VERSION;
  engineVersions: ExecutiveTimePlatformEngineVersions;
  apiCapabilities: readonly ExecutiveTimePlatformCapabilityKey[];
  futureCapabilities: readonly string[];
  metadataOnly: true;
  owner: typeof EXECUTIVE_TIME_PLATFORM_OWNER;
}>;

export type ExecutiveTimePlatformFutureIntegration = Readonly<{
  moduleId: string;
  consumerOnly: boolean;
  integrationImplemented: false;
  mustUsePlatformApi: true;
}>;

export type ExecutiveTimePlatformFutureIntegrations = Readonly<{
  dashboard: ExecutiveTimePlatformFutureIntegration;
  assistant: ExecutiveTimePlatformFutureIntegration;
  timeline: ExecutiveTimePlatformFutureIntegration;
  executiveMemory: ExecutiveTimePlatformFutureIntegration;
  recommendation: ExecutiveTimePlatformFutureIntegration;
  scenario: ExecutiveTimePlatformFutureIntegration;
  audit: ExecutiveTimePlatformFutureIntegration;
  ds: ExecutiveTimePlatformFutureIntegration;
  int: ExecutiveTimePlatformFutureIntegration;
  app: ExecutiveTimePlatformFutureIntegration;
  lay: ExecutiveTimePlatformFutureIntegration;
}>;

export type ExecutiveTimePlatformConsumerContract = Readonly<{
  mustUsePlatformApi: true;
  directEngineAccessPermitted: false;
  permittedEntryPoint: "ExecutiveTimePlatform";
  forbiddenImports: readonly string[];
}>;

export type ExecutiveTimePlatformConsumerValidationResult = Readonly<{
  valid: boolean;
  bypassDetected: boolean;
  reason: string;
}>;

export type ExecutiveTimePlatformCertificationResult = Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  checks: readonly ExecutiveTimeCertificationCheck[];
  passedChecks: readonly ExecutiveTimeCertificationCheck[];
  failedChecks: readonly ExecutiveTimeCertificationCheck[];
  warnings: readonly string[];
  tags: readonly string[];
  summary: string;
  generatedAt: string;
}>;
