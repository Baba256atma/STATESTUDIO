/**
 * NEX-4:6 — Exactly eight immutable Platform capabilities.
 */

import { UserJourneyExperienceManifest } from "./userJourneyExperienceManifest.ts";

const Subjects = UserJourneyExperienceManifest.platformSeedMetadata.capabilitySubjects;

export const UserJourneyExperiencePlatformCapabilities = Object.freeze([
  Object.freeze({ id: "NEX-4:6/Capability/UserJourneyPublication", name: "User Journey Publication", description: "Represents canonical user journey metadata.", sourceSubject: Subjects[0], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Capability/ExperiencePublication", name: "Experience Publication", description: "Represents canonical experience metadata.", sourceSubject: Subjects[1], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Capability/PersonaPublication", name: "Persona Publication", description: "Represents user persona metadata.", sourceSubject: Subjects[2], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Capability/JourneyStagePublication", name: "Journey Stage Publication", description: "Represents journey stage metadata.", sourceSubject: Subjects[3], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Capability/TouchpointPublication", name: "Touchpoint Publication", description: "Represents experience touchpoint metadata.", sourceSubject: Subjects[4], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Capability/WorkspaceExperiencePublication", name: "Workspace Experience Publication", description: "Represents workspace experience metadata.", sourceSubject: Subjects[5], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Capability/TimelineExperiencePublication", name: "Timeline Experience Publication", description: "Represents timeline experience metadata.", sourceSubject: Subjects[6], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Capability/ExperienceGovernancePublication", name: "Experience Governance Publication", description: "Represents experience governance metadata.", sourceSubject: Subjects[7], executable: false, metadataOnly: true, immutable: true }),
] as const);
