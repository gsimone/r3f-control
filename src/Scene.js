import * as THREE from "three";
import React, { useMemo } from "react";
import { Extrude, OrbitControls } from "drei";
import { useControl } from "react-three-gui";
import { useSprings } from "@react-spring/core";
import { a } from "@react-spring/three";

import Lights from "./lights";
import Floaters from "./Floaters";

function Frame({ rot, depth = 0.3, color = "#333", ...props }) {
  const shape = useMemo(() => {
    //Create a frame shape..
    var frame = new THREE.Shape();
    frame.moveTo(-12, -14);
    frame.lineTo(12, -14);
    frame.lineTo(12, 14);
    frame.lineTo(-12, 14);

    //..with a hole:
    var hole = new THREE.Path();
    hole.moveTo(-5, -2);
    hole.lineTo(5, -2);
    hole.lineTo(5, 2);
    hole.lineTo(-5, 2);
    frame.holes.push(hole);

    return frame;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      steps: 1,
      depth,
      bevelEnabled: false,
    }),
    [depth]
  );

  return (
    <a.group {...props} rotation-z={rot}>
      <Extrude castShadow receiveShadow args={[shape, extrudeSettings]}>
        <meshStandardMaterial
          color="#999"
          roughness={0.7}
          shadowSide={THREE.FrontSide}
        />
      </Extrude>
    </a.group>
  );
}

function Frames() {
  const [springs] = useSprings(40, (i) => ({
    from: { theta: 0 },
    to: async (next) => {
      while (1) {
        await next({ theta: -Math.PI / 2 - 0.004 * (i * i) - i * 0.06 });
        await next({ theta: 0 });
      }
    },
    config: {
      mass: 100,
      tension: 400,
      friction: 400,
    },
    delay:
      1000 + 0.01 * (i < 0.5 ? 4 * i * i * i : 1 - Math.pow(-2 * i + 2, 3) / 2),
  }));

  return springs.map((spring, i) => {
    const { theta } = spring;

    return (
      <Frame
        key={i}
        depth={0.5}
        scale={[0.6, 1, 1]}
        position={[0, 0, 3 - (40 - i) * 0.5]}
        rot={theta}
      />
    );
  });
}

function Scene() {
  const orbitControls = useControl("Orbit Controls", {
    type: "boolean",
    value: true,
  });
  return (
    <>
      <Lights />
      <Frames />
      <Floaters />
      {orbitControls && <OrbitControls />}
    </>
  );
}

export default Scene;
