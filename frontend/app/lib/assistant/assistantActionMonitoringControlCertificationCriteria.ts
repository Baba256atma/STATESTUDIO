/** ASSISTANT-9:7 — Exactly 18 immutable certification criteria. */
import { AssistantActionMonitoringControlPlatform } from "./assistantActionMonitoringControlPlatform.ts";

const criteria = Object.freeze([
  [
    "Foundation integrity certified",
    "Certify Foundation integrity as published by Platform.",
  ],
  [
    "Registry integrity certified",
    "Certify Registry integrity as published by Platform.",
  ],
  [
    "Model integrity certified",
    "Certify Model integrity as published by Platform.",
  ],
  [
    "Validation integrity certified",
    "Certify Validation integrity as published by Platform.",
  ],
  [
    "Manifest integrity certified",
    "Certify Manifest integrity as published by Platform.",
  ],
  [
    "Platform integrity certified",
    "Certify Platform aggregate integrity prior to Freeze.",
  ],
  [
    "Canonical identities verified",
    "Certify that canonical identities remain immutable.",
  ],
  [
    "Relationship consistency verified",
    "Certify relationship consistency as published by Platform.",
  ],
  [
    "Metadata completeness verified",
    "Certify metadata completeness as published by Platform.",
  ],
  [
    "Inventory consistency verified",
    "Certify inventory consistency as published by Platform.",
  ],
  [
    "Deterministic ordering verified",
    "Certify deterministic ordering as published by Platform.",
  ],
  [
    "Compatibility verified",
    "Certify compatibility declarations as published by Platform.",
  ],
  [
    "Metadata-only implementation verified",
    "Certify that Platform remains metadata-only.",
  ],
  [
    "Runtime exclusion verified",
    "Certify that runtime monitoring and control remain excluded.",
  ],
  [
    "TypeScript compliance verified",
    "Certify TypeScript compliance declaration as published by Platform.",
  ],
  [
    "ESLint compliance verified",
    "Certify ESLint compliance declaration as published by Platform.",
  ],
  [
    "Freeze readiness verified",
    "Certify Freeze readiness authorizing progression to Freeze.",
  ],
  [
    "Release readiness verified",
    "Certify release readiness as published by Platform.",
  ],
] as const);

export const AssistantActionMonitoringControlCertificationCriteria =
  Object.freeze(
    criteria.map(([canonicalName, description], index) => Object.freeze({
      id: `ASSISTANT-9:7/Criterion/${String(index + 1).padStart(2, "0")}`,
      certificationId:
        `ASSISTANT-9:7/Criterion/${String(index + 1).padStart(2, "0")}`,
      canonicalName,
      description,
      criterionReference:
        `ASSISTANT-9:7/Criterion/${String(index + 1).padStart(2, "0")}`,
      gateReference: null as string | null,
      version: "1.0.0",
      status: "Certified",
      readiness: "ReadyForFreeze",
      platformReference:
        AssistantActionMonitoringControlPlatform.identity.id,
      evaluationStatus: "Certified",
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );
