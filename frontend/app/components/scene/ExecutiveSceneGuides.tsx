"use client";

import React, { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

export type ExecutiveSceneGuidesProps = {
  gridSpan: number;
  showGrid: boolean;
  showAxes: boolean;
};

function applySubduedGuideOpacity(material: THREE.Material | THREE.Material[], opacity: number) {
  const materials = Array.isArray(material) ? material : [material];
  materials.forEach((entry) => {
    entry.transparent = true;
    entry.opacity = opacity;
    entry.depthWrite = false;
  });
}

export function ExecutiveSceneGuides(props: ExecutiveSceneGuidesProps): React.ReactElement | null {
  const gridRef = useRef<THREE.GridHelper>(null);
  const axesRef = useRef<THREE.AxesHelper>(null);
  const axisLength = Math.min(1.1, Math.max(0.65, props.gridSpan * 0.08));
  const divisions = Math.max(8, Math.min(24, Math.floor(props.gridSpan / 2)));

  useLayoutEffect(() => {
    if (gridRef.current) applySubduedGuideOpacity(gridRef.current.material, 0.12);
  }, [props.showGrid, props.gridSpan]);

  useLayoutEffect(() => {
    if (axesRef.current) applySubduedGuideOpacity(axesRef.current.material, 0.22);
  }, [props.showAxes, axisLength]);

  if (!props.showGrid && !props.showAxes) return null;

  return (
    <group>
      {props.showGrid ? <gridHelper ref={gridRef} args={[props.gridSpan, divisions]} /> : null}
      {props.showAxes ? <axesHelper ref={axesRef} args={[axisLength]} /> : null}
    </group>
  );
}

export default ExecutiveSceneGuides;
