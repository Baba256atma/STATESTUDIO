/**
 * E2:48 Part 10 — future enterprise orientation architecture (contract only).
 *
 * No runtime implementation in this phase. Defines extension points for adaptive
 * onboarding, behavior learning, personalized recommendations, and role-based orientation.
 */

export type ExecutiveWorkspacePersona =
  | "operations_manager"
  | "pmo_leader"
  | "director"
  | "coo"
  | "executive_team"
  | "strategic_consultant";

export type ExecutiveOrientationLearningSignal = {
  id: string;
  kind: "action_taken" | "surface_dismissed" | "focus_changed" | "recommendation_selected";
  timestamp: number;
  metadata?: Record<string, string | number | boolean | null>;
};

export type ExecutiveOrientationLearningProfile = {
  persona: ExecutiveWorkspacePersona | null;
  preferredFocusAreas: string[];
  dismissedRecommendations: string[];
  completedOrientationPaths: string[];
  lastAdaptationAt: number | null;
};

export type ExecutiveOrientationAdaptationPlan = {
  profile: ExecutiveOrientationLearningProfile;
  recommendedPersona: ExecutiveWorkspacePersona | null;
  personalizedQuickStartIds: string[];
  suppressWelcome: boolean;
  disclosureAcceleration: "standard" | "accelerated" | "minimal";
};

/** Contract for a future adaptive orientation service. */
export type ExecutiveWorkspaceLearningContract = {
  readonly version: "e2-48-v1";
  captureSignal(signal: ExecutiveOrientationLearningSignal): void;
  readProfile(): ExecutiveOrientationLearningProfile;
  planAdaptation(input: {
    profile: ExecutiveOrientationLearningProfile;
    visitCount: number;
    sessionSeconds: number;
  }): ExecutiveOrientationAdaptationPlan;
};

export const EXECUTIVE_WORKSPACE_LEARNING_CONTRACT: ExecutiveWorkspaceLearningContract = {
  version: "e2-48-v1",
  captureSignal(_signal) {
    // Future: persist to orientation learning store.
  },
  readProfile() {
    return {
      persona: null,
      preferredFocusAreas: [],
      dismissedRecommendations: [],
      completedOrientationPaths: [],
      lastAdaptationAt: null,
    };
  },
  planAdaptation(input) {
    const accelerated = input.visitCount > 8 || input.sessionSeconds > 1800;
    return {
      profile: this.readProfile(),
      recommendedPersona: null,
      personalizedQuickStartIds: [],
      suppressWelcome: input.visitCount > 3,
      disclosureAcceleration: accelerated ? "accelerated" : "standard",
    };
  },
};
