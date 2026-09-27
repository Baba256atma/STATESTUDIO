"use client";

import { useState, type ReactNode } from "react";

import {
  SCENE_ORG_REGION_CONTRACTS,
  sceneOrgRegionContractIdentity,
  type SceneOrgCanonicalReference,
  type SceneOrgRegionId,
} from "@/app/lib/scene-org/sceneOrgRegionContract";
import {
  SCENE_ORG_REGION_VISIBILITY_POLICY,
  sceneOrgVisibilityContractIdentity,
} from "@/app/lib/scene-org/sceneOrgVisibilityContract";
import {
  SCENE_ORG_NORMAL_STAGE_CARD_RULE,
  SCENE_ORG_REGION_PLACEMENT_POLICY,
  sceneOrgWorkspacePlacementContractIdentity,
} from "@/app/lib/scene-org/sceneOrgWorkspacePlacementContract";
import {
  projectSceneOrgDetailWorkspace,
  type SceneOrgDetailCapability,
} from "@/app/lib/scene-org/sceneOrgDetailWorkspaceContract";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type RegionProps = {
  readonly region: Exclude<SceneOrgRegionId, "detail-workspace">;
  readonly canonicalTargetId?: string | null;
  readonly referentId?: string | null;
  readonly children?: ReactNode;
};

/**
 * Attribute-only production integration seam. `display: contents` preserves
 * the existing shell layout and every existing authority/runtime component.
 */
export function NexoraWorkspaceRegionBoundary({
  region,
  canonicalTargetId = null,
  referentId = null,
  children,
}: RegionProps) {
  const contract = SCENE_ORG_REGION_CONTRACTS[region];
  const visibility = SCENE_ORG_REGION_VISIBILITY_POLICY[region];
  const placement = SCENE_ORG_REGION_PLACEMENT_POLICY[region];
  return (
    <div
      data-testid={`nexora-org2-region-${region}`}
      data-scene-org-region={region}
      data-scene-org-contract={sceneOrgRegionContractIdentity}
      data-scene-org-presentation-only="true"
      data-scene-org-canonical-target={canonicalTargetId ?? "none"}
      data-scene-org-referent={referentId ?? "none"}
      data-scene-org-owns-truth="false"
      data-scene-org-purpose={contract.purpose}
      data-scene-org-visibility-contract={sceneOrgVisibilityContractIdentity}
      data-scene-org-default-visibility={visibility.defaultLevel}
      data-scene-org-placement-contract={
        sceneOrgWorkspacePlacementContractIdentity
      }
      data-scene-org-placement={placement.responsibility}
      data-scene-org-normal-card-limit={
        region === "center-stage"
          ? `${SCENE_ORG_NORMAL_STAGE_CARD_RULE.minimum}-${SCENE_ORG_NORMAL_STAGE_CARD_RULE.maximum}`
          : "not-applicable"
      }
      data-scene-org-theatre-density-exempt={
        region === "center-stage" ? "true" : "not-applicable"
      }
      style={{ display: "contents" }}
    >
      {children}
    </div>
  );
}

/**
 * ORG:2 reserves the Detail Workspace seam only. ORG:6 owns its visible UX.
 * The seam receives identity metadata, never a copied Object/source record.
 */
