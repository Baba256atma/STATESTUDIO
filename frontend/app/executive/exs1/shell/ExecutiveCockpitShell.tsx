"use client";

import type { ReactNode } from "react";
import type {
  ExecutiveAdvisorTab,
  ExecutiveContextSnapshot,
  ExecutiveExplorerKind,
  ExecutiveFloatingPanelKind,
  ExecutiveNavId,
  ExecutiveThemeMode,
  ExecutiveTimelineLens,
} from "./executiveCockpitTypes";
import { cockpit } from "./executiveCockpitTheme";
import {
  ExecutiveAdvisorPanel,
  type ExecutiveAdvisorContent,
} from "./ExecutiveAdvisorPanel";
import { ExecutiveContextBar } from "./ExecutiveContextBar";
import { ExecutiveExplorerDrawer } from "./ExecutiveExplorerDrawer";
import { ExecutiveFloatingPanel } from "./ExecutiveFloatingPanel";
import { ExecutiveLeftNav } from "./ExecutiveLeftNav";
import { ExecutiveStageFrame } from "./ExecutiveStageFrame";
import { ExecutiveStatusBar } from "./ExecutiveStatusBar";
import {
  ExecutiveTimelineDock,
  type ExecutiveTimelinePack,
} from "./ExecutiveTimelineDock";

export type ExecutiveCockpitShellProps = {
  readonly context: ExecutiveContextSnapshot;
  readonly onThemeChange: (theme: ExecutiveThemeMode) => void;
  readonly activeNav: ExecutiveNavId;
  readonly onNavSelect: (nav: ExecutiveNavId) => void;
  readonly explorerKind: ExecutiveExplorerKind;
  readonly explorerWidth: number;
  readonly onExplorerWidthChange: (width: number) => void;
  readonly onExplorerClose: () => void;
  readonly explorerContent?: ReactNode;
  readonly stage: ReactNode;
  readonly stageOverlay?: ReactNode;
  readonly advisorTab: ExecutiveAdvisorTab;
  readonly onAdvisorTabChange: (tab: ExecutiveAdvisorTab) => void;
  readonly assist: ExecutiveAdvisorContent;
  readonly insight: ExecutiveAdvisorContent;
  readonly timelineLens: ExecutiveTimelineLens;
  readonly timelineHighlighted?: boolean;
  readonly packs: readonly ExecutiveTimelinePack[];
  readonly selectedPackId: string | null;
  readonly packHighlighted?: boolean;
  readonly onSelectLens: (lens: ExecutiveTimelineLens) => void;
  readonly onSelectPack: (packId: string) => void;
  readonly floatingKind: ExecutiveFloatingPanelKind;
  readonly onFloatingClose: () => void;
  readonly floatingContent?: ReactNode;
  readonly floatingTitle?: string;
  readonly onHelp?: () => void;
};

/**
 * ExecutiveCockpitShell — permanent Nexora Executive Cockpit foundation.
 * Freezes layout architecture for EXS-1 / EXS-2 / EXS-3+.
 * Pure UI composition — no runtime or business logic.
 */
export function ExecutiveCockpitShell({
  context,
  onThemeChange,
  activeNav,
  onNavSelect,
  explorerKind,
  explorerWidth,
  onExplorerWidthChange,
  onExplorerClose,
  explorerContent,
  stage,
  stageOverlay,
  advisorTab,
  onAdvisorTabChange,
  assist,
  insight,
  timelineLens,
  timelineHighlighted,
  packs,
  selectedPackId,
  packHighlighted,
  onSelectLens,
  onSelectPack,
  floatingKind,
  onFloatingClose,
  floatingContent,
  floatingTitle,
  onHelp,
}: ExecutiveCockpitShellProps) {
  return (
    <div
      data-testid="executive-cockpit-shell"
      data-exs1-compat="exs1-cockpit"
      data-exs="1.5"
      data-exs2="true"
      data-theme-mode={context.theme}
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: cockpit.bg,
        color: cockpit.text,
        fontFamily:
          'var(--font-geist-sans), "IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
        overflow: "hidden",
      }}
    >
      <ExecutiveContextBar context={context} onThemeChange={onThemeChange} />

      <div
        data-testid="executive-cockpit-body"
        style={{
          flex: "1 1 auto",
          display: "flex",
          minHeight: 0,
        }}
      >
        <ExecutiveLeftNav active={activeNav} onSelect={onNavSelect} />

        <ExecutiveExplorerDrawer
          kind={explorerKind}
          width={explorerWidth}
          onWidthChange={onExplorerWidthChange}
          onClose={onExplorerClose}
        >
          {explorerContent}
        </ExecutiveExplorerDrawer>

        <div
          data-testid="executive-stage-column"
          style={{
            flex: "1 1 70%",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            minHeight: 0,
            transition: `flex-basis ${cockpit.drawerMs} ease`,
          }}
        >
          <ExecutiveStageFrame overlay={stageOverlay}>
            {stage}
          </ExecutiveStageFrame>

          <ExecutiveTimelineDock
            lens={timelineLens}
            lensHighlighted={timelineHighlighted}
            packs={packs}
            selectedPackId={selectedPackId}
            packHighlighted={packHighlighted}
            onSelectLens={onSelectLens}
            onSelectPack={onSelectPack}
          />
        </div>

        <ExecutiveAdvisorPanel
          tab={advisorTab}
          onTabChange={onAdvisorTabChange}
          assist={assist}
          insight={insight}
        />
      </div>

      <ExecutiveStatusBar onHelp={onHelp} />

      <ExecutiveFloatingPanel
        kind={floatingKind}
        title={floatingTitle}
        onClose={onFloatingClose}
      >
        {floatingContent}
      </ExecutiveFloatingPanel>
    </div>
  );
}
