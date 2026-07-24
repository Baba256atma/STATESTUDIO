/**
 * NEX-4:1 — Exactly sixteen immutable Foundation sections.
 */

export const UserJourneyExperienceFoundationSections = Object.freeze([
  Object.freeze({ id: "NEX-4:1/Section/UserJourneyVision", name: "User Journey Vision", description: "Long-term direction for coherent Nexora user journeys.", category: "Direction", order: 1, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/ExperiencePrinciples", name: "Experience Principles", description: "Durable principles guiding the conceptual experience architecture.", category: "Principle", order: 2, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/UserPersonas", name: "User Personas", description: "Canonical metadata describing intended user perspectives.", category: "Persona", order: 3, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/ExecutiveGoals", name: "Executive Goals", description: "Intended executive outcomes supported by the experience.", category: "Goal", order: 4, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/JourneyStages", name: "Journey Stages", description: "Canonical stages spanning the user lifecycle.", category: "Journey", order: 5, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/ExperienceTouchpoints", name: "Experience Touchpoints", description: "Declared conceptual interactions within journey stages.", category: "Touchpoint", order: 6, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/OnboardingExperience", name: "Onboarding Experience", description: "Conceptual first-use and orientation experience metadata.", category: "Experience", order: 7, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/WorkspaceEntryExperience", name: "Workspace Entry Experience", description: "Conceptual metadata for entering the Nexora workspace.", category: "Experience", order: 8, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/DataConnectionExperience", name: "Data Connection Experience", description: "Conceptual metadata for understanding data connection.", category: "Experience", order: 9, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/AdvisorInteractionExperience", name: "Advisor Interaction Experience", description: "Conceptual metadata for advisor-oriented interactions.", category: "Experience", order: 10, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/DecisionExperience", name: "Decision Experience", description: "Conceptual metadata for supported executive decisions.", category: "Experience", order: 11, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/TimelineExperience", name: "Timeline Experience", description: "Conceptual metadata for understanding product and decision history.", category: "Experience", order: 12, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/ExperienceLifecycle", name: "Experience Lifecycle", description: "Declared stages of experience evolution.", category: "Lifecycle", order: 13, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/ExperienceBoundaries", name: "Experience Boundaries", description: "Explicit limits of the conceptual experience domain.", category: "Boundary", order: 14, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/ExperienceGovernance", name: "Experience Governance", description: "Ownership and stewardship metadata for experience concepts.", category: "Governance", order: 15, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:1/Section/ExperienceSuccessCriteria", name: "Experience Success Criteria", description: "Declarative criteria describing intended experience success.", category: "Success", order: 16, metadataOnly: true, immutable: true }),
] as const);

export const UserJourneyExperienceFoundationVocabulary = Object.freeze({
  vision: Object.freeze({
    id: "NEX-4:1/Vision/CoherentLifecycle",
    statement: "Enable coherent, understandable Nexora experiences from onboarding through long-term executive use.",
    metadataOnly: true,
    immutable: true,
  }),
  principles: Object.freeze([
    Object.freeze({ id: "NEX-4:1/Principle/Clarity", name: "Clarity", description: "Keep experience intent understandable.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-4:1/Principle/Continuity", name: "Continuity", description: "Preserve coherence across journey stages.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-4:1/Principle/ExecutiveRelevance", name: "Executive Relevance", description: "Center experience metadata on meaningful executive outcomes.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-4:1/Principle/ImplementationIndependent", name: "Implementation Independent", description: "Separate experience concepts from UI and runtime implementation.", metadataOnly: true, immutable: true }),
  ]),
  lifecycle: Object.freeze(["Introduced", "Oriented", "Engaged", "Established", "Evolved"]),
  metadataOnly: true,
  immutable: true,
} as const);
