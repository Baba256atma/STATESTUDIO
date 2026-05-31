"use client";

import { useEffect, useLayoutEffect, type DependencyList, type RefObject } from "react";

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
  deps: DependencyList,
  meta: DomListenerMeta,
  options?: boolean | AddEventListenerOptions
): void {
  useEffect(() => bindWindowListener(type, listener, options, meta), deps);
}

export function useDocumentListener(
  type: string,
  listener: EventListenerOrEventListenerObject,
  deps: DependencyList,
  meta: DomListenerMeta,
  options?: boolean | AddEventListenerOptions
): void {
  useEffect(() => bindDocumentListener(type, listener, options, meta), deps);
}

export function useRefDomListener<T extends HTMLElement>(
  ref: RefObject<T | null>,
  type: string,
  listener: EventListenerOrEventListenerObject,
  deps: DependencyList,
  meta: DomListenerMeta,
  options?: boolean | AddEventListenerOptions
): void {
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      attachDomListener(null, type, listener, options, meta);
      return undefined;
    }
    attachDomListener(node, type, listener, options, meta);
    return () => detachDomListener(node, type, listener, options, meta);
  }, deps);
}

export function useViewportWidthListener(
  onWidthChange: (width: number) => void,
  component: string,
  deps: DependencyList = []
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
  }, [component, onWidthChange, ...deps]);
}
