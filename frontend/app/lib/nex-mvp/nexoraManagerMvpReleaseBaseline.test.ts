import assert from "node:assert/strict";
import test from "node:test";

import { nexoraExecutiveShellVersion } from "./nexoraExecutiveShell.ts";
import {
  getNexoraManagerMvpReleaseBaselineIdentity,
  nexoraManagerMvpReleaseBaselineIdentity,
  nexoraManagerMvpReleaseBaselineNamespace,
} from "./nexoraManagerMvpReleaseBaseline.ts";

test("MVP:1 baseline identity uses canonical product version 1.2.0", () => {
  const identity = getNexoraManagerMvpReleaseBaselineIdentity();
  assert.equal(
    nexoraManagerMvpReleaseBaselineIdentity,
    "MVP:1/NexoraManagerMVPReleaseBaseline",
  );
  assert.equal(identity.version, "1.2.0");
  assert.equal(identity.version, nexoraExecutiveShellVersion);
  assert.equal(
    nexoraManagerMvpReleaseBaselineNamespace,
    "nexora.mvp.manager-release-baseline",
  );
  assert.equal(identity.canonicalRoute, "/executive");
});
