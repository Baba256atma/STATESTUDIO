"use client";

import type React from "react";
import { memo, useMemo } from "react";

import { nx } from "../ui/nexoraTheme";
import { runMVPSmokeTestSuite } from "../../lib/runtime-foundation/smoke-tests";
import { evaluateMVPDemoMode, formatDemoStateLabel } from "../../lib/runtime-foundation/demo-mode/demoModeEngine";
import { selectLatestMVPDemoModeState } from "../../lib/runtime-foundation/demo-mode/demoModeSelectors";
import { evaluateMVPProductionReadinessGate } from "../../lib/runtime-foundation/launch-gate/productionReadinessGateEngine";
import { selectLatestMVPProductionReadinessGate } from "../../lib/runtime-foundation/launch-gate/productionReadinessGateSelectors";
import { selectLatestPilotLearningSnapshot } from "../../lib/runtime-foundation/feedback-loop/pilotFeedbackSelectors";
import { selectLatestMVPFinalHardeningSnapshot } from "../../lib/runtime-foundation/final-hardening/finalHardeningSelectors";
import { selectLatestFinalMVPCompletionSnapshot } from "../../lib/runtime-foundation/final-mvp/finalMVPCompletionSelectors";
import type { MVPReadinessDashboardProps } from "./mvpReadinessDashboardTypes";
import { deriveMVPReadinessStatus, summarizeExecutiveReadiness } from "./mvpReadinessDashboardUtils";
import { MVPPilotFeedbackCaptureCard } from "./MVPPilotFeedbackCaptureCard";

function toneColor(tone: "neutral" | "positive" | "caution" | "risk"): string {
  switch (tone) {
    case "positive":
      return nx.success;
    case "caution":
      return nx.warning;
    case "risk":
      return nx.risk;
    default:
      return nx.muted;
  }
}

function statusAccent(status: string): string {
  switch (status) {
    case "mvp_ready":
      return nx.success;
    case "stable":
      return nx.accent;
    case "monitored":
      return nx.warning;
    default:
      return nx.risk;
  }
}

function FinalMVPCompletionSummaryBlock(props: {
  organizationId: string;
}): React.ReactElement | null {
  const snapshot = selectLatestFinalMVPCompletionSnapshot(props.organizationId);
  if (!snapshot) return null;

  return (
    <div
      style={{
        marginTop: 8,
        paddingTop: 8,
        borderTop: `1px solid ${nx.divider}`,
      }}
      data-nx-publish-ready={snapshot.publishReadyStatus}
    >
      <div
        style={{
          fontSize: 8,
          fontWeight: 700,
          color: nx.lowMuted,
          textTransform: "uppercase",
        }}
      >
        D9 MVP completion (dev)
      </div>
      <div style={{ marginTop: 4, fontSize: 10, fontWeight: 700, color: nx.textStrong }}>
        {snapshot.executivePublishReadiness.headline}
      </div>
      <div style={{ marginTop: 4, fontSize: 9, color: nx.textSoft, lineHeight: 1.4 }}>
        {snapshot.summary}
      </div>
      {snapshot.risks[0] ? (
        <div style={{ marginTop: 4, fontSize: 9, color: nx.warning, lineHeight: 1.4 }}>
          Risk: {snapshot.risks[0]}
        </div>
      ) : null}
      <div style={{ marginTop: 4, fontSize: 9, color: nx.textSoft, lineHeight: 1.4 }}>
        Next: {snapshot.recommendedNextAction}
      </div>
    </div>
  );
}

function FinalHardeningSummaryBlock(props: { organizationId: string }): React.ReactElement | null {
  const snapshot = selectLatestMVPFinalHardeningSnapshot(props.organizationId);
  if (!snapshot) return null;

  return (
    <div
      style={{
        marginTop: 8,
        paddingTop: 8,
        borderTop: `1px solid ${nx.divider}`,
      }}
    >
      <div
        style={{
          fontSize: 8,
          fontWeight: 700,
          color: nx.lowMuted,
          textTransform: "uppercase",
        }}
      >
        MVP final hardening (dev)
      </div>
      <div style={{ marginTop: 4, fontSize: 10, fontWeight: 700, color: nx.textStrong }}>
        Release candidate: {snapshot.releaseCandidateStatus}
      </div>
      <div style={{ marginTop: 4, fontSize: 9, color: nx.textSoft, lineHeight: 1.4 }}>
        {snapshot.summary}
      </div>
      <div style={{ marginTop: 4, fontSize: 9, color: nx.textSoft }}>
        {snapshot.checklist.passedCount} pass · {snapshot.checklist.warningCount} warn ·{" "}
        {snapshot.checklist.failedCount} fail · {snapshot.checklist.blockedCount} blocked
      </div>
      {snapshot.recommendedNextChecks[0] ? (
        <div style={{ marginTop: 4, fontSize: 9, color: nx.textSoft, lineHeight: 1.4 }}>
          Next: {snapshot.recommendedNextChecks[0]}
        </div>
      ) : null}
    </div>
  );
}

