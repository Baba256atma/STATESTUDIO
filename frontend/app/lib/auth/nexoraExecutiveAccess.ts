/**
 * DEPLOY:5 — server decision for the Executive route.
 *
 * Hosted mode and a configured GitHub or development provider require a
 * server session before the Executive shell is rendered.
 * Unset local mode with no provider keeps the certified local workspace path.
 * This does not decide which workspace is active.
 */

import type { NexoraDeploymentMode } from "./nexoraDeploymentMode.ts";
import type { NexoraAuthProviderId } from "./nexoraAuthProviders.ts";
import type { NexoraPrincipal } from "./nexoraPrincipal.ts";

export type NexoraExecutiveAccess =
  | Readonly<{ access: "local-certification" }>
  | Readonly<{ access: "authentication-boundary"; provider: NexoraAuthProviderId }>
  | Readonly<{ access: "authenticated-executive"; provider: NexoraAuthProviderId }>;

export function resolveExecutiveAccess(input: {
  readonly deploymentMode: NexoraDeploymentMode;
  readonly provider: NexoraAuthProviderId;
  readonly principal: NexoraPrincipal | null;
}): NexoraExecutiveAccess {
  const authenticationRequired = input.deploymentMode === "hosted"
    || input.provider === "github"
    || input.provider === "nexora-dev";
  if (!authenticationRequired) return Object.freeze({ access: "local-certification" });
  if (!input.principal) {
    return Object.freeze({ access: "authentication-boundary", provider: input.provider });
  }
  return Object.freeze({ access: "authenticated-executive", provider: input.provider });
}

/** NextAuth v4 App Router callback for the GitHub provider. */
export function nexoraGitHubCallbackUrl(origin: string): string | null {
  try {
    const url = new URL(origin);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!url.hostname) return null;
    return `${url.origin}/api/auth/callback/github`;
  } catch {
    return null;
  }
}
