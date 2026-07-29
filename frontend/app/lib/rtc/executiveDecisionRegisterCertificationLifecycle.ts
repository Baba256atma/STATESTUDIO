/**
 * RTC-3:9 — Executive Decision Register Certification Lifecycle.
 *
 * Certification lifecycle, legal transitions, readiness, previous-phase
 * relationship. No invented next phase.
 *
 * Ownership: owned exclusively by RTC-3:9.
 */

import {
  ExecutiveDecisionRegisterCertificationId,
  ExecutiveDecisionRegisterCertificationPreviousPhase,
  ExecutiveDecisionRegisterCertificationReadiness,
  ExecutiveDecisionRegisterCertificationSourceAssurance,
  ExecutiveDecisionRegisterCertificationStatus,
  ExecutiveDecisionRegisterCertificationTerminalDecisionMarker,
} from "./executiveDecisionRegisterCertificationIdentity.ts";

export const ExecutiveDecisionRegisterCertificationLifecycleStatus =
  ExecutiveDecisionRegisterCertificationStatus;

export const ExecutiveDecisionRegisterCertificationLifecycleReadiness =
  ExecutiveDecisionRegisterCertificationReadiness;

/** Legal inbound transition into RTC-3:9. */
export const ExecutiveDecisionRegisterCertificationInboundTransition =
  Object.freeze({
    fromPhase: "RTC-3:8",
    fromStatus: "Assurance",
    fromReadiness: "ReadyForCertification",
    toPhase: "RTC-3:9",
    toStatus: ExecutiveDecisionRegisterCertificationLifecycleStatus,
    toReadiness: ExecutiveDecisionRegisterCertificationLifecycleReadiness,
    previousPhase: ExecutiveDecisionRegisterCertificationPreviousPhase,
    sourceAssurance: ExecutiveDecisionRegisterCertificationSourceAssurance,
    legal: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  } as const);

/**
 * Outbound relationship — decision required, no invented next phase.
 * Sequence termination / post-RTC-3:9 phase requires a separate AD.
 */
export const ExecutiveDecisionRegisterCertificationOutboundRelation =
  Object.freeze({
    certificationId: ExecutiveDecisionRegisterCertificationId,
    nextPhaseDecisionRequired: true as const,
    nextPhase: null,
    inventedNextPhase: false as const,
    rtc310Identity: null,
    publicIndexPhase: false as const,
    sequenceTerminated: false as const,
    terminalDecisionMarker:
      ExecutiveDecisionRegisterCertificationTerminalDecisionMarker,
    humanAuthorizationRequired: true as const,
    deploymentAuthorized: false as const,
    consumptionAuthorized: false as const,
    integrationAuthorized: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  } as const);

export const ExecutiveDecisionRegisterCertificationAuthorizationBoundary =
  Object.freeze({
    humanAuthorizationRequired: true as const,
    authorizationRecorded: false as const,
    consumptionAuthorized: false as const,
    integrationAuthorized: false as const,
    deploymentAuthorized: false as const,
    publicIndexAuthorized: false as const,
    rtc310CreationAuthorized: false as const,
    readyForConsumerMeansConsumptionAuthorized: false as const,
    readyForAuthorizationMeansAuthorized: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  } as const);

export const isLegalExecutiveDecisionRegisterCertificationInbound = (
  fromReadiness: string,
  fromStatus: string,
): boolean =>
  fromReadiness === "ReadyForCertification" && fromStatus === "Assurance";

/**
 * Project policy: scoped RTC-3 TypeScript is sufficient for certification
 * readiness when Disclosure full-project status is truthfully recorded and
 * AD-RTC3-09 conditions are satisfied (zero RTC-3 diagnostics).
 */
export const SCOPED_TYPESCRIPT_SUFFICIENT_FOR_CERTIFICATION = true as const;
export const SCOPED_TYPESCRIPT_POLICY_SOURCE =
  "AD-RTC3-09 — Permit RTC-3 Scoped TypeScript Certification with Full-Project Disclosure" as const;

export const ExecutiveDecisionRegisterCertificationGateCriticalities =
  Object.freeze(["Blocking", "Disclosure"] as const);

export const isExecutiveDecisionRegisterCertificationGateCriticality = (
  value: string,
): value is (typeof ExecutiveDecisionRegisterCertificationGateCriticalities)[number] =>
  (ExecutiveDecisionRegisterCertificationGateCriticalities as readonly string[])
    .includes(value);

export const assertExecutiveDecisionRegisterCertificationGateCriticality = (
  value: string,
): (typeof ExecutiveDecisionRegisterCertificationGateCriticalities)[number] => {
  if (!isExecutiveDecisionRegisterCertificationGateCriticality(value)) {
    throw new Error(
      `Unknown RTC-3:9 gate criticality fails closed: ${JSON.stringify(value)}`,
    );
  }
  return value;
};
