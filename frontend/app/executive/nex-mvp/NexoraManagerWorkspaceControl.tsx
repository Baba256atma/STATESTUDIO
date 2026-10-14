"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { cockpit } from "../exs1/shell/executiveCockpitTheme";
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
      role="option"
      aria-selected={selected}
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
        borderTop: entry.role === "demo" ? `1px solid ${cockpit.border}` : "none",
        background: selected ? cockpit.accentSoft : "transparent",
        color: entry.role === "demo" ? cockpit.muted : cockpit.text,
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
        {entry.typeLabel}
      </span>
    </button>
  );
}

export function NexoraManagerWorkspaceControl() {
  const snapshot = useSyncExternalStore(
    subscribeWorkspaceRegistry,
    getWorkspaceRegistrySnapshot,
    getWorkspaceRegistrySnapshot,
  );
  const view: ManagerWorkspaceEntryProjection = projectManagerWorkspaceEntries(snapshot);
  const [open, setOpen] = useState(false);
  const [draftKind, setDraftKind] = useState<ManagerWorkspaceKind | null>(null);
  const [draftName, setDraftName] = useState("");
  const [failure, setFailure] = useState<string | null>(null);
  const [menuBox, setMenuBox] = useState<{ top: number; left: number } | null>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const nameId = useId();

  useEffect(() => {
    recoverWorkspaceRegistryFromStorage();
  }, []);

  useEffect(() => {
    if (!open || !anchorRef.current) {
      setMenuBox(null);
      return;
    }
    const place = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuBox({ top: rect.bottom + 6, left: rect.left });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open, draftKind]);

  const close = () => {
    setOpen(false);
    setDraftKind(null);
    setDraftName("");
    setFailure(null);
  };

  const beginCreate = (kind: ManagerWorkspaceKind) => {
    setDraftKind(kind);
    setDraftName("");
    setFailure(null);
  };

  const selectEntry = (workspaceId: string) => {
    const accepted = selectManagerWorkspaceEntry(workspaceId);
    if (!accepted) {
      setFailure("That workspace could not be opened.");
      return;
    }
    close();
  };

  const submitCreate = () => {
    if (!draftKind) return;
    const created = createManagerWorkspaceFromEntry({ name: draftName, kind: draftKind });
    if (!created) {
      setFailure("Enter a name to create this workspace.");
      return;
    }
    close();
  };

  const nameReady = draftName.trim().length > 0;

  return (
    <div style={{ position: "relative", flexShrink: 0, minWidth: 0 }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        ref={anchorRef}
        data-testid="manager-workspace-identity"
        data-manager-workspace-id={view.active.workspaceId}
        data-manager-workspace-role={view.active.role}
        onClick={() => (open ? close() : setOpen(true))}
        onKeyDown={(event) => {
          if (event.key === "Escape") close();
        }}
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "0.45rem",
          maxWidth: "16rem",
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
          {view.hasRealWorkspace || view.active.role !== "demo"
            ? view.active.identityLabel
            : "Create a Company or Project"}
        </span>
        <span aria-hidden style={{ color: cockpit.lowMuted, fontSize: "0.62rem" }}>
          ▾
        </span>
      </button>
      {open && menuBox && typeof document !== "undefined"
        ? createPortal(
        <div
          id={menuId}
          role="listbox"
          aria-label="Manager workspaces"
          data-testid="manager-workspace-menu"
          style={{
            position: "fixed",
            top: menuBox.top,
            left: menuBox.left,
            zIndex: 80,
            minWidth: "16.5rem",
            background: cockpit.charcoal,
            border: `1px solid ${cockpit.border}`,
            borderRadius: "0.4rem",
            boxShadow: `0 12px 32px ${cockpit.accentGlow}`,
            padding: "0.35rem 0",
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
                    font: "inherit",
                    fontSize: "0.72rem",
                    color: nameReady ? cockpit.text : cockpit.lowMuted,
                    background: nameReady ? cockpit.accentSoft : "transparent",
                    border: `1px solid ${cockpit.border}`,
                    borderRadius: "0.3rem",
                    padding: "0.3rem 0.55rem",
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
                  style={{
                    font: "inherit",
                    fontSize: "0.72rem",
                    color: cockpit.muted,
                    background: "transparent",
                    border: `1px solid ${cockpit.border}`,
                    borderRadius: "0.3rem",
                    padding: "0.3rem 0.55rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {view.real.length === 0 ? (
                <div style={{ padding: "0.35rem 0.7rem 0.5rem", color: cockpit.muted, fontSize: "0.72rem" }}>
                  No Company or Project yet
                </div>
              ) : (
                view.real.map((entry) => (
                  <MenuRow
                    key={entry.workspaceId}
                    entry={entry}
                    selected={entry.workspaceId === view.active.workspaceId}
                    onSelect={selectEntry}
                  />
                ))
              )}
              {view.demo ? (
                <MenuRow
                  entry={view.demo}
                  selected={view.demo.workspaceId === view.active.workspaceId}
                  onSelect={selectEntry}
                />
              ) : null}
              {failure ? (
                <div role="alert" style={{ padding: "0.35rem 0.7rem", fontSize: "0.68rem", color: cockpit.warning }}>
                  {failure}
                </div>
              ) : null}
              <div style={{ display: "flex", gap: "0.35rem", padding: "0.45rem 0.7rem 0.25rem" }}>
                <button
                  type="button"
                  data-testid="manager-workspace-new-company"
                  onClick={() => beginCreate("BUSINESS")}
                  style={{
                    font: "inherit",
                    fontSize: "0.68rem",
                    color: cockpit.text,
                    background: "transparent",
                    border: `1px solid ${cockpit.border}`,
                    borderRadius: "0.3rem",
                    padding: "0.28rem 0.45rem",
                    cursor: "pointer",
                  }}
                >
                  + Company
                </button>
                <button
                  type="button"
                  data-testid="manager-workspace-new-project"
                  onClick={() => beginCreate("PROJECT")}
                  style={{
                    font: "inherit",
                    fontSize: "0.68rem",
                    color: cockpit.text,
                    background: "transparent",
                    border: `1px solid ${cockpit.border}`,
                    borderRadius: "0.3rem",
                    padding: "0.28rem 0.45rem",
                    cursor: "pointer",
                  }}
                >
                  + Project
                </button>
              </div>
            </>
          )}
        </div>,
        document.body,
      )
        : null}
    </div>
  );
}
