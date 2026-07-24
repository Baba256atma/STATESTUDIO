/** WS-2:1 — Declarative Executive Home architectural contracts. */
import type { ExecutiveHomeContract } from "./executiveHomeWorkspaceFoundationTypes.ts";

const definitions = Object.freeze([
  ["ExecutiveHomeWorkspace", "Executive Home Workspace", "Declares the canonical executive entry Workspace.", ["identity", "context", "configuration"]],
  ["Identity", "Executive Home Identity", "Declares canonical Executive Home identity metadata.", ["id", "name", "version"]],
  ["Metadata", "Executive Home Metadata", "Declares descriptive Executive Home metadata.", ["description", "owner", "tags"]],
  ["Context", "Executive Home Context", "Declares an executive context reference.", ["contextReference"]],
  ["SummaryReference", "Executive Home Summary Reference", "Declares an executive summary reference.", ["summaryReference"]],
  ["DashboardReference", "Executive Home Dashboard Reference", "Declares a dashboard reference without rendering.", ["dashboardReference"]],
  ["WorkspaceLauncher", "Executive Home Workspace Launcher", "Declares launch-target metadata without navigation.", ["workspaceReferences"]],
  ["RecentActivityReference", "Executive Home Recent Activity Reference", "Declares a recent-activity reference.", ["activityReference"]],
  ["NotificationReference", "Executive Home Notification Reference", "Declares notification metadata without delivery.", ["notificationReference"]],
  ["RecommendationReference", "Executive Home Recommendation Reference", "Declares recommendation metadata without reasoning.", ["recommendationReference"]],
  ["FavoriteWorkspaceReference", "Executive Home Favorite Workspace Reference", "Declares favorite Workspace references.", ["workspaceReferences"]],
  ["QuickActionSurface", "Executive Home Quick Action Surface", "Declares quick-action metadata without handlers.", ["actionReferences"]],
  ["ExecutiveCardCollection", "Executive Home Executive Card Collection", "Declares executive card references without widgets.", ["cardReferences"]],
  ["LayoutReference", "Executive Home Layout Reference", "Declares layout metadata without UI.", ["layoutReference"]],
  ["SessionReference", "Executive Home Session Reference", "Declares an Executive Home session reference.", ["sessionReference"]],
  ["Configuration", "Executive Home Configuration", "Declares immutable configuration metadata.", ["configurationId", "version"]],
  ["PermissionReference", "Executive Home Permission Reference", "Declares permission-awareness metadata.", ["permissionReferences"]],
] as const);

export const ExecutiveHomeWorkspaceContracts = Object.freeze(definitions.map(
  ([key, name, description, requiredMetadata]) => Object.freeze({
    id: `WS-2:1/Contract/${key}`, name, description,
    requiredMetadata: Object.freeze(requiredMetadata), executable: false,
    metadataOnly: true, immutable: true,
  }),
) satisfies readonly ExecutiveHomeContract[]);

