"use client";

import type { NexoraDecisionTheatreInvestigationLevel } from "@/app/lib/decision-theatre/nexoraDecisionTheatreObjectInvestigation.ts";
import type { NexoraDecisionTheatreObjectInvestigation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreObjectInvestigation.ts";
import type { SceneOrgRightPackageTab } from "@/app/lib/scene-org/sceneOrgRightPackageTabContract";
import { cockpit } from "../exs1/shell/executiveCockpitTheme";
import { NexoraDecisionTheatreInvestigationSurface } from "./stage/NexoraDecisionTheatreInvestigationSurface";

type Props = {
  readonly tab: SceneOrgRightPackageTab;
  readonly investigation: NexoraDecisionTheatreObjectInvestigation | null;
  readonly onInvestigationLevelChange?: (
    level: NexoraDecisionTheatreInvestigationLevel,
  ) => void;
  readonly onAsk?: (question: string) => void;
};

/**
 * Right working context for an opened package tab.
 * Hosts the existing Object Card against the tab's canonical ID.
 */
export function NexoraRightPackageWorkingContext({
  tab,
  investigation,
  onInvestigationLevelChange,
  onAsk,
}: Props) {
  return (
    <section
      data-testid="nexora-right-package-working-context"
      data-right-package={tab.package}
      data-right-package-tab-id={tab.tabId}
      data-right-package-canonical-id={tab.canonicalId}
      data-right-package-view={tab.view}
      data-right-package-owns-truth="false"
      data-object-card-owner="right-selected-object-tab"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.7rem",
      }}
    >
      {investigation != null ? (
        <NexoraDecisionTheatreInvestigationSurface
          host="right-panel"
          investigation={investigation}
          onLevelChange={onInvestigationLevelChange ?? (() => undefined)}
          onClose={() => undefined}
          onAsk={onAsk ?? (() => undefined)}
        />
      ) : (
        <WorkingContextFallback tab={tab} />
      )}
    </section>
  );
}

function WorkingContextFallback({
  tab,
}: Readonly<{ tab: SceneOrgRightPackageTab }>) {
  return (
    <>
      <header>
        <p
          style={{
            margin: 0,
            fontSize: cockpit.type.status.size,
            letterSpacing: cockpit.type.status.tracking,
            textTransform: "uppercase",
            color: cockpit.lowMuted,
            fontWeight: cockpit.type.status.weight,
          }}
        >
          Working context
        </p>
        <h2
          data-testid="nexora-right-package-title"
          style={{
            margin: "0.28rem 0 0",
            fontSize: "0.92rem",
            color: cockpit.text,
            fontWeight: 650,
          }}
        >
          {tab.label}
        </h2>
        <p
          data-testid="nexora-right-package-canonical-id"
          style={{
            margin: "0.22rem 0 0",
            color: cockpit.muted,
            fontSize: "0.58rem",
            overflowWrap: "anywhere",
          }}
        >
          {tab.canonicalId}
        </p>
      </header>
      <p
        data-testid="nexora-right-package-identity"
        style={{ margin: 0, color: cockpit.textSoft, fontSize: "0.72rem", lineHeight: 1.45 }}
      >
        {`${tab.label} is the current working context.`}
      </p>
    </>
  );
}
