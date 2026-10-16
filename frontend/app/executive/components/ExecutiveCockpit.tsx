"use client";

/**
 * Official Executive Cockpit composition root.
 *
 * /executive → NEX-MVP:2 Nexora Executive Shell.
 * /executive/exs1 remains the EXS development sandbox.
 */

import type { NexoraAuthProviderId } from "@/app/lib/auth/nexoraAuthProviders";
import type { NexoraDeploymentMode } from "@/app/lib/auth/nexoraDeploymentMode";
import type { NexoraClientSessionProjection } from "@/app/lib/auth/nexoraPrincipal";
import { ANONYMOUS_NEXORA_SESSION } from "@/app/lib/auth/nexoraPrincipal";
import type { HostedWorkspaceProjection } from "@/app/lib/workspace-auth/hostedWorkspaceRecord";
import type { NexoraMVPDataRealityDatasetScenario } from "@/app/lib/nex-mvp/nexoraMVPDataRealityStageBridge";
import { NexoraExecutiveShell } from "../nex-mvp/NexoraExecutiveShell";

/**
 * ExecutiveCockpit — permanent Nexora MVP entry composition.
 */
export function ExecutiveCockpit({
  datasetScenario = "baseline",
  entranceRequested = false,
  resetEntrance = false,
  deploymentMode = "local",
  session = ANONYMOUS_NEXORA_SESSION,
  authProvider = "none",
  authError = null,
  hostedWorkspaces = [],
  hostedWorkspaceStatus = "ready",
}: {
  readonly datasetScenario?: NexoraMVPDataRealityDatasetScenario;
  readonly entranceRequested?: boolean;
  readonly resetEntrance?: boolean;
  readonly deploymentMode?: NexoraDeploymentMode;
  readonly session?: NexoraClientSessionProjection;
  readonly authProvider?: NexoraAuthProviderId;
  readonly authError?: string | null;
  readonly hostedWorkspaces?: readonly HostedWorkspaceProjection[];
  readonly hostedWorkspaceStatus?: "ready" | "unavailable";
}) {
  return (
    <div
      data-testid="executive-cockpit"
      style={{
        height: "100%",
        width: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <NexoraExecutiveShell
        datasetScenario={datasetScenario}
        entranceRequested={entranceRequested}
        resetEntrance={resetEntrance}
        deploymentMode={deploymentMode}
        session={session}
        authProvider={authProvider}
        authError={authError}
        hostedWorkspaces={hostedWorkspaces}
        hostedWorkspaceStatus={hostedWorkspaceStatus}
      />
    </div>
  );
}
