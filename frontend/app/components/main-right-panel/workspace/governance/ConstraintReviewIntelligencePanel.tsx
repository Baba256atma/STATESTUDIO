"use client";

import React from "react";

import type { ConstraintReviewIntelligenceSurface } from "../../../../lib/ui/mrpWorkspace/governance/governancePolicyConstraintIntelligenceContract.ts";
import {
  governanceIntelligenceQuestionStyle,
  governanceIntelligenceRowDetailStyle,
  governanceIntelligenceRowStyle,
  governanceIntelligenceShellStyle,
  governanceIntelligenceVerdictStyle,
  governancePanelHeadlineStyle,
  governanceSectionLabelStyle,
} from "../../../../lib/ui/mrpWorkspace/governance/governanceVisualContract.ts";

export type ConstraintReviewIntelligencePanelProps = Readonly<{
  intelligence: ConstraintReviewIntelligenceSurface;
  phase: "loading" | "ready" | "empty";
}>;

export function ConstraintReviewIntelligencePanel(
  props: ConstraintReviewIntelligencePanelProps
): React.ReactElement {
  const loading = props.phase === "loading";
  const { intelligence } = props;

  return (
    <article
      data-nx="governance-constraint-intelligence-panel"
      data-governance-section="constraint_review"
      data-governance-intelligence-read-only="true"
      data-governance-constraint-overall-verdict={intelligence.overallVerdict}
      style={governanceIntelligenceShellStyle()}
    >
      <div style={governanceSectionLabelStyle()}>{intelligence.label}</div>
      <div style={governancePanelHeadlineStyle("warning")}>
        Constraint intelligence — {intelligence.overallVerdict}
      </div>
      <p style={governanceIntelligenceRowDetailStyle()}>
        Read-only review of budget, resource, timeline, and authority constraints.
      </p>

      {loading ? (
        <p style={governanceIntelligenceRowDetailStyle()}>Loading constraint intelligence…</p>
      ) : (
        intelligence.rows.map((row) => (
          <div
            key={row.id}
            data-governance-constraint-question={row.id}
            data-governance-constraint-verdict={row.verdict}
            style={governanceIntelligenceRowStyle()}
          >
            <div style={governanceIntelligenceQuestionStyle()}>{row.question}</div>
            <div style={governanceIntelligenceVerdictStyle(row.verdict)}>{row.verdict}</div>
            <p style={governanceIntelligenceRowDetailStyle()}>{row.detail}</p>
          </div>
        ))
      )}
    </article>
  );
}

export default ConstraintReviewIntelligencePanel;
