"use client";

import React, { useEffect } from "react";

import { logExecutiveAssistantSuggestionSelected } from "../../../lib/ui/executiveAssistantInstrumentation";
import { resolveAssistantSupportContentStyle } from "../../../lib/assistant/assistantReadingComfortTokens";
import { traceMrp128QuestionInjected, traceMrp128QuestionsPanelMounted } from "../../../lib/assistant/mrp128RuntimeDiagnostics";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";

export type AssistantExecutiveQuestionsPanelProps = Readonly<{
  questions: readonly string[];
  loading?: boolean;
  themeMode?: NexoraHudThemeMode;
  onQuestionSelect?: (question: string) => void;
}>;

/** MRP:12:8 — Executive Questions list inside the support dock Questions panel. */
export function AssistantExecutiveQuestionsPanel(
  props: AssistantExecutiveQuestionsPanelProps
): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);
  const questions = props.questions.slice(0, 5);

  useEffect(() => {
    traceMrp128QuestionsPanelMounted();
  }, []);

  const handleQuestionSelect = (question: string) => {
    logExecutiveAssistantSuggestionSelected({
      kind: "question",
      id: question,
      label: question,
    });
    traceMrp128QuestionInjected(question);
    props.onQuestionSelect?.(question);
  };

  return (
    <div
      data-nx="assistant-executive-questions-panel"
      style={{
        ...resolveAssistantSupportContentStyle(theme),
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {questions.length ? (
        questions.map((question) => (
          <button
            key={question}
            type="button"
            disabled={props.loading}
            title={question}
            onClick={() => handleQuestionSelect(question)}
            style={{
              textAlign: "left",
              padding: "8px 10px",
              borderRadius: 10,
              border: `1px solid ${theme.controlBorder}`,
              background: theme.controlBackground,
              color: theme.text,
              cursor: props.loading ? "not-allowed" : "pointer",
              opacity: props.loading ? 0.65 : 1,
              fontSize: 12,
              lineHeight: 1.35,
            }}
          >
            {question}
          </button>
        ))
      ) : (
        <div style={{ color: theme.textMuted, fontSize: 12 }}>
          Executive questions will appear here when available.
        </div>
      )}
    </div>
  );
}

export default AssistantExecutiveQuestionsPanel;
