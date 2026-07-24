/**
 * NEX-2:8 — Eight Certification-derived frozen baselines.
 */

import { ProductRoadmapCertification } from "./productRoadmapCertification.ts";

export const ProductRoadmapFrozenBaselines = Object.freeze([
  Object.freeze({ id: "NEX-2:8/Baseline/Foundation", name: "Foundation Baseline", sourceSubject: ProductRoadmapCertification.freezeSeedMetadata.baselineSubjects[0], phase: "NEX-2:1", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Baseline/Registry", name: "Registry Baseline", sourceSubject: ProductRoadmapCertification.freezeSeedMetadata.baselineSubjects[1], phase: "NEX-2:2", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Baseline/Model", name: "Model Baseline", sourceSubject: ProductRoadmapCertification.freezeSeedMetadata.baselineSubjects[2], phase: "NEX-2:3", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Baseline/Validation", name: "Validation Baseline", sourceSubject: ProductRoadmapCertification.freezeSeedMetadata.baselineSubjects[3], phase: "NEX-2:4", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Baseline/Manifest", name: "Manifest Baseline", sourceSubject: ProductRoadmapCertification.freezeSeedMetadata.baselineSubjects[4], phase: "NEX-2:5", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Baseline/Platform", name: "Platform Baseline", sourceSubject: ProductRoadmapCertification.freezeSeedMetadata.baselineSubjects[5], phase: "NEX-2:6", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Baseline/Certification", name: "Certification Baseline", sourceSubject: ProductRoadmapCertification.freezeSeedMetadata.baselineSubjects[6], phase: "NEX-2:7", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Baseline/Freeze", name: "Freeze Baseline", sourceSubject: ProductRoadmapCertification.freezeSeedMetadata.baselineSubjects[7], phase: "NEX-2:8", locked: true, metadataOnly: true, immutable: true }),
] as const);
