"use client";

import { useState } from "react";

import type { SceneOrgSavedScene } from "@/app/lib/scene-org/sceneOrgWorkspacePlacementContract";
import type { SceneOrgSavedSceneMutationResult } from "@/app/lib/scene-org/sceneOrgSavedSceneCollectionMutation";

type RowMode = "idle" | "actions" | "rename" | "confirm-delete";

type Props = {
  readonly scenes: readonly SceneOrgSavedScene[];
  readonly activeSceneId: string | null;
  readonly onOpenScene: (scene: SceneOrgSavedScene) => void;
  readonly onSaveScene?: (name: string) => void | boolean | Promise<void | boolean>;
  readonly conflictMessage?: string | null;
  readonly onReviewLatestScene?: () => void;
  readonly onMakeDefaultScene?: (sceneId: string) => void;
  readonly onRenameScene: (
    sceneId: string,
    name: string,
  ) => SceneOrgSavedSceneMutationResult | Promise<SceneOrgSavedSceneMutationResult>;
  readonly onDeleteScene: (
    sceneId: string,
  ) => SceneOrgSavedSceneMutationResult | Promise<SceneOrgSavedSceneMutationResult>;
};

/**
 * Compact manager-facing Saved Scene collection. Selection delegates to OPEN_SCENE.
 * Rename/Delete mutate collection metadata through the shell mutation authority.
 */
