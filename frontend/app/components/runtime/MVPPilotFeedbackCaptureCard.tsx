"use client";

import type React from "react";
import { memo, useCallback, useState } from "react";

import { nx } from "../ui/nexoraTheme";
import {
  evaluatePilotFeedbackLearningLoop,
  submitMVPPilotFeedback,
} from "../../lib/runtime-foundation/feedback-loop/pilotFeedbackEngine";
import { selectLatestPilotLearningSnapshot } from "../../lib/runtime-foundation/feedback-loop/pilotFeedbackSelectors";

export type MVPPilotFeedbackCaptureCardProps = {
  organizationId?: string;
  className?: string;
  onSubmitted?: () => void;
};

function MVPPilotFeedbackCaptureCardComponent(
  props: MVPPilotFeedbackCaptureCardProps
): React.ReactElement {
  const organizationId = props.organizationId?.trim() || "nexora-default";
  const [whatConfusedYou, setWhatConfusedYou] = useState("");
  const [whatFeltValuable, setWhatFeltValuable] = useState("");
  const [whatShouldImprove, setWhatShouldImprove] = useState("");
  const [pilotNotes, setPilotNotes] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [learningSummary, setLearningSummary] = useState<string | null>(null);

  const handleSubmit = useCallback(() => {
    const result = submitMVPPilotFeedback({
      organizationId,
      capture: { whatConfusedYou, whatFeltValuable, whatShouldImprove, pilotNotes },
    });

    if (!result.submitted) {
      setStatusMessage(
        result.reason === "duplicate_feedback"
          ? "Feedback already recorded."
          : "Add at least one note before submitting."
      );
      return;
    }

    evaluatePilotFeedbackLearningLoop({ organizationId });
    const snapshot = selectLatestPilotLearningSnapshot(organizationId);
    setLearningSummary(snapshot?.summary ?? null);
    setStatusMessage("Pilot feedback captured. Thank you.");
    setWhatConfusedYou("");
    setWhatFeltValuable("");
    setWhatShouldImprove("");
    setPilotNotes("");
    props.onSubmitted?.();
  }, [
    organizationId,
    whatConfusedYou,
    whatFeltValuable,
    whatShouldImprove,
    pilotNotes,
    props,
  ]);

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    marginTop: 4,
    padding: "6px 8px",
    fontSize: 10,
    borderRadius: 4,
    border: `1px solid ${nx.divider}`,
    background: "transparent",
    color: nx.textStrong,
    resize: "vertical",
  };

  return (
    <section
      className={props.className}
      aria-label="MVP pilot feedback capture"
      style={{
        padding: "10px 12px",
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
        Pilot feedback (controlled)
      </div>
      <p style={{ margin: "6px 0 0", fontSize: 9, color: nx.textSoft, lineHeight: 1.4 }}>
        Optional, bounded notes for MVP iteration. Do not enter passwords or personal identifiers.
      </p>

      <label style={{ display: "block", marginTop: 8, fontSize: 9, color: nx.textSoft }}>
        What confused you?
        <textarea
          value={whatConfusedYou}
          onChange={(e) => setWhatConfusedYou(e.target.value)}
          rows={2}
          maxLength={280}
          style={fieldStyle}
        />
      </label>

      <label style={{ display: "block", marginTop: 6, fontSize: 9, color: nx.textSoft }}>
        What felt valuable?
        <textarea
          value={whatFeltValuable}
          onChange={(e) => setWhatFeltValuable(e.target.value)}
          rows={2}
          maxLength={280}
          style={fieldStyle}
        />
      </label>

      <label style={{ display: "block", marginTop: 6, fontSize: 9, color: nx.textSoft }}>
        What should improve?
        <textarea
          value={whatShouldImprove}
          onChange={(e) => setWhatShouldImprove(e.target.value)}
          rows={2}
          maxLength={280}
          style={fieldStyle}
        />
      </label>

      <label style={{ display: "block", marginTop: 6, fontSize: 9, color: nx.textSoft }}>
        Pilot notes
        <textarea
          value={pilotNotes}
          onChange={(e) => setPilotNotes(e.target.value)}
          rows={2}
          maxLength={280}
          style={fieldStyle}
        />
      </label>

      <button
        type="button"
        onClick={handleSubmit}
        style={{
          marginTop: 8,
          padding: "6px 10px",
          fontSize: 10,
          fontWeight: 700,
          borderRadius: 4,
          border: `1px solid ${nx.divider}`,
          background: "transparent",
          color: nx.textStrong,
          cursor: "pointer",
        }}
      >
        Submit pilot feedback
      </button>

      {statusMessage ? (
        <div style={{ marginTop: 6, fontSize: 9, color: nx.textSoft }}>{statusMessage}</div>
      ) : null}

      {learningSummary ? (
        <div style={{ marginTop: 6, fontSize: 9, color: nx.textSoft, lineHeight: 1.4 }}>
          {learningSummary}
        </div>
      ) : null}
    </section>
  );
}

export const MVPPilotFeedbackCaptureCard = memo(MVPPilotFeedbackCaptureCardComponent);
