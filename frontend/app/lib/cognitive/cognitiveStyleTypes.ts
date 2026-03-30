export type CognitiveStyle =
  | "executive"
  | "analyst"
  | "operator"
  | "investor";

export type CognitivePriority = {
  label: string;
  emphasis: "primary" | "secondary" | "supporting";
  summary: string;
};

export type CognitiveDecisionView = {
  style: CognitiveStyle;
  headline: string;
  summary: string;
  primary_focus: string[];
  risks_to_watch: string[];
  supporting_evidence: string[];
  next_actions: string[];
  decision_framing: string;
  confidence_framing?: string | null;
  tradeoff_framing?: string | null;
};

export type CognitiveStyleState = {
  active_style: CognitiveStyle;
  available_styles: CognitiveStyle[];
  selected_reason?: string | null;
  defaulted: boolean;
  view: CognitiveDecisionView;
};
