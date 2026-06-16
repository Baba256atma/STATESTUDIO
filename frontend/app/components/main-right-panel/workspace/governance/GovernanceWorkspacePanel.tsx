"use client";

import React from "react";

import type { GovernanceWorkspacePanelView } from "../../../../lib/ui/mrpWorkspace/governance/governanceWorkspaceContract.ts";
import {
  governancePanelDetailStyle,
  governancePanelHeadlineStyle,
  governancePanelStyle,
  governanceSectionLabelStyle,
} from "../../../../lib/ui/mrpWorkspace/governance/governanceVisualContract.ts";

export type GovernanceWorkspacePanelProps = Readonly<{
  panel: GovernanceWorkspacePanelView;
}>;

export function GovernanceWorkspacePanel(props: GovernanceWorkspacePanelProps): React.ReactElement {
  const { panel } = props;

  return (
    <article
      data-nx="governance-workspace-panel"
      data-governance-section={panel.id}
      style={governancePanelStyle(panel.tone)}
    >
      <div style={governanceSectionLabelStyle()}>{panel.label}</div>
      <div style={governancePanelHeadlineStyle(panel.tone)}>{panel.headline}</div>
      <p style={governancePanelDetailStyle()}>{panel.detail}</p>
    </article>
  );
}

export default GovernanceWorkspacePanel;
