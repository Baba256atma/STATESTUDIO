/**
 * Pure fail-closed access policy for the EX-2 Tier-0 local preview route.
 *
 * Environment values are supplied by the server App Router page. This module
 * does not read browser state, persist data, fetch configuration, or emit
 * telemetry.
 */

export const ExecutiveJournalPreviewCanonicalPath =
  "/executive/journal-preview" as const;

export const ExecutiveJournalPreviewRouteFlagName =
  "EX2_TIER0_PREVIEW_ENABLED" as const;

export const ExecutiveJournalPreviewRouteEnabledValue = "true" as const;

export type ExecutiveJournalPreviewRouteAccess =
  | Readonly<{
      result: "Allowed";
      reason: "AuthorizedLocalEnvironmentAndExactFlag";
    }>
  | Readonly<{
      result: "Denied";
      reason: "UnauthorizedEnvironment" | "FlagNotExactlyEnabled";
    }>;

const AllowedAccess = Object.freeze({
  result: "Allowed" as const,
  reason: "AuthorizedLocalEnvironmentAndExactFlag" as const,
});

const DeniedEnvironmentAccess = Object.freeze({
  result: "Denied" as const,
  reason: "UnauthorizedEnvironment" as const,
});

const DeniedFlagAccess = Object.freeze({
  result: "Denied" as const,
  reason: "FlagNotExactlyEnabled" as const,
});

export const resolveExecutiveJournalPreviewRouteAccess = (
  environment: string | undefined,
  flagValue: string | undefined,
): ExecutiveJournalPreviewRouteAccess => {
  if (environment !== "development" && environment !== "test") {
    return DeniedEnvironmentAccess;
  }
  if (flagValue !== ExecutiveJournalPreviewRouteEnabledValue) {
    return DeniedFlagAccess;
  }
  return AllowedAccess;
};

