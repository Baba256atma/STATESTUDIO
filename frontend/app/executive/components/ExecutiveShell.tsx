"use client";

/**
 * Executive Shell host for the Nexora MVP Executive Decision Environment.
 * Composes NEX-MVP:2 via ExecutiveCockpit → NexoraExecutiveShell.
 */

import type { NexoraAuthProviderId } from "@/app/lib/auth/nexoraAuthProviders";
import type { NexoraDeploymentMode } from "@/app/lib/auth/nexoraDeploymentMode";
import type { NexoraClientSessionProjection } from "@/app/lib/auth/nexoraPrincipal";
import { ANONYMOUS_NEXORA_SESSION } from "@/app/lib/auth/nexoraPrincipal";
import type { HostedWorkspaceProjection } from "@/app/lib/workspace-auth/hostedWorkspaceRecord";
import type { NexoraMVPDataRealityDatasetScenario } from "@/app/lib/nex-mvp/nexoraMVPDataRealityStageBridge";
import { ExecutiveCockpit } from "./ExecutiveCockpit";

/**
 * Executive Shell — full-viewport cockpit container.
 */
export function ExecutiveShell({
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
      data-testid="executive-shell"
      style={{
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <ExecutiveCockpit
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
