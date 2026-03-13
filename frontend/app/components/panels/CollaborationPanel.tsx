"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cardStyle, inputStyle, nx, primaryButtonStyle, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard, ErrorStateCard, LoadingStateCard } from "../ui/panelStates";

type Props = {
  backendBase: string;
  episodeId: string | null;
};

export default function CollaborationPanel({ backendBase, episodeId }: Props) {
  // MVP-FROZEN: advanced real-time collaboration workflows are intentionally out of MVP scope.
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  const [noteAuthor, setNoteAuthor] = useState("");
  const [noteText, setNoteText] = useState("");
  const [viewAuthor, setViewAuthor] = useState("");
  const [viewLabel, setViewLabel] = useState("");
  const [viewSummary, setViewSummary] = useState("");

  const canUseEpisode = typeof episodeId === "string" && episodeId.trim().length > 0;

  const loadCollaboration = useCallback(async () => {
    if (!canUseEpisode || !episodeId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendBase}/collaboration/${encodeURIComponent(episodeId)}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (json as any)?.detail?.error?.message ?? (json as any)?.detail ?? "Failed to load collaboration.";
        throw new Error(String(msg));
      }
      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load collaboration.");
    } finally {
      setLoading(false);
    }
  }, [backendBase, canUseEpisode, episodeId]);

  useEffect(() => {
    setData(null);
    setError(null);
  }, [episodeId]);

  const notes = useMemo(() => (Array.isArray(data?.notes) ? data.notes : []), [data]);
  const viewpoints = useMemo(() => (Array.isArray(data?.viewpoints) ? data.viewpoints : []), [data]);

  const addNote = useCallback(async () => {
    if (!canUseEpisode || !episodeId) return;
    if (!noteAuthor.trim() || !noteText.trim()) {
      setError("Author and note text are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${backendBase}/collaboration/${encodeURIComponent(episodeId)}/note`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ author: noteAuthor.trim(), text: noteText.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (json as any)?.detail?.error?.message ?? (json as any)?.detail ?? "Failed to add note.";
        throw new Error(String(msg));
      }
      setNoteText("");
      await loadCollaboration();
    } catch (e: any) {
      setError(e?.message ?? "Failed to add note.");
    } finally {
      setSaving(false);
    }
  }, [backendBase, canUseEpisode, episodeId, noteAuthor, noteText, loadCollaboration]);

  const addViewpoint = useCallback(async () => {
    if (!canUseEpisode || !episodeId) return;
    if (!viewAuthor.trim() || !viewLabel.trim() || !viewSummary.trim()) {
      setError("Author, label, and summary are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${backendBase}/collaboration/${encodeURIComponent(episodeId)}/viewpoint`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          author: viewAuthor.trim(),
          label: viewLabel.trim(),
          summary: viewSummary.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (json as any)?.detail?.error?.message ?? (json as any)?.detail ?? "Failed to add viewpoint.";
        throw new Error(String(msg));
      }
      setViewLabel("");
      setViewSummary("");
      await loadCollaboration();
    } catch (e: any) {
      setError(e?.message ?? "Failed to add viewpoint.");
    } finally {
      setSaving(false);
    }
  }, [backendBase, canUseEpisode, episodeId, viewAuthor, viewLabel, viewSummary, loadCollaboration]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0, overflow: "auto" }}>
      <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>Collaboration</div>

      {!canUseEpisode ? (
        <EmptyStateCard text="Save or load an episode to attach notes and viewpoints." />
      ) : null}

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          type="button"
          onClick={() => void loadCollaboration()}
          disabled={!canUseEpisode || loading}
          style={{
            ...primaryButtonStyle,
            opacity: !canUseEpisode || loading ? 0.7 : 1,
            cursor: !canUseEpisode || loading ? "default" : "pointer",
          }}
        >
          {loading ? "Loading..." : "Load Collaboration"}
        </button>
      </div>

      {loading ? <LoadingStateCard text="Loading collaboration…" /> : null}
      {error ? <ErrorStateCard text={error} /> : null}

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Summary</div>
        <div style={{ color: nx.text, fontSize: 12 }}>{String(data?.summary ?? "0 collaboration items attached.")}</div>
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Notes</div>
        {notes.length ? (
          notes.slice(0, 3).map((n: any) => (
            <div key={String(n?.id ?? Math.random())} style={{ ...softCardStyle, padding: 10 }}>
              <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{String(n?.author ?? "-")}</div>
              <div style={{ color: "#cbd5e1", fontSize: 12 }}>{String(n?.text ?? "")}</div>
              <div style={{ color: nx.lowMuted, fontSize: 11 }}>{String(n?.created_at ?? "")}</div>
            </div>
          ))
        ) : (
          <div style={{ color: nx.lowMuted, fontSize: 11 }}>No notes yet.</div>
        )}
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Add Note</div>
        <input
          style={inputStyle}
          placeholder="Author"
          value={noteAuthor}
          onChange={(e) => setNoteAuthor(e.target.value)}
        />
        <textarea
          style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
          placeholder="Note"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <button
          type="button"
          onClick={() => void addNote()}
          disabled={!canUseEpisode || saving}
          style={{
            ...primaryButtonStyle,
            opacity: !canUseEpisode || saving ? 0.7 : 1,
            cursor: !canUseEpisode || saving ? "default" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Add Note"}
        </button>
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Viewpoints</div>
        {viewpoints.length ? (
          viewpoints.slice(0, 3).map((v: any) => (
            <div key={String(v?.id ?? Math.random())} style={{ ...softCardStyle, padding: 10 }}>
              <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>
                {String(v?.author ?? "-")} · {String(v?.label ?? "-")}
              </div>
              <div style={{ color: nx.text, fontSize: 12 }}>{String(v?.summary ?? "")}</div>
            </div>
          ))
        ) : (
          <div style={{ color: nx.lowMuted, fontSize: 11 }}>No viewpoints yet.</div>
        )}
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Add Viewpoint</div>
        <input
          style={inputStyle}
          placeholder="Author"
          value={viewAuthor}
          onChange={(e) => setViewAuthor(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Label"
          value={viewLabel}
          onChange={(e) => setViewLabel(e.target.value)}
        />
        <textarea
          style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
          placeholder="Summary"
          value={viewSummary}
          onChange={(e) => setViewSummary(e.target.value)}
        />
        <button
          type="button"
          onClick={() => void addViewpoint()}
          disabled={!canUseEpisode || saving}
          style={{
            ...primaryButtonStyle,
            opacity: !canUseEpisode || saving ? 0.7 : 1,
            cursor: !canUseEpisode || saving ? "default" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Add Viewpoint"}
        </button>
      </div>
    </div>
  );
}
