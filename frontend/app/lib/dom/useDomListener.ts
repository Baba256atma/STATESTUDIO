"use client";

import { useEffect, useLayoutEffect, type DependencyList, type RefObject } from "react";

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
    const meta: DomListenerMeta = { component, eventType: "resize" };
    const onResize = () => onWidthChange(window.innerWidth);
    onWidthChange(window.innerWidth);
    return bindWindowListener("resize", onResize, { passive: true }, meta);
  }, [component, onWidthChange, ...deps]);
}
