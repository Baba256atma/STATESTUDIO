import { describe, expect, it, beforeEach } from "vitest";
import * as THREE from "three";
import {
  buildObjectClickEventId,
  clearPointerSelectionGateForTests,
  isNearestSelectableObjectHit,
  resolveSelectableObjectIdFromObject3D,
  shouldBlockPointerMissAfterObjectClick,
  tryAcceptPointerObjectSelection,
} from "./nexoraObjectClickTransaction";

describe("nexoraObjectClickTransaction", () => {
  beforeEach(() => {
    clearPointerSelectionGateForTests();
  });

  it("builds stable click event ids from pointer metadata", () => {
    expect(buildObjectClickEventId({ pointerId: 2, timeStamp: 1200 })).toBe("2:1200");
  });

  it("resolves selectable object ids from ancestor userData", () => {
    const group = new THREE.Group();
    group.userData.objectId = "obj-a";
    const mesh = new THREE.Mesh();
    group.add(mesh);
    expect(resolveSelectableObjectIdFromObject3D(mesh)).toBe("obj-a");
  });

  it("accepts only the nearest selectable object for a raycast gesture", () => {
    const groupA = new THREE.Group();
    groupA.userData.objectId = "obj-a";
    const meshA = new THREE.Mesh();
    groupA.add(meshA);

    const groupB = new THREE.Group();
    groupB.userData.objectId = "obj-b";
    const meshB = new THREE.Mesh();
    groupB.add(meshB);

    const eventForA = {
      object: meshA,
      intersections: [
        { object: meshA, distance: 1 },
        { object: meshB, distance: 2 },
      ],
    };
    const eventForB = {
      object: meshB,
      intersections: [
        { object: meshA, distance: 1 },
        { object: meshB, distance: 2 },
      ],
    };

    expect(isNearestSelectableObjectHit(eventForA, "obj-a")).toBe(true);
    expect(isNearestSelectableObjectHit(eventForB, "obj-b")).toBe(false);
  });

  it("rejects hits without raycast intersection proof", () => {
    expect(isNearestSelectableObjectHit({ object: new THREE.Mesh(), intersections: [] }, "obj-a")).toBe(
      false
    );
  });

  it("accepts only the first object id for one pointer gesture", () => {
    const event = { pointerId: 3, timeStamp: 4400 };
    expect(tryAcceptPointerObjectSelection("obj-a", event)).toEqual({
      accepted: true,
      clickEventId: "3:4400",
    });
    expect(tryAcceptPointerObjectSelection("obj-b", event)).toEqual({
      accepted: false,
      reason: "multi_hit_blocked",
      clickEventId: "3:4400",
    });
  });

  it("blocks pointer miss shortly after an accepted object click", () => {
    tryAcceptPointerObjectSelection("obj-a", { pointerId: 1, timeStamp: 100 });
    expect(shouldBlockPointerMissAfterObjectClick()).toBe(true);
  });
});
