/**
 * NEX-MVP:1 upstream verification against NEX-CI:9 Public Index.
 *
 * Kept separate from the UI-consumable application foundation because the
 * NEX-CI public index transitively loads Node certification utilities.
 * Browser / React clients must import nexoraMVPApplicationFoundation only.
 */

import {
  EXECUTIVE_COCKPIT_SURFACES,
  getExecutiveCockpitIntegrationPublicConsumerInformation,
  getExecutiveCockpitIntegrationReleaseInformation,
  verifyExecutiveCockpitIntegrationPublicIndex,
} from "@/app/lib/nex-ci/executiveCockpitIntegrationPublicIndex";

import {
  nexoraMVPApplicationFoundationUpstreamIdentity,
  nexoraMVPApplicationFoundationUpstreamImportPath,
  validateNexoraMVPApplicationFoundation,
  type NexoraMVPApplicationFoundationValidation,
} from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";

export interface NexoraMVPUpstreamIntegrationVerification {
  readonly ok: boolean;
  readonly expectedIdentity: typeof nexoraMVPApplicationFoundationUpstreamIdentity;
  readonly actualIdentity: string;
  readonly identityValid: boolean;
  readonly importPathValid: boolean;
  readonly releaseStatusValid: boolean;
  readonly certificationStatusValid: boolean;
  readonly compatibilityStatusValid: boolean;
  readonly freezeStatusValid: boolean;
  readonly consumerReadinessValid: boolean;
  readonly stageSurfaceAvailable: boolean;
  readonly publicIndexOk: boolean;
  readonly releaseStatus: string;
  readonly certificationStatus: string;
  readonly compatibilityStatus: string;
  readonly freezeStatus: string;
  readonly consumerReadiness: string;
}

export function verifyNexoraMVPUpstreamIntegration(options?: {
  readonly forceFailure?: boolean;
}): NexoraMVPUpstreamIntegrationVerification {
  const publicIndex = verifyExecutiveCockpitIntegrationPublicIndex();
  const release = getExecutiveCockpitIntegrationReleaseInformation();
  const consumer = getExecutiveCockpitIntegrationPublicConsumerInformation();

  const identityValid =
    publicIndex.identity === nexoraMVPApplicationFoundationUpstreamIdentity &&
    publicIndex.identity ===
      "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex";

  const importPathValid =
    publicIndex.supportedImportPath ===
      nexoraMVPApplicationFoundationUpstreamImportPath &&
    consumer.importPath ===
      "@/app/lib/nex-ci/executiveCockpitIntegrationPublicIndex";

  const releaseStatusValid = release.releaseStatus === "released";
  const certificationStatusValid =
    release.certificationStatus === "certified" &&
    publicIndex.certificationStatus === "certified";
  const compatibilityStatusValid =
    release.compatibilityStatus === "compatible" &&
    publicIndex.compatibilityStatus === "compatible";
  const freezeStatusValid =
    release.freezeStatus === "frozen" && publicIndex.freezeStatus === "frozen";
  const consumerReadinessValid =
    consumer.readiness === "ready-for-consumer" &&
    publicIndex.consumerReadiness === "ready-for-consumer";
  const stageSurfaceAvailable = (
    EXECUTIVE_COCKPIT_SURFACES as readonly string[]
  ).includes("stage");
  const publicIndexOk = publicIndex.ok === true;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    importPathValid &&
    releaseStatusValid &&
    certificationStatusValid &&
    compatibilityStatusValid &&
    freezeStatusValid &&
    consumerReadinessValid &&
    stageSurfaceAvailable &&
    publicIndexOk;

  return Object.freeze({
    ok,
    expectedIdentity: nexoraMVPApplicationFoundationUpstreamIdentity,
    actualIdentity: publicIndex.identity,
    identityValid,
    importPathValid,
    releaseStatusValid,
    certificationStatusValid,
    compatibilityStatusValid,
    freezeStatusValid,
    consumerReadinessValid,
    stageSurfaceAvailable,
    publicIndexOk,
    releaseStatus: release.releaseStatus,
    certificationStatus: release.certificationStatus,
    compatibilityStatus: release.compatibilityStatus,
    freezeStatus: release.freezeStatus,
    consumerReadiness: consumer.readiness,
  });
}

export type NexoraMVPApplicationFoundationCompleteValidation =
  NexoraMVPApplicationFoundationValidation & {
    readonly upstreamIntegrationValid: boolean;
  };

/** Full foundation + upstream gate for Node/test consumers. */
export function validateNexoraMVPApplicationFoundationWithUpstream(options?: {
  readonly forceFailure?: boolean;
}): NexoraMVPApplicationFoundationCompleteValidation {
  const foundation = validateNexoraMVPApplicationFoundation(options);
  const upstream = verifyNexoraMVPUpstreamIntegration(options);
  const ok =
    options?.forceFailure !== true && foundation.ok && upstream.ok;

  return Object.freeze({
    ...foundation,
    ok,
    upstreamIntegrationValid: upstream.ok,
  });
}
