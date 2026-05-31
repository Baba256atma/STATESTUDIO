import type { WorkspaceReadinessStatus } from "../workspacePolishRuntime";

export type ExecutiveOrientationTier = "firstVisit" | "returningUser" | "experiencedUser";

export type ExecutiveOrientationPersistedState = {
  visitCount: number;
  welcomeDismissed: boolean;
  lastVisitAt: number | null;
  totalSessionSeconds: number;
};

export type ExecutiveOrientationSnapshot = {
  tier: ExecutiveOrientationTier;
  visitCount: number;
  welcomeDismissed: boolean;
  isFirstVisit: boolean;
};

export type ExecutiveFirstImpressionSnapshot = {
  operationalHealth: string;
  activeObjectCount: number;
  elevatedRiskCount: number;
  activeScenarioCount: number;
  recommendedFocus: string;
  summaryLines: string[];
};

export type SituationalAwarenessSnapshot = {
  systemOverview: string;
  operationalStatus: string;
  riskStatus: string;
  recommendedNextStep: string;
  entryHeadline: string;
};

export type ExecutiveQuickStartRecommendation = {
  id: string;
  label: string;
  rationale: string;
};

export type WorkspaceMeaningArea = "scene" | "objects" | "relationships" | "timeline" | "aiAssistant";

export type ProgressiveDisclosureLayer =
  | "situation"
  | "risk"
  | "decision"
  | "action"
  | "advanced";

export type ProgressiveDisclosureSnapshot = {
  visibleLayers: ProgressiveDisclosureLayer[];
  phaseLabel: string;
};

export type ExecutiveWelcomeSnapshot = {
  showWelcome: boolean;
  currentSystemState: string;
  mostImportantInsight: string;
  suggestedFirstAction: string;
};

export type WorkspaceConfidenceSignal = {
  id: string;
  label: string;
  ready: boolean;
};

export type WorkspaceConfidenceSnapshot = {
  signals: WorkspaceConfidenceSignal[];
  summaryLine: string;
};

export type ExecutiveOrientationContext = {
  objectCount: number;
  relationshipCount: number;
  elevatedRiskCount: number;
  activeScenarioCount: number;
  activeScenarioTitle: string | null;
  operationalHealth: string;
  fragilityLevel: "low" | "medium" | "high" | "critical" | null;
  pipelineStatus: "idle" | "processing" | "ready" | "error";
  insightLine: string | null;
  decisionNextMove: string | null;
  selectedObjectLabel: string | null;
  recommendedFocusLabel: string | null;
  domainLabel: string | null;
  workspaceReadiness: WorkspaceReadinessStatus;
  elapsedSeconds: number;
  themeMode: "day" | "night";
  orientation: ExecutiveOrientationSnapshot;
};

export type ExecutiveOrientationExperience = {
  orientation: ExecutiveOrientationSnapshot;
  firstImpression: ExecutiveFirstImpressionSnapshot;
  situationalAwareness: SituationalAwarenessSnapshot;
  quickStart: ExecutiveQuickStartRecommendation[];
  workspaceMeaning: Record<WorkspaceMeaningArea, string>;
  progressiveDisclosure: ProgressiveDisclosureSnapshot;
  welcome: ExecutiveWelcomeSnapshot;
  confidence: WorkspaceConfidenceSnapshot;
};
