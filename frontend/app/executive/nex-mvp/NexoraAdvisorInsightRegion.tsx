"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { NexoraMVPAdvisorContextBridge } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import type { NexoraMVPPresentationViewModel } from "@/app/lib/nex-mvp/nexoraMVPPresentationState";
import type { NexoraMVPInteractionSubject } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import type { DataRealityAwareAdvisorBindingResult } from "@/app/lib/data-reality/dataRealityAwareAdvisorExperienceBinding";
import type { ExecutiveSourceAdvisorContext } from "@/app/lib/data-reality/executiveSourceIntelligence";
import {
  acknowledgeProactiveAdvisorBrief,
  deliverProactiveAdvisorBrief,
  dismissProactiveAdvisorBrief,
  getNextProactiveAdvisorBrief,
  getProactiveAdvisorDeliveryVersion,
  subscribeProactiveAdvisorDelivery,
  type NexoraProactiveAdvisorBrief,
} from "@/app/lib/data-reality/proactiveAdvisorDelivery";
import {
  applyNexoraMVPIntelligenceResolution,
  deriveNexoraMVPExecutiveIntelligenceContext,
  resolveNexoraMVPExecutiveIntelligence,
  type NexoraMVPIntelligenceAction,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveIntelligence";
import { applyDataRealityAwareAdvisorBindingToAdvisorViewModel } from "@/app/lib/nex-mvp/nexoraMVPDataRealityAwareAdvisorExperience";
import {
  composeNexoraProfessionalAdvisorPresentation,
  type NexoraProfessionalAdvisorAction,
} from "@/app/lib/nex-mvp/nexoraMVPProfessionalAdvisorPresentation";
import {
  applyNexoraExecutiveIntelligenceExperienceToAdvisor,
  composeNexoraExecutiveIntelligenceExperience,
  projectNexoraExiConversationalAnswers,
} from "@/app/lib/nex-mvp/nexoraExecutiveIntelligenceExperience";
import {
  freezeNexoraConversationalActionDescriptor,
  type NexoraConversationalActionDescriptor,
} from "@/app/lib/conversational-control/conversationalActionDescriptor";
import { ExecutiveAdvisorHeader } from "../exs1/advisor/ExecutiveAdvisorHeader";
import { ExecutiveResizablePanel } from "../exs1/shell/ExecutiveResizablePanel";
import { cockpit } from "../exs1/shell/executiveCockpitTheme";
import type { ExecutiveAdvisorTab } from "../exs1/shell/executiveCockpitTypes";
import { NexoraAdvisorView } from "./intelligence/NexoraAdvisorView";
import { NexoraInsightView } from "./intelligence/NexoraInsightView";
import { NexoraExecutiveDecisionBriefPanel } from "./intelligence/NexoraExecutiveDecisionBriefPanel";
import { NexoraExecutiveDecisionMemoryPanel } from "./intelligence/NexoraExecutiveDecisionMemoryPanel";
import { NexoraExecutivePreparationPanel } from "./intelligence/NexoraExecutivePreparationPanel";
import { resolveExecutiveHvcAdvisorPanelVisibility } from "@/app/lib/spatial-presentation/executiveStageHumanVisualCertification";
import { NexoraConversationalExperience } from "./NexoraConversationalExperience";
import type {
  NexoraConversationalAdvisorGrounding,
  NexoraConversationalExperienceTrace,
  NexoraConversationalMessage,
} from "@/app/lib/conversational-control/conversationalExperience";
import type {
  NexoraMVPFlowDecisionRecord,
  NexoraMVPFlowExecutionRecord,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlowFixtures";
import type { NexoraDecisionRuntimeAdapter } from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter";

type Props = {
  readonly tab: ExecutiveAdvisorTab;
  readonly onTabChange: (tab: ExecutiveAdvisorTab) => void;
  readonly advisorBridge: NexoraMVPAdvisorContextBridge;
  readonly presentationViewModel: NexoraMVPPresentationViewModel;
  readonly focusedSubject: NexoraMVPInteractionSubject | null;
  readonly selectedSubject: NexoraMVPInteractionSubject | null;
  readonly onIntelligenceAction: (action: NexoraMVPIntelligenceAction) => void;
  /** STAGE-PROD:3 — execute NBA via existing navigation/collection handlers. */
  readonly onExecuteNextBestAction?: (actionId: string) => void;
  /** STAGE-PROD:4 — Brief option → semantic focus. */
  readonly onSelectBriefOption?: (objectId: string) => void;
  /** Optional P2:4 binding from shared P2:2 runtime truth. */
  readonly advisorRealityBinding?: DataRealityAwareAdvisorBindingResult;
  /** RDI:3 structured canonical source/comparison evidence for Advisor. */
  readonly sourceIntelligenceContext?: ExecutiveSourceAdvisorContext | null;
  readonly onReturnToDataSource?: () => void;
  /** True only when an explicit validated RDI dataset is active. */
  readonly validatedDataSource?: boolean;
  /** PM:4 — explicit user follow-up through the existing Advisor context. */
  readonly onProactiveInvestigate?: (brief: NexoraProactiveAdvisorBrief) => void;
  /** PM:4 — explicit user navigation; proactive delivery never changes focus. */
  readonly onProactiveViewOnStage?: (subjectId: string) => void;
  /** CC:5 — conversational experience surface. */
  readonly conversationalMessages?: readonly NexoraConversationalMessage[];
  readonly conversationalProcessing?: boolean;
  readonly conversationalContextLabel?: string | null;
  readonly conversationalLastTrace?: NexoraConversationalExperienceTrace | null;
  readonly onSubmitConversationalUtterance?: (utterance: string) => void;
  readonly onConversationalAdvisorGroundingChange?: (
    grounding: NexoraConversationalAdvisorGrounding,
  ) => void;
  readonly onBeginDailyPreparation?: () => void;
  readonly onBeginMeetingPreparation?: () => void;
  readonly flowDecisions?: readonly NexoraMVPFlowDecisionRecord[];
  readonly flowExecutions?: readonly NexoraMVPFlowExecutionRecord[];
  readonly decisionRuntime?: NexoraDecisionRuntimeAdapter | null;
};

function projectConversationalAction(
  action: NexoraProfessionalAdvisorAction,
  nextBestAction: NexoraMVPAdvisorContextBridge["nextBestAction"],
): NexoraConversationalActionDescriptor {
  if (action.source === "nba") {
    const nbaAction =
      nextBestAction?.recommendedAction?.id === action.id
        ? nextBestAction.recommendedAction
        : nextBestAction?.alternativeActions.find(
            (candidate) => candidate.id === action.id,
          );
    return freezeNexoraConversationalActionDescriptor({
      actionId: action.id,
      label: action.label,
      actionKind: nbaAction?.targetObjectId
        ? "navigate-subject"
        : nbaAction?.targetCollection
          ? "open-collection"
          : "information",
      targetSubjectId: nbaAction?.targetObjectId ?? null,
      targetCollection: nbaAction?.targetCollection ?? null,
      sourceCapability: "next-best-action",
      consequenceLevel: "none",
    });
  }

  return freezeNexoraConversationalActionDescriptor({
    actionId: action.id,
    label: action.label,
    actionKind:
      action.intelligenceAction?.kind === "select-subject"
        ? "navigate-subject"
        : "information",
    targetSubjectId: action.intelligenceAction?.targetSubjectId ?? null,
    targetCollection: null,
    sourceCapability: "advisor-intelligence",
    consequenceLevel: "none",
  });
}

/**
 * NEX-MVP:7 — Advisor / Insight intelligence region.
 * Presents context-aware guidance; does not own executive authority.
 */
export function NexoraAdvisorInsightRegion({
  tab,
  onTabChange,
  advisorBridge,
  presentationViewModel,
  focusedSubject,
  selectedSubject,
  onIntelligenceAction,
  onExecuteNextBestAction,
  onSelectBriefOption,
  advisorRealityBinding,
  validatedDataSource = false,
  sourceIntelligenceContext = null,
  onReturnToDataSource,
  onProactiveInvestigate,
  onProactiveViewOnStage,
  conversationalMessages = Object.freeze([]),
  conversationalProcessing = false,
  conversationalContextLabel = null,
  conversationalLastTrace = null,
  onSubmitConversationalUtterance,
  onConversationalAdvisorGroundingChange,
  onBeginDailyPreparation,
  onBeginMeetingPreparation,
  flowDecisions,
  flowExecutions,
  decisionRuntime,
}: Props) {
  const [width, setWidth] = useState(320);
  const [collapsed, setCollapsed] = useState(false);
  useSyncExternalStore(
    subscribeProactiveAdvisorDelivery,
    getProactiveAdvisorDeliveryVersion,
    () => 0,
  );
  const proactiveBrief = getNextProactiveAdvisorBrief(advisorBridge.activeWorkspace);

  useEffect(() => {
    if (
      proactiveBrief?.status === "queued" &&
      !conversationalProcessing &&
      sourceIntelligenceContext == null
    ) {
      deliverProactiveAdvisorBrief(
        proactiveBrief.workspaceId,
        proactiveBrief.briefId,
        new Date().toISOString(),
      );
    }
  }, [conversationalProcessing, proactiveBrief, sourceIntelligenceContext]);

  const onToggleCollapse = useCallback(() => {
    setCollapsed((value) => !value);
  }, []);

  const intelligence = useMemo(() => {
    const context = deriveNexoraMVPExecutiveIntelligenceContext({
      advisorBridge,
      presentationViewModel,
      focusedSubject,
      selectedSubject,
      breadcrumb: advisorBridge.breadcrumb,
    });
    const resolution = resolveNexoraMVPExecutiveIntelligence(context);
    const applied =
      applyNexoraMVPIntelligenceResolution({
        currentContextKey: context.contextKey,
        resolution,
      }) ?? resolution;

    const advisor = advisorRealityBinding
      ? applyDataRealityAwareAdvisorBindingToAdvisorViewModel(
          applied.advisor,
          advisorRealityBinding,
        )
      : applied.advisor;

    const composed = composeNexoraProfessionalAdvisorPresentation({
      advisor,
      insight: applied.insight,
      intelligence: context,
      advisorBridge,
      nextBestAction: advisorBridge.nextBestAction,
      decisionBrief: advisorBridge.decisionBrief,
      decisionMemory: advisorBridge.decisionMemory,
      advisorBinding: advisorRealityBinding ?? null,
      validatedDataSource,
    });
    const experience = composeNexoraExecutiveIntelligenceExperience({
      narrative: composed,
      presentationMode: advisorBridge.presentationMode,
      liveOutcomeAvailable: false,
      liveLearningAvailable: false,
      cc11Live: false,
      validatedDataSource,
      advisorBinding: advisorRealityBinding ?? null,
      flowDecisions,
      flowExecutions,
      decisionRuntime: decisionRuntime ?? null,
    });
    const narrative = applyNexoraExecutiveIntelligenceExperienceToAdvisor(
      composed,
      experience,
    );

    return Object.freeze({
      ...applied,
      advisor,
      context,
      narrative,
      experience,
    });
  }, [
    advisorBridge,
    advisorRealityBinding,
    focusedSubject,
    presentationViewModel,
    selectedSubject,
    validatedDataSource,
    flowDecisions,
    flowExecutions,
    decisionRuntime,
  ]);

  useEffect(() => {
    const availableActions = [
      ...(intelligence.narrative.primaryAction
        ? [intelligence.narrative.primaryAction]
        : []),
      ...intelligence.narrative.secondaryActions,
    ].map((action) =>
      projectConversationalAction(action, advisorBridge.nextBestAction),
    );
    onConversationalAdvisorGroundingChange?.(
      Object.freeze({
        isOverview: intelligence.narrative.isOverview,
        currentSubjectId: intelligence.narrative.currentSubjectId,
        currentSubjectLabel: intelligence.narrative.currentSubjectLabel,
        attentionSubjectId: intelligence.narrative.attentionSubjectId,
        attentionSubjectLabel: intelligence.narrative.attentionSubjectLabel,
        attentionReason: intelligence.narrative.attentionReason,
        situation: intelligence.narrative.situation,
        whyItMatters: intelligence.narrative.whyItMatters,
        recommendation: intelligence.narrative.recommendation,
        noRecommendationReason:
          intelligence.narrative.noRecommendationReason,
        primaryActionLabel: intelligence.narrative.primaryAction?.label ?? null,
        evidenceState: intelligence.narrative.evidenceState,
        evidenceSummary: intelligence.narrative.evidenceSummary,
        recommendationAuthority:
          intelligence.narrative.recommendationAuthority,
        primaryAction: availableActions[0] ?? null,
        availableActions: Object.freeze(availableActions),
        experienceAnswers: projectNexoraExiConversationalAnswers(
          intelligence.experience,
        ),
      }),
    );
  }, [
    advisorBridge.nextBestAction,
    intelligence,
    onConversationalAdvisorGroundingChange,
  ]);

  const advisorPanels = useMemo(
    () =>
      resolveExecutiveHvcAdvisorPanelVisibility({
        presentationMode:
          advisorBridge.presentationMode === "collection" ||
          advisorBridge.presentationMode === "preparation" ||
          advisorBridge.presentationMode === "overview" ||
          advisorBridge.presentationMode === "object-focus"
            ? advisorBridge.presentationMode
            : "overview",
        subjectKind: advisorBridge.subjectKind,
        preparationActive: advisorBridge.presentationMode === "preparation",
        nbaAvailable:
          advisorBridge.nextBestAction?.recommendedAction != null &&
          advisorBridge.nextBestAction.eligible === true,
        briefEligible:
          advisorBridge.decisionBrief?.available === true &&
          advisorBridge.decisionBrief.eligible === true,
        memoryAvailable: advisorBridge.decisionMemory?.available === true,
      }),
    [advisorBridge],
  );

  return (
    <ExecutiveResizablePanel
      width={width}
      minWidth={cockpit.advisorMin}
      maxWidth={cockpit.advisorMax}
      collapsed={collapsed}
      collapsedWidth={cockpit.advisorCollapsedWidth}
      onWidthChange={setWidth}
      testId="executive-advisor-panel"
      style={{
        background: `linear-gradient(180deg, ${cockpit.panel} 0%, ${cockpit.navy} 100%)`,
        borderLeft: `1px solid ${cockpit.border}`,
        transition: collapsed
          ? `width 180ms ${cockpit.motion.easing}`
          : `width 220ms ${cockpit.motion.easing}`,
      }}
    >
      <aside
        data-testid="nexora-advisor-insight-region"
        data-mvp-surface="advisor"
        data-nex-mvp="7"
        data-advisor-tab={tab}
        data-ux3="professional-advisor"
        data-exi="1"
        data-exi2="grounded"
        data-exi3="live-comparison"
        data-exi4="presentation"
        data-core-int2="epistemic"
        data-core-int3="causal-constraint"
        data-core-int4="priority"
        data-core-out1="outcome"
        data-core-int4-ranked={
          intelligence.experience.corePriorityAssessment.topPriority
            ? "true"
            : "false"
        }
        data-core-int3-binding={
          intelligence.experience.coreConstraintAssessment.bindingConstraint
            ? "known"
            : "unknown"
        }
        data-epistemic-kind={
          intelligence.experience.epistemicFoundation.observation?.claim.type ??
          intelligence.experience.epistemicFoundation.focusedClaimId
        }
        data-epistemic-claim={
          intelligence.experience.epistemicFoundation.focusedClaimId
        }
        data-exi-workflow={intelligence.experience.workflowPosition}
        data-exi-collection={intelligence.experience.isCollection ? "true" : "false"}
        data-advisor-subject={advisorBridge.advisorSubjectId ?? "none"}
        data-advisor-current-subject={intelligence.narrative.currentSubjectId ?? "none"}
        data-advisor-attention-subject={
          intelligence.narrative.attentionSubjectId ?? "none"
        }
        data-advisor-kind={advisorBridge.subjectKind ?? "none"}
        data-advisor-mode={advisorBridge.interactionMode}
        data-advisor-grammar={intelligence.narrative.grammarKind}
        data-advisor-presentation={presentationViewModel.state}
        data-mo1="advisor-reader"
        data-mo2="advisor-reader"
        data-mo3="advisor-reader"
        data-mo4="advisor-reader"
        data-mo5="advisor-reader"
        data-mo6="advisor-reader"
        data-mo-int1="advisor-reader"
        data-mo1-active-object-id={
          advisorBridge.advisorSubjectId ??
          advisorBridge.focusedSubject?.id ??
          "none"
        }
        data-nba-subject={advisorBridge.nbaSubjectId ?? "none"}
        data-nba-recommended={
          advisorBridge.nextBestAction?.recommendedAction?.kind ?? "none"
        }
        data-brief-subject={advisorBridge.briefSubjectId ?? "none"}
        data-brief-completeness={
          advisorBridge.decisionBrief?.completeness ?? "unavailable"
        }
        data-memory-decision={
          advisorBridge.decisionMemorySubjectId ?? "none"
        }
        data-memory-available={
          advisorBridge.decisionMemory?.available === true ? "true" : "false"
        }
        data-intelligence-key={intelligence.contextKey}
        data-data-reality-advisor-binding={
          advisorRealityBinding?.identity.identity ?? "none"
        }
        aria-label="Nexora Advisor"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <ExecutiveAdvisorHeader
          tab={tab}
          onTabChange={onTabChange}
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
        />

        <div
          role="tabpanel"
          data-testid={`executive-advisor-${tab.toLowerCase()}`}
          data-ux1-region="nexora-advisor"
          aria-hidden={collapsed}
          style={{
            display: collapsed ? "none" : "flex",
            flex: 1,
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <div
            data-testid="nexora-advisor-scan-region"
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: "0.75rem",
              padding: "0.7rem 1rem 0.5rem",
              overflow: "auto",
              minHeight: 0,
            }}
          >
            <div
              data-testid="nexora-advisor-context"
              style={cockpit.visuallyHidden}
            >
              <p>Active context</p>
              <p data-testid="nexora-advisor-bridge-summary">
                {advisorBridge.activeWorkspace} ·{" "}
                {advisorBridge.presentationState} ·{" "}
                {advisorBridge.environmentIntent}
              </p>
              <p data-testid="nexora-advisor-bridge-subject">
                {intelligence.narrative.isOverview
                  ? "overview · Executive Overview"
                  : `${intelligence.narrative.currentSubjectKind ?? "subject"} · ${
                      intelligence.narrative.currentSubjectLabel ?? "Subject"
                    }`}
              </p>
            </div>

            {sourceIntelligenceContext ? (
              <details
                data-testid="nexora-rdi3-advisor-context"
                data-rdi3-context-kind={sourceIntelligenceContext.contextKind}
                data-memory-policy={sourceIntelligenceContext.memoryPolicy}
                style={{
                  order: 5,
                  color: cockpit.textSoft,
                  fontSize: "0.62rem",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    color: cockpit.lowMuted,
                    listStyle: "none",
                  }}
                >
                  Data update
                </summary>
                <strong style={{ display: "block", marginTop: "0.35rem", color: cockpit.text, fontSize: "0.72rem" }}>
                  {sourceIntelligenceContext.title}
                </strong>
                <p style={{ margin: "0.3rem 0 0", color: cockpit.textSoft, fontSize: "0.66rem", lineHeight: 1.45 }}>
                  {sourceIntelligenceContext.summary}
                </p>
                <p style={{ margin: "0.32rem 0 0", color: cockpit.lowMuted, fontSize: "0.56rem", overflowWrap: "anywhere" }}>
                  {sourceIntelligenceContext.sourceIds.length} source{sourceIntelligenceContext.sourceIds.length === 1 ? "" : "s"}
                </p>
                {onReturnToDataSource ? (
                  <button
                    type="button"
                    data-testid="nexora-data-source-return"
                    onClick={onReturnToDataSource}
                    style={{
                      marginTop: "0.4rem",
                      border: `1px solid ${cockpit.border}`,
                      borderRadius: cockpit.radius.sm,
                      background: "transparent",
                      color: cockpit.accent,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: "0.6rem",
                      padding: "0.28rem 0.4rem",
                    }}
                  >
                    Back to {sourceIntelligenceContext.title}
                  </button>
                ) : null}
              </details>
            ) : null}

            {proactiveBrief?.status === "delivered" ? (
              <details
                data-testid="nexora-pm4-proactive-brief"
                data-pm4-priority={proactiveBrief.priority}
                data-pm4-status={proactiveBrief.status}
                style={{
                  order: 5,
                  color: cockpit.textSoft,
                  fontSize: "0.62rem",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    color:
                      proactiveBrief.priority === "urgent"
                        ? "#fca5a5"
                        : cockpit.lowMuted,
                    listStyle: "none",
                  }}
                >
                  Recent Change · {proactiveBrief.headline}
                </summary>
                <span style={cockpit.visuallyHidden}>NEXORA DETECTED · {proactiveBrief.priority}</span>
                <p style={{ margin: "0.32rem 0 0", color: cockpit.textSoft, fontSize: "0.66rem", lineHeight: 1.45 }}>
                  {proactiveBrief.summary}
                </p>

                <p style={{ margin: "0.62rem 0 0.24rem", color: cockpit.lowMuted, fontSize: "0.56rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Current facts
                </p>
                <ul style={{ margin: 0, paddingLeft: "1rem", color: cockpit.text, fontSize: "0.62rem", lineHeight: 1.5 }}>
                  {proactiveBrief.currentFacts.map((fact) => <li key={fact}>{fact}</li>)}
                </ul>

                {proactiveBrief.historicalContext.length > 0 ? (
                  <>
                    <p style={{ margin: "0.58rem 0 0.24rem", color: cockpit.lowMuted, fontSize: "0.56rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Relevant history
                    </p>
                    {proactiveBrief.historicalContext.map((history) => (
                      <p key={history.memoryId} style={{ margin: "0.18rem 0 0", color: cockpit.textSoft, fontSize: "0.6rem", lineHeight: 1.4 }}>
                        {history.summary}
                      </p>
                    ))}
                  </>
                ) : null}

                <details style={{ marginTop: "0.58rem", color: cockpit.textSoft, fontSize: "0.59rem" }}>
                  <summary style={{ cursor: "pointer", color: cockpit.text }}>Evidence</summary>
                  {proactiveBrief.evidence.map((entry) => (
                    <p key={entry.evidenceId} style={{ margin: "0.3rem 0 0", lineHeight: 1.4 }}>
                      {entry.statement} · {entry.currentObservationId}
                    </p>
                  ))}
                </details>

                <p style={{ margin: "0.58rem 0 0.24rem", color: cockpit.lowMuted, fontSize: "0.56rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Suggested next question
                </p>
                <p style={{ margin: 0, color: cockpit.textSoft, fontSize: "0.61rem", lineHeight: 1.4 }}>
                  {proactiveBrief.suggestedNextQuestions[0]}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.68rem" }}>
                  <button type="button" onClick={() => onProactiveInvestigate?.(proactiveBrief)} style={{ fontSize: "0.59rem" }}>Investigate</button>
                  <button type="button" onClick={() => onProactiveViewOnStage?.(proactiveBrief.subjectIds[0]!)} style={{ fontSize: "0.59rem" }}>View on Stage</button>
                  <button type="button" onClick={() => acknowledgeProactiveAdvisorBrief(proactiveBrief.workspaceId, proactiveBrief.briefId, new Date().toISOString())} style={{ fontSize: "0.59rem" }}>Acknowledge</button>
                  <button type="button" onClick={() => dismissProactiveAdvisorBrief(proactiveBrief.workspaceId, proactiveBrief.briefId, new Date().toISOString())} style={{ fontSize: "0.59rem" }}>Dismiss</button>
                </div>
              </details>
            ) : null}

            {advisorBridge.presentationMode === "preparation" ? null : tab === "Assist" ? (
              <NexoraAdvisorView
                viewModel={intelligence.advisor}
                narrative={intelligence.narrative}
                intelligenceExperience={intelligence.experience}
                onAction={onIntelligenceAction}
                onExecuteNextBestAction={onExecuteNextBestAction}
              />
            ) : (
              <NexoraInsightView viewModel={intelligence.insight} />
            )}

            {advisorPanels.brief ? (
              <details data-testid="nexora-advisor-brief-disclosure">
                <summary
                  style={{
                    cursor: "pointer",
                    fontSize: "0.62rem",
                    color: cockpit.lowMuted,
                    listStyle: "none",
                  }}
                >
                  Decision Brief
                </summary>
                <NexoraExecutiveDecisionBriefPanel
                  decisionBrief={advisorBridge.decisionBrief}
                  onSelectOptionObject={(objectId) => {
                    onSelectBriefOption?.(objectId);
                  }}
                  onExecuteRecommendation={(actionId) => {
                    onExecuteNextBestAction?.(actionId);
                  }}
                />
              </details>
            ) : null}

            {advisorPanels.memory ? (
              <details data-testid="nexora-advisor-memory-disclosure">
                <summary
                  style={{
                    cursor: "pointer",
                    fontSize: "0.56rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: cockpit.lowMuted,
                    listStyle: "none",
                  }}
                >
                  Recent Change
                </summary>
                <NexoraExecutiveDecisionMemoryPanel
                  decisionMemory={advisorBridge.decisionMemory}
                />
              </details>
            ) : null}

            {advisorPanels.preparation ? (
              <NexoraExecutivePreparationPanel
                preparationContext={advisorBridge.preparationContext}
                presentationMode={advisorBridge.presentationMode}
              />
            ) : null}

            {onBeginDailyPreparation || onBeginMeetingPreparation ? (
              <details
                data-testid="nexora-preparation-triggers"
                data-stage-prod="6"
                style={{ marginTop: "0.15rem" }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontSize: "0.56rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: cockpit.lowMuted,
                    listStyle: "none",
                  }}
                >
                  Prepare
                </summary>
                <div
                  style={{
                    display: "flex",
                    gap: "0.35rem",
                    padding: "0.4rem 0 0.1rem",
                    alignItems: "center",
                  }}
                >
                  {onBeginDailyPreparation ? (
                    <button
                      type="button"
                      data-testid="nexora-prepare-daily"
                      onClick={onBeginDailyPreparation}
                      style={{
                        border: `1px solid ${cockpit.border}`,
                        background: "transparent",
                        color: cockpit.muted,
                        fontSize: "0.58rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        padding: "0.2rem 0.45rem",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Daily
                    </button>
                  ) : null}
                  {onBeginMeetingPreparation ? (
                    <button
                      type="button"
                      data-testid="nexora-prepare-meeting"
                      onClick={onBeginMeetingPreparation}
                      style={{
                        border: `1px solid ${cockpit.border}`,
                        background: "transparent",
                        color: cockpit.muted,
                        fontSize: "0.58rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        padding: "0.2rem 0.45rem",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Meeting
                    </button>
                  ) : null}
                </div>
              </details>
            ) : null}
          </div>

          {onSubmitConversationalUtterance ? (
            <div
              data-testid="nexora-advisor-ask"
              style={{
                flexShrink: 0,
                padding: "0.15rem 1rem 0.85rem",
                borderTop: `1px solid ${cockpit.border}`,
                background: cockpit.navy,
              }}
            >
              <NexoraConversationalExperience
                messages={conversationalMessages}
                processing={conversationalProcessing}
                contextLabel={conversationalContextLabel}
                lastTrace={conversationalLastTrace}
                onSubmitUtterance={onSubmitConversationalUtterance}
              />
            </div>
          ) : null}
        </div>
      </aside>
    </ExecutiveResizablePanel>
  );
}

