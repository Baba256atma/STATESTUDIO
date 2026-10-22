"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { NexoraAuthProviderId } from "@/app/lib/auth/nexoraAuthProviders";
import { beginNexoraSignIn, endNexoraSession } from "@/app/lib/auth/nexoraAuthBrowser";
import type { NexoraDeploymentMode } from "@/app/lib/auth/nexoraDeploymentMode";
import { ANONYMOUS_NEXORA_SESSION, type NexoraClientSessionProjection } from "@/app/lib/auth/nexoraPrincipal";
import { assessHostedMyWorkspaceAccess } from "@/app/lib/auth/hostedWorkspaceGate";
import { readStoredHostedWorkspaceSelection, rememberHostedWorkspaceSelection, selectAuthorizedHostedWorkspace } from "@/app/lib/workspace-auth/hostedActiveWorkspace";
import { releaseWorkspaceCsvAuthority } from "@/app/lib/data-reality/csvRealDataImportStore";
import { releaseAuthorizedHostedWorkspace } from "@/app/lib/workspace/workspaceRegistryStore";
import type { HostedWorkspaceProjection } from "@/app/lib/workspace-auth/hostedWorkspaceRecord";
import { createPortal } from "react-dom";
import { cockpit } from "../exs1/shell/executiveCockpitTheme";
import {
  openDemoLibraryItem,
  projectDemoLibrary,
  readDemoLibraryFocus,
  subscribeDemoLibraryFocus,
} from "@/app/lib/demo-profile/demoLibrary";
import type { DemoProfileId } from "@/app/lib/demo-profile/demoProfileContract";
import {
  MANUFACTURING_DEMO_PROFILE_ID,
  PROJECT_DEMO_PROFILE_ID,
  readActiveDemoProfile,
  subscribeDemoProfile,
} from "@/app/lib/demo-profile/demoProfileStore";
import { resetActiveDemo } from "@/app/lib/demo-profile/demoProfileReset";
import { saveActiveManagerWorkspace } from "@/app/lib/workspace/managerWorkspaceSave";
import { listCsvRealDataImports, subscribeCsvRealDataImports, getCsvRealDataImportVersion } from "@/app/lib/data-reality/csvRealDataImportStore";
import { getCsvDurabilityHealth, subscribeCsvDurabilityHealth } from "@/app/lib/data-reality/csvRealDataImportDurability";
import { DEMO_WORKSPACE_ID } from "@/app/lib/workspace/workspaceRegistryContract";
import {
  createManagerWorkspaceFromEntry,
  projectManagerWorkspaceEntries,
  selectManagerWorkspaceEntry,
  type ManagerWorkspaceEntry,
  type ManagerWorkspaceEntryProjection,
} from "@/app/lib/workspace/managerWorkspaceEntry";
import type { ManagerWorkspaceKind } from "@/app/lib/workspace/workspaceRegistryContract";
import {
  getWorkspaceRegistrySnapshot,
  recoverWorkspaceRegistryFromStorage,
  subscribeWorkspaceRegistry,
} from "@/app/lib/workspace/workspaceRegistryStore";

const quietButton = {
  font: "inherit",
  fontSize: "0.72rem",
  color: cockpit.text,
  background: "transparent",
  border: `1px solid ${cockpit.border}`,
  borderRadius: "0.3rem",
  padding: "0.3rem 0.55rem",
  cursor: "pointer",
} as const;

const sectionLabel = {
  margin: 0,
  fontSize: "0.62rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: cockpit.lowMuted,
};

function MenuRow({
  entry,
  selected,
  onSelect,
}: {
  readonly entry: ManagerWorkspaceEntry;
  readonly selected: boolean;
  readonly onSelect: (workspaceId: string) => void;
}) {
  return (
    <button
      type="button"
      aria-current={selected ? "true" : undefined}
      data-manager-workspace-option={entry.workspaceId}
      data-manager-workspace-role={entry.role}
      onClick={() => onSelect(entry.workspaceId)}
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: "0.75rem",
        width: "100%",
        textAlign: "left",
        border: "none",
        background: selected ? cockpit.accentSoft : "transparent",
        color: cockpit.text,
        font: "inherit",
        fontSize: "0.78rem",
        padding: "0.45rem 0.7rem",
        cursor: "pointer",
      }}
    >
      <span>{entry.name}</span>
      <span
        style={{
          fontSize: "0.62rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
          flexShrink: 0,
        }}
      >
        {selected ? "Active" : entry.typeLabel}
      </span>
    </button>
  );
}

