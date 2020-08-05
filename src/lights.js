import React, { useRef } from "react";

function Lights() {
  const $dirLight = useRef();
  const $backLight = useRef();

  return (
    <>
      <spotLight
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        distance={9}
        angle={0.4}
        penumbra={0.3}
        castShadow
        ref={$dirLight}
        color="#ff0000"
        position={[0, 0, -10]}
      />

      <pointLight color="#ff0000" position={[0, 1, -10]} intensity={0.3} />

      <spotLight
        ref={$backLight}
        position={[0, 1, 3]}
        intensity={0.4}
        distance={4}
        color="blue"
      />

      <directionalLight position={[0, 0, 0]} intensity={0.1} />
    </>
  );
}

export default Lights;
