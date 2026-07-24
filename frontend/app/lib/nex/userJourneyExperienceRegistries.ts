/**
 * NEX-4:2 — Sixteen immutable User Journey & Experience registries.
 */

import { UserJourneyExperienceFoundation } from "./userJourneyExperienceFoundation.ts";

const Foundation = UserJourneyExperienceFoundation;
const entry = (
  identifier: string,
  canonicalName: string,
  description: string,
  category: string,
  sourceIdentifier: string,
  tags: readonly string[],
) => Object.freeze({
  identifier,
  canonicalName,
  description,
  category,
  status: "Registered",
  version: "1.0.0",
  owner: "Nexora Product",
  tags: Object.freeze(tags),
  sourceIdentifier,
  metadataOnly: true,
  immutable: true,
} as const);

export const UserJourneyExperienceRegistryCollections = Object.freeze({
  userJourneyVision: Object.freeze([
    entry("NEX-4:2/Vision/CoherentLifecycle", "Coherent User Lifecycle Vision", Foundation.vocabulary.vision.statement, "UserJourneyVision", Foundation.vocabulary.vision.id, ["journey", "vision"]),
  ]),
  experiencePrinciples: Object.freeze(Foundation.vocabulary.principles.map((principle) =>
    entry(principle.id.replace("NEX-4:1", "NEX-4:2"), principle.name, principle.description, "ExperiencePrinciple", principle.id, ["experience", "principle"]),
  )),
  userPersonas: Object.freeze([
    entry("NEX-4:2/Persona/Executive", "Executive User Persona", "A decision-oriented user seeking durable product understanding.", "UserPersona", Foundation.sections[2].id, ["persona", "journey:executive"]),
  ]),
  executiveGoals: Object.freeze([
    entry("NEX-4:2/Goal/DecisionClarity", "Executive Decision Clarity", "Support clear understanding throughout executive decision journeys.", "ExecutiveGoal", Foundation.sections[3].id, ["executive", "goal"]),
  ]),
  journeyStages: Object.freeze([
    entry("NEX-4:2/JourneyStage/Onboarding", "Onboarding Stage", "Initial orientation stage of the user journey.", "JourneyStage", Foundation.sections[4].id, ["journey", "stage"]),
    entry("NEX-4:2/JourneyStage/EstablishedUse", "Established Use Stage", "Long-term executive usage stage.", "JourneyStage", Foundation.sections[4].id, ["journey", "stage"]),
  ]),
  experienceTouchpoints: Object.freeze([
    entry("NEX-4:2/Touchpoint/Orientation", "Orientation Touchpoint", "Conceptual orientation touchpoint within onboarding.", "ExperienceTouchpoint", Foundation.sections[5].id, ["touchpoint", "stage:onboarding"]),
  ]),
  onboardingExperience: Object.freeze([
    entry("NEX-4:2/Experience/Onboarding", "Nexora Onboarding Experience", "Conceptual first-use orientation experience.", "OnboardingExperience", Foundation.sections[6].id, ["experience", "onboarding"]),
  ]),
  workspaceEntry: Object.freeze([
    entry("NEX-4:2/Experience/WorkspaceEntry", "Workspace Entry Experience", "Conceptual transition into the Nexora workspace.", "WorkspaceEntry", Foundation.sections[7].id, ["experience", "workspace"]),
  ]),
  dataConnectionExperience: Object.freeze([
    entry("NEX-4:2/Experience/DataConnection", "Data Connection Experience", "Conceptual experience of understanding connected data.", "DataConnectionExperience", Foundation.sections[8].id, ["experience", "data"]),
  ]),
  advisorInteraction: Object.freeze([
    entry("NEX-4:2/Experience/AdvisorInteraction", "Advisor Interaction Experience", "Conceptual experience of engaging with advisory guidance.", "AdvisorInteraction", Foundation.sections[9].id, ["experience", "advisor"]),
  ]),
  decisionExperience: Object.freeze([
    entry("NEX-4:2/Experience/Decision", "Decision Experience", "Conceptual experience supporting an executive decision.", "DecisionExperience", Foundation.sections[10].id, ["experience", "decision"]),
  ]),
  timelineExperience: Object.freeze([
    entry("NEX-4:2/Experience/Timeline", "Timeline Experience", "Conceptual experience of understanding historical context.", "TimelineExperience", Foundation.sections[11].id, ["experience", "timeline"]),
  ]),
  experienceLifecycle: Object.freeze([
    entry("NEX-4:2/Lifecycle/UserExperience", "User Experience Lifecycle", "Declared lifecycle for evolving experience metadata.", "ExperienceLifecycle", Foundation.sections[12].id, ["experience", "lifecycle"]),
  ]),
  experienceBoundaries: Object.freeze([
    entry("NEX-4:2/Boundary/ConceptualExperience", "Conceptual Experience Boundary", "Limits the domain to conceptual metadata without UI implementation.", "ExperienceBoundary", Foundation.sections[13].id, ["experience", "boundary"]),
  ]),
  experienceGovernance: Object.freeze([
    entry("NEX-4:2/Governance/ExperienceStewardship", "Experience Stewardship", "Ownership and stewardship metadata for experience concepts.", "ExperienceGovernance", Foundation.sections[14].id, ["experience", "governance"]),
  ]),
  experienceSuccessCriteria: Object.freeze([
    entry("NEX-4:2/SuccessCriterion/JourneyClarity", "Journey Clarity Criterion", "The conceptual journey remains understandable across stages.", "ExperienceSuccessCriteria", Foundation.sections[15].id, ["experience", "success"]),
  ]),
} as const);
