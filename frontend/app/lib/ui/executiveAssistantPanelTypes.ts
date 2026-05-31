/** E2:12 — Executive AI Assistant panel contracts. */

export type ExecutiveAssistantStatusPhase = "online" | "standby" | "processing";

export type ExecutiveAssistantStatus = {
  phase: ExecutiveAssistantStatusPhase;
  label: string;
};

export type ExecutiveAssistantActionCard = {
  id: string;
  label: string;
  hint?: string;
  /** Routes through existing Nexora action framework when present. */
  commandId?: string;
  disabled?: boolean;
};

export const DEFAULT_EXECUTIVE_ASSISTANT_STATUS: ExecutiveAssistantStatus = {
  phase: "online",
  label: "Online",
};

export const DEFAULT_EXECUTIVE_ASSISTANT_ACTION_CARDS: ExecutiveAssistantActionCard[] = [
  {
    id: "expedite_supplier_b",
    label: "Expedite Supplier B",
    hint: "Advisory — supplier acceleration path",
  },
  {
    id: "find_alt_supplier",
    label: "Find Alternative Supplier",
    hint: "Advisory — alternate sourcing options",
  },
  {
    id: "adjust_production",
    label: "Adjust Production Plan",
    hint: "Advisory — production schedule review",
  },
  {
    id: "risk_flow",
    label: "Analyze Risk Flow",
    hint: "Open risk propagation view",
    commandId: "risk_flow",
  },
  {
    id: "simulate",
    label: "Run Scenario",
    hint: "Run simulation",
    commandId: "simulate",
  },
  {
    id: "compare",
    label: "Compare Options",
    hint: "Open option comparison",
    commandId: "compare",
  },
];

export const DEFAULT_EXECUTIVE_QUESTION_SUGGESTIONS: readonly string[] = [
  "Why is risk increasing?",
  "Which object causes fragility?",
  "What happens if demand rises?",
  "Compare Scenario A and B.",
];
