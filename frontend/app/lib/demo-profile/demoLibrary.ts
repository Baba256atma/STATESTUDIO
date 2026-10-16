/**
 * DEMO-MVP:4 — Public Demo Library presentation.
 *
 * Titles and descriptions only. Profile identity, package loading, and reset
 * stay with the certified Demo Profile and Reset owners.
 */
import {
  MANUFACTURING_DEMO_PROFILE_ID,
  PROJECT_DEMO_PROFILE_ID,
  isDemoProfileId,
  type DemoProfileId,
} from "./demoProfileContract.ts";
import {
  openManufacturingDemo,
  openProjectDemo,
  type OpenDemoProfileResult,
} from "./demoProfileStore.ts";

export const demoLibraryIdentity = "DEMO-MVP:4/DemoLibrary" as const;

export const DEMO_LIBRARY_EXPLANATION =
  "Demo data is provided by Nexora. You can explore and experiment freely, then reset the demo at any time.";

export type DemoLibraryItem = Readonly<{
  id: DemoProfileId;
  title: string;
  description: string;
  category: string;
  sourceCount: number;
  availability: "available";
}>;

export const DEMO_LIBRARY_ITEMS: readonly DemoLibraryItem[] = Object.freeze([
  Object.freeze({
    id: MANUFACTURING_DEMO_PROFILE_ID,
    title: "Manufacturing",
    description: "Explore rising demand, limited capacity, and inventory pressure.",
    category: "Operations",
    sourceCount: 3,
    availability: "available" as const,
  }),
  Object.freeze({
    id: PROJECT_DEMO_PROFILE_ID,
    title: "Project Management",
    description: "Explore schedule pressure, resource load, and a growing progress gap.",
    category: "Project",
    sourceCount: 3,
    availability: "available" as const,
  }),
]);

export type DemoLibraryProjection = Readonly<{
  identity: typeof demoLibraryIdentity;
  explanation: string;
  items: readonly (DemoLibraryItem & Readonly<{ active: boolean }>)[];
  resetOffered: boolean;
  saveOffered: false;
}>;

/** Active means the certified profile is live, not merely stored. */
export function projectDemoLibrary(activeProfile: DemoProfileId | null): DemoLibraryProjection {
  const activeId = isDemoProfileId(activeProfile) ? activeProfile : null;
  return Object.freeze({
    identity: demoLibraryIdentity,
    explanation: DEMO_LIBRARY_EXPLANATION,
    items: Object.freeze(
      DEMO_LIBRARY_ITEMS.map((item) =>
        Object.freeze({
          ...item,
          active: item.id === activeId,
        }),
      ),
    ),
    resetOffered: activeId !== null,
    saveOffered: false as const,
  });
}

/** Opens a library card through the certified profile entry. Unknown ids do nothing. */
export function openDemoLibraryItem(id: unknown): OpenDemoProfileResult | null {
  if (id === MANUFACTURING_DEMO_PROFILE_ID) return openManufacturingDemo();
  if (id === PROJECT_DEMO_PROFILE_ID) return openProjectDemo();
  return null;
}

const focusListeners = new Set<() => void>();
let libraryFocus = 0;

/** Asks the workspace control to show Try Nexora. Does not load demo data. */
export function requestDemoLibraryFocus(): number {
  libraryFocus += 1;
  focusListeners.forEach((listener) => listener());
  return libraryFocus;
}

export function readDemoLibraryFocus(): number {
  return libraryFocus;
}

export function subscribeDemoLibraryFocus(listener: () => void): () => void {
  focusListeners.add(listener);
  return () => focusListeners.delete(listener);
}

export function resetDemoLibraryFocusForTests(): void {
  libraryFocus = 0;
}