function PilotLearningSummaryBlock(props: { organizationId: string }): React.ReactElement | null {
  const snapshot = selectLatestPilotLearningSnapshot(props.organizationId);
  if (!snapshot) return null;

  return (
    <div
      style={{
        marginTop: 8,
        paddingTop: 8,
        borderTop: `1px solid ${nx.divider}`,
      }}
    >
      <div
        style={{
          fontSize: 8,
          fontWeight: 700,
          color: nx.lowMuted,
          textTransform: "uppercase",
        }}
      >
        Pilot learning loop (dev)
      </div>
      <div style={{ marginTop: 4, fontSize: 10, fontWeight: 700, color: nx.textStrong }}>
        {snapshot.summary}
      </div>
      {snapshot.recommendations[0] ? (
        <div style={{ marginTop: 4, fontSize: 9, color: nx.textSoft, lineHeight: 1.4 }}>
          Priority: {snapshot.recommendations[0].summary}
        </div>
      ) : null}
    </div>
  );
}

function MVPReadinessDashboardComponent(props: MVPReadinessDashboardProps): React.ReactElement {
  const organizationId = props.organizationId?.trim() || "nexora-default";

  const model = useMemo(
    () =>
      summarizeExecutiveReadiness({
        organizationId,
        foundation: props.foundation ?? null,
        operational: props.operational ?? null,
        interaction: props.interaction ?? null,
      }),
    [organizationId, props.foundation, props.operational, props.interaction]
  );

  const demoPresentation = useMemo(() => {
    const stored = selectLatestMVPDemoModeState(organizationId);
    if (stored) return stored;
    if (!props.interaction) return null;

    const runtimeInput = {
      organizationId,
      foundation: props.foundation ?? null,
      operational: props.operational ?? null,
      interaction: props.interaction ?? null,
    };
    const readinessDashboardStatus = deriveMVPReadinessStatus(runtimeInput);
    const smokeTestSuite = runMVPSmokeTestSuite({
      organizationId,
      context: {
        organizationId,
        ...runtimeInput,
        foundationSnapshotCount: props.foundation ? 1 : 0,
        operationalSnapshotCount: props.operational ? 1 : 0,
        interactionSnapshotCount: props.interaction ? 1 : 0,
      },
    });
    const gate =
      selectLatestMVPProductionReadinessGate(organizationId) ??
      evaluateMVPProductionReadinessGate({
        organizationId,
        mvpStrategicReadinessSnapshot: props.foundation ?? null,
        operationalReliabilitySnapshot: props.operational ?? null,
        executiveInteractionStabilitySnapshot: props.interaction ?? null,
        smokeTestSuite,
        readinessDashboardStatus,
      }).gate;

    if (!gate) return null;

    return evaluateMVPDemoMode({
      organizationId,
      productionReadinessGate: gate,
      mvpStrategicReadinessSnapshot: props.foundation ?? null,
      operationalReliabilitySnapshot: props.operational ?? null,
      executiveInteractionStabilitySnapshot: props.interaction ?? null,
      smokeTestSuite,
      readinessDashboardStatus,
    }).demoMode;
  }, [organizationId, props.foundation, props.operational, props.interaction]);

  const launchGate = useMemo(() => {
    if (!props.showDevDetails) return null;
    const stored = selectLatestMVPProductionReadinessGate(organizationId);
    if (stored) return stored;
    if (!props.interaction) return null;
    const smokeTestSuite = runMVPSmokeTestSuite({
      organizationId,
      context: {
        organizationId,
        foundation: props.foundation ?? null,
        operational: props.operational ?? null,
        interaction: props.interaction ?? null,
        foundationSnapshotCount: props.foundation ? 1 : 0,
        operationalSnapshotCount: props.operational ? 1 : 0,
        interactionSnapshotCount: props.interaction ? 1 : 0,
      },
    });
    const result = evaluateMVPProductionReadinessGate({
      organizationId,
      mvpStrategicReadinessSnapshot: props.foundation ?? null,
      operationalReliabilitySnapshot: props.operational ?? null,
      executiveInteractionStabilitySnapshot: props.interaction ?? null,
      smokeTestSuite,
      readinessDashboardStatus: deriveMVPReadinessStatus({
        organizationId,
        foundation: props.foundation ?? null,
        operational: props.operational ?? null,
        interaction: props.interaction ?? null,
      }),
    });
    return result.gate;
  }, [
    props.showDevDetails,
    organizationId,
    props.foundation,
    props.operational,
    props.interaction,
  ]);

  const smokeSuite = useMemo(() => {
    if (!props.showDevDetails) return null;
    return runMVPSmokeTestSuite({
      organizationId,
      context: {
        organizationId,
        foundation: props.foundation ?? null,
        operational: props.operational ?? null,
        interaction: props.interaction ?? null,
        foundationSnapshotCount: props.foundation ? 1 : 0,
        operationalSnapshotCount: props.operational ? 1 : 0,
        interactionSnapshotCount: props.interaction ? 1 : 0,
      },
    });
  }, [
    props.showDevDetails,
    organizationId,
    props.foundation,
    props.operational,
    props.interaction,
  ]);

  return (
    <section
      className={props.className}
      data-nx-mvp-readiness={model.readinessStatus}
      data-nx-mvp-runtime-data={model.hasRuntimeData ? "true" : "false"}
      aria-label="MVP executive readiness and runtime health"
      style={{
        padding: "10px 12px",
        borderRadius: 8,
        border: `1px solid ${nx.border}`,
        background: nx.bgPanelSoft,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: nx.lowMuted,
            }}
          >
            MVP executive readiness
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              fontWeight: 800,
              color: statusAccent(model.readinessStatus),
              lineHeight: 1.35,
            }}
          >
            {model.runtimeHealth}
          </div>
        </div>
        {model.confidencePercent !== null ? (
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: nx.textSoft,
              whiteSpace: "nowrap",
            }}
          >
            {model.confidencePercent}% confidence
          </div>
        ) : null}
      </div>

      <p style={{ margin: "6px 0 0", fontSize: 10, color: nx.muted, lineHeight: 1.45 }}>
        {model.overallHeadline}
      </p>

      <div
        style={{
          marginTop: 8,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "6px 10px",
        }}
      >
        {model.healthItems.map((item) => (
          <div key={item.id}>
            <div style={{ fontSize: 8, fontWeight: 700, color: nx.lowMuted, textTransform: "uppercase" }}>
              {item.label}
            </div>
            <div
              style={{
                marginTop: 2,
                fontSize: 10,
                fontWeight: 700,
                color: toneColor(item.tone),
                lineHeight: 1.3,
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {demoPresentation && demoPresentation.demoState !== "disabled" ? (
        <div
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: `1px solid ${nx.divider}`,
          }}
          data-nx-demo-state={demoPresentation.demoState}
        >
          <div
            style={{
              fontSize: 8,
              fontWeight: 700,
              color: nx.lowMuted,
              textTransform: "uppercase",
            }}
          >
            Executive demo readiness
          </div>
          <div style={{ marginTop: 4, fontSize: 10, fontWeight: 700, color: nx.textStrong }}>
            {formatDemoStateLabel(demoPresentation.demoState)}
          </div>
          <div style={{ marginTop: 4, fontSize: 9, color: nx.textSoft, lineHeight: 1.4 }}>
            {demoPresentation.summary}
          </div>
          {demoPresentation.demoRisks[0] ? (
            <div style={{ marginTop: 4, fontSize: 9, color: nx.warning, lineHeight: 1.4 }}>
              {demoPresentation.demoRisks[0].summary}
            </div>
          ) : null}
          <div style={{ marginTop: 4, fontSize: 8, color: nx.lowMuted, lineHeight: 1.4 }}>
            {demoPresentation.executiveNarrative.caution}
          </div>
        </div>
      ) : null}

      <div
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: `1px solid ${nx.divider}`,
        }}
      >
        <div style={{ fontSize: 8, fontWeight: 700, color: nx.lowMuted, textTransform: "uppercase" }}>
          Current risk
        </div>
        <div style={{ marginTop: 2, fontSize: 10, fontWeight: 600, color: nx.textStrong }}>
          {model.currentRisk}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 8,
            fontWeight: 700,
            color: nx.lowMuted,
            textTransform: "uppercase",
          }}
        >
          Recommended next check
        </div>
        <div style={{ marginTop: 2, fontSize: 10, color: nx.textSoft, lineHeight: 1.4 }}>
          {model.recommendedNextCheck}
        </div>
      </div>

      {props.showDevDetails && launchGate ? (
        <div
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: `1px solid ${nx.divider}`,
          }}
        >
          <div
            style={{
              fontSize: 8,
              fontWeight: 700,
              color: nx.lowMuted,
              textTransform: "uppercase",
            }}
          >
            Executive launch decision (dev)
          </div>
          <div style={{ marginTop: 4, fontSize: 10, fontWeight: 700, color: nx.textStrong }}>
            {launchGate.launchRecommendation.headline}
          </div>
          <div style={{ marginTop: 4, fontSize: 9, color: nx.textSoft, lineHeight: 1.4 }}>
            {launchGate.summary}
          </div>
          {launchGate.recommendedNextChecks[0] ? (
            <div style={{ marginTop: 4, fontSize: 9, color: nx.textSoft, lineHeight: 1.4 }}>
              Next: {launchGate.recommendedNextChecks[0]}
            </div>
          ) : null}
        </div>
      ) : null}

      {props.showDevDetails && demoPresentation ? (
        <div
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: `1px solid ${nx.divider}`,
          }}
        >
          <div
            style={{
              fontSize: 8,
              fontWeight: 700,
              color: nx.lowMuted,
              textTransform: "uppercase",
            }}
          >
            Controlled pilot summary (dev)
          </div>
          <div style={{ marginTop: 4, fontSize: 10, fontWeight: 700, color: nx.textStrong }}>
            {demoPresentation.controlledPilotPresentation.summary}
          </div>
          {demoPresentation.executiveNarrative.flow.map((step) => (
            <div key={step} style={{ marginTop: 2, fontSize: 9, color: nx.textSoft }}>
              · {step}
            </div>
          ))}
        </div>
      ) : null}

      {props.showDevDetails && smokeSuite ? (
        <div
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: `1px solid ${nx.divider}`,
          }}
        >
          <div
            style={{
              fontSize: 8,
              fontWeight: 700,
              color: nx.lowMuted,
              textTransform: "uppercase",
            }}
          >
            MVP smoke validation (dev)
          </div>
          <div style={{ marginTop: 4, fontSize: 10, fontWeight: 700, color: nx.textStrong }}>
            {smokeSuite.passed} pass · {smokeSuite.warned} warn · {smokeSuite.failed} fail ·{" "}
            {smokeSuite.skipped} skipped
          </div>
          {smokeSuite.recommendations[0] ? (
            <div style={{ marginTop: 4, fontSize: 9, color: nx.textSoft, lineHeight: 1.4 }}>
              {smokeSuite.recommendations[0]}
            </div>
          ) : null}
        </div>
      ) : null}

      {props.showPilotFeedback || props.showDevDetails ? (
        <MVPPilotFeedbackCaptureCard organizationId={organizationId} />
      ) : null}

      {props.showDevDetails ? (
        <PilotLearningSummaryBlock organizationId={organizationId} />
      ) : null}

      {props.showDevDetails ? (
        <FinalHardeningSummaryBlock organizationId={organizationId} />
      ) : null}

      {props.showDevDetails ? (
        <FinalMVPCompletionSummaryBlock organizationId={organizationId} />
      ) : null}

      {props.showDevDetails && model.signals.length > 0 ? (
        <ul
          style={{
            margin: "8px 0 0",
            paddingLeft: 14,
            fontSize: 9,
            color: nx.textSoft,
            lineHeight: 1.4,
          }}
        >
          {model.signals.map((signal) => (
            <li key={signal.signalId}>
              <strong>{signal.label}:</strong> {signal.summary}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export const MVPReadinessDashboard = memo(MVPReadinessDashboardComponent);
