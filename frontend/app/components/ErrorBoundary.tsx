"use client";

import React from "react";
import { getNexoraProductMode } from "../lib/product/nexoraProductMode.ts";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  onBackToLive?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.handleReload = this.handleReload.bind(this);
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Minimal logging for debugging; avoid leaking sensitive data.
    // eslint-disable-next-line no-console
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("ErrorBoundary caught an error", {
      error,
      message,
      stack,
      info,
    });
  }

  handleReload() {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      const pilot = getNexoraProductMode() === "pilot";
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-slate-950 text-white">
          <div className="text-lg font-semibold">{pilot ? "System couldn't complete analysis" : "Something went wrong"}</div>
          <div className="text-sm text-white/70">
            {pilot ? "Please try again, or reload the page." : "Please reload or return to live view."}
          </div>
          <div className="flex gap-2">
            <button
              onClick={this.handleReload}
              className="rounded-md border border-white/10 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
            >
              Reload
            </button>
            {this.props.onBackToLive && (
              <button
                onClick={this.props.onBackToLive}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white hover:bg-white/15"
              >
                Back to Live
              </button>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