export function NexoraSavedSceneCollectionAccess({
  scenes,
  activeSceneId,
  onOpenScene,
  onSaveScene,
  conflictMessage = null,
  onReviewLatestScene,
  onMakeDefaultScene,
  onRenameScene,
  onDeleteScene,
}: Props) {
  const [draftName, setDraftName] = useState("");
  const [activeRow, setActiveRow] = useState<{
    sceneId: string;
    mode: RowMode;
    draft: string;
  } | null>(null);

  return (
    <details
      data-testid="nexora-saved-scene-collection"
      data-saved-scene-collection-count={String(scenes.length)}
      style={{
        position: "relative",
        flex: "0 0 auto",
        alignSelf: "center",
        fontSize: 12,
        color: "inherit",
      }}
    >
      <summary
        style={{
          cursor: "pointer",
          listStyle: "none",
          padding: "0.2rem 0.45rem",
          border: "1px solid color-mix(in srgb, currentColor 22%, transparent)",
          borderRadius: 6,
          userSelect: "none",
        }}
      >
        Scenes{scenes.length > 0 ? ` · ${scenes.length}` : ""}
      </summary>
      <div
        role="list"
        style={{
          position: "absolute",
          zIndex: 6,
          top: "calc(100% + 4px)",
          left: 0,
          minWidth: 260,
          padding: "0.35rem",
          borderRadius: 8,
          background: "var(--nx-popover-bg)",
          border: "1px solid color-mix(in srgb, currentColor 22%, transparent)",
        }}
      >
        {onSaveScene ? (
          <form
            data-testid="nexora-saved-scene-save-form"
            onSubmit={(event) => {
              event.preventDefault();
              const name = draftName.trim();
              if (name.length === 0 || !onSaveScene) return;
              void Promise.resolve(onSaveScene(name)).then((accepted) => {
                if (accepted !== false) setDraftName("");
              });
            }}
            style={{ display: "flex", gap: 4, marginBottom: 6 }}
          >
            <input
              aria-label="Scene name"
              data-testid="nexora-saved-scene-name"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                background: "transparent",
                color: "inherit",
                border: "1px solid color-mix(in srgb, currentColor 28%, transparent)",
                borderRadius: 4,
                padding: "0.2rem 0.3rem",
              }}
            />
            <button type="submit" data-testid="nexora-saved-scene-save" style={actionButtonStyle}>
              Save Scene
            </button>
          </form>
        ) : null}
        {conflictMessage ? (
          <div data-testid="saved-scene-conflict" role="alert" style={{ marginBottom: 6 }}>
            <div>{conflictMessage}</div>
            {onReviewLatestScene ? (
              <button type="button" data-testid="saved-scene-review-latest" onClick={onReviewLatestScene} style={actionButtonStyle}>
                Review latest Scene
              </button>
            ) : null}
          </div>
        ) : null}
        {scenes.length === 0 ? (
          <div data-testid="nexora-saved-scene-collection-empty" style={{ opacity: 0.75 }}>
            No saved scenes yet.
          </div>
        ) : (
          scenes.map((scene) => {
            const selected = scene.sceneId === activeSceneId;
            const row = activeRow?.sceneId === scene.sceneId ? activeRow : null;
            return (
              <div
                key={scene.sceneId}
                role="listitem"
                data-testid={`nexora-saved-scene-row-${scene.sceneId}`}
                data-owner-deck-id={scene.ownerDeckId ?? ""}
                style={{ marginBottom: 4 }}
              >
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <button
                    type="button"
                    data-testid={`nexora-saved-scene-${scene.sceneId}`}
                    data-saved-scene-id={scene.sceneId}
                    aria-current={selected ? "true" : undefined}
                    onClick={() => onOpenScene(scene)}
                    style={{
                      flex: 1,
                      textAlign: "left",
                      background: selected
                        ? "color-mix(in srgb, currentColor 16%, transparent)"
                        : "transparent",
                      color: "inherit",
                      border: 0,
                      borderRadius: 4,
                      padding: "0.28rem 0.4rem",
                      cursor: "pointer",
                    }}
                  >
                    {scene.kind === "DEFAULT_MANAGER" ? "★ " : ""}
                    {scene.name}
                  </button>
                  <button
                    type="button"
                    data-testid={`nexora-saved-scene-actions-${scene.sceneId}`}
                    aria-label={`Scene actions for ${scene.name}`}
                    onClick={() =>
                      setActiveRow(
                        row?.mode === "actions"
                          ? null
                          : { sceneId: scene.sceneId, mode: "actions", draft: scene.name },
                      )
                    }
                    style={{
                      background: "transparent",
                      color: "inherit",
                      border: "1px solid color-mix(in srgb, currentColor 22%, transparent)",
                      borderRadius: 4,
                      padding: "0.12rem 0.35rem",
                      cursor: "pointer",
                    }}
                  >
                    …
                  </button>
                </div>
                {row?.mode === "actions" ? (
                  <div style={{ display: "flex", gap: 4, margin: "0.2rem 0 0.15rem 0.4rem" }}>
                    <button
                      type="button"
                      data-testid={`nexora-saved-scene-rename-${scene.sceneId}`}
                      onClick={() =>
                        setActiveRow({
                          sceneId: scene.sceneId,
                          mode: "rename",
                          draft: scene.name,
                        })
                      }
                      style={actionButtonStyle}
                    >
                      Rename Scene
                    </button>
                    {onMakeDefaultScene ? (
                      <button
                        type="button"
                        data-testid={`nexora-saved-scene-default-${scene.sceneId}`}
                        onClick={() => onMakeDefaultScene(scene.sceneId)}
                        style={actionButtonStyle}
                      >
                        Make Default
                      </button>
                    ) : null}
                    <button
                      type="button"
                      data-testid={`nexora-saved-scene-delete-${scene.sceneId}`}
                      onClick={() =>
                        setActiveRow({
                          sceneId: scene.sceneId,
                          mode: "confirm-delete",
                          draft: scene.name,
                        })
                      }
                      style={actionButtonStyle}
                    >
                      Delete Scene
                    </button>
                  </div>
                ) : null}
                {row?.mode === "rename" ? (
                  <form
                    data-testid={`nexora-saved-scene-rename-form-${scene.sceneId}`}
                    onSubmit={(event) => {
                      event.preventDefault();
                      void Promise.resolve(onRenameScene(scene.sceneId, row.draft)).then((result) => {
                        if (
                          result.status === "renamed" ||
                          result.status === "unchanged"
                        ) {
                          setActiveRow(null);
                        }
                      });
                    }}
                    style={{ margin: "0.25rem 0 0.1rem 0.4rem" }}
                  >
                    <label style={{ display: "block", marginBottom: 4 }}>
                      Rename Scene
                      <input
                        aria-label="Rename Scene"
                        data-testid={`nexora-saved-scene-rename-input-${scene.sceneId}`}
                        value={row.draft}
                        onChange={(event) =>
                          setActiveRow({ ...row, draft: event.target.value })
                        }
                        style={{
                          display: "block",
                          width: "100%",
                          marginTop: 2,
                          background: "transparent",
                          color: "inherit",
                          border: "1px solid color-mix(in srgb, currentColor 28%, transparent)",
                          borderRadius: 4,
                          padding: "0.2rem 0.3rem",
                        }}
                      />
                    </label>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button type="submit" style={actionButtonStyle}>
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveRow(null)}
                        style={actionButtonStyle}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : null}
                {row?.mode === "confirm-delete" ? (
                  <div
                    data-testid={`nexora-saved-scene-delete-confirm-${scene.sceneId}`}
                    style={{ margin: "0.25rem 0 0.1rem 0.4rem" }}
                  >
                    <p style={{ margin: "0 0 0.3rem" }}>
                      Remove saved scene “{scene.name}”? Canonical objects are
                      not deleted.
                    </p>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        type="button"
                        data-testid={`nexora-saved-scene-delete-confirm-button-${scene.sceneId}`}
                        onClick={() => {
                          void Promise.resolve(onDeleteScene(scene.sceneId)).then((result) => {
                            if (result.status === "deleted") setActiveRow(null);
                          });
                        }}
                        style={actionButtonStyle}
                      >
                        Delete Scene
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveRow(null)}
                        style={actionButtonStyle}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </details>
  );
}

const actionButtonStyle = {
  background: "transparent",
  color: "inherit",
  border: "1px solid color-mix(in srgb, currentColor 22%, transparent)",
  borderRadius: 4,
  padding: "0.15rem 0.35rem",
  cursor: "pointer",
} as const;
