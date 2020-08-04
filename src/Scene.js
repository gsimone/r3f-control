import * as THREE from 'three'
import React, { useEffect, useMemo, useRef } from "react";
import { Icosahedron, Box, Extrude, useTextureLoader, useCubeTextureLoader } from "drei";

import vert from "./shaders/default.vert";
import frag from "./shaders/default.frag";
import { useFrame } from "react-three-fiber";
import Lights from "./lights";
import { Vector2 } from 'three';
import { useControl } from 'react-three-gui';


function Frame({ depth = .3, color = "#333", ...props}) {
  const shape = useMemo(() => {
    //Create a frame shape..
    var frame = new THREE.Shape();
    frame.moveTo(-12, -14);
    frame.lineTo( 12, -14);
    frame.lineTo( 12,  14);
    frame.lineTo(-12,  14);

    //..with a hole:
    var hole = new THREE.Path();
    hole.moveTo(-5, -2);
    hole.lineTo( 5, -2);
    hole.lineTo( 5,  2);
    hole.lineTo(-5,  2);
    frame.holes.push(hole);

    return frame
  }, [])

  const extrudeSettings = useMemo(
    () => ({
      steps: 1,
      depth,
      bevelEnabled: false,
    }),
    [depth]
  )

  return (
      <Extrude castShadow receiveShadow args={[shape, extrudeSettings]} {...props}>
        {/* <meshPhysicalMaterial reflectivity={1} attach="material" color={color }  /> */}
        <meshPhysicalMaterial 
          color="#000"
          reflectivity={.1}
          roughness={.9} 
        />
      </Extrude>
  )
}

function Floater(props) {
  const $ref = useRef()
  useFrame(() => {
    $ref.current.rotation.x += .01
    $ref.current.rotation.y += .002
    $ref.current.rotation.z += .003
  })

  const bump = useTextureLoader('./bump.jpg')
  const envMap = useCubeTextureLoader(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'], { path: '/cube/' })
  
  return (
    <Box {...props} ref={$ref} castShadow>
      <meshStandardMaterial color="#333" reflectivity={1} roughness={0.7} envMap={envMap} />
    </Box>
  )
}

function Scene() {
  const theta = useControl('rot angle', { type:"number", value: 40, min: 0, max: 1000 })
  
  return (
    <>
      <Lights />
      
      <Frame position={[0, 0, 0]} depth={14} position={[0, .3, -10]}  scale={[.53, 1, 1]} />
      
      {[...(new Array(40).fill())].map((_, i) => {

        const _i = i + 6
        const j = i

        return (<Frame 
          key={i} 
          depth={0.3} 
          scale={[.5, 1, 3]} 
          position={[0, -i * 0.01, - i * 0.6]} 
          rotation-z={-(theta / 10000) * -(_i*_i)} 
        />)})}

      <Floater scale={[.3,.3,.3]}  position={[-1, 1, -4]}  args={[1, 2, 1]} rotation-x={2} rotation-y={.3} rotation-z={.5} />
      <Floater scale={[0.6, 0.6, 0.6]}  position={[.8, 0, -6]}  args={[1, 2, 1]} rotation-x={.5} rotation-y={.3} rotation-z={.5} />
      <Floater args={[.5, 1, .5]} position={[-1.5, .1, -6]} rotation={[-2, 3, 1]} />
      <Floater args={[.5, 1, .5]} position={[0, 1, -2]} rotation={[-2, 3, 1]} />
      <Floater args={[.5, 1, .5]} position={[0, -1, -4]} rotation={[-2, 3, 1]} />

    </>
  );
}

export default Scene;
