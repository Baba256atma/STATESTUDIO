/** Client bridge to the existing server-owned RDI:4 observation path. */
import type {
  NexoraLiveConnection,
  NexoraLivePreparedObservation,
} from "./liveDataConnectorFoundation.ts";

export type NexoraLiveObservationClientResult = Readonly<{
  ok: boolean;
  prepared: NexoraLivePreparedObservation | null;
  message: string;
}>;

function githubConfiguration(connection: NexoraLiveConnection): Readonly<{
  owner: string;
  repository: string;
}> | null {
  if (connection.providerId !== "github") return null;
  const parts = connection.configurationReference.replace(/^github:/, "").split("/");
  const owner = parts[0]?.trim() ?? "";
  const repository = parts.slice(1).join("/").trim();
  return owner && repository ? Object.freeze({ owner, repository }) : null;
}

/** Manual and scheduled callers converge here; PM never reads provider payloads. */
export async function requestNexoraLiveObservation(
  connection: NexoraLiveConnection,
  input: Readonly<{ observationId: string; observedAt: string }>,
): Promise<NexoraLiveObservationClientResult> {
  const configuration = githubConfiguration(connection);
  if (!configuration) {
    return Object.freeze({
      ok: false,
      prepared: null,
      message: "No certified RDI observation client is available for this provider.",
    });
  }
  try {
    const response = await fetch("/api/rdi/live/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "observe",
        workspaceId: connection.workspaceId,
        connectionId: connection.connectionId,
        displayName: connection.displayName,
        owner: configuration.owner,
        repository: configuration.repository,
        observationId: input.observationId,
        observedAt: input.observedAt,
      }),
    });
    const result = await response.json() as Readonly<{
      ok?: boolean;
      message?: string;
      prepared?: NexoraLivePreparedObservation;
    }>;
    return Object.freeze({
      ok: response.ok && result.ok === true && Boolean(result.prepared?.ready),
      prepared: result.prepared ?? null,
      message: result.message ?? (response.ok ? "Observation prepared." : "Observation failed."),
    });
  } catch (error) {
    return Object.freeze({
      ok: false,
      prepared: null,
      message: error instanceof Error ? error.message : "Observation request failed.",
    });
  }
}
