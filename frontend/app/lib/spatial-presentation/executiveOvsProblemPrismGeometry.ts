/**
 * NPA-T OVS-PROBLEM-FORM:1 — constrained trapezoidal prism.
 *
 * Single-body Problem geometry. Not a cube, diamond, or warning icon.
 * Consumed by the existing OVS body renderer.
 */

import { BufferAttribute, BufferGeometry } from "three";

export const executiveOvsProblemPrismGeometryIdentity =
  "NPA-T OVS-PROBLEM-FORM:1/ConstrainedTrapezoidalPrism" as const;

export const EXECUTIVE_OVS_PROBLEM_PRISM = Object.freeze({
  /** Top face narrower than the base — compression / constraint. */
  topWidthFactor: 0.56,
  /** Slight left inset so the left wall is not a second slope. */
  topLeftInsetFactor: 0.05,
  vertexCount: 36,
  triangleCount: 12,
  onePrimaryBody: true as const,
});

function pushTri(
  positions: number[],
  normals: number[],
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  cx: number,
  cy: number,
  cz: number,
): void {
  const ux = bx - ax;
  const uy = by - ay;
  const uz = bz - az;
  const vx = cx - ax;
  const vy = cy - ay;
  const vz = cz - az;
  let nx = uy * vz - uz * vy;
  let ny = uz * vx - ux * vz;
  let nz = ux * vy - uy * vx;
  const length = Math.hypot(nx, ny, nz) || 1;
  nx /= length;
  ny /= length;
  nz /= length;
  positions.push(ax, ay, az, bx, by, bz, cx, cy, cz);
  normals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
}

function pushQuad(
  positions: number[],
  normals: number[],
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  c: readonly [number, number, number],
  d: readonly [number, number, number],
): void {
  pushTri(
    positions,
    normals,
    a[0],
    a[1],
    a[2],
    b[0],
    b[1],
    b[2],
    c[0],
    c[1],
    c[2],
  );
  pushTri(
    positions,
    normals,
    a[0],
    a[1],
    a[2],
    c[0],
    c[1],
    c[2],
    d[0],
    d[1],
    d[2],
  );
}

export function createExecutiveOvsProblemPrismGeometry(
  width: number,
  height: number,
  depth: number,
): BufferGeometry {
  const w = Math.max(0.08, width);
  const h = Math.max(0.08, height);
  const d = Math.max(0.08, depth);
  const hw = w * 0.5;
  const hh = h * 0.5;
  const hd = d * 0.5;
  const topLeftX = -hw + w * EXECUTIVE_OVS_PROBLEM_PRISM.topLeftInsetFactor;
  const topRightX = topLeftX + w * EXECUTIVE_OVS_PROBLEM_PRISM.topWidthFactor;

  const blf: [number, number, number] = [-hw, -hh, hd];
  const brf: [number, number, number] = [hw, -hh, hd];
  const trf: [number, number, number] = [topRightX, hh, hd];
  const tlf: [number, number, number] = [topLeftX, hh, hd];
  const blb: [number, number, number] = [-hw, -hh, -hd];
  const brb: [number, number, number] = [hw, -hh, -hd];
  const trb: [number, number, number] = [topRightX, hh, -hd];
  const tlb: [number, number, number] = [topLeftX, hh, -hd];

  const positions: number[] = [];
  const normals: number[] = [];
  pushQuad(positions, normals, blf, brf, trf, tlf);
  pushQuad(positions, normals, brb, blb, tlb, trb);
  pushQuad(positions, normals, blb, brb, brf, blf);
  pushQuad(positions, normals, tlf, trf, trb, tlb);
  pushQuad(positions, normals, blb, blf, tlf, tlb);
  pushQuad(positions, normals, brf, brb, trb, trf);

  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.setAttribute(
    "normal",
    new BufferAttribute(new Float32Array(normals), 3),
  );
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

export function measureExecutiveOvsProblemPrism(
  width: number,
  height: number,
  depth: number,
): Readonly<{
  readonly bottomWidth: number;
  readonly topWidth: number;
  readonly topLeftX: number;
  readonly topRightX: number;
  readonly isTrapezoid: boolean;
  readonly isBox: boolean;
  readonly isDiamond: boolean;
}> {
  const w = Math.max(0.08, width);
  const hw = w * 0.5;
  const topLeftX = -hw + w * EXECUTIVE_OVS_PROBLEM_PRISM.topLeftInsetFactor;
  const topRightX = topLeftX + w * EXECUTIVE_OVS_PROBLEM_PRISM.topWidthFactor;
  const topWidth = topRightX - topLeftX;
  return Object.freeze({
    bottomWidth: w,
    topWidth,
    topLeftX,
    topRightX,
    isTrapezoid: topWidth < w * 0.72 && topRightX < hw - w * 0.08,
    isBox: false,
    isDiamond: false,
  });
}
