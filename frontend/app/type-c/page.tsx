"use client";

import React from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { NexoraManagerWorkspaceShell } from "../components/workspace/NexoraManagerWorkspaceShell";
import { TypeCWorkspaceInitFallback } from "../components/workspace/TypeCWorkspaceInitFallback";
import { resolveDomainExperience } from "../lib/domain/domainExperienceRegistry";
import {
  TYPE_C_DOMAIN_STORAGE_KEY,
  TYPE_C_GOVERNANCE_ORG_ID,
  TYPE_C_MANAGER_DOMAIN_ID,
} from "../lib/typec/typeCManagerWorkspaceRoute";
import { armTypeCViewModeLock } from "../lib/typec/typeCViewModeLock";
import { setWorkspaceViewMode, getWorkspaceViewMode } from "../lib/workspace/workspaceViewModeRuntime";

armTypeCViewModeLock();

function resolveTypeCWorkspaceDomain(): { domainId: string } | { error: string } {
  try {
    const resolved = resolveDomainExperience(TYPE_C_MANAGER_DOMAIN_ID);
    if (!resolved?.experience?.domainId) {
      return { error: "Domain experience could not be resolved for Type-C manager workspace." };
    }
    return { domainId: resolved.experience.domainId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (process.env.NODE_ENV !== "production") {
      console.error("[Nexora][TypeC][WorkspaceInit]", error);
    }
    return { error: message };
  }
}

export default function TypeCPage() {
  const [initState] = React.useState(resolveTypeCWorkspaceDomain);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(TYPE_C_DOMAIN_STORAGE_KEY, TYPE_C_MANAGER_DOMAIN_ID);
    } catch {
      // Storage optional — workspace still loads with explicit domain id.
    }
    if (getWorkspaceViewMode() !== "3D") {
      setWorkspaceViewMode("3D", "type_c_default_3d");
    }
    if (process.env.NODE_ENV !== "production") {
      console.info("[Nexora][TypeC][Route]", {
        route: "/type-c",
        domainId: "error" in initState ? null : initState.domainId,
        mode: "type_c",
      });
    }
  }, [initState]);

  if ("error" in initState) {
    return (
      <TypeCWorkspaceInitFallback
        detail="Type-C manager workspace could not initialize."
        diagnostic={initState.error}
      />
    );
  }

  return (
    <ErrorBoundary>
      <NexoraManagerWorkspaceShell
        domainId={initState.domainId}
        organizationId={TYPE_C_GOVERNANCE_ORG_ID}
        sessionHydrated
      />
    </ErrorBoundary>
  );
}
