import { listExecutivePanelResponsibilities } from "../ux/executivePanelResponsibilities.ts";

export type HarmonizedPanelIdentity = {
  panelId: string;
  executiveRole: string;
  cognitiveResponsibility: string;
  primaryQuestion: string;
};

export function listHarmonizedPanelIdentities(): HarmonizedPanelIdentity[] {
  return listExecutivePanelResponsibilities().map((panel) => ({
    panelId: panel.id,
    executiveRole: panel.label,
    cognitiveResponsibility: panel.primaryResponsibility,
    primaryQuestion:
      panel.id === "decision_strip"
        ? "What needs executive attention now?"
        : panel.id === "war_room"
          ? "How should the executive reason through the decision?"
          : panel.id === "monitoring"
            ? "What remains unresolved or changing?"
            : panel.id === "risk_flow"
              ? "Where is pressure moving?"
              : panel.id === "timeline"
                ? "How is the operating picture evolving?"
                : panel.id === "advice"
                  ? "What stabilization guidance is supported?"
            : panel.id === "compare"
              ? "Which alternatives differ materially?"
              : panel.id === "scene_overlay"
                ? "Which objects or paths should be quietly emphasized?"
                : panel.id === "object_overlay"
                  ? "What object-local signal supports interpretation?"
                : "What context supports the executive picture?",
  }));
}

export function validatePanelIdentityClarity(): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  const identities = listHarmonizedPanelIdentities();
  const seenQuestions = new Map<string, string>();
  for (const identity of identities) {
    if (!identity.cognitiveResponsibility.trim()) warnings.push(`${identity.panelId} lacks cognitive responsibility.`);
    const existing = seenQuestions.get(identity.primaryQuestion);
    if (existing) warnings.push(`${identity.panelId} shares a primary question with ${existing}.`);
    seenQuestions.set(identity.primaryQuestion, identity.panelId);
  }
  return { valid: warnings.length === 0, warnings };
}
