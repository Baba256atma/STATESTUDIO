"use client";

import { useLayoutEffect, useState } from "react";
import type { ResolvedUiTheme } from "./nexoraUiTheme";

/**
 * THEME-WIRING:1 — Three.js / WebGL cannot consume CSS variables.
 * Reads the live html[data-theme] token surface. Not a second palette.
 */
export function readExecutiveThemeCssColor(
  token: string,
  fallback: string,
): string {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  return raw.length > 0 ? raw : fallback;
}

export function readResolvedDocumentUiTheme(): ResolvedUiTheme {
  if (typeof document === "undefined") return "night";
  return document.documentElement.getAttribute("data-theme") === "day"
    ? "day"
    : "night";
}

export function useResolvedDocumentUiTheme(): ResolvedUiTheme {
  const [theme, setTheme] = useState<ResolvedUiTheme>(
    readResolvedDocumentUiTheme,
  );
  useLayoutEffect(() => {
    const read = () => setTheme(readResolvedDocumentUiTheme());
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  return theme;
}

export function useExecutiveThemeCssColor(
  token: string,
  fallback: string,
): string {
  const [color, setColor] = useState(fallback);
  useLayoutEffect(() => {
    const read = () => setColor(readExecutiveThemeCssColor(token, fallback));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, [token, fallback]);
  return color;
}
