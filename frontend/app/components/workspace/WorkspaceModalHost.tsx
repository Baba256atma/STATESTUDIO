"use client";

import React, { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { nx } from "../ui/nexoraTheme";
import type { Workspace } from "../../lib/workspace/workspaceRegistryContract";
import {
  archiveWorkspace,
  canArchiveWorkspace,
  canDeleteWorkspace,
  createWorkspace,
  deleteWorkspace,
  duplicateWorkspace,
  getActiveWorkspace,
  getWorkspaceRegistrySnapshot,
  renameWorkspace,
  subscribeWorkspaceRegistry,
} from "../../lib/workspace/workspaceRegistryStore";
import {
  bindActiveWorkspaceToRuntimeContext,
  selectWorkspaceForRuntime,
} from "../../lib/workspace/workspaceSelectionBinding";
import {
  getWorkspaceDomainSelection,
  getWorkspaceDomainVersionSnapshot,
  NEXORA_WORKSPACE_DOMAIN_OPTIONS,
  saveWorkspaceDomainSelection,
  subscribeWorkspaceDomainSelections,
  type WorkspaceDomainId,
} from "../../lib/workspace/workspaceDomainContract";
import {
  getSituationPlaceholderForDomain,
  getSituationTemplatesForDomain,
  getWorkspaceSituation,
  getWorkspaceSituationVersionSnapshot,
  saveWorkspaceSituation,
  subscribeWorkspaceSituations,
} from "../../lib/workspace/workspaceSituationContract";
import {
  createCustomGoal,
  createSuggestedGoal,
  getGoalSuggestionsForDomain,
  getWorkspaceGoalVersionSnapshot,
  getWorkspaceGoals,
  saveWorkspaceGoals,
  subscribeWorkspaceGoals,
  type WorkspaceGoal,
} from "../../lib/workspace/workspaceGoalContract";
import {
  addDraftObject,
  generateWorkspaceDraftModel,
  getWorkspaceDraftModel,
  getWorkspaceDraftModelVersionSnapshot,
  removeDraftObject,
  renameDraftObject,
  saveWorkspaceDraftModel,
  subscribeWorkspaceDraftModels,
  type WorkspaceDraftObject,
} from "../../lib/workspace/workspaceDraftModelContract";
import {
  approveWorkspaceModelFromDraft,
  getWorkspaceModel,
  getWorkspaceModelVersionSnapshot,
  subscribeWorkspaceModels,
} from "../../lib/workspace/workspaceApprovedModelContract";

type WorkspaceModalState =
  | { kind: "hub" }
  | { kind: "domainDiscovery"; workspaceId: string }
  | { kind: "situationDiscovery"; workspaceId: string }
  | { kind: "goalDiscovery"; workspaceId: string }
  | { kind: "draftModelGeneration"; workspaceId: string }
  | { kind: "modelApprovalConfirm"; workspaceId: string }
  | { kind: "sceneCreationPlaceholder"; workspaceId: string }
  | { kind: "create" }
  | { kind: "rename"; workspaceId: string }
  | { kind: "archive"; workspaceId: string }
  | { kind: "delete"; workspaceId: string }
  | null;

let workspaceModalState: WorkspaceModalState = null;
const workspaceModalSubscribers = new Set<() => void>();

function emitWorkspaceOverlayDiagnostic(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  // eslint-disable-next-line no-console
  console.debug("[WorkspaceOverlay]", message, payload ?? {});
}

function emitWorkspaceHubDiagnostic(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  // eslint-disable-next-line no-console
  console.debug("[WorkspaceHub]", message, payload ?? {});
}

function emitDomainDiscoveryDiagnostic(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  // eslint-disable-next-line no-console
  console.debug("[DomainDiscovery]", message, payload ?? {});
}

function emitSituationDiscoveryDiagnostic(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  // eslint-disable-next-line no-console
  console.debug("[SituationDiscovery]", message, payload ?? {});
}

function emitGoalDiscoveryDiagnostic(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  // eslint-disable-next-line no-console
  console.debug("[GoalDiscovery]", message, payload ?? {});
}

function emitDraftModelGenerationDiagnostic(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  // eslint-disable-next-line no-console
  console.debug("[DraftModelGeneration]", message, payload ?? {});
}

function emitModelApprovalDiagnostic(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  // eslint-disable-next-line no-console
  console.debug("[ModelApproval]", message, payload ?? {});
}

function notifyWorkspaceModalSubscribers(): void {
  workspaceModalSubscribers.forEach((subscriber) => subscriber());
}

function setWorkspaceModalState(nextState: WorkspaceModalState): void {
  workspaceModalState = nextState;
  notifyWorkspaceModalSubscribers();
}

function subscribeWorkspaceModalState(subscriber: () => void): () => void {
  workspaceModalSubscribers.add(subscriber);
  return () => workspaceModalSubscribers.delete(subscriber);
}

function getWorkspaceModalState(): WorkspaceModalState {
  return workspaceModalState;
}

export function openWorkspaceCreateModal(): void {
  emitWorkspaceOverlayDiagnostic("Modal Open", { kind: "create" });
  setWorkspaceModalState({ kind: "create" });
}

export function openWorkspaceHubModal(): void {
  emitWorkspaceOverlayDiagnostic("Modal Open", { kind: "hub" });
  emitWorkspaceHubDiagnostic("Hub Opened");
  setWorkspaceModalState({ kind: "hub" });
}

export function openDomainDiscoveryModal(workspaceId: string): void {
  emitWorkspaceOverlayDiagnostic("Modal Open", { kind: "domainDiscovery", workspaceId });
  setWorkspaceModalState({ kind: "domainDiscovery", workspaceId });
}

export function openWorkspaceRenameModal(workspaceId: string): void {
  emitWorkspaceOverlayDiagnostic("Modal Open", { kind: "rename", workspaceId });
  setWorkspaceModalState({ kind: "rename", workspaceId });
}

export function openWorkspaceArchiveModal(workspaceId: string): void {
  emitWorkspaceOverlayDiagnostic("Modal Open", { kind: "archive", workspaceId });
  setWorkspaceModalState({ kind: "archive", workspaceId });
}

export function openWorkspaceDeleteModal(workspaceId: string): void {
  emitWorkspaceOverlayDiagnostic("Modal Open", { kind: "delete", workspaceId });
  setWorkspaceModalState({ kind: "delete", workspaceId });
}

export function closeWorkspaceModal(): void {
  if (workspaceModalState) {
    emitWorkspaceOverlayDiagnostic("Modal Close", { kind: workspaceModalState.kind });
    if (workspaceModalState.kind === "hub") emitWorkspaceHubDiagnostic("Hub Closed");
  }
  setWorkspaceModalState(null);
}

export function WorkspaceModalHost(): React.ReactElement | null {
  const modalState = useSyncExternalStore(
    subscribeWorkspaceModalState,
    getWorkspaceModalState,
    getWorkspaceModalState
  );
  const registrySnapshot = useSyncExternalStore(
    subscribeWorkspaceRegistry,
    getWorkspaceRegistrySnapshot,
    getWorkspaceRegistrySnapshot
  );
  useSyncExternalStore(
    subscribeWorkspaceDomainSelections,
    getWorkspaceDomainVersionSnapshot,
    () => 0
  );
  useSyncExternalStore(
    subscribeWorkspaceSituations,
    getWorkspaceSituationVersionSnapshot,
    () => 0
  );
  useSyncExternalStore(
    subscribeWorkspaceGoals,
    getWorkspaceGoalVersionSnapshot,
    () => 0
  );
  useSyncExternalStore(
    subscribeWorkspaceDraftModels,
    getWorkspaceDraftModelVersionSnapshot,
    () => 0
  );
  useSyncExternalStore(
    subscribeWorkspaceModels,
    getWorkspaceModelVersionSnapshot,
    () => 0
  );
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    emitWorkspaceOverlayDiagnostic("Overlay Mounted");
    return () => emitWorkspaceOverlayDiagnostic("Overlay Unmounted");
  }, []);

  const workspace = useMemo(() => {
    if (
      !modalState ||
      modalState.kind === "create" ||
      modalState.kind === "hub" ||
      modalState.kind === "domainDiscovery" ||
      modalState.kind === "situationDiscovery" ||
      modalState.kind === "goalDiscovery" ||
      modalState.kind === "draftModelGeneration" ||
      modalState.kind === "modelApprovalConfirm" ||
      modalState.kind === "sceneCreationPlaceholder"
    ) {
      return null;
    }
    return registrySnapshot.workspaces[modalState.workspaceId] ?? null;
  }, [modalState, registrySnapshot.workspaces]);

  const refreshActiveRuntimeContext = useCallback(() => {
    const active = getActiveWorkspace();
    if (active) bindActiveWorkspaceToRuntimeContext(active.workspaceId);
  }, []);

  const handleSubmitWorkspaceName = useCallback(
    (workspaceName: string) => {
      if (!modalState) return;
      if (modalState.kind === "create") {
        const created = createWorkspace(workspaceName);
        emitWorkspaceHubDiagnostic("Workspace Created", {
          workspaceId: created.workspaceId,
          workspaceName: created.workspaceName,
        });
        bindActiveWorkspaceToRuntimeContext(created.workspaceId);
      } else if (modalState.kind === "rename" && workspace) {
        renameWorkspace(workspace.workspaceId, workspaceName);
        refreshActiveRuntimeContext();
      }
      closeWorkspaceModal();
    },
    [modalState, refreshActiveRuntimeContext, workspace]
  );

  const handleArchive = useCallback(() => {
    if (!workspace) return;
    archiveWorkspace(workspace.workspaceId);
    emitWorkspaceHubDiagnostic("Workspace Archived", { workspaceId: workspace.workspaceId });
    refreshActiveRuntimeContext();
    closeWorkspaceModal();
  }, [refreshActiveRuntimeContext, workspace]);

  const handleDelete = useCallback(() => {
    if (!workspace) return;
    deleteWorkspace(workspace.workspaceId);
    emitWorkspaceHubDiagnostic("Workspace Deleted", { workspaceId: workspace.workspaceId });
    refreshActiveRuntimeContext();
    closeWorkspaceModal();
  }, [refreshActiveRuntimeContext, workspace]);

  if (!mounted || !modalState) return null;

  const dialog =
    modalState.kind === "hub" ? (
      <WorkspaceHubDialog registrySnapshot={registrySnapshot} onClose={closeWorkspaceModal} />
    ) : modalState.kind === "domainDiscovery" ? (
      <DomainDiscoveryDialog
        workspaceId={modalState.workspaceId}
        onCancel={closeWorkspaceModal}
        onComplete={() => setWorkspaceModalState({ kind: "situationDiscovery", workspaceId: modalState.workspaceId })}
      />
    ) : modalState.kind === "situationDiscovery" ? (
      <SituationDiscoveryDialog
        workspaceId={modalState.workspaceId}
        onCancel={closeWorkspaceModal}
        onComplete={() => setWorkspaceModalState({ kind: "goalDiscovery", workspaceId: modalState.workspaceId })}
      />
    ) : modalState.kind === "goalDiscovery" ? (
      <GoalDiscoveryDialog
        workspaceId={modalState.workspaceId}
        onCancel={closeWorkspaceModal}
        onComplete={() => setWorkspaceModalState({ kind: "draftModelGeneration", workspaceId: modalState.workspaceId })}
      />
    ) : modalState.kind === "draftModelGeneration" ? (
      <DraftModelGenerationDialog
        workspaceId={modalState.workspaceId}
        onCancel={closeWorkspaceModal}
        onApproveRequested={() => setWorkspaceModalState({ kind: "modelApprovalConfirm", workspaceId: modalState.workspaceId })}
      />
    ) : modalState.kind === "modelApprovalConfirm" ? (
      <ModelApprovalConfirmDialog
        workspaceId={modalState.workspaceId}
        onBack={() => setWorkspaceModalState({ kind: "draftModelGeneration", workspaceId: modalState.workspaceId })}
        onApproved={() => setWorkspaceModalState({ kind: "sceneCreationPlaceholder", workspaceId: modalState.workspaceId })}
      />
    ) : modalState.kind === "sceneCreationPlaceholder" ? (
      <SceneCreationPlaceholderDialog workspaceId={modalState.workspaceId} onClose={closeWorkspaceModal} />
    ) : modalState.kind === "create" || modalState.kind === "rename" ? (
      <WorkspaceNameModal
        open
        title={modalState.kind === "rename" ? "Rename Workspace" : "New Workspace"}
        initialName={modalState.kind === "rename" ? workspace?.workspaceName ?? "" : ""}
        submitLabel={modalState.kind === "rename" ? "Rename" : "Create"}
        onCancel={closeWorkspaceModal}
        onSubmit={handleSubmitWorkspaceName}
      />
    ) : modalState.kind === "archive" ? (
      <WorkspaceArchiveConfirmDialog workspace={workspace} onCancel={closeWorkspaceModal} onConfirm={handleArchive} />
    ) : (
      <WorkspaceDeleteConfirmDialog workspace={workspace} onCancel={closeWorkspaceModal} onConfirm={handleDelete} />
    );

  return createPortal(dialog, document.body);
}

