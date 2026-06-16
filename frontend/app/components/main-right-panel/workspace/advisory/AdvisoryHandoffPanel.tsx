"use client";

import React from "react";

import type { AdvisoryHandoffSurface } from "../../../../lib/ui/mrpWorkspace/advisory/advisoryHandoffContract.ts";
import type { AdvisoryRecommendationSurface } from "../../../../lib/ui/mrpWorkspace/advisory/advisoryRecommendationContract.ts";
import { commitRecommendationToGovernance } from "../../../../lib/ui/mrpWorkspace/advisory/advisoryHandoffRuntime.ts";
import {
  advisoryCardDetailStyle,
  advisoryHandoffCommitButtonStyle,
  advisoryHandoffPanelShellStyle,
  advisorySectionLabelStyle,
  advisoryVisualSpacing,
  executiveRecommendationSourcesStyle,
} from "../../../../lib/ui/mrpWorkspace/advisory/advisoryVisualContract.ts";

export type AdvisoryHandoffPanelProps = Readonly<{
  handoff: AdvisoryHandoffSurface;
  recommendation: AdvisoryRecommendationSurface;
  phase: "loading" | "ready" | "empty";
}>;

export function AdvisoryHandoffPanel(props: AdvisoryHandoffPanelProps): React.ReactElement {
  const loading = props.phase === "loading";
  const canHandoff =
    !loading &&
    props.recommendation.createsRecommendation &&
    props.recommendation.card.recommendation !== "No executive recommendation available";
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  const handleHandoff = React.useCallback(() => {
    const result = commitRecommendationToGovernance();
    setStatusMessage(
      result.ok
        ? `${result.recommendationPackage?.recommendationTitle ?? "Recommendation"} prepared for governance review — no approval or execution occurred.`
        : result.reason ?? "Handoff blocked by Rule #14 boundary."
    );
  }, []);

  return (
    <section
      data-nx="advisory-handoff-panel"
      data-advisory-dashboard-context={props.handoff.dashboardContext}
      data-advisory-handoff="true"
      aria-label="Advisory to governance handoff"
      style={advisoryHandoffPanelShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: advisoryVisualSpacing.fieldGap,
        }}
      >
        <div style={advisorySectionLabelStyle()}>Advisory → Governance Handoff</div>
        <p style={executiveRecommendationSourcesStyle()}>{props.handoff.question}</p>
      </header>

      {loading ? (
        <p style={advisoryCardDetailStyle()}>Loading recommendation for governance handoff…</p>
      ) : (
        <>
          <p style={advisoryCardDetailStyle()}>
            Advisory recommends. Governance approves. War Room commits.
          </p>

          <button
            type="button"
            data-nx="advisory-prepare-for-governance"
            disabled={!canHandoff}
            onClick={handleHandoff}
            style={advisoryHandoffCommitButtonStyle(!canHandoff)}
          >
            Prepare For Governance Review
          </button>

          {props.handoff.handoffReady && props.handoff.pendingRecommendationPackage ? (
            <p style={advisoryCardDetailStyle()}>
              Prepared: {props.handoff.pendingRecommendationPackage.recommendationTitle} — transferred
              to governance runtime for review only.
            </p>
          ) : null}

          {statusMessage ? <p style={advisoryCardDetailStyle()}>{statusMessage}</p> : null}
        </>
      )}

      <p style={{ ...advisoryCardDetailStyle(), marginTop: advisoryVisualSpacing.fieldGap }}>
        Controlled handoff only — Advisory packages recommendations; Governance owns approval. No
        automatic governance open, approval, or execution from Advisory.
      </p>
    </section>
  );
}

export default AdvisoryHandoffPanel;
