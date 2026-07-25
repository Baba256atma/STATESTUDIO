/** ASSISTANT-8:7 — Exactly 18 immutable certification criteria. */
import { ExecutiveActionExecutionPlatform } from "./executiveActionExecutionPlatform.ts";

const criteria = Object.freeze([
  [
    "Foundation Compatible",
    "Certify Foundation compatibility as published by Platform.",
  ],
  [
    "Registry Compatible",
    "Certify Registry compatibility as published by Platform.",
  ],
  [
    "Model Compatible",
    "Certify Model compatibility as published by Platform.",
  ],
  [
    "Validation Compatible",
    "Certify Validation compatibility as published by Platform.",
  ],
  [
    "Manifest Compatible",
    "Certify Manifest compatibility as published by Platform.",
  ],
  [
    "Platform Compatible",
    "Certify Platform aggregate compatibility prior to Freeze.",
  ],
  [
    "Canonical Identity",
    "Certify that Platform canonical identity remains immutable.",
  ],
  [
    "Immutable Metadata",
    "Certify that Platform-derived metadata remains immutable.",
  ],
  [
    "Deterministic Structure",
    "Certify that Platform structure remains deterministic.",
  ],
  [
    "Stable Contracts",
    "Certify that execution contracts remain stable through Platform.",
  ],
  [
    "Stable Models",
    "Certify that domain models remain stable through Platform.",
  ],
  [
    "Stable Relationships",
    "Certify that relationship metadata remains stable through Platform.",
  ],
  [
    "Lifecycle Integrity",
    "Certify lifecycle integrity as published by Platform.",
  ],
  [
    "Policy Integrity",
    "Certify policy integrity as published by Platform.",
  ],
  [
    "Inventory Integrity",
    "Certify inventory integrity as published by Platform.",
  ],
  [
    "Metadata Completeness",
    "Certify metadata completeness as published by Platform.",
  ],
  [
    "Consumer Compatibility",
    "Certify consumer-safe Platform metadata compatibility.",
  ],
  [
    "Release Readiness",
    "Certify release readiness authorizing progression to Freeze.",
  ],
] as const);

export const ExecutionCertificationCriteria = Object.freeze(
  criteria.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-8:7/Criterion/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    evaluationStatus: "Certified",
    readiness: "ReadyForFreeze",
    canonicalIdentity: ExecutiveActionExecutionPlatform.identity.id,
    sourcePlatform: ExecutiveActionExecutionPlatform.identity.id,
    expectedResult: "Certified",
    version: "1.0.0",
    status: "Certified",
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
