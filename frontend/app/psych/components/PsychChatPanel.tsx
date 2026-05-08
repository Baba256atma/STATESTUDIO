"use client";

import React, { useEffect, useRef, useState } from "react";
import { revealEgoFaceDebug } from "../engine/useEmotionStore";
import { disableInnerDialogue, enableInnerDialogue, isInnerDialogueEnabled, type InnerDialogueTone } from "../engine/innerDialogueEngine";
import type { Speaker } from "../engine/elementVoiceRouter";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  text: string;
  source?: Speaker;
  tone?: InnerDialogueTone | "inner" | "mystery" | "element";
};

type PsychChatPanelProps = {
  mobile?: boolean;
  drawerRatio?: number;
  setDrawerRatio?: (n: number) => void;
  onClose?: () => void;
  onSendMessage?: (text: string) => string | void | Promise<string | void>;
  onUserActivity?: () => void;
  assistantMessage?: { id: number; text: string; role?: "assistant" | "system"; source?: Speaker; tone?: InnerDialogueTone | "inner" | "mystery" | "element" } | null;
};

export default function PsychChatPanel({ mobile = false, drawerRatio, setDrawerRatio, onClose, onSendMessage, onUserActivity, assistantMessage }: PsychChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [innerDialogueEnabled, setInnerDialogueEnabled] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);
  const lastAssistantMessageId = useRef<number | null>(null);
  const chipActions = [
    { label: "Calm me", text: "I feel calm and steady" },
    { label: "Explain Fire", text: "Explain Fire" },
    { label: "Go deeper", text: "Go deeper into what I am feeling" },
    { label: "Reset focus", text: "I want to reset focus and feel grounded" },
    { label: "Reveal Ego Face", text: "__NX_REVEAL_EGO_FACE__" },
  ];

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!assistantMessage || lastAssistantMessageId.current === assistantMessage.id) return;
    lastAssistantMessageId.current = assistantMessage.id;
    const delay = assistantMessage.role === "system" ? 520 : 0;
    const timeout = window.setTimeout(() => {
      setMessages((m) => [...m, {
        role: assistantMessage.role ?? "assistant",
        text: assistantMessage.text,
        source: assistantMessage.source,
        tone: assistantMessage.tone,
      }]);
    }, delay);
    return () => window.clearTimeout(timeout);
  }, [assistantMessage]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setInnerDialogueEnabled(isInnerDialogueEnabled()), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const sendText = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;
    onUserActivity?.();
    if (text === "__NX_REVEAL_EGO_FACE__") {
      revealEgoFaceDebug(8000);
      setMessages((m) => [...m, { role: "assistant", text: "The Ego face is revealed for a moment." }]);
      if (process.env.NODE_ENV !== "production") {
        console.log("[Sycho][B12.6.5][FaceRevealDebug]");
        console.log("[Sycho][B12.6.10-FIX][FaceForcedVisible]");
      }
      return;
    }
    setMessages((m) => [...m, { role: "user", text }]);

    const response = onSendMessage?.(text);
    if (!onSendMessage) {
      setMessages((m) => [...m, { role: "assistant", text: `Echo: ${text}` }]);
      return;
    }

    Promise.resolve(response)
      .then((resolved) => {
        if (typeof resolved === "string" && resolved.trim()) {
          setMessages((m) => [...m, { role: "assistant", text: resolved.trim() }]);
        }
      })
      .catch(() => {
        setMessages((m) => [...m, { role: "assistant", text: "I can still feel the local field shifting." }]);
      });
  };

  const toggleInnerDialogue = () => {
    const next = !innerDialogueEnabled;
    if (next) enableInnerDialogue();
    else disableInnerDialogue();
    setInnerDialogueEnabled(next);
    onUserActivity?.();
  };

  const send = () => {
    sendText(input);
    setInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        color: "#e6eef8",
        background: "linear-gradient(160deg, rgba(2, 6, 23, 0.84), rgba(6, 18, 37, 0.72) 46%, rgba(8, 34, 52, 0.58))",
        border: "1px solid rgba(125, 211, 252, 0.11)",
        boxShadow: "inset 1px 0 0 rgba(250, 204, 21, 0.04), 0 24px 70px rgba(0,0,0,0.28)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div style={{ padding: "12px 12px 10px", borderBottom: "1px solid rgba(125, 211, 252, 0.09)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#eaf6ff" }}>Self Mirror</div>
            <div style={{ marginTop: 2, fontSize: 11, color: "rgba(186, 230, 253, 0.58)" }}>quiet guide</div>
          </div>
          <div>
            {mobile ? <button onClick={onClose} style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#cbd5e1", padding: "5px 8px" }}>Close</button> : null}
            <button
              type="button"
              onClick={toggleInnerDialogue}
              style={{
                marginLeft: mobile ? 6 : 0,
                background: innerDialogueEnabled ? "rgba(250,204,21,0.1)" : "rgba(255,255,255,0.035)",
                border: "1px solid rgba(250,204,21,0.12)",
                borderRadius: 8,
                color: innerDialogueEnabled ? "#f8ecd0" : "#94a3b8",
                padding: "5px 8px",
                fontSize: 11,
              }}
            >
              Inner Voice {innerDialogueEnabled ? "On" : "Off"}
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {chipActions.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => sendText(chip.text)}
              style={{
                border: "1px solid rgba(125, 211, 252, 0.14)",
                borderRadius: 999,
                background: "rgba(8, 47, 73, 0.34)",
                color: "rgba(224, 242, 254, 0.86)",
                cursor: "pointer",
                fontSize: 11,
                padding: "5px 8px",
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={listRef} style={{ flex: 1, overflow: "auto", padding: 12 }}>
        {messages.length === 0 ? <div style={{ color: "rgba(148, 163, 184, 0.78)", fontSize: 13 }}>Say something and watch the field answer.</div> : null}
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          const isEgoVoice = m.source === "ego";
          const isInnerVoice = (m.role === "system" && !isEgoVoice) || isEgoVoice;
          const isOracle = m.source === "oracle";
          const isWhisper = m.source === "whisper" || isOracle;
          const isElementVoice = m.tone === "element" && !!m.source && !isEgoVoice && !isWhisper;
          const elementLabel = isElementVoice ? `${m.source}: ` : "";
          return (
            <div
              key={i}
              style={{
                width: "fit-content",
                maxWidth: "88%",
                marginBottom: 9,
                marginLeft: isUser ? "auto" : 0,
                padding: isInnerVoice || isWhisper ? "7px 10px" : "8px 10px",
                border: isUser ? "1px solid rgba(125, 211, 252, 0.13)" : isElementVoice ? "1px solid rgba(125, 211, 252, 0.16)" : isOracle ? "1px solid rgba(253, 230, 138, 0.2)" : isWhisper ? "1px solid rgba(196, 181, 253, 0.13)" : isEgoVoice ? "1px solid rgba(148, 163, 184, 0.12)" : isInnerVoice ? "1px solid rgba(250, 204, 21, 0.08)" : "1px solid rgba(250, 204, 21, 0.13)",
                background: isUser ? "rgba(14, 116, 144, 0.18)" : isElementVoice ? "linear-gradient(135deg, rgba(14, 165, 233, 0.07), rgba(250, 204, 21, 0.055))" : isOracle ? "linear-gradient(135deg, rgba(250, 204, 21, 0.11), rgba(124, 58, 237, 0.12), rgba(14, 165, 233, 0.05))" : isWhisper ? "linear-gradient(135deg, rgba(250, 204, 21, 0.07), rgba(124, 58, 237, 0.075), rgba(14, 165, 233, 0.045))" : isEgoVoice ? "linear-gradient(135deg, rgba(148, 163, 184, 0.08), rgba(14, 165, 233, 0.04))" : isInnerVoice ? "linear-gradient(135deg, rgba(250, 204, 21, 0.055), rgba(14, 165, 233, 0.045))" : "linear-gradient(135deg, rgba(250, 204, 21, 0.09), rgba(14, 165, 233, 0.08))",
                color: isUser ? "#dff7ff" : isElementVoice ? "rgba(224, 242, 254, 0.88)" : isOracle ? "rgba(254, 243, 199, 0.92)" : isWhisper ? "rgba(253, 230, 138, 0.84)" : isEgoVoice ? "rgba(203, 213, 225, 0.82)" : isInnerVoice ? "rgba(248, 236, 208, 0.76)" : "#f8ecd0",
                borderRadius: 10,
                fontSize: isInnerVoice || isWhisper ? 12 : 13,
                lineHeight: 1.38,
                fontStyle: isInnerVoice || isWhisper ? "italic" : "normal",
                boxShadow: isUser || isInnerVoice || isWhisper ? "none" : "0 8px 28px rgba(0,0,0,0.12)",
                opacity: isOracle ? 0.92 : isWhisper ? 0.82 : isEgoVoice ? 0.84 : isInnerVoice ? (m.tone === "whisper" ? 0.76 : 0.86) : 1,
              }}
            >
              {isOracle ? "oracle: " : isWhisper ? "whisper: " : isEgoVoice ? "ego: " : elementLabel || (isInnerVoice ? "(inner voice) " : "")}{m.text}
            </div>
          );
        })}
      </div>
      <div style={{ padding: 10, borderTop: "1px solid rgba(125, 211, 252, 0.09)", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            onUserActivity?.();
          }}
          onFocus={onUserActivity}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder="Name what is moving..."
          style={{
            flex: 1,
            minWidth: 0,
            padding: "8px 10px",
            borderRadius: 9,
            border: "1px solid rgba(125, 211, 252, 0.12)",
            background: "rgba(2, 6, 23, 0.46)",
            color: "#fff",
            outline: "none",
          }}
        />
        <button onClick={send} style={{ padding: "8px 12px", borderRadius: 9, background: "linear-gradient(135deg, #0e7490, #2563eb)", color: "white", border: "1px solid rgba(255,255,255,0.08)" }}>Send</button>
      </div>
    </div>
  );
}
