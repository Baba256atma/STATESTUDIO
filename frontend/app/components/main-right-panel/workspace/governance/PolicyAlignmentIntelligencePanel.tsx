"use client";

import React from "react";

import type { PolicyAlignmentIntelligenceSurface } from "../../../../lib/ui/mrpWorkspace/governance/governancePolicyConstraintIntelligenceContract.ts";
import {
  governanceIntelligenceQuestionStyle,
  governanceIntelligenceRowDetailStyle,
  governanceIntelligenceRowStyle,
  governanceIntelligenceShellStyle,
  governanceIntelligenceVerdictStyle,
  governancePanelHeadlineStyle,
  governanceSectionLabelStyle,
} from "../../../../lib/ui/mrpWorkspace/governance/governanceVisualContract.ts";

export type PolicyAlignmentIntelligencePanelProps = Readonly<{
  intelligence: PolicyAlignmentIntelligenceSurface;
  phase: "loading" | "ready" | "empty";
}>;

export function PolicyAlignmentIntelligencePanel(
  props: PolicyAlignmentIntelligencePanelProps
): React.ReactElement {
  const loading = props.phase === "loading";
  const { intelligence } = props;

  return (
    <article
      data-nx="governance-policy-intelligence-panel"
      data-governance-section="policy_alignment"
      data-governance-intelligence-read-only="true"
      data-governance-policy-overall-verdict={intelligence.overallVerdict}
      style={governanceIntelligenceShellStyle()}
    >
      <div style={governanceSectionLabelStyle()}>{intelligence.label}</div>
      <div style={governancePanelHeadlineStyle("neutral")}>
        Policy intelligence — {intelligence.overallVerdict}
      </div>
      <p style={governanceIntelligenceRowDetailStyle()}>
        Read-only review of affected policies, applicable rules, and involved standards.
      </p>

      {loading ? (
        <p style={governanceIntelligenceRowDetailStyle()}>Loading policy intelligence…</p>
      ) : (
        intelligence.rows.map((row) => (
          <div
            key={row.id}
            data-governance-policy-question={row.id}
            data-governance-policy-verdict={row.verdict}
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

export default PolicyAlignmentIntelligencePanel;
