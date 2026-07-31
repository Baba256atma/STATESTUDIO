import { notFound } from "next/navigation";

import { ExecutiveJournalSyntheticHarness } from "@/app/lib/ex/ExecutiveJournalSyntheticHarness";
import {
  ExecutiveJournalPreviewRouteFlagName,
  resolveExecutiveJournalPreviewRouteAccess,
} from "./executiveJournalPreviewRouteAccess";

export default function ExecutiveJournalPreviewPage() {
  const access = resolveExecutiveJournalPreviewRouteAccess(
    process.env.NODE_ENV,
    process.env[ExecutiveJournalPreviewRouteFlagName],
  );

  if (access.result !== "Allowed") {
    notFound();
  }

  return (
    <div data-ex2-tier0-route="local-development-only">
      <ExecutiveJournalSyntheticHarness />
    </div>
  );
}