function WorkspaceNameModal(props: {
  open: boolean;
  title: string;
  initialName: string;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (workspaceName: string) => void;
}): React.ReactElement | null {
  const [workspaceName, setWorkspaceName] = React.useState(props.initialName);

  React.useEffect(() => {
    if (props.open) setWorkspaceName(props.initialName);
  }, [props.initialName, props.open]);

  if (!props.open) return null;

  const trimmed = workspaceName.trim();

  return (
    <WorkspaceOverlayFrame label={props.title} onCancel={props.onCancel}>
      <form
        onPointerDown={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          if (trimmed) props.onSubmit(trimmed);
        }}
        style={modalPanelStyle()}
      >
        <WorkspaceModalHeader title={props.title} />
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: nx.muted }}>Workspace Name</span>
          <input
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
            autoFocus
            style={modalInputStyle()}
          />
        </label>
        <footer style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={props.onCancel} style={modalButtonStyle(false)}>
            Cancel
          </button>
          <button type="submit" disabled={!trimmed} style={modalButtonStyle(Boolean(trimmed))}>
            {props.submitLabel}
          </button>
        </footer>
      </form>
    </WorkspaceOverlayFrame>
  );
}

function WorkspaceHubDialog(props: {
  registrySnapshot: ReturnType<typeof getWorkspaceRegistrySnapshot>;
  onClose: () => void;
}): React.ReactElement {
  const [query, setQuery] = React.useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const activeWorkspaceId = props.registrySnapshot.activeWorkspaceId;
  const workspaces = React.useMemo(
    () =>
      props.registrySnapshot.workspaceOrder
        .map((workspaceId) => props.registrySnapshot.workspaces[workspaceId])
        .filter((workspace): workspace is Workspace => Boolean(workspace))
        .filter((workspace) => {
          if (!normalizedQuery) return true;
          return workspace.workspaceName.toLowerCase().includes(normalizedQuery);
        }),
    [normalizedQuery, props.registrySnapshot.workspaceOrder, props.registrySnapshot.workspaces]
  );
  const activeWorkspaces = React.useMemo(
    () =>
      props.registrySnapshot.workspaceOrder
        .map((workspaceId) => props.registrySnapshot.workspaces[workspaceId])
        .filter((workspace): workspace is Workspace => Boolean(workspace) && workspace.status === "active"),
    [props.registrySnapshot.workspaceOrder, props.registrySnapshot.workspaces]
  );
  const onlyDemoWorkspace = activeWorkspaces.length === 1 && activeWorkspaces[0]?.workspaceId === "demo_workspace";

  const openWorkspace = React.useCallback(
    (workspaceId: string) => {
      selectWorkspaceForRuntime(workspaceId);
      emitWorkspaceHubDiagnostic("Workspace Opened", { workspaceId });
      props.onClose();
    },
    [props]
  );

  const duplicateAndStayInHub = React.useCallback((workspaceId: string) => {
    const duplicated = duplicateWorkspace(workspaceId);
    if (duplicated) {
      bindActiveWorkspaceToRuntimeContext(duplicated.workspaceId);
      emitWorkspaceHubDiagnostic("Workspace Created", {
        workspaceId: duplicated.workspaceId,
        workspaceName: duplicated.workspaceName,
        source: "duplicate",
      });
    }
  }, []);

  return (
    <WorkspaceOverlayFrame label="Workspace Hub" onCancel={props.onClose}>
      <section onPointerDown={(event) => event.stopPropagation()} style={hubPanelStyle()}>
        <header style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
          <div style={{ display: "grid", gap: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
              Workspaces
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: nx.text }}>Workspace Hub</div>
            <div style={{ fontSize: 12, color: nx.muted }}>Manage and switch between workspaces.</div>
          </div>
          <button type="button" onClick={props.onClose} style={modalButtonStyle(false)}>
            Close
          </button>
        </header>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Workspaces..."
            aria-label="Search Workspaces"
            style={{ ...modalInputStyle(), flex: "1 1 220px" }}
          />
          <button type="button" onClick={openWorkspaceCreateModal} style={modalButtonStyle(true)}>
            New Workspace
          </button>
        </div>

        {onlyDemoWorkspace ? (
          <div style={hubEmptyStateStyle()}>
            <div style={{ color: nx.text, fontSize: 13, fontWeight: 800 }}>Create your first workspace.</div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
              Demo Workspace is ready. Add a new workspace when you want to model your own system.
            </div>
          </div>
        ) : null}

        <div style={{ display: "grid", gap: 8, minHeight: 0, overflowY: "auto", paddingRight: 2 }}>
          {workspaces.length === 0 ? (
            <div style={{ color: nx.muted, fontSize: 12, padding: 12 }}>No workspaces match your search.</div>
          ) : (
            workspaces.map((workspace) => {
              const isActive = activeWorkspaceId === workspace.workspaceId;
              const archived = workspace.status === "archived";
              const openDisabled = archived || isActive;
              return (
                <div key={workspace.workspaceId} style={workspaceHubRowStyle(isActive)}>
                  <div style={{ minWidth: 0, display: "grid", gap: 4 }}>
                    <div style={{ color: nx.text, fontSize: 13, fontWeight: 800, overflowWrap: "anywhere" }}>
                      {workspace.workspaceName}
                    </div>
                    <div style={{ color: nx.lowMuted, fontSize: 10, lineHeight: 1.35 }}>
                      Status: {workspace.status}
                      {" · "}
                      Last opened: {formatWorkspaceDate(workspace.lastOpenedAt)}
                      {isActive ? " · Current" : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <WorkspaceHubActionButton label="Open" disabled={openDisabled} onClick={() => openWorkspace(workspace.workspaceId)} />
                    <WorkspaceHubActionButton label="Rename" onClick={() => openWorkspaceRenameModal(workspace.workspaceId)} />
                    <WorkspaceHubActionButton label="Duplicate" onClick={() => duplicateAndStayInHub(workspace.workspaceId)} />
                    <WorkspaceHubActionButton
                      label="Archive"
                      disabled={!canArchiveWorkspace(workspace.workspaceId)}
                      onClick={() => openWorkspaceArchiveModal(workspace.workspaceId)}
                    />
                    <WorkspaceHubActionButton
                      label="Delete"
                      disabled={!canDeleteWorkspace(workspace.workspaceId)}
                      onClick={() => openWorkspaceDeleteModal(workspace.workspaceId)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </WorkspaceOverlayFrame>
  );
}

function DomainDiscoveryDialog(props: {
  workspaceId: string;
  onCancel: () => void;
  onComplete: () => void;
}): React.ReactElement {
  const existingSelection = getWorkspaceDomainSelection(props.workspaceId);
  const [selectedDomainId, setSelectedDomainId] = React.useState<WorkspaceDomainId | null>(
    existingSelection?.domainId ?? null
  );
  const selectedOption = selectedDomainId
    ? NEXORA_WORKSPACE_DOMAIN_OPTIONS.find((option) => option.domainId === selectedDomainId) ?? null
    : null;

  const handleContinue = React.useCallback(() => {
    if (!selectedDomainId || !selectedOption) return;
    const selection = saveWorkspaceDomainSelection({
      workspaceId: props.workspaceId,
      domainId: selectedDomainId,
    });
    emitDomainDiscoveryDiagnostic("Domain Saved", {
      Workspace: props.workspaceId,
      "Domain Selected": selection.domainName,
    });
    props.onComplete();
  }, [props, selectedDomainId, selectedOption]);

  return (
    <WorkspaceOverlayFrame label="Domain Discovery" onCancel={props.onCancel}>
      <section onPointerDown={(event) => event.stopPropagation()} style={domainDiscoveryPanelStyle()}>
        <header style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
          <div style={{ display: "grid", gap: 5 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
              Domain Discovery
            </div>
            <div style={{ fontSize: 19, lineHeight: 1.2, fontWeight: 800, color: nx.text }}>
              What kind of system would you like to model?
            </div>
            <div style={{ fontSize: 12, color: nx.muted }}>
              Choose the domain that best represents your workspace.
            </div>
          </div>
          <button type="button" onClick={props.onCancel} style={modalButtonStyle(false)}>
            Close
          </button>
        </header>

        <div style={domainCardGridStyle()}>
          {NEXORA_WORKSPACE_DOMAIN_OPTIONS.map((option) => {
            const selected = selectedDomainId === option.domainId;
            return (
              <button
                key={option.domainId}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setSelectedDomainId(option.domainId);
                  emitDomainDiscoveryDiagnostic("Domain Selected", {
                    Workspace: props.workspaceId,
                    "Domain Selected": option.domainName,
                  });
                }}
                style={domainCardStyle(selected)}
              >
                <span style={{ color: nx.text, fontSize: 13, fontWeight: 800, lineHeight: 1.2 }}>
                  {option.domainName}
                </span>
                <span style={{ color: selected ? nx.textSoft : nx.muted, fontSize: 11, lineHeight: 1.4 }}>
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>

        <footer style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={props.onCancel} style={modalButtonStyle(false)}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedDomainId}
            onClick={handleContinue}
            style={modalButtonStyle(Boolean(selectedDomainId))}
          >
            Continue
          </button>
        </footer>
      </section>
    </WorkspaceOverlayFrame>
  );
}

function SituationDiscoveryDialog(props: {
  workspaceId: string;
  onCancel: () => void;
  onComplete: () => void;
}): React.ReactElement {
  const domainSelection = getWorkspaceDomainSelection(props.workspaceId);
  const existingSituation = getWorkspaceSituation(props.workspaceId);
  const domainId = domainSelection?.domainId ?? existingSituation?.domainId ?? "custom";
  const domainName = domainSelection?.domainName ?? "Custom";
  const templates = getSituationTemplatesForDomain(domainId);
  const [situationText, setSituationText] = React.useState(existingSituation?.situationText ?? "");
  const meaningfulText = situationText.trim();

  const handleTemplateClick = React.useCallback((exampleText: string) => {
    setSituationText((currentText) => {
      const trimmed = currentText.trim();
      if (!trimmed) return exampleText;
      if (trimmed.includes(exampleText)) return currentText;
      return `${trimmed}\n\n${exampleText}`;
    });
    emitSituationDiscoveryDiagnostic("Template Applied", {
      Workspace: props.workspaceId,
      Domain: domainName,
    });
  }, [domainName, props.workspaceId]);

  const handleContinue = React.useCallback(() => {
    if (!meaningfulText) return;
    const situation = saveWorkspaceSituation({
      workspaceId: props.workspaceId,
      domainId,
      situationText: meaningfulText,
    });
    emitSituationDiscoveryDiagnostic(existingSituation ? "Situation Updated" : "Situation Saved", {
      Workspace: props.workspaceId,
      Domain: domainName,
      characterCount: situation.situationText.length,
    });
    props.onComplete();
  }, [domainId, domainName, existingSituation, meaningfulText, props]);

  return (
    <WorkspaceOverlayFrame label="Situation Discovery" onCancel={props.onCancel}>
      <section onPointerDown={(event) => event.stopPropagation()} style={situationDiscoveryPanelStyle()}>
        <header style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
          <div style={{ display: "grid", gap: 5 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
              Situation Discovery
            </div>
            <div style={{ fontSize: 19, lineHeight: 1.2, fontWeight: 800, color: nx.text }}>
              Describe your situation
            </div>
            <div style={{ fontSize: 12, color: nx.muted }}>
              Tell Nexora what is happening in your system.
            </div>
            <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800 }}>
              Selected Domain: {domainName}
            </div>
          </div>
          <button type="button" onClick={props.onCancel} style={modalButtonStyle(false)}>
            Close
          </button>
        </header>

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Quick Starts
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {templates.map((template) => (
              <button
                key={template.templateId}
                type="button"
                onClick={() => handleTemplateClick(template.exampleText)}
                style={templateButtonStyle()}
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        <label style={{ display: "grid", gap: 7, minHeight: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: nx.muted }}>Situation</span>
          <textarea
            value={situationText}
            onChange={(event) => setSituationText(event.target.value)}
            placeholder={getSituationPlaceholderForDomain(domainId)}
            autoFocus
            style={situationTextareaStyle()}
          />
        </label>

        <footer style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={props.onCancel} style={modalButtonStyle(false)}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!meaningfulText}
            onClick={handleContinue}
            style={modalButtonStyle(Boolean(meaningfulText))}
          >
            Continue
          </button>
        </footer>
      </section>
    </WorkspaceOverlayFrame>
  );
}

function GoalDiscoveryDialog(props: {
  workspaceId: string;
  onCancel: () => void;
  onComplete: () => void;
}): React.ReactElement {
  const domainSelection = getWorkspaceDomainSelection(props.workspaceId);
  const situation = getWorkspaceSituation(props.workspaceId);
  const domainId = domainSelection?.domainId ?? situation?.domainId ?? "custom";
  const domainName = domainSelection?.domainName ?? "Custom";
  const suggestions = getGoalSuggestionsForDomain(domainId);
  const existingGoals = getWorkspaceGoals(props.workspaceId);
  const [selectedGoals, setSelectedGoals] = React.useState<readonly WorkspaceGoal[]>(existingGoals);
  const [customGoalName, setCustomGoalName] = React.useState("");
  const selectedGoalIds = React.useMemo(
    () => new Set(selectedGoals.map((goal) => goal.goalId)),
    [selectedGoals]
  );
  const selectedCount = selectedGoals.length;

  const toggleSuggestedGoal = React.useCallback((suggestion: (typeof suggestions)[number]) => {
    setSelectedGoals((currentGoals) => {
      const alreadySelected = currentGoals.some((goal) => goal.goalId === suggestion.goalId);
      if (alreadySelected) {
        emitGoalDiscoveryDiagnostic("Goal Removed", {
          Workspace: props.workspaceId,
          goalName: suggestion.goalName,
        });
        return currentGoals.filter((goal) => goal.goalId !== suggestion.goalId);
      }
      const nextGoal = createSuggestedGoal({
        workspaceId: props.workspaceId,
        suggestion,
      });
      emitGoalDiscoveryDiagnostic("Goal Added", {
        Workspace: props.workspaceId,
        goalName: nextGoal.goalName,
      });
      return [...currentGoals, nextGoal];
    });
  }, [props.workspaceId]);

  const handleAddCustomGoal = React.useCallback(() => {
    const cleaned = customGoalName.trim();
    if (!cleaned) return;
    const customGoal = createCustomGoal({
      workspaceId: props.workspaceId,
      goalName: cleaned,
    });
    setSelectedGoals((currentGoals) => {
      if (currentGoals.some((goal) => goal.goalId === customGoal.goalId)) return currentGoals;
      return [...currentGoals, customGoal];
    });
    setCustomGoalName("");
    emitGoalDiscoveryDiagnostic("Custom Goal Added", {
      Workspace: props.workspaceId,
      goalName: customGoal.goalName,
    });
  }, [customGoalName, props.workspaceId]);

  const removeGoal = React.useCallback((goalId: string) => {
    setSelectedGoals((currentGoals) => {
      const removed = currentGoals.find((goal) => goal.goalId === goalId);
      if (removed) {
        emitGoalDiscoveryDiagnostic("Goal Removed", {
          Workspace: props.workspaceId,
          goalName: removed.goalName,
        });
      }
      return currentGoals.filter((goal) => goal.goalId !== goalId);
    });
  }, [props.workspaceId]);

  const handleContinue = React.useCallback(() => {
    if (!selectedGoals.length) return;
    const savedGoals = saveWorkspaceGoals({
      workspaceId: props.workspaceId,
      goals: selectedGoals,
    });
    emitGoalDiscoveryDiagnostic("Goal Saved", {
      Workspace: props.workspaceId,
      "Goals Selected": savedGoals.length,
    });
    props.onComplete();
  }, [props, selectedGoals]);

  return (
    <WorkspaceOverlayFrame label="Goal Discovery" onCancel={props.onCancel}>
      <section onPointerDown={(event) => event.stopPropagation()} style={goalDiscoveryPanelStyle()}>
        <header style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
          <div style={{ display: "grid", gap: 5 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
              Goal Discovery
            </div>
            <div style={{ fontSize: 19, lineHeight: 1.2, fontWeight: 800, color: nx.text }}>
              What are you trying to achieve?
            </div>
            <div style={{ fontSize: 12, color: nx.muted }}>
              Choose the outcomes you want Nexora to focus on.
            </div>
            <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800 }}>
              Selected Domain: {domainName}
            </div>
          </div>
          <button type="button" onClick={props.onCancel} style={modalButtonStyle(false)}>
            Close
          </button>
        </header>

        <div style={{ display: "grid", gap: 10, minHeight: 0, overflowY: "auto", paddingRight: 2 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Suggested Outcomes
            </div>
            <div style={goalSuggestionGridStyle()}>
              {suggestions.map((suggestion) => {
                const selected = selectedGoalIds.has(suggestion.goalId);
                return (
                  <button
                    key={suggestion.goalId}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleSuggestedGoal(suggestion)}
                    style={goalSuggestionButtonStyle(selected)}
                  >
                    {selected ? "Selected: " : ""}
                    {suggestion.goalName}
                  </button>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleAddCustomGoal();
            }}
            style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            <input
              value={customGoalName}
              onChange={(event) => setCustomGoalName(event.target.value)}
              placeholder="Add Custom Goal"
              aria-label="Add Custom Goal"
              style={{ ...modalInputStyle(), flex: "1 1 220px" }}
            />
            <button type="submit" disabled={!customGoalName.trim()} style={modalButtonStyle(Boolean(customGoalName.trim()))}>
              Add
            </button>
          </form>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Selected Goals
            </div>
            {selectedGoals.length ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {selectedGoals.map((goal) => (
                  <button
                    key={goal.goalId}
                    type="button"
                    onClick={() => removeGoal(goal.goalId)}
                    title="Remove goal"
                    style={selectedGoalChipStyle()}
                  >
                    {goal.goalName} x
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
                Select at least one goal so Nexora knows what outcome to frame next.
              </div>
            )}
          </div>
        </div>

        <footer style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
          <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800 }}>
            Goals Selected: {selectedCount}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={props.onCancel} style={modalButtonStyle(false)}>
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedCount}
              onClick={handleContinue}
              style={modalButtonStyle(Boolean(selectedCount))}
            >
              Continue
            </button>
          </div>
        </footer>
      </section>
    </WorkspaceOverlayFrame>
  );
}

function DraftModelGenerationDialog(props: {
  workspaceId: string;
  onCancel: () => void;
  onApproveRequested: () => void;
}): React.ReactElement {
  const domainSelection = getWorkspaceDomainSelection(props.workspaceId);
  const situation = getWorkspaceSituation(props.workspaceId);
  const goals = getWorkspaceGoals(props.workspaceId);
  const [draftModel, setDraftModel] = React.useState(() => getWorkspaceDraftModel(props.workspaceId));
  const [newObjectName, setNewObjectName] = React.useState("");

  React.useEffect(() => {
    const existingDraft = getWorkspaceDraftModel(props.workspaceId);
    if (existingDraft) {
      setDraftModel(existingDraft);
      return;
    }
    const generatedDraft = generateWorkspaceDraftModel({
      workspaceId: props.workspaceId,
      domain: domainSelection,
      situation,
      goals,
    });
    const savedDraft = saveWorkspaceDraftModel(generatedDraft);
    setDraftModel(savedDraft);
    emitDraftModelGenerationDiagnostic("Objects Generated", {
      Workspace: props.workspaceId,
      "Objects Generated": savedDraft.objects.length,
    });
  }, [domainSelection, goals, props.workspaceId, situation]);

  const handleRemoveObject = React.useCallback((objectId: string) => {
    const updatedDraft = removeDraftObject(props.workspaceId, objectId);
    if (updatedDraft) setDraftModel(updatedDraft);
    emitDraftModelGenerationDiagnostic("Object Removed", {
      Workspace: props.workspaceId,
      objectId,
    });
  }, [props.workspaceId]);

  const handleRenameObject = React.useCallback((objectId: string, objectName: string) => {
    const updatedDraft = renameDraftObject(props.workspaceId, objectId, objectName);
    if (updatedDraft) setDraftModel(updatedDraft);
    emitDraftModelGenerationDiagnostic("Object Renamed", {
      Workspace: props.workspaceId,
      objectId,
      objectName,
    });
  }, [props.workspaceId]);

  const handleAddObject = React.useCallback(() => {
    const cleanedName = newObjectName.trim();
    if (!cleanedName) return;
    const updatedDraft = addDraftObject(props.workspaceId, cleanedName);
    if (updatedDraft) setDraftModel(updatedDraft);
    setNewObjectName("");
    emitDraftModelGenerationDiagnostic("Object Added", {
      Workspace: props.workspaceId,
      objectName: cleanedName,
    });
  }, [newObjectName, props.workspaceId]);

  const handleApprove = React.useCallback(() => {
    props.onApproveRequested();
  }, [props]);

  return (
    <WorkspaceOverlayFrame label="Draft Model Generation" onCancel={props.onCancel}>
      <section onPointerDown={(event) => event.stopPropagation()} style={draftModelPanelStyle()}>
        <header style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
          <div style={{ display: "grid", gap: 5 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
              Draft Model
            </div>
            <div style={{ fontSize: 19, lineHeight: 1.2, fontWeight: 800, color: nx.text }}>
              Suggested Objects
            </div>
            <div style={{ fontSize: 12, color: nx.muted }}>
              Review Nexora's proposed objects before they become part of the model.
            </div>
            <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800 }}>
              {domainSelection?.domainName ?? "Custom"} · Goals: {goals.length}
            </div>
          </div>
          <button type="button" onClick={props.onCancel} style={modalButtonStyle(false)}>
            Close
          </button>
        </header>

        <div style={{ display: "grid", gap: 10, minHeight: 0, overflowY: "auto", paddingRight: 2 }}>
          {!draftModel ? (
            <div style={{ color: nx.muted, fontSize: 12 }}>Generating draft model...</div>
          ) : draftModel.objects.length ? (
            <div style={draftObjectGridStyle()}>
              {draftModel.objects.map((object) => (
                <DraftObjectReviewCard
                  key={object.objectId}
                  object={object}
                  onRemove={() => handleRemoveObject(object.objectId)}
                  onRename={(objectName) => handleRenameObject(object.objectId, objectName)}
                />
              ))}
            </div>
          ) : (
            <div style={{ color: nx.muted, fontSize: 12 }}>
              No draft objects remain. Add at least one object before approving the draft.
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleAddObject();
            }}
            style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            <input
              value={newObjectName}
              onChange={(event) => setNewObjectName(event.target.value)}
              placeholder="Add Object"
              aria-label="Add Object"
              style={{ ...modalInputStyle(), flex: "1 1 220px" }}
            />
            <button type="submit" disabled={!newObjectName.trim()} style={modalButtonStyle(Boolean(newObjectName.trim()))}>
              Add Object
            </button>
          </form>
        </div>

        <footer style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
          <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800 }}>
            Draft Objects Generated: {draftModel?.objects.length ?? 0}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={props.onCancel} style={modalButtonStyle(false)}>
              Cancel
            </button>
            <button
              type="button"
              disabled={!draftModel?.objects.length}
              onClick={handleApprove}
              style={modalButtonStyle(Boolean(draftModel?.objects.length))}
            >
              Approve Model
            </button>
          </div>
        </footer>
      </section>
    </WorkspaceOverlayFrame>
  );
}

function DraftObjectReviewCard(props: {
  object: WorkspaceDraftObject;
  onRemove: () => void;
  onRename: (objectName: string) => void;
}): React.ReactElement {
  const [objectName, setObjectName] = React.useState(props.object.objectName);

  React.useEffect(() => {
    setObjectName(props.object.objectName);
  }, [props.object.objectName]);

  const commitRename = React.useCallback(() => {
    const cleanedName = objectName.trim();
    if (!cleanedName || cleanedName === props.object.objectName) return;
    props.onRename(cleanedName);
  }, [objectName, props]);

  return (
    <article style={draftObjectCardStyle()}>
      <header style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "start" }}>
        <input
          value={objectName}
          onChange={(event) => setObjectName(event.target.value)}
          onBlur={commitRename}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitRename();
            }
          }}
          aria-label={`Rename ${props.object.objectName}`}
          style={draftObjectNameInputStyle()}
        />
        <button type="button" onClick={props.onRemove} style={hubActionButtonStyle()}>
          Remove
        </button>
      </header>
      <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>
        {props.object.objectType} · Confidence {Math.round(props.object.confidence * 100)}%
      </div>
      <p style={{ margin: 0, color: nx.muted, fontSize: 11, lineHeight: 1.45 }}>
        Why: {props.object.suggestionReason}
      </p>
    </article>
  );
}

function ModelApprovalConfirmDialog(props: {
  workspaceId: string;
  onBack: () => void;
  onApproved: () => void;
}): React.ReactElement {
  const domainSelection = getWorkspaceDomainSelection(props.workspaceId);
  const draftModel = getWorkspaceDraftModel(props.workspaceId);
  const goals = getWorkspaceGoals(props.workspaceId);
  const handleApprove = React.useCallback(() => {
    if (!draftModel) return;
    const result = approveWorkspaceModelFromDraft({ draft: draftModel });
    emitModelApprovalDiagnostic("Draft Approved", {
      Workspace: props.workspaceId,
      "Objects Promoted": result.objects.length,
      "Model Version": "v1",
    });
    emitModelApprovalDiagnostic("Scene Handoff Ready", {
      Workspace: props.workspaceId,
      modelId: result.model.modelId,
    });
    props.onApproved();
  }, [draftModel, props]);

  return (
    <WorkspaceOverlayFrame label="Model Approval" onCancel={props.onBack}>
      <section onPointerDown={(event) => event.stopPropagation()} style={modalPanelStyle()}>
        <header style={{ display: "grid", gap: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
            Model Ready
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: nx.text }}>
            Nexora is ready to create your first workspace model.
          </div>
        </header>
        <div style={{ display: "grid", gap: 8 }}>
          <ModelApprovalMetric label="Objects" value={String(draftModel?.objects.length ?? 0)} />
          <ModelApprovalMetric label="Domain" value={domainSelection?.domainName ?? "Custom"} />
          <ModelApprovalMetric label="Goals" value={String(goals.length)} />
        </div>
        <footer style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={props.onBack} style={modalButtonStyle(false)}>
            Back
          </button>
          <button
            type="button"
            disabled={!draftModel?.objects.length}
            onClick={handleApprove}
            style={modalButtonStyle(Boolean(draftModel?.objects.length))}
          >
            Approve Model
          </button>
        </footer>
      </section>
    </WorkspaceOverlayFrame>
  );
}

function ModelApprovalMetric(props: { label: string; value: string }): React.ReactElement {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, color: nx.muted, fontSize: 12 }}>
      <span style={{ fontWeight: 800 }}>{props.label}</span>
      <span style={{ color: nx.text, fontWeight: 800 }}>{props.value}</span>
    </div>
  );
}

function SceneCreationPlaceholderDialog(props: {
  workspaceId: string;
  onClose: () => void;
}): React.ReactElement {
  const model = getWorkspaceModel(props.workspaceId);
  return (
    <WorkspaceOverlayFrame label="Scene Creation Pending" onCancel={props.onClose}>
      <section onPointerDown={(event) => event.stopPropagation()} style={modalPanelStyle()}>
        <header style={{ display: "grid", gap: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
            Scene Creation
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: nx.text }}>Scene Handoff Ready</div>
        </header>
        <div style={{ fontSize: 12, lineHeight: 1.45, color: nx.muted }}>
          {model
            ? `Workspace model approved with ${model.approvedObjects.length} object${model.approvedObjects.length === 1 ? "" : "s"}. Scene Creation will attach here in NW-B:7.`
            : "Workspace model approval is ready for scene creation."}
        </div>
        <footer style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="button" onClick={props.onClose} style={modalButtonStyle(true)}>
            Close
          </button>
        </footer>
      </section>
    </WorkspaceOverlayFrame>
  );
}

function WorkspaceArchiveConfirmDialog(props: {
  workspace: Workspace | null;
  onCancel: () => void;
  onConfirm: () => void;
}): React.ReactElement | null {
  if (!props.workspace) return null;

  return (
    <WorkspaceOverlayFrame label="Archive Workspace" onCancel={props.onCancel}>
      <div onPointerDown={(event) => event.stopPropagation()} style={modalPanelStyle()}>
        <WorkspaceModalHeader title="Archive Workspace" />
        <div style={{ fontSize: 12, lineHeight: 1.45, color: nx.muted }}>
          Archive {props.workspace.workspaceName}? This hides it from the active workspace list.
        </div>
        <footer style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={props.onCancel} style={modalButtonStyle(false)}>
            Cancel
          </button>
          <button type="button" onClick={props.onConfirm} style={modalButtonStyle(true)}>
            Archive
          </button>
        </footer>
      </div>
    </WorkspaceOverlayFrame>
  );
}

function WorkspaceDeleteConfirmDialog(props: {
  workspace: Workspace | null;
  onCancel: () => void;
  onConfirm: () => void;
}): React.ReactElement | null {
  if (!props.workspace) return null;

  return (
    <WorkspaceOverlayFrame label="Delete Workspace" onCancel={props.onCancel}>
      <div onPointerDown={(event) => event.stopPropagation()} style={modalPanelStyle()}>
        <WorkspaceModalHeader title="Delete Workspace" />
        <div style={{ fontSize: 12, lineHeight: 1.45, color: nx.muted }}>
          Delete {props.workspace.workspaceName}? This removes the workspace from the registry.
        </div>
        <footer style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={props.onCancel} style={modalButtonStyle(false)}>
            Cancel
          </button>
          <button type="button" onClick={props.onConfirm} style={modalButtonStyle(true)}>
            Delete
          </button>
        </footer>
      </div>
    </WorkspaceOverlayFrame>
  );
}

function WorkspaceOverlayFrame(props: {
  label: string;
  onCancel: () => void;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={props.label}
      data-nx="workspace-modal-host"
      style={modalOverlayStyle()}
      onPointerDown={props.onCancel}
    >
      {props.children}
    </div>
  );
}

function WorkspaceModalHeader(props: { title: string }): React.ReactElement {
  return (
    <header style={{ display: "grid", gap: 4 }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
        Workspaces
      </div>
      <div style={{ fontSize: 15, fontWeight: 800, color: nx.text }}>{props.title}</div>
    </header>
  );
}

function WorkspaceHubActionButton(props: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}): React.ReactElement {
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={props.onClick}
      style={hubActionButtonStyle(props.disabled)}
    >
      {props.label}
    </button>
  );
}

function formatWorkspaceDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function modalOverlayStyle(): React.CSSProperties {
  return {
    position: "fixed",
    inset: 0,
    zIndex: 470,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    background: nx.overlayBackdrop,
    backdropFilter: "blur(8px)",
  };
}

function modalPanelStyle(): React.CSSProperties {
  return {
    width: "min(420px, 94vw)",
    borderRadius: 8,
    border: `1px solid ${nx.border}`,
    background: nx.popoverBg,
    boxShadow: nx.popoverShadow,
    padding: 14,
    display: "grid",
    gap: 12,
  };
}

function hubPanelStyle(): React.CSSProperties {
  return {
    width: "min(760px, 94vw)",
    maxHeight: "min(78vh, 720px)",
    borderRadius: 8,
    border: `1px solid ${nx.border}`,
    background: nx.popoverBg,
    boxShadow: nx.popoverShadow,
    padding: 14,
    display: "grid",
    gridTemplateRows: "auto auto auto 1fr",
    gap: 12,
    overflow: "hidden",
  };
}

function domainDiscoveryPanelStyle(): React.CSSProperties {
  return {
    width: "min(820px, 94vw)",
    maxHeight: "min(82vh, 760px)",
    borderRadius: 8,
    border: `1px solid ${nx.border}`,
    background: nx.popoverBg,
    boxShadow: nx.popoverShadow,
    padding: 14,
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    gap: 14,
    overflow: "hidden",
  };
}

function situationDiscoveryPanelStyle(): React.CSSProperties {
  return {
    width: "min(720px, 94vw)",
    maxHeight: "min(82vh, 760px)",
    borderRadius: 8,
    border: `1px solid ${nx.border}`,
    background: nx.popoverBg,
    boxShadow: nx.popoverShadow,
    padding: 14,
    display: "grid",
    gridTemplateRows: "auto auto minmax(220px, 1fr) auto",
    gap: 14,
    overflow: "hidden",
  };
}

function goalDiscoveryPanelStyle(): React.CSSProperties {
  return {
    width: "min(760px, 94vw)",
    maxHeight: "min(82vh, 760px)",
    borderRadius: 8,
    border: `1px solid ${nx.border}`,
    background: nx.popoverBg,
    boxShadow: nx.popoverShadow,
    padding: 14,
    display: "grid",
    gridTemplateRows: "auto minmax(260px, 1fr) auto",
    gap: 14,
    overflow: "hidden",
  };
}

function draftModelPanelStyle(): React.CSSProperties {
  return {
    width: "min(860px, 94vw)",
    maxHeight: "min(84vh, 780px)",
    borderRadius: 8,
    border: `1px solid ${nx.border}`,
    background: nx.popoverBg,
    boxShadow: nx.popoverShadow,
    padding: 14,
    display: "grid",
    gridTemplateRows: "auto minmax(280px, 1fr) auto",
    gap: 14,
    overflow: "hidden",
  };
}

function domainCardGridStyle(): React.CSSProperties {
  return {
    minHeight: 0,
    overflowY: "auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 8,
    paddingRight: 2,
  };
}

function draftObjectGridStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 8,
  };
}

function draftObjectCardStyle(): React.CSSProperties {
  return {
    minHeight: 132,
    borderRadius: 6,
    border: `1px solid ${nx.border}`,
    background: nx.bgPanelSoft,
    padding: 10,
    display: "grid",
    gap: 8,
    alignContent: "start",
  };
}

function draftObjectNameInputStyle(): React.CSSProperties {
  return {
    minWidth: 0,
    width: "100%",
    border: `1px solid ${nx.borderSoft}`,
    borderRadius: 4,
    background: nx.bgControl,
    color: nx.text,
    fontSize: 13,
    fontWeight: 800,
    padding: "7px 8px",
    outline: "none",
  };
}

function goalSuggestionGridStyle(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 8,
  };
}

