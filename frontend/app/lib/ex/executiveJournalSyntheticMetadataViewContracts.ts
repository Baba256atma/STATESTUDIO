/**
 * EX-2 Tier-0 Synthetic Metadata — read-only view contracts.
 *
 * Pure state translation only. No React, JSX, routes, or mutation controls.
 * Authorized by EX2-AUTH-T0-2026-07-26-01.
 */

import type { ExecutiveJournalSyntheticAdapterOutcome } from "./executiveJournalSyntheticMetadataTypes.ts";
import type {
  ExecutiveJournalSyntheticMetadataProjection,
  ExecutiveJournalSyntheticNonProductionMarker,
  ExecutiveJournalSyntheticProviderGetResult,
  ExecutiveJournalSyntheticProviderListResult,
  ExecutiveJournalSyntheticViewContract,
} from "./executiveJournalSyntheticMetadataTypes.ts";

export const ExecutiveJournalSyntheticNonProductionMarkerValue: ExecutiveJournalSyntheticNonProductionMarker =
  Object.freeze({
    classification: "Synthetic" as const,
    tier: "Tier0" as const,
    environment: "NonProduction" as const,
    label: "Synthetic / Tier 0 / Non-production" as const,
  });

const withMarker = <T extends { readonly state: string }>(
  contract: T,
): T & { readonly marker: ExecutiveJournalSyntheticNonProductionMarker } =>
  Object.freeze({
    ...contract,
    marker: ExecutiveJournalSyntheticNonProductionMarkerValue,
  }) as T & { readonly marker: ExecutiveJournalSyntheticNonProductionMarker };

export const createExecutiveJournalSyntheticLoadingView =
  (): ExecutiveJournalSyntheticViewContract =>
    withMarker({ state: "Loading" as const });

export const createExecutiveJournalSyntheticReadyView = (
  projections: readonly ExecutiveJournalSyntheticMetadataProjection[],
): ExecutiveJournalSyntheticViewContract =>
  withMarker({
    state: "Ready" as const,
    projections: Object.freeze([...projections]),
    displayOrder: Object.freeze(projections.map((item) => item.entry_ref)),
  });

export const mapProviderListResultToViewContract = (
  result: ExecutiveJournalSyntheticProviderListResult,
): ExecutiveJournalSyntheticViewContract => {
  switch (result.result) {
    case "Available":
      return createExecutiveJournalSyntheticReadyView(result.projections);
    case "Empty":
      return withMarker({ state: "Empty" as const });
    case "Denied":
      return withMarker({
        state: "PrivacyRejected" as const,
        code: "EX2-SYNTH-DENIED-FIELD" as const,
      });
    case "Unavailable":
      return withMarker({ state: "ProviderUnavailable" as const });
    case "Stale":
      return withMarker({ state: "UnsupportedVersion" as const });
    case "Invalid":
      return withMarker({ state: "Failure" as const });
    default: {
      const _exhaustive: never = result;
      return _exhaustive;
    }
  }
};

export const mapProviderGetResultToViewContract = (
  result: ExecutiveJournalSyntheticProviderGetResult,
): ExecutiveJournalSyntheticViewContract => {
  switch (result.result) {
    case "Available":
      if (result.projection.integrity_state === "Unavailable") {
        return withMarker({
          state: "IntegrityUnavailable" as const,
          projection: result.projection,
        });
      }
      return createExecutiveJournalSyntheticReadyView([result.projection]);
    case "Empty":
      return withMarker({ state: "Empty" as const });
    case "Denied":
      return withMarker({ state: "NotFound" as const });
    case "Unavailable":
      return withMarker({ state: "ProviderUnavailable" as const });
    case "Stale":
      return withMarker({ state: "UnsupportedVersion" as const });
    case "Invalid":
      return withMarker({ state: "Failure" as const });
    default: {
      const _exhaustive: never = result;
      return _exhaustive;
    }
  }
};

export const mapAdapterOutcomeToViewContract = (
  outcome: ExecutiveJournalSyntheticAdapterOutcome,
): ExecutiveJournalSyntheticViewContract => {
  if (outcome.result === "Accepted") {
    if (outcome.projection.integrity_state === "Unavailable") {
      return withMarker({
        state: "IntegrityUnavailable" as const,
        projection: outcome.projection,
      });
    }
    return createExecutiveJournalSyntheticReadyView([outcome.projection]);
  }
  if (outcome.code === "EX2-SYNTH-SCHEMA-VERSION") {
    return withMarker({ state: "UnsupportedVersion" as const });
  }
  return withMarker({
    state: "PrivacyRejected" as const,
    code: outcome.code,
  });
};

export const filterSyntheticProjectionsByCategory = (
  projections: readonly ExecutiveJournalSyntheticMetadataProjection[],
  category: ExecutiveJournalSyntheticMetadataProjection["entry_category"],
): readonly ExecutiveJournalSyntheticMetadataProjection[] =>
  Object.freeze(
    projections.filter((item) => item.entry_category === category),
  );

export const filterSyntheticProjectionsByLifecycle = (
  projections: readonly ExecutiveJournalSyntheticMetadataProjection[],
  lifecycle: ExecutiveJournalSyntheticMetadataProjection["lifecycle_state"],
): readonly ExecutiveJournalSyntheticMetadataProjection[] =>
  Object.freeze(
    projections.filter((item) => item.lifecycle_state === lifecycle),
  );

export const ExecutiveJournalSyntheticMetadataViewContractSurface =
  Object.freeze({
    viewContractId: "EX-2:T0/ExecutiveJournalSyntheticMetadataViewContract" as const,
    reactComponents: false as const,
    jsx: false as const,
    htmlCss: false as const,
    nextRoutes: false as const,
    mutationControls: false as const,
    confirmationControls: false as const,
    disputeClosureDisclosureExportControls: false as const,
    evidenceLinks: false as const,
    privateReflectionIndicators: false as const,
    aiActions: false as const,
    productionOrLiveLabels: false as const,
    canonicalJournalSequenceClaims: false as const,
    mandatorySyntheticMarker: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
