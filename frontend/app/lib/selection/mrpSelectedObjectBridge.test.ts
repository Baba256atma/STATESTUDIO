import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMrpSelectedObjectContext,
  shouldPublishMrpSelectedObjectContext,
} from "./mrpSelectedObjectBridgeContract.ts";

test("buildMrpSelectedObjectContext prefers object name", () => {
  assert.deepEqual(
    buildMrpSelectedObjectContext({ objectId: "draft_expenses_2", objectName: "Expenses" }),
    {
      selectedObjectId: "draft_expenses_2",
      selectedObjectLabel: "Expenses",
    }
  );
});

test("shouldPublishMrpSelectedObjectContext skips same object on sources context", () => {
  assert.equal(
    shouldPublishMrpSelectedObjectContext({
      previousSelectedObjectId: "draft_expenses_2",
      nextObjectId: "draft_expenses_2",
      priorDashboardContext: "sources",
    }),
    false
  );
  assert.equal(
    shouldPublishMrpSelectedObjectContext({
      previousSelectedObjectId: "draft_expenses_1",
      nextObjectId: "draft_expenses_2",
      priorDashboardContext: "sources",
    }),
    true
  );
});