export function DemoLibrarySection({
  activeProfile,
  confirmingReset,
  notice,
  failure,
  onOpen,
  onRequestReset,
  onConfirmReset,
  onCancelReset,
}: {
  readonly activeProfile: DemoProfileId | null;
  readonly confirmingReset: boolean;
  readonly notice: string | null;
  readonly failure: string | null;
  readonly onOpen: (id: DemoProfileId) => void;
  readonly onRequestReset: () => void;
  readonly onConfirmReset: () => void;
  readonly onCancelReset: () => void;
}) {
  const library = projectDemoLibrary(activeProfile);
  return (
    <section aria-labelledby="try-nexora-heading" data-testid="demo-library" style={{ display: "flex", flexDirection: "column", gap: "0.45rem", padding: "0.35rem 0.7rem 0.55rem" }}>
      <h2 id="try-nexora-heading" style={sectionLabel}>Try Nexora</h2>
      <p style={{ margin: 0, color: cockpit.textSoft, fontSize: "0.72rem", lineHeight: 1.4 }}>
        Explore a realistic management situation
      </p>
      <p data-testid="demo-library-explanation" style={{ margin: 0, color: cockpit.muted, fontSize: "0.66rem", lineHeight: 1.45 }}>
        {library.explanation}
      </p>
      {library.items.map((item) => (
        <article
          key={item.id}
          data-testid={item.id === MANUFACTURING_DEMO_PROFILE_ID ? "demo-library-manufacturing" : "demo-library-project"}
          data-demo-library-item={item.id}
          data-demo-library-active={item.active ? "true" : "false"}
          aria-current={item.active ? "true" : undefined}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.28rem",
            border: `1px solid ${item.active ? cockpit.borderStrong : cockpit.border}`,
            borderRadius: "0.35rem",
            background: item.active ? cockpit.accentSoft : cockpit.panelSoft,
            padding: "0.5rem 0.55rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "baseline" }}>
            <strong style={{ fontSize: "0.78rem", fontWeight: 560 }}>{item.title}</strong>
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", color: cockpit.lowMuted }}>
              {item.active ? "Active" : "Example"}
            </span>
          </div>
          <p style={{ margin: 0, color: cockpit.muted, fontSize: "0.66rem", lineHeight: 1.4 }}>{item.description}</p>
          <p style={{ margin: 0, color: cockpit.lowMuted, fontSize: "0.6rem" }}>
            {item.sourceCount} data sources · {item.category}
          </p>
          <button
            type="button"
            data-testid={item.id === MANUFACTURING_DEMO_PROFILE_ID ? "open-manufacturing-demo" : "open-project-demo"}
            aria-pressed={item.active}
            aria-label={`${item.title}. ${item.description} Try Demo.`}
            onClick={() => onOpen(item.id)}
            style={{ ...quietButton, alignSelf: "flex-start", marginTop: "0.15rem" }}
          >
            Try Demo
          </button>
        </article>
      ))}
      {library.resetOffered ? (
        <div data-testid="current-demo" style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <p style={{ ...sectionLabel, marginTop: "0.15rem" }}>Current Demo</p>
          {confirmingReset ? (
            <div role="group" aria-label="Confirm demo reset" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <p style={{ margin: 0, fontSize: "0.72rem", color: cockpit.text, lineHeight: 1.4 }}>
                Reset this demo to its original starting point? Your real workspaces will not be affected.
              </p>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button type="button" data-testid="reset-demo-confirm" onClick={onConfirmReset} style={{ ...quietButton, background: cockpit.accentSoft }}>
                  Reset Demo
                </button>
                <button type="button" onClick={onCancelReset} style={{ ...quietButton, color: cockpit.muted }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button type="button" data-testid="reset-demo" aria-label="Reset Demo" onClick={onRequestReset} style={{ ...quietButton, alignSelf: "flex-start", color: cockpit.muted }}>
              Reset Demo
            </button>
          )}
        </div>
      ) : null}
      {failure ? (
        <div role="alert" style={{ fontSize: "0.68rem", color: cockpit.warning }}>
          {failure}
        </div>
      ) : null}
      {notice ? (
        <div data-testid="reset-demo-notice" style={{ fontSize: "0.68rem", color: cockpit.muted }}>
          {notice}
        </div>
      ) : null}
    </section>
  );
}

function HostedMyWorkspaceGate({
  access,
  authProvider,
  authPhase,
  authError,
  displayLabel,
  accountName,
  accountEmail,
  accountImage,
  workspaces,
  unavailable,
  selectedId,
  onSignIn,
  onSignOut,
  onSelect,
  onCreate,
  onWorkspaceDeleted,
  onAccountDeleted,
}: {
  readonly access: "authentication-required" | "authenticated-account" | "local-certification";
  readonly authProvider: NexoraAuthProviderId;
  readonly authPhase: "idle" | "loading" | "failed";
  readonly authError: string | null;
  readonly displayLabel: string | null;
  readonly accountName: string | null;
  readonly accountEmail: string | null;
  readonly accountImage: string | null;
  readonly workspaces: readonly HostedWorkspaceProjection[];
  readonly unavailable: boolean;
  readonly selectedId: string | null;
  readonly onSignIn: (userId?: string) => Promise<void>;
  readonly onSignOut: () => Promise<void>;
  readonly onSelect: (workspaceId: string) => void;
  readonly onCreate: (kind: "BUSINESS" | "PROJECT") => void;
  readonly onWorkspaceDeleted: (workspaceId: string) => void;
  readonly onAccountDeleted: () => void;
}) {
  const [confirmWorkspaceId, setConfirmWorkspaceId] = useState<string | null>(null);
  const [confirmAccount, setConfirmAccount] = useState(false);
  const [deletePhase, setDeletePhase] = useState<"idle" | "failed">("idle");
  const confirmWorkspace = workspaces.find((workspace) => workspace.workspaceId === confirmWorkspaceId) ?? null;
  if (access === "authenticated-account") {
    return (
      <div data-testid="hosted-my-workspace" style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "0.15rem 0.7rem 0.35rem" }}>
        <div data-testid="nexora-signed-in" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {accountImage ? (
            <img data-testid="nexora-signed-in-avatar" src={accountImage} alt="" width={22} height={22} style={{ borderRadius: "999px" }} />
          ) : null}
          <span style={{ color: cockpit.text, fontSize: "0.72rem" }}>{accountName ?? displayLabel ?? "Signed in"}</span>
          {accountEmail ? (
            <span data-testid="nexora-signed-in-email" style={{ color: cockpit.muted, fontSize: "0.66rem" }}>{accountEmail}</span>
          ) : null}
        </div>
        {unavailable ? (
          <p role="alert" data-testid="hosted-workspace-unavailable" style={{ margin: 0, color: cockpit.warning, fontSize: "0.68rem", lineHeight: 1.4 }}>
            Workspaces cannot be verified right now.
          </p>
        ) : workspaces.length === 0 ? (
          <p data-testid="hosted-workspace-empty" style={{ margin: 0, color: cockpit.muted, fontSize: "0.72rem" }}>
            No Company or Project yet
          </p>
        ) : (
          <div data-testid="hosted-workspace-list" style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {workspaces.map((workspace) => (
              <div key={workspace.workspaceId} style={{ display: "flex", gap: "0.25rem" }}>
                <button
                  type="button"
                  data-testid="hosted-workspace-row"
                  data-workspace-id={workspace.workspaceId}
                  data-workspace-kind={workspace.kind}
                  aria-pressed={workspace.workspaceId === selectedId}
                  onClick={() => onSelect(workspace.workspaceId)}
                  style={{ ...quietButton, flex: "1 1 auto" }}
                >
                  {workspace.name}
                </button>
                <button
                  type="button"
                  data-testid="hosted-workspace-delete"
                  data-workspace-id={workspace.workspaceId}
                  onClick={() => {
                    setConfirmAccount(false);
                    setDeletePhase("idle");
                    setConfirmWorkspaceId(workspace.workspaceId);
                  }}
                  style={quietButton}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        {unavailable ? null : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            <button type="button" data-testid="manager-workspace-new-company" onClick={() => onCreate("BUSINESS")} style={quietButton}>
              + New Company
            </button>
            <button type="button" data-testid="manager-workspace-new-project" onClick={() => onCreate("PROJECT")} style={quietButton}>
              + New Project
            </button>
          </div>
        )}
        <p data-testid="hosted-lifecycle-disclosure" style={{ margin: 0, color: cockpit.muted, fontSize: "0.66rem", lineHeight: 1.45 }}>
          Accepted Company and Project data is stored for that workspace. A pending CSV file is temporary and expires within 24 hours. After a file is accepted, Nexora does not keep the original CSV text. Deleting a workspace removes its active Nexora data. Deleting Nexora hosted data removes the Companies and Projects stored for this sign-in. It does not delete a GitHub account. Demo data is separate.
        </p>
        <p data-testid="hosted-llm-disclosure" style={{ margin: 0, color: cockpit.muted, fontSize: "0.66rem", lineHeight: 1.45 }}>
          Advisor requests may use a third-party model provider. Nexora sends bounded workspace context, not the original accepted CSV. Requests can be limited for security and cost. Operational usage metadata may be kept for 30 days and does not include the manager message or the model answer. Demo does not use paid provider capacity. Account deletion removes hosted workspace data; operational usage records follow that retention period.
        </p>
        {confirmWorkspace ? (
          <div data-testid="hosted-workspace-delete-confirm">
            <p style={{ margin: 0, color: cockpit.text, fontSize: "0.72rem", lineHeight: 1.4 }}>
              Delete “{confirmWorkspace.name}”? Hosted workspace data for this {confirmWorkspace.kind === "BUSINESS" ? "Company" : "Project"} will be removed.
            </p>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              <button
                type="button"
                data-testid="hosted-workspace-delete-commit"
                onClick={() => {
                  const workspaceId = confirmWorkspace.workspaceId;
                  void fetch(`/api/nexora/workspaces/${encodeURIComponent(workspaceId)}`, { method: "DELETE" }).then(async (response) => {
                    if (!response.ok) {
                      setDeletePhase("failed");
                      return;
                    }
                    setDeletePhase("idle");
                    setConfirmWorkspaceId(null);
                    onWorkspaceDeleted(workspaceId);
                  }).catch(() => setDeletePhase("failed"));
                }}
                style={quietButton}
              >
                Delete “{confirmWorkspace.name}”
              </button>
              <button type="button" data-testid="hosted-workspace-delete-cancel" onClick={() => setConfirmWorkspaceId(null)} style={quietButton}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}
        {confirmAccount ? (
          <div data-testid="hosted-account-delete-confirm">
            <p style={{ margin: 0, color: cockpit.text, fontSize: "0.72rem", lineHeight: 1.4 }}>
              Delete Nexora hosted data for this sign-in? Every Company and Project stored by Nexora for this account will be removed. Your GitHub account is not deleted.
            </p>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              <button
                type="button"
                data-testid="hosted-account-delete-commit"
                onClick={() => {
                  void fetch("/api/nexora/account/data", { method: "DELETE" }).then(async (response) => {
                    if (!response.ok) {
                      setDeletePhase("failed");
                      return;
                    }
                    setDeletePhase("idle");
                    setConfirmAccount(false);
                    onAccountDeleted();
                  }).catch(() => setDeletePhase("failed"));
                }}
                style={quietButton}
              >
                Delete Nexora hosted data
              </button>
              <button type="button" data-testid="hosted-account-delete-cancel" onClick={() => setConfirmAccount(false)} style={quietButton}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button type="button" data-testid="hosted-account-delete" onClick={() => { setConfirmWorkspaceId(null); setDeletePhase("idle"); setConfirmAccount(true); }} style={quietButton}>
            Delete Nexora hosted data
          </button>
        )}
        {deletePhase === "failed" ? (
          <p role="alert" data-testid="hosted-delete-failure" style={{ margin: 0, color: cockpit.warning, fontSize: "0.68rem" }}>
            Hosted data was not deleted.
          </p>
        ) : null}
        <button
          type="button"
          data-testid="nexora-sign-out"
          disabled={authPhase === "loading"}
          onClick={() => void onSignOut()}
          style={quietButton}
        >
          {authPhase === "loading" ? "Signing out" : "Sign out"}
        </button>
        {authPhase === "loading" ? (
          <p data-testid="nexora-auth-loading" style={{ margin: 0, color: cockpit.lowMuted, fontSize: "0.66rem" }}>
            Authentication loading
          </p>
        ) : null}
      </div>
    );
  }
  return (
    <div data-testid="hosted-my-workspace" style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "0.15rem 0.7rem 0.35rem" }}>
      <p style={{ margin: 0, color: cockpit.text, fontSize: "0.72rem", lineHeight: 1.4 }}>
        Sign in to create and keep your own Company or Project workspace.
      </p>
      {authProvider === "nexora-dev" ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          <button type="button" data-testid="nexora-sign-in-user-a" disabled={authPhase === "loading"} onClick={() => void onSignIn("user_a")} style={quietButton}>
            Sign in
          </button>
          <button type="button" data-testid="nexora-sign-in-user-b" disabled={authPhase === "loading"} onClick={() => void onSignIn("user_b")} style={quietButton}>
            Sign in as second user
          </button>
        </div>
      ) : (
        <button
          type="button"
          data-testid="nexora-sign-in"
          disabled={authPhase === "loading" || authProvider !== "github"}
          onClick={() => void onSignIn()}
          style={quietButton}
        >
          Sign in with GitHub
        </button>
      )}
      {authPhase === "loading" ? (
        <p data-testid="nexora-auth-loading" style={{ margin: 0, color: cockpit.lowMuted, fontSize: "0.66rem" }}>
          Authentication loading
        </p>
      ) : null}
      {authError ? (
        <div role="alert" data-testid="nexora-auth-failure" style={{ fontSize: "0.68rem", color: cockpit.warning }}>
          {authError}
        </div>
      ) : null}
    </div>
  );
}

export function NexoraManagerWorkspaceControl({
  deploymentMode = "local",
  session = ANONYMOUS_NEXORA_SESSION,
  authProvider = "none",
  authError = null,
  hostedWorkspaces = [],
  hostedWorkspaceStatus = "ready",
}: {
  readonly deploymentMode?: NexoraDeploymentMode;
  readonly session?: NexoraClientSessionProjection;
  readonly authProvider?: NexoraAuthProviderId;
  readonly authError?: string | null;
  readonly hostedWorkspaces?: readonly HostedWorkspaceProjection[];
  readonly hostedWorkspaceStatus?: "ready" | "unavailable";
} = {}) {
  const snapshot = useSyncExternalStore(
    subscribeWorkspaceRegistry,
    getWorkspaceRegistrySnapshot,
    getWorkspaceRegistrySnapshot,
  );
  const demoProfile = useSyncExternalStore(
    subscribeDemoProfile,
    readActiveDemoProfile,
    () => null,
  );
  const csvVersion = useSyncExternalStore(
    subscribeCsvRealDataImports,
    getCsvRealDataImportVersion,
    () => 0,
  );
  const libraryFocus = useSyncExternalStore(
    subscribeDemoLibraryFocus,
    readDemoLibraryFocus,
    () => 0,
  );
  const view: ManagerWorkspaceEntryProjection = projectManagerWorkspaceEntries(snapshot);
  const onDemo = view.active.workspaceId === DEMO_WORKSPACE_ID;
  const demoImports = onDemo ? listCsvRealDataImports(DEMO_WORKSPACE_ID) : [];
  const manufacturingActive = demoProfile === MANUFACTURING_DEMO_PROFILE_ID;
  const projectActive = demoProfile === PROJECT_DEMO_PROFILE_ID;
  const manufacturingImportCount = demoImports.filter((entry) =>
    entry.importId.startsWith("demo-profile:manufacturing:"),
  ).length;
  const projectImportCount = demoImports.filter((entry) =>
    entry.importId.startsWith("demo-profile:project:"),
  ).length;
  const [open, setOpen] = useState(() => readDemoLibraryFocus() > 0);
  const [draftKind, setDraftKind] = useState<ManagerWorkspaceKind | null>(null);
  const [draftName, setDraftName] = useState("");
  const [failure, setFailure] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [authPhase, setAuthPhase] = useState<"idle" | "loading" | "failed">("idle");
  const [accountWorkspaces, setAccountWorkspaces] = useState(hostedWorkspaces);
  const releasedHostedWorkspaceIds = useRef(new Set<string>());
  const [menuBox, setMenuBox] = useState<{ top: number; left: number; maxHeight: number } | null>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const nameId = useId();
  const modernDemoActive = manufacturingActive || projectActive;

  useLayoutEffect(() => {
    if (deploymentMode === "hosted") return;
    recoverWorkspaceRegistryFromStorage();
  }, [deploymentMode]);

  useEffect(() => {
    setAccountWorkspaces(hostedWorkspaces.filter((workspace) => !releasedHostedWorkspaceIds.current.has(workspace.workspaceId)));
  }, [hostedWorkspaces]);

  useLayoutEffect(() => {
    if (deploymentMode !== "hosted") return;
    const stored = readStoredHostedWorkspaceSelection();
    const known = hostedWorkspaces.find((workspace) => workspace.workspaceId === stored);
    if (!known) return;
    selectAuthorizedHostedWorkspace(known, hostedWorkspaces);
  }, [deploymentMode, hostedWorkspaces]);

  useEffect(() => subscribeDemoLibraryFocus(() => {
    if (readDemoLibraryFocus() > 0) setOpen(true);
  }), []);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = 340;
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
      setMenuBox({ top: rect.bottom + 6, left, maxHeight: Math.max(220, window.innerHeight - rect.bottom - 16) });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open, draftKind]);

  useEffect(() => {
    if (!open || draftKind) return;
    const frame = window.requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLButtonElement>("[data-testid='open-manufacturing-demo']")?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, draftKind, libraryFocus]);

  const close = () => {
    setOpen(false);
    setDraftKind(null);
    setDraftName("");
    setFailure(null);
    setConfirmingReset(false);
  };

  const workspaceAccess = assessHostedMyWorkspaceAccess({
    deploymentMode,
    principal: session.authenticated && session.userId ? { userId: session.userId } : null,
  });
  const hosted = deploymentMode === "hosted";
  const visibleReal = hosted ? [] : view.real;

  const beginCreate = (kind: ManagerWorkspaceKind) => {
    if (hosted && (workspaceAccess.access !== "authenticated-account" || hostedWorkspaceStatus === "unavailable")) return;
    setDraftKind(kind);
    setDraftName("");
    setFailure(null);
  };

  const selectEntry = (workspaceId: string) => {
    if (hosted) return;
    const accepted = selectManagerWorkspaceEntry(workspaceId);
    if (!accepted) {
      setFailure("That workspace could not be opened.");
      return;
    }
    close();
  };

  const openLibraryItem = (id: DemoProfileId) => {
    const opened = openDemoLibraryItem(id);
    if (!opened?.opened) {
      setFailure("That demo could not be opened.");
      return;
    }
    close();
  };

  const submitCreate = () => {
    if (!draftKind) return;
    if (hosted) {
      if (workspaceAccess.access !== "authenticated-account") {
        setFailure("Sign in to create and keep your own Company or Project workspace.");
        return;
      }
      const kind = draftKind;
      const name = draftName;
      void fetch("/api/nexora/workspaces", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, kind }),
      }).then(async (response) => {
        const body = await response.json().catch(() => null) as { workspace?: HostedWorkspaceProjection; error?: string } | null;
        if (!response.ok || !body?.workspace) {
          setFailure(body?.error === "workspace_unavailable" ? "Workspaces cannot be verified right now." : "That workspace could not be created.");
          return;
        }
        const created = body.workspace as HostedWorkspaceProjection;
        setAccountWorkspaces((current) => [...current, created]);
        selectAuthorizedHostedWorkspace(created, [...accountWorkspaces, created]);
        close();
      }).catch(() => {
        setFailure("Workspaces cannot be verified right now.");
      });
      return;
    }
    const created = createManagerWorkspaceFromEntry({ name: draftName, kind: draftKind });
    if (!created) {
      setFailure("Enter a name to create this workspace.");
      return;
    }
    close();
  };

  const nameReady = draftName.trim().length > 0;
  const managerOwned = !hosted && (view.active.role === "business" || view.active.role === "project");
  const csvHealth = useSyncExternalStore(subscribeCsvDurabilityHealth, getCsvDurabilityHealth, () => "idle" as const);
  const saveStatus = managerOwned ? saveActiveManagerWorkspace() : null;
  const csvStoreFailed = csvHealth === "session-only";
  const selectedHostedId = accountWorkspaces.some((workspace) => workspace.workspaceId === snapshot.activeWorkspaceId)
    ? snapshot.activeWorkspaceId
    : null;
  const selectedHosted = accountWorkspaces.find((workspace) => workspace.workspaceId === selectedHostedId) ?? null;
  const headerLabel = manufacturingActive
    ? "Nexora Demo · Manufacturing"
    : projectActive
      ? "Nexora Demo · Project"
      : hosted && selectedHosted && !modernDemoActive
        ? selectedHosted.name
        : !hosted && view.active.role !== "demo"
          ? view.active.identityLabel
          : "Try Nexora";

  return (
    <div style={{ position: "relative", flexShrink: 0, minWidth: 0 }}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={modernDemoActive ? `${headerLabel}. Demo` : headerLabel}
        ref={anchorRef}
        data-testid="manager-workspace-identity"
        data-deployment-mode={deploymentMode}
        data-auth-state={hosted ? (session.authenticated ? "authenticated" : "anonymous") : "local"}
        data-my-workspace-access={workspaceAccess.access}
        data-hosted-workspace-id={hosted && selectedHosted && !modernDemoActive ? selectedHosted.workspaceId : ""}
        data-try-nexora="available"
        data-manager-workspace-id={view.active.workspaceId}
        data-manager-workspace-role={view.active.role}
        data-demo-profile={demoProfile ?? "none"}
        data-manufacturing-import-count={String(manufacturingImportCount)}
        data-project-import-count={String(projectImportCount)}
        data-reset-demo={manufacturingActive || projectActive ? "available" : "unavailable"}
        data-manager-save={saveStatus?.status === "saved" && !csvStoreFailed ? "saved" : csvStoreFailed && managerOwned ? "not-stored" : "unavailable"}
        data-csv-store-version={String(csvVersion)}
        onClick={() => (open ? close() : setOpen(true))}
        onKeyDown={(event) => {
          if (event.key === "Escape") close();
        }}
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "0.45rem",
          maxWidth: "18rem",
          border: `1px solid ${cockpit.border}`,
          background: "transparent",
          color: cockpit.text,
          font: "inherit",
          fontSize: "0.78rem",
          fontWeight: 560,
          padding: "0.28rem 0.55rem",
          borderRadius: "0.35rem",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {headerLabel}
        </span>
        {saveStatus?.status === "saved" && !csvStoreFailed ? (
          <span data-testid="manager-workspace-saved" aria-label="Workspace saved on this device." style={{ fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: cockpit.lowMuted, flexShrink: 0 }}>
            Saved
          </span>
        ) : null}
        {csvStoreFailed && managerOwned ? (
          <span data-testid="manager-workspace-not-stored" style={{ fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: cockpit.warning, flexShrink: 0 }}>
            Not stored
          </span>
        ) : null}
        {modernDemoActive ? (
          <span
            data-testid="demo-status-badge"
            style={{
              fontSize: "0.58rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: cockpit.lowMuted,
              border: `1px solid ${cockpit.border}`,
              borderRadius: "0.25rem",
              padding: "0.05rem 0.28rem",
              flexShrink: 0,
            }}
          >
            Demo
          </span>
        ) : null}
        <span aria-hidden style={{ color: cockpit.lowMuted, fontSize: "0.62rem" }}>
          ▾
        </span>
      </button>
      {open && menuBox && typeof document !== "undefined"
        ? createPortal(
        <div
          id={menuId}
          ref={menuRef}
          role="dialog"
          aria-label="Try Nexora and my workspaces"
          data-testid="manager-workspace-menu"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              close();
              anchorRef.current?.focus();
            }
          }}
          style={{
            position: "fixed",
            top: menuBox.top,
            left: menuBox.left,
            zIndex: 80,
            width: "min(22rem, calc(100vw - 1rem))",
            maxHeight: menuBox.maxHeight,
            overflowY: "auto",
            background: cockpit.charcoal,
            border: `1px solid ${cockpit.border}`,
            borderRadius: "0.4rem",
            boxShadow: `0 12px 32px ${cockpit.accentGlow}`,
            padding: "0.35rem 0 0.45rem",
          }}
        >
          {draftKind ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitCreate();
              }}
              style={{ display: "flex", flexDirection: "column", gap: "0.45rem", padding: "0.45rem 0.7rem" }}
            >
              <div style={{ fontSize: "0.72rem", color: cockpit.muted }}>
                {draftKind === "BUSINESS" ? "Company" : "Project"}
              </div>
              <p style={{ margin: 0, color: cockpit.lowMuted, fontSize: "0.66rem" }}>Start with your own data.</p>
              <label htmlFor={nameId} style={{ fontSize: "0.62rem", letterSpacing: "0.08em", color: cockpit.lowMuted }}>
                NAME
              </label>
              <input
                id={nameId}
                data-testid="manager-workspace-name"
                value={draftName}
                autoFocus
                onChange={(event) => setDraftName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.stopPropagation();
                    setDraftKind(null);
                    setDraftName("");
                    setFailure(null);
                  }
                }}
                style={{
                  font: "inherit",
                  fontSize: "0.82rem",
                  color: cockpit.text,
                  background: cockpit.graphite,
                  border: `1px solid ${cockpit.border}`,
                  borderRadius: "0.3rem",
                  padding: "0.35rem 0.45rem",
                }}
              />
              {failure ? (
                <div role="alert" style={{ fontSize: "0.68rem", color: cockpit.warning }}>
                  {failure}
                </div>
              ) : null}
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  type="submit"
                  data-testid="manager-workspace-create"
                  disabled={!nameReady}
                  style={{
                    ...quietButton,
                    color: nameReady ? cockpit.text : cockpit.lowMuted,
                    background: nameReady ? cockpit.accentSoft : "transparent",
                    cursor: nameReady ? "pointer" : "default",
                  }}
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraftKind(null);
                    setDraftName("");
                    setFailure(null);
                  }}
                  style={{ ...quietButton, color: cockpit.muted }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {hosted ? (
                <p data-testid="hosted-demo-without-account" style={{ margin: "0.2rem 0.7rem 0.35rem", color: cockpit.muted, fontSize: "0.68rem", lineHeight: 1.4 }}>
                  You can try Nexora without signing in.
                </p>
              ) : null}
              <DemoLibrarySection
                activeProfile={demoProfile}
                confirmingReset={confirmingReset}
                notice={notice}
                failure={failure}
                onOpen={openLibraryItem}
                onRequestReset={() => {
                  setFailure(null);
                  setConfirmingReset(true);
                }}
                onConfirmReset={() => {
                  const result = resetActiveDemo();
                  if (result.status !== "reset") {
                    setFailure("Demo could not be reset.");
                    setNotice(null);
                    return;
                  }
                  setFailure(null);
                  setNotice("Demo reset");
                  setConfirmingReset(false);
                }}
                onCancelReset={() => setConfirmingReset(false)}
              />
              <section aria-labelledby="my-workspaces-heading" data-testid="my-workspaces" style={{ borderTop: `1px solid ${cockpit.border}`, paddingTop: "0.45rem" }}>
                <div style={{ padding: "0.15rem 0.7rem 0.35rem" }}>
                  <h2 id="my-workspaces-heading" style={sectionLabel}>My Workspaces</h2>
                  <p style={{ margin: "0.28rem 0 0", color: cockpit.textSoft, fontSize: "0.72rem", lineHeight: 1.4 }}>
                    Work with your own company or project
                  </p>
                </div>
                {hosted ? (
                  <HostedMyWorkspaceGate
                    access={workspaceAccess.access}
                    authProvider={authProvider}
                    authPhase={authError ? "failed" : authPhase}
                    authError={authError ?? (authPhase === "failed" ? "Sign-in failed. No session was created." : null)}
                    displayLabel={session.displayLabel}
                    accountName={session.name}
                    accountEmail={session.email}
                    accountImage={session.image}
                    workspaces={accountWorkspaces}
                    unavailable={hostedWorkspaceStatus === "unavailable"}
                    selectedId={selectedHostedId}
                    onSelect={(workspaceId) => {
                      const workspace = accountWorkspaces.find((entry) => entry.workspaceId === workspaceId);
                      if (!workspace || !selectAuthorizedHostedWorkspace(workspace, accountWorkspaces)) {
                        setFailure("That workspace could not be opened.");
                        return;
                      }
                      close();
                    }}
                    onCreate={beginCreate}
                    onWorkspaceDeleted={(workspaceId) => {
                      releasedHostedWorkspaceIds.current.add(workspaceId);
                      const remaining = accountWorkspaces.filter((workspace) => workspace.workspaceId !== workspaceId);
                      setAccountWorkspaces(remaining);
                      releaseWorkspaceCsvAuthority(workspaceId);
                      releaseAuthorizedHostedWorkspace(workspaceId);
                      const next = remaining[0] ?? null;
                      if (selectedHostedId === workspaceId) {
                        if (!next || !selectAuthorizedHostedWorkspace(next, remaining)) {
                          rememberHostedWorkspaceSelection(null);
                        }
                      }
                    }}
                    onAccountDeleted={() => {
                      for (const workspace of accountWorkspaces) {
                        releasedHostedWorkspaceIds.current.add(workspace.workspaceId);
                        releaseWorkspaceCsvAuthority(workspace.workspaceId);
                        releaseAuthorizedHostedWorkspace(workspace.workspaceId);
                      }
                      rememberHostedWorkspaceSelection(null);
                      setAccountWorkspaces([]);
                    }}
                    onSignIn={async (userId) => {
                      setAuthPhase("loading");
                      const provider = authProvider === "github" || authProvider === "nexora-dev" ? authProvider : null;
                      if (!provider) {
                        setAuthPhase("failed");
                        return;
                      }
                      const result = await beginNexoraSignIn({ provider, userId });
                      if (!result.ok) setAuthPhase("failed");
                    }}
                    onSignOut={async () => {
                      setAuthPhase("loading");
                      await endNexoraSession();
                    }}
                  />
                ) : (
                  <>
                    {visibleReal.length === 0 ? (
                      <div style={{ padding: "0.15rem 0.7rem 0.35rem", color: cockpit.muted, fontSize: "0.72rem" }}>
                        No Company or Project yet
                      </div>
                    ) : (
                      visibleReal.map((entry) => (
                        <MenuRow
                          key={entry.workspaceId}
                          entry={entry}
                          selected={entry.workspaceId === view.active.workspaceId && !modernDemoActive}
                          onSelect={selectEntry}
                        />
                      ))
                    )}
                    <p style={{ margin: "0.35rem 0.7rem 0.15rem", color: cockpit.lowMuted, fontSize: "0.62rem" }}>
                      Start with your own data.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", padding: "0.35rem 0.7rem 0.15rem" }}>
                      <button type="button" data-testid="manager-workspace-new-company" onClick={() => beginCreate("BUSINESS")} style={quietButton}>
                        + New Company
                      </button>
                      <button type="button" data-testid="manager-workspace-new-project" onClick={() => beginCreate("PROJECT")} style={quietButton}>
                        + New Project
                      </button>
                    </div>
                  </>
                )}
              </section>
            </>
          )}
        </div>,
        document.body,
      )
        : null}
    </div>
  );
}
