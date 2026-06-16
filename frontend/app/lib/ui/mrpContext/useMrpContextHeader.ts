"use client";

import { useSyncExternalStore } from "react";

import {
  getMrpContextHeaderView,
  getMrpContextStoreServerSnapshot,
  getMrpContextStoreSnapshot,
  subscribeMrpContextStore,
} from "./mrpContextStoreRuntime.ts";

export function useMrpContextHeaderView() {
  return useSyncExternalStore(
    subscribeMrpContextStore,
    getMrpContextHeaderView,
    () => getMrpContextStoreServerSnapshot().header
  );
}

export function useMrpContextStoreSnapshot() {
  return useSyncExternalStore(
    subscribeMrpContextStore,
    getMrpContextStoreSnapshot,
    getMrpContextStoreServerSnapshot
  );
}

export default useMrpContextHeaderView;