export function NexoraDetailWorkspaceBoundary({
  target,
  open = false,
  connectionsAvailable = false,
  configurationAvailable = false,
  onClose,
  children,
}: {
  readonly target: SceneOrgCanonicalReference | null;
  readonly open?: boolean;
  readonly connectionsAvailable?: boolean;
  readonly configurationAvailable?: boolean;
  readonly onClose?: () => void;
  readonly children?: ReactNode;
}) {
  const visibility = SCENE_ORG_REGION_VISIBILITY_POLICY["detail-workspace"];
  const placement = SCENE_ORG_REGION_PLACEMENT_POLICY["detail-workspace"];
  const projection = projectSceneOrgDetailWorkspace({
    open,
    target,
    connectionsAvailable,
    configurationAvailable,
  });
  const [requestedCapability, setRequestedCapability] =
    useState<SceneOrgDetailCapability>("DATA");
  const activeCapability = projection.availableCapabilities.includes(
    requestedCapability,
  )
    ? requestedCapability
    : "DATA";

  if (!projection.open) {
    return (
      <div
        data-testid="nexora-org2-region-detail-workspace"
        data-scene-org-region="detail-workspace"
        data-scene-org-contract={sceneOrgRegionContractIdentity}
        data-scene-org-presentation-only="true"
        data-scene-org-reservation-only="true"
        data-scene-org-canonical-target={target?.canonicalId ?? "none"}
        data-scene-org-canonical-kind={target?.kind ?? "none"}
        data-scene-org-canonical-owner={target?.owner ?? "none"}
        data-scene-org-owns-truth="false"
        data-scene-org-visibility-contract={sceneOrgVisibilityContractIdentity}
        data-scene-org-default-visibility={visibility.defaultLevel}
        data-scene-org-placement-contract={sceneOrgWorkspacePlacementContractIdentity}
        data-scene-org-placement={placement.responsibility}
        hidden
        aria-hidden="true"
      />
    );
  }

  return (
    <section
      data-testid="nexora-org2-region-detail-workspace"
      data-scene-org-region="detail-workspace"
      data-scene-org-contract={sceneOrgRegionContractIdentity}
      data-scene-org-presentation-only="true"
      data-scene-org-reservation-only="false"
      data-scene-org-canonical-target={target?.canonicalId ?? "none"}
      data-scene-org-canonical-kind={target?.kind ?? "none"}
      data-scene-org-canonical-owner={target?.owner ?? "none"}
      data-detail-context-key={projection.contextKey}
      data-detail-capability={activeCapability}
      data-scene-org-owns-truth="false"
      data-scene-org-visibility-contract={sceneOrgVisibilityContractIdentity}
      data-scene-org-default-visibility={visibility.defaultLevel}
      data-scene-org-placement-contract={sceneOrgWorkspacePlacementContractIdentity}
      data-scene-org-placement={placement.responsibility}
      aria-label="Detail Workspace"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        background: cockpit.bg,
        color: cockpit.text,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "0.8rem 1rem",
          borderBottom: `1px solid ${cockpit.border}`,
          background: cockpit.panel,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, color: cockpit.lowMuted, fontSize: "0.56rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Deep detail
          </p>
          <h2 style={{ margin: "0.22rem 0 0", color: cockpit.text, fontSize: "0.9rem" }}>
            Detail Workspace
          </h2>
          <p data-testid="nexora-detail-canonical-reference" style={{ margin: "0.2rem 0 0", color: cockpit.muted, fontSize: "0.58rem", overflowWrap: "anywhere" }}>
            {target?.kind} · {target?.canonicalId}
          </p>
        </div>
        <button
          type="button"
          data-testid="nexora-detail-workspace-close"
          onClick={onClose}
          style={{ border: `1px solid ${cockpit.border}`, borderRadius: cockpit.radius.sm, background: "transparent", color: cockpit.textSoft, cursor: "pointer", fontFamily: "inherit", padding: "0.4rem 0.62rem" }}
        >
          Close detail
        </button>
      </header>

      <nav aria-label="Detail categories" style={{ display: "flex", gap: "0.4rem", padding: "0.62rem 1rem", borderBottom: `1px solid ${cockpit.border}` }}>
        {projection.availableCapabilities.map((capability) => (
          <button
            key={capability}
            type="button"
            aria-pressed={activeCapability === capability}
            onClick={() => setRequestedCapability(capability)}
            style={{ border: `1px solid ${activeCapability === capability ? cockpit.borderStrong : cockpit.border}`, borderRadius: cockpit.radius.pill, background: activeCapability === capability ? cockpit.accentSoft : "transparent", color: activeCapability === capability ? cockpit.accent : cockpit.textSoft, cursor: "pointer", fontFamily: "inherit", fontSize: "0.6rem", padding: "0.34rem 0.58rem" }}
          >
            {capability === "DATA" ? "Data" : capability === "CONNECTIONS" ? "Connections" : "Configuration"}
          </button>
        ))}
      </nav>

      <div data-testid="nexora-detail-workspace-body" style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "1rem" }}>
        <p style={{ margin: "0 0 0.7rem", color: cockpit.lowMuted, fontSize: "0.6rem" }}>
          {activeCapability === "DATA"
            ? "Existing source, CSV, validation, and provenance capabilities"
            : activeCapability === "CONNECTIONS"
              ? "Existing connected-source capabilities"
              : "Existing source mapping and configuration capabilities"}
        </p>
        {children}
      </div>
    </section>
  );
}
