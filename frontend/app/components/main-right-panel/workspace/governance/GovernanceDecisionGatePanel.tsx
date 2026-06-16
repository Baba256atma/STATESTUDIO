"use client";

import React from "react";

import type { GovernanceDecisionGateSurface } from "../../../../lib/ui/mrpWorkspace/governance/governanceDecisionGateContract.ts";
import {
  governanceDecisionGateRuleStyle,
  governanceDecisionGateShellStyle,
  governanceDecisionOutcomeStyle,
  governanceIntelligenceRowDetailStyle,
  governancePanelHeadlineStyle,
  governanceSectionLabelStyle,
} from "../../../../lib/ui/mrpWorkspace/governance/governanceVisualContract.ts";

export type GovernanceDecisionGatePanelProps = Readonly<{
  decisionGate: GovernanceDecisionGateSurface;
  phase: "loading" | "ready" | "empty";
}>;

export function GovernanceDecisionGatePanel(
  props: GovernanceDecisionGatePanelProps
): React.ReactElement {
  const loading = props.phase === "loading";
  const { decisionGate } = props;

  return (
    <section
      data-nx="governance-decision-gate-panel"
      data-governance-decision-gate="true"
      data-governance-decision-outcome={decisionGate.outcome}
      data-governance-decides-readiness="true"
      data-governance-may-execute="false"
      data-governance-advisory-recommends="true"
      data-governance-war-room-executes="true"
      aria-label="Governance decision gate"
      style={governanceDecisionGateShellStyle()}
    >
      <div style={governanceSectionLabelStyle()}>{decisionGate.label}</div>
      {loading ? (
        <p style={governanceIntelligenceRowDetailStyle()}>Evaluating governance readiness…</p>
      ) : (
        <>
          <div
            data-governance-outcome={decisionGate.outcome}
            style={governanceDecisionOutcomeStyle(decisionGate.outcome)}
          >
            {decisionGate.outcome}
          </div>
          <p style={governancePanelHeadlineStyle("neutral")}>{decisionGate.readinessSummary}</p>
          <p style={governanceDecisionGateRuleStyle()}>{decisionGate.ownershipRule}</p>
          <ul
            data-governance-decision-conditions="true"
            style={{
              margin: 0,
              paddingLeft: 18,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {decisionGate.conditions.map((condition) => (
              <li
                key={condition}
                data-governance-condition={condition}
                style={governanceIntelligenceRowDetailStyle()}
              >
                {condition}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export default GovernanceDecisionGatePanel;
