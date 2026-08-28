"use client";

import type { CSSProperties } from "react";
import type {
  NexoraMVPAdvisorViewModel,
  NexoraMVPIntelligenceAction,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveIntelligence";
import {
  composeNexoraProfessionalAdvisorPresentation,
  type NexoraProfessionalAdvisorAction,
  type NexoraProfessionalAdvisorNarrative,
} from "@/app/lib/nex-mvp/nexoraMVPProfessionalAdvisorPresentation";
import type { NexoraExecutiveIntelligenceExperience } from "@/app/lib/nex-mvp/nexoraExecutiveIntelligenceExperience";
import type {
  NexoraExi4OptionCard,
  NexoraExi4OptionLine,
} from "@/app/lib/nex-mvp/nexoraExecutiveIntelligenceExperienceExi4";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly viewModel: NexoraMVPAdvisorViewModel;
  readonly onAction: (action: NexoraMVPIntelligenceAction) => void;
  /** UX:1 — hide duplicate Next actions when Next Action panel is already shown. */
  readonly deferActions?: boolean;
  /** UX:3 — composed executive narrative. Falls back to view-model composition. */
  readonly narrative?: NexoraProfessionalAdvisorNarrative;
  readonly intelligenceExperience?: NexoraExecutiveIntelligenceExperience | null;
  readonly onExecuteNextBestAction?: (actionId: string) => void;
};

function sectionLabelStyle(): CSSProperties {
  return {
    margin: 0,
    fontSize: "0.62rem",
    letterSpacing: "0.04em",
    color: cockpit.lowMuted,
    fontWeight: 550,
  };
}

function bodyStyle(): CSSProperties {
  return {
    margin: "0.28rem 0 0",
    fontSize: cockpit.type.body.size,
    color: cockpit.textSoft,
    lineHeight: 1.45,
  };
}

function stateLabel(value: string | null): string | null {
  if (value == null) return null;
  const normalized = value.toLowerCase();
  if (
    normalized === "watch" ||
    normalized === "risk" ||
    normalized === "important" ||
    normalized === "critical" ||
    normalized === "elevated"
  ) {
    return "Needs Attention";
  }
  if (normalized === "under review") return "Decision Required";
  if (normalized === "planned" || normalized.startsWith("planned")) {
    return "Planned";
  }
  if (normalized === "in progress" || normalized.startsWith("in progress")) {
    return "In Progress";
  }
  if (normalized.startsWith("paused")) return "Paused";
  if (normalized === "complete") return "Complete";
  return null;
}

function evidenceLabel(
  state: NexoraProfessionalAdvisorNarrative["evidenceState"],
): string {
  switch (state) {
    case "strong":
      return "Evidence strong";
    case "limited":
      return "Evidence limited";
    case "incomplete":
      return "Data incomplete";
    case "stale":
      return "Data stale";
    default:
      return "No validated evidence";
  }
}

function disclosureSummaryStyle(): CSSProperties {
  return {
    cursor: "pointer",
    fontSize: "0.62rem",
    letterSpacing: "0.04em",
    color: cockpit.lowMuted,
    fontWeight: 550,
    listStyle: "none",
    textTransform: "uppercase",
  };
}

function optionLinePrefix(kind: NexoraExi4OptionLine["kind"]): string {
  if (kind === "benefit") return "+";
  if (kind === "risk" || kind === "constraint") return "!";
  if (kind === "missing") return "?";
  if (kind === "assumption") return "~";
  return "–";
}

function priorityHeading(experience: NexoraExecutiveIntelligenceExperience): string {
  const topId = experience.corePriorityAssessment.topPriority?.subjectId ?? null;
  const kind = experience.corePriorityAssessment.candidates.find((candidate) => candidate.subjectId === topId)?.eligibleKind;
  if (kind === "problem") return "Investigation Priority";
  if (kind === "risk") return "Risk Priority";
  if (kind === "opportunity") return "Opportunity Priority";
  if (kind === "decision") return "Decision Priority";
  return "Current Evidence Priority";
}

