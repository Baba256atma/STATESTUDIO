"use client";

import { useCallback, useMemo, useState } from "react";
import type { NexoraMVPAdvisorContextBridge } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import type { NexoraMVPPresentationViewModel } from "@/app/lib/nex-mvp/nexoraMVPPresentationState";
import type { NexoraMVPInteractionSubject } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import {
  applyNexoraMVPIntelligenceResolution,
  deriveNexoraMVPExecutiveIntelligenceContext,
  resolveNexoraMVPExecutiveIntelligence,
  type NexoraMVPIntelligenceAction,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveIntelligence";
import { ExecutiveAdvisorHeader } from "../exs1/advisor/ExecutiveAdvisorHeader";
import { ExecutiveResizablePanel } from "../exs1/shell/ExecutiveResizablePanel";
import { cockpit } from "../exs1/shell/executiveCockpitTheme";
import type { ExecutiveAdvisorTab } from "../exs1/shell/executiveCockpitTypes";
import { NexoraAdvisorView } from "./intelligence/NexoraAdvisorView";
import { NexoraInsightView } from "./intelligence/NexoraInsightView";

type Props = {
  readonly tab: ExecutiveAdvisorTab;
  readonly onTabChange: (tab: ExecutiveAdvisorTab) => void;
  readonly advisorBridge: NexoraMVPAdvisorContextBridge;
  readonly presentationViewModel: NexoraMVPPresentationViewModel;
  readonly focusedSubject: NexoraMVPInteractionSubject | null;
  readonly selectedSubject: NexoraMVPInteractionSubject | null;
  readonly onIntelligenceAction: (action: NexoraMVPIntelligenceAction) => void;
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
}: Props) {
  const [width, setWidth] = useState(320);
  const [collapsed, setCollapsed] = useState(false);

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
    return (
      applyNexoraMVPIntelligenceResolution({
        currentContextKey: context.contextKey,
        resolution,
      }) ?? resolution
    );
  }, [
    advisorBridge,
    focusedSubject,
    presentationViewModel,
    selectedSubject,
  ]);

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
        data-intelligence-key={intelligence.contextKey}
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

          {tab === "Assist" ? (
            <NexoraAdvisorView
              viewModel={intelligence.advisor}
              onAction={onIntelligenceAction}
            />
          ) : (
            <NexoraInsightView viewModel={intelligence.insight} />
          )}
        </div>
      </aside>
    </ExecutiveResizablePanel>
  );
}
