const extensionNames = Object.freeze([
  "Workspace extensions", "Dashboard extensions", "Widget extensions", "Panel extensions",
  "Layout extensions", "Zone extensions", "Navigation extensions", "Filter extensions",
  "Context extensions", "Output extensions", "Export extensions",
  "Accessibility extensions", "Executive profile extensions",
  "Responsive profile extensions", "Theme extensions", "Localization extensions",
  "Integration extensions", "Future visualization extensions",
] as const);

export const DashboardExecutiveWorkspaceVisualizationExtensionClassifications =
  Object.freeze(extensionNames.map((name, index) => Object.freeze({
    id: `EVE-6:2/Extension/${index + 1}` as const,
    name,
    description: `Declarative extension classification for ${name.toLowerCase()}.`,
    deterministicOrder: index + 1,
    runtimeLoading: false,
    runtimeRegistration: false,
    metadataOnly: true,
    immutable: true,
  })));