function renderOptionCards(cards: readonly NexoraExi4OptionCard[]) {
  if (cards.length === 0) return null;
  return (
    <ul
      data-testid="nexora-advisor-option-cards"
      data-exi4="option-cards"
      data-option-count={cards.length}
      style={{
        margin: "0.35rem 0 0",
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: "0.45rem",
      }}
    >
      {cards.map((card) => (
        <li
          key={card.optionId}
          data-testid={`nexora-advisor-option-card-${card.optionId}`}
          style={{
            fontSize: "0.72rem",
            color: cockpit.textSoft,
            lineHeight: 1.4,
          }}
        >
          <strong style={{ color: cockpit.text, fontWeight: 600 }}>
            {card.title}
          </strong>
          {card.lines.map((line) => (
            <p
              key={`${card.optionId}-${line.kind}-${line.text}`}
              data-option-line={line.kind}
              style={{
                margin: "0.12rem 0 0",
                color: line.kind === "missing" ? cockpit.muted : cockpit.textSoft,
              }}
            >
              {optionLinePrefix(line.kind)} {line.text}
            </p>
          ))}
        </li>
      ))}
    </ul>
  );
}

/**
 * UX:3 Professional Advisor — one executive narrative, not competing panels.
 */
export function NexoraAdvisorView({
  viewModel,
  onAction,
  deferActions = false,
  narrative,
  intelligenceExperience = null,
  onExecuteNextBestAction,
}: Props) {
  const composed =
    narrative ??
    composeNexoraProfessionalAdvisorPresentation({ advisor: viewModel });

  const subjectTitle = composed.isOverview
    ? "Executive Overview"
    : (composed.currentSubjectLabel ?? viewModel.subjectLabel ?? "Subject");
  const subtleState = composed.isOverview
    ? null
    : stateLabel(composed.currentSubjectState);

  const runAction = (action: NexoraProfessionalAdvisorAction) => {
    if (action.source === "nba") {
      onExecuteNextBestAction?.(action.id);
      return;
    }
    if (action.intelligenceAction) {
      onAction(action.intelligenceAction);
    }
  };

  const showPrimary = composed.primaryAction != null && deferActions !== true;
  const showSecondary =
    composed.secondaryActions.length > 0 && deferActions !== true;

  return (
    <div
      data-testid="nexora-advisor-view"
      data-ux3="professional-advisor"
      data-exi4="presentation"
      data-context-key={viewModel.contextKey}
      data-subject-id={composed.currentSubjectId ?? "none"}
      data-advisor-current-subject={composed.currentSubjectId ?? "none"}
      data-advisor-attention-subject={composed.attentionSubjectId ?? "none"}
      data-advisor-grammar={composed.grammarKind}
      data-recommendation-authority={composed.recommendationAuthority}
      data-evidence-state={composed.evidenceState}
      data-primary-action={composed.primaryAction?.id ?? "none"}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
      }}
    >
      <header>
        <p
          data-testid="nexora-advisor-view-title"
          style={{
            margin: 0,
            fontSize: "0.62rem",
            letterSpacing: "0.04em",
            color: cockpit.lowMuted,
            fontWeight: 550,
          }}
        >
          {composed.isOverview ? "Current Subject" : "Subject"}
        </p>
        <span style={cockpit.visuallyHidden}>{viewModel.title}</span>
        <p
          data-testid="nexora-advisor-view-context"
          style={cockpit.visuallyHidden}
        >
          {viewModel.contextLine}
        </p>
        <p
          data-testid="nexora-advisor-view-subject"
          style={{
            margin: "0.28rem 0 0",
            fontSize: "1.02rem",
            color: cockpit.text,
            fontWeight: 600,
            lineHeight: 1.25,
          }}
        >
          {subjectTitle}
        </p>
        {subtleState ? (
          <p
            data-testid="nexora-advisor-subject-state"
            style={{
              margin: "0.2rem 0 0",
              fontSize: "0.68rem",
              color: cockpit.warning,
              fontWeight: 500,
            }}
          >
            {subtleState}
          </p>
        ) : null}
      </header>

      {composed.isOverview &&
      intelligenceExperience?.presentation.topPriorityLabel ? (
        <section
          data-testid="nexora-advisor-top-priority"
          data-core-int4="priority"
          data-exi4="priority"
          style={{
            borderLeft: `2px solid ${cockpit.accent}`,
            paddingLeft: "0.55rem",
          }}
        >
          <p style={{ ...sectionLabelStyle(), color: cockpit.textSoft }}>
            {priorityHeading(intelligenceExperience)}
          </p>
          <p
            style={{
              margin: "0.28rem 0 0",
              fontSize: "0.92rem",
              color: cockpit.text,
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            {intelligenceExperience.presentation.topPriorityLabel}
          </p>
          {intelligenceExperience.presentation.topPriorityWhy ? (
            <p data-testid="nexora-advisor-priority-why" style={bodyStyle()}>
              {intelligenceExperience.presentation.topPriorityWhy}
            </p>
          ) : null}
        </section>
      ) : null}

      {composed.isOverview && composed.attentionSubjectLabel ? (
        <section data-testid="nexora-advisor-attention" data-exi4="attention">
          <p style={sectionLabelStyle()}>Needs Attention</p>
          <p
            data-testid="nexora-advisor-attention-subject"
            style={{
              margin: "0.28rem 0 0",
              fontSize: "0.82rem",
              color: cockpit.textSoft,
              fontWeight: 500,
            }}
          >
            {composed.attentionSubjectLabel}
          </p>
          {composed.attentionReason ? (
            <p style={bodyStyle()}>{composed.attentionReason}</p>
          ) : null}
        </section>
      ) : null}

      {composed.situation ? (
        <section data-testid="nexora-advisor-situation">
          <p style={sectionLabelStyle()}>
            {intelligenceExperience?.presentation.situationTitle ??
              composed.headings.situation}
          </p>
          <p data-testid="nexora-advisor-observation" style={bodyStyle()}>
            {composed.situation}
          </p>
        </section>
      ) : null}

      {composed.whyItMatters ? (
        <section data-testid="nexora-advisor-why">
          <p style={sectionLabelStyle()}>{composed.headings.why}</p>
          <p style={bodyStyle()}>{composed.whyItMatters}</p>
        </section>
      ) : null}

      {composed.decisionRequired ? (
        <section data-testid="nexora-advisor-decision-required">
          <p style={sectionLabelStyle()}>Decision Required</p>
          <p style={bodyStyle()}>{composed.decisionRequired}</p>
        </section>
      ) : null}

      {intelligenceExperience?.presentation.optionSummary &&
      !composed.isOverview ? (
        <section
          data-testid="nexora-advisor-option-summary"
          data-exi4="options"
        >
          <p style={sectionLabelStyle()}>Options</p>
          <p style={bodyStyle()}>
            {intelligenceExperience.presentation.optionSummary}
          </p>
        </section>
      ) : null}

      {intelligenceExperience?.presentation.contributorStatement &&
      !composed.isOverview ? (
        <details
          data-testid="nexora-advisor-contributors"
          data-exi2="cause"
          data-core-int3="cause"
          data-exi4="contributors"
        >
          <summary style={disclosureSummaryStyle()}>
            {intelligenceExperience.presentation.contributorTitle}
          </summary>
          <p style={bodyStyle()}>
            {intelligenceExperience.presentation.contributorStatement}
          </p>
        </details>
      ) : null}

      {intelligenceExperience?.presentation.constraintStatement &&
      !composed.isOverview ? (
        <details
          data-testid="nexora-advisor-constraint"
          data-exi2="constraint"
          data-core-int3="constraint"
          data-exi4="constraints"
        >
          <summary style={disclosureSummaryStyle()}>
            {intelligenceExperience.presentation.constraintTitle}
          </summary>
          <p style={bodyStyle()}>
            {intelligenceExperience.presentation.constraintStatement}
          </p>
          {intelligenceExperience.presentation.bindingUnknownNote ? (
            <p style={bodyStyle()}>
              {intelligenceExperience.presentation.bindingUnknownNote}
            </p>
          ) : null}
        </details>
      ) : null}

      {intelligenceExperience &&
      !composed.isOverview &&
      intelligenceExperience.presentation.optionCards.length > 0 &&
      intelligenceExperience.tradeoffs.authority !== "missing" ? (
        <details
          data-testid="nexora-advisor-tradeoffs"
          data-exi2="tradeoff"
          data-core-int5="reader"
          data-exi3={
            intelligenceExperience.presentation.comparable
              ? "comparison"
              : "single-option"
          }
          data-exi4="tradeoffs"
        >
          <summary style={disclosureSummaryStyle()}>Trade-offs</summary>
          {intelligenceExperience.presentation.optionCards.length > 0
            ? renderOptionCards(intelligenceExperience.presentation.optionCards)
            : intelligenceExperience.tradeoffs.statement
              ? <p style={bodyStyle()}>{intelligenceExperience.tradeoffs.statement}</p>
              : null}
        </details>
      ) : null}

      {composed.grammarKind === "scenario" && composed.assumptions.length > 0 ? (
        <details data-testid="nexora-advisor-assumptions">
          <summary style={disclosureSummaryStyle()}>Assumptions</summary>
          <ul
            style={{
              margin: "0.28rem 0 0",
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
            }}
          >
            {composed.assumptions.map((item) => (
              <li
                key={item}
                style={{ fontSize: "0.74rem", color: cockpit.textSoft, lineHeight: 1.4 }}
              >
                {item}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {composed.recommendation ? (
        <section
          data-testid="nexora-advisor-recommendation"
          data-exi4="recommendation"
        >
          <p style={sectionLabelStyle()}>
            {intelligenceExperience?.presentation.recommendationTitle ??
              composed.headings.recommendation}
          </p>
          <p
            style={{
              margin: "0.32rem 0 0",
              fontSize: "0.92rem",
              color: cockpit.text,
              fontWeight: 600,
              lineHeight: 1.35,
            }}
          >
            {composed.recommendation}
          </p>
          {composed.recommendationRationale ? (
            <p data-testid="nexora-advisor-rationale" style={bodyStyle()}>
              {composed.recommendationRationale}
            </p>
          ) : null}
        </section>
      ) : composed.noRecommendationReason ? (
        <section data-testid="nexora-advisor-empty">
          <p style={sectionLabelStyle()}>
            {intelligenceExperience?.presentation.recommendationTitle ??
              composed.headings.recommendation}
          </p>
          <p
            style={{
              margin: "0.28rem 0 0",
              fontSize: "0.82rem",
              color: cockpit.text,
              fontWeight: 600,
            }}
          >
            No recommendation yet
          </p>
          <p style={bodyStyle()}>{composed.noRecommendationReason}</p>
        </section>
      ) : null}

      {composed.evidenceSummary &&
      composed.evidenceState !== "strong" &&
      !(composed.isOverview && composed.evidenceState === "none") ? (
        <p
          data-testid="nexora-advisor-evidence"
          role="status"
          style={{
            margin: 0,
            fontSize: "0.72rem",
            color: cockpit.muted,
            lineHeight: 1.4,
          }}
        >
          {evidenceLabel(composed.evidenceState)}.{" "}
          {composed.evidenceState === "limited" ||
          composed.evidenceState === "incomplete" ||
          composed.evidenceState === "none"
            ? composed.evidenceSummary.replace(/^[^.]+\.\s*/, "")
            : composed.evidenceSummary}
        </p>
      ) : composed.evidenceState === "strong" ? (
        <p
          data-testid="nexora-advisor-evidence"
          style={{
            margin: 0,
            fontSize: "0.68rem",
            color: cockpit.lowMuted,
          }}
        >
          {evidenceLabel(composed.evidenceState)}
        </p>
      ) : null}

      {intelligenceExperience && !composed.isOverview ? (
        <span
          data-testid="nexora-advisor-epistemic"
          data-core-int2="epistemic"
          data-exi4="epistemic"
          data-epistemic-observation={
            intelligenceExperience.epistemicFoundation.observation?.claim.type ??
            "none"
          }
          data-epistemic-interpretation={
            intelligenceExperience.epistemicFoundation.interpretation?.claim
              .type ?? "none"
          }
          data-epistemic-prediction={
            intelligenceExperience.epistemicFoundation.prediction?.claim.type ??
            "none"
          }
          style={cockpit.visuallyHidden}
        >
          {intelligenceExperience.presentation.confidenceLabel}
        </span>
      ) : null}

      {composed.recentChange ? (
        <section data-testid="nexora-advisor-recent-change">
          <p style={sectionLabelStyle()}>Recent Change</p>
          <p style={bodyStyle()}>{composed.recentChange}</p>
        </section>
      ) : null}

      {showPrimary || showSecondary ? (
        <div
          data-testid="nexora-advisor-actions"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          {showPrimary && composed.primaryAction ? (
            <>
              <p style={sectionLabelStyle()}>{composed.headings.nextAction}</p>
              <button
                key={composed.primaryAction.id}
                type="button"
                data-testid={`nexora-advisor-action-${composed.primaryAction.id}`}
                data-advisor-action-priority="primary"
                onClick={() => runAction(composed.primaryAction!)}
                style={{
                  textAlign: "left",
                  border: `1px solid ${cockpit.accent}`,
                  background: "rgba(56, 120, 180, 0.16)",
                  color: cockpit.text,
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  borderRadius: cockpit.radius.sm,
                  padding: "0.5rem 0.6rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {composed.primaryAction.label}
              </button>
            </>
          ) : null}
          {showSecondary ? (
            <div
              data-testid="nexora-advisor-secondary-actions"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.15rem",
              }}
            >
              {composed.secondaryActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  data-testid={`nexora-advisor-action-${action.id}`}
                  data-advisor-action-priority="secondary"
                  onClick={() => runAction(action)}
                  style={{
                    textAlign: "left",
                    border: "none",
                    background: "transparent",
                    color: cockpit.muted,
                    fontSize: "0.7rem",
                    padding: "0.22rem 0.1rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : composed.primaryAction == null && !composed.isOverview ? (
        <p
          data-testid="nexora-advisor-no-action"
          style={{ margin: 0, fontSize: "0.72rem", color: cockpit.muted }}
        >
          No recommended action is available for this context.
        </p>
      ) : null}

      {intelligenceExperience && !composed.isOverview ? (
        <details
          data-testid="nexora-advisor-outcome-learning"
          data-exi5="outcome-learning"
        >
          <summary style={disclosureSummaryStyle()}>Outcome and Learning</summary>
          <p style={bodyStyle()}>
            Expected: {intelligenceExperience.outcomeLearning.expectedOutcome}
          </p>
          <p style={bodyStyle()}>
            Observed: {intelligenceExperience.outcomeLearning.actualOutcome}
          </p>
          <p style={bodyStyle()}>
            {intelligenceExperience.outcomeLearning.outcomeAssessment}
          </p>
          <p style={bodyStyle()}>
            {intelligenceExperience.outcomeLearning.learningStatement}
          </p>
          <p style={bodyStyle()}>
            {intelligenceExperience.outcomeLearning.confidenceStatement}
          </p>
          <p style={bodyStyle()}>
            {intelligenceExperience.outcomeLearning.causalStatement}
          </p>
          <p style={bodyStyle()}>
            {intelligenceExperience.outcomeLearning.historicalStatement}
          </p>
        </details>
      ) : null}

      {intelligenceExperience && !composed.isOverview ? (
        <details data-testid="nexora-advisor-more-detail" data-exi4="details">
          <summary style={disclosureSummaryStyle()}>Details</summary>
          {intelligenceExperience.presentation.showFactVsInterpretation ? (
            <section data-testid="nexora-advisor-observed-interpretation">
              {intelligenceExperience.presentation.observed ? (
                <p style={bodyStyle()}>
                  Observed: {intelligenceExperience.presentation.observed}
                </p>
              ) : null}
              {intelligenceExperience.presentation.interpretation ? (
                <p style={bodyStyle()}>
                  Interpretation:{" "}
                  {intelligenceExperience.presentation.interpretation}
                </p>
              ) : null}
            </section>
          ) : null}
          {intelligenceExperience.presentation.missingNotes.length > 0 ? (
            <section data-testid="nexora-advisor-missing-dimensions">
              <p style={sectionLabelStyle()}>Missing evidence</p>
              <ul
                style={{
                  margin: "0.28rem 0 0",
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {intelligenceExperience.presentation.missingNotes.map((note) => (
                  <li
                    key={note}
                    style={{
                      fontSize: "0.7rem",
                      color: cockpit.muted,
                      lineHeight: 1.4,
                    }}
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {intelligenceExperience.presentation.rootCauseNote ? (
            <p data-testid="nexora-advisor-root-cause-note" style={bodyStyle()}>
              {intelligenceExperience.presentation.rootCauseNote}
            </p>
          ) : null}
          <p
            data-testid="nexora-advisor-confidence"
            style={{
              margin: "0.35rem 0 0",
              fontSize: "0.68rem",
              color: cockpit.lowMuted,
            }}
          >
            {intelligenceExperience.presentation.confidenceLabel}
          </p>
        </details>
      ) : composed.tradeoffs.length > 0 || viewModel.warning ? (
        <details data-testid="nexora-advisor-more-detail">
          <summary style={disclosureSummaryStyle()}>Details</summary>
          {composed.tradeoffs.length > 0 ? (
            <ul
              style={{
                margin: "0.35rem 0 0",
                padding: 0,
                listStyle: "none",
              }}
            >
              {composed.tradeoffs.map((item) => (
                <li
                  key={item}
                  style={{
                    fontSize: "0.7rem",
                    color: cockpit.textSoft,
                    lineHeight: 1.4,
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </details>
      ) : null}
    </div>
  );
}
