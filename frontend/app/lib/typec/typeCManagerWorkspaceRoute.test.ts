import { describe, expect, it } from "vitest";

import { resolveDomainExperience } from "../domain/domainExperienceRegistry";
import {
  TYPE_C_GOVERNANCE_ORG_ID,
  TYPE_C_MANAGER_DOMAIN_ID,
} from "./typeCManagerWorkspaceRoute";

describe("type-c manager workspace route", () => {
  it("resolves manager domain for type-c activation", () => {
    const resolved = resolveDomainExperience(TYPE_C_MANAGER_DOMAIN_ID);
    expect(resolved.experience.domainId).toBe(TYPE_C_MANAGER_DOMAIN_ID);
    expect(resolved.experience.preferredWorkspaceModeId).toBe("manager");
  });

  it("uses dedicated governance org id for type-c route", () => {
    expect(TYPE_C_GOVERNANCE_ORG_ID).toBe("nexora-type-c");
  });
});
