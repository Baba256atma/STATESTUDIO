export type ExecutiveNarrativeTone =
  | "informational"
  | "strategic"
  | "cautionary"
  | "urgent"
  | "stabilizing";

export interface ExecutiveNarrative {
  id: string;
  headline: string;
  summary: string;
  strategicMeaning?: string;
  relatedInsightIds: string[];
  relatedScenarioIds?: string[];
  relatedObjectIds: string[];
  tone: ExecutiveNarrativeTone;
  confidence?: number;
  executiveFocus?: string;
  domainId?: string;
  createdAt: number;
}

export type NarrativeSignalSource =
  | "executive_insight"
  | "compressed_insight"
  | "timeline"
  | "recommendation"
  | "monitoring"
  | "cross_domain"
  | "alert"
  | "confidence";

export type NarrativeSignalCluster = {
  id: string;
  signalIds: string[];
  scenarioIds: string[];
  relatedObjectIds: string[];
  focus: string;
  tone: ExecutiveNarrativeTone;
  confidence?: number;
  domainId?: string;
  sourceTypes: NarrativeSignalSource[];
};

export type ExecutiveNarrativeBriefing = {
  headline: string;
  strategicMeaning: string;
  executiveFocus: string;
  tone: ExecutiveNarrativeTone;
  confidence: number;
  relatedNarrativeIds: string[];
};

export type ExecutiveNarrativeOverlayState = {
  topNarrativeId?: string;
  headline: string;
  tone: ExecutiveNarrativeTone;
  executiveFocus: string;
  relatedObjectIds: string[];
};
