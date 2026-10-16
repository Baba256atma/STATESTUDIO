/**
 * NEX-MVP:2 — Nexora Executive Decision Environment entry.
 *
 * Permanent production route: /executive
 * Composes NEX-MVP:2 Executive Shell on NEX-MVP:1 foundation.
 * Development sandbox remains at /executive/exs1.
 *
 * P0:5 development verification:
 *   /executive?dataset=baseline
 *   /executive?dataset=operational-pressure
 */

import type { Metadata } from "next";
import { selectNexoraAuthProvider } from "@/app/lib/auth/nexoraAuthProviders";
import { readNexoraDeploymentMode } from "@/app/lib/auth/nexoraDeploymentMode";
import { ANONYMOUS_NEXORA_SESSION } from "@/app/lib/auth/nexoraPrincipal";
import { readNexoraClientSession } from "@/app/lib/auth/nexoraPrincipalServer";
import { listOwnedHostedWorkspaces } from "@/app/lib/workspace-auth/hostedWorkspaceCommands";
import { projectHostedWorkspace, type HostedWorkspaceProjection } from "@/app/lib/workspace-auth/hostedWorkspaceRecord";
import { ExecutiveShell } from "./components/ExecutiveShell";
import { parseNexoraMVPDataRealityDatasetScenario } from "@/app/lib/nex-mvp/nexoraMVPDataRealityStageBridge";

export const metadata: Metadata = {
  title: "Nexora · Executive Environment",
  description:
    "Nexora Executive Decision Environment — Stage-centered executive experience.",
};

/**
 * Executive Experience page — canonical MVP entry at /executive.
 */
export default async function ExecutivePage({
  searchParams,
}: {
  searchParams: Promise<{
    dataset?: string | string[];
    entrance?: string | string[];
    reset?: string | string[];
    error?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.dataset) ? params.dataset[0] : params.dataset;
  const datasetScenario = parseNexoraMVPDataRealityDatasetScenario(raw);
  const entranceRaw = Array.isArray(params.entrance)
    ? params.entrance[0]
    : params.entrance;
  const resetRaw = Array.isArray(params.reset) ? params.reset[0] : params.reset;
  const entranceRequested =
    entranceRaw === "1" || entranceRaw === "true" || entranceRaw === "first-time";
  const resetEntrance = resetRaw === "1" || resetRaw === "true";
  const deploymentMode = readNexoraDeploymentMode();
  const session = deploymentMode === "hosted"
    ? await readNexoraClientSession()
    : ANONYMOUS_NEXORA_SESSION;
  const authProvider = deploymentMode === "hosted"
    ? selectNexoraAuthProvider(process.env, process.env.NODE_ENV)
    : "none";
  const errorRaw = Array.isArray(params.error) ? params.error[0] : params.error;
  const authError = deploymentMode === "hosted" && errorRaw
    ? "Sign-in failed. No session was created."
    : null;
  let hostedWorkspaces: readonly HostedWorkspaceProjection[] = [];
  let hostedWorkspaceStatus: "ready" | "unavailable" = "ready";
  if (deploymentMode === "hosted" && session.authenticated && session.userId) {
    const listed = await listOwnedHostedWorkspaces({ userId: session.userId });
    if (listed.ok) hostedWorkspaces = listed.value.map(projectHostedWorkspace);
    else hostedWorkspaceStatus = "unavailable";
  }

  return (
    <main
      data-testid="executive-page"
      data-nexora-dataset={datasetScenario}
      data-nex-exp1-requested={entranceRequested ? "true" : "false"}
      data-nex-ent1-requested={entranceRequested ? "true" : "false"}
      style={{
        height: "100vh",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#0a0e14",
        color: "#e8eef6",
        fontFamily:
          '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
      }}
    >
      <ExecutiveShell
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
    </main>
  );
}
