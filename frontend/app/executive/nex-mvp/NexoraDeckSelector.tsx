"use client";

import { useId, useState, useSyncExternalStore } from "react";

import {
  archiveManagerDeck,
  createManagerDeck,
  ensureManagerExecutiveDeck,
  listManagerDecks,
  managerDeckWorkspaceEligible,
  renameManagerDeck,
  restoreManagerDeck,
  selectManagerDeck,
} from "@/app/lib/deck/nexoraDeckRegistryAuthority";
import {
  getDeckRegistrySnapshot,
  NEXORA_EXECUTIVE_DECK_NAME,
  subscribeDeckRegistry,
} from "@/app/lib/deck/nexoraDeckRegistry";
import { NEXORA_EXECUTIVE_DECK_ID } from "@/app/lib/deck/nexoraDeckIdentityContract";
import { cockpit } from "../exs1/shell/executiveCockpitTheme";
import { coordinateWorkspaceMutation } from "@/app/lib/workspace/workspaceAuthorityFence";

export function NexoraDeckSelector({ workspaceId }: { readonly workspaceId: string }) {
  const registry = useSyncExternalStore(subscribeDeckRegistry, getDeckRegistrySnapshot, getDeckRegistrySnapshot);
  const eligible = managerDeckWorkspaceEligible(workspaceId);
  const [open, setOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [failure, setFailure] = useState<string | null>(null);
  const menuId = useId();
  const nameId = useId();
  if (!eligible) return null;
  const decks = listManagerDecks(workspaceId);
  const active = decks.find((deck) => deck.deckId === registry.workspaces[workspaceId]?.activeDeckId) ?? decks.find((deck) => deck.deckId === NEXORA_EXECUTIVE_DECK_ID) ?? null;
  const archived = decks.filter((deck) => deck.status === "ARCHIVED");
  const activeDecks = decks.filter((deck) => deck.status === "ACTIVE");

  const run = (action: () => { ok: boolean }) => {
    void coordinateWorkspaceMutation({ workspaceId }, () => {
      const result = action();
      setFailure(result.ok ? null : "Deck change was not saved on this device.");
      if (result.ok) setDraftName("");
    }).catch(() => setFailure("Deck change was not saved on this device."));
  };

  return (
    <div style={{ position: "relative", flexShrink: 0, minWidth: 0 }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        data-testid="nexora-deck-selector"
        data-active-deck-id={active?.deckId ?? ""}
        data-active-deck-name={active?.name ?? ""}
        onClick={() => {
          if (!open) run(() => ensureManagerExecutiveDeck(workspaceId));
          setOpen((current) => !current);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "0.4rem",
          maxWidth: "14rem",
          border: `1px solid ${cockpit.border}`,
          background: "transparent",
          color: cockpit.text,
          font: "inherit",
          fontSize: "0.78rem",
          padding: "0.28rem 0.55rem",
          borderRadius: "0.35rem",
          cursor: "pointer",
        }}
      >
        <span style={{ color: cockpit.lowMuted, fontSize: "0.62rem", letterSpacing: "0.06em" }}>DECK</span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{active?.name ?? NEXORA_EXECUTIVE_DECK_NAME}</span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="listbox"
          aria-label="Decks"
          data-testid="nexora-deck-menu"
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              setOpen(false);
            }
          }}
          style={{
            position: "absolute",
            top: "calc(100% + 0.35rem)",
            left: 0,
            zIndex: 40,
            width: "16rem",
            background: cockpit.charcoal,
            border: `1px solid ${cockpit.border}`,
            borderRadius: "0.4rem",
            padding: "0.4rem",
          }}
        >
          {activeDecks.map((deck) => (
            <button
              key={deck.deckId}
              type="button"
              role="option"
              aria-selected={deck.deckId === active?.deckId}
              data-testid={`nexora-deck-option-${deck.deckId}`}
              onClick={() => run(() => selectManagerDeck(workspaceId, deck.deckId))}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                border: 0,
                background: deck.deckId === active?.deckId ? cockpit.accentSoft : "transparent",
                color: cockpit.text,
                font: "inherit",
                fontSize: "0.75rem",
                padding: "0.35rem 0.45rem",
                cursor: "pointer",
              }}
            >
              {deck.name}
            </button>
          ))}
          {active && active.deckId !== NEXORA_EXECUTIVE_DECK_ID ? (
            <div style={{ display: "flex", gap: "0.35rem", padding: "0.35rem 0.45rem" }}>
              <button type="button" data-testid="nexora-deck-rename" onClick={() => run(() => renameManagerDeck({ workspaceId, deckId: active.deckId, name: draftName }))} style={{ font: "inherit", fontSize: "0.68rem" }}>
                Rename
              </button>
              <button type="button" data-testid="nexora-deck-archive" onClick={() => run(() => archiveManagerDeck(workspaceId, active.deckId))} style={{ font: "inherit", fontSize: "0.68rem" }}>
                Archive
              </button>
            </div>
          ) : null}
          {archived.map((deck) => (
            <button
              key={deck.deckId}
              type="button"
              data-testid={`nexora-deck-restore-${deck.deckId}`}
              onClick={() => run(() => restoreManagerDeck(workspaceId, deck.deckId))}
              style={{ display: "block", width: "100%", textAlign: "left", border: 0, background: "transparent", color: cockpit.muted, font: "inherit", fontSize: "0.68rem", padding: "0.3rem 0.45rem", cursor: "pointer" }}
            >
              Restore {deck.name}
            </button>
          ))}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              run(() => createManagerDeck({ workspaceId, name: draftName, kind: "DEPARTMENT" }));
            }}
            style={{ display: "flex", gap: "0.35rem", padding: "0.4rem 0.15rem 0.15rem" }}
          >
            <label htmlFor={nameId} style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>Deck name</label>
            <input id={nameId} data-testid="nexora-deck-name" value={draftName} onChange={(event) => setDraftName(event.target.value)} placeholder="New deck" style={{ flex: 1, font: "inherit", fontSize: "0.72rem" }} />
            <button type="submit" data-testid="nexora-deck-create" style={{ font: "inherit", fontSize: "0.68rem" }}>Create</button>
          </form>
          {failure ? <p role="alert" data-testid="nexora-deck-save-failure" style={{ color: cockpit.warning, fontSize: "0.66rem", margin: "0.35rem 0.15rem" }}>{failure}</p> : null}
          {active?.deckId !== NEXORA_EXECUTIVE_DECK_ID ? (
            <p style={{ color: cockpit.muted, fontSize: "0.66rem", margin: "0.4rem 0.15rem 0.15rem" }}>Deck Stage — No objects assigned</p>
          ) : (
            <p data-testid="executive-deck-workspace-view" style={{ color: cockpit.lowMuted, fontSize: "0.66rem", margin: "0.4rem 0.15rem 0.15rem" }}>Workspace view. Cross-deck references are not assigned.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
