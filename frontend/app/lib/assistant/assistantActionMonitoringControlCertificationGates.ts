/** ASSISTANT-9:7 — Exactly 16 immutable certification gates. */
import { AssistantActionMonitoringControlPlatform } from "./assistantActionMonitoringControlPlatform.ts";
import { AssistantActionMonitoringControlCertificationCriteria } from "./assistantActionMonitoringControlCertificationCriteria.ts";

const gates = Object.freeze([
  ["Foundation Gate", "Gate confirming Foundation integrity certification."],
  ["Registry Gate", "Gate confirming Registry integrity certification."],
  ["Model Gate", "Gate confirming Model integrity certification."],
  ["Validation Gate", "Gate confirming Validation integrity certification."],
  ["Manifest Gate", "Gate confirming Manifest integrity certification."],
  ["Platform Gate", "Gate confirming Platform aggregate certification."],
  ["Identity Gate", "Gate confirming canonical identity certification."],
  ["Relationship Gate", "Gate confirming relationship consistency certification."],
  ["Metadata Gate", "Gate confirming metadata completeness certification."],
  ["Inventory Gate", "Gate confirming inventory consistency certification."],
  ["Compatibility Gate", "Gate confirming compatibility certification."],
  ["Architecture Gate", "Gate confirming architectural compliance certification."],
  ["Runtime Boundary Gate", "Gate confirming runtime exclusion certification."],
  ["Quality Gate", "Gate confirming TypeScript and ESLint compliance certification."],
  ["Freeze Gate", "Gate confirming Freeze readiness certification."],
  ["Release Gate", "Gate confirming release readiness certification."],
] as const);

export const AssistantActionMonitoringControlCertificationGates =
  Object.freeze(
    gates.map(([canonicalName, description], index) => {
      const criterion =
        AssistantActionMonitoringControlCertificationCriteria[
          Math.min(
            index,
            AssistantActionMonitoringControlCertificationCriteria.length - 1,
          )
        ];
      return Object.freeze({
        id: `ASSISTANT-9:7/Gate/${String(index + 1).padStart(2, "0")}`,
        certificationId:
          `ASSISTANT-9:7/Gate/${String(index + 1).padStart(2, "0")}`,
        canonicalName,
        description,
        criterionReference: criterion.id,
        gateReference:
          `ASSISTANT-9:7/Gate/${String(index + 1).padStart(2, "0")}`,
        version: "1.0.0",
        status: "Certified",
        readiness: "ReadyForFreeze",
        declaredState: "Passed",
        platformReference:
          AssistantActionMonitoringControlPlatform.identity.id,
        order: index + 1,
        executable: false,
        metadataOnly: true,
        immutable: true,
      });
    }),
  );

export const AssistantActionMonitoringControlCertificationCriteriaWithGates =
  Object.freeze(
    AssistantActionMonitoringControlCertificationCriteria.map(
      (criterion, index) => Object.freeze({
        ...criterion,
        gateReference:
          AssistantActionMonitoringControlCertificationGates[
            Math.min(
              index,
              AssistantActionMonitoringControlCertificationGates.length - 1,
            )
          ].id,
      }),
    ),
  );
