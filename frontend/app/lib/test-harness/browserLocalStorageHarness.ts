/**
 * TEST-ONLY: minimal browser `window.localStorage` harness for Node test runners.
 *
 * Installs a Storage-compatible surface on `globalThis.window` via property
 * descriptors when `window` is undefined. Never import from production modules.
 */

export type BrowserLocalStorageHarnessOptions = Readonly<{
  /** When `window` already exists, clear `localStorage` if available. Defaults to true. */
  clearIfPresent?: boolean;
  /** Include minimal EventTarget stubs used by a few UI contract tests. Defaults to false. */
  includeEventDispatch?: boolean;
}>;

type HarnessStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string | null;
  readonly length: number;
};

type HarnessWindowSurface = {
  localStorage: HarnessStorage;
  dispatchEvent?: (event: Event) => boolean;
  addEventListener?: (
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ) => void;
  removeEventListener?: (
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions,
  ) => void;
};

function createHarnessStorage(): HarnessStorage {
  const store = new Map<string, string>();
  return {
    getItem(key: string): string | null {
      return store.has(key) ? (store.get(key) ?? null) : null;
    },
    setItem(key: string, value: string): void {
      store.set(key, String(value));
    },
    removeItem(key: string): void {
      store.delete(key);
    },
    clear(): void {
      store.clear();
    },
    key(index: number): string | null {
      return [...store.keys()][index] ?? null;
    },
    get length(): number {
      return store.size;
    },
  };
}

function createHarnessWindow(includeEventDispatch: boolean): HarnessWindowSurface {
  const surface: HarnessWindowSurface = {
    localStorage: createHarnessStorage(),
  };
  if (includeEventDispatch) {
    surface.dispatchEvent = () => true;
    surface.addEventListener = () => {};
    surface.removeEventListener = () => {};
  }
  return surface;
}

/**
 * Ensures `globalThis.window.localStorage` exists for tests.
 * Returns a restore function that reinstates the prior `window` descriptor.
 */
export function ensureBrowserLocalStorageHarness(
  options: BrowserLocalStorageHarnessOptions = {},
): () => void {
  const clearIfPresent = options.clearIfPresent ?? true;
  const includeEventDispatch = options.includeEventDispatch ?? false;
  const existingDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

  if (typeof globalThis.window !== "undefined") {
    if (clearIfPresent) {
      globalThis.window.localStorage?.clear();
    }
    return () => {
      /* window was already present; nothing to restore */
    };
  }

  const harnessWindow = createHarnessWindow(includeEventDispatch);

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: harnessWindow,
  });

  return () => {
    if (existingDescriptor !== undefined) {
      Object.defineProperty(globalThis, "window", existingDescriptor);
      return;
    }
    Reflect.deleteProperty(globalThis, "window");
  };
}
