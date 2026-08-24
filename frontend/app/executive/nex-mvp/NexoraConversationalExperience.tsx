"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cockpit } from "../exs1/shell/executiveCockpitTheme";
import { NexoraConversationalInput } from "./NexoraConversationalInput";
import type { NexoraConversationalMessage } from "@/app/lib/conversational-control/conversationalExperience";
import type { NexoraConversationalExperienceTrace } from "@/app/lib/conversational-control/conversationalExperience";

type Props = {
  readonly messages: readonly NexoraConversationalMessage[];
  readonly processing: boolean;
  readonly contextLabel?: string | null;
  readonly lastTrace?: NexoraConversationalExperienceTrace | null;
  readonly onSubmitUtterance: (utterance: string) => void;
};

/**
 * CC:5 — compact Advisor conversational experience surface.
 * Stage remains primary; this is secondary control/advisory feedback.
 */
export function NexoraConversationalExperience({
  messages,
  processing,
  contextLabel,
  lastTrace,
  onSubmitUtterance,
}: Props) {
  const [localGuard, setLocalGuard] = useState(false);
  const messageLogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const log = messageLogRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, processing]);

  const onSubmit = useCallback(
    (utterance: string) => {
      if (processing || localGuard) return;
      setLocalGuard(true);
      try {
        onSubmitUtterance(utterance);
      } finally {
        // Parent owns processing; release local guard on next tick.
        queueMicrotask(() => setLocalGuard(false));
      }
    },
    [localGuard, onSubmitUtterance, processing],
  );

  return (
    <section
      data-testid="nexora-conversational-experience"
      data-cc5="conversational-experience"
      data-processing={processing ? "true" : "false"}
      data-experience-status={lastTrace?.experienceStatus ?? ""}
      data-intent-kind={lastTrace?.intentKind ?? ""}
      data-context-status={lastTrace?.contextStatus ?? ""}
      data-command-kind={lastTrace?.commandKind ?? ""}
      data-runtime-status={lastTrace?.runtimeStatus ?? ""}
      data-primary-subject={lastTrace?.primarySubjectId ?? ""}
      data-pending-turn-kind={lastTrace?.pendingTurnExpectationKind ?? ""}
      data-pending-turn-resolution={
        lastTrace?.pendingTurnResolutionStatus ?? ""
      }
      data-mo1-active-object-id={lastTrace?.managerObjectId ?? ""}
      data-mo1-intent={lastTrace?.managerObjectIntent ?? ""}
      data-mo2-engine={lastTrace?.explainEngineId ?? ""}
      data-mo2-subject={lastTrace?.managerObjectId ?? ""}
      data-mo2-intent={lastTrace?.managerObjectIntent ?? ""}
      data-mo2-focus={lastTrace?.explanationFocus ?? ""}
      data-mo2-depth={lastTrace?.explanationDepth ?? ""}
      data-mo2-epistemic={lastTrace?.explanationEpistemic ?? ""}
      data-mo2-summary={lastTrace?.explanationSummary ?? ""}
      data-mo3-engine={lastTrace?.explorationEngineId ?? ""}
      data-mo3-state={lastTrace?.explorationState ?? ""}
      data-mo3-recommended={lastTrace?.recommendedPathLabel ?? ""}
      data-mo3-recommended-kind={lastTrace?.recommendedPathKind ?? ""}
      data-mo3-recommended-target={lastTrace?.recommendedPathTarget ?? ""}
      data-mo4-engine={lastTrace?.navigationEngineId ?? ""}
      data-mo4-goal={lastTrace?.goalTitle ?? ""}
      data-mo4-source={lastTrace?.goalSource ?? ""}
      data-mo4-direction={lastTrace?.navigationDirection ?? ""}
      data-mo4-target={lastTrace?.navigationPathTarget ?? ""}
      data-mo5-engine={lastTrace?.journeyEngineId ?? ""}
      data-mo5-phase={lastTrace?.journeyPhase ?? ""}
      data-mo5-state={lastTrace?.journeyState ?? ""}
      data-mo5-blocker={lastTrace?.journeyBlocker ?? ""}
      data-mo6-engine={lastTrace?.attentionEngineId ?? ""}
      data-mo6-state={lastTrace?.attentionState ?? ""}
      data-mo6-primary={lastTrace?.attentionPrimary ?? ""}
      data-mo6-intervention={lastTrace?.attentionIntervention ?? ""}
      data-mo6-steals-focus="false"
      data-mo-int1-engine={lastTrace?.experienceIntegrationId ?? ""}
      data-mo-int1-lane={lastTrace?.experienceLane ?? ""}
      data-nlu-communicative-intent={lastTrace?.nluCommunicativeIntent ?? ""}
      data-nlu-operation={lastTrace?.nluRequestedOperation ?? ""}
      data-nlu-subject={lastTrace?.nluSubject ?? ""}
      data-nlu-question-type={lastTrace?.nluQuestionType ?? ""}
      data-nlu-confidence={lastTrace?.nluConfidence ?? ""}
      data-nlu-ambiguity={lastTrace?.nluAmbiguity === true ? "true" : "false"}
      data-nlu-authority={lastTrace?.nluAuthority ?? ""}
      data-continuity-provenance={lastTrace?.continuityProvenance ?? ""}
      data-continuity-move={lastTrace?.continuityMove ?? ""}
      data-continuity-subject={lastTrace?.continuitySubject ?? ""}
      data-continuity-active={lastTrace?.continuityActiveSubject ?? ""}
      aria-label="Nexora conversational control"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
        marginTop: "0.55rem",
        minHeight: 0,
      }}
    >
      {contextLabel ? (
        <div
          data-testid="nexora-conversational-context-cue"
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: cockpit.muted,
          }}
        >
          Context: {contextLabel}
        </div>
      ) : null}

      <div
        ref={messageLogRef}
        data-testid="nexora-conversational-messages"
        role="log"
        aria-live="polite"
        aria-busy={processing}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          maxHeight: "9.5rem",
          overflowY: "auto",
          paddingRight: "0.15rem",
        }}
      >
        {messages.length === 0 ? (
          <p
            style={{
              margin: 0,
              fontSize: "0.72rem",
              color: cockpit.muted,
              lineHeight: 1.35,
            }}
          >
            Tell Nexora what to focus on, or ask it to go back / return to
            overview.
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              data-testid={`nexora-conversational-message-${message.role}`}
              data-message-status={message.status ?? ""}
              style={{
                fontSize: "0.74rem",
                lineHeight: 1.35,
                color: message.role === "nexora" ? cockpit.text : cockpit.muted,
              }}
            >
              <span
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginRight: "0.35rem",
                  color: cockpit.muted,
                }}
              >
                {message.role === "manager" ? "Manager" : "Nexora"}
              </span>
              {message.text}
            </div>
          ))
        )}
        {processing ? (
          <div
            data-testid="nexora-conversational-thinking"
            style={{
              fontSize: "0.7rem",
              lineHeight: 1.35,
              color: cockpit.muted,
            }}
          >
            Nexora is thinking…
          </div>
        ) : null}
      </div>

      <NexoraConversationalInput
        disabled={processing || localGuard}
        onSubmit={onSubmit}
      />
    </section>
  );
}
