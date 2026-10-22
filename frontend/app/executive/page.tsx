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
import { readNexoraExecutiveGate } from "@/app/lib/auth/nexoraPrincipalServer";
import { NexoraAccountControl, NexoraExecutiveAuthBoundary } from "./components/NexoraAuthBoundary";
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
  const gate = await readNexoraExecutiveGate();
  const { deploymentMode, authProvider, access, session } = gate;
  const errorRaw = Array.isArray(params.error) ? params.error[0] : params.error;
  const authError = access.access === "authentication-boundary" && errorRaw
    ? "Sign-in failed. No session was created."
    : null;
  if (access.access === "authentication-boundary") {
    return (
      <main
        data-testid="executive-auth-page"
        style={{
          height: "100vh",
          minHeight: "100vh",
          display: "flex",
          background: "#0a0e14",
          color: "#e8eef6",
          fontFamily: '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
        }}
      >
        <NexoraExecutiveAuthBoundary provider={access.provider} authError={authError} />
      </main>
    );
  }
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
      {access.access === "authenticated-executive" ? <NexoraAccountControl session={session} /> : null}
      <ExecutiveShell
        datasetScenario={datasetScenario}
        entranceRequested={entranceRequested}
        resetEntrance={resetEntrance}
        deploymentMode={deploymentMode}
        session={session}
        authProvider={authProvider}
        authError={null}
        hostedWorkspaces={hostedWorkspaces}
        hostedWorkspaceStatus={hostedWorkspaceStatus}
      />
    </main>
  );
}
