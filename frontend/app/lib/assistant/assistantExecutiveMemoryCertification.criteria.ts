/** ASSISTANT-2:7 — Exactly 18 immutable certification criteria. */
import { AssistantExecutiveMemoryPlatform } from "./assistantExecutiveMemoryPlatform.ts";
import type { AssistantExecutiveMemoryCertificationCriterionMetadata } from "./assistantExecutiveMemoryCertification.types.ts";

const criterionMetadataFields = Object.freeze([
  "criterionId",
  "name",
  "description",
  "category",
  "status",
  "validationTarget",
  "expectedResult",
] as const);

const criteria = Object.freeze([
  {
    name: "Canonical Identity Verified",
    description:
      "Certify that Platform canonical identity is preserved without mutation.",
    category: "Identity Certification",
  },
  {
    name: "Namespace Verified",
    description:
      "Certify that Platform namespace declarations remain stable and correct.",
    category: "Identity Certification",
  },
  {
    name: "Version Verified",
    description:
      "Certify that Platform version metadata is consistent and immutable.",
    category: "Identity Certification",
  },
  {
    name: "Foundation Integrity Verified",
    description:
      "Certify Foundation composition integrity as published by Platform.",
    category: "Integrity Certification",
  },
  {
    name: "Registry Integrity Verified",
    description:
      "Certify Registry composition integrity as published by Platform.",
    category: "Integrity Certification",
  },
  {
    name: "Model Integrity Verified",
    description:
      "Certify Model composition integrity as published by Platform.",
    category: "Integrity Certification",
  },
  {
    name: "Validation Integrity Verified",
    description:
      "Certify Validation composition integrity as published by Platform.",
    category: "Integrity Certification",
  },
  {
    name: "Manifest Integrity Verified",
    description:
      "Certify Manifest composition integrity as published by Platform.",
    category: "Integrity Certification",
  },
  {
    name: "Platform Integrity Verified",
    description:
      "Certify complete Platform aggregate integrity prior to Freeze.",
    category: "Integrity Certification",
  },
  {
    name: "Metadata Immutable",
    description:
      "Certify that all Platform-derived metadata remains immutable.",
    category: "Integrity Certification",
  },
  {
    name: "Export Integrity Verified",
    description:
      "Certify that Platform public export surface remains stable.",
    category: "Export Certification",
  },
  {
    name: "Dependency Integrity Verified",
    description:
      "Certify that Platform upstream dependency declarations remain exclusive.",
    category: "Dependency Certification",
  },
  {
    name: "Compatibility Verified",
    description:
      "Certify that Platform compatibility declarations remain satisfied.",
    category: "Compatibility Certification",
  },
  {
    name: "Public Metadata Verified",
    description:
      "Certify that Platform public metadata readiness remains published.",
    category: "Public Metadata Certification",
  },
  {
    name: "Architecture Compliant",
    description:
      "Certify that Platform remains compliant with metadata-only architecture.",
    category: "Architecture Certification",
  },
  {
    name: "Consumer Safe",
    description:
      "Certify that Platform consumer metadata remains non-runtime and safe.",
    category: "Consumer Certification",
  },
  {
    name: "Metadata Traceability Verified",
    description:
      "Certify that Platform metadata remains fully traceable to upstream phases.",
    category: "Traceability Certification",
  },
  {
    name: "Ready For Freeze",
    description:
      "Certify that Platform readiness authorizes progression to Freeze.",
    category: "Freeze Readiness Certification",
  },
] as const);

export const AssistantExecutiveMemoryCertificationCriteria:
readonly AssistantExecutiveMemoryCertificationCriterionMetadata[] =
  Object.freeze(
    criteria.map((criterion, index) => Object.freeze({
      criterionId:
        `ASSISTANT-2:7/Criterion/${String(index + 1).padStart(2, "0")}`,
      name: criterion.name,
      description: criterion.description,
      category: criterion.category,
      status: "Certified",
      validationTarget: AssistantExecutiveMemoryPlatform.identity.id,
      expectedResult: "Certified",
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );

export const AssistantExecutiveMemoryCertificationCategories = Object.freeze(
  [...new Set(criteria.map(({ category }) => category))],
);

export const AssistantExecutiveMemoryCertificationMetadataFieldCount =
  criterionMetadataFields.length;