function goalSuggestionButtonStyle(selected: boolean): React.CSSProperties {
  return {
    minHeight: 42,
    borderRadius: 6,
    border: `1px solid ${selected ? nx.navTileActiveBorder : nx.border}`,
    background: selected ? nx.navTileActiveBg : nx.bgPanelSoft,
    boxShadow: selected ? nx.navTileActiveShadow : "none",
    color: selected ? nx.text : nx.muted,
    fontSize: 12,
    fontWeight: 800,
    padding: "0 10px",
    textAlign: "left",
    cursor: "pointer",
  };
}

function selectedGoalChipStyle(): React.CSSProperties {
  return {
    minHeight: 30,
    borderRadius: 4,
    border: `1px solid ${nx.navTileActiveBorder}`,
    background: nx.navTileActiveBg,
    color: nx.text,
    fontSize: 11,
    fontWeight: 800,
    padding: "0 10px",
    cursor: "pointer",
  };
}

function templateButtonStyle(): React.CSSProperties {
  return {
    minHeight: 30,
    borderRadius: 4,
    border: `1px solid ${nx.border}`,
    background: nx.bgPanelSoft,
    color: nx.muted,
    fontSize: 11,
    fontWeight: 800,
    padding: "0 10px",
    cursor: "pointer",
  };
}

