"use client";

import React from "react";

import { logExecutiveAssistantSuggestionSelected } from "../../../lib/ui/executiveAssistantInstrumentation";
import {
  ASSISTANT_READING_COMFORT_TOKENS,
  resolveAssistantQuestionChipRowStyle,
  resolveAssistantQuestionChipStyle,
} from "../../../lib/assistant/assistantReadingComfortTokens";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";

export type AssistantSuggestedQuestionsStripProps = Readonly<{
  questions: readonly string[];
  loading?: boolean;
  themeMode?: NexoraHudThemeMode;
  onQuestionSelect: (question: string) => void;
}>;

export function AssistantSuggestedQuestionsStrip(
  props: AssistantSuggestedQuestionsStripProps
): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);
  const questions = props.questions.slice(0, 5);
  const chipPadding = ASSISTANT_READING_COMFORT_TOKENS.chips;

  if (!questions.length) return <></>;

  return (
    <div
      data-nx="assistant-suggested-questions"
      data-nx-chip-wrap="enabled"
      style={{
        padding: `${chipPadding.rowGap}px ${ASSISTANT_READING_COMFORT_TOKENS.supportContent.paddingX}px 10px`,
      }}
    >
      <div style={resolveAssistantQuestionChipRowStyle()}>
        {questions.map((question) => (
          <button
            key={question}
            type="button"
            disabled={props.loading}
            title={question}
            onClick={() => {
              logExecutiveAssistantSuggestionSelected({
                kind: "question",
                id: question,
                label: question,
              });
              props.onQuestionSelect(question);
            }}
            style={{
              ...resolveAssistantQuestionChipStyle(theme),
              cursor: props.loading ? "not-allowed" : "pointer",
              opacity: props.loading ? 0.65 : 1,
            }}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AssistantSuggestedQuestionsStrip;
