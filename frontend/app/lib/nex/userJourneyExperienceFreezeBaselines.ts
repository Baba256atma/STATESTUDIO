/**
 * NEX-4:8 — Exactly eight Certification-derived frozen baselines.
 */

import { UserJourneyExperienceCertification } from "./userJourneyExperienceCertification.ts";

const Subjects = UserJourneyExperienceCertification.freezeSeedMetadata.baselineSubjects;

export const UserJourneyExperienceFrozenBaselines = Object.freeze([
  Object.freeze({ id: "NEX-4:8/Baseline/Foundation", name: "Foundation Baseline", sourceSubject: Subjects[0], phase: "NEX-4:1", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/Baseline/Registry", name: "Registry Baseline", sourceSubject: Subjects[1], phase: "NEX-4:2", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/Baseline/Model", name: "Model Baseline", sourceSubject: Subjects[2], phase: "NEX-4:3", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/Baseline/Validation", name: "Validation Baseline", sourceSubject: Subjects[3], phase: "NEX-4:4", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/Baseline/Manifest", name: "Manifest Baseline", sourceSubject: Subjects[4], phase: "NEX-4:5", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/Baseline/Platform", name: "Platform Baseline", sourceSubject: Subjects[5], phase: "NEX-4:6", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/Baseline/Certification", name: "Certification Baseline", sourceSubject: Subjects[6], phase: "NEX-4:7", locked: true, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/Baseline/Freeze", name: "Freeze Baseline", sourceSubject: Subjects[7], phase: "NEX-4:8", locked: true, metadataOnly: true, immutable: true }),
] as const);
