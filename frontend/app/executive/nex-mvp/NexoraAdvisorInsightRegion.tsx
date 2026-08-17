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
import { ExecutiveAdvisorHeader } from "../exs1/advisor/ExecutiveAdvisorHeader";
import { ExecutiveResizablePanel } from "../exs1/shell/ExecutiveResizablePanel";
import { cockpit } from "../exs1/shell/executiveCockpitTheme";
import type { ExecutiveAdvisorTab } from "../exs1/shell/executiveCockpitTypes";
import { NexoraAdvisorView } from "./intelligence/NexoraAdvisorView";
import { NexoraInsightView } from "./intelligence/NexoraInsightView";
import { NexoraExecutiveNextBestActionPanel } from "./intelligence/NexoraExecutiveNextBestActionPanel";
import { NexoraExecutiveDecisionBriefPanel } from "./intelligence/NexoraExecutiveDecisionBriefPanel";
import { NexoraExecutiveDecisionMemoryPanel } from "./intelligence/NexoraExecutiveDecisionMemoryPanel";
import { NexoraExecutivePreparationPanel } from "./intelligence/NexoraExecutivePreparationPanel";
import { resolveExecutiveHvcAdvisorPanelVisibility } from "@/app/lib/spatial-presentation/executiveStageHumanVisualCertification";
import { NexoraConversationalExperience } from "./NexoraConversationalExperience";
import type {
  NexoraConversationalExperienceTrace,
  NexoraConversationalMessage,
} from "@/app/lib/conversational-control/conversationalExperience";

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
};

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
  sourceIntelligenceContext = null,
  onProactiveInvestigate,
  onProactiveViewOnStage,
  conversationalMessages = Object.freeze([]),
  conversationalProcessing = false,
  conversationalContextLabel = null,
  conversationalLastTrace = null,
  onSubmitConversationalUtterance,
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

    if (!advisorRealityBinding) {
      return applied;
    }

    return Object.freeze({
      ...applied,
      advisor: applyDataRealityAwareAdvisorBindingToAdvisorViewModel(
        applied.advisor,
        advisorRealityBinding,
      ),
    });
  }, [
    advisorBridge,
    advisorRealityBinding,
    focusedSubject,
    presentationViewModel,
    selectedSubject,
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
        data-advisor-subject={advisorBridge.focusedSubject?.id ?? "none"}
        data-advisor-kind={advisorBridge.subjectKind ?? "none"}
        data-advisor-mode={advisorBridge.interactionMode}
        data-advisor-presentation={presentationViewModel.state}
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
        aria-label="Advisor and Insight"
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
          aria-hidden={collapsed}
          style={{
            display: collapsed ? "none" : "flex",
            flex: 1,
            flexDirection: "column",
            gap: "0.85rem",
            padding: "0.85rem 1rem 1rem",
            overflow: "auto",
            minHeight: 0,
          }}
        >
          <div
            data-testid="nexora-advisor-context"
            style={{
              padding: "0.55rem 0.65rem",
              borderRadius: cockpit.radius.md,
              border: `1px solid ${cockpit.border}`,
              background: cockpit.panelSoft,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: cockpit.type.caption.size,
                letterSpacing: cockpit.type.caption.tracking,
                textTransform: "uppercase",
                color: cockpit.lowMuted,
              }}
            >
              Active context
            </p>
            <p
              data-testid="nexora-advisor-bridge-summary"
              style={{
                margin: "0.35rem 0 0",
                fontSize: "0.72rem",
                color: cockpit.text,
              }}
            >
              {advisorBridge.activeWorkspace} ·{" "}
              {advisorBridge.presentationState} ·{" "}
              {advisorBridge.environmentIntent}
            </p>
            <p
              data-testid="nexora-advisor-bridge-subject"
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.68rem",
                color: cockpit.textSoft,
              }}
            >
              {intelligence.advisor.subjectKind ?? "overview"} ·{" "}
              {intelligence.advisor.subjectLabel ?? "Overview"}
            </p>
          </div>

          {sourceIntelligenceContext ? (
            <section
              data-testid="nexora-rdi3-advisor-context"
              data-rdi3-context-kind={sourceIntelligenceContext.contextKind}
              data-memory-policy={sourceIntelligenceContext.memoryPolicy}
              style={{
                padding: "0.58rem 0.65rem",
                borderRadius: cockpit.radius.md,
                border: `1px solid ${cockpit.borderStrong}`,
                background: cockpit.accentSoft,
              }}
            >
              <p style={{ margin: 0, color: cockpit.accent, fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Source Intelligence Context
              </p>
              <strong style={{ display: "block", marginTop: "0.35rem", color: cockpit.text, fontSize: "0.72rem" }}>
                {sourceIntelligenceContext.title}
              </strong>
              <p style={{ margin: "0.3rem 0 0", color: cockpit.textSoft, fontSize: "0.66rem", lineHeight: 1.45 }}>
                {sourceIntelligenceContext.summary}
              </p>
              <p style={{ margin: "0.32rem 0 0", color: cockpit.lowMuted, fontSize: "0.56rem", overflowWrap: "anywhere" }}>
                Canonical evidence · {sourceIntelligenceContext.sourceIds.length} source{sourceIntelligenceContext.sourceIds.length === 1 ? "" : "s"} · current facts override history
              </p>
            </section>
          ) : null}

          {proactiveBrief?.status === "queued" ? (
            <div
              data-testid="nexora-pm4-proactive-queued"
              style={{ color: cockpit.textSoft, fontSize: "0.62rem" }}
            >
              1 new executive insight
            </div>
          ) : proactiveBrief?.status === "delivered" ? (
            <section
              data-testid="nexora-pm4-proactive-brief"
              data-pm4-priority={proactiveBrief.priority}
              data-pm4-status={proactiveBrief.status}
              style={{
                padding: "0.68rem",
                borderRadius: cockpit.radius.md,
                border: `1px solid ${proactiveBrief.priority === "urgent" ? "rgba(248,113,113,0.72)" : cockpit.borderStrong}`,
                background: proactiveBrief.priority === "urgent" ? "rgba(127,29,29,0.2)" : cockpit.accentSoft,
              }}
            >
              <p style={{ margin: 0, color: proactiveBrief.priority === "urgent" ? "#fca5a5" : cockpit.accent, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase" }}>
                NEXORA DETECTED · {proactiveBrief.priority}
              </p>
              <strong style={{ display: "block", marginTop: "0.38rem", color: cockpit.text, fontSize: "0.76rem" }}>
                {proactiveBrief.headline}
              </strong>
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
            </section>
          ) : null}

          {advisorPanels.preparation ? (
            <NexoraExecutivePreparationPanel
              preparationContext={advisorBridge.preparationContext}
              presentationMode={advisorBridge.presentationMode}
            />
          ) : null}

          {advisorPanels.memory ? (
            <NexoraExecutiveDecisionMemoryPanel
              decisionMemory={advisorBridge.decisionMemory}
            />
          ) : null}

          {advisorPanels.brief ? (
            <NexoraExecutiveDecisionBriefPanel
              decisionBrief={advisorBridge.decisionBrief}
              onSelectOptionObject={(objectId) => {
                onSelectBriefOption?.(objectId);
              }}
              onExecuteRecommendation={(actionId) => {
                onExecuteNextBestAction?.(actionId);
              }}
            />
          ) : null}

          {advisorPanels.nba ? (
            <NexoraExecutiveNextBestActionPanel
              nextBestAction={advisorBridge.nextBestAction}
              onExecuteAction={(actionId) => {
                onExecuteNextBestAction?.(actionId);
              }}
            />
          ) : null}

          {advisorBridge.presentationMode === "preparation" ? null : tab === "Assist" ? (
            <NexoraAdvisorView
              viewModel={intelligence.advisor}
              onAction={onIntelligenceAction}
            />
          ) : (
            <NexoraInsightView viewModel={intelligence.insight} />
          )}

          {onSubmitConversationalUtterance ? (
            <NexoraConversationalExperience
              messages={conversationalMessages}
              processing={conversationalProcessing}
              contextLabel={conversationalContextLabel}
              lastTrace={conversationalLastTrace}
              onSubmitUtterance={onSubmitConversationalUtterance}
            />
          ) : null}
        </div>
      </aside>
    </ExecutiveResizablePanel>
  );
}
