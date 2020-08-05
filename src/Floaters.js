import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plane, useCubeTextureLoader } from "drei";
import { a } from "@react-spring/three";
import { Physics, useBox, usePlane } from "use-cannon";

function FloaterMaterial({ hovered = false }) {
  const envMap = useCubeTextureLoader(
    ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
    { path: "/cube/" }
  );

  return (
    <meshStandardMaterial
      color={hovered ? 0xff0000 : 0x333333}
      reflectivity={1}
      roughness={0.7}
      envMap={envMap}
    />
  );
}

function Floater({ position, rotation, ...props }) {
  const [hovered, setHover] = useState(false);

  const [ref, api] = useBox(() => ({
    mass: 1,
    size: [0.5, 1, 0.5],
    position,
    rotation,
    onCollide: (e) => {
      const yAxis = e.contact.ni[1];
      api.velocity.set(0, -yAxis * 2, 0);
    },
  }));

  useEffect(() => {
    api.velocity.set(
      4 * Math.random() * (Math.random() > 0.5 ? 1 : -1),
      4 * Math.random() * (Math.random() > 0.5 ? 1 : -1),
      0
    );
  }, [api]);

  const handleClick = useCallback(
    function handleClick() {
      api.applyImpulse([0, 0, -100], [0, 0, 0]);
    },
    [api]
  );

  // const ctrlRef = useRef(props.controlled)

  // useFrame(({ clock, mouse, viewport }) => {
  //   if (ctrlRef.current) {
  //     api.position.set(
  //       (mouse.x * viewport.width) / 2,
  //       (mouse.y * viewport.height) / 2,
  //       0
  //     )
  //   }
  // })

  // useEffect(() => {
  //   const x = new THREE.Vector3().random()
  //   api.angularVelocity.set(x.x,x.y,x.z)
  // }, [api])

  // const launch = useCallback(() => {
  //     ctrlRef.current = false
  //     api.applyImpulse([0, 0, -2], [0, 0, 0])
  // }, [api])

  // useEffect(() => {
  //   if (props.controlled) {
  //     window.addEventListener('mousedown', launch)
  //   }

  //   return () => {
  //     window.removeEventListener("mousedown", launch)
  //   }
  // })

  return (
    <>
      <a.mesh
        {...props}
        castShadow
        receiveShadow
        ref={ref}
        onClick={handleClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxBufferGeometry args={[0.5, 1, 0.5]} />
        <FloaterMaterial hovered={hovered} />
      </a.mesh>
    </>
  );
}

function PhyPlane({ color, ...props }) {
  const [ref] = usePlane(() => ({ ...props, args: [1000, 1000] }));

  return <mesh ref={ref} />;
}

function Floaters() {
  const floaters = useMemo(() => {
    return [
      { position: [0, 0, 0], rotation: [2, 0.3, 0.5] },
      { position: [-1, 1, -4], rotation: [2, 0.3, 0.5] },
      { position: [0.8, 0, -6], rotation: [0.5, 0.3, 0.5] },
      { position: [-1.5, 0.1, -6], rotation: [-1, 3, 1] },
      { position: [0, 1, -2], rotation: [-3, 3, 1] },
      { position: [0, -1, -4], rotation: [-2, 3, 1] },
      { position: [1.2, 0.1, -0.5], rotation: [1, 2, 4] },
      { position: [-1.2, 0, 1], rotation: [13, 4, 1] },
    ];
  }, []);

  return (
    <>
      <Physics
        gravity={[0, 0, 0]}
        tolerance={0.001}
        defaultContactMaterial={{
          friction: 1,
          restitution: 0.5,
          angularDamping: 2,
        }}
      >
        <PhyPlane
          color="red"
          position={[-2, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <PhyPlane
          color="green"
          position={[2, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
        <PhyPlane
          color="yellow"
          position={[0, 2, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <PhyPlane
          color="blue"
          position={[0, -2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        {floaters.map((floater, i) => (
          <Floater key={i} {...floater} />
        ))}
      </Physics>
    </>
  );
}

export default Floaters;
