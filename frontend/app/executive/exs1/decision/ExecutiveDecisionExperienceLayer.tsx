"use client";

import { DecisionPreviewPanel } from "./DecisionPreviewPanel";
import { ExecutiveDecisionObject } from "./ExecutiveDecisionObject";
import { ExecutiveDecisionOverlay } from "./ExecutiveDecisionOverlay";
import { ExecutiveDecisionPanel } from "./ExecutiveDecisionPanel";
import { useExecutiveDecision } from "./hooks/useExecutiveDecision";

type Props = {
  readonly onManualCreateRequest: () => void;
};

/**
 * ExecutiveDecisionExperienceLayer — Stage chrome for Decision mode only.
 */
export function ExecutiveDecisionExperienceLayer({
  onManualCreateRequest,
}: Props) {
  const { isActive } = useExecutiveDecision();
  if (!isActive) return null;

  return (
    <div
      data-testid="executive-decision-experience-layer"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 7,
        pointerEvents: "none",
      }}
    >
      <ExecutiveDecisionOverlay />
      <ExecutiveDecisionObject />
      <div style={{ pointerEvents: "auto" }}>
        <ExecutiveDecisionPanel onManualCreateRequest={onManualCreateRequest} />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <DecisionPreviewPanel />
      </div>
    </div>
  );
}
