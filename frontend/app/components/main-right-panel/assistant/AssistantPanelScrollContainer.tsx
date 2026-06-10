"use client";

import React, { useEffect, useRef } from "react";

import type { AssistantPanelDockId } from "../../../lib/assistant/assistantPanelDockContract";
import { observeAssistantPanelOverflow } from "../../../lib/assistant/assistantPanelOverflowRuntime";
import {
  ASSISTANT_PANEL_SCROLL_CONTAINER_CLASS,
  resolveAssistantPanelScrollContainerStyle,
} from "../../../lib/assistant/assistantPanelOverflowTokens";
export type AssistantPanelScrollContainerProps = Readonly<{
  panelId: AssistantPanelDockId;
  visible: boolean;
  children: React.ReactNode;
}>;

export function AssistantPanelScrollContainer(
  props: AssistantPanelScrollContainerProps
): React.ReactElement {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return observeAssistantPanelOverflow({
      panelId: props.panelId,
      element: scrollRef.current,
      visible: props.visible,
    });
  }, [props.panelId, props.visible]);

  return (
    <div
      ref={scrollRef}
      className={ASSISTANT_PANEL_SCROLL_CONTAINER_CLASS}
      data-nx="assistant-panel-scroll-container"
      data-nx-panel={props.panelId}
      data-nx-expanded={props.visible ? "true" : "false"}
      aria-hidden={!props.visible}
      style={resolveAssistantPanelScrollContainerStyle({
        panelId: props.panelId,
        visible: props.visible,
      })}
    >
      {props.children}
    </div>
  );
}

export default AssistantPanelScrollContainer;
