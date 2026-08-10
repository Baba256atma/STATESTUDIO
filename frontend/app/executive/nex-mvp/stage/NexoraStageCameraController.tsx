"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { NexoraMVPStageCameraPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage";

type Props = {
  readonly camera: NexoraMVPStageCameraPresentation;
};

/**
 * Guided executive camera — no free orbit in production MVP.
 */
export function NexoraStageCameraController({ camera }: Props) {
  const { camera: threeCamera } = useThree();
  const position = useRef(new Vector3(...camera.position));
  const target = useRef(new Vector3(...camera.target));
  const lookAt = useRef(new Vector3());

  useFrame((_, delta) => {
    const speed = Math.min(1, delta * 3.2);
    position.current.x += (camera.position[0] - position.current.x) * speed;
    position.current.y += (camera.position[1] - position.current.y) * speed;
    position.current.z += (camera.position[2] - position.current.z) * speed;
    target.current.x += (camera.target[0] - target.current.x) * speed;
    target.current.y += (camera.target[1] - target.current.y) * speed;
    target.current.z += (camera.target[2] - target.current.z) * speed;

    threeCamera.position.copy(position.current);
    lookAt.current.copy(target.current);
    threeCamera.lookAt(lookAt.current);
  });

  return null;
}
