"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";

import {
  buildViewportResizeSignature,
  scheduleViewportResizeCommit,
} from "../layout/viewportResizeRuntime";
import {
  bindDocumentListener,
  bindWindowListener,
  attachDomListener,
  detachDomListener,
  type DomListenerMeta,
} from "./domListenerLifecycle";

export function useWindowListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
  meta: DomListenerMeta,
  options?: boolean | AddEventListenerOptions
): void {
  const { component, elementId = null, eventType } = meta;
  useEffect(() => {
    return bindWindowListener(
      type,
      listener,
      options,
      { component, elementId, eventType }
    );
  }, [type, listener, options, component, elementId, eventType]);
}

export function useDocumentListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
  meta: DomListenerMeta,
  options?: boolean | AddEventListenerOptions
): void {
  const { component, elementId = null, eventType } = meta;
  useEffect(() => {
    return bindDocumentListener(
      type,
      listener,
      options,
      { component, elementId, eventType }
    );
  }, [type, listener, options, component, elementId, eventType]);
}

export function useRefDomListener<T extends HTMLElement>(
  ref: RefObject<T | null>,
  type: string,
  listener: EventListenerOrEventListenerObject,
  meta: DomListenerMeta,
  options?: boolean | AddEventListenerOptions,
  remountKey?: unknown
): void {
  const { component, elementId = null, eventType } = meta;
  useLayoutEffect(() => {
    const ownedMeta: DomListenerMeta = { component, elementId, eventType };
    const node = ref.current;
    if (!node) {
      attachDomListener(null, type, listener, options, ownedMeta);
      return undefined;
    }
    attachDomListener(node, type, listener, options, ownedMeta);
    return () => detachDomListener(node, type, listener, options, ownedMeta);
  }, [ref, type, listener, options, component, elementId, eventType, remountKey]);
}

export function useViewportWidthListener(
  onWidthChange: (width: number) => void,
  component: string
): void {
  useEffect(() => {
    if (typeof window === "undefined" || window == null) return undefined;
    let lastSignature = buildViewportResizeSignature(window.innerWidth);

    const commitWidth = (width: number) => {
      const signature = buildViewportResizeSignature(width);
      if (signature === lastSignature) return;
      lastSignature = signature;
      onWidthChange(width);
    };

    commitWidth(window.innerWidth);

    return scheduleViewportResizeCommit(() => {
      commitWidth(window.innerWidth);
    });
  }, [component, onWidthChange]);
}
