/** ASSISTANT-8:8 — Canonical freeze lock republishing certified metadata. */
import { ExecutiveActionExecutionCertification } from "./executiveActionExecutionCertification.ts";
import { ASSISTANT_8_EXECUTIVE_ACTION_EXECUTION_LOCK } from "./executionFreezeMetadata.ts";

const certification = ExecutiveActionExecutionCertification;

export const ExecutionFreezeLock = Object.freeze({
  lockIdentifier: ASSISTANT_8_EXECUTIVE_ACTION_EXECUTION_LOCK,
  name: "Assistant Executive Action Execution Architecture Lock",
  description:
    "Permanent immutable lock for the certified Executive Action Execution architecture.",
  sourceCertification: certification.identity.id,
  status: "Locked",
  frozen: true,
  mutationAllowed: false,
  permanent: true,
  version: "1.0.0",
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutionFreezeArchitecturalLocks = Object.freeze([
  Object.freeze({
    id: "ASSISTANT-8:8/Lock/01",
    name: "Canonical Identity Locked",
    protectedTarget: certification.identity.id,
    order: 1,
  }),
  Object.freeze({
    id: "ASSISTANT-8:8/Lock/02",
    name: "Platform Locked",
    protectedTarget: certification.platform.identity.id,
    order: 2,
  }),
  Object.freeze({
    id: "ASSISTANT-8:8/Lock/03",
    name: "Certification Locked",
    protectedTarget: certification.identity.id,
    order: 3,
  }),
  Object.freeze({
    id: "ASSISTANT-8:8/Lock/04",
    name: "Architecture Locked",
    protectedTarget: ASSISTANT_8_EXECUTIVE_ACTION_EXECUTION_LOCK,
    order: 4,
  }),
].map((lock) => Object.freeze({
  ...lock,
  lockStatus: "Locked" as const,
  version: "1.0.0" as const,
  executable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
})));
