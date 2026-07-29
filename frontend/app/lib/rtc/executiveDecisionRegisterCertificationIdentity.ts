/**
 * RTC-3:9 — Executive Decision Register Certification Identity.
 *
 * Canonical identity, namespace, aliases, fail-closed guards, and terminal
 * decision marker. No RTC-3:10 identity.
 *
 * Ownership: owned exclusively by RTC-3:9.
 */

import type { ExecutiveDecisionRegisterCertificationIdentityDescriptor } from "./executiveDecisionRegisterCertificationTypes.ts";

export const ExecutiveDecisionRegisterCertificationId =
  "RTC-3:9/ExecutiveDecisionRegisterCertification" as const;

export const ExecutiveDecisionRegisterCertificationName =
  "Executive Decision Register Certification & Release Readiness" as const;

export const ExecutiveDecisionRegisterCertificationPhaseId = "RTC-3:9" as const;

export const ExecutiveDecisionRegisterCertificationVersion = "1.0.0" as const;

export const ExecutiveDecisionRegisterCertificationNamespace =
  "nexora.rtc.executive.decision.register.certification" as const;

export const ExecutiveDecisionRegisterCertificationStatus =
  "Certification" as const;

export const ExecutiveDecisionRegisterCertificationReadiness =
  "ReadyForConsumer" as const;

export const ExecutiveDecisionRegisterCertificationSourceAssurance =
  "RTC-3:8/ExecutiveDecisionRegisterAssurance" as const;

export const ExecutiveDecisionRegisterCertificationPreviousPhase =
  "RTC-3:8 — Executive Decision Register Reconciliation & Assurance" as const;

export const ExecutiveDecisionRegisterCertificationTerminalDecisionMarker =
  "nextPhaseDecisionRequired" as const;

/** Approved aliases only — unknown/malformed identities fail closed. */
export const ExecutiveDecisionRegisterCertificationApprovedAliases =
  Object.freeze([
    "ExecutiveDecisionRegisterCertification",
    "RTC-3:9",
  ] as const);

export type ExecutiveDecisionRegisterCertificationApprovedAlias =
  (typeof ExecutiveDecisionRegisterCertificationApprovedAliases)[number];

export const isExecutiveDecisionRegisterCertificationApprovedAlias = (
  value: string,
): value is ExecutiveDecisionRegisterCertificationApprovedAlias =>
  (ExecutiveDecisionRegisterCertificationApprovedAliases as readonly string[])
    .includes(value);

export const isExecutiveDecisionRegisterCertificationIdentity = (
  value: string,
): value is typeof ExecutiveDecisionRegisterCertificationId =>
  value === ExecutiveDecisionRegisterCertificationId;

export const assertExecutiveDecisionRegisterCertificationIdentity = (
  value: string,
): typeof ExecutiveDecisionRegisterCertificationId => {
  if (!isExecutiveDecisionRegisterCertificationIdentity(value)) {
    throw new Error(
      `Unknown or malformed RTC-3:9 certification identity: ${JSON.stringify(value)}`,
    );
  }
  return ExecutiveDecisionRegisterCertificationId;
};

export const assertExecutiveDecisionRegisterCertificationAlias = (
  value: string,
): ExecutiveDecisionRegisterCertificationApprovedAlias => {
  if (!isExecutiveDecisionRegisterCertificationApprovedAlias(value)) {
    throw new Error(
      `Unknown or unapproved RTC-3:9 certification alias: ${JSON.stringify(value)}`,
    );
  }
  return value;
};

export const ExecutiveDecisionRegisterCertificationIdentityDescriptorValue:
  ExecutiveDecisionRegisterCertificationIdentityDescriptor = Object.freeze({
    id: ExecutiveDecisionRegisterCertificationId,
    name: ExecutiveDecisionRegisterCertificationName,
    phaseId: ExecutiveDecisionRegisterCertificationPhaseId,
    version: ExecutiveDecisionRegisterCertificationVersion,
    namespace: ExecutiveDecisionRegisterCertificationNamespace,
    status: ExecutiveDecisionRegisterCertificationStatus,
    readiness: ExecutiveDecisionRegisterCertificationReadiness,
    layer: "Runtime Layer",
    architecture: "NPA-T vNext",
    domain: "Executive Decision Register",
    sourceAssurance: ExecutiveDecisionRegisterCertificationSourceAssurance,
    upstream: ExecutiveDecisionRegisterCertificationPreviousPhase,
    previousPhase: ExecutiveDecisionRegisterCertificationPreviousPhase,
    nextPhaseDecisionRequired: true as const,
    description:
      "Metadata-only Certification & Release Readiness gate that evaluates " +
      "supplied verification evidence and produces a deterministic " +
      "certification result. ReadyForConsumer is phase readiness only and " +
      "does not authorize metadata consumption, integration, deployment, " +
      "UI/APP-8 use, or RTC-3:10 creation. Human authorization remains " +
      "separately required. nextPhaseDecisionRequired is true; no nextPhase " +
      "value and no RTC-3:10 identity are defined.",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