function situationTextareaStyle(): React.CSSProperties {
  return {
    minHeight: 220,
    resize: "vertical",
    borderRadius: 6,
    border: `1px solid ${nx.border}`,
    background: nx.bgControl,
    color: nx.text,
    padding: 12,
    fontSize: 13,
    lineHeight: 1.5,
    outline: "none",
  };
}

function domainCardStyle(selected: boolean): React.CSSProperties {
  return {
    minHeight: 104,
    borderRadius: 6,
    border: `1px solid ${selected ? nx.navTileActiveBorder : nx.border}`,
    background: selected ? nx.navTileActiveBg : nx.bgPanelSoft,
    boxShadow: selected ? nx.navTileActiveShadow : "none",
    color: nx.text,
    cursor: "pointer",
    padding: 12,
    textAlign: "left",
    display: "grid",
    alignContent: "start",
    gap: 7,
  };
}

function hubEmptyStateStyle(): React.CSSProperties {
  return {
    borderRadius: 6,
    border: `1px solid ${nx.borderSoft}`,
    background: nx.bgPanelSoft,
    padding: 12,
    display: "grid",
    gap: 4,
  };
}

function workspaceHubRowStyle(active: boolean): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 12,
    alignItems: "center",
    borderRadius: 6,
    border: `1px solid ${active ? nx.navTileActiveBorder : nx.border}`,
    background: active ? nx.navTileActiveBg : nx.bgPanelSoft,
    padding: 10,
  };
}

function hubActionButtonStyle(disabled = false): React.CSSProperties {
  return {
    minHeight: 30,
    borderRadius: 4,
    border: `1px solid ${nx.border}`,
    background: nx.bgControl,
    color: disabled ? nx.lowMuted : nx.muted,
    fontSize: 11,
    fontWeight: 800,
    padding: "0 9px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.52 : 1,
  };
}

function modalInputStyle(): React.CSSProperties {
  return {
    height: 36,
    borderRadius: 4,
    border: `1px solid ${nx.border}`,
    background: nx.bgControl,
    color: nx.text,
    padding: "0 10px",
    fontSize: 13,
    outline: "none",
  };
}

function modalButtonStyle(primary: boolean): React.CSSProperties {
  return {
    minHeight: 34,
    borderRadius: 4,
    border: `1px solid ${primary ? nx.navTileActiveBorder : nx.border}`,
    background: primary ? nx.navTileActiveBg : nx.bgPanelSoft,
    color: primary ? nx.text : nx.muted,
    fontSize: 12,
    fontWeight: 800,
    padding: "0 12px",
    cursor: "pointer",
  };
}
